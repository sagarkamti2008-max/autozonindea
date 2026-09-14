import React, { useState, useEffect } from 'react';
import {
  getCouponsForAdmin,
  saveCouponDB,
  deleteCouponDB,
  getCouponAnalyticsDB
} from '../services/pricingDiscountEngine';
import {
  Tag,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Percent,
  DollarSign,
  Truck,
  Calendar,
  AlertCircle,
  Award,
  Layers
} from 'lucide-react';

export default function AdminCouponConsole() {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'analytics'
  const [coupons, setCoupons] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  // Form Fields
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minimumOrderValue, setMinimumOrderValue] = useState(1000);
  const [maximumDiscount, setMaximumDiscount] = useState(500);
  const [usageLimit, setUsageLimit] = useState(500);
  const [usageLimitPerCustomer, setUsageLimitPerCustomer] = useState(1);
  const [startAt, setStartAt] = useState(new Date().toISOString().split('T')[0]);
  const [expiresAt, setExpiresAt] = useState(new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [status, setStatus] = useState('active');
  const [newCustomersOnly, setNewCustomersOnly] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    loadData();
  }, [statusFilter, searchQuery, activeTab]);

  const loadData = async () => {
    setLoading(true);
    const list = await getCouponsForAdmin(statusFilter, searchQuery);
    const stats = await getCouponAnalyticsDB();
    setCoupons(list);
    setAnalytics(stats);
    setLoading(false);
  };

  const handleOpenCreateModal = (cp = null) => {
    setFeedback(null);
    if (cp) {
      setEditingCoupon(cp);
      setCode(cp.code || '');
      setName(cp.name || '');
      setDescription(cp.description || '');
      setDiscountType(cp.discount_type || 'percentage');
      setDiscountValue(cp.discount_value || 0);
      setMinimumOrderValue(cp.minimum_order_value || 0);
      setMaximumDiscount(cp.maximum_discount || '');
      setUsageLimit(cp.usage_limit || '');
      setUsageLimitPerCustomer(cp.usage_limit_per_customer || 1);
      setStartAt(cp.start_at ? cp.start_at.split('T')[0] : '');
      setExpiresAt(cp.expires_at ? cp.expires_at.split('T')[0] : '');
      setStatus(cp.status || 'active');
      setNewCustomersOnly(cp.new_customers_only || false);
    } else {
      setEditingCoupon(null);
      setCode('');
      setName('');
      setDescription('');
      setDiscountType('percentage');
      setDiscountValue(10);
      setMinimumOrderValue(1000);
      setMaximumDiscount(500);
      setUsageLimit(500);
      setUsageLimitPerCustomer(1);
      setStartAt(new Date().toISOString().split('T')[0]);
      setExpiresAt(new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      setStatus('active');
      setNewCustomersOnly(false);
    }
    setIsModalOpen(true);
  };

  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const res = await saveCouponDB({
      id: editingCoupon?.id || null,
      code,
      name,
      description,
      discount_type: discountType,
      discount_value: discountValue,
      minimum_order_value: minimumOrderValue,
      maximum_discount: maximumDiscount,
      usage_limit: usageLimit,
      usage_limit_per_customer: usageLimitPerCustomer,
      start_at: startAt ? new Date(startAt).toISOString() : new Date().toISOString(),
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      status,
      new_customers_only: newCustomersOnly
    });

    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
      setTimeout(() => {
        setIsModalOpen(false);
        loadData();
      }, 1200);
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
    setSubmitting(false);
  };

  const handleToggleStatus = async (cp) => {
    const nextStatus = cp.status === 'active' ? 'disabled' : 'active';
    await saveCouponDB({ ...cp, status: nextStatus });
    loadData();
  };

  const handleDelete = async (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      await deleteCouponDB(couponId);
      loadData();
    }
  };

  return (
    <div className="container py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 mb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coupon & Promotion Master</h1>
          <p className="text-muted-foreground text-sm">
            Create promotional discount codes, enforce usage limits, configure GST tax rates, and analyze performance
          </p>
        </div>

        <div className="flex space-x-3 mt-4 md:mt-0">
          <div className="flex bg-muted p-1 rounded-xl border border-border">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'list' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              Coupons List
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'analytics' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              Coupon Analytics
            </button>
          </div>

          <button
            onClick={() => handleOpenCreateModal()}
            className="btn btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-card border border-border p-4 rounded-2xl">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-semibold uppercase">Total Coupons</span>
              <Tag className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-black">{analytics.totalCoupons}</div>
          </div>

          <div className="bg-card border border-border p-4 rounded-2xl">
            <div className="flex items-center justify-between text-emerald-600 mb-1">
              <span className="text-xs font-semibold uppercase">Active Coupons</span>
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-emerald-600">{analytics.activeCoupons}</div>
          </div>

          <div className="bg-card border border-border p-4 rounded-2xl">
            <div className="flex items-center justify-between text-rose-600 mb-1">
              <span className="text-xs font-semibold uppercase">Expired</span>
              <XCircle className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-rose-600">{analytics.expiredCoupons}</div>
          </div>

          <div className="bg-card border border-border p-4 rounded-2xl">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-semibold uppercase">Total Uses</span>
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black">{analytics.totalUses}</div>
          </div>

          <div className="bg-card border border-border p-4 rounded-2xl">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-semibold uppercase">Discount Savings</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600">
              ₹{Number(analytics.totalDiscountGiven).toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: LIST VIEW */}
      {activeTab === 'list' && (
        <>
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 bg-card border border-border p-4 rounded-2xl">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by code, coupon name, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-border rounded-xl bg-background text-sm focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-xl bg-background text-sm font-semibold focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>

          {/* Coupons Table */}
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">Loading coupons...</div>
          ) : coupons.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <Tag className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <h3 className="font-bold text-base mb-1">No Coupons Found</h3>
              <p className="text-muted-foreground text-xs">Create your first coupon to offer discounts to customers.</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 border-b border-border text-xs uppercase font-bold text-muted-foreground">
                    <tr>
                      <th className="p-4">Code</th>
                      <th className="p-4">Coupon Name</th>
                      <th className="p-4">Discount</th>
                      <th className="p-4">Min Order</th>
                      <th className="p-4">Max Cap</th>
                      <th className="p-4">Usage</th>
                      <th className="p-4">Validity</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {coupons.map((cp) => (
                      <tr key={cp.id} className="hover:bg-muted/20">
                        <td className="p-4 font-mono font-bold text-primary">{cp.code}</td>
                        <td className="p-4 font-semibold text-foreground">{cp.name}</td>
                        <td className="p-4 font-bold">
                          {cp.discount_type === 'percentage'
                            ? `${cp.discount_value}% OFF`
                            : cp.discount_type === 'fixed_amount'
                            ? `₹${cp.discount_value} OFF`
                            : 'FREE SHIPPING'}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          ₹{Number(cp.minimum_order_value || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {cp.maximum_discount ? `₹${cp.maximum_discount}` : 'No Cap'}
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-foreground">{cp.used_count || 0}</span>
                          <span className="text-muted-foreground text-xs"> / {cp.usage_limit || '∞'}</span>
                        </td>
                        <td className="p-4 text-xs text-muted-foreground">
                          {cp.expires_at ? new Date(cp.expires_at).toLocaleDateString('en-IN') : 'Never'}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                              cp.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {cp.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleToggleStatus(cp)}
                              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-border hover:bg-muted"
                            >
                              {cp.status === 'active' ? 'Disable' : 'Enable'}
                            </button>
                            <button
                              onClick={() => handleOpenCreateModal(cp)}
                              className="p-1.5 text-muted-foreground hover:text-primary"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(cp.id)}
                              className="p-1.5 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 2: COUPON ANALYTICS VIEW */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          <div className="bg-card border border-border p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-4">Top Performing Coupon Codes</h3>
            <div className="grid gap-4">
              {analytics.topCoupons.map((cp) => (
                <div key={cp.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 text-primary font-bold rounded-xl flex items-center justify-center font-mono">
                      {cp.code.slice(0, 4)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{cp.code} — {cp.name}</h4>
                      <p className="text-xs text-muted-foreground">{cp.description}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-foreground">{cp.used_count || 0} Redemptions</div>
                    <div className="text-xs text-emerald-600 font-bold">
                      {cp.discount_type === 'percentage' ? `${cp.discount_value}% OFF` : `₹${cp.discount_value} Flat`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT COUPON MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">
              {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </h2>

            {feedback && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs font-medium ${
                  feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {feedback.text}
              </div>
            )}

            <form onSubmit={handleSaveCoupon} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Coupon Code (Normalized)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WELCOME10"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-border rounded-xl bg-background font-mono text-sm uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Coupon Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Welcome Festive Offer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10% OFF on all orders over ₹1,000"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm font-semibold"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_amount">Fixed Amount (₹)</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    value={maximumDiscount}
                    onChange={(e) => setMaximumDiscount(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    value={minimumOrderValue}
                    onChange={(e) => setMinimumOrderValue(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Global Usage Limit
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1000"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Per Customer Limit
                  </label>
                  <input
                    type="number"
                    value={usageLimitPerCustomer}
                    onChange={(e) => setUsageLimitPerCustomer(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="newCustomers"
                  checked={newCustomersOnly}
                  onChange={(e) => setNewCustomersOnly(e.target.checked)}
                  className="rounded text-primary focus:ring-primary"
                />
                <label htmlFor="newCustomers" className="text-sm font-medium">
                  Restrict to First-Time Customers Only
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl border border-border hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
