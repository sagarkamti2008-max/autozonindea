import React, { useState, useEffect } from 'react';
import { cmsSeoService } from '../services/cmsSeoService';
import { TrendingUp, AlertTriangle, Link, ArrowRight, Plus, Trash2, Edit2, CheckCircle2, Search, RefreshCw, Layers, Shield } from 'lucide-react';

export const AdminSeoConsole = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  const [seoAudit, setSeoAudit] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const [redirects, setRedirects] = useState([]);
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [redirectForm, setRedirectForm] = useState({ id: null, source_path: '', destination_path: '', status_code: 301, active: true });
  const [redirectMsg, setRedirectMsg] = useState(null);

  const [brokenLinksData, setBrokenLinksData] = useState(null);
  const [checkingLinks, setCheckingLinks] = useState(false);

  useEffect(() => {
    loadTabContent();
  }, [activeTab]);

  const loadTabContent = async () => {
    setLoading(true);
    if (activeTab === 'dashboard') {
      const data = await cmsSeoService.getSeoAuditDashboardData();
      setSeoAudit(data);
    } else if (activeTab === 'redirects') {
      const { data } = await cmsSeoService.getSeoRedirects();
      setRedirects(data || []);
    } else if (activeTab === 'brokenLinks') {
      await runBrokenLinkCheck();
    }
    setLoading(false);
  };

  const runBrokenLinkCheck = async () => {
    setCheckingLinks(true);
    const data = await cmsSeoService.detectBrokenInternalLinks();
    setBrokenLinksData(data);
    setCheckingLinks(false);
  };

  const handleSaveRedirect = async () => {
    if (!redirectForm.source_path || !redirectForm.destination_path) return;
    setRedirectMsg(null);

    let res;
    if (redirectForm.id) {
      res = await cmsSeoService.updateSeoRedirect(redirectForm.id, redirectForm);
    } else {
      res = await cmsSeoService.createSeoRedirect(redirectForm);
    }

    if (res.error) {
      setRedirectMsg({ type: 'error', text: res.error.message || 'Failed to save redirect.' });
    } else {
      setShowRedirectModal(false);
      loadTabContent();
    }
  };

  const handleDeleteRedirect = async (id) => {
    if (!window.confirm('Delete this SEO redirect?')) return;
    await cmsSeoService.deleteSeoRedirect(id);
    loadTabContent();
  };

  const filteredItems = (seoAudit?.items || []).filter(item => {
    if (filterType === 'all') return true;
    if (filterType === 'missingTitle') return !item.metaTitle;
    if (filterType === 'missingDesc') return !item.metaDesc;
    if (filterType === 'missingAlt') return !item.alt && item.type !== 'brand';
    if (filterType === 'noindex') return item.noindex;
    return true;
  });

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <TrendingUp size={24} className="text-emerald-400" /> SEO Management & Audit Console
          </h1>
          <p className="text-xs text-slate-400">
            Real-time metadata audit, completeness scoring, 301/302 redirects, and internal broken link detection.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'dashboard' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            SEO Audit Dashboard
          </button>
          <button
            onClick={() => setActiveTab('redirects')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'redirects' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Redirects Manager
          </button>
          <button
            onClick={() => setActiveTab('brokenLinks')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'brokenLinks' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Broken Link Checker
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 col-span-2 sm:col-span-2">
              <span className="text-[11px] text-slate-400 font-semibold block mb-1">Average Completeness</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-emerald-400">
                  {seoAudit?.stats?.avgCompleteness || 100}%
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {seoAudit?.stats?.totalAudited || 0} pages audited
                </span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
              <span className="text-[10px] text-slate-400 font-semibold block">Missing Meta Title</span>
              <span className="text-xl font-bold text-amber-400">{seoAudit?.stats?.missingTitles || 0}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
              <span className="text-[10px] text-slate-400 font-semibold block">Missing Meta Desc</span>
              <span className="text-xl font-bold text-amber-400">{seoAudit?.stats?.missingMetaDesc || 0}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
              <span className="text-[10px] text-slate-400 font-semibold block">Missing Alt Text</span>
              <span className="text-xl font-bold text-amber-400">{seoAudit?.stats?.missingAltText || 0}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
              <span className="text-[10px] text-slate-400 font-semibold block">Duplicate Titles</span>
              <span className="text-xl font-bold text-red-400">{seoAudit?.stats?.duplicateTitles || 0}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
              <span className="text-[10px] text-slate-400 font-semibold block">Duplicate Descs</span>
              <span className="text-xl font-bold text-red-400">{seoAudit?.stats?.duplicateDescs || 0}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
              <span className="text-[10px] text-slate-400 font-semibold block">noindex Pages</span>
              <span className="text-xl font-bold text-slate-300">{seoAudit?.stats?.noindexCount || 0}</span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: 'all', label: 'All Audited Pages' },
                { id: 'missingTitle', label: 'Missing Meta Title' },
                { id: 'missingDesc', label: 'Missing Meta Description' },
                { id: 'missingAlt', label: 'Missing Image Alt' },
                { id: 'noindex', label: 'Hidden (noindex)' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border whitespace-nowrap transition-colors ${
                    filterType === f.id
                      ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              onClick={loadTabContent}
              className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200"
              title="Refresh Audit"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="p-12 text-center text-slate-400">Performing live SEO audit...</div>
            ) : filteredItems.length === 0 ? (
              <div className="p-12 text-center text-slate-400">No issues found for this filter.</div>
            ) : (
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Page Title / Name</th>
                    <th className="p-3.5">Meta Title</th>
                    <th className="p-3.5">Meta Description</th>
                    <th className="p-3.5">Completeness</th>
                    <th className="p-3.5 text-right">Issues Detected</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase bg-slate-950 border border-slate-800 text-emerald-400">
                          {item.type}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-100">
                        <div>{item.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{item.link}</div>
                      </td>
                      <td className="p-3.5 text-slate-300 max-w-xs truncate">
                        {item.metaTitle || <span className="text-amber-400 font-semibold italic">Missing</span>}
                      </td>
                      <td className="p-3.5 text-slate-300 max-w-xs truncate">
                        {item.metaDesc || <span className="text-amber-400 font-semibold italic">Missing</span>}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${item.completeness.badgeColor}`}>
                          {item.completeness.score}% - {item.completeness.rating}
                        </span>
                      </td>
                      <td className="p-3.5 text-right text-[11px] text-slate-400">
                        {item.completeness.issues.length ? (
                          <span className="text-amber-400 font-medium">{item.completeness.issues.length} issue(s)</span>
                        ) : (
                          <span className="text-emerald-400 font-medium">Clean</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'redirects' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div>
              <h2 className="text-sm font-bold text-white">SEO Redirect Rules (301 Permanent / 302 Temporary)</h2>
              <p className="text-xs text-slate-400">Redirect legacy URLs to active pages with automatic loop prevention.</p>
            </div>
            <button
              onClick={() => {
                setRedirectForm({ id: null, source_path: '', destination_path: '', status_code: 301, active: true });
                setShowRedirectModal(true);
              }}
              className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Plus size={16} /> Add New Redirect
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="p-12 text-center text-slate-400">Loading redirects...</div>
            ) : redirects.length === 0 ? (
              <div className="p-12 text-center text-slate-400">No SEO redirects configured yet.</div>
            ) : (
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3.5">Source Path</th>
                    <th className="p-3.5">Destination Path</th>
                    <th className="p-3.5">HTTP Code</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {redirects.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-mono text-emerald-400 font-semibold">{r.source_path}</td>
                      <td className="p-3.5 font-mono text-slate-300">{r.destination_path}</td>
                      <td className="p-3.5 font-bold">{r.status_code}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                          r.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {r.active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setRedirectForm(r);
                            setShowRedirectModal(true);
                          }}
                          className="p-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteRedirect(r.id)}
                          className="p-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'brokenLinks' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Link size={18} className="text-emerald-400" /> Internal Broken Link Audit
              </h2>
              <p className="text-xs text-slate-400">
                Scans published blog posts and CMS pages to detect hyperlinks pointing to deleted/archived items.
              </p>
            </div>

            <button
              onClick={runBrokenLinkCheck}
              disabled={checkingLinks}
              className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw size={16} className={checkingLinks ? 'animate-spin' : ''} />
              {checkingLinks ? 'Scanning Links...' : 'Re-scan Content'}
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            {checkingLinks ? (
              <div className="py-12 text-center text-slate-400 flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Auditing internal HTML hyperlinks...</span>
              </div>
            ) : brokenLinksData?.brokenLinks?.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-base font-bold text-slate-100 mb-1">No Broken Links Found</h3>
                <p className="text-xs text-slate-400">
                  Scanned {brokenLinksData?.totalChecked || 0} internal links across all published articles and pages. Zero broken links detected.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <span className="text-xs font-bold text-red-400">
                  Found {brokenLinksData?.brokenLinks?.length || 0} broken internal link(s) out of {brokenLinksData?.totalChecked || 0} checked:
                </span>
                <table className="w-full text-left text-xs text-slate-300 border border-slate-800 rounded-lg overflow-hidden">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Source Page</th>
                      <th className="p-3">Broken Target Link</th>
                      <th className="p-3">Audit Finding</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {brokenLinksData?.brokenLinks?.map((b, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="p-3 font-semibold text-slate-100">
                          <div>{b.sourceTitle}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{b.sourceUrl}</div>
                        </td>
                        <td className="p-3 font-mono text-red-400">{b.targetUrl}</td>
                        <td className="p-3 text-slate-400">{b.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {showRedirectModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">{redirectForm.id ? 'Edit SEO Redirect' : 'New SEO Redirect'}</h3>
              <button onClick={() => setShowRedirectModal(false)}><Plus size={16} className="rotate-45" /></button>
            </div>

            {redirectMsg && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {redirectMsg.text}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Source Path * (e.g. /old-brake-page)</label>
                <input
                  type="text"
                  placeholder="/old-path"
                  value={redirectForm.source_path}
                  onChange={(e) => setRedirectForm({ ...redirectForm, source_path: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Destination Path * (e.g. /category/brakes)</label>
                <input
                  type="text"
                  placeholder="/new-path"
                  value={redirectForm.destination_path}
                  onChange={(e) => setRedirectForm({ ...redirectForm, destination_path: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">HTTP Code</label>
                  <select
                    value={redirectForm.status_code}
                    onChange={(e) => setRedirectForm({ ...redirectForm, status_code: parseInt(e.target.value, 10) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                  >
                    <option value={301}>301 Permanent</option>
                    <option value={302}>302 Temporary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Status</label>
                  <select
                    value={redirectForm.active ? 'active' : 'inactive'}
                    onChange={(e) => setRedirectForm({ ...redirectForm, active: e.target.value === 'active' })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Disabled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowRedirectModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRedirect}
                className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded"
              >
                Save Redirect Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
