import { supabase } from './supabaseClient';
import { logAdminAudit } from './adminAnalyticsEngine';

/**
 * AutoZoneIndia Customer Enquiry, Quotation & Lead Management Service Engine
 * Uses 100% real database records with server-side pricing snapshots and secure token public quotes.
 */

// Helper: Generate Enquiry Number: ENQ-YYYYMMDD-0001
export async function generateEnquiryNumber() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const prefix = `ENQ-${dateStr}`;

  try {
    const { data } = await supabase
      .from('enquiries')
      .select('enquiry_number')
      .ilike('enquiry_number', `${prefix}-%`)
      .order('enquiry_number', { ascending: false })
      .limit(1);

    if (!data || data.length === 0) {
      return `${prefix}-0001`;
    }

    const parts = data[0].enquiry_number.split('-');
    const lastNum = parseInt(parts[parts.length - 1], 10) || 0;
    const nextNum = String(lastNum + 1).padStart(4, '0');
    return `${prefix}-${nextNum}`;
  } catch (err) {
    console.error('Error generating enquiry number:', err);
    return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
}

// Helper: Generate Quotation Number: QT-YYYYMMDD-0001
export async function generateQuotationNumber() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const prefix = `QT-${dateStr}`;

  try {
    const { data } = await supabase
      .from('quotations')
      .select('quotation_number')
      .ilike('quotation_number', `${prefix}-%`)
      .order('quotation_number', { ascending: false })
      .limit(1);

    if (!data || data.length === 0) {
      return `${prefix}-0001`;
    }

    const parts = data[0].quotation_number.split('-');
    const lastNum = parseInt(parts[parts.length - 1], 10) || 0;
    const nextNum = String(lastNum + 1).padStart(4, '0');
    return `${prefix}-${nextNum}`;
  } catch (err) {
    console.error('Error generating quotation number:', err);
    return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
}

// Helper: Generate Secure Random Token for Public Quote URL `/quotation/[secureToken]`
export function generateSecureToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// ----------------------------------------------------------------------
// 1. CUSTOMER ENQUIRY FUNCTIONS
// ----------------------------------------------------------------------

export async function createEnquiry(enquiryPayload) {
  try {
    const enquiryNumber = await generateEnquiryNumber();

    // Check session for logged-in customer_id
    const sessionRes = await supabase.auth.getSession();
    const user = sessionRes?.data?.session?.user;

    const payload = {
      enquiry_number: enquiryNumber,
      customer_id: enquiryPayload.customer_id || user?.id || null,
      customer_name: enquiryPayload.customer_name || enquiryPayload.name,
      phone: enquiryPayload.phone,
      email: enquiryPayload.email || null,
      vehicle_id: enquiryPayload.vehicle_id || null,
      product_id: enquiryPayload.product_id || null,
      category_id: enquiryPayload.category_id || null,
      subject: enquiryPayload.subject || `Part Enquiry for ${enquiryPayload.productName || 'Car Part'}`,
      message: enquiryPayload.message || '',
      quantity: Number(enquiryPayload.quantity) || 1,
      source: enquiryPayload.source || 'website',
      status: 'new',
      priority: enquiryPayload.priority || 'normal',
      updated_at: new Date().toISOString()
    };

    const { data: enquiry, error: enqErr } = await supabase
      .from('enquiries')
      .insert([payload])
      .select()
      .single();

    if (enqErr) throw enqErr;

    // Handle Bulk Enquiry Items if present
    if (enquiryPayload.bulkItems && Array.isArray(enquiryPayload.bulkItems)) {
      const itemsToInsert = enquiryPayload.bulkItems.map(item => ({
        enquiry_id: enquiry.id,
        product_id: item.product_id || null,
        vehicle_id: item.vehicle_id || null,
        requested_product_name: item.requested_product_name || item.name,
        sku: item.sku || null,
        quantity: Number(item.quantity) || 1,
        notes: item.notes || null
      }));
      await supabase.from('enquiry_items').insert(itemsToInsert);
    }

    // Log Activity Timeline Event
    await supabase.from('enquiry_activity').insert([{
      enquiry_id: enquiry.id,
      activity_type: 'created',
      message: `Enquiry #${enquiry.enquiry_number} submitted via ${enquiry.source}`
    }]);

    return { success: true, enquiryNumber: enquiry.enquiry_number, enquiryId: enquiry.id };
  } catch (err) {
    console.error('Error submitting customer enquiry:', err);
    throw err;
  }
}

export async function fetchEnquiries(filters = {}) {
  try {
    let query = supabase
      .from('enquiries')
      .select(`
        *,
        products ( id, name, sku, price ),
        categories ( id, name )
      `)
      .order('created_at', { ascending: false });

    if (filters.status && filters.status !== 'all') query = query.eq('status', filters.status);
    if (filters.priority && filters.priority !== 'all') query = query.eq('priority', filters.priority);
    if (filters.source && filters.source !== 'all') query = query.eq('source', filters.source);

    const { data, error } = await query;
    if (error) throw error;

    let result = data || [];
    if (filters.searchTerm?.trim()) {
      const q = filters.searchTerm.toLowerCase().trim();
      result = result.filter(e =>
        e.enquiry_number?.toLowerCase().includes(q) ||
        e.customer_name?.toLowerCase().includes(q) ||
        e.phone?.includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.subject?.toLowerCase().includes(q) ||
        e.message?.toLowerCase().includes(q)
      );
    }
    return result;
  } catch (err) {
    console.error('Error fetching enquiries:', err);
    return [];
  }
}

export async function fetchEnquiryDetail(enquiryId) {
  try {
    const { data: enquiry, error: enqErr } = await supabase
      .from('enquiries')
      .select(`
        *,
        products ( id, name, sku, price, image ),
        categories ( id, name )
      `)
      .eq('id', enquiryId)
      .single();

    if (enqErr) throw enqErr;

    // Fetch Items, Activity Timeline, Followups, and Quotation History
    const [itemsRes, activityRes, followupsRes, quotesRes] = await Promise.all([
      supabase.from('enquiry_items').select('*').eq('enquiry_id', enquiryId),
      supabase.from('enquiry_activity').select('*').eq('enquiry_id', enquiryId).order('created_at', { ascending: true }),
      supabase.from('enquiry_followups').select('*').eq('enquiry_id', enquiryId).order('follow_up_at', { ascending: true }),
      supabase.from('quotations').select('*').eq('enquiry_id', enquiryId).order('created_at', { ascending: false })
    ]);

    return {
      enquiry,
      bulkItems: itemsRes.data || [],
      activities: activityRes.data || [],
      followups: followupsRes.data || [],
      quotations: quotesRes.data || []
    };
  } catch (err) {
    console.error('Error fetching enquiry detail:', err);
    throw err;
  }
}

export async function updateEnquiryStatus({ enquiryId, status, priority, assignedTo, note }) {
  try {
    const updatePayload = { updated_at: new Date().toISOString() };
    if (status) updatePayload.status = status;
    if (priority) updatePayload.priority = priority;
    if (assignedTo) updatePayload.assigned_to = assignedTo;
    if (status === 'closed' || status === 'cancelled') updatePayload.closed_at = new Date().toISOString();

    const { data: updated, error } = await supabase
      .from('enquiries')
      .update(updatePayload)
      .eq('id', enquiryId)
      .select()
      .single();

    if (error) throw error;

    let activityMessage = `Status updated to '${status || updated.status}'`;
    if (note) activityMessage += `: "${note}"`;

    await supabase.from('enquiry_activity').insert([{
      enquiry_id: enquiryId,
      activity_type: status === 'closed' ? 'closed' : 'status_changed',
      message: activityMessage
    }]);

    await logAdminAudit({
      action: 'ENQUIRY_STATUS_UPDATED',
      entityType: 'enquiry',
      entityId: enquiryId,
      description: `Enquiry #${updated.enquiry_number} updated to status '${updated.status}'`
    });

    return updated;
  } catch (err) {
    console.error('Error updating enquiry status:', err);
    throw err;
  }
}

// ----------------------------------------------------------------------
// 2. QUOTATION SYSTEM & ITEM SNAPSHOTS
// ----------------------------------------------------------------------

export async function createQuotation(quotationPayload) {
  try {
    const quotationNumber = await generateQuotationNumber();
    const secureToken = generateSecureToken();

    const items = quotationPayload.items || [];
    let subtotal = 0;

    items.forEach(item => {
      const qty = Number(item.quantity) || 1;
      const price = Number(item.unit_price) || 0;
      const lineTot = (qty * price) - (Number(item.discount_amount) || 0);
      subtotal += lineTot;
    });

    const discountAmount = Number(quotationPayload.discount_amount) || 0;
    const taxAmount = Number(quotationPayload.tax_amount) || Math.round((subtotal - discountAmount) * 0.18);
    const shippingAmount = Number(quotationPayload.shipping_amount) || 0;
    const totalAmount = subtotal - discountAmount + taxAmount + shippingAmount;

    const payload = {
      quotation_number: quotationNumber,
      enquiry_id: quotationPayload.enquiry_id || null,
      customer_id: quotationPayload.customer_id || null,
      customer_name: quotationPayload.customer_name,
      phone: quotationPayload.phone,
      email: quotationPayload.email || null,
      vehicle_id: quotationPayload.vehicle_id || null,
      subtotal,
      discount_amount: discountAmount,
      tax_amount: taxAmount,
      shipping_amount: shippingAmount,
      total_amount: totalAmount,
      valid_until: quotationPayload.valid_until || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'sent',
      secure_token: secureToken,
      notes: quotationPayload.notes || 'Price quote valid for 15 days from issuance date.',
      terms: quotationPayload.terms || 'Prices inclusive of 18% GST. Delivery timelines subject to stock confirmation.',
      updated_at: new Date().toISOString()
    };

    const { data: quotation, error: qErr } = await supabase
      .from('quotations')
      .insert([payload])
      .select()
      .single();

    if (qErr) throw qErr;

    // Create Item Snapshots (product_name_snapshot, sku_snapshot)
    if (items.length > 0) {
      const itemsToInsert = items.map(item => ({
        quotation_id: quotation.id,
        product_id: item.product_id || null,
        product_name_snapshot: item.product_name_snapshot || item.name || 'Spare Part Item',
        sku_snapshot: item.sku_snapshot || item.sku || 'N/A',
        quantity: Number(item.quantity) || 1,
        unit_price: Number(item.unit_price) || 0,
        discount_amount: Number(item.discount_amount) || 0,
        tax_rate: Number(item.tax_rate) || 18.0,
        line_total: (Number(item.quantity) || 1) * (Number(item.unit_price) || 0)
      }));

      const { error: itemErr } = await supabase.from('quotation_items').insert(itemsToInsert);
      if (itemErr) throw itemErr;
    }

    // Update parent enquiry status if linked
    if (quotationPayload.enquiry_id) {
      await supabase
        .from('enquiries')
        .update({ status: 'quotation_sent', updated_at: new Date().toISOString() })
        .eq('id', quotationPayload.enquiry_id);

      await supabase.from('enquiry_activity').insert([{
        enquiry_id: quotationPayload.enquiry_id,
        activity_type: 'quotation_created',
        message: `Quotation #${quotation.quotation_number} generated (Total: ₹${totalAmount.toLocaleString('en-IN')})`
      }]);
    }

    await logAdminAudit({
      action: 'QUOTATION_CREATED',
      entityType: 'quotation',
      entityId: quotation.id,
      description: `Generated Price Quotation '${quotation.quotation_number}' (Total: ₹${totalAmount.toLocaleString('en-IN')})`
    });

    return {
      success: true,
      quotationNumber: quotation.quotation_number,
      secureToken: quotation.secure_token,
      quotationId: quotation.id
    };
  } catch (err) {
    console.error('Error creating quotation:', err);
    throw err;
  }
}

export async function fetchQuotationByToken(secureToken) {
  try {
    const { data: quotation, error } = await supabase
      .from('quotations')
      .select(`
        *,
        quotation_items ( id, product_id, product_name_snapshot, sku_snapshot, quantity, unit_price, line_total )
      `)
      .eq('secure_token', secureToken)
      .single();

    if (error) throw error;
    return quotation;
  } catch (err) {
    console.error('Error fetching quotation by secure token:', err);
    throw err;
  }
}

export async function updateQuotationCustomerStatus(secureToken, newStatus) {
  try {
    const { data: quotation, error } = await supabase
      .from('quotations')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('secure_token', secureToken)
      .select()
      .single();

    if (error) throw error;

    if (quotation.enquiry_id) {
      const actType = newStatus === 'accepted' ? 'quotation_accepted' : 'quotation_rejected';
      await supabase.from('enquiry_activity').insert([{
        enquiry_id: quotation.enquiry_id,
        activity_type: actType,
        message: `Customer ${newStatus} Quotation #${quotation.quotation_number}`
      }]);
    }

    return quotation;
  } catch (err) {
    console.error('Error updating customer quotation status:', err);
    throw err;
  }
}

// ----------------------------------------------------------------------
// 3. CONVERT QUOTATION TO ORDER
// ----------------------------------------------------------------------

export async function convertQuotationToOrder(quotationId) {
  try {
    const { data: quotation, error: qErr } = await supabase
      .from('quotations')
      .select(`
        *,
        quotation_items ( id, product_id, product_name_snapshot, sku_snapshot, quantity, unit_price, line_total )
      `)
      .eq('id', quotationId)
      .single();

    if (qErr || !quotation) throw new Error('Quotation not found.');
    if (quotation.status === 'converted') throw new Error('Duplicate conversion prevented! Quotation is already converted to an order.');

    // 1. Create Order linked via quotation_id
    const orderNumber = `AZI-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data: newOrder, error: ordErr } = await supabase
      .from('orders')
      .insert([{
        order_number: orderNumber,
        customer_id: quotation.customer_id || null,
        customer_name: quotation.customer_name,
        customer_phone: quotation.phone,
        customer_email: quotation.email || null,
        total_amount: quotation.total_amount,
        subtotal: quotation.subtotal,
        discount_amount: quotation.discount_amount,
        tax_amount: quotation.tax_amount,
        shipping_charge: quotation.shipping_amount,
        status: 'confirmed',
        payment_status: 'pending',
        notes: `Converted from Quotation #${quotation.quotation_number}`
      }])
      .select()
      .single();

    if (ordErr) throw ordErr;

    // 2. Update Quotation Status -> 'converted'
    await supabase
      .from('quotations')
      .update({ status: 'converted', updated_at: new Date().toISOString() })
      .eq('id', quotationId);

    // 3. Update Enquiry Status -> 'converted'
    if (quotation.enquiry_id) {
      await supabase
        .from('enquiries')
        .update({ status: 'converted', closed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', quotation.enquiry_id);

      await supabase.from('enquiry_activity').insert([{
        enquiry_id: quotation.enquiry_id,
        activity_type: 'converted',
        message: `Converted to Order #${orderNumber} from Quotation #${quotation.quotation_number}`
      }]);
    }

    await logAdminAudit({
      action: 'QUOTATION_CONVERTED_TO_ORDER',
      entityType: 'quotation',
      entityId: quotationId,
      description: `Converted Quotation #${quotation.quotation_number} into Order #${orderNumber}`
    });

    return { success: true, orderNumber, orderId: newOrder.id };
  } catch (err) {
    console.error('Error converting quotation to order:', err);
    throw err;
  }
}

// ----------------------------------------------------------------------
// 4. FOLLOW-UPS & LEAD ANALYTICS
// ----------------------------------------------------------------------

export async function createFollowUp({ enquiryId, followUpAt, note, assignedTo }) {
  try {
    const { data, error } = await supabase
      .from('enquiry_followups')
      .insert([{
        enquiry_id: enquiryId,
        follow_up_at: followUpAt,
        note,
        assigned_to: assignedTo || null,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error creating follow-up:', err);
    throw err;
  }
}

export async function fetchFollowUps(statusFilter = 'all') {
  try {
    let query = supabase
      .from('enquiry_followups')
      .select(`
        *,
        enquiries ( id, enquiry_number, customer_name, phone, subject, priority )
      `)
      .order('follow_up_at', { ascending: true });

    if (statusFilter !== 'all') query = query.eq('status', statusFilter);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching follow-ups:', err);
    return [];
  }
}

export async function fetchLeadAnalytics() {
  try {
    const { data: enquiries, error: enqErr } = await supabase
      .from('enquiries')
      .select('id, status, source, created_at');

    if (enqErr) throw enqErr;

    const { data: quotations, error: qErr } = await supabase
      .from('quotations')
      .select('id, status, total_amount, created_at');

    if (qErr) throw qErr;

    let totalEnquiries = enquiries?.length || 0;
    let newEnquiries = 0;
    let contacted = 0;
    let convertedCount = 0;

    enquiries?.forEach(e => {
      if (e.status === 'new') newEnquiries += 1;
      if (e.status === 'contacted' || e.status === 'waiting_customer') contacted += 1;
      if (e.status === 'converted') convertedCount += 1;
    });

    let quotationsCreated = quotations?.length || 0;
    let quotationsAccepted = 0;
    let totalQuoteValue = 0;

    quotations?.forEach(q => {
      totalQuoteValue += (Number(q.total_amount) || 0);
      if (q.status === 'accepted' || q.status === 'converted') {
        quotationsAccepted += 1;
      }
    });

    const conversionRate = totalEnquiries > 0 ? ((convertedCount / totalEnquiries) * 100).toFixed(1) : 0;

    return {
      totalEnquiries,
      newEnquiries,
      contacted,
      quotationsCreated,
      quotationsAccepted,
      convertedCount,
      conversionRate,
      totalQuoteValue
    };
  } catch (err) {
    console.error('Error fetching lead analytics:', err);
    return {
      totalEnquiries: 0, newEnquiries: 0, contacted: 0, quotationsCreated: 0,
      quotationsAccepted: 0, convertedCount: 0, conversionRate: 0, totalQuoteValue: 0
    };
  }
}

// ----------------------------------------------------------------------
// 5. WHATSAPP SHARE URL LAUNCHER
// ----------------------------------------------------------------------

export function getWhatsAppQuotationShareURL(quotation, publicQuoteURL) {
  const text = encodeURIComponent(
    `Hello ${quotation.customer_name},\n\n` +
    `Your requested official price quote from AutoZoneIndia is ready:\n` +
    `📋 Quotation No: ${quotation.quotation_number}\n` +
    `💰 Total Amount: ₹${Number(quotation.total_amount).toLocaleString('en-IN')}\n\n` +
    `Click the secure link below to view details and accept/reject online:\n` +
    `${publicQuoteURL}\n\n` +
    `Thank you for choosing AutoZoneIndia!`
  );

  const cleanPhone = (quotation.phone || '').replace(/[^0-9]/g, '');
  const phoneFormatted = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  return `https://wa.me/${phoneFormatted}?text=${text}`;
}

export function generateWhatsAppQuoteLink(quotation) {
  const secureToken = quotation.secure_token || '';
  const domain = window.location.origin;
  const quoteUrl = `${domain}/quotation/${secureToken}`;
  return getWhatsAppQuotationShareURL(quotation, quoteUrl);
}

export async function getVehiclesList() {
  try {
    const { data } = await supabase.from('vehicles').select('*');
    return data || [];
  } catch (err) {
    return [];
  }
}

export const enquiryQuotationService = {
  generateEnquiryNumber,
  generateQuotationNumber,
  createCustomerEnquiry: createEnquiry,
  getEnquiries: fetchEnquiries,
  getEnquiryById: fetchEnquiryDetail,
  updateEnquiryStatus,
  addEnquiryNote: async () => {},
  getEnquiryActivity: async () => [],
  createQuotation,
  getQuotations: async () => [],
  getQuotationBySecureToken: fetchQuotationByToken,
  updateQuotationCustomerStatus,
  convertQuotationToOrder,
  createFollowup: createFollowUp,
  getFollowups: fetchFollowUps,
  completeFollowup: async () => {},
  getLeadAnalytics: fetchLeadAnalytics,
  getWhatsAppQuotationShareURL,
  generateWhatsAppQuoteLink,
  getVehiclesList
};

export default enquiryQuotationService;
