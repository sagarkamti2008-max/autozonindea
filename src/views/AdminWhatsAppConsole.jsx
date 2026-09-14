import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  calculateWhatsAppAnalytics,
  getWhatsAppConversations,
  getWhatsAppConversationDetail,
  sendWhatsAppOutboundMessage,
  addWhatsAppInternalNote,
  convertWhatsAppToSupportTicket,
  generateAIWhatsAppReplyDraft,
  getWhatsAppTemplates,
  getWhatsAppAutomations,
  getWhatsAppConfig,
  updateWhatsAppConfig
} from '../services/whatsappEngine';
import {
  MessageSquare, Send, Sparkles, Phone, User, CheckCircle2, ShieldCheck,
  Tag, Lock, HelpCircle, Settings, Download, Search, AlertCircle, Plus,
  FileText, Clock, Zap, X, Eye, EyeOff, Layers, Check, CornerDownLeft
} from 'lucide-react';

export const AdminWhatsAppConsole = () => {
  const { showToast } = useStore();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'Open' | 'Waiting for Customer' | 'Resolved'
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedConvId, setSelectedConvId] = useState('wconv-1001');

  // Message Sending Form
  const [replyText, setReplyText] = useState('');

  // Internal Note Form
  const [noteText, setNoteText] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);

  // Provider Settings Modal
  const [providerModal, setProviderModal] = useState(false);
  const [providerForm, setProviderForm] = useState(getWhatsAppConfig());

  const analytics = calculateWhatsAppAnalytics();
  const { conversations } = getWhatsAppConversations({ statusFilter: activeTab, searchQuery });
  const detail = getWhatsAppConversationDetail(selectedConvId);

  const handleSendOutbound = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const res = sendWhatsAppOutboundMessage({
      conversationId: selectedConvId,
      text: replyText
    });

    if (res.success) {
      showToast('💬 WhatsApp Message Sent via Meta WABA API!', 'success');
      setReplyText('');
    } else {
      showToast(`❌ Error: ${res.message}`, 'error');
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    const res = addWhatsAppInternalNote({
      conversationId: selectedConvId,
      noteText
    });

    if (res.success) {
      showToast('🔒 Internal Note Saved (Admin Only)', 'info');
      setNoteText('');
      setShowNoteForm(false);
    }
  };

  const handleConvertToTicket = () => {
    if (!selectedConvId) return;
    const res = convertWhatsAppToSupportTicket({
      conversationId: selectedConvId,
      category: 'Technical Fitment Assistance'
    });

    if (res.success) {
      showToast(`🎫 ${res.message}`, 'success');
    }
  };

  const handleAIAssistReply = () => {
    if (!selectedConvId) return;
    const draft = generateAIWhatsAppReplyDraft(selectedConvId);
    setReplyText(draft);
    showToast('✨ AI WhatsApp reply draft generated! Review & edit before sending.', 'info');
  };

  const handleSaveProviders = (e) => {
    e.preventDefault();
    const res = updateWhatsAppConfig(providerForm);
    if (res.success) {
      showToast('⚙️ WhatsApp Business Integration Settings Saved!', 'success');
      setProviderModal(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Conversation ID', 'Customer', 'Phone', 'Last Message', 'Status', 'Last Activity'];
    const rows = conversations.map(c => [
      c.conversationNumber, `"${c.customerName}"`, `"${c.customerPhone}"`, `"${c.lastMessage}"`, c.status, new Date(c.lastActivity).toISOString()
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autozon_whatsapp_conversations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('📥 Exported WhatsApp Conversations CSV Report!', 'success');
  };

  return (
    <div style={{ padding: '1.5rem 0' }}>
      {/* Header Banner */}
      <div style={{ background: '#0F2167', color: '#FFFFFF', padding: '1.5rem', borderRadius: '14px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MessageSquare size={32} color="#25D366" />
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF' }}>
              WhatsApp Business Automation & Customer Chat Workspace
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>
              Single Owner Store Inbox • Meta WhatsApp Cloud API Verified Gateway
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleExportCSV}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', padding: '0.55rem 1rem', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Download size={16} /> Export CSV Report
          </button>

          <button
            onClick={() => setProviderModal(true)}
            style={{ background: '#25D366', color: '#000000', border: 'none', borderRadius: '8px', padding: '0.55rem 1.1rem', fontSize: '0.82rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Settings size={16} /> WABA Credentials
          </button>
        </div>
      </div>

      {/* WhatsApp Analytics KPI Row (Sections 1, 46 - 49) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#FFFFFF', padding: '1.1rem', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #25D366' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>TOTAL MESSAGES</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginTop: '0.2rem' }}>{analytics.totalMessages} Messages</div>
          <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>{analytics.deliveredCount} Delivered ({analytics.deliveryRate}%)</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.1rem', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #3B82F6' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>ACTIVE CONVERSATIONS</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F2167', marginTop: '0.2rem' }}>{analytics.activeConversations} Open</div>
          <span style={{ fontSize: '0.7rem', color: '#D97706', fontWeight: 700 }}>{analytics.unreadConversations} Unread Threads</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.1rem', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #F59E0B' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>AVG FIRST RESPONSE</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#D97706', marginTop: '0.2rem' }}>{analytics.avgResponseTimeMins} Mins</div>
          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Target SLA &lt; 10m</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.1rem', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #8B5CF6' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>META WABA TEMPLATES</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#7C3AED', marginTop: '0.2rem' }}>{analytics.templatesCount} Approved</div>
          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Utility & Dispatch Templates</span>
        </div>
      </div>

      {/* Main Workspace Split: Inbox List & Chat Inspector (Sections 3, 4, 63) */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.5rem' }}>
        {/* Left Column: Conversations Inbox */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '620px' }}>
          <div style={{ padding: '0.85rem 1rem', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.3rem 0.65rem', marginBottom: '0.65rem' }}>
              <Search size={16} color="#64748B" style={{ marginRight: '0.4rem' }} />
              <input
                type="text"
                placeholder="Search Customer, Phone, Order #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.78rem', width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
              {['ALL', 'Open', 'Waiting for Customer', 'Resolved'].map(st => (
                <button
                  key={st}
                  onClick={() => setActiveTab(st)}
                  style={{
                    background: activeTab === st ? '#0F2167' : '#FFFFFF',
                    color: activeTab === st ? '#FFFFFF' : '#475569',
                    border: '1px solid #CBD5E1',
                    borderRadius: '4px',
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {conversations.map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedConvId(c.id)}
                style={{
                  padding: '0.85rem 1rem',
                  borderBottom: '1px solid #F1F5F9',
                  background: selectedConvId === c.id ? '#F0F9FF' : '#FFFFFF',
                  borderLeft: selectedConvId === c.id ? '4px solid #25D366' : 'none',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#0F2167' }}>{c.customerName}</strong>
                  <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                    {new Date(c.lastActivity).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '0.35rem' }}>
                  {c.lastMessage}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700 }}>{c.customerPhone}</span>
                  {c.unreadCount > 0 && (
                    <span style={{ background: '#25D366', color: '#000000', fontSize: '0.65rem', fontWeight: 900, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {c.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Chat Inspector & Thread Workspace (Sections 4, 18, 19, 40) */}
        {detail ? (
          <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', height: '620px', overflow: 'hidden' }}>
            {/* Thread Header Banner */}
            <div style={{ padding: '0.85rem 1.25rem', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0F2167' }}>{detail.conversation.customerName}</h3>
                  <span style={{ fontSize: '0.72rem', color: '#15803D', fontWeight: 800 }}>{detail.conversation.customerPhone}</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                  Order Context: <b>{detail.conversation.orderId || 'Direct Inquiry'}</b>
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setShowNoteForm(!showNoteForm)}
                  style={{ background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A', borderRadius: '6px', padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Lock size={14} /> Add Internal Note
                </button>

                <button
                  onClick={handleConvertToTicket}
                  style={{ background: '#0F2167', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <HelpCircle size={14} /> Convert to Ticket
                </button>
              </div>
            </div>

            {/* 🔒 Internal Notes Area (Section 40) - Yellow Box, Never Exposed to Customer */}
            {detail.conversation.internalNotes?.length > 0 && (
              <div style={{ background: '#FEF9C3', borderBottom: '1px solid #FEF08A', padding: '0.65rem 1.25rem', fontSize: '0.75rem', color: '#854D0E' }}>
                <strong style={{ display: 'block', marginBottom: '0.2rem' }}>🔒 PRIVATE INTERNAL STORE OWNER NOTES (Admin Only):</strong>
                {detail.conversation.internalNotes.map(n => (
                  <div key={n.id}>• {n.text} <span style={{ opacity: 0.7 }}>({n.author})</span></div>
                ))}
              </div>
            )}

            {/* Note Input Popup */}
            {showNoteForm && (
              <form onSubmit={handleAddNote} style={{ background: '#FFFBEB', padding: '0.75rem 1.25rem', borderBottom: '1px solid #FDE68A', display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Write internal note (hidden from customer)..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  style={{ flex: 1, padding: '0.4rem 0.65rem', borderRadius: '6px', border: '1px solid #FCD34D', fontSize: '0.78rem' }}
                />
                <button type="submit" style={{ background: '#B45309', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '0.4rem 0.75rem', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>Save Note</button>
              </form>
            )}

            {/* Chat Messages Body */}
            <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', background: '#E5DDD5', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {detail.messages.map(m => (
                <div
                  key={m.id}
                  style={{
                    alignSelf: m.sender === 'CUSTOMER' ? 'flex-start' : 'flex-end',
                    maxWidth: '75%',
                    background: m.sender === 'CUSTOMER' ? '#FFFFFF' : '#DCF8C6',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#111827', lineHeight: '1.4' }}>{m.text}</p>
                  <div style={{ textAlign: 'right', fontSize: '0.65rem', color: '#64748B', marginTop: '0.25rem' }}>
                    {new Date(m.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} • {m.status}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Reply Form Workspace */}
            <div style={{ padding: '0.85rem 1.25rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0F2167' }}>💬 WRITE WHATSAPP RESPONSE</span>
                <button
                  onClick={handleAIAssistReply}
                  style={{ background: '#F0F9FF', color: '#0369A1', border: '1px solid #BAE6FD', borderRadius: '6px', padding: '0.2rem 0.55rem', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Sparkles size={12} /> AI Suggested Draft
                </button>
              </div>

              <form onSubmit={handleSendOutbound} style={{ display: 'flex', gap: '0.6rem' }}>
                <input
                  type="text"
                  placeholder="Type WhatsApp reply message..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  style={{ flex: 1, padding: '0.55rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                />
                <button
                  type="submit"
                  style={{ background: '#25D366', color: '#000000', border: 'none', borderRadius: '8px', padding: '0.55rem 1.25rem', fontSize: '0.85rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Send size={16} /> Send
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748B', height: '620px' }}>
            Select a conversation from the left inbox to view chat history.
          </div>
        )}
      </div>

      {/* PROVIDER SETTINGS MODAL (Section 2) */}
      {providerModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '14px', width: '100%', maxWidth: '520px', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, color: '#0F2167', fontSize: '1.1rem', fontWeight: 900 }}>
                Meta WhatsApp Business API Integration
              </h3>
              <button onClick={() => setProviderModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleSaveProviders} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>WEBHOOK VERIFY TOKEN</label>
                <input
                  type="text"
                  value={providerForm.webhookVerifyToken}
                  onChange={(e) => setProviderForm({ ...providerForm, webhookVerifyToken: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>BUSINESS HOURS OUT-OF-HOURS MESSAGE</label>
                <textarea
                  rows={3}
                  value={providerForm.businessHours?.outOfHoursMessage}
                  onChange={(e) => setProviderForm({ ...providerForm, businessHours: { ...providerForm.businessHours, outOfHoursMessage: e.target.value } })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem', resize: 'none' }}
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
