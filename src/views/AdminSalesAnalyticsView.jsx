import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  DollarSign, ShoppingBag, TrendingUp, Package, Tag, ShieldCheck, 
  Truck, Download, AlertCircle, RefreshCw, BarChart2 
} from 'lucide-react';
import DateRangeFilter from '../components/DateRangeFilter';
import { fetchSalesAnalytics, exportReportToCSV } from '../services/adminAnalyticsEngine';

export default function AdminSalesAnalyticsView() {
  const { navigateTo } = useStore();
  const [dateRange, setDateRange] = useState('30days');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);
  const [chartGranularity, setChartGranularity] = useState('daily');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchSalesAnalytics(dateRange, customStart, customEnd);
      setAnalytics(res);
    } catch (err) {
      console.error(err);
      setError('Unable to load sales report from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dateRange, customStart, customEnd]);

  const handleExportCSV = () => {
    if (!analytics || !analytics.chartData) return;
    const exportRows = analytics.chartData.map(d => ({
      Date: d.date,
      Revenue_INR: d.revenue,
      Orders_Count: d.orders
    }));
    exportReportToCSV('AutoZoneIndia_Sales_Report', exportRows);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 gap-3">
        <RefreshCw className="animate-spin text-amber-500" size={32} />
        <p className="text-sm font-medium">Querying actual sales database records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-red-950/40 border border-red-800/80 rounded-2xl p-6 text-center text-red-300">
          <AlertCircle size={40} className="mx-auto mb-3 text-red-500" />
          <h2 className="text-lg font-bold">Unable to load this report</h2>
          <p className="text-sm text-red-400 mt-1">{error}</p>
          <button 
            onClick={loadData}
            className="mt-4 bg-red-800 hover:bg-red-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition"
          >
            Retry Query
          </button>
        </div>
      </div>
    );
  }

  const {
    revenue = 0,
    ordersCount = 0,
    averageOrderValue = 0,
    itemsSold = 0,
    discountGiven = 0,
    taxCollected = 0,
    shippingRevenue = 0,
    chartData = [],
    statusCounts = {},
    totalOrdersEvaluated = 0
  } = analytics || {};

  const maxChartVal = Math.max(...chartData.map(d => d.revenue), 100);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="text-amber-500" /> Sales Analytics & Business Intelligence
          </h1>
          <p className="text-slate-400 text-sm">
            Real-time financial metrics from validated AutoZoneIndia orders
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DateRangeFilter
            selectedRange={dateRange}
            onRangeChange={setDateRange}
            customStart={customStart}
            customEnd={customEnd}
            onCustomChange={(s, e) => { setCustomStart(s); setCustomEnd(e); }}
          />
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-sm transition shadow-lg shadow-amber-500/20"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Revenue</span>
            <DollarSign className="text-emerald-400" size={20} />
          </div>
          <div className="text-2xl font-black text-white">₹{revenue.toLocaleString('en-IN')}</div>
          <p className="text-xs text-slate-500 mt-1">Excludes cancelled & refunded orders</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Valid Orders</span>
            <ShoppingBag className="text-blue-400" size={20} />
          </div>
          <div className="text-2xl font-black text-white">{ordersCount.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">Total completed/active orders</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Avg Order Value (AOV)</span>
            <BarChart2 className="text-amber-400" size={20} />
          </div>
          <div className="text-2xl font-black text-white">₹{Math.round(averageOrderValue).toLocaleString('en-IN')}</div>
          <p className="text-xs text-slate-500 mt-1">Revenue per order</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Items Sold</span>
            <Package className="text-purple-400" size={20} />
          </div>
          <div className="text-2xl font-black text-white">{itemsSold.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">Total physical units fulfilled</p>
        </div>
      </div>

      {/* Secondary Financial Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Tag className="text-amber-400" size={24} />
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Total Discount Given</p>
              <p className="text-lg font-bold text-white">₹{discountGiven.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-indigo-400" size={24} />
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">GST Tax Collected</p>
              <p className="text-lg font-bold text-white">₹{taxCollected.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Truck className="text-sky-400" size={24} />
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Shipping Revenue</p>
              <p className="text-lg font-bold text-white">₹{shippingRevenue.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Revenue Trend Chart</h2>
            <p className="text-xs text-slate-400">Actual sales generated across selected period</p>
          </div>
          <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800 text-xs">
            {['daily', 'weekly', 'monthly'].map(g => (
              <button
                key={g}
                onClick={() => setChartGranularity(g)}
                className={`px-3 py-1.5 rounded-md font-semibold capitalize transition ${
                  chartGranularity === g ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="py-16 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
            <BarChart2 size={48} className="mx-auto mb-2 text-slate-600 opacity-60" />
            <p className="text-sm font-semibold text-slate-400">No sales data available for this period.</p>
            <p className="text-xs text-slate-500 mt-1">Try selecting a broader date range above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="h-64 flex items-end gap-2 border-b border-slate-800 pb-2 pt-6">
              {chartData.map((d, i) => {
                const heightPct = Math.max(8, Math.round((d.revenue / maxChartVal) * 100));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center group relative">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center bg-slate-950 border border-slate-700 text-white text-[11px] py-1 px-2.5 rounded shadow-xl whitespace-nowrap z-20">
                      <span className="font-bold text-amber-400">₹{d.revenue.toLocaleString('en-IN')}</span>
                      <span className="text-slate-400">{d.orders} order(s) on {d.date}</span>
                    </div>

                    {/* Bar */}
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t hover:brightness-125 transition-all cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-1">
              <span>{chartData[0]?.date}</span>
              <span>{chartData[Math.floor(chartData.length / 2)]?.date}</span>
              <span>{chartData[chartData.length - 1]?.date}</span>
            </div>
          </div>
        )}
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-1">Order Status Analytics</h2>
        <p className="text-xs text-slate-400 mb-6">Click any status card to view filtered order records</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {Object.entries(statusCounts).map(([stKey, count]) => {
            const pct = totalOrdersEvaluated > 0 ? ((count / totalOrdersEvaluated) * 100).toFixed(1) : 0;
            return (
              <button
                key={stKey}
                onClick={() => navigateTo('fulfillment')}
                className="bg-slate-950 border border-slate-800 hover:border-amber-500/60 p-4 rounded-xl text-left transition group"
              >
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider group-hover:text-amber-400">
                  {stKey}
                </p>
                <div className="text-xl font-bold text-white mt-1">{count}</div>
                <p className="text-[10px] text-slate-500 mt-0.5">{pct}% of total</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
