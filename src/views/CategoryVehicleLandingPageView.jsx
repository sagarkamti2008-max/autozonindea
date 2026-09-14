import React, { useState, useEffect } from 'react';
import { cmsSeoService } from '../services/cmsSeoService';
import { generateBreadcrumbJSONLD } from '../services/seoEngine';
import { CheckCircle2, ChevronRight, ShoppingBag, Shield, AlertCircle, Search } from 'lucide-react';

export const CategoryVehicleLandingPageView = ({ categorySlug, vehicleSlug }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const res = await cmsSeoService.getCategoryVehicleLandingData(categorySlug, vehicleSlug);
      setData(res);
      setLoading(false);
    };
    if (categorySlug && vehicleSlug) loadData();
  }, [categorySlug, vehicleSlug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-slate-950 text-white flex items-center justify-center p-8">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-400 font-medium">Validating category & vehicle compatibility data...</span>
        </div>
      </div>
    );
  }

  const { category, vehicle, verifiedProducts, availableBrands } = data || {};

  if (!category || !vehicle) {
    return (
      <div className="min-h-[60vh] bg-slate-950 text-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center text-3xl mb-4 border border-red-500/20">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Invalid Landing Page Request</h1>
        <p className="text-slate-400 max-w-md mb-6">The requested category or vehicle record was not found in our database.</p>
        <a href="/" className="px-6 py-2.5 bg-emerald-500 text-slate-950 font-semibold rounded-lg hover:bg-emerald-400 transition-colors">
          Return to Marketplace
        </a>
      </div>
    );
  }

  const vehicleName = `${vehicle.make} ${vehicle.model} ${vehicle.variant ? `(${vehicle.variant})` : ''}`;
  const pageTitle = `${category.name} for ${vehicleName}`;

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: category.name, url: `/category/${category.slug || category.id}` },
    { name: vehicleName, url: `/parts-for/${vehicle.slug || vehicle.id}` },
    { name: `${category.name} Parts`, url: `/car-parts/${category.slug}/${vehicle.slug}` }
  ];

  const breadcrumbJsonLd = generateBreadcrumbJSONLD(breadcrumbs);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {breadcrumbJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />}

      <div className="bg-slate-900 border-b border-slate-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4 overflow-x-auto pb-1 no-scrollbar">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight size={14} className="text-slate-600 flex-shrink-0" />}
                <span className={`whitespace-nowrap ${idx === breadcrumbs.length - 1 ? 'text-emerald-400 font-medium' : 'hover:text-slate-200'}`}>
                  {b.name}
                </span>
              </React.Fragment>
            ))}
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Verified Strict Technical Match
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
                {pageTitle}
              </h1>
              <p className="text-slate-400 text-sm max-w-2xl">
                Browse genuine {category.name} components specifically built and verified to fit your {vehicleName}.
              </p>
            </div>

            {availableBrands.length > 0 && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 md:w-64">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-2">Available Brands</span>
                <div className="flex flex-wrap gap-1.5">
                  {availableBrands.map((b, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded font-medium">
                      {b.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {verifiedProducts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center max-w-xl mx-auto">
            <div className="w-14 h-14 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              <Search size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-2">No Verified Products Currently Listed</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
              We could not find any active products in our database that explicitly match {category.name} for {vehicleName}. AutoZoneIndia never displays unverified or approximate matches.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="/enquiry"
                className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-emerald-400 transition-colors"
              >
                Submit Custom Parts Quotation Request
              </a>
              <a
                href={`/parts-for/${vehicle.slug || vehicle.id}`}
                className="px-5 py-2.5 bg-slate-800 text-slate-200 font-semibold text-xs rounded-lg hover:bg-slate-700 transition-colors"
              >
                View All Parts for {vehicle.model}
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-400">
                Showing <strong className="text-emerald-400">{verifiedProducts.length}</strong> verified compatible product(s)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {verifiedProducts.map((p) => (
                <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 transition-all group">
                  <div>
                    <div className="h-44 bg-slate-950 p-4 flex items-center justify-center relative">
                      {p.image ? (
                        <img src={p.image} alt={p.name || p.title} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="text-xs text-slate-600">No Image</span>
                      )}
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold rounded">
                        100% Fit
                      </span>
                    </div>

                    <div className="p-4">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block mb-1">
                        {p.brand_rel?.name || p.brand || 'Genuine OEM'}
                      </span>
                      <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-2 mb-2">
                        {p.name || p.title}
                      </h3>
                      {p.part_number && <p className="text-[11px] text-slate-500 font-mono mb-2">PN: {p.part_number}</p>}
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-800/60 mt-2 flex items-center justify-between">
                    <span className="text-base font-extrabold text-slate-100">₹{p.price}</span>
                    <a
                      href={`/product/${p.slug || p.id}`}
                      className="px-3.5 py-1.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors"
                    >
                      Buy Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
