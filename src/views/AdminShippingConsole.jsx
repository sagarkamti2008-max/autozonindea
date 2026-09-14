import React, { useState, useEffect } from 'react';
import { listAdminShipments, createOrderShipment, updateShipmentStatus, getShipmentByOrder } from '../services/shippingService';
import { supabase } from '../services/supabaseClient';
import { Truck, Search, Filter, Package, CheckCircle2, Clock, MapPin, Printer, Plus, AlertCircle, RefreshCw, X, FileText } from 'lucide-react';

export function AdminShippingConsole() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState({
    pending: 0,
    packed: 0,
    shipped: 0,
    in_transit: 0,
    out_for_delivery: 0,
    delivered: 0,
    returned: 0
  });

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [labelData, setLabelData] = useState(null);

  // Form states
  const [courierName, setCourierName] = useState('AutoZon Express Logistics');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [estimatedDate, setEstimatedDate] = useState('');

  const [eventLocation, setEventLocation] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventStatus, setEventStatus] = useState('in_transit');

  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    fetchShipmentList();
  }, [search, statusFilter, page]);

  const fetchShipmentList = async () => {
    setLoading(true);
    const res = await listAdminShipments({ search, status: statusFilter, page, limit: 20 });
    if (res.success) {
      setShipments(res.data);

      // Compute KPI stats
      const pending = res.data.filter(s => s.status === 'pending' || s.status === 'processing').length;
      const packed = res.data.filter(s => s.status === 'packed').length;
      const shipped = res.data.filter(s => s.status === 'shipped').length;
      const in_transit = res.data.filter(s => s.status === 'in_transit').length;
      const out_for_delivery = res.data.filter(s => s.status === 'out_for_delivery').length;
      const delivered = res.data.filter(s => s.status === 'delivered').length;
      const returned = res.data.filter(s => s.status === 'returned').length;

      setStats({ pending, packed, shipped, in_transit, out_for_delivery, delivered, returned });
    }
    setLoading(false);
  };

  const handleCreateShipment = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setActionMessage('');
    const res = await createOrderShipment({
      orderId: selectedOrder.id,
      courierName,
      trackingNumber,
      trackingUrl,
      estimatedDeliveryDate: estimatedDate
    });

    if (res.success) {
      setActionMessage(`Shipment created successfully for Order #${selectedOrder.order_number}`);
      setShowCreateModal(false);
      fetchShipmentList();
    } else {
      setActionMessage(`Failed to create shipment: ${res.error}`);
    }
  };

  const handleAddTrackingEvent = async (e) => {
    e.preventDefault();
    if (!selectedShipment) return;

    setActionMessage('');
    const res = await updateShipmentStatus(
      selectedShipment.id,
      eventStatus,
      eventLocation || 'Logistics Hub',
      eventDesc || `Shipment updated to ${eventStatus.replace('_', ' ').toUpperCase()}`
    );

    if (res.success) {
      setActionMessage(`Tracking checkpoint recorded for AWB: ${selectedShipment.tracking_number}`);
      setShowEventModal(false);
      fetchShipmentList();
    } else {
      setActionMessage(`Failed updating status: ${res.error}`);
    }
  };

  const openLabelModal = (shipmentItem) => {
    setSelectedShipment(shipmentItem);
    const orderObj = shipmentItem.orders || {};
    const addrObj = typeof orderObj.shipping_address === 'string'
      ? { full_address: orderObj.shipping_address }
      : (orderObj.shipping_address || {});

    setLabelData({
      orderNumber: orderObj.order_number || 'AZI-ORDER',
      customerName: orderObj.customer_name || addrObj.fullName || 'Valued Customer',
      customerPhone: orderObj.customer_phone || addrObj.phone || 'N/A',
      address: addrObj.address_line || addrObj.street || addrObj.full_address || 'Shipping address specified on order',
      city: addrObj.city || 'Delhi NCR',
      state: addrObj.state || 'UP',
      pincode: addrObj.pincode || '201301',
      courier: shipmentItem.courier || 'AutoZon Express',
      trackingNumber: shipmentItem.tracking_number || 'AZI-TRK-0000',
      shipmentId: shipmentItem.id
    });
    setShowLabelModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
            <Truck className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Shipping & Delivery Control Center</h1>
            <p className="text-slate-400 text-sm">Manage logistics partners, tracking numbers, and A4/A6 shipping labels</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold uppercase block">Pending</span>
          <span className="text-2xl font-extrabold text-amber-400 mt-1 block">{stats.pending}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold uppercase block">Packed</span>
          <span className="text-2xl font-extrabold text-blue-400 mt-1 block">{stats.packed}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold uppercase block">Shipped</span>
          <span className="text-2xl font-extrabold text-indigo-400 mt-1 block">{stats.shipped}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold uppercase block">In Transit</span>
          <span className="text-2xl font-extrabold text-purple-400 mt-1 block">{stats.in_transit}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold uppercase block">Out for Delivery</span>
          <span className="text-2xl font-extrabold text-amber-500 mt-1 block">{stats.out_for_delivery}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold uppercase block">Delivered</span>
          <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">{stats.delivered}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold uppercase block">Returned</span>
          <span className="text-2xl font-extrabold text-rose-400 mt-1 block">{stats.returned}</span>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div className="mb-6 p-4 bg-slate-900 border border-amber-500/30 rounded-xl text-amber-300 text-sm flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage('')} className="text-xs text-slate-400 hover:text-white">Dismiss</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search AWB #, Order #, Customer or City..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-500 transition font-medium"
          >
            <option value="all">All Shipping Statuses</option>
            <option value="shipped">Shipped</option>
            <option value="in_transit">In Transit</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>

      {/* Shipping List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-xs border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Courier Partner</th>
                <th className="py-3.5 px-4">Tracking AWB #</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Est. Delivery</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading logistics manifests...
                  </td>
                </tr>
              ) : shipments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No shipments match your search criteria.
                  </td>
                </tr>
              ) : (
                shipments.map((s) => {
                  const orderNum = s.orders?.order_number || 'N/A';
                  const custName = s.orders?.customer_name || 'Customer';

                  return (
                    <tr key={s.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-4 px-4 font-mono font-bold text-slate-200">
                        {orderNum}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-white">{custName}</div>
                        <div className="text-xs text-slate-400">{s.orders?.customer_phone || ''}</div>
                      </td>
                      <td className="py-4 px-4 font-medium text-slate-300">
                        {s.courier || 'AutoZon Express'}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-amber-400">
                        {s.tracking_number || 'AZI-TRK-PENDING'}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide inline-flex items-center gap-1 ${
                          s.status === 'delivered'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : s.status === 'out_for_delivery'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-400 text-xs">
                        {s.estimated_delivery_date
                          ? new Date(s.estimated_delivery_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'Pending'}
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedShipment(s);
                            setShowEventModal(true);
                          }}
                          className="inline-flex items-center px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold rounded-lg transition"
                          title="Add Checkpoint Event"
                        >
                          <Plus className="w-3.5 h-3.5 mr-1" /> Scan
                        </button>
                        <button
                          onClick={() => openLabelModal(s)}
                          className="inline-flex items-center px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
                          title="Print Shipping Label"
                        >
                          <Printer className="w-3.5 h-3.5 mr-1" /> Label
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Checkpoint Event Modal */}
      {showEventModal && selectedShipment && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-lg">Add Tracking Checkpoint</h3>
              <button onClick={() => setShowEventModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddTrackingEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">New Status</label>
                <select
                  value={eventStatus}
                  onChange={(e) => setEventStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                >
                  <option value="in_transit">In Transit</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="returned">Returned</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Scan Location Hub</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai Sorting Hub, MH"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Status Description</label>
                <input
                  type="text"
                  placeholder="e.g. Arrived at regional dispatch center"
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition"
              >
                Record Tracking Scan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Printable Shipping Label Modal */}
      {showLabelModal && labelData && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl p-8 max-w-lg w-full shadow-2xl print:m-0 print:max-w-none print:shadow-none">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-200 print:hidden">
              <h3 className="font-bold text-slate-900 text-base">Print Shipping Label</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition flex items-center"
                >
                  <Printer className="w-3.5 h-3.5 mr-1" /> Print
                </button>
                <button onClick={() => setShowLabelModal(false)} className="text-slate-500 hover:text-slate-900"><X className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Label Layout A4/A6 printable */}
            <div className="border-2 border-slate-900 p-6 rounded-xl space-y-4">
              <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3">
                <div>
                  <h2 className="text-xl font-black tracking-tight">AUTOZONE<span className="text-amber-600">INDIA</span></h2>
                  <p className="text-[11px] text-slate-600">Logistics Hub, Sector 62, Noida, UP</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded">EXPRESS PARCEL</span>
                  <p className="text-xs font-mono font-bold text-slate-800 mt-1">{labelData.orderNumber}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase">SHIP TO (DELIVERY ADDRESS)</h4>
                <p className="font-bold text-base text-slate-900">{labelData.customerName}</p>
                <p className="text-xs text-slate-700 leading-relaxed mt-1">{labelData.address}</p>
                <p className="text-xs font-bold text-slate-900 mt-1">{labelData.city}, {labelData.state} - {labelData.pincode}</p>
                <p className="text-xs text-slate-700 mt-1 font-semibold">Phone: {labelData.customerPhone}</p>
              </div>

              <div className="border-t-2 border-slate-900 pt-3 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-500 block">Courier Partner</span>
                  <span className="font-bold text-slate-900">{labelData.courier}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Tracking AWB</span>
                  <span className="font-mono font-bold text-amber-700 text-sm">{labelData.trackingNumber}</span>
                </div>
              </div>

              {/* Barcode visual representation */}
              <div className="pt-2 text-center border-t border-slate-200">
                <div className="h-10 bg-slate-900 w-full flex items-center justify-center text-white font-mono text-xs tracking-[8px]">
                  ||||||||||||||||||||||||||||||||||
                </div>
                <span className="text-[10px] font-mono text-slate-500 mt-1 block">{labelData.trackingNumber}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminShippingConsole;
