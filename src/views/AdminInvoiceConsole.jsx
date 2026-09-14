import React, { useState, useEffect } from 'react';
import { listInvoices, generateInvoiceForOrder } from '../services/invoiceService';
import { Search, Filter, FileText, Download, Eye, RefreshCw, CheckCircle2, Clock, AlertCircle, Printer } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function AdminInvoiceConsole() {
  const [invoices, setInvoices] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    today: 0
  });
  const [regeneratingId, setRegeneratingId] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    fetchInvoiceList();
  }, [search, statusFilter, page]);

  const fetchInvoiceList = async () => {
    setLoading(true);
    const res = await listInvoices({ search, status: statusFilter, page, limit: 20 });
    if (res.success) {
      setInvoices(res.data);
      setTotalCount(res.total);

      // Compute KPI stats
      const total = res.total;
      const paid = res.data.filter(i => i.status === 'paid').length;
      const pending = res.data.filter(i => i.status === 'issued' || i.status === 'pending').length;
      const todayStr = new Date().toISOString().split('T')[0];
      const today = res.data.filter(i => (i.created_at || '').startsWith(todayStr)).length;

      setStats({ total, paid, pending, today });
    }
    setLoading(false);
  };

  const handleRegenerateInvoice = async (orderId) => {
    setRegeneratingId(orderId);
    setActionMessage('');

    try {
      const res = await generateInvoiceForOrder(orderId);
      if (res.success) {
        setActionMessage(`Invoice ${res.invoice.invoice_number} synchronized successfully.`);
        fetchInvoiceList();
      } else {
        setActionMessage(`Failed to regenerate invoice: ${res.error}`);
      }
    } catch (err) {
      setActionMessage(`Error: ${err.message}`);
    } finally {
      setRegeneratingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
            <FileText className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Invoice Management Console</h1>
            <p className="text-slate-400 text-sm">Monitor, generate, and review customer tax invoices</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Invoices</span>
            <FileText className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-3xl font-extrabold text-white">{stats.total}</p>
          <span className="text-xs text-slate-500 mt-1 block">Lifetime tax records</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Paid Invoices</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">{stats.paid}</p>
          <span className="text-xs text-slate-500 mt-1 block">Cleared payments</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Pending Invoices</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400">{stats.pending}</p>
          <span className="text-xs text-slate-500 mt-1 block">Issued / Awaiting payment</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Today's Invoices</span>
            <Printer className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-extrabold text-blue-400">{stats.today}</p>
          <span className="text-xs text-slate-500 mt-1 block">Generated today</span>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div className="mb-6 p-4 bg-slate-900 border border-amber-500/30 rounded-xl text-amber-300 text-sm flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage('')} className="text-xs text-slate-400 hover:text-white">Dismiss</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Invoice #, Order # or Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-500 transition font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="issued">Issued / Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-xs border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Order Ref</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4 text-right">Grand Total</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading invoice registry...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No invoices match your filter criteria.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => {
                  const orderNum = inv.orders?.order_number || 'N/A';
                  return (
                    <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-4 px-4 font-bold text-amber-400 font-mono">
                        {inv.invoice_number}
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-300">
                        {orderNum}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-white">{inv.billing_name}</div>
                        <div className="text-xs text-slate-400">{inv.billing_phone}</div>
                      </td>
                      <td className="py-4 px-4 text-right font-extrabold text-white">
                        ₹{Number(inv.grand_total).toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide inline-flex items-center gap-1 ${
                          inv.status === 'paid'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {inv.status === 'paid' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-400 text-xs">
                        {new Date(inv.generated_at || inv.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <button
                          onClick={() => window.open(`/account/orders/${orderNum}/invoice`, '_blank')}
                          className="inline-flex items-center px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition cursor-pointer"
                          title="View / Download Invoice"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" /> View
                        </button>
                        <button
                          onClick={() => handleRegenerateInvoice(inv.order_id)}
                          disabled={regeneratingId === inv.order_id}
                          className="inline-flex items-center px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold rounded-lg transition disabled:opacity-50"
                          title="Sync invoice with order"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 mr-1 ${regeneratingId === inv.order_id ? 'animate-spin' : ''}`} /> Sync
                        </button>
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
