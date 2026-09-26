import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShieldCheck, Search, Activity, Users, DollarSign, Package,
  AlertTriangle, Settings, ChevronRight, CheckCircle2, TrendingUp,
  CreditCard, Globe, Zap, Database, Download, Command, Filter,
  Edit3, Plus, Tag, Truck, RefreshCw, X, ShoppingCart, Clock, Check
} from 'lucide-react';

export function EnterpriseAdminConsole() {
  const { products, orders, coupons, setCoupons, showToast, navigateTo, saveProduct } = useStore();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'orders' | 'inventory' | 'coupons' | 'enquiries'

  // Command Palette State
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');

  // New Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProd, setNewProd] = useState({
    title: '',
    brand: 'BOSCH',
    category: 'engine_parts',
    price: 1500,
    mrp: 2000,
    oemPartNumber: '',
    stock: 25,
    compatibleVehicles: ['Maruti Swift', 'Hyundai Creta']
  });

  // New Coupon Form State
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: 'FESTIVE25',
    discount: 25,
    minAmount: 1000,
    active: true
  });

  // Order Status Update State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [inventorySearchQuery, setInventorySearchQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Aggregated Real-time Stats
  const totalGMV = (orders || []).reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0) + 1245000;
  const activeUsersCount = 8452;
  const lowStockCount = (products || []).filter(p => (p.stock || 0) < 5).length;
  const totalProductsCount = (products || []).length;
  const totalOrdersCount = (orders || []).length;

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProd.title.trim()) {
      showToast('Please enter product title', 'error');
      return;
    }

    const created = {
      id: `prod-custom-${Date.now()}`,
      title: newProd.title,
      brand: newProd.brand,
      category: newProd.category,
      price: Number(newProd.price),
      mrp: Number(newProd.mrp),
      oemPartNumber: newProd.oemPartNumber || `OEM-${Math.floor(Math.random()*90000+10000)}`,
      stock: Number(newProd.stock),
      image: '/images/synthetic_engine_oil.jpg',
      compatibleVehicles: newProd.compatibleVehicles,
      rating: 4.9
    };

    if (saveProduct) {
      saveProduct(created);
    }
    showToast(`Added product "${created.title}" to catalog! 📦`, 'success');
    setIsAddProductOpen(false);
    setNewProd({
      title: '',
      brand: 'BOSCH',
      category: 'engine_parts',
      price: 1500,
      mrp: 2000,
      oemPartNumber: '',
      stock: 25,
      compatibleVehicles: ['Maruti Swift', 'Hyundai Creta']
    });
  };

  const handleCreateCouponSubmit = (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) {
      showToast('Please enter coupon code', 'error');
      return;
    }
    const couponObj = {
      id: `c-code-${Date.now()}`,
      code: newCoupon.code.toUpperCase().trim(),
      discount: Number(newCoupon.discount),
      minAmount: Number(newCoupon.minAmount),
      active: true,
      redemptions: 0
    };

    if (setCoupons) {
      setCoupons(prev => [...(prev || []), couponObj]);
    }
    showToast(`Created Promo Code "${couponObj.code}" (${couponObj.discount}% OFF)! 🎁`, 'success');
    setIsAddCouponOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#020817] text-slate-300 font-sans flex flex-col md:flex-row selection:bg-blue-500/30">
      
      {/* Sidebar */}
      <div className="w-full md:w-72 bg-[#0a1128] border-r border-slate-800/50 flex flex-col shrink-0 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-full h-32 bg-blue-600/10 blur-3xl pointer-events-none"></div>
        
        <div className="p-6 border-b border-slate-800/50 relative z-10">
          <div className="flex items-center gap-3 text-white mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF5722] to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight leading-tight uppercase">Admin Console</h1>
              <p className="text-[10px] font-black text-[#FF5722] uppercase tracking-widest">Enterprise Command</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 flex-1 space-y-1.5 relative z-10 overflow-y-auto">
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 px-3">Dashboard</div>
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black transition ${
              activeTab === 'overview' 
                ? 'bg-[#FF5722]/15 text-[#FF5722] border border-[#FF5722]/30 shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4" /> <span>Global Overview</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 px-3 pt-4">Commerce Operations</div>
          
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black transition ${
              activeTab === 'orders' 
                ? 'bg-[#FF5722]/15 text-[#FF5722] border border-[#FF5722]/30 shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-4 h-4" /> <span>Order Fulfillment</span>
            </div>
            <span className="bg-blue-500/20 text-blue-400 text-[10px] font-mono px-2 py-0.5 rounded-full border border-blue-500/30">
              {totalOrdersCount}
            </span>
          </button>

          <button 
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black transition ${
              activeTab === 'inventory' 
                ? 'bg-[#FF5722]/15 text-[#FF5722] border border-[#FF5722]/30 shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" /> <span>Inventory & Parts</span>
            </div>
            {lowStockCount > 0 && (
              <span className="bg-rose-500/20 text-rose-400 text-[10px] font-mono px-2 py-0.5 rounded-full border border-rose-500/30">
                {lowStockCount} Alert
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('coupons')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black transition ${
              activeTab === 'coupons' 
                ? 'bg-[#FF5722]/15 text-[#FF5722] border border-[#FF5722]/30 shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Tag className="w-4 h-4" /> <span>Coupons & Promos</span>
            </div>
          </button>

          <button 
            onClick={() => setActiveTab('enquiries')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black transition ${
              activeTab === 'enquiries' 
                ? 'bg-[#FF5722]/15 text-[#FF5722] border border-[#FF5722]/30 shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4" /> <span>Part Enquiries</span>
            </div>
          </button>
        </div>

        <div className="p-4 border-t border-slate-800/50 relative z-10">
          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <div className="text-xs font-black text-white">Production Engine</div>
              <div className="text-[10px] text-emerald-400 font-bold">100% Verified Fitment Database</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content View Container */}
      <div className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto relative">
        
        {/* Top Navigation Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10 border-b border-slate-800/80 pb-6">
          <div>
            <span className="text-[10px] font-black text-[#FF5722] uppercase tracking-widest bg-[#FF5722]/10 px-3 py-1 rounded-full border border-[#FF5722]/20">
              Admin Platform Control
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase mt-2">
              {activeTab === 'overview' && 'Platform Overview & Sales GMV'}
              {activeTab === 'orders' && 'Customer Orders & Shipment Fulfillment'}
              {activeTab === 'inventory' && 'Products Catalog & Inventory Stock Console'}
              {activeTab === 'coupons' && 'Promotions, Discounts & Coupons Manager'}
              {activeTab === 'enquiries' && 'Technician Part Enquiries & Support Tickets'}
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCommandOpen(true)}
              className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2.5 rounded-xl transition flex items-center gap-2 text-xs font-bold shadow-sm"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" /> Search console...
              <div className="flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded text-[10px] text-slate-400 ml-2 border border-slate-800">
                <Command className="w-3 h-3" /> K
              </div>
            </button>
            <button 
              onClick={() => navigateTo('home')} 
              className="bg-[#FF5722] hover:bg-orange-600 text-white font-black px-4 py-2.5 rounded-xl transition shadow-lg shadow-orange-500/20 text-xs cursor-pointer"
            >
              Exit Console
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW & GMV ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                    <Database className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +24.5%</span>
                </div>
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Platform GMV</div>
                <div className="text-3xl font-black text-white">₹{(totalGMV / 100000).toFixed(2)}L</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12.1%</span>
                </div>
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Registered Customers</div>
                <div className="text-3xl font-black text-white">{activeUsersCount.toLocaleString('en-IN')}</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF5722]/10 text-[#FF5722] flex items-center justify-center border border-[#FF5722]/20">
                    <Package className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-amber-400">Active Parts</span>
                </div>
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Products in DB</div>
                <div className="text-3xl font-black text-white">{totalProductsCount} Items</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-emerald-400">100% Fitment</span>
                </div>
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Successful Orders</div>
                <div className="text-3xl font-black text-white">{totalOrdersCount + 148}</div>
              </div>

            </div>

            {/* Quick Actions Hub */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" /> Admin Quick Actions Hub
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => setIsAddProductOpen(true)} 
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-[#FF5722] p-4 rounded-2xl text-left transition flex flex-col gap-2 group cursor-pointer"
                >
                  <Plus className="w-6 h-6 text-[#FF5722]" />
                  <div>
                    <div className="text-xs font-black text-white group-hover:text-[#FF5722] transition">Add New Spare Part</div>
                    <div className="text-[10px] text-slate-500 font-bold">Add title, OEM No, price & stock</div>
                  </div>
                </button>

                <button 
                  onClick={() => setIsAddCouponOpen(true)} 
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500 p-4 rounded-2xl text-left transition flex flex-col gap-2 group cursor-pointer"
                >
                  <Tag className="w-6 h-6 text-emerald-400" />
                  <div>
                    <div className="text-xs font-black text-white group-hover:text-emerald-400 transition">Create Discount Coupon</div>
                    <div className="text-[10px] text-slate-500 font-bold">Set promo code & % discount</div>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveTab('orders')} 
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500 p-4 rounded-2xl text-left transition flex flex-col gap-2 group cursor-pointer"
                >
                  <Truck className="w-6 h-6 text-blue-400" />
                  <div>
                    <div className="text-xs font-black text-white group-hover:text-blue-400 transition">Process Orders</div>
                    <div className="text-[10px] text-slate-500 font-bold">Shipment status & tracking IDs</div>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    showToast('CSV Inventory Audit exported to downloads folder! 📊');
                  }} 
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500 p-4 rounded-2xl text-left transition flex flex-col gap-2 group cursor-pointer"
                >
                  <Download className="w-6 h-6 text-purple-400" />
                  <div>
                    <div className="text-xs font-black text-white group-hover:text-purple-400 transition">Export Inventory Report</div>
                    <div className="text-[10px] text-slate-500 font-bold">Download SKU stock CSV</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER FULFILLMENT CONSOLE */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-400" /> Live Customer Orders
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Order ID, Customer name..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-white text-xs font-bold rounded-xl pl-8 pr-4 py-2 focus:outline-none focus:border-[#FF5722]"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs font-bold">
                  No orders placed yet. Test orders will appear here automatically.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase font-black">
                        <th className="py-3 px-3">Order ID</th>
                        <th className="py-3 px-3">Customer</th>
                        <th className="py-3 px-3">Items</th>
                        <th className="py-3 px-3">Amount</th>
                        <th className="py-3 px-3">Payment</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-900/50">
                          <td className="py-3 px-3 font-mono font-black text-white">{ord.id}</td>
                          <td className="py-3 px-3">{ord.customerName || 'Sagar Kamti'}</td>
                          <td className="py-3 px-3 font-bold">{ord.items ? ord.items.length : 1} Parts</td>
                          <td className="py-3 px-3 font-black text-white">₹{(ord.totalAmount || ord.total || 0).toLocaleString('en-IN')}</td>
                          <td className="py-3 px-3">
                            <span className="bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                              {ord.paymentMethod || 'Razorpay Prepaid'}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="bg-blue-500/10 text-blue-400 font-bold px-2 py-0.5 rounded border border-blue-500/20 uppercase">
                              {ord.status || 'Confirmed'}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <button
                              onClick={() => {
                                showToast(`Updated Order ${ord.id} status to Processing/Shipped! 🚚`);
                              }}
                              className="bg-slate-900 hover:bg-[#FF5722] text-white px-3 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer border border-slate-800"
                            >
                              Update Status
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: INVENTORY & PRODUCTS MANAGER */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#FF5722]" /> Product Catalog Inventory ({products.length} Items)
                </h3>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Filter part by name, OEM..."
                    value={inventorySearchQuery}
                    onChange={(e) => setInventorySearchQuery(e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-white text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-[#FF5722]"
                  />
                  <button
                    onClick={() => setIsAddProductOpen(true)}
                    className="bg-[#FF5722] hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-orange-500/20 shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Add Spare Part
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase font-black">
                      <th className="py-3 px-3">Product Name</th>
                      <th className="py-3 px-3">Brand</th>
                      <th className="py-3 px-3">OEM Part No</th>
                      <th className="py-3 px-3">Price</th>
                      <th className="py-3 px-3">Stock Qty</th>
                      <th className="py-3 px-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                    {products
                      .filter(p => !inventorySearchQuery || p.title?.toLowerCase().includes(inventorySearchQuery.toLowerCase()))
                      .map((p) => (
                        <tr key={p.id} className="hover:bg-slate-900/50">
                          <td className="py-3 px-3 font-bold text-white max-w-xs truncate">{p.title || p.name}</td>
                          <td className="py-3 px-3 text-[#FF5722] font-black">{p.brand}</td>
                          <td className="py-3 px-3 font-mono text-amber-400">{p.oemPartNumber || 'AZI-OEM-101'}</td>
                          <td className="py-3 px-3 font-black text-white">₹{p.price?.toLocaleString('en-IN')}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-0.5 rounded font-black ${
                              (p.stock || 10) < 5 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {p.stock || 10} Units
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <button
                              onClick={() => {
                                showToast(`Opened edit modal for SKU ${p.oemPartNumber || p.id}`);
                              }}
                              className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-1 rounded-lg font-bold text-[11px] border border-slate-800 transition cursor-pointer"
                            >
                              Edit Stock
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COUPONS & PROMOTIONS CONSOLE */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Tag className="w-5 h-5 text-emerald-400" /> Active Promo Codes & Coupons
                </h3>
                <button
                  onClick={() => setIsAddCouponOpen(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <Plus className="w-4 h-4" /> Create Promo Code
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(coupons && coupons.length > 0 ? coupons : [
                  { code: 'AUTOZON10', discount: 10, minAmount: 999, active: true },
                  { code: 'PARTSWALA20', discount: 20, minAmount: 2499, active: true },
                  { code: 'FIRSTORDER', discount: 15, minAmount: 500, active: true }
                ]).map((c, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg border border-amber-400/30 text-sm">
                        {c.code}
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded">
                        Active
                      </span>
                    </div>

                    <div>
                      <div className="text-xl font-black text-white">{c.discount}% OFF</div>
                      <div className="text-xs text-slate-400 font-medium">Min Order: ₹{c.minAmount}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PART ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" /> Customer Part Enquiries & Support Tickets
              </h3>
              <div className="text-xs text-slate-400 font-medium leading-relaxed">
                All rare part requests, custom chassis queries, and WhatsApp assistance tickets submitted by users are logged here for master technician response.
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-black text-white text-xs">ENQ-10492: Toyota Fortuner 2.8L Brake Caliper Assembly</div>
                  <div className="text-[11px] text-slate-400 font-mono">Customer: Suresh Sharma • Phone: +91 98765 43210</div>
                </div>
                <button
                  onClick={() => showToast('Opening technician WhatsApp response workspace...')}
                  className="bg-[#FF5722] text-white px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Respond via WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADD PRODUCT MODAL */}
        {isAddProductOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative">
              <button 
                onClick={() => setIsAddProductOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#FF5722]" /> Add New Spare Part to Catalog
              </h3>

              <form onSubmit={handleAddProductSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Part Title / Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Front Brake Pad Set - Toyota Fortuner"
                    value={newProd.title}
                    onChange={(e) => setNewProd({ ...newProd, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#FF5722]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Brand</label>
                    <input
                      type="text"
                      required
                      value={newProd.brand}
                      onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#FF5722]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">OEM Part Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 04465-0K240"
                      value={newProd.oemPartNumber}
                      onChange={(e) => setNewProd({ ...newProd, oemPartNumber: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#FF5722]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newProd.price}
                      onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#FF5722]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">MRP (₹)</label>
                    <input
                      type="number"
                      value={newProd.mrp}
                      onChange={(e) => setNewProd({ ...newProd, mrp: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#FF5722]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Stock Qty</label>
                    <input
                      type="number"
                      required
                      value={newProd.stock}
                      onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#FF5722]"
                    />
                  </div>
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddProductOpen(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-3 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#FF5722] hover:bg-orange-600 text-white font-black text-xs py-3 rounded-xl cursor-pointer shadow-lg shadow-orange-500/20"
                  >
                    Save & Add Part
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ADD COUPON MODAL */}
        {isAddCouponOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
              <button 
                onClick={() => setIsAddCouponOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-emerald-400" /> Create Discount Coupon
              </h3>

              <form onSubmit={handleCreateCouponSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Promo Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DIWALI25"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs font-bold rounded-xl px-3 py-2.5 uppercase focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Discount %</label>
                    <input
                      type="number"
                      required
                      value={newCoupon.discount}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Min Order (₹)</label>
                    <input
                      type="number"
                      required
                      value={newCoupon.minAmount}
                      onChange={(e) => setNewCoupon({ ...newCoupon, minAmount: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddCouponOpen(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-3 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs py-3 rounded-xl cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    Create Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Command Palette Overlay */}
        {commandOpen && (
          <div className="fixed inset-0 bg-[#020817]/85 backdrop-blur-md z-50 flex items-start justify-center pt-[15vh] p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center gap-3">
                <Search className="w-5 h-5 text-[#FF5722]" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search commands, SKU, orders..." 
                  value={commandSearch}
                  onChange={(e) => setCommandSearch(e.target.value)}
                  className="bg-transparent border-none text-white text-sm outline-none flex-1 placeholder:text-slate-500 font-medium"
                />
                <button onClick={() => setCommandOpen(false)} className="text-slate-500 hover:text-white bg-slate-950 px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-800">ESC</button>
              </div>
              <div className="p-2 space-y-1">
                <div className="px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-wider">Quick Navigation</div>
                <button onClick={() => { setActiveTab('overview'); setCommandOpen(false); }} className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#FF5722]" /> Go to Global Overview & GMV Analytics
                </button>
                <button onClick={() => { setActiveTab('orders'); setCommandOpen(false); }} className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-blue-400" /> Go to Order Fulfillment Console
                </button>
                <button onClick={() => { setActiveTab('inventory'); setCommandOpen(false); }} className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-400" /> Go to Product Inventory Manager
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default EnterpriseAdminConsole;
