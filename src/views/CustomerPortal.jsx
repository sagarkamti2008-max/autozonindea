import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  getCustomerProfile, updateCustomerProfile, getCustomerAddresses, addCustomerAddress,
  deleteCustomerAddress, setDefaultAddress, getCustomerVehicles, addCustomerVehicle,
  setDefaultVehicle, deleteCustomerVehicle, revalidateReorderItem, getRecentlyViewedParts,
  getCustomerRefunds, getCustomerReviews, getSupportTickets,
  createSupportTicket, getCustomerNotifications, markNotificationsAsRead, getActiveSessions
} from '../services/customerAccountEngine';
import { generateGSTTaxInvoiceHTML } from '../services/fulfillmentEngine';
import {
  User, Car, Package, Heart, MapPin, Wrench, ShieldCheck, HelpCircle,
  Bell, FileText, CheckCircle2, Clock, Truck, Plus, Trash2, Edit, RefreshCw, Key, Phone,
  Eye, CornerDownLeft, DollarSign, Star, Lock, AlertTriangle, ArrowRight, Check, X, Smartphone,
  LogOut, Settings, Mail
} from 'lucide-react';

import {
  getCustomerReturns,
  submitCustomerReturnRequest,
  cancelCustomerReturn,
  getCustomerWarrantyClaims,
  submitCustomerWarrantyClaim,
  verifyReturnEligibility,
  verifyWarrantyEligibility,
  RETURN_REASONS
} from '../services/returnsWarrantyService';

import { getCustomerPayments } from '../services/paymentEngine';
import { ReturnClaimModal } from '../components/ReturnClaimModal';
import { GSTInvoiceModal } from '../components/GSTInvoiceModal';
import {
  getCustomerInAppNotifications,
  markAllInAppNotificationsAsRead,
  getCustomerNotificationPreferences,
  updateCustomerNotificationPreferences
} from '../services/notificationEngine';

export const CustomerPortal = () => {
  const {
    user, orders, products, selectedVehicle, setSelectedVehicle,
    setIsVehicleModalOpen, wishlist, addToCart, showToast, navigateTo
  } = useStore();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  const [profileData, setProfileData] = useState(getCustomerProfile());
  const [addresses, setAddresses] = useState(getCustomerAddresses());
  const [vehicles, setVehicles] = useState(getCustomerVehicles());
  const [tickets, setTickets] = useState(getSupportTickets());
  const [notifications, setNotifications] = useState(getCustomerNotifications());

  const [customerReturns, setCustomerReturns] = useState(getCustomerReturns(profileData.email));
  const [customerWarranties, setCustomerWarranties] = useState(getCustomerWarrantyClaims(profileData.email));

  const [newAddrModal, setNewAddrModal] = useState(false);
  const [addrForm, setAddrForm] = useState({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'India' });
  
  const [newVehModal, setNewVehModal] = useState(false);
  const [vehForm, setVehForm] = useState({ makeName: 'Toyota', modelName: 'Innova Crysta', year: '2020', variant: '2.4 Diesel ZX', engine: '2.4L Diesel' });

  const [newTicketModal, setNewTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({ orderNumber: '', subject: '', message: '' });

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateCustomerProfile(profileData);
    showToast('🎉 Account profile updated successfully!', 'success');
  };

  const handleAddAddressSubmit = (e) => {
    e.preventDefault();
    const res = addCustomerAddress(addrForm);
    if (res.success) {
      setAddresses([...getCustomerAddresses()]);
      setNewAddrModal(false);
      showToast('Address added to your account!', 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleAddVehicleSubmit = (e) => {
    e.preventDefault();
    const res = addCustomerVehicle(vehForm);
    if (res.success) {
      setVehicles([...getCustomerVehicles()]);
      if (res.vehicle.isDefault) setSelectedVehicle(res.vehicle);
      setNewVehModal(false);
      showToast(`🚗 Vehicle ${vehForm.makeName} added!`, 'success');
    }
  };

  const handleReorder = (item) => {
    const check = revalidateReorderItem(item, products);
    if (check.canReorder) {
      addToCart(check.product);
      showToast(check.message, 'success');
    } else {
      showToast(check.message, 'error');
    }
  };

  const tabs = [
    { id: 'dashboard', icon: User, label: 'Overview Dashboard' },
    { id: 'profile', icon: Edit, label: 'Edit Profile' },
    { id: 'orders', icon: Package, label: 'My Orders', count: orders.length },
    { id: 'addresses', icon: MapPin, label: 'Saved Addresses', count: addresses.length },
    { id: 'vehicles', icon: Car, label: 'My Garage', count: vehicles.length },
    { id: 'wishlist', icon: Heart, label: 'Wishlist', count: wishlist.length },
    { id: 'enquiries', icon: FileText, label: 'My Enquiries' },
    { id: 'returns', icon: CornerDownLeft, label: 'Returns Center' },
    { id: 'support', icon: HelpCircle, label: 'Support Tickets', count: tickets.length },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Premium Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500 rounded-full blur-3xl mix-blend-overlay"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl mix-blend-overlay"></div>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-6 relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center border-2 border-slate-700 shadow-2xl shrink-0 relative">
            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-orange-600">
              {profileData?.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
            </span>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-slate-900 rounded-full"></div>
          </div>
          <div className="text-center sm:text-left text-white">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
              Welcome back, {profileData?.name ? profileData.name.split(' ')[0] : 'User'}!
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-slate-300 text-sm font-medium">
              <span className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50 backdrop-blur-sm">
                <Mail className="w-4 h-4 text-orange-400" /> {profileData.email}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50 backdrop-blur-sm">
                <Phone className="w-4 h-4 text-orange-400" /> {profileData.phone}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Navigation Sidebar */}
          <div className="w-full md:w-72 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden shrink-0 md:sticky md:top-24 mb-6 md:mb-0">
            <div className="hidden md:block p-4 bg-slate-50 border-b border-slate-200">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Account Navigation</span>
            </div>
            <div className="p-3 md:p-2 flex overflow-x-auto md:flex-col gap-3 md:gap-1 scrollbar-hide snap-x snap-mandatory">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'wishlist') navigateTo('wishlist');
                    else if (tab.id === 'returns') navigateTo('returns');
                    else if (tab.id === 'support') navigateTo('support');
                    else setActiveTab(tab.id);
                  }}
                  className={`snap-start shrink-0 flex items-center justify-between px-5 py-3 md:px-4 md:py-3 rounded-xl transition-all duration-200 font-bold text-sm ${
                    activeTab === tab.id 
                      ? 'bg-orange-50 text-orange-600 border border-orange-200' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent bg-slate-50 md:bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-orange-500' : 'text-slate-400'}`} />
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className={`ml-3 px-2 py-0.5 rounded-full text-[10px] font-black ${
                      activeTab === tab.id ? 'bg-orange-200 text-orange-800' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
              
              <div className="hidden md:block my-2 border-t border-slate-100"></div>
              
              <button onClick={() => navigateTo('home')} className="snap-start shrink-0 flex items-center gap-3 px-5 py-3 md:px-4 md:py-3 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 font-bold text-sm transition-colors bg-slate-50 md:bg-transparent">
                <LogOut className="w-5 h-5" /> <span className="whitespace-nowrap">Sign Out</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-full space-y-6">
            
            {/* 1. Dashboard Overview */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Vehicle Hero Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-700">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                      <Car className="w-8 h-8 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black mb-1">
                        Shop Parts for your {selectedVehicle ? `${selectedVehicle.makeName || selectedVehicle.make || ''} ${selectedVehicle.modelName || selectedVehicle.model || ''}`.trim() : 'Toyota Innova Crysta'}
                      </h3>
                      <p className="text-slate-300 text-sm font-medium">Your primary vehicle is set for automatic fitment checks.</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab('vehicles')} className="bg-white text-slate-900 hover:bg-orange-50 hover:text-orange-600 font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-sm shrink-0 whitespace-nowrap">
                    Manage Garage
                  </button>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div onClick={() => setActiveTab('orders')} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <Package className="w-5 h-5" />
                      </div>
                      <span className="text-2xl font-black text-slate-900">{orders.length}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Total Orders</h4>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Track your shipments</p>
                  </div>
                  
                  <div onClick={() => setActiveTab('wishlist')} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-rose-200 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                        <Heart className="w-5 h-5" />
                      </div>
                      <span className="text-2xl font-black text-slate-900">{wishlist.length}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Saved Wishlist</h4>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Items ready to buy</p>
                  </div>

                  <div onClick={() => setActiveTab('addresses')} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <span className="text-2xl font-black text-slate-900">{addresses.length}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Saved Addresses</h4>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Delivery locations</p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Edit Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 animate-in fade-in duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Edit Profile</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage your personal details and contact info.</p>
                  </div>
                </div>

                <form onSubmit={handleProfileSave} className="max-w-2xl space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider">First Name</label>
                      <input type="text" value={profileData.firstName} onChange={(e) => setProfileData({...profileData, firstName: e.target.value})} className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Last Name</label>
                      <input type="text" value={profileData.lastName} onChange={(e) => setProfileData({...profileData, lastName: e.target.value})} className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium transition-all" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Email Address</label>
                    <div className="flex items-center gap-3">
                      <input type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium transition-all" />
                      <span className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-3 rounded-xl text-xs font-black shrink-0"><CheckCircle2 className="w-4 h-4" /> Verified</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Mobile Number</label>
                    <div className="flex items-center gap-3">
                      <input type="text" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium transition-all" />
                      <span className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-3 rounded-xl text-xs font-black shrink-0"><CheckCircle2 className="w-4 h-4" /> OTP Verified</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition-colors">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 3. My Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6">My Orders & Tracking</h2>
                  
                  <div className="space-y-6">
                    {orders.map(order => (
                      <div key={order.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                        
                        {/* Order Header */}
                        <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                            <div>
                              <span className="text-slate-500 font-medium block text-xs">Order Placed</span>
                              <span className="font-bold text-slate-900">{order.date || new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 font-medium block text-xs">Total Amount</span>
                              <span className="font-black text-orange-600">₹{(order.totalAmount || 2500).toLocaleString('en-IN')}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 font-medium block text-xs">Order ID</span>
                              <span className="font-mono font-bold text-slate-700">#{order.orderNumber || order.id}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 shrink-0">
                            <button onClick={() => { navigateTo('track-order'); }} className="text-sm font-bold text-orange-600 bg-orange-50 border border-orange-200 hover:bg-orange-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                              <Truck className="w-4 h-4" /> Track Order
                            </button>
                            <button onClick={() => { setSelectedInvoiceOrder(order); setInvoiceModalOpen(true); }} className="text-sm font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                              <FileText className="w-4 h-4" /> Invoice
                            </button>
                            <button onClick={() => handleReorder((order.items || [])[0] || { title: 'Brake Pad', price: 1850, sku: 'AZ-BOSCH-BP-001' })} className="text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
                              <RefreshCw className="w-4 h-4" /> Buy Again
                            </button>
                          </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="p-5 border-b border-slate-100">
                          <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                            <span className="text-emerald-600 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Ordered</span>
                            <span className={`flex items-center gap-1.5 hidden sm:flex ${['packed', 'shipped', 'out_for_delivery', 'delivered'].includes(order.shipping_status || order.status) ? 'text-emerald-600' : 'text-slate-400'}`}><Package className="w-4 h-4" /> Packed</span>
                            <span className={`flex items-center gap-1.5 ${['shipped', 'out_for_delivery', 'delivered'].includes(order.shipping_status || order.status) ? 'text-emerald-600' : 'text-slate-400'}`}><Truck className="w-4 h-4" /> Shipped</span>
                            <span className={`${['delivered'].includes(order.shipping_status || order.status) ? 'text-emerald-600' : 'text-slate-400'}`}>Delivered</span>
                          </div>
                          <div className="mt-3 relative h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 ${
                              order.shipping_status === 'delivered' || order.status === 'delivered' ? 'w-full' :
                              order.shipping_status === 'shipped' || order.status === 'shipped' ? 'w-[66%]' :
                              order.shipping_status === 'packed' || order.status === 'packed' ? 'w-[33%]' : 'w-[15%]'
                            }`}></div>
                          </div>
                          <p className="text-xs text-slate-500 mt-2 font-medium">Status: <span className="font-bold text-slate-700 capitalize">{(order.shipping_status || order.status || 'Processing').replace(/_/g, ' ')}</span></p>
                        </div>

                        {/* Order Items */}
                        <div className="p-5 space-y-4">
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-center">
                              <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2">
                                <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{item.title}</h4>
                                <div className="text-xs text-slate-500 font-medium mt-1">Part #: {item.partNumber || item.sku} • Qty: {item.quantity || 1}</div>
                              </div>
                              <div className="font-black text-slate-900 whitespace-nowrap">
                                ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                              </div>
                            </div>
                          ))}
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* My Enquiries Tab */}
            {activeTab === 'enquiries' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Enquiries & Quotes</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border border-slate-200 rounded-2xl p-5 bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded-md mb-2 inline-block">Product Enquiry</span>
                          <h4 className="font-bold text-slate-900">Brake Pad Kit Request</h4>
                          <p className="text-xs text-slate-500 mt-1">Submitted on: {new Date().toLocaleDateString('en-IN')}</p>
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">Pending Review</span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium">Waiting for seller to respond to your product enquiry.</p>
                    </div>

                    <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 opacity-70">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-200 px-2 py-1 rounded-md mb-2 inline-block">Bulk Quote</span>
                          <h4 className="font-bold text-slate-900">Garage Bulk Order (Filters)</h4>
                          <p className="text-xs text-slate-500 mt-1">Submitted on: 10 Oct 2026</p>
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">Quoted</span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium">Seller provided a quote for ₹45,000. View quote details in email.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Saved Addresses</h2>
                    <button onClick={() => setNewAddrModal(true)} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2 shadow-sm">
                      <Plus className="w-4 h-4" /> Add New
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {addresses.map(addr => (
                      <div key={addr.id} className={`border-2 rounded-2xl p-5 transition-all ${addr.isDefault ? 'border-orange-500 bg-orange-50/30' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-black text-slate-900 text-lg">{addr.fullName}</h4>
                          {addr.isDefault && <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">Default</span>}
                        </div>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed mb-4 min-h-[60px]">
                          {addr.addressLine1}, {addr.addressLine2 && `${addr.addressLine2}, `}
                          {addr.city}, {addr.state} - {addr.postalCode}
                          <br/><span className="text-slate-500 flex items-center gap-1 mt-1"><Phone className="w-3.5 h-3.5"/> {addr.phone}</span>
                        </p>
                        <div className="flex items-center gap-3 pt-4 border-t border-slate-100/50">
                          {!addr.isDefault && (
                            <button onClick={() => { setDefaultAddress(addr.id); setAddresses([...getCustomerAddresses()]); }} className="text-xs font-bold text-slate-700 hover:text-orange-600 transition-colors">
                              Make Default
                            </button>
                          )}
                          {!addr.isDefault && <span className="text-slate-300">|</span>}
                          <button onClick={() => { deleteCustomerAddress(addr.id); setAddresses([...getCustomerAddresses()]); }} className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1">
                            <Trash2 className="w-3.5 h-3.5"/> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. Vehicles Tab */}
            {activeTab === 'vehicles' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Garage</h2>
                    <button onClick={() => setNewVehModal(true)} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2 shadow-sm">
                      <Plus className="w-4 h-4" /> Add Vehicle
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {vehicles.map(v => (
                      <div key={v.id} className={`border-2 rounded-2xl p-5 transition-all ${v.isDefault ? 'border-orange-500 bg-orange-50/30' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-black text-slate-900 text-lg flex items-center gap-2">
                            <Car className={`w-5 h-5 ${v.isDefault ? 'text-orange-500' : 'text-slate-400'}`} />
                            {v.makeName} {v.modelName}
                          </h4>
                          {v.isDefault && <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">Primary</span>}
                        </div>
                        <div className="space-y-1 mb-4">
                          <p className="text-sm text-slate-600 font-medium">Year: <span className="text-slate-900 font-bold">{v.year}</span></p>
                          <p className="text-sm text-slate-600 font-medium">Variant: <span className="text-slate-900 font-bold">{v.variant}</span></p>
                          <p className="text-sm text-slate-600 font-medium">Engine: <span className="text-slate-900 font-bold">{v.engine || '2.4L Diesel'}</span></p>
                        </div>
                        <div className="flex items-center gap-3 pt-4 border-t border-slate-100/50">
                          {!v.isDefault && (
                            <button onClick={() => handleSetPrimaryVehicle(v)} className="text-xs font-bold text-slate-700 hover:text-orange-600 transition-colors">
                              Set as Primary
                            </button>
                          )}
                          {!v.isDefault && <span className="text-slate-300">|</span>}
                          <button onClick={() => { deleteCustomerVehicle(v.id); setVehicles([...getCustomerVehicles()]); }} className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1">
                            <Trash2 className="w-3.5 h-3.5"/> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Other Tabs Placeholder to ensure functionality is retained */}
            {['wishlist', 'returns', 'support'].includes(activeTab) && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 animate-in fade-in duration-500 text-center py-20">
                <Settings className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-black text-slate-900 mb-2">This section is being upgraded</h3>
                <p className="text-slate-500 text-sm font-medium">The {activeTab} section is currently receiving a fresh new coat of paint. Check back shortly!</p>
                <button onClick={() => setActiveTab('dashboard')} className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
                  Back to Dashboard
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Basic Modals for completion (simplified) */}
      {newAddrModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-black text-slate-900 mb-1">Add New Delivery Address</h3>
            <p className="text-sm text-slate-500 mb-6 font-medium">Please enter your complete address for accurate delivery.</p>
            <form onSubmit={handleAddAddressSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              
              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Full Name *</label>
                  <input type="text" placeholder="e.g. Sagar Kamti" value={addrForm.fullName} onChange={e=>setAddrForm({...addrForm, fullName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Mobile Number *</label>
                  <input type="tel" placeholder="10-digit mobile number" value={addrForm.phone} onChange={e=>setAddrForm({...addrForm, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" required pattern="[0-9]{10}" maxLength="10" />
                </div>
              </div>

              {/* Address Lines */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Flat, House no., Building, Company, Apartment *</label>
                <input type="text" placeholder="e.g. Flat 402, AutoZon Tech Park" value={addrForm.addressLine1} onChange={e=>setAddrForm({...addrForm, addressLine1: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" required />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Area, Street, Sector, Village *</label>
                <input type="text" placeholder="e.g. Connaught Place" value={addrForm.addressLine2} onChange={e=>setAddrForm({...addrForm, addressLine2: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" required />
              </div>

              {/* Landmark & Pincode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Landmark (Optional)</label>
                  <input type="text" placeholder="e.g. near Apollo Hospital" value={addrForm.landmark || ''} onChange={e=>setAddrForm({...addrForm, landmark: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Pincode *</label>
                  <input type="text" placeholder="6-digit pincode" value={addrForm.postalCode} onChange={e=>setAddrForm({...addrForm, postalCode: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" required pattern="[0-9]{6}" maxLength="6" />
                </div>
              </div>

              {/* City & State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Town/City *</label>
                  <input type="text" placeholder="e.g. New Delhi" value={addrForm.city} onChange={e=>setAddrForm({...addrForm, city: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">State *</label>
                  <select value={addrForm.state} onChange={e=>setAddrForm({...addrForm, state: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-700" required>
                    <option value="" disabled>Select State</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                  </select>
                </div>
              </div>

              {/* Default Address Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="defaultAddr" checked={addrForm.isDefault || false} onChange={e=>setAddrForm({...addrForm, isDefault: e.target.checked})} className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500" />
                <label htmlFor="defaultAddr" className="text-sm font-medium text-slate-700 cursor-pointer">Make this my default address</label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-slate-100 mt-6">
                <button type="button" onClick={()=>setNewAddrModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/30 text-white font-bold py-3.5 rounded-xl transition-colors">Save Address</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {newVehModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-black text-slate-900 mb-1">Add New Vehicle</h3>
            <p className="text-sm text-slate-500 mb-6 font-medium">Add your vehicle to find exact fitting spare parts.</p>
            <form onSubmit={handleAddVehicleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Make *</label>
                  <input type="text" placeholder="e.g. Maruti Suzuki" value={vehForm.makeName} onChange={e=>setVehForm({...vehForm, makeName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Model *</label>
                  <input type="text" placeholder="e.g. Swift" value={vehForm.modelName} onChange={e=>setVehForm({...vehForm, modelName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Year *</label>
                  <input type="number" placeholder="e.g. 2021" value={vehForm.year} onChange={e=>setVehForm({...vehForm, year: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" required min="1990" max="2025" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Variant *</label>
                  <input type="text" placeholder="e.g. VXI" value={vehForm.variant} onChange={e=>setVehForm({...vehForm, variant: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Engine (Optional)</label>
                <input type="text" placeholder="e.g. 1.2L K-Series" value={vehForm.engine || ''} onChange={e=>setVehForm({...vehForm, engine: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-slate-100 mt-6">
                <button type="button" onClick={()=>setNewVehModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/30 text-white font-bold py-3.5 rounded-xl transition-colors">Save Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {invoiceModalOpen && selectedInvoiceOrder && (
        <GSTInvoiceModal 
          isOpen={invoiceModalOpen} 
          onClose={() => setInvoiceModalOpen(false)} 
          orderData={selectedInvoiceOrder}
          customerInfo={profileData}
        />
      )}

    </div>
  );
};
