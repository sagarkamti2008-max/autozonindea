/**
 * AutoZoneIndia Marketing Automation & Unified Notification Service Engine
 * Single-Owner Automotive E-Commerce Platform
 */

import { supabase } from './supabaseClient';

const STORAGE_KEYS = {
  EVENTS: 'autozon_customer_events_v1',
  ABANDONED_CARTS: 'autozon_abandoned_carts_v1',
  AUTOMATIONS: 'autozon_automation_rules_v1',
  AUTOMATION_RUNS: 'autozon_automation_runs_v1',
  SEGMENTS: 'autozon_customer_segments_v1',
  TAGS: 'autozon_customer_tags_v1',
  TAG_ASSIGNMENTS: 'autozon_tag_assignments_v1',
  NOTIFICATIONS: 'autozon_notification_events_v1',
  PREFERENCES: 'autozon_notification_preferences_v1',
  STOCK_ALERTS: 'autozon_stock_alerts_v1',
  PRICE_ALERTS: 'autozon_price_alerts_v1',
  EMAIL_TEMPLATES: 'autozon_email_templates_v1',
  WHATSAPP_TEMPLATES: 'autozon_whatsapp_templates_v1',
  CAMPAIGNS: 'autozon_marketing_campaigns_v1',
  CAMPAIGN_EVENTS: 'autozon_campaign_events_v1',
  SETTINGS: 'autozon_marketing_settings_v1'
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
// 1. CUSTOMER EVENT TRACKING ENGINE
// ----------------------------------------------------------------------------
export const trackCustomerEvent = async (eventData) => {
  const payload = {
    id: eventData.id || `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    customer_id: eventData.customer_id || null,
    session_id: eventData.session_id || 'session-guest-01',
    event_type: eventData.event_type, // page_view, add_to_cart, checkout_abandoned, etc.
    entity_type: eventData.entity_type || null,
    entity_id: eventData.entity_id || null,
    metadata_json: eventData.metadata_json || {},
    created_at: new Date().toISOString()
  };

  // 1. Storage Fallback & Sync
  const events = safeGetStorage(STORAGE_KEYS.EVENTS, []);
  events.unshift(payload);
  if (events.length > 500) events.pop();
  safeSetStorage(STORAGE_KEYS.EVENTS, events);

  // 2. Supabase DB Sync
  try {
    if (supabase) {
      await supabase.from('customer_events').insert(payload);
    }
  } catch (e) {
    console.warn('Supabase event tracking fallback active:', e);
  }

  // 3. Trigger Automation Rules matching event
  await triggerAutomationsForEvent(payload.event_type, payload);

  return payload;
};

export const getCustomerEvents = () => safeGetStorage(STORAGE_KEYS.EVENTS, []);

// ----------------------------------------------------------------------------
// 2. ABANDONED CART ENGINE & RECOVERY WORKFLOW
// ----------------------------------------------------------------------------
export const getAbandonedCarts = () => safeGetStorage(STORAGE_KEYS.ABANDONED_CARTS, []);

export const getMarketingSettings = () => safeGetStorage(STORAGE_KEYS.SETTINGS, {
  abandoned_cart_delay: 60, // minutes
  maximum_recovery_messages: 2,
  campaign_frequency_limit: 3,
  back_in_stock_enabled: true,
  price_alert_enabled: true,
  marketing_email_enabled: true,
  marketing_whatsapp_enabled: true,
  marketing_sms_enabled: false
});

export const updateMarketingSettings = (newSettings) => {
  const current = getMarketingSettings();
  const updated = { ...current, ...newSettings };
  safeSetStorage(STORAGE_KEYS.SETTINGS, updated);
  return updated;
};

export const syncCartActivity = (sessionId, customerId, cartItems, totalAmount) => {
  if (!cartItems || cartItems.length === 0) {
    // If cart emptied, mark any existing active cart as recovered or ignored
    const carts = safeGetStorage(STORAGE_KEYS.ABANDONED_CARTS, []);
    const updated = carts.map(c => {
      if (c.session_id === sessionId && c.recovery_status === 'active') {
        return { ...c, recovery_status: 'recovered', recovered_at: new Date().toISOString() };
      }
      return c;
    });
    safeSetStorage(STORAGE_KEYS.ABANDONED_CARTS, updated);
    return;
  }

  const carts = safeGetStorage(STORAGE_KEYS.ABANDONED_CARTS, []);
  const existingIndex = carts.findIndex(c => c.session_id === sessionId);

  if (existingIndex >= 0) {
    carts[existingIndex].cart_snapshot = cartItems;
    carts[existingIndex].total_amount = totalAmount;
    carts[existingIndex].last_activity_at = new Date().toISOString();
    carts[existingIndex].customer_id = customerId || carts[existingIndex].customer_id;
  } else {
    carts.unshift({
      id: `cart-ab-${Date.now()}`,
      customer_id: customerId || null,
      session_id: sessionId,
      cart_snapshot: cartItems,
      total_amount: totalAmount,
      detected_at: new Date().toISOString(),
      last_activity_at: new Date().toISOString(),
      recovery_status: 'active', // active, eligible, message_scheduled, message_sent, recovered, expired, ignored
      recovered_at: null,
      created_at: new Date().toISOString()
    });
  }

  safeSetStorage(STORAGE_KEYS.ABANDONED_CARTS, carts);
};

export const detectAbandonedCarts = () => {
  const settings = getMarketingSettings();
  const thresholdMs = (settings.abandoned_cart_delay || 60) * 60 * 1000;
  const now = Date.now();

  const carts = safeGetStorage(STORAGE_KEYS.ABANDONED_CARTS, []);
  let updatedCount = 0;

  const updatedCarts = carts.map(c => {
    if (c.recovery_status === 'active') {
      const lastAct = new Date(c.last_activity_at).getTime();
      if (now - lastAct >= thresholdMs) {
        updatedCount++;
        return { ...c, recovery_status: 'eligible', detected_at: new Date().toISOString() };
      }
    }
    return c;
  });

  if (updatedCount > 0) {
    safeSetStorage(STORAGE_KEYS.ABANDONED_CARTS, updatedCarts);
  }

  return updatedCarts.filter(c => c.recovery_status === 'eligible');
};

export const recoverAbandonedCart = async (cartId, channel = 'email', couponCode = 'RECOVER10') => {
  const carts = safeGetStorage(STORAGE_KEYS.ABANDONED_CARTS, []);
  const cart = carts.find(c => c.id === cartId);
  if (!cart) throw new Error('Abandoned cart not found');

  // Check consent & preferences if customerId present
  if (cart.customer_id) {
    const prefs = getCustomerNotificationPreferences(cart.customer_id);
    if (!prefs.promotional_messages) {
      cart.recovery_status = 'ignored';
      safeSetStorage(STORAGE_KEYS.ABANDONED_CARTS, carts);
      return { success: false, reason: 'Customer opted out of promotional communications' };
    }
  }

  // Create recovery notification
  const title = '🛒 You left items in your AutoZoneIndia cart!';
  const message = `Hi there! You have ${cart.cart_snapshot.length} items (Total: ₹${cart.total_amount}) waiting in your cart. Use coupon code ${couponCode} for extra discount!`;

  await sendUnifiedNotification({
    customer_id: cart.customer_id,
    type: 'abandoned_cart',
    title,
    message,
    channel,
    order_id: null
  });

  cart.recovery_status = 'message_sent';
  safeSetStorage(STORAGE_KEYS.ABANDONED_CARTS, carts);

  return { success: true, cart };
};

// ----------------------------------------------------------------------------
// 3. UNIFIED NOTIFICATION ARCHITECTURE & CUSTOMER PREFERENCES
// ----------------------------------------------------------------------------
export const DEFAULT_NOTIF_PREFERENCES = {
  order_updates: true,
  promotional_messages: true,
  email_enabled: true,
  whatsapp_enabled: true,
  sms_enabled: false
};

export const getCustomerNotificationPreferences = (customerId) => {
  const allPrefs = safeGetStorage(STORAGE_KEYS.PREFERENCES, {});
  return allPrefs[customerId] || { ...DEFAULT_NOTIF_PREFERENCES, customer_id: customerId };
};

export const updateCustomerNotificationPreferences = (customerId, newPrefs) => {
  const allPrefs = safeGetStorage(STORAGE_KEYS.PREFERENCES, {});
  allPrefs[customerId] = { ...(allPrefs[customerId] || DEFAULT_NOTIF_PREFERENCES), ...newPrefs, customer_id: customerId, updated_at: new Date().toISOString() };
  safeSetStorage(STORAGE_KEYS.PREFERENCES, allPrefs);
  return allPrefs[customerId];
};

export const sendUnifiedNotification = async ({ customer_id, order_id, type, title, message, channel = 'in_app' }) => {
  // Respect Preferences if customer_id is provided
  if (customer_id) {
    const prefs = getCustomerNotificationPreferences(customer_id);

    if (type === 'promotional' || type === 'abandoned_cart') {
      if (!prefs.promotional_messages) {
        console.log(`Notification skipped for ${customer_id}: Customer opted out of promotional messages.`);
        return { success: false, reason: 'Opted out of promotional messages' };
      }
    }

    if (channel === 'email' && !prefs.email_enabled) return { success: false, reason: 'Email disabled by customer' };
    if (channel === 'whatsapp' && !prefs.whatsapp_enabled) return { success: false, reason: 'WhatsApp disabled by customer' };
    if (channel === 'sms' && !prefs.sms_enabled) return { success: false, reason: 'SMS disabled by customer' };
  }

  const notifEvent = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    customer_id: customer_id || 'cust-guest',
    order_id: order_id || null,
    type: type || 'transactional', // transactional, promotional, abandoned_cart, stock_alert, price_alert
    title,
    message,
    channel, // in_app, email, whatsapp, sms
    status: 'sent',
    scheduled_at: new Date().toISOString(),
    sent_at: new Date().toISOString(),
    provider_message_id: `prov-msg-${Date.now()}`,
    error_message: null,
    created_at: new Date().toISOString()
  };

  const notifications = safeGetStorage(STORAGE_KEYS.NOTIFICATIONS, []);
  notifications.unshift(notifEvent);
  safeSetStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);

  return { success: true, notification: notifEvent };
};

export const getCustomerNotifications = (customerId) => {
  const notifications = safeGetStorage(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  return notifications.filter(n => n.customer_id === customerId || n.customer_id === 'all');
};

export const markNotificationAsRead = (notificationId) => {
  const notifications = safeGetStorage(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  const updated = notifications.map(n => n.id === notificationId ? { ...n, read: true } : n);
  safeSetStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  return updated;
};

export const markAllNotificationsAsRead = (customerId) => {
  const notifications = safeGetStorage(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  const updated = notifications.map(n => (n.customer_id === customerId || n.customer_id === 'all') ? { ...n, read: true } : n);
  safeSetStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  return updated;
};

// ----------------------------------------------------------------------------
// 4. AUTOMATION ENGINE & TRIGGER-ACTION EVALUATOR
// ----------------------------------------------------------------------------
export const getAutomationRules = () => safeGetStorage(STORAGE_KEYS.AUTOMATIONS, SEED_AUTOMATION_RULES);

export const saveAutomationRule = (rule) => {
  const rules = getAutomationRules();
  const existingIdx = rules.findIndex(r => r.id === rule.id);
  const payload = {
    ...rule,
    id: rule.id || `rule-${Date.now()}`,
    updated_at: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    rules[existingIdx] = payload;
  } else {
    rules.unshift({ ...payload, created_at: new Date().toISOString() });
  }

  safeSetStorage(STORAGE_KEYS.AUTOMATIONS, rules);
  return payload;
};

export const triggerAutomationsForEvent = async (triggerType, eventPayload) => {
  const rules = getAutomationRules().filter(r => r.enabled && r.trigger_type === triggerType);

  for (const rule of rules) {
    const runLog = {
      id: `run-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      automation_rule_id: rule.id,
      customer_id: eventPayload.customer_id || null,
      event_id: eventPayload.id || null,
      action: rule.action_type,
      status: 'success',
      result_json: {},
      error_message: null,
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString()
    };

    try {
      if (rule.action_type === 'create_notification' || rule.action_type === 'send_email' || rule.action_type === 'send_whatsapp') {
        const channelMap = { create_notification: 'in_app', send_email: 'email', send_whatsapp: 'whatsapp' };
        await sendUnifiedNotification({
          customer_id: eventPayload.customer_id,
          type: 'transactional',
          title: rule.name,
          message: rule.description || `Automated action triggered for ${triggerType}`,
          channel: channelMap[rule.action_type] || 'in_app'
        });
      } else if (rule.action_type === 'tag_customer' && eventPayload.customer_id) {
        if (rule.action_config_json?.tag_id) {
          assignTagToCustomer(eventPayload.customer_id, rule.action_config_json.tag_id, 'Automation Engine');
        }
      }
      runLog.result_json = { executed: true, trigger: triggerType };
    } catch (err) {
      runLog.status = 'failed';
      runLog.error_message = err.message;
    }

    const runs = safeGetStorage(STORAGE_KEYS.AUTOMATION_RUNS, []);
    runs.unshift(runLog);
    if (runs.length > 200) runs.pop();
    safeSetStorage(STORAGE_KEYS.AUTOMATION_RUNS, runs);
  }
};

export const getAutomationRuns = () => safeGetStorage(STORAGE_KEYS.AUTOMATION_RUNS, []);

// ----------------------------------------------------------------------------
// 5. CUSTOMER SEGMENTS ENGINE
// ----------------------------------------------------------------------------
export const getCustomerSegments = () => safeGetStorage(STORAGE_KEYS.SEGMENTS, SEED_SEGMENTS);

export const saveCustomerSegment = (segment) => {
  const segments = getCustomerSegments();
  const idx = segments.findIndex(s => s.id === segment.id);
  const payload = { ...segment, id: segment.id || `seg-${Date.now()}`, updated_at: new Date().toISOString() };
  if (idx >= 0) segments[idx] = payload;
  else segments.unshift({ ...payload, created_at: new Date().toISOString() });
  safeSetStorage(STORAGE_KEYS.SEGMENTS, segments);
  return payload;
};

export const calculateCustomersForSegment = (segmentRules, allCustomers = [], allOrders = []) => {
  if (!segmentRules || Object.keys(segmentRules).length === 0) return allCustomers;

  return allCustomers.filter(customer => {
    const customerOrders = allOrders.filter(o => o.customerId === customer.id || o.customerName === customer.name);

    if (segmentRules.minOrders !== undefined && customerOrders.length < segmentRules.minOrders) return false;
    if (segmentRules.maxOrders !== undefined && customerOrders.length > segmentRules.maxOrders) return false;

    const totalSpent = customerOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    if (segmentRules.minSpent !== undefined && totalSpent < segmentRules.minSpent) return false;

    if (segmentRules.hasAbandonedCart) {
      const carts = safeGetStorage(STORAGE_KEYS.ABANDONED_CARTS, []);
      const hasAb = carts.some(c => c.customer_id === customer.id && c.recovery_status !== 'recovered');
      if (!hasAb) return false;
    }

    return true;
  });
};

// ----------------------------------------------------------------------------
// 6. CUSTOMER TAGGING SYSTEM
// ----------------------------------------------------------------------------
export const getCustomerTags = () => safeGetStorage(STORAGE_KEYS.TAGS, SEED_TAGS);

export const saveCustomerTag = (tag) => {
  const tags = getCustomerTags();
  const idx = tags.findIndex(t => t.id === tag.id);
  const payload = { ...tag, id: tag.id || `tag-${Date.now()}` };
  if (idx >= 0) tags[idx] = payload;
  else tags.unshift({ ...payload, created_at: new Date().toISOString() });
  safeSetStorage(STORAGE_KEYS.TAGS, tags);
  return payload;
};

export const getCustomerTagAssignments = () => safeGetStorage(STORAGE_KEYS.TAG_ASSIGNMENTS, []);

export const assignTagToCustomer = (customerId, tagId, assignedBy = 'Admin Staff') => {
  const assignments = getCustomerTagAssignments();
  const exists = assignments.some(a => a.customer_id === customerId && a.tag_id === tagId);
  if (!exists) {
    assignments.push({ customer_id: customerId, tag_id: tagId, assigned_by: assignedBy, created_at: new Date().toISOString() });
    safeSetStorage(STORAGE_KEYS.TAG_ASSIGNMENTS, assignments);
  }
  return assignments;
};

export const removeTagFromCustomer = (customerId, tagId) => {
  const assignments = getCustomerTagAssignments();
  const filtered = assignments.filter(a => !(a.customer_id === customerId && a.tag_id === tagId));
  safeSetStorage(STORAGE_KEYS.TAG_ASSIGNMENTS, filtered);
  return filtered;
};

// ----------------------------------------------------------------------------
// 7. STOCK ALERT & PRICE DROP SUBSCRIPTIONS ENGINE
// ----------------------------------------------------------------------------
export const getStockAlertSubscriptions = () => safeGetStorage(STORAGE_KEYS.STOCK_ALERTS, []);

export const subscribeStockAlert = (customerId, productId, email) => {
  const subs = getStockAlertSubscriptions();
  const existing = subs.find(s => s.product_id === productId && s.email === email);
  if (existing) return existing;

  const payload = {
    id: `stock-sub-${Date.now()}`,
    customer_id: customerId || null,
    product_id: productId,
    email,
    status: 'active', // active, notified, cancelled
    created_at: new Date().toISOString(),
    notified_at: null
  };
  subs.unshift(payload);
  safeSetStorage(STORAGE_KEYS.STOCK_ALERTS, subs);
  return payload;
};

export const triggerStockAvailabilityAlerts = async (productId, currentStock, productTitle) => {
  if (currentStock <= 0) return;
  const subs = getStockAlertSubscriptions();
  let count = 0;

  const updated = subs.map(s => {
    if (s.product_id === productId && s.status === 'active') {
      count++;
      sendUnifiedNotification({
        customer_id: s.customer_id,
        type: 'stock_alert',
        title: '🎉 Back in Stock!',
        message: `Good news! ${productTitle || 'An item you wanted'} is now back in stock on AutoZoneIndia!`,
        channel: 'email'
      });
      return { ...s, status: 'notified', notified_at: new Date().toISOString() };
    }
    return s;
  });

  if (count > 0) safeSetStorage(STORAGE_KEYS.STOCK_ALERTS, updated);
  return count;
};

export const getPriceAlertSubscriptions = () => safeGetStorage(STORAGE_KEYS.PRICE_ALERTS, []);

export const subscribePriceAlert = (customerId, productId, currentPrice, targetPrice = null) => {
  const subs = getPriceAlertSubscriptions();
  const payload = {
    id: `price-sub-${Date.now()}`,
    customer_id: customerId || null,
    product_id: productId,
    target_price: targetPrice,
    previous_price: currentPrice,
    status: 'active',
    created_at: new Date().toISOString(),
    notified_at: null
  };
  subs.unshift(payload);
  safeSetStorage(STORAGE_KEYS.PRICE_ALERTS, subs);
  return payload;
};

export const triggerPriceDropAlerts = async (productId, oldPrice, newPrice, productTitle) => {
  if (newPrice >= oldPrice) return;
  const subs = getPriceAlertSubscriptions();
  let count = 0;

  const updated = subs.map(s => {
    if (s.product_id === productId && s.status === 'active') {
      if (!s.target_price || newPrice <= s.target_price) {
        count++;
        sendUnifiedNotification({
          customer_id: s.customer_id,
          type: 'price_alert',
          title: '🔥 Price Drop Alert!',
          message: `${productTitle || 'An item on your alert list'} price dropped from ₹${oldPrice} to ₹${newPrice}!`,
          channel: 'email'
        });
        return { ...s, status: 'notified', notified_at: new Date().toISOString() };
      }
    }
    return s;
  });

  if (count > 0) safeSetStorage(STORAGE_KEYS.PRICE_ALERTS, updated);
  return count;
};

// ----------------------------------------------------------------------------
// 8. EMAIL & WHATSAPP TEMPLATES ARCHITECTURE
// ----------------------------------------------------------------------------
export const renderTemplateVariables = (templateStr, vars = {}) => {
  if (!templateStr) return '';
  return templateStr.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] !== undefined ? vars[key] : `{{${key}}}`);
};

export const getEmailTemplates = () => safeGetStorage(STORAGE_KEYS.EMAIL_TEMPLATES, SEED_EMAIL_TEMPLATES);

export const saveEmailTemplate = (template) => {
  const tmpls = getEmailTemplates();
  const idx = tmpls.findIndex(t => t.id === template.id);
  const payload = { ...template, id: template.id || `tmpl-email-${Date.now()}`, updated_at: new Date().toISOString() };
  if (idx >= 0) tmpls[idx] = payload;
  else tmpls.unshift({ ...payload, created_at: new Date().toISOString() });
  safeSetStorage(STORAGE_KEYS.EMAIL_TEMPLATES, tmpls);
  return payload;
};

export const getWhatsAppTemplates = () => safeGetStorage(STORAGE_KEYS.WHATSAPP_TEMPLATES, SEED_WHATSAPP_TEMPLATES);

export const saveWhatsAppTemplate = (template) => {
  const tmpls = getWhatsAppTemplates();
  const idx = tmpls.findIndex(t => t.id === template.id);
  const payload = { ...template, id: template.id || `tmpl-wa-${Date.now()}` };
  if (idx >= 0) tmpls[idx] = payload;
  else tmpls.unshift(payload);
  safeSetStorage(STORAGE_KEYS.WHATSAPP_TEMPLATES, tmpls);
  return payload;
};

// ----------------------------------------------------------------------------
// 9. MARKETING CAMPAIGNS & CAMPAIGN ANALYTICS
// ----------------------------------------------------------------------------
export const getMarketingCampaigns = () => safeGetStorage(STORAGE_KEYS.CAMPAIGNS, SEED_CAMPAIGNS);

export const saveMarketingCampaign = (campaign) => {
  const campaigns = getMarketingCampaigns();
  const idx = campaigns.findIndex(c => c.id === campaign.id);
  const payload = { ...campaign, id: campaign.id || `camp-${Date.now()}`, updated_at: new Date().toISOString() };
  if (idx >= 0) campaigns[idx] = payload;
  else campaigns.unshift({ ...payload, created_at: new Date().toISOString() });
  safeSetStorage(STORAGE_KEYS.CAMPAIGNS, campaigns);
  return payload;
};

export const runMarketingCampaign = async (campaignId, customersList = []) => {
  const campaigns = getMarketingCampaigns();
  const campaign = campaigns.find(c => c.id === campaignId);
  if (!campaign) throw new Error('Campaign not found');

  campaign.status = 'running';
  campaign.started_at = new Date().toISOString();
  safeSetStorage(STORAGE_KEYS.CAMPAIGNS, campaigns);

  const events = safeGetStorage(STORAGE_KEYS.CAMPAIGN_EVENTS, []);
  let sentCount = 0;

  for (const cust of customersList) {
    // Consent check
    const prefs = getCustomerNotificationPreferences(cust.id);
    if (!prefs.promotional_messages) continue;

    sentCount++;
    events.push({
      id: `cevt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      campaign_id: campaignId,
      customer_id: cust.id,
      event_type: 'sent',
      metadata_json: { email: cust.email },
      created_at: new Date().toISOString()
    });

    await sendUnifiedNotification({
      customer_id: cust.id,
      type: 'promotional',
      title: campaign.name,
      message: campaign.description || 'Exclusive automotive offer from AutoZoneIndia!',
      channel: campaign.channel || 'email'
    });
  }

  safeSetStorage(STORAGE_KEYS.CAMPAIGN_EVENTS, events);

  campaign.status = 'completed';
  campaign.completed_at = new Date().toISOString();
  safeSetStorage(STORAGE_KEYS.CAMPAIGNS, campaigns);

  return { success: true, sentCount };
};

export const getCampaignEvents = (campaignId) => {
  const events = safeGetStorage(STORAGE_KEYS.CAMPAIGN_EVENTS, []);
  return campaignId ? events.filter(e => e.campaign_id === campaignId) : events;
};

// ----------------------------------------------------------------------------
// 10. SCHEDULED CRON JOB SIMULATION ARCHITECTURE
// ----------------------------------------------------------------------------
export const runScheduledMarketingJobs = () => {
  console.log('[Marketing Cron Engine] Running scheduled background jobs...');
  const eligibleCarts = detectAbandonedCarts();
  console.log(`[Marketing Cron Engine] Processed ${eligibleCarts.length} abandoned carts eligible for recovery.`);
  return { abandonedCartsProcessed: eligibleCarts.length, timestamp: new Date().toISOString() };
};

// ----------------------------------------------------------------------------
// SEED MOCK DATA DEFINITIONS
// ----------------------------------------------------------------------------
const SEED_NOTIFICATIONS = [
  {
    id: 'notif-01',
    customer_id: 'cust-101',
    order_id: 'AZ-2026-8801',
    type: 'transactional',
    title: '📦 Order Shipped!',
    message: 'Your order #AZ-2026-8801 has been dispatched via Bluedart Express (AWB: AWB987654321IN).',
    channel: 'in_app',
    read: false,
    created_at: '2026-09-10T10:15:00Z'
  },
  {
    id: 'notif-02',
    customer_id: 'cust-101',
    order_id: null,
    type: 'promotional',
    title: '🔥 Festival Sale Live!',
    message: 'Get up to 25% OFF on Bosch brake pads & Mobil engine oils. Use code FESTIVE25.',
    channel: 'in_app',
    read: true,
    created_at: '2026-09-08T09:00:00Z'
  }
];

const SEED_AUTOMATION_RULES = [
  {
    id: 'rule-01',
    name: 'Abandoned Cart 60-Min Recovery Reminder',
    description: 'Send in-app & email notification 60 minutes after cart inactivity with 10% coupon.',
    trigger_type: 'cart_abandoned',
    action_type: 'send_email',
    enabled: true,
    created_at: '2026-09-01T00:00:00Z'
  },
  {
    id: 'rule-02',
    name: 'Auto-Tag High Value Order Customers',
    description: 'Tag customers who place orders exceeding ₹10,000 as VIP Customer.',
    trigger_type: 'order_paid',
    action_type: 'tag_customer',
    action_config_json: { tag_id: 'tag-vip' },
    enabled: true,
    created_at: '2026-09-01T00:00:00Z'
  }
];

const SEED_SEGMENTS = [
  { id: 'seg-vip', name: 'VIP High Value Buyers', description: 'Customers with gross purchases over ₹10,000', rules_json: { minSpent: 10000 }, status: 'active' },
  { id: 'seg-repeat', name: 'Repeat Buyers', description: 'Customers with 2 or more completed orders', rules_json: { minOrders: 2 }, status: 'active' },
  { id: 'seg-abandoned', name: 'Abandoned Cart Prospects', description: 'Customers with active abandoned cart sessions', rules_json: { hasAbandonedCart: true }, status: 'active' }
];

const SEED_TAGS = [
  { id: 'tag-vip', name: 'VIP Customer', description: 'High value customer receiving priority delivery', created_at: '2026-09-01T00:00:00Z' },
  { id: 'tag-fleet', name: 'Fleet Owner', description: 'B2B Fleet management commercial buyer', created_at: '2026-09-01T00:00:00Z' },
  { id: 'tag-garage', name: 'Garage Partner', description: 'Verified independent garage workshop partner', created_at: '2026-09-01T00:00:00Z' }
];

const SEED_EMAIL_TEMPLATES = [
  {
    id: 'tmpl-email-abandoned',
    name: 'Abandoned Cart Recovery Reminder',
    subject: '🛒 {{customer_name}}, items in your AutoZoneIndia cart are selling out fast!',
    body_html: '<h2>Hello {{customer_name}},</h2><p>You left items worth <b>₹{{cart_total}}</b> in your shopping cart.</p><p>Use coupon code <b>{{coupon_code}}</b> at checkout to save extra!</p>',
    body_text: 'Hello {{customer_name}}, items worth ₹{{cart_total}} are waiting in your cart. Use code {{coupon_code}} for extra savings!',
    variables_json: ['customer_name', 'cart_total', 'coupon_code'],
    status: 'active'
  },
  {
    id: 'tmpl-email-order-shipped',
    name: 'Order Express Shipment Tracking',
    subject: '📦 Order #{{order_number}} Dispatched via {{courier_name}}',
    body_html: '<h2>Hello {{customer_name}},</h2><p>Great news! Order #{{order_number}} is on its way. Track your package with AWB: <b>{{tracking_number}}</b>.</p>',
    body_text: 'Hello {{customer_name}}, Order #{{order_number}} dispatched via {{courier_name}}. Tracking: {{tracking_number}}.',
    variables_json: ['customer_name', 'order_number', 'courier_name', 'tracking_number'],
    status: 'active'
  }
];

const SEED_WHATSAPP_TEMPLATES = [
  {
    id: 'tmpl-wa-01',
    name: 'Order Dispatch Tracking WhatsApp',
    template_identifier: 'autozon_order_shipped_v1',
    category: 'UTILITY',
    language: 'en_US',
    variables_json: ['customer_name', 'order_number', 'tracking_number'],
    status: 'APPROVED'
  }
];

const SEED_CAMPAIGNS = [
  {
    id: 'camp-01',
    name: 'Monsoon Spare Parts Discount Campaign',
    description: 'Broadcast 15% discount on wiper blades and fog lights to Repeat Buyers',
    segment_id: 'seg-repeat',
    channel: 'email',
    status: 'completed',
    scheduled_at: '2026-09-01T10:00:00Z',
    created_at: '2026-09-01T08:00:00Z'
  }
];
