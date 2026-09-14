import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MASTER_BRANDS_DATA } from '../data/brandMasterData';
import { Tag, Search, Star, ExternalLink, ChevronRight, ShieldCheck } from 'lucide-react';

export const BrandsMasterView = () => {
  const { navigateTo, setSelectedBrand } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState('all');

  const featuredBrands = MASTER_BRANDS_DATA.filter(b => b.featured && b.status);

  const filteredBrands = MASTER_BRANDS_DATA.filter(b => {
    if (!b.status) return false;
    if (selectedCountryFilter !== 'all' && (b.country || '').toLowerCase() !== selectedCountryFilter.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = b.name.toLowerCase().includes(q);
      const matchCountry = (b.country || '').toLowerCase().includes(q);
      if (!matchName && !matchCountry) return false;
    }
    return true;
  });

  const uniqueCountries = Array.from(new Set(MASTER_BRANDS_DATA.map(b => b.country).filter(Boolean)));

  const handleSelectBrand = (slug) => {
    setSelectedBrand(slug);
    navigateTo('brand');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 selection:bg-neon-orange selection:text-white">
      
      {/* Banner Header */}
      <div className="bg-slate-900 border-b border-slate-800 py-10 px-4 sm:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="bg-neon-orange/20 text-neon-orange font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider border border-neon-orange/30">
            Official Brand Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Genuine Automotive OEM & OES Brands</h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
            Sourced directly from authorized manufacturers including BOSCH, Valeo, UNO MINDA, Lucas TVS, Gabriel, Castrol, Exide, and Brembo with guaranteed fitment.
          </p>

          {/* Search Bar & Country Filter */}
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 pt-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search brand name (e.g., Bosch, Valeo, Brembo)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-orange"
              />
            </div>

            <select
              value={selectedCountryFilter}
              onChange={(e) => setSelectedCountryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-neon-orange shrink-0"
            >
              <option value="all">All Countries ({uniqueCountries.length})</option>
              {uniqueCountries.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        
        {/* Featured Brands Banner Section */}
        {searchQuery === '' && selectedCountryFilter === 'all' && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-current" />
              <span>Featured OEM Manufacturers</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {featuredBrands.map((b, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectBrand(b.slug)}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-4 rounded-2xl flex flex-col items-center text-center justify-center gap-2.5 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 p-2 flex items-center justify-center group-hover:scale-105 transition">
                    {b.logo_url ? (
                      <img src={b.logo_url} alt={b.name} className="max-h-full max-w-full object-contain" />
                    ) : <span className="text-2xl">{b.logo_text || '🏷️'}</span>}
                  </div>
                  <div className="font-extrabold text-white text-xs group-hover:text-amber-400 transition">{b.name}</div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {b.country}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Brands List */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-neon-orange" />
            <span>All Active Brands ({filteredBrands.length})</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBrands.map((b, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 hover:border-neon-orange/40 p-5 rounded-2xl flex flex-col justify-between space-y-3 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {b.type || 'OEM Supplier'} • {b.country}
                    </span>
                    {b.featured && (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 p-2 flex items-center justify-center shrink-0">
                      {b.logo_url ? (
                        <img src={b.logo_url} alt={b.name} className="max-h-full max-w-full object-contain" />
                      ) : <span className="text-xl">{b.logo_text || '🏷️'}</span>}
                    </div>

                    <div>
                      <h3
                        onClick={() => handleSelectBrand(b.slug)}
                        className="font-extrabold text-white text-base hover:text-neon-orange cursor-pointer transition"
                      >
                        {b.name}
                      </h3>
                      <div className="text-[10px] text-slate-500 font-mono">/{b.slug}</div>
                    </div>
                  </div>

                  <p className="text-slate-400 text-xs mt-3 line-clamp-2">{b.description}</p>
                </div>

                <button
                  onClick={() => handleSelectBrand(b.slug)}
                  className="w-full mt-2 bg-slate-950 hover:bg-neon-orange text-slate-300 hover:text-white font-extrabold text-xs py-2.5 rounded-xl border border-slate-800 hover:border-neon-orange transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Explore {b.name} Products</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
