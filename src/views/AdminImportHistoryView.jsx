import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { catalogImportService } from '../services/catalogImportService';
import {
  FileText, Clock, Download, RefreshCw, CheckCircle2, AlertTriangle, Eye, ArrowLeft
} from 'lucide-react';

export const AdminImportHistoryView = ({ onNavigate }) => {
  const { showToast, navigateTo } = useStore();
  const nav = onNavigate || navigateTo;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await catalogImportService.getImportJobs();
      setJobs(data || []);
    } catch (err) {
      console.error('Error loading import jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem', background: '#f8fafc', minHeight: '100vh' }}>
      <button
        onClick={() => nav('admin/products/import')}
        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}
      >
        <ArrowLeft size={16} /> Back to Bulk Import
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F2167', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText color="#FF6B00" size={28} /> Product Import Job History
          </h1>
          <p style={{ color: '#64748b', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
            Audit log of all CSV catalog imports, execution modes, total affected rows, and error reports.
          </p>
        </div>

        <button
          onClick={loadHistory}
          style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#475569', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', color: '#475569', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                <th style={{ padding: '0.85rem 1rem' }}>File Name</th>
                <th style={{ padding: '0.85rem 1rem' }}>Mode</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Total Rows</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Created</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Updated</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Failed</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem' }}>Date & Admin</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    Loading import job logs...
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No product import jobs logged yet.
                  </td>
                </tr>
              ) : (
                jobs.map(job => (
                  <tr key={job.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0F2167' }}>
                      {job.file_name}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#475569' }}>
                      {(job.import_mode || 'create_update').toUpperCase()}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 600 }}>{job.total_rows}</td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center', color: '#16a34a', fontWeight: 700 }}>{job.created_rows}</td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center', color: '#d97706', fontWeight: 700 }}>{job.updated_rows}</td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center', color: '#ef4444', fontWeight: 700 }}>{job.failed_rows}</td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '16px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        background: job.status === 'completed' ? '#dcfce7' : job.status === 'completed_with_errors' ? '#fef3c7' : '#fee2e2',
                        color: job.status === 'completed' ? '#15803d' : job.status === 'completed_with_errors' ? '#92400e' : '#991b1b'
                      }}>
                        {(job.status || 'completed').toUpperCase()}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>
                      {new Date(job.created_at).toLocaleString()} by {job.created_by || 'Admin'}
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
export default AdminImportHistoryView;
