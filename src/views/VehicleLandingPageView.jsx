import React, { useState, useEffect } from 'react';
import { cmsSeoService } from '../services/cmsSeoService';
import { generateBreadcrumbJSONLD } from '../services/seoEngine';
import { Truck, Layers, CheckCircle2, ChevronRight, ShoppingBag, ArrowRight, Shield, AlertTriangle } from 'lucide-react';

export const VehicleLandingPageView = ({ vehicleSlug }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const res = await cmsSeoService.getVehicleLandingData(vehicleSlug);
      setData(res);
      setLoading(false);
    };
    if (vehicleSlug) loadData();
  }, [vehicleSlug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-slate-950 text-white flex items-center justify-center p-8">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-400 font-medium">Verifying vehicle compatibility database...</span>
        </div>
      </div>
    );
  }

  const { vehicle, compatibleProducts, compatibleCategories, availableBrands, relatedArticles } = data || {};

  if (!vehicle) {
    return (
      <div className="min-h-[60vh] bg-slate-950 text-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center text-3xl mb-4 border border-red-500/20">
          <AlertTriangle size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Vehicle Not Found</h1>
        <p className="text-slate-400 max-w-md mb-6">The requested vehicle record does not exist in our master database.</p>
        <a href="/" className="px-6 py-2.5 bg-emerald-500 text-slate-950 font-semibold rounded-lg hover:bg-emerald-400 transition-colors">
          Browse All Vehicles
        </a>
      </div>
    );
  }

  const vehicleName = `${vehicle.make} ${vehicle.model} ${vehicle.variant ? `(${vehicle.variant})` : ''}`;

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Vehicle Master', url: '#' },
    { name: vehicleName, url: `/parts-for/${vehicle.slug || vehicle.id}` }
  ];

  const breadcrumbJsonLd = generateBreadcrumbJSONLD(breadcrumbs);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {breadcrumbJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />}

      <div className="bg-slate-900 border-b border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight size={14} className="text-slate-600" />}
                <span className={idx === breadcrumbs.length - 1 ? 'text-emerald-400 font-medium' : 'hover:text-slate-200'}>
                  {b.name}
                </span>
              </React.Fragment>
            ))}
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> 100% Verified Fitment Guaranteed
                </span>
                {vehicle.year_start && (
                  <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-medium rounded-full">
                    {vehicle.year_start} - {vehicle.year_end || 'Present'}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
                Spare Parts & Accessories for {vehicleName}
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
                Explore genuine OEM brake pads, filters, electricals, suspension, and engine components explicitly verified for {vehicleName}.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 md:w-80 flex-shrink-0">
              <div className="flex items-center gap-3 text-xs text-slate-300 mb-2">
                <Shield size={18} className="text-emerald-400" />
                <span className="font-semibold">AutoZoneFitment™ Engine</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Compatibility sourced strictly from verified technical databases. No approximate matching used.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {compatibleCategories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
              <Layers size={20} className="text-emerald-400" />
              Verified Compatible Categories
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {compatibleCategories.map((cat) => (
                <a
                  key={cat.id}
                  href={`/car-parts/${cat.slug || cat.id}/${vehicle.slug || vehicle.id}`}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all group flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">Verified Parts Available</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <ShoppingBag size={20} className="text-emerald-400" />
              Verified Spare Parts ({compatibleProducts.length})
            </h2>
          </div>

          {compatibleProducts.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
              <p className="text-slate-400 text-sm mb-4">No verified parts listed yet for this specific vehicle model.</p>
              <a href="/enquiry" className="px-4 py-2 bg-emerald-500 text-slate-950 font-semibold text-xs rounded-lg inline-block">
                Submit Parts Enquiry for {vehicleName}
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {compatibleProducts.map((p) => (
                <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all">
                  <div>
                    <div className="h-44 bg-slate-950 p-4 flex items-center justify-center">
                      {p.image ? (
                        <img src={p.image} alt={p.name || p.title} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="text-xs text-slate-600">No Image</span>
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400 block mb-1">
                        {p.brand_rel?.name || p.brand || 'Genuine OEM'}
                      </span>
                      <h3 className="text-sm font-bold text-slate-100 line-clamp-2 mb-2">{p.name || p.title}</h3>
                      {p.part_number && <p className="text-[11px] text-slate-500 font-mono mb-2">PN: {p.part_number}</p>}
                    </div>
                  </div>
                  <div className="p-4 pt-0 border-t border-slate-800/60 mt-2 flex items-center justify-between">
                    <span className="text-base font-extrabold text-slate-100">₹{p.price}</span>
                    <a
                      href={`/product/${p.slug || p.id}`}
                      className="px-3 py-1.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors"
                    >
                      Buy Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {relatedArticles.length > 0 && (
          <div className="border-t border-slate-800 pt-10">
            <h2 className="text-lg font-bold text-slate-100 mb-6">Maintenance Guides for {vehicle.make}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((art) => (
                <a
                  key={art.id}
                  href={`/blog/${art.slug}`}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/50 transition-colors"
                >
                  <h3 className="text-sm font-bold text-slate-200 mb-2 line-clamp-2">{art.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{art.excerpt}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
