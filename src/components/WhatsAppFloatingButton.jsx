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
      {/* Floating Green WhatsApp Trigger Button - Positioned on bottom-left on desktop to avoid blocking cart order summary */}
      <button
        className="whatsapp-floating-trigger fixed bottom-[76px] left-3 md:bottom-6 md:left-6 md:right-auto z-[9999] bg-[#25D366] text-white border-2 border-white rounded-full px-3.5 py-2.5 sm:px-5 sm:py-3 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-[0_8px_25px_rgba(37,211,102,0.45)] cursor-pointer hover:scale-105 transition-transform"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle size={20} color="#FFFFFF" fill="#FFFFFF" className="shrink-0" />
        <span className="font-extrabold tracking-tight">WhatsApp Order &amp; Help</span>
        <span className="w-2.5 h-2.5 bg-white rounded-full border-2 border-[#25D366] shrink-0"></span>
      </button>

      {/* WhatsApp Interactive Quick Drawer / Modal */}
      {isOpen && (
        <div
          className="whatsapp-floating-drawer fixed bottom-[130px] left-3 md:bottom-[85px] md:left-6 md:right-auto w-[calc(100vw-24px)] sm:w-[360px] max-w-[360px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-[99999] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {/* Header */}
          <div style={{ background: '#075E54', color: '#FFFFFF', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', background: '#25D366', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <MessageCircle size={24} color="#FFFFFF" fill="#FFFFFF" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: '#FFFFFF' }}>
                  KAMTI AUTOMOTIVE Support Desk
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
              <b>👋 Hello! Welcome to KAMTI AUTOMOTIVE Support Desk.</b>
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
            <span>Official KAMTI AUTOMOTIVE Support Desk (+91 8591719499)</span>
          </div>
        </div>
      )}
    </>
  );
};
