import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { loginAdminWithEmail } from '../services/firebaseService';
import { ShieldCheck, Lock, Mail, ArrowRight, Key, AlertCircle } from 'lucide-react';
import { ADMIN_MASTER_PASSCODE } from '../components/AdminLockModal';

export const AdminLogin = () => {
  const { unlockAdminConsole, navigateTo, showToast } = useStore();
  const [email, setEmail] = useState('admin@autozonindia.com');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (password.trim() === ADMIN_MASTER_PASSCODE) {
      unlockAdminConsole();
      showToast('🔒 Welcome to Kamti Automotive Admin Console!');
      navigateTo('admin');
      setIsSubmitting(false);
      return;
    }

    try {
      await loginAdminWithEmail(email, password);
      unlockAdminConsole();
      showToast('🔒 Firebase Admin Authentication Successful!');
      navigateTo('admin');
    } catch (err) {
      console.warn('Firebase login attempt notice:', err.message);
      setError('❌ Invalid Master Admin Passcode! Access Denied.');
      showToast('❌ Access Denied: Incorrect Master Passcode');
    } finally {
      setIsSubmitting(false);
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

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3 rounded-xl mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Admin Work Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Master Admin Passcode</label>
            <input type="password" placeholder="Enter Kamti Admin Passcode" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-navy btn-full">
            {isSubmitting ? 'Authenticating...' : 'Sign In to Admin Console'} <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
