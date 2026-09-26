import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  CheckCircle2, Package, Truck, Calendar, MapPin, CreditCard,
  MessageSquare, ArrowRight, FileText, ShoppingBag, ShieldCheck
} from 'lucide-react';

export function OrderConfirmView() {
  const { orders, navigateTo } = useStore();

  const latestOrder = (orders && orders.length > 0) ? orders[0] : {
    id: 'ord-101',
    order_number: 'AZI-2026-0001',
    created_at: new Date().toISOString(),
    total_amount: 3200,
    payment_method: 'Online (UPI / Credit Card)',
    payment_status: 'Paid',
    address: {
      fullName: 'Rahul Sharma',
      phone: '+91 9876543210',
      address_line: 'Flat 402, Green Acres Apt',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    },
    items: [
      { id: 1, name: 'Toyota Glanza Front Brake Pad Assembly', quantity: 1, price: 2850, image: '/images/piston_set.jpg' },
      { id: 2, name: 'Bosch DOT 4 Brake Fluid (500ml)', quantity: 1, price: 350, image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=300&q=80' }
    ]
  };

  const orderNum = latestOrder.order_number || latestOrder.orderNumber || latestOrder.id || 'AZI-2026-0001';
  const formattedAddress = typeof latestOrder.address === 'string'
    ? latestOrder.address
    : `${latestOrder.address?.fullName || 'Rahul Sharma'} (${latestOrder.address?.phone || '+91 9876543210'}), ${latestOrder.address?.address_line || 'Flat 402, Green Acres'}, ${latestOrder.address?.city || 'Mumbai'} - ${latestOrder.address?.pincode || '400001'}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Main Success Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-2xl space-y-6">
          <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="inline-block bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-3">
              Order Confirmed 🎉
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Thank You for Your Order!
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
              Your order has been placed successfully and sent for OEM quality check & dispatch.
            </p>
          </div>

          {/* Order Details Badge */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left shadow-inner">
            <div>
              <span className="text-[11px] font-black uppercase text-slate-400 block mb-1">Order Number</span>
              <span className="text-xl font-black text-amber-400 tracking-wide">{orderNum}</span>
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-slate-400 block mb-1">Expected Delivery Date</span>
              <span className="text-sm font-black text-emerald-400 flex items-center gap-1.5 mt-1">
                <Calendar className="w-4 h-4" /> Tomorrow by 4:00 PM
              </span>
            </div>
          </div>

          {/* Confirmation Notice */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-xs text-emerald-300 font-bold flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
            Order confirmation & tracking link sent to your WhatsApp & Email
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigateTo('track-order', orderNum)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 px-8 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 text-sm"
            >
              <Truck className="w-4 h-4" /> Track My Order
            </button>
            <button
              onClick={() => navigateTo('customer-invoice', orderNum)}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-8 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <FileText className="w-4 h-4 text-amber-400" /> View Tax Invoice
            </button>
          </div>
        </div>

        {/* Order Summary & Delivery Address Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <h3 className="text-lg font-black text-white border-b border-slate-800 pb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" /> Order Items & Summary
          </h3>

          <div className="space-y-4">
            {(latestOrder.items || latestOrder.cartItems || []).map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                <div className="w-14 h-14 bg-white rounded-xl p-2 shrink-0 flex items-center justify-center">
                  <img src={item.image || '/images/piston_set.jpg'} alt={item.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">{item.name || item.title}</h4>
                  <div className="text-xs text-slate-400 mt-1">Qty: {item.quantity} × ₹{Number(item.price).toLocaleString('en-IN')}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-amber-400">₹{Number(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800 text-xs">
            <div>
              <span className="font-black uppercase text-slate-400 block mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" /> Delivery Address
              </span>
              <p className="text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {formattedAddress}
              </p>
            </div>

            <div>
              <span className="font-black uppercase text-slate-400 block mb-2 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" /> Payment Info
              </span>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span>Method:</span>
                  <strong className="text-white">{latestOrder.payment_method || 'Online UPI'}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Payment Status:</span>
                  <strong className="text-emerald-400">Paid / Verified</strong>
                </div>
                <div className="flex justify-between text-slate-300 pt-2 border-t border-slate-800/80 font-bold text-sm">
                  <span className="text-white">Total Amount:</span>
                  <span className="text-amber-400 font-black">₹{Number(latestOrder.total_amount || latestOrder.grandTotal || 3200).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
