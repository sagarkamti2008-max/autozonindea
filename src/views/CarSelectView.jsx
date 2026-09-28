import React from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES_DATABASE } from '../data/mockData';
import { CategoryIcon } from '../components/CategoryIcon';
import { FindPartsVehicleSelector } from '../components/FindPartsVehicleSelector';
import { Car, ShieldCheck, ArrowRight } from 'lucide-react';

export const CarSelectView = () => {
  const { navigateTo, selectedVehicle, setSelectedVehicle, setSelectedCategory } = useStore();

  const handleCategoryClick = (catName) => {
    setSelectedCategory(catName);
    navigateTo('catalog');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 pb-safe mb-20 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Title Banner */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0B5394]/10 text-[#0B5394] mb-3 shadow-inner">
            <Car className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            🚗 Find Parts for Your Car
          </h1>
          <p className="text-slate-500 font-medium text-xs sm:text-base max-w-xl mx-auto mt-1">
            Strict vehicle fitment engine — Select Brand, Model, Year, Variant &amp; Engine for 100% verified compatible parts.
          </p>
        </div>

        {/* 8-Step Vehicle Selector Component */}
        <FindPartsVehicleSelector onComplete={() => {}} />

        {/* Selected Vehicle Active Context Banner */}
        {selectedVehicle && (
          <div className="bg-[#0b192c] border border-amber-500/40 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl animate-in fade-in duration-300">
            <div className="flex items-center gap-3.5">
              <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0 border border-amber-500/40">
                <Car className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">
                  🚗 MY CAR ACTIVE:
                </span>
                <h3 className="text-xl font-black text-white">
                  My Car: {selectedVehicle.brand || selectedVehicle.make} {selectedVehicle.model} {selectedVehicle.year}
                </h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Variant: {selectedVehicle.variant || 'Standard'} • Engine: {selectedVehicle.engine || 'Standard'} • Fuel: {selectedVehicle.fuelType || selectedVehicle.fuel || 'Petrol/Diesel'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={() => setSelectedVehicle(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors w-full sm:w-auto text-center cursor-pointer border border-slate-700"
              >
                Change Vehicle
              </button>
              <button
                onClick={() => navigateTo('catalog')}
                className="px-5 py-2.5 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors w-full sm:w-auto text-center shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>View Compatible Parts</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 34 CATEGORIES SECTION matching customer reference layout */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Select the required category of part:
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                {selectedVehicle 
                  ? `Showing parts categories verified for ${selectedVehicle.brand || selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.year})`
                  : 'Click any category to browse verified OEM & replacement automotive parts.'}
              </p>
            </div>
          </div>

          {/* Categories Grid - Clean White Cards with Blue Line-Art Icons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {CATEGORIES_DATABASE.map(cat => (
              <div
                key={cat.id || cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-[#0B5394] shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center text-center h-44 group relative overflow-hidden"
              >
                <div className="mb-3 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                  <CategoryIcon name={cat.name} className="w-14 h-14" />
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-[#0B5394] transition-colors leading-snug px-1 line-clamp-2">
                  {cat.name}
                </h3>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CarSelectView;
