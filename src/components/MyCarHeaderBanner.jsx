import React from 'react';
import { useStore } from '../context/StoreContext';
import { Car, ChevronRight, X, AlertCircle } from 'lucide-react';

export const MyCarHeaderBanner = () => {
  const { selectedVehicle, setSelectedVehicle, navigateTo } = useStore();

  if (!selectedVehicle) {
    return (
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white text-xs py-2 px-4 border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold text-slate-200">
              Select your vehicle to verify compatibility for 100% exact-fit parts.
            </span>
          </div>
          <button
            onClick={() => navigateTo('car-select')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] px-3.5 py-1 rounded-lg uppercase tracking-wider transition shrink-0 cursor-pointer"
          >
            + Select Vehicle
          </button>
        </div>
      </div>
    );
  }

  const brand = selectedVehicle.brand || selectedVehicle.make || selectedVehicle.makeName || 'Car';
  const model = selectedVehicle.model || selectedVehicle.modelName || '';
  const year = selectedVehicle.year || '';
  const variant = selectedVehicle.variant && selectedVehicle.variant !== 'Not specified' ? selectedVehicle.variant : '';

  return (
    <div className="bg-gradient-to-r from-[#0b192c] via-[#0F172A] to-[#0b192c] text-white text-xs py-2 px-4 border-b border-amber-500/40 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center shrink-0">
            <Car className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="truncate">
            <span className="font-black text-amber-400 uppercase text-[10px] tracking-widest mr-2">
              🚗 MY CAR:
            </span>
            <span className="font-bold text-white text-xs">
              {brand} {model} {year} {variant ? `(${variant})` : ''}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigateTo('car-select')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold px-3 py-1 rounded-lg border border-slate-700 transition cursor-pointer"
          >
            Change Vehicle
          </button>
          <button
            onClick={() => setSelectedVehicle(null)}
            className="text-slate-400 hover:text-rose-400 p-1 rounded-lg transition"
            title="Clear My Car"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyCarHeaderBanner;
