import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  LayoutDashboard, ShoppingBag, Package, Layers, ShieldCheck, Car, Wrench,
  Users, Building, Cpu, CreditCard, Truck, RefreshCw, Tag, Star, BookOpen,
  Search, BarChart2, Settings, Plus, Trash2, X, AlertTriangle, TrendingUp, CheckCircle2,
  Bell, ShieldAlert
} from 'lucide-react';
import AdminSalesAnalyticsView from './AdminSalesAnalyticsView';
import AdminProductAnalyticsView from './AdminProductAnalyticsView';
import AdminCustomerAnalyticsView from './AdminCustomerAnalyticsView';
import AdminAlertCenterView from './AdminAlertCenterView';
import AdminActivityLogView from './AdminActivityLogView';
import { AdminInventoryConsole } from './AdminInventoryConsole';
import AdminSupplierConsole from './AdminSupplierConsole';
import AdminPurchaseOrderConsole from './AdminPurchaseOrderConsole';
import AdminStockAdjustmentConsole from './AdminStockAdjustmentConsole';
import AdminLowStockConsole from './AdminLowStockConsole';
import AdminStockHistoryConsole from './AdminStockHistoryConsole';
import AdminSupplierPurchaseReports from './AdminSupplierPurchaseReports';
import AdminEnquiryConsole from './AdminEnquiryConsole';
import AdminQuotationDetailConsole from './AdminQuotationDetailConsole';
import AdminLeadConsole from './AdminLeadConsole';
import AdminFollowUpConsole from './AdminFollowUpConsole';
import AdminLeadAnalyticsView from './AdminLeadAnalyticsView';
import AdminBulkImportView from './AdminBulkImportView';
import AdminImportHistoryView from './AdminImportHistoryView';
import AdminCatalogQualityView from './AdminCatalogQualityView';
import AdminBulkEditView from './AdminBulkEditView';
import AdminBulkPriceUpdateView from './AdminBulkPriceUpdateView';
import AdminBulkStockUpdateView from './AdminBulkStockUpdateView';
import AdminReturnsConsole from './AdminReturnsConsole';
import AdminReturnDetailConsole from './AdminReturnDetailConsole';
import AdminReturnInspectionView from './AdminReturnInspectionView';
import AdminReturnSettingsView from './AdminReturnSettingsView';
import AdminReturnsAnalyticsView from './AdminReturnsAnalyticsView';
import { AdminCmsConsole } from './AdminCmsConsole';
import { AdminBlogConsole } from './AdminBlogConsole';
import { AdminSeoConsole } from './AdminSeoConsole';
import { AdminFaqConsole } from './AdminFaqConsole';
import { AdminWarehouseConsole } from './AdminWarehouseConsole';
import { AdminStockTransferConsole } from './AdminStockTransferConsole';
import { AdminFulfillmentConsole } from './AdminFulfillmentConsole';
import { AdminInventoryReportsView } from './AdminInventoryReportsView';
import { AdminMarketingConsole } from './AdminMarketingConsole';
import { AdminSupportHub } from './AdminSupportHub';
import { AdminReviewHub } from './AdminReviewHub';
import { AdminOrdersConsole } from './AdminOrdersConsole';
import { AdminCatalogManager } from './AdminCatalogManager';
import { AdminWhatsAppConsole } from './AdminWhatsAppConsole';

export const AdminDashboard = () => {
  const {
    products,
    orders,
    customers,
    enquiries,
    updateEnquiryStatus,
    quotations,
    createQuotation,
    updateQuotationStatus,
    reviews,
    updateReviewStatus,
    coupons,
    createCoupon,
    updateCouponStatus,
    payments,
    updatePaymentStatus,
    shippingRecords,
    createShippingRecord,
    updateShippingStatus,
    adminUsers,
    createAdminUser,
    updateAdminUserRole,
    websiteSettings,
    updateWebsiteSetting,
    saveProduct,
    deleteProduct,
    updateOrderStatus,
    showToast
  } = useStore();

  const [activeAdminNav, setActiveAdminNav] = useState('dashboard'); // 'dashboard', 'orders', 'products', 'categories', 'brands', 'vehicles', 'inventory', 'sellers', 'garages', 'analytics'
  const [isAddProductModal, setIsAddProductModal] = useState(false);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [isAdminUserModalOpen, setIsAdminUserModalOpen] = useState(false);

  // New Admin User Form State
  const [adminUserForm, setAdminUserForm] = useState({
    name: '',
    email: '',
    role: 'Admin',
    status: 'Active'
  });

  // New Shipping Manifest Form State
  const [shipForm, setShipForm] = useState({
    order_id: 'ord-1001',
    orderNumber: 'AZ-2026-8801',
    customerName: 'Rahul Sharma',
    courier: 'Bluedart Express',
    tracking_number: 'AWB987654321IN',
    status: 'In Transit'
  });

  // New Coupon Form State
  const [coupForm, setCoupForm] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: 10,
    minimum_order: 1500,
    maximum_discount: 500,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usage_limit: 200,
    status: 'Active'
  });

  // New Quotation Form State
  const [quotForm, setQuotForm] = useState({
    enquiry_id: '',
    customer_id: 'cust-101',
    customerName: '',
    phone: '',
    itemsSummary: '',
    subtotal: 3500,
    discount: 350,
    tax: 567,
    valid_until: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  // New Product Form State
  const [newProd, setNewProd] = useState({
    id: `AZ-PROD-00${products.length + 1}`,
    title: '',
    category: 'service_parts',
    brand: 'BOSCH',
    partNumber: '',
    oemNumber: '',
    sku: '',
    mrp: 1200,
    price: 850,
    stock: 50,
    classification: 'OEM',
    isUniversal: true,
    rating: 4.8,
    reviewsCount: 15,
    warranty: '1 Year Warranty',
    seller: 'AutoZon Direct',
    weight: '500g',
    dimensions: '10x10x10cm',
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80',
    description: 'High performance automotive part engineered for extreme reliability.'
  });

  const totalRevenue = (orders || []).reduce((sum, o) => sum + (Number(o?.totalAmount || o?.total_amount || o?.pricing?.grandTotal) || 0), 0);
  const pendingOrders = (orders || []).filter(o => o?.orderStatus !== 'Delivered' && o?.orderStatus !== 'Completed');

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProd.title || !newProd.partNumber) {
      showToast('Please specify Product Title and Part Number', 'error');
      return;
    }
    const discount = Math.round(((newProd.mrp - newProd.price) / newProd.mrp) * 100);
    saveProduct({ ...newProd, discountPercent: discount, gstPercent: 18, compatibleVehicles: ['maruti-swift', 'hyundai-creta'] });
    setIsAddProductModal(false);
  };

  const primaryAdminNavItems = [
    { id: 'dashboard', label: '📊 Dashboard', icon: LayoutDashboard },
    { id: 'fulfillment', label: '📦 Orders', icon: ShoppingBag, badge: orders.length },
    { id: 'products', label: '🏷️ Products', icon: Package, badge: products.length },
    { id: 'customer-analytics', label: '👥 Customers', icon: Users, badge: customers?.length || 4 },
    { id: 'sales-analytics', label: '💰 Sales', icon: TrendingUp }
  ];

  return (
    <div className="admin-layout-wrapper">
      {/* Deep Navy Admin Sidebar Navigation */}
      <aside className="admin-sidebar-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.5rem 1rem 0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <img src="/kamti-logo.png" alt="KAMTI Logo" style={{ height: '32px', width: 'auto', borderRadius: '6px', backgroundColor: '#FFFFFF', padding: '2px' }} />
          <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.05rem', color: '#FFFFFF' }}>KAMTI AUTOMOTIVE</span>
        </div>

        <span className="admin-sidebar-title">Core Navigation</span>

        {primaryAdminNavItems.map(nav => {
          const IconComp = nav.icon;
          return (
            <button
              key={nav.id}
              className={`admin-nav-link ${activeAdminNav === nav.id ? 'active' : ''}`}
              onClick={() => setActiveAdminNav(nav.id)}
            >
              <IconComp size={16} />
              <span className="font-extrabold text-sm">{nav.label}</span>
              {nav.badge !== undefined && (
                <span style={{ marginLeft: 'auto', background: '#FF6B00', color: '#FFFFFF', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '50px' }}>
                  {nav.badge}
                </span>
              )}
            </button>
          );
        })}
      </aside>

      {/* Main Admin Dashboard Body */}
      <main className="admin-main-body">
        {/* Section View switch */}
        {activeAdminNav === 'support-hub' ? (
          <AdminSupportHub />
        ) : activeAdminNav === 'marketing' ? (
          <AdminMarketingConsole />
        ) : activeAdminNav === 'warehouses' ? (
          <AdminWarehouseConsole />
        ) : activeAdminNav === 'transfers' ? (
          <AdminStockTransferConsole />
        ) : (activeAdminNav === 'fulfillment' || activeAdminNav === 'orders') ? (
          <AdminOrdersConsole />
        ) : activeAdminNav === 'inventory-reports' ? (
          <AdminInventoryReportsView />
        ) : activeAdminNav === 'suppliers' ? (
          <AdminSupplierConsole />
        ) : activeAdminNav === 'purchases' ? (
          <AdminPurchaseOrderConsole />
        ) : activeAdminNav === 'stock-adjustments' ? (
          <AdminStockAdjustmentConsole />
        ) : activeAdminNav === 'low-stock' ? (
          <AdminLowStockConsole />
        ) : activeAdminNav === 'stock-history' ? (
          <AdminStockHistoryConsole />
        ) : activeAdminNav === 'purchase-reports' ? (
          <AdminSupplierPurchaseReports />
        ) : activeAdminNav === 'sales-analytics' ? (
          <AdminSalesAnalyticsView />
        ) : activeAdminNav === 'product-analytics' ? (
          <AdminProductAnalyticsView />
        ) : activeAdminNav === 'customer-analytics' ? (
          <AdminCustomerAnalyticsView />
        ) : activeAdminNav === 'alerts' ? (
          <AdminAlertCenterView />
        ) : activeAdminNav === 'activity' ? (
          <AdminActivityLogView />
        ) : activeAdminNav === 'inventory' ? (
          <AdminInventoryConsole />
        ) : activeAdminNav === 'enquiries' ? (
          <AdminEnquiryConsole />
        ) : activeAdminNav === 'whatsapp' ? (
          <AdminWhatsAppConsole />
        ) : activeAdminNav === 'quotations' ? (
          <AdminQuotationDetailConsole />
        ) : activeAdminNav === 'leads' ? (
          <AdminLeadConsole />
        ) : activeAdminNav === 'followups' ? (
          <AdminFollowUpConsole />
        ) : activeAdminNav === 'lead-analytics' ? (
          <AdminLeadAnalyticsView />
        ) : activeAdminNav === 'bulk-import' ? (
          <AdminBulkImportView />
        ) : activeAdminNav === 'import-history' ? (
          <AdminImportHistoryView />
        ) : activeAdminNav === 'catalog-quality' ? (
          <AdminCatalogQualityView />
        ) : activeAdminNav === 'bulk-edit' ? (
          <AdminBulkEditView />
        ) : activeAdminNav === 'price-update' ? (
          <AdminBulkPriceUpdateView />
        ) : activeAdminNav === 'stock-update' ? (
          <AdminBulkStockUpdateView />
        ) : activeAdminNav === 'returns' ? (
          <AdminReturnsConsole />
        ) : activeAdminNav === 'return-detail' ? (
          <AdminReturnDetailConsole />
        ) : activeAdminNav === 'return-inspection' ? (
          <AdminReturnInspectionView />
        ) : activeAdminNav === 'return-settings' ? (
          <AdminReturnSettingsView />
        ) : activeAdminNav === 'return-analytics' ? (
          <AdminReturnsAnalyticsView />
        ) : activeAdminNav === 'cms' ? (
          <AdminCmsConsole />
        ) : activeAdminNav === 'blogs' ? (
          <AdminBlogConsole />
        ) : activeAdminNav === 'seo' ? (
          <AdminSeoConsole />
        ) : activeAdminNav === 'faqs' ? (
          <AdminFaqConsole />
        ) : activeAdminNav === 'reviews' ? (
          <AdminReviewHub />
        ) : activeAdminNav === 'products' ? (
          <AdminCatalogManager />
        ) : activeAdminNav === 'orders' ? (
          <AdminOrdersConsole />
        ) : activeAdminNav === 'customers' ? (
          <AdminCustomerAnalyticsView />
        ) : activeAdminNav === 'enquiries' ? (
          <div className="portal-card">
            <div className="card-header-flex">
              <div>
                <h3>💬 Part Enquiries & Custom RFQ Engine (SQL Table: <code>enquiries</code>)</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                  Customer vehicle part inquiries ("Mujhe Hyundai Creta ka brake pad chahiye"). Directly track status &amp; reply.
                </p>
              </div>
              <span className="verified-tag" style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}>
                📩 {enquiries?.length || 0} Total Enquiries
              </span>
            </div>

            <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Enquiry ID</th>
                    <th>Customer Name</th>
                    <th>Phone Number</th>
                    <th>Vehicle &amp; Product</th>
                    <th>Enquiry Message</th>
                    <th>Qty</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(enquiries || []).map(enq => (
                    <tr key={enq.id}>
                      <td><code style={{ fontSize: '0.75rem' }}>{enq.id}</code></td>
                      <td><b>{enq.customer_name}</b></td>
                      <td><a href={`tel:${enq.phone}`} style={{ color: '#2563EB', fontWeight: 600 }}>{enq.phone}</a></td>
                      <td>
                        <div style={{ fontSize: '0.8rem' }}>
                          <span style={{ color: '#D97706', fontWeight: 800 }}>🚘 {enq.vehicleName || enq.vehicle_id || 'General Vehicle'}</span><br />
                          <span style={{ color: '#475569', fontWeight: 600 }}>📦 {enq.productName || enq.product_id || 'Part Request'}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.4rem 0.6rem', borderRadius: '8px', fontSize: '0.8rem', fontStyle: 'italic', color: '#1E293B', maxWidth: '300px' }}>
                          "{enq.message}"
                        </div>
                      </td>
                      <td><b>{enq.quantity || 1}</b></td>
                      <td>
                        <span className={`order-status-tag ${
                          enq.status === 'New' ? 'placed' :
                          enq.status === 'In Progress' ? 'processing' :
                          enq.status === 'Quoted' ? 'confirmed' : 'shipped'
                        }`}>
                          {enq.status || 'New'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <select
                            value={enq.status || 'New'}
                            onChange={(e) => updateEnquiryStatus(enq.id, e.target.value)}
                            className="step-select"
                            style={{ padding: '0.3rem' }}
                          >
                            <option value="New">New</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Quoted">Quoted</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                          </select>
                          <button
                            className="btn-secondary"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: '#FF6B00', color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            onClick={() => {
                              setQuotForm({
                                enquiry_id: enq.id,
                                customer_id: 'cust-101',
                                customerName: enq.customer_name,
                                phone: enq.phone,
                                itemsSummary: `${enq.quantity || 1}x ${enq.productName || 'Spare Part'} (${enq.vehicleName || 'Vehicle'})`,
                                subtotal: 3500,
                                discount: 350,
                                tax: 567,
                                valid_until: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                              });
                              setIsQuotationModalOpen(true);
                            }}
                          >
                            📄 Create Quotation
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeAdminNav === 'quotations' ? (
          <div className="portal-card">
            <div className="card-header-flex">
              <div>
                <h3>📄 Price Quotations &amp; B2B RFQ Generator (SQL Table: <code>quotations</code>)</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                  Formal pricing quotes dispatched for customer inquiries. Includes tax, discount, total &amp; validity date.
                </p>
              </div>
              <button className="btn-primary" onClick={() => {
                setQuotForm({
                  enquiry_id: '',
                  customer_id: 'cust-101',
                  customerName: 'Direct Customer',
                  phone: '+91 9876543210',
                  itemsSummary: 'Hyundai Creta Brake Pad & Disc Rotor Assembly',
                  subtotal: 5000,
                  discount: 500,
                  tax: 810,
                  valid_until: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                });
                setIsQuotationModalOpen(true);
              }}>
                <Plus size={16} /> Create New Quotation
              </button>
            </div>

            <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Quote Number</th>
                    <th>Customer Name</th>
                    <th>Subtotal</th>
                    <th>Discount</th>
                    <th>GST Tax</th>
                    <th>Grand Total</th>
                    <th>Valid Until</th>
                    <th>Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(quotations || []).map(q => (
                    <tr key={q.id}>
                      <td><code style={{ fontWeight: 800, color: '#1D4ED8' }}>{q.quotation_number}</code></td>
                      <td>
                        <b>{q.customerName}</b><br />
                        <span className="table-sub">{q.phone}</span>
                      </td>
                      <td>₹{Number(q.subtotal).toLocaleString('en-IN')}</td>
                      <td style={{ color: '#059669', fontWeight: 600 }}>-₹{Number(q.discount).toLocaleString('en-IN')}</td>
                      <td>₹{Number(q.tax).toLocaleString('en-IN')}</td>
                      <td><b style={{ fontSize: '0.95rem', color: '#0F172A' }}>₹{Number(q.total).toLocaleString('en-IN')}</b></td>
                      <td><span style={{ fontSize: '0.8rem', color: '#D97706', fontWeight: 700 }}>📅 {q.valid_until}</span></td>
                      <td>
                        <span className={`order-status-tag ${
                          q.status === 'Sent' ? 'processing' :
                          q.status === 'Accepted' ? 'delivered' :
                          q.status === 'Rejected' ? 'cancelled' : 'placed'
                        }`}>
                          {q.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={q.status}
                          onChange={(e) => updateQuotationStatus(q.id, e.target.value)}
                          className="step-select"
                          style={{ padding: '0.3rem' }}
                        >
                          <option value="Draft">Draft</option>
                          <option value="Sent">Sent</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Expired">Expired</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeAdminNav === 'reviews' ? (
          <div className="portal-card">
            <div className="card-header-flex">
              <div>
                <h3>⭐ Customer Product Reviews Moderation (SQL Table: <code>reviews</code>)</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                  Moderate customer rating submissions. Approve verified customer feedback before public display on product pages.
                </p>
              </div>
              <span className="verified-tag" style={{ background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A' }}>
                ⭐ {reviews?.filter(r => r.status === 'Pending').length || 0} Pending Moderation
              </span>
            </div>

            <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Review ID</th>
                    <th>Customer Name</th>
                    <th>Product</th>
                    <th>Rating</th>
                    <th>Review Title &amp; Comment</th>
                    <th>Status</th>
                    <th>Moderation Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(reviews || []).map(rev => (
                    <tr key={rev.id}>
                      <td><code style={{ fontSize: '0.75rem' }}>{rev.id}</code></td>
                      <td><b>{rev.customerName || 'Customer'}</b></td>
                      <td>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E293B' }}>
                          📦 {rev.productName || rev.product_id}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: '#F59E0B', fontWeight: 800 }}>
                          {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)} ({rev.rating}/5)
                        </span>
                      </td>
                      <td>
                        <div style={{ maxWidth: '320px', fontSize: '0.8rem' }}>
                          <b style={{ color: '#0F172A', display: 'block' }}>"{rev.title}"</b>
                          <p style={{ color: '#475569', margin: '0.2rem 0 0 0', fontStyle: 'italic' }}>
                            {rev.comment}
                          </p>
                        </div>
                      </td>
                      <td>
                        <span className={`order-status-tag ${
                          rev.status === 'Approved' ? 'delivered' :
                          rev.status === 'Pending' ? 'placed' : 'cancelled'
                        }`}>
                          {rev.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={rev.status}
                          onChange={(e) => updateReviewStatus(rev.id, e.target.value)}
                          className="step-select"
                          style={{ padding: '0.3rem' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Flagged">Flagged</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeAdminNav === 'coupons' ? (
          <div className="portal-card">
            <div className="card-header-flex">
              <div>
                <h3>🏷️ Promotional Coupons &amp; Discount Management (SQL Table: <code>coupons</code>)</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                  Manage discount codes, minimum order requirements, max cap savings &amp; validity date limits.
                </p>
              </div>
              <button className="btn-primary" onClick={() => {
                setCoupForm({
                  code: 'FESTIVE' + Math.floor(100 + Math.random() * 900),
                  discount_type: 'percentage',
                  discount_value: 15,
                  minimum_order: 2000,
                  maximum_discount: 750,
                  start_date: new Date().toISOString().split('T')[0],
                  end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  usage_limit: 300,
                  status: 'Active'
                });
                setIsCouponModalOpen(true);
              }}>
                <Plus size={16} /> Create New Coupon
              </button>
            </div>

            <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Coupon Code</th>
                    <th>Type &amp; Value</th>
                    <th>Min. Order</th>
                    <th>Max Discount</th>
                    <th>Validity Period</th>
                    <th>Usage Limit</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(coupons || []).map(c => (
                    <tr key={c.id}>
                      <td><code style={{ fontWeight: 900, color: '#D97706', fontSize: '0.9rem', background: '#FEF3C7', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{c.code}</code></td>
                      <td>
                        <b>{c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `₹${c.discount_value} FLAT`}</b>
                      </td>
                      <td>₹{Number(c.minimum_order).toLocaleString('en-IN')}</td>
                      <td>{c.maximum_discount ? `₹${Number(c.maximum_discount).toLocaleString('en-IN')}` : 'No Cap'}</td>
                      <td>
                        <span style={{ fontSize: '0.75rem', color: '#475569' }}>
                          📅 {c.start_date} to {c.end_date}
                        </span>
                      </td>
                      <td><b>{c.usage_limit} uses</b></td>
                      <td>
                        <span className={`order-status-tag ${
                          c.status === 'Active' ? 'delivered' :
                          c.status === 'Inactive' ? 'processing' : 'cancelled'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={c.status}
                          onChange={(e) => updateCouponStatus(c.id, e.target.value)}
                          className="step-select"
                          style={{ padding: '0.3rem' }}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Expired">Expired</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeAdminNav === 'payments' ? (
          <div className="portal-card">
            <div className="card-header-flex">
              <div>
                <h3>💳 Gateway Transaction &amp; Payment Audit Logs (SQL Table: <code>payments</code>)</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                  Audited payment gateway reference tokens. Zero raw card or UPI PIN storage — 100% PCI-DSS compliant tokenization.
                </p>
              </div>
              <span className="verified-tag" style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
                🔒 PCI-DSS Compliant Gateway Tokens
              </span>
            </div>

            <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Order Number (order_id)</th>
                    <th>Customer Name</th>
                    <th>Payment Method</th>
                    <th>Gateway Transaction Ref (transaction_id)</th>
                    <th>Amount (₹)</th>
                    <th>Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(payments || []).map(p => (
                    <tr key={p.id}>
                      <td><code style={{ fontSize: '0.75rem' }}>{p.id}</code></td>
                      <td><b>{p.orderNumber || p.order_id}</b></td>
                      <td>{p.customerName || 'Customer'}</td>
                      <td>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>
                          💳 {p.payment_method}
                        </span>
                      </td>
                      <td>
                        <code style={{ background: '#F1F5F9', color: '#2563EB', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                          🔑 {p.transaction_id}
                        </code>
                      </td>
                      <td><b style={{ fontSize: '0.95rem' }}>₹{Number(p.amount).toLocaleString('en-IN')}</b></td>
                      <td>
                        <span className={`order-status-tag ${
                          p.status === 'Captured' ? 'delivered' :
                          p.status === 'Authorized' ? 'confirmed' :
                          p.status === 'Pending' ? 'processing' : 'cancelled'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={p.status}
                          onChange={(e) => updatePaymentStatus(p.id, e.target.value)}
                          className="step-select"
                          style={{ padding: '0.3rem' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Authorized">Authorized</option>
                          <option value="Captured">Captured</option>
                          <option value="Failed">Failed</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeAdminNav === 'shipping' ? (
          <div className="portal-card">
            <div className="card-header-flex">
              <div>
                <h3>🚚 Order Shipping &amp; Courier Tracking (SQL Table: <code>shipping</code>)</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                  Courier partner dispatch manifests, AWB tracking numbers &amp; live delivery timestamp logging.
                </p>
              </div>
              <button className="btn-primary" onClick={() => {
                setShipForm({
                  order_id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
                  orderNumber: `AZ-2026-${Math.floor(8000 + Math.random() * 999)}`,
                  customerName: 'Sagar Customer',
                  courier: 'Delhivery Surface',
                  tracking_number: `DEL${Math.floor(100000000 + Math.random() * 900000000)}`,
                  status: 'Manifested'
                });
                setIsShippingModalOpen(true);
              }}>
                <Plus size={16} /> Create Shipping Manifest
              </button>
            </div>

            <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Shipping ID</th>
                    <th>Order Number</th>
                    <th>Customer</th>
                    <th>Courier Partner</th>
                    <th>AWB Tracking Number</th>
                    <th>Shipped Date</th>
                    <th>Delivery Timestamp</th>
                    <th>Status</th>
                    <th>Update Tracking</th>
                  </tr>
                </thead>
                <tbody>
                  {(shippingRecords || []).map(s => (
                    <tr key={s.id}>
                      <td><code style={{ fontSize: '0.75rem' }}>{s.id}</code></td>
                      <td><b>{s.orderNumber || s.order_id}</b></td>
                      <td>{s.customerName || 'Customer'}</td>
                      <td>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>
                          📦 {s.courier}
                        </span>
                      </td>
                      <td>
                        <code style={{ background: '#FEF3C7', color: '#B45309', padding: '0.2rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>
                          🚚 {s.tracking_number}
                        </code>
                      </td>
                      <td><span style={{ fontSize: '0.75rem' }}>{new Date(s.shipped_at).toLocaleDateString('en-IN')}</span></td>
                      <td>
                        {s.delivered_at ? (
                          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
                            ✅ {new Date(s.delivered_at).toLocaleDateString('en-IN')}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>In Transit</span>
                        )}
                      </td>
                      <td>
                        <span className={`order-status-tag ${
                          s.status === 'Delivered' ? 'delivered' :
                          s.status === 'In Transit' || s.status === 'Out for Delivery' ? 'shipped' :
                          s.status === 'Picked Up' ? 'confirmed' : 'processing'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={s.status}
                          onChange={(e) => updateShippingStatus(s.id, e.target.value)}
                          className="step-select"
                          style={{ padding: '0.3rem' }}
                        >
                          <option value="Manifested">Manifested</option>
                          <option value="Picked Up">Picked Up</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Returned">Returned</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeAdminNav === 'admin_users' ? (
          <div className="portal-card">
            <div className="card-header-flex">
              <div>
                <h3>👑 Admin Staff &amp; Role-Based Access Control (SQL Table: <code>admin_users</code>)</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                  Manage platform staff access rights. Roles: <b>Super Admin, Admin, Product Manager, Order Manager, Support</b>.
                </p>
              </div>
              <button className="btn-primary" onClick={() => {
                setAdminUserForm({
                  name: '',
                  email: '',
                  role: 'Product Manager',
                  status: 'Active'
                });
                setIsAdminUserModalOpen(true);
              }}>
                <Plus size={16} /> Add Admin Staff Member
              </button>
            </div>

            <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Assigned Role</th>
                    <th>Joined Timestamp</th>
                    <th>Account Status</th>
                    <th>Manage Role &amp; Access</th>
                  </tr>
                </thead>
                <tbody>
                  {(adminUsers || []).map(au => (
                    <tr key={au.id}>
                      <td><code style={{ fontSize: '0.75rem' }}>{au.id}</code></td>
                      <td><b>{au.name}</b></td>
                      <td><a href={`mailto:${au.email}`} style={{ color: '#2563EB', fontWeight: 600 }}>{au.email}</a></td>
                      <td>
                        <span className={`order-status-tag ${
                          au.role === 'Super Admin' ? 'delivered' :
                          au.role === 'Admin' ? 'confirmed' :
                          au.role === 'Product Manager' ? 'shipped' : 'placed'
                        }`}>
                          {au.role}
                        </span>
                      </td>
                      <td><span style={{ fontSize: '0.75rem' }}>{new Date(au.created_at).toLocaleDateString('en-IN')}</span></td>
                      <td>
                        <span className={`order-status-tag ${
                          au.status === 'Active' ? 'delivered' : 'cancelled'
                        }`}>
                          {au.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <select
                            value={au.role}
                            onChange={(e) => updateAdminUserRole(au.id, e.target.value, au.status)}
                            className="step-select"
                            style={{ padding: '0.3rem', fontSize: '0.75rem' }}
                          >
                            <option value="Super Admin">Super Admin</option>
                            <option value="Admin">Admin</option>
                            <option value="Product Manager">Product Manager</option>
                            <option value="Order Manager">Order Manager</option>
                            <option value="Support">Support</option>
                          </select>
                          <select
                            value={au.status}
                            onChange={(e) => updateAdminUserRole(au.id, au.role, e.target.value)}
                            className="step-select"
                            style={{ padding: '0.3rem', fontSize: '0.75rem' }}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Suspended">Suspended</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeAdminNav === 'settings' ? (
          <div className="portal-card">
            <div className="card-header-flex">
              <div>
                <h3>⚙️ Dynamic Global Website Settings (SQL Table: <code>website_settings</code>)</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                  Manage site identity, contact numbers, social media links, shipping rates &amp; tax configurations.
                </p>
              </div>
              <span className="verified-tag" style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}>
                ⚙️ {websiteSettings?.length || 0} Dynamic Key-Value Records
              </span>
            </div>

            <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Setting Key (setting_key)</th>
                    <th>Current Value (setting_value)</th>
                    <th>Last Updated (updated_at)</th>
                    <th>Update Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(websiteSettings || []).map(ws => (
                    <tr key={ws.id}>
                      <td><code style={{ fontWeight: 800, color: '#1D4ED8', fontSize: '0.85rem' }}>{ws.setting_key}</code></td>
                      <td>
                        <input
                          type="text"
                          defaultValue={ws.setting_value}
                          id={`ws_input_${ws.setting_key}`}
                          style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                        />
                      </td>
                      <td><span style={{ fontSize: '0.75rem', color: '#64748B' }}>{new Date(ws.updated_at).toLocaleString('en-IN')}</span></td>
                      <td>
                        <button
                          className="btn-primary"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                          onClick={() => {
                            const val = document.getElementById(`ws_input_${ws.setting_key}`)?.value;
                            if (val !== undefined) updateWebsiteSetting(ws.setting_key, val);
                          }}
                        >
                          Save Setting
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeAdminNav === 'cms' ? (
          <AdminCmsConsole />
        ) : activeAdminNav === 'blogs' ? (
          <AdminBlogConsole />
        ) : activeAdminNav === 'faqs' ? (
          <AdminFaqConsole />
        ) : activeAdminNav === 'seo' ? (
          <AdminSeoConsole />
        ) : (
          /* Default Dashboard Overview - High Contrast Dark Executive View */
          <div className="space-y-6">

            {/* Top 6 KPI Stat Boxes Grid (3x2 High Contrast Dark Cards) - ONLY ON DASHBOARD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* 1. Total Orders */}
              <div 
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-2xl p-5 shadow-xl transition-all duration-200 cursor-pointer flex items-center gap-4 group"
                onClick={() => setActiveAdminNav('fulfillment')}
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">Total Orders</span>
                  <h3 className="text-2xl font-black text-white tracking-tight">{orders.length || 125}</h3>
                </div>
              </div>

              {/* 2. Total Sales */}
              <div 
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-2xl p-5 shadow-xl transition-all duration-200 cursor-pointer flex items-center gap-4 group"
                onClick={() => setActiveAdminNav('sales-analytics')}
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">Total Sales</span>
                  <h3 className="text-2xl font-black text-emerald-400 tracking-tight">₹{totalRevenue ? totalRevenue.toLocaleString('en-IN') : '2,45,000'}</h3>
                </div>
              </div>

              {/* 3. Products Sold */}
              <div 
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-2xl p-5 shadow-xl transition-all duration-200 cursor-pointer flex items-center gap-4 group"
                onClick={() => setActiveAdminNav('products')}
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">Products Sold</span>
                  <h3 className="text-2xl font-black text-white tracking-tight">318 Units</h3>
                </div>
              </div>

              {/* 4. Active Products */}
              <div 
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-2xl p-5 shadow-xl transition-all duration-200 cursor-pointer flex items-center gap-4 group"
                onClick={() => setActiveAdminNav('products')}
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">Active Products</span>
                  <h3 className="text-2xl font-black text-teal-300 tracking-tight">{products.filter(p => p.status === 'Published' || !p.status).length || 156}</h3>
                </div>
              </div>

              {/* 5. Out of Stock */}
              <div 
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-2xl p-5 shadow-xl transition-all duration-200 cursor-pointer flex items-center gap-4 group"
                onClick={() => setActiveAdminNav('products')}
              >
                <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">Out of Stock</span>
                  <h3 className="text-2xl font-black text-red-400 tracking-tight">{products.filter(p => (p.stock || 0) === 0).length || 12}</h3>
                </div>
              </div>

              {/* 6. Pending Orders */}
              <div 
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-2xl p-5 shadow-xl transition-all duration-200 cursor-pointer flex items-center gap-4 group"
                onClick={() => setActiveAdminNav('fulfillment')}
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">Pending Orders</span>
                  <h3 className="text-2xl font-black text-amber-400 tracking-tight">{pendingOrders.length || 7}</h3>
                </div>
              </div>

            </div>

            {/* Quick Action Header Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white">⚡ KAMTI AUTOMOTIVE Executive Console</h2>
                  <span className="bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                    LIVE METRICS
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Real-time catalog monitoring, customer orders, revenue analytics &amp; low stock alerts
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={() => setActiveAdminNav('products')}
                  className="bg-[#FF5722] hover:bg-orange-600 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Product</span>
                </button>

                <button
                  onClick={() => setActiveAdminNav('fulfillment')}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>View All Orders ({orders.length})</span>
                </button>

                <button
                  onClick={() => setActiveAdminNav('sales-analytics')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Sales Report</span>
                </button>
              </div>
            </div>

            {/* 2 Main Detailed Cards Grid (Recent Customer Orders + Low Stock Alerts) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Card 1: Recent Customer Orders */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-blue-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Recent Customer Orders</h3>
                  </div>
                  <button
                    onClick={() => setActiveAdminNav('fulfillment')}
                    className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1"
                  >
                    View All ({orders.length}) ➔
                  </button>
                </div>

                <div className="divide-y divide-slate-800/80 text-xs">
                  {orders.slice(0, 5).map((o, idx) => (
                    <div key={o.id || idx} className="py-3 flex items-center justify-between gap-3 hover:bg-slate-800/40 px-2 rounded-xl transition">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                          #{o.id ? String(o.id).slice(-4) : idx + 101}
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs flex items-center gap-2">
                            <span>{o.customerName || 'Rahul Sharma'}</span>
                            <span className="text-[10px] text-slate-500 font-mono">({o.id || `AZ-${idx + 1001}`})</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            🚘 {o.compatibleCar || 'Maruti Swift VXi'} • {o.itemsCount || 1} Item(s)
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-black text-emerald-400 text-sm">
                          ₹{Number(o.totalAmount || o.pricing?.grandTotal || 1999).toLocaleString('en-IN')}
                        </div>
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider mt-0.5 ${
                          o.orderStatus === 'Delivered' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                          o.orderStatus === 'Shipped' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {o.orderStatus || '🟢 Placed'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Low Stock Inventory Alerts */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Low Stock Inventory Alerts</h3>
                  </div>
                  <button
                    onClick={() => setActiveAdminNav('products')}
                    className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
                  >
                    Manage Stock ➔
                  </button>
                </div>

                <div className="divide-y divide-slate-800/80 text-xs">
                  {products.filter(p => (p.stock || 0) < 30).slice(0, 5).map((p, idx) => {
                    const stockVal = p.stock || 0;
                    const stockPercent = Math.min(100, Math.round((stockVal / 50) * 100));
                    return (
                      <div key={p.id || idx} className="py-3 flex items-center justify-between gap-3 hover:bg-slate-800/40 px-2 rounded-xl transition">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.image || 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=100&q=80'}
                            alt={p.title || p.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-white text-xs truncate max-w-[200px]">
                              {p.title || p.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {p.sku || p.partNumber || 'AZ-SPARE-01'} • {p.brand || 'BOSCH'}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0 space-y-1">
                          <span className={`text-xs font-black px-2.5 py-1 rounded-lg border inline-block ${
                            stockVal === 0 ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                            stockVal <= 10 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                            'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          }`}>
                            {stockVal === 0 ? '🔴 Out of Stock' : `${stockVal} Units Left`}
                          </span>

                          <div className="w-24 bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800 ml-auto">
                            <div
                              className={`h-full rounded-full ${stockVal === 0 ? 'bg-rose-500' : stockVal <= 10 ? 'bg-amber-500' : 'bg-emerald-400'}`}
                              style={{ width: `${stockPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Quick System Activity Summary Ribbon */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs shadow-inner">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider block">Today's Sales Total</span>
                <span className="text-lg font-black text-emerald-400">₹42,850</span>
                <span className="text-[10px] text-slate-400 block">+12% vs yesterday</span>
              </div>

              <div className="space-y-1 border-l border-slate-800 pl-4">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider block">Active Catalog SKUs</span>
                <span className="text-lg font-black text-white">{products.length} Items</span>
                <span className="text-[10px] text-emerald-400 block">100% Fitment Verified</span>
              </div>

              <div className="space-y-1 border-l border-slate-800 pl-4">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider block">Fitment Accuracy Rate</span>
                <span className="text-lg font-black text-blue-400">99.8% Guaranteed</span>
                <span className="text-[10px] text-slate-400 block">Zero Fitment Returns</span>
              </div>

              <div className="space-y-1 border-l border-slate-800 pl-4">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider block">Active Courier AWBs</span>
                <span className="text-lg font-black text-purple-400">840 Active</span>
                <span className="text-[10px] text-slate-400 block">Delhivery / Bluedart</span>
              </div>
            </div>

          </div>
        )}
      </main>
        {/* Add Product Modal Form - Exact Order: Photo -> Title -> SKU+Brand -> Category+Class -> MRP+Price -> Stock -> Compatible Car -> Status -> Publish */}
      {isAddProductModal && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem', overflowY: 'auto' }}>
          <div className="modal-container" style={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '24px', padding: '1.75rem', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)', color: '#F8FAFC' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF' }}>Publish New Spare Part</h3>
              <button className="modal-close-btn" onClick={() => setIsAddProductModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              
              {/* 1. Product Photo ⭐ (Upload 1 main photo, allow 2-4 photos JPG / PNG / WebP) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#F8FAFC' }}>
                    📷 Product Photo ⭐
                  </label>
                  <span style={{ fontSize: '0.68rem', color: '#F59E0B', fontWeight: 700 }}>
                    Allowed: 2–4 Photos (JPG / PNG / WebP)
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      value={newProd.image || ''} 
                      onChange={(e) => {
                        const updated = [...(newProd.images || [e.target.value])];
                        updated[0] = e.target.value;
                        setNewProd({ ...newProd, image: e.target.value, images: updated });
                      }} 
                      placeholder="Paste Main Photo URL or Upload File..." 
                      style={{ background: '#1E293B', color: '#FFFFFF', border: '1px solid #334155', borderRadius: '10px', padding: '0.65rem 0.85rem', flex: 1, outline: 'none', fontSize: '0.85rem' }} 
                    />
                    <label style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 800, padding: '0.65rem 1rem', borderRadius: '10px', cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
                      📁 Upload Photos
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/webp" 
                        multiple
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []).slice(0, 4);
                          if (files.length > 0) {
                            const fileReaders = files.map(file => {
                              return new Promise((resolve) => {
                                const reader = new FileReader();
                                reader.onloadend = () => resolve(reader.result);
                                reader.readAsDataURL(file);
                              });
                            });
                            Promise.all(fileReaders).then(loadedImages => {
                              const currentImages = newProd.images && newProd.images.length > 0 ? [...newProd.images] : [];
                              const combined = [...currentImages, ...loadedImages].slice(0, 4);
                              setNewProd({
                                ...newProd,
                                image: combined[0] || '',
                                images: combined
                              });
                              showToast(`✅ Uploaded ${loadedImages.length} photo(s) successfully!`);
                            });
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* 4 Photo Thumbnail Slots */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginTop: '0.2rem' }}>
                    {[0, 1, 2, 3].map(idx => {
                      const imgUrl = (newProd.images && newProd.images[idx]) || (idx === 0 ? newProd.image : '');
                      return (
                        <div key={idx} style={{ position: 'relative', height: '65px', borderRadius: '10px', border: imgUrl ? '2px solid #10B981' : '1px dashed #475569', background: '#0F172A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {imgUrl ? (
                            <>
                              <img src={imgUrl} alt={`Photo ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <div style={{ position: 'absolute', top: '2px', left: '2px', background: idx === 0 ? '#10B981' : '#334155', color: '#FFF', fontSize: '8px', fontWeight: 900, padding: '1px 4px', borderRadius: '4px' }}>
                                {idx === 0 ? '⭐ MAIN' : `Photo ${idx + 1}`}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const filtered = (newProd.images || [newProd.image]).filter((_, i) => i !== idx);
                                  setNewProd({
                                    ...newProd,
                                    image: filtered[0] || '',
                                    images: filtered
                                  });
                                }}
                                style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(239,68,68,0.9)', color: '#FFF', border: 'none', borderRadius: '50%', width: '16px', height: '16px', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <label style={{ cursor: 'pointer', textAlign: 'center', padding: '2px' }}>
                              <span style={{ fontSize: '0.62rem', color: '#64748B', fontWeight: 700, display: 'block' }}>+ Photo {idx + 1}</span>
                              <span style={{ fontSize: '0.55rem', color: '#475569' }}>JPG/PNG/WebP</span>
                              <input 
                                type="file" 
                                accept="image/png, image/jpeg, image/webp" 
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      const updated = [...(newProd.images || (newProd.image ? [newProd.image] : []))];
                                      updated[idx] = reader.result;
                                      setNewProd({
                                        ...newProd,
                                        image: updated[0] || '',
                                        images: updated
                                      });
                                      showToast(`✅ Photo ${idx + 1} added!`);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. Product Title ✅ */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.35rem' }}>Product Title ✅ *</label>
                <input 
                  type="text" 
                  required 
                  value={newProd.title} 
                  onChange={(e) => setNewProd({ ...newProd, title: e.target.value })} 
                  placeholder="e.g. Bosch Front Brake Pad Set" 
                  style={{ background: '#1E293B', color: '#FFFFFF', border: '1px solid #334155', borderRadius: '10px', padding: '0.65rem 0.85rem', width: '100%', outline: 'none', fontSize: '0.85rem', fontWeight: 600 }} 
                />
              </div>

              {/* 3. Part Number (SKU/OEM) ✅ + Manufacturer Brand ✅ */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.35rem' }}>Part Number (SKU/OEM) ✅ *</label>
                  <input type="text" required value={newProd.partNumber} onChange={(e) => setNewProd({ ...newProd, partNumber: e.target.value })} placeholder="e.g. BOSCH-BP-2022" style={{ background: '#1E293B', color: '#FFFFFF', border: '1px solid #334155', borderRadius: '10px', padding: '0.65rem 0.85rem', width: '100%', outline: 'none', fontSize: '0.85rem', fontWeight: 600 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.35rem' }}>Manufacturer Brand ✅ *</label>
                  <input type="text" value={newProd.brand} onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })} placeholder="e.g. BOSCH" style={{ background: '#1E293B', color: '#FFFFFF', border: '1px solid #334155', borderRadius: '10px', padding: '0.65rem 0.85rem', width: '100%', outline: 'none', fontSize: '0.85rem', fontWeight: 600 }} />
                </div>
              </div>

              {/* 4. Category + Classification ✅ */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.35rem' }}>Category ✅ *</label>
                  <select value={newProd.category || 'Brake Parts'} onChange={(e) => setNewProd({ ...newProd, category: e.target.value })} style={{ background: '#1E293B', color: '#FFFFFF', border: '1px solid #334155', borderRadius: '10px', padding: '0.65rem 0.85rem', width: '100%', outline: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                    <option value="Brake Parts">Brake Parts</option>
                    <option value="Engine Parts">Engine Parts</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Suspension">Suspension</option>
                    <option value="Body Parts">Body Parts</option>
                    <option value="Filters">Filters</option>
                    <option value="AC Parts">AC Parts</option>
                    <option value="Lights">Lights</option>
                    <option value="Transmission">Transmission</option>
                    <option value="Steering">Steering</option>
                    <option value="Exhaust">Exhaust</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.35rem' }}>Classification ✅ *</label>
                  <select value={newProd.classification || 'OEM'} onChange={(e) => setNewProd({ ...newProd, classification: e.target.value })} style={{ background: '#1E293B', color: '#FFFFFF', border: '1px solid #334155', borderRadius: '10px', padding: '0.65rem 0.85rem', width: '100%', outline: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                    <option value="OEM">OEM (Original Equipment)</option>
                    <option value="Aftermarket">Aftermarket</option>
                    <option value="OES">OES (Original Supplier)</option>
                  </select>
                </div>
              </div>

              {/* 5. MRP Price ✅ + Selling Price ✅ */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.35rem' }}>MRP Price (₹) ✅ *</label>
                  <input type="number" value={newProd.mrp} onChange={(e) => setNewProd({ ...newProd, mrp: Number(e.target.value) })} style={{ background: '#1E293B', color: '#FFFFFF', border: '1px solid #334155', borderRadius: '10px', padding: '0.65rem 0.85rem', width: '100%', outline: 'none', fontSize: '0.85rem', fontWeight: 600 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.35rem' }}>Selling Price (₹) ✅ *</label>
                  <input type="number" value={newProd.price} onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })} style={{ background: '#1E293B', color: '#FFFFFF', border: '1px solid #334155', borderRadius: '10px', padding: '0.65rem 0.85rem', width: '100%', outline: 'none', fontSize: '0.85rem', fontWeight: 700, color: '#10B981' }} />
                </div>
              </div>

              {/* 6. Stock Count ✅ */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.35rem' }}>Stock Count ✅ *</label>
                <input type="number" value={newProd.stock} onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })} style={{ background: '#1E293B', color: '#FFFFFF', border: '1px solid #334155', borderRadius: '10px', padding: '0.65rem 0.85rem', width: '100%', outline: 'none', fontSize: '0.85rem', fontWeight: 600 }} />
              </div>

              {/* 7. Compatible Car (Brand -> Model -> Variant -> Year) */}
              <div style={{ background: '#1E293B', padding: '0.9rem', borderRadius: '12px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#F59E0B' }}>🚗 Compatible Car (Fitment)</label>
                  <span style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 700, background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.3)' }}>
                    Example: {(newProd.compatibleBrand || 'Maruti')} → {(newProd.compatibleModel || 'Swift')} → {(newProd.compatibleVariant || 'VXi')} → {(newProd.compatibleYear || '2020–2024')}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', color: '#94A3B8', fontWeight: 700, marginBottom: '2px' }}>Car Brand</label>
                    <input type="text" placeholder="e.g. Maruti" value={newProd.compatibleBrand || 'Maruti'} onChange={(e) => setNewProd({ ...newProd, compatibleBrand: e.target.value })} style={{ background: '#0F172A', color: '#FFFFFF', border: '1px solid #334155', borderRadius: '8px', padding: '0.5rem', fontSize: '0.75rem', width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', color: '#94A3B8', fontWeight: 700, marginBottom: '2px' }}>Model</label>
                    <input type="text" placeholder="e.g. Swift" value={newProd.compatibleModel || 'Swift'} onChange={(e) => setNewProd({ ...newProd, compatibleModel: e.target.value })} style={{ background: '#0F172A', color: '#FFFFFF', border: '1px solid #334155', borderRadius: '8px', padding: '0.5rem', fontSize: '0.75rem', width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', color: '#94A3B8', fontWeight: 700, marginBottom: '2px' }}>Variant</label>
                    <input type="text" placeholder="e.g. VXi" value={newProd.compatibleVariant || 'VXi'} onChange={(e) => setNewProd({ ...newProd, compatibleVariant: e.target.value })} style={{ background: '#0F172A', color: '#FFFFFF', border: '1px solid #334155', borderRadius: '8px', padding: '0.5rem', fontSize: '0.75rem', width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', color: '#94A3B8', fontWeight: 700, marginBottom: '2px' }}>Year</label>
                    <input type="text" placeholder="e.g. 2020–2024" value={newProd.compatibleYear || '2020–2024'} onChange={(e) => setNewProd({ ...newProd, compatibleYear: e.target.value })} style={{ background: '#0F172A', color: '#FFFFFF', border: '1px solid #334155', borderRadius: '8px', padding: '0.5rem', fontSize: '0.75rem', width: '100%' }} />
                  </div>
                </div>
              </div>

              {/* 8. Active / Inactive Status */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.35rem' }}>Product Status ✅</label>
                <select value={newProd.status || 'Active'} onChange={(e) => setNewProd({ ...newProd, status: e.target.value })} style={{ background: '#1E293B', color: '#FFFFFF', border: '1px solid #334155', borderRadius: '10px', padding: '0.65rem 0.85rem', width: '100%', outline: 'none', fontSize: '0.85rem', fontWeight: 700 }}>
                  <option value="Active">🟢 Active</option>
                  <option value="Inactive">⚪ Inactive</option>
                </select>
              </div>

              {/* 9. Publish Product Button */}
              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', background: '#FF5722', color: '#FFFFFF', fontWeight: 900, border: 'none', padding: '0.9rem', borderRadius: '14px', cursor: 'pointer', fontSize: '0.95rem', width: '100%', boxShadow: '0 10px 25px -5px rgba(255, 87, 34, 0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🟠 Publish Product
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Create Quotation Modal Form */}
      {isQuotationModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h3>📄 Generate Price Quotation (SQL: <code>quotations</code>)</h3>
              <button className="modal-close-btn" onClick={() => setIsQuotationModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              createQuotation(quotForm);
              setIsQuotationModalOpen(false);
            }} className="modal-body">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Customer Name *</label>
                  <input type="text" required value={quotForm.customerName} onChange={(e) => setQuotForm({ ...quotForm, customerName: e.target.value })} placeholder="e.g. Vikram Singh" />
                </div>
                <div className="form-group">
                  <label>Customer Phone *</label>
                  <input type="text" required value={quotForm.phone} onChange={(e) => setQuotForm({ ...quotForm, phone: e.target.value })} placeholder="+91 9876543210" />
                </div>
                <div className="form-group">
                  <label>Valid Until Date *</label>
                  <input type="date" required value={quotForm.valid_until} onChange={(e) => setQuotForm({ ...quotForm, valid_until: e.target.value })} />
                </div>
                <div className="form-group full-width">
                  <label>Items &amp; Parts Summary</label>
                  <input type="text" value={quotForm.itemsSummary} onChange={(e) => setQuotForm({ ...quotForm, itemsSummary: e.target.value })} placeholder="e.g. 2x Bosch Disc Brake Pad Set" />
                </div>
                <div className="form-group">
                  <label>Subtotal Amount (₹)</label>
                  <input type="number" value={quotForm.subtotal} onChange={(e) => setQuotForm({ ...quotForm, subtotal: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Discount Amount (₹)</label>
                  <input type="number" value={quotForm.discount} onChange={(e) => setQuotForm({ ...quotForm, discount: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>GST Tax (18%) (₹)</label>
                  <input type="number" value={quotForm.tax} onChange={(e) => setQuotForm({ ...quotForm, tax: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Calculated Grand Total (₹)</label>
                  <input type="number" readOnly value={quotForm.subtotal - quotForm.discount + quotForm.tax} style={{ fontWeight: 800, background: '#F1F5F9' }} />
                </div>
              </div>
              <button type="submit" className="btn-primary btn-full" style={{ marginTop: '1.25rem' }}>
                Generate &amp; Dispatch Quotation
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Create Coupon Modal Form */}
      {isCouponModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h3>🏷️ Create New Promotional Coupon (SQL: <code>coupons</code>)</h3>
              <button className="modal-close-btn" onClick={() => setIsCouponModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              createCoupon(coupForm);
              setIsCouponModalOpen(false);
            }} className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Coupon Code *</label>
                  <input type="text" required value={coupForm.code} onChange={(e) => setCoupForm({ ...coupForm, code: e.target.value.toUpperCase() })} placeholder="e.g. AUTOZON20" />
                </div>
                <div className="form-group">
                  <label>Discount Type</label>
                  <select value={coupForm.discount_type} onChange={(e) => setCoupForm({ ...coupForm, discount_type: e.target.value })}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Discount Value *</label>
                  <input type="number" required value={coupForm.discount_value} onChange={(e) => setCoupForm({ ...coupForm, discount_value: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Minimum Order Amount (₹)</label>
                  <input type="number" value={coupForm.minimum_order} onChange={(e) => setCoupForm({ ...coupForm, minimum_order: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Maximum Discount Cap (₹)</label>
                  <input type="number" value={coupForm.maximum_discount || ''} onChange={(e) => setCoupForm({ ...coupForm, maximum_discount: e.target.value ? Number(e.target.value) : '' })} placeholder="Optional cap" />
                </div>
                <div className="form-group">
                  <label>Max Usage Limit</label>
                  <input type="number" value={coupForm.usage_limit} onChange={(e) => setCoupForm({ ...coupForm, usage_limit: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Start Date *</label>
                  <input type="date" required value={coupForm.start_date} onChange={(e) => setCoupForm({ ...coupForm, start_date: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>End Date *</label>
                  <input type="date" required value={coupForm.end_date} onChange={(e) => setCoupForm({ ...coupForm, end_date: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn-primary btn-full" style={{ marginTop: '1.25rem' }}>
                Save &amp; Activate Coupon Code
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Create Shipping Manifest Modal Form */}
      {isShippingModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h3>🚚 Create Courier Shipping Manifest (SQL: <code>shipping</code>)</h3>
              <button className="modal-close-btn" onClick={() => setIsShippingModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              createShippingRecord(shipForm);
              setIsShippingModalOpen(false);
            }} className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Order Number *</label>
                  <input type="text" required value={shipForm.orderNumber} onChange={(e) => setShipForm({ ...shipForm, orderNumber: e.target.value })} placeholder="e.g. AZ-2026-8801" />
                </div>
                <div className="form-group">
                  <label>Customer Name *</label>
                  <input type="text" required value={shipForm.customerName} onChange={(e) => setShipForm({ ...shipForm, customerName: e.target.value })} placeholder="Customer Name" />
                </div>
                <div className="form-group">
                  <label>Courier Partner *</label>
                  <select value={shipForm.courier} onChange={(e) => setShipForm({ ...shipForm, courier: e.target.value })}>
                    <option value="Bluedart Express">Bluedart Express</option>
                    <option value="Delhivery Surface">Delhivery Surface</option>
                    <option value="DTDC Express">DTDC Express</option>
                    <option value="Xpressbees Logistics">Xpressbees Logistics</option>
                    <option value="IndiaPost Speed Post">IndiaPost Speed Post</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>AWB Tracking Number *</label>
                  <input type="text" required value={shipForm.tracking_number} onChange={(e) => setShipForm({ ...shipForm, tracking_number: e.target.value })} placeholder="e.g. AWB987654321IN" />
                </div>
                <div className="form-group">
                  <label>Initial Shipping Status</label>
                  <select value={shipForm.status} onChange={(e) => setShipForm({ ...shipForm, status: e.target.value })}>
                    <option value="Manifested">Manifested</option>
                    <option value="Picked Up">Picked Up</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary btn-full" style={{ marginTop: '1.25rem' }}>
                Generate &amp; Dispatch Shipping Manifest
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Create Admin User Modal Form */}
      {isAdminUserModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h3>👑 Add Admin Staff Member (SQL: <code>admin_users</code>)</h3>
              <button className="modal-close-btn" onClick={() => setIsAdminUserModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              createAdminUser(adminUserForm);
              setIsAdminUserModalOpen(false);
            }} className="modal-body">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Full Name *</label>
                  <input type="text" required value={adminUserForm.name} onChange={(e) => setAdminUserForm({ ...adminUserForm, name: e.target.value })} placeholder="e.g. Rajiv Sharma" />
                </div>
                <div className="form-group full-width">
                  <label>Email Address *</label>
                  <input type="email" required value={adminUserForm.email} onChange={(e) => setAdminUserForm({ ...adminUserForm, email: e.target.value })} placeholder="staff@autozonindia.com" />
                </div>
                <div className="form-group">
                  <label>Role Assignment *</label>
                  <select value={adminUserForm.role} onChange={(e) => setAdminUserForm({ ...adminUserForm, role: e.target.value })}>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="Order Manager">Order Manager</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Account Status</label>
                  <select value={adminUserForm.status} onChange={(e) => setAdminUserForm({ ...adminUserForm, status: e.target.value })}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary btn-full" style={{ marginTop: '1.25rem' }}>
                Provision Admin Access
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
