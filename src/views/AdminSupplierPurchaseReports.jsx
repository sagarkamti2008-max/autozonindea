import React, { useState, useEffect } from 'react';
import { BarChart2, Download, RefreshCw, DollarSign, Package, ShoppingCart, TrendingUp, Building } from 'lucide-react';
import { fetchPurchaseOrders, fetchSuppliers } from '../services/supplierPurchaseService';
import { exportReportToCSV } from '../services/adminAnalyticsEngine';
import { useStore } from '../context/StoreContext';

export default function AdminSupplierPurchaseReports() {
  const { products, orders } = useStore();
  const [activeTab, setActiveTab] = useState('purchases'); // 'purchases' | 'inventory'
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [poData, supData] = await Promise.all([
          fetchPurchaseOrders(),
          fetchSuppliers()
        ]);
        setPurchaseOrders(poData);
        setSuppliers(supData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Purchase Aggregation Metrics
  let totalPurchaseValue = 0;
  let receivedVal = 0;
  let pendingVal = 0;

  const supplierWiseMap = {};

  purchaseOrders.forEach(po => {
    const tot = Number(po.total_amount) || 0;
    if (po.status !== 'cancelled') {
      totalPurchaseValue += tot;
      if (po.status === 'received') {
        receivedVal += tot;
      } else {
        pendingVal += tot;
      }

      const sName = po.suppliers?.company_name || 'Unknown Supplier';
      if (!supplierWiseMap[sName]) {
        supplierWiseMap[sName] = { companyName: sName, ordersCount: 0, totalValue: 0 };
      }
      supplierWiseMap[sName].ordersCount += 1;
      supplierWiseMap[sName].totalValue += tot;
    }
  });

  const supplierWiseRows = Object.values(supplierWiseMap).sort((a, b) => b.totalValue - a.totalValue);

  // Inventory Valuation Aggregation
  let totalSellingValuation = 0;
  let totalCostValuation = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  products.forEach(p => {
    const stock = p.stock ?? p.stock_quantity ?? 0;
    const price = Number(p.price) || 0;
    const cost = Number(p.costPrice) || Math.round(price * 0.7);

    totalSellingValuation += (stock * price);
    totalCostValuation += (stock * cost);

    if (stock <= 0) outOfStockCount += 1;
    else if (stock <= (p.low_stock_threshold || 5)) lowStockCount += 1;
  });

  const handleExportPurchasesCSV = () => {
    if (!supplierWiseRows.length) return;
    exportReportToCSV('AutoZoneIndia_Supplier_Purchase_Report', supplierWiseRows);
  };

  const handleExportInventoryCSV = () => {
    if (!products.length) return;
    const rows = products.map(p => ({
      Product_Name: p.title || p.name,
      SKU: p.sku || p.partNumber,
      Stock_Qty: p.stock ?? p.stock_quantity ?? 0,
      Selling_Price_INR: p.price,
      Cost_Price_INR: p.costPrice || Math.round(p.price * 0.7),
      Total_Selling_Valuation_INR: (p.stock ?? p.stock_quantity ?? 0) * p.price,
      Total_Cost_Valuation_INR: (p.stock ?? p.stock_quantity ?? 0) * (p.costPrice || Math.round(p.price * 0.7))
    }));
    exportReportToCSV('AutoZoneIndia_Inventory_Valuation_Report', rows);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="text-amber-500" /> Supplier Procurement & Inventory Financial Reports
          </h1>
          <p className="text-slate-400 text-sm">
            Audited financial reports on vendor purchases, received vs pending commitments, and inventory valuation
          </p>
        </div>

        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => setActiveTab('purchases')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              activeTab === 'purchases' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Purchase Report
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              activeTab === 'inventory' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Inventory Valuation Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <RefreshCw className="animate-spin mx-auto text-amber-500 mb-2" size={28} />
          <p className="text-sm font-medium">Calculating financial reports...</p>
        </div>
      ) : activeTab === 'purchases' ? (
        <div className="space-y-6">
          {/* Purchase KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Procurement Commitments</div>
              <div className="text-2xl font-black text-white">₹{totalPurchaseValue.toLocaleString('en-IN')}</div>
              <p className="text-xs text-slate-500 mt-1">{purchaseOrders.length} Purchase Orders Total</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Received Stock Value</div>
              <div className="text-2xl font-black text-emerald-400">₹{receivedVal.toLocaleString('en-IN')}</div>
              <p className="text-xs text-slate-500 mt-1">Fully received PO commitments</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Procurement Value</div>
              <div className="text-2xl font-black text-amber-400">₹{pendingVal.toLocaleString('en-IN')}</div>
              <p className="text-xs text-slate-500 mt-1">Outstanding / in-transit vendor orders</p>
            </div>
          </div>

          {/* Supplier-Wise Purchases Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Supplier-Wise Purchase Breakdown</h2>
              <button
                onClick={handleExportPurchasesCSV}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold transition"
              >
                <Download size={14} /> Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-950/80 text-slate-400 text-xs uppercase border-b border-slate-800">
                    <th className="p-4">Supplier Company</th>
                    <th className="p-4 text-center">Purchase Orders Count</th>
                    <th className="p-4 text-right">Total Purchase Value (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {supplierWiseRows.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <Building size={16} className="text-amber-500" /> {s.companyName}
                      </td>
                      <td className="p-4 text-center text-slate-300 font-bold">{s.ordersCount} POs</td>
                      <td className="p-4 text-right font-black text-emerald-400 text-sm">
                        ₹{s.totalValue.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Inventory Valuation KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Stock Cost Valuation</div>
              <div className="text-2xl font-black text-emerald-400">₹{totalCostValuation.toLocaleString('en-IN')}</div>
              <p className="text-xs text-slate-500 mt-1">Based on purchase cost prices</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Retail Selling Valuation</div>
              <div className="text-2xl font-black text-amber-400">₹{totalSellingValuation.toLocaleString('en-IN')}</div>
              <p className="text-xs text-slate-500 mt-1">Based on catalog selling prices</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Stock Health Exceptions</div>
              <div className="text-2xl font-black text-red-400">{lowStockCount + outOfStockCount} SKUs</div>
              <p className="text-xs text-slate-500 mt-1">{lowStockCount} Low Stock, {outOfStockCount} Out of Stock</p>
            </div>
          </div>

          {/* Product Inventory Valuation Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Product Inventory Valuation Breakdown</h2>
              <button
                onClick={handleExportInventoryCSV}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold transition"
              >
                <Download size={14} /> Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-950/80 text-slate-400 text-xs uppercase border-b border-slate-800">
                    <th className="p-4">Product Name & SKU</th>
                    <th className="p-4 text-center">Stock Qty</th>
                    <th className="p-4 text-right">Cost Price (₹)</th>
                    <th className="p-4 text-right">Selling Price (₹)</th>
                    <th className="p-4 text-right">Total Cost Valuation (₹)</th>
                    <th className="p-4 text-right">Total Selling Valuation (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {products.map(p => {
                    const stock = p.stock ?? p.stock_quantity ?? 0;
                    const price = Number(p.price) || 0;
                    const cost = Number(p.costPrice) || Math.round(price * 0.7);

                    return (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-4">
                          <strong className="text-white block">{p.title || p.name}</strong>
                          <span className="text-amber-400 font-mono text-[11px]">{p.sku || p.partNumber}</span>
                        </td>
                        <td className="p-4 text-center font-bold text-slate-200">{stock} units</td>
                        <td className="p-4 text-right text-slate-300">₹{cost.toLocaleString('en-IN')}</td>
                        <td className="p-4 text-right text-slate-300">₹{price.toLocaleString('en-IN')}</td>
                        <td className="p-4 text-right font-bold text-emerald-400">
                          ₹{(stock * cost).toLocaleString('en-IN')}
                        </td>
                        <td className="p-4 text-right font-bold text-amber-400">
                          ₹{(stock * price).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
