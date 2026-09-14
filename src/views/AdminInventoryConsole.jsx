import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  calculateStockStatus,
  calculateInventoryKPIs,
  adjustProductStock,
  processReturnInventory,
  getReorderSuggestions,
  prepareStocktakeAudit,
  getInventoryMovements,
  getInventoryReservations
} from '../services/inventoryManagementEngine';
import {
  Boxes, Package, AlertTriangle, CheckCircle2, RefreshCw, Search, Filter,
  TrendingDown, TrendingUp, DollarSign, Upload, FileText, ArrowRight, X,
  Edit3, ShieldCheck, History, Sliders, Database, Layers, CheckSquare
} from 'lucide-react';
import { logAdminAudit } from '../services/adminAnalyticsEngine';

export const AdminInventoryConsole = () => {
  const { products, saveProduct, showToast } = useStore();

  const [activeTab, setActiveTab] = useState('ledger'); // 'ledger' | 'adjust' | 'history' | 'reorder' | 'stocktake' | 'import'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Purchase Order (PO) State
  const [poModalOpen, setPoModalOpen] = useState(false);
  const [selectedPoSupplier, setSelectedPoSupplier] = useState('Bosch India Automotive Ltd');
  const [poItemTarget, setPoItemTarget] = useState(null);

  // Manual Stock Adjustment Form State (Rule 8)
  const [adjustSku, setAdjustSku] = useState('');
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustReason, setAdjustReason] = useState('New Stock');
  const [adjustAdmin, setAdjustAdmin] = useState('Store Owner Admin');

  // Stocktake Audit State (Rule 43, 44)
  const [stocktakeItems, setStocktakeItems] = useState(prepareStocktakeAudit(products));

  // CSV Import State (Rule 27, 28, 29)
  const [csvText, setCsvText] = useState(`SKU,Quantity,ReorderLevel,CostPrice\nAZ-BOSCH-BP-001,50,5,1200\nAZ-MOBIL1-5W30-4L,30,8,2100\nAZ-INVALID-SKU-99,10,2,500`);
  const [importPreview, setImportPreview] = useState(null);

  // Compute Real-Time KPIs (Rule 1, 30, 31)
  const kpis = calculateInventoryKPIs(products);
  const movements = getInventoryMovements();
  const reorderList = getReorderSuggestions(products);

  // Filtered Products Ledger List (Rule 24, 25)
  const filteredProducts = products.filter(p => {
    const calc = calculateStockStatus(p.stock || 0, p.reservedStock || 0, p.reorderLevel || 5, p.isDiscontinued);
    if (statusFilter !== 'all' && calc.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.title.toLowerCase().includes(q);
      const matchSku = (p.sku || p.partNumber || '').toLowerCase().includes(q);
      const matchPart = (p.partNumber || '').toLowerCase().includes(q);
      const matchOEM = (p.oemNumber || '').toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchPart && !matchOEM) return false;
    }
    return true;
  });

  const handleAdjustSubmit = (e) => {
    e.preventDefault();
    if (!adjustSku) {
      showToast('Please select a valid product SKU.', 'error');
      return;
    }
    if (adjustQty === 0) {
      showToast('Quantity change cannot be 0.', 'error');
      return;
    }

    const res = adjustProductStock({
      sku: adjustSku,
      quantityChange: parseInt(adjustQty),
      reason: adjustReason,
      adminName: adjustAdmin,
      productsDatabase: products
    });

    if (res.success) {
      logAdminAudit({
        action: 'STOCK_ADJUSTED',
        entityType: 'product_inventory',
        entityId: adjustSku,
        description: `Manual Stock Adjustment for SKU ${adjustSku}: ${adjustQty > 0 ? '+' : ''}${adjustQty} units (${adjustReason})`,
        metadata: { previousQty: res.previousQty, newQty: res.newQty, adminName: adjustAdmin }
      });
      showToast(`🎉 Stock adjusted for SKU ${adjustSku}! Previous: ${res.previousQty} → New: ${res.newQty}`);
      setAdjustQty(0);
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleStocktakeQtyChange = (id, val) => {
    setStocktakeItems(stocktakeItems.map(item => {
      if (item.id === id) {
        const physical = parseInt(val) || 0;
        return {
          ...item,
          physicalQty: physical,
          variance: physical - item.systemQty
        };
      }
      return item;
    }));
  };

  const handleApproveStocktake = () => {
    stocktakeItems.forEach(item => {
      if (item.variance !== 0) {
        adjustProductStock({
          sku: item.sku,
          quantityChange: item.variance,
          reason: `Stocktake Physical Audit (Variance: ${item.variance > 0 ? '+' : ''}${item.variance})`,
          adminName: 'Store Owner Admin',
          productsDatabase: products
        });
      }
    });
    showToast('✅ Stocktake Audit Approved! Central inventory quantities updated.', 'success');
  };

  const handleParseCsvPreview = () => {
    const lines = csvText.trim().split('\n');
    if (lines.length <= 1) {
      showToast('Invalid CSV format. Header + data required.', 'error');
      return;
    }

    const validRows = [];
    const invalidRows = [];

    lines.slice(1).forEach((line, idx) => {
      const parts = line.split(',').map(s => s.trim());
      if (parts.length < 2) return;
      const [sku, qtyStr, reorderStr, costStr] = parts;
      const qty = parseInt(qtyStr);

      const product = products.find(p => p.sku === sku || p.partNumber === sku);
      if (!product) {
        invalidRows.push({ row: idx + 2, sku, error: 'SKU not found in database', suggestedFix: 'Add product first via Catalog Manager' });
      } else if (isNaN(qty)) {
        invalidRows.push({ row: idx + 2, sku, error: 'Invalid quantity numeric format', suggestedFix: 'Enter valid integer quantity' });
      } else {
        validRows.push({ row: idx + 2, sku, title: product.title, qty, reorderLevel: parseInt(reorderStr) || 5, costPrice: parseInt(costStr) || 0 });
      }
    });

    setImportPreview({ validRows, invalidRows });
  };

  const handleCommitCsvImport = () => {
    if (!importPreview || importPreview.validRows.length === 0) return;
    importPreview.validRows.forEach(row => {
      adjustProductStock({
        sku: row.sku,
        quantityChange: row.qty,
        reason: 'Bulk CSV Inventory Import',
        adminName: 'Store Owner Admin',
        productsDatabase: products
      });
    });
    showToast(`🎉 Bulk CSV Import Committed! Updated ${importPreview.validRows.length} SKUs.`, 'success');
    setImportPreview(null);
  };

  return (
    <div className="container admin-dashboard-wrapper" style={{ maxWidth: '1450px', padding: '1.5rem 1rem' }}>
      {/* Header Banner */}
      <div className="admin-header" style={{ background: '#0F2167', color: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Boxes size={36} color="#FF6B00" />
          <div>
            <h2 style={{ color: '#FFFFFF', margin: 0, fontSize: '1.4rem' }}>Central Inventory & Stock Management Control</h2>
            <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>
              Single-Owner Central Source of Truth • Real-Time Stock Ledger • Overselling Prevention • Stocktake Audits
            </span>
          </div>
        </div>
      </div>

      {/* Real-Time KPIs Cards Grid (Rule 1, 30, 31) */}
      <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>Total Products</span>
          <h3 style={{ fontSize: '1.6rem', color: '#0F2167', margin: '0.25rem 0', fontWeight: 900 }}>{kpis.totalProducts}</h3>
          <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>Central Inventory Database</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>In Stock SKUs</span>
          <h3 style={{ fontSize: '1.6rem', color: '#059669', margin: '0.25rem 0', fontWeight: 900 }}>{kpis.inStockCount}</h3>
          <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>Ready for Instant Dispatch</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>Low Stock Alert</span>
          <h3 style={{ fontSize: '1.6rem', color: '#D97706', margin: '0.25rem 0', fontWeight: 900 }}>{kpis.lowStockCount}</h3>
          <span style={{ fontSize: '0.72rem', color: '#D97706', fontWeight: 700 }}>At/Below Reorder Threshold</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>Out of Stock</span>
          <h3 style={{ fontSize: '1.6rem', color: '#E11D48', margin: '0.25rem 0', fontWeight: 900 }}>{kpis.outOfStockCount}</h3>
          <span style={{ fontSize: '0.72rem', color: '#E11D48', fontWeight: 700 }}>Purchasing Disabled</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>Active Reserved Stock</span>
          <h3 style={{ fontSize: '1.6rem', color: '#3B82F6', margin: '0.25rem 0', fontWeight: 900 }}>{kpis.reservedStockCount}</h3>
          <span style={{ fontSize: '0.72rem', color: '#3B82F6', fontWeight: 700 }}>Active Checkout Carts</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>Total Inventory Stock Value</span>
          <h3 style={{ fontSize: '1.4rem', color: '#0F2167', margin: '0.25rem 0', fontWeight: 900 }}>
            ₹{kpis.totalSellingValue.toLocaleString('en-IN')}
          </h3>
          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{kpis.valuationMethod}</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button className={`admin-tab ${activeTab === 'ledger' ? 'active' : ''}`} onClick={() => setActiveTab('ledger')}>
          📦 Central Stock Ledger
        </button>
        <button className={`admin-tab ${activeTab === 'adjust' ? 'active' : ''}`} onClick={() => setActiveTab('adjust')}>
          ⚡ Manual Stock Adjustment
        </button>
        <button className={`admin-tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          📜 Stock Movements Audit ({movements.length})
        </button>
        <button className={`admin-tab ${activeTab === 'reorder' ? 'active' : ''}`} onClick={() => setActiveTab('reorder')}>
          🔔 Reorder Suggestions ({reorderList.length})
        </button>
        <button className={`admin-tab ${activeTab === 'stocktake' ? 'active' : ''}`} onClick={() => setActiveTab('stocktake')}>
          📝 Physical Stocktake Audit
        </button>
        <button className={`admin-tab ${activeTab === 'import' ? 'active' : ''}`} onClick={() => setActiveTab('import')}>
          📁 CSV Bulk Import
        </button>
      </div>

      {/* TAB 1: Stock Ledger */}
      {activeTab === 'ledger' && (
        <div className="admin-pane-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0F2167' }}>Products Central Stock Ledger</h3>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.35rem 0.65rem' }}>
                <Search size={16} color="#64748B" style={{ marginRight: '0.4rem' }} />
                <input
                  type="text"
                  placeholder="Search Product Name, SKU, OEM #..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.8rem', width: '220px' }}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.35rem 0.6rem', fontSize: '0.8rem', fontWeight: 700 }}
              >
                <option value="all">All Stock Statuses</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </div>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product & Brand</th>
                  <th>SKU & Bin Location</th>
                  <th>Physical Stock</th>
                  <th>Reserved Stock</th>
                  <th>Available Stock</th>
                  <th>Reorder Level</th>
                  <th>Stock Status</th>
                  <th>Unit Selling Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => {
                  const physical = p.stock || 0;
                  const reserved = p.reservedStock || 0;
                  const calc = calculateStockStatus(physical, reserved, p.reorderLevel || 5, p.isDiscontinued);

                  return (
                    <tr key={p.id}>
                      <td>
                        <b style={{ color: '#0F2167', display: 'block' }}>{p.title}</b>
                        <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{p.brand} • {p.category}</span>
                      </td>
                      <td>
                        <code style={{ background: '#FFF7ED', color: '#FF6B00', fontWeight: 900, padding: '0.15rem 0.4rem', borderRadius: '4px', display: 'block', width: 'fit-content' }}>
                          {p.sku || p.partNumber}
                        </code>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Bin: {p.binCode || 'WH-DEL-Z1-B04'}</span>
                      </td>
                      <td><b>{physical} units</b></td>
                      <td><span style={{ color: reserved > 0 ? '#3B82F6' : '#94A3B8', fontWeight: 800 }}>{reserved}</span></td>
                      <td>
                        <strong style={{ fontSize: '1rem', color: calc.availableStock > 0 ? '#0F2167' : '#E11D48' }}>
                          {calc.availableStock}
                        </strong>
                      </td>
                      <td><code>{p.reorderLevel || 5}</code></td>
                      <td>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 900,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
                          background: calc.status === 'In Stock' ? '#ECFDF5' : (calc.status === 'Low Stock' ? '#FFFBEB' : '#FEF2F2'),
                          color: calc.status === 'In Stock' ? '#059669' : (calc.status === 'Low Stock' ? '#D97706' : '#991B1B'),
                          border: `1px solid ${calc.status === 'In Stock' ? '#A7F3D0' : (calc.status === 'Low Stock' ? '#FDE68A' : '#FECACA')}`
                        }}>
                          {calc.status}
                        </span>
                      </td>
                      <td><b>₹{p.price}</b></td>
                      <td>
                        <button
                          className="btn-primary"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          onClick={() => {
                            setAdjustSku(p.sku || p.partNumber);
                            setActiveTab('adjust');
                          }}
                        >
                          Adjust Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Manual Stock Adjustment (Rule 8) */}
      {activeTab === 'adjust' && (
        <div className="admin-pane-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F2167', marginBottom: '1rem' }}>
            Manual Stock Adjustment Form
          </h3>

          <form onSubmit={handleAdjustSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Select Product SKU *</label>
              <select
                value={adjustSku}
                onChange={(e) => setAdjustSku(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700 }}
              >
                <option value="">-- Choose Product SKU --</option>
                {products.map(p => (
                  <option key={p.id} value={p.sku || p.partNumber}>
                    {p.sku || p.partNumber} - {p.title} (Current Stock: {p.stock || 0})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Quantity Change (+/-) *</label>
                <input
                  type="number"
                  placeholder="e.g. +10 or -2"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Reason Code *</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem' }}
                >
                  <option value="New Stock Shipment">New Stock Shipment</option>
                  <option value="Correction">Correction / Audit</option>
                  <option value="Damaged">Damaged Write-Off</option>
                  <option value="Lost">Lost / Stolen</option>
                  <option value="Returned">Returned Product</option>
                  <option value="Manual Adjustment">Manual Adjustment</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Performed By</label>
              <input
                type="text"
                value={adjustAdmin}
                onChange={(e) => setAdjustAdmin(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem' }}
              />
            </div>

            <button
              type="submit"
              style={{ marginTop: '0.5rem', background: '#FF6B00', color: '#FFFFFF', border: 'none', borderRadius: '10px', padding: '0.85rem', fontSize: '0.95rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 4px 14px rgba(255, 107, 0, 0.3)' }}
            >
              Commit Stock Adjustment
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Stock Movements History (Rule 9, 10) */}
      {activeTab === 'history' && (
        <div className="admin-pane-card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F2167', marginBottom: '1rem' }}>
            Central Inventory Movements Audit Ledger
          </h3>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>SKU & Product</th>
                  <th>Reason / Event</th>
                  <th>Performed By</th>
                  <th>Previous Qty</th>
                  <th>Change</th>
                  <th>New Qty</th>
                </tr>
              </thead>
              <tbody>
                {movements.map(m => (
                  <tr key={m.id}>
                    <td><span style={{ fontSize: '0.75rem', color: '#64748B' }}>{new Date(m.timestamp).toLocaleString('en-IN')}</span></td>
                    <td>
                      <code style={{ color: '#FF6B00', fontWeight: 900 }}>{m.sku}</code>
                      <div style={{ fontSize: '0.78rem', color: '#0F2167', fontWeight: 700 }}>{m.productTitle}</div>
                    </td>
                    <td><span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{m.reason}</span></td>
                    <td><span style={{ fontSize: '0.78rem', color: '#475569' }}>{m.userOrSystem}</span></td>
                    <td><code>{m.previousQty}</code></td>
                    <td>
                      <strong style={{ color: m.change > 0 ? '#059669' : '#E11D48' }}>
                        {m.change > 0 ? `+${m.change}` : m.change}
                      </strong>
                    </td>
                    <td><b>{m.newQty}</b></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Reorder Suggestions (Rule 37, 38) */}
      {activeTab === 'reorder' && (
        <div className="admin-pane-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#0F2167' }}>
              Products Requiring Reorder ({reorderList.length})
            </h3>

            <button
              onClick={() => {
                setPoItemTarget(null);
                setPoModalOpen(true);
              }}
              style={{ background: '#0F2167', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.45rem 1rem', fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 12px rgba(15,33,103,0.2)' }}
            >
              <FileText size={15} color="#FF6B00" /> ⚡ Generate Bulk Supplier PO
            </button>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>SKU & Product Title</th>
                  <th>Available Stock</th>
                  <th>Reorder Threshold</th>
                  <th>Target Stock Level</th>
                  <th>Suggested Reorder Qty</th>
                  <th>Est. Procurement Cost</th>
                  <th>Supplier Action</th>
                </tr>
              </thead>
              <tbody>
                {reorderList.map(r => (
                  <tr key={r.id}>
                    <td>
                      <code style={{ color: '#FF6B00', fontWeight: 900 }}>{r.sku}</code>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F2167' }}>{r.title}</div>
                    </td>
                    <td><strong style={{ color: '#E11D48' }}>{r.availableStock} units</strong></td>
                    <td><code>{r.reorderLevel}</code></td>
                    <td><code>{r.targetStock}</code></td>
                    <td><b style={{ color: '#0F2167', fontSize: '1rem' }}>+{r.suggestedQuantity} units</b></td>
                    <td><b>₹{r.estimatedReorderCost.toLocaleString('en-IN')}</b></td>
                    <td>
                      <button
                        onClick={() => {
                          setPoItemTarget(r);
                          setPoModalOpen(true);
                        }}
                        style={{ background: '#FF6B00', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '0.3rem 0.65rem', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        📄 1-Click PO
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Physical Stocktake Audit (Rule 43, 44, 45) */}
      {activeTab === 'stocktake' && (
        <div className="admin-pane-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0F2167' }}>Physical Stocktake & Variance Audit</h3>
            <button className="btn-primary" onClick={handleApproveStocktake} style={{ background: '#059669', borderColor: '#059669' }}>
              <CheckSquare size={16} /> Approve & Commit Stocktake Audit
            </button>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product SKU & Title</th>
                  <th>System Stock</th>
                  <th>Physical Count Entry</th>
                  <th>Calculated Variance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stocktakeItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <code style={{ color: '#FF6B00', fontWeight: 900 }}>{item.sku}</code>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F2167' }}>{item.title}</div>
                    </td>
                    <td><b>{item.systemQty} units</b></td>
                    <td>
                      <input
                        type="number"
                        value={item.physicalQty}
                        onChange={(e) => handleStocktakeQtyChange(item.id, e.target.value)}
                        style={{ width: '80px', padding: '0.3rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontWeight: 800 }}
                      />
                    </td>
                    <td>
                      <strong style={{ color: item.variance === 0 ? '#059669' : '#E11D48' }}>
                        {item.variance > 0 ? `+${item.variance}` : item.variance}
                      </strong>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: item.variance === 0 ? '#059669' : '#D97706' }}>
                        {item.variance === 0 ? 'Match' : 'Variance Detected'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: CSV Bulk Import (Rule 27, 28, 29) */}
      {activeTab === 'import' && (
        <div className="admin-pane-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F2167', marginBottom: '1rem' }}>
            CSV Bulk Inventory Import & Validation Preview
          </h3>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
              Paste CSV Data (Columns: SKU, Quantity, ReorderLevel, CostPrice)
            </label>
            <textarea
              rows={5}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.82rem' }}
            />
          </div>

          <button
            onClick={handleParseCsvPreview}
            style={{ background: '#0F2167', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.6rem 1.25rem', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}
          >
            Validate & Preview Import
          </button>

          {importPreview && (
            <div style={{ marginTop: '1.5rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0F2167', marginBottom: '0.75rem' }}>
                Import Validation Summary
              </h4>

              {/* Valid Rows */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#059669' }}>
                  ✓ {importPreview.validRows.length} Valid Rows Ready for Update
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.4rem' }}>
                  {importPreview.validRows.map((r, i) => (
                    <div key={i} style={{ fontSize: '0.78rem', color: '#334155', background: '#FFFFFF', padding: '0.35rem 0.6rem', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                      Row {r.row}: SKU <code>{r.sku}</code> ({r.title}) → Add <strong>+{r.qty}</strong> units
                    </div>
                  ))}
                </div>
              </div>

              {/* Invalid Rows (Rule 29) */}
              {importPreview.invalidRows.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#E11D48' }}>
                    ⚠ {importPreview.invalidRows.length} Invalid Rows Rejected
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.4rem' }}>
                    {importPreview.invalidRows.map((r, i) => (
                      <div key={i} style={{ fontSize: '0.78rem', color: '#991B1B', background: '#FEF2F2', padding: '0.35rem 0.6rem', borderRadius: '4px', border: '1px solid #FECACA' }}>
                        Row {r.row}: SKU <code>{r.sku}</code> → Error: <strong>{r.error}</strong> (Fix: {r.suggestedFix})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleCommitCsvImport}
                disabled={importPreview.validRows.length === 0}
                style={{ background: '#FF6B00', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.65rem 1.5rem', fontSize: '0.88rem', fontWeight: 900, cursor: 'pointer' }}
              >
                Commit Import to Central Inventory
              </button>
            </div>
          )}
        </div>
      )}

      {/* Supplier Purchase Order (PO) Modal */}
      {poModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', width: '700px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
            <div style={{ background: '#0F2167', color: '#FFFFFF', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={22} color="#FF6B00" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF' }}>
                  Generate Supplier Purchase Order (PO #AZI/PO/2026/0942)
                </h3>
              </div>
              <button onClick={() => setPoModalOpen(false)} style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Select OEM / OES Authorized Supplier:</label>
                <select
                  value={selectedPoSupplier}
                  onChange={(e) => setSelectedPoSupplier(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 800 }}
                >
                  <option value="Bosch India Automotive Pvt Ltd">Bosch India Automotive Pvt Ltd (Gstin: 27BOSCH1234F1Z1)</option>
                  <option value="Motul Oil India Distributors">Motul Oil India Distributors (Gstin: 27MOTUL5678F1Z2)</option>
                  <option value="Mann-Hummel Filters Pvt Ltd">Mann-Hummel Filters Pvt Ltd (Gstin: 27MANN9912F1Z3)</option>
                  <option value="Castrol India Automotive Ltd">Castrol India Automotive Ltd (Gstin: 27CASTROL001Z4)</option>
                </select>
              </div>

              <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '1rem', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.88rem', color: '#0F2167' }}>Itemized Purchase Order Summary:</h4>
                <div style={{ fontSize: '0.78rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {(poItemTarget ? [poItemTarget] : reorderList).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0.6rem', background: '#FFFFFF', borderRadius: '6px', border: '1px solid #CBD5E1' }}>
                      <span><b>{item.title}</b> (<code>{item.sku}</code>)</span>
                      <span>Order Qty: <b>+{item.suggestedQuantity} units</b> | Total: <b>₹{item.estimatedReorderCost.toLocaleString('en-IN')}</b></span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button onClick={() => setPoModalOpen(false)} style={{ background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: '8px', padding: '0.65rem 1.25rem', fontWeight: 800, fontSize: '0.85rem' }}>Cancel</button>
                <button
                  onClick={() => {
                    showToast(`⚡ Purchase Order AZI/PO/2026/0942 created & emailed to ${selectedPoSupplier}!`);
                    setPoModalOpen(false);
                  }}
                  style={{ background: '#FF6B00', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.65rem 1.5rem', fontWeight: 900, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Send size={16} /> ⚡ Approve & Email PO to Supplier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
