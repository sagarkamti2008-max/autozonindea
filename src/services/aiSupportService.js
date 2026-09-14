/**
 * AutoZoneIndia Customer Support & AI Parts Assistant Service Engine
 * Single-Owner Automotive Platform Service Layer
 */

import { supabase } from './supabaseClient';
import { checkProductCompatibility as verifyCompatibilityService } from './compatibilityService';

const STORAGE_KEYS = {
  TICKETS: 'autozon_support_tickets_v2',
  MESSAGES: 'autozon_support_messages_v2',
  ESCALATIONS: 'autozon_support_escalations_v1',
  CONVERSATIONS: 'autozon_ai_conversations_v1',
  AI_MESSAGES: 'autozon_ai_messages_v1',
  KB_ARTICLES: 'autozon_support_articles_v1',
  AI_FEEDBACK: 'autozon_ai_feedback_v1',
  UNANSWERED: 'autozon_ai_unanswered_v1',
  USAGE_LOGS: 'autozon_ai_usage_v1',
  SETTINGS: 'autozon_support_settings_v1'
};

const safeGetStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
};

const safeSetStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to storage`, e);
  }
};

// ----------------------------------------------------------------------------
// 1. SUPPORT TICKETS & MESSAGES MANAGEMENT
// ----------------------------------------------------------------------------
export const getSupportSettings = () => safeGetStorage(STORAGE_KEYS.SETTINGS, {
  ai_enabled: true,
  assistant_enabled: true,
  human_handoff_enabled: true,
  max_messages_per_session: 30,
  max_daily_messages: 100,
  support_email: 'support@autozonindia.com',
  support_hours: 'Mon-Sat 09:00 - 20:00 IST',
  ai_disclaimer: 'AutoZoneIndia AI Assistant retrieves verified database compatibility and stock data only.',
  default_ticket_priority: 'normal'
});

export const updateSupportSettings = (newSettings) => {
  const current = getSupportSettings();
  const updated = { ...current, ...newSettings };
  safeSetStorage(STORAGE_KEYS.SETTINGS, updated);
  return updated;
};

export const generateTicketNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `AZI-TKT-${dateStr}-${randNum}`;
};

export const createSupportTicket = ({ customer_id, order_id, subject, description, category = 'technical', priority = 'normal' }) => {
  const ticketNumber = generateTicketNumber();
  const ticket = {
    id: `tkt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    ticket_number: ticketNumber,
    customer_id: customer_id || null,
    order_id: order_id || null,
    subject,
    description,
    category, // order, payment, shipping, return, refund, product, compatibility, account, quotation, technical, other
    priority, // low, normal, high, urgent
    status: 'open', // open, in_progress, waiting_customer, waiting_internal, resolved, closed
    assigned_to: 'Store Support Staff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    resolved_at: null
  };

  const tickets = safeGetStorage(STORAGE_KEYS.TICKETS, SEED_TICKETS);
  tickets.unshift(ticket);
  safeSetStorage(STORAGE_KEYS.TICKETS, tickets);

  // Initial customer message
  addSupportMessage({
    ticket_id: ticket.id,
    sender_type: 'customer',
    sender_id: customer_id || null,
    message: description,
    is_internal: false
  });

  return ticket;
};

export const getSupportTickets = () => safeGetStorage(STORAGE_KEYS.TICKETS, SEED_TICKETS);

export const getSupportTicketByNumber = (ticketNumber) => {
  const tickets = getSupportTickets();
  return tickets.find(t => t.ticket_number === ticketNumber || t.id === ticketNumber);
};

export const updateTicketStatus = (ticketId, status, assignedTo = null) => {
  const tickets = getSupportTickets();
  const updated = tickets.map(t => {
    if (t.id === ticketId || t.ticket_number === ticketId) {
      return {
        ...t,
        status,
        assigned_to: assignedTo || t.assigned_to,
        updated_at: new Date().toISOString(),
        resolved_at: (status === 'resolved' || status === 'closed') ? new Date().toISOString() : t.resolved_at
      };
    }
    return t;
  });
  safeSetStorage(STORAGE_KEYS.TICKETS, updated);
  return updated;
};

export const addSupportMessage = ({ ticket_id, sender_type, sender_id, message, is_internal = false }) => {
  const msg = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    ticket_id,
    sender_type, // customer, agent, ai, system
    sender_id: sender_id || null,
    message,
    attachments_json: [],
    is_internal, // Internal notes must NEVER be visible to customers
    created_at: new Date().toISOString()
  };

  const messages = safeGetStorage(STORAGE_KEYS.MESSAGES, SEED_MESSAGES);
  messages.push(msg);
  safeSetStorage(STORAGE_KEYS.MESSAGES, messages);
  return msg;
};

export const getSupportMessages = (ticketId, includeInternal = false) => {
  const messages = safeGetStorage(STORAGE_KEYS.MESSAGES, SEED_MESSAGES);
  return messages.filter(m => m.ticket_id === ticketId && (includeInternal || !m.is_internal));
};

// ----------------------------------------------------------------------------
// 2. VERIFIED APPLICATION DATA TOOLS (STRICT ZERO-HALLUCINATION)
// ----------------------------------------------------------------------------

// Tool 1: Product Search
export const toolSearchProducts = (products = [], query = '', category = 'all', brand = 'all', selectedVehicle = null) => {
  if (!products || products.length === 0) return [];
  const q = (query || '').toLowerCase().trim();

  return products.filter(p => {
    if (category !== 'all' && (p.category_id !== category && p.category !== category)) return false;
    if (brand !== 'all' && (p.brand_id !== brand && p.brand !== brand)) return false;

    if (q) {
      const matchTitle = (p.title || p.name || '').toLowerCase().includes(q);
      const matchSku = (p.sku || '').toLowerCase().includes(q);
      const matchOem = (p.oemPartNumber || p.partNumber || '').toLowerCase().includes(q);
      const matchBrand = (p.brand || '').toLowerCase().includes(q);
      if (!matchTitle && !matchSku && !matchOem && !matchBrand) return false;
    }
    return true;
  }).slice(0, 5);
};

// Tool 2: Exact Product Compatibility Check (No Fuzzy Inference)
export const toolCheckCompatibility = (productId, vehicleObj, products = []) => {
  if (!productId || !vehicleObj) return { status: 'not_verified', reason: 'Missing Product ID or Vehicle selection' };

  // Strict check using compatibility service
  const res = verifyCompatibilityService(productId, vehicleObj);
  if (res && res.compatible) {
    return {
      status: 'verified',
      reason: 'Verified exact fit in AutoZoneIndia compatibility database',
      notes: res.notes || '100% Fitment Guaranteed'
    };
  }

  return {
    status: 'not_verified',
    reason: 'Compatibility is not verified in our catalog yet. Would you like to create a compatibility enquiry?'
  };
};

// Tool 3: Verified Stock & Inventory Check
export const toolGetProductAvailability = (product) => {
  if (!product) return 'Currently unavailable';
  const stock = product.stockCount ?? product.stock_quantity ?? product.stock ?? 0;
  if (stock <= 0) return 'Currently unavailable';
  if (stock <= 5) return `Limited stock (${stock} units left)`;
  return 'In stock';
};

// Tool 4: Verified Customer Order Support
export const toolGetCustomerOrders = (customerId, orders = []) => {
  if (!customerId) return [];
  // Return only orders belonging to authenticated customer
  return orders.filter(o => o.customerId === customerId || o.customer_id === customerId);
};

// ----------------------------------------------------------------------------
// 3. AI PARTS ASSISTANT EXECUTION ENGINE WITH GUARDRAILS & HUMAN HANDOFF
// ----------------------------------------------------------------------------
export const executeAiAssistant = async ({ message, conversationId, customerId, selectedVehicle, products = [], orders = [], faqs = [] }) => {
  const inputLower = (message || '').toLowerCase().trim();

  // Create or retrieve conversation
  const convId = conversationId || `conv-${Date.now()}`;
  const sourceTrace = {
    source_type: 'verified_db',
    source_id: null,
    retrieval_time: new Date().toISOString(),
    tool_name: 'none'
  };

  let replyText = '';
  let suggestedAction = null; // { type: 'create_enquiry' | 'create_ticket' | 'add_to_cart', payload: {} }
  let foundProducts = [];

  // Guardrail 1: Human Handoff Request
  if (inputLower.includes('human') || inputLower.includes('agent') || inputLower.includes('representative') || inputLower.includes('support staff') || inputLower.includes('escalate')) {
    const tkt = createSupportTicket({
      customer_id: customerId,
      subject: 'AI Conversation Human Escalation',
      description: `Customer requested human support agent during AI chat session: "${message}"`,
      category: 'technical',
      priority: 'high'
    });

    recordEscalation(tkt.id, 'Customer requested human support agent');

    replyText = `I have transferred your request to our human support team. Support Ticket **#${tkt.ticket_number}** has been created for you. An agent will respond shortly.`;
    sourceTrace.tool_name = 'human_handoff';

    logAiMessage(convId, 'user', message);
    logAiMessage(convId, 'assistant', replyText);
    return { conversationId: convId, replyText, sourceTrace, transferredToHuman: true, ticketNumber: tkt.ticket_number };
  }

  // Guardrail 2: Order Status Check
  if (inputLower.includes('order') || inputLower.includes('tracking') || inputLower.includes('where is my order') || inputLower.includes('shipment')) {
    sourceTrace.tool_name = 'getCustomerOrders';
    const custOrders = toolGetCustomerOrders(customerId, orders);

    if (custOrders.length === 0) {
      replyText = `I couldn't find any recent orders associated with your account. If you placed an order as a guest, please check your tracking link in your email or provide your Order ID.`;
    } else {
      const latest = custOrders[0];
      replyText = `Your latest Order **#${latest.id || latest.orderNumber}** is currently **${latest.orderStatus || latest.status}**. Total: ₹${latest.totalAmount?.toLocaleString('en-IN')}.`;
    }

    logAiMessage(convId, 'user', message);
    logAiMessage(convId, 'assistant', replyText);
    return { conversationId: convId, replyText, sourceTrace, foundOrders: custOrders };
  }

  // Guardrail 3: Compatibility & Product Search Check
  if (inputLower.includes('fit') || inputLower.includes('compatible') || inputLower.includes('brake') || inputLower.includes('oil') || inputLower.includes('filter') || inputLower.includes('spark') || inputLower.includes('part')) {
    sourceTrace.tool_name = 'searchProducts_and_checkCompatibility';
    foundProducts = toolSearchProducts(products, inputLower, 'all', 'all', selectedVehicle);

    if (foundProducts.length > 0) {
      const target = foundProducts[0];
      const avail = toolGetProductAvailability(target);

      if (selectedVehicle) {
        const comp = toolCheckCompatibility(target.id, selectedVehicle, products);
        if (comp.status === 'verified') {
          replyText = `✅ **100% Verified Fitment!**\n\nThe **${target.title || target.name}** (SKU: \`${target.sku || target.partNumber}\`) is **verified to fit** your **${selectedVehicle.makeName || selectedVehicle.make} ${selectedVehicle.modelName || selectedVehicle.model}**.\n\nPrice: **₹${target.price?.toLocaleString('en-IN')}** | Stock Status: **${avail}**.`;
          suggestedAction = { type: 'add_to_cart', product: target };
        } else {
          replyText = `⚠️ **Compatibility not verified in catalog yet.**\n\nWe have **${target.title || target.name}**, but exact fitment for your **${selectedVehicle.makeName || selectedVehicle.make} ${selectedVehicle.modelName || selectedVehicle.model}** is not verified in our database yet.\n\n*Note: I never estimate or guess compatibility without database verification.*`;
          suggestedAction = { type: 'create_enquiry', product: target, vehicle: selectedVehicle };
          recordUnansweredQuestion(convId, message, 'unverified_compatibility');
        }
      } else {
        replyText = `Found **${target.title || target.name}** (Price: **₹${target.price?.toLocaleString('en-IN')}** | Status: **${avail}**).\n\nPlease select your vehicle in **My Garage** to verify 100% exact fitment!`;
      }
    } else {
      replyText = `I don't have verified information for that part in our catalog yet.\n\nWould you like me to submit a custom Part Enquiry to our store team?`;
      suggestedAction = { type: 'create_enquiry', query: message };
      recordUnansweredQuestion(convId, message, 'data_missing');
    }

    logAiMessage(convId, 'user', message);
    logAiMessage(convId, 'assistant', replyText);
    return { conversationId: convId, replyText, sourceTrace, foundProducts, suggestedAction };
  }

  // Fallback: General FAQ / Knowledge Lookup
  const matchedFaq = (faqs || []).find(f => inputLower.includes(f.question?.toLowerCase()) || (f.answer && inputLower.includes('return')) || (f.answer && inputLower.includes('shipping')));
  if (matchedFaq) {
    sourceTrace.tool_name = 'faq_knowledge_lookup';
    replyText = matchedFaq.answer;
  } else {
    sourceTrace.tool_name = 'unanswered_fallback';
    replyText = `मैं इसे verify किए बिना confirm नहीं कर सकता (I cannot confirm without verified database data).\n\nWould you like to connect with a support agent or create a support ticket?`;
    suggestedAction = { type: 'create_ticket', query: message };
    recordUnansweredQuestion(convId, message, 'unverified_query');
  }

  logAiMessage(convId, 'user', message);
  logAiMessage(convId, 'assistant', replyText);

  return { conversationId: convId, replyText, sourceTrace, suggestedAction };
};

export const logAiMessage = (conversationId, role, content) => {
  const msg = {
    id: `aimsg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    conversation_id: conversationId,
    role, // user, assistant, tool, system
    content,
    created_at: new Date().toISOString()
  };

  const messages = safeGetStorage(STORAGE_KEYS.AI_MESSAGES, []);
  messages.push(msg);
  safeSetStorage(STORAGE_KEYS.AI_MESSAGES, messages);

  // Log usage
  const logs = safeGetStorage(STORAGE_KEYS.USAGE_LOGS, []);
  logs.unshift({
    id: `usg-${Date.now()}`,
    conversation_id: conversationId,
    model: 'gemini-1.5-flash',
    input_tokens: content.length,
    output_tokens: content.length * 2,
    latency_ms: 180,
    status: 'success',
    created_at: new Date().toISOString()
  });
  safeSetStorage(STORAGE_KEYS.USAGE_LOGS, logs);

  return msg;
};

export const getAiMessages = (conversationId) => {
  const messages = safeGetStorage(STORAGE_KEYS.AI_MESSAGES, []);
  return messages.filter(m => m.conversation_id === conversationId);
};

// ----------------------------------------------------------------------------
// 4. HUMAN ESCALATIONS & UNANSWERED QUESTION QUEUE
// ----------------------------------------------------------------------------
export const recordEscalation = (ticketId, reason) => {
  const escalations = safeGetStorage(STORAGE_KEYS.ESCALATIONS, []);
  const payload = {
    id: `esc-${Date.now()}`,
    ticket_id: ticketId,
    reason,
    priority: 'high',
    assigned_to: 'Support Staff',
    status: 'pending',
    created_at: new Date().toISOString()
  };
  escalations.unshift(payload);
  safeSetStorage(STORAGE_KEYS.ESCALATIONS, escalations);
  return payload;
};

export const getEscalations = () => safeGetStorage(STORAGE_KEYS.ESCALATIONS, []);

export const recordUnansweredQuestion = (conversationId, questionText, reason) => {
  const unanswered = safeGetStorage(STORAGE_KEYS.UNANSWERED, []);
  const payload = {
    id: `unans-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    conversation_id: conversationId,
    question_text: questionText,
    reason, // data_missing, unverified_compatibility, customer_escalated
    status: 'pending', // pending, converted_faq, converted_article, converted_task, dismissed
    created_at: new Date().toISOString()
  };
  unanswered.unshift(payload);
  safeSetStorage(STORAGE_KEYS.UNANSWERED, unanswered);
  return payload;
};

export const getUnansweredQuestions = () => safeGetStorage(STORAGE_KEYS.UNANSWERED, SEED_UNANSWERED);

export const resolveUnansweredQuestion = (id, newStatus) => {
  const unanswered = getUnansweredQuestions();
  const updated = unanswered.map(u => u.id === id ? { ...u, status: newStatus } : u);
  safeSetStorage(STORAGE_KEYS.UNANSWERED, updated);
  return updated;
};

// ----------------------------------------------------------------------------
// 5. KNOWLEDGE BASE ARTICLES & AI FEEDBACK
// ----------------------------------------------------------------------------
export const getKnowledgeBaseArticles = () => safeGetStorage(STORAGE_KEYS.KB_ARTICLES, SEED_ARTICLES);

export const saveKnowledgeBaseArticle = (article) => {
  const articles = getKnowledgeBaseArticles();
  const idx = articles.findIndex(a => a.id === article.id || a.slug === article.slug);
  const payload = {
    ...article,
    id: article.id || `art-${Date.now()}`,
    slug: article.slug || article.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''),
    updated_at: new Date().toISOString()
  };
  if (idx >= 0) articles[idx] = payload;
  else articles.unshift({ ...payload, created_at: new Date().toISOString() });
  safeSetStorage(STORAGE_KEYS.KB_ARTICLES, articles);
  return payload;
};

export const submitAiFeedback = (conversationId, messageId, rating, reason = '') => {
  const feedback = safeGetStorage(STORAGE_KEYS.AI_FEEDBACK, []);
  const payload = {
    id: `fb-${Date.now()}`,
    conversation_id: conversationId,
    message_id: messageId,
    rating, // helpful, incorrect, needs_review
    reason,
    created_at: new Date().toISOString()
  };
  feedback.unshift(payload);
  safeSetStorage(STORAGE_KEYS.AI_FEEDBACK, feedback);

  if (rating === 'incorrect' || rating === 'needs_review') {
    recordUnansweredQuestion(conversationId, `Customer reported feedback: ${rating} (${reason})`, 'negative_feedback');
  }

  return payload;
};

export const getAiFeedback = () => safeGetStorage(STORAGE_KEYS.AI_FEEDBACK, []);
export const getAiUsageLogs = () => safeGetStorage(STORAGE_KEYS.USAGE_LOGS, []);

// ----------------------------------------------------------------------------
// SEED MOCK DATA
// ----------------------------------------------------------------------------
const SEED_TICKETS = [
  {
    id: 'tkt-01',
    ticket_number: 'AZI-TKT-20260910-1001',
    customer_id: 'cust-101',
    order_id: 'AZ-2026-8801',
    subject: 'Fitment Verification for Swift 2020 Brake Disc',
    description: 'I need confirmation if brake disc part #04465-0K280 fits 2020 Maruti Swift DualJet.',
    category: 'compatibility',
    priority: 'high',
    status: 'in_progress',
    assigned_to: 'Senior Fitment Technician',
    created_at: '2026-09-10T10:00:00Z',
    updated_at: '2026-09-10T11:30:00Z'
  }
];

const SEED_MESSAGES = [
  {
    id: 'msg-01',
    ticket_id: 'tkt-01',
    sender_type: 'customer',
    sender_id: 'cust-101',
    message: 'I need confirmation if brake disc part #04465-0K280 fits 2020 Maruti Swift DualJet.',
    is_internal: false,
    created_at: '2026-09-10T10:00:00Z'
  },
  {
    id: 'msg-02',
    ticket_id: 'tkt-01',
    sender_type: 'agent',
    sender_id: 'agent-99',
    message: 'Verified with OEM catalog. Part #04465-0K280 is 100% compatible with 2020 Swift K12N DualJet Front Axle.',
    is_internal: false,
    created_at: '2026-09-10T11:30:00Z'
  },
  {
    id: 'msg-03',
    ticket_id: 'tkt-01',
    sender_type: 'agent',
    sender_id: 'agent-99',
    message: 'INTERNAL NOTE: Checked against MGP Catalog V4.2. Dimensions 256mm ventilated disc.',
    is_internal: true, // MUST NEVER BE VISIBLE TO CUSTOMERS
    created_at: '2026-09-10T11:32:00Z'
  }
];

const SEED_UNANSWERED = [
  {
    id: 'unans-01',
    conversation_id: 'conv-9901',
    question_text: 'Will Mahindra XUV700 AX7 L brake pads fit 2024 Thar Earth Edition?',
    reason: 'unverified_compatibility',
    status: 'pending',
    created_at: '2026-09-11T09:00:00Z'
  }
];

const SEED_ARTICLES = [
  {
    id: 'art-01',
    title: 'How to Read AutoZoneIndia Verified Fitment Badges',
    slug: 'read-verified-fitment-badges',
    content: 'When browsing parts on AutoZoneIndia, look for the green 100% Fitment Verified badge. This indicates the part has been cross-referenced against official OEM parts catalogs.',
    category: 'Compatibility',
    status: 'published',
    created_at: '2026-09-01T00:00:00Z'
  }
];
