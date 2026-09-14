import React, { useState } from 'react';
import {
  CreditCard, ShieldCheck, CheckCircle2, AlertCircle, X, Zap,
  Building, Lock, ArrowRight, Download, Check
} from 'lucide-react';

export const RazorpayPaymentModal = ({ isOpen, onClose, grandTotal, customerInfo, onPaymentSuccess }) => {
  const [paymentStep, setPaymentStep] = useState('select_method'); // 'select_method', 'processing', 'success', 'failed'
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [transactionDetails, setTransactionDetails] = useState(null);

  if (!isOpen) return null;

  const handleSimulateRazorpay = () => {
    setPaymentStep('processing');

    setTimeout(() => {
      const paymentId = `pay_RZP_2026_${Math.floor(10000000 + Math.random() * 90000000)}`;
      const orderId = `order_RZP_${Math.floor(10000000 + Math.random() * 90000000)}`;
      const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

      const txInfo = {
        paymentId,
        orderId,
        amount: grandTotal,
        method: selectedUpiApp.toUpperCase(),
        date,
        status: 'PAID / PROCESSING'
      };

      setTransactionDetails(txInfo);
      setPaymentStep('success');
      if (onPaymentSuccess) onPaymentSuccess(txInfo);
    }, 2000);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(11, 15, 23, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '20px', maxWidth: '520px', width: '100%', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>

        {/* Modal Header */}
        <div style={{ background: 'linear-[#0B0F17]', padding: '1.25rem 1.5rem', borderBottom: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: '#FF6B00', padding: '0.4rem', borderRadius: '8px', color: '#FFFFFF' }}>
              <Zap size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#FFFFFF' }}>Sagar Travels Razorpay Checkout</div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>256-Bit SSL Encrypted Online Payment Gateway</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem' }}>

          {/* STEP 1: METHOD SELECTION */}
          {paymentStep === 'select_method' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: '#1E293B', border: '1px solid #334155', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Amount Payable</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FFFFFF' }}>₹{grandTotal.toLocaleString()}</div>
                </div>
                <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontSize: '0.7rem', fontWeight: 900, padding: '0.25rem 0.6rem', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  ✓ 2% UPI DISCOUNT APPLIED
                </span>
              </div>

              {/* UPI Options Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#CBD5E1' }}>Select Instant UPI App</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {[
                    { id: 'gpay', label: 'Google Pay', icon: '🌀' },
                    { id: 'phonepe', label: 'PhonePe', icon: '🟣' },
                    { id: 'paytm', label: 'Paytm', icon: '🔵' },
                    { id: 'bhim', label: 'BHIM UPI', icon: '🇮🇳' }
                  ].map(app => (
                    <button
                      key={app.id}
                      onClick={() => setSelectedUpiApp(app.id)}
                      style={{
                        padding: '0.75rem 0.5rem',
                        borderRadius: '10px',
                        border: selectedUpiApp === app.id ? '2px solid #00E5FF' : '1px solid #334155',
                        background: selectedUpiApp === app.id ? 'rgba(0, 229, 255, 0.1)' : '#0B0F17',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.2rem'
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{app.icon}</span>
                      <span>{app.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSimulateRazorpay}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #FF6B00, #EA580C)',
                  color: '#FFFFFF',
                  padding: '0.85rem',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(255,107,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '0.5rem'
                }}
              >
                <Lock size={16} /> Pay ₹{grandTotal.toLocaleString()} via Razorpay
              </button>
            </div>
          )}

          {/* STEP 2: PROCESSING ANIMATION */}
          {paymentStep === 'processing' && (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ width: '48px', height: '48px', border: '4px solid #FF6B00', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 1.25rem auto', animation: 'spin 1s linear infinite' }}></div>
              <h4 style={{ color: '#FFFFFF', margin: 0, fontWeight: 900, fontSize: '1.1rem' }}>Processing Payment...</h4>
              <p style={{ color: '#94A3B8', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                Connecting to Razorpay & {selectedUpiApp.toUpperCase()} Gateway server...
              </p>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* STEP 3: PAYMENT SUCCESS MODAL & ORDER STATUS UPDATED */}
          {paymentStep === 'success' && transactionDetails && (
            <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: '#10B981' }}>
                <Check size={32} />
              </div>

              <h3 style={{ color: '#FFFFFF', fontSize: '1.35rem', fontWeight: 900, margin: 0 }}>Payment Successful! 🎉</h3>
              <p style={{ color: '#34D399', fontSize: '0.85rem', fontWeight: 800, marginTop: '0.25rem' }}>
                Order Status Updated: <strong>PAID / PROCESSING</strong>
              </p>

              <div style={{ background: '#0B0F17', border: '1px solid #1E293B', padding: '1rem', borderRadius: '12px', margin: '1.25rem 0', textAlign: 'left', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94A3B8' }}>Razorpay Payment ID:</span><strong style={{ color: '#00E5FF' }}>{transactionDetails.paymentId}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94A3B8' }}>Order ID:</span><strong style={{ color: '#FFFFFF' }}>{transactionDetails.orderId}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94A3B8' }}>Amount Paid:</span><strong style={{ color: '#FFFFFF' }}>₹{transactionDetails.amount.toLocaleString()}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94A3B8' }}>Method:</span><strong style={{ color: '#FFFFFF' }}>UPI ({transactionDetails.method})</strong></div>
              </div>

              <button
                onClick={onClose}
                style={{ width: '100%', background: '#10B981', color: '#FFFFFF', padding: '0.8rem', border: 'none', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', fontSize: '0.9rem' }}
              >
                View Order Status & Invoice
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
