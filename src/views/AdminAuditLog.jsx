import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { getAuditLogs } from '../services/adminAnalyticsEngine';
import { ShieldCheck, FileText, Search, Filter, History, User, Lock, Clock } from 'lucide-react';

export const AdminAuditLog = () => {
  const [searchFilter, setSearchFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const logs = getAuditLogs();

  const filteredLogs = logs.filter(log => {
    if (actionFilter !== 'all' && log.action !== actionFilter) return false;
    if (searchFilter.trim() !== '') {
      const q = searchFilter.toLowerCase().trim();
      const matchObj = String(log.object).toLowerCase().includes(q);
      const matchReason = String(log.reason).toLowerCase().includes(q);
      const matchAdmin = String(log.admin).toLowerCase().includes(q);
      if (!matchObj && !matchReason && !matchAdmin) return false;
    }
    return true;
  });

  return (
    <div className="container admin-dashboard-wrapper" style={{ maxWidth: '1350px', padding: '1.5rem 1rem' }}>
      {/* Header Banner */}
      <div className="admin-header" style={{ background: '#0F2167', color: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <History size={34} color="#FF6B00" />
          <div>
            <h2 style={{ color: '#FFFFFF', margin: 0, fontSize: '1.35rem' }}>Store Owner Administrative Audit Log Ledger</h2>
            <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>
              100% Traceable Records of Stock Changes, Order Statuses, Price Modifications & System Adjustments
            </span>
          </div>
        </div>
      </div>

      <div className="admin-pane-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0F2167' }}>Audit Activity Ledger ({filteredLogs.length})</h3>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.35rem 0.6rem' }}>
              <Search size={16} color="#64748B" style={{ marginRight: '0.4rem' }} />
              <input
                type="text"
                placeholder="Search Action, Object, Admin..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.8rem', width: '220px' }}
              />
            </div>

            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.35rem 0.6rem', fontSize: '0.8rem', fontWeight: 700 }}
            >
              <option value="all">All Action Types</option>
              <option value="Stock Adjustment">Stock Adjustment</option>
              <option value="Order Status Change">Order Status Change</option>
              <option value="Price Change">Price Change</option>
              <option value="Coupon Change">Coupon Change</option>
            </select>
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Admin User</th>
                <th>Action Performed</th>
                <th>Target Object</th>
                <th>Previous Value</th>
                <th>New Value</th>
                <th>Reason / Context</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id}>
                  <td><span style={{ fontSize: '0.75rem', color: '#64748B' }}>{new Date(log.timestamp).toLocaleString('en-IN')}</span></td>
                  <td>
                    <b style={{ color: '#0F2167', fontSize: '0.82rem' }}>{log.admin}</b>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, background: '#FFF7ED', color: '#FF6B00', border: '1px solid #FFD8A8', padding: '0.15rem 0.5rem', borderRadius: '10px' }}>
                      {log.action}
                    </span>
                  </td>
                  <td><code style={{ fontSize: '0.78rem' }}>{log.object}</code></td>
                  <td><span style={{ fontSize: '0.78rem', color: '#64748B' }}>{log.previousValue}</span></td>
                  <td><strong style={{ fontSize: '0.82rem', color: '#059669' }}>{log.newValue}</strong></td>
                  <td><span style={{ fontSize: '0.78rem', color: '#475569' }}>{log.reason}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
