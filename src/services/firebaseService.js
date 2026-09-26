// src/services/firebaseService.js
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { db, auth, storage } from '../lib/firebase';

/* ==========================================================================
   1. FIRESTORE PRODUCTS CRUD & REALTIME UPDATES
   ========================================================================== */

/**
 * Fetch all products from Firestore
 */
export async function fetchProductsFromFirestore() {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })).sort((a, b) => {
      const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdAt || 0);
      const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdAt || 0);
      return timeB - timeA;
    });
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    return [];
  }
}

/**
 * Subscribe to Products in Real-time (onSnapshot)
 */
export function subscribeProductsRealtime(onDataChange) {
  try {
    const productsRef = collection(db, 'products');
    return onSnapshot(productsRef, (snapshot) => {
      const products = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })).sort((a, b) => {
        const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdAt || 0);
        const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdAt || 0);
        return timeB - timeA;
      });
      onDataChange(products);
    }, (error) => {
      console.warn('Realtime products listener fallback:', error);
    });
  } catch (error) {
    console.warn('Could not attach realtime products listener:', error);
    return () => {};
  }
}

/**
 * Add a new product to Firestore
 */
export async function addProductToFirestore(productData) {
  try {
    const productsRef = collection(db, 'products');
    const name = productData.name || productData.title || 'New Car Part';
    const sellingPrice = Number(productData.sellingPrice || productData.price || 0);
    const mrp = Number(productData.mrp || sellingPrice || 0);
    const payload = {
      name,
      title: name,
      category: productData.category || 'General',
      categorySlug: productData.categorySlug || 'general',
      mrp,
      sellingPrice,
      price: sellingPrice,
      isActive: productData.isActive !== undefined ? productData.isActive : true,
      inStock: productData.inStock !== undefined ? productData.inStock : true,
      stock: productData.stock !== undefined ? Number(productData.stock) : 10,
      sku: productData.sku || productData.partNumber || `KAMTI-${Math.floor(1000 + Math.random() * 9000)}`,
      partNumber: productData.sku || productData.partNumber || `KAMTI-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: productData.carBrand || productData.brand || 'Kamti Genuine',
      carBrand: productData.carBrand || productData.brand || 'Kamti Genuine',
      carModel: productData.carModel || '',
      variant: productData.variant || '',
      image: productData.image || '/images/engine_parts_main.jpg',
      images: productData.images || [productData.image || '/images/engine_parts_main.jpg'],
      desc: productData.desc || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    const docRef = await addDoc(productsRef, payload);
    return { success: true, id: docRef.id, ...payload };
  } catch (error) {
    console.error('Error adding product to Firestore:', error);
    throw error;
  }
}

/**
 * Update an existing product in Firestore
 */
export async function updateProductInFirestore(productId, productData) {
  try {
    const productRef = doc(db, 'products', productId);
    const name = productData.name || productData.title || 'Car Part';
    const sellingPrice = Number(productData.sellingPrice || productData.price || 0);
    const mrp = Number(productData.mrp || sellingPrice || 0);
    const payload = {
      ...productData,
      name,
      title: name,
      sellingPrice,
      mrp,
      price: sellingPrice,
      updatedAt: serverTimestamp()
    };
    await updateDoc(productRef, payload);
    return { success: true, id: productId };
  } catch (error) {
    console.error('Error updating product in Firestore:', error);
    throw error;
  }
}

/**
 * Toggle Active/Inactive state of a product
 */
export async function toggleProductActiveState(productId, currentActiveState) {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      isActive: !currentActiveState,
      updatedAt: serverTimestamp()
    });
    return { success: true, isActive: !currentActiveState };
  } catch (error) {
    console.error('Error toggling product active state:', error);
    throw error;
  }
}

/**
 * Delete a product from Firestore
 */
export async function deleteProductFromFirestore(productId) {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting product from Firestore:', error);
    throw error;
  }
}

/* ==========================================================================
   2. FIRESTORE ORDERS & REALTIME UPDATES
   ========================================================================== */

/**
 * Save new order to Firestore
 */
export async function saveOrderToFirestore(orderData) {
  try {
    const ordersRef = collection(db, 'orders');
    const orderNumber = orderData.orderNumber || orderData.id || `ORD-${Date.now()}`;
    const shipAddr = orderData.shippingAddress || orderData.addressForm || {};
    const custInfo = orderData.customerInfo || {};
    const itemsList = orderData.items || orderData.cartItems || [];

    const payload = {
      orderNumber,
      customerDetails: {
        fullName: custInfo.fullName || shipAddr.fullName || 'Customer',
        phone: custInfo.phone || shipAddr.phone || '',
        email: custInfo.email || shipAddr.email || '',
        address: shipAddr.addressLine1 || shipAddr.houseNo || shipAddr.address_line || '',
        city: shipAddr.city || '',
        state: shipAddr.state || '',
        pincode: shipAddr.postalCode || shipAddr.pincode || '',
        deliveryPreference: orderData.deliveryPreference || 'home'
      },
      items: itemsList,
      subtotal: Number(orderData.pricing?.subtotal || orderData.totals?.subtotal || orderData.totalAmount || 0),
      shippingFee: Number(orderData.pricing?.shippingFee || orderData.totals?.shippingFee || 0),
      grandTotal: Number(orderData.totalAmount || orderData.totals?.grandTotal || orderData.grandTotal || 0),
      paymentMethod: orderData.paymentInfo?.method || orderData.paymentMethod || 'cod',
      status: orderData.status || 'Placed', // Placed, Confirmed, Processing, Shipped, Delivered, Cancelled
      vehicleDetail: orderData.vehicleDetail || shipAddr.vehicleNote || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    const docRef = await addDoc(ordersRef, payload);
    return { success: true, id: docRef.id, orderNumber };
  } catch (error) {
    console.error('Error saving order to Firestore:', error);
    throw error;
  }
}

/**
 * Subscribe to Orders in Real-time for Admin Console
 */
export function subscribeOrdersRealtime(onDataChange) {
  try {
    const ordersRef = collection(db, 'orders');
    return onSnapshot(ordersRef, (snapshot) => {
      const orders = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })).sort((a, b) => {
        const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdAt || 0);
        const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdAt || 0);
        return timeB - timeA;
      });
      onDataChange(orders);
    }, (error) => {
      console.warn('Realtime orders listener fallback:', error);
    });
  } catch (error) {
    console.warn('Could not attach realtime orders listener:', error);
    return () => {};
  }
}

/**
 * Update Order Status (e.g. Placed -> Shipped -> Delivered)
 */
export async function updateOrderStatusInFirestore(orderId, newStatus) {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating order status in Firestore:', error);
    throw error;
  }
}

/* ==========================================================================
   3. FIREBASE STORAGE PRODUCT PHOTO UPLOADS
   ========================================================================== */

/**
 * Upload a product image to Firebase Storage and get download URL
 */
export async function uploadProductPhotoToStorage(file, onProgress) {
  return new Promise((resolve, reject) => {
    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `products/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.warn('Storage upload error fallback to local preview:', error);
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () => reject(error);
          reader.readAsDataURL(file);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (e) {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          }
        }
      );
    } catch (error) {
      console.warn('Storage ref error fallback:', error);
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject(error);
      reader.readAsDataURL(file);
    }
  });
}

/* ==========================================================================
   4. FIREBASE AUTHENTICATION (ADMIN & CUSTOMER)
   ========================================================================== */

export async function loginAdminWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

export function subscribeAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Save Contact Enquiry message to Firestore
 */
export async function saveContactEnquiryInFirestore(enquiryData) {
  try {
    const enquiriesRef = collection(db, 'enquiries');
    const payload = {
      fullName: enquiryData.fullName || '',
      email: enquiryData.email || '',
      subject: enquiryData.subject || '',
      message: enquiryData.message || '',
      phone: enquiryData.phone || '',
      createdAt: serverTimestamp(),
      status: 'New'
    };
    const docRef = await addDoc(enquiriesRef, payload);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving enquiry to Firestore:', error);
    return { success: false, error };
  }
}

