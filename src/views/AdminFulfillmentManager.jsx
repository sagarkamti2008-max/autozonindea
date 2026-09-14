import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { generateGSTTaxInvoiceHTML, processCustomerRefund } from '../services/fulfillmentEngine';
import {
  Truck, Package, Layers, QrCode, ShieldCheck, CheckCircle2, Clock,
  MapPin, Calendar, FileText, Search, RefreshCw, AlertTriangle, ArrowRight,
  X, User, Phone, Mail, Car, Edit3, MessageSquare, DollarSign, Ban
} from 'lucide-react';

export const AdminFulfillmentManager = () => {
  const { products, orders, updateOrderAdminState, showToast } = useStore();

  const [activeTab, setActiveTab] = useState('shipping-dashboard');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAdminOrder, setSelectedAdminOrder] = useState(null);

  // Admin Order Form State
  const [editStatus, setEditStatus] = useState('Confirmed');
  const [editPaymentStatus, setEditPaymentStatus] = useState('Paid');
  const [editCarrier, setEditCarrier] = useState('Delhivery Express');
  const [editAwb, setEditAwb] = useState('');
  const [newAdminNote, setNewAdminNote] = useState('');

  const [pickups] = useState([
    { id: 'PICKUP-101', carrier: 'BlueDart Express', date: '2026-08-25', packageCount: 14, status: 'Scheduled' },
    { id: 'PICKUP-102', carrier: 'Delhivery Surface', date: '2026-08-25', packageCount: 8, status: 'Scheduled' }
  ]);

  const [shippingZones] = useState([
    { id: 1, zoneName: 'Delhi NCR Metro Zone', pincodeRule: '110xxx / 122xxx', carrier: 'BlueDart Air', rate: 'FREE above ₹999' },
    { id: 2, zoneName: 'Mumbai & Western Zone', pincodeRule: '400xxx / 411xxx', carrier: 'Delhivery Surface', rate: '₹49 Flat Rate' }
  ]);

  const handleOpenOrderModal = (order) => {
    setSelectedAdminOrder(order);
    setEditStatus(order.orderStatus || 'Confirmed');
    setEditPaymentStatus(order.paymentInfo?.status || order.paymentStatus || 'Paid');
    setEditCarrier(order.trackingInfo?.carrier || 'Delhivery Express');
    setEditAwb(order.trackingInfo?.awbNumber || `DELH${Math.floor(10000000 + Math.random() * 90000000)}`);
    setNewAdminNote('');
  };

  const handleSaveOrderChanges = () => {
    if (!selectedAdminOrder) return;
    updateOrderAdminState(selectedAdminOrder.id || selectedAdminOrder.orderNumber, {
      orderStatus: editStatus,
      paymentStatus: editPaymentStatus,
      trackingCarrier: editCarrier,
      awbNumber: editAwb,
      adminNote: newAdminNote
    });
    setSelectedAdminOrder(null);
  };

  const handleCancelOrder = () => {
    if (!selectedAdminOrder) return;
    updateOrderAdminState(selectedAdminOrder.id || selectedAdminOrder.orderNumber, {
      orderStatus: 'Cancelled',
      paymentStatus: 'Refunded',
      adminNote: 'Order cancelled by Store Owner Admin. Refund processed.'
    });
    showToast(`Order #${selectedAdminOrder.orderNumber || selectedAdminOrder.id} Cancelled & Refunded.`, 'info');
    setSelectedAdminOrder(null);
  };

  const filteredOrdersList = orders.filter(o => {
    if (statusFilter !== 'all' && (o.orderStatus || 'Confirmed') !== statusFilter) return false;
    if (searchFilter.trim() !== '') {
      const q = searchFilter.toLowerCase().trim();
      const matchNum = String(o.orderNumber || o.id).toLowerCase().includes(q);
      const matchName = String(o.customer?.name || o.customerName || '').toLowerCase().includes(q);
      const matchPhone = String(o.customer?.phone || o.customerPhone || '').toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchPhone) return false;
    }
    return true;
  });

  return (
    <div className="container admin-dashboard-wrapper" style={{ maxWidth: '1400px', padding: '1.5rem 1rem' }}>
      {/* Header Banner */}
      <div className="admin-header" style={{ background: '#0F2167', color: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Truck size={34} color="#FF6B00" />
          <div>
            <h2 style={{ color: '#FFFFFF', margin: 0, fontSize: '1.35rem' }}>AutoZon Single-Owner Shipping & Orders Fulfillment Console</h2>
            <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>
              Single Store Owner Order Operations • Live AWB Carrier Assignment • Private Internal Admin Notes • GST Tax Invoices
            </span>
          </div>
        </div>
      </div>

      {/* Shipping Metrics Cards */}
      <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="metric-card" style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Total Single-Owner Orders</span>
          <h3 style={{ fontSize: '1.6rem', color: '#0F2167', margin: '0.25rem 0' }}>{orders.length}</h3>
          <span style={{ fontSize: '0.75rem', color: '#3B82F6' }}>100% Owned Products</span>
        </div>

        <div className="metric-card" style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Pending Fulfillment</span>
          <h3 style={{ fontSize: '1.6rem', color: '#F59E0B', margin: '0.25rem 0' }}>
            {orders.filter(o => (o.orderStatus || 'Confirmed') === 'Confirmed' || o.orderStatus === 'Processing').length}
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#F59E0B' }}>Ready for Packing</span>
        </div>

        <div className="metric-card" style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Shipped / In Transit</span>
          <h3 style={{ fontSize: '1.6rem', color: '#10B981', margin: '0.25rem 0' }}>
            {orders.filter(o => o.orderStatus === 'Shipped').length}
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#10B981' }}>On-Time Air/Surface</span>
        </div>

        <div className="metric-card" style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Scheduled Courier Pickups</span>
          <h3 style={{ fontSize: '1.6rem', color: '#0F2167', margin: '0.25rem 0' }}>{pickups.length}</h3>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Today's Dispatch</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button className={`admin-tab ${activeTab === 'shipping-dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('shipping-dashboard')}>
          🚚 Single-Owner Orders Console ({orders.length})
        </button>
        <button className={`admin-tab ${activeTab === 'pick-list' ? 'active' : ''}`} onClick={() => setActiveTab('pick-list')}>
          📋 Warehouse Bin Pick List
        </button>
        <button className={`admin-tab ${activeTab === 'pickups' ? 'active' : ''}`} onClick={() => setActiveTab('pickups')}>
          📅 Courier Pickup Scheduler
        </button>
        <button className={`admin-tab ${activeTab === 'zones' ? 'active' : ''}`} onClick={() => setActiveTab('zones')}>
          🗺️ Shipping Rates & Zones
        </button>
      </div>

      {/* Workspace Content */}
      {activeTab === 'shipping-dashboard' && (
        <div className="admin-pane-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0F2167' }}>Single-Owner Orders Management Console</h3>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.3rem 0.6rem' }}>
                <Search size={16} color="#64748B" style={{ marginRight: '0.4rem' }} />
                <input
                  type="text"
                  placeholder="Search Order #, Customer, Phone, SKU..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.8rem', width: '220px' }}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.35rem 0.6rem', fontSize: '0.8rem', fontWeight: 700 }}
              >
                <option value="all">All Order Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Customer Info</th>
                  <th>Order Total</th>
                  <th>Payment Status</th>
                  <th>Order Status</th>
                  <th>Tracking AWB</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrdersList.map(o => (
                  <tr key={o.id}>
                    <td>
                      <code style={{ background: '#FFF7ED', color: '#FF6B00', fontWeight: 900, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        #{o.orderNumber || o.id}
                      </code>
                    </td>
                    <td>
                      <b style={{ color: '#0F2167', display: 'block' }}>{o.customer?.name || o.customerName || 'Sagar Kamti'}</b>
                      <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{o.customer?.phone || o.customerPhone || '+91 8591719499'}</span>
                    </td>
                    <td><b>₹{(o.pricing?.grandTotal || o.totalAmount || 0).toLocaleString('en-IN')}</b></td>
                    <td>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: (o.paymentInfo?.status || o.paymentStatus) === 'Paid' ? '#059669' : '#D97706' }}>
                        {o.paymentInfo?.status || o.paymentStatus || 'Paid'} ({o.paymentInfo?.method || o.paymentMethod || 'Online'})
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.72rem', fontWeight: 900, background: o.orderStatus === 'Cancelled' ? '#FEF2F2' : '#ECFDF5', color: o.orderStatus === 'Cancelled' ? '#991B1B' : '#059669', border: '1px solid #A7F3D0', padding: '0.15rem 0.55rem', borderRadius: '12px' }}>
                        {o.orderStatus || 'Confirmed'}
                      </span>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.72rem', background: '#F1F5F9' }}>
                        {o.trackingInfo?.awbNumber || 'DELH94827103'}
                      </code>
                    </td>
                    <td>
                      <button
                        className="btn-primary"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                        onClick={() => handleOpenOrderModal(o)}
                      >
                        Manage & Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Order Detail & Status Modal Drawer (Rules 42, 43, 46, 47, 48, 50) */}
      {selectedAdminOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F2167', margin: 0 }}>
                  Manage Order #{selectedAdminOrder.orderNumber || selectedAdminOrder.id}
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  Placed on: {selectedAdminOrder.date || new Date(selectedAdminOrder.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    const html = generateGSTTaxInvoiceHTML(selectedAdminOrder);
                    const win = window.open('', '_blank');
                    win.document.write(html);
                    win.document.close();
                  }}
                  style={{ background: '#0F2167', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.4rem 0.85rem', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <FileText size={14} /> Print GST Invoice
                </button>

                <button onClick={() => setSelectedAdminOrder(null)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Modal Body Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              {/* Customer & Shipping Details */}
              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.82rem' }}>
                <strong style={{ color: '#0F2167', display: 'block', marginBottom: '0.4rem' }}>Customer Details:</strong>
                <div>Name: <strong>{selectedAdminOrder.customer?.name || selectedAdminOrder.customerName}</strong></div>
                <div>Phone: <strong>{selectedAdminOrder.customer?.phone || selectedAdminOrder.customerPhone}</strong></div>
                <div>Email: {selectedAdminOrder.customer?.email || 'customer@autozonindia.com'}</div>

                <strong style={{ color: '#0F2167', display: 'block', marginTop: '0.85rem', marginBottom: '0.4rem' }}>Delivery Address:</strong>
                <div style={{ color: '#475569' }}>
                  {typeof selectedAdminOrder.shippingAddress === 'string' ? selectedAdminOrder.shippingAddress : `${selectedAdminOrder.shippingAddress?.fullName}, ${selectedAdminOrder.shippingAddress?.addressLine1}, ${selectedAdminOrder.shippingAddress?.city} - ${selectedAdminOrder.shippingAddress?.postalCode}`}
                </div>
              </div>

              {/* Status Update Form */}
              <div style={{ background: '#FFF7ED', border: '1px solid #FFD8A8', padding: '1rem', borderRadius: '12px', fontSize: '0.82rem' }}>
                <strong style={{ color: '#FF6B00', display: 'block', marginBottom: '0.75rem' }}>Update Order & Payment Lifecycle:</strong>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569' }}>Order Status:</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontWeight: 800, color: '#0F2167', marginTop: '0.2rem' }}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569' }}>Payment Status:</label>
                    <select
                      value={editPaymentStatus}
                      onChange={(e) => setEditPaymentStatus(e.target.value)}
                      style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontWeight: 800, color: '#0F2167', marginTop: '0.2rem' }}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending (COD)</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569' }}>AWB Tracking Number:</label>
                    <input
                      type="text"
                      value={editAwb}
                      onChange={(e) => setEditAwb(e.target.value)}
                      style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid #CBD5E1', marginTop: '0.2rem' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Private Internal Admin Notes Log (Rule 47) */}
            <div style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
              <strong style={{ color: '#0F2167', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <MessageSquare size={16} color="#FF6B00" /> Private Internal Admin Notes (Never Visible to Customer)
              </strong>

              {(selectedAdminOrder.adminNotes || []).length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  {selectedAdminOrder.adminNotes.map(n => (
                    <div key={n.id} style={{ background: '#FFFFFF', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.78rem', color: '#334155' }}>
                      <strong>[{new Date(n.timestamp).toLocaleTimeString('en-IN')}] {n.author}:</strong> {n.text}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Add internal note (e.g. Verified VIN compatibility before dispatch)..."
                  value={newAdminNote}
                  onChange={(e) => setNewAdminNote(e.target.value)}
                  style={{ flex: 1, padding: '0.45rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            {/* Action Bar Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={handleCancelOrder}
                style={{ background: '#FEF2F2', color: '#E11D48', border: '1px solid #FECACA', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Ban size={15} /> Cancel Order & Process Refund
              </button>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setSelectedAdminOrder(null)} style={{ background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                  Close
                </button>
                <button onClick={handleSaveOrderChanges} style={{ background: '#FF6B00', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.5rem 1.25rem', fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer' }}>
                  Save Order Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
