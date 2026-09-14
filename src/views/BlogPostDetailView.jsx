import React, { useState, useEffect } from 'react';
import { cmsSeoService } from '../services/cmsSeoService';
import { generateArticleJSONLD, generateBreadcrumbJSONLD, BASE_URL } from '../services/seoEngine';
import { Calendar, User, ChevronRight, Share2, Check, ExternalLink, Truck, ShoppingBag, Layers, AlertTriangle } from 'lucide-react';

export const BlogPostDetailView = ({ slug }) => {
  const [post, setPost] = useState(null);
  const [referencedProducts, setReferencedProducts] = useState([]);
  const [referencedVehicles, setReferencedVehicles] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: err } = await cmsSeoService.getBlogPostBySlug(slug);
        if (err || !data || data.status !== 'published') {
          setError('Blog post not found or is unpublished.');
          setPost(null);
        } else {
          setPost(data);

          const [prods, vehs, related] = await Promise.all([
            data.product_ids?.length ? cmsSeoService.fetchRealProductsByIds(data.product_ids) : [],
            data.vehicle_ids?.length ? cmsSeoService.fetchRealVehiclesByIds(data.vehicle_ids) : [],
            cmsSeoService.fetchRelatedBlogPosts(data)
          ]);

          setReferencedProducts(prods);
          setReferencedVehicles(vehs);
          setRelatedPosts(related);
        }
      } catch (e) {
        setError('Failed to load article detail.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-slate-950 text-white flex items-center justify-center p-8">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-400 font-medium">Loading article details...</span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-[60vh] bg-slate-950 text-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center text-3xl mb-4 border border-red-500/20">
          <AlertTriangle size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Article Not Available</h1>
        <p className="text-slate-400 max-w-md mb-6">{error || 'This article does not exist or has been unpublished.'}</p>
        <a href="/blog" className="px-6 py-2.5 bg-emerald-500 text-slate-950 font-semibold rounded-lg hover:bg-emerald-400 transition-colors">
          Browse All Articles
        </a>
      </div>
    );
  }

  const canonicalUrl = post.canonical_url || `${BASE_URL}/blog/${post.slug}`;
  const shareText = encodeURIComponent(`${post.title} - Read on AutoZoneIndia`);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(canonicalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    ...(post.category ? [{ name: post.category.name, url: `/blog/category/${post.category.slug}` }] : []),
    { name: post.title, url: `/blog/${post.slug}` }
  ];

  const articleJsonLd = generateArticleJSONLD(post);
  const breadcrumbJsonLd = generateBreadcrumbJSONLD(breadcrumbs);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {articleJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />}
      {breadcrumbJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />}

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

          {post.category && (
            <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full uppercase tracking-wider mb-3">
              {post.category.name}
            </span>
          )}

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <User size={14} className="text-emerald-400" />
                AutoZoneIndia Technical Team
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-emerald-400" />
                Published {new Date(post.published_at || post.created_at).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[11px] uppercase font-semibold mr-1">Share:</span>
              <a
                href={`https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(canonicalUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-xs font-bold hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                title="Share on WhatsApp"
              >
                WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded text-xs font-bold hover:bg-blue-500 hover:text-white transition-colors"
                title="Share on Facebook"
              >
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(canonicalUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded text-xs font-bold hover:bg-sky-500 hover:text-white transition-colors"
                title="Share on X"
              >
                X
              </a>
              <button
                onClick={handleCopyLink}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center transition-colors text-xs"
                title="Copy Link"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {post.featured_image_url && (
          <div className="mb-8 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl max-h-[420px]">
            <img
              src={post.featured_image_url}
              alt={post.alt_text || post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div 
          className="prose prose-invert max-w-none prose-emerald prose-headings:text-slate-100 prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-emerald-400 prose-strong:text-slate-100 prose-table:border-slate-800 mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {referencedProducts.length > 0 && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-4">
              <ShoppingBag size={18} />
              <span>Recommended Genuine Products Mentioned in Article</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {referencedProducts.map((p) => (
                <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 flex items-center gap-3">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="w-12 h-12 rounded object-cover border border-slate-800" />
                  ) : (
                    <div className="w-12 h-12 bg-slate-900 rounded flex items-center justify-center text-slate-600 text-xs">
                      No Image
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-slate-100 truncate">{p.title}</h4>
                    <p className="text-[11px] text-emerald-400 font-bold">₹{p.price}</p>
                    {p.part_number && <p className="text-[10px] text-slate-500 font-mono">PN: {p.part_number}</p>}
                  </div>
                  {p.isActive ? (
                    <a
                      href={`/product/${p.slug || p.id}`}
                      className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-xs font-semibold hover:bg-emerald-500 hover:text-slate-950 transition-colors flex items-center gap-1"
                    >
                      View <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="px-2.5 py-1 bg-slate-800 text-slate-500 rounded text-[10px] font-semibold">
                      Out of Stock
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {referencedVehicles.length > 0 && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm mb-4">
              <Truck size={18} />
              <span>Compatible Vehicle Models Referenced</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {referencedVehicles.map((v) => (
                <a
                  key={v.id}
                  href={`/parts-for/${v.slug || v.id}`}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 hover:border-sky-500/50 hover:text-sky-400 transition-all flex items-center gap-1.5"
                >
                  <Layers size={14} className="text-slate-500" />
                  <span>{v.make} {v.model} ({v.variant || 'All Variants'})</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {relatedPosts.length > 0 && (
          <div className="border-t border-slate-800 pt-8 mt-10">
            <h3 className="text-lg font-bold text-slate-100 mb-6">Related Technical Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((rel) => (
                <a
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-emerald-500/50 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 line-clamp-2 mb-2 leading-snug hover:text-emerald-400">
                      {rel.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {rel.excerpt || 'Read full repair & maintenance insights...'}
                    </p>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold mt-3 flex items-center gap-1">
                    Read Post <ChevronRight size={14} />
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
