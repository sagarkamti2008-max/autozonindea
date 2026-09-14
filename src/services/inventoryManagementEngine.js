/**
 * Central Inventory & Stock Management Engine
 * Single-Owner Source of Truth for AutoZonIndia E-Commerce
 * Compliant with 66 Single-Owner Business & Concurrency Rules
 */

// Initial In-Memory Persistent Database Mock for Inventory Movements & Reservations
let INVENTORY_RESERVATIONS = [
  {
    id: 'RES-2026-9001',
    orderId: 'SGR-2026-000148',
    sku: 'AZ-BOSCH-BP-001',
    quantity: 2,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    status: 'Active'
  }
];

let INVENTORY_MOVEMENTS = [
  {
    id: 'MOV-1001',
    productId: 1,
    sku: 'AZ-BOSCH-BP-001',
    productTitle: 'Bosch Front Brake Pads Set - Innova Crysta',
    previousQty: 45,
    change: -2,
    newQty: 43,
    reason: 'Order Reserved (SGR-2026-000148)',
    userOrSystem: 'Customer Checkout',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: 'MOV-1000',
    productId: 1,
    sku: 'AZ-BOSCH-BP-001',
    productTitle: 'Bosch Front Brake Pads Set - Innova Crysta',
    previousQty: 25,
    change: 20,
    newQty: 45,
    reason: 'New Stock Shipment Received',
    userOrSystem: 'Store Owner Admin',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

let STOCKTAKE_RECORDS = [];
let RESTOCK_NOTIFICATIONS = [
  { id: 'NOTIF-1', sku: 'AZ-MOBIL1-5W30-4L', customerEmail: 'rahul.sharma@gmail.com', customerPhone: '+91 9876543210', dateRequested: '2026-08-20', notified: false }
];

/**
 * Calculates stock status and available stock based on Physical Stock, Reserved Stock & Reorder Threshold
 * Rule 4, 5: Available Stock = Physical Stock - Reserved Stock
 */
export const calculateStockStatus = (physicalStock = 0, reservedStock = 0, reorderLevel = 5, isDiscontinued = false) => {
  const availableStock = Math.max(0, physicalStock - reservedStock);

  let status = 'In Stock';
  if (isDiscontinued) {
    status = 'Discontinued';
  } else if (availableStock <= 0) {
    status = 'Out of Stock';
  } else if (availableStock <= reorderLevel) {
    status = 'Low Stock';
  }

  return {
    availableStock,
    physicalStock,
    reservedStock,
    reorderLevel,
    isDiscontinued,
    status
  };
};

/**
 * Aggregates Real-Time Inventory KPIs (Rule 1, 30, 31, 32)
 */
export const calculateInventoryKPIs = (productsDatabase = []) => {
  let totalProducts = productsDatabase.length;
  let inStockCount = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;
  let reservedStockCount = 0;
  let discontinuedCount = 0;

  let totalSellingValue = 0;
  let totalCostValue = 0;
  let hasCostData = false;

  productsDatabase.forEach(p => {
    const physical = p.stock || p.availableInventory || 0;
    const reserved = p.reservedStock || 0;
    const reorder = p.reorderLevel || 5;
    const isDiscontinued = p.isDiscontinued || false;

    const calc = calculateStockStatus(physical, reserved, reorder, isDiscontinued);

    if (calc.status === 'In Stock') inStockCount++;
    if (calc.status === 'Low Stock') lowStockCount++;
    if (calc.status === 'Out of Stock') outOfStockCount++;
    if (calc.status === 'Discontinued') discontinuedCount++;
    reservedStockCount += calc.reservedStock;

    totalSellingValue += (calc.availableStock * p.price);

    if (p.costPrice && p.costPrice > 0) {
      hasCostData = true;
      totalCostValue += (calc.availableStock * p.costPrice);
    }
  });

  const productsNeedingAttention = lowStockCount + outOfStockCount;

  return {
    totalProducts,
    inStockCount,
    lowStockCount,
    outOfStockCount,
    reservedStockCount,
    discontinuedCount,
    productsNeedingAttention,
    totalSellingValue,
    totalCostValue,
    hasCostData,
    valuationMethod: hasCostData ? 'FIFO / Cost Price Valuation' : 'Retail Selling Price Valuation'
  };
};

/**
 * Reserve Stock atomically during Checkout (Rule 6, 7, 16)
 */
export const reserveInventoryStock = ({ sku, quantity, orderReference, productsDatabase = [] }) => {
  const product = productsDatabase.find(p => p.sku === sku || p.partNumber === sku);
  if (!product) {
    return { success: false, message: `SKU '${sku}' not found in central inventory.` };
  }

  const physical = product.stock || product.availableInventory || 0;
  const reserved = product.reservedStock || 0;
  const available = Math.max(0, physical - reserved);

  if (available < quantity) {
    return {
      success: false,
      message: `Overselling Prevented! Only ${available} units of '${product.title}' are currently available.`
    };
  }

  // Atomic Reservation Creation
  const reservationId = `RES-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const newReservation = {
    id: reservationId,
    orderId: orderReference,
    sku: product.sku || product.partNumber,
    quantity,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 mins expiry
    status: 'Active'
  };

  INVENTORY_RESERVATIONS.unshift(newReservation);
  product.reservedStock = (product.reservedStock || 0) + quantity;

  // Log Inventory Movement
  INVENTORY_MOVEMENTS.unshift({
    id: `MOV-${Date.now()}`,
    productId: product.id,
    sku: product.sku || product.partNumber,
    productTitle: product.title,
    previousQty: available,
    change: -quantity,
    newQty: available - quantity,
    reason: `Inventory Reserved for Order #${orderReference}`,
    userOrSystem: 'System Checkout Engine',
    timestamp: new Date().toISOString()
  });

  return {
    success: true,
    reservationId,
    availableRemaining: available - quantity
  };
};

/**
 * Release Expired or Cancelled Reservation (Rule 17, 19)
 */
export const releaseInventoryReservation = (reservationId, reason = 'Reservation Released') => {
  const res = INVENTORY_RESERVATIONS.find(r => r.id === reservationId && r.status === 'Active');
  if (!res) return { success: false, message: 'Active reservation not found.' };

  res.status = 'Released';
  return { success: true, releasedQty: res.quantity };
};

/**
 * Convert Reservation to Final Deducted Stock on Order Confirmation (Rule 18)
 */
export const convertReservationToOrderDeduction = ({ orderNumber, items = [], productsDatabase = [] }) => {
  items.forEach(item => {
    const product = productsDatabase.find(p => p.sku === item.sku || p.id === item.id);
    if (product) {
      const prevStock = product.stock || product.availableInventory || 0;
      const qty = item.quantity || 1;

      product.stock = Math.max(0, prevStock - qty);
      if (product.reservedStock && product.reservedStock >= qty) {
        product.reservedStock -= qty;
      }

      INVENTORY_MOVEMENTS.unshift({
        id: `MOV-${Date.now()}-${Math.floor(Math.random() * 100)}`,
        productId: product.id,
        sku: product.sku || product.partNumber,
        productTitle: product.title,
        previousQty: prevStock,
        change: -qty,
        newQty: product.stock,
        reason: `Order Sold & Dispatched: #${orderNumber}`,
        userOrSystem: 'Order Fulfillment',
        timestamp: new Date().toISOString()
      });
    }
  });

  return { success: true };
};

/**
 * Manual Stock Adjustment Handler (Rule 8, 9)
 */
export const adjustProductStock = ({ sku, quantityChange, reason, adminName = 'Store Owner', productsDatabase = [] }) => {
  const product = productsDatabase.find(p => p.sku === sku || p.partNumber === sku);
  if (!product) return { success: false, message: `Product with SKU '${sku}' not found.` };

  const prevQty = product.stock || 0;
  const newQty = Math.max(0, prevQty + quantityChange);
  product.stock = newQty;

  // Rule 15: Restock Notification Trigger if stock changes 0 -> >0
  if (prevQty === 0 && newQty > 0) {
    triggerRestockNotifications(product.sku);
  }

  const movementRecord = {
    id: `MOV-${Date.now()}`,
    productId: product.id,
    sku: product.sku || product.partNumber,
    productTitle: product.title,
    previousQty: prevQty,
    change: quantityChange,
    newQty: newQty,
    reason: reason || 'Manual Adjustment',
    userOrSystem: adminName,
    timestamp: new Date().toISOString()
  };

  INVENTORY_MOVEMENTS.unshift(movementRecord);

  return {
    success: true,
    previousQty: prevQty,
    newQty: newQty,
    movementRecord
  };
};

/**
 * Classify & Process Returned Product Inventory (Rule 20, 21, 22)
 */
export const processReturnInventory = ({ sku, quantity, condition, orderNumber, adminName = 'Store Owner', productsDatabase = [] }) => {
  const product = productsDatabase.find(p => p.sku === sku || p.partNumber === sku);
  if (!product) return { success: false, message: 'Product SKU not found.' };

  const prevQty = product.stock || 0;
  let isSellable = (condition === 'Sellable');

  if (isSellable) {
    product.stock = prevQty + quantity;
  }

  const movementRecord = {
    id: `MOV-RET-${Date.now()}`,
    productId: product.id,
    sku: product.sku || product.partNumber,
    productTitle: product.title,
    previousQty: prevQty,
    change: isSellable ? quantity : 0,
    newQty: isSellable ? prevQty + quantity : prevQty,
    reason: `Return Received [Condition: ${condition}] from Order #${orderNumber}`,
    userOrSystem: adminName,
    timestamp: new Date().toISOString()
  };

  INVENTORY_MOVEMENTS.unshift(movementRecord);

  return {
    success: true,
    isSellable,
    newQty: isSellable ? prevQty + quantity : prevQty,
    message: isSellable ? `Returned ${quantity} units restored to available stock.` : `Returned ${quantity} units marked as ${condition}. Not added to available stock.`
  };
};

/**
 * Reorder Recommendations Dashboard Calculation (Rule 37, 38)
 */
export const getReorderSuggestions = (productsDatabase = []) => {
  return productsDatabase
    .map(p => {
      const physical = p.stock || 0;
      const reserved = p.reservedStock || 0;
      const available = Math.max(0, physical - reserved);
      const reorderLevel = p.reorderLevel || 5;
      const targetStock = p.maxStock || (reorderLevel * 4);

      const needsReorder = available <= reorderLevel;
      const suggestedQuantity = Math.max(0, targetStock - available);

      return {
        id: p.id,
        sku: p.sku || p.partNumber,
        title: p.title,
        brand: p.brand,
        binLocation: p.binCode || 'WH-DEL-Z1',
        availableStock: available,
        reorderLevel,
        targetStock,
        suggestedQuantity,
        costPrice: p.costPrice || Math.round(p.price * 0.7),
        estimatedReorderCost: Math.round(suggestedQuantity * (p.costPrice || (p.price * 0.7))),
        needsReorder
      };
    })
    .filter(item => item.needsReorder);
};

/**
 * Restock Notifications Subscriptions & Trigger Engine (Rule 14, 15)
 */
export const subscribeRestockNotification = ({ sku, email, phone }) => {
  const newNotif = {
    id: `NOTIF-${Date.now()}`,
    sku,
    customerEmail: email,
    customerPhone: phone,
    dateRequested: new Date().toISOString().split('T')[0],
    notified: false
  };
  RESTOCK_NOTIFICATIONS.push(newNotif);
  return { success: true, message: `We will notify you at ${email || phone} as soon as this part is restocked!` };
};

export const triggerRestockNotifications = (sku) => {
  const pending = RESTOCK_NOTIFICATIONS.filter(n => n.sku === sku && !n.notified);
  pending.forEach(n => {
    n.notified = true;
    console.log(`[SMS/EMAIL TRIGGER] Product SKU ${sku} Restocked! Notification sent to ${n.customerEmail || n.customerPhone}`);
  });
  return pending.length;
};

/**
 * Stocktake Audit Handler (Rule 43, 44, 45)
 */
export const prepareStocktakeAudit = (productsDatabase = []) => {
  return productsDatabase.map(p => ({
    id: p.id,
    sku: p.sku || p.partNumber,
    title: p.title,
    systemQty: p.stock || 0,
    physicalQty: p.stock || 0,
    variance: 0,
    status: 'Pending Audit'
  }));
};

/**
 * Get Movement History & Reservations getters
 */
export const getInventoryMovements = () => INVENTORY_MOVEMENTS;
export const getInventoryReservations = () => INVENTORY_RESERVATIONS;
