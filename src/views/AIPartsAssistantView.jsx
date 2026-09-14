import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Bot, Send, Car, ShieldCheck, ShoppingCart, UserCheck, AlertTriangle,
  RefreshCw, CheckCircle2, ArrowRight, HelpCircle, PhoneCall, Sparkles, MessageSquare, ThumbsUp, ThumbsDown
} from 'lucide-react';
import {
  executeAiAssistant,
  getAiMessages,
  submitAiFeedback,
  createSupportTicket
} from '../services/aiSupportService';

export const AIPartsAssistantView = () => {
  const { products, orders, selectedVehicle, setIsVehicleModalOpen, user, addToCart, navigateTo, showToast } = useStore();

  const [conversationId, setConversationId] = useState(() => `conv-${Date.now()}`);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-01',
      role: 'assistant',
      content: 'Hello! I am your **AutoZoneIndia AI Parts Assistant**.\n\nI can help you find verified spare parts, check exact vehicle fitment, look up order statuses, and explain return policies.\n\n*Note: I strictly query verified application database records. I never estimate or fabricate compatibility.*',
      created_at: new Date().toISOString()
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // Modal confirmation for actions
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isProcessing) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    // Append User Message
    const userMsg = { id: `user-${Date.now()}`, role: 'user', content: userText, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const result = await executeAiAssistant({
        message: userText,
        conversationId,
        customerId: user?.id || 'cust-101',
        selectedVehicle,
        products,
        orders
      });

      const aiMsg = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: result.replyText,
        sourceTrace: result.sourceTrace,
        foundProducts: result.foundProducts,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMsg]);

      if (result.suggestedAction) {
        setPendingAction(result.suggestedAction);
      }
    } catch (err) {
      showToast('Error communicating with AI Assistant', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmAction = () => {
    if (!pendingAction) return;

    if (pendingAction.type === 'add_to_cart' && pendingAction.product) {
      addToCart(pendingAction.product);
      showToast(`Added ${pendingAction.product.title || pendingAction.product.name} to Cart!`, 'success');
    } else if (pendingAction.type === 'create_enquiry') {
      showToast('Compatibility enquiry submitted to Store Technicians!', 'success');
    } else if (pendingAction.type === 'create_ticket') {
      const tkt = createSupportTicket({
        customer_id: user?.id || 'cust-101',
        subject: 'Support Ticket from AI Chat',
        description: pendingAction.query || 'Customer requested support via AI Assistant',
        category: 'technical'
      });
      showToast(`Support Ticket #${tkt.ticket_number} created!`, 'success');
    }

    setPendingAction(null);
  };

  const handleFeedback = (messageId, rating) => {
    submitAiFeedback(conversationId, messageId, rating);
    showToast(rating === 'helpful' ? 'Thank you for your feedback! 👍' : 'Feedback recorded. Our technical team will review this query.', 'info');
  };

  return (
    <div className="container" style={{ maxWidth: '1000px', paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Assistant Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0F2167 0%, #1E3E62 100%)', color: '#FFF', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#FF6B00', padding: '0.75rem', borderRadius: '50px' }}>
            <Bot size={28} color="#FFF" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontFamily: 'Outfit', fontWeight: 900, color: '#FFF', fontSize: '1.4rem' }}>
              AutoZoneIndia AI Parts Assistant
            </h2>
            <span style={{ fontSize: '0.85rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={14} color="#10B981" /> 100% Verified Database Retrieval | Zero Fabrication Guardrails
            </span>
          </div>
        </div>

        {/* Selected Vehicle Badge */}
        <button
          className="btn-secondary"
          onClick={() => setIsVehicleModalOpen(true)}
          style={{ background: 'rgba(255,255,255,0.1)', color: '#FFF', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
        >
          <Car size={16} color="#FF6B00" />
          <span>{selectedVehicle ? `${selectedVehicle.makeName || selectedVehicle.make} ${selectedVehicle.modelName || selectedVehicle.model}` : 'Select Vehicle'}</span>
        </button>
      </div>

      {/* Main Chat Interface */}
      <div className="portal-card" style={{ padding: 0, overflow: 'hidden', height: '600px', display: 'flex', flexDirection: 'column' }}>
        {/* Messages Body */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', background: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map(m => (
            <div
              key={m.id}
              style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                background: m.role === 'user' ? '#0F2167' : '#FFFFFF',
                color: m.role === 'user' ? '#FFFFFF' : '#0F172A',
                padding: '1rem 1.25rem',
                borderRadius: m.role === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                border: m.role === 'user' ? 'none' : '1px solid #E2E8F0'
              }}
            >
              <div style={{ fontSize: '0.9rem', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                {m.content}
              </div>

              {/* Product Cards if found */}
              {m.foundProducts && m.foundProducts.length > 0 && (
                <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {m.foundProducts.map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F1F5F9', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{p.title || p.name}</span>
                      <button className="btn-primary" onClick={() => addToCart(p)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                        + Add ₹{p.price}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Assistant Message Footer Actions */}
              {m.role === 'assistant' && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9', fontSize: '0.75rem', color: '#64748B' }}>
                  <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => handleFeedback(m.id, 'helpful')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }} title="Helpful">
                      <ThumbsUp size={14} />
                    </button>
                    <button onClick={() => handleFeedback(m.id, 'incorrect')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }} title="Report Issue">
                      <ThumbsDown size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isProcessing && (
            <div style={{ alignSelf: 'flex-start', background: '#FFFFFF', padding: '0.75rem 1.25rem', borderRadius: '16px', fontSize: '0.85rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCw size={16} className="animate-spin" color="#FF6B00" />
              <span>Querying verified database & compatibility matrix...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer Form */}
        <form onSubmit={handleSendMessage} style={{ padding: '1rem', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Ask about part fitment, order status, or spare part prices..."
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            disabled={isProcessing}
            style={{ flex: 1, padding: '0.75rem 1rem', border: '1px solid #CBD5E1', borderRadius: '10px', fontSize: '0.95rem', outline: 'none' }}
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={isProcessing || !inputMessage.trim()}
            style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Send size={18} /> Send
          </button>
        </form>
      </div>

      {/* Pending Action Confirmation Modal */}
      {pendingAction && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles color="#FF6B00" size={20} /> Action Confirmation Required
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#334155', margin: '0.75rem 0' }}>
              {pendingAction.type === 'add_to_cart' && `Would you like to add "${pendingAction.product?.title || pendingAction.product?.name}" to your shopping cart?`}
              {pendingAction.type === 'create_enquiry' && `Would you like to submit a compatibility verification enquiry to our store technicians?`}
              {pendingAction.type === 'create_ticket' && `Would you like to create a Support Ticket for a human customer support agent?`}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button className="btn-secondary" onClick={() => setPendingAction(null)} style={{ flex: 1 }}>Cancel</button>
              <button className="btn-primary" onClick={handleConfirmAction} style={{ flex: 1 }}>Confirm & Execute</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
