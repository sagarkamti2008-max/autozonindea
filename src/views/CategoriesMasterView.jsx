import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MASTER_CATEGORIES_DATA } from '../data/categoryMasterData';
import { Layers, Search, ChevronRight, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const CategoriesMasterView = () => {
  const { navigateTo, setSelectedCategory } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = MASTER_CATEGORIES_DATA.filter(cat => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchName = cat.name.toLowerCase().includes(q);
    const matchSub = cat.subcategories.some(s => s.name.toLowerCase().includes(q));
    return matchName || matchSub;
  });

  const handleSelectCategory = (slug) => {
    setSelectedCategory(slug);
    navigateTo('category');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 selection:bg-neon-orange selection:text-white">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border-b border-slate-800 py-10 px-4 sm:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="bg-neon-orange/20 text-neon-orange font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider border border-neon-orange/30">
            Catalog Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">All Car Parts Categories & Subcategories</h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
            Explore genuine OEM & OES spare parts across 25 master categories and 150+ subcategories for Maruti Suzuki, Hyundai, Tata, Mahindra, Toyota, and Honda.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative pt-3">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search category or part (e.g., Brake Pad, Timing Belt, AC Compressor)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-orange"
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 hover:border-neon-orange/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-neon-orange/10 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                    {cat.icon}
                  </div>
                  <span className="text-[10px] font-extrabold bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full uppercase">
                    {cat.subcategories.length} Subcategories
                  </span>
                </div>

                <h3
                  onClick={() => handleSelectCategory(cat.slug)}
                  className="text-lg font-extrabold text-white group-hover:text-neon-orange transition cursor-pointer flex items-center justify-between"
                >
                  <span>{cat.name}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition -translate-x-2 group-hover:translate-x-0" />
                </h3>

                <p className="text-slate-400 text-xs mt-1.5 line-clamp-2">{cat.description}</p>

                {/* Subcategory Pills Preview */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {cat.subcategories.slice(0, 5).map((sub, sIdx) => (
                    <span
                      key={sIdx}
                      onClick={() => handleSelectCategory(sub.slug)}
                      className="text-[10px] font-semibold bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-neon-orange px-2.5 py-1 rounded-lg border border-slate-800 transition cursor-pointer"
                    >
                      {sub.name}
                    </span>
                  ))}
                  {cat.subcategories.length > 5 && (
                    <span
                      onClick={() => handleSelectCategory(cat.slug)}
                      className="text-[10px] font-bold text-neon-orange px-1.5 py-1 cursor-pointer"
                    >
                      +{cat.subcategories.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleSelectCategory(cat.slug)}
                className="w-full mt-6 bg-slate-950 hover:bg-neon-orange text-slate-300 hover:text-white font-extrabold text-xs py-2.5 rounded-xl border border-slate-800 hover:border-neon-orange transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Browse {cat.name}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
