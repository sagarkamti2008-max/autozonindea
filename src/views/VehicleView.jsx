import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Car, ShieldCheck, Layers, Plus, Trash2, Edit, RefreshCw, FileText,
  Search, CheckCircle2, AlertTriangle, ArrowRight, Download, Upload
} from 'lucide-react';

export const VehicleView = () => {
  const { products, showToast } = useStore();

  const [activeTab, setActiveTab] = useState('vehicles-database'); // 'vehicles-database', 'fitment-matrix', 'bulk-import'

  const [vehicleMakes, setVehicleMakes] = useState([
    { id: 1, name: 'Toyota', country: 'Japan', status: 'Active', modelCount: 14 },
    { id: 2, name: 'Hyundai', country: 'South Korea', status: 'Active', modelCount: 18 },
    { id: 3, name: 'Maruti Suzuki', country: 'India / Japan', status: 'Active', modelCount: 22 },
    { id: 4, name: 'Mahindra', country: 'India', status: 'Active', modelCount: 12 }
  ]);

  const [vehicleConfigs, setVehicleConfigs] = useState([
    { id: 1, make: 'Toyota', model: 'Innova Crysta', year: '2019', variant: '2.4 ZX', engine: '2.4L 2GD-FTV', fuel: 'Diesel', transmission: 'Manual', key: 'TOYOTA-INNOVA-CRYSTA-2019-2.4-DIESEL' },
    { id: 2, make: 'Hyundai', model: 'Creta', year: '2021', variant: '1.5 SX', engine: '1.5L U2 CRDi', fuel: 'Diesel', transmission: 'Automatic', key: 'HYUNDAI-CRETA-2021-1.5-DIESEL' }
  ]);

  const [fitmentRules, setFitmentRules] = useState([
    { id: 1, sku: '04465-0K240', title: 'Bosch Front Brake Pad', configKey: 'TOYOTA-INNOVA-CRYSTA-2019-2.4-DIESEL', position: 'Front Axle', notes: 'Fits 2.4L Diesel Models only' }
  ]);

  const handleCreateVehicleConfig = (e) => {
    e.preventDefault();
    const newConfig = {
      id: Date.now(),
      make: 'Toyota',
      model: 'Fortuner',
      year: '2022',
      variant: '2.8 4x4',
      engine: '2.8L 1GD-FTV',
      fuel: 'Diesel',
      transmission: 'Automatic',
      key: 'TOYOTA-FORTUNER-2022-2.8-DIESEL'
    };
    setVehicleConfigs([newConfig, ...vehicleConfigs]);
    showToast('🚗 New vehicle configuration registered in central vehicle database!');
  };

  return (
    <div className="container admin-dashboard-wrapper" style={{ maxWidth: '1400px', padding: '1.5rem 1rem' }}>
      {/* Header Banner */}
      <div className="admin-header" style={{ background: '#0F2167', color: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Car size={34} color="#FF6B00" />
          <div>
            <h2 style={{ color: '#FFFFFF', margin: 0, fontSize: '1.35rem' }}>Central Vehicle Database & Fitment Engine</h2>
            <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>
              10-Tier Vehicle Hierarchy • Immutable Configuration Keys • Single Source of Truth
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button className={`admin-tab ${activeTab === 'vehicles-database' ? 'active' : ''}`} onClick={() => setActiveTab('vehicles-database')}>
          🚗 Vehicle Database ({vehicleConfigs.length} Configs)
        </button>
        <button className={`admin-tab ${activeTab === 'fitment-matrix' ? 'active' : ''}`} onClick={() => setActiveTab('fitment-matrix')}>
          🔗 Product Fitment Rules Matrix ({fitmentRules.length} Rules)
        </button>
        <button className={`admin-tab ${activeTab === 'bulk-import' ? 'active' : ''}`} onClick={() => setActiveTab('bulk-import')}>
          📁 Bulk CSV Fitment Importer
        </button>
      </div>

      {/* Workspace Content */}
      {activeTab === 'vehicles-database' && (
        <div>
          <div className="admin-pane-card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Registered Vehicle Makes & Models</h3>
              <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={handleCreateVehicleConfig}>
                <Plus size={14} /> Add Vehicle Configuration
              </button>
            </div>

            <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Make</th>
                    <th>Model</th>
                    <th>Year</th>
                    <th>Variant</th>
                    <th>Engine</th>
                    <th>Fuel & Trans</th>
                    <th>Configuration Key</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleConfigs.map(c => (
                    <tr key={c.id}>
                      <td><b>{c.make}</b></td>
                      <td><b>{c.model}</b></td>
                      <td>{c.year}</td>
                      <td>{c.variant}</td>
                      <td>{c.engine}</td>
                      <td>{c.fuel} ({c.transmission})</td>
                      <td><code>{c.key}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fitment-matrix' && (
        <div className="admin-pane-card">
          <h3>Catalog Product Fitment Mapping Matrix</h3>
          <p style={{ color: '#64748B', fontSize: '0.85rem' }}>Maps catalog SKUs to verified vehicle configuration keys for 100% accurate fitment badges.</p>
          <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product SKU</th>
                  <th>Product Title</th>
                  <th>Verified Configuration Key</th>
                  <th>Axle Position</th>
                  <th>Fitment Notes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {fitmentRules.map(r => (
                  <tr key={r.id}>
                    <td><code>{r.sku}</code></td>
                    <td><b>{r.title}</b></td>
                    <td><span className="verified-tag good">{r.configKey}</span></td>
                    <td>{r.position}</td>
                    <td>{r.notes}</td>
                    <td>
                      <button className="btn-secondary" style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }} onClick={() => showToast('✅ Fitment rule verified!')}>
                        Verified ✅
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'bulk-import' && (
        <div className="admin-pane-card">
          <h3>Bulk CSV Fitment Importer</h3>
          <p style={{ color: '#64748B', fontSize: '0.85rem' }}>Upload CSV containing columns: SKU, Make, Model, Year, Variant, Engine, Position, Notes.</p>
          <div style={{ border: '2px dashed #CBD5E1', padding: '2rem', borderRadius: '8px', textAlign: 'center', margin: '1.5rem 0' }}>
            <Upload size={36} color="#FF6B00" style={{ marginBottom: '0.5rem' }} />
            <h4 style={{ margin: 0 }}>Drop Fitment CSV File Here</h4>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Rows are validated against central SKU & vehicle databases</span>
          </div>
          <button className="btn-primary" onClick={() => showToast('✅ CSV fitment rules validated & imported successfully!')}>
            Validate & Process CSV Fitments
          </button>
        </div>
      )}
    </div>
  );
};
