import React from 'react';
import { BACKGROUND_JOBS_REGISTRY } from '../services/aiAutomationEngine';
import { Activity, Clock, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export const AdminJobMonitor = () => {
  return (
    <div className="container admin-dashboard-wrapper">
      <div className="admin-header">
        <Activity size={32} color="#10B981" />
        <div>
          <h2>Background Jobs & Anomaly Monitor (`/admin/jobs`)</h2>
          <p>Scheduled background crons for sitemap generation, SEO audits, inventory alerts & 08:00 AM Morning Check</p>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="admin-pane-card">
        <h3>Active Background Cron Jobs</h3>
        <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Job Name</th>
                <th>Schedule</th>
                <th>Last Run</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {BACKGROUND_JOBS_REGISTRY.map(j => (
                <tr key={j.id}>
                  <td><code>{j.id}</code></td>
                  <td><b>{j.name}</b></td>
                  <td>{j.schedule}</td>
                  <td>{j.lastRun}</td>
                  <td><span className="verified-tag good">{j.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
