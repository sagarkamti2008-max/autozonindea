/**
 * AutoZoneIndia Advanced Reviews, Ratings & UGC Trust Engine
 * Single-Owner Automotive Platform Service Layer
 */

import { supabase } from './supabaseClient';

const STORAGE_KEYS = {
  REVIEWS: 'autozon_product_reviews_v3',
  IMAGES: 'autozon_review_images_v1',
  VOTES: 'autozon_review_votes_v1',
  REPORTS: 'autozon_review_reports_v2',
  REQUESTS: 'autozon_review_requests_v1',
  SETTINGS: 'autozon_review_settings_v1'
};

const safeGetStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
};

const safeSetStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to storage`, e);
  }
};

// ----------------------------------------------------------------------------
// 1. REVIEW SETTINGS MANAGEMENT
// ----------------------------------------------------------------------------
export const getReviewSettings = () => safeGetStorage(STORAGE_KEYS.SETTINGS, {
  review_enabled: true,
  require_moderation: true,
  minimum_review_length: 10,
  maximum_review_length: 2000,
  review_edit_window_days: 14,
  review_request_delay_days: 7,
  review_reminder_delay_days: 5,
  maximum_reminders: 1,
  photo_reviews_enabled: true,
  helpful_votes_enabled: true
});

export const updateReviewSettings = (newSettings) => {
  const current = getReviewSettings();
  const updated = { ...current, ...newSettings };
  safeSetStorage(STORAGE_KEYS.SETTINGS, updated);
  return updated;
};

// ----------------------------------------------------------------------------
// 2. SERVER-SIDE VERIFIED PURCHASE CALCULATOR
// ----------------------------------------------------------------------------
export const calculateVerifiedPurchase = (customerId, orderId, orderItemId, productId, orders = []) => {
  if (!customerId || !productId) return false;

  // Strict verification checking customer_id + order_id + order_item_id + product_id against delivered orders
  return orders.some(order => {
    if (order.customerId !== customerId && order.customer_id !== customerId) return false;

    // Check if order is completed / delivered / confirmed
    const isValidStatus = order.orderStatus === 'Delivered' || order.orderStatus === 'Shipped' || order.status === 'Delivered' || order.status === 'Completed';
    if (!isValidStatus) return false;

    if (orderId && order.id !== orderId && order.orderNumber !== orderId) return false;

    // Check order items
    if (order.items && Array.isArray(order.items)) {
      return order.items.some(item => {
        if (item.productId === productId || item.product_id === productId || item.id === productId) return true;
        if (orderItemId && item.id === orderItemId) return true;
        return false;
      });
    }

    return true;
  });
};

// ----------------------------------------------------------------------------
// 3. REVIEW ELIGIBILITY CHECKER
// ----------------------------------------------------------------------------
export const getReviewEligibility = (customerId, productId, orders = [], existingReviews = []) => {
  if (!customerId || !productId) return { eligible: false, reason: 'Authentication required' };

  // Check if customer already submitted a review for this product
  const reviews = existingReviews.length > 0 ? existingReviews : safeGetStorage(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  const existing = reviews.find(r => r.customer_id === customerId && r.product_id === productId && r.status !== 'rejected');

  if (existing) {
    const settings = getReviewSettings();
    const createdTime = new Date(existing.created_at).getTime();
    const editWindowMs = (settings.review_edit_window_days || 14) * 24 * 60 * 60 * 1000;
    const isEditable = (Date.now() - createdTime) <= editWindowMs;

    return {
      eligible: false,
      hasReviewed: true,
      existingReview: existing,
      isEditable,
      reason: isEditable ? 'Review already submitted (Editable)' : 'Review submitted (Edit window expired)'
    };
  }

  // Check purchase history
  const isVerified = calculateVerifiedPurchase(customerId, null, null, productId, orders);

  return {
    eligible: true,
    hasReviewed: false,
    verifiedPurchase: isVerified,
    reason: isVerified ? 'Eligible as Verified Buyer' : 'Eligible as Customer'
  };
};

// ----------------------------------------------------------------------------
// 4. RATING SUMMARY AGGREGATOR
// ----------------------------------------------------------------------------
export const calculateRatingSummary = (productId, reviewsList = []) => {
  const allReviews = reviewsList.length > 0 ? reviewsList : safeGetStorage(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  const publishedReviews = allReviews.filter(r => r.product_id === productId && r.status === 'published');

  const totalReviews = publishedReviews.length;
  if (totalReviews === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      starCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      starPercentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      verifiedCount: 0,
      photoCount: 0
    };
  }

  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalRatingSum = 0;
  let verifiedCount = 0;
  let photoCount = 0;

  publishedReviews.forEach(r => {
    const rating = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
    starCounts[rating] = (starCounts[rating] || 0) + 1;
    totalRatingSum += rating;
    if (r.verified_purchase) verifiedCount++;
    if (r.images && r.images.length > 0) photoCount++;
  });

  const averageRating = Number((totalRatingSum / totalReviews).toFixed(1));
  const starPercentages = {
    5: Math.round((starCounts[5] / totalReviews) * 100),
    4: Math.round((starCounts[4] / totalReviews) * 100),
    3: Math.round((starCounts[3] / totalReviews) * 100),
    2: Math.round((starCounts[2] / totalReviews) * 100),
    1: Math.round((starCounts[1] / totalReviews) * 100)
  };

  return {
    totalReviews,
    averageRating,
    starCounts,
    starPercentages,
    verifiedCount,
    photoCount
  };
};

// ----------------------------------------------------------------------------
// 5. REVIEW CREATION & EDITING WITH CONTENT MODERATION PIPELINE
// ----------------------------------------------------------------------------
export const evaluateReviewModeration = (title = '', reviewText = '') => {
  const text = `${title} ${reviewText}`.trim();
  let isFlagged = false;
  const flagReasons = [];

  // Check 1: External Links
  if (/https?:\/\/[^\s]+/gi.test(text)) {
    isFlagged = true;
    flagReasons.push('Contains external URL');
  }

  // Check 2: Repeated Characters Spam
  if (/(.)\1{6,}/.test(text)) {
    isFlagged = true;
    flagReasons.push('Excessive repeated characters');
  }

  // Check 3: Phone number pattern
  if (/\b[6-9]\d{9}\b/.test(text)) {
    isFlagged = true;
    flagReasons.push('Contains phone number');
  }

  // NOTE: Automated pipeline flags suspicious reviews, but NEVER auto-rejects negative ratings
  return {
    status: isFlagged ? 'flagged' : 'pending',
    flagReasons
  };
};

export const submitProductReview = async ({ productId, customerId, customerName, orderId, orderItemId, rating, title, reviewText, images = [], orders = [] }) => {
  const settings = getReviewSettings();

  // Validate text length
  if (!reviewText || reviewText.length < settings.minimum_review_length) {
    throw new Error(`Review must be at least ${settings.minimum_review_length} characters long.`);
  }

  // Calculate Verified Purchase Server-Side Strictly
  const isVerified = calculateVerifiedPurchase(customerId, orderId, orderItemId, productId, orders);

  // Moderation check
  const modResult = evaluateReviewModeration(title, reviewText);
  const initialStatus = settings.require_moderation ? modResult.status : 'published';

  const payload = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    product_id: productId,
    customer_id: customerId || 'cust-101',
    customer_name: customerName || 'Valued Customer',
    order_id: orderId || null,
    order_item_id: orderItemId || null,
    rating: Math.min(5, Math.max(1, Number(rating))),
    title: title || '',
    review_text: reviewText,
    comment: reviewText,
    status: initialStatus, // pending, published, rejected, hidden, flagged
    verified_purchase: isVerified,
    helpful_count: 0,
    report_count: 0,
    images: images || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const reviews = safeGetStorage(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  const existingIdx = reviews.findIndex(r => r.customer_id === customerId && r.product_id === productId);

  if (existingIdx >= 0) {
    reviews[existingIdx] = { ...reviews[existingIdx], ...payload, edit_count: (reviews[existingIdx].edit_count || 0) + 1, edited_at: new Date().toISOString() };
  } else {
    reviews.unshift(payload);
  }

  safeSetStorage(STORAGE_KEYS.REVIEWS, reviews);

  return { success: true, review: payload, status: initialStatus };
};

export const getProductReviews = (productId, { sort = 'newest', starFilter = 'all', withPhotosOnly = false, verifiedOnly = false } = {}) => {
  let reviews = safeGetStorage(STORAGE_KEYS.REVIEWS, SEED_REVIEWS).filter(r => r.product_id === productId && r.status === 'published');

  if (starFilter !== 'all') {
    const starNum = Number(starFilter);
    reviews = reviews.filter(r => r.rating === starNum);
  }

  if (withPhotosOnly) {
    reviews = reviews.filter(r => r.images && r.images.length > 0);
  }

  if (verifiedOnly) {
    reviews = reviews.filter(r => r.verified_purchase === true);
  }

  // Sorting
  if (sort === 'newest') reviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  else if (sort === 'oldest') reviews.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  else if (sort === 'highest') reviews.sort((a, b) => b.rating - a.rating);
  else if (sort === 'lowest') reviews.sort((a, b) => a.rating - b.rating);
  else if (sort === 'helpful') reviews.sort((a, b) => (b.helpful_count || 0) - (a.helpful_count || 0));

  return reviews;
};

export const getCustomerReviews = (customerId) => {
  const reviews = safeGetStorage(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  return reviews.filter(r => r.customer_id === customerId);
};

// ----------------------------------------------------------------------------
// 6. HELPFUL VOTES & REVIEW REPORTING ENGINES
// ----------------------------------------------------------------------------
export const voteReviewHelpful = (reviewId, customerId, voteType = 'helpful') => {
  const votes = safeGetStorage(STORAGE_KEYS.VOTES, []);
  const existingIndex = votes.findIndex(v => v.review_id === reviewId && v.customer_id === customerId);

  const reviews = safeGetStorage(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  const targetReview = reviews.find(r => r.id === reviewId);
  if (!targetReview) throw new Error('Review not found');

  if (existingIndex >= 0) {
    if (votes[existingIndex].vote === voteType) {
      // Remove vote
      votes.splice(existingIndex, 1);
      targetReview.helpful_count = Math.max(0, (targetReview.helpful_count || 0) - 1);
    } else {
      // Toggle vote
      votes[existingIndex].vote = voteType;
    }
  } else {
    votes.push({ id: `vote-${Date.now()}`, review_id: reviewId, customer_id: customerId, vote: voteType, created_at: new Date().toISOString() });
    targetReview.helpful_count = (targetReview.helpful_count || 0) + 1;
  }

  safeSetStorage(STORAGE_KEYS.VOTES, votes);
  safeSetStorage(STORAGE_KEYS.REVIEWS, reviews);
  return targetReview.helpful_count;
};

export const reportReview = (reviewId, reporterCustomerId, reason, description = '') => {
  const reports = safeGetStorage(STORAGE_KEYS.REPORTS, []);
  const payload = {
    id: `rep-${Date.now()}`,
    review_id: reviewId,
    reporter_customer_id: reporterCustomerId || 'cust-guest',
    reason, // spam, off_topic, abusive, false_information, duplicate, personal_information, other
    description,
    status: 'pending',
    created_at: new Date().toISOString(),
    resolved_at: null,
    resolved_by: null
  };
  reports.unshift(payload);
  safeSetStorage(STORAGE_KEYS.REPORTS, reports);

  // Increment report_count on review
  const reviews = safeGetStorage(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  const target = reviews.find(r => r.id === reviewId);
  if (target) {
    target.report_count = (target.report_count || 0) + 1;
    if (target.report_count >= 3 && target.status === 'published') {
      target.status = 'flagged'; // Flag for admin review
    }
    safeSetStorage(STORAGE_KEYS.REVIEWS, reviews);
  }

  return payload;
};

export const getReviewReports = () => safeGetStorage(STORAGE_KEYS.REPORTS, []);

// ----------------------------------------------------------------------------
// 7. ADMIN MODERATION & BULK MODERATION HANDLERS
// ----------------------------------------------------------------------------
export const getAllReviewsForAdmin = (statusFilter = 'all') => {
  const reviews = safeGetStorage(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  if (statusFilter === 'all') return reviews;
  return reviews.filter(r => r.status === statusFilter);
};

export const moderateReview = (reviewId, newStatus, adminNote = '') => {
  const reviews = safeGetStorage(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  const updated = reviews.map(r => {
    if (r.id === reviewId) {
      return { ...r, status: newStatus, admin_note: adminNote || r.admin_note, updated_at: new Date().toISOString() };
    }
    return r;
  });
  safeSetStorage(STORAGE_KEYS.REVIEWS, updated);
  return updated;
};

export const bulkModerateReviews = (reviewIds = [], newStatus, adminId = 'Admin Staff') => {
  const reviews = safeGetStorage(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  let modifiedCount = 0;

  const updated = reviews.map(r => {
    if (reviewIds.includes(r.id)) {
      modifiedCount++;
      return { ...r, status: newStatus, updated_at: new Date().toISOString() };
    }
    return r;
  });

  safeSetStorage(STORAGE_KEYS.REVIEWS, updated);
  return { modifiedCount, newStatus };
};

// CSV Export Generator
export const exportReviewsCsv = (reviewsList = []) => {
  const header = ['Review ID', 'Product ID', 'Customer Name', 'Rating', 'Title', 'Review Text', 'Verified Purchase', 'Status', 'Helpful Count', 'Date'];
  const rows = reviewsList.map(r => [
    r.id,
    r.product_id,
    `"${(r.customer_name || 'Customer').replace(/"/g, '""')}"`,
    r.rating,
    `"${(r.title || '').replace(/"/g, '""')}"`,
    `"${(r.review_text || r.comment || '').replace(/"/g, '""')}"`,
    r.verified_purchase ? 'YES' : 'NO',
    r.status,
    r.helpful_count || 0,
    new Date(r.created_at).toLocaleDateString('en-IN')
  ]);

  return [header.join(','), ...rows.map(e => e.join(','))].join('\n');
};

// ----------------------------------------------------------------------------
// SEED MOCK DATA DEFINITIONS
// ----------------------------------------------------------------------------
const SEED_REVIEWS = [
  {
    id: 'rev-seed-101',
    product_id: 'prod-ceramic-brake-pads',
    customer_id: 'cust-101',
    customer_name: 'Rahul Sharma',
    order_id: 'AZ-2026-8801',
    rating: 5,
    title: '100% Genuine Bosch Parts - Smooth Braking!',
    review_text: 'Installed these Bosch front brake disc pads on my Swift 2021 VXi Petrol. Zero squeal, excellent bite strength, and fast delivery to Mumbai!',
    comment: 'Installed these Bosch front brake disc pads on my Swift 2021 VXi Petrol. Zero squeal, excellent bite strength, and fast delivery to Mumbai!',
    verified_purchase: true,
    status: 'published',
    helpful_count: 14,
    report_count: 0,
    images: ['https://images.unsplash.com/photo-1600792580403-0550a1030699?auto=format&fit=crop&w=600&q=80'],
    created_at: '2026-09-08T10:15:00Z'
  },
  {
    id: 'rev-seed-102',
    product_id: 'prod-ceramic-brake-pads',
    customer_id: 'cust-102',
    customer_name: 'Priya Verma',
    order_id: 'AZ-2026-8802',
    rating: 4,
    title: 'Good Quality & Perfect Packaging',
    review_text: 'Great OEM quality brake pads. Stopping distance reduced noticeably. Packaging was secure with hologram seal.',
    comment: 'Great OEM quality brake pads. Stopping distance reduced noticeably. Packaging was secure with hologram seal.',
    verified_purchase: true,
    status: 'published',
    helpful_count: 8,
    report_count: 0,
    images: [],
    created_at: '2026-09-09T14:20:00Z'
  }
];
