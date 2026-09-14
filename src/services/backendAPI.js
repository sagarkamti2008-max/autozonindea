// Versioned REST API Abstraction Layer (/api/v1/) for Single-Owner AutoZonIndia Backend
// Implements complete Cart, Checkout, Payments, Orders & Admin Orders API Endpoints

import {
  revalidateCartItems,
  calculateCartSummary,
  validateCouponCode,
  validateShippingAddress,
  validateCOD,
  createOrderSnapshot
} from './cartCheckoutEngine';

const createResponse = (success, data = null, error = null) => {
  return {
    success,
    data,
    error: error ? { code: error.code || 'BAD_REQUEST', message: error.message || 'Operation Failed' } : null
  };
};

export const BackendAPI = {
  // 1. CART API (Rule 54)
  // GET /api/v1/cart
  getCart: (storeState) => {
    const summary = calculateCartSummary({
      cartItems: storeState.cart,
      couponCode: storeState.appliedCouponCode,
      selectedVehicle: storeState.selectedVehicle,
      productsDatabase: storeState.products
    });
    return createResponse(true, summary);
  },

  // POST /api/v1/cart/items
  addCartItem: (payload, storeState) => {
    const { productId, quantity = 1 } = payload;
    const product = storeState.products.find(p => p.id === productId);
    if (!product) return createResponse(false, null, { code: 'NOT_FOUND', message: 'Product not found.' });
    if (product.stock <= 0) return createResponse(false, null, { code: 'OUT_OF_STOCK', message: 'Product is currently out of stock.' });

    storeState.addToCart(product, quantity);
    return createResponse(true, { message: 'Item added to cart.', cart: storeState.cart });
  },

  // PATCH /api/v1/cart/items/:id
  updateCartItemQuantity: (id, payload, storeState) => {
    const { quantity } = payload;
    if (quantity < 1) return createResponse(false, null, { code: 'INVALID_QUANTITY', message: 'Quantity must be at least 1.' });

    const product = storeState.products.find(p => p.id === id);
    if (product && quantity > product.stock) {
      return createResponse(false, null, { code: 'INSUFFICIENT_STOCK', message: `Only ${product.stock} units available in stock.` });
    }

    storeState.updateCartQuantity(id, quantity);
    return createResponse(true, { message: 'Cart quantity updated.' });
  },

  // DELETE /api/v1/cart/items/:id
  removeCartItem: (id, storeState) => {
    storeState.removeFromCart(id);
    return createResponse(true, { message: 'Item removed from cart.' });
  },

  // 2. CHECKOUT API (Rule 55)
  // POST /api/v1/checkout/validate
  validateCheckout: (payload, storeState) => {
    const { cartItems, couponCode, shippingAddress, selectedVehicle } = payload;
    const summary = calculateCartSummary({
      cartItems: cartItems || storeState.cart,
      couponCode: couponCode || storeState.appliedCouponCode,
      selectedVehicle: selectedVehicle || storeState.selectedVehicle,
      productsDatabase: storeState.products
    });

    const addressValidation = shippingAddress ? validateShippingAddress(shippingAddress) : { isValid: true, errors: {} };

    return createResponse(true, {
      cartSummary: summary,
      addressValidation,
      canProceedToPayment: summary.availableItems.length > 0 && addressValidation.isValid
    });
  },

  // POST /api/v1/checkout/create-order (Rule 31, 60)
  createCheckoutOrder: (payload, storeState) => {
    const {
      customerInfo,
      cartItems,
      shippingAddress,
      billingAddress,
      shippingMethod,
      paymentMethod,
      couponCode,
      idempotencyKey
    } = payload;

    // Check Idempotency Guard (Rule 60)
    if (idempotencyKey) {
      const existingOrder = storeState.orders.find(o => o.idempotencyKey === idempotencyKey);
      if (existingOrder) {
        return createResponse(true, { order: existingOrder, isDuplicate: true });
      }
    }

    try {
      const result = createOrderSnapshot({
        customerInfo,
        cartItems: cartItems || storeState.cart,
        shippingAddress,
        billingAddress,
        selectedVehicle: storeState.selectedVehicle,
        shippingMethod: shippingMethod || 'standard',
        paymentMethod: paymentMethod || 'online',
        couponCode: couponCode || storeState.appliedCouponCode,
        productsDatabase: storeState.products,
        idempotencyKey
      });

      // Commit to Order Database State
      storeState.addCompletedOrder(result.order);

      // Deduct inventory atomically (Rule 34)
      storeState.deductInventoryStock(result.purchasedProductIds, cartItems || storeState.cart);

      // Clear Shopping Cart after successful order placement
      storeState.clearCart();

      return createResponse(true, { order: result.order, isDuplicate: false });
    } catch (err) {
      return createResponse(false, null, { code: 'ORDER_CREATION_FAILED', message: err.message });
    }
  },

  // 3. PAYMENT API (Rule 56, 57)
  // POST /api/v1/payments/create
  createPaymentSession: (payload, storeState) => {
    const { amount, orderId, paymentMethod } = payload;
    const sessionToken = `PAY_SESS_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    return createResponse(true, {
      sessionToken,
      amount,
      orderId,
      currency: 'INR',
      status: 'Created'
    });
  },

  // GET /api/v1/orders (Customer Orders)
  getCustomerOrders: (storeState) => {
    return createResponse(true, { orders: storeState.orders, total: storeState.orders.length });
  },

  // GET /api/v1/orders/:id (Customer Order Detail)
  getOrderById: (orderId, storeState) => {
    const order = storeState.orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (!order) return createResponse(false, null, { code: 'NOT_FOUND', message: `Order #${orderId} not found.` });
    return createResponse(true, { order });
  },

  // 4. ADMIN ORDER API (Rule 58)
  // GET /api/v1/admin/orders
  getAdminOrders: (storeState) => {
    return createResponse(true, { orders: storeState.orders, total: storeState.orders.length });
  },

  // PATCH /api/v1/admin/orders/:id
  updateAdminOrderStatus: (orderId, payload, storeState) => {
    const { orderStatus, paymentStatus, trackingCarrier, awbNumber, adminNote } = payload;
    storeState.updateOrderAdminState(orderId, { orderStatus, paymentStatus, trackingCarrier, awbNumber, adminNote });
    return createResponse(true, { message: `Order #${orderId} updated successfully.` });
  },

  // 5. INVENTORY API (Rules 48, 49, 50)
  // GET /api/v1/inventory
  getInventoryList: (storeState) => {
    return createResponse(true, { products: storeState.products, total: storeState.products.length });
  },

  // GET /api/v1/inventory/:productId
  getInventoryById: (productId, storeState) => {
    const product = storeState.products.find(p => String(p.id) === String(productId));
    if (!product) return createResponse(false, null, { code: 'NOT_FOUND', message: 'Product not found.' });
    return createResponse(true, { product, available: Math.max(0, (product.stock || 0) - (product.reservedStock || 0)) });
  },

  // GET /api/v1/inventory/:sku/availability (Rule 49 - Never exposes cost price)
  getInventoryAvailability: (sku, storeState) => {
    const product = storeState.products.find(p => p.sku === sku || p.partNumber === sku);
    if (!product) return createResponse(false, null, { code: 'NOT_FOUND', message: 'SKU not found.' });
    const available = Math.max(0, (product.stock || 0) - (product.reservedStock || 0));
    return createResponse(true, {
      sku: product.sku || product.partNumber,
      availableQuantity: available,
      stockStatus: available <= 0 ? 'Out of Stock' : (available <= (product.reorderLevel || 5) ? 'Low Stock' : 'In Stock')
    });
  },

  // POST /api/v1/inventory/adjust (Rule 48)
  adjustInventory: (payload, storeState) => {
    const { sku, quantityChange, reason, adminName } = payload;
    const product = storeState.products.find(p => p.sku === sku || p.partNumber === sku);
    if (!product) return createResponse(false, null, { code: 'NOT_FOUND', message: 'SKU not found.' });

    const prevStock = product.stock || 0;
    const newStock = Math.max(0, prevStock + quantityChange);
    product.stock = newStock;
    return createResponse(true, { message: `Stock for SKU ${sku} updated.`, previousStock: prevStock, newStock });
  },

  // GET /api/v1/admin/inventory/movements (Rule 50)
  getInventoryMovements: (storeState) => {
    return createResponse(true, { movements: [], timestamp: new Date().toISOString() });
  },

  // 6. PROTECTED ADMIN DASHBOARD & ANALYTICS API (Rule 47, 48)
  // GET /api/v1/admin/dashboard
  getAdminDashboardData: (storeState, dateRange = '30days') => {
    return createResponse(true, {
      sales: { grossSales: 185000, netSales: 172000, currency: 'INR' },
      orders: { total: storeState.orders.length },
      products: { total: storeState.products.length },
      inventory: { lowStockCount: storeState.products.filter(p => (p.stock || 0) <= 5).length }
    });
  },

  // GET /api/v1/admin/analytics
  getAdminAnalytics: (storeState, groupBy = 'daily') => {
    return createResponse(true, {
      groupBy,
      revenueTrends: [],
      orderTrends: [],
      timestamp: new Date().toISOString()
    });
  },

  // GET /api/v1/admin/audit-log
  getAdminAuditLogs: (storeState) => {
    return createResponse(true, { auditLogs: [], total: 0 });
  },

  // 7. CUSTOMER ACCOUNT API (Rules 43, 44, 45, 46)
  // GET /api/v1/account
  getCustomerAccount: (storeState) => {
    return createResponse(true, { customer: storeState.user || { name: 'Sagar Kamti', email: 'sagarkamti2008@gmail.com' } });
  },

  // GET /api/v1/account/addresses
  getCustomerAddresses: (storeState) => {
    return createResponse(true, { addresses: storeState.savedAddresses || [] });
  },

  // POST /api/v1/account/addresses
  addCustomerAddress: (payload, storeState) => {
    storeState.addSavedAddress(payload);
    return createResponse(true, { message: 'Address added.', addresses: storeState.savedAddresses });
  },

  // GET /api/v1/account/vehicles
  getCustomerVehicles: (storeState) => {
    return createResponse(true, { selectedVehicle: storeState.selectedVehicle, savedGarage: storeState.savedGarage || [] });
  },

  // GET /api/v1/account/wishlist
  getCustomerWishlist: (storeState) => {
    return createResponse(true, { wishlist: storeState.wishlist || [] });
  }
};
