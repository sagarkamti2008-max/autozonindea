import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { returnsWarrantyService } from '../services/returnsWarrantyService';
import {
  RotateCcw, Search, Filter, RefreshCw, Eye, ShieldCheck, DollarSign, Settings, BarChart2
} from 'lucide-react';

export const AdminReturnsConsole = ({ onNavigate }) => {
  const { showToast, navigateTo } = useStore();
  const nav = onNavigate || navigateTo;

  const [returnsList, setReturnsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadReturns();
  }, [statusFilter, typeFilter]);

  const loadReturns = async () => {
    setLoading(true);
    try {
      const data = await returnsWarrantyService.getReturnRequests({
        status: statusFilter,
        returnType: typeFilter,
        search: searchTerm
      });
      setReturnsList(data || []);
    } catch (err) {
      console.error('Error loading returns:', err);
      showToast('Error loading return requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredReturns = returnsList.filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      (item.return_number && item.return_number.toLowerCase().includes(term)) ||
      (item.orders?.order_number && item.orders.order_number.toLowerCase().includes(term)) ||
      (item.customers?.name && item.customers.name.toLowerCase().includes(term)) ||
      (item.customers?.phone && item.customers.phone.toLowerCase().includes(term))
    );
  });

  return (
    <div style={{ padding: '1.5rem', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F2167', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <RotateCcw color="#FF6B00" size={28} /> Customer Returns & Refund Management
          </h1>
          <p style={{ color: '#64748b', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
            Process return requests, warehouse physical inspections, reverse inventory restocks, and refund payouts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => nav('admin/returns/analytics')}
            style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#0F2167', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <BarChart2 size={16} color="#FF6B00" /> Returns Analytics
          </button>

          <button
            onClick={() => nav('admin/settings/returns')}
            style={{ background: '#0F2167', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <Settings size={16} /> Return Policy Settings
          </button>
        </div>
      </div>

      {/* Filter & Search */}
      <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search Return #, Order #, Customer Name, Phone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.65rem 0.65rem 0.65rem 2.4rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
          >
            <option value="all">All Statuses</option>
            <option value="requested">Requested</option>
            <option value="approved">Approved</option>
            <option value="pickup_scheduled">Pickup Scheduled</option>
            <option value="in_transit">In Transit</option>
            <option value="received">Received</option>
            <option value="inspection">Inspection</option>
            <option value="approved_for_refund">Approved Refund</option>
            <option value="approved_for_replacement">Approved Replacement</option>
            <option value="refund_completed">Refund Completed</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Type:</span>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
          >
            <option value="all">All Types</option>
            <option value="refund">Refund Request</option>
            <option value="replacement">Replacement Request</option>
          </select>
        </div>

        <button
          onClick={loadReturns}
          style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#475569', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Returns Data Table */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', color: '#475569', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                <th style={{ padding: '0.85rem 1rem' }}>Return #</th>
                <th style={{ padding: '0.85rem 1rem' }}>Order #</th>
                <th style={{ padding: '0.85rem 1rem' }}>Customer</th>
                <th style={{ padding: '0.85rem 1rem' }}>Reason</th>
                <th style={{ padding: '0.85rem 1rem' }}>Type</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem' }}>Requested Date</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    Loading return requests...
                  </td>
                </tr>
              ) : filteredReturns.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No return requests found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredReturns.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: '#0F2167' }}>
                      {item.return_number}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', color: '#475569' }}>
                      {item.orders?.order_number || 'N/A'}
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{item.customers?.name || 'Customer'}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.customers?.phone}</div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>
                      {item.reason}
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        background: item.return_type === 'replacement' ? '#e0f2fe' : '#fef3c7',
                        color: item.return_type === 'replacement' ? '#0369a1' : '#92400e'
                      }}>
                        {item.return_type.toUpperCase()}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: '16px',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        background: item.status === 'completed' || item.status === 'refund_completed' ? '#dcfce7' : item.status === 'rejected' ? '#fee2e2' : '#f1f5f9',
                        color: item.status === 'completed' || item.status === 'refund_completed' ? '#15803d' : item.status === 'rejected' ? '#991b1b' : '#475569'
                      }}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>
                      {new Date(item.requested_at || item.created_at).toLocaleDateString()}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => nav(`admin/returns/${item.return_number}`)}
                          title="Manage Return"
                          style={{ background: '#0F2167', border: 'none', color: '#ffffff', padding: '0.4rem 0.64rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <Eye size={14} /> Detail
                        </button>
                      </div>
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
export default AdminReturnsConsole;
