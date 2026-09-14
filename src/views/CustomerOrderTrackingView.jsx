import React, { useState, useEffect } from 'react';
import { getShipmentByOrder } from '../services/shippingService';
import { supabase } from '../services/supabaseClient';
import { useStore } from '../context/StoreContext';
import { Truck, Package, CheckCircle2, Clock, MapPin, ArrowLeft, ExternalLink, AlertCircle, ShieldCheck } from 'lucide-react';

const TRACKING_STEPS = [
  { id: 'placed', label: 'Order Placed', icon: Package },
  { id: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { id: 'processing', label: 'Processing', icon: Clock },
  { id: 'packed', label: 'Packed', icon: Package },
  { id: 'shipped', label: 'Shipped', icon: Truck },
  { id: 'in_transit', label: 'In Transit', icon: MapPin },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle2 }
];

export default function CustomerOrderTrackingView() {
  const { navigateTo } = useStore();
  const getOrderNumberFromUrl = () => {
    const parts = window.location.pathname.split('/');
    const idx = parts.indexOf('orders');
    if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('orderNumber') || urlParams.get('order') || '';
  };

  const orderNumber = getOrderNumberFromUrl();
  const [loading, setLoading] = useState(true);
  const [shipment, setShipment] = useState(null);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrackingData();
  }, [orderNumber]);

  const fetchTrackingData = async () => {
    setLoading(true);
    setError('');

    try {
      // 1. Fetch order details by order_number
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .select('*, order_items(*), shipping(*)')
        .eq('order_number', orderNumber)
        .single();

      if (orderErr || !orderData) {
        throw new Error(`Order #${orderNumber} not found.`);
      }

      setOrder(orderData);

      // 2. Fetch full shipping details & checkpoints timeline
      const shipRes = await getShipmentByOrder(orderData.id);
      if (shipRes.success && shipRes.shipping) {
        setShipment(shipRes.shipping);
      } else if (orderData.shipping && orderData.shipping.length > 0) {
        setShipment(orderData.shipping[0]);
      }
    } catch (err) {
      console.error('Tracking fetch error:', err);
      setError(err.message || 'Unable to load shipment tracking details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">Fetching real-time shipment status...</p>
        </div>
      </div>
    );
  }

  const currentStatus = (shipment?.status || order?.shipping_status || order?.status || 'confirmed').toLowerCase();
  const checkpoints = shipment?.shipment_tracking_events || [];

  // Determine active step index in tracking sequence
  const getStepIndex = (status) => {
    if (status === 'delivered') return 7;
    if (status === 'out_for_delivery') return 6;
    if (status === 'in_transit') return 5;
    if (status === 'shipped') return 4;
    if (status === 'packed') return 3;
    if (status === 'processing') return 2;
    if (status === 'confirmed') return 1;
    return 0;
  };

  const activeStepIdx = getStepIndex(currentStatus);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center text-slate-400 hover:text-white transition font-medium text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
        </button>

        <span className="text-xs font-mono bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-amber-400">
          Order: {orderNumber}
        </span>
      </div>

      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
        {/* Title & Delivery Estimate */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Truck className="w-6 h-6 text-amber-500" /> Order Tracking & Status
            </h1>
            <p className="text-slate-400 text-sm mt-1">Real-time courier checkpoints and package updates</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-right">
            <span className="text-xs text-slate-500 uppercase font-semibold block mb-0.5">Estimated Delivery</span>
            <span className="text-base font-bold text-amber-400">
              {shipment?.estimated_delivery_date
                ? new Date(shipment.estimated_delivery_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : '3 - 5 Business Days'}
            </span>
          </div>
        </div>

        {/* Courier Details Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-xs text-slate-500 uppercase font-semibold block mb-1">Courier Partner</span>
            <span className="font-bold text-white text-base">{shipment?.courier || 'AutoZon Express Logistics'}</span>
          </div>

          <div>
            <span className="text-xs text-slate-500 uppercase font-semibold block mb-1">Tracking AWB #</span>
            <span className="font-mono font-bold text-amber-400 text-base">{shipment?.tracking_number || 'AZI-TRK-PENDING'}</span>
          </div>

          <div className="flex items-center sm:justify-end">
            {shipment?.tracking_url ? (
              <a
                href={shipment.tracking_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-amber-500/20"
              >
                Direct Partner Tracking <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </a>
            ) : (
              <span className="text-xs text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                Official Tracking Verified
              </span>
            )}
          </div>
        </div>

        {/* Responsive Tracking Stepper (Horizontal on Desktop, Vertical on Mobile) */}
        <div className="mb-10">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Shipment Timeline</h3>

          {/* Desktop Horizontal Stepper */}
          <div className="hidden lg:flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 -z-0"></div>
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-amber-500 transition-all duration-500 -z-0"
              style={{ width: `${(activeStepIdx / (TRACKING_STEPS.length - 1)) * 100}%` }}
            ></div>

            {TRACKING_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx <= activeStepIdx;
              const isCurrent = idx === activeStepIdx;

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCurrent
                      ? 'bg-amber-500 border-amber-400 text-slate-950 ring-4 ring-amber-500/20 shadow-lg'
                      : isCompleted
                      ? 'bg-slate-900 border-amber-500 text-amber-400'
                      : 'bg-slate-950 border-slate-800 text-slate-600'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[11px] font-semibold mt-2 text-center max-w-[80px] ${
                    isCurrent ? 'text-amber-400 font-bold' : isCompleted ? 'text-slate-200' : 'text-slate-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mobile Vertical Stepper */}
          <div className="lg:hidden space-y-6 relative pl-6 border-l-2 border-slate-800 ml-2">
            {TRACKING_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx <= activeStepIdx;
              const isCurrent = idx === activeStepIdx;

              return (
                <div key={step.id} className="relative flex items-center space-x-3">
                  <div className={`absolute -left-[31px] w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    isCurrent
                      ? 'bg-amber-500 border-amber-400 text-slate-950 ring-4 ring-amber-500/20'
                      : isCompleted
                      ? 'bg-slate-900 border-amber-500 text-amber-400'
                      : 'bg-slate-950 border-slate-800 text-slate-600'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-xs font-semibold ${isCurrent ? 'text-amber-400 font-bold text-sm' : isCompleted ? 'text-slate-200' : 'text-slate-500'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Checkpoint Events History */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Detailed Location Checkpoints</h3>

          {checkpoints.length > 0 ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/60">
              {checkpoints.map((cp) => (
                <div key={cp.id} className="p-4 flex items-start space-x-3 hover:bg-slate-900/50 transition">
                  <MapPin className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">{cp.location}</span>
                      <span className="text-slate-400">
                        {new Date(cp.event_time || cp.created_at).toLocaleString('en-IN', {
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{cp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-xs">
              <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              Tracking information and scan updates will appear here once the courier scans your package at the dispatch hub.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
