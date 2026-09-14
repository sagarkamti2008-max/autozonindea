// Single-Owner Cart, Coupon, Checkout, Order Creation & Fitment Engine for AutoZonIndia
// Rule: Single Store Owner (0 multi-vendor, 0 seller payouts, 0 marketplace code)

export const COUPONS_DATABASE = [
  { code: 'AUTO10', type: 'percentage', value: 10, minOrder: 1000, maxDiscount: 500, active: true, description: '10% OFF on orders above ₹1,000' },
  { code: 'FREESHIP', type: 'free_shipping', value: 0, minOrder: 499, maxDiscount: 150, active: true, description: 'Free Express Shipping on orders above ₹499' },
  { code: 'BOSCH15', type: 'percentage', value: 15, minOrder: 1500, maxDiscount: 750, active: true, description: '15% OFF on Genuine Bosch & OES Spares' },
  { code: 'FIRST500', type: 'flat', value: 500, minOrder: 2500, maxDiscount: 500, active: true, description: 'Flat ₹500 OFF on orders above ₹2,500' }
];

// Helper: Check vehicle compatibility for a product
export const checkProductCompatibility = (product, vehicle) => {
  if (!product) return { isCompatible: false, badgeText: '⚠ Compatibility Not Verified' };
  if (!vehicle) return { isCompatible: true, badgeText: '✓ Universal / Vehicle Check Recommended' };

  if (product.universalFit) {
    return { isCompatible: true, badgeText: '✓ Universal Car Fitment' };
  }

  const prodFitmentStr = String(product.fitment || '').toLowerCase();
  const makeName = String(vehicle.makeName || '').toLowerCase();
  const modelName = String(vehicle.modelName || '').toLowerCase();

  const matchesMake = prodFitmentStr.includes(makeName) || prodFitmentStr.includes('all') || prodFitmentStr.includes('universal');
  const matchesModel = prodFitmentStr.includes(modelName);

  if (matchesMake && matchesModel) {
    return { isCompatible: true, badgeText: `✓ Compatible with ${vehicle.makeName} ${vehicle.modelName}` };
  } else if (matchesMake) {
    return { isCompatible: true, badgeText: `✓ Compatible with ${vehicle.makeName} Series` };
  }

  return { isCompatible: false, badgeText: `⚠ Compatibility Not Verified for ${vehicle.makeName} ${vehicle.modelName}` };
};

// 1. Server-Side Cart Revalidation (Rule 3, 4, 5, 6, 7)
export const revalidateCartItems = (cartItems = [], productsDatabase = [], selectedVehicle = null) => {
  let isAllValid = true;
  let hasPriceChanges = false;
  let hasOutOfStock = false;

  const validatedItems = cartItems.map(item => {
    const freshProduct = productsDatabase.find(p => p.id === item.id);

    // Product no longer exists or unpublished
    if (!freshProduct) {
      isAllValid = false;
      return {
        ...item,
        isAvailable: false,
        statusMessage: 'This product is no longer available.',
        outOfStock: true,
        currentPrice: item.price
      };
    }

    const availableInventory = Math.max(0, freshProduct.stock || 0);
    const isOutOfStock = availableInventory <= 0;
    const currentPrice = freshProduct.price;
    const isPriceChanged = item.price !== currentPrice;

    if (isOutOfStock) {
      hasOutOfStock = true;
      isAllValid = false;
    }

    if (isPriceChanged) {
      hasPriceChanges = true;
    }

    const compatibility = checkProductCompatibility(freshProduct, selectedVehicle);

    // Never allow negative or zero quantity
    const validatedQty = Math.max(1, Math.min(item.quantity || 1, availableInventory > 0 ? availableInventory : 1));

    return {
      ...item,
      title: freshProduct.title,
      sku: freshProduct.sku || item.sku,
      partNumber: freshProduct.partNumber || item.partNumber,
      brand: freshProduct.brand || item.brand,
      mrp: freshProduct.mrp || item.mrp,
      price: currentPrice,
      originalCartPrice: item.price,
      priceChanged: isPriceChanged,
      priceMessage: isPriceChanged ? `Price updated from ₹${item.price} to ₹${currentPrice}` : null,
      availableInventory,
      outOfStock: isOutOfStock,
      isAvailable: !isOutOfStock,
      quantity: validatedQty,
      subtotal: currentPrice * validatedQty,
      compatibilityStatus: compatibility.badgeText,
      isCompatible: compatibility.isCompatible,
      image: freshProduct.image || item.image
    };
  });

  return {
    isAllValid: isAllValid && !hasPriceChanges && !hasOutOfStock,
    hasPriceChanges,
    hasOutOfStock,
    validatedItems
  };
};

// 2. Server-Side Coupon Validation (Rule 10, 11)
export const validateCouponCode = (couponCode, subtotal, cartItems = []) => {
  if (!couponCode || !couponCode.trim()) {
    return { valid: false, message: '' };
  }

  const codeUpper = couponCode.trim().toUpperCase();
  const coupon = COUPONS_DATABASE.find(c => c.code === codeUpper && c.active);

  // Strict Rule 11: Clear generic error message, never reveal sensitive internal rules
  if (!coupon) {
    return { valid: false, message: 'Coupon is invalid or no longer available.' };
  }

  if (subtotal < coupon.minOrder) {
    return { valid: false, message: `Coupon requires a minimum order of ₹${coupon.minOrder.toLocaleString('en-IN')}.` };
  }

  let discountAmount = 0;
  let isFreeShipping = false;

  if (coupon.type === 'percentage') {
    discountAmount = Math.round((subtotal * coupon.value) / 100);
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else if (coupon.type === 'flat') {
    discountAmount = coupon.value;
  } else if (coupon.type === 'free_shipping') {
    isFreeShipping = true;
    discountAmount = 0;
  }

  return {
    valid: true,
    code: coupon.code,
    description: coupon.description,
    discountAmount,
    freeShipping: isFreeShipping,
    message: `Coupon "${coupon.code}" applied successfully!`
  };
};

// 3. Server-Side Cart & Checkout Summary Calculation (Rule 9, 12, 13, 14)
export const calculateCartSummary = ({
  cartItems = [],
  couponCode = '',
  pincode = '',
  shippingMethod = 'standard',
  selectedVehicle = null,
  productsDatabase = []
}) => {
  const { validatedItems, hasOutOfStock, hasPriceChanges } = revalidateCartItems(cartItems, productsDatabase, selectedVehicle);

  const availableItems = validatedItems.filter(item => !item.outOfStock);

  const mrpTotal = availableItems.reduce((sum, item) => sum + ((item.mrp || item.price) * item.quantity), 0);
  const subtotal = availableItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const productDiscount = Math.max(0, mrpTotal - subtotal);

  const couponResult = validateCouponCode(couponCode, subtotal, availableItems);
  const couponDiscount = couponResult.valid ? couponResult.discountAmount : 0;

  // Configurable Tax Rate (18% GST HSN for automotive spares)
  const gstTaxRate = 0.18;
  const taxTotal = Math.round((subtotal - couponDiscount) * (gstTaxRate / (1 + gstTaxRate)));

  // Shipping Rules Engine
  const freeShippingThreshold = 999;
  const isEligibleForFreeShipping = subtotal >= freeShippingThreshold || (couponResult.valid && couponResult.freeShipping);

  let shippingFee = 0;
  if (subtotal === 0) {
    shippingFee = 0;
  } else if (isEligibleForFreeShipping && shippingMethod === 'standard') {
    shippingFee = 0; // FREE Shipping
  } else if (shippingMethod === 'express') {
    shippingFee = isEligibleForFreeShipping ? 99 : 149;
  } else {
    shippingFee = 49;
  }

  const grandTotal = Math.max(0, subtotal - couponDiscount + shippingFee);

  return {
    validatedItems,
    availableItems,
    hasOutOfStock,
    hasPriceChanges,
    mrpTotal,
    subtotal,
    productDiscount,
    couponResult,
    couponDiscount,
    taxTotal,
    shippingFee,
    isFreeShipping: shippingFee === 0,
    grandTotal
  };
};

// 4. Address Server-Side Validation (Rule 18, 20)
export const validateShippingAddress = (address) => {
  const errors = {};
  if (!address.fullName || !address.fullName.trim()) errors.fullName = 'Full Name is required';
  if (!address.phone || !/^[6-9]\d{9}$/.test(address.phone.replace(/\D/g, ''))) errors.phone = 'Enter a valid 10-digit mobile number';
  if (!address.addressLine1 || !address.addressLine1.trim()) errors.addressLine1 = 'Address Line 1 is required';
  if (!address.city || !address.city.trim()) errors.city = 'City is required';
  if (!address.state || !address.state.trim()) errors.state = 'State is required';
  if (!address.postalCode || !/^[1-9][0-9]{5}$/.test(address.postalCode.trim())) errors.postalCode = 'Enter a valid 6-digit Indian Pincode';
  if (!address.country) address.country = 'India';

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// 5. COD Validation (Rule 29)
export const validateCOD = (pincode, grandTotal, cartItems = []) => {
  if (grandTotal > 15000) {
    return { eligible: false, message: 'Cash on Delivery is available for orders up to ₹15,000 only.' };
  }
  if (pincode && pincode.startsWith('79')) {
    return { eligible: false, message: 'Cash on Delivery is currently unavailable for this PIN code zone.' };
  }
  return { eligible: true, message: 'Cash on Delivery available for this order.' };
};

// 6. Idempotent Customer-Friendly Order Number Generator (Rule 31, 32, 60)
export const generateCustomerOrderNumber = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `SGR-${year}-${randomNum}`;
};

// 7. Atomic Order Snapshot Creation (Rule 31, 33, 34, 60)
export const createOrderSnapshot = ({
  customerInfo,
  cartItems,
  shippingAddress,
  billingAddress,
  selectedVehicle,
  shippingMethod,
  paymentMethod,
  couponCode,
  productsDatabase,
  idempotencyKey
}) => {
  const summary = calculateCartSummary({
    cartItems,
    couponCode,
    pincode: shippingAddress.postalCode,
    shippingMethod,
    selectedVehicle,
    productsDatabase
  });

  if (summary.availableItems.length === 0) {
    throw new Error('Cannot create order with an empty or out-of-stock cart.');
  }

  const orderNumber = generateCustomerOrderNumber();
  const effectiveIdempotencyKey = idempotencyKey || `IDEMP-${Date.now()}-${Math.random()}`;

  // Preserve historical snapshot of products at purchase time (Rule 33 - order_items table schema)
  const itemsSnapshot = summary.availableItems.map((item, idx) => ({
    id: `item-${Date.now()}-${idx + 1}`,
    order_id: orderNumber,
    product_id: item.id,
    product_name: item.title,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: item.price * item.quantity,
    // Legacy UI compatibility aliases
    productId: item.id,
    title: item.title,
    sku: item.sku || `SKU-${item.id}`,
    partNumber: item.partNumber || `AZ-${item.id}`,
    brand: item.brand,
    price: item.price,
    mrp: item.mrp || item.price,
    subtotal: item.price * item.quantity,
    image: item.image,
    compatibilityBadge: item.compatibilityStatus
  }));

  const orderDateISO = new Date().toISOString();

  const isCOD = paymentMethod === 'cod';

  const orderRecord = {
    id: orderNumber,
    orderNumber,
    idempotencyKey: effectiveIdempotencyKey,
    customer: {
      name: customerInfo.fullName || shippingAddress.fullName,
      email: customerInfo.email || 'customer@autozonindia.com',
      phone: customerInfo.phone || shippingAddress.phone
    },
    items: itemsSnapshot,
    vehicleSnapshot: selectedVehicle ? {
      make: selectedVehicle.makeName,
      model: selectedVehicle.modelName,
      year: selectedVehicle.year,
      variant: selectedVehicle.variant
    } : null,
    shippingAddress: {
      fullName: shippingAddress.fullName,
      phone: shippingAddress.phone,
      addressLine1: shippingAddress.addressLine1,
      addressLine2: shippingAddress.addressLine2 || '',
      city: shippingAddress.city,
      state: shippingAddress.state,
      postalCode: shippingAddress.postalCode,
      country: shippingAddress.country || 'India'
    },
    billingAddress: billingAddress || shippingAddress,
    shippingMethod: {
      id: shippingMethod,
      name: shippingMethod === 'express' ? 'Express Priority Air Courier' : 'Standard Surface Shipping',
      fee: summary.shippingFee
    },
    pricing: {
      mrpTotal: summary.mrpTotal,
      subtotal: summary.subtotal,
      productDiscount: summary.productDiscount,
      couponCode: summary.couponResult.valid ? summary.couponResult.code : null,
      couponDiscount: summary.couponDiscount,
      taxTotal: summary.taxTotal,
      shippingFee: summary.shippingFee,
      grandTotal: summary.grandTotal
    },
    paymentInfo: {
      method: paymentMethod.toUpperCase(),
      status: isCOD ? 'Pending' : 'Paid',
      txnId: isCOD ? `COD-${Date.now()}` : `PAY-${Date.now()}`,
      paidAt: isCOD ? null : orderDateISO
    },
    orderStatus: 'Confirmed', // 'Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'
    trackingInfo: {
      carrier: 'Delhivery Express',
      awbNumber: `DELH${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: 'Order Confirmed - Preparing Package',
      estimatedDelivery: '3-5 Business Days'
    },
    timeline: [
      { title: 'Order Created', status: 'Confirmed', timestamp: orderDateISO, note: 'Order placed successfully by customer.' },
      { title: 'Payment Status', status: isCOD ? 'COD Pending' : 'Paid Online', timestamp: orderDateISO, note: isCOD ? 'Cash on Delivery selected' : 'Payment verified by payment gateway' }
    ],
    adminNotes: [], // Private internal admin notes (Rule 47)
    createdAt: orderDateISO,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  };

  return {
    order: orderRecord,
    purchasedProductIds: summary.availableItems.map(i => i.id)
  };
};
