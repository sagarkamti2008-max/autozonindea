import React, { useState, useEffect } from 'react';
import { cmsSeoService } from '../services/cmsSeoService';
import { generateFaqJSONLD, generateBreadcrumbJSONLD } from '../services/seoEngine';
import { HelpCircle, Search, ChevronDown, ChevronUp } from 'lucide-react';

export const PublicFaqView = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const loadFaqs = async () => {
      setLoading(true);
      const { data } = await cmsSeoService.getFaqs({ status: 'published' });
      setFaqs(data || []);
      setLoading(false);
    };
    loadFaqs();
  }, []);

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Help & FAQ', url: '/faq' }
  ];

  const faqJsonLd = generateFaqJSONLD(filteredFaqs);
  const breadcrumbJsonLd = generateBreadcrumbJSONLD(breadcrumbs);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      {breadcrumbJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />}

      <div className="bg-slate-900 border-b border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full uppercase tracking-wider mb-3">
            AutoZoneIndia Support
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
            Find immediate answers regarding product compatibility, shipping across India, returns, warranty, and order tracking.
          </p>

          <div className="max-w-md mx-auto relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search question, warranty, delivery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mr-3"></div>
            <span>Loading FAQs...</span>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <div className="w-12 h-12 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center text-xl mx-auto mb-4">
              <HelpCircle size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">No FAQs Available</h3>
            <p className="text-slate-400 text-xs mb-6">
              {searchQuery ? `No questions matched "${searchQuery}".` : 'No FAQs have been published yet.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-slate-800 text-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all hover:border-slate-700"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-100 hover:text-emerald-400 transition-colors"
                  >
                    <span className="text-sm sm:text-base leading-snug">{faq.question}</span>
                    <div className="w-7 h-7 rounded-full bg-slate-950 flex items-center justify-center text-slate-400 flex-shrink-0">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div 
                      className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4 prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
