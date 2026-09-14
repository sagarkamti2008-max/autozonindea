import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Lock, Mail, ArrowRight, Key, AlertCircle } from 'lucide-react';

export const AdminLogin = () => {
  const { setCurrentRole, navigateTo, showToast } = useStore();
  const [email, setEmail] = useState('admin@autozonindia.com');
  const [password, setPassword] = useState('admin123');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [step, setStep] = useState(1); // 1: Password, 2: 2FA Prompt

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      showToast('2FA Verification code sent to admin authenticator app.');
    } else {
      setCurrentRole('admin');
      showToast('🔒 Super Admin Authentication Successful! Welcome to Control Center.');
      navigateTo('admin');
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '480px' }}>
      <div className="portal-card" style={{ borderTop: '4px solid #0F2167' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <ShieldCheck size={42} color="#0F2167" />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'Outfit' }}>AutoZonIndia Admin Console</h2>
          <p style={{ color: '#64748B', fontSize: '0.85rem' }}>Enterprise Operations & System Management</p>
        </div>

        <form onSubmit={handleLoginSubmit}>
          {step === 1 ? (
            <>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Admin Work Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Master Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <button type="submit" className="btn-navy btn-full">
                Verify Credentials <ArrowRight size={16} />
              </button>
            </>
          ) : (
            <>
              <div style={{ background: '#F1F5F9', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', color: '#334155' }}>
                <Key size={16} color="#FF6B00" style={{ display: 'inline', marginRight: '0.3rem' }} />
                Enter 6-digit authenticator code to finalize login.
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>2FA Authentication Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 849201"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary btn-full">
                Authenticate & Enter Console <ArrowRight size={16} />
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
