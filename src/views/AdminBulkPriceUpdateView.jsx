import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { catalogImportService } from '../services/catalogImportService';
import {
  DollarSign, Upload, AlertTriangle, CheckCircle2, ArrowLeft, RefreshCw, FileSpreadsheet
} from 'lucide-react';

export const AdminBulkPriceUpdateView = ({ onNavigate }) => {
  const { showToast, navigateTo } = useStore();
  const nav = onNavigate || navigateTo;

  const [fileName, setFileName] = useState('');
  const [parsedRows, setParsedRows] = useState([]);
  const [reason, setReason] = useState('Routine Price Adjustment');
  const [loading, setLoading] = useState(false);
  const [updateResults, setUpdateResults] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const rows = catalogImportService.parseCSVText(text);
        if (rows.length === 0) {
          showToast('CSV is empty or missing headers.', 'error');
          return;
        }
        setParsedRows(rows);
      } catch (err) {
        showToast('Error parsing price CSV', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleApplyPriceUpdate = async () => {
    if (parsedRows.length === 0) return;
    setLoading(true);
    try {
      const res = await catalogImportService.validateAndApplyBulkPriceUpdate({
        csvRows: parsedRows,
        adminName: 'Admin Staff',
        reason
      });

      if (res.success) {
        setUpdateResults(res);
        showToast(`Bulk Price Update Completed! ${res.updatedCount} products updated.`, 'success');
      } else {
        showToast('Price update failed: ' + res.error, 'error');
      }
    } catch (err) {
      showToast('Error executing bulk price update', 'error');
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F2167', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <DollarSign color="#FF6B00" size={28} /> Controlled Bulk Price Revision Tool
          </h1>
          <p style={{ color: '#64748b', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
            Safely revise catalog MRP, Selling Price, and Sale Prices via CSV with old vs new diff preview and price change audit logging.
          </p>
        </div>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', maxWidth: '850px', margin: '0 auto' }}>
        {/* Upload Zone */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0F2167', marginBottom: '0.4rem' }}>
            Upload Price Revision CSV (Columns: sku, mrp, price, sale_price)
          </label>

          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0F2167', marginBottom: '0.4rem' }}>
            Audit Reason / Revision Justification <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Q3 Vendor Cost Revision & GST Rate Adjustment"
            value={reason}
            onChange={e => setReason(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
          />
        </div>

        {/* Preview Table */}
        {parsedRows.length > 0 && !updateResults && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F2167', marginBottom: '0.75rem' }}>
              Preview Price Changes ({parsedRows.length} Rows Loaded)
            </h3>
            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', maxHeight: '350px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead style={{ position: 'sticky', top: 0, background: '#f8fafc' }}>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '0.65rem 0.75rem' }}>SKU</th>
                    <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>MRP (₹)</th>
                    <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>Selling Price (₹)</th>
                    <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>Sale Price (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#0F2167' }}>{r.sku}</td>
                      <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>₹{r.mrp || r.price}</td>
                      <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 700, color: '#FF6B00' }}>₹{r.price}</td>
                      <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>{r.sale_price ? `₹${r.sale_price}` : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleApplyPriceUpdate}
              disabled={loading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #0F2167 0%, #1e293b 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '0.9rem',
                borderRadius: '10px',
                fontSize: '1.05rem',
                fontWeight: 800,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '1.5rem',
                boxShadow: '0 4px 15px rgba(15,33,103,0.3)'
              }}
            >
              {loading ? 'Executing Price Revision...' : `Confirm & Apply Price Update (${parsedRows.length} SKUs)`}
            </button>
          </div>
        )}

        {/* Results */}
        {updateResults && (
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #22c55e', textAlign: 'center' }}>
            <CheckCircle2 size={48} color="#22c55e" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F2167', marginBottom: '0.5rem' }}>
              Price Update Completed!
            </h3>
            <p style={{ color: '#475569', fontSize: '0.9rem' }}>
              Successfully updated <strong>{updateResults.updatedCount} products</strong>. Failed: {updateResults.failedCount}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminBulkPriceUpdateView;
