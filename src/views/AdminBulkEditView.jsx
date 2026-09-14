import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { catalogImportService } from '../services/catalogImportService';
import {
  Layers, CheckCircle2, AlertTriangle, ArrowLeft, Search, Edit3
} from 'lucide-react';

export const AdminBulkEditView = ({ onNavigate }) => {
  const { products, categories, brands, showToast, navigateTo } = useStore();
  const nav = onNavigate || navigateTo;

  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const [bulkFields, setBulkFields] = useState({
    category_id: '',
    brand_id: '',
    status: '',
    featured: '',
    tax_percent: '',
    warranty: '',
    reorder_level: ''
  });

  const toggleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter(item => item !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const filteredProducts = (products || []).filter(p => {
    const term = searchTerm.toLowerCase();
    return (
      (p.title && p.title.toLowerCase().includes(term)) ||
      (p.name && p.name.toLowerCase().includes(term)) ||
      (p.sku && p.sku.toLowerCase().includes(term))
    );
  });

  const handleApplyBulkEdit = async (e) => {
    e.preventDefault();
    if (selectedProductIds.length === 0) {
      showToast('Please select at least one product to edit.', 'error');
      return;
    }

    const updates = {};
    if (bulkFields.category_id) updates.category_id = bulkFields.category_id;
    if (bulkFields.brand_id) updates.brand_id = bulkFields.brand_id;
    if (bulkFields.status !== '') updates.status = bulkFields.status === 'true';
    if (bulkFields.featured !== '') updates.featured = bulkFields.featured === 'true';
    if (bulkFields.tax_percent !== '') updates.tax_percent = parseFloat(bulkFields.tax_percent);
    if (bulkFields.warranty) updates.warranty = bulkFields.warranty;
    if (bulkFields.reorder_level !== '') updates.reorder_level = parseInt(bulkFields.reorder_level, 10);

    if (Object.keys(updates).length === 0) {
      showToast('Please select at least one field property to update.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await catalogImportService.applyBulkProductEdit({
        productIds: selectedProductIds,
        updates,
        adminName: 'Admin Staff'
      });

      if (res.success) {
        showToast(`Successfully updated ${res.count} products!`, 'success');
        setSelectedProductIds([]);
        setBulkFields({ category_id: '', brand_id: '', status: '', featured: '', tax_percent: '', warranty: '', reorder_level: '' });
      } else {
        showToast('Bulk edit failed: ' + res.error, 'error');
      }
    } catch (err) {
      showToast('Error applying bulk edit', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem', background: '#f8fafc', minHeight: '100vh' }}>
      <button
        onClick={() => nav('admin')}
        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F2167', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Edit3 color="#FF6B00" size={28} /> Bulk Product Attribute Editor
          </h1>
          <p style={{ color: '#64748b', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
            Select multiple products and apply category, brand, status, tax rate, warranty, or reorder levels in batch with full audit logs.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        {/* Left Panel: Property Update Form */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F2167', marginBottom: '1rem' }}>
            Bulk Update Properties ({selectedProductIds.length} Selected)
          </h3>

          <form onSubmit={handleApplyBulkEdit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Assign Category</label>
              <select
                value={bulkFields.category_id}
                onChange={e => setBulkFields({ ...bulkFields, category_id: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
              >
                <option value="">-- Leave Unchanged --</option>
                {(categories || []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Assign Brand</label>
              <select
                value={bulkFields.brand_id}
                onChange={e => setBulkFields({ ...bulkFields, brand_id: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
              >
                <option value="">-- Leave Unchanged --</option>
                {(brands || []).map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Catalog Status</label>
              <select
                value={bulkFields.status}
                onChange={e => setBulkFields({ ...bulkFields, status: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
              >
                <option value="">-- Leave Unchanged --</option>
                <option value="true">Active (Visible)</option>
                <option value="false">Inactive (Hidden)</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Featured Badge</label>
              <select
                value={bulkFields.featured}
                onChange={e => setBulkFields({ ...bulkFields, featured: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
              >
                <option value="">-- Leave Unchanged --</option>
                <option value="true">Featured Product</option>
                <option value="false">Standard Product</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>GST Tax Rate (%)</label>
              <input
                type="number"
                placeholder="e.g. 18"
                value={bulkFields.tax_percent}
                onChange={e => setBulkFields({ ...bulkFields, tax_percent: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Warranty Terms</label>
              <input
                type="text"
                placeholder="e.g. 1 Year / 20,000 KM"
                value={bulkFields.warranty}
                onChange={e => setBulkFields({ ...bulkFields, warranty: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || selectedProductIds.length === 0}
              style={{
                width: '100%',
                background: selectedProductIds.length === 0 ? '#cbd5e1' : '#0F2167',
                color: '#ffffff',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '8px',
                fontWeight: 800,
                cursor: selectedProductIds.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Applying Changes...' : `Apply Bulk Edit (${selectedProductIds.length})`}
            </button>
          </form>
        </div>

        {/* Right Panel: Product Selection Table */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search product name or SKU..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2.2rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>

            <button
              onClick={toggleSelectAll}
              style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0.5rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
            >
              {selectedProductIds.length === filteredProducts.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead style={{ position: 'sticky', top: 0, background: '#f8fafc' }}>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '0.65rem 0.75rem', width: '40px' }}>Select</th>
                  <th style={{ padding: '0.65rem 0.75rem' }}>Product Name</th>
                  <th style={{ padding: '0.65rem 0.75rem' }}>SKU</th>
                  <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => {
                  const isChecked = selectedProductIds.includes(p.id);
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', background: isChecked ? '#fff9f5' : '#fff' }}>
                      <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectOne(p.id)}
                          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>{p.title || p.name}</td>
                      <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'monospace', color: '#0F2167' }}>{p.sku || 'N/A'}</td>
                      <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 700 }}>₹{p.price}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminBulkEditView;
