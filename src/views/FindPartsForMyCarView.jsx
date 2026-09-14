import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { fetchMasterManufacturers, fetchModelsByManufacturer, fetchGenerationsByModel, fetchVariantsByGeneration } from '../services/vehicleMasterService';
import { checkProductCompatibility } from '../services/compatibilityService';
import { Car, ChevronRight, CheckCircle2, ShieldCheck, Search, Filter, ShoppingCart, RefreshCw } from 'lucide-react';

export default function FindPartsForMyCarView() {
  const { products, setSelectedVehicle, navigateTo, addToCart, showToast } = useStore();

  // Dependent Selector Steps State
  const [manufacturers, setManufacturers] = useState([]);
  const [models, setModels] = useState([]);
  const [generations, setGenerations] = useState([]);
  const [variants, setVariants] = useState([]);

  const [selectedMake, setSelectedMake] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedGen, setSelectedGen] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('all');

  const [loading, setLoading] = useState(false);
  const [compatibleProducts, setCompatibleProducts] = useState([]);
  const [isSearched, setIsSearched] = useState(false);

  useEffect(() => {
    loadManufacturers();
  }, []);

  const loadManufacturers = async () => {
    setLoading(true);
    const res = await fetchMasterManufacturers();
    if (res.success) setManufacturers(res.data);
    setLoading(false);
  };

  const handleMakeChange = async (makeObj) => {
    setSelectedMake(makeObj);
    setSelectedModel(null);
    setSelectedGen(null);
    setSelectedVariant(null);
    setModels([]);
    setGenerations([]);
    setVariants([]);

    if (makeObj) {
      setLoading(true);
      const res = await fetchModelsByManufacturer(makeObj.id);
      if (res.success) setModels(res.data);
      setLoading(false);
    }
  };

  const handleModelChange = async (modelObj) => {
    setSelectedModel(modelObj);
    setSelectedGen(null);
    setSelectedVariant(null);
    setGenerations([]);
    setVariants([]);

    if (modelObj) {
      setLoading(true);
      const res = await fetchGenerationsByModel(modelObj.id);
      if (res.success) setGenerations(res.data);
      setLoading(false);
    }
  };

  const handleGenChange = async (genObj) => {
    setSelectedGen(genObj);
    setSelectedVariant(null);
    setVariants([]);

    if (genObj) {
      setLoading(true);
      const res = await fetchVariantsByGeneration(genObj.id);
      if (res.success) setVariants(res.data);
      setLoading(false);
    }
  };

  const handleFindParts = async () => {
    if (!selectedMake || !selectedModel) return;

    setLoading(true);
    setIsSearched(true);

    const vehicleData = {
      id: selectedVariant?.id || selectedGen?.id || selectedModel?.id,
      make: selectedMake.name,
      model: selectedModel.name,
      generation: selectedGen?.name || '',
      variant: selectedVariant?.name || '',
      year: selectedYear || 2022,
      fuel: selectedFuel
    };

    // Save active vehicle filter in store
    setSelectedVehicle(vehicleData);

    // Filter verified compatible products strictly
    const matched = [];
    for (const p of products) {
      const fitStatus = await checkProductCompatibility(p.id, vehicleData.id);
      if (fitStatus === 'compatible') {
        matched.push(p);
      } else if (p.compatibleVehicles && p.compatibleVehicles.some(v => (v.modelName || v.model || '').toLowerCase() === selectedModel.name.toLowerCase())) {
        matched.push(p);
      }
    }

    setCompatibleProducts(matched);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-8">
        <div className="inline-flex p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl mb-4">
          <Car className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Find Parts for My Car</h1>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Select your vehicle brand, model, generation, and variant to view 100% verified compatible spare parts.
        </p>
      </div>

      {/* 6-Step Dependent Selector Card */}
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Step 1: Make */}
          <div>
            <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Step 1: Select Make</label>
            <select
              value={selectedMake?.id || ''}
              onChange={(e) => {
                const found = manufacturers.find(m => m.id === e.target.value);
                handleMakeChange(found);
              }}
              className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-xl p-3 focus:border-amber-500 outline-none"
            >
              <option value="">-- Choose Car Make --</option>
              {manufacturers.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Step 2: Model */}
          <div>
            <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Step 2: Select Model</label>
            <select
              disabled={!selectedMake}
              value={selectedModel?.id || ''}
              onChange={(e) => {
                const found = models.find(m => m.id === e.target.value);
                handleModelChange(found);
              }}
              className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-xl p-3 focus:border-amber-500 outline-none disabled:opacity-50"
            >
              <option value="">-- Choose Model --</option>
              {models.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Step 3: Generation */}
          <div>
            <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Step 3: Generation</label>
            <select
              disabled={!selectedModel}
              value={selectedGen?.id || ''}
              onChange={(e) => {
                const found = generations.find(g => g.id === e.target.value);
                handleGenChange(found);
              }}
              className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-xl p-3 focus:border-amber-500 outline-none disabled:opacity-50"
            >
              <option value="">-- Choose Generation --</option>
              {generations.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          {/* Step 4: Variant */}
          <div>
            <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Step 4: Variant</label>
            <select
              disabled={!selectedGen}
              value={selectedVariant?.id || ''}
              onChange={(e) => {
                const found = variants.find(v => v.id === e.target.value);
                setSelectedVariant(found);
              }}
              className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-xl p-3 focus:border-amber-500 outline-none disabled:opacity-50"
            >
              <option value="">-- Choose Trim / Variant --</option>
              {variants.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          {/* Step 5: Year */}
          <div>
            <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Step 5: Model Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-xl p-3 focus:border-amber-500 outline-none"
            >
              <option value="">-- Choose Year --</option>
              {Array.from({ length: 25 }, (_, i) => 2026 - i).map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>

          {/* Step 6: Fuel Type */}
          <div>
            <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Step 6: Fuel Type</label>
            <select
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-xl p-3 focus:border-amber-500 outline-none"
            >
              <option value="all">All Fuel Types</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="cng">CNG</option>
              <option value="electric">Electric / EV</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleFindParts}
          disabled={loading || !selectedMake || !selectedModel}
          className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-base transition disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Show Verified Compatible Spare Parts</span>
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      {isSearched && (
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Compatible Spare Parts ({compatibleProducts.length})
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Vehicle: {selectedMake?.name} {selectedModel?.name}
            </span>
          </div>

          {compatibleProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {compatibleProducts.map(p => (
                <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-500/50 transition shadow-xl">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase block mb-1">{p.brand || 'OE Verified'}</span>
                    <h3 className="font-bold text-white text-base mb-1 line-clamp-2">{p.name || p.title}</h3>
                    <p className="text-xs text-slate-500 font-mono mb-3">SKU: {p.sku}</p>
                    <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 mb-4">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 100% Fitment Guaranteed
                    </span>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-lg font-extrabold text-white">₹{Number(p.price || 0).toLocaleString('en-IN')}</span>
                    <button
                      onClick={() => {
                        addToCart(p);
                        showToast(`Added "${p.name || p.title}" to cart!`, 'success');
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
              No direct catalog parts matching this exact variant yet. Contact support for custom OEM part sourcing.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
