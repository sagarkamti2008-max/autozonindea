import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { enquiryQuotationService } from '../services/enquiryQuotationService';
import {
  Calendar, Clock, CheckCircle2, Phone, MessageSquare, Mail, AlertTriangle, RefreshCw
} from 'lucide-react';

export const AdminFollowUpConsole = () => {
  const { showToast } = useStore();
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today'); // 'overdue', 'today', 'upcoming', 'completed'

  useEffect(() => {
    loadFollowups();
  }, [activeTab]);

  const loadFollowups = async () => {
    setLoading(true);
    try {
      const data = await enquiryQuotationService.getFollowups({ filter: activeTab });
      setFollowups(data || []);
    } catch (err) {
      console.error('Error loading followups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      const res = await enquiryQuotationService.completeFollowup(id, 'Completed by Sales Desk');
      if (res.success) {
        showToast('Follow-up marked as completed!', 'success');
        loadFollowups();
      }
    } catch (err) {
      showToast('Error updating follow-up', 'error');
    }
  };

  return (
    <div style={{ padding: '1.5rem', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F2167', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Calendar color="#FF6B00" size={28} /> Sales Follow-Ups Tracker
          </h1>
          <p style={{ color: '#64748b', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
            Never miss a potential sale. Manage scheduled customer call-backs, WhatsApp messages, and quote follow-ups.
          </p>
        </div>

        <button
          onClick={loadFollowups}
          style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#475569', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', pb: '0.5rem' }}>
        {[
          { key: 'today', title: "Today's Follow-ups" },
          { key: 'overdue', title: 'Overdue Task Alert' },
          { key: 'upcoming', title: 'Upcoming' },
          { key: 'completed', title: 'Completed' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.65rem 1.2rem',
              borderRadius: '8px',
              fontWeight: activeTab === tab.key ? 800 : 600,
              fontSize: '0.88rem',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === tab.key ? '#0F2167' : 'transparent',
              color: activeTab === tab.key ? '#ffffff' : '#64748b'
            }}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Followup Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading scheduled tasks...</div>
        ) : followups.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            No follow-up tasks found for this view.
          </div>
        ) : (
          followups.map(item => (
            <div key={item.id} style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  background: item.followup_type === 'whatsapp' ? '#dcfce7' : '#e0f2fe',
                  color: item.followup_type === 'whatsapp' ? '#15803d' : '#0369a1'
                }}>
                  {(item.followup_type || 'FOLLOWUP').toUpperCase()}
                </span>

                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={14} /> {new Date(item.scheduled_at).toLocaleString()}
                </span>
              </div>

              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0F2167', marginBottom: '0.3rem' }}>
                Ref: {item.enquiry?.enquiry_number || 'ENQ-TASK'}
              </div>

              <div style={{ fontSize: '0.88rem', color: '#334155', marginBottom: '0.75rem' }}>
                <strong>Customer:</strong> {item.enquiry?.customer_name || 'Customer'} ({item.enquiry?.phone})
              </div>

              {item.notes && (
                <div style={{ background: '#f8fafc', padding: '0.6rem', borderRadius: '6px', fontSize: '0.82rem', color: '#475569', marginBottom: '1rem', fontStyle: 'italic' }}>
                  "{item.notes}"
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                {item.enquiry?.phone && (
                  <a
                    href={`https://wa.me/91${item.enquiry.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ background: '#25D366', color: '#ffffff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <MessageSquare size={14} /> Contact
                  </a>
                )}

                {item.status !== 'completed' && (
                  <button
                    onClick={() => handleComplete(item.id)}
                    style={{ background: '#0F2167', color: '#ffffff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <CheckCircle2 size={14} color="#22c55e" /> Done
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default AdminFollowUpConsole;
