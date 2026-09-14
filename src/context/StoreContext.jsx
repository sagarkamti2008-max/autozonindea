import React, { createContext, useContext, useState, useEffect } from 'react';
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

const StoreContext = createContext();

const safeGetStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
};

export const StoreProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState('customer');
  const [user, setUser] = useState(() => safeGetStorage('autozon_user', null));

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
      if (path.startsWith('/assistant')) return 'ai-assistant';
      if (path.includes('/support/ticket/')) return 'customer-ticket-detail';
      if (path.startsWith('/admin/support')) return 'admin';
      if (path.includes('/account/notifications')) return 'customer-notifications';
      if (path.startsWith('/admin/marketing')) return 'admin';
      if (path.startsWith('/admin/cms')) return 'admin';
      if (path.startsWith('/admin/blog')) return 'admin';
      if (path.startsWith('/admin/seo')) return 'admin';
      if (path.startsWith('/admin/faqs')) return 'admin';
      if (path.startsWith('/admin/warehouses')) return 'admin';
      if (path.startsWith('/admin/inventory/transfers')) return 'admin';
      if (path.startsWith('/admin/fulfillment')) return 'admin';
      if (path.startsWith('/admin/inventory/reports')) return 'admin';
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

  const [products, setProducts] = useState(() => safeGetStorage('autozon_products', INITIAL_PRODUCTS));
  const [orders, setOrders] = useState(() => safeGetStorage('autozon_orders', INITIAL_ORDERS));
  const [customers, setCustomers] = useState(() => safeGetStorage('autozon_customers', INITIAL_CUSTOMERS));
  const [cars] = useState(mockCars);
  const [categories] = useState(CATEGORIES_DATABASE);
  const [academy] = useState(academyModules);
  const [enquiries, setEnquiries] = useState(() => safeGetStorage('autozon_enquiries', INITIAL_ENQUIRIES));
  const [quotations, setQuotations] = useState(() => safeGetStorage('autozon_quotations', INITIAL_QUOTATIONS));
  const [reviews, setReviews] = useState(() => safeGetStorage('autozon_reviews', INITIAL_REVIEWS));
  const [coupons, setCoupons] = useState(() => safeGetStorage('autozon_coupons_db', INITIAL_COUPONS));
  const [payments, setPayments] = useState(() => safeGetStorage('autozon_payments_db', INITIAL_PAYMENTS));
  const [shippingRecords, setShippingRecords] = useState(() => safeGetStorage('autozon_shipping_db', INITIAL_SHIPPING));
  const [adminUsers, setAdminUsers] = useState(() => safeGetStorage('autozon_admin_users_db', INITIAL_ADMIN_USERS));
  const [websiteSettings, setWebsiteSettings] = useState(() => safeGetStorage('autozon_website_settings_db', INITIAL_WEBSITE_SETTINGS));

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
  const buyNow = (product, quantity = 1) => {
    setBuyNowProduct({ ...product, quantity });
    navigateTo('buy-now');
  };
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
  const [priceRange, setPriceRange] = useState(10000);
  const [sortBy, setSortBy] = useState('featured');

  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

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
  useEffect(() => { try { localStorage.setItem('autozon_selected_vehicle', JSON.stringify(selectedVehicle)); } catch(e){} }, [selectedVehicle]);
  useEffect(() => { try { localStorage.setItem('autozon_cart', JSON.stringify(cart)); } catch(e){} }, [cart]);
  useEffect(() => { try { localStorage.setItem('autozon_saved_later', JSON.stringify(savedForLater)); } catch(e){} }, [savedForLater]);
  useEffect(() => { try { localStorage.setItem('autozon_coupon', JSON.stringify(appliedCouponCode)); } catch(e){} }, [appliedCouponCode]);
  useEffect(() => { try { localStorage.setItem('autozon_addresses', JSON.stringify(savedAddresses)); } catch(e){} }, [savedAddresses]);
  useEffect(() => { try { localStorage.setItem('autozon_wishlist', JSON.stringify(wishlist)); } catch(e){} }, [wishlist]);
  useEffect(() => { try { localStorage.setItem('autozon_recently_viewed', JSON.stringify(recentlyViewed)); } catch(e){} }, [recentlyViewed]);
  useEffect(() => { try { localStorage.setItem('autozon_recent_searches', JSON.stringify(recentSearches)); } catch(e){} }, [recentSearches]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  const navigateTo = (viewName, productId = null) => {
    setCurrentView(viewName);
    if (productId) setActiveProductId(productId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product, quantity = 1) => {
    const stockQty = product.stockCount ?? product.stock_quantity ?? product.stock ?? 10;
    if (stockQty <= 0) {
      showToast('Product is currently Out of Stock', 'error');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    showToast(`Added "${(product.name || product.title || '').slice(0, 30)}..." to Cart! 🛒`);
    setIsCartDrawerOpen(true);
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

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
      orders,
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
      buyNow,
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
      filteredProducts: products,
      isVehicleModalOpen,
      setIsVehicleModalOpen,
      isCartDrawerOpen,
      setIsCartDrawerOpen,
      toasts,
      showToast,
      blogs: INITIAL_BLOGS,
      faqs: INITIAL_FAQS
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
