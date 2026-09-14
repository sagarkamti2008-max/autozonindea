import React, { useState, useEffect } from 'react';
import { cmsSeoService, calculateSeoCompleteness } from '../services/cmsSeoService';
import { SupabaseAPI } from '../services/supabaseClient';
import { Plus, Edit2, Eye, Search, Globe, Clock, RotateCcw, Save, AlertCircle, X, BookOpen, Tag, ShoppingBag, Truck } from 'lucide-react';

export const AdminBlogConsole = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [catFilter, setCatFilter] = useState('');

  const [isEditingPost, setIsEditingPost] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [postForm, setPostForm] = useState({
    title: '',
    slug: '',
    category_id: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    alt_text: '',
    status: 'draft',
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    noindex: false,
    product_ids: [],
    vehicle_ids: []
  });

  const [showCatModal, setShowCatModal] = useState(false);
  const [catForm, setCatForm] = useState({ id: null, name: '', slug: '', description: '', status: 'active' });

  const [versions, setVersions] = useState([]);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab, search, statusFilter, catFilter]);

  const loadData = async () => {
    setLoading(true);
    const { data: catData } = await cmsSeoService.getBlogCategories();
    setCategories(catData || []);

    if (activeTab === 'posts') {
      const { data: postData } = await cmsSeoService.getBlogPosts({
        status: statusFilter,
        category_id: catFilter,
        search
      });
      setPosts(postData || []);

      const { data: prods } = await SupabaseAPI.getCatalogProducts();
      setAllProducts((prods || []).map(p => ({ id: p.id, name: p.name || p.title })));

      const { data: vehs } = await SupabaseAPI.getVehicles();
      setAllVehicles((vehs || []).map(v => ({ id: v.id, name: `${v.make} ${v.model} (${v.variant || 'Base'})` })));
    }
    setLoading(false);
  };

  const loadSinglePost = async (id) => {
    const { data } = await cmsSeoService.getBlogPostBySlug(id);
    if (data) {
      setPostForm({
        ...data,
        product_ids: data.product_ids || [],
        vehicle_ids: data.vehicle_ids || []
      });
      const { data: vers } = await cmsSeoService.getBlogPostVersions(id);
      setVersions(vers || []);
    }
  };

  const handleSavePost = async (targetStatus = null) => {
    setSaving(true);
    setMsg(null);

    const payload = {
      ...postForm,
      status: targetStatus || postForm.status
    };

    if (!payload.slug) {
      payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    let res;
    if (currentPostId) {
      res = await cmsSeoService.updateBlogPost(currentPostId, payload);
    } else {
      res = await cmsSeoService.createBlogPost(payload);
    }

    setSaving(false);
    if (res.error) {
      setMsg({ type: 'error', text: res.error.message || 'Failed to save blog post.' });
    } else {
      setMsg({ type: 'success', text: `Article saved as ${payload.status}.` });
      if (res.data) {
        setCurrentPostId(res.data.id);
        setPostForm(res.data);
      }
      loadData();
    }
  };

  const handleSaveCategory = async () => {
    if (!catForm.name) return;
    const slug = catForm.slug || catForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let res;
    if (catForm.id) {
      res = await cmsSeoService.updateBlogCategory(catForm.id, { ...catForm, slug });
    } else {
      res = await cmsSeoService.createBlogCategory({ ...catForm, slug });
    }

    setShowCatModal(false);
    if (!res.error) {
      loadData();
    }
  };

  const handleRestoreVersion = async (verId) => {
    if (!window.confirm('Restore this post version?')) return;
    const res = await cmsSeoService.restoreBlogPostVersion(currentPostId, verId);
    setShowVersionModal(false);
    if (res.data) {
      setPostForm(res.data);
      setMsg({ type: 'success', text: 'Article restored to chosen historical version.' });
    }
  };

  const seoScore = calculateSeoCompleteness(postForm);

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BookOpen size={24} className="text-emerald-400" /> Blog & Editorial Console
          </h1>
          <p className="text-xs text-slate-400">
            Publish repair guides, industry articles, real product references, and category taxonomies.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => { setActiveTab('posts'); setIsEditingPost(false); }}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'posts' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Articles
          </button>
          <button
            onClick={() => { setActiveTab('categories'); setIsEditingPost(false); }}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'categories' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Categories
          </button>
        </div>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl border mb-6 text-xs flex items-center justify-between ${
          msg.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)}><X size={16} /></button>
        </div>
      )}

      {activeTab === 'posts' && (
        isEditingPost ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h2 className="text-sm font-bold text-slate-100">Article Content Editor</h2>
                  <button
                    onClick={() => setIsEditingPost(false)}
                    className="text-xs text-slate-400 hover:text-slate-200"
                  >
                    Back to List
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Article Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. How to replace Maruti Swift Brake Pads"
                    value={postForm.title}
                    onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Slug URL *</label>
                    <input
                      type="text"
                      placeholder="how-to-replace-swift-brake-pads"
                      value={postForm.slug}
                      onChange={(e) => setPostForm({ ...postForm, slug: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                    <select
                      value={postForm.category_id || ''}
                      onChange={(e) => setPostForm({ ...postForm, category_id: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="">Uncategorized</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Excerpt / Summary</label>
                  <textarea
                    rows={2}
                    placeholder="Brief summary displayed on article cards..."
                    value={postForm.excerpt || ''}
                    onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Rich HTML Body *</label>
                  <textarea
                    rows={14}
                    placeholder="<p>Write your detailed article body here...</p>"
                    value={postForm.content}
                    onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-xs font-mono text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">
                  Database References (No Fake Data)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                      <ShoppingBag size={14} className="text-emerald-400" /> Reference Real Products
                    </label>
                    <select
                      multiple
                      value={postForm.product_ids}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                        setPostForm({ ...postForm, product_ids: selected });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 h-28 focus:border-emerald-500 focus:outline-none"
                    >
                      {allProducts.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <span className="text-[10px] text-slate-500">Hold Ctrl/Cmd to select multiple products</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                      <Truck size={14} className="text-sky-400" /> Reference Real Vehicles
                    </label>
                    <select
                      multiple
                      value={postForm.vehicle_ids}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                        setPostForm({ ...postForm, vehicle_ids: selected });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 h-28 focus:border-emerald-500 focus:outline-none"
                    >
                      {allVehicles.map((v) => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </select>
                    <span className="text-[10px] text-slate-500">Hold Ctrl/Cmd to select multiple vehicles</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">
                  SEO & Search Settings
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Title</label>
                    <input
                      type="text"
                      value={postForm.meta_title || ''}
                      onChange={(e) => setPostForm({ ...postForm, meta_title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Canonical URL</label>
                    <input
                      type="text"
                      value={postForm.canonical_url || ''}
                      onChange={(e) => setPostForm({ ...postForm, canonical_url: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Description</label>
                  <textarea
                    rows={2}
                    value={postForm.meta_description || ''}
                    onChange={(e) => setPostForm({ ...postForm, meta_description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Featured Image URL</label>
                    <input
                      type="text"
                      value={postForm.featured_image_url || ''}
                      onChange={(e) => setPostForm({ ...postForm, featured_image_url: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Image Alt Text</label>
                    <input
                      type="text"
                      value={postForm.alt_text || ''}
                      onChange={(e) => setPostForm({ ...postForm, alt_text: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Publish Actions</h3>
                <div>
                  <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full uppercase ${
                    postForm.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' :
                    postForm.status === 'archived' ? 'bg-red-500/20 text-red-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {postForm.status}
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <button
                    disabled={saving}
                    onClick={() => handleSavePost('draft')}
                    className="w-full py-2 bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Save size={16} /> Save Draft
                  </button>

                  <button
                    disabled={saving}
                    onClick={() => handleSavePost('published')}
                    className="w-full py-2.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Globe size={16} /> Publish Article
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Google Preview</h3>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${seoScore.badgeColor}`}>
                    {seoScore.score}%
                  </span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1">
                  <div className="text-[11px] text-emerald-400 truncate">
                    https://autozonindia.vercel.app/blog/{postForm.slug || 'slug'}
                  </div>
                  <div className="text-sm font-medium text-blue-400 line-clamp-1">
                    {postForm.meta_title || postForm.title || 'Article Title'} | AutoZoneIndia
                  </div>
                  <div className="text-xs text-slate-400 line-clamp-2">
                    {postForm.meta_description || postForm.excerpt || 'Article summary description...'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                <div className="relative w-full">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search articles by title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>

                <button
                  onClick={() => {
                    setIsEditingPost(true);
                    setCurrentPostId(null);
                    setPostForm({
                      title: '',
                      slug: '',
                      category_id: '',
                      excerpt: '',
                      content: '',
                      featured_image_url: '',
                      alt_text: '',
                      status: 'draft',
                      meta_title: '',
                      meta_description: '',
                      canonical_url: '',
                      noindex: false,
                      product_ids: [],
                      vehicle_ids: []
                    });
                  }}
                  className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <Plus size={16} /> New Article
                </button>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              {loading ? (
                <div className="p-12 text-center text-slate-400">Loading articles...</div>
              ) : posts.length === 0 ? (
                <div className="p-12 text-center text-slate-400">No blog posts found.</div>
              ) : (
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3.5">Title</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">SEO Score</th>
                      <th className="p-3.5">Published Date</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {posts.map((p) => {
                      const score = calculateSeoCompleteness(p);
                      return (
                        <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5 font-medium text-slate-100">
                            <div>{p.title}</div>
                            <div className="text-[10px] text-slate-500 font-mono">/blog/{p.slug}</div>
                          </td>
                          <td className="p-3.5 text-slate-300 font-medium">
                            {p.category?.name || 'Uncategorized'}
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                              p.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${score.badgeColor}`}>
                              {score.score}%
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-400">
                            {p.published_at ? new Date(p.published_at).toLocaleDateString() : 'Not published'}
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            {p.status === 'published' && (
                              <a
                                href={`/blog/${p.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block p-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
                              >
                                <Eye size={14} />
                              </a>
                            )}
                            <button
                              onClick={() => {
                                setCurrentPostId(p.id);
                                loadSinglePost(p.slug);
                                setIsEditingPost(true);
                              }}
                              className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )
      )}

      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-xs font-semibold text-slate-300">Blog Taxonomy Categories ({categories.length})</span>
            <button
              onClick={() => {
                setCatForm({ id: null, name: '', slug: '', description: '', status: 'active' });
                setShowCatModal(true);
              }}
              className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Plus size={16} /> Add Category
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5">Category Name</th>
                  <th className="p-3.5">Slug</th>
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-bold text-slate-100">{c.name}</td>
                    <td className="p-3.5 text-slate-400 font-mono">{c.slug}</td>
                    <td className="p-3.5 text-slate-400">{c.description || '-'}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 uppercase">
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          setCatForm(c);
                          setShowCatModal(true);
                        }}
                        className="p-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
                      >
                        <Edit2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showCatModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">{catForm.id ? 'Edit Category' : 'New Blog Category'}</h3>
              <button onClick={() => setShowCatModal(false)}><X size={16} /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Slug</label>
                <input
                  type="text"
                  value={catForm.slug}
                  onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={catForm.description || ''}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCatModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs rounded font-bold"
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
