import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  getProductReviews,
  verifyReviewEligibility,
  submitProductReview,
  voteReviewHelpfulness,
  reportReview
} from '../services/reviewEngine';
import {
  Star, ThumbsUp, ThumbsDown, ShieldCheck, CheckCircle2, AlertCircle,
  MessageSquare, Plus, Filter, CornerDownLeft, Flag, X, Send
} from 'lucide-react';

export const ProductReviewsView = ({ productId, productTitle }) => {
  const { user, showToast } = useStore();

  const [sortOption, setSortOption] = useState('helpful');
  const [reviewModal, setReviewModal] = useState(false);

  // Review Form State
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    reviewText: '',
    fitmentFeedback: 'Fits My Vehicle',
    vehicleMake: 'Maruti Suzuki',
    vehicleModel: 'Swift',
    vehicleYear: '2021'
  });

  const { reviews, summary } = getProductReviews(productId, sortOption);

  const handleOpenReviewModal = () => {
    const check = verifyReviewEligibility({ customerUser: user, productId });
    if (!check.eligible && !user) {
      showToast('⚠️ Please login to your account to submit a verified purchase review.', 'info');
      return;
    }
    setReviewModal(true);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.title || !reviewForm.reviewText) {
      showToast('⚠️ Please provide a review title and written feedback.', 'error');
      return;
    }

    const res = submitProductReview({
      customerUser: user || { fullName: 'Valued Buyer', email: 'buyer@autozon.in' },
      productId,
      productTitle,
      rating: reviewForm.rating,
      title: reviewForm.title,
      reviewText: reviewForm.reviewText,
      fitmentFeedback: reviewForm.fitmentFeedback,
      vehicleInfo: { make: reviewForm.vehicleMake, model: reviewForm.vehicleModel, year: reviewForm.vehicleYear }
    });

    if (res.success) {
      showToast(`🎉 ${res.message}`, 'success');
      setReviewModal(false);
    } else {
      showToast(`❌ Review Submission Error: ${res.message}`, 'error');
    }
  };

  return (
    <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.5rem', marginTop: '2rem' }}>
      {/* Header & Write Review Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#0F2167' }}>
            Customer Verified Reviews & Fitment Ratings
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Real customer feedback verified against actual completed AutoZonIndia orders
          </span>
        </div>

        <button
          onClick={handleOpenReviewModal}
          style={{ background: '#0F2167', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.6rem 1.25rem', fontSize: '0.85rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={16} /> Write Verified Review
        </button>
      </div>

      {/* Summary Rating Breakdown (Sections 25, 36) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #E2E8F0' }}>
        {/* Rating score badge */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', borderRight: '1px solid #E2E8F0', paddingRight: '1rem' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0F2167', lineHeight: 1 }}>
            {summary.averageRating}
          </div>
          <div style={{ color: '#FF6B00', fontSize: '1.2rem', margin: '0.25rem 0' }}>
            {'★'.repeat(Math.round(summary.averageRating))}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>
            Based on {summary.totalReviews} Verified Customer Reviews
          </span>
        </div>

        {/* Rating Star Distribution Progress Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', justifyContent: 'center' }}>
          {[5, 4, 3, 2, 1].map(star => {
            const count = summary.starCounts[star] || 0;
            const pct = summary.totalReviews > 0 ? Math.round((count / summary.totalReviews) * 100) : 0;
            return (
              <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                <span style={{ width: '45px', fontWeight: 700, color: '#334155' }}>{star} Stars</span>
                <div style={{ flex: 1, background: '#E2E8F0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ background: '#FF6B00', width: `${pct}%`, height: '100%' }} />
                </div>
                <span style={{ width: '35px', color: '#64748B', textAlign: 'right' }}>{count}</span>
              </div>
            );
          })}
        </div>

        {/* Fitment Accuracy Card */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: '#F0FDF4', borderRadius: '10px', padding: '1rem', border: '1px solid #BBF7D0' }}>
          <ShieldCheck size={28} color="#166534" style={{ marginBottom: '0.35rem' }} />
          <strong style={{ fontSize: '1.2rem', color: '#166534', fontWeight: 900 }}>{summary.fitmentPercentage}% Vehicle Fitment</strong>
          <span style={{ fontSize: '0.72rem', color: '#15803D', fontWeight: 700 }}>Confirmed "Fits My Vehicle"</span>
        </div>
      </div>

      {/* Sorting Control Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569' }}>
          Showing {reviews.length} Verified Reviews
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Sort By:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem', fontWeight: 800 }}
          >
            <option value="helpful">Most Helpful</option>
            <option value="newest">Newest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews Cards List (Section 62) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', background: '#F8FAFC', borderRadius: '12px', color: '#64748B' }}>
            <Star size={36} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
            <p style={{ margin: 0, fontWeight: 700 }}>No reviews published yet for this spare part.</p>
          </div>
        ) : (
          reviews.map(r => (
            <div key={r.id} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ color: '#FF6B00', fontSize: '1rem', fontWeight: 900 }}>{'★'.repeat(r.rating)}</div>
                  <strong style={{ fontSize: '0.92rem', color: '#0F172A' }}>{r.title}</strong>
                </div>

                <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F2167' }}>By {r.displayName}</span>
                {r.verifiedPurchase && (
                  <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '0.68rem', fontWeight: 900, padding: '0.15rem 0.5rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                    <CheckCircle2 size={12} /> Verified Purchase
                  </span>
                )}
                {r.fitmentFeedback === 'Fits My Vehicle' && (
                  <span style={{ background: '#F0F9FF', color: '#0369A1', fontSize: '0.68rem', fontWeight: 900, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    🚗 Verified Fit: {r.vehicleInfo?.make} {r.vehicleInfo?.model} {r.vehicleInfo?.year}
                  </span>
                )}
              </div>

              <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.6', margin: '0 0 1rem 0' }}>
                {r.reviewText}
              </p>

              {/* Official Store Response Box */}
              {r.adminResponse && (
                <div style={{ background: '#F8FAFC', borderLeft: '3px solid #0F2167', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.8rem' }}>
                  <strong style={{ color: '#0F2167', display: 'block', marginBottom: '0.2rem' }}>💬 {r.adminResponse.author}</strong>
                  <p style={{ margin: 0, color: '#475569' }}>{r.adminResponse.text}</p>
                </div>
              )}

              {/* Helpfulness Footer Action */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem', fontSize: '0.75rem', color: '#64748B' }}>
                <span>Was this review helpful?</span>
                <button
                  onClick={() => {
                    voteReviewHelpfulness(r.id, 'helpful', user?.email);
                    showToast('👍 Upvoted helpful review!', 'success');
                  }}
                  style={{ background: '#F1F5F9', border: 'none', borderRadius: '4px', padding: '0.25rem 0.55rem', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <ThumbsUp size={13} /> Yes ({r.helpfulCount})
                </button>

                <button
                  onClick={() => {
                    reportReview({ reviewId: r.id, reason: 'Off Topic', customerEmail: user?.email });
                    showToast('🚩 Review reported to store owner.', 'info');
                  }}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '0.72rem', cursor: 'pointer', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  <Flag size={12} /> Report
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* WRITE REVIEW SUBMISSION MODAL (Section 4) */}
      {reviewModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '14px', width: '100%', maxWidth: '520px', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, color: '#0F2167', fontSize: '1.1rem', fontWeight: 900 }}>
                Write Verified Product Review
              </h3>
              <button onClick={() => setReviewModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>STAR RATING *</label>
                <div style={{ display: 'flex', gap: '0.4rem', fontSize: '1.5rem', color: '#FF6B00', cursor: 'pointer' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })}>
                      {star <= reviewForm.rating ? '★' : '☆'}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>REVIEW TITLE *</label>
                <input
                  type="text"
                  placeholder="e.g. Excellent OEM Fitment & Fast Shipping!"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>WRITTEN REVIEW FEEDBACK *</label>
                <textarea
                  rows={4}
                  placeholder="Describe part performance, packaging quality, installation ease..."
                  value={reviewForm.reviewText}
                  onChange={(e) => setReviewForm({ ...reviewForm, reviewText: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setReviewModal(false)} style={{ flex: 1, background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0.55rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, background: '#0F2167', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '0.55rem', fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer' }}>Submit Verified Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
