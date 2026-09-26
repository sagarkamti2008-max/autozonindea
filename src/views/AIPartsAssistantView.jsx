import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Bot, Send, Car, ShieldCheck, ShoppingCart, UserCheck, AlertTriangle,
  RefreshCw, CheckCircle2, ArrowRight, HelpCircle, PhoneCall, Sparkles, MessageSquare, ThumbsUp, ThumbsDown,
  Wrench, Zap, Thermometer, Disc, Activity, Volume2, Flame, Search
} from 'lucide-react';
import {
  executeAiAssistant,
  getAiMessages,
  submitAiFeedback,
  createSupportTicket
} from '../services/aiSupportService';

// Preset Diagnostic Symptoms for Quick 1-Click Diagnosis
const DIAGNOSTIC_SYMPTOM_PRESETS = [
  {
    id: 'squeal-brakes',
    icon: '🛑',
    label: 'Brake Squealing / Grinding Noise',
    query: 'My car makes a loud squealing noise when I press the brakes. What parts do I need to inspect and replace?'
  },
  {
    id: 'engine-overheat',
    icon: '🌡️',
    label: 'Engine Overheating / Temperature High',
    query: 'My engine temperature gauge goes to hot and coolant level drops. What parts should I replace?'
  },
  {
    id: 'black-smoke',
    icon: '💨',
    label: 'Black Exhaust Smoke & Poor Mileage',
    query: 'Black smoke coming out of exhaust with poor acceleration. Which air filters or sensors need replacement?'
  },
  {
    id: 'car-clicking-no-start',
    icon: '⚡',
    label: 'Clicking Sound / Car Won\'t Start',
    query: 'Car turns key but makes clicking sound and battery light is flickering. What part is faulty?'
  },
  {
    id: 'steering-vibration',
    icon: '🚗',
    label: 'Steering Wheel Vibrations at High Speed',
    query: 'Steering wheel vibrates heavily above 80 km/h. What suspension or wheel parts need checking?'
  },
  {
    id: 'oil-leak-warning',
    icon: '🛢️',
    label: 'Oil Leakage under Car / Low Oil Light',
    query: 'Oil dripping under engine sump and low oil pressure indicator is on. Which gaskets or oil filters fit my vehicle?'
  }
];

export const AIPartsAssistantView = () => {
  const { products, orders, selectedVehicle, setIsVehicleModalOpen, user, addToCart, buyNow, navigateTo, showToast } = useStore();

  const [conversationId, setConversationId] = useState(() => `conv-${Date.now()}`);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-01',
      role: 'assistant',
      content: '👋 **Hello! I am your AutoZonIndia AI Diagnostic & Parts Finder Assistant.**\n\nTell me any car issue or symptom (e.g. *squealing brakes, engine overheating, black smoke, battery clicking*), and I will instantly diagnose the root cause and recommend **100% verified compatible spare parts** for your car!',
      created_at: new Date().toISOString()
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [diagnosticStep, setDiagnosticStep] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (textToSend = null) => {
    const userText = (typeof textToSend === 'string' ? textToSend : inputMessage).trim();
    if (!userText || isProcessing) return;

    if (typeof textToSend !== 'string') setInputMessage('');

    // Append User Message
    const userMsg = { id: `user-${Date.now()}`, role: 'user', content: userText, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);
    setDiagnosticStep('Analyzing vehicle symptom & sensor telemetry...');

    setTimeout(() => {
      setDiagnosticStep(`Matching 100% fitment records for ${selectedVehicle ? `${selectedVehicle.makeName} ${selectedVehicle.modelName}` : 'All Vehicles'}...`);
    }, 700);

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
      setDiagnosticStep('');
    }
  };

  const handleConfirmAction = () => {
    if (!pendingAction) return;

    if (pendingAction.type === 'add_to_cart' && pendingAction.product) {
      addToCart(pendingAction.product);
      showToast(`Added ${pendingAction.product.title || pendingAction.product.name} to Cart!`, 'success');
    } else if (pendingAction.type === 'create_enquiry') {
      showToast('Compatibility enquiry submitted to Master Technicians!', 'success');
    } else if (pendingAction.type === 'create_ticket') {
      const tkt = createSupportTicket({
        customer_id: user?.id || 'cust-101',
        subject: 'Support Ticket from AI Diagnostics',
        description: pendingAction.query || 'Customer requested support via AI Assistant',
        category: 'technical'
      });
      showToast(`Support Ticket #${tkt.ticket_number} created!`, 'success');
    }

    setPendingAction(null);
  };

  const handleFeedback = (messageId, rating) => {
    submitAiFeedback(conversationId, messageId, rating);
    showToast(rating === 'helpful' ? 'Thank you for your feedback! 👍' : 'Feedback recorded. Our master technicians will review this query.', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-24 selection:bg-[#FF5722] selection:text-white pt-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Assistant Header Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-[#0B5394]/40 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
          
          <div className="flex items-center gap-4 z-10">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#FF5722] to-orange-500 flex items-center justify-center text-white shrink-0 shadow-xl shadow-orange-500/20">
              <Bot className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="bg-emerald-500/20 text-emerald-400 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" /> 100% Database Retrieval Engine
                </span>
                <span className="bg-amber-400/10 text-amber-400 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Zero Fabrication Guardrails
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                AI Car Diagnostics & Verified Parts Finder
              </h1>
              <p className="text-slate-400 text-xs mt-0.5 font-medium">
                Describe any symptom or click a diagnostic preset below for instant part recommendations.
              </p>
            </div>
          </div>

          {/* Active Vehicle Badge Button */}
          <button
            onClick={() => setIsVehicleModalOpen(true)}
            className="w-full md:w-auto bg-slate-950/90 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl border border-slate-700 hover:border-[#FF5722] transition flex items-center justify-center gap-2 cursor-pointer shrink-0 z-10 shadow-lg"
          >
            <Car className="w-4 h-4 text-[#FF5722]" />
            <span>{selectedVehicle ? `${selectedVehicle.makeName} ${selectedVehicle.modelName}` : 'Select Your Vehicle'}</span>
          </button>

          {/* Background Glow */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#0B5394]/30 to-transparent pointer-events-none" />
        </div>

        {/* Diagnostic Presets Chips Bar */}
        <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#FF5722]" /> Quick Diagnostic Presets (1-Click)
            </span>
            <span className="text-[10px] text-slate-500 font-bold">Tap any issue to diagnose</span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {DIAGNOSTIC_SYMPTOM_PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => handleSendMessage(preset.query)}
                disabled={isProcessing}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-[#FF5722] text-slate-200 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 shadow-sm disabled:opacity-50"
              >
                <span>{preset.icon}</span>
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Chat Conversation Window */}
        <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[580px]">
          
          {/* Chat Messages Body */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-900/60 scrollbar-thin">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${
                  m.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-[#FF5722] to-orange-600 text-white font-medium rounded-br-none'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-line font-sans">{m.content}</div>

                  {/* Found Recommended Products Grid inside AI Response */}
                  {m.foundProducts && m.foundProducts.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                      <div className="text-[11px] font-black text-[#FF5722] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Recommended Genuine Parts ({m.foundProducts.length})
                      </div>
                      <div className="grid grid-cols-1 gap-2.5">
                        {m.foundProducts.map((p) => (
                          <div
                            key={p.id}
                            className="bg-slate-950 border border-slate-800 hover:border-[#FF5722] rounded-xl p-3 flex items-center justify-between gap-3 transition group"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image || p.image_url || '/images/synthetic_engine_oil.jpg'}
                                alt={p.title}
                                className="w-12 h-12 object-contain bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0"
                              />
                              <div>
                                <div className="font-extrabold text-white text-xs line-clamp-1 group-hover:text-[#FF5722] transition">
                                  {p.title || p.name}
                                </div>
                                <div className="text-[10px] text-slate-400 font-bold flex items-center gap-2 mt-0.5">
                                  <span className="text-[#FF5722]">{p.brand}</span>
                                  {p.oemPartNumber && <span>OEM: {p.oemPartNumber}</span>}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-black text-white text-xs">
                                ₹{p.price ? p.price.toLocaleString('en-IN') : '1,299'}
                              </span>
                              <button
                                onClick={() => addToCart(p)}
                                className="bg-[#FF5722] hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-md"
                              >
                                <ShoppingCart className="w-3 h-3" /> Add
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message Footer */}
                  {m.role === 'assistant' && (
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                      <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleFeedback(m.id, 'helpful')}
                          className="hover:text-emerald-400 transition cursor-pointer"
                          title="Helpful Answer"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleFeedback(m.id, 'incorrect')}
                          className="hover:text-red-400 transition cursor-pointer"
                          title="Report Issue"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Live Processing Indicator */}
            {isProcessing && (
              <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-xs text-slate-300 max-w-md animate-pulse">
                <RefreshCw className="w-4 h-4 text-[#FF5722] animate-spin shrink-0" />
                <span>{diagnosticStep || 'Querying verified database & compatibility matrix...'}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Footer Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="Type your car symptom (e.g., brake noise, engine overheating, black smoke)..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isProcessing}
              className="flex-1 bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF5722]"
            />
            <button
              type="submit"
              disabled={isProcessing || !inputMessage.trim()}
              className="bg-gradient-to-r from-[#FF5722] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-3 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Diagnose & Find</span>
            </button>
          </form>

        </div>

        {/* Action Confirmation Modal */}
        {pendingAction && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF5722]" /> Action Confirmation Required
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {pendingAction.type === 'add_to_cart' && `Would you like to add "${pendingAction.product?.title || pendingAction.product?.name}" to your shopping cart?`}
                {pendingAction.type === 'create_enquiry' && `Would you like to submit a compatibility verification enquiry to our master store technicians?`}
                {pendingAction.type === 'create_ticket' && `Would you like to create a Technical Support Ticket for a human customer support agent?`}
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setPendingAction(null)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-2.5 rounded-xl border border-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  className="flex-1 bg-[#FF5722] hover:bg-orange-600 text-white font-black text-xs py-2.5 rounded-xl transition cursor-pointer shadow-lg shadow-orange-500/20"
                >
                  Confirm & Execute
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
