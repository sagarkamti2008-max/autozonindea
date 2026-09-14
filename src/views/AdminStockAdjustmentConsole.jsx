import React, { useState, useEffect } from 'react';
import { Boxes, RefreshCw, AlertTriangle, ShieldCheck, FileText, CheckCircle } from 'lucide-react';
import { createInventoryTransaction, fetchStockHistory } from '../services/supplierPurchaseService';
import { useStore } from '../context/StoreContext';

export default function AdminStockAdjustmentConsole() {
  const { products, showToast } = useStore();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    productId: '',
    transactionType: 'manual_in',
    quantity: 5,
    reason: 'Physical stock correction',
    notes: ''
  });

  const [confirmModal, setConfirmModal] = useState(false);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await fetchStockHistory(null, 50);
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.productId) {
      showToast('Please select a product.', 'error');
      return;
    }
    if (form.quantity === 0) {
      showToast('Quantity cannot be 0.', 'error');
      return;
    }
    setConfirmModal(true);
  };

  const handleConfirmAdjustment = async () => {
    try {
      // Determine positive or negative based on type
      let qty = Math.abs(Number(form.quantity));
      if (['manual_out', 'damaged'].includes(form.transactionType)) {
        qty = -qty;
      }

      await createInventoryTransaction({
        productId: form.productId,
        transactionType: form.transactionType,
        quantity: qty,
        reason: form.reason,
        notes: form.notes
      });

      showToast('🎉 Inventory stock adjusted & transaction logged!', 'success');
      setConfirmModal(false);
      setForm({ productId: '', transactionType: 'manual_in', quantity: 5, reason: 'Physical stock correction', notes: '' });
      loadHistory();
    } catch (err) {
      showToast('Stock adjustment failed: ' + err.message, 'error');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Boxes className="text-amber-500" /> Manual Stock Adjustment Console
        </h1>
        <p className="text-slate-400 text-sm">
          Safely perform physical stock corrections, damage write-offs, and manual inventory updates
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Adjustment Form Panel */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit">
          <h2 className="text-base font-bold text-white mb-4">Stock Adjustment Form</h2>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Select Product *</label>
              <select
                required
                value={form.productId}
                onChange={(e) => setForm({ ...form, productId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl text-xs font-semibold"
              >
                <option value="">-- Choose Product --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title || p.name} (SKU: {p.sku || p.partNumber} | Current: {p.stock ?? p.stock_quantity ?? 0})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Transaction Type *</label>
              <select
                value={form.transactionType}
                onChange={(e) => setForm({ ...form, transactionType: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl text-xs font-semibold"
              >
                <option value="manual_in">Manual Addition (+)</option>
                <option value="manual_out">Manual Deduction (-)</option>
                <option value="adjustment">Stock Audit Correction</option>
                <option value="damaged">Damaged Write-Off (-)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Quantity *</label>
              <input
                type="number"
                min="1"
                required
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Reason Code *</label>
              <select
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl text-xs"
              >
                <option value="Physical stock correction">Physical Stock Correction</option>
                <option value="Damaged in warehouse">Damaged in Warehouse</option>
                <option value="Missing stock write-off">Missing Stock Write-off</option>
                <option value="Warehouse inventory audit">Warehouse Inventory Audit</option>
                <option value="Manual stock addition">Manual Stock Addition</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Audit Notes / Ref #</label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl text-xs"
                placeholder="Optional notes or audit ticket reference..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
            >
              Commit Stock Adjustment
            </button>
          </form>
        </div>

        {/* Live Inventory Transactions Audit Log */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-base font-bold text-white mb-4 flex items-center justify-between">
            <span>Live Stock Movement Transactions Log</span>
            <span className="text-xs text-slate-400 font-normal">{history.length} Recent Records</span>
          </h2>

          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <RefreshCw className="animate-spin mx-auto text-amber-500 mb-2" size={24} />
              <p className="text-xs">Fetching transactions log...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="py-12 text-center text-slate-500 bg-slate-950/60 rounded-xl border border-dashed border-slate-800">
              <FileText size={36} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">No stock transactions recorded yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/80 text-slate-400 uppercase border-b border-slate-800">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Product SKU</th>
                    <th className="p-3">Type</th>
                    <th className="p-3 text-center">Change</th>
                    <th className="p-3 text-center">Before → After</th>
                    <th className="p-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {history.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 text-slate-400">
                        {new Date(tx.created_at).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-amber-400 font-bold">
                        {tx.products?.sku || tx.product_id}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold uppercase text-[10px]">
                          {tx.transaction_type}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <strong className={tx.quantity > 0 ? 'text-emerald-400' : 'text-red-400'}>
                          {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                        </strong>
                      </td>
                      <td className="p-3 text-center text-slate-300">
                        {tx.quantity_before} → <b>{tx.quantity_after}</b>
                      </td>
                      <td className="p-3 text-slate-400 font-sans">{tx.notes || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-500">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-bold text-white">Confirm Stock Adjustment</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to commit this manual inventory change? This operation will instantly update physical stock in the database and append an immutable transaction audit log.
            </p>

            <div className="pt-2 flex justify-end gap-3 border-t border-slate-800">
              <button
                onClick={() => setConfirmModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAdjustment}
                className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-600 transition"
              >
                Confirm & Commit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
