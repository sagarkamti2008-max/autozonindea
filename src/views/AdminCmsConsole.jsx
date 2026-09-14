import React, { useState, useEffect } from 'react';
import { cmsSeoService, calculateSeoCompleteness } from '../services/cmsSeoService';
import { Plus, Edit2, Eye, Search, Globe, Clock, RotateCcw, Save, AlertCircle, Check, X, Layers } from 'lucide-react';

export const AdminCmsConsole = ({ pageId = null, isNew = false }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const [isEditing, setIsEditing] = useState(isNew || Boolean(pageId));
  const [currentId, setCurrentId] = useState(pageId);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    page_type: 'page',
    content: '',
    excerpt: '',
    featured_image_url: '',
    alt_text: '',
    status: 'draft',
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    noindex: false
  });

  const [versions, setVersions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [showVersionModal, setShowVersionModal] = useState(false);

  useEffect(() => {
    loadPages();
  }, [statusFilter, typeFilter, search]);

  useEffect(() => {
    if (currentId) {
      loadSinglePage(currentId);
    }
  }, [currentId]);

  const loadPages = async () => {
    setLoading(true);
    const { data } = await cmsSeoService.getCmsPages({
      status: statusFilter,
      page_type: typeFilter,
      search
    });
    setPages(data || []);
    setLoading(false);
  };

  const loadSinglePage = async (id) => {
    const { data } = await cmsSeoService.getCmsPageById(id);
    if (data) {
      setFormData(data);
      const { data: vers } = await cmsSeoService.getCmsPageVersions(id);
      setVersions(vers || []);
    }
  };

  const handleSave = async (targetStatus = null) => {
    setSaving(true);
    setMsg(null);

    const payload = {
      ...formData,
      status: targetStatus || formData.status
    };

    if (!payload.slug) {
      payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    let res;
    if (currentId) {
      res = await cmsSeoService.updateCmsPage(currentId, payload);
    } else {
      res = await cmsSeoService.createCmsPage(payload);
    }

    setSaving(false);
    if (res.error) {
      setMsg({ type: 'error', text: res.error.message || 'Failed to save page.' });
    } else {
      setMsg({ type: 'success', text: `Page successfully saved as ${payload.status}.` });
      if (res.data) {
        setCurrentId(res.data.id);
        setFormData(res.data);
      }
      loadPages();
    }
  };

  const handleRestoreVersion = async (versionId) => {
    if (!window.confirm('Restore this historical version? This will update the current content.')) return;
    setSaving(true);
    const res = await cmsSeoService.restoreCmsPageVersion(currentId, versionId);
    setSaving(false);
    setShowVersionModal(false);
    if (res.data) {
      setFormData(res.data);
      setMsg({ type: 'success', text: 'Page content restored to target version.' });
      loadPages();
    }
  };

  const seoScore = calculateSeoCompleteness(formData);

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Layers size={24} className="text-emerald-400" /> CMS & Landing Page Management
          </h1>
          <p className="text-xs text-slate-400">
            Create, edit, version, and manage static pages, landing pages, and policy documents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <button
              onClick={() => { setIsEditing(false); setCurrentId(null); setMsg(null); }}
              className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              Back to Pages List
            </button>
          ) : (
            <button
              onClick={() => {
                setIsEditing(true);
                setCurrentId(null);
                setFormData({
                  title: '',
                  slug: '',
                  page_type: 'page',
                  content: '',
                  excerpt: '',
                  featured_image_url: '',
                  alt_text: '',
                  status: 'draft',
                  meta_title: '',
                  meta_description: '',
                  canonical_url: '',
                  noindex: false
                });
                setMsg(null);
              }}
              className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Plus size={16} /> Create New CMS Page
            </button>
          )}
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

      {isEditing ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Page Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Terms of Service, Return Policy"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">URL Slug *</label>
                  <input
                    type="text"
                    placeholder="e.g. terms-of-service"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Page Type</label>
                  <select
                    value={formData.page_type}
                    onChange={(e) => setFormData({ ...formData, page_type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="page">Page</option>
                    <option value="landing_page">Landing Page</option>
                    <option value="faq">FAQ</option>
                    <option value="policy">Policy Document</option>
                    <option value="guide">Guide</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Excerpt / Brief Summary</label>
                <textarea
                  rows={2}
                  placeholder="Short introductory text..."
                  value={formData.excerpt || ''}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">HTML / Rich Content *</label>
                <textarea
                  rows={12}
                  placeholder="<h2>Section Heading</h2><p>Page body content...</p>"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-xs font-mono text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">
                SEO & Search Metadata
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Title</label>
                  <input
                    type="text"
                    placeholder="Custom meta title for Google..."
                    value={formData.meta_title || ''}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Canonical URL</label>
                  <input
                    type="text"
                    placeholder="https://autozonindia.vercel.app/page/..."
                    value={formData.canonical_url || ''}
                    onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Description</label>
                <textarea
                  rows={2}
                  placeholder="150-160 character description..."
                  value={formData.meta_description || ''}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Featured Image URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.featured_image_url || ''}
                    onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Image Alt Text</label>
                  <input
                    type="text"
                    placeholder="Descriptive alt tag for image..."
                    value={formData.alt_text || ''}
                    onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="noindex-check"
                  checked={Boolean(formData.noindex)}
                  onChange={(e) => setFormData({ ...formData, noindex: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0"
                />
                <label htmlFor="noindex-check" className="text-xs text-slate-300 font-medium">
                  Hide from Search Engines (noindex tag)
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Publish Workflow</h3>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Current Status</label>
                <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full uppercase ${
                  formData.status === 'published' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  formData.status === 'archived' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {formData.status}
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <button
                  disabled={saving}
                  onClick={() => handleSave('draft')}
                  className="w-full py-2 bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Save size={16} /> Save Draft
                </button>

                <button
                  disabled={saving}
                  onClick={() => handleSave('published')}
                  className="w-full py-2.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Globe size={16} /> Publish Page
                </button>

                {formData.status === 'published' && (
                  <button
                    disabled={saving}
                    onClick={() => handleSave('archived')}
                    className="w-full py-2 bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                  >
                    Archive Page
                  </button>
                )}
              </div>

              {currentId && (
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setShowVersionModal(true)}
                    className="w-full py-2 bg-slate-950 border border-slate-800 text-slate-300 text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Clock size={16} /> View Version History ({versions.length})
                  </button>
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Google Search Preview</h3>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${seoScore.badgeColor}`}>
                  {seoScore.score}% - {seoScore.rating}
                </span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1">
                <div className="text-[11px] text-emerald-400 truncate">
                  https://autozonindia.vercel.app/page/{formData.slug || 'your-slug'}
                </div>
                <div className="text-sm font-medium text-blue-400 hover:underline line-clamp-1 cursor-pointer">
                  {formData.meta_title || formData.title || 'Page Title Placeholder'} | AutoZoneIndia
                </div>
                <div className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {formData.meta_description || formData.excerpt || 'Provide a compelling description so searchers click on your Google snippet result.'}
                </div>
              </div>

              {seoScore.issues.length > 0 && (
                <div className="space-y-1 pt-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">Recommendations:</span>
                  <ul className="text-[11px] text-slate-400 space-y-1">
                    {seoScore.issues.map((iss, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-amber-300/80">
                        <AlertCircle size={12} className="text-amber-400 flex-shrink-0" /> {iss}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
                  placeholder="Search pages by title..."
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

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
              >
                <option value="">All Page Types</option>
                <option value="page">Page</option>
                <option value="landing_page">Landing Page</option>
                <option value="faq">FAQ</option>
                <option value="policy">Policy Document</option>
                <option value="guide">Guide</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="p-12 text-center text-slate-400">Loading CMS pages...</div>
            ) : pages.length === 0 ? (
              <div className="p-12 text-center text-slate-400">No CMS pages created yet.</div>
            ) : (
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3.5">Title / Slug</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">SEO Score</th>
                    <th className="p-3.5">Updated</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {pages.map((p) => {
                    const score = calculateSeoCompleteness(p);
                    return (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-medium text-slate-100">
                          <div>{p.title}</div>
                          <div className="text-[10px] text-slate-500 font-mono">/page/{p.slug}</div>
                        </td>
                        <td className="p-3.5 uppercase text-[10px] font-semibold text-slate-400">
                          {p.page_type || 'PAGE'}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                            p.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' :
                            p.status === 'archived' ? 'bg-red-500/20 text-red-400' :
                            'bg-amber-500/20 text-amber-400'
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
                          {new Date(p.updated_at).toLocaleDateString()}
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          {p.status === 'published' && (
                            <a
                              href={`/page/${p.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block p-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
                              title="View Public Page"
                            >
                              <Eye size={14} />
                            </a>
                          )}
                          <button
                            onClick={() => {
                              setCurrentId(p.id);
                              setIsEditing(true);
                            }}
                            className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                            title="Edit Page"
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
      )}

      {showVersionModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock size={16} className="text-emerald-400" /> Historical Content Versions
              </h3>
              <button onClick={() => setShowVersionModal(false)}><X size={16} /></button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
              {versions.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No previous versions available.</p>
              ) : (
                versions.map((ver) => (
                  <div key={ver.id} className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-400">Version #{ver.version_number}</span>
                      <p className="text-[11px] text-slate-300 font-medium truncate max-w-xs">{ver.title}</p>
                      <span className="text-[10px] text-slate-500">{new Date(ver.created_at).toLocaleString()}</span>
                    </div>

                    <button
                      onClick={() => handleRestoreVersion(ver.id)}
                      className="px-3 py-1.5 bg-slate-800 text-slate-200 text-xs font-semibold rounded hover:bg-emerald-500 hover:text-slate-950 transition-colors flex items-center gap-1"
                    >
                      <RotateCcw size={14} /> Restore
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
