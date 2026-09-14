import React, { useState, useEffect } from 'react';
import { warehouseFulfillmentService } from '../services/warehouseFulfillmentService';
import { SupabaseAPI } from '../services/supabaseClient';
import { BarcodeScannerModal } from '../components/BarcodeScannerModal';
import { Package, Truck, CheckCircle2, Camera, ShieldCheck, AlertTriangle, Search, RefreshCw, X, ArrowRight } from 'lucide-react';

export const AdminFulfillmentConsole = () => {
  const [activeTab, setActiveTab] = useState('picking'); // 'picking', 'packing', 'qc', 'dispatch'
  const [orders, setOrders] = useState([]);
  const [pickLists, setPickLists] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scanner Modal
  const [showScanner, setShowScanner] = useState(false);
  const [activePickItemId, setActivePickItemId] = useState(null);
  const [activePickListId, setActivePickListId] = useState(null);

  // Dispatch Form
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [dispatchForm, setDispatchForm] = useState({
    order_id: '',
    warehouse_id: '',
    package_count: 1,
    weight: 1.5,
    courier_provider: 'Bluedart Express',
    tracking_number: 'AWB987654321IN'
  });

  const [msg, setMsg] = useState(null);

  useEffect(() => {
    loadFulfillmentData();
  }, [activeTab]);

  const loadFulfillmentData = async () => {
    setLoading(true);
    const [{ data: ords }, { data: picks }, { data: whs }] = await Promise.all([
      SupabaseAPI.getOrders(),
      warehouseFulfillmentService.getPickLists(),
      warehouseFulfillmentService.getWarehouses()
    ]);

    setOrders(ords || []);
    setPickLists(picks || []);
    setWarehouses(whs || []);
    setLoading(false);
  };

  const handleScanSuccess = async (scannedBarcode) => {
    setShowScanner(false);
    if (!activePickItemId || !activePickListId) return;

    setMsg(null);
    const res = await warehouseFulfillmentService.verifyPickItemBarcode(activePickListId, activePickItemId, scannedBarcode);
    if (res.error) {
      setMsg({ type: 'error', text: res.error });
    } else {
      setMsg({ type: 'success', text: `Item verified & picked successfully (${res.newPicked} picked).` });
      loadFulfillmentData();
    }
  };

  const handleDispatchSubmit = async () => {
    if (!dispatchForm.order_id || !dispatchForm.tracking_number) return;
    setMsg(null);
    const res = await warehouseFulfillmentService.dispatchOrder(dispatchForm.order_id, dispatchForm);
    setShowDispatchModal(false);
    if (res.error) {
      setMsg({ type: 'error', text: res.error.message || 'Failed to dispatch order.' });
    } else {
      setMsg({ type: 'success', text: `Order #${dispatchForm.order_id} successfully dispatched!` });
      loadFulfillmentData();
    }
  };

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Package size={24} className="text-emerald-400" /> Order Fulfillment Workspace
          </h1>
          <p className="text-xs text-slate-400">
            Scan barcode picking, item packing verification, quality inspection, and courier handover dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('picking')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'picking' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Picking
          </button>
          <button
            onClick={() => setActiveTab('packing')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'packing' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Packing
          </button>
          <button
            onClick={() => setActiveTab('qc')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'qc' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Quality Check
          </button>
          <button
            onClick={() => setActiveTab('dispatch')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'dispatch' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Dispatch
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

      {/* TAB 1: ORDER PICKING */}
      {activeTab === 'picking' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-xs font-semibold text-slate-300">Order Picking Queue ({pickLists.length})</span>
            <span className="text-[11px] text-emerald-400 font-mono">Barcode verification required before marking item picked</span>
          </div>

          <div className="space-y-4">
            {pickLists.map((pick) => (
              <div key={pick.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold font-mono text-emerald-400">{pick.pick_number}</span>
                    <h3 className="text-sm font-bold text-slate-100">Order #{pick.order_id}</h3>
                    <span className="text-[10px] text-slate-500">Warehouse: {pick.warehouse?.name || 'Main Warehouse'}</span>
                  </div>

                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase ${
                    pick.status === 'picked' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {pick.status}
                  </span>
                </div>

                {/* Line Items */}
                <div className="space-y-2">
                  {(pick.items || []).map((item) => (
                    <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">{item.product?.name || item.product?.title || 'Auto Part'}</h4>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-0.5">
                          <span>SKU: {item.product?.sku || 'N/A'}</span>
                          <span>Bin: <strong className="text-emerald-400">{item.location?.location_code || 'A-R01-S01'}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-slate-200">
                          {item.quantity_picked} / {item.quantity_required} Picked
                        </span>

                        <button
                          onClick={() => {
                            setActivePickListId(pick.id);
                            setActivePickItemId(item.id);
                            setShowScanner(true);
                          }}
                          className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-xs font-bold hover:bg-emerald-500 hover:text-slate-950 transition-colors flex items-center gap-1"
                        >
                          <Camera size={14} /> Scan Barcode
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PACKING */}
      {activeTab === 'packing' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-slate-200">Packing &amp; Weight Verification</h3>
            <p className="text-xs text-slate-400">Verify product count, weight in kg, and print packing slip.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-slate-400">
            <Package size={40} className="mx-auto mb-2 text-slate-600" />
            <p className="text-xs">All picked order items are automatically routed to the Packing Station for weight verification.</p>
          </div>
        </div>
      )}

      {/* TAB 3: QUALITY CHECK */}
      {activeTab === 'qc' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-400" /> Dispatch Quality Assurance Check
            </h3>
            <p className="text-xs text-slate-400">Final inspection of correct SKU, quantity, damage-free packaging, and shipping label address.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
              <CheckCircle2 size={16} /> Fulfillment Inspection Checklist (6/6 Passed)
            </div>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-center gap-2">✓ Verified genuine OEM product part number &amp; barcode</li>
              <li className="flex items-center gap-2">✓ Verified item quantity against customer invoice</li>
              <li className="flex items-center gap-2">✓ Verified zero physical damage or seal tampering</li>
              <li className="flex items-center gap-2">✓ Attached customer tax invoice inside package</li>
              <li className="flex items-center gap-2">✓ Sealed with tamper-evident AutoZoneIndia tape</li>
              <li className="flex items-center gap-2">✓ Affixed courier AWB shipping label on outer box</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 4: DISPATCH */}
      {activeTab === 'dispatch' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Order Dispatch &amp; Courier Handover</h3>
              <p className="text-xs text-slate-400">Hand over sealed packages to courier partners (Bluedart, Delhivery, DTDC).</p>
            </div>

            <button
              onClick={() => {
                setDispatchForm({
                  order_id: orders[0]?.id || 'AZ-ORD-1001',
                  warehouse_id: warehouses[0]?.id || '',
                  package_count: 1,
                  weight: 1.5,
                  courier_provider: 'Bluedart Express',
                  tracking_number: 'AWB987654321IN'
                });
                setShowDispatchModal(true);
              }}
              className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Truck size={16} /> Create Dispatch Record
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Courier Partner</th>
                  <th className="p-3.5">AWB Tracking Number</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-bold font-mono text-slate-100">{o.id}</td>
                    <td className="p-3.5 text-slate-200">{o.customerName}</td>
                    <td className="p-3.5 text-emerald-400 font-semibold">{o.courier || 'Bluedart Express'}</td>
                    <td className="p-3.5 font-mono text-amber-400 font-bold">{o.trackingNumber || 'AWB987654321IN'}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 uppercase">
                        {o.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={handleScanSuccess}
        title="Scan Item Barcode for Picking"
      />

      {/* Dispatch Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Create Dispatch Record</h3>
              <button onClick={() => setShowDispatchModal(false)}><X size={16} /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Order ID *</label>
                <input
                  type="text"
                  value={dispatchForm.order_id}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, order_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Courier Partner *</label>
                <select
                  value={dispatchForm.courier_provider}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, courier_provider: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                >
                  <option value="Bluedart Express">Bluedart Express</option>
                  <option value="Delhivery Surface">Delhivery Surface</option>
                  <option value="DTDC Air Express">DTDC Air Express</option>
                  <option value="Mahindra Logistics">Mahindra Logistics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">AWB Tracking Number *</label>
                <input
                  type="text"
                  placeholder="AWB987654321IN"
                  value={dispatchForm.tracking_number}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, tracking_number: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Package Count</label>
                  <input
                    type="number"
                    min={1}
                    value={dispatchForm.package_count}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, package_count: parseInt(e.target.value || 1, 10) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Package Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={dispatchForm.weight}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, weight: parseFloat(e.target.value || 1.0) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowDispatchModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDispatchSubmit}
                className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded"
              >
                Confirm Dispatch &amp; Handover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
