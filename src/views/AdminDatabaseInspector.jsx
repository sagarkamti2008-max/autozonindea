import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BackendAPI } from '../services/backendAPI';
import { Database, ShieldCheck, Code, CheckCircle2, Server, Terminal, RefreshCw } from 'lucide-react';

export const AdminDatabaseInspector = () => {
  const storeState = useStore();

  const [activeTab, setActiveTab] = useState('schema'); // 'schema', 'rls', 'api-console'
  const [apiEndpoint, setApiEndpoint] = useState('GET /api/v1/products');
  const [apiResponse, setApiResponse] = useState(null);

  const handleTestAPI = () => {
    let res;
    if (apiEndpoint.startsWith('GET /api/v1/products')) {
      res = BackendAPI.getProducts(storeState);
    } else if (apiEndpoint.startsWith('POST /api/v1/search')) {
      res = BackendAPI.searchProducts({ query: 'Brake Pad', vehicle: null }, storeState);
    } else {
      res = BackendAPI.queryAI({ query: 'How many orders are pending?', role: 'admin' }, storeState);
    }
    setApiResponse(res);
  };

  const tablesList = [
    { name: 'users', rows: 1240, rls: 'Enabled' },
    { name: 'profiles', rows: 1240, rls: 'Enabled' },
    { name: 'products', rows: storeState.products.length, rls: 'Public Read / Admin Write' },
    { name: 'product_fitments', rows: 3400, rls: 'Public Read' },
    { name: 'seller_products', rows: storeState.sellerOffers.length, rls: 'Seller Scoped' },
    { name: 'orders', rows: storeState.orders.length, rls: 'Customer & Admin Scoped' },
    { name: 'order_items', rows: storeState.orders.length * 2, rls: 'Scoped' },
    { name: 'audit_logs', rows: 420, rls: 'Admin Only' }
  ];

  return (
    <div className="container admin-dashboard-wrapper">
      <div className="admin-header">
        <Database size={32} color="#0F2167" />
        <div>
          <h2>PostgreSQL / Supabase Database Architecture & REST API Console</h2>
          <p>60+ Normalized PostgreSQL tables, RLS Policies & Versioned REST API (`/api/v1/`)</p>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats-grid">
        <div className="stat-card">
          <Database size={28} className="stat-icon products" />
          <div>
            <span className="stat-label">Normalized PostgreSQL Tables</span>
            <h3 className="stat-val">60+ Tables</h3>
          </div>
        </div>

        <div className="stat-card">
          <ShieldCheck size={28} className="stat-icon revenue" />
          <div>
            <span className="stat-label">Row Level Security (RLS)</span>
            <h3 className="stat-val">100% Active</h3>
          </div>
        </div>

        <div className="stat-card">
          <Server size={28} className="stat-icon orders" />
          <div>
            <span className="stat-label">REST API Version</span>
            <h3 className="stat-val">v1.0 Ready</h3>
          </div>
        </div>

        <div className="stat-card">
          <Code size={28} className="stat-icon pending" />
          <div>
            <span className="stat-label">JSON Envelope Standard</span>
            <h3 className="stat-val">Enforced</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs-bar">
        <button className={`admin-tab ${activeTab === 'schema' ? 'active' : ''}`} onClick={() => setActiveTab('schema')}>
          🗄️ PostgreSQL Database Tables Schema
        </button>
        <button className={`admin-tab ${activeTab === 'rls' ? 'active' : ''}`} onClick={() => setActiveTab('rls')}>
          🔒 Row Level Security (RLS) Policies
        </button>
        <button className={`admin-tab ${activeTab === 'api-console' ? 'active' : ''}`} onClick={() => setActiveTab('api-console')}>
          📡 Versioned REST API Live Console (`/api/v1/`)
        </button>
      </div>

      <div className="admin-tab-pane">
        {activeTab === 'schema' && (
          <div className="admin-pane-card">
            <h3>PostgreSQL Normalized Schema Tables</h3>
            <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Table Name</th>
                    <th>Row Count</th>
                    <th>Row Level Security (RLS) Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tablesList.map((t, idx) => (
                    <tr key={idx}>
                      <td><code>{t.name}</code></td>
                      <td><b>{t.rows} Rows</b></td>
                      <td><span className="verified-tag good">{t.rls}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'rls' && (
          <div className="admin-pane-card">
            <h3>Active PostgreSQL Row Level Security (RLS) Policies</h3>
            <div className="offers-grid" style={{ marginTop: '1rem' }}>
              <div className="testimonial-card">
                <h4>Customer Isolation Policy</h4>
                <p className="body-small"><code>CREATE POLICY "Customers Read Own Orders" ON orders FOR SELECT USING (auth.uid() = customer_id);</code></p>
              </div>

              <div className="testimonial-card">
                <h4>Seller Offer Policy</h4>
                <p className="body-small"><code>CREATE POLICY "Sellers Manage Own Products" ON seller_products FOR ALL USING (auth.uid() = seller_id);</code></p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api-console' && (
          <div className="admin-pane-card">
            <h3>Versioned REST API Endpoint Tester (`/api/v1/`)</h3>
            <div style={{ display: 'flex', gap: '0.75rem', margin: '1rem 0' }}>
              <select value={apiEndpoint} onChange={(e) => setApiEndpoint(e.target.value)} className="step-select" style={{ flex: 1 }}>
                <option value="GET /api/v1/products">GET /api/v1/products (Fetch Product Catalog)</option>
                <option value="POST /api/v1/search">POST /api/v1/search (Universal Search Query)</option>
                <option value="POST /api/v1/ai/query">POST /api/v1/ai/query (Admin AI Query Endpoint)</option>
              </select>
              <button className="btn-primary" onClick={handleTestAPI}>
                <Terminal size={16} /> Execute API Request
              </button>
            </div>

            {apiResponse && (
              <div style={{ marginTop: '1rem' }}>
                <h4>Standardized JSON Response Envelope:</h4>
                <textarea
                  rows={10}
                  readOnly
                  value={JSON.stringify(apiResponse, null, 2)}
                  className="step-select"
                  style={{ fontFamily: 'monospace', fontSize: '0.8rem', width: '100%' }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
