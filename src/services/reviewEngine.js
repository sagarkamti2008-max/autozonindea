/**
 * AutoZonIndia Customer Product Reviews, Ratings & Fitment Feedback Engine
 * Single-Owner Automotive Platform Service Layer
 * Re-exports and unifies review operations with Supabase engagementService.
 */

import {
  getProductReviewSummary,
  submitProductReview as submitReviewDB,
  canCustomerReviewProduct,
  getAllReviewsForAdmin,
  moderateReviewDB,
  getAdminReviewAnalytics as getAnalyticsDB,
  getCustomerReviews as getCustReviewsDB
} from './engagementService';

export const getProductReviews = async (productId, sortOption = 'newest') => {
  const summary = await getProductReviewSummary(productId, sortOption);
  return {
    reviews: summary.reviews,
    summary: {
      totalReviews: summary.totalReviews,
      averageRating: summary.averageRating,
      starCounts: summary.starCounts,
      fitmentPercentage: 100,
      verifiedCount: summary.verifiedCount
    }
  };
};

export const verifyReviewEligibility = async ({ customerUser, productId, orderId }) => {
  const result = await canCustomerReviewProduct(customerUser?.id, productId, customerUser?.email);
  return {
    eligible: result.eligible,
    message: result.message,
    orders: result.orders || []
  };
};

export const submitProductReview = async (reviewData) => {
  const result = await submitReviewDB({
    productId: reviewData.productId,
    customerId: reviewData.customerUser?.id,
    customerName: reviewData.customerUser?.fullName || reviewData.customerName,
    customerEmail: reviewData.customerUser?.email || reviewData.customerEmail,
    orderId: reviewData.orderId,
    rating: reviewData.rating,
    title: reviewData.title,
    reviewText: reviewData.reviewText || reviewData.comment,
    imageFiles: reviewData.imageFiles || []
  });

  return result;
};

export const getCustomerReviews = async (customerEmail, customerId) => {
  return await getCustReviewsDB(customerId, customerEmail);
};

export const moderateReview = async ({ reviewId, status }) => {
  return await moderateReviewDB(reviewId, status);
};

export const calculateReviewAnalytics = async () => {
  return await getAnalyticsDB();
};

export const getReviewPolicyConfig = () => ({
  autoApproveVerified: false,
  allowImageUploads: true,
  maxImagesPerReview: 4,
  displayNamePrivacy: 'FIRST_NAME_INITIAL',
  editWindowDays: 14,
  maxEditsAllowed: 3,
  lowRatingAlertThreshold: 2
});
