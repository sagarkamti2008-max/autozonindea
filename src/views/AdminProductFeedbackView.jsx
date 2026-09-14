import React, { useState, useEffect } from 'react';
import { getProductFeedbackInsights } from '../services/engagementService';
import { MessageSquare, HelpCircle, Star, AlertCircle, Search, Filter } from 'lucide-react';

export default function AdminProductFeedbackView() {
  const [productId, setProductId] = useState('prod-ceramic-brake-pads');
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productId) {
      loadInsights();
    }
  }, [productId]);

  const loadInsights = async () => {
    setLoading(true);
    const res = await getProductFeedbackInsights(productId);
    setInsights(res);
    setLoading(false);
  };

  return (
    <div className="container py-8 max-w-7xl">
      <div className="pb-6 mb-6 border-b border-border">
        <h1 className="text-3xl font-bold tracking-tight">Per-Product Feedback & Q&A Summary</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Inspect customer reviews, unanswered questions, and reported content for any specific spare part SKU
        </p>
      </div>

      {/* Product SKU Selector */}
      <div className="flex items-center space-x-3 mb-6 bg-card border border-border p-4 rounded-2xl">
        <Search className="w-4 h-4 text-muted-foreground" />
        <label className="text-xs font-bold uppercase text-muted-foreground">Select Product ID:</label>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="px-3 py-1.5 border border-border rounded-xl bg-background text-sm font-bold flex-1"
        >
          <option value="prod-ceramic-brake-pads">Ceramic High-Performance Front Brake Pad Kit (AZI-BRK-994201)</option>
          <option value="prod-oil-01">Fully Synthetic Engine Oil 5W-30 (AZI-OIL-1001)</option>
          <option value="prod-spark-01">Iridium Power Spark Plugs (AZI-SPK-3001)</option>
        </select>
      </div>

      {loading || !insights ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Loading product feedback insights...</div>
      ) : (
        <div className="space-y-6">
          {/* Summary KPI Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border p-4 rounded-2xl">
              <div className="text-xs font-bold uppercase text-muted-foreground mb-1">Total Reviews</div>
              <div className="text-2xl font-black">{insights.reviewCount}</div>
            </div>

            <div className="bg-card border border-border p-4 rounded-2xl">
              <div className="text-xs font-bold uppercase text-amber-600 mb-1">Average Rating</div>
              <div className="text-2xl font-black text-amber-600">{insights.averageRating} / 5.0</div>
            </div>

            <div className="bg-card border border-border p-4 rounded-2xl">
              <div className="text-xs font-bold uppercase text-primary mb-1">Unanswered Questions</div>
              <div className="text-2xl font-black text-primary">{insights.unansweredQuestionsCount}</div>
            </div>

            <div className="bg-card border border-border p-4 rounded-2xl">
              <div className="text-xs font-bold uppercase text-rose-600 mb-1">Reported Content</div>
              <div className="text-2xl font-black text-rose-600">{insights.reportedReviewsCount}</div>
            </div>
          </div>

          {/* Reviews & Questions Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Reviews Column */}
            <div className="lg:col-span-6 bg-card border border-border p-5 rounded-2xl">
              <h2 className="text-lg font-bold mb-3 flex items-center space-x-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>Customer Reviews ({insights.reviews.length})</span>
              </h2>

              {insights.reviews.length === 0 ? (
                <div className="text-xs text-muted-foreground py-6 text-center">No reviews for this product yet.</div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {insights.reviews.map((r) => (
                    <div key={r.id} className="p-3 border border-border rounded-xl bg-muted/20">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'fill-amber-400' : 'text-muted-foreground/30'}`} />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground">{r.status?.toUpperCase()}</span>
                      </div>
                      <div className="font-bold text-xs">{r.title}</div>
                      <p className="text-xs text-muted-foreground">"{r.review_text || r.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Questions Column */}
            <div className="lg:col-span-6 bg-card border border-border p-5 rounded-2xl">
              <h2 className="text-lg font-bold mb-3 flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                <span>Product Questions ({insights.questions.length})</span>
              </h2>

              {insights.questions.length === 0 ? (
                <div className="text-xs text-muted-foreground py-6 text-center">No questions submitted for this product.</div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {insights.questions.map((q) => (
                    <div key={q.id} className="p-3 border border-border rounded-xl bg-muted/20 space-y-1">
                      <div className="font-bold text-xs text-foreground">Q: {q.question}</div>
                      <div className="text-[11px] text-muted-foreground">Asked by {q.customer_name}</div>
                      {q.answer ? (
                        <div className="text-xs bg-emerald-50 text-emerald-950 p-2 rounded-lg border border-emerald-200">
                          Answer: {q.answer}
                        </div>
                      ) : (
                        <div className="text-[11px] text-amber-700 font-bold">Unanswered</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
