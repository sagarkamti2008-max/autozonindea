import React, { useState, useEffect } from 'react';
import { Bell, ShieldAlert, CheckCircle, Eye, RefreshCw, AlertTriangle, Info } from 'lucide-react';
import { fetchAdminAlerts, updateAlertStatus } from '../services/adminAnalyticsEngine';

export default function AdminAlertCenterView() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminAlerts(statusFilter);
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [statusFilter]);

  const handleStatusChange = async (alertId, newStatus) => {
    try {
      await updateAlertStatus(alertId, newStatus);
      loadAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="text-amber-500" /> Admin Dashboard Alert Center
          </h1>
          <p className="text-slate-400 text-sm">
            Critical system alerts, inventory exceptions, failed payments, and pending reviews
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'unread', 'read', 'resolved'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition ${
                statusFilter === st ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <RefreshCw className="animate-spin mx-auto text-amber-500 mb-2" size={28} />
          <p className="text-sm">Fetching system alerts...</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl">
          <CheckCircle size={48} className="mx-auto mb-3 text-emerald-500 opacity-80" />
          <p className="text-base font-semibold text-slate-300">All quiet! No alerts found for this filter.</p>
          <p className="text-xs text-slate-500 mt-1">System operations are running smoothly.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => {
            const isCritical = alert.priority === 'critical';
            const isHigh = alert.priority === 'high';
            const isMedium = alert.priority === 'medium';

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                  isCritical ? 'bg-red-950/30 border-red-800/80 text-red-200' :
                  isHigh ? 'bg-amber-950/20 border-amber-800/60 text-amber-200' :
                  isMedium ? 'bg-slate-900 border-slate-800 text-slate-200' :
                  'bg-slate-950 border-slate-800/80 text-slate-400'
                }`}
              >
                <div className="flex items-start gap-3">
                  {isCritical || isHigh ? (
                    <AlertTriangle className={isCritical ? 'text-red-500 mt-0.5' : 'text-amber-500 mt-0.5'} size={20} />
                  ) : (
                    <Info className="text-blue-400 mt-0.5" size={20} />
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        isCritical ? 'bg-red-600 text-white' :
                        isHigh ? 'bg-amber-500 text-slate-950' :
                        isMedium ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {alert.priority}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {alert.type}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-white mt-1">{alert.message}</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {new Date(alert.created_at).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {alert.status === 'unread' && (
                    <button
                      onClick={() => handleStatusChange(alert.id, 'read')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
                    >
                      Mark Read
                    </button>
                  )}
                  {alert.status !== 'resolved' && (
                    <button
                      onClick={() => handleStatusChange(alert.id, 'resolved')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
