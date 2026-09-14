import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, FileText, Search, User } from 'lucide-react';
import { fetchAdminAuditLogs } from '../services/adminAnalyticsEngine';

export default function AdminActivityLogView() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminAuditLogs(150);
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter(l => 
    l.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.admin_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.entity_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-amber-500" /> Admin Audit Logs & Activity Trail
          </h1>
          <p className="text-slate-400 text-sm">
            Immutable log of administrative actions, stock edits, price updates, and permission changes
          </p>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Filter audit logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-white pl-9 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-amber-500 w-64"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <RefreshCw className="animate-spin mx-auto text-amber-500 mb-2" size={28} />
          <p className="text-sm">Fetching security audit logs...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl">
          <FileText size={48} className="mx-auto mb-3 text-slate-600 opacity-60" />
          <p className="text-base font-semibold text-slate-400">No activity log records found.</p>
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 text-xs uppercase border-b border-slate-800">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Admin Email</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Entity</th>
                  <th className="p-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 text-slate-400">
                      {new Date(log.created_at).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-amber-400 font-semibold flex items-center gap-1.5">
                      <User size={13} className="text-slate-500" />
                      {log.admin_email || 'system'}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold uppercase text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">
                      {log.entity_type} {log.entity_id ? `(#${log.entity_id})` : ''}
                    </td>
                    <td className="p-4 text-slate-200 font-sans">{log.description}</td>
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
