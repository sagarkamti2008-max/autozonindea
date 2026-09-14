import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { CreditCard, Search, Filter, CheckCircle2, Clock, XCircle, RefreshCw, ShieldAlert, DollarSign } from 'lucide-react';

export function AdminPaymentConsole() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [stats, setStats] = useState({
    totalVolume: 0,
    paidVolume: 0,
    pendingVolume: 0,
    refundedVolume: 0
  });

  useEffect(() => {
    fetchPayments();
  }, [search, statusFilter, methodFilter]);

  const fetchPayments = async () => {
    setLoading(true);

    try {
      let query = supabase
        .from('payments')
        .select(`
          *,
          orders (
            order_number,
            customer_name,
            customer_phone,
            total_amount,
            status
          )
        `);

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (methodFilter !== 'all') {
        query = query.eq('payment_method', methodFilter);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      let filteredData = data || [];

      if (search) {
        const lower = search.toLowerCase();
        filteredData = filteredData.filter(p => 
          (p.provider_payment_id || '').toLowerCase().includes(lower) ||
          (p.orders?.order_number || '').toLowerCase().includes(lower) ||
          (p.orders?.customer_name || '').toLowerCase().includes(lower) ||
          (p.orders?.customer_phone || '').includes(search)
        );
      }

      setPayments(filteredData);

      // Compute volume KPI stats safely
      const totalVolume = filteredData.reduce((acc, p) => acc + Number(p.amount || 0), 0);
      const paidVolume = filteredData.filter(p => p.status === 'paid').reduce((acc, p) => acc + Number(p.amount || 0), 0);
      const pendingVolume = filteredData.filter(p => p.status === 'pending').reduce((acc, p) => acc + Number(p.amount || 0), 0);
      const refundedVolume = filteredData.filter(p => p.status === 'refunded').reduce((acc, p) => acc + Number(p.amount || 0), 0);

      setStats({ totalVolume, paidVolume, pendingVolume, refundedVolume });
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <CreditCard className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Payment Transactions Console</h1>
            <p className="text-slate-400 text-sm">Monitor payment gateway sessions, COD collection status, and refunds safely</p>
          </div>
        </div>
      </div>

      {/* KPI Volume Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Gross Volume</span>
            <DollarSign className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-3xl font-extrabold text-white">₹{stats.totalVolume.toLocaleString('en-IN')}</p>
          <span className="text-xs text-slate-500 mt-1 block">All created payment sessions</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Verified Paid</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">₹{stats.paidVolume.toLocaleString('en-IN')}</p>
          <span className="text-xs text-slate-500 mt-1 block">Cleared online & COD collections</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Pending Collections</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400">₹{stats.pendingVolume.toLocaleString('en-IN')}</p>
          <span className="text-xs text-slate-500 mt-1 block">Uncollected COD / Open gateway</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Refunds & Reversed</span>
            <RefreshCw className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-3xl font-extrabold text-rose-400">₹{stats.refundedVolume.toLocaleString('en-IN')}</p>
          <span className="text-xs text-slate-500 mt-1 block">Cancelled order refunds</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Order #, Customer or Payment Ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500 transition font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500 transition font-medium"
          >
            <option value="all">All Methods</option>
            <option value="cod">Cash on Delivery (COD)</option>
            <option value="online">Online Gateway</option>
          </select>
        </div>
      </div>

      {/* Security Banner */}
      <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-center space-x-2">
        <ShieldAlert className="w-4 h-4 flex-shrink-0 text-emerald-400" />
        <span>Payment Security Enforced: Zero card numbers, CVV, or banking PINs are stored or displayed in accordance with RBI & PCI-DSS guidelines.</span>
      </div>

      {/* Payment Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-xs border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Transaction / Provider Ref</th>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4 text-center">Method</th>
                <th className="py-3.5 px-4 text-center">Provider</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading payment records...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500">
                    No payment transactions found.
                  </td>
                </tr>
              ) : (
                payments.map((p) => {
                  const orderNum = p.orders?.order_number || 'N/A';
                  const custName = p.orders?.customer_name || 'Customer';
                  const custPhone = p.orders?.customer_phone || '';

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-4 px-4 font-mono text-xs text-amber-400 font-semibold">
                        {p.provider_payment_id || p.transaction_id || p.provider_order_id || `PAY-${p.id.slice(0, 8)}`}
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-300 text-xs">
                        {orderNum}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-white">{custName}</div>
                        <div className="text-xs text-slate-400">{custPhone}</div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold uppercase">
                          {p.payment_method || 'COD'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center text-xs font-semibold text-slate-400 uppercase">
                        {p.provider || 'cod'}
                      </td>
                      <td className="py-4 px-4 text-right font-extrabold text-white">
                        ₹{Number(p.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide inline-flex items-center gap-1 ${
                          p.status === 'paid'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : p.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : p.status === 'refunded'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {p.status === 'paid' && <CheckCircle2 className="w-3 h-3" />}
                          {p.status === 'pending' && <Clock className="w-3 h-3" />}
                          {p.status === 'failed' && <XCircle className="w-3 h-3" />}
                          {p.status === 'refunded' && <RefreshCw className="w-3 h-3" />}
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-slate-400 text-xs">
                        {new Date(p.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPaymentConsole;
