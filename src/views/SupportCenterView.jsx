import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  getFAQs,
  getKnowledgeBaseArticles,
  createSupportTicket,
  getSupportConfig,
  SUPPORT_CATEGORIES
} from '../services/supportEngine';
import {
  HelpCircle, MessageSquare, Phone, Mail, MapPin, Clock, Search, BookOpen,
  ChevronDown, ChevronUp, Send, CheckCircle2, ArrowRight, ShieldCheck, LifeBuoy, Plus, X
} from 'lucide-react';

export const SupportCenterView = () => {
  const { user, orders, products, showToast, navigateTo } = useStore();
  const config = getSupportConfig();

  const [activeTab, setActiveTab] = useState('faq'); // 'faq' | 'ticket' | 'kb' | 'contact'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaqCategory, setSelectedFaqCategory] = useState('ALL');
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  // Create Ticket Form State
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: SUPPORT_CATEGORIES[0],
    orderId: '',
    productId: '',
    message: '',
    isComplaint: false
  });

  const faqs = getFAQs(searchQuery, selectedFaqCategory);
  const kbArticles = getKnowledgeBaseArticles(searchQuery);

  const handleCreateTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketForm.subject || !ticketForm.message) {
      showToast('⚠️ Please enter subject and issue message.', 'error');
      return;
    }

    const res = createSupportTicket({
      subject: ticketForm.subject,
      category: ticketForm.category,
      orderId: ticketForm.orderId,
      productId: ticketForm.productId,
      message: ticketForm.message,
      customerUser: user || { fullName: 'Valued Buyer', email: 'buyer@autozon.in' },
      isComplaint: ticketForm.isComplaint
    });

    if (res.success) {
      showToast(`🎉 ${res.message}`, 'success');
      setTicketForm({ subject: '', category: SUPPORT_CATEGORIES[0], orderId: '', productId: '', message: '', isComplaint: false });
      navigateTo('my-account');
    } else {
      showToast(`❌ Error: ${res.message}`, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Support Hero Header Banner */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-14 text-center mb-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl mb-6 border border-white/20">
              <HelpCircle className="w-10 h-10 text-orange-400" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight">
              Customer Support & Knowledge Base
            </h1>
            <p className="text-slate-400 font-medium text-lg max-w-2xl mx-auto mb-10">
              Have a vehicle fitment question, order inquiry, or warranty query? Search our instant FAQs or submit a ticket directly to our store owner team.
            </p>

            {/* Global Support Search Bar */}
            <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 flex items-center shadow-lg transition-all focus-within:ring-2 focus-within:ring-orange-500/50 focus-within:bg-white/20">
              <Search className="w-6 h-6 text-slate-300 ml-4 shrink-0" />
              <input
                type="text"
                placeholder="Search FAQs, vehicle fitment guide, shipping times..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none text-white placeholder:text-slate-400 px-4 py-3 focus:outline-none font-medium"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-black py-3 px-8 rounded-full transition-colors shrink-0 hidden sm:block">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {[
            { id: 'faq', label: '❓ FAQs', icon: HelpCircle },
            { id: 'ticket', label: '✉️ Submit Ticket', icon: MessageSquare },
            { id: 'kb', label: '📚 Knowledge Base', icon: BookOpen },
            { id: 'contact', label: '📞 Contact Info', icon: Phone }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-black transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: FAQ Accordions */}
        {activeTab === 'faq' && (
          <div className="animate-in fade-in duration-500">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {['ALL', 'Compatibility', 'Shipping', 'Returns', 'Warranty', 'Payments', 'Account'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedFaqCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-black transition-colors ${
                    selectedFaqCategory === cat
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map(faq => (
                <div key={faq.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <button
                    onClick={() => setExpandedFaqId(expandedFaqId === faq.id ? null : faq.id)}
                    className={`w-full px-6 py-5 flex items-center justify-between text-left transition-colors ${
                      expandedFaqId === faq.id ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-bold text-slate-900 text-base pr-8">{faq.question}</span>
                    <div className={`shrink-0 transition-transform duration-300 ${expandedFaqId === faq.id ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-5 h-5 text-orange-500" />
                    </div>
                  </button>

                  <div className={`transition-all duration-300 overflow-hidden ${
                    expandedFaqId === faq.id ? 'max-h-96 border-t border-slate-100 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="p-6 text-slate-600 text-sm font-medium leading-relaxed bg-slate-50/50">
                      <p>{faq.answer}</p>
                      <div className="mt-4 pt-4 border-t border-slate-200/50 flex flex-wrap gap-4 text-xs font-bold text-slate-400">
                        <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">Category: <span className="text-slate-700">{faq.category}</span></span>
                        <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">Was this helpful? 👍 ({faq.helpfulCount})</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Submit Support Ticket Form */}
        {activeTab === 'ticket' && (
          <div className="animate-in fade-in duration-500 max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -z-10"></div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-2">Submit a Support Ticket</h3>
              <p className="text-slate-500 font-medium mb-8">
                Our technical support team directly answers all compatibility, shipping, and order queries within 2 to 12 hours.
              </p>

              <form onSubmit={handleCreateTicketSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wider">1. Subject / Query Summary *</label>
                  <input
                    type="text"
                    placeholder="e.g. Compatibility check for Innova brake pads..."
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wider">2. Category *</label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-bold transition-all"
                    >
                      {SUPPORT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wider">3. Order Number</label>
                    <select
                      value={ticketForm.orderId}
                      onChange={(e) => setTicketForm({ ...ticketForm, orderId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium transition-all"
                    >
                      <option value="">-- No Order Reference --</option>
                      {orders.map(o => <option key={o.id} value={o.id}>Order #{o.orderNumber || o.id}</option>)}
                      {orders.length === 0 && <option value="AZ-904812">Order #AZ-904812 (Maruti Swift Brake Pads)</option>}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wider">4. Issue Details & Message *</label>
                  <textarea
                    rows={5}
                    placeholder="Describe your question or issue in detail..."
                    value={ticketForm.message}
                    onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium transition-all resize-none"
                    required
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="isComplaint"
                    checked={ticketForm.isComplaint}
                    onChange={(e) => setTicketForm({ ...ticketForm, isComplaint: e.target.checked })}
                    className="mt-1 w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="isComplaint" className="text-sm font-bold text-amber-900 cursor-pointer">
                    Flag as Urgent Complaint
                    <span className="block text-xs font-medium text-amber-700/80 mt-0.5">Triggers Urgent SLA response from senior support staff.</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 px-6 rounded-xl transition-colors shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" /> Submit Ticket Request
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: Knowledge Base Articles */}
        {activeTab === 'kb' && (
          <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kbArticles.map(art => (
                <div key={art.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer flex flex-col h-full">
                  <div className="mb-4">
                    <span className="inline-block bg-orange-100 text-orange-700 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest">
                      {art.category}
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-3 group-hover:text-orange-500 transition-colors leading-tight">
                    {art.title}
                  </h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 flex-1">
                    {art.summary}
                  </p>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900 group-hover:text-orange-500 transition-colors mt-auto pt-4 border-t border-slate-100">
                    Read Full Guide <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Contact & Working Hours */}
        {activeTab === 'contact' && (
          <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Phone className="w-8 h-8 text-orange-500" />
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-1">Call & WhatsApp</h4>
                <p className="text-xs text-slate-500 font-medium mb-4">Direct line to our store owner technical team</p>
                <div className="text-xl font-black text-slate-900">{config.phone}</div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Mail className="w-8 h-8 text-blue-500" />
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-1">Official Email</h4>
                <p className="text-xs text-slate-500 font-medium mb-4">Send official fitment inquiries & documents</p>
                <div className="text-lg font-black text-slate-900">{config.email}</div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Clock className="w-8 h-8 text-emerald-500" />
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-1">Working Hours</h4>
                <p className="text-xs text-slate-500 font-medium mb-4">{config.workingDays}</p>
                <div className="text-lg font-black text-emerald-600">{config.openingTime} - {config.closingTime}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
