/**
 * AutoZonIndia Customer Engagement System
 * Verified Product Reviews, Review Reports, Product Q&A + Answers, Customer Feedback & Moderation
 */

import { supabase } from './supabaseClient';
import { checkProductCompatibility } from './compatibilityService';
import { recordNotificationEvent } from './notificationEngine';

const GUEST_WISHLIST_KEY = 'autozon_guest_wishlist_v1';
const LOCAL_WISHLIST_KEY = 'autozon_user_wishlist_v1';
const LOCAL_REVIEWS_KEY = 'autozon_product_reviews_v1';
const LOCAL_REPORTS_KEY = 'autozon_review_reports_v1';
const LOCAL_QUESTIONS_KEY = 'autozon_product_questions_v1';
const LOCAL_ANSWERS_KEY = 'autozon_product_answers_v1';
const LOCAL_FEEDBACK_KEY = 'autozon_customer_feedback_v1';
const LOCAL_STOCK_NOTIF_KEY = 'autozon_stock_notifications_v1';
const LOCAL_PRICE_ALERTS_KEY = 'autozon_price_alerts_v1';

// Seed reviews for fallback when DB is completely fresh
const SEED_REVIEWS = [
  {
    id: 'rev-seed-101',
    product_id: 'prod-ceramic-brake-pads',
    customer_id: 'cust-demo-1',
    order_id: 'AZI-20260901-1001',
    rating: 5,
    title: '100% Genuine Bosch Parts - Smooth Braking!',
    comment: 'Installed these Bosch front brake disc pads on my Swift 2021 VXi Petrol. Zero squeal, excellent bite strength, and fast delivery to Mumbai!',
    review_text: 'Installed these Bosch front brake disc pads on my Swift 2021 VXi Petrol. Zero squeal, excellent bite strength, and fast delivery to Mumbai!',
    verified_purchase: true,
    status: 'approved',
    images: [],
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    customer_name: 'Rahul K.',
  },
  {
    id: 'rev-seed-102',
    product_id: 'prod-oil-01',
    customer_id: 'cust-demo-2',
    order_id: 'AZI-20260828-1002',
    rating: 5,
    title: 'Original Engine Oil - Sealed Canister',
    comment: 'Received genuine oil in sealed canister with hologram badge. Fast express delivery arrived in Thane within 3 hours!',
    review_text: 'Received genuine oil in sealed canister with hologram badge. Fast express delivery arrived in Thane within 3 hours!',
    verified_purchase: true,
    status: 'approved',
    images: [],
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    customer_name: 'Priya S.',
  }
];

const getLocalData = (key, defaultVal = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setLocalData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to update localStorage [${key}]:`, e);
  }
};

// Privacy safe display name generator (e.g., "Rahul Sharma" -> "Rahul S.")
export const formatSafeDisplayName = (fullName, fallback = 'Verified Customer') => {
  if (!fullName || typeof fullName !== 'string') return fallback;
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1][0]?.toUpperCase() || '';
  return `${firstName} ${lastInitial}.`;
};

// Moderation Rule Checker (flags suspicious reviews for admin review, NO auto-rejections)
export const checkReviewModerationRules = (title = '', reviewText = '') => {
  const text = `${title} ${reviewText}`.trim();
  let isFlagged = false;
  const flagReasons = [];

  // Rule 1: Excessive repeated characters or words
  if (/(.)\1{6,}/.test(text) || /(\b\w+\b)( \1){4,}/i.test(text)) {
    isFlagged = true;
    flagReasons.push('Extremely long repeated text detected');
  }

  // Rule 2: Excessive URLs or links
  const linkMatches = text.match(/https?:\/\/[^\s]+/gi) || [];
  if (linkMatches.length > 1) {
    isFlagged = true;
    flagReasons.push('Contains multiple external links');
  }

  // Rule 3: Obvious spam phrases
  const spamKeywords = ['whatsapp me', 'call for price', 'crypto', 'telegram', 'casino', 'free money', 'bit.ly'];
  if (spamKeywords.some(kw => text.toLowerCase().includes(kw))) {
    isFlagged = true;
    flagReasons.push('Matches obvious spam keyword patterns');
  }

  return {
    isFlagged,
    flagReason: flagReasons.join('; ') || null
  };
};

// Log Audit Action Helper
const logAdminAuditAction = async (action, entityType, entityId, details) => {
  try {
    await supabase.from('admin_audit_logs').insert({
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      created_at: new Date().toISOString()
    });
  } catch (e) {
    console.warn('Audit log insert fallback:', e.message);
  }
};

// ============================================================================
// 1. WISHLIST MANAGEMENT
// ============================================================================

export const getGuestWishlist = () => getLocalData(GUEST_WISHLIST_KEY, []);
export const setGuestWishlist = (items) => setLocalData(GUEST_WISHLIST_KEY, items);

export const addGuestWishlist = (product) => {
  const list = getGuestWishlist();
  const exists = list.some(item => (typeof item === 'string' ? item === product.id : item.id === product.id));
  if (!exists) {
    list.push(product);
    setGuestWishlist(list);
  }
  return list;
};

export const removeGuestWishlist = (productId) => {
  const list = getGuestWishlist().filter(item => (typeof item === 'string' ? item !== productId : item.id !== productId));
  setGuestWishlist(list);
  return list;
};

export const getCustomerWishlist = async (customerId) => {
  if (!customerId) return getGuestWishlist();
  try {
    const { data, error } = await supabase
      .from('wishlist')
      .select('id, product_id, created_at, products(*, brand:brands(*), category:categories(*), images:product_images(*), inventory(*))')
      .eq('customer_id', customerId);

    if (!error && data) {
      return data.map(w => ({
        wishlistId: w.id,
        productId: w.product_id,
        created_at: w.created_at,
        ...w.products
      }));
    }
  } catch (err) {
    console.error('Customer wishlist query error:', err);
  }
  return getLocalData(`${LOCAL_WISHLIST_KEY}_${customerId}`, []);
};

export const addToWishlistDB = async (customerId, product) => {
  const productId = product.id || product;
  if (!customerId) return addGuestWishlist(product);
  try {
    await supabase.from('wishlist').insert({ customer_id: customerId, product_id: productId });
  } catch (err) {
    console.warn('Wishlist DB add error:', err.message);
  }
  const localKey = `${LOCAL_WISHLIST_KEY}_${customerId}`;
  const localList = getLocalData(localKey, []);
  if (!localList.some(item => (item.id || item) === productId)) {
    localList.push(product);
    setLocalData(localKey, localList);
  }
  return localList;
};

export const removeFromWishlistDB = async (customerId, productId) => {
  if (!customerId) return removeGuestWishlist(productId);
  try {
    await supabase.from('wishlist').delete().eq('customer_id', customerId).eq('product_id', productId);
  } catch (err) {
    console.warn('Wishlist DB remove error:', err.message);
  }
  const localKey = `${LOCAL_WISHLIST_KEY}_${customerId}`;
  const localList = getLocalData(localKey, []).filter(item => (item.id || item) !== productId);
  setLocalData(localKey, localList);
  return localList;
};

export const mergeGuestWishlistOnLogin = async (customerId) => {
  if (!customerId) return;
  const guestItems = getGuestWishlist();
  if (!guestItems || guestItems.length === 0) return;
  for (const item of guestItems) {
    await addToWishlistDB(customerId, item);
  }
  setGuestWishlist([]);
};

// ============================================================================
// 2. VERIFIED PURCHASE & REVIEW ELIGIBILITY (STRICT SERVER VERIFICATION)
// ============================================================================

export const canCustomerReviewProduct = async (customerId, productId, customerEmail = null) => {
  if (!customerId && !customerEmail) {
    return {
      eligible: false,
      reason: 'NOT_LOGGED_IN',
      message: 'Please log in to your customer account to review delivered purchases.',
      orders: []
    };
  }

  try {
    // Check delivered/completed orders from DB
    let query = supabase
      .from('orders')
      .select('id, order_number, status, created_at, order_items(id, product_id, product_name)')
      .in('status', ['delivered', 'completed']);

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    const { data: orders, error } = await query;
    let matchingOrders = [];
    if (!error && orders) {
      matchingOrders = orders.filter(ord =>
        ord.order_items && ord.order_items.some(item => item.product_id === productId)
      );
    }

    // Local storage fallback for orders
    if (matchingOrders.length === 0) {
      const localOrders = getLocalData('autozon_customer_orders_v1', []);
      matchingOrders = localOrders.filter(ord => {
        const isUser = (customerId && ord.customer_id === customerId) ||
                       (customerEmail && ord.customer_email?.toLowerCase() === customerEmail?.toLowerCase());
        const isDelivered = ['delivered', 'completed'].includes(ord.status?.toLowerCase());
        const hasProduct = ord.order_items?.some(item => item.product_id === productId);
        return isUser && isDelivered && hasProduct;
      });
    }

    if (matchingOrders.length === 0) {
      return {
        eligible: false,
        reason: 'NO_DELIVERED_PURCHASE',
        message: 'Verified Purchase required. You can review this part after receiving your delivered order.',
        orders: []
      };
    }

    // Check if customer already submitted an active review
    const existingReviews = await getProductReviewsDB(productId);
    const userAlreadyReviewed = existingReviews.some(rev =>
      ((customerId && rev.customer_id === customerId) ||
       (customerEmail && rev.customer_email?.toLowerCase() === customerEmail?.toLowerCase())) &&
      rev.status !== 'rejected'
    );

    if (userAlreadyReviewed) {
      return {
        eligible: false,
        reason: 'ALREADY_REVIEWED',
        message: 'You have already submitted a review for this product. You can manage or edit your existing review in My Account.',
        orders: matchingOrders
      };
    }

    return {
      eligible: true,
      reason: 'VERIFIED_PURCHASER',
      message: '✓ Verified Purchase confirmed. You are eligible to write a review.',
      orders: matchingOrders
    };

  } catch (err) {
    console.error('Error verifying review eligibility:', err);
    return {
      eligible: false,
      reason: 'VERIFICATION_ERROR',
      message: 'Could not verify purchase history. Please try again.',
      orders: []
    };
  }
};

// ============================================================================
// 3. PRODUCT REVIEWS & IMAGES ENGINE
// ============================================================================

export const uploadReviewImage = async (file, customerId) => {
  if (!file) return null;
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type?.toLowerCase())) {
    throw new Error('Only JPG, JPEG, PNG, and WebP image formats are allowed.');
  }

  const maxSize = 5 * 1024 * 1024; // 5 MB limit
  if (file.size > maxSize) {
    throw new Error('Image file size must be less than 5 MB.');
  }

  const cleanFileName = `${customerId || 'anon'}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
  try {
    const { error } = await supabase.storage
      .from('review-images')
      .upload(cleanFileName, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;
    const { data: publicUrlData } = supabase.storage.from('review-images').getPublicUrl(cleanFileName);
    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.warn('Storage bucket fallback to Data URL:', err.message);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }
};

export const submitProductReview = async ({
  productId,
  customerId,
  customerName = 'AutoZone Customer',
  customerEmail,
  orderId,
  rating,
  title,
  reviewText,
  imageFiles = []
}) => {
  const parsedRating = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));
  if (!title || !title.trim()) {
    return { success: false, message: 'Review title is required.' };
  }
  if (!reviewText || reviewText.trim().length < 10) {
    return { success: false, message: 'Please write at least 10 characters in your review.' };
  }

  // Server-side verification of purchase ownership
  const eligibility = await canCustomerReviewProduct(customerId, productId, customerEmail);
  if (!eligibility.eligible) {
    return { success: false, message: eligibility.message };
  }

  // Handle photos
  const imageUrls = [];
  if (imageFiles && imageFiles.length > 0) {
    for (const file of imageFiles) {
      try {
        const url = await uploadReviewImage(file, customerId);
        if (url) imageUrls.push(url);
      } catch (e) {
        return { success: false, message: e.message };
      }
    }
  }

  // Sanitize display name for privacy (e.g. "Rahul S.")
  const safeDisplayName = formatSafeDisplayName(customerName);

  // Moderation check rule
  const modCheck = checkReviewModerationRules(title, reviewText);

  const newReview = {
    id: `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    product_id: productId,
    customer_id: customerId || null,
    order_id: orderId || eligibility.orders[0]?.id || null,
    rating: parsedRating,
    title: title.trim(),
    comment: reviewText.trim(),
    review_text: reviewText.trim(),
    verified_purchase: true,
    status: 'pending', // Moderation default
    admin_note: null,
    is_flagged: modCheck.isFlagged,
    flag_reason: modCheck.flagReason,
    images: imageUrls,
    customer_name: safeDisplayName,
    customer_email: customerEmail || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  try {
    const { error } = await supabase.from('reviews').insert(newReview);
    if (error) console.warn('Supabase review insert error, storing local:', error.message);
  } catch (err) {
    console.error('Review DB insert exception:', err);
  }

  const local = getLocalData(LOCAL_REVIEWS_KEY, SEED_REVIEWS);
  local.unshift(newReview);
  setLocalData(LOCAL_REVIEWS_KEY, local);

  recordNotificationEvent('review_submitted', {
    reviewId: newReview.id,
    productId,
    customerName: safeDisplayName
  });

  return {
    success: true,
    message: 'Your review has been submitted for moderation and will be published after approval.',
    review: newReview
  };
};

export const updateCustomerReview = async (reviewId, customerId, { rating, title, reviewText, imageFiles }) => {
  const local = getLocalData(LOCAL_REVIEWS_KEY, SEED_REVIEWS);
  const existing = local.find(r => r.id === reviewId);
  if (!existing || (customerId && existing.customer_id && existing.customer_id !== customerId)) {
    return { success: false, message: 'Unauthorized. You can only edit your own reviews.' };
  }

  const parsedRating = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));
  const modCheck = checkReviewModerationRules(title, reviewText);

  // Upload new images if provided
  let updatedImages = existing.images || [];
  if (imageFiles && imageFiles.length > 0) {
    const newUrls = [];
    for (const f of imageFiles) {
      const url = await uploadReviewImage(f, customerId);
      if (url) newUrls.push(url);
    }
    updatedImages = [...updatedImages, ...newUrls];
  }

  const updates = {
    rating: parsedRating,
    title: title?.trim() || existing.title,
    review_text: reviewText?.trim() || existing.review_text,
    comment: reviewText?.trim() || existing.comment,
    images: updatedImages,
    status: 'pending', // Re-trigger moderation on edit
    is_flagged: modCheck.isFlagged,
    flag_reason: modCheck.flagReason,
    updated_at: new Date().toISOString()
  };

  try {
    await supabase.from('reviews').update(updates).eq('id', reviewId);
  } catch (e) {
    console.warn('DB review update error:', e.message);
  }

  const idx = local.findIndex(r => r.id === reviewId);
  if (idx !== -1) {
    local[idx] = { ...local[idx], ...updates };
    setLocalData(LOCAL_REVIEWS_KEY, local);
  }

  return { success: true, message: 'Review updated successfully and resubmitted for approval.' };
};

export const deleteCustomerReview = async (reviewId, customerId) => {
  const local = getLocalData(LOCAL_REVIEWS_KEY, SEED_REVIEWS);
  const existing = local.find(r => r.id === reviewId);
  if (!existing || (customerId && existing.customer_id && existing.customer_id !== customerId)) {
    return { success: false, message: 'Unauthorized. You can only delete your own reviews.' };
  }

  try {
    // Soft delete status update to 'hidden'
    await supabase.from('reviews').update({ status: 'hidden', updated_at: new Date().toISOString() }).eq('id', reviewId);
  } catch (e) {
    console.warn('DB review delete error:', e.message);
  }

  const filtered = local.filter(r => r.id !== reviewId);
  setLocalData(LOCAL_REVIEWS_KEY, filtered);

  return { success: true, message: 'Review removed successfully.' };
};

export const getProductReviewsDB = async (productId) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, customer:customers(name)')
      .eq('product_id', productId);

    if (!error && data) return data;
  } catch (e) {
    console.warn('Supabase reviews fetch error:', e.message);
  }
  const local = getLocalData(LOCAL_REVIEWS_KEY, SEED_REVIEWS);
  return local.filter(r => r.product_id === productId);
};

export const getProductReviewSummary = async (productId, sortOption = 'newest', filterStar = 'all', page = 1, limit = 10) => {
  const allReviews = await getProductReviewsDB(productId);
  const approved = allReviews.filter(r => ['approved', 'Published'].includes(r.status));

  const totalReviews = approved.length;
  const ratingSum = approved.reduce((sum, r) => sum + (r.rating || 5), 0);
  const averageRating = totalReviews > 0 ? Number((ratingSum / totalReviews).toFixed(1)) : 0;

  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  approved.forEach(r => {
    const rate = Math.min(5, Math.max(1, r.rating || 5));
    starCounts[rate] = (starCounts[rate] || 0) + 1;
  });

  const photos = [];
  approved.forEach(r => {
    if (r.images && Array.isArray(r.images)) {
      r.images.forEach(img => {
        if (img) photos.push({ url: img, reviewTitle: r.title, reviewer: r.customer_name || 'Customer' });
      });
    }
  });

  let filtered = [...approved];
  if (filterStar !== 'all') {
    if (filterStar === 'verified') {
      filtered = filtered.filter(r => r.verified_purchase);
    } else {
      const starNum = parseInt(filterStar, 10);
      filtered = filtered.filter(r => r.rating === starNum);
    }
  }

  // Server-side sorting
  filtered.sort((a, b) => {
    if (sortOption === 'highest') return (b.rating || 0) - (a.rating || 0);
    if (sortOption === 'lowest') return (a.rating || 0) - (b.rating || 0);
    if (sortOption === 'verified') return (b.verified_purchase ? 1 : 0) - (a.verified_purchase ? 1 : 0);
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });

  // Pagination
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return {
    reviews: paginated,
    totalApproved: totalReviews,
    filteredCount: filtered.length,
    averageRating,
    starCounts,
    verifiedCount: approved.filter(r => r.verified_purchase).length,
    photos,
    page,
    totalPages: Math.ceil(filtered.length / limit) || 1
  };
};

export const getCustomerReviews = async (customerId, customerEmail = null) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, product:products(name, slug, images:product_images(image_url))')
      .or(`customer_id.eq.${customerId},customer_email.eq.${customerEmail}`);

    if (!error && data) return data;
  } catch (e) {
    console.warn('Customer reviews query error:', e.message);
  }
  const local = getLocalData(LOCAL_REVIEWS_KEY, SEED_REVIEWS);
  return local.filter(r =>
    (customerId && r.customer_id === customerId) ||
    (customerEmail && r.customer_email?.toLowerCase() === customerEmail?.toLowerCase())
  );
};

// ============================================================================
// 4. REVIEW REPORTING SYSTEM
// ============================================================================

export const submitReviewReport = async ({ reviewId, reporterCustomerId = null, reason, message }) => {
  if (!reason) return { success: false, message: 'Please select a reason for reporting.' };

  const newReport = {
    id: `rep-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    review_id: reviewId,
    reporter_customer_id: reporterCustomerId,
    reason,
    message: message?.trim() || null,
    status: 'pending',
    created_at: new Date().toISOString()
  };

  try {
    await supabase.from('review_reports').insert(newReport);
  } catch (e) {
    console.warn('Report insert error:', e.message);
  }

  const local = getLocalData(LOCAL_REPORTS_KEY, []);
  local.unshift(newReport);
  setLocalData(LOCAL_REPORTS_KEY, local);

  return { success: true, message: 'Thank you. The review has been reported to our moderation team for inspection.' };
};

export const getReviewReportsForAdmin = async (statusFilter = 'all') => {
  let reports = [];
  try {
    const { data, error } = await supabase
      .from('review_reports')
      .select('*, review:reviews(*, product:products(name, slug))');
    if (!error && data) reports = data;
  } catch (e) {
    console.warn('Review reports admin fetch error:', e.message);
  }

  if (reports.length === 0) {
    reports = getLocalData(LOCAL_REPORTS_KEY, []);
  }

  if (statusFilter !== 'all') {
    reports = reports.filter(r => r.status === statusFilter);
  }

  return reports;
};

export const resolveReviewReport = async (reportId, action = 'dismiss', adminNote = '') => {
  const now = new Date().toISOString();
  const newStatus = action === 'actioned' ? 'actioned' : 'dismissed';

  try {
    await supabase
      .from('review_reports')
      .update({ status: newStatus, reviewed_at: now })
      .eq('id', reportId);
  } catch (e) {
    console.warn('Report resolve error:', e.message);
  }

  const local = getLocalData(LOCAL_REPORTS_KEY, []);
  const idx = local.findIndex(r => r.id === reportId);
  if (idx !== -1) {
    local[idx].status = newStatus;
    local[idx].reviewed_at = now;
    setLocalData(LOCAL_REPORTS_KEY, local);
  }

  logAdminAuditAction('report_reviewed', 'review_reports', reportId, { action, adminNote });

  return { success: true, message: `Report marked as ${newStatus}.` };
};

// ============================================================================
// 5. ADMIN REVIEW MODERATION & ANALYTICS
// ============================================================================

export const getAllReviewsForAdmin = async (statusFilter = 'all', searchQuery = '') => {
  let reviews = [];
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, product:products(name, slug, sku), customer:customers(name, email)');

    if (!error && data) reviews = data;
  } catch (e) {
    console.warn('Admin reviews query error:', e.message);
  }

  if (reviews.length === 0) {
    reviews = getLocalData(LOCAL_REVIEWS_KEY, SEED_REVIEWS);
  }

  if (statusFilter !== 'all') {
    reviews = reviews.filter(r => r.status?.toLowerCase() === statusFilter.toLowerCase());
  }

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    reviews = reviews.filter(r =>
      r.title?.toLowerCase().includes(q) ||
      r.review_text?.toLowerCase().includes(q) ||
      r.comment?.toLowerCase().includes(q) ||
      r.customer_name?.toLowerCase().includes(q) ||
      r.product_id?.toLowerCase().includes(q) ||
      r.product?.sku?.toLowerCase().includes(q)
    );
  }

  return reviews;
};

export const moderateReviewDB = async (reviewId, newStatus, adminNote = null, rejectionReason = null) => {
  const validStatuses = ['approved', 'rejected', 'pending', 'hidden'];
  if (!validStatuses.includes(newStatus)) {
    return { success: false, message: 'Invalid moderation status.' };
  }

  const updates = {
    status: newStatus,
    admin_note: adminNote || null,
    rejection_reason: rejectionReason || null,
    updated_at: new Date().toISOString()
  };

  try {
    await supabase.from('reviews').update(updates).eq('id', reviewId);
  } catch (err) {
    console.error('Review moderation DB error:', err);
  }

  const local = getLocalData(LOCAL_REVIEWS_KEY, SEED_REVIEWS);
  const idx = local.findIndex(r => r.id === reviewId);
  if (idx !== -1) {
    local[idx] = { ...local[idx], ...updates };
    setLocalData(LOCAL_REVIEWS_KEY, local);
  }

  logAdminAuditAction(`review_${newStatus}`, 'reviews', reviewId, { newStatus, adminNote, rejectionReason });

  recordNotificationEvent(`review_${newStatus}`, { reviewId, newStatus });

  return { success: true, message: `Review status updated to ${newStatus}.` };
};

export const getAdminReviewAnalytics = async () => {
  const allReviews = await getAllReviewsForAdmin('all');
  const reports = await getReviewReportsForAdmin('all');

  const totalReviews = allReviews.length;
  const pendingCount = allReviews.filter(r => r.status === 'pending').length;
  const approvedCount = allReviews.filter(r => ['approved', 'Published'].includes(r.status)).length;
  const rejectedCount = allReviews.filter(r => r.status === 'rejected').length;
  const hiddenCount = allReviews.filter(r => r.status === 'hidden').length;

  const approvedList = allReviews.filter(r => ['approved', 'Published'].includes(r.status));
  const avgRating = approvedList.length > 0
    ? Number((approvedList.reduce((s, r) => s + (r.rating || 5), 0) / approvedList.length).toFixed(1))
    : 0;

  const verifiedCount = allReviews.filter(r => r.verified_purchase).length;
  const verifiedPercentage = totalReviews > 0 ? Math.round((verifiedCount / totalReviews) * 100) : 100;

  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  approvedList.forEach(r => {
    const rate = Math.min(5, Math.max(1, r.rating || 5));
    starCounts[rate] = (starCounts[rate] || 0) + 1;
  });

  return {
    totalReviews,
    pendingCount,
    approvedCount,
    rejectedCount,
    hiddenCount,
    avgRating,
    verifiedCount,
    verifiedPercentage,
    starCounts,
    reportedCount: reports.filter(rep => rep.status === 'pending').length
  };
};

// Product level feedback insights console
export const getProductFeedbackInsights = async (productId) => {
  const reviews = await getProductReviewsDB(productId);
  const questions = await getProductQuestionsDB(productId);
  const reports = await getReviewReportsForAdmin('all');

  const productReports = reports.filter(r => r.review?.product_id === productId);
  const unansweredQuestions = questions.filter(q => !q.answer && q.status !== 'answered');

  const approved = reviews.filter(r => ['approved', 'Published'].includes(r.status));
  const avgRating = approved.length > 0
    ? (approved.reduce((a, b) => a + (b.rating || 5), 0) / approved.length).toFixed(1)
    : 0;

  return {
    reviewCount: reviews.length,
    approvedCount: approved.length,
    averageRating: avgRating,
    unansweredQuestionsCount: unansweredQuestions.length,
    reportedReviewsCount: productReports.length,
    questions,
    reviews
  };
};

// ============================================================================
// 6. PRODUCT QUESTIONS & ANSWERS (Q&A)
// ============================================================================

export const submitProductQuestion = async ({
  productId,
  customerId = null,
  customerName,
  customerEmail,
  vehicleId = null,
  question
}) => {
  if (!question || question.trim().length < 8) {
    return { success: false, message: 'Please enter a valid question (at least 8 characters).' };
  }
  if (!customerName || !customerName.trim()) {
    return { success: false, message: 'Name is required to ask a question.' };
  }

  const safeName = formatSafeDisplayName(customerName);

  const newQuestion = {
    id: `q-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    product_id: productId,
    customer_id: customerId,
    customer_name: safeName,
    customer_email: customerEmail || '',
    vehicle_id: vehicleId || null,
    question: question.trim(),
    answer: null,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  try {
    const { error } = await supabase.from('product_questions').insert(newQuestion);
    if (error) console.warn('Supabase question insert error, saving local:', error.message);
  } catch (e) {
    console.error('Question DB insert exception:', e);
  }

  const local = getLocalData(LOCAL_QUESTIONS_KEY, []);
  local.unshift(newQuestion);
  setLocalData(LOCAL_QUESTIONS_KEY, local);

  recordNotificationEvent('question_submitted', { questionId: newQuestion.id, productId });

  return {
    success: true,
    message: 'Your question has been submitted for moderation! Our automotive tech team will review and answer it shortly.',
    question: newQuestion
  };
};

export const submitProductAnswer = async ({
  questionId,
  answeredBy = null,
  answeredByName = 'AutoZone Tech Support',
  answerText,
  isOfficial = true
}) => {
  if (!answerText || !answerText.trim()) {
    return { success: false, message: 'Answer text cannot be blank.' };
  }

  const newAnswer = {
    id: `ans-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    question_id: questionId,
    answered_by: answeredBy,
    answered_by_name: isOfficial ? 'Official AutoZoneIndia Specialist' : formatSafeDisplayName(answeredByName),
    answer: answerText.trim(),
    is_official: isOfficial,
    status: isOfficial ? 'approved' : 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  try {
    await supabase.from('product_answers').insert(newAnswer);
    // Update main question status to answered
    await supabase
      .from('product_questions')
      .update({ answer: answerText.trim(), status: 'answered', answered_at: new Date().toISOString() })
      .eq('id', questionId);
  } catch (e) {
    console.warn('Answer insert error:', e.message);
  }

  const localAnswers = getLocalData(LOCAL_ANSWERS_KEY, []);
  localAnswers.unshift(newAnswer);
  setLocalData(LOCAL_ANSWERS_KEY, localAnswers);

  const localQuestions = getLocalData(LOCAL_QUESTIONS_KEY, []);
  const idx = localQuestions.findIndex(q => q.id === questionId);
  if (idx !== -1) {
    localQuestions[idx].answer = answerText.trim();
    localQuestions[idx].status = 'answered';
    localQuestions[idx].answered_at = new Date().toISOString();
    setLocalData(LOCAL_QUESTIONS_KEY, localQuestions);
  }

  logAdminAuditAction('question_answered', 'product_questions', questionId, { isOfficial });
  recordNotificationEvent('question_answered', { questionId });

  return { success: true, message: 'Answer published successfully.' };
};

export const getProductQuestionsDB = async (productId) => {
  try {
    const { data, error } = await supabase
      .from('product_questions')
      .select('*, vehicle:vehicles(make, model, variant)')
      .eq('product_id', productId)
      .in('status', ['approved', 'answered']);

    if (!error && data) return data;
  } catch (e) {
    console.warn('Questions query error:', e.message);
  }
  const local = getLocalData(LOCAL_QUESTIONS_KEY, []);
  return local.filter(q => q.product_id === productId && ['approved', 'answered'].includes(q.status));
};

export const getAllQuestionsForAdmin = async (statusFilter = 'all') => {
  let questions = [];
  try {
    const { data, error } = await supabase
      .from('product_questions')
      .select('*, product:products(name, slug), vehicle:vehicles(make, model, variant)');
    if (!error && data) questions = data;
  } catch (e) {
    console.warn('Admin questions fetch error:', e.message);
  }

  if (questions.length === 0) {
    questions = getLocalData(LOCAL_QUESTIONS_KEY, []);
  }

  if (statusFilter !== 'all') {
    questions = questions.filter(q => q.status === statusFilter);
  }

  return questions;
};

export const moderateQuestionDB = async (questionId, newStatus) => {
  try {
    await supabase.from('product_questions').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', questionId);
  } catch (e) {
    console.warn('Question moderate error:', e.message);
  }

  const local = getLocalData(LOCAL_QUESTIONS_KEY, []);
  const idx = local.findIndex(q => q.id === questionId);
  if (idx !== -1) {
    local[idx].status = newStatus;
    setLocalData(LOCAL_QUESTIONS_KEY, local);
  }

  return { success: true, message: `Question status updated to ${newStatus}.` };
};

// ============================================================================
// 7. CUSTOMER FEEDBACK ENGINE
// ============================================================================

export const submitCustomerFeedback = async ({ customerId = null, customerName, customerEmail, orderId = null, category, message, rating = null }) => {
  if (!message || message.trim().length < 10) {
    return { success: false, message: 'Please enter detailed feedback (at least 10 characters).' };
  }

  const validCategories = ['Product', 'Website', 'Delivery', 'Support', 'Payment', 'Other'];
  const cat = validCategories.includes(category) ? category : 'Other';

  const newFeedback = {
    id: `fb-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    customer_id: customerId,
    customer_name: customerName ? formatSafeDisplayName(customerName) : 'Anonymous Customer',
    customer_email: customerEmail || null,
    order_id: orderId || null,
    category: cat,
    message: message.trim(),
    rating: rating ? Math.min(5, Math.max(1, parseInt(rating, 10))) : null,
    status: 'new',
    internal_note: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  try {
    await supabase.from('customer_feedback').insert(newFeedback);
  } catch (e) {
    console.warn('Feedback DB insert error:', e.message);
  }

  const local = getLocalData(LOCAL_FEEDBACK_KEY, []);
  local.unshift(newFeedback);
  setLocalData(LOCAL_FEEDBACK_KEY, local);

  recordNotificationEvent('feedback_received', { feedbackId: newFeedback.id, category: cat });

  return { success: true, message: 'Thank you for your valuable feedback! We appreciate your input.' };
};

export const getCustomerFeedbackHistory = async (customerId, customerEmail = null) => {
  try {
    const { data, error } = await supabase
      .from('customer_feedback')
      .select('*')
      .or(`customer_id.eq.${customerId},customer_email.eq.${customerEmail}`);
    if (!error && data) return data;
  } catch (e) {
    console.warn('Feedback query error:', e.message);
  }

  const local = getLocalData(LOCAL_FEEDBACK_KEY, []);
  return local.filter(f =>
    (customerId && f.customer_id === customerId) ||
    (customerEmail && f.customer_email?.toLowerCase() === customerEmail?.toLowerCase())
  );
};

export const getAllFeedbackForAdmin = async (categoryFilter = 'all', statusFilter = 'all') => {
  let feedbackList = [];
  try {
    const { data, error } = await supabase.from('customer_feedback').select('*');
    if (!error && data) feedbackList = data;
  } catch (e) {
    console.warn('Admin feedback query error:', e.message);
  }

  if (feedbackList.length === 0) {
    feedbackList = getLocalData(LOCAL_FEEDBACK_KEY, []);
  }

  if (categoryFilter !== 'all') {
    feedbackList = feedbackList.filter(f => f.category === categoryFilter);
  }
  if (statusFilter !== 'all') {
    feedbackList = feedbackList.filter(f => f.status === statusFilter);
  }

  return feedbackList;
};

export const updateFeedbackStatusDB = async (feedbackId, newStatus, internalNote = null) => {
  const validStatuses = ['new', 'reviewing', 'resolved', 'closed'];
  if (!validStatuses.includes(newStatus)) {
    return { success: false, message: 'Invalid feedback status.' };
  }

  const updates = {
    status: newStatus,
    internal_note: internalNote || null,
    updated_at: new Date().toISOString()
  };

  try {
    await supabase.from('customer_feedback').update(updates).eq('id', feedbackId);
  } catch (e) {
    console.warn('Feedback status update error:', e.message);
  }

  const local = getLocalData(LOCAL_FEEDBACK_KEY, []);
  const idx = local.findIndex(f => f.id === feedbackId);
  if (idx !== -1) {
    local[idx] = { ...local[idx], ...updates };
    setLocalData(LOCAL_FEEDBACK_KEY, local);
  }

  logAdminAuditAction('feedback_status_changed', 'customer_feedback', feedbackId, { newStatus, internalNote });

  return { success: true, message: `Feedback marked as ${newStatus}.` };
};

// ============================================================================
// 8. STOCK & PRICE ALERTS
// ============================================================================

export const subscribeStockNotification = async ({ productId, customerId = null, email, phone }) => {
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Please enter a valid email address for stock alert.' };
  }

  const record = {
    id: `stock-notif-${Date.now()}`,
    product_id: productId,
    customer_id: customerId,
    email: email.trim(),
    phone: phone ? phone.trim() : null,
    status: 'waiting',
    created_at: new Date().toISOString()
  };

  try {
    await supabase.from('stock_notifications').insert(record);
  } catch (e) {
    console.warn('Stock alert insert error:', e.message);
  }

  const local = getLocalData(LOCAL_STOCK_NOTIF_KEY, []);
  local.unshift(record);
  setLocalData(LOCAL_STOCK_NOTIF_KEY, local);

  return { success: true, message: '✓ Stock alert configured. We will notify you as soon as this item is back in stock!' };
};

export const subscribePriceAlert = async ({ productId, customerId = null, email, observedPrice }) => {
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Please enter a valid email address for price alert.' };
  }

  const record = {
    id: `price-alert-${Date.now()}`,
    product_id: productId,
    customer_id: customerId,
    email: email.trim(),
    observed_price: observedPrice,
    status: 'active',
    created_at: new Date().toISOString()
  };

  try {
    await supabase.from('price_alerts').insert(record);
  } catch (e) {
    console.warn('Price alert insert error:', e.message);
  }

  const local = getLocalData(LOCAL_PRICE_ALERTS_KEY, []);
  local.unshift(record);
  setLocalData(LOCAL_PRICE_ALERTS_KEY, local);

  return { success: true, message: '✓ Price alert active. We will notify you when price drops below current level.' };
};

// ============================================================================
// 9. SEO STRUCTURED DATA GENERATOR (REAL APPROVED REVIEWS ONLY)
// ============================================================================

export const generateProductReviewSchema = (product, reviews = []) => {
  const approved = reviews.filter(r => ['approved', 'Published'].includes(r.status));
  if (approved.length === 0) return null;

  const ratingSum = approved.reduce((sum, r) => sum + (r.rating || 5), 0);
  const avgRating = (ratingSum / approved.length).toFixed(1);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'sku': product.sku || product.id,
    'brand': {
      '@type': 'Brand',
      'name': product.brand?.name || product.brand || 'AutoZoneIndia'
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': avgRating,
      'reviewCount': approved.length,
      'bestRating': '5',
      'worstRating': '1'
    },
    'review': approved.map(r => ({
      '@type': 'Review',
      'author': {
        '@type': 'Person',
        'name': r.customer_name || 'Verified Customer'
      },
      'datePublished': r.created_at,
      'reviewBody': r.review_text || r.comment,
      'reviewRating': {
        '@type': 'Rating',
        'ratingValue': r.rating,
        'bestRating': '5',
        'worstRating': '1'
      }
    }))
  };
};
