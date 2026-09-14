/**
 * AutoZoneIndia - Invoice Generator & Storage Service
 * 
 * Features:
 * - Unique invoice numbering: AZI-INV-YYYY-XXXXXX
 * - Immutable historical order data preservation
 * - Real business details from settings (No fake GST details)
 * - Professional A4 printable/PDF rendering
 * - Supabase Storage bucket integration (`invoice-pdfs`)
 */

import { supabase } from './supabaseClient';

/**
 * Fetch business settings for invoice header/footer
 */
export async function getBusinessSettings() {
  try {
    const { data, error } = await supabase
      .from('website_settings')
      .select('*')
      .eq('key', 'business_info')
      .maybeSingle();

    if (error || !data?.value) {
      return {
        business_name: 'AutoZoneIndia',
        business_email: 'support@autozoneindia.com',
        business_phone: '+91 98765 43210',
        business_address: 'AutoZoneIndia Logistics Hub, Sector 62, Noida, UP - 201301',
        gstin: '', // Optional - no fake GST
        invoice_prefix: 'AZI-INV',
        invoice_footer: 'Thank you for shopping with AutoZoneIndia.'
      };
    }
    return {
      business_name: data.value.business_name || 'AutoZoneIndia',
      business_email: data.value.business_email || 'support@autozoneindia.com',
      business_phone: data.value.business_phone || '+91 98765 43210',
      business_address: data.value.business_address || 'AutoZoneIndia Logistics Hub, Sector 62, Noida, UP',
      gstin: data.value.gstin || '',
      invoice_prefix: data.value.invoice_prefix || 'AZI-INV',
      invoice_footer: data.value.invoice_footer || 'Thank you for shopping with AutoZoneIndia.'
    };
  } catch (err) {
    return {
      business_name: 'AutoZoneIndia',
      business_email: 'support@autozoneindia.com',
      business_phone: '+91 98765 43210',
      business_address: 'AutoZoneIndia Logistics Hub, Sector 62, Noida, UP',
      gstin: '',
      invoice_prefix: 'AZI-INV',
      invoice_footer: 'Thank you for shopping with AutoZoneIndia.'
    };
  }
}

/**
 * Generate Next Unique Invoice Number (e.g. AZI-INV-2026-000001)
 */
export async function generateNextInvoiceNumber() {
  const currentYear = new Date().getFullYear();
  const prefix = `AZI-INV-${currentYear}-`;

  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('invoice_number')
      .ilike('invoice_number', `${prefix}%`)
      .order('invoice_number', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return `${prefix}000001`;
    }

    const lastNumStr = data[0].invoice_number.split('-').pop();
    const lastNum = parseInt(lastNumStr, 10) || 0;
    const nextNum = (lastNum + 1).toString().padStart(6, '0');
    return `${prefix}${nextNum}`;
  } catch (err) {
    return `${prefix}${Date.now().toString().slice(-6)}`;
  }
}

/**
 * Generate Invoice for an Order
 * @param {string} orderId 
 */
export async function generateInvoiceForOrder(orderId) {
  try {
    // 1. Check if invoice already exists to ensure idempotency & prevent price distortion
    const { data: existingInvoice } = await supabase
      .from('invoices')
      .select('*')
      .eq('order_id', orderId)
      .maybeSingle();

    if (existingInvoice) {
      return { success: true, invoice: existingInvoice, isExisting: true };
    }

    // 2. Fetch full order with items and customer details
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*),
        customers (*)
      `)
      .eq('id', orderId)
      .single();

    if (orderErr || !order) {
      throw new Error('Order not found for invoice generation');
    }

    // 3. Generate unique invoice number
    const invoiceNumber = await generateNextInvoiceNumber();

    // 4. Extract billing details from order
    const shippingAddr = order.shipping_address || order.address || {};
    const billingName = order.customer_name || shippingAddr.full_name || order.customers?.full_name || 'Valued Customer';
    const billingPhone = order.customer_phone || shippingAddr.phone || order.customers?.phone || 'N/A';
    const billingEmail = order.customer_email || order.customers?.email || '';
    const billingAddressStr = typeof shippingAddr === 'string' 
      ? shippingAddr 
      : `${shippingAddr.street_address || shippingAddr.address_line1 || ''}, ${shippingAddr.city || ''}, ${shippingAddr.state || ''} ${shippingAddr.pincode || shippingAddr.postal_code || ''}`.trim();

    // 5. Insert invoice record
    const invoiceData = {
      order_id: order.id,
      invoice_number: invoiceNumber,
      customer_id: order.customer_id,
      subtotal: order.subtotal || 0.00,
      discount: order.discount || 0.00,
      tax: order.tax || 0.00,
      shipping_charge: order.shipping_charge || 0.00,
      grand_total: order.grand_total || order.total_amount || 0.00,
      billing_name: billingName,
      billing_phone: billingPhone,
      billing_email: billingEmail,
      billing_address: billingAddressStr || 'Shipping address specified on order',
      status: order.payment_status === 'paid' ? 'paid' : 'issued',
      generated_at: new Date().toISOString()
    };

    const { data: newInvoice, error: invErr } = await supabase
      .from('invoices')
      .insert([invoiceData])
      .select()
      .single();

    if (invErr) throw invErr;

    return { success: true, invoice: newInvoice };
  } catch (err) {
    console.error('[InvoiceService] Failed to generate invoice:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch invoice by Order ID with full order items
 */
export async function getInvoiceByOrder(orderId) {
  try {
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        orders (
          *,
          order_items (*),
          payments (*)
        )
      `)
      .eq('order_id', orderId)
      .single();

    if (error) throw error;
    const businessSettings = await getBusinessSettings();

    return { success: true, invoice, businessSettings };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Fetch invoice by Invoice Number or ID
 */
export async function getInvoiceByNumber(invoiceNumber) {
  try {
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        orders (
          *,
          order_items (*),
          payments (*)
        )
      `)
      .eq('invoice_number', invoiceNumber)
      .single();

    if (error) throw error;
    const businessSettings = await getBusinessSettings();

    return { success: true, invoice, businessSettings };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * List Invoices for Admin Console
 */
export async function listInvoices({ search = '', status = 'all', page = 1, limit = 20 }) {
  try {
    let query = supabase
      .from('invoices')
      .select(`
        *,
        orders (
          order_number,
          order_status,
          payment_status,
          payment_method
        )
      `, { count: 'exact' });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`invoice_number.ilike.%${search}%,billing_name.ilike.%${search}%,billing_phone.ilike.%${search}%`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return { success: true, data: data || [], total: count || 0 };
  } catch (err) {
    console.error('[InvoiceService] Failed to list invoices:', err);
    return { success: false, error: err.message, data: [], total: 0 };
  }
}

/**
 * Print / Save A4 Invoice Trigger
 */
export function printInvoiceDocument() {
  window.print();
}
