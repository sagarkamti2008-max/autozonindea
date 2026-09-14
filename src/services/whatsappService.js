/**
 * AutoZoneIndia - WhatsApp Notification System
 * 
 * Provider-Independent Architecture:
 * - Meta WhatsApp Business API
 * - Twilio / Gupshup / Custom WhatsApp Gateways
 * - Mock Local Provider (Default for development)
 * 
 * Features:
 * - Non-blocking order execution (Order succeeds even if notification fails)
 * - Safe notification event logging (`notification_logs`)
 * - Admin notification retry mechanism
 * - Secure environment variable token handling
 */

import { supabase } from './supabaseClient';

const WA_CONFIG = {
  provider: import.meta.env.VITE_WHATSAPP_PROVIDER || 'mock_whatsapp',
  apiUrl: import.meta.env.WHATSAPP_API_URL || '',
  accessToken: import.meta.env.WHATSAPP_ACCESS_TOKEN || '',
  phoneNumberId: import.meta.env.WHATSAPP_PHONE_NUMBER_ID || '',
  supportNumber: import.meta.env.VITE_WHATSAPP_SUPPORT_NUMBER || '+91 98765 43210'
};

export const NOTIFICATION_EVENTS = {
  ORDER_CREATED: 'ORDER_CREATED',
  PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
  ORDER_CONFIRMED: 'ORDER_CONFIRMED',
  ORDER_SHIPPED: 'ORDER_SHIPPED',
  ORDER_OUT_FOR_DELIVERY: 'ORDER_OUT_FOR_DELIVERY',
  ORDER_DELIVERED: 'ORDER_DELIVERED',
  ORDER_CANCELLED: 'ORDER_CANCELLED',
  INVOICE_READY: 'INVOICE_READY'
};

/**
 * Message Templates
 */
export function buildWhatsAppTemplate(eventType, orderData) {
  const { orderNumber, totalAmount, trackingNumber, invoiceUrl } = orderData;
  const formattedAmount = totalAmount ? `₹${parseFloat(totalAmount).toLocaleString('en-IN')}` : '';

  switch (eventType) {
    case NOTIFICATION_EVENTS.ORDER_CREATED:
      return `Hi! Your AutoZoneIndia order ${orderNumber} for ${formattedAmount} has been placed successfully. Track order: ${window.location.origin}/account/orders/${orderNumber}`;

    case NOTIFICATION_EVENTS.PAYMENT_SUCCESS:
      return `Payment Received! We have confirmed payment of ${formattedAmount} for AutoZoneIndia order ${orderNumber}. Thank you!`;

    case NOTIFICATION_EVENTS.ORDER_CONFIRMED:
      return `Your AutoZoneIndia order ${orderNumber} has been confirmed and is being processed for dispatch.`;

    case NOTIFICATION_EVENTS.ORDER_SHIPPED:
      return `Your AutoZoneIndia order ${orderNumber} has been shipped! ${trackingNumber ? `Tracking ID: ${trackingNumber}` : ''} Track status: ${window.location.origin}/account/orders/${orderNumber}`;

    case NOTIFICATION_EVENTS.ORDER_OUT_FOR_DELIVERY:
      return `Out for Delivery! Your AutoZoneIndia order ${orderNumber} will be delivered today by our courier partner.`;

    case NOTIFICATION_EVENTS.ORDER_DELIVERED:
      return `Delivered! Your AutoZoneIndia order ${orderNumber} has been delivered successfully. Thank you for shopping with us!`;

    case NOTIFICATION_EVENTS.ORDER_CANCELLED:
      return `Your AutoZoneIndia order ${orderNumber} has been cancelled. If you have questions, please reach us on WhatsApp.`;

    case NOTIFICATION_EVENTS.INVOICE_READY:
      return `Your tax invoice for AutoZoneIndia order ${orderNumber} is ready. View/Download: ${window.location.origin}/account/orders/${orderNumber}/invoice`;

    default:
      return `Update on your AutoZoneIndia order ${orderNumber}. Status: ${orderData.status || 'Updated'}`;
  }
}

/**
 * Send WhatsApp Notification (Provider Independent Dispatcher)
 */
export async function sendWhatsAppNotification({ orderId, customerId, recipient, eventType, orderData }) {
  if (!recipient) {
    console.warn('[WhatsAppService] No recipient phone number provided');
    return { success: false, error: 'Recipient phone missing' };
  }

  const messageText = buildWhatsAppTemplate(eventType, orderData);
  let status = 'sent';
  let providerMessageId = `wam_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  let errorMessage = null;

  try {
    if (WA_CONFIG.provider === 'meta_whatsapp' && WA_CONFIG.accessToken) {
      // Production Meta WhatsApp Cloud API call
      const res = await fetch(`${WA_CONFIG.apiUrl}/${WA_CONFIG.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WA_CONFIG.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: recipient.replace(/[^0-9]/g, ''),
          type: 'text',
          text: { body: messageText }
        })
      });

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData?.error?.message || 'Meta WhatsApp API request failed');
      }
      providerMessageId = responseData?.messages?.[0]?.id || providerMessageId;
    } else {
      // Development / Mock Provider Logging
      console.log(`[WhatsAppService] [${WA_CONFIG.provider.toUpperCase()}] Event: ${eventType} -> Sent to ${recipient}: "${messageText}"`);
    }
  } catch (err) {
    console.error(`[WhatsAppService] Failed sending ${eventType} to ${recipient}:`, err.message);
    status = 'failed';
    errorMessage = err.message;
  }

  // Record notification log in database
  try {
    await supabase.from('notification_logs').insert([{
      order_id: orderId,
      customer_id: customerId,
      channel: 'whatsapp',
      event_type: eventType,
      recipient: recipient,
      provider: WA_CONFIG.provider,
      status: status,
      provider_message_id: providerMessageId,
      error_message: errorMessage,
      sent_at: status === 'sent' ? new Date().toISOString() : null,
      created_at: new Date().toISOString()
    }]);
  } catch (logErr) {
    console.error('[WhatsAppService] Failed to record notification log:', logErr);
  }

  return { success: status === 'sent', status, messageId: providerMessageId, error: errorMessage };
}

/**
 * Event-Specific Dispatcher Shortcuts
 */
export async function sendOrderCreated(order, customer) {
  return sendWhatsAppNotification({
    orderId: order.id,
    customerId: order.customer_id,
    recipient: order.customer_phone || customer?.phone,
    eventType: NOTIFICATION_EVENTS.ORDER_CREATED,
    orderData: { orderNumber: order.order_number, totalAmount: order.grand_total || order.total_amount }
  });
}

export async function sendPaymentSuccess(order, customer) {
  return sendWhatsAppNotification({
    orderId: order.id,
    customerId: order.customer_id,
    recipient: order.customer_phone || customer?.phone,
    eventType: NOTIFICATION_EVENTS.PAYMENT_SUCCESS,
    orderData: { orderNumber: order.order_number, totalAmount: order.grand_total || order.total_amount }
  });
}

export async function sendOrderConfirmed(order, customer) {
  return sendWhatsAppNotification({
    orderId: order.id,
    customerId: order.customer_id,
    recipient: order.customer_phone || customer?.phone,
    eventType: NOTIFICATION_EVENTS.ORDER_CONFIRMED,
    orderData: { orderNumber: order.order_number }
  });
}

export async function sendOrderShipped(order, customer, trackingNumber) {
  return sendWhatsAppNotification({
    orderId: order.id,
    customerId: order.customer_id,
    recipient: order.customer_phone || customer?.phone,
    eventType: NOTIFICATION_EVENTS.ORDER_SHIPPED,
    orderData: { orderNumber: order.order_number, trackingNumber }
  });
}

export async function sendOutForDelivery(order, customer) {
  return sendWhatsAppNotification({
    orderId: order.id,
    customerId: order.customer_id,
    recipient: order.customer_phone || customer?.phone,
    eventType: NOTIFICATION_EVENTS.ORDER_OUT_FOR_DELIVERY,
    orderData: { orderNumber: order.order_number }
  });
}

export async function sendOrderDelivered(order, customer) {
  return sendWhatsAppNotification({
    orderId: order.id,
    customerId: order.customer_id,
    recipient: order.customer_phone || customer?.phone,
    eventType: NOTIFICATION_EVENTS.ORDER_DELIVERED,
    orderData: { orderNumber: order.order_number }
  });
}

export async function sendOrderCancelled(order, customer) {
  return sendWhatsAppNotification({
    orderId: order.id,
    customerId: order.customer_id,
    recipient: order.customer_phone || customer?.phone,
    eventType: NOTIFICATION_EVENTS.ORDER_CANCELLED,
    orderData: { orderNumber: order.order_number }
  });
}

export async function sendInvoiceReady(order, customer) {
  return sendWhatsAppNotification({
    orderId: order.id,
    customerId: order.customer_id,
    recipient: order.customer_phone || customer?.phone,
    eventType: NOTIFICATION_EVENTS.INVOICE_READY,
    orderData: { orderNumber: order.order_number }
  });
}

/**
 * Admin Notification Retry Service
 */
export async function retryNotification(logId) {
  try {
    const { data: log, error } = await supabase
      .from('notification_logs')
      .select('*, orders(*)')
      .eq('id', logId)
      .single();

    if (error || !log) throw new Error('Notification log entry not found');

    const result = await sendWhatsAppNotification({
      orderId: log.order_id,
      customerId: log.customer_id,
      recipient: log.recipient,
      eventType: log.event_type,
      orderData: {
        orderNumber: log.orders?.order_number || 'N/A',
        totalAmount: log.orders?.grand_total || log.orders?.total_amount
      }
    });

    return result;
  } catch (err) {
    return { success: false, error: err.message };
  }
}
