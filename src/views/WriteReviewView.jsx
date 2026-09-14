import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Star, Upload, ShieldCheck, ArrowLeft, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  submitProductReview,
  getReviewEligibility,
  getReviewSettings
} from '../services/advancedReviewService';

export const WriteReviewView = ({ productId = 'prod-ceramic-brake-pads' }) => {
  const { products, orders, user, setCurrentView, showToast } = useStore();
  const settings = getReviewSettings();

  const product = (products || []).find(p => p.id === productId) || {
    id: productId,
    title: 'Ceramic High-Performance Front Brake Pad Kit',
    brand: 'BOSCH OEM ORIGINAL',
    image: 'https://images.unsplash.com/photo-1600792580403-0550a1030699?auto=format&fit=crop&w=600&q=80'
  };

  const customerId = user?.id || 'cust-101';
  const customerName = user?.name || 'Rahul Sharma';

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eligibility, setEligibility] = useState(null);

  useEffect(() => {
    const el = getReviewEligibility(customerId, productId, orders || []);
    setEligibility(el);
    if (el.hasReviewed && el.existingReview) {
      setRating(el.existingReview.rating);
      setTitle(el.existingReview.title || '');
      setReviewText(el.existingReview.review_text || el.existingReview.comment || '');
      setImages(el.existingReview.images || []);
    }
  }, [customerId, productId]);

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    if (images.length >= 4) {
      showToast('Maximum 4 review photos allowed', 'error');
      return;
    }
    setImages([...images, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (reviewText.length < settings.minimum_review_length) {
      showToast(`Review must be at least ${settings.minimum_review_length} characters`, 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitProductReview({
        productId,
        customerId,
        customerName,
        rating,
        title,
        reviewText,
        images,
        orders: orders || []
      });

      if (res.success) {
        showToast('🎉 Review submitted successfully! Thank you for helping fellow automotive buyers.', 'success');
        setCurrentView('customer-reviews');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button className="btn-secondary" onClick={() => setCurrentView('catalog')} style={{ padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowLeft size={16} /> Back to Catalog
        </button>
        <h2 style={{ margin: 0, fontFamily: 'Outfit', fontWeight: 900 }}>
          {eligibility?.hasReviewed ? 'Edit Product Review' : 'Write a Product Review'}
        </h2>
      </div>

      {/* Target Product Summary Card */}
      <div className="portal-card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <img src={product.image || product.product_images?.[0]?.image_url} alt="" style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '0.25rem' }} />
        <div>
          <span className="badge-classification oem" style={{ fontSize: '0.7rem' }}>{product.brand?.name || product.brand || 'OEM ORIGINAL'}</span>
          <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.1rem' }}>{product.title || product.name}</h3>

          {/* Server-Calculated Verified Purchase Badge Preview */}
          {eligibility?.verifiedPurchase ? (
            <span className="verified-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.4rem', background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
              <ShieldCheck size={14} color="#059669" /> Server Verified Purchase
            </span>
          ) : (
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', marginTop: '0.4rem' }}>
              ℹ️ Standard Review (Order verification not linked)
            </span>
          )}
        </div>
      </div>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="portal-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Star Rating Picker */}
        <div>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Overall Product Rating (1 to 5 Stars) *
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[1, 2, 3, 4, 5].map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <Star size={32} fill={s <= rating ? '#F59E0B' : 'none'} color={s <= rating ? '#F59E0B' : '#CBD5E1'} />
              </button>
            ))}
            <span style={{ marginLeft: '0.75rem', fontWeight: 800, fontSize: '1.2rem', color: '#F59E0B', alignSelf: 'center' }}>
              {rating}.0 / 5.0
            </span>
          </div>
        </div>

        {/* Review Title */}
        <div>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
            Review Title (Headline)
          </label>
          <input
            type="text"
            placeholder="e.g. 100% Genuine Bosch Parts - Smooth Braking!"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
          />
        </div>

        {/* Review Text */}
        <div>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
            Detailed Product Feedback *
          </label>
          <textarea
            placeholder="Describe fitment quality, packaging, braking/engine performance, or installation experience..."
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            style={{ width: '100%', height: '140px', padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem', lineHeight: '1.5' }}
            required
          />
          <span style={{ fontSize: '0.75rem', color: reviewText.length < settings.minimum_review_length ? '#EF4444' : '#64748B' }}>
            {reviewText.length} / {settings.minimum_review_length} min characters required
          </span>
        </div>

        {/* Photo Upload Row */}
        <div>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
            Attach Product Photo URLs (Optional, Max 4)
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input
              type="text"
              placeholder="Paste image URL (e.g. https://...)"
              value={imageUrlInput}
              onChange={e => setImageUrlInput(e.target.value)}
              style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem' }}
            />
            <button type="button" className="btn-secondary" onClick={handleAddImageUrl}>
              + Add Photo
            </button>
          </div>

          {images.length > 0 && (
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {images.map((img, i) => (
                <div key={i} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #CBD5E1' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    style={{ position: 'absolute', top: 2, right: 2, background: '#EF4444', color: '#FFF', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.65rem', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="btn-primary" type="submit" disabled={isSubmitting} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', fontSize: '1rem', fontWeight: 900 }}>
          {isSubmitting ? 'Submitting Review...' : 'Submit Product Review'}
        </button>
      </form>
    </div>
  );
};

export default WriteReviewView;
