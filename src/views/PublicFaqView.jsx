import React, { useState, useEffect } from 'react';
import { cmsSeoService } from '../services/cmsSeoService';
import { generateFaqJSONLD, generateBreadcrumbJSONLD } from '../services/seoEngine';
import { useStore } from '../context/StoreContext';
import { 
  HelpCircle, Search, ChevronDown, ChevronUp, Car, CreditCard, 
  Truck, RefreshCw, Wrench, ShoppingBag, CheckCircle, ArrowRight, ShieldCheck, Phone, MessageCircle, FileText
} from 'lucide-react';

export const PublicFaqView = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const { setIsVehicleModalOpen, navigateTo } = useStore();

  const DEFAULT_FAQS = [
    {
      id: 'faq-101',
      category: 'Product & Compatibility',
      question: 'How do I ensure a spare part fits my specific car model?',
      answer: 'Use our <strong>Find Parts for My Car</strong> vehicle selector or check the OEM part number on your existing component. You can also send your vehicle RC or VIN number directly to our team at <strong>+91 8591719499</strong> on WhatsApp for 100% fitment verification.'
    },
    {
      id: 'faq-102',
      category: 'Price & Payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major UPI apps (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards, Net Banking, and Cash on Delivery (COD) across eligible Indian pin codes.'
    },
    {
      id: 'faq-103',
      category: 'Shipping & Delivery',
      question: 'How long does shipping take and how do I track my package?',
      answer: 'Standard delivery takes <strong>2-4 business days</strong> via express air logistics. Once dispatched, you receive live WhatsApp tracking notifications. You can also track your order anytime on our <a href="/track-order" class="text-emerald-400 font-bold hover:underline">Live Track Order</a> page.'
    },
    {
      id: 'faq-104',
      category: 'Returns & Replacement',
      question: 'What is your return & replacement policy?',
      answer: 'We offer a <strong>10-Day Hassle-Free Return / Replacement Policy</strong> for any unused, defected, or mismatched spare parts in their original box packaging.'
    },
    {
      id: 'faq-105',
      category: 'Orders',
      question: 'Can I get GST tax invoices for garage bulk purchases?',
      answer: 'Yes! SAGAR TRAVELS / KAMTI AUTOMOTIVE provides official GST tax invoices for all orders so garages, workshops, and business owners can claim full input tax credit.'
    }
  ];

  useEffect(() => {
    const loadFaqs = async () => {
      setLoading(true);
      const { data } = await cmsSeoService.getFaqs({ status: 'published' });
      setFaqs((data && data.length > 0) ? data : DEFAULT_FAQS);
      setLoading(false);
    };
    loadFaqs();
  }, []);

  const categories = [
    { id: 'All', label: 'All FAQs', icon: HelpCircle },
    { id: 'Product & Compatibility', label: 'Product & Compatibility', icon: Car },
    { id: 'Price & Payment', label: 'Price & Payment', icon: CreditCard },
    { id: 'Shipping & Delivery', label: 'Shipping & Delivery', icon: Truck },
    { id: 'Returns & Replacement', label: 'Returns & Replacement', icon: RefreshCw },
    { id: 'Orders', label: 'Orders', icon: ShoppingBag }
  ];

  const customerFlowSteps = [
    { num: 1, title: 'Select Car', sub: 'Brand & Model' },
    { num: 2, title: 'Check Fitment', sub: 'Year & Variant' },
    { num: 3, title: 'Browse Parts', sub: 'Catalog' },
    { num: 4, title: 'Compare Specs', sub: 'OEM & Warranty' },
    { num: 5, title: 'Add to Cart', sub: 'Review Items' },
    { num: 6, title: 'Checkout', sub: 'Address & GST' },
    { num: 7, title: 'Payment', sub: 'UPI / COD' },
    { num: 8, title: 'Dispatch', sub: 'Packed' },
    { num: 9, title: 'Live Tracking', sub: 'WhatsApp' },
    { num: 10, title: 'Delivery', sub: 'Doorstep' }
  ];

  const activeFaqs = faqs.length > 0 ? faqs : DEFAULT_FAQS;

  const filteredFaqs = activeFaqs.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesQuery = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (faq.category && faq.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Help & FAQ', url: '/faq' }
  ];

  const faqJsonLd = generateFaqJSONLD(filteredFaqs);
  const breadcrumbJsonLd = generateBreadcrumbJSONLD(breadcrumbs);

  // WhatsApp Question Resolver Trigger
  const handleWhatsAppQueryResolver = () => {
    const queryText = searchQuery.trim() ? `"${searchQuery.trim()}"` : 'spare parts fitment / order support';
    const text = `Hi SAGAR TRAVELS / KAMTI AUTOMOTIVE (+91 8591719499),\nI have a question regarding: ${queryText}. Please assist me.`;
    window.open(`https://wa.me/918591719499?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      {breadcrumbJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />}

      {/* Header Banner */}
      <div className="bg-slate-900 border-b border-slate-800 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-blue-500/10 opacity-50 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-black rounded-full uppercase tracking-wider">
            <ShieldCheck size={14} /> SAGAR TRAVELS / KAMTI AUTOMOTIVE SUPPORT DESK
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            Help & Frequently Asked Questions
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed">
            Everything you need to know about car spare parts fitment, shipping across India, Genuine OEM guarantees, GST invoices, and returns.
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto relative pt-4">
            <Search size={18} className="absolute left-4 top-8 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions (e.g. fitment, delivery, COD, GST, return)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* ⭐ Interactive Customer Flow Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                ⭐ SAGAR TRAVELS / KAMTI AUTOMOTIVE Shopping Flow
              </span>
              <h2 className="text-base font-extrabold text-white mt-2 flex items-center gap-2">
                <Car className="text-emerald-400" size={18} /> How Spare Parts Ordering Works
              </h2>
            </div>
            <button
              onClick={() => setIsVehicleModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <Car size={16} /> Check Car Fitment Now
            </button>
          </div>

          {/* Step Timeline */}
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
            {customerFlowSteps.map((step) => (
              <div 
                key={step.num}
                className="bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/40 p-2.5 rounded-xl text-center group transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-950 text-emerald-400 text-xs font-extrabold flex items-center justify-center mx-auto mb-1.5 transition-colors">
                  {step.num}
                </div>
                <div className="text-[11px] font-bold text-slate-200 group-hover:text-emerald-400 truncate">
                  {step.title}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {step.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-md'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon size={15} className={isSelected ? 'text-emerald-400' : 'text-slate-400'} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQs List Accordion */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mr-3"></div>
            <span>Loading FAQs...</span>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center shadow-xl space-y-4">
            <div className="w-14 h-14 bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center text-xl mx-auto border border-slate-700">
              <HelpCircle size={28} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-200">No Matching Questions Found</h3>
            <p className="text-slate-400 text-xs max-w-md mx-auto">
              No direct FAQ matching "{searchQuery}". Ask our support team directly on WhatsApp for instant resolution!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleWhatsAppQueryResolver}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                <MessageCircle size={16} /> Ask Support on WhatsApp (+91 8591719499)
              </button>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2.5 bg-slate-800 text-slate-200 rounded-xl text-xs font-extrabold hover:bg-slate-700 transition cursor-pointer"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-200 ${
                    isExpanded ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/5' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-extrabold text-slate-100 hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col gap-1">
                      {faq.category && (
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                          {faq.category}
                        </span>
                      )}
                      <span className="text-sm sm:text-base leading-snug">{faq.question}</span>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-slate-400 shrink-0 transition-colors ${
                      isExpanded ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-950'
                    }`}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-4 space-y-3">
                      <div 
                        className="prose prose-invert max-w-none text-slate-300"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />

                      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
                        <a
                          href={`https://wa.me/918591719499?text=${encodeURIComponent(`Hi SAGAR TRAVELS, I have a question about: "${faq.question}"`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold rounded-lg hover:bg-emerald-600/30 transition flex items-center gap-1.5"
                        >
                          <MessageCircle size={14} /> WhatsApp Quick Query
                        </a>

                        {faq.question.toLowerCase().includes('fit') && (
                          <button
                            onClick={() => setIsVehicleModalOpen(true)}
                            className="px-3.5 py-1.5 bg-slate-800 text-slate-200 text-xs font-extrabold rounded-lg hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Car size={14} /> Open Fitment Selector
                          </button>
                        )}

                        {faq.question.toLowerCase().includes('track') && (
                          <button
                            onClick={() => navigateTo('track-order')}
                            className="px-3.5 py-1.5 bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs font-extrabold rounded-lg hover:bg-blue-600/30 transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Truck size={14} /> Track Package Status
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Support Footer Banner */}
        <div className="mt-12 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl space-y-4">
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Still Need Help?</h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
            Our automotive tech team at <strong className="text-white">SAGAR TRAVELS / KAMTI AUTOMOTIVE</strong> is ready to assist with part compatibility, VIN cross-checks, or order questions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="https://wa.me/918591719499?text=Hello%20Sagar%20Travels%20Support,%20I%20need%20assistance"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer shadow-emerald-600/20"
            >
              <MessageCircle size={16} /> WhatsApp Support (+91 8591719499)
            </a>
            <a
              href="mailto:kamtiautomotive@gmail.com"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 font-extrabold text-xs rounded-xl border border-slate-700 transition flex items-center gap-2"
            >
              Email (kamtiautomotive@gmail.com)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicFaqView;


