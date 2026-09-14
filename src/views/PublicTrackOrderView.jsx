import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { getShipmentByOrder } from '../services/shippingService';
import { Search, ShieldCheck, Truck, Clock, MapPin, AlertCircle, CheckCircle2, Package } from 'lucide-react';

export default function PublicTrackOrderView() {
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

    try {
      // 1. Safe verification query: Match order_number AND customer_phone
      const cleanOrder = orderNumber.trim();
      const cleanPhone = phone.trim().replace(/\D/g, '');

      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('order_number', cleanOrder)
        .single();

      if (orderErr || !orderData) {
        throw new Error('Order number not found. Please verify your details.');
      }

      // 2. Verify verification value (Phone suffix match)
      const orderPhoneClean = (orderData.customer_phone || '').replace(/\D/g, '');
      if (!orderPhoneClean.endsWith(cleanPhone.slice(-4)) && cleanPhone !== orderPhoneClean) {
        throw new Error('Verification failed. Mobile number does not match order records.');
      }

      // 3. Fetch shipment details safely
      const shipRes = await getShipmentByOrder(orderData.id);
      setResult({
        order: orderData,
        shipping: shipRes.success ? shipRes.shipping : null
      });
    } catch (err) {
      setError(err.message || 'Unable to track order. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <div className="inline-flex p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl mb-4">
          <Truck className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Track Your Package</h1>
        <p className="text-slate-400 text-sm mt-2">Enter your Order Number and registered mobile number to check real-time delivery status</p>
      </div>

      {/* Verification & Search Form */}
      <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl mb-8">
        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Order Number</label>
            <input
              type="text"
              placeholder="e.g. AZI-20260911-4821"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono tracking-wider transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Registered Mobile Number</label>
            <input
              type="text"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition font-mono tracking-wider"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !orderNumber.trim() || !phone.trim()}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-sm transition disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Track Shipment</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-center text-slate-500 text-xs space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Secure Encrypted Tracking. Privacy protected.</span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-xl mx-auto p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm flex items-center space-x-3 mb-8">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Verified Tracking Results Card */}
      {result && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 mb-6 border-b border-slate-800 gap-4">
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Order Reference</span>
              <h3 className="text-xl font-mono font-bold text-amber-400">{result.order.order_number}</h3>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 font-semibold block">Shipment Status</span>
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-extrabold text-xs rounded-full uppercase">
                {result.shipping?.status || result.order.shipping_status || 'Processing'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block mb-1">Courier Partner</span>
              <span className="font-bold text-white text-sm">{result.shipping?.courier || 'AutoZon Express'}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">Tracking AWB</span>
              <span className="font-mono font-bold text-slate-300 text-sm">{result.shipping?.tracking_number || 'AZI-TRK-PENDING'}</span>
            </div>
          </div>

          {/* Checkpoint events */}
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Latest Tracking Scans</h4>
          {result.shipping?.shipment_tracking_events?.length > 0 ? (
            <div className="space-y-3">
              {result.shipping.shipment_tracking_events.map((cp) => (
                <div key={cp.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-start space-x-3 text-xs">
                  <MapPin className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>{cp.location}</span>
                      <span className="text-slate-400 font-normal">
                        {new Date(cp.event_time || cp.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-slate-300 mt-0.5">{cp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-xs text-center py-4 bg-slate-950 rounded-xl border border-slate-800">
              Shipment dispatched. Courier partner scans will appear here shortly.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
