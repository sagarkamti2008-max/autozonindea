import React, { useState, useEffect } from 'react';
import { AlertTriangle, Package, ShoppingCart, RefreshCw, Download } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getReorderSuggestions, calculateStockStatus } from '../services/inventoryManagementEngine';
import { exportReportToCSV } from '../services/adminAnalyticsEngine';

export default function AdminLowStockConsole() {
  const { products, navigateTo } = useStore();

  const reorderList = getReorderSuggestions(products);

  const handleExportCSV = () => {
    if (!reorderList.length) return;
    const exportRows = reorderList.map(r => ({
      SKU: r.sku,
      Product_Title: r.title,
      Available_Stock: r.availableStock,
      Reorder_Level: r.reorderLevel,
      Target_Stock: r.targetStock,
      Suggested_Reorder_Qty: r.suggestedQuantity,
      Est_Unit_Cost_INR: r.costPrice,
      Est_Total_Cost_INR: r.estimatedReorderCost
    }));
    exportReportToCSV('AutoZoneIndia_Low_Stock_Reorder_Report', exportRows);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="text-amber-500" /> Low Stock & Reorder Intelligence
          </h1>
          <p className="text-slate-400 text-sm">
            Automated stock replenishment suggestions based on minimum reorder levels and supplier lead times
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={() => navigateTo('admin-purchases')}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/20"
          >
            <ShoppingCart size={16} /> Open PO Manager
          </button>
        </div>
      </div>

      {reorderList.length === 0 ? (
        <div className="py-20 text-center text-slate-500 bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl">
          <Package size={48} className="mx-auto mb-3 text-emerald-500 opacity-80" />
          <p className="text-base font-semibold text-slate-300">All quiet! No products are currently below reorder threshold.</p>
          <p className="text-xs text-slate-500 mt-1">Central inventory stock levels are healthy.</p>
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {reorderList.length} SKUs Require Stock Replenishment
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 text-xs uppercase border-b border-slate-800">
                  <th className="p-4">SKU & Product Name</th>
                  <th className="p-4 text-center">Available Stock</th>
                  <th className="p-4 text-center">Reorder Threshold</th>
                  <th className="p-4 text-center">Suggested Reorder Qty</th>
                  <th className="p-4 text-right">Est Procurement Cost (₹)</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {reorderList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <code className="text-amber-400 font-bold block">{item.sku}</code>
                      <span className="text-white font-semibold block text-sm mt-0.5">{item.title}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 rounded bg-red-500/10 text-red-400 font-black border border-red-500/30">
                        {item.availableStock} units
                      </span>
                    </td>
                    <td className="p-4 text-center text-slate-300 font-mono">
                      {item.reorderLevel} units
                    </td>
                    <td className="p-4 text-center">
                      <strong className="text-emerald-400 text-sm font-black">
                        +{item.suggestedQuantity} units
                      </strong>
                    </td>
                    <td className="p-4 text-right font-black text-amber-400 text-sm">
                      ₹{item.estimatedReorderCost.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => navigateTo('admin-purchases')}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold transition shadow"
                      >
                        1-Click PO
                      </button>
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
