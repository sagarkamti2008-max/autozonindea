import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { VEHICLE_MAKES } from '../data/vehicles';
import { FUEL_TYPES, TRANSMISSIONS } from '../services/fitmentEngine';
import { Car, ChevronDown, CheckCircle2, ArrowRight, ShieldCheck, RefreshCw, Bookmark } from 'lucide-react';

export const FindPartsVehicleSelector = ({ onComplete }) => {
  const { selectedVehicle, setSelectedVehicle, showToast, navigateTo } = useStore();

  const [brand, setBrand] = useState(selectedVehicle?.brand || selectedVehicle?.make || '');
  const [model, setModel] = useState(selectedVehicle?.model || '');
  const [year, setYear] = useState(selectedVehicle?.year || '');
  const [generation, setGeneration] = useState(selectedVehicle?.generation || 'Not specified');
  const [variant, setVariant] = useState(selectedVehicle?.variant || 'Not specified');
  const [engine, setEngine] = useState(selectedVehicle?.engine || 'Not specified');
  const [fuelType, setFuelType] = useState(selectedVehicle?.fuelType || selectedVehicle?.fuel || 'Not specified');
  const [transmission, setTransmission] = useState(selectedVehicle?.transmission || 'Not specified');

  // Compute available models for selected brand
  const activeBrandObj = VEHICLE_MAKES.find(
    b => b.name.toLowerCase() === brand.toLowerCase() || b.id === brand.toLowerCase()
  );
  const availableModels = activeBrandObj ? activeBrandObj.models : [];

  // Compute available model details
  const activeModelObj = availableModels.find(
    m => m.name.toLowerCase() === model.toLowerCase() || m.id === model.toLowerCase()
  );

  // Derive years list from active model
  const availableYears = (() => {
    if (!activeModelObj) return [];
    if (Array.isArray(activeModelObj.years)) {
      const yearSet = new Set();
      activeModelObj.years.forEach(yRange => {
        if (yRange.includes('-')) {
          const [start, end] = yRange.split('-').map(n => parseInt(n.trim(), 10));
          const actualEnd = isNaN(end) ? 2026 : end;
          const actualStart = isNaN(start) ? 2010 : start;
          for (let y = actualEnd; y >= actualStart; y--) {
            yearSet.add(y.toString());
          }
        } else {
          yearSet.add(yRange.trim());
        }
      });
      return Array.from(yearSet).sort((a, b) => b - a);
    }
    return ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];
  })();

  // Available variants from active model
  const availableVariants = activeModelObj?.variants || [];
  // Available generations from active model (or fallback)
  const availableGenerations = activeModelObj?.generations || ['XV70', 'XV50', 'XV40', 'Not specified'];

  // Handle cascading changes
  const handleBrandChange = (e) => {
    const val = e.target.value;
    setBrand(val);
    setModel('');
    setYear('');
    setGeneration('Not specified');
    setVariant('Not specified');
    setEngine('Not specified');
    setFuelType('Not specified');
    setTransmission('Not specified');
  };

  const handleModelChange = (e) => {
    const val = e.target.value;
    setModel(val);
    setYear('');
    setGeneration('Not specified');
    setVariant('Not specified');
    setEngine('Not specified');
    setFuelType('Not specified');
    setTransmission('Not specified');
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  // Check if minimum selection criteria met (Brand + Model + Year)
  const isSelectionComplete = Boolean(brand && model && year);

  // Determine current step (1 to 5)
  const currentStep = !brand ? 1 : !model ? 2 : !year ? 3 : (!variant || variant === 'Not specified') ? 4 : 5;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!isSelectionComplete) {
      if (!brand) showToast('⚠️ Please select a Vehicle Brand.');
      else if (!model) showToast('⚠️ Please select a Vehicle Model.');
      else if (!year) showToast('⚠️ Select your vehicle year to check compatibility.');
      return;
    }

    const vehicleData = {
      brand,
      make: brand,
      makeName: brand,
      model,
      modelName: model,
      year,
      generation,
      variant,
      engine,
      fuelType,
      fuel: fuelType,
      transmission,
      displayName: `${brand} ${model} ${year}${variant !== 'Not specified' ? ` (${variant})` : ''}`
    };

    setSelectedVehicle(vehicleData);
    showToast(`🚗 Saved My Car: ${vehicleData.displayName}`);

    if (onComplete) onComplete(vehicleData);
  };

  return (
    <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-xl border border-slate-200/80 space-y-6">
      
      {/* 5-Step Progress Indicator */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between gap-1 text-[11px] font-black uppercase tracking-wider mb-2">
          {[
            { num: 1, label: '1 Vehicle' },
            { num: 2, label: '2 Model' },
            { num: 3, label: '3 Year' },
            { num: 4, label: '4 Variant' },
            { num: 5, label: '5 Parts' }
          ].map(step => (
            <div
              key={step.num}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition ${
                currentStep === step.num
                  ? 'bg-[#0B5394] text-white shadow-md'
                  : currentStep > step.num
                  ? 'bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-200'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <span>{step.label}</span>
              {currentStep > step.num && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Brand */}
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider block">
              1. Brand / Make <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={brand}
                onChange={handleBrandChange}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 font-bold rounded-xl px-3.5 py-2.5 text-xs appearance-none focus:outline-none focus:border-[#0B5394] focus:bg-white cursor-pointer"
              >
                <option value="">-- Select Brand --</option>
                {VEHICLE_MAKES.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 2. Model */}
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider block">
              2. Model <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={model}
                onChange={handleModelChange}
                disabled={!brand}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 font-bold rounded-xl px-3.5 py-2.5 text-xs appearance-none focus:outline-none focus:border-[#0B5394] focus:bg-white disabled:opacity-50 cursor-pointer"
              >
                <option value="">-- Select Model --</option>
                {availableModels.map(m => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 3. Year */}
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider block">
              3. Year <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={year}
                onChange={handleYearChange}
                disabled={!model}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 font-bold rounded-xl px-3.5 py-2.5 text-xs appearance-none focus:outline-none focus:border-[#0B5394] focus:bg-white disabled:opacity-50 cursor-pointer"
              >
                <option value="">-- Select Year --</option>
                {availableYears.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 4. Variant / Trim */}
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider block">
              4. Variant / Trim
            </label>
            <div className="relative">
              <select
                value={variant}
                onChange={e => setVariant(e.target.value)}
                disabled={!year}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 font-bold rounded-xl px-3.5 py-2.5 text-xs appearance-none focus:outline-none focus:border-[#0B5394] focus:bg-white disabled:opacity-50 cursor-pointer"
              >
                <option value="Not specified">Not specified (All Variants)</option>
                {availableVariants.map((v, idx) => (
                  <option key={idx} value={v.name}>{v.name}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 5. Engine Specs */}
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider block">
              5. Engine
            </label>
            <div className="relative">
              <select
                value={engine}
                onChange={e => setEngine(e.target.value)}
                disabled={!year}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 font-bold rounded-xl px-3.5 py-2.5 text-xs appearance-none focus:outline-none focus:border-[#0B5394] focus:bg-white disabled:opacity-50 cursor-pointer"
              >
                <option value="Not specified">Not specified</option>
                <option value="2.5L Petrol">2.5L Petrol</option>
                <option value="2.0L Petrol">2.0L Petrol</option>
                <option value="1.5L Petrol">1.5L Petrol</option>
                <option value="1.2L Petrol">1.2L Petrol</option>
                <option value="1.5L Diesel">1.5L Diesel</option>
                <option value="2.0L Diesel">2.0L Diesel</option>
                <option value="2.2L Diesel">2.2L Diesel</option>
                <option value="2.5L Hybrid">2.5L Hybrid</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 6. Fuel Type */}
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider block">
              6. Fuel Type
            </label>
            <div className="relative">
              <select
                value={fuelType}
                onChange={e => setFuelType(e.target.value)}
                disabled={!year}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 font-bold rounded-xl px-3.5 py-2.5 text-xs appearance-none focus:outline-none focus:border-[#0B5394] focus:bg-white disabled:opacity-50 cursor-pointer"
              >
                {FUEL_TYPES.map(ft => (
                  <option key={ft} value={ft}>{ft}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 7. Transmission */}
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider block">
              7. Transmission
            </label>
            <div className="relative">
              <select
                value={transmission}
                onChange={e => setTransmission(e.target.value)}
                disabled={!year}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 font-bold rounded-xl px-3.5 py-2.5 text-xs appearance-none focus:outline-none focus:border-[#0B5394] focus:bg-white disabled:opacity-50 cursor-pointer"
              >
                {TRANSMISSIONS.map(tr => (
                  <option key={tr} value={tr}>{tr}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 8. Generation */}
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider block">
              8. Generation
            </label>
            <div className="relative">
              <select
                value={generation}
                onChange={e => setGeneration(e.target.value)}
                disabled={!year}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 font-bold rounded-xl px-3.5 py-2.5 text-xs appearance-none focus:outline-none focus:border-[#0B5394] focus:bg-white disabled:opacity-50 cursor-pointer"
              >
                {availableGenerations.map(gen => (
                  <option key={gen} value={gen}>{gen}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Action Bar */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 w-full sm:w-auto">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Strict Vehicle Match — Product fitment is verified by database rules</span>
          </div>

          <button
            type="submit"
            disabled={!isSelectionComplete}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isSelectionComplete
                ? 'bg-[#FF5722] hover:bg-[#e04816] text-white shadow-orange-500/30 active:scale-95'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>View Compatible Parts</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default FindPartsVehicleSelector;
