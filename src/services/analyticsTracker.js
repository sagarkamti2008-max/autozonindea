/**
 * AutoZonIndia Centralized Meta Pixel & Analytics Event Tracker
 * Integrates Meta Ads Pixel (fbq) and Google Analytics (gtag) for full funnel attribution:
 * PageView, ViewContent, AddToCart, InitiateCheckout, Purchase, Lead
 */

export const initAnalytics = (pixelId = import.meta.env.VITE_META_PIXEL_ID) => {
  if (typeof window === 'undefined') return;

  // Initialize Meta Pixel Stub
  if (!window.fbq) {
    const n = (window.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!window._fbq) window._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
  }

  if (pixelId) {
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
  }
};

export const trackEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
  }
  console.log(`[Analytics Track] ${eventName}:`, params);
};

export const AnalyticsEvents = {
  trackPageView: (pageName) => {
    trackEvent('PageView', { page: pageName });
  },

  trackViewContent: (product, vehicleContext = null) => {
    trackEvent('ViewContent', {
      content_ids: [product.sku || product.id],
      content_name: product.title,
      content_category: product.category,
      value: product.price,
      currency: 'INR',
      vehicle_context: vehicleContext ? `${vehicleContext.make} ${vehicleContext.model} ${vehicleContext.year}` : 'Universal'
    });
  },

  trackAddToCart: (product, quantity = 1) => {
    trackEvent('AddToCart', {
      content_ids: [product.sku || product.id],
      content_name: product.title,
      content_type: 'product',
      value: product.price * quantity,
      currency: 'INR',
      quantity
    });
  },

  trackInitiateCheckout: (cartItems, totalValue) => {
    trackEvent('InitiateCheckout', {
      content_ids: cartItems.map(item => item.sku || item.id),
      num_items: cartItems.length,
      value: totalValue,
      currency: 'INR'
    });
  },

  trackPurchase: (order) => {
    trackEvent('Purchase', {
      content_ids: order.items ? order.items.map(i => i.sku || i.productId) : [],
      value: order.totalAmount || order.total,
      currency: 'INR',
      order_id: order.id || order.orderNumber,
      num_items: order.items ? order.items.length : 1
    });
  },

  trackLead: (leadType, details = {}) => {
    trackEvent('Lead', {
      lead_type: leadType, // 'UnmatchedVehicleRequest', 'NotifyMeRestock', 'GaragePartnership'
      ...details
    });
  }
};
