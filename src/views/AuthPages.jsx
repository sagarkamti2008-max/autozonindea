import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { User, Lock, Mail, Phone, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginView = () => {
  const { navigateTo, setCurrentRole, showToast } = useStore();
  const [email, setEmail] = useState('customer@example.com');
  const [password, setPassword] = useState('password123');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setCurrentRole('customer');
    showToast('Welcome back to AutoZonIndia! Logged in successfully.');
    navigateTo('my-account');
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem', maxWidth: '480px' }}>
      <div className="portal-card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <User size={36} color="#FF6B00" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Login to AutoZonIndia</h2>
          <p style={{ color: '#64748B', fontSize: '0.85rem' }}>Access your saved garage, orders & fast checkout</p>
        </div>

        <form onSubmit={handleLoginSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Email / Phone Number</label>
            <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit" className="btn-primary btn-full">
            Sign In <ArrowRight size={16} />
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748B', marginTop: '1.5rem' }}>
          Don't have an account? <button style={{ background: 'none', color: '#FF6B00', fontWeight: 800 }} onClick={() => navigateTo('signup')}>Create Account</button>
        </p>
      </div>
    </div>
  );
};

export const SignupView = () => {
  const { navigateTo, setCurrentRole, showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !phone) return;
    setCurrentRole('customer');
    showToast('🎉 Account Created Successfully! Welcome to AutoZonIndia.');
    navigateTo('my-account');
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem', maxWidth: '520px' }}>
      <div className="portal-card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <ShieldCheck size={36} color="#0F2167" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Create Your Account</h2>
          <p style={{ color: '#64748B', fontSize: '0.85rem' }}>Join 500,000+ car owners & mechanics nationwide</p>
        </div>

        <form onSubmit={handleSignupSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Full Name *</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rahul Sharma" />
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Email Address *</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="rahul@example.com" />
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Phone Number *</label>
            <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Password *</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit" className="btn-primary btn-full">
            Register & Start Shopping <ArrowRight size={16} />
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748B', marginTop: '1.5rem' }}>
          Already have an account? <button style={{ background: 'none', color: '#0F2167', fontWeight: 800 }} onClick={() => navigateTo('login')}>Log In</button>
        </p>
      </div>
    </div>
  );
};
