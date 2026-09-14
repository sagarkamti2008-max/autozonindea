import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { enquiryQuotationService } from '../services/enquiryQuotationService';
import {
  Layers, Plus, Trash2, Send, CheckCircle2, ArrowLeft, Building, User, Phone, Mail, FileSpreadsheet
} from 'lucide-react';

export const BulkEnquiryView = ({ onNavigate }) => {
  const { currentUser, showToast, navigateTo } = useStore();
  const nav = onNavigate || navigateTo;

  const [businessInfo, setBusinessInfo] = useState({
    business_name: '',
    contact_person: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    gstin: '',
    business_type: 'garage_workshop', // garage_workshop, spare_parts_dealer, fleet_owner, individual
    city: ''
  });

  const [items, setItems] = useState([
    { part_name: '', vehicle_model: '', part_number: '', quantity: 1, urgency: 'normal' }
  ]);

  const [loading, setLoading] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);

  const addItemRow = () => {
    setItems([...items, { part_name: '', vehicle_model: '', part_number: '', quantity: 1, urgency: 'normal' }]);
  };

  const removeItemRow = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!businessInfo.contact_person || !businessInfo.phone) {
      showToast('Please provide contact person name and phone number.', 'error');
      return;
    }

    const validItems = items.filter(i => i.part_name.trim() !== '');
    if (validItems.length === 0) {
      showToast('Please add at least one part name to your bulk enquiry.', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customer_name: businessInfo.business_name ? `${businessInfo.business_name} (${businessInfo.contact_person})` : businessInfo.contact_person,
        phone: businessInfo.phone,
        email: businessInfo.email,
        customer_id: currentUser?.id || null,
        subject: `Bulk Parts Quote Request (${validItems.length} items) - ${businessInfo.business_name || businessInfo.contact_person}`,
        message: `Business Type: ${businessInfo.business_type}. GSTIN: ${businessInfo.gstin || 'N/A'}. City: ${businessInfo.city || 'N/A'}.`,
        source: 'website',
        enquiry_type: 'bulk',
        items: validItems.map(item => ({
          part_name_requested: item.part_name,
          vehicle_details_requested: item.vehicle_model,
          quantity_requested: parseInt(item.quantity) || 1,
          remarks: `Part No: ${item.part_number || 'N/A'}, Urgency: ${item.urgency}`
        }))
      };

      const res = await enquiryQuotationService.createCustomerEnquiry(payload);
      if (res.success) {
        setSubmittedResult(res.data);
        showToast(`Bulk enquiry submitted! Reference: ${res.data.enquiry_number}`, 'success');
      } else {
        showToast('Submission failed: ' + (res.error || 'Unknown error'), 'error');
      }
    } catch (err) {
      console.error('Error submitting bulk enquiry:', err);
      showToast('Error submitting bulk enquiry', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (submittedResult) {
    return (
      <div style={{ maxWidth: '850px', margin: '3rem auto', padding: '0 1rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0F2167 0%, #1e293b 100%)',
          borderRadius: '16px',
          padding: '3rem 2rem',
          color: '#ffffff',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <CheckCircle2 size={56} color="#22c55e" style={{ margin: '0 auto 1.5rem auto' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#ffffff' }}>
            Bulk Quotation Request Submitted!
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginBottom: '2rem' }}>
            Our B2B corporate & garage supply team has received your multi-part requirement list.
          </p>

          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: '#94a3b8' }}>Enquiry Reference:</span>
              <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 700, color: '#FF6B00' }}>
                {submittedResult.enquiry_number}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1' }}>
              We will prepare an itemized price quotation with GST tax breakdown, volume discounts, and availability timeline.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => nav('catalog')}
              style={{
                background: '#FF6B00',
                color: '#ffffff',
                border: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Return to Catalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
      <button
        onClick={() => nav('catalog')}
        style={{
          background: 'none',
          border: 'none',
          color: '#64748b',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem',
          marginBottom: '1rem'
        }}
      >
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0F2167 0%, #1e293b 100%)',
          padding: '2.5rem 2rem',
          color: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <FileSpreadsheet size={28} color="#FF6B00" />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
              B2B & Garage Bulk Parts Quote Request
            </h1>
          </div>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem' }}>
            Special tiered pricing and dedicated account manager support for Workshops, Garages, Auto Parts Retailers & Commercial Fleets.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          {/* Business Info */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F2167', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={18} color="#FF6B00" /> Business / Garage Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  Business / Garage Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Auto Care & Services"
                  value={businessInfo.business_name}
                  onChange={e => setBusinessInfo({ ...businessInfo, business_name: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  Contact Person Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amit Sharma"
                  value={businessInfo.contact_person}
                  onChange={e => setBusinessInfo({ ...businessInfo, contact_person: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  Phone Number <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={businessInfo.phone}
                  onChange={e => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  GSTIN (For Tax Credit)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 27AAAAA0000A1Z5"
                  value={businessInfo.gstin}
                  onChange={e => setBusinessInfo({ ...businessInfo, gstin: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F2167', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} color="#FF6B00" /> Multi-Part Requirement List ({items.length} items)
              </h3>
              <button
                type="button"
                onClick={addItemRow}
                style={{
                  background: 'rgba(15,33,103,0.08)',
                  color: '#0F2167',
                  border: '1px solid #0F2167',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Plus size={16} /> Add Another Item
              </button>
            </div>

            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem' }}>#</th>
                    <th style={{ padding: '0.75rem' }}>Part Name / Description *</th>
                    <th style={{ padding: '0.75rem' }}>Car Make & Model</th>
                    <th style={{ padding: '0.75rem' }}>OEM / Part No.</th>
                    <th style={{ padding: '0.75rem', width: '90px' }}>Qty</th>
                    <th style={{ padding: '0.75rem' }}>Urgency</th>
                    <th style={{ padding: '0.75rem', width: '50px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{index + 1}</td>
                      <td style={{ padding: '0.5rem' }}>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Clutch Set / Oil Filter"
                          value={item.part_name}
                          onChange={e => handleItemChange(index, 'part_name', e.target.value)}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <input
                          type="text"
                          placeholder="e.g. Hyundai Creta 1.6"
                          value={item.vehicle_model}
                          onChange={e => handleItemChange(index, 'vehicle_model', e.target.value)}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <input
                          type="text"
                          placeholder="e.g. 26300-35505"
                          value={item.part_number}
                          onChange={e => handleItemChange(index, 'part_number', e.target.value)}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <select
                          value={item.urgency}
                          onChange={e => handleItemChange(index, 'urgency', e.target.value)}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}
                        >
                          <option value="normal">Normal (2-4 Days)</option>
                          <option value="immediate">Immediate / Urgent</option>
                          <option value="scheduled">Scheduled Routine</option>
                        </select>
                      </td>
                      <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItemRow(index)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #0F2167 0%, #1e293b 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '1rem',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              boxShadow: '0 8px 20px rgba(15,33,103,0.3)'
            }}
          >
            {loading ? 'Submitting Bulk Request...' : <><Send size={20} color="#FF6B00" /> Submit Bulk Quotation Request</>}
          </button>
        </form>
      </div>
    </div>
  );
};
export default BulkEnquiryView;
