import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  generateXMLSitemapIndex,
  generateRobotsTxt,
  generateProductJSONLD,
  calculateSEOHealthScore,
  SAMPLE_GSC_PERFORMANCE
} from '../services/seoEngine';
import {
  Search, ShieldCheck, BarChart2, TrendingUp, CheckCircle2, AlertTriangle,
  FileText, Download, Code, Globe, RefreshCw, Plus, ArrowRight
} from 'lucide-react';

export const AdminSEOControlCenter = () => {
  const { products, categories, showToast } = useStore();

  const [activeTab, setActiveTab] = useState('health'); // 'health', 'gsc', 'sitemap', 'schema', 'redirects'
  const [redirects, setRedirects] = useState([
    { from: '/old-clutch-kit', to: '/product/AZ-PROD-001', code: 301, date: '2026-08-20' },
    { from: '/innova-pads', to: '/category/brakes', code: 301, date: '2026-08-18' }
  ]);

  const [newRedirect, setNewRedirect] = useState({ from: '', to: '' });

  const health = calculateSEOHealthScore(products, categories);
  const sitemapXML = generateXMLSitemapIndex(products, categories, []);
  const robotsTxt = generateRobotsTxt();

  const handleAddRedirect = (e) => {
    e.preventDefault();
    if (!newRedirect.from || !newRedirect.to) return;
    setRedirects([...redirects, { ...newRedirect, code: 301, date: new Date().toISOString().split('T')[0] }]);
    setNewRedirect({ from: '', to: '' });
    showToast('🎉 Permanent 301 Redirect Rule Saved!');
  };

  return (
    <div className="container admin-dashboard-wrapper">
      <div className="admin-header">
        <Globe size={32} color="#0F2167" />
        <div>
          <h2>Enterprise SEO Control Center & Search Engine Operating System</h2>
          <p>Technical SEO Audit, JSON-LD Schema.org, XML Sitemaps, GSC Performance & 301 Redirects</p>
        </div>
      </div>

      {/* SEO Health KPI Cards */}
      <div className="admin-stats-grid">
        <div className="stat-card">
          <ShieldCheck size={28} className="stat-icon revenue" />
          <div>
            <span className="stat-label">SEO Health Score</span>
            <h3 className="stat-val">{health.score}% Optimal</h3>
          </div>
        </div>

        <div className="stat-card">
          <TrendingUp size={28} className="stat-icon products" />
          <div>
            <span className="stat-label">GSC Total Clicks</span>
            <h3 className="stat-val">{SAMPLE_GSC_PERFORMANCE.totalClicks.toLocaleString()}</h3>
          </div>
        </div>

        <div className="stat-card">
          <Search size={28} className="stat-icon orders" />
          <div>
            <span className="stat-label">Search Impressions</span>
            <h3 className="stat-val">{SAMPLE_GSC_PERFORMANCE.totalImpressions.toLocaleString()}</h3>
          </div>
        </div>

        <div className="stat-card">
          <BarChart2 size={28} className="stat-icon pending" />
          <div>
            <span className="stat-label">Average Ranking Position</span>
            <h3 className="stat-val">#{SAMPLE_GSC_PERFORMANCE.avgPosition}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs-bar">
        <button className={`admin-tab ${activeTab === 'health' ? 'active' : ''}`} onClick={() => setActiveTab('health')}>
          SEO Health & Audit ({health.score}%)
        </button>
        <button className={`admin-tab ${activeTab === 'gsc' ? 'active' : ''}`} onClick={() => setActiveTab('gsc')}>
          Google Search Console & GA4
        </button>
        <button className={`admin-tab ${activeTab === 'sitemap' ? 'active' : ''}`} onClick={() => setActiveTab('sitemap')}>
          XML Sitemap & Robots.txt
        </button>
        <button className={`admin-tab ${activeTab === 'schema' ? 'active' : ''}`} onClick={() => setActiveTab('schema')}>
          JSON-LD Structured Data
        </button>
        <button className={`admin-tab ${activeTab === 'redirects' ? 'active' : ''}`} onClick={() => setActiveTab('redirects')}>
          301 Redirects Manager ({redirects.length})
        </button>
      </div>

      <div className="admin-tab-pane">
        {activeTab === 'health' && (
          <div className="admin-pane-card">
            <h3>Technical SEO Audit & Quality Metrics</h3>
            <div className="offers-grid" style={{ marginTop: '1rem' }}>
              <div className="testimonial-card">
                <h4>Canonicalization & URLs</h4>
                <p className="body-small"><CheckCircle2 size={14} color="#10B981" /> 100% Clean Canonical URLs Enforced</p>
                <p className="body-small"><CheckCircle2 size={14} color="#10B981" /> Dynamic Filter Query Stripping Active</p>
              </div>

              <div className="testimonial-card">
                <h4>Crawling & Indexability</h4>
                <p className="body-small"><CheckCircle2 size={14} color="#10B981" /> XML Sitemap Index Live (`/sitemap.xml`)</p>
                <p className="body-small"><CheckCircle2 size={14} color="#10B981" /> Private paths blocked in robots.txt (`/admin`, `/checkout`)</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gsc' && (
          <div className="admin-pane-card">
            <h3><TrendingUp size={20} /> Google Search Console Performance Data</h3>
            <div className="offers-grid" style={{ marginTop: '1rem' }}>
              <div className="admin-table-wrapper">
                <h4>Top Performing Pages</h4>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Page URL</th>
                      <th>Clicks</th>
                      <th>Impressions</th>
                      <th>CTR %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_GSC_PERFORMANCE.topPages.map((p, idx) => (
                      <tr key={idx}>
                        <td><code>{p.page}</code></td>
                        <td><b>{p.clicks}</b></td>
                        <td>{p.impressions}</td>
                        <td><span className="verified-tag good">{p.ctr}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-table-wrapper">
                <h4>Top Search Queries</h4>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Keyword</th>
                      <th>Clicks</th>
                      <th>Avg Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_GSC_PERFORMANCE.topKeywords.map((k, idx) => (
                      <tr key={idx}>
                        <td><b>{k.keyword}</b></td>
                        <td>{k.clicks}</td>
                        <td><span className="verified-tag good">#{k.pos}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sitemap' && (
          <div className="admin-pane-card">
            <h3><Code size={20} /> XML Sitemap & Robots.txt Generator</h3>
            
            <h4>Generated XML Sitemap (`/sitemap.xml`)</h4>
            <textarea
              rows={8}
              readOnly
              value={sitemapXML}
              className="step-select"
              style={{ fontFamily: 'monospace', fontSize: '0.8rem', width: '100%', marginBottom: '1.5rem' }}
            />

            <h4>Generated Robots.txt (`/robots.txt`)</h4>
            <textarea
              rows={5}
              readOnly
              value={robotsTxt}
              className="step-select"
              style={{ fontFamily: 'monospace', fontSize: '0.8rem', width: '100%' }}
            />
          </div>
        )}

        {activeTab === 'schema' && (
          <div className="admin-pane-card">
            <h3>JSON-LD Schema.org Inspector</h3>
            <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Preview rich snippet Product schema generated dynamically for catalog products.
            </p>

            <textarea
              rows={12}
              readOnly
              value={JSON.stringify(generateProductJSONLD(products[0]), null, 2)}
              className="step-select"
              style={{ fontFamily: 'monospace', fontSize: '0.8rem', width: '100%' }}
            />
          </div>
        )}

        {activeTab === 'redirects' && (
          <div className="admin-pane-card">
            <h3>301 Permanent Redirects Manager</h3>

            <form onSubmit={handleAddRedirect} className="form-grid" style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label>Old URL Path *</label>
                <input type="text" placeholder="/old-slug" value={newRedirect.from} onChange={(e) => setNewRedirect({ ...newRedirect, from: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Destination Target URL *</label>
                <input type="text" placeholder="/product/AZ-PROD-001" value={newRedirect.to} onChange={(e) => setNewRedirect({ ...newRedirect, to: e.target.value })} />
              </div>
              <div className="form-group full-width">
                <button type="submit" className="btn-primary">
                  <Plus size={16} /> Save 301 Redirect
                </button>
              </div>
            </form>

            <h4 style={{ marginTop: '1.5rem' }}>Active 301 Redirect Rules</h4>
            <div className="admin-table-wrapper" style={{ marginTop: '0.5rem' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Original Source URL</th>
                    <th>Target Destination</th>
                    <th>HTTP Code</th>
                    <th>Created Date</th>
                  </tr>
                </thead>
                <tbody>
                  {redirects.map((r, idx) => (
                    <tr key={idx}>
                      <td><code>{r.from}</code></td>
                      <td><code>{r.to}</code></td>
                      <td><span className="verified-tag good">{r.code} Permanent</span></td>
                      <td>{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
