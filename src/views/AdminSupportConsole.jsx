import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  calculateSupportAnalytics,
  getSupportConfig,
  updateSupportConfig,
  addTicketMessage,
  updateTicketStatus,
  updateTicketPriority,
  assignTicket,
  generateAISupportDraft,
  getSupportMacros,
  SUPPORT_CATEGORIES,
  COMPLAINT_TYPES
} from '../services/supportEngine';
import {
  HelpCircle, MessageSquare, AlertTriangle, ShieldCheck, Clock, CheckCircle2,
  XCircle, Filter, Search, Plus, User, FileText, Send, Sparkles, AlertCircle,
  Eye, Settings, Download, X, Bookmark, LifeBuoy, ArrowUpRight, BarChart3, Check
} from 'lucide-react';

export const AdminSupportConsole = () => {
  const { orders, products, showToast } = useStore();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'Open' | 'In Progress' | 'Urgent' | 'Unassigned' | 'Resolved'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const [selectedTicket, setSelectedTicket] = useState(null);

  // Reply Box State
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [selectedMacro, setSelectedMacro] = useState('');

  // Config Modal State
  const [configModal, setConfigModal] = useState(false);
  const [configForm, setConfigForm] = useState(getSupportConfig());

  // Analytics & Macros
  const analytics = calculateSupportAnalytics();
  const macros = getSupportMacros();

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    const res = addTicketMessage({
      ticketId: selectedTicket.id,
      senderName: 'Store Owner Admin',
      senderType: 'Admin',
      message: replyText,
      isInternalNote
    });

    if (res.success) {
      showToast(isInternalNote ? '📝 Internal note logged privately.' : '✉️ Customer reply sent successfully!', 'success');
      setSelectedTicket(res.ticket);
      setReplyText('');
    } else {
      showToast(`❌ Error: ${res.message}`, 'error');
    }
  };

  const handleAIAssist = () => {
    if (!selectedTicket) return;
    const draft = generateAISupportDraft(selectedTicket.id);
    setReplyText(draft);
    showToast('✨ AI Support draft generated! Review & edit before sending.', 'info');
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    const res = updateSupportConfig(configForm);
    if (res.success) {
      showToast('⚙️ Support Hours & SLA Response Targets Saved!', 'success');
      setConfigModal(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Ticket Number', 'Subject', 'Customer', 'Email', 'Category', 'Priority', 'Status', 'Assigned Admin', 'Created Date'];
    const rows = (analytics.totalTickets ? [selectedTicket].filter(Boolean) : []).map(t => [
      t.ticketNumber, `"${t.subject}"`, `"${t.customerName}"`, t.customerEmail, t.category, t.priority, t.status, t.assignedAdmin, new Date(t.createdAt).toISOString()
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autozon_support_tickets_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('📥 Support Tickets CSV Exported!', 'success');
  };

  return (
    <div style={{ padding: '1.5rem 0' }}>
      {/* Header Banner */}
      <div style={{ background: '#0F2167', color: '#FFFFFF', padding: '1.5rem', borderRadius: '14px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <HelpCircle size={32} color="#FF6B00" />
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF' }}>
              Customer Support & Ticket Resolution Operations Center
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>
              Single Owner Support Control • SLA Tracking • Complaint Matrix & Internal Notes
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
            onClick={() => setConfigModal(true)}
            style={{ background: '#FF6B00', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.55rem 1.1rem', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Settings size={16} /> SLA & Working Hours
          </button>
        </div>
      </div>

      {/* SLA & Ticket Metrics KPI Row (Sections 10, 35) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#FFFFFF', padding: '1.1rem', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #3B82F6' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>OPEN TICKETS</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginTop: '0.2rem' }}>{analytics.openCount} Active</div>
          <span style={{ fontSize: '0.7rem', color: '#3B82F6', fontWeight: 700 }}>{analytics.inProgressCount} In Progress</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.1rem', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #EF4444' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>URGENT COMPLAINTS</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#DC2626', marginTop: '0.2rem' }}>{analytics.urgentCount} Urgent</div>
          <span style={{ fontSize: '0.7rem', color: '#DC2626', fontWeight: 700 }}>Immediate Attention</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.1rem', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #F59E0B' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>UNASSIGNED QUEUE</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#D97706', marginTop: '0.2rem' }}>{analytics.unassignedCount} Unassigned</div>
          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Needs Owner Claim</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.1rem', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #10B981' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>SLA COMPLIANCE</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#059669', marginTop: '0.2rem' }}>{analytics.slaComplianceRate}% Met</div>
          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Target: {analytics.config.targetResponseHoursUrgent}h Response</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ background: '#FFFFFF', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['ALL', 'Open', 'In Progress', 'Urgent', 'Unassigned', 'Resolved'].map(st => (
            <button
              key={st}
              onClick={() => setActiveTab(st)}
              style={{
                background: activeTab === st ? '#0F2167' : '#F1F5F9',
                color: activeTab === st ? '#FFFFFF' : '#475569',
                border: 'none',
                borderRadius: '6px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {st}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.3rem 0.75rem' }}>
            <Search size={16} color="#64748B" style={{ marginRight: '0.4rem' }} />
            <input
              type="text"
              placeholder="Search Ticket #, Subject, Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.8rem', width: '220px' }}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ padding: '0.35rem 0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.78rem', fontWeight: 700 }}
          >
            <option value="ALL">All Categories</option>
            {SUPPORT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Main Support Workspace Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedTicket ? '1fr 520px' : '1fr', gap: '1.5rem' }}>
        {/* Support Inbox Table (Section 11) */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <div style={{ padding: '0.85rem 1rem', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#0F2167' }}>
              📬 STORE SUPPORT INBOX ({analytics.totalTickets} Tickets)
            </span>
            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Click any ticket to open live conversation & internal notes</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>TICKET # & SUBJECT</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>CUSTOMER</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>CATEGORY</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>PRIORITY</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>STATUS</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample Ticket Row */}
              <tr
                style={{ borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}
                onClick={() => setSelectedTicket({
                  id: 'tkt-1001',
                  ticketNumber: 'TKT-2026-000001',
                  subject: 'Verification of Swift Brake Disc Pad Compatibility',
                  category: 'Compatibility Issue',
                  priority: 'High',
                  status: 'In Progress',
                  assignedAdmin: 'Store Owner Admin',
                  customerName: 'Rahul Sharma',
                  customerEmail: 'rahul.s@gmail.com',
                  orderId: 'AZ-904812',
                  createdAt: new Date().toISOString(),
                  messages: [
                    { id: 'm1', senderName: 'Rahul Sharma', senderType: 'Customer', message: 'Want to confirm if Bosch brake pads fit 2021 Swift VXi before unboxing.', timestamp: new Date().toISOString() }
                  ],
                  internalNotes: []
                })}
              >
                <td style={{ padding: '0.85rem 1rem' }}>
                  <b style={{ color: '#0F2167', display: 'block' }}>TKT-2026-000001</b>
                  <span style={{ fontSize: '0.78rem', color: '#334155' }}>Swift Brake Disc Pad Compatibility</span>
                </td>

                <td style={{ padding: '0.85rem 1rem' }}>
                  <strong style={{ color: '#0F172A', display: 'block' }}>Rahul Sharma</strong>
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>rahul.s@gmail.com</span>
                </td>

                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ background: '#F1F5F9', color: '#475569', fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    Compatibility Issue
                  </span>
                </td>

                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ background: '#FEF3C7', color: '#B45309', fontSize: '0.7rem', fontWeight: 900, padding: '0.15rem 0.55rem', borderRadius: '4px' }}>
                    High
                  </span>
                </td>

                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ background: '#E0F2FE', color: '#0369A1', fontSize: '0.7rem', fontWeight: 900, padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                    In Progress
                  </span>
                </td>

                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <button style={{ background: '#0F2167', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '0.25rem 0.65rem', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}>
                    Open Conversation
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Ticket Conversation & Response Workspace (Sections 8, 14, 15, 16, 43, 45) */}
        {selectedTicket && (
          <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '680px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
            {/* Ticket Header */}
            <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B' }}>TICKET #{selectedTicket.ticketNumber} • ORDER #{selectedTicket.orderId || 'N/A'}</span>
                <h4 style={{ margin: '0.15rem 0 0 0', fontSize: '1rem', fontWeight: 900, color: '#0F2167' }}>{selectedTicket.subject}</h4>
              </div>
              <button onClick={() => setSelectedTicket(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
            </div>

            {/* Conversation Thread Messages */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.4rem', marginBottom: '0.75rem' }}>
              {selectedTicket.messages.map(m => (
                <div
                  key={m.id}
                  style={{
                    alignSelf: m.senderType === 'Admin' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    background: m.senderType === 'Admin' ? '#0F2167' : '#F8FAFC',
                    color: m.senderType === 'Admin' ? '#FFFFFF' : '#0F172A',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    fontSize: '0.82rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ fontSize: '0.68rem', opacity: 0.8, marginBottom: '0.25rem', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <b>{m.senderName} ({m.senderType})</b>
                    <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{m.message}</p>
                </div>
              ))}

              {/* Private Internal Notes (Yellow Box - Section 14) */}
              {selectedTicket.internalNotes?.map(n => (
                <div key={n.id} style={{ background: '#FEF3C7', border: '1px solid #FDE68A', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', color: '#92400E' }}>
                  <div style={{ fontWeight: 900, marginBottom: '0.2rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>🔒 INTERNAL NOTE (Private to Owner)</span>
                    <span>{new Date(n.timestamp).toLocaleTimeString([])}</span>
                  </div>
                  {n.note}
                </div>
              ))}
            </div>

            {/* Response Toolbar & AI Assistant */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 800, color: isInternalNote ? '#D97706' : '#0F2167', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={isInternalNote} onChange={(e) => setIsInternalNote(e.target.checked)} />
                    {isInternalNote ? '🔒 Private Internal Note' : '✉️ Customer Reply'}
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={handleAIAssist}
                    style={{ background: '#F0F9FF', color: '#0369A1', border: '1px solid #BAE6FD', borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Sparkles size={13} /> Draft with AI
                  </button>

                  <select
                    value={selectedMacro}
                    onChange={(e) => {
                      setSelectedMacro(e.target.value);
                      if (e.target.value) setReplyText(e.target.value);
                    }}
                    style={{ padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.72rem', fontWeight: 700 }}
                  >
                    <option value="">Insert Saved Template...</option>
                    {macros.map(m => <option key={m.id} value={m.content}>{m.title}</option>)}
                  </select>
                </div>
              </div>

              <textarea
                rows={3}
                placeholder={isInternalNote ? 'Write internal note for store owner team (hidden from customer)...' : 'Type reply to customer...'}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: isInternalNote ? '2px solid #F59E0B' : '1px solid #CBD5E1', fontSize: '0.82rem', resize: 'none' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={() => {
                      updateTicketStatus({ ticketId: selectedTicket.id, status: 'Resolved' });
                      showToast('✅ Ticket Marked Resolved!', 'success');
                    }}
                    style={{ background: '#DCFCE7', color: '#166534', border: '1px solid #86EFAC', borderRadius: '6px', padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer' }}
                  >
                    Mark Resolved
                  </button>
                </div>

                <button
                  onClick={handleSendReply}
                  style={{ background: isInternalNote ? '#D97706' : '#0F2167', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '0.4rem 1.1rem', fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Send size={14} /> {isInternalNote ? 'Save Internal Note' : 'Send Reply'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SLA & SUPPORT HOURS CONFIG MODAL (Sections 27, 34) */}
      {configModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '14px', width: '100%', maxWidth: '520px', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, color: '#0F2167', fontSize: '1.1rem', fontWeight: 900 }}>
                Support Hours & SLA Response Targets
              </h3>
              <button onClick={() => setConfigModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>STORE SUPPORT PHONE / WHATSAPP</label>
                <input
                  type="text"
                  value={configForm.phone}
                  onChange={(e) => setConfigForm({ ...configForm, phone: e.target.value, whatsapp: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>SUPPORT EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={configForm.email}
                  onChange={(e) => setConfigForm({ ...configForm, email: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>URGENT SLA (HOURS)</label>
                  <input
                    type="number"
                    value={configForm.targetResponseHoursUrgent}
                    onChange={(e) => setConfigForm({ ...configForm, targetResponseHoursUrgent: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>NORMAL SLA (HOURS)</label>
                  <input
                    type="number"
                    value={configForm.targetResponseHoursNormal}
                    onChange={(e) => setConfigForm({ ...configForm, targetResponseHoursNormal: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 700 }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setConfigModal(false)} style={{ flex: 1, background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0.55rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, background: '#0F2167', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '0.55rem', fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer' }}>Save SLA Settings</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
