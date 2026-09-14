import React, { useState, useEffect } from 'react';
import { warehouseFulfillmentService } from '../services/warehouseFulfillmentService';
import { Building, Layers, Plus, Edit2, CheckCircle2, Search, MapPin, Phone, User, X, AlertTriangle, Shield } from 'lucide-react';

export const AdminWarehouseConsole = () => {
  const [activeTab, setActiveTab] = useState('warehouses'); // 'warehouses', 'locations', 'stock'
  const [warehouses, setWarehouses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
  const [search, setSearch] = useState('');

  // Modals
  const [showWhModal, setShowWhModal] = useState(false);
  const [whForm, setWhForm] = useState({
    id: null,
    name: '',
    code: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    contact_name: '',
    contact_phone: '',
    status: 'active',
    is_default: false
  });

  const [showLocModal, setShowLocModal] = useState(false);
  const [locForm, setLocForm] = useState({
    id: null,
    warehouse_id: '',
    zone: 'A',
    rack: 'R01',
    shelf: 'S01',
    bin: 'B01',
    status: 'active'
  });

  const [msg, setMsg] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab, selectedWarehouseId]);

  const loadData = async () => {
    setLoading(true);
    const { data: whs } = await warehouseFulfillmentService.getWarehouses();
    setWarehouses(whs || []);

    if (activeTab === 'locations') {
      const { data: locs } = await warehouseFulfillmentService.getWarehouseLocations(selectedWarehouseId);
      setLocations(locs || []);
    } else if (activeTab === 'stock') {
      const { data: stocks } = await warehouseFulfillmentService.getWarehouseStock(selectedWarehouseId);
      setStockData(stocks || []);
    }
    setLoading(false);
  };

  const handleSaveWarehouse = async () => {
    if (!whForm.name || !whForm.code) return;
    setMsg(null);
    let res;
    if (whForm.id) {
      res = await warehouseFulfillmentService.updateWarehouse(whForm.id, whForm);
    } else {
      res = await warehouseFulfillmentService.createWarehouse(whForm);
    }

    if (res.error) {
      setMsg({ type: 'error', text: res.error.message || 'Failed to save warehouse.' });
    } else {
      setShowWhModal(false);
      loadData();
    }
  };

  const handleSaveLocation = async () => {
    if (!locForm.warehouse_id) return;
    setMsg(null);
    const res = await warehouseFulfillmentService.createWarehouseLocation(locForm);
    if (res.error) {
      setMsg({ type: 'error', text: res.error.message || 'Failed to save location bin.' });
    } else {
      setShowLocModal(false);
      loadData();
    }
  };

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Building size={24} className="text-emerald-400" /> Multi-Location Warehouse Manager
          </h1>
          <p className="text-xs text-slate-400">
            Configure warehouses, bin location codes (Zone-Rack-Shelf-Bin), and view multi-warehouse inventory matrix.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('warehouses')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'warehouses' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Warehouses ({warehouses.length})
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'locations' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Location Bins
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'stock' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Stock Matrix
          </button>
        </div>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl border mb-6 text-xs flex items-center justify-between ${
          msg.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)}><X size={16} /></button>
        </div>
      )}

      {/* TAB 1: WAREHOUSES MASTER */}
      {activeTab === 'warehouses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-xs font-semibold text-slate-300">Registered Warehouses &amp; Fulfillment Centers</span>
            <button
              onClick={() => {
                setWhForm({
                  id: null,
                  name: '',
                  code: '',
                  address_line1: '',
                  address_line2: '',
                  city: '',
                  state: '',
                  pincode: '',
                  contact_name: '',
                  contact_phone: '',
                  status: 'active',
                  is_default: false
                });
                setShowWhModal(true);
              }}
              className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Plus size={16} /> Add Warehouse
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {warehouses.map((wh) => (
              <div key={wh.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-100">{wh.name}</h3>
                        {wh.is_default && (
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-emerald-400 font-mono font-semibold">{wh.code}</span>
                    </div>

                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                      wh.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {wh.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-400">
                    <p className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-500" /> {wh.address_line1}, {wh.city}, {wh.state} - {wh.pincode}</p>
                    {wh.contact_name && <p className="flex items-center gap-1.5"><User size={14} className="text-slate-500" /> Manager: {wh.contact_name}</p>}
                    {wh.contact_phone && <p className="flex items-center gap-1.5"><Phone size={14} className="text-slate-500" /> {wh.contact_phone}</p>}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800 pt-3 mt-4">
                  <button
                    onClick={() => {
                      setSelectedWarehouseId(wh.id);
                      setActiveTab('locations');
                    }}
                    className="text-xs text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Layers size={14} /> View Location Bins
                  </button>

                  <button
                    onClick={() => {
                      setWhForm(wh);
                      setShowWhModal(true);
                    }}
                    className="p-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: WAREHOUSE LOCATIONS BINS */}
      {activeTab === 'locations' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-300">Filter Warehouse:</label>
              <select
                value={selectedWarehouseId}
                onChange={(e) => setSelectedWarehouseId(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
              >
                <option value="">All Warehouses</option>
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setLocForm({
                  id: null,
                  warehouse_id: selectedWarehouseId || (warehouses[0]?.id || ''),
                  zone: 'A',
                  rack: 'R01',
                  shelf: 'S01',
                  bin: 'B01',
                  status: 'active'
                });
                setShowLocModal(true);
              }}
              className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Plus size={16} /> Add Location Bin
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="p-12 text-center text-slate-400">Loading location bins...</div>
            ) : locations.length === 0 ? (
              <div className="p-12 text-center text-slate-400">No location bins configured yet.</div>
            ) : (
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3.5">Location Code</th>
                    <th className="p-3.5">Zone</th>
                    <th className="p-3.5">Rack</th>
                    <th className="p-3.5">Shelf</th>
                    <th className="p-3.5">Bin</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {locations.map((loc) => (
                    <tr key={loc.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold font-mono text-emerald-400">{loc.location_code}</td>
                      <td className="p-3.5 font-semibold text-slate-200">{loc.zone}</td>
                      <td className="p-3.5 text-slate-300">{loc.rack}</td>
                      <td className="p-3.5 text-slate-300">{loc.shelf}</td>
                      <td className="p-3.5 text-slate-300">{loc.bin}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 uppercase">
                          {loc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MULTI-WAREHOUSE STOCK MATRIX */}
      {activeTab === 'stock' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-xs font-semibold text-slate-300">Multi-Warehouse Inventory Stock Matrix</span>
            <span className="text-[11px] text-emerald-400 font-mono">Formula: Available = Physical - Reserved - Damaged</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="p-12 text-center text-slate-400">Fetching inventory stock...</div>
            ) : stockData.length === 0 ? (
              <div className="p-12 text-center text-slate-400">No inventory stock records found.</div>
            ) : (
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3.5">Product Title</th>
                    <th className="p-3.5">Warehouse</th>
                    <th className="p-3.5">Bin Location</th>
                    <th className="p-3.5">Physical Qty</th>
                    <th className="p-3.5">Reserved</th>
                    <th className="p-3.5">Damaged</th>
                    <th className="p-3.5">Available Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {stockData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold text-slate-100">
                        <div>{item.product?.name || item.product?.title || 'Auto Part'}</div>
                        <div className="text-[10px] text-slate-500 font-mono">SKU: {item.product?.sku || item.product_id}</div>
                      </td>
                      <td className="p-3.5 text-slate-300 font-medium">
                        {item.warehouse?.name || 'Main Warehouse'}
                      </td>
                      <td className="p-3.5 font-mono text-emerald-400">
                        {item.location?.location_code || 'UNASSIGNED'}
                      </td>
                      <td className="p-3.5 font-bold text-slate-100">{item.quantity}</td>
                      <td className="p-3.5 text-amber-400 font-semibold">{item.reserved_quantity}</td>
                      <td className="p-3.5 text-red-400 font-semibold">{item.damaged_quantity}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 text-xs font-extrabold rounded-lg ${
                          item.availableQuantity === 0 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          item.isLowStock ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {item.availableQuantity} units
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Warehouse Modal */}
      {showWhModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">{whForm.id ? 'Edit Warehouse' : 'New Warehouse'}</h3>
              <button onClick={() => setShowWhModal(false)}><X size={16} /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Warehouse Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Bangalore North Central Fulfillment"
                  value={whForm.name}
                  onChange={(e) => setWhForm({ ...whForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Warehouse Code * (Unique)</label>
                <input
                  type="text"
                  placeholder="WH-BLR-01"
                  value={whForm.code}
                  onChange={(e) => setWhForm({ ...whForm, code: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Address Line 1 *</label>
                <input
                  type="text"
                  value={whForm.address_line1}
                  onChange={(e) => setWhForm({ ...whForm, address_line1: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    value={whForm.city}
                    onChange={(e) => setWhForm({ ...whForm, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    value={whForm.state}
                    onChange={(e) => setWhForm({ ...whForm, state: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={whForm.pincode}
                    onChange={(e) => setWhForm({ ...whForm, pincode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs text-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowWhModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWarehouse}
                className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded"
              >
                Save Warehouse
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {showLocModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Add Location Bin</h3>
              <button onClick={() => setShowLocModal(false)}><X size={16} /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Target Warehouse *</label>
                <select
                  value={locForm.warehouse_id}
                  onChange={(e) => setLocForm({ ...locForm, warehouse_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                >
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Zone (e.g. A)</label>
                  <input
                    type="text"
                    value={locForm.zone}
                    onChange={(e) => setLocForm({ ...locForm, zone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Rack (e.g. R01)</label>
                  <input
                    type="text"
                    value={locForm.rack}
                    onChange={(e) => setLocForm({ ...locForm, rack: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Shelf (e.g. S02)</label>
                  <input
                    type="text"
                    value={locForm.shelf}
                    onChange={(e) => setLocForm({ ...locForm, shelf: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Bin (e.g. B03)</label>
                  <input
                    type="text"
                    value={locForm.bin}
                    onChange={(e) => setLocForm({ ...locForm, bin: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowLocModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLocation}
                className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded"
              >
                Save Location Bin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
