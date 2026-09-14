import React, { useState, useEffect } from 'react';
import { listSearchAnalytics } from '../services/advancedSearchEngine';
import { Search, AlertTriangle, TrendingUp, HelpCircle, Filter, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export function AdminSearchAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    const data = await listSearchAnalytics({ limit: 100 });
    setAnalytics(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
            <Search className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Search & Discovery Analytics</h1>
            <p className="text-slate-400 text-sm">Monitor customer search queries, zero-result searches, and catalog demand gaps</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-slate-400 ml-2" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-slate-950 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase mb-2">
            <span>Total Searches</span>
            <Search className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-3xl font-extrabold text-white">{analytics?.totalSearches || 0}</p>
          <span className="text-xs text-slate-500 mt-1 block">Customer catalog queries</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold uppercase mb-2">
            <span>Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">9.4%</p>
          <span className="text-xs text-slate-500 mt-1 block">Searches converting to order</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-rose-400 text-xs font-semibold uppercase mb-2">
            <span>Zero-Result Searches</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-3xl font-extrabold text-rose-400">{analytics?.zeroResultCount || 0}</p>
          <span className="text-xs text-slate-500 mt-1 block">Searches yielding no SKUs</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-amber-400 text-xs font-semibold uppercase mb-2">
            <span>Top Searched Make</span>
            <HelpCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400">Toyota</p>
          <span className="text-xs text-slate-500 mt-1 block">Innova & Fortuner catalog</span>
        </div>
      </div>

      {/* Analytics Data Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Searched Queries */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-500" /> Most Searched Catalog Queries
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Search Query</th>
                  <th className="py-3 px-3 text-center">Searches</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {analytics?.topQueries?.map((q, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-semibold text-white">{q.query}</td>
                    <td className="py-3 px-3 text-center font-extrabold text-amber-400">{q.count}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[11px] font-bold">In Catalog</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Zero Result Searches Alert Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" /> Zero-Result Demand Gaps (Catalog Expansion Alerts)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Query</th>
                  <th className="py-3 px-3 text-center">Miss Count</th>
                  <th className="py-3 px-3 text-right">Action Needed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {analytics?.topZeroQueries?.map((z, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-mono text-rose-300 font-semibold">{z.query}</td>
                    <td className="py-3 px-3 text-center font-bold text-white">{z.zeroCount}</td>
                    <td className="py-3 px-3 text-right text-amber-400 font-medium">Add SKU to Catalog</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSearchAnalytics;
