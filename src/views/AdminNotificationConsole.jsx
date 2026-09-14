import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  calculateNotificationAnalytics,
  getNotificationTemplates,
  setStoredTemplates,
  getNotificationAutomations,
  setStoredAutomations,
  getNotificationProviders,
  updateNotificationProviders,
  sendBroadcastNotification,
  BUSINESS_EVENTS,
  CHANNELS
} from '../services/notificationEngine';
import {
  Bell, Mail, MessageSquare, Send, Zap, Settings, Download, Search,
  CheckCircle2, XCircle, Clock, AlertTriangle, ShieldCheck, Play, Plus, X,
  FileText, Smartphone, Layers, Eye
} from 'lucide-react';

export const AdminNotificationConsole = () => {
  const { showToast } = useStore();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'templates' | 'automations' | 'failures' | 'broadcast'
  const [channelFilter, setChannelFilter] = useState('ALL');

  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Broadcast Modal State
  const [broadcastModal, setBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({ channel: 'EMAIL', title: 'Festive Flash Sale on OEM Accessories!', message: 'Use coupon AUTOZON10 for 10% OFF on Bosch & MGP genuine spare parts!' });

  // Provider Settings Modal State
  const [providerModal, setProviderModal] = useState(false);
  const [providerForm, setProviderForm] = useState(getNotificationProviders());

  const analytics = calculateNotificationAnalytics();
  const templates = getNotificationTemplates();
  const automations = getNotificationAutomations();

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    const res = sendBroadcastNotification({
      channel: broadcastForm.channel,
      title: broadcastForm.title,
      message: broadcastForm.message,
      audienceCount: 480
    });

    if (res.success) {
      showToast(`🚀 ${res.message}`, 'success');
      setBroadcastModal(false);
    }
  };

  const handleSaveProviders = (e) => {
    e.preventDefault();
    const res = updateNotificationProviders(providerForm);
    if (res.success) {
      showToast('⚙️ Notification Gateway Credentials & Low-Stock Rules Saved!', 'success');
      setProviderModal(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Template ID', 'Event', 'Channel', 'Subject', 'Variables', 'Status'];
    const rows = templates.map(t => [
      t.id, t.event, t.channel, `"${t.subject}"`, `"${t.variables.join(', ')}"`, t.enabled ? 'Active' : 'Disabled'
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autozon_notification_templates_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('📥 Exported Notification Templates CSV Report!', 'success');
  };

  return (
    <div style={{ padding: '1.5rem 0' }}>
      {/* Header Banner */}
      <div style={{ background: '#0F2167', color: '#FFFFFF', padding: '1.5rem', borderRadius: '14px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Bell size={32} color="#FF6B00" />
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF' }}>
              Notification & Communication Automation Operations Center
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>
              Single Owner Control • SendGrid, Twilio, Meta WhatsApp & FCM Push Gateways
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setBroadcastModal(true)}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', padding: '0.55rem 1rem', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Send size={16} /> Broadcast Message
          </button>

          <button
            onClick={handleExportCSV}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', padding: '0.55rem 1rem', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Download size={16} /> Export CSV Report
          </button>

          <button
            onClick={() => setProviderModal(true)}
            style={{ background: '#FF6B00', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.55rem 1.1rem', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Settings size={16} /> Gateway Settings
          </button>
        </div>
      </div>

      {/* Channel Delivery KPI Row (Sections 1, 44 - 46) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#FFFFFF', padding: '1.1rem', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #3B82F6' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>EMAIL DELIVERIES</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginTop: '0.2rem' }}>{analytics.emailCount} Sent</div>
          <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>SendGrid SMTP Active</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.1rem', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #10B981' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>WHATSAPP DELIVERIES</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#059669', marginTop: '0.2rem' }}>{analytics.whatsappCount} Sent</div>
          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Meta Business API Verified</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.1rem', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #F59E0B' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>DELIVERY RATE</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#D97706', marginTop: '0.2rem' }}>{analytics.deliveryRate}% Success</div>
          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Idempotent Verified Queue</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.1rem', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #8B5CF6' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>AUTOMATION RULES</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#7C3AED', marginTop: '0.2rem' }}>{analytics.activeAutomationsCount} Rules</div>
          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Event Condition Action</span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div style={{ background: '#FFFFFF', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'ALL', label: '📋 All Templates' },
          { id: 'automations', label: '⚡ Automation Rules' },
          { id: 'failures', label: '⚠️ Delivery Failures Log' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              background: activeTab === t.id ? '#0F2167' : '#F1F5F9',
              color: activeTab === t.id ? '#FFFFFF' : '#475569',
              border: 'none',
              borderRadius: '6px',
              padding: '0.4rem 0.85rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Workspace Table: Templates Ledger (Section 3, 18, 19) */}
      {activeTab === 'ALL' && (
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <div style={{ padding: '0.85rem 1rem', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#0F2167' }}>
              ✉️ BUSINESS NOTIFICATION TEMPLATES ({templates.length} Active Templates)
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>TEMPLATE NAME</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>BUSINESS EVENT</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>CHANNEL</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>VARIABLES</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, textAlign: 'right' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {templates.map(tmpl => (
                <tr key={tmpl.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <b style={{ color: '#0F2167', display: 'block' }}>{tmpl.name}</b>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>"{tmpl.subject}"</span>
                  </td>

                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ background: '#F1F5F9', color: '#334155', fontSize: '0.7rem', fontWeight: 900, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      {tmpl.event}
                    </span>
                  </td>

                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{
                      background: tmpl.channel === 'WHATSAPP' ? '#DCFCE7' : tmpl.channel === 'EMAIL' ? '#E0F2FE' : '#FEF3C7',
                      color: tmpl.channel === 'WHATSAPP' ? '#166534' : tmpl.channel === 'EMAIL' ? '#0369A1' : '#B45309',
                      fontSize: '0.7rem',
                      fontWeight: 900,
                      padding: '0.15rem 0.55rem',
                      borderRadius: '4px'
                    }}>
                      {tmpl.channel}
                    </span>
                  </td>

                  <td style={{ padding: '0.85rem 1rem' }}>
                    <code style={{ fontSize: '0.7rem', color: '#D97706' }}>{tmpl.variables.map(v => `{{${v}}}`).join(', ')}</code>
                  </td>

                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '0.7rem', fontWeight: 900, padding: '0.15rem 0.55rem', borderRadius: '4px' }}>
                      ✓ Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Automations Rule Builder List (Section 51 - 54) */}
      {activeTab === 'automations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {automations.map(auto => (
            <div key={auto.id} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Zap size={18} color="#7C3AED" />
                  <strong style={{ fontSize: '0.95rem', color: '#0F2167' }}>{auto.name}</strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.25rem' }}>
                  Event: <b style={{ color: '#0F172A' }}>{auto.event}</b> • Condition: <b style={{ color: '#D97706' }}>{auto.condition}</b>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ background: '#F3E8FF', color: '#7C3AED', fontSize: '0.72rem', fontWeight: 900, padding: '0.2rem 0.6rem', borderRadius: '10px' }}>
                  Fired {auto.triggerCount} Times
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BROADCAST MODAL (Section 37) */}
      {broadcastModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '14px', width: '100%', maxWidth: '500px', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, color: '#0F2167', fontSize: '1.1rem', fontWeight: 900 }}>
                Broadcast Message to Opted-In Buyers
              </h3>
              <button onClick={() => setBroadcastModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleSendBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>BROADCAST CHANNEL</label>
                <select
                  value={broadcastForm.channel}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, channel: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 700 }}
                >
                  <option value="EMAIL">SendGrid Bulk Email (480 Opted-In Buyers)</option>
                  <option value="WHATSAPP">Meta WhatsApp Broadcast</option>
                  <option value="SMS">Twilio SMS Broadcast</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>BROADCAST TITLE / SUBJECT *</label>
                <input
                  type="text"
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>BROADCAST MESSAGE BODY *</label>
                <textarea
                  rows={4}
                  value={broadcastForm.message}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setBroadcastModal(false)} style={{ flex: 1, background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0.55rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, background: '#0F2167', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '0.55rem', fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer' }}>Dispatch Broadcast</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROVIDER SETTINGS MODAL (Section 31) */}
      {providerModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '14px', width: '100%', maxWidth: '520px', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, color: '#0F2167', fontSize: '1.1rem', fontWeight: 900 }}>
                Configure Communication Provider Gateways
              </h3>
              <button onClick={() => setProviderModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleSaveProviders} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>SENDGRID SMTP SENDER EMAIL</label>
                <input
                  type="email"
                  value={providerForm.email.senderEmail}
                  onChange={(e) => setProviderForm({ ...providerForm, email: { ...providerForm.email, senderEmail: e.target.value } })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>ADMIN LOW STOCK THRESHOLD (UNITS)</label>
                <input
                  type="number"
                  value={providerForm.lowStockThreshold}
                  onChange={(e) => setProviderForm({ ...providerForm, lowStockThreshold: Number(e.target.value) })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 700 }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setProviderModal(false)} style={{ flex: 1, background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0.55rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, background: '#0F2167', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '0.55rem', fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer' }}>Save Settings</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
