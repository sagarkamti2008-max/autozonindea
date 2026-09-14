import React, { useState, useEffect } from 'react';
import { getAdminReviewAnalytics } from '../services/engagementService';
import { BarChart2, Star, CheckCircle, AlertTriangle, ShieldAlert, Award, TrendingUp, MessageSquare, ArrowLeft } from 'lucide-react';

export default function AdminReviewAnalyticsView({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    const data = await getAdminReviewAnalytics();
    setStats(data);
    setLoading(false);
  };

  return (
    <div className="container py-8 max-w-7xl">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review & Rating Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time breakdown of product reviews, verified purchase ratios, star rating distribution, and moderation reports
          </p>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('admin-reviews')}
            className="px-4 py-2 border border-border rounded-xl text-xs font-bold hover:bg-muted flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Moderation</span>
          </button>
        )}
      </div>

      {loading || !stats ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Loading review analytics...</div>
      ) : (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border p-5 rounded-2xl">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Total Reviews</div>
              <div className="text-3xl font-black text-foreground">{stats.totalReviews}</div>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">Approved & Live</div>
              <div className="text-3xl font-black text-emerald-600">{stats.approvedCount}</div>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">Pending Approval</div>
              <div className="text-3xl font-black text-amber-600">{stats.pendingCount}</div>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl">
              <div className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">Verified Purchases</div>
              <div className="text-3xl font-black text-purple-600">{stats.verifiedPercentage}%</div>
            </div>
          </div>

          {/* Histogram & Rating Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 bg-card border border-border p-6 rounded-2xl">
              <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>Overall Average Rating: {stats.avgRating} / 5.0</span>
              </h2>

              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.starCounts[star] || 0;
                  const pct = stats.approvedCount > 0 ? (count / stats.approvedCount) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center space-x-3 text-xs">
                      <span className="w-14 font-bold text-muted-foreground">{star} Stars</span>
                      <div className="flex-1 h-3.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-12 text-right font-mono font-bold text-foreground">
                        {count} ({Math.round(pct)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Moderation Health Breakdown */}
            <div className="lg:col-span-6 bg-card border border-border p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  <span>Moderation & Safety Health</span>
                </h2>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center p-3 bg-muted/40 rounded-xl">
                    <span className="font-semibold text-muted-foreground">Rejected Reviews:</span>
                    <span className="font-bold text-rose-600">{stats.rejectedCount}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted/40 rounded-xl">
                    <span className="font-semibold text-muted-foreground">Hidden Reviews:</span>
                    <span className="font-bold text-foreground">{stats.hiddenCount || 0}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted/40 rounded-xl">
                    <span className="font-semibold text-muted-foreground">Active Customer Abuse Reports:</span>
                    <span className="font-bold text-amber-600">{stats.reportedCount || 0}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border text-xs text-muted-foreground">
                ✓ AutoZoneIndia enforced 100% verified customer review authentication.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
