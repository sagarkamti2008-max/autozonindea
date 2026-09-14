import React, { useState } from 'react';
import { MessageSquare, Send, Smartphone, CheckCircle2, ShieldCheck, X, Bell, Zap, RefreshCw } from 'lucide-react';

export const SMSWhatsAppSimulatorModal = ({ isOpen, onClose }) => {
  const [phone, setPhone] = useState('+91 8591719499');
  const [channel, setChannel] = useState('WHATSAPP'); // 'WHATSAPP' | 'SMS' | 'EMAIL'
  const [eventType, setEventType] = useState('ORDER_CONFIRMED');
  const [logs, setLogs] = useState([]);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const eventTemplates = {
    ORDER_CONFIRMED: {
      title: '📦 Order Confirmation Alert',
      whatsapp: '🚗 *AutoZon India Order Confirmed!*\n\nHi Sagar! Your spare parts order #ORD-98214 (KEVL 5W-30 Synthetic Oil & Ceramic Brake Pads) has been successfully placed.\n\n*Amount Paid:* ₹2,499 via UPI\n*Estimated Delivery:* Tomorrow 2:00 PM\n\nTrack Order: https://autozonindia.vercel.app',
      sms: 'AUTOZN: Hi Sagar! Your AutoZon Order #ORD-98214 for ₹2,499 is CONFIRMED. Express dispatch in progress. Track: https://autozonindia.vercel.app'
    },
    ORDER_SHIPPED: {
      title: '🚚 Express Shipping Dispatch Alert',
      whatsapp: '⚡ *AutoZon Dispatch Update*\n\nGreat news! Your order #ORD-98214 has been dispatched via *Delhivery Express Air Courier*.\n\n*AWB Tracking #:* DEL98214012\n*Courier Contact:* +91 9821098210\n\nLive Delivery Status: https://autozonindia.vercel.app',
      sms: 'AUTOZN: Order #ORD-98214 SHIPPED via Delhivery AWB# DEL98214012. Expected delivery tomorrow by 2 PM.'
    },
    OUT_FOR_DELIVERY: {
      title: '🛵 Driver Out for Delivery (OTP Alert)',
      whatsapp: '🛵 *Out for Delivery Alert!*\n\nDriver Ramesh (+91 9821098210) is 10 mins away from your location with your spare parts parcel.\n\n*Handover Delivery OTP:* 🔑 *4921*\n\nPlease share this OTP with the delivery agent to receive your parcel.',
      sms: 'AUTOZN: Driver Ramesh (+91 9821098210) is out for delivery. Share OTP 4921 with driver to collect parcel.'
    },
    REFUND_APPROVED: {
      title: '💸 1-Click Refund Success Alert',
      whatsapp: '⚡ *Refund Completed Successfully!*\n\nHi Sagar! Your 1-Click Return Claim for order #ORD-98214 has been approved.\n\n*Amount Refunded:* ₹2,499\n*Credit Account:* UPI / HDFC Bank ****9499\n*Bank Ref:* UPI/428192049182\n\nFunds credited to your account within 5 mins!',
      sms: 'AUTOZN: Refund of ₹2,499 for Order #ORD-98214 credited to your UPI account. Ref: UPI/428192049182.'
    },
    WARRANTY_APPROVED: {
      title: '🛡️ 12-Month Warranty Replacement Dispatched',
      whatsapp: '🛡️ *Warranty Replacement Approved!*\n\nHi Sagar! Your warranty claim #WRN-8812 for Ceramic Brake Pads has been approved under 100% Fitment Guarantee.\n\nNew Replacement Unit Dispatched via Express Courier. Tracking: https://autozonindia.vercel.app',
      sms: 'AUTOZN: Warranty Claim #WRN-8812 Approved! Free replacement unit dispatched via Express Air Courier.'
    }
  };

  const currentTemplate = eventTemplates[eventType];

  const handleTriggerDispatch = () => {
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString('en-IN'),
        phone,
        channel,
        eventType,
        message: channel === 'WHATSAPP' ? currentTemplate.whatsapp : currentTemplate.sms,
        status: 'DELIVERED ✓'
      };
      setLogs([newLog, ...logs]);
    }, 800);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999, padding: '1rem' }}>
      <div style={{ background: '#FFFFFF', width: '850px', maxHeight: '90vh', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
        
        {/* Header */}
        <div style={{ background: '#0F2167', color: '#FFFFFF', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Zap size={22} color="#FF6B00" />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF' }}>
                SMS & WhatsApp Order Notification Live Dispatch Console
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>
                Simulate real-time WhatsApp & SMS alerts for purchases, shipping, and refunds
              </span>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.5rem' }}>
          
          {/* Left Column: Form Controls */}
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                Recipient Phone Number:
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                Notification Channel:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setChannel('WHATSAPP')}
                  style={{
                    background: channel === 'WHATSAPP' ? '#25D366' : '#F1F5F9',
                    color: channel === 'WHATSAPP' ? '#FFFFFF' : '#334155',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  🟢 WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('SMS')}
                  style={{
                    background: channel === 'SMS' ? '#0F2167' : '#F1F5F9',
                    color: channel === 'SMS' ? '#FFFFFF' : '#334155',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  💬 SMS Text
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                Select Event Trigger:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {Object.keys(eventTemplates).map(evKey => (
                  <button
                    key={evKey}
                    type="button"
                    onClick={() => setEventType(evKey)}
                    style={{
                      background: eventType === evKey ? '#FFF7ED' : '#FFFFFF',
                      border: eventType === evKey ? '2px solid #FF6B00' : '1px solid #CBD5E1',
                      color: eventType === evKey ? '#0F2167' : '#475569',
                      borderRadius: '8px',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    {eventTemplates[evKey].title}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleTriggerDispatch}
              disabled={isSending}
              style={{
                width: '100%',
                background: '#FF6B00',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: 900,
                cursor: isSending ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(255,107,0,0.3)'
              }}
            >
              <Send size={18} /> {isSending ? 'Sending Dispatch Alert...' : `⚡ Test Dispatch Notification`}
            </button>
          </div>

          {/* Right Column: Live Phone Mockup Preview & Audit Logs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Phone Screen Mockup */}
            <div style={{ background: '#0F172A', borderRadius: '24px', padding: '1rem', border: '4px solid #334155', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              {/* Phone Notch */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8', fontSize: '0.65rem', marginBottom: '0.85rem', padding: '0 0.5rem' }}>
                <span>9:41 AM</span>
                <span style={{ background: channel === 'WHATSAPP' ? '#25D366' : '#FF6B00', color: '#FFFFFF', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 'bold' }}>
                  {channel} ALERT
                </span>
                <span>100% 🔋</span>
              </div>

              {/* Message Bubble Container */}
              <div style={{ background: channel === 'WHATSAPP' ? '#0B141A' : '#1E293B', borderRadius: '16px', padding: '0.85rem', minHeight: '160px' }}>
                <div style={{ background: channel === 'WHATSAPP' ? '#005C4B' : '#334155', color: '#FFFFFF', borderRadius: '12px', padding: '0.75rem', fontSize: '0.78rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {channel === 'WHATSAPP' ? currentTemplate.whatsapp : currentTemplate.sms}
                  <div style={{ fontSize: '0.62rem', color: '#94A3B8', textAlign: 'right', marginTop: '0.35rem' }}>
                    Just Now • Delivered ✓✓
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Logs Table */}
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', fontWeight: 900, color: '#0F2167' }}>
                📋 Live Dispatch Notification Audit Log ({logs.length})
              </h4>
              {logs.length === 0 ? (
                <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.75rem', color: '#94A3B8' }}>
                  No test notifications dispatched yet. Click "Test Dispatch Notification" above!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '150px', overflowY: 'auto' }}>
                  {logs.map(log => (
                    <div key={log.id} style={{ background: '#F0FDF4', border: '1px solid #86EFAC', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.72rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ color: '#166534' }}>[{log.channel}] {log.eventType}</strong>
                        <div style={{ color: '#475569' }}>Sent to {log.phone} at {log.time}</div>
                      </div>
                      <span style={{ background: '#22C55E', color: '#FFFFFF', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 900 }}>
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
