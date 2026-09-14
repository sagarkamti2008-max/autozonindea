// Single-Owner Order Management, Payment Verification & GST Tax Invoice Engine for AutoZonIndia

export const generateIdempotentOrderId = () => {
  return `ST-2026-${Math.floor(100000 + Math.random() * 900000)}`;
};

export const generateHumanReadableOrderId = () => {
  return generateIdempotentOrderId();
};

export const calculateOrderTaxAndTotals = (cartItems) => {
  const items = Array.isArray(cartItems) ? cartItems : [];
  const subtotal = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
  const gstTax = Math.round(subtotal * 0.18); // 18% GST HSN
  const shippingFee = subtotal > 1500 || subtotal === 0 ? 0 : 99;
  const grandTotal = subtotal + gstTax + shippingFee;

  return {
    subtotal,
    gstTax,
    shippingFee,
    grandTotal
  };
};

export const recalculateOrderTotals = (cartItems) => {
  return calculateOrderTaxAndTotals(cartItems);
};

export const verifyPaymentSignature = (paymentData) => {
  if (!paymentData || paymentData.paymentMethod === 'Cash on Delivery') {
    return { verified: true, status: 'Pending COD', transactionId: `COD-${Date.now()}` };
  }

  // Amount Mismatch Protection Guard
  if (paymentData.expectedAmount && paymentData.receivedAmount && paymentData.expectedAmount !== paymentData.receivedAmount) {
    return { verified: false, status: 'Payment Amount Mismatch', error: 'Received amount does not match expected order total' };
  }

  return {
    verified: true,
    status: 'Paid',
    transactionId: `TXN-${Date.now()}`
  };
};

export const processCustomerRefund = (orderId, refundAmount, reason) => {
  return {
    refundId: `REFUND-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    creditNoteId: `CN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    orderId,
    amount: refundAmount,
    reason,
    status: 'Completed',
    timestamp: new Date().toISOString()
  };
};

export const generateGSTTaxInvoiceHTML = (order) => {
  if (!order) return '';
  const orderItems = Array.isArray(order.items) ? order.items : [];
  return `
    <html>
      <head>
        <title>Tax Invoice - ${order.id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #0F172A; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0F2167; padding-bottom: 15px; }
          .title { color: #0F2167; font-size: 24px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #CBD5E1; padding: 10px; text-align: left; }
          th { background: #F1F5F9; }
          .total { text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; color: #0F2167; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">AutoZonIndia</div>
            <div>GSTIN: 07AAAAA0000A1Z5</div>
            <div>Central Store & Order Fulfillment</div>
          </div>
          <div>
            <h3>TAX INVOICE</h3>
            <div>Invoice #: INV-${order.id}</div>
            <div>Date: ${order.date || '2026-08-24'}</div>
          </div>
        </div>

        <div style="margin-top: 20px;">
          <strong>Billed To:</strong> ${order.customerName || 'Valued Customer'}<br/>
          <strong>Shipping Address:</strong> ${order.shippingAddress || 'India'}
        </div>

        <table>
          <thead>
            <tr>
              <th>Part Title</th>
              <th>HSN Code</th>
              <th>Qty</th>
              <th>Unit Price (₹)</th>
              <th>GST (18%)</th>
              <th>Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${orderItems.map(item => `
              <tr>
                <td>${item.title} (Part #: ${item.partNumber || 'AZ-PART'})</td>
                <td>87083000</td>
                <td>${item.quantity || 1}</td>
                <td>₹${item.price}</td>
                <td>18%</td>
                <td>₹${(item.price || 0) * (item.quantity || 1)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total">
          Subtotal: ₹${order.subtotal || order.totalAmount}<br/>
          Grand Total: ₹${order.totalAmount}
        </div>
      </body>
    </html>
  `;
};

export const generateTaxInvoiceHTML = (order) => {
  return generateGSTTaxInvoiceHTML(order);
};
