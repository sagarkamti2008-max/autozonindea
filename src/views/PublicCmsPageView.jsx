import React, { useState, useEffect } from 'react';
import { cmsSeoService } from '../services/cmsSeoService';
import { generateBreadcrumbJSONLD } from '../services/seoEngine';
import { Clock, FileText, ChevronRight, AlertTriangle } from 'lucide-react';

export const PublicCmsPageView = ({ slug }) => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPage = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: err } = await cmsSeoService.getCmsPageBySlug(slug);
        if (err || !data || data.status !== 'published') {
          setError('Page not found or is no longer published.');
          setPage(null);
        } else {
          setPage(data);
        }
      } catch (e) {
        setError('Failed to load page content.');
      } finally {
        setLoading(false);
      }
    };
    if (slug) loadPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-slate-950 text-white flex items-center justify-center p-8">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-400 font-medium">Loading page content...</span>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-[60vh] bg-slate-950 text-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center text-3xl mb-4 border border-red-500/20">
          <AlertTriangle size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">404 - Page Not Found</h1>
        <p className="text-slate-400 max-w-md mb-6">{error || 'The page you requested does not exist or has been archived.'}</p>
        <a href="/" className="px-6 py-2.5 bg-emerald-500 text-slate-950 font-semibold rounded-lg hover:bg-emerald-400 transition-colors">
          Return to Marketplace Home
        </a>
      </div>
    );
  }

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: page.page_type ? page.page_type.toUpperCase() : 'PAGE', url: '#' },
    { name: page.title, url: `/page/${page.slug}` }
  ];

  const breadcrumbJsonLd = generateBreadcrumbJSONLD(breadcrumbs);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {breadcrumbJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      )}

      <div className="bg-slate-900 border-b border-slate-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight size={14} className="text-slate-600" />}
                <a href={b.url} className={idx === breadcrumbs.length - 1 ? 'text-emerald-400 font-medium' : 'hover:text-slate-200 transition-colors'}>
                  {b.name}
                </a>
              </React.Fragment>
            ))}
          </nav>

          <span className="inline-block px-3 py-1 bg-slate-800 text-emerald-400 border border-slate-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-3">
            {page.page_type || 'PAGE'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {page.title}
          </h1>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            {page.published_at && (
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-emerald-400" />
                Updated {new Date(page.published_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <FileText size={14} className="text-emerald-400" />
              Verified AutoZoneIndia Resource
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {page.excerpt && (
          <div className="bg-slate-900/60 border-l-4 border-emerald-500 p-4 rounded-r-lg mb-8 text-slate-300 italic text-base leading-relaxed">
            {page.excerpt}
          </div>
        )}

        {page.featured_image_url && (
          <div className="mb-8 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 max-h-96">
            <img
              src={page.featured_image_url}
              alt={page.alt_text || page.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div 
          className="prose prose-invert max-w-none prose-emerald prose-headings:text-slate-100 prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-emerald-400 prose-strong:text-slate-100 prose-table:border-slate-800"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
};
