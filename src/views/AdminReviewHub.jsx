import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Star, ShieldCheck, ThumbsUp, AlertTriangle, Download, Search, Filter,
  CheckCircle2, XCircle, Eye, Settings, RefreshCw, Layers, BarChart2, Check
} from 'lucide-react';
import {
  getAllReviewsForAdmin,
  moderateReview,
  bulkModerateReviews,
  getReviewReports,
  getReviewSettings,
  updateReviewSettings,
  exportReviewsCsv
} from '../services/advancedReviewService';

export const AdminReviewHub = () => {
  const { showToast } = useStore();
  const [activeTab, setActiveTab] = useState('moderation'); // moderation, analytics, search, settings
  const [statusFilter, setStatusFilter] = useState('pending'); // pending, published, flagged, rejected, reported, hidden

  // State definitions
  const [reviews, setReviews] = useState([]);
  const [reports, setReports] = useState([]);
  const [settings, setSettings] = useState({});
  const [selectedReviewIds, setSelectedReviewIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const loadData = () => {
    const allRevs = getAllReviewsForAdmin(statusFilter);
    setReviews(allRevs);
    setReports(getReviewReports());
    setSettings(getReviewSettings());
  };

  const handleModerateSingle = (reviewId, newStatus) => {
    moderateReview(reviewId, newStatus);
    loadData();
    showToast(`Review status updated to ${newStatus}`, 'success');
  };

  const handleSelectReview = (id) => {
    if (selectedReviewIds.includes(id)) {
      setSelectedReviewIds(selectedReviewIds.filter(i => i !== id));
    } else {
      setSelectedReviewIds([...selectedReviewIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedReviewIds.length === reviews.length) {
      setSelectedReviewIds([]);
    } else {
      setSelectedReviewIds(reviews.map(r => r.id));
    }
  };

  const handleBulkModerate = (newStatus) => {
    if (selectedReviewIds.length === 0) {
      showToast('Select at least one review for bulk action', 'error');
      return;
    }
    const res = bulkModerateReviews(selectedReviewIds, newStatus, 'Super Admin');
    setSelectedReviewIds([]);
    loadData();
    showToast(`Bulk updated ${res.modifiedCount} reviews to ${newStatus}`, 'success');
  };

  const handleExportCsv = () => {
    const csvContent = exportReviewsCsv(reviews);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `autozon_reviews_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Reviews CSV exported successfully', 'success');
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateReviewSettings(settings);
    showToast('Review moderation settings saved', 'success');
  };

  // Analytics Calculations
  const allAdminReviews = getAllReviewsForAdmin('all');
  const publishedRevs = allAdminReviews.filter(r => r.status === 'published');
  const totalCount = allAdminReviews.length;
  const verifiedCount = allAdminReviews.filter(r => r.verified_purchase).length;
  const verifiedPct = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;
  const photoCount = allAdminReviews.filter(r => r.images && r.images.length > 0).length;
  const photoPct = totalCount > 0 ? Math.round((photoCount / totalCount) * 100) : 0;

  return (
    <div className="admin-console-wrapper" style={{ padding: '1rem' }}>
      {/* Header */}
      <div className="card-header-flex" style={{ marginBottom: '1.5rem', background: '#0F172A', color: '#FFF', padding: '1.25rem', borderRadius: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: 'Outfit', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#FFF' }}>
            <Star color="#F59E0B" fill="#F59E0B" size={26} /> Reviews, UGC & Trust Signals Moderation Console
          </h2>
          <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: '#94A3B8' }}>
            Server-verified purchase validation, UGC photo moderation, bulk action suite, and CSV exports.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={handleExportCsv} style={{ background: '#334155', color: '#FFF', border: '1px solid #475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Download size={16} color="#38BDF8" /> Export Reviews CSV
          </button>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem', borderBottom: '1px solid #CBD5E1', paddingBottom: '0.5rem' }}>
        {[
          { id: 'moderation', label: 'Moderation Desk', icon: ShieldCheck, badge: reviews.length },
          { id: 'analytics', label: 'Review Analytics', icon: BarChart2 },
          { id: 'settings', label: 'Moderation Rules & Settings', icon: Settings }
        ].map(tab => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? '#0F172A' : '#F1F5F9',
                color: isActive ? '#FFFFFF' : '#334155',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <IconComp size={15} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span style={{ background: isActive ? '#FF6B00' : '#CBD5E1', color: isActive ? '#FFF' : '#0F172A', borderRadius: '50px', fontSize: '0.65rem', padding: '0.05rem 0.4rem' }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Moderation Desk Tab */}
      {activeTab === 'moderation' && (
        <div className="portal-card">
          {/* Status Filter Bar */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
            {['pending', 'published', 'flagged', 'rejected', 'hidden'].map(st => (
              <button
                key={st}
                onClick={() => { setStatusFilter(st); setSelectedReviewIds([]); }}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: statusFilter === st ? '#FF6B00' : '#F8FAFC',
                  color: statusFilter === st ? '#FFF' : '#334155',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {st} Reviews
              </button>
            ))}
          </div>

          {/* Bulk Action Toolbar */}
          {selectedReviewIds.length > 0 && (
            <div style={{ background: '#FEF3C7', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400E' }}>
                {selectedReviewIds.length} Reviews Selected for Bulk Action
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-primary" onClick={() => handleBulkModerate('published')} style={{ background: '#059669', padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>Bulk Approve</button>
                <button className="btn-secondary" onClick={() => handleBulkModerate('rejected')} style={{ background: '#DC2626', color: '#FFF', padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>Bulk Reject</button>
                <button className="btn-secondary" onClick={() => handleBulkModerate('hidden')} style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>Bulk Hide</button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" checked={selectedReviewIds.length === reviews.length && reviews.length > 0} onChange={handleSelectAll} />
                  </th>
                  <th>Product / Customer</th>
                  <th>Rating & Title</th>
                  <th>Review Feedback</th>
                  <th>Verification</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(r => (
                  <tr key={r.id}>
                    <td>
                      <input type="checkbox" checked={selectedReviewIds.includes(r.id)} onChange={() => handleSelectReview(r.id)} />
                    </td>
                    <td>
                      <b>{r.product_id}</b>
                      <span className="table-sub">{r.customer_name || 'Customer'}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#F59E0B' }}>
                        {[...Array(r.rating)].map((_, i) => <Star key={i} size={14} fill="#F59E0B" />)}
                        <b style={{ marginLeft: '0.3rem', color: '#0F172A' }}>{r.rating}.0</b>
                      </div>
                      <b style={{ fontSize: '0.85rem' }}>{r.title}</b>
                    </td>
                    <td style={{ maxWidth: '280px' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.3' }}>{r.review_text || r.comment}</p>
                    </td>
                    <td>
                      {r.verified_purchase ? (
                        <span className="verified-tag" style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
                          ✓ Server Verified
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Standard</span>
                      )}
                    </td>
                    <td><span className="order-status-tag shipped">{r.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        {r.status !== 'published' && (
                          <button className="btn-primary" onClick={() => handleModerateSingle(r.id, 'published')} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: '#059669' }}>
                            Approve
                          </button>
                        )}
                        {r.status !== 'rejected' && (
                          <button className="btn-secondary" onClick={() => handleModerateSingle(r.id, 'rejected')} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#DC2626' }}>
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          <div className="admin-stats-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card">
              <Star size={28} className="stat-icon revenue" />
              <div>
                <span className="stat-label">Total Product Reviews</span>
                <h3 className="stat-val">{totalCount} Reviews</h3>
              </div>
            </div>

            <div className="stat-card">
              <ShieldCheck size={28} className="stat-icon orders" />
              <div>
                <span className="stat-label">Verified Purchase %</span>
                <h3 className="stat-val">{verifiedPct}% Verified</h3>
              </div>
            </div>

            <div className="stat-card">
              <CheckCircle2 size={28} className="stat-icon products" />
              <div>
                <span className="stat-label">Photo Reviews %</span>
                <h3 className="stat-val">{photoPct}% Photo UGC</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="portal-card" style={{ maxWidth: '600px' }}>
          <h3><Settings size={20} /> Review Moderation & Policy Settings</h3>
          <form onSubmit={handleSaveSettings} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', background: '#F8FAFC', borderRadius: '6px' }}>
              <span>Require Admin Moderation Before Publishing</span>
              <input type="checkbox" checked={settings.require_moderation} onChange={e => setSettings({ ...settings, require_moderation: e.target.checked })} />
            </label>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>Minimum Review Text Length (Characters)</label>
              <input type="number" value={settings.minimum_review_length} onChange={e => setSettings({ ...settings, minimum_review_length: Number(e.target.value) })} style={{ width: '100%', padding: '0.5rem', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>Customer Review Edit Window (Days)</label>
              <input type="number" value={settings.review_edit_window_days} onChange={e => setSettings({ ...settings, review_edit_window_days: Number(e.target.value) })} style={{ width: '100%', padding: '0.5rem', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
            </div>

            <button className="btn-primary" type="submit">Save Policy Settings</button>
          </form>
        </div>
      )}
    </div>
  );
};
