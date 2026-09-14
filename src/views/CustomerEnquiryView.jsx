import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { enquiryQuotationService } from '../services/enquiryQuotationService';
import {
  FileText, CheckCircle2, Car, Package, Send, ShieldAlert, ArrowLeft,
  Phone, Mail, User, MapPin, AlertCircle, HelpCircle, MessageSquare
} from 'lucide-react';

export const CustomerEnquiryView = ({ preselectedProduct = null, onNavigate }) => {
  const { products, currentUser, showToast, navigateTo } = useStore();
  const nav = onNavigate || navigateTo;

  const [formData, setFormData] = useState({
    customer_name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    subject: preselectedProduct ? `Enquiry for ${preselectedProduct.name}` : '',
    message: '',
    quantity: 1,
    vehicle_make: '',
    vehicle_model: '',
    vehicle_variant: '',
    vehicle_year: '',
    product_id: preselectedProduct?.id || '',
    source: 'website'
  });

  const [loading, setLoading] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);

  useEffect(() => {
    // Load vehicle master for selectors if available
    const loadVehicles = async () => {
      try {
        const vList = await enquiryQuotationService.getVehiclesList();
        setVehicles(vList || []);
      } catch (err) {
        console.error('Error loading vehicle master:', err);
      }
    };
    loadVehicles();
  }, []);

  const handleMakeChange = (make) => {
    setFormData(prev => ({ ...prev, vehicle_make: make, vehicle_model: '', vehicle_variant: '' }));
    const filteredModels = vehicles.filter(v => v.make === make);
    setAvailableModels(filteredModels);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.phone || !formData.subject) {
      showToast('Please provide your name, phone number, and enquiry subject.', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        customer_id: currentUser?.id || null
      };

      const result = await enquiryQuotationService.createCustomerEnquiry(payload);
      if (result.success) {
        setSubmittedEnquiry(result.data);
        showToast(`Enquiry submitted successfully! Reference: ${result.data.enquiry_number}`, 'success');
      } else {
        showToast('Failed to submit enquiry: ' + (result.error || 'Unknown error'), 'error');
      }
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      showToast('Error submitting enquiry', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (submittedEnquiry) {
    return (
      <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 1rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0F2167 0%, #1e293b 100%)',
          borderRadius: '16px',
          padding: '3rem 2rem',
          color: '#ffffff',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(34, 197, 94, 0.2)',
            border: '2px solid #22c55e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <CheckCircle2 size={48} color="#22c55e" />
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#ffffff' }}>
            Enquiry Received!
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginBottom: '2rem' }}>
            Thank you for reaching out to AutoZoneIndia. Our spare parts specialist will contact you shortly.
          </p>

          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px dashed rgba(255,107,0,0.4)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Enquiry Reference Number:</span>
              <span style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 700, color: '#FF6B00' }}>
                {submittedEnquiry.enquiry_number}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem' }}>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.8rem' }}>Name</span>
                <span style={{ fontWeight: 600 }}>{submittedEnquiry.customer_name}</span>
              </div>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.8rem' }}>Phone</span>
                <span style={{ fontWeight: 600 }}>{submittedEnquiry.phone}</span>
              </div>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.8rem' }}>Subject</span>
                <span style={{ fontWeight: 600 }}>{submittedEnquiry.subject}</span>
              </div>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.8rem' }}>Status</span>
                <span style={{
                  display: 'inline-block',
                  padding: '0.2rem 0.6rem',
                  background: 'rgba(59,130,246,0.2)',
                  color: '#60a5fa',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  {submittedEnquiry.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                const message = `Hello AutoZoneIndia team, I submitted an enquiry (Ref: ${submittedEnquiry.enquiry_number}) for "${submittedEnquiry.subject}". Can you please check?`;
                window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank');
              }}
              style={{
                background: '#25D366',
                color: '#ffffff',
                border: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(37,211,102,0.3)'
              }}
            >
              <MessageSquare size={18} />
              Connect via WhatsApp Instant Support
            </button>

            <button
              onClick={() => nav('catalog')}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '0.8rem 1.5rem',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Continue Browsing Parts
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get unique makes from vehicle master
  const uniqueMakes = Array.from(new Set(vehicles.map(v => v.make))).filter(Boolean);

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
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
            <FileText size={28} color="#FF6B00" />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
              Spare Parts Enquiry & Price Quote Request
            </h1>
          </div>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem' }}>
            Can't find your car part or need a bulk price quotation? Fill out the details below and our OEM/OES specialists will find exact-fit parts for your vehicle.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          {/* Customer Details Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F2167', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} color="#FF6B00" /> Customer Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  Full Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Kumar"
                  value={formData.customer_name}
                  onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  Mobile Phone Number <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. rajesh@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                />
              </div>
            </div>
          </div>

          {/* Vehicle Selector Section */}
          <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F2167', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Car size={18} color="#FF6B00" /> Vehicle Information (Optional but recommended for 100% fitment match)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  Make / Manufacturer
                </label>
                <select
                  value={formData.vehicle_make}
                  onChange={e => handleMakeChange(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#ffffff' }}
                >
                  <option value="">-- Select Make --</option>
                  {uniqueMakes.length > 0 ? (
                    uniqueMakes.map(m => <option key={m} value={m}>{m}</option>)
                  ) : (
                    ['Toyota', 'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Volkswagen', 'Ford', 'BMW', 'Mercedes-Benz'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  Model
                </label>
                <input
                  type="text"
                  placeholder="e.g. Innova / Swift"
                  value={formData.vehicle_model}
                  onChange={e => setFormData({ ...formData, vehicle_model: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  Variant / Engine
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2.4 VX Diesel"
                  value={formData.vehicle_variant}
                  onChange={e => setFormData({ ...formData, vehicle_variant: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  Manufacturing Year
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2019"
                  value={formData.vehicle_year}
                  onChange={e => setFormData({ ...formData, vehicle_year: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
            </div>
          </div>

          {/* Part Request Details */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F2167', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={18} color="#FF6B00" /> Part Details & Requirements
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Enquiry Subject / Part Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Front Brake Pads & Brake Discs for Innova Crysta"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  Quantity Needed
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  Preferred Source / Channel
                </label>
                <select
                  value={formData.source}
                  onChange={e => setFormData({ ...formData, source: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: '#ffffff' }}
                >
                  <option value="website">Website Enquiry</option>
                  <option value="whatsapp">Prefer WhatsApp Contact</option>
                  <option value="phone">Prefer Phone Call Call</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Detailed Message / Part Number / VIN Number / Remarks
              </label>
              <textarea
                rows={4}
                placeholder="Please describe part specifications, OEM part number if known, vehicle VIN number, or specific brand preferences (e.g. Bosch, TVS Girling, Valeo)..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #FF6B00 0%, #e65c00 100%)',
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
              boxShadow: '0 8px 20px rgba(255,107,0,0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? (
              <span>Submitting Enquiry...</span>
            ) : (
              <>
                <Send size={20} /> Submit Spare Parts Enquiry & Get Quote
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
export default CustomerEnquiryView;
