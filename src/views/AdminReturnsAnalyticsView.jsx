import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { returnsWarrantyService } from '../services/returnsWarrantyService';
import {
  RotateCcw, BarChart2, PieChart, RefreshCw, ArrowLeft, AlertTriangle, DollarSign
} from 'lucide-react';

export const AdminReturnsAnalyticsView = ({ onNavigate }) => {
  const { showToast, navigateTo } = useStore();
  const nav = onNavigate || navigateTo;

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await returnsWarrantyService.getReturnsAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Error loading returns analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F2167', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <RotateCcw color="#FF6B00" size={28} /> Returns & Refund Analytics
          </h1>
          <p style={{ color: '#64748b', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
            Real-time insights on total returns, refund payouts, replacement orders, and defective product alerts.
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#475569', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RefreshCw size={16} /> Refresh Metrics
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Total Return Requests</span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F2167', margin: '0.2rem 0 0 0' }}>
            {loading ? '...' : analytics?.totalReturns}
          </h3>
        </div>

        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600, textTransform: 'uppercase' }}>Total Refund Payouts</span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ef4444', margin: '0.2rem 0 0 0' }}>
            ₹{loading ? '...' : Number(analytics?.totalRefundValue).toLocaleString()}
          </h3>
        </div>

        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600, textTransform: 'uppercase' }}>Replacements Issued</span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#2563eb', margin: '0.2rem 0 0 0' }}>
            {loading ? '...' : analytics?.replacementCount} Orders
          </h3>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Top Return Reasons */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F2167', margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart size={20} color="#FF6B00" /> Top Return Reasons
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {analytics?.topReasons && analytics.topReasons.length > 0 ? (
              analytics.topReasons.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', pb: '0.4rem', fontSize: '0.88rem' }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{item.reason}</span>
                  <span style={{ fontWeight: 800, color: '#0F2167', background: '#f1f5f9', padding: '0.15rem 0.5rem', borderRadius: '12px', fontSize: '0.78rem' }}>
                    {item.count} Cases
                  </span>
                </div>
              ))
            ) : (
              <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No return reasons logged yet.</div>
            )}
          </div>
        </div>

        {/* Defective Products Watchlist */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F2167', margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} color="#ef4444" /> Defective Parts Watchlist
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {analytics?.topDefective && analytics.topDefective.length > 0 ? (
              analytics.topDefective.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', pb: '0.4rem', fontSize: '0.88rem' }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{item.name}</span>
                  <span style={{ fontWeight: 800, color: '#ef4444', background: '#fee2e2', padding: '0.15rem 0.5rem', borderRadius: '12px', fontSize: '0.78rem' }}>
                    {item.count} Defect Returns
                  </span>
                </div>
              ))
            ) : (
              <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No defective products logged.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminReturnsAnalyticsView;
