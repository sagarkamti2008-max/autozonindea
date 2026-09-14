import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  LifeBuoy, MessageSquare, Bot, AlertTriangle, ShieldCheck, Settings,
  CheckCircle2, Plus, Search, Filter, Eye, Send, ArrowRight, UserCheck, Lock
} from 'lucide-react';
import {
  getSupportTickets,
  getSupportMessages,
  addSupportMessage,
  updateTicketStatus,
  getEscalations,
  getUnansweredQuestions,
  resolveUnansweredQuestion,
  getKnowledgeBaseArticles,
  saveKnowledgeBaseArticle,
  getAiFeedback,
  getAiUsageLogs,
  getSupportSettings,
  updateSupportSettings
} from '../services/aiSupportService';

export const AdminSupportHub = () => {
  const { showToast } = useStore();
  const [activeTab, setActiveTab] = useState('tickets'); // tickets, inspector, ai-monitoring, unanswered, knowledge, settings

  // State definitions
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [escalations, setEscalations] = useState([]);
  const [unanswered, setUnanswered] = useState([]);
  const [kbArticles, setKbArticles] = useState([]);
  const [aiFeedback, setAiFeedback] = useState([]);
  const [usageLogs, setUsageLogs] = useState([]);
  const [settings, setSettings] = useState({});

  // Message Form state
  const [agentReplyText, setAgentReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  // KB Article Form state
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [articleForm, setArticleForm] = useState({ title: '', category: 'Compatibility', content: '', status: 'published' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const tkts = getSupportTickets();
    setTickets(tkts);
    if (!selectedTicket && tkts.length > 0) {
      setSelectedTicket(tkts[0]);
      setMessages(getSupportMessages(tkts[0].id, true)); // Admin views include internal notes
    }
    setEscalations(getEscalations());
    setUnanswered(getUnansweredQuestions());
    setKbArticles(getKnowledgeBaseArticles());
    setAiFeedback(getAiFeedback());
    setUsageLogs(getAiUsageLogs());
    setSettings(getSupportSettings());
  };

  const handleSelectTicket = (tkt) => {
    setSelectedTicket(tkt);
    setMessages(getSupportMessages(tkt.id, true));
  };

  const handleSendAgentMessage = (e) => {
    e.preventDefault();
    if (!agentReplyText.trim() || !selectedTicket) return;

    addSupportMessage({
      ticket_id: selectedTicket.id,
      sender_type: 'agent',
      sender_id: 'agent-super-01',
      message: agentReplyText.trim(),
      is_internal: isInternalNote
    });

    setAgentReplyText('');
    setMessages(getSupportMessages(selectedTicket.id, true));
    showToast(isInternalNote ? 'Internal note added' : 'Reply sent to customer', 'success');
  };

  const handleUpdateStatus = (newStatus) => {
    if (!selectedTicket) return;
    updateTicketStatus(selectedTicket.id, newStatus);
    loadData();
    showToast(`Ticket status updated to ${newStatus}`, 'success');
  };

  const handleSaveKbArticle = (e) => {
    e.preventDefault();
    if (!articleForm.title) return;
    saveKnowledgeBaseArticle(articleForm);
    setKbArticles(getKnowledgeBaseArticles());
    setIsArticleModalOpen(false);
    showToast('Knowledge base article published!', 'success');
  };

  const handleConvertUnanswered = (id, action) => {
    resolveUnansweredQuestion(id, action);
    setUnanswered(getUnansweredQuestions());
    showToast(`Unanswered question converted to ${action}`, 'success');
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSupportSettings(settings);
    showToast('Support settings updated!', 'success');
  };

  return (
    <div className="admin-console-wrapper" style={{ padding: '1rem' }}>
      {/* Console Header */}
      <div className="card-header-flex" style={{ marginBottom: '1.5rem', background: '#0F172A', color: '#FFF', padding: '1.25rem', borderRadius: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: 'Outfit', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#FFF' }}>
            <LifeBuoy color="#FF6B00" size={26} /> Support Desk & AI Monitoring Center
          </h2>
          <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: '#94A3B8' }}>
            Manage customer support tickets, AI assistant accuracy monitoring, unanswered questions, and knowledge base articles.
          </p>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem', borderBottom: '1px solid #CBD5E1', paddingBottom: '0.5rem' }}>
        {[
          { id: 'tickets', label: 'Support Tickets Desk', icon: LifeBuoy, badge: tickets.length },
          { id: 'ai-monitoring', label: 'AI Assistant Accuracy', icon: Bot, badge: aiFeedback.length },
          { id: 'unanswered', label: 'Unanswered Question Queue', icon: AlertTriangle, badge: unanswered.length },
          { id: 'knowledge', label: 'Knowledge Base', icon: ShieldCheck, badge: kbArticles.length },
          { id: 'settings', label: 'Support Settings', icon: Settings }
        ].map(tab => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? '#0F172A' : '#F1F5F9',
                color: isActive ? '#FFFFFF' : '#334155',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <IconComp size={15} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span style={{ background: isActive ? '#FF6B00' : '#CBD5E1', color: isActive ? '#FFF' : '#0F172A', borderRadius: '50px', fontSize: '0.65rem', padding: '0.05rem 0.4rem' }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '1.5rem' }}>
          {/* Tickets Sidebar List */}
          <div className="portal-card" style={{ padding: '1rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>All Tickets ({tickets.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '600px', overflowY: 'auto' }}>
              {tickets.map(t => (
                <div
                  key={t.id}
                  onClick={() => handleSelectTicket(t)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: selectedTicket?.id === t.id ? '2px solid #FF6B00' : '1px solid #E2E8F0',
                    background: selectedTicket?.id === t.id ? '#FEF3C7' : '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <b style={{ fontSize: '0.85rem' }}>#{t.ticket_number}</b>
                    <span className={`order-status-tag ${t.status === 'resolved' ? 'shipped' : 'pending'}`} style={{ fontSize: '0.65rem' }}>
                      {t.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.subject}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Category: {t.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Inspector Panel */}
          {selectedTicket ? (
            <div className="portal-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0 }}>Ticket #{selectedTicket.ticket_number}</h3>
                  <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Subject: {selectedTicket.subject}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-secondary" onClick={() => handleUpdateStatus('in_progress')} style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>In Progress</button>
                  <button className="btn-primary" onClick={() => handleUpdateStatus('resolved')} style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', background: '#059669' }}>Mark Resolved</button>
                </div>
              </div>

              {/* Messages Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto', marginBottom: '1rem' }}>
                {messages.map(m => (
                  <div
                    key={m.id}
                    style={{
                      padding: '0.85rem',
                      borderRadius: '8px',
                      background: m.is_internal ? '#FEF2F2' : m.sender_type === 'customer' ? '#F8FAFC' : '#EFF6FF',
                      borderLeft: m.is_internal ? '4px solid #EF4444' : m.sender_type === 'customer' ? '4px solid #94A3B8' : '4px solid #2563EB'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.8rem', fontWeight: 700 }}>
                      <span>{m.is_internal ? '🔒 INTERNAL AGENT NOTE (Hidden from Customer)' : m.sender_type === 'customer' ? '👤 Customer' : '🎧 Agent'}</span>
                      <span style={{ color: '#64748B', fontWeight: 400 }}>{new Date(m.created_at).toLocaleString('en-IN')}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155' }}>{m.message}</p>
                  </div>
                ))}
              </div>

              {/* Agent Reply Box */}
              <form onSubmit={handleSendAgentMessage} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <textarea
                  placeholder="Type agent response or internal note..."
                  value={agentReplyText}
                  onChange={e => setAgentReplyText(e.target.value)}
                  style={{ width: '100%', height: '80px', padding: '0.5rem', border: '1px solid #CBD5E1', borderRadius: '6px' }}
                  required
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#DC2626', fontWeight: 700 }}>
                    <input type="checkbox" checked={isInternalNote} onChange={e => setIsInternalNote(e.target.checked)} />
                    Make Private Internal Note
                  </label>

                  <button className="btn-primary" type="submit" style={{ padding: '0.4rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Send size={14} /> Submit Message
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="portal-card" style={{ textAlign: 'center', padding: '3rem' }}>Select a ticket to inspect.</div>
          )}
        </div>
      )}

      {/* AI Monitoring Tab */}
      {activeTab === 'ai-monitoring' && (
        <div>
          <div className="admin-stats-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card">
              <Bot size={28} className="stat-icon revenue" />
              <div>
                <span className="stat-label">Total AI Interactions</span>
                <h3 className="stat-val">{usageLogs.length} Sessions</h3>
              </div>
            </div>

            <div className="stat-card">
              <CheckCircle2 size={28} className="stat-icon products" />
              <div>
                <span className="stat-label">AI Accuracy Feedback</span>
                <h3 className="stat-val">{aiFeedback.length} Reviews</h3>
              </div>
            </div>
          </div>

          <div className="portal-card">
            <h3><Bot size={18} /> Customer AI Accuracy Reviews & Feedback</h3>
            <div className="admin-table-wrapper" style={{ marginTop: '0.75rem' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Feedback ID</th>
                    <th>Rating</th>
                    <th>Reason / Comment</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {aiFeedback.map(f => (
                    <tr key={f.id}>
                      <td><b>{f.id}</b></td>
                      <td>
                        <span className={`order-status-tag ${f.rating === 'helpful' ? 'shipped' : 'pending'}`}>
                          {f.rating}
                        </span>
                      </td>
                      <td>{f.reason || 'None provided'}</td>
                      <td>{new Date(f.created_at).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Unanswered Questions Queue Tab */}
      {activeTab === 'unanswered' && (
        <div className="portal-card">
          <div className="card-header-flex">
            <div>
              <h3><AlertTriangle size={20} color="#F59E0B" /> Unanswered & Escalated Questions Queue</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                Questions where verified database data was missing or customer reported unverified compatibility.
              </p>
            </div>
          </div>

          <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Question Text</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Convert Action</th>
                </tr>
              </thead>
              <tbody>
                {unanswered.map(u => (
                  <tr key={u.id}>
                    <td><b>{u.question_text}</b></td>
                    <td><span className="badge-classification oem">{u.reason}</span></td>
                    <td><span className="order-status-tag shipped">{u.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <button className="btn-secondary" onClick={() => handleConvertUnanswered(u.id, 'converted_faq')} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                          + FAQ
                        </button>
                        <button className="btn-secondary" onClick={() => handleConvertUnanswered(u.id, 'converted_article')} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                          + KB Article
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Knowledge Base Tab */}
      {activeTab === 'knowledge' && (
        <div className="portal-card">
          <div className="card-header-flex">
            <h3><ShieldCheck size={20} /> Knowledge Base Articles</h3>
            <button className="btn-primary" onClick={() => setIsArticleModalOpen(true)}>
              <Plus size={16} /> Create Article
            </button>
          </div>

          <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Category</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {kbArticles.map(a => (
                  <tr key={a.id}>
                    <td><b>{a.title}</b></td>
                    <td><code>{a.slug}</code></td>
                    <td><span className="badge-classification oem">{a.category}</span></td>
                    <td><span className="verified-tag">{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="portal-card" style={{ maxWidth: '600px' }}>
          <h3><Settings size={20} /> Support & AI Safety Settings</h3>
          <form onSubmit={handleSaveSettings} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', background: '#F8FAFC', borderRadius: '6px' }}>
              <span>Enable AI Assistant</span>
              <input type="checkbox" checked={settings.ai_enabled} onChange={e => setSettings({ ...settings, ai_enabled: e.target.checked })} />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', background: '#F8FAFC', borderRadius: '6px' }}>
              <span>Enable Human Handoff Auto-Escalation</span>
              <input type="checkbox" checked={settings.human_handoff_enabled} onChange={e => setSettings({ ...settings, human_handoff_enabled: e.target.checked })} />
            </label>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>Max Messages Per Session</label>
              <input type="number" value={settings.max_messages_per_session} onChange={e => setSettings({ ...settings, max_messages_per_session: Number(e.target.value) })} style={{ width: '100%', padding: '0.5rem', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
            </div>

            <button className="btn-primary" type="submit">Save Support Settings</button>
          </form>
        </div>
      )}

      {/* KB Article Modal */}
      {isArticleModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <h3>Create Knowledge Base Article</h3>
            <form onSubmit={handleSaveKbArticle} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input type="text" placeholder="Article Title" value={articleForm.title} onChange={e => setArticleForm({ ...articleForm, title: e.target.value })} style={{ padding: '0.5rem', border: '1px solid #CBD5E1', borderRadius: '6px' }} required />
              <textarea placeholder="Article Content..." value={articleForm.content} onChange={e => setArticleForm({ ...articleForm, content: e.target.value })} style={{ padding: '0.5rem', border: '1px solid #CBD5E1', borderRadius: '6px', height: '100px' }} required />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsArticleModalOpen(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Publish Article</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
