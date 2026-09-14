import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { enquiryQuotationService } from '../services/enquiryQuotationService';
import {
  FileText, CheckCircle2, XCircle, ShoppingBag, Printer, Share2, MessageSquare,
  Clock, ShieldAlert, AlertTriangle, ArrowLeft, Building, Calendar, DollarSign
} from 'lucide-react';

export const CustomerQuotationView = ({ token, onNavigate }) => {
  const { showToast, navigateTo, addToCart } = useStore();
  const nav = onNavigate || navigateTo;

  const [loading, setLoading] = useState(true);
  const [quotation, setQuotation] = useState(null);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Parse token from window location if not passed as prop
  const activeToken = token || new URLSearchParams(window.location.search).get('token') || window.location.pathname.split('/quotation/')[1];

  useEffect(() => {
    if (!activeToken) {
      setError('No quotation token provided.');
      setLoading(false);
      return;
    }

    const fetchQuote = async () => {
      setLoading(true);
      try {
        const quoteData = await enquiryQuotationService.getQuotationBySecureToken(activeToken);
        if (quoteData) {
          setQuotation(quoteData);
        } else {
          setError('Quotation not found or link has expired.');
        }
      } catch (err) {
        console.error('Error fetching quotation:', err);
        setError('Failed to load quotation.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [activeToken]);

  const handleUpdateStatus = async (newStatus) => {
    if (!quotation) return;
    setActionLoading(true);
    try {
      const res = await enquiryQuotationService.updateQuotationCustomerStatus(quotation.id, newStatus);
      if (res.success) {
        setQuotation(prev => ({ ...prev, status: newStatus }));
        showToast(`Quotation status updated to ${newStatus.toUpperCase()}`, 'success');
      } else {
        showToast('Failed to update status: ' + res.error, 'error');
      }
    } catch (err) {
      showToast('Error updating status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConvertToOrder = async () => {
    if (!quotation) return;
    setActionLoading(true);
    try {
      const res = await enquiryQuotationService.convertQuotationToOrder(quotation.id);
      if (res.success) {
        showToast(`Order created successfully! Order #: ${res.orderNumber}`, 'success');
        setQuotation(prev => ({ ...prev, status: 'converted' }));
        // Automatically add quotation items to cart or navigate to cart/checkout
        if (quotation.items && quotation.items.length > 0) {
          quotation.items.forEach(item => {
            if (item.product_id) {
              addToCart({
                id: item.product_id,
                name: item.product_name_snapshot,
                price: item.unit_price,
                quantity: item.quantity
              });
            }
          });
        }
        nav('checkout');
      } else {
        showToast('Conversion failed: ' + res.error, 'error');
      }
    } catch (err) {
      console.error('Error converting quote to order:', err);
      showToast('Error converting quotation', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <Clock size={40} color="#FF6B00" style={{ animation: 'spin 1.5s linear infinite' }} />
        <h3 style={{ marginTop: '1rem', color: '#0F2167' }}>Loading Official Price Quotation...</h3>
      </div>
    );
  }

  if (error || !quotation) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', textAlign: 'center', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        <AlertTriangle size={48} color="#ef4444" style={{ margin: '0 auto 1rem auto' }} />
        <h2 style={{ color: '#0F2167', fontWeight: 800 }}>Quotation Link Invalid</h2>
        <p style={{ color: '#64748b' }}>{error || 'We could not find the quotation associated with this secure link.'}</p>
        <button
          onClick={() => nav('catalog')}
          style={{ background: '#0F2167', color: '#ffffff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', marginTop: '1rem' }}
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const isExpired = new Date(quotation.valid_until) < new Date();
  const waShareUrl = enquiryQuotationService.generateWhatsAppQuoteLink(quotation);

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Header Actions */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button
          onClick={() => nav('catalog')}
          style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} /> Back to Parts Store
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => window.print()}
            style={{
              background: '#f1f5f9',
              color: '#334155',
              border: '1px solid #cbd5e1',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem'
            }}
          >
            <Printer size={16} /> Print / Save PDF
          </button>

          <a
            href={waShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#25D366',
              color: '#ffffff',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              textDecoration: 'none',
              fontSize: '0.85rem'
            }}
          >
            <MessageSquare size={16} /> Share via WhatsApp
          </a>
        </div>
      </div>

      {/* Main Quotation Document Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        {/* Top Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0F2167 0%, #1e293b 100%)',
          padding: '2rem',
          color: '#ffffff',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FF6B00', letterSpacing: '-0.5px' }}>
              AUTOZONE<span style={{ color: '#ffffff' }}>INDIA</span>
            </div>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
              India's Premier OEM & OES Spare Parts Supplier
            </p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
              GSTIN: 27AAAAA1234A1Z5 | Support: +91 98765 43210
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{
              display: 'inline-block',
              padding: '0.3rem 0.8rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 800,
              background: quotation.status === 'accepted' ? '#22c55e' :
                          quotation.status === 'converted' ? '#3b82f6' :
                          quotation.status === 'rejected' ? '#ef4444' : '#FF6B00',
              color: '#ffffff',
              marginBottom: '0.5rem'
            }}>
              OFFICIAL QUOTATION: {quotation.status.toUpperCase()}
            </span>
            <div style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
              {quotation.quotation_number}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              Date: {new Date(quotation.created_at).toLocaleDateString()}
            </div>
            <div style={{ fontSize: '0.85rem', color: isExpired ? '#fca5a5' : '#86efac' }}>
              Valid Until: {new Date(quotation.valid_until).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Customer & Quote Metadata */}
        <div style={{ padding: '1.5rem 2rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quotation For</h4>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0F2167' }}>{quotation.customer_name}</div>
            <div style={{ fontSize: '0.85rem', color: '#475569' }}>Phone: {quotation.phone}</div>
            {quotation.email && <div style={{ fontSize: '0.85rem', color: '#475569' }}>Email: {quotation.email}</div>}
          </div>

          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Delivery / Terms</h4>
            <div style={{ fontSize: '0.85rem', color: '#334155' }}>
              <strong>Payment Terms:</strong> {quotation.payment_terms || 'Immediate on dispatch'}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#334155', marginTop: '0.2rem' }}>
              <strong>Delivery Timeline:</strong> {quotation.delivery_terms || '2-4 Working Days'}
            </div>
          </div>

          {quotation.notes && (
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Special Remarks</h4>
              <div style={{ fontSize: '0.85rem', color: '#334155', fontStyle: 'italic' }}>"{quotation.notes}"</div>
            </div>
          )}
        </div>

        {/* Line Items Table */}
        <div style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F2167', marginBottom: '1rem' }}>
            Itemized Price Breakdown
          </h3>

          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', color: '#334155', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>#</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Product Name & Spec</th>
                  <th style={{ padding: '0.75rem 1rem' }}>SKU / Part No.</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Unit Price (₹)</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>GST Rate</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items && quotation.items.map((item, idx) => (
                  <tr key={item.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>{idx + 1}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: '#0F2167' }}>{item.product_name_snapshot}</div>
                      {item.notes && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.notes}</div>}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontSize: '0.85rem', color: '#475569' }}>
                      {item.sku_snapshot || 'N/A'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 600 }}>{item.quantity}</td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>₹{Number(item.unit_price).toLocaleString()}</td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right', color: '#64748b' }}>{item.tax_rate || 18}%</td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700, color: '#0F2167' }}>
                      ₹{Number(item.total_price).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Summary */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
            <div style={{ width: '100%', maxWidth: '350px', background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#475569', fontSize: '0.9rem' }}>
                <span>Subtotal (Excl. Tax):</span>
                <span>₹{Number(quotation.subtotal).toLocaleString()}</span>
              </div>
              {Number(quotation.discount_amount) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#16a34a', fontSize: '0.9rem' }}>
                  <span>Special Discount:</span>
                  <span>- ₹{Number(quotation.discount_amount).toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#475569', fontSize: '0.9rem' }}>
                <span>GST Tax Total (18%):</span>
                <span>₹{Number(quotation.tax_amount).toLocaleString()}</span>
              </div>
              <div style={{
                display: 'flex',
                justify: 'space-between',
                borderTop: '2px solid #0F2167',
                paddingTop: '0.75rem',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: '#0F2167'
              }}>
                <span>Grand Total:</span>
                <span style={{ color: '#FF6B00' }}>₹{Number(quotation.grand_total).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Bar for Customer */}
          <div className="no-print" style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#0F2167', fontSize: '1rem', fontWeight: 700 }}>
              Quotation Acceptance & Actions
            </h4>

            {isExpired ? (
              <div style={{ color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={20} /> This quotation expired on {new Date(quotation.valid_until).toLocaleDateString()}. Please contact us for a refreshed quote.
              </div>
            ) : quotation.status === 'converted' ? (
              <div style={{ color: '#2563eb', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={20} /> This quotation has been converted into an official order!
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {quotation.status !== 'accepted' && (
                  <button
                    onClick={() => handleUpdateStatus('accepted')}
                    disabled={actionLoading}
                    style={{
                      background: '#22c55e',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      cursor: actionLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 12px rgba(34,197,94,0.3)'
                    }}
                  >
                    <CheckCircle2 size={18} /> Accept Quotation
                  </button>
                )}

                <button
                  onClick={handleConvertToOrder}
                  disabled={actionLoading}
                  style={{
                    background: 'linear-gradient(135deg, #FF6B00 0%, #e65c00 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: 800,
                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(255,107,0,0.3)'
                  }}
                >
                  <ShoppingBag size={18} /> Proceed to Order & Checkout
                </button>

                {quotation.status !== 'rejected' && (
                  <button
                    onClick={() => handleUpdateStatus('rejected')}
                    disabled={actionLoading}
                    style={{
                      background: 'none',
                      color: '#ef4444',
                      border: '1px solid #ef4444',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: actionLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <XCircle size={18} /> Reject / Request Change
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CustomerQuotationView;
