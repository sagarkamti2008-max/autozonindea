import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD_bcjbmeDQFAxfL_xWcxnxsxgwYpECEx8",
  authDomain: "studio-3796571750-e6029.firebaseapp.com",
  projectId: "studio-3796571750-e6029",
  storageBucket: "studio-3796571750-e6029.firebasestorage.app",
  messagingSenderId: "621527730116",
  appId: "1:621527730116:web:61aafd210bacbba8828691"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function runTestOrder() {
  console.log("=== ADDING TEST CUSTOMER ORDER TO FIRESTORE ===");
  const testOrderPayload = {
    orderNumber: `ORD-${Date.now()}`,
    customerDetails: {
      fullName: "Sagar Kamti",
      phone: "+91 8591719499",
      email: "sagarkamti2008@gmail.com",
      address: "Flat 402, AutoZon Tech Park, Connaught Place",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110001"
    },
    items: [
      {
        id: "prod-toyota-glanza-bp",
        title: "Toyota Glanza Brake Pad",
        name: "Toyota Glanza Brake Pad",
        price: 1999,
        quantity: 1,
        image: "/images/brake_disc_rotor.jpg"
      }
    ],
    subtotal: 1999,
    shippingFee: 0,
    grandTotal: 1999,
    paymentMethod: "COD",
    status: "New", // New -> Confirmed -> Processing -> Shipped -> Delivered / Cancelled
    createdAt: new Date().toISOString()
  };

  const docRef = await addDoc(collection(db, "orders"), testOrderPayload);
  console.log("SUCCESS! Created Order Document ID in Firestore:", docRef.id);

  const snapshot = await getDocs(collection(db, "orders"));
  console.log(`Total Orders in Firestore 'orders' collection: ${snapshot.docs.length}`);
}

runTestOrder().catch(console.error);
