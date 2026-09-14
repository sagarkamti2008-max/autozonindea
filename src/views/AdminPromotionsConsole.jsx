import React, { useState, useEffect } from 'react';
import { getPromotionalBannersDB } from '../services/pricingDiscountEngine';
import { Layers, Image, Plus, CheckCircle, Clock, Trash2, Edit } from 'lucide-react';

export default function AdminPromotionsConsole() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    setLoading(true);
    const data = await getPromotionalBannersDB();
    setBanners(data);
    setLoading(false);
  };

  return (
    <div className="container py-8 max-w-6xl">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Promotions & Offer Banners</h1>
          <p className="text-muted-foreground text-sm">
            Manage promotional hero banners, flash sale offers, and campaign graphics for the homepage
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Loading promotional banners...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((b) => (
            <div key={b.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
              <div>
                <div className="relative aspect-video bg-muted">
                  <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm">
                    {b.status.toUpperCase()}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-base mb-1">{b.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{b.subtitle}</p>

                  <div className="text-xs text-muted-foreground border-t border-border pt-2 flex justify-between">
                    <span>Valid until: {b.expires_at ? new Date(b.expires_at).toLocaleDateString('en-IN') : 'Ongoing'}</span>
                    <span>Link: {b.button_link}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
