import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { enquiryQuotationService } from '../services/enquiryQuotationService';
import {
  TrendingUp, BarChart2, PieChart, Users, DollarSign, CheckCircle2,
  Clock, ArrowUpRight, ArrowDownRight, RefreshCw, FileText
} from 'lucide-react';

export const AdminLeadAnalyticsView = () => {
  const { showToast } = useStore();
  const [metrics, setMetrics] = useState({
    totalEnquiries: 0,
    totalConverted: 0,
    conversionRate: 0,
    totalQuotedValue: 0,
    totalConvertedValue: 0,
    bySource: { website: 0, whatsapp: 0, phone: 0 },
    topRequestedParts: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await enquiryQuotationService.getLeadAnalytics();
      setMetrics(data || {
        totalEnquiries: 0,
        totalConverted: 0,
        conversionRate: 0,
        totalQuotedValue: 0,
        totalConvertedValue: 0,
        bySource: { website: 0, whatsapp: 0, phone: 0 },
        topRequestedParts: []
      });
    } catch (err) {
      console.error('Error loading lead analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F2167', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <TrendingUp color="#FF6B00" size={28} /> Sales Lead & Quotation Analytics
          </h1>
          <p style={{ color: '#64748b', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
            Real-time performance dashboard for enquiry conversion rates, total quoted revenues, and customer channel breakdown.
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#475569', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RefreshCw size={16} /> Refresh Metrics
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            Total Enquiries
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F2167' }}>
            {loading ? '...' : metrics.totalEnquiries}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#16a34a', marginTop: '0.4rem', fontWeight: 600 }}>
            Inbound customer requests
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            Lead Conversion Rate
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FF6B00' }}>
            {loading ? '...' : `${metrics.conversionRate}%`}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.4rem' }}>
            {metrics.totalConverted} successfully converted orders
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            Total Quoted Value
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F2167' }}>
            ₹{loading ? '...' : Number(metrics.totalQuotedValue).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.4rem' }}>
            Gross value of issued quotes
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            Converted Order Value
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#16a34a' }}>
            ₹{loading ? '...' : Number(metrics.totalConvertedValue).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#16a34a', marginTop: '0.4rem', fontWeight: 600 }}>
            Realized sales revenue
          </div>
        </div>
      </div>

      {/* Charts & Breakdown Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {/* Source Channel Breakdown */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F2167', margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart size={20} color="#FF6B00" /> Enquiries by Channel
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                <span>Website Form</span>
                <span>{metrics.bySource?.website || 0}</span>
              </div>
              <div style={{ background: '#f1f5f9', borderRadius: '6px', height: '10px', overflow: 'hidden' }}>
                <div style={{ background: '#0F2167', height: '100%', width: `${metrics.totalEnquiries ? ((metrics.bySource?.website || 0) / metrics.totalEnquiries) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                <span>WhatsApp Direct</span>
                <span>{metrics.bySource?.whatsapp || 0}</span>
              </div>
              <div style={{ background: '#f1f5f9', borderRadius: '6px', height: '10px', overflow: 'hidden' }}>
                <div style={{ background: '#25D366', height: '100%', width: `${metrics.totalEnquiries ? ((metrics.bySource?.whatsapp || 0) / metrics.totalEnquiries) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                <span>Phone / Desk</span>
                <span>{metrics.bySource?.phone || 0}</span>
              </div>
              <div style={{ background: '#f1f5f9', borderRadius: '6px', height: '10px', overflow: 'hidden' }}>
                <div style={{ background: '#FF6B00', height: '100%', width: `${metrics.totalEnquiries ? ((metrics.bySource?.phone || 0) / metrics.totalEnquiries) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Requested Parts */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F2167', margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart2 size={20} color="#FF6B00" /> Top Requested Spare Parts
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {metrics.topRequestedParts && metrics.topRequestedParts.length > 0 ? (
              metrics.topRequestedParts.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', pb: '0.5rem', fontSize: '0.88rem' }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{item.subject}</span>
                  <span style={{ fontWeight: 800, color: '#0F2167', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.75rem' }}>
                    {item.count} Requests
                  </span>
                </div>
              ))
            ) : (
              <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No top requested parts data available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminLeadAnalyticsView;
