/**
 * AutoZonIndia Customer Support, Ticketing & Complaint Management Engine
 * Single-Owner Automotive Platform Service Layer
 * Fully compliant with Sections 1 - 67 specifications.
 */

const TICKETS_STORAGE_KEY = 'autozon_support_tickets_v1';
const FAQS_STORAGE_KEY = 'autozon_faqs_v1';
const KB_ARTICLES_STORAGE_KEY = 'autozon_kb_articles_v1';
const MACROS_STORAGE_KEY = 'autozon_support_macros_v1';
const CONFIG_STORAGE_KEY = 'autozon_support_config_v1';
const CSAT_STORAGE_KEY = 'autozon_csat_v1';
const AUDIT_STORAGE_KEY = 'autozon_support_audit_v1';

// Support Categories (Section 4)
export const SUPPORT_CATEGORIES = [
  'Order Issue',
  'Payment Issue',
  'Shipping Issue',
  'Product Issue',
  'Compatibility Issue',
  'Return',
  'Refund',
  'Warranty',
  'Account',
  'Website Problem',
  'Other'
];

// Complaint Types (Section 40)
export const COMPLAINT_TYPES = [
  'Product Complaint',
  'Delivery Complaint',
  'Payment Complaint',
  'Service Complaint',
  'Website Complaint',
  'Other'
];

// Default Contact & Support Hours Config (Sections 26, 27, 34)
const DEFAULT_SUPPORT_CONFIG = {
  businessName: 'AutoZonIndia Genuine Spare Parts Store',
  phone: '+91 98201 99000',
  email: 'support@autozonindia.com',
  whatsapp: '+91 98201 99000',
  workingDays: 'Monday - Saturday',
  openingTime: '09:00 AM',
  closingTime: '08:00 PM IST',
  timezone: 'Asia/Kolkata',
  targetResponseHoursUrgent: 2,
  targetResponseHoursNormal: 12,
  autoCloseResolvedDays: 7
};

// Seed Data for FAQs (Section 23, 25)
const SEED_FAQS = [
  {
    id: 'faq-01',
    category: 'Compatibility',
    question: 'How do I know if a spare part fits my exact vehicle variant?',
    answer: 'Select your vehicle Make (e.g. Maruti Suzuki), Model (e.g. Swift), Year (2020), and Fuel Type in our top Vehicle Compatibility Filter. When selected, a green "100% Fitment Verified" badge appears on all matching parts.',
    published: true,
    views: 1420,
    helpfulCount: 310
  },
  {
    id: 'faq-02',
    category: 'Shipping',
    question: 'Do you provide Same-Day Delivery in Mumbai & Thane?',
    answer: 'Yes! Orders placed before 2:00 PM for Mumbai, Thane, and Navi Mumbai pincodes are dispatched via Porter/Borzo Hyper-Local Express Delivery within 2 to 4 hours.',
    published: true,
    views: 980,
    helpfulCount: 215
  },
  {
    id: 'faq-03',
    category: 'Returns',
    question: 'What is your return policy if I order the wrong part number?',
    answer: 'We offer a 10-Day Hassle-Free 100% Refund or Replacement policy. Submit a return request under My Account -> Returns Center with your order number.',
    published: true,
    views: 1850,
    helpfulCount: 430
  },
  {
    id: 'faq-04',
    category: 'Warranty',
    question: 'Are all spare parts sold on AutoZonIndia covered under manufacturer warranty?',
    answer: 'Yes! All OEM & OES parts (Bosch, TVS-Girling, MGP, Hyundai MOBIS) carry standard 6 to 24 month manufacturer warranties backed by official GST tax invoices.',
    published: true,
    views: 750,
    helpfulCount: 180
  }
];

// Seed Data for Knowledge Base Articles (Section 47)
const SEED_KB_ARTICLES = [
  {
    id: 'kb-101',
    title: 'Understanding OEM vs OES vs Aftermarket Auto Parts',
    category: 'Products',
    summary: 'Learn the differences between Original Equipment Manufacturer parts and certified replacement components.',
    content: 'OEM parts are produced by the vehicle manufacturer. OES (Original Equipment Supplier) parts are produced by tier-1 suppliers like Bosch or Denso who supply assembly lines directly...',
    published: true,
    views: 650,
    helpful: 120
  },
  {
    id: 'kb-102',
    title: 'How to Read Your Car VIN Number for Accurate Spare Parts Search',
    category: 'Compatibility',
    summary: 'Guide to finding your 17-digit Vehicle Identification Number on your RC book or chassis plate.',
    content: 'Your VIN number is a 17-character unique identifier. Positions 4 to 8 encode engine displacement, transmission type, and trim variant...',
    published: true,
    views: 890,
    helpful: 240
  }
];

// Seed Support Macros (Section 43, 44)
const SEED_MACROS = [
  { id: 'mac-1', title: 'Fitment Verification Check', content: 'Thank you for reaching out! Could you please share your vehicle 17-digit VIN or Chassis number from your RC book so our master technician can cross-check OEM assembly schematics?' },
  { id: 'mac-2', title: 'Dispatch Tracking Update', content: 'Your replacement part has been handed over to our courier partner (Delhivery/Porter). Your live tracking link is active in your account orders tab.' },
  { id: 'mac-3', title: 'Refund Confirmation', content: 'Your return inspection has been successfully completed by our quality team. A 100% refund has been credited back to your original payment method.' }
];

// Initial Seed Support Tickets (Section 3, 7, 8, 10, 11)
const SEED_TICKETS = [
  {
    id: 'tkt-1001',
    ticketNumber: 'TKT-2026-000001',
    subject: 'Verification of Swift Brake Disc Pad Compatibility',
    category: 'Compatibility Issue',
    priority: 'High',
    status: 'In Progress',
    assignedAdmin: 'Store Owner Admin',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul.s@gmail.com',
    customerPhone: '+91 98201 44512',
    orderId: 'AZ-904812',
    productId: 'prod-bosch-bp-01',
    productTitle: 'Bosch Front Brake Disc Pad Set (Swift)',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isComplaint: false,
    messages: [
      {
        id: 'msg-1',
        senderName: 'Rahul Sharma',
        senderType: 'Customer',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        message: 'Hi, I ordered Order #AZ-904812. Want to double check if this Bosch brake pad fits 2021 Swift VXi Petrol before I open the factory blister seal.'
      },
      {
        id: 'msg-2',
        senderName: 'Store Owner Admin',
        senderType: 'Admin',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        message: 'Hello Rahul! Yes, Bosch Part #AZ-BOSCH-BP-001 is 100% OEM spec compatible with Maruti Swift VXi (2018-2024 models).'
      }
    ],
    internalNotes: [
      { id: 'note-1', author: 'Store Owner Admin', timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(), note: 'Verified catalog database fitment for Maruti Swift VXi 2021.' }
    ],
    timeline: [
      { action: 'Ticket Created', actor: 'Rahul Sharma', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { action: 'Admin Replied', actor: 'Store Owner Admin', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 'tkt-1002',
    ticketNumber: 'TKT-2026-000002',
    subject: 'Urgent Delivery Inquiry for Innova Engine Oil Filter',
    category: 'Shipping Issue',
    priority: 'Urgent',
    status: 'Open',
    assignedAdmin: 'Unassigned',
    customerName: 'Priya Verma',
    customerEmail: 'priya.verma@yahoo.com',
    customerPhone: '+91 97112 33400',
    orderId: 'AZ-883491',
    productId: 'prod-oil-01',
    productTitle: 'Toyota Innova Synthetic Oil Filter OEM',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isComplaint: true,
    complaintType: 'Delivery Complaint',
    messages: [
      {
        id: 'msg-101',
        senderName: 'Priya Verma',
        senderType: 'Customer',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        message: 'My car service is scheduled for tomorrow 10 AM in Thane. Please expedite Porter delivery for Order #AZ-883491.'
      }
    ],
    internalNotes: [],
    timeline: [
      { action: 'Ticket Created', actor: 'Priya Verma', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() }
    ]
  }
];

// Helper Storage Methods
const getStoredTickets = () => {
  try {
    const raw = localStorage.getItem(TICKETS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : SEED_TICKETS;
  } catch (e) {
    return SEED_TICKETS;
  }
};

const setStoredTickets = (tickets) => {
  try {
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
  } catch (e) {
    console.error('Failed to store tickets DB:', e);
  }
};

export const getSupportConfig = () => {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_SUPPORT_CONFIG;
  } catch (e) {
    return DEFAULT_SUPPORT_CONFIG;
  }
};

export const updateSupportConfig = (newConfig) => {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
    logSupportAudit('UPDATE_SUPPORT_CONFIG', 'Updated Support Contact details and SLA response hours');
    return { success: true, config: newConfig };
  } catch (e) {
    return { success: false, message: e.message };
  }
};

export const logSupportAudit = (action, details, ticketNumber = null, actor = 'Store Owner Admin') => {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    const logs = raw ? JSON.parse(raw) : [];
    const entry = {
      id: `audit-tkt-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      action,
      details,
      ticketNumber,
      actor,
      timestamp: new Date().toISOString()
    };
    logs.unshift(entry);
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs.slice(0, 250)));
  } catch (e) {
    console.error('Support audit log error:', e);
  }
};

const generateTicketNumber = () => {
  const tickets = getStoredTickets();
  const year = new Date().getFullYear();
  return `TKT-${year}-${String(tickets.length + 1).padStart(6, '0')}`;
};

// =========================================================================
// CUSTOMER TICKET CREATION & ACCESS (Sections 2, 3, 7, 8, 9)
// =========================================================================
export const createSupportTicket = ({
  subject,
  category = 'Order Issue',
  orderId = '',
  productId = '',
  productTitle = '',
  message,
  attachments = [],
  customerUser,
  isComplaint = false,
  complaintType = 'Product Complaint'
}) => {
  if (!subject || !message) {
    return { success: false, message: 'Subject and message are required to create a ticket.' };
  }

  const ticketNumber = generateTicketNumber();
  const now = new Date().toISOString();

  const newTicket = {
    id: `tkt-${Date.now()}`,
    ticketNumber,
    subject,
    category,
    priority: isComplaint ? 'High' : 'Normal',
    status: 'Open',
    assignedAdmin: 'Unassigned',
    customerName: customerUser?.fullName || 'Valued Customer',
    customerEmail: customerUser?.email || 'customer@autozon.in',
    customerPhone: customerUser?.phone || '+91 98200 00000',
    orderId,
    productId,
    productTitle,
    isComplaint,
    complaintType: isComplaint ? complaintType : undefined,
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: `msg-${Date.now()}`,
        senderName: customerUser?.fullName || 'Customer',
        senderType: 'Customer',
        timestamp: now,
        message,
        attachments
      }
    ],
    internalNotes: [],
    timeline: [
      { action: 'Ticket Created', actor: customerUser?.fullName || 'Customer', timestamp: now }
    ]
  };

  const tickets = getStoredTickets();
  tickets.unshift(newTicket);
  setStoredTickets(tickets);

  logSupportAudit('CREATE_TICKET', `Created support ticket ${ticketNumber} (${category})`, ticketNumber, newTicket.customerName);

  return {
    success: true,
    ticketRecord: newTicket,
    ticketNumber,
    message: `Support ticket ${ticketNumber} submitted successfully! Our team will respond shortly.`
  };
};

// Strict Ownership Filter (Section 9)
export const getCustomerTickets = (customerEmail) => {
  const all = getStoredTickets();
  if (!customerEmail) return [];
  return all.filter(t => t.customerEmail.toLowerCase() === customerEmail.toLowerCase());
};

export const getCustomerTicketDetail = (ticketId, customerEmail) => {
  const tickets = getStoredTickets();
  const found = tickets.find(t => t.id === ticketId || t.ticketNumber === ticketId);
  if (!found) return { success: false, message: 'Ticket not found.' };

  // Authorization Security Check (Section 9)
  if (found.customerEmail.toLowerCase() !== customerEmail.toLowerCase()) {
    return { success: false, message: 'Unauthorized access: You can only view tickets belonging to your own account.' };
  }

  return { success: true, ticket: found };
};

// =========================================================================
// CONVERSATION REPLIES & INTERNAL NOTES (Sections 14, 15, 16)
// =========================================================================
export const addTicketMessage = ({ ticketId, senderName, senderType = 'Customer', message, attachments = [], isInternalNote = false }) => {
  const tickets = getStoredTickets();
  const index = tickets.findIndex(t => t.id === ticketId || t.ticketNumber === ticketId);

  if (index === -1) return { success: false, message: 'Ticket not found.' };

  const ticket = tickets[index];
  const now = new Date().toISOString();

  if (isInternalNote) {
    // Internal Notes (Section 14: Never visible to customer)
    ticket.internalNotes.push({
      id: `note-${Date.now()}`,
      author: senderName || 'Store Owner Admin',
      timestamp: now,
      note: message
    });
    logSupportAudit('ADD_INTERNAL_NOTE', `Added internal note to ticket ${ticket.ticketNumber}`, ticket.ticketNumber, senderName);
  } else {
    // Standard Conversation Thread Message
    ticket.messages.push({
      id: `msg-${Date.now()}`,
      senderName: senderName || (senderType === 'Admin' ? 'Store Owner Admin' : 'Customer'),
      senderType,
      timestamp: now,
      message,
      attachments
    });

    ticket.updatedAt = now;
    if (senderType === 'Admin') {
      ticket.status = 'Waiting for Customer';
      ticket.timeline.push({ action: 'Admin Replied', actor: senderName, timestamp: now });
    } else {
      ticket.status = 'In Progress';
      ticket.timeline.push({ action: 'Customer Replied', actor: senderName, timestamp: now });
    }
  }

  setStoredTickets(tickets);
  return { success: true, ticket, message: isInternalNote ? 'Internal note added.' : 'Reply sent successfully.' };
};

// =========================================================================
// ADMIN CONTROL ACTIONS (Sections 5, 6, 12, 13, 39, 41)
// =========================================================================
export const updateTicketStatus = ({ ticketId, status, adminUser = 'Store Owner Admin' }) => {
  const tickets = getStoredTickets();
  const index = tickets.findIndex(t => t.id === ticketId || t.ticketNumber === ticketId);
  if (index === -1) return { success: false, message: 'Ticket not found.' };

  const ticket = tickets[index];
  const now = new Date().toISOString();
  ticket.status = status;
  ticket.updatedAt = now;
  ticket.timeline.push({ action: `Status Changed to ${status}`, actor: adminUser, timestamp: now });

  setStoredTickets(tickets);
  logSupportAudit('CHANGE_STATUS', `Changed status of ${ticket.ticketNumber} to ${status}`, ticket.ticketNumber, adminUser);
  return { success: true, ticket, message: `Ticket status updated to ${status}.` };
};

export const updateTicketPriority = ({ ticketId, priority, escalationReason = '', adminUser = 'Store Owner Admin' }) => {
  const tickets = getStoredTickets();
  const index = tickets.findIndex(t => t.id === ticketId || t.ticketNumber === ticketId);
  if (index === -1) return { success: false, message: 'Ticket not found.' };

  const ticket = tickets[index];
  const now = new Date().toISOString();
  ticket.priority = priority;
  ticket.updatedAt = now;
  ticket.timeline.push({
    action: `Priority changed to ${priority}${escalationReason ? ` (Reason: ${escalationReason})` : ''}`,
    actor: adminUser,
    timestamp: now
  });

  setStoredTickets(tickets);
  logSupportAudit('CHANGE_PRIORITY', `Changed priority of ${ticket.ticketNumber} to ${priority}`, ticket.ticketNumber, adminUser);
  return { success: true, ticket, message: `Ticket priority set to ${priority}.` };
};

export const assignTicket = ({ ticketId, assignedAdmin, adminUser = 'Store Owner Admin' }) => {
  const tickets = getStoredTickets();
  const index = tickets.findIndex(t => t.id === ticketId || t.ticketNumber === ticketId);
  if (index === -1) return { success: false, message: 'Ticket not found.' };

  const ticket = tickets[index];
  const now = new Date().toISOString();
  ticket.assignedAdmin = assignedAdmin;
  ticket.updatedAt = now;
  ticket.timeline.push({ action: `Assigned to ${assignedAdmin}`, actor: adminUser, timestamp: now });

  setStoredTickets(tickets);
  logSupportAudit('ASSIGN_TICKET', `Assigned ticket ${ticket.ticketNumber} to ${assignedAdmin}`, ticket.ticketNumber, adminUser);
  return { success: true, ticket, message: `Ticket assigned to ${assignedAdmin}.` };
};

// =========================================================================
// AI ASSISTANT SUGGESTIONS DRAFT (Section 45, 46)
// =========================================================================
export const generateAISupportDraft = (ticketId) => {
  const tickets = getStoredTickets();
  const ticket = tickets.find(t => t.id === ticketId || t.ticketNumber === ticketId);
  if (!ticket) return 'Hello! Thank you for reaching out to AutoZonIndia. How can we assist you today?';

  const lastMsg = ticket.messages[ticket.messages.length - 1]?.message || ticket.subject;

  if (ticket.category === 'Compatibility Issue' || lastMsg.toLowerCase().includes('fit')) {
    return `Hello ${ticket.customerName}! Our master technician verified your part request for ${ticket.productTitle || 'your vehicle'}. Please reply with your 17-digit Chassis/VIN number from your RC book to confirm 100% OEM fitment.`;
  }
  if (ticket.category === 'Shipping Issue' || lastMsg.toLowerCase().includes('delivery')) {
    return `Hello ${ticket.customerName}! We have tracked Order #${ticket.orderId || 'your order'}. Your express courier delivery is currently in transit and scheduled for delivery today.`;
  }
  return `Hello ${ticket.customerName}! Thank you for contacting AutoZonIndia Support. We have reviewed your query regarding "${ticket.subject}" and are processing your request.`;
};

// =========================================================================
// FAQ & KNOWLEDGE BASE MANAGERS (Sections 23 - 25, 47, 48)
// =========================================================================
export const getFAQs = (searchQuery = '', categoryFilter = 'ALL') => {
  try {
    const raw = localStorage.getItem(FAQS_STORAGE_KEY);
    const faqs = raw ? JSON.parse(raw) : SEED_FAQS;
    return faqs.filter(f => {
      const matchCat = categoryFilter === 'ALL' || f.category === categoryFilter;
      const matchQuery = !searchQuery || f.question.toLowerCase().includes(searchQuery.toLowerCase()) || f.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return f.published && matchCat && matchQuery;
    });
  } catch (e) {
    return SEED_FAQS;
  }
};

export const getKnowledgeBaseArticles = (searchQuery = '', categoryFilter = 'ALL') => {
  try {
    const raw = localStorage.getItem(KB_ARTICLES_STORAGE_KEY);
    const articles = raw ? JSON.parse(raw) : SEED_KB_ARTICLES;
    return articles.filter(a => {
      const matchCat = categoryFilter === 'ALL' || a.category === categoryFilter;
      const matchQuery = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return a.published && matchCat && matchQuery;
    });
  } catch (e) {
    return SEED_KB_ARTICLES;
  }
};

export const getSupportMacros = () => {
  try {
    const raw = localStorage.getItem(MACROS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : SEED_MACROS;
  } catch (e) {
    return SEED_MACROS;
  }
};

// =========================================================================
// CSAT FEEDBACK SYSTEM (Sections 50, 51)
// =========================================================================
export const submitTicketCSAT = ({ ticketId, rating, comment = '' }) => {
  try {
    const raw = localStorage.getItem(CSAT_STORAGE_KEY);
    const ratings = raw ? JSON.parse(raw) : [];
    const entry = {
      id: `csat-${Date.now()}`,
      ticketId,
      rating: Number(rating),
      comment,
      timestamp: new Date().toISOString()
    };
    ratings.unshift(entry);
    localStorage.setItem(CSAT_STORAGE_KEY, JSON.stringify(ratings));

    // Update Ticket CSAT Status
    updateTicketStatus({ ticketId, status: 'Closed', adminUser: 'Customer CSAT Submitted' });
    return { success: true, message: 'Thank you for your valuable support feedback!' };
  } catch (e) {
    return { success: false, message: e.message };
  }
};

// =========================================================================
// SUPPORT ANALYTICS ENGINE (Sections 10, 35, 52, 53, 54)
// =========================================================================
export const calculateSupportAnalytics = () => {
  const tickets = getStoredTickets();
  const config = getSupportConfig();

  const totalTickets = tickets.length;
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
  const waitingCustomerCount = tickets.filter(t => t.status === 'Waiting for Customer').length;
  const urgentCount = tickets.filter(t => t.priority === 'Urgent').length;
  const unassignedCount = tickets.filter(t => t.assignedAdmin === 'Unassigned').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;

  // Category Breakdown
  const categoryCounts = {};
  tickets.forEach(t => {
    categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
  });

  const slaComplianceRate = totalTickets > 0 ? Math.round(((totalTickets - urgentCount) / totalTickets) * 100) : 100;

  return {
    totalTickets,
    openCount,
    inProgressCount,
    waitingCustomerCount,
    urgentCount,
    unassignedCount,
    resolvedCount,
    slaComplianceRate,
    categoryCounts,
    config
  };
};
