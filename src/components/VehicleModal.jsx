import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { VEHICLE_DATABASE } from '../data/mockData';
import { Car, X, Check, Search, ShieldCheck, ArrowRight, HelpCircle } from 'lucide-react';

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
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '780px',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(15, 33, 103, 0.35)',
        border: '1px solid #CBD5E1',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0F2167, #1E3E62)',
          color: '#FFFFFF',
          padding: '1.25rem 1.5rem',
          borderRadius: '20px 20px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '3px solid #FF6B00'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: '#FF6B00', borderRadius: '50%', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Car size={22} color="#FFFFFF" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 900 }}>
                Find Parts for My Car (Vehicle Selector)
              </h3>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.78rem', color: '#CBD5E1' }}>
                Select Make → Model → Year → Variant to filter 100% verified fitments
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVehicleModalOpen(false)}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', padding: '0.4rem', color: '#FFFFFF', cursor: 'pointer', display: 'flex' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Triple Tab Selector */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', padding: '0 1.5rem', background: '#F8FAFC', gap: '0.5rem', overflowX: 'auto' }}>
          <button
            onClick={() => setModalTab('manual')}
            style={{
              padding: '0.75rem 1rem',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              borderBottom: modalTab === 'manual' ? '3px solid #0F2167' : '3px solid transparent',
              color: modalTab === 'manual' ? '#0F2167' : '#64748B',
              whiteSpace: 'nowrap'
            }}
          >
            🚗 Cascading Selector (Make/Model)
          </button>
          <button
            onClick={() => setModalTab('plate')}
            style={{
              padding: '0.75rem 1rem',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              borderBottom: modalTab === 'plate' ? '3px solid #FF6B00' : '3px solid transparent',
              color: modalTab === 'plate' ? '#FF6B00' : '#64748B',
              whiteSpace: 'nowrap'
            }}
          >
            ⚡ License Plate / VIN Scanner
          </button>
          <button
            onClick={() => setModalTab('unlisted')}
            style={{
              padding: '0.75rem 1rem',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              borderBottom: modalTab === 'unlisted' ? '3px solid #059669' : '3px solid transparent',
              color: modalTab === 'unlisted' ? '#059669' : '#64748B',
              whiteSpace: 'nowrap'
            }}
          >
            ❓ Vehicle Not Listed?
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>

          {/* TAB 1: MANUAL CASCADING SELECTOR */}
          {modalTab === 'manual' && (
            <>
              {/* Step 1: Select Brand Make with Autocomplete */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 900, color: '#0F2167', letterSpacing: '0.5px' }}>
                    1. SELECT CAR MAKE ({filteredMakes.length} AVAILABLE)
                  </label>
                  <input
                    type="text"
                    placeholder="Search Make (e.g., Maruti, Toyota)..."
                    value={makeSearchTerm}
                    onChange={(e) => setMakeSearchTerm(e.target.value)}
                    style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.75rem', width: '200px' }}
                  />
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: '0.6rem',
                  maxHeight: '160px',
                  overflowY: 'auto',
                  paddingRight: '0.25rem'
                }}>
                  {filteredMakes.map(make => {
                    const isSelected = selectedMake.id === make.id;
                    return (
                      <button
                        key={make.id}
                        type="button"
                        onClick={() => handleMakeChange(make)}
                        style={{
                          background: isSelected ? '#EFF6FF' : '#F8FAFC',
                          border: isSelected ? '2px solid #0F2167' : '1px solid #CBD5E1',
                          borderRadius: '10px',
                          padding: '0.55rem 0.7rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          boxShadow: isSelected ? '0 4px 10px rgba(15,33,103,0.15)' : 'none',
                          transition: 'all 0.2s'
                        }}
                      >
                        <span style={{ fontSize: '1.3rem' }}>{make.logo}</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 900, color: isSelected ? '#0F2167' : '#1E293B', lineHeight: 1.2 }}>
                            {make.name}
                          </span>
                          <span style={{ fontSize: '0.65rem', color: '#64748B' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 900, color: '#0F2167', letterSpacing: '0.5px' }}>
                    2. SELECT {selectedMake.name.toUpperCase()} MODEL
                  </label>
                  <input
                    type="text"
                    placeholder="Search Model (e.g., Swift, Innova)..."
                    value={modelSearchTerm}
                    onChange={(e) => setModelSearchTerm(e.target.value)}
                    style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.75rem', width: '180px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', maxHeight: '110px', overflowY: 'auto' }}>
                  {filteredModels.map(model => {
                    const isSelected = selectedModel.id === model.id;
                    return (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => handleModelChange(model)}
                        style={{
                          background: isSelected ? '#0F2167' : '#F1F5F9',
                          color: isSelected ? '#FFFFFF' : '#334155',
                          border: isSelected ? '1.5px solid #0F2167' : '1px solid #CBD5E1',
                          borderRadius: '20px',
                          padding: '0.4rem 1rem',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: isSelected ? '0 4px 12px rgba(15,33,103,0.2)' : 'none'
                        }}
                      >
                        {model.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Select Year & Variant Cascading Dropdowns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 900, color: '#0F2167', display: 'block', marginBottom: '0.35rem' }}>
                    3. MODEL YEAR
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700, background: '#FFFFFF' }}
                  >
                    {selectedModel.years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 900, color: '#0F2167', display: 'block', marginBottom: '0.35rem' }}>
                    4. ENGINE & TRIM VARIANT
                  </label>
                  <select
                    value={selectedVariantObj.id}
                    onChange={(e) => {
                      const v = selectedModel.variants.find(item => item.id === e.target.value);
                      if (v) setSelectedVariantObj(v);
                    }}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700, background: '#FFFFFF' }}
                  >
                    {selectedModel.variants.map(variant => (
                      <option key={variant.id} value={variant.id}>{variant.name} ({variant.engine})</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: PLATE SEARCH */}
          {modalTab === 'plate' && (
            <div style={{ padding: '0.5rem 0' }}>
              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem' }}>
                <h4 style={{ margin: '0 0 0.35rem 0', color: '#1E40AF', fontSize: '0.9rem', fontWeight: 800 }}>
                  🔍 Instant Car Reg # / VIN Search
                </h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#1E3A8A' }}>
                  Enter your car registration number (e.g., <b>MH 01 AB 1234</b>, <b>DL 01 CA 9999</b>) to auto-fill vehicle specs.
                </p>
              </div>

              <form onSubmit={handlePlateSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <input
                  type="text"
                  placeholder="Enter Car Reg Plate e.g. MH01AB1234..."
                  value={regPlateInput}
                  onChange={(e) => setRegPlateInput(e.target.value.toUpperCase())}
                  style={{ flex: 1, padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '1px' }}
                />
                <button
                  type="submit"
                  disabled={isSearchingPlate}
                  style={{ padding: '0.65rem 1.25rem', background: '#FF6B00', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  {isSearchingPlate ? 'Searching RTO...' : 'Fetch Specs'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: UNLISTED VEHICLE FORM */}
          {modalTab === 'unlisted' && (
            <form onSubmit={handleSubmitUnlisted} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.85rem', borderRadius: '10px', fontSize: '0.82rem', color: '#065F46' }}>
                Can't find your car model or rare imported vehicle? Submit request to our fitment engineering team.
              </div>
              <input
                type="text"
                placeholder="Car Make (e.g., Skoda / MG / Isuzu)"
                value={unlistedForm.make}
                onChange={(e) => setUnlistedForm({ ...unlistedForm, make: e.target.value })}
                required
                style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              />
              <input
                type="text"
                placeholder="Car Model (e.g., Octavia vRS)"
                value={unlistedForm.model}
                onChange={(e) => setUnlistedForm({ ...unlistedForm, model: e.target.value })}
                required
                style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              />
              <button type="submit" style={{ background: '#059669', color: '#FFFFFF', padding: '0.65rem', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                Submit Custom Fitment Request
              </button>
            </form>
          )}

          {/* Selected Fitment Summary Preview Banner */}
          {modalTab !== 'unlisted' && (
            <div style={{
              background: 'linear-gradient(135deg, #F8FAFC, #F1F5F9)',
              border: '1.5px solid #CBD5E1',
              borderRadius: '14px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '0.68rem', fontWeight: 900, padding: '0.15rem 0.5rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.3rem' }}>
                  <ShieldCheck size={12} /> SELECTED VEHICLE CONTEXT
                </span>
                <h4 style={{ margin: '0 0 0.15rem 0', fontSize: '1.05rem', color: '#0F2167', fontWeight: 900 }}>
                  {selectedMake.name} {selectedModel.name} ({selectedYear})
                </h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
                  {selectedVariantObj.name} • {selectedVariantObj.engine}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handleSkipVehicle}
                  style={{ background: '#E2E8F0', color: '#475569', border: 'none', borderRadius: '8px', padding: '0.65rem 1rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Skip Filter
                </button>
                <button
                  type="button"
                  onClick={handleApplyFitment}
                  style={{
                    background: 'linear-gradient(135deg, #FF6B00, #E05E00)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.65rem 1.3rem',
                    fontSize: '0.88rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(255,107,0,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Check size={18} /> Apply To Filter Spares
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
