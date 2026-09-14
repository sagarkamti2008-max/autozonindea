import React, { useState, useEffect } from 'react';
import { warehouseFulfillmentService } from '../services/warehouseFulfillmentService';
import { SupabaseAPI } from '../services/supabaseClient';
import { BarcodePrintLabelModal } from '../components/BarcodePrintLabelModal';
import { Package, TrendingUp, AlertTriangle, Search, RefreshCw, BarChart2, Shield, Printer, Plus, X, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

export const AdminInventoryReportsView = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'search', 'adjustments', 'transactions'
  const [metrics, setMetrics] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Barcode Label Print state
  const [selectedProductForBarcode, setSelectedProductForBarcode] = useState(null);

  // Stock Adjustment Modal
  const [showAdjModal, setShowAdjModal] = useState(false);
  const [adjForm, setAdjForm] = useState({
    product_id: '',
    warehouse_id: '',
    quantity_change: 10,
    adjustment_type: 'increase',
    reason: 'Stock Audit Variance'
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    loadInventoryData();
  }, [activeTab]);

  const loadInventoryData = async () => {
    setLoading(true);
    const [{ data: prods }, { data: whs }, met, { data: txs }] = await Promise.all([
      SupabaseAPI.getCatalogProducts(),
      warehouseFulfillmentService.getWarehouses(),
      warehouseFulfillmentService.getFulfillmentDashboardMetrics(),
      warehouseFulfillmentService.getInventoryTransactions(50)
    ]);

    setProducts(prods || []);
    setWarehouses(whs || []);
    setMetrics(met);
    setTransactions(txs || []);
    setLoading(false);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    setLoading(true);
    const { data } = await warehouseFulfillmentService.searchInventory(searchQuery);
    setSearchResults(data || []);
    setLoading(false);
  };

  const handleAdjustmentSubmit = async () => {
    if (!adjForm.product_id || !adjForm.reason) return;
    setSaving(true);
    setMsg(null);

    const changeQty = adjForm.adjustment_type === 'decrease' || adjForm.adjustment_type === 'damaged' || adjForm.adjustment_type === 'lost'
      ? -Math.abs(parseInt(adjForm.quantity_change, 10))
      : Math.abs(parseInt(adjForm.quantity_change, 10));

    await warehouseFulfillmentService.recordStockTransaction({
      product_id: adjForm.product_id,
      warehouse_id: adjForm.warehouse_id || null,
      quantity_change: changeQty,
      reference_type: adjForm.adjustment_type === 'decrease' ? 'stock_adjustment' : adjForm.adjustment_type,
      reason: adjForm.reason
    });

    setSaving(false);
    setShowAdjModal(false);
    setMsg({ type: 'success', text: 'Stock adjustment recorded in transaction log.' });
    loadInventoryData();
  };

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Package size={24} className="text-emerald-400" /> Central Inventory &amp; Stock Control
          </h1>
          <p className="text-xs text-slate-400">
            Real database stock status, multi-warehouse stock audit logs, stock adjustments, and barcode generation.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'overview' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'search' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Universal Search
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'transactions' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Transaction Log
          </button>
        </div>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl border mb-6 text-xs flex items-center justify-between ${
          msg.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)}><X size={16} /></button>
        </div>
      )}

      {/* TAB 1: OVERVIEW DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-[11px] text-slate-400 font-semibold block mb-1">Total Catalog SKUs</span>
              <span className="text-2xl font-extrabold text-slate-100">{metrics?.totalProducts || 0}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-[11px] text-slate-400 font-semibold block mb-1">Total Physical Units</span>
              <span className="text-2xl font-extrabold text-emerald-400">{metrics?.totalUnits || 0}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-[11px] text-slate-400 font-semibold block mb-1">Available Stock</span>
              <span className="text-2xl font-extrabold text-emerald-400">{metrics?.availableStock || 0}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-[11px] text-slate-400 font-semibold block mb-1">Reserved Stock</span>
              <span className="text-2xl font-extrabold text-amber-400">{metrics?.reservedStock || 0}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-[11px] text-slate-400 font-semibold block mb-1">Damaged Stock</span>
              <span className="text-2xl font-extrabold text-red-400">{metrics?.damagedStock || 0}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold block">Low Stock Alerts</span>
                <span className="text-xl font-bold text-amber-400">{metrics?.lowStockCount || 0} Products</span>
              </div>
              <AlertTriangle size={24} className="text-amber-400" />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold block">Out of Stock</span>
                <span className="text-xl font-bold text-red-400">{metrics?.outOfStockCount || 0} Products</span>
              </div>
              <Package size={24} className="text-red-400" />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <button
                onClick={() => {
                  setAdjForm({
                    product_id: products[0]?.id || '',
                    warehouse_id: warehouses[0]?.id || '',
                    quantity_change: 10,
                    adjustment_type: 'increase',
                    reason: 'Physical Stock Audit Variance'
                  });
                  setShowAdjModal(true);
                }}
                className="w-full py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-emerald-400 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus size={16} /> Record Stock Adjustment
              </button>
            </div>
          </div>

          {/* Product Catalog Barcode Quick List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100">Live Product Catalog &amp; Barcode Generator</h3>
              <span className="text-xs text-slate-400">Click Print to generate thermal or A4 labels</span>
            </div>

            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5">Product Name</th>
                  <th className="p-3.5">SKU / Part Number</th>
                  <th className="p-3.5">Barcode</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-bold text-slate-100">{p.name || p.title}</td>
                    <td className="p-3.5 font-mono text-slate-300">{p.sku || p.part_number || 'AZ-PROD'}</td>
                    <td className="p-3.5 font-mono text-emerald-400 font-bold">{p.barcode || warehouseFulfillmentService.generateInternalBarcode(p)}</td>
                    <td className="p-3.5 font-extrabold text-slate-100">₹{p.price}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        (p.stock || 0) <= 10 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {p.stock || 0} units
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedProductForBarcode(p)}
                        className="px-3 py-1.5 bg-slate-800 text-slate-200 hover:bg-emerald-500 hover:text-slate-950 rounded text-xs font-bold transition-colors flex items-center gap-1.5 ml-auto"
                      >
                        <Printer size={14} /> Barcode Label
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: UNIVERSAL SEARCH */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          <form onSubmit={handleSearchSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search by SKU, Barcode, Product Name, Part Number, Bin Location (e.g. WH1-A-R01)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-emerald-400 transition-colors"
            >
              Search Stock
            </button>
          </form>

          {searchResults.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Warehouse</th>
                    <th className="p-3.5">Location Bin</th>
                    <th className="p-3.5">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {searchResults.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="p-3.5 font-bold text-slate-100">{r.product?.name || r.product?.title}</td>
                      <td className="p-3.5 text-slate-300">{r.warehouse?.name || 'Main Warehouse'}</td>
                      <td className="p-3.5 font-mono text-emerald-400">{r.location?.location_code || 'UNASSIGNED'}</td>
                      <td className="p-3.5 font-bold text-slate-100">{r.quantity} units</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TRANSACTIONS LOG */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-slate-200">Immutable Inventory Transaction Log</h3>
            <p className="text-xs text-slate-400">Complete audit trail of all physical stock movements, reservations, and manual adjustments.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5">Date &amp; Time</th>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Reference Type</th>
                  <th className="p-3.5">Before</th>
                  <th className="p-3.5">Change</th>
                  <th className="p-3.5">After</th>
                  <th className="p-3.5">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                      {new Date(tx.created_at).toLocaleString()}
                    </td>
                    <td className="p-3.5 font-bold text-slate-100">
                      {tx.product?.name || tx.product?.title || 'Auto Part'}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase bg-slate-950 border border-slate-800 text-emerald-400">
                        {tx.reference_type}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-400">{tx.quantity_before}</td>
                    <td className="p-3.5 font-mono font-bold">
                      <span className={tx.quantity_change >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {tx.quantity_change >= 0 ? `+${tx.quantity_change}` : tx.quantity_change}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-100 font-bold">{tx.quantity_after}</td>
                    <td className="p-3.5 text-slate-400 italic">{tx.reason || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {showAdjModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Record Stock Adjustment</h3>
              <button onClick={() => setShowAdjModal(false)}><X size={16} /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Target Product *</label>
                <select
                  value={adjForm.product_id}
                  onChange={(e) => setAdjForm({ ...adjForm, product_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name || p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Adjustment Type *</label>
                <select
                  value={adjForm.adjustment_type}
                  onChange={(e) => setAdjForm({ ...adjForm, adjustment_type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                >
                  <option value="increase">Increase Stock (+)</option>
                  <option value="decrease">Decrease Stock (-)</option>
                  <option value="damaged">Mark Damaged (-)</option>
                  <option value="lost">Mark Lost (-)</option>
                  <option value="manual_correction">Manual Audit Correction</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Quantity Change *</label>
                <input
                  type="number"
                  min={1}
                  value={adjForm.quantity_change}
                  onChange={(e) => setAdjForm({ ...adjForm, quantity_change: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Audited Reason *</label>
                <textarea
                  rows={2}
                  placeholder="Mandatory reason for auditing..."
                  value={adjForm.reason}
                  onChange={(e) => setAdjForm({ ...adjForm, reason: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowAdjModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjustmentSubmit}
                disabled={saving}
                className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded"
              >
                Commit Stock Adjustment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barcode Print Studio Modal */}
      <BarcodePrintLabelModal
        isOpen={Boolean(selectedProductForBarcode)}
        onClose={() => setSelectedProductForBarcode(null)}
        product={selectedProductForBarcode}
      />
    </div>
  );
};
