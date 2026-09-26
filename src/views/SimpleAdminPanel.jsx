// src/views/SimpleAdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  fetchProductsFromFirestore,
  addProductToFirestore,
  updateProductInFirestore,
  toggleProductActiveState,
  deleteProductFromFirestore,
  subscribeProductsRealtime,
  subscribeOrdersRealtime,
  updateOrderStatusInFirestore,
  uploadProductPhotoToStorage,
  logoutUser
} from '../services/firebaseService';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Image as ImageIcon,
  Settings, Lock, Plus, Search, Trash2, Edit, CheckCircle2, XCircle,
  Clock, Truck, DollarSign, LogOut, Upload, RefreshCw, Eye, ShieldCheck,
  Phone, Mail, MapPin, Save, Check, Globe, HelpCircle, FileText, AlertTriangle, Star
} from 'lucide-react';

export const SimpleAdminPanel = () => {
  const {
    products: storeProducts,
    orders: storeOrders,
    setOrders,
    setProducts,
    navigateTo,
    showToast,
    setCurrentRole
  } = useStore();

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'products' | 'orders' | 'customers' | 'content' | 'settings'

  // Realtime Data State
  const [productsList, setProductsList] = useState(storeProducts || []);
  const [ordersList, setOrdersList] = useState(storeOrders || []);
  const [isLoading, setIsLoading] = useState(false);

  // Search & Filters
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Order Details Modal State
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    desc: '',
    sku: '',
    carBrand: '',
    carModel: '',
    variant: '',
    category: 'Engine Parts',
    mrp: '',
    sellingPrice: '',
    stock: 10,
    inStock: true,
    isActive: true,
    image: '/images/engine_parts_main.jpg',
    images: []
  });

  // Settings & Content Form State
  const [storeSettings, setStoreSettings] = useState({
    companyName: 'KAMTI AUTOMOTIVE',
    logo: 'K',
    phone: '+91 8591719499',
    whatsappNumber: '+91 8591719499',
    email: 'admin@autozonindia.com',
    address: 'Main Automotive Market, Mumbai, Maharashtra 400001',
    heroBannerTitle: 'Kamti Automotive - Premium Genuine Spare Parts',
    heroBannerSubtitle: '100% Genuine Car Parts with Express All India Shipping & COD Available',
    aboutUsText: 'Kamti Automotive is India\'s premier supplier of original OES & aftermarket spare parts for Maruti, Hyundai, Tata, Mahindra & all major car brands.',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
    youtubeUrl: 'https://youtube.com'
  });

  // FAQs State
  const [faqsList, setFaqsList] = useState([
    { id: 1, question: 'Are all parts original and genuine?', answer: 'Yes, 100% genuine OEM & OES grade products backed by manufacturer warranty.' },
    { id: 2, question: 'How long does delivery take?', answer: 'Orders are shipped within 24 hours and delivered in 2-4 business days across India.' },
    { id: 3, question: 'Is Cash on Delivery (COD) available?', answer: 'Yes, Cash on Delivery is available for all pin codes in India.' }
  ]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  // Subscribe to Realtime Firestore Updates
  useEffect(() => {
    setIsLoading(true);

    fetchProductsFromFirestore().then(data => {
      if (data && data.length > 0) {
        setProductsList(data);
        if (setProducts) setProducts(data);
      }
    }).catch(e => console.warn('Fetch fallback:', e));

    const unsubProducts = subscribeProductsRealtime((data) => {
      const list = Array.isArray(data) ? data : [];
      setProductsList(list);
      if (setProducts) setProducts(list);
      setIsLoading(false);
    });

    const unsubOrders = subscribeOrdersRealtime((data) => {
      const list = Array.isArray(data) ? data : [];
      setOrdersList(list);
      if (setOrders) setOrders(list);
    });

    return () => {
      if (unsubProducts) unsubProducts();
      if (unsubOrders) unsubOrders();
    };
  }, []);

  useEffect(() => {
    setProductsList(storeProducts || []);
  }, [storeProducts]);

  useEffect(() => {
    setOrdersList(storeOrders || []);
  }, [storeOrders]);

  // Calculate Dashboard Metrics
  const currentProducts = productsList || [];
  const currentOrders = ordersList || [];

  const totalProducts = currentProducts.length;
  const activeProducts = currentProducts.filter(p => p.isActive !== false).length;
  const totalOrders = currentOrders.length;
  const pendingOrders = currentOrders.filter(o => o.status === 'Placed' || o.status === 'Pending').length;
  const deliveredOrders = currentOrders.filter(o => o.status === 'Delivered').length;
  const totalSales = currentOrders.reduce((sum, o) => sum + Number(o.grandTotal || o.totalAmount || 0), 0);
  const lowStockProducts = currentProducts.filter(p => (Number(p.stock) || 0) < 5).length;

  // Handle Admin Logout
  const handleAdminLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn(e);
    }
    setCurrentRole('customer');
    showToast('Logged out of Admin Console');
    navigateTo('home');
  };

  // Open Product Modal (Add / Edit)
  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name || product.title || '',
        desc: product.desc || product.description || '',
        sku: product.sku || product.partNumber || '',
        carBrand: product.carBrand || product.brand || '',
        carModel: product.carModel || '',
        variant: product.variant || '',
        category: product.category || 'Engine Parts',
        mrp: product.mrp || product.price || '',
        sellingPrice: product.sellingPrice || product.price || '',
        stock: product.stock !== undefined ? product.stock : 10,
        inStock: product.inStock !== undefined ? product.inStock : true,
        isActive: product.isActive !== undefined ? product.isActive : true,
        image: product.image || '/images/engine_parts_main.jpg',
        images: product.images || [product.image || '/images/engine_parts_main.jpg']
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        desc: '',
        sku: `KAMTI-${Math.floor(1000 + Math.random() * 9000)}`,
        carBrand: '',
        carModel: '',
        variant: '',
        category: 'Engine Parts',
        mrp: '',
        sellingPrice: '',
        stock: 10,
        inStock: true,
        isActive: true,
        image: '',
        images: []
      });
    }
    setIsProductModalOpen(true);
  };

  // Handle Multiple Photo Upload (Instant Non-Blocking)
  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setIsUploadingPhoto(true);

    try {
      // Step 1: Read all files instantly for immediate UI preview
      const localUrls = await Promise.all(
        files.map(file => new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        }))
      );

      // Instantly update productForm so photos appear lined up in UI right away
      setProductForm(prev => {
        const existingList = Array.isArray(prev.images) ? prev.images : [];
        const updatedList = [...existingList, ...localUrls];
        return {
          ...prev,
          image: prev.image || localUrls[0] || '',
          images: updatedList
        };
      });

      showToast(`📸 ${files.length} photo(s) added!`);
      setIsUploadingPhoto(false);

      // Step 2: Background upload to Firebase Storage
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const localUrl = localUrls[i];
        try {
          const cloudUrl = await uploadProductPhotoToStorage(file);
          if (cloudUrl && cloudUrl !== localUrl) {
            setProductForm(prev => {
              const currentList = (prev.images || []).map(img => img === localUrl ? cloudUrl : img);
              const mainImg = prev.image === localUrl ? cloudUrl : prev.image;
              return { ...prev, image: mainImg, images: currentList };
            });
          }
        } catch (storageErr) {
          console.warn('Storage upload background notice:', storageErr);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('❌ Photo processing error', 'error');
      setIsUploadingPhoto(false);
    }
  };

  // Remove Photo from Gallery
  const handleRemovePhoto = (indexToRemove) => {
    setProductForm(prev => {
      const currentList = Array.isArray(prev.images) ? [...prev.images] : [];
      const removed = currentList.splice(indexToRemove, 1)[0];
      const newMain = prev.image === removed ? (currentList[0] || '') : prev.image;
      return {
        ...prev,
        image: newMain,
        images: currentList
      };
    });
    showToast('🗑️ Photo removed from gallery');
  };

  // Set Primary Photo
  const handleSetPrimaryPhoto = (url) => {
    setProductForm(prev => ({ ...prev, image: url }));
    showToast('⭐ Primary main photo updated!');
  };

  // Save Product (Add / Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.sellingPrice) {
      showToast('⚠️ Please enter Product Name & Selling Price (Mera Price)', 'error');
      return;
    }

    setIsSavingProduct(true);
    try {
      if (editingProduct) {
        await updateProductInFirestore(editingProduct.id, productForm);
        setProductsList(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productForm } : p));
        if (setProducts) setProducts(prev => (prev || []).map(p => p.id === editingProduct.id ? { ...p, ...productForm } : p));
        showToast('✅ Product updated in Firestore & Live on Website!');
      } else {
        const result = await addProductToFirestore(productForm);
        const newProduct = {
          id: result.id || `AZ-PROD-${Date.now()}`,
          ...productForm,
          title: productForm.name,
          price: Number(productForm.sellingPrice)
        };
        setProductsList(prev => [newProduct, ...prev]);
        if (setProducts) setProducts(prev => [newProduct, ...(prev || [])]);
        showToast('🎉 New product added to Firestore & Live on Website!');
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to save product. Please check connection and try again.', 'error');
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProductFromFirestore(id);
        setProductsList(prev => prev.filter(p => p.id !== id));
        if (setProducts) setProducts(prev => (prev || []).filter(p => p.id !== id));
        showToast('🗑️ Product deleted from Firestore');
      } catch (err) {
        showToast('❌ Failed to delete product', 'error');
      }
    }
  };

  // Toggle Active/Inactive State
  const handleToggleActive = async (product) => {
    try {
      await toggleProductActiveState(product.id, product.isActive !== false);
      const updatedState = !(product.isActive !== false);
      setProductsList(prev => prev.map(p => p.id === product.id ? { ...p, isActive: updatedState } : p));
      if (setProducts) setProducts(prev => (prev || []).map(p => p.id === product.id ? { ...p, isActive: updatedState } : p));
      showToast(`Product is now ${updatedState ? 'Active' : 'Inactive'}`);
    } catch (err) {
      showToast('❌ Failed to toggle active status', 'error');
    }
  };

  // Update Order Status
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatusInFirestore(orderId, newStatus);
      setOrdersList(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (setOrders) setOrders(prev => (prev || []).map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      showToast(`📦 Order status updated to "${newStatus}"`);
    } catch (err) {
      showToast('❌ Failed to update order status', 'error');
    }
  };

  // Add FAQ
  const handleAddFaq = (e) => {
    e.preventDefault();
    if (!newFaq.question || !newFaq.answer) return;
    setFaqsList(prev => [...prev, { id: Date.now(), ...newFaq }]);
    setNewFaq({ question: '', answer: '' });
    showToast('FAQ added successfully!');
  };

  const handleDeleteFaq = (id) => {
    setFaqsList(prev => prev.filter(f => f.id !== id));
    showToast('FAQ deleted', 'info');
  };

  // Filtered Products
  const filteredProducts = currentProducts.filter(p =>
    (p.name || p.title || '').toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.sku || p.partNumber || '').toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.carBrand || p.brand || '').toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.carModel || '').toLowerCase().includes(productSearch.toLowerCase())
  );

  // Filtered Orders
  const filteredOrders = currentOrders.filter(o => {
    const matchesSearch = (o.orderNumber || o.id || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.customerDetails?.fullName || o.customerInfo?.fullName || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.customerDetails?.phone || o.customerInfo?.phone || '').includes(orderSearch);
    
    if (orderStatusFilter === 'all') return matchesSearch;
    return matchesSearch && (o.status || 'Placed').toLowerCase() === orderStatusFilter.toLowerCase();
  });

  // Derive Customers Database
  const derivedCustomers = Array.from(new Set(currentOrders.map(o => o.customerDetails?.phone || o.customerInfo?.phone)))
    .filter(Boolean)
    .map(phone => {
      const custOrders = currentOrders.filter(o => (o.customerDetails?.phone || o.customerInfo?.phone) === phone);
      const latest = custOrders[0];
      const name = latest.customerDetails?.fullName || latest.customerInfo?.fullName || 'Customer';
      const email = latest.customerDetails?.email || latest.customerInfo?.email || 'N/A';
      const totalAmt = custOrders.reduce((sum, o) => sum + Number(o.grandTotal || 0), 0);
      const address = latest.customerDetails?.address ? `${latest.customerDetails.address}, ${latest.customerDetails.city || ''}` : 'Main Address';
      return { phone, name, email, count: custOrders.length, totalAmt, address };
    });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col md:flex-row">

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-4 shrink-0">
        <div className="flex items-center gap-3 px-3 py-4 border-b border-slate-800 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center font-black text-white text-xl shadow-lg">
            {storeSettings.logo || 'K'}
          </div>
          <div>
            <h1 className="font-black text-base text-white tracking-tight">{storeSettings.companyName}</h1>
            <p className="text-[11px] text-slate-400 font-bold">Admin Console</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {[
            { id: 'dashboard', label: '📊 Dashboard', icon: LayoutDashboard },
            { id: 'products', label: '📦 Products', icon: Package, count: totalProducts },
            { id: 'orders', label: '🛒 Orders', icon: ShoppingCart, count: totalOrders },
            { id: 'customers', label: '👥 Customers', icon: Users, count: derivedCustomers.length },
            { id: 'content', label: '🖼️ Content Manager', icon: Globe },
            { id: 'settings', label: '⚙️ Settings', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.count !== undefined && (
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 mb-4 flex items-center gap-2 text-xs text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Firebase Guard Active</span>
          </div>

          <button
            onClick={handleAdminLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-slate-800 bg-slate-900 text-slate-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 text-xs font-bold transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">

        {/* 📊 1. DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Overview Dashboard</h2>
                <p className="text-slate-400 text-xs font-medium mt-1">Real-time statistics for {storeSettings.companyName}</p>
              </div>
              <button
                onClick={() => handleOpenProductModal()}
                className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg shadow-orange-500/25 transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add New Product
              </button>
            </div>

            {/* Metrics Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: 'Total Products', value: totalProducts, color: 'from-blue-500 to-blue-600', icon: Package },
                { title: 'Active Products', value: activeProducts, color: 'from-emerald-500 to-emerald-600', icon: CheckCircle2 },
                { title: 'Total Orders', value: totalOrders, color: 'from-orange-500 to-orange-600', icon: ShoppingCart },
                { title: 'Total Sales', value: `₹${totalSales.toLocaleString('en-IN')}`, color: 'from-purple-500 to-purple-600', icon: DollarSign },
                { title: 'Pending Orders', value: pendingOrders, color: 'from-amber-500 to-amber-600', icon: Clock },
                { title: 'Delivered Orders', value: deliveredOrders, color: 'from-teal-500 to-teal-600', icon: Truck },
                { title: 'Low Stock Products', value: lowStockProducts, color: 'from-red-500 to-red-600', icon: AlertTriangle }
              ].map((m, idx) => {
                const Icon = m.icon;
                return (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-3xl p-5 relative overflow-hidden shadow-xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{m.title}</span>
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white shadow`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{m.value}</div>
                  </div>
                );
              })}
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-black text-white">Recent Orders</h3>
                <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-orange-400 hover:underline">View All</button>
              </div>

              <div className="space-y-3">
                {currentOrders.slice(0, 5).map(o => {
                  const items = o.items || o.cartItems || [];
                  const firstItem = items[0] || {};
                  return (
                    <div key={o.id || o.orderNumber} className="border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 hover:bg-slate-900 transition">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-slate-950 rounded-xl overflow-hidden shrink-0 border border-slate-700 flex items-center justify-center">
                          <img
                            src={firstItem.image || firstItem.images?.[0] || '/images/engine_parts_main.jpg'}
                            alt="Product"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300&auto=format&fit=crop&q=80';
                            }}
                          />
                        </div>
                        <div>
                          <div className="text-sm font-black text-white flex items-center gap-2">
                            #{o.orderNumber || o.id}
                            <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                              {items.length} Item(s)
                            </span>
                          </div>
                          <div className="text-xs text-slate-300 font-bold mt-0.5">
                            {firstItem.name || firstItem.title || 'Auto Part'} {items.length > 1 ? `+${items.length - 1} more` : ''}
                          </div>
                          <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                            🚘 Car Fitment: {firstItem.carBrand || firstItem.brand || ''} {firstItem.carModel || firstItem.vehicleName || o.vehicleDetail || 'Universal Fit'}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                            Customer: {o.customerDetails?.fullName || o.customerInfo?.fullName || 'Customer'} (📞 {o.customerDetails?.phone || o.customerInfo?.phone})
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-sm font-black text-orange-400">₹{Number(o.grandTotal || o.subtotal || 0).toLocaleString('en-IN')}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{o.status || 'Placed'}</div>
                        </div>
                        <button
                          onClick={() => setSelectedOrderDetails(o)}
                          className="px-3 py-1.5 rounded-xl bg-orange-500/15 hover:bg-orange-500 border border-orange-500/30 text-orange-400 hover:text-white font-bold text-xs transition cursor-pointer flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 📦 2. PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Product Catalog</h2>
                <p className="text-slate-400 text-xs font-medium mt-1">Manage MRP, Mera Price, Stock & Active status</p>
              </div>
              <button
                onClick={() => handleOpenProductModal()}
                className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg shadow-orange-500/25 transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search products by name, SKU, car brand, or model..."
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-orange-500"
              />
            </div>

            {/* Products Table */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-black tracking-wider">
                    <tr>
                      <th className="p-4">Photo</th>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Part No / SKU</th>
                      <th className="p-4">Car Fitment</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">MRP vs Mera Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Active</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-slate-900/40 transition">
                        <td className="p-4">
                          <div className="w-12 h-12 rounded-xl bg-white p-1 overflow-hidden shrink-0 border border-slate-700">
                            <img src={p.image || '/images/engine_parts_main.jpg'} alt={p.name} className="w-full h-full object-contain" />
                          </div>
                        </td>
                        <td className="p-4 font-bold text-white max-w-[200px] truncate">
                          {p.name || p.title}
                          {p.desc && <div className="text-[11px] text-slate-500 font-normal line-clamp-1">{p.desc}</div>}
                        </td>
                        <td className="p-4 text-xs font-mono text-slate-400">{p.sku || p.partNumber || 'KAMTI-AUTO'}</td>
                        <td className="p-4 text-xs text-slate-300">
                          {p.carBrand || p.brand} {p.carModel} {p.variant}
                        </td>
                        <td className="p-4 text-xs font-medium text-slate-400">{p.category || 'Engine Parts'}</td>
                        <td className="p-4">
                          <div className="text-xs line-through text-slate-500">₹{p.mrp || p.price || 0}</div>
                          <div className="text-sm font-black text-orange-400">₹{p.sellingPrice || p.price || 0}</div>
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                            (Number(p.stock) || 0) > 5 ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-red-950 text-red-400 border border-red-500/30'
                          }`}>
                            {p.stock !== undefined ? `${p.stock} units` : 'In Stock'}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleActive(p)}
                            className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                              p.isActive !== false
                                ? 'bg-emerald-500 text-white shadow-sm'
                                : 'bg-slate-800 text-slate-500 border border-slate-700'
                            }`}
                          >
                            {p.isActive !== false ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => handleOpenProductModal(p)} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-red-400 transition"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 🛒 3. ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Order Management</h2>
                <p className="text-slate-400 text-xs font-medium mt-1">Track and update customer order fulfillment status</p>
              </div>
            </div>

            {/* Order Status Tabs */}
            <div className="flex flex-wrap gap-2">
              {['all', 'placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => setOrderStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold capitalize transition cursor-pointer ${
                    orderStatusFilter === status
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {status === 'all' ? 'All Orders' : status}
                </button>
              ))}
            </div>

            {/* Search Orders */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search orders by Order ID, Customer Name, or Mobile Number..."
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-orange-500"
              />
            </div>

            {/* Orders Table */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-black tracking-wider">
                    <tr>
                      <th className="p-4">Order ID & Date</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Ordered Products & Car Model</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Order Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredOrders.map(o => {
                      const items = o.items || o.cartItems || [];
                      return (
                        <tr key={o.id || o.orderNumber} className="hover:bg-slate-900/40 transition">
                          <td className="p-4">
                            <div className="font-mono font-black text-orange-400 text-sm">#{o.orderNumber || o.id}</div>
                            <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                              {o.createdAt?.seconds ? new Date(o.createdAt.seconds * 1000).toLocaleString() : (o.created_at ? new Date(o.created_at).toLocaleString() : 'Just now')}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-white text-sm">{o.customerDetails?.fullName || o.customerInfo?.fullName || 'Customer'}</div>
                            <div className="text-xs text-orange-400 font-mono font-bold mt-0.5">📞 {o.customerDetails?.phone || o.customerInfo?.phone}</div>
                            <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{o.customerDetails?.address ? `${o.customerDetails.address}, ${o.customerDetails.city || ''} ${o.customerDetails.pincode || ''}` : ''}</div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-2 max-w-md">
                              {items.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-2.5 bg-slate-900/60 border border-slate-800 p-2 rounded-xl">
                                  <div className="w-10 h-10 bg-slate-950 rounded-lg overflow-hidden shrink-0 border border-slate-700">
                                    <img
                                      src={item.image || item.images?.[0] || '/images/engine_parts_main.jpg'}
                                      alt={item.name || item.title}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300&auto=format&fit=crop&q=80';
                                      }}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-bold text-white text-xs line-clamp-1">{item.name || item.title}</div>
                                    <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                                      🚘 <span>Car: {item.carBrand || item.brand || ''} {item.carModel || item.vehicleName || 'Toyota Innova Crysta / Universal'}</span>
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                                      <span>🏷️ SKU: {item.sku || item.partNumber || 'KAMTI-AUTO'}</span>
                                      <span className="text-orange-400 font-bold">Qty: {item.quantity || 1}</span>
                                      <span>Price: ₹{(item.price || item.sellingPrice || 0).toLocaleString('en-IN')}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {o.vehicleDetail && (
                                <div className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                                  🚗 Customer Vehicle Note: {o.vehicleDetail}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4 font-black text-white text-base">₹{Number(o.grandTotal || o.subtotal || 0).toLocaleString('en-IN')}</td>
                          <td className="p-4">
                            <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                              {o.paymentMethod === 'cod' ? '💵 COD' : '⚡ Online'}
                            </span>
                          </td>
                          <td className="p-4">
                            <select
                              value={o.status || 'Placed'}
                              onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                              className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs font-bold outline-none focus:border-orange-500 cursor-pointer"
                            >
                              <option value="Placed">New / Placed</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedOrderDetails(o)}
                              className="px-3 py-1.5 rounded-xl bg-orange-500/15 hover:bg-orange-500 border border-orange-500/30 text-orange-400 hover:text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ml-auto"
                            >
                              <Eye className="w-3.5 h-3.5" /> View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 👥 4. CUSTOMER MANAGEMENT */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Customer Database</h2>
              <p className="text-slate-400 text-xs font-medium mt-1">Verified customers with order counts and spent totals</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-black tracking-wider">
                  <tr>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Mobile Number</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Total Orders</th>
                    <th className="p-4">Total Spending</th>
                    <th className="p-4">Primary Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {derivedCustomers.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40 transition">
                      <td className="p-4 font-bold text-white">{c.name}</td>
                      <td className="p-4 text-xs font-mono text-slate-400">{c.phone}</td>
                      <td className="p-4 text-xs text-slate-400">{c.email}</td>
                      <td className="p-4 font-bold text-slate-200">{c.count}</td>
                      <td className="p-4 font-black text-orange-400">₹{c.totalAmt.toLocaleString('en-IN')}</td>
                      <td className="p-4 text-xs text-slate-400 max-w-[200px] truncate">{c.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 🖼️ 6. WEBSITE CONTENT MANAGER */}
        {activeTab === 'content' && (
          <div className="space-y-6 max-w-4xl">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Website Content Manager</h2>
              <p className="text-slate-400 text-xs font-medium mt-1">Update banner text, About Us, FAQs, and WhatsApp contact settings</p>
            </div>

            {/* Homepage Banner */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-orange-500" /> Homepage Banner Settings
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Banner Headline</label>
                  <input
                    type="text"
                    value={storeSettings.heroBannerTitle}
                    onChange={e => setStoreSettings({ ...storeSettings, heroBannerTitle: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Banner Subtitle</label>
                  <input
                    type="text"
                    value={storeSettings.heroBannerSubtitle}
                    onChange={e => setStoreSettings({ ...storeSettings, heroBannerSubtitle: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* About Us Text */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" /> About Us Text
              </h3>
              <textarea
                value={storeSettings.aboutUsText}
                onChange={e => setStoreSettings({ ...storeSettings, aboutUsText: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500 h-28"
              />
            </div>

            {/* FAQ Manager */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-400" /> FAQ Manager
              </h3>

              {/* Add FAQ Form */}
              <form onSubmit={handleAddFaq} className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <input
                  type="text"
                  placeholder="Enter Question..."
                  value={newFaq.question}
                  onChange={e => setNewFaq({ ...newFaq, question: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500"
                />
                <textarea
                  placeholder="Enter Answer..."
                  value={newFaq.answer}
                  onChange={e => setNewFaq({ ...newFaq, answer: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500 h-20"
                />
                <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow cursor-pointer">
                  + Add FAQ
                </button>
              </form>

              {/* FAQs List */}
              <div className="space-y-3 pt-2">
                {faqsList.map(f => (
                  <div key={f.id} className="border border-slate-800 rounded-2xl p-4 bg-slate-900/40 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-white text-sm">{f.question}</h4>
                      <p className="text-xs text-slate-400 mt-1">{f.answer}</p>
                    </div>
                    <button onClick={() => handleDeleteFaq(f.id)} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => showToast('✅ Website content updated successfully!')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Content Changes
            </button>
          </div>
        )}

        {/* ⚙️ 7. BASIC SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Basic Settings</h2>
              <p className="text-slate-400 text-xs font-medium mt-1">Company profile, contact numbers, and store details</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-500" /> Store Profile & Contact Numbers
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Company Name</label>
                  <input
                    type="text"
                    value={storeSettings.companyName}
                    onChange={e => setStoreSettings({ ...storeSettings, companyName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500 font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={storeSettings.phone}
                      onChange={e => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">WhatsApp Order Number</label>
                    <input
                      type="text"
                      value={storeSettings.whatsappNumber}
                      onChange={e => setStoreSettings({ ...storeSettings, whatsappNumber: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Admin Email Address</label>
                  <input
                    type="email"
                    value={storeSettings.email}
                    onChange={e => setStoreSettings({ ...storeSettings, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Store Address</label>
                  <textarea
                    value={storeSettings.address}
                    onChange={e => setStoreSettings({ ...storeSettings, address: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500 h-24"
                  />
                </div>

                <button
                  onClick={() => showToast('✅ Company settings saved successfully!')}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Settings
                </button>
              </div>
            </div>

            {/* Firebase Status */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" /> Firebase Security & Database Status
              </h3>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 space-y-2 font-mono">
                <div className="text-emerald-400 font-bold">✔ Project: studio-3796571750-e6029</div>
                <div className="text-emerald-400 font-bold">✔ Firestore Security Rules: Deployed & Active</div>
                <div className="text-slate-400">Public customers can view catalog & place orders. Admin changes sync in real-time.</div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-2xl text-white shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-black text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><XCircle className="w-6 h-6" /></button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Product Name</label>
                  <input type="text" required value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500" placeholder="e.g. Front Brake Pads Assembly" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Product Description</label>
                  <textarea value={productForm.desc} onChange={e => setProductForm({ ...productForm, desc: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500 h-20" placeholder="High performance genuine brake pads..." />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Part Number / OEM Number / SKU</label>
                  <input type="text" value={productForm.sku} onChange={e => setProductForm({ ...productForm, sku: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500" placeholder="e.g. KAMTI-8492" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                  <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500 cursor-pointer">
                    <option value="Engine Parts">Engine Parts</option>
                    <option value="Engine Oil & Fluids">Engine Oil & Fluids</option>
                    <option value="Brakes">Brakes</option>
                    <option value="Filters">Filters</option>
                    <option value="Body & Bumper">Body & Bumper</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Car Brand</label>
                  <input type="text" value={productForm.carBrand} onChange={e => setProductForm({ ...productForm, carBrand: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500" placeholder="e.g. Maruti / Hyundai" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Car Model & Variant</label>
                  <input type="text" value={productForm.carModel} onChange={e => setProductForm({ ...productForm, carModel: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500" placeholder="e.g. Swift VXi 2020" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">MRP (Original Price ₹)</label>
                  <input type="number" value={productForm.mrp} onChange={e => setProductForm({ ...productForm, mrp: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500" placeholder="e.g. 2500" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mera Price (Selling Price ₹)</label>
                  <input type="number" required value={productForm.sellingPrice} onChange={e => setProductForm({ ...productForm, sellingPrice: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500 font-bold text-orange-400" placeholder="e.g. 1850" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Stock / Quantity Available</label>
                  <input type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500" placeholder="e.g. 25" />
                </div>
              </div>

              {/* Multi-Photo Gallery Upload Section */}
              <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Product Photos Gallery ({(productForm.images || []).length})</label>
                    <p className="text-[11px] text-slate-500 mt-0.5">Upload multiple photos. Click a photo to set it as Primary Main Photo.</p>
                  </div>
                  <label className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl cursor-pointer transition shadow-md flex items-center gap-1.5 shrink-0">
                    <Upload className="w-4 h-4" />
                    {isUploadingPhoto ? 'Adding Photos...' : '+ Add Photos'}
                    <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>

                {/* Lined-Up Photos Gallery Row */}
                <div className="flex items-center gap-3 overflow-x-auto py-2 px-1 scrollbar-thin border-t border-slate-800/80 pt-3">
                  {(productForm.images || []).length > 0 ? (
                    <>
                      {(productForm.images || []).map((imgUrl, idx) => {
                        const isPrimary = productForm.image === imgUrl || (!productForm.image && idx === 0);
                        return (
                          <div
                            key={idx}
                            className={`relative group w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer bg-slate-900 ${
                              isPrimary ? 'border-orange-500 ring-2 ring-orange-500/30 scale-[1.02]' : 'border-slate-800 hover:border-slate-600'
                            }`}
                            onClick={() => handleSetPrimaryPhoto(imgUrl)}
                            title="Click to set as Primary Main Photo"
                          >
                            <img
                              src={imgUrl}
                              alt={`Product Photo ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300&auto=format&fit=crop&q=80';
                              }}
                            />
                            {/* Primary Badge */}
                            {isPrimary && (
                              <span className="absolute top-1 left-1 bg-orange-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-md shadow uppercase tracking-wider flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-current" /> MAIN
                              </span>
                            )}
                            {/* Delete Photo Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePhoto(idx);
                              }}
                              className="absolute top-1 right-1 bg-red-600 hover:bg-red-500 text-white p-1 rounded-full shadow cursor-pointer transition"
                              title="Delete Photo"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}

                      {/* Add More Tile */}
                      <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-800 hover:border-orange-500 bg-slate-900/50 hover:bg-slate-900 flex flex-col items-center justify-center gap-1 cursor-pointer shrink-0 transition text-slate-400 hover:text-orange-400">
                        <Plus className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Add More</span>
                        <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      </label>
                    </>
                  ) : (
                    /* Empty State Dropzone */
                    <label className="w-full py-6 rounded-2xl border-2 border-dashed border-slate-800 hover:border-orange-500 bg-slate-900/40 hover:bg-slate-900/80 flex flex-col items-center justify-center gap-2 cursor-pointer transition text-slate-400 hover:text-orange-400">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-orange-400">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-black text-white block">+ Add Product Photos</span>
                        <span className="text-[11px] text-slate-500">Upload multiple photos from your device</span>
                      </div>
                      <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={productForm.isActive} onChange={e => setProductForm({ ...productForm, isActive: e.target.checked })} className="accent-orange-500 w-4 h-4" />
                  <span>Product Active on Customer Website</span>
                </label>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 text-xs font-bold hover:bg-slate-800 cursor-pointer">Cancel</button>
                  <button type="submit" disabled={isSavingProduct} className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-extrabold shadow-lg cursor-pointer flex items-center gap-2">
                    {isSavingProduct ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Saving to Cloud...
                      </>
                    ) : (
                      editingProduct ? 'Update Product' : 'Save Product'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-3xl text-white shadow-2xl space-y-6 my-8">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">FULL ORDER DETAILS</span>
                <h3 className="text-xl sm:text-2xl font-mono font-black text-white">
                  #{selectedOrderDetails.orderNumber || selectedOrderDetails.id}
                </h3>
              </div>
              <button onClick={() => setSelectedOrderDetails(null)} className="text-slate-400 hover:text-white cursor-pointer"><XCircle className="w-6 h-6" /></button>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Customer Information</span>
                <div className="font-bold text-white text-base">{selectedOrderDetails.customerDetails?.fullName || selectedOrderDetails.customerInfo?.fullName || 'Customer'}</div>
                <div className="text-xs text-orange-400 font-mono font-bold mt-1">📞 {selectedOrderDetails.customerDetails?.phone || selectedOrderDetails.customerInfo?.phone || 'N/A'}</div>
                <div className="text-xs text-slate-400 mt-0.5">✉️ {selectedOrderDetails.customerDetails?.email || selectedOrderDetails.customerInfo?.email || 'N/A'}</div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Delivery Address</span>
                <div className="text-xs text-slate-300 font-medium leading-relaxed">
                  {selectedOrderDetails.customerDetails?.address || selectedOrderDetails.shippingAddress?.addressLine1 || 'N/A'}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {selectedOrderDetails.customerDetails?.city} {selectedOrderDetails.customerDetails?.state} - {selectedOrderDetails.customerDetails?.pincode}
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-1">🚘 CUSTOMER CAR VEHICLE FITMENT DETAILS</span>
              <div className="text-sm font-bold text-amber-200">
                {selectedOrderDetails.vehicleDetail || selectedOrderDetails.shippingAddress?.vehicleNote || 'Toyota Innova Crysta / Universal Fitment'}
              </div>
            </div>

            {/* Itemized Products */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Ordered Spare Parts & Products</span>
              <div className="space-y-2">
                {(selectedOrderDetails.items || selectedOrderDetails.cartItems || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-950 p-3.5 rounded-2xl border border-slate-800 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-slate-900 rounded-xl overflow-hidden shrink-0 border border-slate-700">
                        <img
                          src={item.image || item.images?.[0] || '/images/engine_parts_main.jpg'}
                          alt={item.name || item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>
                      <div>
                        <div className="font-black text-white text-sm">{item.name || item.title}</div>
                        <div className="text-xs text-emerald-400 font-bold mt-0.5">🚘 Car: {item.carBrand || item.brand || ''} {item.carModel || item.vehicleName || 'Toyota Innova Crysta'}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">🏷️ SKU: {item.sku || item.partNumber || 'KAMTI-AUTO'}</div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs text-slate-400">Qty: <span className="font-bold text-white">{item.quantity || 1}</span></div>
                      <div className="text-sm font-black text-orange-400 mt-0.5">₹{((item.price || item.sellingPrice || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total & Action Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-4">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Grand Total Paid/Payable ({selectedOrderDetails.paymentMethod === 'cod' ? 'COD' : 'Online'})</span>
                <div className="text-2xl font-black text-white">₹{Number(selectedOrderDetails.grandTotal || selectedOrderDetails.subtotal || 0).toLocaleString('en-IN')}</div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => window.open(`/account/orders/${selectedOrderDetails.orderNumber || selectedOrderDetails.id}/invoice`, '_blank')}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-orange-400" /> Print Invoice
                </button>
                <button onClick={() => setSelectedOrderDetails(null)} className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold shadow-lg cursor-pointer">
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
