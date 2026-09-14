import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  getAdminWarrantyClaimsList,
  updateAdminWarrantyStatus,
  getWarrantyPolicySettings,
  updateWarrantyPolicySettings,
  calculateAfterSalesAnalytics,
  WARRANTY_STATUSES
} from '../services/returnsWarrantyService';
import {
  ShieldCheck, ShieldAlert, Wrench, CheckCircle2, XCircle, Search, Filter,
  Settings, Clock, Truck, FileText, ArrowRight, CornerDownLeft, AlertCircle,
  Eye, Check, X, RefreshCw, BarChart2
} from 'lucide-react';

export const AdminWarrantyManager = () => {
  const { orders, showToast } = useStore();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'Submitted' | 'Under Review' | 'Approved' | 'Inspection' | 'Repair' | 'Replacement' | 'Completed' | 'Rejected'
  const [searchQuery, setSearchQuery] = useState('');
  
  const [claimsList, setClaimsList] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);

  // Policy Settings Modal
  const [policyModal, setPolicyModal] = useState(false);
  const [policyForm, setPolicyForm] = useState(getWarrantyPolicySettings());

  // Analytics
  const analytics = calculateAfterSalesAnalytics(orders);

  const refreshList = () => {
    const list = getAdminWarrantyClaimsList({ statusFilter: activeTab, searchQuery });
    setClaimsList(list);
  };

  useEffect(() => {
    refreshList();
  }, [activeTab, searchQuery]);

  const handleStatusUpdate = (claimId, newStatus, extra = {}) => {
    const res = updateAdminWarrantyStatus({ claimId, newStatus, ...extra });
    if (res.success) {
      showToast(res.message, 'success');
      refreshList();
      if (selectedClaim && selectedClaim.id === claimId) {
        setSelectedClaim(res.claimRecord);
      }
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleSavePolicy = (e) => {
    e.preventDefault();
    const res = updateWarrantyPolicySettings(policyForm);
    if (res.success) {
      showToast('⚙️ Warranty Policy Settings Saved!', 'success');
      setPolicyModal(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem 0' }}>
      {/* Header Banner */}
      <div style={{ background: '#166534', color: '#FFFFFF', padding: '1.5rem', borderRadius: '14px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={32} color="#DCFCE7" />
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF' }}>
              Warranty Claims & Product Repair Operations Console
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#DCFCE7' }}>
              Verify Genuine OEM Warranties • Approve Technical Repairs & Exchanged Units
            </span>
          </div>
        </div>

        <button
          onClick={() => setPolicyModal(true)}
          style={{ background: '#FFFFFF', color: '#166534', border: 'none', borderRadius: '8px', padding: '0.55rem 1.1rem', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Settings size={16} /> Warranty Policy Settings
        </button>
      </div>

      {/* Analytics KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#FFFFFF', padding: '1.1rem', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #166534' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>TOTAL WARRANTY CLAIMS</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginTop: '0.2rem' }}>{analytics.totalWarrantyClaims} Claims</div>
          <span style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 700 }}>Direct OEM Warranties</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.1rem', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #10B981' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>CLAIM APPROVAL RATE</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#059669', marginTop: '0.2rem' }}>{analytics.approvalRate}% Approved</div>
          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>High Customer Satisfaction</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.1rem', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #3B82F6' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>APPROVED REPLACEMENTS</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1D4ED8', marginTop: '0.2rem' }}>{analytics.approvedWarranties} Units</div>
          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Exchanged Parts Dispatched</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.1rem', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #EF4444' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>REJECTED CLAIMS</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#DC2626', marginTop: '0.2rem' }}>{analytics.rejectedWarranties} Claims</div>
          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Expired or Physical Abuse</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ background: '#FFFFFF', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['ALL', 'Submitted', 'Under Review', 'Approved', 'Inspection', 'Repair', 'Replacement', 'Completed', 'Rejected'].map(st => (
            <button
              key={st}
              onClick={() => setActiveTab(st)}
              style={{
                background: activeTab === st ? '#166534' : '#F1F5F9',
                color: activeTab === st ? '#FFFFFF' : '#475569',
                border: 'none',
                borderRadius: '6px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {st}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.3rem 0.75rem' }}>
          <Search size={16} color="#64748B" style={{ marginRight: '0.4rem' }} />
          <input
            type="text"
            placeholder="Search Claim #, Order #, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.8rem', width: '220px' }}
          />
        </div>
      </div>

      {/* Main Grid: Warranty Claims List & Inspector Detail */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedClaim ? '1fr 480px' : '1fr', gap: '1.5rem' }}>
        {/* Claims Table */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>CLAIM # & DATE</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>CUSTOMER & ORDER</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>PRODUCT & SKU</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>ISSUE</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>STATUS</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {claimsList.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8' }}>
                    <ShieldCheck size={36} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                    <div>No warranty claims found.</div>
                  </td>
                </tr>
              ) : (
                claimsList.map(claim => (
                  <tr
                    key={claim.id}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      background: selectedClaim?.id === claim.id ? '#F0FDF4' : 'transparent',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedClaim(claim)}
                  >
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <b style={{ color: '#166534', display: 'block' }}>{claim.claimNumber}</b>
                      <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{new Date(claim.purchaseDate).toLocaleDateString('en-IN')}</span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ fontWeight: 800, color: '#0F172A', display: 'block' }}>{claim.customerName}</span>
                      <span style={{ fontSize: '0.72rem', color: '#0284C7' }}>Order #{claim.orderId}</span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', maxWidth: '240px' }}>
                      <div style={{ fontWeight: 700, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{claim.productTitle}</div>
                      <span style={{ fontSize: '0.7rem', color: '#64748B' }}>SKU: {claim.sku}</span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                        {claim.issue}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        background: claim.status === 'Completed' || claim.status === 'Approved' ? '#DCFCE7' : claim.status === 'Rejected' ? '#FEE2E2' : '#FEF3C7',
                        color: claim.status === 'Completed' || claim.status === 'Approved' ? '#166534' : claim.status === 'Rejected' ? '#991B1B' : '#B45309',
                        fontSize: '0.7rem',
                        fontWeight: 900,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '4px'
                      }}>
                        {claim.status}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClaim(claim);
                        }}
                        style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Inspect Claim
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Claim Detail Inspector Panel */}
        {selectedClaim && (
          <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>WARRANTY REFERENCE</span>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#166534' }}>{selectedClaim.claimNumber}</h3>
              </div>
              <button onClick={() => setSelectedClaim(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
            </div>

            <div style={{ background: '#F0FDF4', padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #BBF7D0' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#166534', marginBottom: '0.25rem' }}>{selectedClaim.productTitle}</div>
              <div style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', justifyContent: 'space-between' }}>
                <span>SKU: <b>{selectedClaim.sku}</b></span>
                <span>Duration: <b>{selectedClaim.warrantyDurationMonths} Months</b></span>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>TECHNICAL ISSUE & DESCRIPTION</span>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534', marginBottom: '0.35rem' }}>🔧 {selectedClaim.issue}</div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.65rem', borderRadius: '6px', lineHeight: 1.4 }}>
                "{selectedClaim.description || 'No description provided.'}"
              </p>
            </div>

            {/* Evidence Images */}
            {selectedClaim.evidenceImages && selectedClaim.evidenceImages.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '0.35rem' }}>CLAIM EVIDENCE PHOTOS</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {selectedClaim.evidenceImages.map((img, i) => (
                    <img key={i} src={img} alt="Evidence" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '0.4rem' }}>TIMELINE HISTORY</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '160px', overflowY: 'auto' }}>
                {selectedClaim.timeline.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ background: '#166534', color: '#FFFFFF', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 900, marginTop: '0.1rem' }}>
                      {idx + 1}
                    </div>
                    <div>
                      <b style={{ color: '#0F172A' }}>{item.status}</b> — <span style={{ color: '#64748B', fontSize: '0.68rem' }}>{new Date(item.timestamp).toLocaleString('en-IN')}</span>
                      <div style={{ color: '#475569', fontSize: '0.72rem' }}>{item.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decision Actions */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>ADMIN WARRANTY ACTIONS</span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  onClick={() => handleStatusUpdate(selectedClaim.id, 'Approved', { decision: 'Replacement', replacementTrackingNumber: `DLV-WAR-${Date.now()}` })}
                  style={{ background: '#166534', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '0.55rem', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  ✅ Approve Replacement
                </button>

                <button
                  onClick={() => handleStatusUpdate(selectedClaim.id, 'Repair', { decision: 'Repair', repairNotes: 'Sent to technical repair workbench.' })}
                  style={{ background: '#3B82F6', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '0.55rem', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  🛠️ Assign Repair
                </button>
              </div>

              <button
                onClick={() => {
                  const reason = prompt('Enter rejection reason for warranty claim:');
                  if (reason) handleStatusUpdate(selectedClaim.id, 'Rejected', { rejectionReason: reason });
                }}
                style={{ background: '#F8FAFC', color: '#DC2626', border: '1px solid #FCA5A5', borderRadius: '6px', padding: '0.45rem', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', marginTop: '0.25rem' }}
              >
                ❌ Reject Claim
              </button>
            </div>
          </div>
        )}
      </div>

      {/* POLICY SETTINGS MODAL (Section 55) */}
      {policyModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '14px', width: '100%', maxWidth: '480px', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, color: '#166534', fontSize: '1.1rem', fontWeight: 900 }}>
                Configure Store Warranty Policy Rules
              </h3>
              <button onClick={() => setPolicyModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleSavePolicy} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>DEFAULT WARRANTY DURATION (MONTHS)</label>
                <select value={policyForm.defaultWarrantyDurationMonths} onChange={(e) => setPolicyForm({ ...policyForm, defaultWarrantyDurationMonths: Number(e.target.value) })} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 700 }}>
                  <option value={6}>6 Months Warranty</option>
                  <option value={12}>12 Months (1 Year) Warranty Default</option>
                  <option value={24}>24 Months (2 Years) Extended Warranty</option>
                  <option value={36}>36 Months (3 Years) Heavy Duty Warranty</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setPolicyModal(false)} style={{ flex: 1, background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0.55rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, background: '#166534', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '0.55rem', fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer' }}>Save Settings</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
