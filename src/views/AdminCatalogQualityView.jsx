import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { catalogImportService } from '../services/catalogImportService';
import {
  ShieldAlert, AlertTriangle, CheckCircle2, RefreshCw, Search, Filter,
  FileText, Car, Package, Eye
} from 'lucide-react';

export const AdminCatalogQualityView = ({ onNavigate }) => {
  const { showToast, navigateTo } = useStore();
  const nav = onNavigate || navigateTo;

  const [qualityData, setQualityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'critical', 'warning', 'good'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    runQualityScan();
  }, []);

  const runQualityScan = async () => {
    setLoading(true);
    try {
      const data = await catalogImportService.scanCatalogQuality();
      setQualityData(data);
    } catch (err) {
      console.error('Error running catalog quality scan:', err);
      showToast('Error scanning catalog quality', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = (qualityData?.products || []).filter(p => {
    if (filterTab !== 'all' && p.healthStatus !== filterTab) return false;
    const term = searchTerm.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(term)) ||
      (p.sku && p.sku.toLowerCase().includes(term))
    );
  });

  return (
    <div style={{ padding: '1.5rem', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F2167', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldAlert color="#FF6B00" size={28} /> Catalog Data Quality & Completeness Center
          </h1>
          <p style={{ color: '#64748b', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
            Automated quality audit scanner inspecting missing SKUs, images, descriptions, categories, and vehicle compatibility rules.
          </p>
        </div>

        <button
          onClick={runQualityScan}
          style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#475569', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RefreshCw size={16} /> Re-scan Catalog Quality
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Avg Completeness Score</span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F2167', margin: '0.2rem 0 0 0' }}>
            {loading ? '...' : `${qualityData?.averageCompleteness}%`}
          </h3>
          <div style={{ background: '#f1f5f9', borderRadius: '6px', height: '6px', overflow: 'hidden', marginTop: '0.5rem' }}>
            <div style={{ background: '#FF6B00', height: '100%', width: `${qualityData?.averageCompleteness || 0}%` }}></div>
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600, textTransform: 'uppercase' }}>Critical Health (&lt;60%)</span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ef4444', margin: '0.2rem 0 0 0' }}>
            {loading ? '...' : qualityData?.totalCritical} Products
          </h3>
        </div>

        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: 600, textTransform: 'uppercase' }}>Warning (60-85%)</span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#d97706', margin: '0.2rem 0 0 0' }}>
            {loading ? '...' : qualityData?.totalWarning} Products
          </h3>
        </div>

        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600, textTransform: 'uppercase' }}>Good Quality (85-100%)</span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#16a34a', margin: '0.2rem 0 0 0' }}>
            {loading ? '...' : qualityData?.totalGood} Products
          </h3>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by Product Name or SKU..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.65rem 0.65rem 0.65rem 2.4rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'critical', 'warning', 'good'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: filterTab === tab ? '#0F2167' : '#f1f5f9',
                color: filterTab === tab ? '#ffffff' : '#475569'
              }}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Product Quality Table */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', color: '#475569', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                <th style={{ padding: '0.85rem 1rem' }}>SKU & Name</th>
                <th style={{ padding: '0.85rem 1rem' }}>Category & Brand</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Completeness %</th>
                <th style={{ padding: '0.85rem 1rem' }}>Identified Data Issues</th>
                <th style={{ padding: '0.85rem 1rem' }}>Health Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    Scanning catalog product completeness...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No products found matching quality filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(prod => (
                  <tr key={prod.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: '#0F2167' }}>{prod.name}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#64748b' }}>SKU: {prod.sku || 'MISSING'}</div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', color: '#475569' }}>
                      <div>Cat: {prod.categories?.name || 'Unassigned'}</div>
                      <div>Brand: {prod.brands?.name || 'Unassigned'}</div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem', color: prod.completenessScore < 60 ? '#ef4444' : prod.completenessScore < 85 ? '#d97706' : '#16a34a' }}>
                        {prod.completenessScore}%
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      {prod.issues.length === 0 ? (
                        <span style={{ color: '#16a34a', fontSize: '0.8rem', fontWeight: 600 }}>✓ All data fields present</span>
                      ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                          {prod.issues.map((iss, i) => (
                            <span key={i} style={{ background: '#fee2e2', color: '#991b1b', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                              {iss}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: '16px',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        background: prod.healthStatus === 'good' ? '#dcfce7' : prod.healthStatus === 'warning' ? '#fef3c7' : '#fee2e2',
                        color: prod.healthStatus === 'good' ? '#15803d' : prod.healthStatus === 'warning' ? '#92400e' : '#991b1b'
                      }}>
                        {prod.healthStatus.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AdminCatalogQualityView;
