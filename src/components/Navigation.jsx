import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronDown, Menu, ShieldCheck, Wrench, Layers, Shield, Filter, Grid, Sparkles, Package, Truck, Info, PhoneCall } from 'lucide-react';

export const Navigation = () => {
  const { navigateTo, setSelectedCategory } = useStore();
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showExploreMenu, setShowExploreMenu] = useState(false);

  // All 14 distinct categories with custom color badges
  const categoryItems = [
    { id: 'Brake Parts', name: 'Brake Parts', icon: <Shield size={17} className="text-emerald-400" />, sub: 'Pads, Discs, Rotors', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { id: 'Engine Parts', name: 'Engine Parts', icon: <Wrench size={17} className="text-red-400" />, sub: 'Pistons, Gaskets, Belts', bg: 'bg-red-500/10 border-red-500/20' },
    { id: 'Electrical', name: 'Electrical', icon: <Sparkles size={17} className="text-yellow-400" />, sub: 'Alternators, Horns, Relays', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    { id: 'Suspension', name: 'Suspension', icon: <Grid size={17} className="text-indigo-400" />, sub: 'Shockers, Struts, Arms', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { id: 'Body Parts', name: 'Body Parts', icon: <Grid size={17} className="text-purple-400" />, sub: 'Bumpers, Mirrors, Doors', bg: 'bg-purple-500/10 border-purple-500/20' },
    { id: 'Filters', name: 'Filters', icon: <Filter size={17} className="text-cyan-400" />, sub: 'Air, Cabin AC, Oil Filters', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { id: 'AC Parts', name: 'AC Parts', icon: <Sparkles size={17} className="text-sky-400" />, sub: 'Compressors, Condensers', bg: 'bg-sky-500/10 border-sky-500/20' },
    { id: 'Lights', name: 'Lights', icon: <Sparkles size={17} className="text-amber-300" />, sub: 'Headlights, LEDs, Fog Lights', bg: 'bg-amber-500/10 border-amber-500/20' },
    { id: 'Transmission', name: 'Transmission', icon: <Wrench size={17} className="text-orange-400" />, sub: 'Clutch Kits, Flywheels', bg: 'bg-orange-500/10 border-orange-500/20' },
    { id: 'Steering', name: 'Steering', icon: <Grid size={17} className="text-teal-400" />, sub: 'Steering Racks, Pumps', bg: 'bg-teal-500/10 border-teal-500/20' },
    { id: 'Lubricants', name: 'Lubricants', icon: <Layers size={17} className="text-amber-400" />, sub: '5W-30, Brake Fluid, Coolants', bg: 'bg-amber-500/10 border-amber-500/20' },
    { id: 'Car Accessories', name: 'Car Accessories', icon: <Package size={17} className="text-pink-400" />, sub: 'Mobile Holders, 7D Mats', bg: 'bg-pink-500/10 border-pink-500/20' },
    { id: 'Tyres', name: 'Tyres', icon: <Grid size={17} className="text-slate-300" />, sub: 'Tubeless Tyres, Alloys', bg: 'bg-slate-700/20 border-slate-700/30' },
    { id: 'Batteries', name: 'Batteries', icon: <Sparkles size={17} className="text-yellow-300" />, sub: 'Car Batteries, Jump Cables', bg: 'bg-yellow-500/10 border-yellow-500/20' }
  ];

  return (
    <nav className="bg-[#073763] text-white shadow-md relative z-40 font-sans overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
        <div className="flex items-center justify-between h-12 min-w-0">
          
          {/* Left Navigation Links Group */}
          <div className="mobile-nav-scroll no-scrollbar flex items-center gap-6 md:gap-8 h-full min-w-0 overflow-x-auto overflow-y-hidden">
            
            {/* 1. Home Link */}
            <button
              onClick={() => navigateTo('home')}
              className="text-sm font-bold text-slate-200 hover:text-white transition-colors py-3 shrink-0"
            >
              Home
            </button>

            {/* 2. All Categories Dropdown Menu */}
            <div 
              className="relative h-full flex items-center shrink-0"
              onMouseEnter={() => setShowCategoryMenu(true)}
              onMouseLeave={() => setShowCategoryMenu(false)}
            >
              <button 
                onClick={() => { setSelectedCategory('all'); navigateTo('catalog'); }}
                className="flex items-center gap-2 text-sm font-bold text-slate-200 hover:text-white py-3 transition-colors group"
              >
                <Menu className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-200" />
                <span>All Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showCategoryMenu ? 'rotate-180 text-white' : 'text-slate-400'}`} />
              </button>

              {/* Dropdown Menu Container (3-Column Ultra Modern Glassmorphism Mega Menu) */}
              {showCategoryMenu && (
                <div className="absolute top-full left-0 w-[740px] bg-slate-900/98 backdrop-blur-2xl border border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] rounded-3xl overflow-hidden text-slate-100 p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  
                  {/* Header */}
                  <div className="px-2 pb-3 mb-3 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
                      <span className="text-xs font-black uppercase tracking-widest text-white">AUTOMOTIVE PARTS CATEGORIES</span>
                    </div>
                    <span className="text-[11px] font-black text-orange-400 bg-orange-500/15 border border-orange-500/30 px-3 py-1 rounded-full">
                      14 Separate Categories
                    </span>
                  </div>

                  {/* 3-Column Grid without scrollbar */}
                  <div className="grid grid-cols-3 gap-2.5">
                    {categoryItems.map(cat => (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setShowCategoryMenu(false);
                          navigateTo('category');
                        }}
                        className="group flex items-center gap-3 p-2.5 rounded-2xl bg-slate-950/60 hover:bg-slate-800/90 border border-slate-800/60 hover:border-orange-500/50 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                      >
                        <div className={`w-9 h-9 rounded-xl ${cat.bg} border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                          {cat.icon}
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-extrabold text-xs text-slate-100 group-hover:text-orange-400 transition-colors truncate">
                            {cat.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                            {cat.sub}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Bottom Footer Action */}
                  <div 
                    onClick={() => { setSelectedCategory('all'); setShowCategoryMenu(false); navigateTo('catalog'); }}
                    className="mt-4 p-3 text-center bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-2xl cursor-pointer font-black text-xs transition-all shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2 active:scale-98"
                  >
                    <span>Browse Complete 14-Category Automotive Catalog</span>
                    <span className="text-sm">&rarr;</span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Track Order Link */}
            <button
              onClick={() => navigateTo('track-order')}
              className="text-sm font-bold text-slate-200 hover:text-white transition-colors py-3 flex items-center gap-1.5 shrink-0"
            >
              <Truck size={15} className="text-cyan-400" />
              <span>Track Order</span>
            </button>

            {/* 4. About Link */}
            <button
              onClick={() => navigateTo('about')}
              className="text-sm font-bold text-slate-200 hover:text-white transition-colors py-3 shrink-0"
            >
              About
            </button>

            {/* 5. Contact Link */}
            <button
              onClick={() => navigateTo('contact')}
              className="text-sm font-bold text-slate-200 hover:text-white transition-colors py-3 shrink-0"
            >
              Contact
            </button>

            {/* 6. Explore Dropdown */}
            <div 
              className="relative h-full flex items-center shrink-0"
              onMouseEnter={() => setShowExploreMenu(true)}
              onMouseLeave={() => setShowExploreMenu(false)}
            >
              <button 
                className="flex items-center gap-1.5 text-sm font-bold text-slate-200 hover:text-white py-3 transition-colors"
              >
                <span>Explore</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showExploreMenu ? 'rotate-180 text-white' : 'text-slate-400'}`} />
              </button>

              {showExploreMenu && (
                <div className="absolute top-full left-0 w-56 bg-white border border-slate-200 shadow-2xl rounded-b-2xl overflow-hidden text-slate-900 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Discover More</span>
                  </div>
                  
                  <button onClick={() => { setShowExploreMenu(false); navigateTo('faq'); }} className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    ❓ FAQs
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button onClick={() => { setShowExploreMenu(false); navigateTo('shipping-policy'); }} className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                    Shipping Policy
                  </button>
                  <button onClick={() => { setShowExploreMenu(false); navigateTo('return-policy'); }} className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                    Returns & Refunds
                  </button>
                  <button onClick={() => { setShowExploreMenu(false); navigateTo('privacy-policy'); }} className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                    Privacy Policy
                  </button>
                  <button onClick={() => { setShowExploreMenu(false); navigateTo('terms'); }} className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                    Terms & Conditions
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Right Guarantee Badge */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck size={14} />
            <span>100% Genuine Fitment Assurance</span>
          </div>

        </div>
      </div>
    </nav>
  );
};
