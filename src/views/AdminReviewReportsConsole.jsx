import React, { useState, useEffect } from 'react';
import { getReviewReportsForAdmin, resolveReviewReport, moderateReviewDB } from '../services/engagementService';
import { AlertTriangle, CheckCircle, XCircle, ShieldAlert, Eye, MessageSquare, Search, Filter, ArrowLeft } from 'lucide-react';

export default function AdminReviewReportsConsole({ onNavigate }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    loadReports();
  }, [statusFilter]);

  const loadReports = async () => {
    setLoading(true);
    const list = await getReviewReportsForAdmin(statusFilter);
    setReports(list);
    setLoading(false);
  };

  const handleResolve = async (reportId, action, reviewId = null) => {
    setFeedback(null);
    const res = await resolveReviewReport(reportId, action);
    
    // If admin actioned report by hiding/rejecting the underlying review
    if (action === 'actioned' && reviewId) {
      await moderateReviewDB(reviewId, 'hidden', 'Hidden due to customer report');
    }

    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
      loadReports();
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="container py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 mb-6 border-b border-border gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-8 h-8 text-rose-500" />
            <h1 className="text-3xl font-bold tracking-tight">Review Abuse Reports Queue</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Review customer reports regarding spam, offensive language, or false information in public product reviews
          </p>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('admin-reviews')}
            className="px-4 py-2 border border-border rounded-xl text-xs font-bold hover:bg-muted flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Reviews</span>
          </button>
        )}
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-xl mb-6 text-sm font-medium ${
            feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex justify-between items-center mb-6 bg-card border border-border p-4 rounded-2xl">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-bold uppercase text-muted-foreground">Report Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-border rounded-xl bg-background text-sm font-bold"
          >
            <option value="all">All Reports</option>
            <option value="pending">Pending Review</option>
            <option value="dismissed">Dismissed</option>
            <option value="actioned">Actioned (Review Hidden)</option>
          </select>
        </div>
      </div>

      {/* Queue List */}
      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Loading reports...</div>
      ) : reports.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h3 className="font-bold text-base">No Reported Reviews</h3>
          <p className="text-muted-foreground text-xs mt-1">There are no flagged reports matching your filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((rep) => (
            <div key={rep.id} className="bg-card border border-rose-200 p-5 rounded-2xl shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 text-xs font-extrabold rounded-md uppercase">
                      Reason: {rep.reason}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Reported on {new Date(rep.created_at).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  {rep.message && (
                    <p className="text-xs text-rose-950 font-medium bg-rose-50/60 p-2 rounded-lg border border-rose-100">
                      Reporter Note: "{rep.message}"
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {rep.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleResolve(rep.id, 'actioned', rep.review_id)}
                        className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 flex items-center space-x-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Hide Review & Action</span>
                      </button>
                      <button
                        onClick={() => handleResolve(rep.id, 'dismiss')}
                        className="px-3 py-1.5 border border-border text-xs font-bold rounded-xl hover:bg-muted"
                      >
                        Dismiss Report
                      </button>
                    </>
                  ) : (
                    <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-bold rounded-full">
                      Status: {rep.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Reported Review Snapshot */}
              {rep.review && (
                <div className="bg-muted/40 border border-border p-3.5 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-foreground">Target Review: "{rep.review.title}"</div>
                  <div className="text-muted-foreground">"{rep.review.review_text || rep.review.comment}"</div>
                  <div className="text-[11px] text-muted-foreground pt-1">
                    By: {rep.review.customer_name || 'Customer'} | Product ID: {rep.review.product_id}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
