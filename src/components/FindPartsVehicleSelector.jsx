import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { VEHICLE_MAKES } from '../data/vehicles';
import { FUEL_TYPES, TRANSMISSIONS } from '../services/fitmentEngine';
import { decodeVinNumber, PRESET_SAMPLE_VINS } from '../services/vinDecoderService';
import { Car, ChevronDown, CheckCircle2, ArrowRight, ShieldCheck, Bookmark, Search, Key, Sparkles } from 'lucide-react';

export const FindPartsVehicleSelector = ({ onComplete }) => {
  const { selectedVehicle, setSelectedVehicle, showToast, navigateTo } = useStore();

  const [activeTab, setActiveTab] = useState('manual'); // 'manual' | 'vin'
  const [vinInput, setVinInput] = useState(selectedVehicle?.vin || '');
  const [vinError, setVinError] = useState('');

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

  const availableVariants = activeModelObj?.variants || [];
  const availableGenerations = activeModelObj?.generations || ['XV70', 'XV50', 'XV40', 'Not specified'];

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

  const isSelectionComplete = Boolean(brand && model && year);
  const currentStep = !brand ? 1 : !model ? 2 : !year ? 3 : (!variant || variant === 'Not specified') ? 4 : 5;

  const handleSubmitManual = (e) => {
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

  // VIN Lookup Submission
  const handleVinSubmit = (e) => {
    if (e) e.preventDefault();
    setVinError('');

    const decoded = decodeVinNumber(vinInput);
    if (!decoded.success) {
      setVinError(decoded.error);
      showToast(`❌ ${decoded.error}`, 'error');
      return;
    }

    setSelectedVehicle(decoded);
    showToast(`✓ VIN Decoded: ${decoded.displayName}`);
    if (onComplete) onComplete(decoded);
  };

  const handlePresetSelect = (preset) => {
    setVinInput(preset.vin);
    setVinError('');
    setSelectedVehicle({
      brand: preset.brand,
      make: preset.brand,
      makeName: preset.brand,
      model: preset.model,
      modelName: preset.model,
      year: preset.year,
      generation: 'Not specified',
      variant: preset.variant,
      engine: preset.engine,
      fuelType: preset.fuelType,
      fuel: preset.fuelType,
      transmission: preset.transmission,
      vin: preset.vin,
      isVinDecoded: true,
      displayName: `${preset.brand} ${preset.model} ${preset.year} (${preset.variant})`
    });
    showToast(`✓ Preset VIN Loaded: ${preset.brand} ${preset.model} (${preset.year})`);
  };

  return (
    <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-xl border border-slate-200/80 space-y-6">
      
      {/* Selection Mode Toggle Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'manual'
                ? 'bg-[#0B5394] text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Select Vehicle</span>
          </button>

          <span className="text-xs font-black text-slate-400">OR</span>

          <button
            type="button"
            onClick={() => setActiveTab('vin')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'vin'
                ? 'bg-[#0B5394] text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span>Enter VIN / Chassis Number</span>
          </button>
        </div>

        <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Strict Vehicle Fitment Verification</span>
        </div>
      </div>

      {/* MODE A: Manual Cascading Selector */}
      {activeTab === 'manual' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* 5-Step Progress Bar */}
          <div className="flex items-center justify-between gap-1 text-[11px] font-black uppercase tracking-wider overflow-x-auto pb-1">
            {[
              { num: 1, label: '1 Vehicle' },
              { num: 2, label: '2 Model' },
              { num: 3, label: '3 Year' },
              { num: 4, label: '4 Variant' },
              { num: 5, label: '5 Parts' }
            ].map(step => (
              <div
                key={step.num}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition whitespace-nowrap ${
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

          <form onSubmit={handleSubmitManual} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Brand */}
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

              {/* Model */}
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

              {/* Year */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider block">
                  3. Year <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={year}
                    onChange={e => setYear(e.target.value)}
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

              {/* Variant */}
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

              {/* Engine */}
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

              {/* Fuel Type */}
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

              {/* Transmission */}
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

              {/* Generation */}
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

            {/* Submit Bar */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 w-full sm:w-auto">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Strict Vehicle Match — Verified by database compatibility rules</span>
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
                <span>Find Compatible Parts</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODE B: SYSTEM 3 — VIN / Chassis Number Input */}
      {activeTab === 'vin' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <form onSubmit={handleVinSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider block flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-500" />
                <span>Enter 17-digit VIN / Chassis Number</span>
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={vinInput}
                    onChange={e => { setVinInput(e.target.value.toUpperCase()); setVinError(''); }}
                    placeholder="Enter VIN / Chassis Number (e.g. MBJ772CAMRY2020X)"
                    className="w-full bg-slate-50 border-2 border-slate-300 text-slate-900 font-mono font-bold rounded-2xl px-4 py-3.5 text-sm uppercase tracking-wider focus:outline-none focus:border-[#0B5394] focus:bg-white transition"
                  />
                  {vinInput && (
                    <button
                      type="button"
                      onClick={() => setVinInput('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#FF5722] hover:bg-[#e04816] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Compatible Parts</span>
                </button>
              </div>

              {vinError && (
                <p className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                  {vinError}
                </p>
              )}
            </div>
          </form>

          {/* Quick Presets for Instant Testing */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Quick Preset VINs for Instant Testing:
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {PRESET_SAMPLE_VINS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-amber-500 hover:text-slate-950 border border-slate-200 hover:border-amber-400 text-slate-800 transition cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <Key className="w-3 h-3 text-amber-500" />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FindPartsVehicleSelector;
