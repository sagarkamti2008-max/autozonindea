import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { VEHICLE_DATABASE } from '../data/mockData';
import { Car, X, Check, Search, ShieldCheck, ArrowRight, HelpCircle } from 'lucide-react';
import CustomSelect from './CustomSelect';

export const VehicleModal = () => {
  const {
    isVehicleModalOpen,
    setIsVehicleModalOpen,
    setSelectedVehicle,
    addVehicleToGarage,
    navigateTo,
    showToast
  } = useStore();

  const [modalTab, setModalTab] = useState('manual'); // 'manual' | 'plate' | 'unlisted'
  
  // Search Autocomplete Filters
  const [makeSearchTerm, setMakeSearchTerm] = useState('');
  const [modelSearchTerm, setModelSearchTerm] = useState('');

  // Cascading Selection State
  const [selectedMake, setSelectedMake] = useState(VEHICLE_DATABASE[0]);
  const [selectedModel, setSelectedModel] = useState(selectedMake.models[0]);
  const [selectedYear, setSelectedYear] = useState(selectedModel.years[0]);
  const [selectedVariantObj, setSelectedVariantObj] = useState(selectedModel.variants[0]);

  // Plate Search State
  const [regPlateInput, setRegPlateInput] = useState('');
  const [isSearchingPlate, setIsSearchingPlate] = useState(false);

  // Custom Vehicle Unlisted Request Form State
  const [unlistedForm, setUnlistedForm] = useState({ make: '', model: '', year: '2022', notes: '' });

  if (!isVehicleModalOpen) return null;

  // Filter Makes by search term
  const filteredMakes = VEHICLE_DATABASE.filter(m => 
    m.name.toLowerCase().includes(makeSearchTerm.toLowerCase()) || 
    m.country.toLowerCase().includes(makeSearchTerm.toLowerCase())
  );

  // Filter Models by search term
  const filteredModels = selectedMake.models.filter(m => 
    m.name.toLowerCase().includes(modelSearchTerm.toLowerCase())
  );

  const handleMakeChange = (make) => {
    setSelectedMake(make);
    setSelectedModel(make.models[0]);
    setSelectedYear(make.models[0].years[0]);
    setSelectedVariantObj(make.models[0].variants[0]);
    setModelSearchTerm('');
  };

  const handleModelChange = (model) => {
    setSelectedModel(model);
    setSelectedYear(model.years[0]);
    setSelectedVariantObj(model.variants[0]);
  };

  const handlePlateSearch = (e) => {
    e.preventDefault();
    if (!regPlateInput.trim()) return;
    setIsSearchingPlate(true);
    setTimeout(() => {
      setIsSearchingPlate(false);
      const matchedMake = regPlateInput.toLowerCase().includes('mh') ? VEHICLE_DATABASE[0] : VEHICLE_DATABASE[1];
      const matchedModel = matchedMake.models[0];
      setSelectedMake(matchedMake);
      setSelectedModel(matchedModel);
      setSelectedYear(matchedModel.years[0]);
      setSelectedVariantObj(matchedModel.variants[0]);
      setModalTab('manual');
      showToast(`⚡ Vehicle specs auto-populated for license plate ${regPlateInput.toUpperCase()}!`);
    }, 600);
  };

  const handleApplyFitment = () => {
    const vehicleData = {
      makeId: selectedMake.id,
      makeName: selectedMake.name,
      make: selectedMake.name,
      modelId: selectedModel.id,
      modelName: selectedModel.name,
      model: selectedModel.name,
      year: selectedYear,
      variant: selectedVariantObj.name,
      engine: selectedVariantObj.engine,
      transmission: selectedVariantObj.transmission
    };

    setSelectedVehicle(vehicleData);
    if (addVehicleToGarage) addVehicleToGarage(vehicleData);
    setIsVehicleModalOpen(false);
    showToast(`🚗 Vehicle Active: ${selectedMake.name} ${selectedModel.name} (${selectedYear})`);
    navigateTo('catalog');
  };

  const handleSkipVehicle = () => {
    setIsVehicleModalOpen(false);
    showToast('ℹ️ Browsing catalog without vehicle filter');
  };

  const handleSubmitUnlisted = (e) => {
    e.preventDefault();
    showToast(`✅ Request received for ${unlistedForm.make} ${unlistedForm.model}! Our team is adding fitment data.`);
    setIsVehicleModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-[0_25px_50px_-12px_rgba(15,33,103,0.35)] border border-slate-200 flex flex-col custom-scrollbar animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-br from-primary-navy-dark to-primary-navy p-5 sm:p-6 rounded-t-3xl border-b-4 border-orange-500 flex justify-between items-start sticky top-0 z-10 shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-orange-500 rounded-2xl p-3 shadow-inner hidden sm:flex items-center justify-center">
              <Car className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
                Find Parts for My Car
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Select Make → Model → Year → Variant for 100% Guaranteed Fitment
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVehicleModalOpen(false)}
            className="bg-white/10 hover:bg-white/20 hover:scale-110 transition-all rounded-full p-2 text-white flex items-center justify-center cursor-pointer backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Triple Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto custom-scrollbar shadow-sm">
          <button
            onClick={() => setModalTab('manual')}
            className={`px-5 py-4 font-extrabold text-sm whitespace-nowrap border-b-[3px] transition-colors ${modalTab === 'manual' ? 'border-primary-navy text-primary-navy bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            🚗 Cascading Selector (Make/Model)
          </button>
          <button
            onClick={() => setModalTab('plate')}
            className={`px-5 py-4 font-extrabold text-sm whitespace-nowrap border-b-[3px] transition-colors ${modalTab === 'plate' ? 'border-orange-500 text-orange-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            ⚡ License Plate / VIN Scanner
          </button>
          <button
            onClick={() => setModalTab('unlisted')}
            className={`px-5 py-4 font-extrabold text-sm whitespace-nowrap border-b-[3px] transition-colors ${modalTab === 'unlisted' ? 'border-emerald-500 text-emerald-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            ❓ Vehicle Not Listed?
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 flex flex-col gap-8 flex-1 bg-white">

          {/* TAB 1: MANUAL CASCADING SELECTOR */}
          {modalTab === 'manual' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Step 1: Select Brand Make with Autocomplete */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs sm:text-sm font-black text-primary-navy tracking-widest uppercase">
                    1. Select Car Make <span className="text-slate-400 font-bold ml-1">({filteredMakes.length})</span>
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search Make..."
                      value={makeSearchTerm}
                      onChange={(e) => setMakeSearchTerm(e.target.value)}
                      className="pl-9 pr-3 py-2 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-orange-500 transition-colors w-[160px] sm:w-[220px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-h-[220px] overflow-y-auto custom-scrollbar p-1">
                  {filteredMakes.map(make => {
                    const isSelected = selectedMake.id === make.id;
                    return (
                      <button
                        key={make.id}
                        type="button"
                        onClick={() => handleMakeChange(make)}
                        className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-200 text-left ${isSelected ? 'border-primary-navy bg-slate-50 shadow-md transform scale-[1.02]' : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'}`}
                      >
                        <span className="text-2xl drop-shadow-sm">{make.logo}</span>
                        <div className="flex flex-col overflow-hidden">
                          <span className={`text-sm font-black truncate ${isSelected ? 'text-primary-navy' : 'text-slate-800'}`}>
                            {make.name}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {make.country}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Select Model with Autocomplete */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs sm:text-sm font-black text-primary-navy tracking-widest uppercase">
                    2. Select {selectedMake.name} Model
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search Model..."
                      value={modelSearchTerm}
                      onChange={(e) => setModelSearchTerm(e.target.value)}
                      className="pl-9 pr-3 py-2 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-orange-500 transition-colors w-[160px] sm:w-[200px]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5 max-h-[140px] overflow-y-auto custom-scrollbar p-1">
                  {filteredModels.map(model => {
                    const isSelected = selectedModel.id === model.id;
                    return (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => handleModelChange(model)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all duration-200 border-2 ${isSelected ? 'bg-primary-navy text-white border-primary-navy shadow-lg shadow-primary-navy/20 transform scale-105' : 'bg-slate-50 text-slate-700 border-slate-100 hover:border-slate-300 hover:bg-white hover:shadow-sm'}`}
                      >
                        {model.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Select Year & Variant Cascading Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <CustomSelect
                  label="3. Model Year"
                  value={selectedYear}
                  onChange={setSelectedYear}
                  options={selectedModel.years}
                  placeholder="Select Year"
                />

                <div className="sm:col-span-2">
                  <CustomSelect
                    label="4. Engine & Trim Variant"
                    value={selectedVariantObj.id}
                    onChange={(valId) => {
                      const v = selectedModel.variants.find(item => item.id === valId);
                      if (v) setSelectedVariantObj(v);
                    }}
                    options={selectedModel.variants.map(v => ({...v, displayName: `${v.name} (${v.engine})`}))}
                    valueKey="id"
                    labelKey="displayName"
                    placeholder="Select Variant"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PLATE SEARCH */}
          {modalTab === 'plate' && (
            <div className="py-2 animate-in fade-in duration-300 flex flex-col items-center justify-center h-full">
              <div className="w-full max-w-lg">
                <div className="bg-blue-50 border-2 border-blue-100 p-6 rounded-2xl mb-8 text-center shadow-inner">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🔍</span>
                  </div>
                  <h4 className="text-lg font-black text-blue-900 mb-2">
                    Instant Car Reg # / VIN Search
                  </h4>
                  <p className="text-sm text-blue-700 font-medium">
                    Enter your car registration number (e.g., <b className="bg-white px-2 py-0.5 rounded text-blue-900 border border-blue-200 shadow-sm mx-1">MH 01 AB 1234</b>) to auto-fill vehicle specs from RTO database.
                  </p>
                </div>

                <form onSubmit={handlePlateSearch} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="e.g. MH01AB1234"
                    value={regPlateInput}
                    onChange={(e) => setRegPlateInput(e.target.value.toUpperCase())}
                    className="flex-1 px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-black text-slate-800 tracking-[0.2em] focus:outline-none focus:border-orange-500 uppercase placeholder:tracking-normal placeholder:text-slate-400 placeholder:font-semibold text-center sm:text-left"
                  />
                  <button
                    type="submit"
                    disabled={isSearchingPlate}
                    className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white border-none rounded-xl font-black text-base cursor-pointer transition-all shadow-lg shadow-orange-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap active:scale-[0.98]"
                  >
                    {isSearchingPlate ? (
                      <span className="flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> Searching...</span>
                    ) : 'Fetch Specs'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: UNLISTED VEHICLE FORM */}
          {modalTab === 'unlisted' && (
            <div className="animate-in fade-in duration-300 max-w-2xl mx-auto w-full">
              <form onSubmit={handleSubmitUnlisted} className="flex flex-col gap-5">
                <div className="bg-emerald-50 border-2 border-emerald-100 p-5 rounded-2xl flex gap-4 items-start shadow-inner">
                  <div className="bg-emerald-100 p-2 rounded-full mt-1">
                    <HelpCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-black text-emerald-900 mb-1">Vehicle not found?</h4>
                    <p className="text-sm font-medium text-emerald-700 leading-relaxed">
                      Can't find your car model or rare imported vehicle? Submit request to our fitment engineering team. We'll manually cross-reference parts for you.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Car Make</label>
                    <input
                      type="text"
                      placeholder="e.g. Skoda / MG"
                      value={unlistedForm.make}
                      onChange={(e) => setUnlistedForm({ ...unlistedForm, make: e.target.value })}
                      required
                      className="w-full bg-slate-50 border-2 border-slate-100 text-slate-800 font-bold rounded-xl px-4 py-3.5 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Car Model & Year</label>
                    <input
                      type="text"
                      placeholder="e.g. Octavia vRS 2018"
                      value={unlistedForm.model}
                      onChange={(e) => setUnlistedForm({ ...unlistedForm, model: e.target.value })}
                      required
                      className="w-full bg-slate-50 border-2 border-slate-100 text-slate-800 font-bold rounded-xl px-4 py-3.5 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Any Notes (Optional)</label>
                   <textarea 
                      placeholder="VIN number or specific part needed..."
                      value={unlistedForm.notes}
                      onChange={(e) => setUnlistedForm({...unlistedForm, notes: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 text-slate-800 font-bold rounded-xl px-4 py-3.5 focus:outline-none focus:border-emerald-500 transition-colors min-h-[100px] resize-none"
                   ></textarea>
                </div>

                <button type="submit" className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-lg transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-[0.98]">
                  Submit Fitment Request <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}

          {/* Selected Fitment Summary Preview Banner */}
          {modalTab !== 'unlisted' && (
            <div className="mt-2 bg-gradient-to-r from-slate-50 to-white border-2 border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden">
              {/* Background decorative element */}
              <div className="absolute right-0 top-0 w-64 h-64 bg-slate-100 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>
              
              <div className="relative z-10 text-center sm:text-left w-full sm:w-auto">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 mb-2 shadow-sm uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" /> Selected Vehicle Context
                </span>
                <h4 className="text-xl sm:text-2xl text-primary-navy font-black mb-1.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span>{selectedMake.name}</span>
                  <span>{selectedModel.name}</span>
                  <span className="text-slate-400 font-bold">({selectedYear})</span>
                </h4>
                <p className="text-sm text-slate-500 font-bold flex items-center justify-center sm:justify-start gap-2">
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{selectedVariantObj.name}</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{selectedVariantObj.engine}</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto relative z-10 shrink-0">
                <button
                  type="button"
                  onClick={handleSkipVehicle}
                  className="bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 rounded-xl px-5 py-3.5 text-sm font-black transition-all cursor-pointer text-center"
                >
                  Skip Filter
                </button>
                <button
                  type="button"
                  onClick={handleApplyFitment}
                  className="bg-orange-500 hover:bg-orange-600 text-white border-none rounded-xl px-6 py-3.5 text-base font-black cursor-pointer shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Check className="w-5 h-5" /> Apply To Filter Spares
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
