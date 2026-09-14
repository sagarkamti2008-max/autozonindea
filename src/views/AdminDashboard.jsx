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

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.orderStatus !== 'Delivered');

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

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'support-hub', label: 'Support & AI Monitoring', icon: ShieldAlert },
    { id: 'marketing', label: 'Marketing & Abandoned Carts', icon: TrendingUp },
    { id: 'warehouses', label: 'Warehouses & Locations', icon: Building },
    { id: 'transfers', label: 'Stock Transfers', icon: RefreshCw },
    { id: 'fulfillment', label: 'Pick / Pack / Dispatch', icon: Truck },
    { id: 'inventory-reports', label: 'Inventory & Barcode Reports', icon: BarChart2 },
    { id: 'suppliers', label: 'Suppliers Directory', icon: Building },
    { id: 'purchases', label: 'Purchase Orders', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory Control', icon: Package },
    { id: 'stock-adjustments', label: 'Stock Adjustments', icon: Package },
    { id: 'low-stock', label: 'Low Stock & Reorder', icon: AlertTriangle },
    { id: 'stock-history', label: 'Stock Movement History', icon: RefreshCw },
    { id: 'purchase-reports', label: 'Procurement Reports', icon: BarChart2 },
    { id: 'sales-analytics', label: 'Sales Analytics', icon: TrendingUp },
    { id: 'product-analytics', label: 'Product Performance', icon: BarChart2 },
    { id: 'customer-analytics', label: 'Customer Intelligence', icon: Users },
    { id: 'alerts', label: 'Alert Center', icon: Bell, badge: 3 },
    { id: 'activity', label: 'Audit Logs', icon: ShieldAlert },
    { id: 'orders', label: 'Orders & Tracking', icon: ShoppingBag, badge: orders.length },
    { id: 'products', label: 'Products Catalog', icon: Package, badge: products.length },
    { id: 'bulk-import', label: 'CSV Bulk Product Import', icon: Upload },
    { id: 'import-history', label: 'CSV Import History', icon: FileText },
    { id: 'catalog-quality', label: 'Catalog Quality & Health', icon: ShieldAlert },
    { id: 'bulk-edit', label: 'Bulk Product Edit', icon: Layers },
    { id: 'price-update', label: 'Bulk Price Revision', icon: Tag },
    { id: 'stock-update', label: 'Bulk Stock Adjustment', icon: Package },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'brands', label: 'Brands & Manufacturers', icon: ShieldCheck },
    { id: 'vehicles', label: 'Vehicles Database', icon: Car },
    { id: 'fitment', label: 'Fitment Rules', icon: Wrench },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'enquiries', label: 'Part Enquiries', icon: RefreshCw, badge: enquiries?.length || 3 },
    { id: 'quotations', label: 'Quotations & RFQ', icon: Tag, badge: quotations?.length || 2 },
    { id: 'sellers', label: 'Sellers Hub', icon: Building },
    { id: 'manufacturers', label: 'Manufacturers', icon: Cpu },
    { id: 'garages', label: 'Garages & B2B', icon: Wrench },
    { id: 'payments', label: 'Payments & Accounts', icon: CreditCard, badge: payments?.length || 3 },
    { id: 'shipping', label: 'Shipping & Logistics', icon: Truck, badge: shippingRecords?.length || 3 },
    { id: 'returns', label: 'Returns & Refunds', icon: RefreshCw },
    { id: 'coupons', label: 'Coupons & Offers', icon: Tag, badge: coupons?.length || 3 },
    { id: 'reviews', label: 'Reviews Moderation', icon: Star, badge: reviews?.length || 3 },
    { id: 'cms', label: 'CMS & Landing Pages', icon: Layers },
    { id: 'blogs', label: 'Blogs & Articles', icon: BookOpen },
    { id: 'faqs', label: 'FAQ System', icon: Wrench },
    { id: 'seo', label: 'SEO Audit & Redirects', icon: Search },
    { id: 'admin_users', label: 'Admin Staff & Roles', icon: Users, badge: adminUsers?.length || 4 },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  return (
    <div className="admin-layout-wrapper">
      {/* Deep Navy Admin Sidebar Navigation */}
      <aside className="admin-sidebar-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.5rem 1rem 0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <LayoutDashboard size={22} color="#FF6B00" />
          <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.1rem', color: '#FFFFFF' }}>Admin Console</span>
        </div>

        <span className="admin-sidebar-title">Marketplace Management</span>

        {adminNavItems.map(nav => {
          const IconComp = nav.icon;
          return (
            <button
              key={nav.id}
              className={`admin-nav-link ${activeAdminNav === nav.id ? 'active' : ''}`}
              onClick={() => setActiveAdminNav(nav.id)}
            >
              <IconComp size={16} />
              <span>{nav.label}</span>
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
        {/* KPI Stats Header */}
        <div className="admin-stats-grid">
          <div className="stat-card">
            <TrendingUp size={28} className="stat-icon revenue" />
            <div>
              <span className="stat-label">Total Gross Sales</span>
              <h3 className="stat-val">₹{totalRevenue.toLocaleString('en-IN')}</h3>
            </div>
          </div>

          <div className="stat-card">
            <ShoppingBag size={28} className="stat-icon orders" />
            <div>
              <span className="stat-label">Total Orders</span>
              <h3 className="stat-val">{orders.length} Orders</h3>
            </div>
          </div>

          <div className="stat-card">
            <Package size={28} className="stat-icon products" />
            <div>
              <span className="stat-label">Active Catalog</span>
              <h3 className="stat-val">{products.length} Products</h3>
            </div>
          </div>

          <div className="stat-card">
            <AlertTriangle size={28} className="stat-icon pending" />
            <div>
              <span className="stat-label">Pending Dispatch</span>
              <h3 className="stat-val">{pendingOrders.length} Orders</h3>
            </div>
          </div>
        </div>

        {/* Section View switch */}
        {activeAdminNav === 'support-hub' ? (
          <AdminSupportHub />
        ) : activeAdminNav === 'marketing' ? (
          <AdminMarketingConsole />
        ) : activeAdminNav === 'warehouses' ? (
          <AdminWarehouseConsole />
        ) : activeAdminNav === 'transfers' ? (
          <AdminStockTransferConsole />
        ) : activeAdminNav === 'fulfillment' ? (
          <AdminFulfillmentConsole />
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
          <div className="portal-card">
            <div className="card-header-flex">
              <h3><Package size={20} /> Manage Product Catalog</h3>
              <button className="btn-primary" onClick={() => setIsAddProductModal(true)}>
                <Plus size={16} /> Add New Spare Part
              </button>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product Title</th>
                    <th>Part Number</th>
                    <th>Classification</th>
                    <th>Stock</th>
                    <th>MRP</th>
                    <th>Selling Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td className="prod-cell">
                        <img src={p.image} alt="" className="table-thumb" />
                        <div>
                          <b>{p.title}</b>
                          <span className="table-sub">{p.brand}</span>
                        </div>
                      </td>
                      <td><code>{p.partNumber}</code></td>
                      <td><span className="badge-classification oem">{p.classification}</span></td>
                      <td><b>{p.stock} units</b></td>
                      <td>₹{p.mrp.toLocaleString('en-IN')}</td>
                      <td><b>₹{p.price.toLocaleString('en-IN')}</b></td>
                      <td>
                        <button className="btn-icon-sub" onClick={() => deleteProduct(p.id)} title="Delete">
                          <Trash2 size={16} color="#EF4444" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeAdminNav === 'orders' ? (
          <div className="portal-card">
            <h3><ShoppingBag size={20} /> Customer Order Processing & Status Timeline</h3>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Payment Status</th>
                    <th>Current Order Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td><b>{o.id}</b></td>
                      <td><b>{o.customerName}</b><br /><span className="table-sub">{o.customerPhone}</span></td>
                      <td>{o.date}</td>
                      <td><b>₹{o.totalAmount.toLocaleString('en-IN')}</b></td>
                      <td><span className="verified-tag">{o.paymentStatus}</span></td>
                      <td><span className="order-status-tag shipped">{o.orderStatus}</span></td>
                      <td>
                        <select
                          value={o.status || o.orderStatus}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                          className="step-select"
                          style={{ padding: '0.3rem' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeAdminNav === 'customers' ? (
          <div className="portal-card">
            <div className="card-header-flex">
              <div>
                <h3><Users size={20} /> Customer Accounts Directory (SQL Table: <code>customers</code>)</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                  Registered customer accounts database. Passwords are managed securely via Supabase Auth (<code>auth.users</code>).
                </p>
              </div>
              <span className="verified-tag" style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
                🔒 Supabase Auth Integrated
              </span>
            </div>

            <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer ID (id)</th>
                    <th>Full Name (name)</th>
                    <th>Email Address (email)</th>
                    <th>Phone Number (phone)</th>
                    <th>Joined Date (created_at)</th>
                    <th>Auth Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(customers || []).map(cust => (
                    <tr key={cust.id}>
                      <td><code style={{ fontSize: '0.75rem' }}>{cust.id}</code></td>
                      <td><b>{cust.name}</b></td>
                      <td><a href={`mailto:${cust.email}`} style={{ color: '#2563EB', fontWeight: 600 }}>{cust.email}</a></td>
                      <td><code>{cust.phone || 'N/A'}</code></td>
                      <td>{new Date(cust.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                      <td>
                        <span className="verified-tag">✓ Supabase Auth</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
          /* Default Dashboard Overview */
          <div className="portal-card">
            <h3>Automotive Marketplace Executive Summary</h3>
            <p style={{ margin: '0.5rem 0 1.5rem 0', color: '#64748B' }}>
              All 20+ management sections (Products, Orders, Inventory, Fitment Rules, Vehicles Database, Sellers, Garages, Payments, SEO) are active.
            </p>

            <div className="offers-grid">
              <div className="testimonial-card">
                <h4>Recent Orders</h4>
                {orders.map(o => (
                  <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0', fontSize: '0.85rem' }}>
                    <span><b>{o.id}</b> - {o.customerName}</span>
                    <b>₹{o.totalAmount}</b>
                  </div>
                ))}
              </div>

              <div className="testimonial-card">
                <h4>Low Stock Alerts</h4>
                {products.filter(p => p.stock < 30).map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0', fontSize: '0.85rem' }}>
                    <span><b>{p.title.slice(0, 25)}...</b></span>
                    <span style={{ color: '#EF4444', fontWeight: 800 }}>{p.stock} units left</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Product Modal Form */}
      {isAddProductModal && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Publish New Spare Part to Live Catalog</h3>
              <button className="modal-close-btn" onClick={() => setIsAddProductModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddProductSubmit} className="modal-body">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Product Title *</label>
                  <input type="text" required value={newProd.title} onChange={(e) => setNewProd({ ...newProd, title: e.target.value })} placeholder="e.g. Bosch Brake Pad Set for Maruti Swift" />
                </div>
                <div className="form-group">
                  <label>Part Number (SKU/OEM) *</label>
                  <input type="text" required value={newProd.partNumber} onChange={(e) => setNewProd({ ...newProd, partNumber: e.target.value })} placeholder="e.g. BOSCH-BP-2022" />
                </div>
                <div className="form-group">
                  <label>Manufacturer Brand</label>
                  <input type="text" value={newProd.brand} onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>MRP Price (₹)</label>
                  <input type="number" value={newProd.mrp} onChange={(e) => setNewProd({ ...newProd, mrp: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Selling Price (₹)</label>
                  <input type="number" value={newProd.price} onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Stock Count</label>
                  <input type="number" value={newProd.stock} onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Classification</label>
                  <select value={newProd.classification} onChange={(e) => setNewProd({ ...newProd, classification: e.target.value })}>
                    <option value="OEM">OEM</option>
                    <option value="OES">OES</option>
                    <option value="Aftermarket">Aftermarket</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary btn-full" style={{ marginTop: '1.25rem' }}>
                Publish Product to Marketplace
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
