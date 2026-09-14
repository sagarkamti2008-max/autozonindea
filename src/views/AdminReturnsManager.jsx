import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  getAdminReturnsList,
  updateAdminReturnStatus,
  recordReturnInspection,
  markRefundCompleted,
  getReturnPolicySettings,
  updateReturnPolicySettings,
  calculateAfterSalesAnalytics,
  RETURN_STATUSES,
  RETURN_REASONS,
  PRODUCT_CONDITIONS
} from '../services/returnsWarrantyService';
import {
  RotateCcw, ShieldAlert, PackageCheck, AlertTriangle, Search, Filter,
  CheckCircle2, XCircle, Clock, Truck, FileText, ArrowRight, CornerDownLeft,
  DollarSign, Check, X, Eye, Settings, RefreshCw, BarChart2, AlertCircle
} from 'lucide-react';

export const AdminReturnsManager = () => {
  const { orders, products, showToast } = useStore();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'Requested' | 'Under Review' | 'Approved' | 'Inspection' | 'Approved for Refund' | 'Approved for Replacement' | 'Completed' | 'Rejected'
  const [searchQuery, setSearchQuery] = useState('');
  const [reasonFilter, setReasonFilter] = useState('ALL');
  
  const [returnsList, setReturnsList] = useState([]);
  const [selectedReturn, setSelectedReturn] = useState(null);
  
  // Inspection Modal State
  const [inspectionModal, setInspectionModal] = useState(false);
  const [inspectCondition, setInspectCondition] = useState('Opened');
  const [inspectResult, setInspectResult] = useState('Accept Return'); // 'Accept Return' | 'Reject Return' | 'Replacement' | 'Refund' | 'Further Review'
  const [inspectNotes, setInspectNotes] = useState('');
  const [inspectRefundType, setInspectRefundType] = useState('Full Refund');

  // Policy Settings Modal State
  const [policyModal, setPolicyModal] = useState(false);
  const [policyForm, setPolicyForm] = useState(getReturnPolicySettings());

  // Analytics
  const analytics = calculateAfterSalesAnalytics(orders);

  const refreshList = () => {
    const list = getAdminReturnsList({ statusFilter: activeTab, reasonFilter, searchQuery });
    setReturnsList(list);
  };

  useEffect(() => {
    refreshList();
  }, [activeTab, reasonFilter, searchQuery]);

  const handleStatusUpdate = (returnId, newStatus, extra = {}) => {
    const res = updateAdminReturnStatus({ returnId, newStatus, ...extra });
    if (res.success) {
      showToast(res.message, 'success');
      refreshList();
      if (selectedReturn && selectedReturn.id === returnId) {
        setSelectedReturn(res.returnRecord);
      }
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleInspectionSubmit = (e) => {
    e.preventDefault();
    if (!selectedReturn) return;

    // Determine current product stock in inventory
    const targetProduct = products.find(p => p.id === selectedReturn.productId || p.title === selectedReturn.productTitle);
    const availableStock = targetProduct ? (targetProduct.stock !== undefined ? targetProduct.stock : 15) : 10;

    const res = recordReturnInspection({
      returnId: selectedReturn.id,
      condition: inspectCondition,
      result: inspectResult,
      notes: inspectNotes,
      refundType: inspectRefundType,
      availableStock
    });

    if (res.success) {
      showToast(`✅ Inspection recorded! Next status: ${res.returnRecord.status}`, 'success');
      setSelectedReturn(res.returnRecord);
      setInspectionModal(false);
      refreshList();
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleRefundCompleteSubmit = (returnId) => {
    const paymentRef = `RZP-REF-${Date.now()}`;
    const res = markRefundCompleted(returnId, paymentRef);
    if (res.success) {
      showToast(`💸 Refund of ₹${res.returnRecord.refundAmount || 0} completed successfully!`, 'success');
      setSelectedReturn(res.returnRecord);
      refreshList();
    }
  };

  const handleSavePolicy = (e) => {
    e.preventDefault();
    const res = updateReturnPolicySettings(policyForm);
    if (res.success) {
      showToast('⚙️ Return Policy Configuration Saved!', 'success');
      setPolicyModal(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem 0' }}>
      {/* Header Banner */}
      <div style={{ background: '#0F2167', color: '#FFFFFF', padding: '1.5rem', borderRadius: '14px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <RotateCcw size={32} color="#FF6B00" />
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF' }}>
              Customer Returns & Replacements Executive Hub
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>
              Single Store Owner After-Sales Operations • Inspection & Refund Control
            </span>
          </div>
        </div>

        <button
          onClick={() => setPolicyModal(true)}
          style={{ background: '#FF6B00', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.55rem 1.1rem', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Settings size={16} /> Return Policy Settings
        </button>
      </div>

      {/* Analytics KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#FFFFFF', padding: '1.1rem', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #3B82F6' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>TOTAL RETURNS</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginTop: '0.2rem' }}>{analytics.totalReturnsCount} Requests</div>
          <span style={{ fontSize: '0.7rem', color: '#3B82F6', fontWeight: 700 }}>{analytics.returnedUnitsCount} Total Units</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.1rem', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #10B981' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>COMPLETED REFUNDS</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#059669', marginTop: '0.2rem' }}>₹{analytics.totalRefundAmount.toLocaleString('en-IN')}</div>
          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Processed via Razorpay</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.1rem', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #F59E0B' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>REPLACEMENTS</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#D97706', marginTop: '0.2rem' }}>{analytics.replacementCount} Exchanged</div>
          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Fulfillments Triggered</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.1rem', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #EF4444' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>TOP RETURN REASON</span>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#DC2626', marginTop: '0.2rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {analytics.topReturnReasons[0]?.reason || 'None'}
          </div>
          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{analytics.topReturnReasons[0]?.count || 0} Incident Claims</span>
        </div>
      </div>

      {/* FITMENT INVESTIGATION WARNING BANNER (Sections 52, 53) */}
      {analytics.fitmentReviewRequiredProducts.length > 0 && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <AlertTriangle color="#DC2626" size={20} />
            <h4 style={{ margin: 0, color: '#991B1B', fontSize: '0.95rem', fontWeight: 900 }}>
              ⚠️ FITMENT REVIEW REQUIRED (Multiple Compatibility Returns Flagged)
            </h4>
          </div>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#7F1D1D' }}>
            The central intelligence engine detected multiple verified returns due to compatibility mismatch for the following SKUs:
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {analytics.fitmentReviewRequiredProducts.map((p, idx) => (
              <span key={idx} style={{ background: '#FFFFFF', border: '1px solid #F87171', color: '#991B1B', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                🚘 {p.title} (SKU: {p.sku}) — <b>{p.compatReturnCount} Fitment Claims</b>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filter & Search Controls */}
      <div style={{ background: '#FFFFFF', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['ALL', 'Requested', 'Under Review', 'Approved', 'Inspection', 'Approved for Refund', 'Approved for Replacement', 'Completed', 'Rejected'].map(st => (
            <button
              key={st}
              onClick={() => setActiveTab(st)}
              style={{
                background: activeTab === st ? '#0F2167' : '#F1F5F9',
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

        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.3rem 0.75rem' }}>
            <Search size={16} color="#64748B" style={{ marginRight: '0.4rem' }} />
            <input
              type="text"
              placeholder="Search Return #, Order #, SKU, Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.8rem', width: '220px' }}
            />
          </div>

          <select
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
            style={{ padding: '0.35rem 0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.78rem', fontWeight: 700 }}
          >
            <option value="ALL">All Return Reasons</option>
            {RETURN_REASONS.map((r, i) => <option key={i} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Main Grid: Return List & Return Detail Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedReturn ? '1fr 480px' : '1fr', gap: '1.5rem' }}>
        {/* Left Side: Returns Table */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>RETURN # & DATE</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>ORDER & CUSTOMER</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>PRODUCT & SKU</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>REASON</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>STATUS</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {returnsList.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8' }}>
                    <PackageCheck size={36} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                    <div>No return records found matching criteria.</div>
                  </td>
                </tr>
              ) : (
                returnsList.map(ret => (
                  <tr
                    key={ret.id}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      background: selectedReturn?.id === ret.id ? '#F0F9FF' : 'transparent',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedReturn(ret)}
                  >
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <b style={{ color: '#0F2167', display: 'block' }}>{ret.returnNumber}</b>
                      <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{new Date(ret.requestDate).toLocaleDateString('en-IN')}</span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ fontWeight: 800, color: '#0F172A', display: 'block' }}>{ret.customerName}</span>
                      <span style={{ fontSize: '0.72rem', color: '#0284C7' }}>Order #{ret.orderId}</span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', maxWidth: '240px' }}>
                      <div style={{ fontWeight: 700, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ret.productTitle}</div>
                      <span style={{ fontSize: '0.7rem', color: '#64748B' }}>SKU: {ret.sku} (Qty: {ret.quantity})</span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ background: '#FEF3C7', color: '#B45309', fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                        {ret.reason}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        background: ret.status === 'Completed' ? '#DCFCE7' : ret.status === 'Rejected' ? '#FEE2E2' : '#E0F2FE',
                        color: ret.status === 'Completed' ? '#166534' : ret.status === 'Rejected' ? '#991B1B' : '#0369A1',
                        fontSize: '0.7rem',
                        fontWeight: 900,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '4px'
                      }}>
                        {ret.status}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReturn(ret);
                        }}
                        style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Inspect & Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Right Side: Return Detail Panel */}
        {selectedReturn && (
          <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>RETURN REFERENCE</span>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0F2167' }}>{selectedReturn.returnNumber}</h3>
              </div>
              <button onClick={() => setSelectedReturn(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                <X size={20} />
              </button>
            </div>

            {/* Product & Order Details */}
            <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>{selectedReturn.productTitle}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
                <span>SKU: <b>{selectedReturn.sku}</b></span>
                <span>Qty: <b>{selectedReturn.quantity}</b> • Price: <b>₹{selectedReturn.unitPrice}</b></span>
              </div>
            </div>

            {/* Return Reason & Evidence */}
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>CUSTOMER REASON & DESCRIPTION</span>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#B45309', marginBottom: '0.35rem' }}>📌 {selectedReturn.reason}</div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', background: '#FFFBEB', border: '1px solid #FDE68A', padding: '0.65rem', borderRadius: '6px', lineHeight: 1.4 }}>
                "{selectedReturn.description || 'No description provided.'}"
              </p>
            </div>

            {/* Evidence Images */}
            {selectedReturn.evidenceImages && selectedReturn.evidenceImages.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '0.35rem' }}>ATTACHED EVIDENCE PHOTOS</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {selectedReturn.evidenceImages.map((img, i) => (
                    <img key={i} src={img} alt="Evidence" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
                  ))}
                </div>
              </div>
            )}

            {/* Timeline Log (Section 39) */}
            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '0.4rem' }}>LIFECYCLE TIMELINE</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '160px', overflowY: 'auto' }}>
                {selectedReturn.timeline.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ background: '#0F2167', color: '#FFFFFF', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 900, marginTop: '0.1rem' }}>
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

            {/* Admin Decision Actions */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>1-CLICK CLAIM APPROVAL ACTIONS</span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    handleStatusUpdate(selectedReturn.id, 'Approved for Refund', { adminNotes: '1-Click Fast Tracked Refund Approved by Admin' });
                    handleRefundCompleteSubmit(selectedReturn.id);
                  }}
                  style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.6rem', fontSize: '0.78rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}
                >
                  ⚡ 1-Click Approve Refund (₹{selectedReturn.unitPrice * selectedReturn.quantity})
                </button>

                <button
                  onClick={() => {
                    handleStatusUpdate(selectedReturn.id, 'Approved for Replacement', { adminNotes: '1-Click Free Replacement Unit Dispatched via Delhivery Express' });
                    showToast(`📦 Replacement Dispatch Order Created! Tracking #: DLV-REP-${Date.now()}`, 'success');
                  }}
                  style={{ background: 'linear-gradient(135deg, #0F2167, #1E3E62)', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.6rem', fontSize: '0.78rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 4px 10px rgba(15,33,103,0.3)' }}
                >
                  📦 1-Click Approve Replacement
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.25rem' }}>
                <button
                  onClick={() => setInspectionModal(true)}
                  style={{ background: '#F1F5F9', color: '#334155', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0.45rem', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  🔍 Detailed Quality Inspection
                </button>

                <button
                  onClick={() => {
                    const reason = prompt('Enter rejection reason for customer:');
                    if (reason) handleStatusUpdate(selectedReturn.id, 'Rejected', { rejectionReason: reason });
                  }}
                  style={{ background: '#F8FAFC', color: '#DC2626', border: '1px solid #FCA5A5', borderRadius: '6px', padding: '0.45rem', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  ❌ Reject Return
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INSPECTION RECORDING MODAL (Section 14) */}
      {inspectionModal && selectedReturn && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '14px', width: '100%', maxWidth: '520px', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, color: '#0F2167', fontSize: '1.1rem', fontWeight: 900 }}>
                Quality & Physical Return Inspection ({selectedReturn.returnNumber})
              </h3>
              <button onClick={() => setInspectionModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleInspectionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>PRODUCT PHYSICAL CONDITION</label>
                <select value={inspectCondition} onChange={(e) => setInspectCondition(e.target.value)} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 700 }}>
                  {PRODUCT_CONDITIONS.map((cond, i) => <option key={i} value={cond}>{cond}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>INSPECTION DECISION RESULT</label>
                <select value={inspectResult} onChange={(e) => setInspectResult(e.target.value)} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 700 }}>
                  <option value="Accept Return">Accept Return & Approve Refund</option>
                  <option value="Replacement">Approve Replacement (Stock Check)</option>
                  <option value="Reject Return">Reject Return (Quality Failed)</option>
                </select>
              </div>

              {inspectResult === 'Accept Return' && (
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>REFUND AMOUNT TYPE</label>
                  <select value={inspectRefundType} onChange={(e) => setInspectRefundType(e.target.value)} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}>
                    <option value="Full Refund">100% Full Refund (₹{selectedReturn.unitPrice * selectedReturn.quantity})</option>
                    <option value="Partial Refund">50% Partial Refund (Restocking Fee Applied)</option>
                  </select>
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>INSPECTOR NOTES</label>
                <textarea value={inspectNotes} onChange={(e) => setInspectNotes(e.target.value)} placeholder="Physical condition notes, serial number verify..." rows={3} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem', resize: 'none' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setInspectionModal(false)} style={{ flex: 1, background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0.55rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, background: '#0F2167', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '0.55rem', fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer' }}>Save Inspection</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POLICY CONFIGURATION MODAL (Section 54) */}
      {policyModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '14px', width: '100%', maxWidth: '500px', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, color: '#0F2167', fontSize: '1.1rem', fontWeight: 900 }}>
                Configure Store Return Policy Rules
              </h3>
              <button onClick={() => setPolicyModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleSavePolicy} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>RETURN WINDOW PERIOD (DAYS)</label>
                <select value={policyForm.returnWindowDays} onChange={(e) => setPolicyForm({ ...policyForm, returnWindowDays: Number(e.target.value) })} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 700 }}>
                  <option value={7}>7 Days Return Period</option>
                  <option value={10}>10 Days Return Period (Recommended)</option>
                  <option value={15}>15 Days Return Period</option>
                  <option value={30}>30 Days Return Period</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>DEFAULT RETURN SHIPPING PAYER</label>
                <select value={policyForm.shippingPayerDefault} onChange={(e) => setPolicyForm({ ...policyForm, shippingPayerDefault: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 700 }}>
                  <option value="Carrier Pickup">Carrier Pickup (Delhivery/Porter Pick Up)</option>
                  <option value="Store Pays">Store Pays Shipping Cost</option>
                  <option value="Customer Pays">Customer Pays Return Postage</option>
                  <option value="Self Ship">Self Ship to Hub</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setPolicyModal(false)} style={{ flex: 1, background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0.55rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, background: '#FF6B00', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '0.55rem', fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer' }}>Save Settings</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
