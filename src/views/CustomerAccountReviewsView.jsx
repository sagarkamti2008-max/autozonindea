import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  getCustomerReviews,
  canCustomerReviewProduct,
  submitProductReview,
  updateCustomerReview,
  deleteCustomerReview
} from '../services/engagementService';
import { Star, CheckCircle, Clock, XCircle, ShoppingBag, MessageSquare, Camera, Edit3, Trash2, X } from 'lucide-react';

export default function CustomerAccountReviewsView({ onNavigate }) {
  const { user } = useStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    loadCustomerData();
  }, [user]);

  const loadCustomerData = async () => {
    setLoading(true);
    if (user) {
      const userReviews = await getCustomerReviews(user.id, user.email);
      setReviews(userReviews);
    }
    setLoading(false);
  };

  const handleOpenEditModal = (rev) => {
    setEditingReview(rev);
    setRating(rev.rating || 5);
    setTitle(rev.title || '');
    setReviewText(rev.review_text || rev.comment || '');
    setImageFiles([]);
    setFeedback(null);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to remove this review?')) return;
    const res = await deleteCustomerReview(reviewId, user?.id);
    if (res.success) {
      loadCustomerData();
    }
  };

  const handleSubmitEditReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await updateCustomerReview(editingReview.id, user?.id, {
        rating,
        title,
        reviewText,
        imageFiles
      });

      if (res.success) {
        setFeedback({ type: 'success', text: res.message });
        setTimeout(() => {
          setEditingReview(null);
          loadCustomerData();
        }, 1500);
      } else {
        setFeedback({ type: 'error', text: res.message });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to update review.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-8 max-w-5xl">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Product Reviews</h1>
          <p className="text-muted-foreground text-sm">
            Manage your verified purchase product reviews, view approval status, or update feedback
          </p>
        </div>
      </div>

      {/* Submitted Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-12 text-center text-xs text-muted-foreground">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-10 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-bold">No Reviews Written Yet</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
              When your orders are delivered, you can share verified purchase reviews with photos to help other car owners.
            </p>
            <button
              onClick={() => onNavigate && onNavigate('orders')}
              className="btn btn-primary px-6 py-2.5 rounded-xl font-semibold inline-flex items-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Delivered Orders</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-sm">{rev.title}</span>
                    </div>

                    {rev.verified_purchase && (
                      <span className="inline-flex items-center space-x-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle className="w-3 h-3" />
                        <span>Verified Purchase</span>
                      </span>
                    )}
                  </div>

                  {/* Actions & Status */}
                  <div className="flex items-center space-x-3">
                    {rev.status === 'approved' || rev.status === 'Published' ? (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center space-x-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approved & Live</span>
                      </span>
                    ) : rev.status === 'pending' ? (
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending Approval</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full flex items-center space-x-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{rev.status}</span>
                      </span>
                    )}

                    <button
                      onClick={() => handleOpenEditModal(rev)}
                      className="p-1.5 border border-border rounded-lg text-muted-foreground hover:text-foreground"
                      title="Edit Review"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="p-1.5 border border-border rounded-lg text-muted-foreground hover:text-rose-600"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-foreground mb-3">{rev.review_text || rev.comment}</p>

                {rev.images && rev.images.length > 0 && (
                  <div className="flex space-x-2 mb-3">
                    {rev.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Customer upload"
                        className="w-14 h-14 object-cover rounded-lg border border-border"
                      />
                    ))}
                  </div>
                )}

                <div className="text-xs text-muted-foreground border-t border-border/50 pt-2 flex justify-between">
                  <span>Submitted on {new Date(rev.created_at).toLocaleDateString('en-IN')}</span>
                  <span>Order Ref: {rev.order_id || 'AZI-ORDER'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Edit Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setEditingReview(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4">Edit My Review</h2>

            {feedback && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs font-medium ${
                  feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {feedback.text}
              </div>
            )}

            <form onSubmit={handleSubmitEditReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">
                  Rating
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
                        className={`w-8 h-8 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-muted-foreground">
                  Headline
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-muted-foreground">
                  Review Text
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-muted-foreground">
                  Add Photos (Optional)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setImageFiles(Array.from(e.target.files))}
                  className="text-xs text-muted-foreground"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl border border-border hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Update & Resubmit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

