import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, ChevronDown, Car, CheckCircle2, ArrowRight } from 'lucide-react';

export const CarSelectView = () => {
  const { navigateTo, showToast } = useStore();

  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const carDatabase = {
    'MARUTI': {
      models: ['ALTO', 'BALENO', 'BREZZA', 'SWIFT', 'WAGON R', 'DZIRE', 'ERTIGA'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018']
    },
    'HYUNDAI': {
      models: ['CRETA', 'VENUE', 'I20', 'VERNA', 'TUCSON', 'ALCAZAR', 'EXTER'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018']
    },
    'TATA': {
      models: ['NEXON', 'PUNCH', 'HARRIER', 'SAFARI', 'ALTROZ', 'TIAGO', 'CURVV'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019']
    },
    'MAHINDRA': {
      models: ['THAR', 'XUV700', 'SCORPIO-N', 'BOLERO', 'XUV300'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020']
    },
    'TOYOTA': {
      models: ['FORTUNER', 'INNOVA CRYSTA', 'INNOVA HYCROSS', 'GLANZA', 'URBAN CRUISER'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020']
    },
    'KIA': {
      models: ['SELTOS', 'SONET', 'CARENS', 'EV6', 'CARNIVAL'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020']
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!selectedBrand || !selectedModel) {
      showToast('⚠️ Please select a Brand and Model to proceed.');
      return;
    }
    showToast(`✅ Filtering catalog for: ${selectedBrand} ${selectedModel} ${selectedYear}`);
    navigateTo('catalog');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8 pb-safe mb-24">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-500 mb-4">
            <Car className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 tracking-tight">Select Your Car</h1>
          <p className="text-slate-500 font-medium text-base sm:text-lg max-w-xl mx-auto">
            Choose your vehicle to ensure 100% fitment guarantee on all spare parts and accessories.
          </p>
        </div>

        <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-xl border border-slate-100">
          <form onSubmit={handleSearch} className="space-y-6">
            
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider pl-1">1. Make / Brand</label>
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    setSelectedModel('');
                    setSelectedYear('');
                  }}
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 font-bold rounded-xl px-5 py-4 appearance-none focus:outline-none focus:border-orange-500 focus:bg-white transition-colors cursor-pointer text-lg"
                >
                  <option value="">Select Brand</option>
                  {Object.keys(carDatabase).map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <ChevronDown className="w-6 h-6 text-slate-400 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider pl-1">2. Model</label>
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedBrand}
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 font-bold rounded-xl px-5 py-4 appearance-none focus:outline-none focus:border-orange-500 focus:bg-white disabled:opacity-50 transition-colors cursor-pointer text-lg"
                >
                  <option value="">Select Model</option>
                  {selectedBrand && carDatabase[selectedBrand]?.models.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <ChevronDown className="w-6 h-6 text-slate-400 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider pl-1">3. Year (Optional)</label>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  disabled={!selectedModel}
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 font-bold rounded-xl px-5 py-4 appearance-none focus:outline-none focus:border-orange-500 focus:bg-white disabled:opacity-50 transition-colors cursor-pointer text-lg"
                >
                  <option value="">Select Year</option>
                  {selectedBrand && carDatabase[selectedBrand]?.years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <ChevronDown className="w-6 h-6 text-slate-400 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="bg-emerald-50 rounded-2xl p-4 flex items-start gap-3 mb-6 border border-emerald-100">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-emerald-800 text-sm font-medium">
                  By selecting your vehicle, we automatically filter out incompatible parts. You will only see parts guaranteed to fit.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-lg py-5 rounded-xl shadow-xl shadow-orange-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <span>Find Compatible Parts</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
