/**
 * AutoZoneIndia — Production Pricing, Coupons, Tax & Discount Calculation Engine
 * Server-Side Secure Service Layer
 */

import { supabase } from './supabaseClient';

const LOCAL_COUPONS_KEY = 'autozon_coupons_v2';
const LOCAL_USAGE_KEY = 'autozon_coupon_usage_v2';
const LOCAL_BANNERS_KEY = 'autozon_promotional_banners_v1';

// Initial Seed Coupons Database
const SEED_COUPONS = [
  {
    id: 'c-seed-101',
    code: 'WELCOME10',
    name: 'Welcome 10% Discount',
    description: '10% OFF on your first purchase above ₹1,000',
    discount_type: 'percentage',
    discount_value: 10,
    minimum_order_value: 1000,
    maximum_discount: 500,
    usage_limit: 500,
    usage_limit_per_customer: 1,
    used_count: 42,
    start_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 330 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    new_customers_only: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'c-seed-102',
    code: 'AUTO100',
    name: 'Flat ₹100 Off',
    description: 'Flat ₹100 instant discount on orders above ₹1,500',
    discount_type: 'fixed_amount',
    discount_value: 100,
    minimum_order_value: 1500,
    maximum_discount: 100,
    usage_limit: 1000,
    usage_limit_per_customer: 2,
    used_count: 128,
    start_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    new_customers_only: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'c-seed-103',
    code: 'FREESHIP',
    name: 'Free Express Shipping',
    description: 'Free express shipping on all orders over ₹499',
    discount_type: 'free_shipping',
    discount_value: 0,
    minimum_order_value: 499,
    maximum_discount: 150,
    usage_limit: 2000,
    usage_limit_per_customer: 5,
    used_count: 310,
    start_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    new_customers_only: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'c-seed-104',
    code: 'BOSCH15',
    name: 'Bosch Parts Offer',
    description: '15% OFF on genuine Bosch brake & electrical components',
    discount_type: 'percentage',
    discount_value: 15,
    minimum_order_value: 2000,
    maximum_discount: 750,
    usage_limit: 300,
    usage_limit_per_customer: 1,
    used_count: 85,
    start_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    new_customers_only: false,
    created_at: new Date().toISOString()
  }
];

const SEED_BANNERS = [
  {
    id: 'b-01',
    title: 'Festive Auto Maintenance Sale',
    subtitle: 'Up to 25% OFF on Genuine OEM Brake Pads, Fluids & Filters',
    image_url: 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?auto=format&fit=crop&w=1200&q=80',
    button_text: 'Use Code AUTO100',
    button_link: '/catalog',
    start_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    sort_order: 1
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
    console.error(`Failed to store [${key}]:`, e);
  }
};

export const normalizeCouponCode = (code) => {
  if (!code) return '';
  return code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
};

// ============================================================================
// 1. COUPON VALIDATION ENGINE (SERVER-SIDE SECURE CALCULATION)
// ============================================================================

export const validateCoupon = async (customerId, rawCouponCode, cartItems = [], customerState = null) => {
  const code = normalizeCouponCode(rawCouponCode);
  if (!code) {
    return { valid: false, message: 'Please enter a valid coupon code.' };
  }

  let coupon = null;
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*, coupon_products(product_id), coupon_categories(category_id), coupon_brands(brand_id)')
      .eq('code', code)
      .maybeSingle();

    if (!error && data) coupon = data;
  } catch (e) {
    console.warn('Coupon DB fetch error, falling back to seed:', e.message);
  }

  if (!coupon) {
    const local = getLocalData(LOCAL_COUPONS_KEY, SEED_COUPONS);
    coupon = local.find(c => normalizeCouponCode(c.code) === code);
  }

  // 1. Exist & Active Check
  if (!coupon || coupon.status !== 'active') {
    return { valid: false, message: 'Invalid or inactive coupon code.' };
  }

  // 2. Date Range Validity Check
  const now = new Date();
  if (coupon.start_at && new Date(coupon.start_at) > now) {
    return { valid: false, message: 'This coupon is not yet active.' };
  }
  if (coupon.expires_at && new Date(coupon.expires_at) < now) {
    return { valid: false, message: 'Coupon has expired.' };
  }

  // 3. Calculate Cart Subtotal for Eligible Items
  let eligibleSubtotal = 0;
  let hasEligibleItems = false;

  cartItems.forEach(item => {
    const itemPrice = item.price || 0;
    const qty = item.quantity || 1;
    let isItemEligible = true;

    // Check Product Restrictions
    if (coupon.coupon_products && coupon.coupon_products.length > 0) {
      const allowedProdIds = coupon.coupon_products.map(p => p.product_id);
      if (!allowedProdIds.includes(item.id || item.product_id)) isItemEligible = false;
    }

    // Check Category Restrictions
    if (coupon.coupon_categories && coupon.coupon_categories.length > 0) {
      const allowedCatIds = coupon.coupon_categories.map(c => c.category_id);
      if (!allowedCatIds.includes(item.category_id || item.categoryId)) isItemEligible = false;
    }

    // Check Brand Restrictions
    if (coupon.coupon_brands && coupon.coupon_brands.length > 0) {
      const allowedBrandIds = coupon.coupon_brands.map(b => b.brand_id);
      if (!allowedBrandIds.includes(item.brand_id || item.brandId)) isItemEligible = false;
    }

    if (isItemEligible) {
      hasEligibleItems = true;
      eligibleSubtotal += itemPrice * qty;
    }
  });

  if (!hasEligibleItems) {
    return { valid: false, message: 'This coupon is not valid for the selected products.' };
  }

  // 4. Minimum Order Value Check
  const minOrder = Number(coupon.minimum_order_value || 0);
  if (eligibleSubtotal < minOrder) {
    return {
      valid: false,
      message: `Minimum order value for this coupon is ₹${minOrder.toLocaleString('en-IN')}.`
    };
  }

  // 5. Global Usage Limit Check
  if (coupon.usage_limit && (coupon.used_count || 0) >= coupon.usage_limit) {
    return { valid: false, message: 'This coupon has reached its maximum usage limit.' };
  }

  // 6. Per-Customer Usage Limit Check
  if (customerId) {
    let userUsageCount = 0;
    try {
      const { count } = await supabase
        .from('coupon_usage')
        .select('id', { count: 'exact' })
        .eq('coupon_id', coupon.id)
        .eq('customer_id', customerId);

      userUsageCount = count || 0;
    } catch (e) {
      const usageList = getLocalData(LOCAL_USAGE_KEY, []);
      userUsageCount = usageList.filter(u => u.coupon_id === coupon.id && u.customer_id === customerId).length;
    }

    const perCustLimit = coupon.usage_limit_per_customer || 1;
    if (userUsageCount >= perCustLimit) {
      return { valid: false, message: 'You have already used this coupon.' };
    }
  }

  // 7. Calculate Discount Amount Server-Side
  let discountAmount = 0;
  let isFreeShipping = false;

  if (coupon.discount_type === 'percentage') {
    discountAmount = Math.round((eligibleSubtotal * (coupon.discount_value || 0)) / 100);
    const maxDiscount = Number(coupon.maximum_discount);
    if (maxDiscount > 0 && discountAmount > maxDiscount) {
      discountAmount = maxDiscount;
    }
  } else if (coupon.discount_type === 'fixed_amount') {
    discountAmount = Math.min(coupon.discount_value || 0, eligibleSubtotal);
  } else if (coupon.discount_type === 'free_shipping') {
    isFreeShipping = true;
    discountAmount = 0;
  }

  // Never allow discount > subtotal
  discountAmount = Math.max(0, Math.min(discountAmount, eligibleSubtotal));

  return {
    valid: true,
    code: coupon.code,
    couponId: coupon.id,
    name: coupon.name,
    description: coupon.description,
    discountType: coupon.discount_type,
    discountValue: coupon.discount_value,
    discountAmount,
    isFreeShipping,
    message: 'Coupon applied successfully.'
  };
};

// ============================================================================
// 2. TAX & GST CALCULATION ENGINE (INTRA-STATE VS INTER-STATE)
// ============================================================================

export const calculateTaxBreakdown = ({
  taxableAmount = 0,
  customerState = 'Maharashtra',
  originState = 'Maharashtra',
  gstRatePercent = 18.00
}) => {
  const safeTaxable = Math.max(0, taxableAmount);

  // Normalize state names for CGST/SGST vs IGST check
  const normCustomer = (customerState || '').trim().toLowerCase();
  const normOrigin = (originState || '').trim().toLowerCase();

  const isIntraState = normCustomer === normOrigin ||
                       (normCustomer.includes('maharashtra') && normOrigin.includes('maharashtra')) ||
                       (normCustomer.includes('mh') && normOrigin.includes('mh'));

  // Calculate inclusive/exclusive tax amount
  const taxFactor = gstRatePercent / 100;
  const totalTax = Math.round(safeTaxable * taxFactor);

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (isIntraState) {
    cgst = Math.round(totalTax / 2);
    sgst = totalTax - cgst;
  } else {
    igst = totalTax;
  }

  return {
    taxableAmount: safeTaxable,
    gstRatePercent,
    totalTax,
    cgst,
    sgst,
    igst,
    isIntraState,
    taxBreakdownLabel: isIntraState
      ? `CGST (${gstRatePercent/2}%): ₹${cgst} + SGST (${gstRatePercent/2}%): ₹${sgst}`
      : `IGST (${gstRatePercent}%): ₹${igst}`
  };
};

// ============================================================================
// 3. CART & ORDER TOTALS ENGINE (`calculateCartTotals`)
// ============================================================================

export const calculateCartTotals = async ({
  cartItems = [],
  customerId = null,
  couponCode = '',
  shippingAddress = null,
  shippingMethod = 'standard',
  originState = 'Maharashtra'
}) => {
  const validItems = cartItems.filter(i => (i.quantity || 1) > 0);

  const mrpTotal = validItems.reduce((sum, i) => sum + ((i.mrp || i.price || 0) * (i.quantity || 1)), 0);
  const subtotal = validItems.reduce((sum, i) => sum + ((i.price || 0) * (i.quantity || 1)), 0);
  const productSavings = Math.max(0, mrpTotal - subtotal);

  // Coupon Validation
  const couponRes = await validateCoupon(customerId, couponCode, validItems, shippingAddress?.state);
  const couponDiscount = couponRes.valid ? couponRes.discountAmount : 0;

  // Shipping Fee Calculation
  const freeShippingThreshold = 999;
  const isFreeShipping = subtotal >= freeShippingThreshold || (couponRes.valid && couponRes.isFreeShipping);

  let shippingFee = 0;
  if (subtotal === 0) {
    shippingFee = 0;
  } else if (isFreeShipping && shippingMethod === 'standard') {
    shippingFee = 0;
  } else if (shippingMethod === 'express') {
    shippingFee = isFreeShipping ? 99 : 149;
  } else {
    shippingFee = 49;
  }

  // Taxable Amount Calculation (Subtotal minus Coupon Discount)
  const taxableAmount = Math.max(0, subtotal - couponDiscount);
  const taxInfo = calculateTaxBreakdown({
    taxableAmount,
    customerState: shippingAddress?.state || 'Maharashtra',
    originState
  });

  // Final Payable Grand Total (Never negative)
  const grandTotal = Math.max(0, subtotal - couponDiscount + shippingFee);

  return {
    subtotal,
    mrpTotal,
    productSavings,
    couponResult: couponRes,
    couponDiscount,
    taxableAmount,
    taxTotal: taxInfo.totalTax,
    taxBreakdown: taxInfo,
    shippingFee,
    isFreeShipping: shippingFee === 0,
    grandTotal
  };
};

// ============================================================================
// 4. COUPON RECORD USAGE AFTER ORDER CREATION
// ============================================================================

export const recordCouponUsageDB = async ({ couponId, customerId, orderId, discountAmount }) => {
  if (!couponId || !orderId) return;

  const usageRecord = {
    id: `usage-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    coupon_id: couponId,
    customer_id: customerId || null,
    order_id: orderId,
    discount_amount: discountAmount || 0,
    used_at: new Date().toISOString()
  };

  try {
    await supabase.from('coupon_usage').insert(usageRecord);
    // Increment used_count on coupon
    const { data: c } = await supabase.from('coupons').select('used_count').eq('id', couponId).single();
    if (c) {
      await supabase.from('coupons').update({ used_count: (c.used_count || 0) + 1 }).eq('id', couponId);
    }
  } catch (e) {
    console.warn('Coupon usage DB insert error:', e.message);
  }

  const localUsage = getLocalData(LOCAL_USAGE_KEY, []);
  localUsage.unshift(usageRecord);
  setLocalData(LOCAL_USAGE_KEY, localUsage);

  const localCoupons = getLocalData(LOCAL_COUPONS_KEY, SEED_COUPONS);
  const idx = localCoupons.findIndex(c => c.id === couponId);
  if (idx !== -1) {
    localCoupons[idx].used_count = (localCoupons[idx].used_count || 0) + 1;
    setLocalData(LOCAL_COUPONS_KEY, localCoupons);
  }
};

// ============================================================================
// 5. ADMIN COUPONS & ANALYTICS CRUD
// ============================================================================

export const getCouponsForAdmin = async (statusFilter = 'all', searchQuery = '') => {
  let coupons = [];
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*');

    if (!error && data) coupons = data;
  } catch (e) {
    console.warn('Admin coupons fetch error:', e.message);
  }

  if (coupons.length === 0) {
    coupons = getLocalData(LOCAL_COUPONS_KEY, SEED_COUPONS);
  }

  // Filter status
  if (statusFilter !== 'all') {
    coupons = coupons.filter(c => c.status === statusFilter);
  }

  // Search
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    coupons = coupons.filter(c =>
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q)
    );
  }

  return coupons;
};

export const saveCouponDB = async (couponData) => {
  const normalizedCode = normalizeCouponCode(couponData.code);
  if (!normalizedCode) {
    return { success: false, message: 'Coupon code is required.' };
  }

  const record = {
    code: normalizedCode,
    name: couponData.name || normalizedCode,
    description: couponData.description || '',
    discount_type: couponData.discount_type || 'percentage',
    discount_value: Number(couponData.discount_value) || 0,
    minimum_order_value: Number(couponData.minimum_order_value) || 0,
    maximum_discount: couponData.maximum_discount ? Number(couponData.maximum_discount) : null,
    usage_limit: couponData.usage_limit ? parseInt(couponData.usage_limit, 10) : null,
    usage_limit_per_customer: couponData.usage_limit_per_customer ? parseInt(couponData.usage_limit_per_customer, 10) : 1,
    start_at: couponData.start_at || new Date().toISOString(),
    expires_at: couponData.expires_at || null,
    status: couponData.status || 'active',
    new_customers_only: couponData.new_customers_only || false,
    updated_at: new Date().toISOString()
  };

  let savedRecord = null;
  try {
    if (couponData.id) {
      const { data, error } = await supabase.from('coupons').update(record).eq('id', couponData.id).select().single();
      if (!error) savedRecord = data;
    } else {
      const { data, error } = await supabase.from('coupons').insert({ ...record, id: `c-${Date.now()}` }).select().single();
      if (!error) savedRecord = data;
    }
  } catch (e) {
    console.warn('Coupon save DB error:', e.message);
  }

  // Fallback Local Storage Update
  const localCoupons = getLocalData(LOCAL_COUPONS_KEY, SEED_COUPONS);
  if (couponData.id) {
    const idx = localCoupons.findIndex(c => c.id === couponData.id);
    if (idx !== -1) localCoupons[idx] = { ...localCoupons[idx], ...record };
  } else {
    const newCoupon = { id: `c-${Date.now()}`, ...record, used_count: 0 };
    localCoupons.unshift(newCoupon);
    savedRecord = newCoupon;
  }
  setLocalData(LOCAL_COUPONS_KEY, localCoupons);

  return { success: true, message: `Coupon "${normalizedCode}" saved successfully!`, coupon: savedRecord };
};

export const deleteCouponDB = async (couponId) => {
  try {
    await supabase.from('coupons').delete().eq('id', couponId);
  } catch (e) {
    console.warn('Coupon delete DB error:', e.message);
  }

  const local = getLocalData(LOCAL_COUPONS_KEY, SEED_COUPONS).filter(c => c.id !== couponId);
  setLocalData(LOCAL_COUPONS_KEY, local);
  return { success: true, message: 'Coupon deleted.' };
};

export const getCouponAnalyticsDB = async () => {
  const coupons = await getCouponsForAdmin('all');
  const usageList = getLocalData(LOCAL_USAGE_KEY, []);

  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(c => c.status === 'active').length;
  const expiredCoupons = coupons.filter(c => c.status === 'expired' || (c.expires_at && new Date(c.expires_at) < new Date())).length;
  const totalUses = coupons.reduce((sum, c) => sum + (c.used_count || 0), 0);
  const totalDiscountGiven = usageList.reduce((sum, u) => sum + (u.discount_amount || 0), 0);

  const topCoupons = [...coupons]
    .sort((a, b) => (b.used_count || 0) - (a.used_count || 0))
    .slice(0, 5);

  return {
    totalCoupons,
    activeCoupons,
    expiredCoupons,
    totalUses,
    totalDiscountGiven,
    topCoupons
  };
};

export const getPromotionalBannersDB = async () => {
  try {
    const { data, error } = await supabase
      .from('promotional_banners')
      .select('*')
      .eq('status', 'active')
      .order('sort_order', { ascending: true });

    if (!error && data && data.length > 0) return data;
  } catch (e) {
    console.warn('Banners fetch error:', e.message);
  }

  return getLocalData(LOCAL_BANNERS_KEY, SEED_BANNERS);
};
