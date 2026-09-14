import React, { useState } from 'react';
import { MessageCircle, X, Send, Image, Camera, Wrench, ShieldCheck, PhoneCall } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WhatsAppFloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const { selectedVehicle } = useStore();
  const phoneNumber = '918591719499';

  const vehicleName = selectedVehicle 
    ? `${selectedVehicle.makeName || ''} ${selectedVehicle.modelName || ''} (${selectedVehicle.year || ''})`.trim()
    : '[Car Model]';

  const defaultPrefilled = `Hi, I need help finding a part for my car: ${vehicleName}`;

  const quickTemplates = [
    { label: '🚗 Help find part for my car model', text: `Hi, I need help finding a part for my car: ${vehicleName}` },
    { label: '🔧 Mechanic Bulk & Trade Discount', text: `Hi Sagar! I am a garage owner / mechanic and want to order spare parts at bulk wholesale prices.` },
    { label: '📸 Upload Broken Part Photo / VIN', text: `Hi AutoZon Team! Here is my car detail / broken part photo for 100% fitment check:` },
    { label: '📦 Express Order Status Inquiry', text: `Hi AutoZon! Please update me on the live status & tracking of my spare parts order.` }
  ];

  const handleSendWhatsApp = (msgText) => {
    const textToSend = msgText || customMsg || defaultPrefilled;
    const encoded = encodeURIComponent(textToSend);
    window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Green WhatsApp Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 99999,
          background: '#25D366',
          color: '#FFFFFF',
          border: '2px solid #FFFFFF',
          borderRadius: '50px',
          padding: '0.65rem 1.25rem',
          fontWeight: 900,
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 8px 25px rgba(37,211,102,0.45)',
          cursor: 'pointer',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <MessageCircle size={22} color="#FFFFFF" fill="#FFFFFF" />
        <span>WhatsApp Order & Help</span>
        <span style={{ width: '10px', height: '10px', background: '#FFFFFF', borderRadius: '50%', border: '2px solid #25D366' }}></span>
      </button>

      {/* WhatsApp Interactive Quick Drawer / Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '85px',
            right: '24px',
            width: '360px',
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
            border: '1px solid #E2E8F0',
            zIndex: 99999,
            overflow: 'hidden',
            animation: 'fadeInUp 0.3s ease'
          }}
        >
          {/* Header */}
          <div style={{ background: '#075E54', color: '#FFFFFF', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', background: '#25D366', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <MessageCircle size={24} color="#FFFFFF" fill="#FFFFFF" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: '#FFFFFF' }}>
                  AutoZon WhatsApp Desk
                </h4>
                <span style={{ fontSize: '0.72rem', color: '#86EFAC', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  ● Online (+91 8591719499)
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '1rem', background: '#E5DDD5', minHeight: '260px' }}>
            {/* Simulated Chat Bubble */}
            <div style={{ background: '#FFFFFF', padding: '0.75rem 0.85rem', borderRadius: '0 12px 12px 12px', fontSize: '0.8rem', color: '#0F172A', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '1rem', maxWidth: '90%' }}>
              <b>👋 Hello! Welcome to AutoZon India Spare Parts Desk.</b>
              <div style={{ marginTop: '0.35rem', color: '#475569', fontSize: '0.75rem', lineHeight: 1.4 }}>
                Send us a photo of your required part, VIN number, or return claim proof on WhatsApp for 2-Minute instant verification!
              </div>
              <span style={{ fontSize: '0.62rem', color: '#94A3B8', display: 'block', textAlign: 'right', marginTop: '0.2rem' }}>
                Replies in under 2 mins
              </span>
            </div>

            {/* Quick Template Chips */}
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Select Quick Topic:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1rem' }}>
              {quickTemplates.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendWhatsApp(tmpl.text)}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#0F2167',
                    textAlign: 'left',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#25D366'; e.currentTarget.style.background = '#F0FDF4'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.background = '#FFFFFF'; }}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="text"
                placeholder="Type your message / Part Name..."
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendWhatsApp()}
                style={{ flex: 1, border: '1px solid #CBD5E1', borderRadius: '20px', padding: '0.5rem 0.85rem', fontSize: '0.8rem', outline: 'none' }}
              />
              <button
                onClick={() => handleSendWhatsApp()}
                style={{ background: '#128C7E', color: '#FFFFFF', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>

          {/* Footer Guarantee */}
          <div style={{ background: '#F8FAFC', padding: '0.5rem 1rem', fontSize: '0.7rem', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', borderTop: '1px solid #E2E8F0' }}>
            <ShieldCheck size={14} color="#16A34A" />
            <span>Official AutoZon WhatsApp Support Desk (+91 8591719499)</span>
          </div>
        </div>
      )}
    </>
  );
};
