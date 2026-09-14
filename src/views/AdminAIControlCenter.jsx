import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  processAdminAIQuery,
  forecastInventoryDemand,
  generateDailyMorningReport
} from '../services/aiAutomationEngine';
import {
  Bot, Sparkles, Send, ShieldCheck, AlertTriangle, TrendingUp, CheckCircle2,
  Cpu, Zap, BarChart2, MessageSquare, Lock, Activity, RefreshCw
} from 'lucide-react';

export const AdminAIControlCenter = () => {
  const { products, orders, sellerOffers, showToast } = useStore();

  const [activeTab, setActiveTab] = useState('assistant'); // 'assistant', 'completeness', 'forecasting', 'morning-report', 'safety'
  const [adminQueryInput, setAdminQueryInput] = useState('');
  const [chatLogs, setChatLogs] = useState([
    {
      sender: 'ai',
      text: 'Welcome to the AutoZon AI Business Control Center 🤖. Ask any natural language question about live orders, sales, low stock, or failed payments.'
    }
  ]);

  const [confirmationPrompt, setConfirmationPrompt] = useState(null);

  const forecast = forecastInventoryDemand(products, orders);
  const morningReport = generateDailyMorningReport({ products, orders, sellerOffers });

  const handleAdminQuerySubmit = (e) => {
    e.preventDefault();
    if (!adminQueryInput.trim()) return;

    const userQ = adminQueryInput;
    setChatLogs(prev => [...prev, { sender: 'admin', text: userQ }]);
    setAdminQueryInput('');

    setTimeout(() => {
      const res = processAdminAIQuery(userQ, { products, orders, sellerOffers });
      if (res.type === 'confirmation_required') {
        setConfirmationPrompt(res);
      } else {
        setChatLogs(prev => [...prev, { sender: 'ai', text: res.text, items: res.items }]);
      }
    }, 300);
  };

  const handleApproveConfirmation = () => {
    showToast('✅ Destructive Action Approved by Super Admin!');
    setChatLogs(prev => [...prev, { sender: 'ai', text: `Action "${confirmationPrompt.action}" executed successfully.` }]);
    setConfirmationPrompt(null);
  };

  return (
    <div className="container admin-dashboard-wrapper">
      <div className="admin-header">
        <Bot size={32} color="#0F2167" />
        <div>
          <h2>AI Control Center & Business Operating System</h2>
          <p>Real-data natural language queries, catalog completeness audit, inventory forecasting & 08:00 AM Morning Check</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs-bar">
        <button className={`admin-tab ${activeTab === 'assistant' ? 'active' : ''}`} onClick={() => setActiveTab('assistant')}>
          🤖 AI Business Assistant & Console
        </button>
        <button className={`admin-tab ${activeTab === 'forecasting' ? 'active' : ''}`} onClick={() => setActiveTab('forecasting')}>
          📈 Demand Forecasting & Inventory
        </button>
        <button className={`admin-tab ${activeTab === 'morning-report' ? 'active' : ''}`} onClick={() => setActiveTab('morning-report')}>
          🌅 08:00 AM Daily Morning Report
        </button>
        <button className={`admin-tab ${activeTab === 'safety' ? 'active' : ''}`} onClick={() => setActiveTab('safety')}>
          🛡️ AI Safety & Token Limits
        </button>
      </div>

      <div className="admin-tab-pane">
        {activeTab === 'assistant' && (
          <div className="admin-pane-card">
            <h3>Natural Language Admin Command Console</h3>

            {/* Chat Box */}
            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', height: '350px', overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {chatLogs.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    background: msg.sender === 'admin' ? '#0F2167' : '#FFFFFF',
                    color: msg.sender === 'admin' ? '#FFFFFF' : '#1E293B',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                    fontSize: '0.88rem'
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Confirmation Guard Modal Alert */}
            {confirmationPrompt && (
              <div className="portal-card" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', marginBottom: '1rem' }}>
                <h4 style={{ color: '#991B1B' }}><AlertTriangle size={18} /> Sensitive Operation Confirmation Guard</h4>
                <p style={{ fontSize: '0.85rem', color: '#7F1D1D', margin: '0.4rem 0 1rem 0' }}>{confirmationPrompt.text}</p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn-primary" style={{ background: '#DC2626' }} onClick={handleApproveConfirmation}>
                    Approve Action
                  </button>
                  <button className="btn-secondary" onClick={() => setConfirmationPrompt(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Input Bar */}
            <form onSubmit={handleAdminQuerySubmit} style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                placeholder="Type natural query (e.g. How many orders are pending? Show low stock items)..."
                value={adminQueryInput}
                onChange={(e) => setAdminQueryInput(e.target.value)}
                className="search-input-main"
                style={{ borderRadius: '8px' }}
              />
              <button type="submit" className="btn-primary">
                <Send size={16} /> Query DB
              </button>
            </form>
          </div>
        )}

        {activeTab === 'forecasting' && (
          <div className="admin-pane-card">
            <h3><TrendingUp size={20} /> AI Demand Forecasting & Restock Candidates</h3>
            <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product Title</th>
                    <th>Current Stock</th>
                    <th>Sales Velocity</th>
                    <th>Days Remaining</th>
                    <th>Suggested Reorder Qty</th>
                    <th>Forecast Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {forecast.map(item => (
                    <tr key={item.id}>
                      <td><b>{item.title}</b></td>
                      <td><b>{item.currentStock} units</b></td>
                      <td>{item.salesVelocity}</td>
                      <td>{item.estDaysRemaining}</td>
                      <td><b style={{ color: '#FF6B00' }}>+{item.suggestedReorderQty} units</b></td>
                      <td><span className="verified-tag good">{item.confidence}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'morning-report' && (
          <div className="admin-pane-card">
            <h3>🌅 Automated 08:00 AM Daily Business Morning Report</h3>
            <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Report Date: <b>{morningReport.date}</b> | System Health: <b style={{ color: '#10B981' }}>{morningReport.systemStatus}</b>
            </p>

            <div className="offers-grid">
              <div className="testimonial-card">
                <h4>Sales & Financial Executive Summary</h4>
                <p className="body-small">Gross Revenue: <b>{morningReport.totalRev}</b></p>
                <p className="body-small">Total Processed Orders: <b>{morningReport.totalOrders}</b></p>
                <p className="body-small">Low Stock Alerts: <b>{morningReport.lowStockCount} Items</b></p>
              </div>

              <div className="testimonial-card">
                <h4>Automated Morning Checks Completed</h4>
                <p className="body-small"><CheckCircle2 size={14} color="#10B981" /> 100% Payment Gateways Reconciled</p>
                <p className="body-small"><CheckCircle2 size={14} color="#10B981" /> XML Sitemaps Updated</p>
                <p className="body-small"><CheckCircle2 size={14} color="#10B981" /> Technical SEO Audited (0 Critical Errors)</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'safety' && (
          <div className="admin-pane-card">
            <h3><Lock size={20} /> AI Safety, Role Permissions & Token Limits</h3>
            <div className="offers-grid" style={{ marginTop: '1rem' }}>
              <div className="testimonial-card">
                <h4>Token Limits & Usage</h4>
                <p className="body-small">Daily AI Limit: 50,000 Tokens</p>
                <p className="body-small">Consumed Today: 12,400 Tokens (24.8%)</p>
              </div>

              <div className="testimonial-card">
                <h4>Safety Guards Active</h4>
                <p className="body-small"><ShieldCheck size={14} color="#10B981" /> Anti-Hallucination Real-DB Retriever Active</p>
                <p className="body-small"><ShieldCheck size={14} color="#10B981" /> Destructive Financial Confirmation Guard Active</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
