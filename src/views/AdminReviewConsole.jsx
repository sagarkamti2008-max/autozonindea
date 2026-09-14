import React, { useState, useEffect } from 'react';
import {
  getAllReviewsForAdmin,
  moderateReviewDB,
  getAdminReviewAnalytics
} from '../services/engagementService';
import {
  Star,
  CheckCircle,
  XCircle,
  EyeOff,
  Search,
  Filter,
  Check,
  X,
  AlertCircle,
  TrendingUp,
  Award,
  MessageSquare,
  ShieldAlert,
  Edit3,
  FileText,
  BarChart2
} from 'lucide-react';

export default function AdminReviewConsole({ onNavigate }) {
  const [reviews, setReviews] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFeedback, setActionFeedback] = useState(null);

  // Moderation Modal state for internal notes/reasons
  const [activeReviewForMod, setActiveReviewForMod] = useState(null);
  const [modTargetStatus, setModTargetStatus] = useState('rejected');
  const [adminNote, setAdminNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [submittingMod, setSubmittingMod] = useState(false);

  useEffect(() => {
    loadData();
  }, [statusFilter, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    const revs = await getAllReviewsForAdmin(statusFilter, searchQuery);
    const stats = await getAdminReviewAnalytics();
    setReviews(revs);
    setAnalytics(stats);
    setLoading(false);
  };

  const handleOpenModModal = (review, targetStatus) => {
    setActiveReviewForMod(review);
    setModTargetStatus(targetStatus);
    setAdminNote(review.admin_note || '');
    setRejectionReason(review.rejection_reason || '');
  };

  const handleConfirmModeration = async (e) => {
    e.preventDefault();
    setSubmittingMod(true);
    setActionFeedback(null);

    const res = await moderateReviewDB(
      activeReviewForMod.id,
      modTargetStatus,
      adminNote.trim() || null,
      modTargetStatus === 'rejected' ? rejectionReason.trim() || 'Content did not comply with guidelines' : null
    );

    if (res.success) {
      setActionFeedback({ type: 'success', text: `Review status updated to ${modTargetStatus}.` });
      setActiveReviewForMod(null);
      loadData();
    } else {
      setActionFeedback({ type: 'error', text: res.message });
    }
    setSubmittingMod(false);
  };

  return (
    <div className="container py-8 max-w-7xl">
      {/* Header & Quick Links */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 mb-6 border-b border-border gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review Moderation Console</h1>
          <p className="text-muted-foreground text-sm">
            Approve verified purchase reviews, inspect flagged content, and add internal notes
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {onNavigate && (
            <>
              <button
                onClick={() => onNavigate('admin/reviews/reports')}
                className="px-3.5 py-2 border border-border rounded-xl text-xs font-bold hover:bg-muted flex items-center space-x-1"
              >
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>Reports Queue ({analytics?.reportedCount || 0})</span>
              </button>
              <button
                onClick={() => onNavigate('admin/reviews/analytics')}
                className="px-3.5 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold shadow-sm flex items-center space-x-1"
              >
                <BarChart2 className="w-4 h-4" />
                <span>Analytics Dashboard</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-card border border-border p-4 rounded-2xl">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-semibold uppercase">Total Reviews</span>
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-black">{analytics.totalReviews}</div>
          </div>

          <div className="bg-card border border-border p-4 rounded-2xl">
            <div className="flex items-center justify-between text-amber-600 mb-1">
              <span className="text-xs font-semibold uppercase">Pending</span>
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-amber-600">{analytics.pendingCount}</div>
          </div>

          <div className="bg-card border border-border p-4 rounded-2xl">
            <div className="flex items-center justify-between text-emerald-600 mb-1">
              <span className="text-xs font-semibold uppercase">Approved</span>
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-emerald-600">{analytics.approvedCount}</div>
          </div>

          <div className="bg-card border border-border p-4 rounded-2xl">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-semibold uppercase">Avg Rating</span>
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <div className="text-2xl font-black">{analytics.avgRating} / 5.0</div>
          </div>

          <div className="bg-card border border-border p-4 rounded-2xl">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-semibold uppercase">Verified Purchases</span>
              <Award className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600">{analytics.verifiedPercentage}%</div>
          </div>
        </div>
      )}

      {/* Action Notification */}
      {actionFeedback && (
        <div
          className={`p-3 rounded-xl mb-6 text-sm font-medium ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {actionFeedback.text}
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 bg-card border border-border p-4 rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by product SKU, customer display name, review title, or body..."
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
            <option value="pending">Pending Moderation</option>
            <option value="approved">Approved & Live</option>
            <option value="rejected">Rejected</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
      </div>

      {/* Reviews Moderation Cards */}
      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
          <h3 className="font-bold text-base mb-1">No Reviews Found</h3>
          <p className="text-muted-foreground text-xs">No reviews match your current search or status filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className={`bg-card border p-5 rounded-2xl transition-all shadow-sm ${
                rev.is_flagged
                  ? 'border-rose-400 bg-rose-50/10'
                  : rev.status === 'pending'
                  ? 'border-amber-300 bg-amber-50/20'
                  : rev.status === 'approved'
                  ? 'border-emerald-200'
                  : 'border-border'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                    <h3 className="font-bold text-base">{rev.title}</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{rev.customer_name || 'Customer'}</span>
                    <span>•</span>
                    <span>Product: {rev.product?.name || rev.product_id}</span>
                    <span>•</span>
                    <span>{new Date(rev.created_at).toLocaleDateString('en-IN')}</span>

                    {rev.verified_purchase && (
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        ✓ VERIFIED PURCHASE
                      </span>
                    )}

                    {rev.is_flagged && (
                      <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[10px] flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>FLAGGED: {rev.flag_reason}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Moderation Actions */}
                <div className="flex items-center space-x-2">
                  {rev.status === 'pending' && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                      Pending Approval
                    </span>
                  )}
                  {rev.status === 'approved' && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                      Approved
                    </span>
                  )}
                  {rev.status === 'rejected' && (
                    <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full">
                      Rejected
                    </span>
                  )}

                  <div className="flex items-center space-x-1 border-l border-border pl-2">
                    {rev.status !== 'approved' && (
                      <button
                        onClick={() => handleOpenModModal(rev, 'approved')}
                        title="Approve Review"
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}

                    {rev.status !== 'rejected' && (
                      <button
                        onClick={() => handleOpenModModal(rev, 'rejected')}
                        title="Reject Review"
                        className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 flex items-center space-x-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}

                    {rev.status !== 'hidden' && (
                      <button
                        onClick={() => handleOpenModModal(rev, 'hidden')}
                        title="Hide Review"
                        className="p-1.5 border border-border rounded-lg text-muted-foreground hover:bg-muted"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-sm text-foreground/90 mb-3 bg-muted/30 p-3 rounded-xl">
                "{rev.review_text || rev.comment}"
              </p>

              {/* Photos if attached */}
              {rev.images && rev.images.length > 0 && (
                <div className="flex space-x-2 mb-2">
                  {rev.images.map((img, idx) => (
                    <a key={idx} href={img} target="_blank" rel="noreferrer">
                      <img
                        src={img}
                        alt="Customer photo"
                        className="w-16 h-16 object-cover rounded-lg border border-border hover:opacity-80"
                      />
                    </a>
                  ))}
                </div>
              )}

              {/* Internal Notes Display */}
              {rev.admin_note && (
                <div className="text-xs bg-amber-50/70 border border-amber-200 p-2 rounded-lg text-amber-950 mt-2">
                  <span className="font-bold text-amber-900 mr-1">Internal Admin Note:</span>
                  {rev.admin_note}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Moderation Notes & Rejection Reason Modal */}
      {activeReviewForMod && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <h2 className="text-xl font-bold mb-2">Moderate Review</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Target Status: <span className="font-bold uppercase text-primary">{modTargetStatus}</span>
            </p>

            <form onSubmit={handleConfirmModeration} className="space-y-4">
              {modTargetStatus === 'rejected' && (
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                    Rejection Reason (Internal Record)
                  </label>
                  <select
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm font-semibold"
                  >
                    <option value="">Select a reason...</option>
                    <option value="Contains promotional spam or external links">Contains promotional spam or external links</option>
                    <option value="Profanity or inappropriate language">Profanity or inappropriate language</option>
                    <option value="Irrelevant to product performance">Irrelevant to product performance</option>
                    <option value="Duplicate submission">Duplicate submission</option>
                    <option value="Other non-compliance">Other non-compliance</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Internal Moderation Note (Hidden from Customer)
                </label>
                <textarea
                  rows={3}
                  placeholder="Record internal team notes..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl text-sm bg-background"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setActiveReviewForMod(null)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl border border-border hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingMod}
                  className="px-5 py-2 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90"
                >
                  {submittingMod ? 'Saving...' : 'Confirm Moderation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

