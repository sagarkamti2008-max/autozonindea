import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { submitCustomerFeedback, getCustomerFeedbackHistory } from '../services/engagementService';
import { MessageSquare, Star, CheckCircle, Clock, Send, AlertCircle, ShoppingBag, User } from 'lucide-react';

export default function CustomerFeedbackView() {
  const { user, navigateTo } = useStore();
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [category, setCategory] = useState('Website');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [orderId, setOrderId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState(null);

  useEffect(() => {
    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    setLoading(true);
    if (user) {
      const history = await getCustomerFeedbackHistory(user.id, user.email);
      setFeedbackList(history);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedbackResult(null);

    const res = await submitCustomerFeedback({
      customerId: user?.id || null,
      customerName: user?.name || user?.email?.split('@')[0] || 'Customer',
      customerEmail: user?.email || '',
      orderId: orderId.trim() || null,
      category,
      message,
      rating
    });

    if (res.success) {
      setFeedbackResult({ type: 'success', text: res.message });
      setMessage('');
      setOrderId('');
      loadHistory();
    } else {
      setFeedbackResult({ type: 'error', text: res.message });
    }
    setSubmitting(false);
  };

  return (
    <div className="container py-8 max-w-5xl">
      <div className="pb-6 mb-8 border-b border-border">
        <h1 className="text-3xl font-bold tracking-tight">Customer Feedback & Suggestions</h1>
        <p className="text-muted-foreground text-sm mt-1">
          We value your experience! Share your feedback regarding website performance, order delivery, product quality, or customer support.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Feedback Submission Form */}
        <div className="lg:col-span-6 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span>Submit Your Feedback</span>
          </h2>

          {feedbackResult && (
            <div
              className={`p-4 rounded-xl mb-4 text-xs font-medium ${
                feedbackResult.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {feedbackResult.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Feedback Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm font-semibold focus:ring-2 focus:ring-primary"
              >
                <option value="Website">Website & UI Experience</option>
                <option value="Product">Product Catalog & Fitment</option>
                <option value="Delivery">Packaging & Courier Delivery</option>
                <option value="Support">Customer Support Service</option>
                <option value="Payment">Payment & Billing</option>
                <option value="Other">General Suggestion</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Rating / Satisfaction Level
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Related Order ID (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. AZI-20260911-9981"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Feedback Message
              </label>
              <textarea
                required
                rows={5}
                placeholder="Tell us what went well or how we can improve..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm shadow-md hover:opacity-90 flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Send Feedback'}</span>
            </button>
          </form>
        </div>

        {/* Previous Feedback History */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <Clock className="w-5 h-5 text-primary" />
            <span>My Submitted Feedback</span>
          </h2>

          {loading ? (
            <div className="py-8 text-center text-xs text-muted-foreground">Loading history...</div>
          ) : feedbackList.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <h3 className="font-bold text-sm">No Feedback Submitted Yet</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Your past submitted feedback and support responses will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {feedbackList.map((fb) => (
                <div key={fb.id} className="bg-card border border-border p-4 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-md">
                      {fb.category}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        fb.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : fb.status === 'reviewing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {fb.status?.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-sm text-foreground mb-2">"{fb.message}"</p>

                  <div className="flex justify-between items-center text-xs text-muted-foreground border-t border-border/40 pt-2">
                    <span>{new Date(fb.created_at).toLocaleDateString('en-IN')}</span>
                    {fb.rating && (
                      <span className="flex items-center text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="ml-1 text-foreground font-bold">{fb.rating}/5</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
