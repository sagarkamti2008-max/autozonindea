import React, { useState, useEffect } from 'react';
import { cmsSeoService } from '../services/cmsSeoService';
import { Search, Calendar, ArrowRight, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

export const BlogListingView = ({ categorySlug = 'all', initialQuery = '' }) => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(categorySlug);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const limit = 9;

  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await cmsSeoService.getBlogCategories();
      setCategories(data || []);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      const { data, count } = await cmsSeoService.getBlogPosts({
        status: 'published',
        category_slug: activeCategory,
        search: searchQuery,
        page,
        limit
      });
      setPosts(data || []);
      setTotalCount(count || 0);
      setLoading(false);
    };
    loadPosts();
  }, [activeCategory, searchQuery, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    window.history.pushState({}, '', `/blog/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const totalPages = Math.ceil(totalCount / limit) || 1;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <div className="bg-slate-900 border-b border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full uppercase tracking-wider mb-3">
            AutoZoneIndia Knowledge Hub
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Automotive Insights & Repair Guides
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
            Expert maintenance advice, OEM spare part selection guides, vehicle troubleshooting, and industry trends.
          </p>

          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex items-center bg-slate-950 border border-slate-700 rounded-xl overflow-hidden focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all shadow-lg">
            <div className="pl-4 text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search guides, brake components, engine oils..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <button type="submit" className="px-6 py-3.5 bg-emerald-500 text-slate-950 font-semibold text-sm hover:bg-emerald-400 transition-colors">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <button
            onClick={() => { setActiveCategory('all'); setPage(1); }}
            className={`px-4 py-2 text-xs font-semibold rounded-full border whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            All Articles
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.slug); setPage(1); }}
              className={`px-4 py-2 text-xs font-semibold rounded-full border whitespace-nowrap transition-colors ${
                activeCategory === cat.slug
                  ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mr-3"></div>
            <span>Fetching verified articles...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto my-8">
            <div className="w-12 h-12 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center text-xl mx-auto mb-4">
              <BookOpen size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">No Articles Found</h3>
            <p className="text-slate-400 text-xs mb-6">
              {searchQuery ? `No published posts matched "${searchQuery}".` : 'No blog posts published yet in this section.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="px-4 py-2 bg-slate-800 text-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Clear Search & Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {posts.map((post) => (
                <a
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all flex flex-col hover:shadow-xl hover:shadow-emerald-950/20"
                >
                  <div className="relative h-48 bg-slate-950 overflow-hidden">
                    {post.featured_image_url ? (
                      <img
                        src={post.featured_image_url}
                        alt={post.alt_text || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800/40 text-slate-600">
                        <BookOpen size={36} />
                      </div>
                    )}
                    {post.category && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold rounded-md uppercase tracking-wider">
                        {post.category.name}
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <Calendar size={14} className="text-emerald-500" />
                        <span>{new Date(post.published_at || post.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <h2 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-2 mb-2 leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed mb-4">
                        {post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...'}
                      </p>
                    </div>

                    <div className="flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                      Read Full Article <ArrowRight size={14} className="ml-1.5" />
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-800 pt-6">
                <span className="text-xs text-slate-400">
                  Showing Page <strong className="text-slate-200">{page}</strong> of <strong className="text-slate-200">{totalPages}</strong> ({totalCount} total articles)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(prev => prev + 1)}
                    className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
