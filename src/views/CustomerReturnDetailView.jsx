import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { returnsWarrantyService } from '../services/returnsWarrantyService';
import {
  RotateCcw, Clock, CheckCircle2, XCircle, ArrowLeft, Package, Truck, ShieldCheck, DollarSign
} from 'lucide-react';

export const CustomerReturnDetailView = ({ returnNumber: propNumber, onNavigate }) => {
  const { navigateTo } = useStore();
  const nav = onNavigate || navigateTo;

  const returnNumber = propNumber || window.location.pathname.split('/account/returns/')[1];
  const [returnDetails, setReturnDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!returnNumber) return;
    loadDetails();
  }, [returnNumber]);

  const loadDetails = async () => {
    setLoading(true);
    try {
      const data = await returnsWarrantyService.getReturnByNumber(returnNumber);
      setReturnDetails(data);
    } catch (err) {
      console.error('Error loading return detail:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <Clock size={36} color="#FF6B00" style={{ animation: 'spin 1.5s linear infinite' }} />
        <h3 style={{ marginTop: '1rem', color: '#0F2167' }}>Loading Return Tracking Details...</h3>
      </div>
    );
  }

  if (!returnDetails) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <h3>Return Record Not Found</h3>
        <button onClick={() => nav('account/returns')} style={{ background: '#0F2167', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', marginTop: '1rem', cursor: 'pointer' }}>
          Return to My Returns
        </button>
      </div>
    );
  }

  const steps = [
    { key: 'requested', label: 'Requested' },
    { key: 'approved', label: 'Approved' },
    { key: 'pickup_scheduled', label: 'Pickup' },
    { key: 'received', label: 'Received' },
    { key: 'inspection', label: 'Inspected' },
    { key: 'completed', label: 'Completed' }
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
      <button
        onClick={() => nav('account/returns')}
        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}
      >
        <ArrowLeft size={16} /> Back to Returns List
      </button>

      {/* Main Detail Card */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #0F2167 0%, #1e293b 100%)', padding: '2rem', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ color: '#FF6B00', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>Return Tracking</span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0.2rem 0 0 0', color: '#ffffff' }}>
              {returnDetails.return_number}
            </h1>
            <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
              Original Order #: {returnDetails.orders?.order_number || 'N/A'} • Requested Date: {new Date(returnDetails.requested_at || returnDetails.created_at).toLocaleDateString()}
            </p>
          </div>

          <div>
            <span style={{
              display: 'inline-block',
              padding: '0.35rem 0.8rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 800,
              background: returnDetails.status === 'completed' || returnDetails.status === 'refund_completed' ? '#22c55e' : '#FF6B00',
              color: '#ffffff'
            }}>
              STATUS: {returnDetails.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Returned Items Table */}
        <div style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F2167', marginBottom: '1rem' }}>
            Returned Spare Part Items
          </h3>

          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '2rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '0.75rem' }}>#</th>
                  <th style={{ padding: '0.75rem' }}>Product Name</th>
                  <th style={{ padding: '0.75rem' }}>SKU</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Price (₹)</th>
                </tr>
              </thead>
              <tbody>
                {(returnDetails.return_items || []).map((ritem, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem', color: '#94a3b8' }}>{idx + 1}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: '#0F2167' }}>{ritem.products?.name || 'Spare Part'}</td>
                    <td style={{ padding: '0.75rem', fontFamily: 'monospace', color: '#475569' }}>{ritem.products?.sku || 'N/A'}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 700 }}>{ritem.quantity}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 700 }}>₹{ritem.products?.price || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Activity Timeline */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F2167', marginBottom: '1rem' }}>
            Return Activity Timeline
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(returnDetails.return_activity || []).map((act, i) => (
              <div key={i} style={{ borderLeft: '3px solid #FF6B00', paddingLeft: '1rem', position: 'relative' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F2167' }}>{act.activity_type.toUpperCase()}</div>
                <div style={{ fontSize: '0.85rem', color: '#334155' }}>{act.message}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  {new Date(act.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CustomerReturnDetailView;
