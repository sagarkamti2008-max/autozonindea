import React, { useState, useEffect } from 'react';
import { getInvoiceByOrder, getInvoiceByNumber, printInvoiceDocument, getBusinessSettings } from '../services/invoiceService';
import { supabase } from '../services/supabaseClient';
import { useStore } from '../context/StoreContext';
import { Download, ArrowLeft, ShieldCheck, Printer, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export default function CustomerInvoiceView() {
  const { navigateTo } = useStore();
  const getOrderNumberFromUrl = () => {
    const parts = window.location.pathname.split('/');
    const idx = parts.indexOf('orders');
    if (idx !== -1 && parts[idx + 1]) {
      return parts[idx + 1];
    }
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('orderNumber') || urlParams.get('order') || 'AZI-2026-0001';
  };
  const orderNumber = getOrderNumberFromUrl();
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState(null);
  const [businessSettings, setBusinessSettings] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInvoiceData();
  }, [orderNumber]);

  const fetchInvoiceData = async () => {
    setLoading(true);
    setError('');

    try {
      // 1. First fetch order record by orderNumber to get order_id
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .select('*, order_items(*), payments(*)')
        .eq('order_number', orderNumber)
        .single();

      if (orderErr || !orderData) {
        // Fallback: try fetching by invoice_number directly
        const invRes = await getInvoiceByNumber(orderNumber);
        if (invRes.success) {
          setInvoice(invRes.invoice);
          setBusinessSettings(invRes.businessSettings);
          setLoading(false);
          return;
        }
        throw new Error(`Order or Invoice #${orderNumber} not found.`);
      }

      // 2. Fetch or auto-generate invoice
      const invRes = await getInvoiceByOrder(orderData.id);
      if (invRes.success && invRes.invoice) {
        setInvoice({ ...invRes.invoice, orders: orderData });
        setBusinessSettings(invRes.businessSettings);
      } else {
        // Auto generate if not exists yet
        const { generateInvoiceForOrder } = await import('../services/invoiceService');
        const genRes = await generateInvoiceForOrder(orderData.id);
        if (genRes.success && genRes.invoice) {
          setInvoice({ ...genRes.invoice, orders: orderData });
        } else {
          // Construct fallback display invoice from order
          setInvoice({
            invoice_number: `AZI-INV-${new Date().getFullYear()}-${orderNumber.split('-').pop() || '000001'}`,
            generated_at: orderData.created_at || new Date().toISOString(),
            billing_name: orderData.customer_name || 'Valued Customer',
            billing_phone: orderData.customer_phone || 'N/A',
            billing_email: orderData.customer_email || '',
            billing_address: typeof orderData.address === 'string' ? orderData.address : JSON.stringify(orderData.address || {}),
            subtotal: orderData.subtotal || 0,
            discount: orderData.discount || 0,
            tax: orderData.tax || 0,
            shipping_charge: orderData.shipping_charge || 0,
            grand_total: orderData.total_amount || 0,
            status: orderData.payment_status === 'paid' ? 'paid' : 'issued',
            orders: orderData
          });
        }
        const bSettings = await getBusinessSettings();
        setBusinessSettings(bSettings);
      }
    } catch (err) {
      console.error('Invoice load error:', err);
      setError(err.message || 'Unable to load invoice document.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">Generating official tax invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center shadow-2xl">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Invoice Unavailable</h2>
          <p className="text-slate-400 text-sm mb-6">{error || 'The requested invoice could not be found.'}</p>
          <button
            onClick={() => navigateTo('orders')}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition cursor-pointer"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const order = invoice.orders || {};
  const items = order.order_items || order.items || [];
  const bInfo = businessSettings || {
    business_name: 'AutoZoneIndia',
    business_email: 'support@autozoneindia.com',
    business_phone: '+91 98765 43210',
    business_address: 'AutoZoneIndia Logistics Hub, Sector 62, Noida, UP',
    invoice_footer: 'Thank you for shopping with AutoZoneIndia.'
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Action Bar (Hidden during window.print()) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center text-slate-400 hover:text-white transition font-medium text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigateTo('orders')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold border border-slate-700 transition cursor-pointer"
          >
            View Order
          </button>
          <button
            onClick={printInvoiceDocument}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition flex items-center shadow-lg shadow-amber-500/20"
          >
            <Printer className="w-4 h-4 mr-2" /> Download / Print Invoice
          </button>
        </div>
      </div>

      {/* A4 Printable Invoice Sheet Container */}
      <div className="max-w-4xl mx-auto bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none print:m-0 print:max-w-none">
        <div className="p-8 sm:p-12 border-b border-slate-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-slate-200">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black tracking-tight text-slate-900">AUTOZONE<span className="text-amber-500">INDIA</span></span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded">TAX INVOICE</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">{bInfo.business_address}</p>
              {bInfo.gstin && (
                <p className="text-xs font-semibold text-slate-700 mt-1">GSTIN: {bInfo.gstin}</p>
              )}
              <p className="text-xs text-slate-500 mt-0.5">Email: {bInfo.business_email} | Phone: {bInfo.business_phone}</p>
            </div>

            <div className="text-left sm:text-right">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">INVOICE</h1>
              <p className="text-sm font-bold text-amber-600 mt-1">{invoice.invoice_number}</p>
              <p className="text-xs text-slate-500 mt-1">
                Date: {new Date(invoice.generated_at || invoice.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Order Ref: <span className="font-semibold text-slate-800">{order.order_number || orderNumber}</span></p>
            </div>
          </div>

          {/* Customer & Billing Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-8 text-sm">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To</h3>
              <p className="font-bold text-slate-900 text-base">{invoice.billing_name}</p>
              <p className="text-slate-600 mt-1 text-xs leading-relaxed max-w-xs">{invoice.billing_address}</p>
              <p className="text-slate-600 mt-1 text-xs">Phone: {invoice.billing_phone}</p>
              {invoice.billing_email && <p className="text-slate-600 text-xs">Email: {invoice.billing_email}</p>}
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Payment Details</h3>
                <div className="flex justify-between items-center text-xs py-1">
                  <span className="text-slate-500">Method:</span>
                  <span className="font-bold text-slate-800 uppercase">{order.payment_method || 'COD'}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1">
                  <span className="text-slate-500">Payment Status:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    (invoice.status === 'paid' || order.payment_status === 'paid')
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {(invoice.status === 'paid' || order.payment_status === 'paid') ? 'PAID' : 'PENDING'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs py-1">
                  <span className="text-slate-500">Order Status:</span>
                  <span className="font-semibold text-slate-800 capitalize">{order.status || order.order_status || 'Confirmed'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto my-8">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Item Description</th>
                  <th className="py-3 px-3 text-center">SKU</th>
                  <th className="py-3 px-3 text-center">Qty</th>
                  <th className="py-3 px-3 text-right">Unit Price</th>
                  <th className="py-3 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {items.length > 0 ? (
                  items.map((item, idx) => {
                    const unitPrice = Number(item.unit_price || item.price || 0);
                    const qty = Number(item.quantity || 1);
                    const lineTotal = Number(item.total_price || (unitPrice * qty));

                    return (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-3 text-slate-400">{idx + 1}</td>
                        <td className="py-3.5 px-3 font-semibold text-slate-900">{item.product_name || item.name}</td>
                        <td className="py-3.5 px-3 text-center text-slate-500 font-mono">{item.sku || 'N/A'}</td>
                        <td className="py-3.5 px-3 text-center font-bold">{qty}</td>
                        <td className="py-3.5 px-3 text-right">₹{unitPrice.toLocaleString('en-IN')}</td>
                        <td className="py-3.5 px-3 text-right font-bold">₹{lineTotal.toLocaleString('en-IN')}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-slate-400">Standard Automotive Replacement Parts</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pricing Summary */}
          <div className="flex flex-col sm:flex-row justify-end pt-4 border-t border-slate-200">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-900">₹{Number(invoice.subtotal).toLocaleString('en-IN')}</span>
              </div>
              {Number(invoice.discount) > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount:</span>
                  <span>-₹{Number(invoice.discount).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax (18% GST incl.):</span>
                <span className="font-semibold text-slate-900">₹{Number(invoice.tax).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping & Handling:</span>
                <span className="font-semibold text-slate-900">
                  {Number(invoice.shipping_charge) === 0 ? 'FREE' : `₹${Number(invoice.shipping_charge).toLocaleString('en-IN')}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-300">
                <span>Grand Total:</span>
                <span className="text-amber-600">₹{Number(invoice.grand_total).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            <p className="font-semibold text-slate-700 mb-1">{bInfo.invoice_footer}</p>
            <p className="text-[11px] text-slate-400">Computer generated tax invoice. No signature required. AutoZoneIndia Logistics Hub.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
