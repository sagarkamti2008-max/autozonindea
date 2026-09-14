import React, { useState, useEffect } from 'react';
import { getAllFeedbackForAdmin, updateFeedbackStatusDB } from '../services/engagementService';
import { MessageSquare, Filter, CheckCircle, Clock, Star, Edit3, Save, X } from 'lucide-react';

export default function AdminFeedbackConsole() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Internal Note Modal State
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [newStatus, setNewStatus] = useState('reviewing');
  const [internalNote, setInternalNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);

  useEffect(() => {
    loadFeedback();
  }, [categoryFilter, statusFilter]);

  const loadFeedback = async () => {
    setLoading(true);
    const data = await getAllFeedbackForAdmin(categoryFilter, statusFilter);
    setFeedbackList(data);
    setLoading(false);
  };

  const handleOpenStatusModal = (fb) => {
    setSelectedFeedback(fb);
    setNewStatus(fb.status || 'reviewing');
    setInternalNote(fb.internal_note || '');
    setActionFeedback(null);
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await updateFeedbackStatusDB(selectedFeedback.id, newStatus, internalNote);
    if (res.success) {
      setActionFeedback({ type: 'success', text: res.message });
      setTimeout(() => {
        setSelectedFeedback(null);
        loadFeedback();
      }, 1200);
    } else {
      setActionFeedback({ type: 'error', text: res.message });
    }
    setSubmitting(false);
  };

  return (
    <div className="container py-8 max-w-7xl">
      <div className="pb-6 mb-6 border-b border-border">
        <h1 className="text-3xl font-bold tracking-tight">Customer Feedback Management</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor customer satisfaction, review website/product/delivery feedback, and log internal resolution notes
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6 bg-card border border-border p-4 rounded-2xl">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-bold uppercase text-muted-foreground">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 border border-border rounded-xl bg-background text-xs font-bold"
          >
            <option value="all">All Categories</option>
            <option value="Website">Website</option>
            <option value="Product">Product</option>
            <option value="Delivery">Delivery</option>
            <option value="Support">Support</option>
            <option value="Payment">Payment</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-bold uppercase text-muted-foreground">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-border rounded-xl bg-background text-xs font-bold"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="reviewing">Reviewing</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Feedback Items Table/List */}
      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Loading feedback...</div>
      ) : feedbackList.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
          <h3 className="font-bold text-base">No Customer Feedback Found</h3>
          <p className="text-xs text-muted-foreground mt-1">No feedback entries match your active category/status filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbackList.map((fb) => (
            <div key={fb.id} className="bg-card border border-border p-5 rounded-2xl shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-extrabold rounded-md">
                      {fb.category}
                    </span>
                    {fb.rating && (
                      <div className="flex text-amber-400 items-center">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="ml-1 text-xs font-bold text-foreground">{fb.rating}/5</span>
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">• {new Date(fb.created_at).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Customer: <span className="font-bold text-foreground">{fb.customer_name || 'Anonymous'}</span>
                    {fb.order_id && <span className="ml-2 font-mono">Order Ref: {fb.order_id}</span>}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      fb.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : fb.status === 'reviewing'
                        ? 'bg-blue-100 text-blue-800'
                        : fb.status === 'closed'
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {fb.status?.toUpperCase()}
                  </span>

                  <button
                    onClick={() => handleOpenStatusModal(fb)}
                    className="px-3 py-1.5 border border-border rounded-xl text-xs font-bold hover:bg-muted flex items-center space-x-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Manage Status & Notes</span>
                  </button>
                </div>
              </div>

              <p className="text-sm text-foreground/90 bg-muted/30 p-3 rounded-xl mb-2">
                "{fb.message}"
              </p>

              {fb.internal_note && (
                <div className="text-xs bg-amber-50/70 border border-amber-200 p-2.5 rounded-lg text-amber-950">
                  <span className="font-bold text-amber-800 mr-1">Internal Note:</span>
                  {fb.internal_note}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Status & Internal Note Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setSelectedFeedback(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4">Manage Feedback</h2>

            {actionFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-medium mb-4 ${
                  actionFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {actionFeedback.text}
              </div>
            )}

            <form onSubmit={handleSaveStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm font-bold"
                >
                  <option value="new">New</option>
                  <option value="reviewing">Under Review</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Internal Note (Hidden from Customer)</label>
                <textarea
                  rows={4}
                  placeholder="Record internal resolution details or action taken..."
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl text-sm bg-background"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setSelectedFeedback(null)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl border border-border hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
