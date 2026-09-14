import React, { useState, useEffect } from 'react';
import { Package, Download, RefreshCw, AlertCircle, Layers, Award } from 'lucide-react';
import DateRangeFilter from '../components/DateRangeFilter';
import { fetchProductAnalytics, exportReportToCSV } from '../services/adminAnalyticsEngine';
import { supabase } from '../services/supabaseClient';

export default function AdminProductAnalyticsView() {
  const [dateRange, setDateRange] = useState('30days');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

  const [loading, setLoading] = useState(true);
  const [productsData, setProductsData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch Filter Meta
    async function loadMeta() {
      const { data: catData } = await supabase.from('categories').select('id, name');
      const { data: brandData } = await supabase.from('brands').select('id, name');
      if (catData) setCategories(catData);
      if (brandData) setBrands(brandData);
    }
    loadMeta();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchProductAnalytics(
        dateRange, 
        selectedCategory || null, 
        selectedBrand || null
      );
      setProductsData(res);
    } catch (err) {
      console.error(err);
      setError('Unable to load product performance report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dateRange, selectedCategory, selectedBrand]);

  const handleExportCSV = () => {
    if (!productsData.length) return;
    const exportRows = productsData.map(p => ({
      Product_Name: p.name,
      SKU: p.sku,
      Units_Sold: p.unitsSold,
      Revenue_INR: p.revenue,
      Orders_Count: p.ordersCount
    }));
    exportReportToCSV('AutoZoneIndia_Top_Products_Report', exportRows);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="text-amber-500" /> Top Products & Catalog Analytics
          </h1>
          <p className="text-slate-400 text-sm">
            Top performing parts, SKUs, categories and brands based on actual sales records
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <DateRangeFilter
            selectedRange={dateRange}
            onRangeChange={setDateRange}
            customStart={customStart}
            customEnd={customEnd}
            onCustomChange={(s, e) => { setCustomStart(s); setCustomEnd(e); }}
          />

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs font-medium cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs font-medium cursor-pointer"
          >
            <option value="">All Brands</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl font-bold text-xs transition"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-slate-400 gap-3">
          <RefreshCw className="animate-spin text-amber-500" size={32} />
          <p className="text-sm font-medium">Calculating product sales metrics from order items...</p>
        </div>
      ) : error ? (
        <div className="bg-red-950/40 border border-red-800 p-6 rounded-2xl text-center text-red-300">
          <AlertCircle size={32} className="mx-auto mb-2 text-red-500" />
          <p>{error}</p>
        </div>
      ) : productsData.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl">
          <Package size={48} className="mx-auto mb-3 text-slate-600 opacity-60" />
          <p className="text-base font-semibold text-slate-400">No product sales data available for this selection.</p>
          <p className="text-xs text-slate-500 mt-1">Adjust filters to see top selling items.</p>
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Top Selling Products</h2>
            <span className="text-xs text-slate-400">{productsData.length} Products Found</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-950/40 text-slate-400 text-xs uppercase border-b border-slate-800">
                  <th className="p-4">Rank & Product Name</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4 text-center">Units Sold</th>
                  <th className="p-4 text-right">Revenue (₹)</th>
                  <th className="p-4 text-center">Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {productsData.map((prod, idx) => (
                  <tr key={prod.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-medium text-white flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        idx === 0 ? 'bg-amber-500 text-slate-950' : 
                        idx === 1 ? 'bg-slate-300 text-slate-950' : 
                        idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {idx + 1}
                      </span>
                      <span>{prod.name}</span>
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-xs">{prod.sku}</td>
                    <td className="p-4 text-center font-bold text-amber-400">{prod.unitsSold}</td>
                    <td className="p-4 text-right font-black text-emerald-400">₹{prod.revenue.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-center text-slate-300">{prod.ordersCount}</td>
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
