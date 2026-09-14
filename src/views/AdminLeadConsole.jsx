import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { enquiryQuotationService } from '../services/enquiryQuotationService';
import {
  Layers, User, Phone, MessageSquare, ArrowRight, DollarSign, Calendar, RefreshCw, CheckCircle2
} from 'lucide-react';

export const AdminLeadConsole = () => {
  const { showToast } = useStore();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPipeline();
  }, []);

  const loadPipeline = async () => {
    setLoading(true);
    try {
      const data = await enquiryQuotationService.getEnquiries({ status: 'all' });
      setEnquiries(data || []);
    } catch (err) {
      console.error('Error loading pipeline:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStageChange = async (enquiryId, newStatus) => {
    try {
      const res = await enquiryQuotationService.updateEnquiryStatus(enquiryId, newStatus);
      if (res.success) {
        showToast(`Lead moved to ${newStatus.toUpperCase()}`, 'success');
        setEnquiries(prev => prev.map(e => e.id === enquiryId ? { ...e, status: newStatus } : e));
      }
    } catch (err) {
      showToast('Error updating lead stage', 'error');
    }
  };

  const stages = [
    { key: 'new', title: 'New Leads', color: '#3b82f6', bg: '#eff6ff' },
    { key: 'contacted', title: 'Contacted', color: '#f59e0b', bg: '#fffbeb' },
    { key: 'quote_sent', title: 'Quote Issued', color: '#8b5cf6', bg: '#f5f3ff' },
    { key: 'converted', title: 'Converted (Won)', color: '#10b981', bg: '#ecfdf5' },
    { key: 'lost', title: 'Lost / Closed', color: '#ef4444', bg: '#fef2f2' }
  ];

  return (
    <div style={{ padding: '1.5rem', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F2167', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Layers color="#FF6B00" size={28} /> Sales Lead Pipeline
          </h1>
          <p style={{ color: '#64748b', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
            Visual kanban board to track spare part enquiry stages from first contact to deal conversion.
          </p>
        </div>

        <button
          onClick={loadPipeline}
          style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#475569', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RefreshCw size={16} /> Refresh Board
        </button>
      </div>

      {/* Kanban Board Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', alignItems: 'start' }}>
        {stages.map(stage => {
          const stageItems = enquiries.filter(e => (e.status || 'new') === stage.key);
          return (
            <div key={stage.key} style={{ background: '#ffffff', borderRadius: '12px', border: `1px solid ${stage.color}40`, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
              {/* Stage Header */}
              <div style={{ background: stage.bg, padding: '0.85rem 1rem', borderBottom: `2px solid ${stage.color}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: stage.color, fontSize: '0.9rem' }}>{stage.title}</span>
                <span style={{ background: stage.color, color: '#ffffff', borderRadius: '12px', padding: '0.1rem 0.5rem', fontSize: '0.75rem', fontWeight: 800 }}>
                  {stageItems.length}
                </span>
              </div>

              {/* Cards Container */}
              <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '400px' }}>
                {loading ? (
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>Loading...</div>
                ) : stageItems.length === 0 ? (
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', padding: '2rem', fontStyle: 'italic' }}>
                    No leads in this stage
                  </div>
                ) : (
                  stageItems.map(item => (
                    <div
                      key={item.id}
                      style={{
                        background: '#ffffff',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        padding: '0.85rem',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                        transition: 'transform 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 700, color: '#FF6B00' }}>
                          {item.enquiry_number}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F2167', marginBottom: '0.2rem' }}>
                        {item.customer_name}
                      </div>

                      <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.subject}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px dashed #e2e8f0', fontSize: '0.75rem' }}>
                        <a
                          href={`https://wa.me/91${item.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#25D366', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                        >
                          <MessageSquare size={12} /> {item.phone}
                        </a>

                        {/* Move Stage Selector */}
                        <select
                          value={item.status || 'new'}
                          onChange={e => handleStageChange(item.id, e.target.value)}
                          style={{ fontSize: '0.7rem', padding: '0.1rem 0.3rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
                        >
                          {stages.map(s => (
                            <option key={s.key} value={s.key}>{s.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default AdminLeadConsole;
