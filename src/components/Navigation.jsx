import React from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronDown, Menu, ShieldCheck } from 'lucide-react';
import { CATEGORIES_DATABASE } from '../data/mockData';

export const Navigation = () => {
  const { navigateTo, setSelectedCategory } = useStore();
  const [showCategoryMenu, setShowCategoryMenu] = React.useState(false);

  const navLinks = [
    { label: 'Home', action: () => navigateTo('home') },
    { label: 'Shop/Categories', action: () => { setSelectedCategory('all'); navigateTo('catalog'); } },
    { label: 'About Us', action: () => navigateTo('about') },
    { label: 'Contact Us', action: () => navigateTo('contact') },
  ];

  return (
    <nav className="bg-slate-900 text-white shadow-md relative z-40 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-12">
          
          {/* Categories Dropdown Trigger */}
          <div 
            className="relative h-full flex items-center"
            onMouseEnter={() => setShowCategoryMenu(true)}
            onMouseLeave={() => setShowCategoryMenu(false)}
          >
            <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-6 h-full transition-colors">
              <Menu className="w-4 h-4" />
              <span>All Categories</span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>

            {/* Mega Menu Dropdown */}
            {showCategoryMenu && (
              <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 shadow-xl rounded-b-xl overflow-hidden text-slate-900 py-2">
                {CATEGORIES_DATABASE.map(cat => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setShowCategoryMenu(false);
                      navigateTo('catalog');
                    }}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-orange-50 hover:text-orange-600 cursor-pointer transition-colors"
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="font-bold text-sm">{cat.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main Horizontal Links */}
          <div className="flex items-center gap-8 ml-8 flex-1">
            {navLinks.map((link, index) => (
              <button
                key={index}
                onClick={link.action}
                className="text-sm font-bold text-slate-300 hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Trust Badge */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Genuine OEM Parts</span>
          </div>

        </div>
      </div>
    </nav>
  );
};
