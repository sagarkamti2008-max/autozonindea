import React, { useState, useEffect } from 'react';
import { warehouseFulfillmentService } from '../services/warehouseFulfillmentService';
import { SupabaseAPI } from '../services/supabaseClient';
import { ArrowRightLeft, Plus, CheckCircle2, Truck, RefreshCw, X, Shield, ArrowRight } from 'lucide-react';

export const AdminStockTransferConsole = () => {
  const [transfers, setTransfers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // Transfer Modal
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    source_warehouse_id: '',
    destination_warehouse_id: '',
    notes: '',
    items: [{ product_id: '', quantity_requested: 10 }]
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const loadData = async () => {
    setLoading(true);
    const [{ data: trs }, { data: whs }, { data: prods }] = await Promise.all([
      warehouseFulfillmentService.getStockTransfers({ status: statusFilter }),
      warehouseFulfillmentService.getWarehouses(),
      SupabaseAPI.getCatalogProducts()
    ]);

    setTransfers(trs || []);
    setWarehouses(whs || []);
    setProducts((prods || []).map(p => ({ id: p.id, name: p.name || p.title })));
    setLoading(false);
  };

  const handleCreateTransfer = async () => {
    if (!form.source_warehouse_id || !form.destination_warehouse_id || !form.items[0]?.product_id) {
      setMsg({ type: 'error', text: 'Please select Source, Destination and Product.' });
      return;
    }
    setSaving(true);
    setMsg(null);

    const res = await warehouseFulfillmentService.createStockTransfer(form, form.items);
    setSaving(false);
    if (res.error) {
      setMsg({ type: 'error', text: res.error.message || 'Failed to create transfer.' });
    } else {
      setShowModal(false);
      loadData();
    }
  };

  const handleApprove = async (id) => {
    await warehouseFulfillmentService.approveStockTransfer(id);
    loadData();
  };

  const handleShip = async (id) => {
    if (!window.confirm('Ship transfer? This will deduct physical stock from source warehouse.')) return;
    await warehouseFulfillmentService.shipStockTransfer(id);
    loadData();
  };

  const handleReceive = async (id) => {
    if (!window.confirm('Receive transfer? This will add physical stock into destination warehouse.')) return;
    await warehouseFulfillmentService.receiveStockTransfer(id);
    loadData();
  };

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ArrowRightLeft size={24} className="text-emerald-400" /> Inter-Warehouse Stock Transfers
          </h1>
          <p className="text-xs text-slate-400">
            Request, approve, ship, and receive stock movements across distribution centers with atomic inventory safety.
          </p>
        </div>

        <button
          onClick={() => {
            setForm({
              source_warehouse_id: warehouses[0]?.id || '',
              destination_warehouse_id: warehouses[1]?.id || '',
              notes: '',
              items: [{ product_id: products[0]?.id || '', quantity_requested: 10 }]
            });
            setShowModal(true);
          }}
          className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-1.5"
        >
          <Plus size={16} /> New Stock Transfer Request
        </button>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl border mb-6 text-xs flex items-center justify-between ${
          msg.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)}><X size={16} /></button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
        <span className="text-xs font-semibold text-slate-300">Transfer Movement Orders ({transfers.length})</span>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
        >
          <option value="">All Statuses</option>
          <option value="requested">Requested</option>
          <option value="approved">Approved</option>
          <option value="in_transit">In Transit</option>
          <option value="received">Received</option>
        </select>
      </div>

      {/* Transfers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading transfers...</div>
        ) : transfers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No stock transfers found.</div>
        ) : (
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3.5">Transfer Number</th>
                <th className="p-3.5">Route</th>
                <th className="p-3.5">Line Items</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 text-right">Workflow Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {transfers.map((tr) => (
                <tr key={tr.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold font-mono text-emerald-400">{tr.transfer_number}</td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                      <span>{tr.source_warehouse?.name || 'Source WH'}</span>
                      <ArrowRight size={14} className="text-slate-500" />
                      <span>{tr.destination_warehouse?.name || 'Dest WH'}</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="space-y-0.5">
                      {(tr.items || []).map((i, idx) => (
                        <div key={idx} className="text-xs text-slate-300 font-medium">
                          {i.product?.name || 'Spare Part'} - <strong className="text-emerald-400">{i.quantity_requested} units</strong>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase ${
                      tr.status === 'received' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      tr.status === 'in_transit' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                      tr.status === 'approved' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {tr.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400">
                    {new Date(tr.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    {tr.status === 'requested' && (
                      <button
                        onClick={() => handleApprove(tr.id)}
                        className="px-3 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded text-xs font-bold hover:bg-purple-500 hover:text-slate-950 transition-colors"
                      >
                        Approve Transfer
                      </button>
                    )}
                    {tr.status === 'approved' && (
                      <button
                        onClick={() => handleShip(tr.id)}
                        className="px-3 py-1.5 bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded text-xs font-bold hover:bg-sky-500 hover:text-white transition-colors"
                      >
                        Ship Stock (Deduct)
                      </button>
                    )}
                    {tr.status === 'in_transit' && (
                      <button
                        onClick={() => handleReceive(tr.id)}
                        className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-xs font-bold hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                      >
                        Receive Stock (Add)
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Create Inter-Warehouse Transfer Request</h3>
              <button onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Source Warehouse *</label>
                  <select
                    value={form.source_warehouse_id}
                    onChange={(e) => setForm({ ...form, source_warehouse_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Destination Warehouse *</label>
                  <select
                    value={form.destination_warehouse_id}
                    onChange={(e) => setForm({ ...form, destination_warehouse_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Select Product *</label>
                <select
                  value={form.items[0]?.product_id}
                  onChange={(e) => {
                    const newItems = [...form.items];
                    newItems[0].product_id = e.target.value;
                    setForm({ ...form, items: newItems });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Transfer Quantity *</label>
                <input
                  type="number"
                  min={1}
                  value={form.items[0]?.quantity_requested}
                  onChange={(e) => {
                    const newItems = [...form.items];
                    newItems[0].quantity_requested = parseInt(e.target.value || 1, 10);
                    setForm({ ...form, items: newItems });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Transfer Notes</label>
                <textarea
                  rows={2}
                  placeholder="Reason for inter-warehouse movement..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTransfer}
                disabled={saving}
                className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded"
              >
                Submit Transfer Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
