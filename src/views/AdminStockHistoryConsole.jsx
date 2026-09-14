import React, { useState, useEffect } from 'react';
import { History, Search, RefreshCw, Download, FileText } from 'lucide-react';
import { fetchStockHistory } from '../services/supplierPurchaseService';
import { exportReportToCSV } from '../services/adminAnalyticsEngine';
import { useStore } from '../context/StoreContext';

export default function AdminStockHistoryConsole() {
  const { products } = useStore();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchStockHistory(selectedProductId || null, 150);
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedProductId]);

  const filteredHistory = history.filter(h => {
    if (typeFilter !== 'all' && h.transaction_type !== typeFilter) return false;
    return true;
  });

  const handleExportCSV = () => {
    if (!filteredHistory.length) return;
    const exportRows = filteredHistory.map(h => ({
      Timestamp: h.created_at,
      Product_SKU: h.products?.sku || h.product_id,
      Transaction_Type: h.transaction_type,
      Quantity_Change: h.quantity,
      Stock_Before: h.quantity_before,
      Stock_After: h.quantity_after,
      Reference: h.reference_id || 'N/A',
      Notes: h.notes || ''
    }));
    exportReportToCSV('AutoZoneIndia_Stock_Movement_History', exportRows);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <History className="text-amber-500" /> Stock Movement History Ledger
          </h1>
          <p className="text-slate-400 text-sm">
            Audited, immutable timeline of every physical stock addition, deduction, sales dispatch, and return
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/20"
        >
          <Download size={16} /> Export CSV Ledger
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <span className="text-slate-400 font-medium">Filter by Product:</span>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-white px-3 py-1.5 rounded-lg font-semibold flex-1"
          >
            <option value="">All Catalog Products</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.title || p.name} (SKU: {p.sku || p.partNumber})</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Type:</span>
          {['all', 'purchase', 'sale', 'adjustment', 'damaged', 'return'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg font-semibold uppercase transition ${
                typeFilter === t ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <RefreshCw className="animate-spin mx-auto text-amber-500 mb-2" size={28} />
          <p className="text-sm font-medium">Fetching stock movement history...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl">
          <FileText size={48} className="mx-auto mb-3 text-slate-600 opacity-60" />
          <p className="text-base font-semibold text-slate-300">No stock movement transactions found.</p>
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 uppercase border-b border-slate-800">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Product & SKU</th>
                  <th className="p-4">Transaction Event</th>
                  <th className="p-4 text-center">Qty Change</th>
                  <th className="p-4 text-center">Stock Before → After</th>
                  <th className="p-4">Reference / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredHistory.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 text-slate-400">
                      {new Date(tx.created_at).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <code className="text-amber-400 font-bold block">{tx.products?.sku || tx.product_id}</code>
                      <span className="text-white font-sans text-xs">{tx.products?.name}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold uppercase text-[10px]">
                        {tx.transaction_type}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <strong className={`text-sm ${tx.quantity > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                      </strong>
                    </td>
                    <td className="p-4 text-center text-slate-300">
                      {tx.quantity_before} → <b className="text-white">{tx.quantity_after}</b>
                    </td>
                    <td className="p-4 text-slate-300 font-sans">
                      {tx.reference_id && <span className="font-mono text-amber-300 block font-bold">Ref: {tx.reference_id}</span>}
                      <span>{tx.notes || 'N/A'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
