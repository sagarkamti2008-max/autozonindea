import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-supabase-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = () => {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder-supabase-url.supabase.co'
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Centralized Supabase API Client
 * Supports All 5 Phases: Products, Categories, Fitments, Bulk Upload, Vehicle Search, Orders, Stock Reservations, Admin Queue, & Inventory Audit Polish
 */

export const SupabaseAPI = {
  // Categories API
  getCategories: async () => {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    return { data, error };
  },

  createCategory: async (categoryData) => {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select();
    return { data, error };
  },

  // Vehicle Makes & Models Reference API
  getVehicleMakes: async () => {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    const { data, error } = await supabase
      .from('vehicle_makes')
      .select('*')
      .order('name', { ascending: true });
    return { data, error };
  },

  getVehicleModels: async (makeId = null) => {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    let query = supabase.from('vehicle_models').select('*');
    if (makeId) {
      query = query.eq('make_id', makeId);
    }
    const { data, error } = await query.order('name', { ascending: true });
    return { data, error };
  },

  // Products API
  getProducts: async (options = {}) => {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    let query = supabase.from('products').select(`
      *,
      product_images (*),
      fitments (*)
    `);

    if (options.status) {
      query = query.eq('status', options.status);
    }

    if (options.search) {
      query = query.or(`title.ilike.%${options.search}%,sku.ilike.%${options.search}%,brand.ilike.%${options.search}%`);
    }

    if (options.category_id) {
      query = query.eq('category_id', options.category_id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  },

  createProduct: async (productData, images = [], fitments = []) => {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([{
        ...productData,
        low_stock_threshold: productData.low_stock_threshold || 3
      }])
      .select()
      .single();

    if (productError) return { data: null, error: productError };

    if (images && images.length > 0) {
      const imageRecords = images.map((url, idx) => ({
        product_id: product.id,
        image_url: url,
        sort_order: idx
      }));
      await supabase.from('product_images').insert(imageRecords);
    }

    if (fitments && fitments.length > 0) {
      const fitmentRecords = fitments.map(f => ({
        product_id: product.id,
        make: f.make,
        model: f.model,
        year_from: parseInt(f.yearFrom || f.year_from, 10),
        year_to: parseInt(f.yearTo || f.year_to, 10),
        variant: f.variant || ''
      }));
      await supabase.from('fitments').insert(fitmentRecords);
    }

    return { data: product, error: null };
  },

  updateProduct: async (id, productData, images = null, fitments = null) => {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    
    const { data: product, error: productError } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (productError) return { data: null, error: productError };

    if (images !== null) {
      await supabase.from('product_images').delete().eq('product_id', id);
      if (images.length > 0) {
        const imageRecords = images.map((url, idx) => ({
          product_id: id,
          image_url: url,
          sort_order: idx
        }));
        await supabase.from('product_images').insert(imageRecords);
      }
    }

    if (fitments !== null) {
      await supabase.from('fitments').delete().eq('product_id', id);
      if (fitments.length > 0) {
        const fitmentRecords = fitments.map(f => ({
          product_id: id,
          make: f.make,
          model: f.model,
          year_from: parseInt(f.yearFrom || f.year_from, 10),
          year_to: parseInt(f.yearTo || f.year_to, 10),
          variant: f.variant || ''
        }));
        await supabase.from('fitments').insert(fitmentRecords);
      }
    }

    return { data: product, error: null };
  },

  deleteProduct: async (id) => {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    await supabase.from('product_images').delete().eq('product_id', id);
    await supabase.from('fitments').delete().eq('product_id', id);
    const { data, error } = await supabase.from('products').delete().eq('id', id);
    return { data, error };
  },

  // Bulk Upload APIs (Phase 2)
  bulkUploadProducts: async (productsList) => {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    const draftProducts = productsList.map(p => ({
      ...p,
      status: 'Draft',
      low_stock_threshold: p.low_stock_threshold || 3,
      created_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('products')
      .upsert(draftProducts, { onConflict: 'sku' })
      .select();

    return { data, error };
  },

  bulkUploadFitments: async (fitmentRecords, replaceAll = false) => {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    
    if (replaceAll) {
      const productIds = Array.from(new Set(fitmentRecords.map(f => f.product_id)));
      if (productIds.length > 0) {
        await supabase.from('fitments').delete().in('product_id', productIds);
      }
    }

    const { data, error } = await supabase
      .from('fitments')
      .insert(fitmentRecords)
      .select();

    return { data, error };
  },

  // Unmatched Vehicle Request Logging API (Phase 3)
  logUnmatchedVehicleRequest: async (vehicleData) => {
    if (!isSupabaseConfigured()) {
      const existing = JSON.parse(localStorage.getItem('autozon_unmatched_requests') || '[]');
      existing.push({ ...vehicleData, id: `req-${Date.now()}`, timestamp: new Date().toISOString() });
      localStorage.setItem('autozon_unmatched_requests', JSON.stringify(existing));
      return { data: vehicleData, error: null };
    }
    const { data, error } = await supabase
      .from('unmatched_vehicle_requests')
      .insert([{
        make: vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year,
        variant: vehicleData.variant,
        user_notes: vehicleData.userNotes || '',
        created_at: new Date().toISOString()
      }])
      .select();
    return { data, error };
  },

  // Orders, Stock Reservations & Payments API (Phase 4)
  createOrderWithStockReservation: async (orderPayload) => {
    if (!isSupabaseConfigured()) return { data: orderPayload.order, error: null };
    
    const { order, items, reservations } = orderPayload;
    
    const { data: createdOrder, error: orderErr } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();

    if (orderErr) return { data: null, error: orderErr };

    if (items && items.length > 0) {
      const itemRecords = items.map(it => ({
        ...it,
        order_id: createdOrder.id
      }));
      await supabase.from('order_items').insert(itemRecords);
    }

    if (reservations && reservations.length > 0) {
      const resRecords = reservations.map(r => ({
        ...r,
        order_id: createdOrder.id,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        status: 'active'
      }));
      await supabase.from('stock_reservations').insert(resRecords);
    }

    return { data: createdOrder, error: null };
  },

  confirmPaymentAndDeductStock: async (orderId, razorpayPaymentId) => {
    if (!isSupabaseConfigured()) return { success: true };

    await supabase
      .from('orders')
      .update({
        status: 'Confirmed',
        payment_status: 'Paid',
        razorpay_payment_id: razorpayPaymentId,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    await supabase
      .from('stock_reservations')
      .update({ status: 'committed' })
      .eq('order_id', orderId);

    return { success: true };
  },

  releaseStockReservation: async (orderId) => {
    if (!isSupabaseConfigured()) return { success: true };

    await supabase
      .from('stock_reservations')
      .update({ status: 'released' })
      .eq('order_id', orderId);

    await supabase
      .from('orders')
      .update({ status: 'Cancelled', updated_at: new Date().toISOString() })
      .eq('id', orderId);

    return { success: true };
  },

  getOrders: async (statusFilter = null) => {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    let query = supabase.from('orders').select(`
      *,
      order_items (*)
    `);

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  },

  updateOrderStatus: async (orderId, status, trackingNumber = '') => {
    if (!isSupabaseConfigured()) return { success: true };
    const { data, error } = await supabase
      .from('orders')
      .update({
        status,
        tracking_number: trackingNumber,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    return { data, error };
  },

  // Stock Movement Log & Inventory Polish API (Phase 5)
  logStockMovement: async (movementData) => {
    if (!isSupabaseConfigured()) {
      const existing = JSON.parse(localStorage.getItem('autozon_stock_movements') || '[]');
      const newEntry = { ...movementData, id: `mv-${Date.now()}`, created_at: new Date().toISOString() };
      existing.unshift(newEntry);
      localStorage.setItem('autozon_stock_movements', JSON.stringify(existing));
      return { data: newEntry, error: null };
    }

    const { data, error } = await supabase
      .from('stock_movements')
      .insert([{
        product_id: movementData.productId,
        change_qty: movementData.changeQty,
        resulting_qty: movementData.resultingQty,
        reason: movementData.reason,
        reference_type: movementData.referenceType || 'manual',
        reference_id: movementData.referenceId || null,
        created_by: movementData.createdBy || 'Sagar (Admin)',
        created_at: new Date().toISOString()
      }])
      .select();

    return { data, error };
  },

  getStockMovements: async (productId = null) => {
    if (!isSupabaseConfigured()) {
      const existing = JSON.parse(localStorage.getItem('autozon_stock_movements') || '[]');
      if (productId) return { data: existing.filter(m => m.productId === productId), error: null };
      return { data: existing, error: null };
    }

    let query = supabase.from('stock_movements').select('*');
    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  },

  createNotifyRequest: async (notifyPayload) => {
    if (!isSupabaseConfigured()) {
      const existing = JSON.parse(localStorage.getItem('autozon_notify_requests') || '[]');
      existing.push({ ...notifyPayload, id: `notif-${Date.now()}`, created_at: new Date().toISOString() });
      localStorage.setItem('autozon_notify_requests', JSON.stringify(existing));
      return { data: notifyPayload, error: null };
    }

    const { data, error } = await supabase
      .from('notify_requests')
      .insert([{
        product_id: notifyPayload.productId,
        email_or_phone: notifyPayload.emailOrPhone,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select();

    return { data, error };
  },

  // Addresses API (SQL Parity: id, customer_id, name, phone, address_line, area, city, state, pincode, is_default)
  getAddresses: async (customerId = null) => {
    if (!isSupabaseConfigured()) {
      return {
        data: [
          {
            id: 'a801a1e2-1001-4000-8000-000000000001',
            customer_id: 'c801a1e2-1001-4000-8000-000000000002',
            name: 'Sagar Kamti',
            phone: '+91 8591719499',
            address_line: 'Flat 402, AutoZon Tech Park, Connaught Place',
            area: 'Near Metro Gate 3',
            city: 'New Delhi',
            state: 'Delhi',
            pincode: '110001',
            is_default: true
          },
          {
            id: 'a801a1e2-1001-4000-8000-000000000002',
            customer_id: 'c801a1e2-1001-4000-8000-000000000001',
            name: 'Rahul Sharma',
            phone: '+91 9876543210',
            address_line: 'House 14, Green Park Extension',
            area: 'Hauz Khas',
            city: 'New Delhi',
            state: 'Delhi',
            pincode: '110016',
            is_default: true
          }
        ],
        error: null
      };
    }

    let query = supabase.from('addresses').select('*');
    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    const { data, error } = await query.order('is_default', { ascending: false });
    return { data, error };
  },

  createAddress: async (addressData) => {
    if (!isSupabaseConfigured()) return { data: addressData, error: null };
    const { data, error } = await supabase
      .from('addresses')
      .insert([{
        customer_id: addressData.customer_id,
        name: addressData.name,
        phone: addressData.phone,
        address_line: addressData.address_line,
        area: addressData.area,
        city: addressData.city,
        state: addressData.state,
        pincode: addressData.pincode,
        is_default: addressData.is_default || false
      }])
      .select();
    return { data, error };
  },

  // Enquiries API (SQL Parity: id, customer_name, phone, vehicle_id, product_id, message, quantity, status, created_at)
  getEnquiries: async (statusFilter = null) => {
    if (!isSupabaseConfigured()) {
      return {
        data: [
          {
            id: 'e801a1e2-1001-4000-8000-000000000001',
            customer_name: 'Amit Verma',
            phone: '+91 9876543210',
            vehicle_id: 'creta-sx-d',
            product_id: 'AZ-PROD-006',
            message: 'Mujhe Hyundai Creta ka brake pad chahiye. Quick delivery status batao.',
            quantity: 2,
            status: 'New',
            created_at: '2026-09-10T11:20:00.000Z'
          },
          {
            id: 'e801a1e2-1001-4000-8000-000000000002',
            customer_name: 'Rajesh Kumar',
            phone: '+91 9811223344',
            vehicle_id: 'swift-vxi',
            product_id: 'AZ-PROD-002',
            message: 'Maruti Swift VXi 2021 model ke liye BOSCH Genuine OE Clutch Kit available hai kya?',
            quantity: 1,
            status: 'In Progress',
            created_at: '2026-09-09T16:45:00.000Z'
          }
        ],
        error: null
      };
    }

    let query = supabase.from('enquiries').select('*');
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  },

  createEnquiry: async (enquiryData) => {
    if (!isSupabaseConfigured()) return { data: enquiryData, error: null };
    const { data, error } = await supabase
      .from('enquiries')
      .insert([{
        customer_name: enquiryData.customer_name,
        phone: enquiryData.phone,
        vehicle_id: enquiryData.vehicle_id || null,
        product_id: enquiryData.product_id || null,
        message: enquiryData.message,
        quantity: enquiryData.quantity || 1,
        status: 'New',
        created_at: new Date().toISOString()
      }])
      .select();
    return { data, error };
  },

  updateEnquiryStatus: async (enquiryId, status) => {
    if (!isSupabaseConfigured()) return { success: true };
    const { data, error } = await supabase
      .from('enquiries')
      .update({ status })
      .eq('id', enquiryId);
    return { data, error };
  },

  // Quotations & RFQ Response APIs
  getQuotations: async (statusFilter = 'all') => {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };

    let query = supabase.from('quotations').select('*');
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  },

  createQuotation: async (quotationData) => {
    if (!isSupabaseConfigured()) return { data: quotationData, error: null };
    const { data, error } = await supabase
      .from('quotations')
      .insert([{
        enquiry_id: quotationData.enquiry_id || null,
        customer_id: quotationData.customer_id || null,
        quotation_number: quotationData.quotation_number || `QT-${Date.now().toString().slice(-6)}`,
        subtotal: quotationData.subtotal || 0,
        discount: quotationData.discount || 0,
        tax: quotationData.tax || 0,
        total: quotationData.total || 0,
        valid_until: quotationData.valid_until,
        status: quotationData.status || 'Draft',
        created_at: new Date().toISOString()
      }])
      .select();
    return { data, error };
  },

  updateQuotationStatus: async (quotationId, status) => {
    if (!isSupabaseConfigured()) return { success: true };
    const { data, error } = await supabase
      .from('quotations')
      .update({ status })
      .eq('id', quotationId);
    return { data, error };
  },

  // Customer Product Reviews & Moderation APIs
  getReviews: async (productId = null, statusFilter = 'Approved') => {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };

    let query = supabase.from('reviews').select('*');
    if (productId) {
      query = query.eq('product_id', productId);
    }
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  },

  createReview: async (reviewData) => {
    if (!isSupabaseConfigured()) return { data: reviewData, error: null };
    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        product_id: reviewData.product_id,
        customer_id: reviewData.customer_id || null,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        status: 'Pending', // Pending moderation
        created_at: new Date().toISOString()
      }])
      .select();
    return { data, error };
  },

  updateReviewStatus: async (reviewId, status) => {
    if (!isSupabaseConfigured()) return { success: true };
    const { data, error } = await supabase
      .from('reviews')
      .update({ status })
      .eq('id', reviewId);
    return { data, error };
  },

  // Customer Wishlist APIs (SQL Parity: id, customer_id, product_id, created_at)
  getWishlist: async (customerId) => {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    const { data, error } = await supabase
      .from('wishlist')
      .select('*, products(*)')
      .eq('customer_id', customerId);
    return { data, error };
  },

  addToWishlist: async (customerId, productId) => {
    if (!isSupabaseConfigured()) return { data: { customer_id: customerId, product_id: productId }, error: null };
    const { data, error } = await supabase
      .from('wishlist')
      .insert([{ customer_id: customerId, product_id: productId, created_at: new Date().toISOString() }])
      .select();
    return { data, error };
  },

  removeFromWishlist: async (customerId, productId) => {
    if (!isSupabaseConfigured()) return { success: true };
    const { data, error } = await supabase
      .from('wishlist')
      .delete()
      .eq('customer_id', customerId)
      .eq('product_id', productId);
    return { data, error };
  },

  // Discount Coupons & Offers APIs (SQL Parity: id, code, discount_type, discount_value, minimum_order, maximum_discount, start_date, end_date, usage_limit, status)
  getCoupons: async (statusFilter = 'Active') => {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };

    let query = supabase.from('coupons').select('*');
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query.order('start_date', { ascending: false });
    return { data, error };
  },

  createCoupon: async (couponData) => {
    if (!isSupabaseConfigured()) return { data: couponData, error: null };
    const { data, error } = await supabase
      .from('coupons')
      .insert([{
        code: couponData.code.toUpperCase().trim(),
        discount_type: couponData.discount_type || 'percentage',
        discount_value: couponData.discount_value,
        minimum_order: couponData.minimum_order || 0,
        maximum_discount: couponData.maximum_discount || null,
        start_date: couponData.start_date,
        end_date: couponData.end_date,
        usage_limit: couponData.usage_limit || 100,
        status: couponData.status || 'Active'
      }])
      .select();
    return { data, error };
  },

  updateCouponStatus: async (couponId, status) => {
    if (!isSupabaseConfigured()) return { success: true };
    const { data, error } = await supabase
      .from('coupons')
      .update({ status })
      .eq('id', couponId);
    return { data, error };
  },

  validateCouponCode: async (code, orderAmount = 0) => {
    if (!isSupabaseConfigured()) return { valid: true };
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .eq('status', 'Active')
      .single();

    if (error || !data) return { valid: false, message: 'Invalid or Expired Coupon Code' };

    if (orderAmount < data.minimum_order) {
      return { valid: false, message: `Minimum order amount of ₹${data.minimum_order} required for this coupon.` };
    }

    return { valid: true, coupon: data };
  },

  // Payments & Gateway Transaction Audit APIs (SQL Parity: id, order_id, payment_method, transaction_id, amount, status, paid_at)
  getPayments: async (statusFilter = 'all') => {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };

    let query = supabase.from('payments').select('*');
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query.order('paid_at', { ascending: false });
    return { data, error };
  },

  recordPayment: async (paymentPayload) => {
    if (!isSupabaseConfigured()) return { data: paymentPayload, error: null };
    const { data, error } = await supabase
      .from('payments')
      .insert([{
        order_id: paymentPayload.order_id,
        payment_method: paymentPayload.payment_method,
        transaction_id: paymentPayload.transaction_id, // Gateway reference token e.g., pay_Nz81kL29XmP0
        amount: paymentPayload.amount,
        status: paymentPayload.status || 'Captured',
        paid_at: new Date().toISOString()
      }])
      .select();
    return { data, error };
  },

  updatePaymentStatus: async (paymentId, status) => {
    if (!isSupabaseConfigured()) return { success: true };
    const { data, error } = await supabase
      .from('payments')
      .update({ status })
      .eq('id', paymentId);
    return { data, error };
  },

  // Logistics & Order Shipping APIs (SQL Parity: id, order_id, courier, tracking_number, status, shipped_at, delivered_at)
  getShippingRecords: async (statusFilter = 'all') => {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };

    let query = supabase.from('shipping').select('*');
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query.order('shipped_at', { ascending: false });
    return { data, error };
  },

  createShippingRecord: async (shippingPayload) => {
    if (!isSupabaseConfigured()) return { data: shippingPayload, error: null };
    const { data, error } = await supabase
      .from('shipping')
      .insert([{
        order_id: shippingPayload.order_id,
        courier: shippingPayload.courier,
        tracking_number: shippingPayload.tracking_number,
        status: shippingPayload.status || 'Manifested',
        shipped_at: new Date().toISOString(),
        delivered_at: shippingPayload.status === 'Delivered' ? new Date().toISOString() : null
      }])
      .select();
    return { data, error };
  },

  updateShippingStatus: async (shippingId, status) => {
    if (!isSupabaseConfigured()) return { success: true };
    const updateObj = { status };
    if (status === 'Delivered') {
      updateObj.delivered_at = new Date().toISOString();
    }
    const { data, error } = await supabase
      .from('shipping')
      .update(updateObj)
      .eq('id', shippingId);
    return { data, error };
  },

  // Admin Users & Staff RBAC APIs (SQL Parity: id, name, email, role, status, created_at)
  getAdminUsers: async () => {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  createAdminUser: async (adminData) => {
    if (!isSupabaseConfigured()) return { data: adminData, error: null };
    const { data, error } = await supabase
      .from('admin_users')
      .insert([{
        name: adminData.name,
        email: adminData.email.toLowerCase().trim(),
        role: adminData.role || 'Admin',
        status: adminData.status || 'Active',
        created_at: new Date().toISOString()
      }])
      .select();
    return { data, error };
  },

  updateAdminUserRole: async (adminId, role, status) => {
    if (!isSupabaseConfigured()) return { success: true };
    const updateObj = {};
    if (role) updateObj.role = role;
    if (status) updateObj.status = status;

    const { data, error } = await supabase
      .from('admin_users')
      .update(updateObj)
      .eq('id', adminId);
    return { data, error };
  },

  // Dynamic Global Site Configuration APIs (SQL Parity: id, setting_key, setting_value, updated_at)
  getWebsiteSettings: async () => {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    const { data, error } = await supabase
      .from('website_settings')
      .select('*');
    return { data, error };
  },

  updateWebsiteSetting: async (key, value) => {
    if (!isSupabaseConfigured()) return { success: true };
    const { data, error } = await supabase
      .from('website_settings')
      .upsert({
        setting_key: key,
        setting_value: typeof value === 'object' ? JSON.stringify(value) : String(value),
        updated_at: new Date().toISOString()
      }, { onConflict: 'setting_key' })
      .select();
    return { data, error };
  },

  // ==========================================
  // SUPABASE STORAGE & PRODUCT IMAGES API
  // ==========================================

  /**
   * Upload image file to Supabase Storage bucket `product-images`
   * and create corresponding record in `product_images` table.
   */
  uploadProductImage: async (file, productId = null, options = {}) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    }

    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `products/${productId || 'temp'}/${Date.now()}_${sanitizedName}`;

      // Upload file to 'product-images' bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Error uploading file to Supabase storage bucket:', uploadError);
        return { data: null, error: uploadError };
      }

      // Get public CDN URL
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // If productId is provided, insert record into `product_images` DB table
      if (productId) {
        // If this image is primary, update previous primary images for this product to false
        if (options.isPrimary) {
          await supabase
            .from('product_images')
            .update({ is_primary: false })
            .eq('product_id', productId);
        }

        const { data: imageRecord, error: dbError } = await supabase
          .from('product_images')
          .insert([{
            product_id: productId,
            image_url: publicUrl,
            alt_text: options.altText || file.name,
            sort_order: options.sortOrder || 0,
            is_primary: Boolean(options.isPrimary),
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (dbError) {
          console.error('Error inserting product_images record:', dbError);
          return { data: { id: `img-${Date.now()}`, product_id: productId, image_url: publicUrl, is_primary: Boolean(options.isPrimary), sort_order: options.sortOrder || 0 }, error: null };
        }

        return { data: imageRecord, error: null };
      }

      return {
        data: {
          id: `img-${Date.now()}`,
          image_url: publicUrl,
          alt_text: file.name,
          sort_order: options.sortOrder || 0,
          is_primary: Boolean(options.isPrimary)
        },
        error: null
      };
    } catch (err) {
      console.error('Exception during product image upload:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Get all product images for a product from DB
   */
  getProductImages: async (productId) => {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };

    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('sort_order', { ascending: true });

    return { data, error };
  },

  /**
   * Delete product image from both Supabase Storage bucket and `product_images` DB table
   */
  deleteProductImage: async (imageId, imageUrl) => {
    if (!isSupabaseConfigured()) return { success: true };

    try {
      if (imageUrl && imageUrl.includes('/product-images/')) {
        const relativePath = imageUrl.split('/product-images/')[1];
        if (relativePath) {
          await supabase.storage
            .from('product-images')
            .remove([relativePath]);
        }
      }

      if (imageId) {
        await supabase
          .from('product_images')
          .delete()
          .eq('id', imageId);
      }

      return { success: true, error: null };
    } catch (err) {
      console.error('Error deleting product image:', err);
      return { success: false, error: err };
    }
  },

  /**
   * Select a primary image for a product
   */
  setPrimaryProductImage: async (productId, imageId) => {
    if (!isSupabaseConfigured()) return { success: true };

    try {
      await supabase
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_id', productId);

      await supabase
        .from('product_images')
        .update({ is_primary: true })
        .eq('id', imageId);

      return { success: true, error: null };
    } catch (err) {
      console.error('Error updating primary image:', err);
      return { success: false, error: err };
    }
  },

  /**
   * Reorder product images
   */
  reorderProductImages: async (productId, orderedImageIds = []) => {
    if (!isSupabaseConfigured()) return { success: true };

    try {
      const updates = orderedImageIds.map((id, index) => 
        supabase
          .from('product_images')
          .update({ sort_order: index })
          .eq('id', id)
      );

      await Promise.all(updates);
      return { success: true, error: null };
    } catch (err) {
      console.error('Error reordering images:', err);
      return { success: false, error: err };
    }
  },

  // ==========================================
  // INVENTORY & STOCK MANAGEMENT API
  // ==========================================

  getInventory: async () => {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    const { data, error } = await supabase
      .from('inventory')
      .select('*, products(name, sku, price)');
    return { data, error };
  },

  updateInventoryStock: async (productId, quantity, warehouse = 'Central Warehouse - Mumbai') => {
    if (!isSupabaseConfigured()) return { success: true };
    const { data, error } = await supabase
      .from('inventory')
      .upsert({
        product_id: productId,
        quantity: quantity,
        warehouse: warehouse,
        updated_at: new Date().toISOString()
      }, { onConflict: 'product_id' })
      .select();
    return { data, error };
  },

  // ==========================================
  // ENQUIRIES API ("FIND MY PART" SYSTEM)
  // ==========================================

  createEnquiry: async (enquiryData) => {
    if (!isSupabaseConfigured()) {
      return {
        data: { id: `enq-${Date.now()}`, ...enquiryData, status: 'new', created_at: new Date().toISOString() },
        error: null
      };
    }
    const { data, error } = await supabase
      .from('enquiries')
      .insert([{
        customer_name: enquiryData.customer_name || enquiryData.name || 'Anonymous Customer',
        phone: enquiryData.phone,
        email: enquiryData.email || '',
        vehicle_id: enquiryData.vehicle_id || null,
        product_id: enquiryData.product_id || null,
        message: enquiryData.message || enquiryData.part_details || '',
        quantity: enquiryData.quantity || 1,
        status: enquiryData.status || 'new',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    return { data, error };
  },

  getEnquiries: async () => {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    const { data, error } = await supabase
      .from('enquiries')
      .select('*, vehicles(make, model, variant), products(name, sku)')
      .order('created_at', { ascending: false });
    return { data, error };
  }
};








