import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { returnsWarrantyService } from '../services/returnsWarrantyService';
import {
  Settings, Save, RefreshCw, CheckCircle2, ArrowLeft
} from 'lucide-react';

export const AdminReturnSettingsView = ({ onNavigate }) => {
  const { showToast, navigateTo } = useStore();
  const nav = onNavigate || navigateTo;

  const [policy, setPolicy] = useState({
    return_window_days: 10,
    replacement_enabled: true,
    refund_enabled: true,
    return_shipping_policy: 'Carrier Pickup',
    require_inspection: true
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPolicy();
  }, []);

  const loadPolicy = async () => {
    setLoading(true);
    try {
      const data = await returnsWarrantyService.getReturnPolicySettings();
      if (data) setPolicy(data);
    } catch (err) {
      console.error('Error loading policy:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await returnsWarrantyService.saveReturnPolicySettings(policy);
      if (res.success) {
        showToast('Return Policy Settings saved successfully!', 'success');
      } else {
        showToast('Failed to save policy: ' + res.error, 'error');
      }
    } catch (err) {
      showToast('Error saving settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem', background: '#f8fafc', minHeight: '100vh' }}>
      <button
        onClick={() => nav('admin')}
        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', maxWidth: '750px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F2167', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Settings color="#FF6B00" size={28} /> Configurable Return & Refund Policy Settings
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Manage platform return windows, replacement toggles, reverse shipping carrier rules, and inspection requirements.
        </p>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0F2167', marginBottom: '0.4rem' }}>
              Standard Return Window (Days after Delivery)
            </label>
            <input
              type="number"
              min="1"
              max="90"
              value={policy.return_window_days}
              onChange={e => setPolicy({ ...policy, return_window_days: parseInt(e.target.value, 10) || 10 })}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0F2167', marginBottom: '0.4rem' }}>
              Default Return Shipping Carrier Policy
            </label>
            <select
              value={policy.return_shipping_policy}
              onChange={e => setPolicy({ ...policy, return_shipping_policy: e.target.value })}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff' }}
            >
              <option value="Carrier Pickup">Bluedart / Delhivery Doorstep Pickup (Store Pays)</option>
              <option value="Customer Self Ship">Customer Self Ship (Customer Pays)</option>
              <option value="Store Credit Voucher">Store Credit Reimbursement</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input
                type="checkbox"
                id="refToggle"
                checked={policy.refund_enabled}
                onChange={e => setPolicy({ ...policy, refund_enabled: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="refToggle" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F2167', cursor: 'pointer' }}>
                Enable Payment Refunds
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input
                type="checkbox"
                id="repToggle"
                checked={policy.replacement_enabled}
                onChange={e => setPolicy({ ...policy, replacement_enabled: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="repToggle" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F2167', cursor: 'pointer' }}>
                Enable Replacement Orders
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input
                type="checkbox"
                id="inspToggle"
                checked={policy.require_inspection}
                onChange={e => setPolicy({ ...policy, require_inspection: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="inspToggle" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F2167', cursor: 'pointer' }}>
                Require Warehouse Inspection Before Refund / Replacement Approval
              </label>
            </div>
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
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Save size={18} color="#FF6B00" /> Save Return Policy Settings
          </button>
        </form>
      </div>
    </div>
  );
};
export default AdminReturnSettingsView;
