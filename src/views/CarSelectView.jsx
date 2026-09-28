import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { VEHICLE_DATABASE, CATEGORIES_DATABASE } from '../data/mockData';
import { CategoryIcon } from '../components/CategoryIcon';
import { Search, ChevronDown, Car, CheckCircle2, ArrowRight, ShieldCheck, Wrench, Settings, Zap, Snowflake, Thermometer, Fuel, Layers, Lightbulb, Disc, Sparkles } from 'lucide-react';

export const CarSelectView = () => {
  const { navigateTo, showToast, selectedVehicle, setSelectedVehicle, setSelectedCategory } = useStore();

  const [selectedBrandName, setSelectedBrandName] = useState(selectedVehicle?.makeName || selectedVehicle?.make || '');
  const [selectedModelName, setSelectedModelName] = useState(selectedVehicle?.modelName || selectedVehicle?.model || '');
  const [selectedYear, setSelectedYear] = useState(selectedVehicle?.year || '');
  const [selectedVariant, setSelectedVariant] = useState(selectedVehicle?.variant || '');
  const [isCarSaved, setIsCarSaved] = useState(Boolean(selectedVehicle));

  const ALL_YEARS = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'];

  // Dynamic Lookup from VEHICLE_DATABASE
  const activeBrandObj = VEHICLE_DATABASE.find(b => b.name.toLowerCase() === selectedBrandName.toLowerCase() || b.id === selectedBrandName.toLowerCase());
  const availableModels = activeBrandObj ? activeBrandObj.models : [];

  const activeModelObj = availableModels.find(m => m.name.toLowerCase() === selectedModelName.toLowerCase() || m.id === selectedModelName.toLowerCase());
  const availableYears = activeModelObj ? activeModelObj.years : ALL_YEARS;
  const availableVariants = activeModelObj ? activeModelObj.variants : [];

  const handleBrandChange = (e) => {
    setSelectedBrandName(e.target.value);
    setSelectedModelName('');
    setSelectedYear('');
    setSelectedVariant('');
    setIsCarSaved(false);
  };

  const handleModelChange = (e) => {
    setSelectedModelName(e.target.value);
    setSelectedYear('');
    setSelectedVariant('');
    setIsCarSaved(false);
  };

  const handleViewParts = (e) => {
    if (e) e.preventDefault();
    if (!selectedBrandName || !selectedModelName) {
      showToast('⚠️ Please select at least Brand and Model.');
      return;
    }

    const vehicleObj = {
      make: selectedBrandName,
      makeName: selectedBrandName,
      model: selectedModelName,
      modelName: selectedModelName,
      year: selectedYear || '2020',
      variant: selectedVariant || (availableVariants[0]?.name || 'Standard Trim'),
      engine: availableVariants.find(v => v.name === selectedVariant)?.engine || '',
      displayName: `${selectedBrandName} ${selectedModelName} ${selectedYear || ''}`.trim()
    };

    setSelectedVehicle(vehicleObj);
    setIsCarSaved(true);
    showToast(`🚗 My Car Saved: ${vehicleObj.displayName} (${vehicleObj.variant})`);
  };

  const handleCategoryClick = (catId) => {
    if (!selectedVehicle) {
      handleViewParts();
    }
    setSelectedCategory(catId);
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
            🚗 Select Your Vehicle
          </h1>
          <p className="text-slate-500 font-medium text-xs sm:text-base max-w-xl mx-auto mt-1">
            Choose Brand, Model, Year &amp; Variant for 100% guaranteed compatible spare parts across any vehicle.
          </p>
        </div>

        {/* Vehicle Selection Card */}
        <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-xl border border-slate-200/80">
          <form onSubmit={handleViewParts} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Brand Select */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider pl-1">1. Brand / Make</label>
                <div className="relative">
                  <select
                    value={selectedBrandName}
                    onChange={handleBrandChange}
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 font-bold rounded-xl px-3.5 py-3 text-sm appearance-none focus:outline-none focus:border-[#0B5394] focus:bg-white transition-colors cursor-pointer"
                  >
                    <option value="">Select Brand</option>
                    {VEHICLE_DATABASE.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Model Select */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider pl-1">2. Model</label>
                <div className="relative">
                  <select
                    value={selectedModelName}
                    onChange={handleModelChange}
                    disabled={!selectedBrandName}
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 font-bold rounded-xl px-3.5 py-3 text-sm appearance-none focus:outline-none focus:border-[#0B5394] focus:bg-white disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    <option value="">Select Model</option>
                    {availableModels.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Year Select */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider pl-1">3. Year</label>
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={(e) => { setSelectedYear(e.target.value); setIsCarSaved(false); }}
                    disabled={!selectedModelName}
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 font-bold rounded-xl px-3.5 py-3 text-sm appearance-none focus:outline-none focus:border-[#0B5394] focus:bg-white disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    <option value="">Select Year</option>
                    {availableYears.map((y, idx) => (
                      <option key={idx} value={y}>{y}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Variant Select */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider pl-1">4. Variant / Engine</label>
                <div className="relative">
                  <select
                    value={selectedVariant}
                    onChange={(e) => { setSelectedVariant(e.target.value); setIsCarSaved(false); }}
                    disabled={!selectedModelName}
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 font-bold rounded-xl px-3.5 py-3 text-sm appearance-none focus:outline-none focus:border-[#0B5394] focus:bg-white disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    <option value="">Select Variant</option>
                    {availableVariants.map((v, idx) => (
                      <option key={idx} value={v.name}>{v.name} ({v.engine})</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 w-full sm:w-auto">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Selected vehicle context automatically filters compatible parts</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#FF5722] hover:bg-[#e04816] text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
              >
                <span>[ FIND COMPATIBLE PARTS ]</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Selected Vehicle Active Context Banner */}
        {selectedVehicle && (
          <div className="bg-[#0b192c] border border-amber-500/40 rounded-2xl p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0">
                <Car className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">🚗 My Car Active Context</span>
                <h3 className="text-xl font-black text-white">
                  My Car: {selectedVehicle.makeName || selectedVehicle.make} {selectedVehicle.modelName || selectedVehicle.model} {selectedVehicle.year}
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  Variant: {selectedVehicle.variant || 'Standard'} {selectedVehicle.engine ? `• Engine: ${selectedVehicle.engine}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={() => { setSelectedVehicle(null); setIsCarSaved(false); }}
                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors w-full sm:w-auto text-center cursor-pointer"
              >
                Change Vehicle
              </button>
              <button
                onClick={() => navigateTo('catalog')}
                className="px-5 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors w-full sm:w-auto text-center shadow-md cursor-pointer"
              >
                View Compatible Catalog &rarr;
              </button>
            </div>
          </div>
        )}

        {/* 34 CATEGORIES SECTION matching customer reference layout */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Select the required category of part:
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {selectedVehicle 
                  ? `Showing parts categories verified for ${selectedVehicle.makeName} ${selectedVehicle.modelName} (${selectedVehicle.year})`
                  : 'Click any category to browse verified OEM & replacement automotive parts.'}
              </p>
            </div>
          </div>

          {/* Categories Grid - Clean White Cards with Blue Line-Art Icons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {CATEGORIES_DATABASE.map(cat => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-sky-400 shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center text-center h-44 group relative overflow-hidden"
              >
                <div className="mb-3 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                  <CategoryIcon name={cat.name} className="w-14 h-14" />
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-[#0EA5E9] transition-colors leading-snug px-1 line-clamp-2">
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
