import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { parseNaturalLanguagePartQuery } from '../services/searchDiscoveryEngine';
import { callGeminiAI } from '../services/geminiService';
import { Sparkles, Bot, Send, X, CheckCircle2, Star, ShoppingCart, ArrowRightLeft, Loader2 } from 'lucide-react';

export const AIPartFinderModal = ({ isOpen, onClose }) => {
  const { products, selectedVehicle, addToCart, toggleCompare, navigateTo } = useStore();

  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am your AutoZon AI Part Finder Assistant 🤖 (Powered by Google Gemini AI). Type naturally what spare part you need (e.g. "Front brake pads for 2020 Innova Crysta" or "Engine oil filter for Swift petrol").`
    }
  ]);

  if (!isOpen) return null;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const userMsg = chatInput;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setIsLoading(true);

    // Query real catalog database for matching products
    const catalogResult = parseNaturalLanguagePartQuery(userMsg, products, selectedVehicle);

    // Call live Google Gemini API
    const geminiRes = await callGeminiAI(userMsg, products, selectedVehicle);

    const finalAiReply = geminiRes.success
      ? `✨ Google Gemini AI Answer:\n${geminiRes.text}`
      : catalogResult.aiReplyText;

    setMessages(prev => [
      ...prev,
      {
        sender: 'ai',
        text: finalAiReply,
        products: catalogResult.matchedProducts,
        isGeminiPowered: geminiRes.success
      }
    ]);
    setIsLoading(false);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container" style={{ maxWidth: '720px', height: '85vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div className="modal-header" style={{ background: '#0F2167', color: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bot size={24} color="#FF6B00" />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#FFFFFF' }}>AutoZon AI Part Finder Assistant</h3>
              <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Natural Language Search & Verified Catalog Matcher</span>
            </div>
          </div>
          <button className="modal-close-btn" style={{ color: '#FFFFFF' }} onClick={onClose}><X size={20} /></button>
        </div>

        {/* Chat Feed */}
        <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', background: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              <div
                style={{
                  background: msg.sender === 'user' ? '#0F2167' : '#FFFFFF',
                  color: msg.sender === 'user' ? '#FFFFFF' : '#1E293B',
                  padding: '0.85rem 1.1rem',
                  borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  fontSize: '0.9rem',
                  lineHeight: '1.5'
                }}
              >
                {msg.text}
              </div>

              {/* Renders Real Product Cards returned by AI */}
              {msg.products && msg.products.length > 0 && (
                <div style={{ marginTop: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {msg.products.map(prod => (
                    <div key={prod.id} className="product-card" style={{ background: '#FFFFFF', padding: '0.75rem' }}>
                      <div className="card-img-wrap" style={{ height: '110px' }} onClick={() => { onClose(); navigateTo('product-detail', prod.id); }}>
                        <img src={prod.image} alt={prod.title} />
                      </div>
                      <div className="card-body">
                        <span className="fitment-status-badge fits" style={{ fontSize: '0.65rem' }}>
                          <CheckCircle2 size={10} /> Verified Fitment
                        </span>
                        <h4 className="card-product-title" style={{ fontSize: '0.85rem' }} onClick={() => { onClose(); navigateTo('product-detail', prod.id); }}>
                          {prod.title}
                        </h4>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Part #: {prod.partNumber}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                          <b style={{ color: '#0F2167' }}>₹{prod.price}</b>
                          <button className="btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => addToCart(prod)}>
                            <ShoppingCart size={12} /> Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Prompt Chips */}
        <div style={{ padding: '0.5rem 1rem', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          <span className="search-pill-item" onClick={() => setChatInput('Front brake pads for Innova Crysta')}>⚙️ Innova Brake Pads</span>
          <span className="search-pill-item" onClick={() => setChatInput('Engine oil filter for Swift petrol')}>🛢️ Swift Oil Filter</span>
          <span className="search-pill-item" onClick={() => setChatInput('7D floor mats for Hyundai Creta')}>🚗 Creta 7D Mats</span>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} style={{ padding: '1rem', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Ask AI Part Finder (e.g. Innova brake pads, Creta oil filter)..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="search-input-main"
            style={{ borderRadius: '8px' }}
          />
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? <Loader2 size={16} className="spin" /> : <Send size={16} />} 
            {isLoading ? ' Thinking...' : ' Send'}
          </button>
        </form>
      </div>
    </div>
  );
};
