import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, ShieldCheck, Truck, MapPin, AlertCircle, CheckCircle2, Package, Check } from 'lucide-react';

export default function PublicTrackOrderView() {
  const { orders } = useStore();
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim() || !phone.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    // Simulate API delay
    setTimeout(() => {
      const cleanOrder = orderNumber.trim();
      const cleanPhone = phone.trim().replace(/\D/g, '');

      // 1. Find Order in local store
      const orderData = orders.find(o => o.orderNumber === cleanOrder || o.id === cleanOrder);
      
      if (!orderData) {
        setError('Order number not found. Please verify your details.');
        setLoading(false);
        return;
      }

      // 2. Verify Phone
      const orderPhoneClean = (orderData.shippingAddress?.phone || '').replace(/\D/g, '');
      if (!orderPhoneClean.endsWith(cleanPhone.slice(-4)) && cleanPhone !== orderPhoneClean) {
        // Also check if email matches just in case user entered email in phone field
        if (orderData.customer?.email?.toLowerCase() !== phone.trim().toLowerCase()) {
          setError('Verification failed. Contact details do not match order records.');
          setLoading(false);
          return;
        }
      }

      setResult({ order: orderData });
      setLoading(false);
    }, 800);
  };

  // Tracking Timeline Status Mapping
  const STATUSES = ['Pending', 'Packed', 'Shipped', 'Out for delivery', 'Delivered'];
  const getStatusIndex = (currentStatus) => {
    const statusMap = {
      'processing': 0, 'pending': 0,
      'packed': 1, 'ready_to_ship': 1,
      'shipped': 2,
      'out_for_delivery': 3,
      'delivered': 4, 'completed': 4
    };
    return statusMap[currentStatus?.toLowerCase()] || 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <div className="inline-flex p-3 bg-[#FFF7ED] border border-[#FFD8A8] rounded-2xl mb-4">
          <Truck className="w-8 h-8 text-[#FF6B00]" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#0F2167] tracking-tight font-outfit">Track Your Package</h1>
        <p className="text-slate-500 text-sm mt-2">Enter your Order Number and registered mobile number/email to check real-time delivery status</p>
      </div>

      {/* Verification & Search Form */}
      <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl mb-8">
        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Order Number</label>
            <input
              type="text"
              placeholder="e.g. AZ-ORD-12345"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6B00] font-mono tracking-wider transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Registered Mobile / Email</label>
            <input
              type="text"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6B00] transition font-mono tracking-wider"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !orderNumber.trim() || !phone.trim()}
            className="w-full py-3 bg-[#FF6B00] hover:bg-[#e66000] text-white font-extrabold rounded-xl text-sm transition disabled:opacity-50 flex items-center justify-center space-x-2 shadow-[0_4px_14px_rgba(255,107,0,0.3)]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Track Shipment</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center text-slate-500 text-xs space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Secure Encrypted Tracking. Privacy protected.</span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-xl mx-auto p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center space-x-3 mb-8">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Verified Tracking Results Card */}
      {result && (
        <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 mb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Order Reference</span>
              <h3 className="text-xl font-mono font-bold text-[#0F2167]">#{result.order.orderNumber}</h3>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 font-semibold block">Order Amount</span>
              <span className="font-extrabold text-lg text-[#0F2167]">
                ₹{result.order.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-slate-50 p-5 rounded-xl border border-slate-200 text-sm">
            <div>
              <span className="text-slate-500 block mb-1 text-xs uppercase font-bold">Estimated Delivery</span>
              <span className="font-extrabold text-[#059669]">{result.order.trackingInfo?.estimatedDelivery || '3-5 Business Days'}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1 text-xs uppercase font-bold">Payment Status</span>
              <span className="font-bold text-slate-800">{result.order.paymentInfo?.method?.toUpperCase()} • {result.order.paymentInfo?.status}</span>
            </div>
          </div>

          {/* Tracking Timeline Component */}
          <div className="mb-8 p-6 border border-slate-200 rounded-xl">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Delivery Timeline</h4>
            <div className="relative flex items-center justify-between w-full">
              {/* Progress Bar Background */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full z-0"></div>
              
              {/* Active Progress Bar */}
              <div 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-[#059669] rounded-full z-0 transition-all duration-500"
                style={{ width: `${(getStatusIndex(result.order.status) / (STATUSES.length - 1)) * 100}%` }}
              ></div>

              {/* Status Nodes */}
              {STATUSES.map((status, index) => {
                const isActive = index <= getStatusIndex(result.order.status);
                const isCurrent = index === getStatusIndex(result.order.status);
                return (
                  <div key={index} className="relative z-10 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isActive ? 'bg-[#059669] border-[#059669] text-white' : 'bg-white border-slate-300 text-slate-300'
                    }`}>
                      {isActive ? <Check className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-slate-300"></div>}
                    </div>
                    <span className={`absolute top-10 text-[0.65rem] sm:text-xs font-bold text-center whitespace-nowrap ${
                      isCurrent ? 'text-[#059669]' : isActive ? 'text-slate-600' : 'text-slate-400'
                    }`}>
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-12 text-center text-sm text-slate-600">
              <span className="font-bold text-[#0F2167]">Current Status: </span>
              {result.order.status?.toUpperCase() || 'PROCESSING'}
            </div>
          </div>

          {/* Ordered Items List */}
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Items in this Shipment ({result.order.items?.length})</h4>
          <div className="space-y-3">
            {result.order.items?.map((item, idx) => (
              <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-4">
                <img src={item.image} alt={item.title} className="w-12 h-12 object-contain bg-slate-50 p-1 rounded-md" />
                <div className="flex-1">
                  <div className="font-bold text-sm text-[#0F2167]">{item.title}</div>
                  <div className="text-xs text-slate-500">Qty: {item.quantity} • Part No: {item.partNumber}</div>
                </div>
                <div className="font-bold text-sm text-[#0F2167]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button className="px-6 py-2 bg-slate-100 text-slate-600 font-bold text-sm rounded-lg border border-slate-200 hover:bg-slate-200 transition">
              Need Help with this Order?
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
