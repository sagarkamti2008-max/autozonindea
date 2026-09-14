import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  VERIFIED_VEHICLE_MASTER_DATA,
  parseCSVStringToRows,
  validateVehicleCSVRows,
  exportVehiclesToCSVString
} from '../services/vehicleMasterService';
import {
  Car, Database, Upload, Download, Plus, CheckCircle2, AlertTriangle,
  XCircle, Filter, Search, ShieldCheck, RefreshCw, FileText, ChevronRight,
  Edit, Trash2, Check, ExternalLink, Layers, ArrowRight
} from 'lucide-react';

export const AdminVehicleMasterConsole = () => {
  const { showToast } = useStore();

  const [activeTab, setActiveTab] = useState('explorer'); // 'explorer' | 'add' | 'import' | 'export'
  const [vehicleList, setVehicleList] = useState(() => {
    try {
      const saved = localStorage.getItem('autozon_master_vehicles');
      return saved ? JSON.parse(saved) : VERIFIED_VEHICLE_MASTER_DATA;
    } catch (e) {
      return VERIFIED_VEHICLE_MASTER_DATA;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('autozon_master_vehicles', JSON.stringify(vehicleList));
    } catch(e) {}
  }, [vehicleList]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMfrFilter, setSelectedMfrFilter] = useState('all');

  // CSV Import State
  const [csvRawText, setCsvRawText] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  // Manual Add Form State
  const [formType, setFormType] = useState('variant'); // 'manufacturer' | 'model' | 'generation' | 'variant'
  const [newVehicleForm, setNewVehicleForm] = useState({
    manufacturer: 'Toyota',
    country: 'Japan',
    model: 'Corolla',
    body_type: 'Sedan',
    generation: '12th Gen (E210)',
    generation_code: 'E210',
    gen_year_from: 2019,
    gen_year_to: 2026,
    variant: '1.8 Hybrid VX',
    engine: '1.8L 2ZR-FXE Hybrid I4',
    engine_cc: 1798,
    fuel_type: 'Hybrid',
    transmission: 'CVT',
    drivetrain: 'FWD',
    power: '121 bhp',
    var_year_from: 2019,
    var_year_to: 2026,
    source_name: 'Verified OEM Technical Specsheet',
    source_url: 'https://www.toyota.com',
    source_confidence: 1.00
  });

  // Handle CSV Upload File Read
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setCsvRawText(text);
      runCSVValidation(text);
    };
    reader.readAsText(file);
  };

  // Run validation on raw CSV text
  const runCSVValidation = (text) => {
    const rawRows = parseCSVStringToRows(text);
    if (rawRows.length === 0) {
      showToast('❌ Invalid CSV file format or empty rows.', 'error');
      setValidationResult(null);
      return;
    }
    const result = validateVehicleCSVRows(rawRows, vehicleList);
    setValidationResult(result);
    if (result.errors.length === 0) {
      showToast(`✅ CSV Validation Passed! ${result.validRowsCount} valid rows ready for import.`);
    } else {
      showToast(`⚠️ Validation found ${result.errors.length} errors. Please fix before importing.`, 'error');
    }
  };

  // Confirm Import CSV Rows into Master State
  const handleConfirmImport = () => {
    if (!validationResult || validationResult.validRows.length === 0) return;

    setIsImporting(true);
    setTimeout(() => {
      setVehicleList(prev => [...validationResult.validRows, ...prev]);
      setIsImporting(false);
      showToast(`🚀 Successfully imported ${validationResult.validRowsCount} verified vehicle variants!`);
      setValidationResult(null);
      setCsvRawText('');
      setActiveTab('explorer');
    }, 600);
  };

  // Download Sample CSV Template
  const handleDownloadSampleCSV = () => {
    const sampleCSV = `manufacturer,model,generation,variant,year_from,year_to,fuel_type,transmission,engine,engine_cc,body_type,country,source,source_url
Toyota,Camry,8th Gen (XV70),2.5 Hybrid Luxury,2019,2026,Hybrid,CVT,2.5L A25A-FXS I4,2487,Sedan,Japan,Toyota Official,https://toyota.com
Maruti Suzuki,Brezza,2nd Gen (K15C),ZXi Plus AT,2022,2026,Petrol,6-Speed Automatic,1.5L K15C Smart Hybrid,1462,SUV,India,Maruti Arena,https://marutisuzuki.com`;

    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'autozon_vehicle_master_import_sample.csv';
    a.click();
    showToast('📥 Sample Vehicle Master CSV downloaded!');
  };

  // Handle Export Dataset
  const handleExportCSV = () => {
    const csvStr = exportVehiclesToCSVString(vehicleList);
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autozon_vehicle_master_export_${Date.now()}.csv`;
    a.click();
    showToast(`📦 Exported ${vehicleList.length} verified vehicle records to CSV!`);
  };

  // Handle Manual Add Vehicle Submit
  const handleManualAddSubmit = (e) => {
    e.preventDefault();

    // Duplicate Check
    const isDup = vehicleList.some(v => 
      (v.manufacturer || v.make || '').toLowerCase() === newVehicleForm.manufacturer.toLowerCase() &&
      (v.model || '').toLowerCase() === newVehicleForm.model.toLowerCase() &&
      (v.variant || '').toLowerCase() === newVehicleForm.variant.toLowerCase() &&
      (v.fuel_type || v.fuel || '').toLowerCase() === newVehicleForm.fuel_type.toLowerCase() &&
      (v.var_year_from || v.year_from) === parseInt(newVehicleForm.var_year_from, 10)
    );

    if (isDup) {
      showToast(`⚠️ Duplicate Vehicle Variant detected! "${newVehicleForm.manufacturer} ${newVehicleForm.model} ${newVehicleForm.variant}" already exists.`, 'error');
      return;
    }

    setVehicleList([newVehicleForm, ...vehicleList]);
    showToast(`🎉 Added new verified vehicle variant: ${newVehicleForm.manufacturer} ${newVehicleForm.model} (${newVehicleForm.variant})!`);
    setActiveTab('explorer');
  };

  // Unique Manufacturers for Filter
  const uniqueManufacturers = Array.from(new Set(vehicleList.map(v => v.manufacturer || v.make)));

  // Filtered List
  const filteredVehicles = vehicleList.filter(v => {
    const mfr = v.manufacturer || v.make || '';
    if (selectedMfrFilter !== 'all' && mfr !== selectedMfrFilter) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchMfr = mfr.toLowerCase().includes(q);
      const matchMdl = (v.model || '').toLowerCase().includes(q);
      const matchGen = (v.generation || '').toLowerCase().includes(q);
      const matchVar = (v.variant || '').toLowerCase().includes(q);
      const matchEngine = (v.engine || '').toLowerCase().includes(q);
      if (!matchMfr && !matchMdl && !matchGen && !matchVar && !matchEngine) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Banner Header */}
      <div className="bg-slate-900 border-b border-slate-800 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-400 font-black text-xs px-2.5 py-1 rounded-full uppercase tracking-wider border border-amber-500/30">
                Enterprise Tier
              </span>
              <span className="text-slate-400 text-xs font-semibold">• Scalable 6-Tier Master Data System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-center gap-3">
              <Car className="w-8 h-8 text-amber-500" />
              <span>Vehicle Master Data Console</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Manage Make $\rightarrow$ Model $\rightarrow$ Generation $\rightarrow$ Variant hierarchy, validate CSV imports, prevent duplicates, and inspect verified OEM specification sources.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadSampleCSV}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-emerald-400" /> Sample CSV
            </button>

            <button
              onClick={() => setActiveTab('import')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center gap-2"
            >
              <Upload className="w-4 h-4" /> Import CSV Data
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 rounded-2xl p-1 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex-1 py-3 px-6 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'explorer' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" /> Vehicle Hierarchy Explorer ({filteredVehicles.length})
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 py-3 px-6 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'add' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" /> Add Single Record
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-3 px-6 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'import' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4" /> CSV Importer & Validator
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-3 px-6 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'export' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-4 h-4" /> CSV Dataset Exporter
          </button>
        </div>


        {/* =============================================================
            TAB 1: VEHICLE HIERARCHY EXPLORER
        ============================================================= */}
        {activeTab === 'explorer' && (
          <div className="space-y-6">
            
            {/* Search & Filter Toolbar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
              
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Make, Model, Generation, Variant, Engine, or Fuel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedMfrFilter}
                  onChange={(e) => setSelectedMfrFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 flex-1 md:flex-initial"
                >
                  <option value="all">All Manufacturers ({uniqueManufacturers.length})</option>
                  {uniqueManufacturers.map((mfr, idx) => (
                    <option key={idx} value={mfr}>{mfr}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Vehicle Master Data Cards Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                      <th className="py-3.5 px-4">Manufacturer</th>
                      <th className="py-3.5 px-4">Model & Body</th>
                      <th className="py-3.5 px-4">Generation</th>
                      <th className="py-3.5 px-4">Variant & Specs</th>
                      <th className="py-3.5 px-4">Years</th>
                      <th className="py-3.5 px-4">Fuel & Trans</th>
                      <th className="py-3.5 px-4">Source & Confidence</th>
                      <th className="py-3.5 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {filteredVehicles.map((v, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4 font-black text-white">
                          {v.manufacturer || v.make}
                          <div className="text-[10px] text-slate-400 font-normal">{v.country || 'Global'}</div>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-slate-200">
                          {v.model}
                          <span className="ml-2 text-[10px] bg-slate-800 text-amber-400 font-semibold px-2 py-0.5 rounded">
                            {v.body_type || 'SUV/Sedan'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-300 font-medium">
                          {v.generation}
                          {v.generation_code && (
                            <div className="text-[10px] text-slate-500 font-mono">[{v.generation_code}]</div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-amber-400">{v.variant}</div>
                          <div className="text-[11px] text-slate-400">{v.engine} ({v.engine_cc ? `${v.engine_cc} cc` : 'N/A'})</div>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-300">
                          {v.var_year_from || v.year_from} – {v.var_year_to || v.year_to || 'Present'}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-emerald-400">{v.fuel_type || v.fuel}</span>
                          <div className="text-[10px] text-slate-400">{v.transmission}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-[11px] text-slate-300 font-medium truncate max-w-xs">{v.source_name || 'Verified Specs'}</div>
                          <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Confidence: {v.source_confidence ? `${Math.round(v.source_confidence * 100)}%` : '100%'}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}


        {/* =============================================================
            TAB 2: ADD SINGLE RECORD FORM
        ============================================================= */}
        {activeTab === 'add' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto shadow-2xl">
            <div className="border-b border-slate-800 pb-4 mb-6">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                <span>Add Verified Vehicle Record</span>
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Enter verified OEM specifications. System will check for duplicates before saving.
              </p>
            </div>

            <form onSubmit={handleManualAddSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Manufacturer Name *</label>
                  <input
                    type="text"
                    required
                    value={newVehicleForm.manufacturer}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, manufacturer: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Country of Origin</label>
                  <input
                    type="text"
                    value={newVehicleForm.country}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, country: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Model Name *</label>
                  <input
                    type="text"
                    required
                    value={newVehicleForm.model}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, model: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Body Type</label>
                  <select
                    value={newVehicleForm.body_type}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, body_type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="SUV">SUV / Crossover</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="MUV">MUV / MPV</option>
                    <option value="Coupe">Coupe</option>
                    <option value="Convertible">Convertible</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Generation Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2nd Generation (AN140)"
                    value={newVehicleForm.generation}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, generation: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Variant Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2.4 ZX AT"
                    value={newVehicleForm.variant}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, variant: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Fuel Type *</label>
                  <select
                    value={newVehicleForm.fuel_type}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, fuel_type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="EV">Electric (EV)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Transmission *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 6-Speed Automatic"
                    value={newVehicleForm.transmission}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, transmission: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Engine Displacement (cc)</label>
                  <input
                    type="number"
                    placeholder="e.g. 2393"
                    value={newVehicleForm.engine_cc}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, engine_cc: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Year From *</label>
                  <input
                    type="number"
                    required
                    value={newVehicleForm.var_year_from}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, var_year_from: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Year To (Leave blank if present)</label>
                  <input
                    type="number"
                    value={newVehicleForm.var_year_to}
                    onChange={(e) => setNewVehicleForm({ ...newVehicleForm, var_year_to: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Verified Source Name / URL</label>
                <input
                  type="text"
                  placeholder="e.g. Official OEM Brochure / Specsheet URL"
                  value={newVehicleForm.source_name}
                  onChange={(e) => setNewVehicleForm({ ...newVehicleForm, source_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('explorer')}
                  className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition cursor-pointer"
                >
                  Save Verified Record
                </button>
              </div>

            </form>
          </div>
        )}


        {/* =============================================================
            TAB 3: CSV IMPORTER & VALIDATOR
        ============================================================= */}
        {activeTab === 'import' && (
          <div className="space-y-8">
            
            {/* File Dropzone & Instructions */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-black text-white mb-2 flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-500" />
                <span>Upload Vehicle Master CSV File</span>
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                System enforces strict validation for required columns (`manufacturer`, `model`, `generation`, `variant`, `year_from`, `fuel_type`, `transmission`), validates numeric year limits, and detects internal/database duplicates before importing.
              </p>

              <div className="border-2 border-dashed border-slate-800 hover:border-amber-500/60 rounded-2xl p-8 text-center transition bg-slate-950/60 flex flex-col items-center justify-center cursor-pointer relative group">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-3 group-hover:scale-110 transition">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="font-extrabold text-white text-sm">Drag & drop your CSV file here or click to browse</div>
                <div className="text-xs text-slate-500 mt-1">Supports `.csv` files up to 10 MB</div>
              </div>
            </div>

            {/* Validation Results Panel */}
            {validationResult && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
                
                {/* Validation Summary Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h4 className="text-base font-black text-white flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span>Validation Report Summary</span>
                    </h4>
                    <div className="text-xs text-slate-400 mt-1">
                      Total Rows: <strong>{validationResult.totalRows}</strong> • Valid Rows: <strong className="text-emerald-400">{validationResult.validRowsCount}</strong>
                    </div>
                  </div>

                  <button
                    disabled={validationResult.errors.length > 0 || isImporting}
                    onClick={handleConfirmImport}
                    className={`px-6 py-3 rounded-xl font-black text-xs transition shadow-lg flex items-center gap-2 ${
                      validationResult.errors.length > 0 
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25 cursor-pointer'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isImporting ? 'Importing Data...' : `Confirm & Import ${validationResult.validRowsCount} Rows`}</span>
                  </button>
                </div>

                {/* Errors List */}
                {validationResult.errors.length > 0 && (
                  <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 space-y-2">
                    <div className="font-extrabold text-rose-400 text-xs flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      <span>Errors Found ({validationResult.errors.length}) – Must fix to proceed:</span>
                    </div>
                    <ul className="list-disc list-inside text-xs text-rose-300 space-y-1">
                      {validationResult.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings List */}
                {validationResult.warnings.length > 0 && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-2">
                    <div className="font-extrabold text-amber-400 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Warnings ({validationResult.warnings.length}):</span>
                    </div>
                    <ul className="list-disc list-inside text-xs text-amber-300 space-y-1">
                      {validationResult.warnings.map((warn, i) => (
                        <li key={i}>{warn}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Valid Rows Preview Table */}
                {validationResult.validRows.length > 0 && (
                  <div>
                    <h5 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3">
                      Valid Records Preview ({validationResult.validRows.length})
                    </h5>
                    <div className="border border-slate-800 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="py-2.5 px-3">Row #</th>
                            <th className="py-2.5 px-3">Manufacturer</th>
                            <th className="py-2.5 px-3">Model</th>
                            <th className="py-2.5 px-3">Generation</th>
                            <th className="py-2.5 px-3">Variant</th>
                            <th className="py-2.5 px-3">Year From-To</th>
                            <th className="py-2.5 px-3">Fuel</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {validationResult.validRows.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-800/40">
                              <td className="py-2 px-3 font-mono text-slate-500">{row._rowIndex || i + 2}</td>
                              <td className="py-2 px-3 font-bold text-white">{row.manufacturer}</td>
                              <td className="py-2 px-3 text-slate-300">{row.model}</td>
                              <td className="py-2 px-3 text-slate-400">{row.generation}</td>
                              <td className="py-2 px-3 text-amber-400 font-semibold">{row.variant}</td>
                              <td className="py-2 px-3 text-slate-300">{row.year_from} - {row.year_to || 'Present'}</td>
                              <td className="py-2 px-3 text-emerald-400 font-bold">{row.fuel_type}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        )}


        {/* =============================================================
            TAB 4: CSV DATASET EXPORTER
        ============================================================= */}
        {activeTab === 'export' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-2xl mx-auto text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mx-auto">
              <Download className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white">Export Verified Vehicle Master CSV</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
                Download the complete dataset of verified vehicle specifications, generations, variants, and source metadata formatted for backup or external API sync.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs text-slate-300 flex items-center justify-between">
              <span>Total Vehicle Variants: <strong>{vehicleList.length} Records</strong></span>
              <span className="text-emerald-400 font-bold">✓ Ready for Export</span>
            </div>

            <button
              onClick={handleExportCSV}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-slate-950 font-black text-sm py-4 rounded-xl shadow-lg shadow-amber-500/25 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span>Download Verified Dataset (.CSV)</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
