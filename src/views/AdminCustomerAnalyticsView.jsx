import React, { useState, useEffect } from 'react';
import { Users, UserPlus, UserCheck, UserX, Download, RefreshCw, AlertCircle, TrendingUp, Repeat } from 'lucide-react';
import DateRangeFilter from '../components/DateRangeFilter';
import { fetchCustomerAnalytics, exportReportToCSV } from '../services/adminAnalyticsEngine';

export default function AdminCustomerAnalyticsView() {
  const [dateRange, setDateRange] = useState('30days');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCustomerAnalytics(dateRange);
      setMetrics(res);
    } catch (err) {
      console.error(err);
      setError('Failed to compute customer analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const handleExportCSV = () => {
    if (!metrics) return;
    const exportRows = [{
      Total_Customers: metrics.totalCustomers,
      New_Customers: metrics.newCustomers,
      Returning_Customers: metrics.returningCustomers,
      Customers_With_Orders: metrics.customersWithOrders,
      Customers_With_No_Orders: metrics.customersWithNoOrders,
      Average_Order_Value_INR: Math.round(metrics.avgOrderValue),
      Orders_Per_Customer: metrics.ordersPerCustomer.toFixed(2),
      Repeat_Customer_Rate_Pct: metrics.repeatCustomerRate.toFixed(2)
    }];
    exportReportToCSV('AutoZoneIndia_Customer_Analytics', exportRows);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 gap-3">
        <RefreshCw className="animate-spin text-amber-500" size={32} />
        <p className="text-sm font-medium">Analyzing customer order behavior and acquisition metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-red-950/40 border border-red-800 rounded-2xl p-6 text-center text-red-300">
          <AlertCircle size={40} className="mx-auto mb-3 text-red-500" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const {
    totalCustomers = 0,
    newCustomers = 0,
    returningCustomers = 0,
    customersWithOrders = 0,
    customersWithNoOrders = 0,
    avgOrderValue = 0,
    ordersPerCustomer = 0,
    repeatCustomerRate = 0
  } = metrics || {};

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-amber-500" /> Customer Analytics & Retention
          </h1>
          <p className="text-slate-400 text-sm">
            Customer acquisition, repeat purchasing patterns, and order values
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DateRangeFilter selectedRange={dateRange} onRangeChange={setDateRange} />
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-sm transition"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Registered Customers</span>
            <Users className="text-blue-400" size={20} />
          </div>
          <div className="text-2xl font-black text-white">{totalCustomers.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">Verified user accounts</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>New Customers (Period)</span>
            <UserPlus className="text-emerald-400" size={20} />
          </div>
          <div className="text-2xl font-black text-white">{newCustomers.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">Joined in selected timeframe</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Repeat Customers</span>
            <Repeat className="text-amber-400" size={20} />
          </div>
          <div className="text-2xl font-black text-white">{returningCustomers.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">Placing 2 or more orders</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Active Buying Customers</span>
            <UserCheck className="text-purple-400" size={20} />
          </div>
          <div className="text-2xl font-black text-white">{customersWithOrders.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">At least 1 valid purchase</p>
        </div>
      </div>

      {/* Aggregate Behavior Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center">
          <p className="text-xs text-slate-400 uppercase font-semibold">Average Order Value</p>
          <div className="text-3xl font-black text-emerald-400 mt-2">
            ₹{Math.round(avgOrderValue).toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 mt-1">Per transaction across all customers</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center">
          <p className="text-xs text-slate-400 uppercase font-semibold">Orders Per Buying Customer</p>
          <div className="text-3xl font-black text-amber-400 mt-2">
            {ordersPerCustomer.toFixed(2)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Average transaction frequency</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center">
          <p className="text-xs text-slate-400 uppercase font-semibold">Repeat Customer Rate</p>
          <div className="text-3xl font-black text-sky-400 mt-2">
            {repeatCustomerRate.toFixed(1)}%
          </div>
          <p className="text-xs text-slate-500 mt-1">Percentage of buying customers returning</p>
        </div>
      </div>
    </div>
  );
}
