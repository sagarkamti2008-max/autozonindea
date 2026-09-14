import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { enquiryQuotationService } from '../services/enquiryQuotationService';
import {
  FileText, Search, Filter, Plus, Calendar, Clock, Phone, Mail, User, Car,
  MessageSquare, CheckCircle2, AlertCircle, XCircle, ArrowRight, Shield, Layers,
  DollarSign, Share2, Eye, FileSpreadsheet, RefreshCw
} from 'lucide-react';

export const AdminEnquiryConsole = () => {
  const { products, showToast } = useStore();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [activityTimeline, setActivityTimeline] = useState([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // New Internal Note State
  const [newNote, setNewNote] = useState('');

  // Schedule Follow Up Modal State
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [followUpForm, setFollowUpForm] = useState({
    scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    assigned_to: 'Admin Sales Team',
    notes: '',
    followup_type: 'whatsapp' // phone, whatsapp, email, meeting
  });

  // Create Quotation Modal State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    customer_name: '',
    phone: '',
    email: '',
    items: [],
    subtotal: 0,
    discount_amount: 0,
    tax_amount: 0,
    grand_total: 0,
    valid_days: 15,
    notes: '',
    payment_terms: '100% advance before dispatch',
    delivery_terms: '2-4 Working Days via Bluedart/Delhivery'
  });

  useEffect(() => {
    loadEnquiries();
  }, [statusFilter, sourceFilter]);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const data = await enquiryQuotationService.getEnquiries({
        status: statusFilter,
        source: sourceFilter,
        search: searchTerm
      });
      setEnquiries(data || []);
    } catch (err) {
      console.error('Error loading enquiries:', err);
      showToast('Error loading enquiries', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = async (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsDetailOpen(true);
    try {
      const timeline = await enquiryQuotationService.getEnquiryActivity(enquiry.id);
      setActivityTimeline(timeline || []);
    } catch (err) {
      console.error('Error loading activity timeline:', err);
    }
  };

  const handleUpdateStatus = async (enquiryId, newStatus) => {
    try {
      const res = await enquiryQuotationService.updateEnquiryStatus(enquiryId, newStatus);
      if (res.success) {
        showToast(`Status updated to ${newStatus.toUpperCase()}`, 'success');
        setEnquiries(prev => prev.map(e => e.id === enquiryId ? { ...e, status: newStatus } : e));
        if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
          setSelectedEnquiry(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedEnquiry) return;
    try {
      const res = await enquiryQuotationService.addEnquiryNote(selectedEnquiry.id, newNote);
      if (res.success) {
        showToast('Internal note saved', 'success');
        setNewNote('');
        const timeline = await enquiryQuotationService.getEnquiryActivity(selectedEnquiry.id);
        setActivityTimeline(timeline || []);
      }
    } catch (err) {
      showToast('Error adding note', 'error');
    }
  };

  const handleScheduleFollowUp = async (e) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    try {
      const payload = {
        enquiry_id: selectedEnquiry.id,
        scheduled_at: followUpForm.scheduled_at,
        assigned_to: followUpForm.assigned_to,
        notes: followUpForm.notes,
        followup_type: followUpForm.followup_type
      };
      const res = await enquiryQuotationService.createFollowup(payload);
      if (res.success) {
        showToast('Follow-up scheduled successfully', 'success');
        setIsFollowUpModalOpen(false);
      } else {
        showToast('Failed to schedule follow-up: ' + res.error, 'error');
      }
    } catch (err) {
      showToast('Error creating follow-up', 'error');
    }
  };

  const handleOpenQuoteBuilder = (enquiry) => {
    setSelectedEnquiry(enquiry);
    // Pre-populate items based on product or enquiry subject
    const initialItem = enquiry.product_id ? {
      product_id: enquiry.product_id,
      product_name_snapshot: enquiry.subject || 'Product',
      sku_snapshot: 'SKU-TEMP',
      quantity: enquiry.quantity || 1,
      unit_price: 2500,
      tax_rate: 18,
      total_price: 2500 * (enquiry.quantity || 1)
    } : {
      product_id: null,
      product_name_snapshot: enquiry.subject || 'Requested Spare Part',
      sku_snapshot: 'CUSTOM',
      quantity: enquiry.quantity || 1,
      unit_price: 1500,
      tax_rate: 18,
      total_price: 1500 * (enquiry.quantity || 1)
    };

    const subtotal = initialItem.total_price;
    const tax = Math.round(subtotal * 0.18);
    const grand = subtotal + tax;

    setQuoteForm({
      customer_name: enquiry.customer_name,
      phone: enquiry.phone,
      email: enquiry.email || '',
      items: [initialItem],
      subtotal: subtotal,
      discount_amount: 0,
      tax_amount: tax,
      grand_total: grand,
      valid_days: 15,
      notes: `Quotation prepared for enquiry ref: ${enquiry.enquiry_number}`,
      payment_terms: '100% advance before dispatch',
      delivery_terms: '2-4 Working Days'
    });
    setIsQuoteModalOpen(true);
  };

  const handleAddQuoteItem = () => {
    setQuoteForm(prev => {
      const newItems = [...prev.items, {
        product_id: null,
        product_name_snapshot: 'Additional Part Item',
        sku_snapshot: 'SKU-ADD',
        quantity: 1,
        unit_price: 1000,
        tax_rate: 18,
        total_price: 1000
      }];
      const subtotal = newItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
      const tax = Math.round((subtotal - prev.discount_amount) * 0.18);
      return {
        ...prev,
        items: newItems,
        subtotal,
        tax_amount: tax,
        grand_total: (subtotal - prev.discount_amount) + tax
      };
    });
  };

  const handleCreateQuotationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    try {
      const validUntil = new Date(Date.now() + quoteForm.valid_days * 24 * 60 * 60 * 1000).toISOString();
      const payload = {
        enquiry_id: selectedEnquiry.id,
        customer_name: quoteForm.customer_name,
        phone: quoteForm.phone,
        email: quoteForm.email,
        subtotal: quoteForm.subtotal,
        discount_amount: quoteForm.discount_amount,
        tax_amount: quoteForm.tax_amount,
        grand_total: quoteForm.grand_total,
        valid_until: validUntil,
        notes: quoteForm.notes,
        payment_terms: quoteForm.payment_terms,
        delivery_terms: quoteForm.delivery_terms,
        items: quoteForm.items
      };

      const res = await enquiryQuotationService.createQuotation(payload);
      if (res.success) {
        showToast(`Quotation Created! Ref: ${res.data.quotation_number}`, 'success');
        setIsQuoteModalOpen(false);
        // Prompt to open WhatsApp share
        const waUrl = enquiryQuotationService.generateWhatsAppQuoteLink(res.data);
        window.open(waUrl, '_blank');
        loadEnquiries();
      } else {
        showToast('Failed to create quotation: ' + res.error, 'error');
      }
    } catch (err) {
      console.error('Error creating quote:', err);
      showToast('Error creating quotation', 'error');
    }
  };

  const filteredEnquiries = enquiries.filter(e => {
    const q = searchTerm.toLowerCase();
    return (
      (e.enquiry_number && e.enquiry_number.toLowerCase().includes(q)) ||
      (e.customer_name && e.customer_name.toLowerCase().includes(q)) ||
      (e.phone && e.phone.toLowerCase().includes(q)) ||
      (e.subject && e.subject.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ padding: '1.5rem', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F2167', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText color="#FF6B00" size={28} /> Customer Enquiries & Lead Desk
          </h1>
          <p style={{ color: '#64748b', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
            Manage customer spare part enquiries, schedule follow-ups, and issue formal price quotations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={loadEnquiries}
            style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#475569', padding: '0.5.rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by Ref #, Customer Name, Phone, Subject..."
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
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="interested">Interested</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Channel:</span>
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
          >
            <option value="all">All Sources</option>
            <option value="website">Website Form</option>
            <option value="whatsapp">WhatsApp Direct</option>
            <option value="phone">Phone Inbound</option>
          </select>
        </div>
      </div>

      {/* Enquiries Data Table */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', color: '#475569', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                <th style={{ padding: '0.85rem 1rem' }}>Ref #</th>
                <th style={{ padding: '0.85rem 1rem' }}>Customer Details</th>
                <th style={{ padding: '0.85rem 1rem' }}>Subject / Requirement</th>
                <th style={{ padding: '0.85rem 1rem' }}>Vehicle</th>
                <th style={{ padding: '0.85rem 1rem' }}>Source</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem' }}>Received Date</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    Loading customer enquiries...
                  </td>
                </tr>
              ) : filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No customer enquiries found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map(enquiry => (
                  <tr key={enquiry.id} style={{ borderBottom: '1px solid #f1f5f9', background: enquiry.status === 'new' ? '#fffdfa' : '#ffffff' }}>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: '#0F2167' }}>
                      {enquiry.enquiry_number}
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{enquiry.customer_name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Phone size={12} /> {enquiry.phone}
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: '#0F2167' }}>{enquiry.subject}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {enquiry.message || 'No additional notes'}
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', color: '#475569', fontSize: '0.82rem' }}>
                      {enquiry.vehicle_make ? `${enquiry.vehicle_make} ${enquiry.vehicle_model || ''}` : 'General / Not specified'}
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: enquiry.source === 'whatsapp' ? '#dcfce7' : '#e0f2fe',
                        color: enquiry.source === 'whatsapp' ? '#15803d' : '#0369a1'
                      }}>
                        {enquiry.source ? enquiry.source.toUpperCase() : 'WEBSITE'}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <select
                        value={enquiry.status}
                        onChange={e => handleUpdateStatus(enquiry.id, e.target.value)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '16px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                          background: enquiry.status === 'new' ? '#fee2e2' :
                                      enquiry.status === 'contacted' ? '#fef3c7' :
                                      enquiry.status === 'interested' ? '#e0e7ff' :
                                      enquiry.status === 'closed' ? '#dcfce7' : '#f1f5f9',
                          color: enquiry.status === 'new' ? '#991b1b' :
                                 enquiry.status === 'contacted' ? '#92400e' :
                                 enquiry.status === 'interested' ? '#3730a3' :
                                 enquiry.status === 'closed' ? '#166534' : '#475569'
                        }}
                      >
                        <option value="new">NEW</option>
                        <option value="contacted">CONTACTED</option>
                        <option value="interested">INTERESTED</option>
                        <option value="closed">CLOSED</option>
                      </select>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>
                      {new Date(enquiry.created_at).toLocaleDateString()}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleOpenDetail(enquiry)}
                          title="View Detail & Activity Log"
                          style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '0.4rem 0.6rem', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={() => handleOpenQuoteBuilder(enquiry)}
                          title="Create Quotation"
                          style={{ background: '#0F2167', border: 'none', color: '#ffffff', padding: '0.4rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <FileText size={15} color="#FF6B00" /> Quote
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enquiry Detail Drawer / Modal */}
      {isDetailOpen && selectedEnquiry && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: '600px', background: '#ffffff', height: '100%', overflowY: 'auto', padding: '2rem', boxShadow: '-10px 0 25px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', pb: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FF6B00', textTransform: 'uppercase' }}>Enquiry Details</span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F2167', margin: 0 }}>
                  {selectedEnquiry.enquiry_number}
                </h2>
              </div>
              <button
                onClick={() => setIsDetailOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}
              >
                ×
              </button>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleOpenQuoteBuilder(selectedEnquiry)}
                style={{ background: '#FF6B00', color: '#ffffff', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <FileText size={16} /> Create Price Quote
              </button>
              <button
                onClick={() => setIsFollowUpModalOpen(true)}
                style={{ background: '#0F2167', color: '#ffffff', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Calendar size={16} /> Schedule Follow-up
              </button>
              <a
                href={`https://wa.me/91${selectedEnquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedEnquiry.customer_name}, regarding your AutoZoneIndia enquiry (${selectedEnquiry.enquiry_number})...`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: '#25D366', color: '#ffffff', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <MessageSquare size={16} /> WhatsApp
              </a>
            </div>

            {/* Information Card */}
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.88rem' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Customer Name</span>
                  <strong>{selectedEnquiry.customer_name}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Phone</span>
                  <strong>{selectedEnquiry.phone}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Vehicle</span>
                  <strong>{selectedEnquiry.vehicle_make || 'N/A'} {selectedEnquiry.vehicle_model || ''}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Requested Quantity</span>
                  <strong>{selectedEnquiry.quantity || 1} Pcs</strong>
                </div>
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Requirement / Message</span>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', color: '#1e293b' }}>
                  {selectedEnquiry.message || selectedEnquiry.subject}
                </p>
              </div>
            </div>

            {/* Add Internal Note */}
            <form onSubmit={handleAddNote} style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0F2167', marginBottom: '0.4rem' }}>
                Add Internal Note / Activity Record
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="e.g. Called customer, confirmed vehicle VIN number..."
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
                <button
                  type="submit"
                  style={{ background: '#0F2167', color: '#ffffff', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Save Note
                </button>
              </div>
            </form>

            {/* Activity Timeline */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F2167', marginBottom: '1rem' }}>
                Activity & History Timeline
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {activityTimeline.length === 0 ? (
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No activity records logged yet.</div>
                ) : (
                  activityTimeline.map((act, i) => (
                    <div key={i} style={{ borderLeft: '2px solid #FF6B00', paddingLeft: '1rem', position: 'relative' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{act.activity_type.toUpperCase()}</div>
                      <div style={{ fontSize: '0.85rem', color: '#475569' }}>{act.description || act.notes}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                        {new Date(act.created_at).toLocaleString()} by {act.performed_by || 'Admin'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Follow Up Modal */}
      {isFollowUpModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '450px', background: '#ffffff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#0F2167', fontSize: '1.2rem', fontWeight: 800 }}>Schedule Sales Follow-Up</h3>
            <form onSubmit={handleScheduleFollowUp}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={followUpForm.scheduled_at}
                  onChange={e => setFollowUpForm({ ...followUpForm, scheduled_at: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Channel Type</label>
                <select
                  value={followUpForm.followup_type}
                  onChange={e => setFollowUpForm({ ...followUpForm, followup_type: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}
                >
                  <option value="whatsapp">WhatsApp Message</option>
                  <option value="phone">Phone Call</option>
                  <option value="email">Email</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Follow-Up Objective / Agenda</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Check if customer approved quotation price..."
                  value={followUpForm.notes}
                  onChange={e => setFollowUpForm({ ...followUpForm, notes: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsFollowUpModalOpen(false)}
                  style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#0F2167', color: '#ffffff', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Quotation Modal */}
      {isQuoteModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '750px', background: '#ffffff', borderRadius: '12px', padding: '1.75rem', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', pb: '0.75rem' }}>
              <h3 style={{ margin: 0, color: '#0F2167', fontSize: '1.3rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText color="#FF6B00" size={24} /> Create Price Quotation
              </h3>
              <button onClick={() => setIsQuoteModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>

            <form onSubmit={handleCreateQuotationSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>Customer Name</label>
                  <input
                    type="text"
                    required
                    value={quoteForm.customer_name}
                    onChange={e => setQuoteForm({ ...quoteForm, customer_name: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={quoteForm.phone}
                    onChange={e => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F2167' }}>Line Items</label>
                  <button
                    type="button"
                    onClick={handleAddQuoteItem}
                    style={{ background: 'none', border: 'none', color: '#FF6B00', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    + Add Item
                  </button>
                </div>

                {quoteForm.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '6px' }}>
                    <input
                      type="text"
                      placeholder="Part Name & Spec"
                      value={item.product_name_snapshot}
                      onChange={e => {
                        const updated = [...quoteForm.items];
                        updated[idx].product_name_snapshot = e.target.value;
                        setQuoteForm({ ...quoteForm, items: updated });
                      }}
                      style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      min="1"
                      value={item.quantity}
                      onChange={e => {
                        const updated = [...quoteForm.items];
                        const q = parseInt(e.target.value) || 1;
                        updated[idx].quantity = q;
                        updated[idx].total_price = q * updated[idx].unit_price;
                        const sub = updated.reduce((s, it) => s + it.total_price, 0);
                        const tax = Math.round((sub - quoteForm.discount_amount) * 0.18);
                        setQuoteForm({ ...quoteForm, items: updated, subtotal: sub, tax_amount: tax, grand_total: (sub - quoteForm.discount_amount) + tax });
                      }}
                      style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                    <input
                      type="number"
                      placeholder="Price (₹)"
                      value={item.unit_price}
                      onChange={e => {
                        const updated = [...quoteForm.items];
                        const pr = parseFloat(e.target.value) || 0;
                        updated[idx].unit_price = pr;
                        updated[idx].total_price = updated[idx].quantity * pr;
                        const sub = updated.reduce((s, it) => s + it.total_price, 0);
                        const tax = Math.round((sub - quoteForm.discount_amount) * 0.18);
                        setQuoteForm({ ...quoteForm, items: updated, subtotal: sub, tax_amount: tax, grand_total: (sub - quoteForm.discount_amount) + tax });
                      }}
                      style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F2167', display: 'flex', alignItems: 'center' }}>
                      ₹{item.total_price}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Totals */}
              <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span>Subtotal:</span> <strong>₹{quoteForm.subtotal}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span>GST Tax (18%):</span> <strong>₹{quoteForm.tax_amount}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', paddingTop: '0.4rem', fontSize: '1.1rem', fontWeight: 800, color: '#0F2167' }}>
                  <span>Grand Total:</span> <span style={{ color: '#FF6B00' }}>₹{quoteForm.grand_total}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsQuoteModalOpen(false)}
                  style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#0F2167', color: '#ffffff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Share2 size={16} color="#FF6B00" /> Save & Send via WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminEnquiryConsole;
