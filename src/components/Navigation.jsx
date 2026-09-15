import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronDown, Menu, ShieldCheck, Wrench, Layers, Shield, Filter, Grid, Sparkles, Package, Truck, Info, PhoneCall } from 'lucide-react';

export const Navigation = () => {
  const { navigateTo, setSelectedCategory } = useStore();
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showExploreMenu, setShowExploreMenu] = useState(false);

  // Exact 7 categories requested in user requirements
  const categoryItems = [
    { id: 'engine', name: 'Engine Parts', icon: <Wrench size={16} className="text-red-500" />, sub: 'Pistons, Gaskets, Belts' },
    { id: 'oils', name: 'Oils & Fluids', icon: <Layers size={16} className="text-amber-500" />, sub: '5W-30, Brake Fluid, Coolants' },
    { id: 'brakes', name: 'Brakes', icon: <Shield size={16} className="text-emerald-500" />, sub: 'Pads, Discs, Rotors' },
    { id: 'filters', name: 'Filters', icon: <Filter size={16} className="text-cyan-500" />, sub: 'Air, Cabin AC, Oil Filters' },
    { id: 'body', name: 'Body & Bumper', icon: <Grid size={16} className="text-purple-500" />, sub: 'Bumpers, Headlights, Mirrors' },
    { id: 'electrical', name: 'Electrical', icon: <Sparkles size={16} className="text-yellow-500" />, sub: 'Batteries, Horns, Fuses' },
    { id: 'accessories', name: 'Accessories', icon: <Package size={16} className="text-pink-500" />, sub: 'Mobile Holders, 7D Mats, Dash Cam' },
  ];

  return (
    <nav className="bg-slate-900 text-white shadow-md relative z-40 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          
          {/* Left Navigation Links Group */}
          <div className="flex items-center gap-6 md:gap-8 h-full">
            
            {/* 1. Home Link */}
            <button
              onClick={() => navigateTo('home')}
              className="text-sm font-bold text-slate-200 hover:text-white transition-colors py-3"
            >
              Home
            </button>

            {/* 2. All Categories Dropdown Menu */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setShowCategoryMenu(true)}
              onMouseLeave={() => setShowCategoryMenu(false)}
            >
              <button 
                onClick={() => { setSelectedCategory('all'); navigateTo('catalog'); }}
                className="flex items-center gap-2 text-sm font-bold text-slate-200 hover:text-orange-400 py-3 transition-colors group"
              >
                <Menu className="w-4 h-4 text-orange-400 group-hover:rotate-90 transition-transform duration-200" />
                <span>All Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showCategoryMenu ? 'rotate-180 text-orange-400' : 'text-slate-400'}`} />
              </button>

              {/* Dropdown Menu Container */}
              {showCategoryMenu && (
                <div className="absolute top-full left-0 w-72 bg-white border border-slate-200 shadow-2xl rounded-b-2xl overflow-hidden text-slate-900 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">SELECT CATEGORY</span>
                    <span className="text-[10px] font-bold text-orange-500">7 Core Categories</span>
                  </div>

                  {categoryItems.map(cat => (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setShowCategoryMenu(false);
                        navigateTo('catalog');
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 hover:text-orange-600 cursor-pointer transition-colors border-b border-slate-50 last:border-0 group"
                    >
                      <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-orange-100 transition-colors shrink-0">
                        {cat.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-slate-900 group-hover:text-orange-600">{cat.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{cat.sub}</span>
                      </div>
                    </div>
                  ))}
                  
                  <div 
                    onClick={() => { setSelectedCategory('all'); setShowCategoryMenu(false); navigateTo('catalog'); }}
                    className="p-3 text-center bg-slate-900 text-white hover:bg-orange-600 cursor-pointer font-bold text-xs transition-colors mt-1"
                  >
                    Explore Complete Catalog &rarr;
                  </div>
                </div>
              )}
            </div>

            {/* 3. Track Order Link */}
            <button
              onClick={() => navigateTo('track-order')}
              className="text-sm font-bold text-slate-200 hover:text-white transition-colors py-3 flex items-center gap-1.5"
            >
              <Truck size={15} className="text-cyan-400" />
              <span>Track Order</span>
            </button>

            {/* 4. About Link */}
            <button
              onClick={() => navigateTo('about')}
              className="text-sm font-bold text-slate-200 hover:text-white transition-colors py-3"
            >
              About
            </button>

            {/* 5. Contact Link */}
            <button
              onClick={() => navigateTo('contact')}
              className="text-sm font-bold text-slate-200 hover:text-white transition-colors py-3"
            >
              Contact
            </button>

            {/* 6. Explore Dropdown */}
            <div 
              className="relative h-full flex items-center"
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
                  
                  <button onClick={() => { setShowExploreMenu(false); navigateTo('sitemap'); }} className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    🗺️ Full Website Sitemap
                  </button>
                  <button onClick={() => { setShowExploreMenu(false); navigateTo('blog'); }} className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    📝 Blog & Maintenance Tips
                  </button>
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
