import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { getShipmentTracking, checkPincodeServiceability } from '../services/shippingEngine';
import {
  Search, Truck, Package, MapPin, CheckCircle2, ShieldCheck, Clock,
  AlertCircle, ArrowRight, CornerDownLeft, Phone
} from 'lucide-react';

import { LiveDeliveryTrackerModal } from '../components/LiveDeliveryTrackerModal';

export const OrderTrackingView = () => {
  const { showToast } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [pincodeCheck, setPincodeCheck] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [isLiveTrackerOpen, setIsLiveTrackerOpen] = useState(false);

  const trackingResult = getShipmentTracking(searchQuery);

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    const res = checkPincodeServiceability(pincodeCheck);
    setPincodeResult(res);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Search Bar Header */}
        <div className="bg-slate-900 rounded-[2rem] p-8 sm:p-12 text-center mb-10 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mb-6 border border-white/20">
              <Truck className="w-8 h-8 text-orange-400" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
              Track Your Order
            </h2>
            <p className="text-slate-400 font-medium mb-10 max-w-lg mx-auto">
              Enter your Order ID or Tracking Number to get real-time status updates on your AutoZon parts.
            </p>

            <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. AZ-904812"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-slate-400 rounded-xl py-4 pl-11 pr-4 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-bold"
                />
              </div>
              <button
                onClick={() => {
                  if (!searchQuery.trim()) showToast('Please enter an Order Number or Tracking Number.', 'info');
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-black py-4 px-8 rounded-xl transition-colors shadow-lg shadow-orange-500/25 shrink-0"
              >
                Track Now
              </button>
            </div>
          </div>
        </div>

        {/* Tracking Results Body */}
        {trackingResult ? (
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 sm:p-10 mb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100 mb-8">
              <div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-1">Order Details</span>
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  #{trackingResult.shipment.orderId}
                </h3>
              </div>

              <div className="flex flex-col sm:items-end gap-1">
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-lg border border-emerald-100 text-sm">
                  <CheckCircle2 className="w-4 h-4" /> {trackingResult.shipment.status}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Est. Delivery: <span className="text-slate-900">{trackingResult.estimatedDeliveryDate}</span>
                </span>
              </div>
            </div>

            {/* Carrier Info Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                  <Package className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <strong className="text-slate-900 font-bold block text-sm">Carrier: {trackingResult.carrierName}</strong>
                  <span className="text-xs text-slate-500 font-medium">Tracking #: <code className="font-mono font-bold text-slate-900 bg-slate-200/50 px-1.5 py-0.5 rounded">{trackingResult.trackingNumber}</code></span>
                </div>
              </div>

              <button
                onClick={() => setIsLiveTrackerOpen(true)}
                className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 text-sm"
              >
                <Truck className="w-4 h-4 text-orange-500" /> 
                Track Live Delivery Agent
              </button>
            </div>

            {/* Tracking Timeline */}
            <div>
              <h4 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" /> Tracking Timeline
              </h4>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent pl-12 md:pl-0">
                {trackingResult.timeline.map((item, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-emerald-500 text-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -ml-4 md:ml-0 z-10">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    
                    <div className="w-full md:w-[calc(50%-2.5rem)] bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-1">
                        <strong className="text-slate-900 font-bold text-sm">{item.event}</strong>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                          {new Date(item.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.location}
                      </div>
                      <div className="text-xs text-slate-400 font-medium mt-2">
                        {new Date(item.timestamp).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : searchQuery ? (
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-12 text-center mb-10">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No Order Found</h3>
            <p className="text-slate-500 font-medium max-w-sm mx-auto">
              We couldn't find any tracking information for "{searchQuery}". Please check the number and try again.
            </p>
          </div>
        ) : null}

        {/* PINCODE SERVICEABILITY CHECKER */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-slate-50 rounded-full border border-slate-100 -z-10"></div>
          
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" /> Check Delivery Serviceability
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                Verify express delivery and Cash on Delivery availability in your area.
              </p>
            </div>

            <div className="w-full md:w-auto flex-1">
              <form onSubmit={handlePincodeSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit Pincode"
                  value={pincodeCheck}
                  onChange={(e) => setPincodeCheck(e.target.value)}
                  maxLength={6}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                />
                <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md">
                  Check
                </button>
              </form>

              {pincodeResult && (
                <div className={`mt-4 p-4 rounded-xl border text-sm font-bold ${pincodeResult.serviceable ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                  <div className="flex items-start gap-2 mb-2">
                    {pincodeResult.serviceable ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
                    <span>{pincodeResult.message}</span>
                  </div>
                  {pincodeResult.serviceable && (
                    <div className="flex flex-wrap gap-3 mt-2 pt-2 border-t border-emerald-200/50 text-xs">
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600"/> COD Available: {pincodeResult.codAvailable ? 'Yes' : 'No'}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-600"/> Express SLA: {pincodeResult.expressHours} Hours</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <LiveDeliveryTrackerModal
        isOpen={isLiveTrackerOpen}
        onClose={() => setIsLiveTrackerOpen(false)}
      />
    </div>
  );
};

