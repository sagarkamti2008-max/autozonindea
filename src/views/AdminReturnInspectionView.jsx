import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { returnsWarrantyService } from '../services/returnsWarrantyService';
import {
  ShieldCheck, CheckCircle2, AlertTriangle, ArrowLeft, RefreshCw, Package
} from 'lucide-react';

export const AdminReturnInspectionView = ({ returnNumber: propNumber, onNavigate }) => {
  const { showToast, navigateTo } = useStore();
  const nav = onNavigate || navigateTo;

  const returnNumber = propNumber || window.location.pathname.split('/admin/returns/')[1]?.replace('/inspection', '');
  const [returnReq, setReturnReq] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    productCondition: 'unopened',
    approvedQty: 1,
    rejectedQty: 0,
    damageNotes: '',
    internalNotes: '',
    restockSellable: true
  });

  useEffect(() => {
    if (!returnNumber) return;
    loadReturnDetail();
  }, [returnNumber]);

  const loadReturnDetail = async () => {
    setLoading(true);
    try {
      const data = await returnsWarrantyService.getReturnByNumber(returnNumber);
      setReturnReq(data);
      if (data && data.return_items) {
        const totalQ = data.return_items.reduce((s, i) => s + i.quantity, 0);
        setForm(prev => ({ ...prev, approvedQty: totalQ }));
      }
    } catch (err) {
      console.error('Error loading inspection details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitInspection = async (e) => {
    e.preventDefault();
    if (!returnReq) return;

    if (form.approvedQty < 0 || form.rejectedQty < 0) {
      showToast('Approved and rejected quantities must be non-negative.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await returnsWarrantyService.submitReturnInspection({
        returnRequestId: returnReq.id,
        inspectedBy: 'Warehouse Inspector',
        productCondition: form.productCondition,
        approvedQty: parseInt(form.approvedQty, 10),
        rejectedQty: parseInt(form.rejectedQty, 10),
        damageNotes: form.damageNotes,
        internalNotes: form.internalNotes,
        restockSellable: form.restockSellable
      });

      if (res.success) {
        showToast('Return inspection completed & reverse inventory updated!', 'success');
        nav(`admin/returns/${returnReq.return_number}`);
      } else {
        showToast('Inspection submission failed: ' + res.error, 'error');
      }
    } catch (err) {
      showToast('Error submitting inspection', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <RefreshCw size={36} color="#FF6B00" style={{ animation: 'spin 1.5s linear infinite' }} />
        <h3>Loading Inspection Checklist...</h3>
      </div>
    );
  }

  if (!returnReq) return <div>Return request not found.</div>;

  return (
    <div style={{ padding: '1.5rem', background: '#f8fafc', minHeight: '100vh' }}>
      <button
        onClick={() => nav(`admin/returns/${returnReq.return_number}`)}
        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}
      >
        <ArrowLeft size={16} /> Back to Return Details
      </button>

      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', maxWidth: '750px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <ShieldCheck color="#FF6B00" size={32} />
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F2167', margin: 0 }}>
              Physical Return Inspection Checklist
            </h1>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Return Ref: {returnReq.return_number}</span>
          </div>
        </div>

        <form onSubmit={handleSubmitInspection}>
          {/* Item Condition */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0F2167', marginBottom: '0.4rem' }}>
              Returned Product Physical Condition
            </label>
            <select
              value={form.productCondition}
              onChange={e => setForm({ ...form, productCondition: e.target.value })}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff' }}
            >
              <option value="unopened">Unopened / New Packaging (100% Sellable)</option>
              <option value="opened">Opened Package / Box Seal Broken</option>
              <option value="used">Used / Installed on Vehicle</option>
              <option value="damaged">Damaged Transit / Broken Housing</option>
              <option value="defective">Defective / Electrical Short</option>
              <option value="wrong_item">Wrong Item Returned by Customer</option>
            </select>
          </div>

          {/* Approved vs Rejected Quantities */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                Quantity Approved (Passes Inspection)
              </label>
              <input
                type="number"
                min="0"
                value={form.approvedQty}
                onChange={e => setForm({ ...form, approvedQty: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                Quantity Rejected (Failed Inspection)
              </label>
              <input
                type="number"
                min="0"
                value={form.rejectedQty}
                onChange={e => setForm({ ...form, rejectedQty: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
              />
            </div>
          </div>

          {/* Reverse Inventory Toggle */}
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="checkbox"
              id="restockCheck"
              checked={form.restockSellable}
              onChange={e => setForm({ ...form, restockSellable: e.target.checked })}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="restockCheck" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0F2167', cursor: 'pointer' }}>
              Add approved quantity back into sellable database inventory?
            </label>
          </div>

          {/* Damage / Internal Notes */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
              Inspection Notes / Damage Details
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Scratched terminal pins, customer included original box..."
              value={form.internalNotes}
              onChange={e => setForm({ ...form, internalNotes: e.target.value })}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#0F2167',
              color: '#ffffff',
              border: 'none',
              padding: '0.9rem',
              borderRadius: '10px',
              fontSize: '1.05rem',
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Submitting Inspection...' : 'Complete Return Inspection & Process Stock'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default AdminReturnInspectionView;
