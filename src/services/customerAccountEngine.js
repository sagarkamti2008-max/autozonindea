/**
 * Central Customer Account, Security & Order Management Engine
 * Single-Owner Source of Truth for AutoZonIndia E-Commerce Customer Portal
 * Compliant with 65 Single-Owner Rules (0 Seller / Vendor Code)
 */

// Initial In-Memory Data Store for Customer Account Portal (SQL Parity: id, name, email, phone, created_at)
// Passwords authentication handled via Supabase Auth (auth.users)
let CURRENT_CUSTOMER = {
  id: 'c801a1e2-1001-4000-8000-000000000002',
  name: 'Sagar Kamti',
  fullName: 'Sagar Kamti',
  email: 'sagarkamti2008@gmail.com',
  phone: '+91 8591719499',
  created_at: '2026-01-15T09:30:00.000Z',
  authProvider: 'Supabase Auth'
};

let CUSTOMER_ADDRESSES = [
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
    is_default: true,
    // Compatibility getters
    fullName: 'Sagar Kamti',
    addressLine1: 'Flat 402, AutoZon Tech Park, Connaught Place',
    addressLine2: 'Near Metro Gate 3',
    postalCode: '110001'
  }
];

let CUSTOMER_VEHICLES = [
  {
    id: 'VEH-201',
    customerId: 'CUST-8001',
    makeName: 'Toyota',
    modelName: 'Innova Crysta',
    year: '2019',
    variant: '2.4 Diesel ZX',
    engine: '2.4L 2GD-FTV Diesel',
    isDefault: true
  },
  {
    id: 'VEH-202',
    customerId: 'CUST-8001',
    makeName: 'Maruti Suzuki',
    modelName: 'Swift',
    year: '2021',
    variant: '1.2 ZXi Petrol',
    engine: '1.2L K12N DualJet',
    isDefault: false
  }
];

let RECENTLY_VIEWED_PARTS = [
  { id: 1, title: 'Bosch Front Brake Pads Set - Innova Crysta', sku: 'AZ-BOSCH-BP-001', price: 1850, stock: 45, image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400' },
  { id: 2, title: 'Mobil 1 ESP 5W-30 Synthetic Engine Oil (4L)', sku: 'AZ-MOBIL1-5W30-4L', price: 3299, stock: 28, image: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=400' }
];

let CUSTOMER_RETURNS = [
  {
    id: 'RET-5001',
    orderNumber: 'SGR-2026-000148',
    itemTitle: 'Bosch Front Brake Pads Set',
    sku: 'AZ-BOSCH-BP-001',
    quantity: 1,
    reason: 'Part Ordering Error',
    status: 'Inspection', // 'Requested' | 'Under Review' | 'Approved' | 'Rejected' | 'Pickup Pending' | 'Received' | 'Inspection' | 'Refund Pending' | 'Completed'
    requestDate: '2026-08-24'
  }
];

let CUSTOMER_REFUNDS = [
  {
    id: 'REF-9001',
    orderNumber: 'SGR-2026-000148',
    amount: 1850,
    paymentMethod: 'Razorpay Instant UPI',
    status: 'Processing',
    date: '2026-08-24'
  }
];

let CUSTOMER_REVIEWS = [
  {
    id: 'REV-101',
    productId: 1,
    productTitle: 'Bosch Front Brake Pads Set - Innova Crysta',
    rating: 5,
    reviewText: 'Perfect OEM fit for my 2019 Innova Crysta! Braking distance improved significantly.',
    date: '2026-08-20',
    verifiedPurchase: true
  }
];

let SUPPORT_TICKETS = [
  {
    id: 'TICK-301',
    orderNumber: 'SGR-2026-000148',
    subject: 'Fitment Verification Assistance Needed',
    message: 'Need confirmation if this brake pad set requires new shims during installation.',
    status: 'Resolved', // 'Open' | 'Waiting for Customer' | 'Resolved'
    createdDate: '2026-08-22'
  }
];

let CUSTOMER_NOTIFICATIONS = [
  {
    id: 'NOTIF-801',
    title: 'Order Delivered Successfully!',
    message: 'Your order #SGR-2026-000148 has been delivered by BlueDart Express.',
    type: 'Shipping',
    read: false,
    timestamp: '2026-08-24 16:30'
  },
  {
    id: 'NOTIF-802',
    title: 'Payment Confirmed',
    message: 'Payment of ₹2,183 received via Razorpay UPI.',
    type: 'Payment',
    read: true,
    timestamp: '2026-08-24 16:20'
  }
];

let ACTIVE_SESSIONS = [
  { id: 'SESS-1', device: 'Chrome on Windows 11 (Current Device)', location: 'New Delhi, India', lastActive: 'Active Now', isCurrent: true },
  { id: 'SESS-2', device: 'AutoZon iOS App on iPhone 15', location: 'Gurugram, India', lastActive: '2 hours ago', isCurrent: false }
];

/**
 * Get Customer Profile Data (Rule 5, 48)
 */
export const getCustomerProfile = (customerId = 'CUST-8001') => {
  return CURRENT_CUSTOMER;
};

export const updateCustomerProfile = (updatedFields) => {
  CURRENT_CUSTOMER = { ...CURRENT_CUSTOMER, ...updatedFields };
  return CURRENT_CUSTOMER;
};

/**
 * Saved Addresses API Logic (Rule 15, 16, 17)
 */
export const getCustomerAddresses = () => CUSTOMER_ADDRESSES;

export const addCustomerAddress = (address) => {
  if (CUSTOMER_ADDRESSES.length >= 10) {
    return { success: false, message: 'Maximum 10 saved addresses allowed.' };
  }
  const newAddr = {
    id: `ADDR-${Date.now()}`,
    customerId: CURRENT_CUSTOMER.id,
    ...address,
    isDefault: CUSTOMER_ADDRESSES.length === 0 ? true : Boolean(address.isDefault)
  };
  if (newAddr.isDefault) {
    CUSTOMER_ADDRESSES.forEach(a => a.isDefault = false);
  }
  CUSTOMER_ADDRESSES.push(newAddr);
  return { success: true, address: newAddr };
};

export const deleteCustomerAddress = (addressId) => {
  CUSTOMER_ADDRESSES = CUSTOMER_ADDRESSES.filter(a => a.id !== addressId);
  return { success: true };
};

export const setDefaultAddress = (addressId) => {
  CUSTOMER_ADDRESSES.forEach(a => a.isDefault = (a.id === addressId));
  return { success: true };
};

/**
 * Saved Vehicles API Logic (Rule 18, 19, 20, 21)
 */
export const getCustomerVehicles = () => CUSTOMER_VEHICLES;

export const addCustomerVehicle = (vehicle) => {
  const newVeh = {
    id: `VEH-${Date.now()}`,
    customerId: CURRENT_CUSTOMER.id,
    ...vehicle,
    isDefault: CUSTOMER_VEHICLES.length === 0 ? true : Boolean(vehicle.isDefault)
  };
  if (newVeh.isDefault) {
    CUSTOMER_VEHICLES.forEach(v => v.isDefault = false);
  }
  CUSTOMER_VEHICLES.push(newVeh);
  return { success: true, vehicle: newVeh };
};

export const setDefaultVehicle = (vehicleId) => {
  CUSTOMER_VEHICLES.forEach(v => v.isDefault = (v.id === vehicleId));
  const primary = CUSTOMER_VEHICLES.find(v => v.id === vehicleId);
  return { success: true, primaryVehicle: primary };
};

export const deleteCustomerVehicle = (vehicleId) => {
  CUSTOMER_VEHICLES = CUSTOMER_VEHICLES.filter(v => v.id !== vehicleId);
  return { success: true };
};

/**
 * Reorder Buy Again Validation Engine (Rule 14)
 */
export const revalidateReorderItem = (item, productsDatabase = []) => {
  const product = productsDatabase.find(p => p.sku === item.sku || p.id === item.id);
  if (!product) {
    return { canReorder: false, message: 'This part is no longer available in catalog.' };
  }
  if ((product.stock || 0) <= 0) {
    return { canReorder: false, message: `'${product.title}' is currently out of stock.` };
  }

  let priceChanged = product.price !== item.price;
  return {
    canReorder: true,
    product,
    currentPrice: product.price,
    priceChanged,
    message: priceChanged ? `Price updated from ₹${item.price} to ₹${product.price}.` : 'Part revalidated and added to cart!'
  };
};

/**
 * Recently Viewed Items Handler (Rule 24)
 */
export const getRecentlyViewedParts = () => RECENTLY_VIEWED_PARTS;
export const addRecentlyViewedPart = (product) => {
  const exists = RECENTLY_VIEWED_PARTS.some(p => p.id === product.id);
  if (!exists) {
    RECENTLY_VIEWED_PARTS.unshift({
      id: product.id,
      title: product.title,
      sku: product.sku || product.partNumber,
      price: product.price,
      stock: product.stock || 10,
      image: product.image
    });
    if (RECENTLY_VIEWED_PARTS.length > 8) RECENTLY_VIEWED_PARTS.pop();
  }
};

/**
 * Returns, Refunds, Reviews, Tickets & Notifications Getters
 */
export const getCustomerReturns = () => CUSTOMER_RETURNS;
export const getCustomerRefunds = () => CUSTOMER_REFUNDS;
export const getCustomerReviews = () => CUSTOMER_REVIEWS;
export const getSupportTickets = () => SUPPORT_TICKETS;
export const getCustomerNotifications = () => CUSTOMER_NOTIFICATIONS;
export const getActiveSessions = () => ACTIVE_SESSIONS;

export const createSupportTicket = ({ orderNumber, subject, message }) => {
  const newTicket = {
    id: `TICK-${Math.floor(100 + Math.random() * 900)}`,
    orderNumber: orderNumber || 'General Inquiry',
    subject,
    message,
    status: 'Open',
    createdDate: new Date().toISOString().split('T')[0]
  };
  SUPPORT_TICKETS.unshift(newTicket);
  return newTicket;
};

export const markNotificationsAsRead = () => {
  CUSTOMER_NOTIFICATIONS.forEach(n => n.read = true);
  return true;
};

// Data Export & Account Deletion (Sections 34, 35)
export const exportCustomerDataJSON = () => {
  const data = {
    profile: CURRENT_CUSTOMER,
    addresses: CUSTOMER_ADDRESSES,
    vehicles: CUSTOMER_VEHICLES,
    returns: CUSTOMER_RETURNS,
    refunds: CUSTOMER_REFUNDS,
    reviews: CUSTOMER_REVIEWS,
    exportedAt: new Date().toISOString()
  };
  return JSON.stringify(data, null, 2);
};

export const requestAccountDeletion = (confirmationText) => {
  if (confirmationText !== 'DELETE MY ACCOUNT') {
    return { success: false, message: 'Please type exact confirmation text: "DELETE MY ACCOUNT".' };
  }
  return { success: true, message: 'Account deletion request received. Account anonymized and scheduled for purge in accordance with data privacy rules.' };
};
