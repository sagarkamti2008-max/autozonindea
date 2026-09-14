import React, { useState } from 'react';
import { Truck, Phone, MessageCircle, ShieldCheck, MapPin, Clock, Key, CheckCircle2, Navigation, X } from 'lucide-react';

export const LiveDeliveryTrackerModal = ({ isOpen, onClose, orderData }) => {
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');

  if (!isOpen) return null;

  const order = orderData || {
    id: 'ORD-98214',
    courierName: 'Porter 2-Hour Express Delivery',
    driverName: 'Ramesh Kumar',
    driverRating: '4.9 ⭐',
    driverPhone: '+91 9821098210',
    vehicleNumber: 'MH-02-EE-8921 (TVS King Cargo)',
    eta: '10 Mins Away (1.2 KM)',
    otp: '4921',
    items: [
      { name: 'KEVL 5W-30 Synthetic Engine Oil 3.5L', qty: 1 },
      { name: 'Ceramic Front Brake Pads (Set of 4)', qty: 1 }
    ]
  };

  const handleCopyOtp = () => {
    navigator.clipboard.writeText(order.otp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (enteredOtp === order.otp) {
      setIsOtpVerified(true);
    } else {
      alert('Invalid OTP. Please enter 4921');
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999, padding: '1rem' }}>
      <div style={{ background: '#FFFFFF', width: '750px', maxHeight: '90vh', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
        
        {/* Modal Top Header */}
        <div style={{ background: '#0F2167', color: '#FFFFFF', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Truck size={24} color="#FF6B00" />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF' }}>
                🛵 Live Delivery Agent Tracker & OTP Verification
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>
                Order #{order.id} • {order.courierName}
              </span>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          
          {/* Status Header Banner */}
          <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ background: '#166534', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 900, padding: '0.15rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                LIVE DELIVERY STATUS
              </span>
              <h4 style={{ margin: '0.35rem 0 0 0', fontSize: '1.1rem', fontWeight: 900, color: '#166534' }}>
                🛵 Out for Delivery ({order.eta})
              </h4>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Estimated Arrival:</span>
              <b style={{ fontSize: '1rem', color: '#0F2167' }}>Today by 6:15 PM</b>
            </div>
          </div>

          {/* OTP Handover Verification Card */}
          <div style={{ background: 'linear-gradient(135deg, #0F2167 0%, #1E3A8A 100%)', color: '#FFFFFF', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem', boxShadow: '0 8px 24px rgba(15,33,103,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FF6B00', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Key size={14} color="#FF6B00" /> SECURE HANDOVER OTP:
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                  {order.otp.split('').map((digit, idx) => (
                    <div key={idx} style={{ background: '#FFFFFF', color: '#0F2167', width: '42px', height: '48px', borderRadius: '8px', fontSize: '1.5rem', fontWeight: 900, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
                      {digit}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <button
                  onClick={handleCopyOtp}
                  style={{ background: '#FF6B00', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.4rem' }}
                >
                  <Key size={14} /> {copiedOtp ? '✓ Copied!' : 'Copy OTP'}
                </button>
                <span style={{ fontSize: '0.72rem', color: '#93C5FD' }}>
                  Share this OTP with driver Ramesh upon arrival
                </span>
              </div>
            </div>

            {/* Test OTP Verification Box */}
            <form onSubmit={handleVerifyOtp} style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.15)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#E2E8F0' }}>Simulate Delivery Verification:</span>
              <input
                type="text"
                placeholder="Enter 4-Digit OTP"
                maxLength={4}
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                style={{ width: '120px', padding: '0.4rem 0.6rem', borderRadius: '6px', border: 'none', outline: 'none', fontSize: '0.85rem', textAlign: 'center', fontWeight: 800 }}
              />
              <button type="submit" style={{ background: '#10B981', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '0.4rem 0.85rem', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}>
                Verify & Handover
              </button>
              {isOtpVerified && <span style={{ color: '#86EFAC', fontSize: '0.78rem', fontWeight: 900 }}>✓ OTP VERIFIED & PARCEL DELIVERED!</span>}
            </form>
          </div>

          {/* Driver & Vehicle Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            {/* Driver Profile */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '48px', height: '48px', background: '#0F2167', color: '#FFFFFF', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', fontWeight: 900 }}>
                  👨‍✈️
                </div>
                <div>
                  <h5 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 900, color: '#0F2167' }}>
                    {order.driverName}
                  </h5>
                  <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 800 }}>
                    Porter Verified Agent ({order.driverRating})
                  </span>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                    Vehicle: <code>{order.vehicleNumber}</code>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <a
                  href={`tel:${order.driverPhone}`}
                  style={{ background: '#059669', color: '#FFFFFF', textDecoration: 'none', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <Phone size={13} /> Call
                </a>
                <a
                  href={`https://wa.me/${order.driverPhone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ background: '#25D366', color: '#FFFFFF', textDecoration: 'none', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <MessageCircle size={13} /> WhatsApp
                </a>
              </div>
            </div>

            {/* Delivery Progress Bar */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 800, color: '#0F2167', marginBottom: '0.5rem' }}>
                <span>Delivery Progress:</span>
                <span style={{ color: '#059669' }}>85% Completed</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: '#E2E8F0', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #FF6B00, #10B981)', borderRadius: '5px' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748B', marginTop: '0.4rem' }}>
                <span>MIDC Hub</span>
                <span>En Route (Andheri)</span>
                <span>Your Location ✓</span>
              </div>
            </div>
          </div>

          {/* Package Content Inspector */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem' }}>
            <h5 style={{ margin: '0 0 0.6rem 0', fontSize: '0.85rem', fontWeight: 900, color: '#0F2167' }}>
              📦 Package Items Inside Delivery Box:
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#334155', background: '#FFFFFF', padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}>
                  <span><b>{item.name}</b></span>
                  <span style={{ fontWeight: 800, color: '#0F2167' }}>Qty: {item.qty}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
