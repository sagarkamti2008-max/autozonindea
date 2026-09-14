import React from 'react';
import { useStore } from '../context/StoreContext';
import { MASTER_BRANDS_DATA, generateBrandSEO } from '../data/brandMasterData';
import {
  ArrowLeft, Star, ShoppingCart, ArrowRightLeft, ShieldCheck, ExternalLink,
  ChevronRight, Car, Globe, Tag
} from 'lucide-react';

export const BrandView = () => {
  const { selectedBrand, activeSlug, products, navigateTo, addToCart, toggleCompare, selectedVehicle } = useStore();

  const brandSlug = selectedBrand || activeSlug || 'bosch';
  const brandObj = MASTER_BRANDS_DATA.find(b => 
    b.slug.toLowerCase() === brandSlug.toLowerCase() || 
    b.id === brandSlug || 
    b.name.toLowerCase() === brandSlug.toLowerCase()
  ) || MASTER_BRANDS_DATA[0];

  // Dynamic SEO Metadata
  const seo = generateBrandSEO(brandObj.name);

  // Filter products by brand_id or brand name
  let brandProducts = products.filter(p => {
    const matchBrand = p.brand_id === brandObj.id || (p.brand && p.brand.toLowerCase().includes(brandObj.name.toLowerCase()));
    if (!matchBrand) return false;

    // Vehicle compatibility filter if active
    if (selectedVehicle && p.compatibleVehicles) {
      const vMatch = p.compatibleVehicles.some(v => 
        v.toLowerCase().includes(selectedVehicle.make.toLowerCase()) || 
        v.toLowerCase().includes(selectedVehicle.model.toLowerCase())
      );
      if (!vMatch && !p.isUniversal) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 selection:bg-neon-orange selection:text-white">
      
      {/* Breadcrumb & Header */}
      <div className="bg-slate-900 border-b border-slate-800 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
            <span onClick={() => navigateTo('home')} className="hover:text-neon-orange cursor-pointer transition">Home</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span onClick={() => navigateTo('brands')} className="hover:text-neon-orange cursor-pointer transition">All Brands</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold">{brandObj.name}</span>
          </div>

          {/* Brand Profile Header Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
            
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 p-3 flex items-center justify-center shrink-0">
                {brandObj.logo_url ? (
                  <img src={brandObj.logo_url} alt={brandObj.name} className="max-h-full max-w-full object-contain" />
                ) : <span className="text-3xl font-black text-amber-400">{brandObj.logo_text || brandObj.name.charAt(0)}</span>}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                    {brandObj.type || 'OEM Supplier'} • {brandObj.country || 'Global'}
                  </span>
                  {brandObj.featured && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      ⭐ Featured
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">{brandObj.name}</h1>
                <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">{brandObj.description}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
              {brandObj.website_url && (
                <a
                  href={brandObj.website_url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-xs px-4 py-2.5 rounded-xl border border-slate-800 transition flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" /> Official Website <ExternalLink className="w-3 h-3" />
                </a>
              )}

              <div className="bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-xs font-extrabold text-white">
                {brandProducts.length} Items Listed
              </div>
            </div>

          </div>

          {selectedVehicle && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-bold w-fit">
              <Car className="w-4 h-4" />
              <span>Filtering {brandObj.name} parts for {selectedVehicle.make} {selectedVehicle.model}</span>
            </div>
          )}

        </div>
      </div>

      {/* Brand Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {brandProducts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <Tag className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-black text-white">No products currently listed for {brandObj.name}</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Our inventory team is continuously adding OEM parts. Try browsing our full catalog.
            </p>
            <button
              onClick={() => navigateTo('catalog')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
            >
              Explore Full Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {brandProducts.map((product) => (
              <div
                key={product.id}
                className="bg-slate-900 border border-slate-800 hover:border-neon-orange/40 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl group"
              >
                <div>
                  <div className="relative h-44 bg-slate-950 rounded-xl overflow-hidden mb-3 flex items-center justify-center p-3">
                    <img
                      src={product.image || product.image_url}
                      alt={product.title || product.name}
                      className="max-h-full object-contain group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-2 right-2 bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 uppercase">
                      {product.classification || 'OEM'}
                    </span>
                  </div>

                  <div className="text-[11px] font-bold text-slate-400">{product.brand || brandObj.name}</div>
                  <h4
                    onClick={() => navigateTo('product-detail', product.id)}
                    className="font-extrabold text-white text-xs mt-0.5 line-clamp-2 hover:text-neon-orange cursor-pointer transition"
                  >
                    {product.title || product.name}
                  </h4>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="text-base font-black text-white">₹{product.price.toLocaleString('en-IN')}</div>
                    {product.mrp && <div className="text-[11px] text-slate-500 line-through">₹{product.mrp.toLocaleString('en-IN')}</div>}
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="bg-gradient-to-r from-neon-orange to-amber-500 hover:from-amber-500 hover:to-neon-orange text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-neon-orange/20 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* SEO Metadata Footer Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3 mt-12">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>{seo.seo_title}</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {seo.seo_description} All {brandObj.name} spare parts sold on AutoZoneIndia are sourced directly from authorized factory distributors and include a 7-day fitment guarantee.
          </p>
        </div>

      </div>
    </div>
  );
};
