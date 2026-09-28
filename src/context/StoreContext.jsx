import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import {
  VEHICLE_DATABASE,
  SAMPLE_VIN_DATABASE,
  SAMPLE_REGISTRATION_DATABASE,
  CATEGORIES_DATABASE,
  BRANDS_DATABASE,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_BLOGS,
  INITIAL_FAQS,
  INITIAL_CUSTOMERS,
  INITIAL_ADDRESSES,
  INITIAL_ENQUIRIES,
  INITIAL_QUOTATIONS,
  INITIAL_REVIEWS,
  INITIAL_COUPONS,
  INITIAL_PAYMENTS,
  INITIAL_SHIPPING,
  INITIAL_ADMIN_USERS,
  INITIAL_WEBSITE_SETTINGS
} from '../data/mockData';
import { carsData as mockCars } from '../data/mockCarData';
import { academyModules } from '../data/mockAcademyData';
import {
  getGuestWishlist,
  setGuestWishlist,
  addGuestWishlist,
  removeGuestWishlist,
  getCustomerWishlist,
  addToWishlistDB,
  removeFromWishlistDB,
  mergeGuestWishlistOnLogin
} from '../services/engagementService';
import { checkVehicleProductCompatibility } from '../services/catalogEngine';
import { subscribeProductsRealtime, subscribeOrdersRealtime } from '../services/firebaseService';

const StoreContext = createContext();

const safeGetStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length === 0 && Array.isArray(fallback) && fallback.length > 0) {
      return fallback;
    }
    return parsed;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
};

const safeSetStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing ${key} to localStorage:`, e);
  }
};

export const StoreProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState('customer');
  const [user, setUser] = useState(() => safeGetStorage('autozon_user', null));
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => sessionStorage.getItem('autozon_admin_master_unlocked') === 'true');

  const unlockAdminConsole = () => {
    sessionStorage.setItem('autozon_admin_master_unlocked', 'true');
    setIsAdminUnlocked(true);
    setCurrentRole('admin');
  };

  const lockAdminConsole = () => {
    sessionStorage.removeItem('autozon_admin_master_unlocked');
    setIsAdminUnlocked(false);
    setCurrentRole('customer');
  };

  const getInitialView = () => {
    try {
      const path = window.location.pathname;
      if (path.includes('/search')) return 'search';
      if (path.includes('/parts-for-my-car')) return 'parts-for-my-car';
      if (path.includes('/account/garage')) return 'my-garage';
      if (path.includes('/account/wishlist')) return 'wishlist';
      if (path.includes('/account/reviews/new/')) return 'write-review';
      if (path.includes('/account/reviews')) return 'customer-reviews';
      if (path.includes('/delivery-check')) return 'delivery-check';
      if (path.includes('/track-order')) return 'track-order';
      if (path.includes('/account/orders/') && path.includes('/tracking')) return 'customer-order-tracking';
      if (path.includes('/account/orders/') && path.includes('/invoice')) return 'invoice';
      if (path.includes('admin')) return 'admin';
      if (path.startsWith('/assistant')) return 'ai-assistant';
      if (path.includes('/support/ticket/')) return 'customer-ticket-detail';
      if (path.includes('/account/notifications')) return 'customer-notifications';
      if (path.startsWith('/page/')) return 'public-cms-page';
      if (path.startsWith('/blog/category/')) return 'blog-category';
      if (path.startsWith('/blog/search')) return 'blog-search';
      if (path.startsWith('/blog/')) return 'blog-detail';
      if (path === '/blog') return 'blog-listing';
      if (path === '/faq') return 'public-faq';
      if (path.startsWith('/parts-for/')) return 'vehicle-landing';
      if (path.startsWith('/car-parts/')) return 'category-vehicle-landing';
      if (path.startsWith('/admin/reviews')) return 'admin-reviews';
      if (path.startsWith('/admin/product-questions')) return 'admin-product-questions';
      if (path.startsWith('/admin/search-analytics')) return 'admin-search-analytics';
      if (path.startsWith('/admin/shipping')) return 'admin-shipping';
      if (path.startsWith('/admin/invoices')) return 'admin-invoices';
      if (path.startsWith('/admin/payments')) return 'admin-payments';

      const urlParams = new URLSearchParams(window.location.search);
      const viewParam = urlParams.get('view') || urlParams.get('page') || urlParams.get('tab');
      if (viewParam) return viewParam;
      const hash = window.location.hash.replace('#', '');
      if (hash) return hash;
    } catch(e){}
    return 'home';
  };

  const [currentView, setCurrentView] = useState(getInitialView);
  const [activeProductId, setActiveProductId] = useState(null);
  const [activeOrderId, setActiveOrderId] = useState(null);

  const [products, setProducts] = useState(() => safeGetStorage('autozon_products', []));
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cars] = useState(mockCars);
  const [categories] = useState(CATEGORIES_DATABASE);
  const [academy] = useState(academyModules);
  const [enquiries, setEnquiries] = useState(() => safeGetStorage('autozon_enquiries', []));
  const [quotations, setQuotations] = useState(() => safeGetStorage('autozon_quotations', []));
  const [reviews, setReviews] = useState(() => safeGetStorage('autozon_reviews', []));
  const [coupons, setCoupons] = useState([]);
  const [payments, setPayments] = useState([]);
  const [shippingRecords, setShippingRecords] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [websiteSettings, setWebsiteSettings] = useState([]);

  const [savedGarage, setSavedGarage] = useState(() => safeGetStorage('autozon_garage', [
    { id: 'gar-01', makeId: 'maruti', makeName: 'Maruti Suzuki', modelId: 'swift', modelName: 'Swift', year: '2020-2024', variant: 'ZXi Plus (1.2L K12N DualJet Petrol)', isPrimary: true }
  ]));

  const [selectedVehicle, setSelectedVehicle] = useState(() => safeGetStorage('autozon_selected_vehicle', savedGarage[0] || null));
  // New state for car selection and compatible parts
  const [selectedCar, setSelectedCar] = useState(null);
  const [compatibleParts, setCompatibleParts] = useState([]);
  const [cart, setCart] = useState(() => safeGetStorage('autozon_cart', []));
  // New state for immediate Buy Now flow
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState('addr-1');
  const [shippingAddress, setShippingAddress] = useState(null);

  const [savedForLater, setSavedForLater] = useState(() => safeGetStorage('autozon_saved_later', []));
  const [appliedCouponCode, setAppliedCouponCode] = useState(() => safeGetStorage('autozon_coupon', ''));
  const [savedAddresses, setSavedAddresses] = useState(() => safeGetStorage('autozon_addresses', INITIAL_ADDRESSES));
  const [wishlist, setWishlist] = useState(() => safeGetStorage('autozon_wishlist', []));
  const [compareList, setCompareList] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState(() => safeGetStorage('autozon_recently_viewed', []));
  const [recentSearches, setRecentSearches] = useState(() => safeGetStorage('autozon_recent_searches', []));

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedClassification, setSelectedClassification] = useState('all');
  const [filterFitsVehicle, setFilterFitsVehicle] = useState(false);
  const [priceRange, setPriceRange] = useState(500000);
  const [sortBy, setSortBy] = useState('featured');

  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const buyNow = (product, quantity = 1) => {
    if (!product) return;
    const itemWithId = {
      ...product,
      id: product.id || product.sku || product.oemPartNumber || `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: product.name || product.title || product.product_name || 'Auto Part',
      title: product.title || product.name || product.product_name || 'Auto Part',
      price: typeof product.price === 'number' ? product.price : (parseFloat(product.price) || 0),
      quantity,
      timestamp: Date.now()
    };
    setBuyNowProduct(itemWithId);
    setCart([{ ...itemWithId, quantity }]);
    if (typeof setActiveProductModal === 'function') setActiveProductModal(null);
    if (typeof setIsVehicleModalOpen === 'function') setIsVehicleModalOpen(false);
    if (typeof setIsCheckoutOpen === 'function') setIsCheckoutOpen(false);
    setCurrentView('checkout');
    try {
      window.scrollTo(0, 0);
    } catch (e) {}
    if (showToast) showToast(`⚡ Buy Now: ${itemWithId.name.slice(0, 30)}... Proceeding to Checkout`);
  };

  // Supabase Fetch Initial Data
  useEffect(() => {
    const fetchSupabaseData = async () => {
      try {
        const { data: pData } = await supabase.from('products').select('*');
        if (pData && pData.length > 0) setProducts(pData);
        
        const { data: oData } = await supabase.from('orders').select('*');
        if (oData) setOrders(oData);

        const { data: cData } = await supabase.from('customers').select('*');
        if (cData) setCustomers(cData);

        const { data: coupData } = await supabase.from('coupons').select('*');
        if (coupData) setCoupons(coupData);

        const { data: wsData } = await supabase.from('website_settings').select('*');
        if (wsData) setWebsiteSettings(wsData);
      } catch (err) {
        console.error("Supabase fetch error:", err);
      }
    };
    fetchSupabaseData();
  }, []);

  // Firebase Realtime Synchronization (Admin <-> Customer Storefront Live Sync)
  useEffect(() => {
    const unsubProducts = subscribeProductsRealtime((fireProducts) => {
      const fireList = Array.isArray(fireProducts) ? fireProducts : [];
      setProducts(fireList);
      safeSetStorage('autozon_products', fireList);
    });

    const unsubOrders = subscribeOrdersRealtime((fireOrders) => {
      const fireList = Array.isArray(fireOrders) ? fireOrders : [];
      setOrders(fireList);
    });

    return () => {
      if (unsubProducts) unsubProducts();
      if (unsubOrders) unsubOrders();
    };
  }, []);

  // Auto-merge guest wishlist when customer logs in
  useEffect(() => {
    if (user?.id) {
      mergeGuestWishlistOnLogin(user.id).then(() => {
        getCustomerWishlist(user.id).then(list => setWishlist(list));
      });
    }
  }, [user]);

  // Persistence
  useEffect(() => { try { localStorage.setItem('autozon_user', JSON.stringify(user)); } catch(e){} }, [user]);
  useEffect(() => { try { localStorage.setItem('autozon_products', JSON.stringify(products)); } catch(e){} }, [products]);
  useEffect(() => { try { localStorage.setItem('autozon_orders', JSON.stringify(orders)); } catch(e){} }, [orders]);
  useEffect(() => { try { localStorage.setItem('autozon_customers', JSON.stringify(customers)); } catch(e){} }, [customers]);
  useEffect(() => { try { localStorage.setItem('autozon_enquiries', JSON.stringify(enquiries)); } catch(e){} }, [enquiries]);
  useEffect(() => { try { localStorage.setItem('autozon_quotations', JSON.stringify(quotations)); } catch(e){} }, [quotations]);
  useEffect(() => { try { localStorage.setItem('autozon_reviews', JSON.stringify(reviews)); } catch(e){} }, [reviews]);
  useEffect(() => { try { localStorage.setItem('autozon_coupons_db', JSON.stringify(coupons)); } catch(e){} }, [coupons]);
  useEffect(() => { try { localStorage.setItem('autozon_payments_db', JSON.stringify(payments)); } catch(e){} }, [payments]);
  useEffect(() => { try { localStorage.setItem('autozon_shipping_db', JSON.stringify(shippingRecords)); } catch(e){} }, [shippingRecords]);
  useEffect(() => { try { localStorage.setItem('autozon_admin_users_db', JSON.stringify(adminUsers)); } catch(e){} }, [adminUsers]);
  useEffect(() => { try { localStorage.setItem('autozon_website_settings_db', JSON.stringify(websiteSettings)); } catch(e){} }, [websiteSettings]);
  useEffect(() => { try { localStorage.setItem('autozon_garage', JSON.stringify(savedGarage)); } catch(e){} }, [savedGarage]);
  useEffect(() => { 
    try { localStorage.setItem('autozon_selected_vehicle', JSON.stringify(selectedVehicle)); } catch(e){} 
  }, [selectedVehicle]);
  useEffect(() => { try { localStorage.setItem('autozon_cart', JSON.stringify(cart)); } catch(e){} }, [cart]);
  useEffect(() => { try { localStorage.setItem('autozon_saved_later', JSON.stringify(savedForLater)); } catch(e){} }, [savedForLater]);
  useEffect(() => { try { localStorage.setItem('autozon_coupon', JSON.stringify(appliedCouponCode)); } catch(e){} }, [appliedCouponCode]);
  useEffect(() => { try { localStorage.setItem('autozon_addresses', JSON.stringify(savedAddresses)); } catch(e){} }, [savedAddresses]);
  useEffect(() => { try { localStorage.setItem('autozon_wishlist', JSON.stringify(wishlist)); } catch(e){} }, [wishlist]);
  useEffect(() => { try { localStorage.setItem('autozon_recently_viewed', JSON.stringify(recentlyViewed)); } catch(e){} }, [recentlyViewed]);
  useEffect(() => { try { localStorage.setItem('autozon_recent_searches', JSON.stringify(recentSearches)); } catch(e){} }, [recentSearches]);

  // Supabase update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase.from('orders').update({ order_status: newStatus }).eq('id', orderId);
      if (error) throw error;
      setOrders(orders.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o));
      showToast(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error(err);
      showToast('Failed to update order status', 'error');
    }
  };

  // Supabase update website settings
  const updateWebsiteSetting = async (key, value) => {
    try {
      // First check if it exists
      const existing = websiteSettings.find(s => s.setting_key === key);
      let error;
      if (existing) {
        ({ error } = await supabase.from('website_settings').update({ setting_value: value }).eq('setting_key', key));
      } else {
        ({ error } = await supabase.from('website_settings').insert([{ setting_key: key, setting_value: value }]));
      }
      
      if (error) throw error;

      setWebsiteSettings(prev => {
        if (prev.find(s => s.setting_key === key)) {
          return prev.map(s => s.setting_key === key ? { ...s, setting_value: value } : s);
        }
        return [...prev, { setting_key: key, setting_value: value }];
      });
      showToast(`Setting ${key} updated successfully`);
    } catch (err) {
      console.error(err);
      showToast('Failed to update setting', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  const navigateTo = (viewName, payload = null) => {
    setCurrentView(viewName);
    if (payload) {
      if (typeof payload === 'string' && (viewName === 'brand' || viewName === 'catalog')) {
        setSelectedBrand(payload);
      } else {
        setActiveProductId(payload);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product, quantity = 1, openDrawer = true) => {
    if (!product) return;
    const itemWithId = {
      ...product,
      id: product.id || product.sku || product.oemPartNumber || `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: product.name || product.title || 'Auto Part',
      price: typeof product.price === 'number' ? product.price : (parseFloat(product.price) || 0)
    };
    const isExplicitlyOutOfStock = product.inStock === false || product.stock_status === 'out_of_stock';
    if (isExplicitlyOutOfStock) {
      showToast('Product is currently Out of Stock', 'error');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === itemWithId.id);
      if (existing) {
        return prev.map(item => item.id === itemWithId.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...itemWithId, quantity }];
    });
    showToast(`Added "${(itemWithId.name).slice(0, 30)}..." to Cart! 🛒`);
    if (openDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    showToast('Removed item from Cart', 'info');
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const updateCartQuantity = (id, exactQuantity) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, exactQuantity) };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    setBuyNowProduct(null);
    setAppliedCouponCode('');
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => (item.product_id || item.id || item) === productId);
  };

  const toggleWishlist = (product) => {
    const productId = product.id || product;
    const exists = isInWishlist(productId);

    if (exists) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(product);
    }
  };

  const addToWishlist = async (product) => {
    const productId = product.id || product;
    if (user?.id) {
      await addToWishlistDB(user.id, product);
    } else {
      addGuestWishlist(product);
    }
    setWishlist(prev => {
      if (prev.some(i => (i.product_id || i.id || i) === productId)) return prev;
      return [...prev, product];
    });
    showToast('Added to Wishlist ♥');
  };

  const removeFromWishlist = async (productId) => {
    if (user?.id) {
      await removeFromWishlistDB(user.id, productId);
    } else {
      removeGuestWishlist(productId);
    }
    setWishlist(prev => prev.filter(i => (i.product_id || i.id || i) !== productId));
    showToast('Removed from Wishlist', 'info');
  };

  const moveToSavedForLater = (id) => {
    const itemToSave = cart.find(i => i.id === id);
    if (itemToSave) {
      setCart(prev => prev.filter(i => i.id !== id));
      setSavedForLater(prev => {
        const exists = prev.some(i => i.id === id);
        return exists ? prev : [itemToSave, ...prev];
      });
      showToast(`Saved "${(itemToSave.name || itemToSave.title || '').slice(0, 25)}..." for Later! 📌`);
    }
  };

  const moveToCartFromSaved = (id) => {
    const itemToMove = savedForLater.find(i => i.id === id);
    if (itemToMove) {
      setSavedForLater(prev => prev.filter(i => i.id !== id));
      addToCart(itemToMove, itemToMove.quantity || 1);
    }
  };

  const addSavedAddress = (addressData) => {
    const newAddr = {
      id: `addr-${Date.now()}`,
      ...addressData,
      isDefault: savedAddresses.length === 0
    };
    setSavedAddresses(prev => [newAddr, ...prev]);
    showToast('Shipping Address Saved!');
    return newAddr;
  };

  const addCompletedOrder = (orderRecord) => {
    setOrders(prev => [orderRecord, ...prev]);
  };

  const deductInventoryStock = (productIds = [], cartItems = []) => {
    setProducts(prev => prev.map(p => {
      const itemInCart = cartItems.find(c => c.id === p.id);
      if (itemInCart) {
        const newStock = Math.max(0, (p.stock || 10) - itemInCart.quantity);
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  const addToRecentlyViewed = (product) => {
    if (!product || !product.id) return;
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 10);
    });
  };

  const addRecentSearch = (query) => {
    if (!query || !query.trim()) return;
    const term = query.trim();
    setRecentSearches(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== term.toLowerCase());
      return [term, ...filtered].slice(0, 10);
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const toggleCompare = (product) => {
    setCompareList(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        showToast('Removed from Comparison list', 'info');
        return prev.filter(item => item.id !== product.id);
      } else {
        if (prev.length >= 4) {
          showToast('You can compare maximum 4 products at a time', 'error');
          return prev;
        }
        showToast(`Added to Compare List ⚖️`);
        return [...prev, product];
      }
    });
  };

  const addVehicleToGarage = (vehicleData) => {
    const newVehicle = {
      id: `gar-${Date.now()}`,
      ...vehicleData,
      isPrimary: savedGarage.length === 0
    };
    setSavedGarage(prev => [...prev, newVehicle]);
    setSelectedVehicle(newVehicle);
    showToast(`Saved ${vehicleData.makeName} ${vehicleData.modelName} to My Garage! 🚗`);
  };

  const removeVehicleFromGarage = (id) => {
    setSavedGarage(prev => prev.filter(v => v.id !== id));
    if (selectedVehicle?.id === id) {
      setSelectedVehicle(savedGarage.find(v => v.id !== id) || null);
    }
    showToast('Vehicle removed from garage', 'info');
  };

  const saveProduct = async (productData) => {
    if (!productData) return;
    const prodId = productData.id || `AZ-PROD-${Date.now()}`;
    const newProdObj = {
      id: prodId,
      name: productData.title || productData.name || 'Auto Part',
      title: productData.title || productData.name || 'Auto Part',
      sku: productData.sku || productData.partNumber || `SKU-${Date.now()}`,
      partNumber: productData.partNumber || productData.sku || `SKU-${Date.now()}`,
      brand: productData.brand || 'AutoZon',
      category: productData.category || 'Brake Parts',
      mrp: parseFloat(productData.mrp) || parseFloat(productData.price) * 1.25 || 1000,
      price: parseFloat(productData.price || productData.sellingPrice || productData.sale_price) || 800,
      sale_price: parseFloat(productData.price || productData.sellingPrice || productData.sale_price) || 800,
      stock: parseInt(productData.stock, 10) || 10,
      status: true,
      statusText: productData.statusText || productData.status || 'Published',
      image: productData.image || (Array.isArray(productData.images) && productData.images[0]) || 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=500&q=80',
      images: Array.isArray(productData.images) && productData.images.length > 0 ? productData.images : [productData.image || 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=500&q=80'],
      fitments: productData.fitments || [],
      ...productData
    };

    setProducts(prev => {
      const exists = prev.some(p => String(p.id) === String(prodId));
      let updated;
      if (exists) {
        updated = prev.map(p => String(p.id) === String(prodId) ? newProdObj : p);
      } else {
        updated = [newProdObj, ...prev];
      }
      try { localStorage.setItem('autozon_products', JSON.stringify(updated)); } catch(e){}
      return updated;
    });

    showToast(`🎉 Product "${newProdObj.title}" published live on website!`);

    try {
      await supabase.from('products').upsert([{
        id: prodId,
        title: newProdObj.title,
        sku: newProdObj.sku,
        brand: newProdObj.brand,
        category: newProdObj.category,
        mrp: newProdObj.mrp,
        selling_price: newProdObj.price,
        stock: newProdObj.stock,
        status: true
      }]);
    } catch(e) {}
  };

  const deleteProduct = async (productId) => {
    setProducts(prev => {
      const updated = prev.filter(p => String(p.id) !== String(productId));
      try { localStorage.setItem('autozon_products', JSON.stringify(updated)); } catch(e){}
      return updated;
    });
    showToast('Product deleted from website', 'info');
    try {
      await supabase.from('products').delete().eq('id', productId);
    } catch(e) {}
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const globalFilteredProducts = useMemo(() => {
    if (!products) return [];
    if (!selectedVehicle) return products;
    
    return products.filter(prod => {
      const comp = checkVehicleProductCompatibility(prod, selectedVehicle);
      return comp.compatible || comp.isCompatible;
    });
  }, [products, selectedVehicle]);

  return (
    <StoreContext.Provider value={{
      // expose Buy Now state and action
      buyNowProduct,
      buyNow,
      user,
      setUser,
      currentRole,
      setCurrentRole,
      currentView,
      setCurrentView,
      activeProductId,
      setActiveProductId,
      activeOrderId,
      setActiveOrderId,
      navigateTo,
      products,
      setProducts,
      saveProduct,
      deleteProduct,
      orders,
      updateOrderStatus,
      customers,
      cars,
      categories,
      academy,
      enquiries,
      quotations,
      reviews,
      coupons,
      payments,
      shippingRecords,
      adminUsers,
      websiteSettings,
      updateWebsiteSetting,
      // New state exposed
      selectedCar,
      setSelectedCar,
      compatibleParts,
      setCompatibleParts,
      savedGarage,
      selectedVehicle,
      setSelectedVehicle,
      cart,
      savedForLater,
      appliedCouponCode,
      setAppliedCouponCode,
      savedAddresses,
      addSavedAddress,
      wishlist,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      compareList,
      recentlyViewed,
      addToRecentlyViewed,
      recentSearches,
      addRecentSearch,
      clearRecentSearches,
      cartTotal,
      cartItemCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateCartQuantity,
      // Buy Now utilities
      buyNowProduct,
      setBuyNowProduct,
      buyNow,
      selectedAddressId,
      setSelectedAddressId,
      shippingAddress,
      setShippingAddress,
      showToast,
      activeProductModal,
      setActiveProductModal,
      isCheckoutOpen,
      setIsCheckoutOpen,
      clearCart,
      moveToSavedForLater,
      moveToCartFromSaved,
      addCompletedOrder,
      deductInventoryStock,
      toggleCompare,
      addVehicleToGarage,
      removeVehicleFromGarage,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      selectedBrand,
      setSelectedBrand,
      selectedClassification,
      setSelectedClassification,
      filterFitsVehicle,
      setFilterFitsVehicle,
      priceRange,
      setPriceRange,
      sortBy,
      setSortBy,
      filteredProducts: globalFilteredProducts,
      isVehicleModalOpen,
      setIsVehicleModalOpen,
      isCartDrawerOpen,
      setIsCartDrawerOpen,
      activeProductModal,
      setActiveProductModal,
      isCheckoutOpen,
      setIsCheckoutOpen,
      toasts,
      showToast,
      isAdminUnlocked,
      unlockAdminConsole,
      lockAdminConsole,
      blogs: INITIAL_BLOGS,
      faqs: INITIAL_FAQS
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
