import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { enquiryQuotationService } from '../services/enquiryQuotationService';
import {
  FileText, Search, Printer, Share2, MessageSquare, CheckCircle2,
  XCircle, Clock, ShoppingBag, ArrowRight, Eye, RefreshCw, AlertTriangle
} from 'lucide-react';

export const AdminQuotationDetailConsole = () => {
  const { showToast, navigateTo } = useStore();

  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadQuotations();
  }, [statusFilter]);

  const loadQuotations = async () => {
    setLoading(true);
    try {
      const data = await enquiryQuotationService.getQuotations({ status: statusFilter });
      setQuotations(data || []);
    } catch (err) {
      console.error('Error loading quotations:', err);
      showToast('Error loading quotations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToOrder = async (quoteId) => {
    setActionLoading(true);
    try {
      const res = await enquiryQuotationService.convertQuotationToOrder(quoteId);
      if (res.success) {
        showToast(`Quotation converted to Order ${res.orderNumber}!`, 'success');
        loadQuotations();
      } else {
        showToast('Failed to convert quote: ' + res.error, 'error');
      }
    } catch (err) {
      showToast('Error converting quotation', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredQuotes = quotations.filter(q => {
    const term = searchTerm.toLowerCase();
    return (
      (q.quotation_number && q.quotation_number.toLowerCase().includes(term)) ||
      (q.customer_name && q.customer_name.toLowerCase().includes(term)) ||
      (q.phone && q.phone.toLowerCase().includes(term))
    );
  });

  return (
    <div style={{ padding: '1.5rem', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F2167', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText color="#FF6B00" size={28} /> Price Quotations Console
          </h1>
          <p style={{ color: '#64748b', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
            Manage issued price quotes, track customer approvals, launch WhatsApp links, and convert quotes directly into fulfilled orders.
          </p>
        </div>

        <button
          onClick={loadQuotations}
          style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#475569', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Filter & Search */}
      <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search Quote #, Customer Name, Phone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.65rem 0.65rem 0.65rem 2.4rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
          >
            <option value="all">All Quotations</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="converted">Converted to Order</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', color: '#475569', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                <th style={{ padding: '0.85rem 1rem' }}>Quote #</th>
                <th style={{ padding: '0.85rem 1rem' }}>Customer Details</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Subtotal (₹)</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Grand Total (₹)</th>
                <th style={{ padding: '0.85rem 1rem' }}>Valid Until</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    Loading quotations...
                  </td>
                </tr>
              ) : filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No quotations found.
                  </td>
                </tr>
              ) : (
                filteredQuotes.map(quote => (
                  <tr key={quote.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: '#0F2167' }}>
                      {quote.quotation_number}
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{quote.customer_name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{quote.phone}</div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      ₹{Number(quote.subtotal).toLocaleString()}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 800, color: '#0F2167' }}>
                      ₹{Number(quote.grand_total).toLocaleString()}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#64748b' }}>
                      {new Date(quote.valid_until).toLocaleDateString()}
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: '16px',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        background: quote.status === 'accepted' ? '#dcfce7' :
                                    quote.status === 'converted' ? '#e0f2fe' :
                                    quote.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                        color: quote.status === 'accepted' ? '#15803d' :
                               quote.status === 'converted' ? '#0369a1' :
                               quote.status === 'rejected' ? '#991b1b' : '#92400e'
                      }}>
                        {quote.status.toUpperCase()}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <a
                          href={enquiryQuotationService.generateWhatsAppQuoteLink(quote)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Share via WhatsApp"
                          style={{ background: '#25D366', border: 'none', color: '#ffffff', padding: '0.4rem 0.6rem', borderRadius: '6px', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                        >
                          <MessageSquare size={14} />
                        </a>

                        <button
                          onClick={() => {
                            setSelectedQuote(quote);
                            setIsPreviewOpen(true);
                          }}
                          title="Preview Quote"
                          style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '0.4rem 0.6rem', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          <Eye size={14} />
                        </button>

                        {quote.status !== 'converted' && (
                          <button
                            onClick={() => handleConvertToOrder(quote.id)}
                            disabled={actionLoading}
                            title="Convert to Order"
                            style={{ background: '#0F2167', border: 'none', color: '#ffffff', padding: '0.4rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            <ShoppingBag size={14} color="#FF6B00" /> Convert
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quote Preview Modal */}
      {isPreviewOpen && selectedQuote && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '750px', background: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ background: '#0F2167', padding: '1.25rem 1.5rem', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Quotation Details: {selectedQuote.quotation_number}</h3>
              <button onClick={() => setIsPreviewOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ padding: '1.5rem', maxHeight: '75vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.8rem' }}>Customer</span>
                  <strong>{selectedQuote.customer_name} ({selectedQuote.phone})</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.8rem' }}>Public Token Access Link</span>
                  <a href={`/quotation/${selectedQuote.secure_token}`} target="_blank" rel="noopener noreferrer" style={{ color: '#FF6B00', fontWeight: 700, fontSize: '0.85rem' }}>
                    Open Public Portal Link ↗
                  </a>
                </div>
              </div>

              {/* Items */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead style={{ background: '#f8fafc' }}>
                    <tr>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Item</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>Qty</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right' }}>Price</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedQuote.items && selectedQuote.items.map((it, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.5rem 0.75rem' }}>{it.product_name_snapshot}</td>
                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>{it.quantity}</td>
                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right' }}>₹{it.unit_price}</td>
                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontWeight: 700 }}>₹{it.total_price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ textAlign: 'right', fontSize: '1rem', fontWeight: 800, color: '#0F2167' }}>
                Grand Total: <span style={{ color: '#FF6B00' }}>₹{Number(selectedQuote.grand_total).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminQuotationDetailConsole;
