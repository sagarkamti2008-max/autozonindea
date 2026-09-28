import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, ChevronDown, Car, CheckCircle2, ArrowRight, ShieldCheck, Wrench, Settings, Zap, Snowflake, Thermometer, Fuel, Layers, Lightbulb, Disc, Sparkles } from 'lucide-react';

export const CarSelectView = () => {
  const { navigateTo, showToast, selectedVehicle, setSelectedVehicle, setSelectedCategory } = useStore();

  const [selectedBrand, setSelectedBrand] = useState(selectedVehicle?.makeName || selectedVehicle?.make || '');
  const [selectedModel, setSelectedModel] = useState(selectedVehicle?.modelName || selectedVehicle?.model || '');
  const [selectedYear, setSelectedYear] = useState(selectedVehicle?.year || '');
  const [selectedVariant, setSelectedVariant] = useState(selectedVehicle?.variant || '');
  const [isCarSaved, setIsCarSaved] = useState(Boolean(selectedVehicle));

  const ALL_YEARS = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'];

  const carDatabase = {
    'Toyota': {
      models: {
        'Camry': {
          years: ['2024', '2023', '2022', '2021', '2020', '2019', '2018'],
          variants: ['2.5L Petrol', '2.5L Hybrid Electric']
        },
        'Innova Crysta': {
          years: ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016'],
          variants: ['2.4L Diesel (2GD-FTV)', '2.7L Petrol (2TR-FE)']
        },
        'Innova Hycross': {
          years: ['2024', '2023', '2022'],
          variants: ['2.0L Hybrid e-CVT', '2.0L Petrol CVT']
        },
        'Fortuner': {
          years: ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016'],
          variants: ['2.8L Diesel 4x4', '2.8L Diesel 4x2', '2.7L Petrol 4x2']
        },
        'Glanza': {
          years: ['2024', '2023', '2022', '2021', '2020', '2019'],
          variants: ['1.2L K12N Petrol', '1.2L CNG']
        }
      }
    },
    'Maruti Suzuki': {
      models: {
        'Swift': {
          years: ALL_YEARS,
          variants: ['1.2L K12N DualJet Petrol', '1.2L K12M Petrol', '1.3L DDiS Diesel']
        },
        'Baleno': {
          years: ALL_YEARS,
          variants: ['1.2L DualJet Petrol', '1.2L CNG']
        },
        'Brezza': {
          years: ALL_YEARS,
          variants: ['1.5L K15C Petrol', '1.3L DDiS Diesel']
        },
        'Dzire': {
          years: ALL_YEARS,
          variants: ['1.2L Petrol', '1.2L CNG']
        }
      }
    },
    'Hyundai': {
      models: {
        'Creta': {
          years: ALL_YEARS,
          variants: ['1.5L CRDi Diesel', '1.5L MPi Petrol', '1.4L Turbo GDi']
        },
        'Venue': {
          years: ALL_YEARS,
          variants: ['1.0L Turbo Petrol', '1.2L Kappa Petrol', '1.5L Diesel']
        },
        'i20': {
          years: ALL_YEARS,
          variants: ['1.2L Kappa Petrol', '1.0L Turbo GDi']
        }
      }
    },
    'Tata Motors': {
      models: {
        'Nexon': {
          years: ALL_YEARS,
          variants: ['1.2L Revotron Turbo Petrol', '1.5L Revotorq Diesel']
        },
        'Punch': {
          years: ALL_YEARS,
          variants: ['1.2L Revotron Petrol', '1.2L iCNG']
        },
        'Harrier': {
          years: ALL_YEARS,
          variants: ['2.0L Kryotec Turbo Diesel']
        }
      }
    },
    'Mahindra': {
      models: {
        'Thar': {
          years: ALL_YEARS,
          variants: ['2.2L mHawk Diesel 4x4', '2.0L mStallion Petrol 4x4', '1.5L Diesel RWD']
        },
        'XUV700': {
          years: ALL_YEARS,
          variants: ['2.2L mHawk Diesel AWD', '2.0L mStallion Turbo Petrol']
        },
        'Scorpio-N': {
          years: ALL_YEARS,
          variants: ['2.2L mHawk Diesel 4WD', '2.0L mStallion Petrol']
        }
      }
    },
    'Honda': {
      models: {
        'City': {
          years: ALL_YEARS,
          variants: ['1.5L i-VTEC Petrol', '1.5L i-DTEC Diesel', '1.5L e:HEV Hybrid']
        },
        'Amaze': {
          years: ALL_YEARS,
          variants: ['1.2L i-VTEC Petrol', '1.5L i-DTEC Diesel']
        }
      }
    }
  };

  const categories12 = [
    { id: 'Engine Parts', label: 'Engine Parts', icon: '🔧', color: 'from-red-500/10 to-red-500/20 text-red-600 border-red-200' },
    { id: 'Transmission Parts', label: 'Transmission Parts', icon: '⚙️', color: 'from-orange-500/10 to-orange-500/20 text-orange-600 border-orange-200' },
    { id: 'Brake Parts', label: 'Brake Parts', icon: '🛑', color: 'from-emerald-500/10 to-emerald-500/20 text-emerald-600 border-emerald-200' },
    { id: 'Suspension & Steering', label: 'Suspension & Steering', icon: '🚗', color: 'from-indigo-500/10 to-indigo-500/20 text-indigo-600 border-indigo-200' },
    { id: 'Electrical Parts', label: 'Electrical Parts', icon: '⚡', color: 'from-amber-500/10 to-amber-500/20 text-amber-600 border-amber-200' },
    { id: 'AC Parts', label: 'AC Parts', icon: '❄️', color: 'from-sky-500/10 to-sky-500/20 text-sky-600 border-sky-200' },
    { id: 'Cooling System', label: 'Cooling System', icon: '🌡️', color: 'from-cyan-500/10 to-cyan-500/20 text-cyan-600 border-cyan-200' },
    { id: 'Fuel System', label: 'Fuel System', icon: '⛽', color: 'from-purple-500/10 to-purple-500/20 text-purple-600 border-purple-200' },
    { id: 'Body Parts', label: 'Body Parts', icon: '🚘', color: 'from-pink-500/10 to-pink-500/20 text-pink-600 border-pink-200' },
    { id: 'Lights', label: 'Lights', icon: '💡', color: 'from-yellow-500/10 to-yellow-500/20 text-yellow-600 border-yellow-200' },
    { id: 'Wheels & Tyres', label: 'Wheels & Tyres', icon: '🛞', color: 'from-slate-500/10 to-slate-500/20 text-slate-700 border-slate-200' },
    { id: 'Service Parts', label: 'Service Parts', icon: '🧰', color: 'from-blue-500/10 to-blue-500/20 text-blue-600 border-blue-200' }
  ];

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
    setSelectedModel('');
    setSelectedYear('');
    setSelectedVariant('');
    setIsCarSaved(false);
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
    setSelectedYear('');
    setSelectedVariant('');
    setIsCarSaved(false);
  };

  const handleViewParts = (e) => {
    if (e) e.preventDefault();
    if (!selectedBrand || !selectedModel) {
      showToast('⚠️ Please select at least Brand and Model.');
      return;
    }

    const vehicleObj = {
      make: selectedBrand,
      makeName: selectedBrand,
      model: selectedModel,
      modelName: selectedModel,
      year: selectedYear || '2020',
      variant: selectedVariant || '2.5L Petrol',
      displayName: `${selectedBrand} ${selectedModel} ${selectedYear || ''}`.trim()
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

  const availableModels = selectedBrand && carDatabase[selectedBrand] ? Object.keys(carDatabase[selectedBrand].models) : [];
  const availableYears = selectedBrand && selectedModel && carDatabase[selectedBrand]?.models[selectedModel] ? carDatabase[selectedBrand].models[selectedModel].years : ALL_YEARS;
  const availableVariants = selectedBrand && selectedModel && carDatabase[selectedBrand]?.models[selectedModel] ? carDatabase[selectedBrand].models[selectedModel].variants : ['Standard Trim'];

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 pb-safe mb-20 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Title Banner */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0B5394]/10 text-[#0B5394] mb-3 shadow-inner">
            <Car className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            1️⃣ Select Your Car
          </h1>
          <p className="text-slate-500 font-medium text-xs sm:text-base max-w-lg mx-auto mt-1">
            Choose Brand, Model, Year &amp; Variant for 100% guaranteed compatible spare parts.
          </p>
        </div>

        {/* Vehicle Selection Card */}
        <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-xl border border-slate-200/80">
          <form onSubmit={handleViewParts} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Brand Select */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider pl-1">Select Brand</label>
                <div className="relative">
                  <select
                    value={selectedBrand}
                    onChange={handleBrandChange}
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 font-bold rounded-xl px-3.5 py-3 text-sm appearance-none focus:outline-none focus:border-[#0B5394] focus:bg-white transition-colors cursor-pointer"
                  >
                    <option value="">Select Brand</option>
                    {Object.keys(carDatabase).map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Model Select */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider pl-1">Select Model</label>
                <div className="relative">
                  <select
                    value={selectedModel}
                    onChange={handleModelChange}
                    disabled={!selectedBrand}
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 font-bold rounded-xl px-3.5 py-3 text-sm appearance-none focus:outline-none focus:border-[#0B5394] focus:bg-white disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    <option value="">Select Model</option>
                    {availableModels.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Year Select */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider pl-1">Select Year</label>
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={(e) => { setSelectedYear(e.target.value); setIsCarSaved(false); }}
                    disabled={!selectedModel}
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 font-bold rounded-xl px-3.5 py-3 text-sm appearance-none focus:outline-none focus:border-[#0B5394] focus:bg-white disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    <option value="">Select Year</option>
                    {availableYears.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Variant Select */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider pl-1">Select Variant (Optional)</label>
                <div className="relative">
                  <select
                    value={selectedVariant}
                    onChange={(e) => { setSelectedVariant(e.target.value); setIsCarSaved(false); }}
                    disabled={!selectedModel}
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 font-bold rounded-xl px-3.5 py-3 text-sm appearance-none focus:outline-none focus:border-[#0B5394] focus:bg-white disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    <option value="">Select Variant</option>
                    {availableVariants.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 w-full sm:w-auto">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Selected vehicle guarantees exact part fitment</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#FF5722] hover:bg-[#e04816] text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
              >
                <span>[ VIEW PARTS ]</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Selected Vehicle Active Context Banner */}
        {selectedVehicle && (
          <div className="bg-[#0b192c] border border-amber-500/30 rounded-2xl p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Vehicle Selected</span>
                <h3 className="text-lg font-black text-amber-300">
                  🚗 My Car: {selectedVehicle.makeName || selectedVehicle.make} {selectedVehicle.modelName || selectedVehicle.model} {selectedVehicle.year}
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  Trim Variant: {selectedVehicle.variant || '2.5L Petrol'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => { setSelectedVehicle(null); setIsCarSaved(false); }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors w-full sm:w-auto text-center"
              >
                Clear Car
              </button>
              <button
                onClick={() => navigateTo('catalog')}
                className="px-4 py-1.5 rounded-lg text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors w-full sm:w-auto text-center shadow-md"
              >
                View All Compatible Parts &rarr;
              </button>
            </div>
          </div>
        )}

        {/* 2️⃣ CATEGORIES SECTION FOR SELECTED CAR */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {selectedVehicle 
                  ? `${selectedVehicle.makeName || selectedVehicle.make} ${selectedVehicle.modelName || selectedVehicle.model} ${selectedVehicle.year} Parts Categories`
                  : 'Select Categories for Compatible Parts'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Click any category below to view 100% compatible products for your vehicle.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {categories12.map(cat => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`p-4 rounded-2xl border bg-gradient-to-br ${cat.color} hover:shadow-lg cursor-pointer transition-all hover:-translate-y-1 flex flex-col justify-between h-28 group`}
              >
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-[#0B5394] transition-colors leading-tight">
                    {cat.label}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-bold inline-flex items-center gap-0.5 mt-1">
                    Browse Parts &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CarSelectView;
