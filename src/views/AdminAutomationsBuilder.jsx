import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Zap, Plus, CheckCircle2, AlertTriangle, Layers, Trash2, ArrowRight } from 'lucide-react';

export const AdminAutomationsBuilder = () => {
  const { showToast } = useStore();

  const [rules, setRules] = useState([
    { id: 'rule-1', when: 'Stock falls below threshold (30 units)', ifCond: 'Product is Active', thenAction: 'Create Inventory Task & Notify Manager', status: true },
    { id: 'rule-2', when: 'Order Status changes to Delivered', ifCond: 'Customer opted in', thenAction: 'Send Review Request Email & WhatsApp', status: true },
    { id: 'rule-3', when: 'Payment Verification Fails', ifCond: 'COD is disabled', thenAction: 'Keep cart state recoverable & send Payment Failed Alert', status: true }
  ]);

  const [newRule, setNewRule] = useState({ when: 'New Order Placed', ifCond: 'Order Value > ₹5,000', thenAction: 'Send SMS & WhatsApp Confirmation' });

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!newRule.when || !newRule.thenAction) return;
    setRules([...rules, { id: `rule-${Date.now()}`, ...newRule, status: true }]);
    setNewRule({ when: 'New Order Placed', ifCond: '', thenAction: '' });
    showToast('🎉 WHEN / IF / THEN Automation Rule Activated!');
  };

  return (
    <div className="container admin-dashboard-wrapper">
      <div className="admin-header">
        <Zap size={32} color="#FF6B00" />
        <div>
          <h2>No-Code Automation Builder (`/admin/automations`)</h2>
          <p>Configure event-driven WHEN / IF / THEN automation workflows for marketplace tasks</p>
        </div>
      </div>

      {/* Builder Form */}
      <div className="admin-pane-card" style={{ marginBottom: '1.5rem' }}>
        <h3>Create New Automation Trigger Rule</h3>
        <form onSubmit={handleAddRule} className="form-grid" style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <label>WHEN (Trigger Event) *</label>
            <select value={newRule.when} onChange={(e) => setNewRule({ ...newRule, when: e.target.value })}>
              <option value="New Order Placed">New Order Placed</option>
              <option value="Stock falls below threshold">Stock falls below threshold</option>
              <option value="Payment Verification Fails">Payment Verification Fails</option>
              <option value="Product Missing Fitment">Product Missing Fitment</option>
            </select>
          </div>

          <div className="form-group">
            <label>IF (Filter Condition)</label>
            <input type="text" placeholder="e.g. Order Value > ₹5,000" value={newRule.ifCond} onChange={(e) => setNewRule({ ...newRule, ifCond: e.target.value })} />
          </div>

          <div className="form-group">
            <label>THEN (Automated Action) *</label>
            <input type="text" placeholder="e.g. Create Inventory Task & Notify Manager" value={newRule.thenAction} onChange={(e) => setNewRule({ ...newRule, thenAction: e.target.value })} />
          </div>

          <div className="form-group full-width">
            <button type="submit" className="btn-primary">
              <Plus size={16} /> Activate Automation Rule
            </button>
          </div>
        </form>
      </div>

      {/* Rules Table */}
      <div className="admin-pane-card">
        <h3>Active Automation Rules</h3>
        <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>WHEN (Trigger)</th>
                <th>IF (Condition)</th>
                <th>THEN (Action)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rules.map(r => (
                <tr key={r.id}>
                  <td><b>{r.when}</b></td>
                  <td>{r.ifCond || 'Always'}</td>
                  <td><b style={{ color: '#FF6B00' }}>{r.thenAction}</b></td>
                  <td><span className="verified-tag good">Active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
