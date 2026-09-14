import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, MessageSquare, Send, CheckCircle2, Clock, ShieldCheck, User } from 'lucide-react';
import {
  getSupportTicketByNumber,
  getSupportMessages,
  addSupportMessage
} from '../services/aiSupportService';

export const CustomerTicketDetailView = ({ ticketNumber = 'AZI-TKT-20260910-1001' }) => {
  const { user, setCurrentView, showToast } = useStore();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadTicket();
  }, [ticketNumber]);

  const loadTicket = () => {
    const tkt = getSupportTicketByNumber(ticketNumber);
    setTicket(tkt);
    if (tkt) {
      // NOTE: Customer view strictly excludes internal notes (is_internal = false)
      const msgs = getSupportMessages(tkt.id, false);
      setMessages(msgs);
    }
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !ticket) return;

    addSupportMessage({
      ticket_id: ticket.id,
      sender_type: 'customer',
      sender_id: user?.id || 'cust-101',
      message: replyText.trim(),
      is_internal: false
    });

    setReplyText('');
    loadTicket();
    showToast('Reply submitted to support team', 'success');
  };

  if (!ticket) {
    return (
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <h2>Support Ticket Not Found</h2>
        <button className="btn-primary" onClick={() => setCurrentView('support')} style={{ marginTop: '1rem' }}>
          Back to Support Center
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '900px', paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button className="btn-secondary" onClick={() => setCurrentView('support')} style={{ padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div>
          <h2 style={{ margin: 0, fontFamily: 'Outfit', fontWeight: 900 }}>
            Ticket #{ticket.ticket_number}
          </h2>
          <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Category: {ticket.category} | Created {new Date(ticket.created_at).toLocaleDateString('en-IN')}
          </span>
        </div>
        <span className={`order-status-tag ${ticket.status === 'resolved' ? 'shipped' : 'pending'}`} style={{ marginLeft: 'auto', fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
          {ticket.status}
        </span>
      </div>

      {/* Ticket Subject Card */}
      <div className="portal-card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>{ticket.subject}</h3>
        <p style={{ color: '#334155', fontSize: '0.95rem', margin: 0, lineHeight: '1.5' }}>
          {ticket.description}
        </p>
      </div>

      {/* Message Timeline */}
      <div className="portal-card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
        <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={18} color="#FF6B00" /> Support Conversation Log
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map(m => (
            <div
              key={m.id}
              style={{
                background: m.sender_type === 'customer' ? '#F8FAFC' : '#EFF6FF',
                borderLeft: m.sender_type === 'customer' ? '4px solid #94A3B8' : '4px solid #2563EB',
                padding: '1rem',
                borderRadius: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: m.sender_type === 'customer' ? '#0F172A' : '#1E40AF' }}>
                  {m.sender_type === 'customer' ? '👤 You' : '🎧 Store Support Agent'}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  {new Date(m.created_at).toLocaleString('en-IN')}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: '1.4' }}>
                {m.message}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Reply Form */}
      {ticket.status !== 'closed' && (
        <form onSubmit={handleSendReply} className="portal-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ margin: 0 }}>Add Reply to Ticket</h4>
          <textarea
            placeholder="Type your response to the support agent..."
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            style={{ width: '100%', height: '90px', padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
            required
          />
          <button className="btn-primary" type="submit" style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Send size={16} /> Send Reply
          </button>
        </form>
      )}
    </div>
  );
};
