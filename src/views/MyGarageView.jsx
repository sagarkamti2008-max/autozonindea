import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Car, Plus, Star, Trash2, CheckCircle2 } from 'lucide-react';

export function MyGarageView() {
  const { user, savedGarage, addVehicleToGarage, removeVehicleFromGarage, selectedVehicle, setSelectedVehicle, navigateTo, showToast } = useStore();
  
  // Add Vehicle modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [variant, setVariant] = useState('');
  const [year, setYear] = useState('2022');
  const [fuel, setFuel] = useState('Diesel');

  const vehicles = savedGarage || [];

  const handleAddVehicle = (e) => {
    e.preventDefault();
    if (!make.trim() || !model.trim()) return;

    addVehicleToGarage({
      makeName: make.trim(),
      modelName: model.trim(),
      variant: variant.trim(),
      year: year,
      fuelType: fuel
    });
    
    setShowAddModal(false);
    setMake(''); setModel(''); setVariant('');
  };

  const handleRemove = (id) => {
    removeVehicleFromGarage(id);
  };

  const handleSetDefault = (v) => {
    setSelectedVehicle(v);
    showToast(`100% Fitment filter activated for ${v.makeName || v.make} ${v.modelName || v.model}`, 'success');
  };

  const handleSelectForFitment = (v) => {
    setSelectedVehicle(v);
    showToast(`100% Fitment filter activated for ${v.makeName || v.make} ${v.modelName || v.model}`, 'success');
    navigateTo('catalog');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Bar */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
              <Car className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">My Garage</h1>
              <p className="text-slate-400 text-sm">Save your vehicles for instant 100% fitment checking across the catalog</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-sm transition flex items-center space-x-2 shadow-lg shadow-amber-500/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Vehicle Grid */}
      <div className="max-w-5xl mx-auto">
        {vehicles.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-sm">
            <Car className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Your Garage is Empty</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-6">Add your car to instantly see 100% compatible parts across the entire store.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition"
            >
              Add Your First Vehicle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicles.map((v) => {
              const isActive = selectedVehicle?.id === v.id;
              
              return (
                <div 
                  key={v.id}
                  className={`bg-slate-900 border ${isActive ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-slate-800'} rounded-2xl p-5 hover:border-slate-700 transition relative overflow-hidden group`}
                >
                  {isActive && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl z-10 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active Filter
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0">
                        <Car className="w-6 h-6 text-slate-400 group-hover:text-amber-500 transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white leading-tight">{v.year} {v.makeName || v.make} {v.modelName || v.model}</h3>
                        <p className="text-slate-400 text-sm mt-0.5">{v.variant} • {v.fuelType || v.fuel_type}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/50">
                    <button
                      onClick={() => handleSelectForFitment(v)}
                      className={`flex-1 py-2 font-bold rounded-xl text-sm transition flex justify-center items-center gap-2 ${
                        isActive 
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        : 'bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-slate-950'
                      }`}
                    >
                      {isActive ? 'Currently Shopping For' : 'Shop Parts For This Car'}
                    </button>
                    {!isActive && (
                      <button
                        onClick={() => handleSetDefault(v)}
                        className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded-xl border border-slate-800 transition"
                        title="Set as Default Vehicle"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(v.id)}
                      className="p-2 bg-slate-950 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-800 transition"
                      title="Remove Vehicle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-bold text-white text-lg mb-4">Add Vehicle to My Garage</h3>

            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Make / Manufacturer</label>
                <input
                  type="text"
                  placeholder="e.g. Toyota"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Model Name</label>
                <input
                  type="text"
                  placeholder="e.g. Innova Crysta"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Variant / Trim</label>
                <input
                  type="text"
                  placeholder="e.g. 2.4 ZX Diesel"
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Fuel Type</label>
                  <select
                    value={fuel}
                    onChange={(e) => setFuel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="EV">Electric / EV</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyGarageView;
