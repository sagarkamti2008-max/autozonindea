import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { returnsWarrantyService } from '../services/returnsWarrantyService';
import {
  RotateCcw, CheckCircle2, XCircle, Clock, Truck, ShieldCheck, DollarSign,
  Package, ArrowLeft, RefreshCw, Eye, AlertTriangle, FileText
} from 'lucide-react';

export const AdminReturnDetailConsole = ({ returnNumber: propNumber, onNavigate }) => {
  const { showToast, navigateTo } = useStore();
  const nav = onNavigate || navigateTo;

  const returnNumber = propNumber || window.location.pathname.split('/admin/returns/')[1];
  const [returnReq, setReturnReq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Refund Modal State
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundCalc, setRefundCalc] = useState(null);
  const [refundProvider, setRefundProvider] = useState('manual');
  const [bankDetails, setBankDetails] = useState({ account_number: '', ifsc: '', bank_name: '' });

  useEffect(() => {
    if (!returnNumber) return;
    loadReturnDetail();
  }, [returnNumber]);

  const loadReturnDetail = async () => {
    setLoading(true);
    try {
      const data = await returnsWarrantyService.getReturnByNumber(returnNumber);
      setReturnReq(data);
    } catch (err) {
      console.error('Error loading return detail:', err);
      showToast('Error loading return details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus, message = '') => {
    if (!returnReq) return;
    setActionLoading(true);
    try {
      const res = await returnsWarrantyService.updateReturnStatus(returnReq.id, newStatus, 'Admin Manager', message);
      if (res.success) {
        showToast(`Status updated to ${newStatus.toUpperCase()}`, 'success');
        loadReturnDetail();
      } else {
        showToast('Failed to update status: ' + res.error, 'error');
      }
    } catch (err) {
      showToast('Error updating status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenRefundModal = async () => {
    if (!returnReq) return;
    try {
      const calc = await returnsWarrantyService.calculateRefundAmount(returnReq.id);
      setRefundCalc(calc);
      setIsRefundModalOpen(true);
    } catch (err) {
      showToast('Error calculating refund', 'error');
    }
  };

  const handleExecuteRefund = async (e) => {
    e.preventDefault();
    if (!returnReq) return;
    setActionLoading(true);
    try {
      const res = await returnsWarrantyService.processRefund({
        returnRequestId: returnReq.id,
        provider: refundProvider,
        bankDetails,
        adminName: 'Admin Specialist'
      });

      if (res.success) {
        showToast(`Refund of ₹${res.amount} completed! Refund Ref: ${res.refundNumber}`, 'success');
        setIsRefundModalOpen(false);
        loadReturnDetail();
      } else {
        showToast('Refund failed: ' + res.error, 'error');
      }
    } catch (err) {
      showToast('Error executing refund', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveReplacement = async () => {
    if (!returnReq) return;
    setActionLoading(true);
    try {
      const res = await returnsWarrantyService.processReplacementOrder({
        returnRequestId: returnReq.id,
        adminName: 'Admin Specialist'
      });

      if (res.success) {
        showToast(`Replacement order ${res.replacementNumber} created!`, 'success');
        loadReturnDetail();
      } else {
        showToast('Replacement creation failed: ' + res.error, 'error');
      }
    } catch (err) {
      showToast('Error approving replacement', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <Clock size={36} color="#FF6B00" style={{ animation: 'spin 1.5s linear infinite' }} />
        <h3 style={{ marginTop: '1rem', color: '#0F2167' }}>Loading Return Request Details...</h3>
      </div>
    );
  }

  if (!returnReq) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', background: '#fff', padding: '2rem', borderRadius: '12px' }}>
        <h3>Return Request Not Found</h3>
        <button onClick={() => nav('admin/returns')} style={{ background: '#0F2167', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', marginTop: '1rem' }}>
          Back to Returns Console
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem', background: '#f8fafc', minHeight: '100vh' }}>
      <button
        onClick={() => nav('admin/returns')}
        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}
      >
        <ArrowLeft size={16} /> Back to Return Requests List
      </button>

      {/* Header Banner */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #0F2167 0%, #1e293b 100%)', padding: '2rem', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ color: '#FF6B00', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>Return Management</span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0.2rem 0 0 0', color: '#ffffff' }}>
              {returnReq.return_number}
            </h1>
            <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
              Order #: {returnReq.orders?.order_number || 'N/A'} • Customer: {returnReq.customers?.name} ({returnReq.customers?.phone})
            </p>
          </div>

          <div>
            <span style={{
              display: 'inline-block',
              padding: '0.35rem 0.8rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 800,
              background: returnReq.status === 'completed' || returnReq.status === 'refund_completed' ? '#22c55e' : '#FF6B00',
              color: '#ffffff'
            }}>
              STATUS: {returnReq.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ padding: '1.25rem 2rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F2167' }}>Workflow Actions:</span>

          {returnReq.status === 'requested' && (
            <>
              <button
                onClick={() => handleUpdateStatus('approved', 'Return request approved by admin')}
                disabled={actionLoading}
                style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Approve Return Request
              </button>
              <button
                onClick={() => handleUpdateStatus('rejected', 'Return request rejected by admin')}
                disabled={actionLoading}
                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Reject Request
              </button>
            </>
          )}

          {returnReq.status === 'approved' && (
            <button
              onClick={() => handleUpdateStatus('pickup_scheduled', 'Reverse pickup scheduled with courier partner')}
              disabled={actionLoading}
              style={{ background: '#0F2167', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Schedule Reverse Pickup
            </button>
          )}

          {returnReq.status === 'pickup_scheduled' && (
            <button
              onClick={() => handleUpdateStatus('in_transit', 'Returned item picked up and in transit')}
              disabled={actionLoading}
              style={{ background: '#0F2167', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Mark In Transit
            </button>
          )}

          {(returnReq.status === 'in_transit' || returnReq.status === 'pickup_scheduled') && (
            <button
              onClick={() => handleUpdateStatus('received', 'Returned package received at warehouse')}
              disabled={actionLoading}
              style={{ background: '#0F2167', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Mark Received at Warehouse
            </button>
          )}

          {returnReq.status === 'received' && (
            <button
              onClick={() => nav(`admin/returns/${returnReq.return_number}/inspection`)}
              style={{ background: '#FF6B00', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <ShieldCheck size={16} /> Open Return Inspection Console ↗
            </button>
          )}

          {(returnReq.status === 'approved_for_refund' || returnReq.status === 'inspection') && (
            <button
              onClick={handleOpenRefundModal}
              disabled={actionLoading}
              style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <DollarSign size={16} /> Execute Payment Refund
            </button>
          )}

          {(returnReq.status === 'approved_for_replacement' || returnReq.status === 'inspection') && returnReq.return_type === 'replacement' && (
            <button
              onClick={handleApproveReplacement}
              disabled={actionLoading}
              style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Package size={16} /> Process Replacement Order
            </button>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Returned Items & Inspection Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F2167', marginBottom: '1rem' }}>
              Returned Product Items
            </h3>
            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '0.75rem' }}>Product</th>
                    <th style={{ padding: '0.75rem' }}>SKU</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Price (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {(returnReq.return_items || []).map((ritem, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: '#0F2167' }}>{ritem.products?.name || 'Spare Part'}</td>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace', color: '#475569' }}>{ritem.products?.sku || 'N/A'}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 700 }}>{ritem.quantity}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 700 }}>₹{ritem.products?.price || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity History */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F2167', marginBottom: '1rem' }}>
              Return Activity Log
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(returnReq.return_activity || []).map((act, i) => (
                <div key={i} style={{ borderLeft: '3px solid #FF6B00', paddingLeft: '0.75rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F2167' }}>{act.activity_type.toUpperCase()}</div>
                  <div style={{ fontSize: '0.82rem', color: '#334155' }}>{act.message}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {new Date(act.created_at).toLocaleString()} by {act.created_by || 'Admin'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer & Financial Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#0F2167', fontSize: '1rem', fontWeight: 800 }}>Customer Info</h4>
            <div style={{ fontSize: '0.88rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div><strong>Name:</strong> {returnReq.customers?.name}</div>
              <div><strong>Phone:</strong> {returnReq.customers?.phone}</div>
              <div><strong>Email:</strong> {returnReq.customers?.email || 'N/A'}</div>
              <div><strong>Reason:</strong> {returnReq.reason}</div>
              {returnReq.customer_message && (
                <div style={{ fontStyle: 'italic', background: '#f8fafc', padding: '0.5rem', borderRadius: '6px', marginTop: '0.4rem' }}>
                  "{returnReq.customer_message}"
                </div>
              )}
            </div>
          </div>

          {/* Refund Details if processed */}
          {returnReq.refunds && returnReq.refunds.length > 0 && (
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #22c55e', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#15803d', fontSize: '1rem', fontWeight: 800 }}>Completed Refund</h4>
              {returnReq.refunds.map(ref => (
                <div key={ref.id} style={{ fontSize: '0.85rem', color: '#334155' }}>
                  <div><strong>Refund Ref:</strong> {ref.refund_number}</div>
                  <div><strong>Amount:</strong> ₹{ref.amount}</div>
                  <div><strong>Method:</strong> {ref.provider.toUpperCase()}</div>
                  <div><strong>Date:</strong> {new Date(ref.completed_at || ref.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* REFUND MODAL */}
      {isRefundModalOpen && refundCalc && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '550px', background: '#ffffff', borderRadius: '16px', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#0F2167', fontSize: '1.3rem', fontWeight: 800 }}>Execute Customer Refund</h3>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span>Item Subtotal:</span> <strong>₹{refundCalc.subtotal}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span>GST Tax (18%):</span> <strong>₹{refundCalc.taxAmount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', paddingTop: '0.4rem', fontSize: '1.1rem', fontWeight: 800, color: '#0F2167' }}>
                <span>Calculated Refund Total:</span> <span style={{ color: '#22c55e' }}>₹{refundCalc.finalRefundAmount}</span>
              </div>
            </div>

            <form onSubmit={handleExecuteRefund}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Refund Method / Provider</label>
                <select
                  value={refundProvider}
                  onChange={e => setRefundProvider(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}
                >
                  <option value="manual">Manual Payment Gateway / Direct</option>
                  <option value="cod_bank">COD Customer Bank Transfer</option>
                  <option value="store_credit">AutoZoneIndia Store Credit Wallet</option>
                  <option value="razorpay">Razorpay Gateway Refund API</option>
                </select>
              </div>

              {refundProvider === 'cod_bank' && (
                <div style={{ marginBottom: '1rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>Bank Account Number</label>
                  <input
                    type="text"
                    placeholder="Account Number"
                    value={bankDetails.account_number}
                    onChange={e => setBankDetails({ ...bankDetails, account_number: e.target.value })}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', marginBottom: '0.4rem' }}
                  />
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>IFSC Code</label>
                  <input
                    type="text"
                    placeholder="IFSC Code"
                    value={bankDetails.ifsc}
                    onChange={e => setBankDetails({ ...bankDetails, ifsc: e.target.value })}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsRefundModalOpen(false)}
                  style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{ background: '#22c55e', color: '#ffffff', border: 'none', padding: '0.65rem 1.5rem', borderRadius: '6px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Confirm & Process Refund ₹{refundCalc.finalRefundAmount}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminReturnDetailConsole;
