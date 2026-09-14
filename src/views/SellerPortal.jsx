import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Store, Package, ShoppingBag, DollarSign, Plus, Upload, 
  BarChart3, Settings, LogOut, CheckCircle2, TrendingUp, Users,
  AlertCircle, ChevronRight, Image as ImageIcon, Box
} from 'lucide-react';

export function SellerPortal() {
  const { products, orders, showToast, navigateTo } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'add-part', 'inventory', 'orders'

  // Add Part Form State
  const [partForm, setPartForm] = useState({
    title: '', sku: '', price: '', category: 'engine', compatibility: ''
  });

  const handleAddPart = (e) => {
    e.preventDefault();
    if (!partForm.title || !partForm.price) return;
    showToast(`Successfully added ${partForm.title} to the catalog!`, 'success');
    setPartForm({ title: '', sku: '', price: '', category: 'engine', compatibility: '' });
    setActiveTab('inventory');
  };

  // Analytics Math
  const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) + 145000;
  const pendingOrders = orders.length + 12;
  const activeListings = products.length + 34;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col md:flex-row selection:bg-blue-500/30">
      
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 text-white mb-1">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Store className="w-4 h-4" />
            </div>
            <h1 className="font-black text-lg tracking-tight">Seller Portal</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">AutoZonIndia Partner</p>
        </div>
        
        <div className="p-4 flex-1 space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <BarChart3 className="w-4 h-4" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('add-part')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${activeTab === 'add-part' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Plus className="w-4 h-4" /> Add New Part
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${activeTab === 'inventory' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Package className="w-4 h-4" /> Inventory
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <ShoppingBag className="w-4 h-4" /> Orders
          </button>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => navigateTo('home')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-white hover:bg-slate-800 transition">
            <LogOut className="w-4 h-4" /> Back to Store
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Welcome back, Partner</h2>
                <p className="text-sm text-slate-500 mt-1">Here is what's happening with your store today.</p>
              </div>
              <button onClick={() => setActiveTab('add-part')} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/20 flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +14.5%</span>
                </div>
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue</div>
                <div className="text-3xl font-black text-white">₹{totalSales.toLocaleString('en-IN')}</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Pending Orders</div>
                <div className="text-3xl font-black text-white">{pendingOrders}</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Active Listings</div>
                <div className="text-3xl font-black text-white">{activeListings}</div>
              </div>
            </div>

            {/* Charts / Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-6">Top Performing Parts</h3>
                <div className="space-y-4">
                  {[
                    { name: 'BOSCH Front Brake Pads (Innova)', sales: 124, revenue: 246760 },
                    { name: 'Hyundai Genuine Oil Filter', sales: 98, revenue: 44100 },
                    { name: 'NGK Iridium Spark Plugs (Set of 4)', sales: 76, revenue: 136800 }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 font-bold">{idx + 1}</div>
                        <div>
                          <div className="text-sm font-bold text-white">{item.name}</div>
                          <div className="text-xs text-slate-500">{item.sales} Units Sold</div>
                        </div>
                      </div>
                      <div className="font-bold text-emerald-400 text-sm">₹{item.revenue.toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-6">Recent Orders</h3>
                <div className="space-y-4">
                  {[
                    { id: 'ORD-8821', status: 'Processing', time: '10 mins ago', amount: 4500 },
                    { id: 'ORD-8820', status: 'Shipped', time: '1 hour ago', amount: 1200 },
                    { id: 'ORD-8819', status: 'Processing', time: '2 hours ago', amount: 8900 }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition border border-slate-800">
                      <div>
                        <div className="text-sm font-bold text-white">{item.id}</div>
                        <div className="text-xs text-slate-500">{item.time}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white mb-1">₹{item.amount.toLocaleString('en-IN')}</div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${item.status === 'Processing' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveTab('orders')} className="w-full mt-4 py-3 text-sm font-bold text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl transition">
                  View All Orders
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Part Tab */}
        {activeTab === 'add-part' && (
          <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-white">Add New Spare Part</h2>
              <p className="text-sm text-slate-500 mt-1">List a new product on the AutoZonIndia marketplace.</p>
            </div>

            <form onSubmit={handleAddPart} className="space-y-6">
              {/* Image Upload Area */}
              <div className="bg-slate-900 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-10 text-center transition cursor-pointer group">
                <div className="w-16 h-16 bg-slate-800 text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 transition">
                  <Upload className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-white mb-1">Upload Product Images</h4>
                <p className="text-xs text-slate-500">Drag and drop or click to browse (PNG, JPG up to 5MB)</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Product Title</label>
                    <input 
                      type="text" 
                      required
                      value={partForm.title}
                      onChange={e => setPartForm({...partForm, title: e.target.value})}
                      placeholder="e.g. BOSCH Premium Brake Pads" 
                      className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">SKU / Part Number</label>
                    <input 
                      type="text" 
                      required
                      value={partForm.sku}
                      onChange={e => setPartForm({...partForm, sku: e.target.value})}
                      placeholder="e.g. BO-BP-001" 
                      className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Selling Price (₹)</label>
                    <input 
                      type="number" 
                      required
                      value={partForm.price}
                      onChange={e => setPartForm({...partForm, price: e.target.value})}
                      placeholder="0.00" 
                      className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                    <select 
                      value={partForm.category}
                      onChange={e => setPartForm({...partForm, category: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    >
                      <option value="engine">Engine Components</option>
                      <option value="brakes">Braking System</option>
                      <option value="suspension">Suspension & Steering</option>
                      <option value="electrical">Electrical & Lighting</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Vehicle Compatibility</label>
                    <input 
                      type="text" 
                      value={partForm.compatibility}
                      onChange={e => setPartForm({...partForm, compatibility: e.target.value})}
                      placeholder="e.g. Hyundai Creta 2020+" 
                      className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setActiveTab('inventory')} className="px-6 py-3 text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Publish Part
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Inventory Tab (Mock) */}
        {activeTab === 'inventory' && (
          <div className="max-w-5xl mx-auto animate-in fade-in duration-500 text-center py-20">
            <Box className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-white mb-2">Inventory Management</h2>
            <p className="text-slate-400 mb-6">Manage your product stock, prices and visibility here.</p>
            <button onClick={() => setActiveTab('add-part')} className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-xl transition inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Your First Part
            </button>
          </div>
        )}
        
        {/* Orders Tab (Mock) */}
        {activeTab === 'orders' && (
          <div className="max-w-5xl mx-auto animate-in fade-in duration-500 text-center py-20">
            <ShoppingBag className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-white mb-2">Order Management</h2>
            <p className="text-slate-400 mb-6">View, process, and ship customer orders from this tab.</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default SellerPortal;
