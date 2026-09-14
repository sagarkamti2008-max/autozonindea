import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Search, Filter, RefreshCw, CheckCircle, Package, Truck, AlertTriangle, Download, X, Eye, FileText } from 'lucide-react';
import { fetchPurchaseOrders, createPurchaseOrder, receivePOItems, cancelPurchaseOrder, fetchSuppliers } from '../services/supplierPurchaseService';
import { exportReportToCSV } from '../services/adminAnalyticsEngine';
import { useStore } from '../context/StoreContext';

export default function AdminPurchaseOrderConsole() {
  const { products, showToast } = useStore();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');

  // Create PO Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [poForm, setPoForm] = useState({
    supplier_id: '',
    expected_date: '',
    tax_amount: 0,
    discount_amount: 0,
    shipping_amount: 0,
    notes: '',
    items: [
      { product_id: '', quantity_ordered: 10, unit_purchase_price: 500 }
    ]
  });

  // Receive Stock Modal State
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [selectedPOForReceiving, setSelectedPOForReceiving] = useState(null);
  const [receivingInputs, setReceivingInputs] = useState({}); // { item_id: newlyReceivedQty }

  const loadData = async () => {
    setLoading(true);
    try {
      const [poData, supData] = await Promise.all([
        fetchPurchaseOrders(statusFilter, supplierFilter),
        fetchSuppliers()
      ]);
      setPurchaseOrders(poData);
      setSuppliers(supData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, supplierFilter]);

  const handleAddPoItemRow = () => {
    setPoForm({
      ...poForm,
      items: [...poForm.items, { product_id: '', quantity_ordered: 10, unit_purchase_price: 500 }]
    });
  };

  const handleRemovePoItemRow = (idx) => {
    const updated = poForm.items.filter((_, i) => i !== idx);
    setPoForm({ ...poForm, items: updated });
  };

  const handlePoItemChange = (idx, field, val) => {
    const updated = [...poForm.items];
    updated[idx][field] = val;

    // Auto fill unit price from selected product if available
    if (field === 'product_id') {
      const prod = products.find(p => p.id === val);
      if (prod) {
        updated[idx].unit_purchase_price = prod.costPrice || Math.round(prod.price * 0.7);
      }
    }

    setPoForm({ ...poForm, items: updated });
  };

  const handleCreatePOSubmit = async (e) => {
    e.preventDefault();
    if (!poForm.supplier_id) {
      showToast('Please select a supplier.', 'error');
      return;
    }
    const validItems = poForm.items.filter(i => i.product_id && i.quantity_ordered > 0);
    if (!validItems.length) {
      showToast('Please add at least 1 valid product line item.', 'error');
      return;
    }

    try {
      const res = await createPurchaseOrder({
        ...poForm,
        items: validItems
      });
      showToast(`🎉 Purchase Order #${res.poNumber} created successfully!`, 'success');
      setIsCreateModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Failed to create PO: ' + err.message, 'error');
    }
  };

  const handleOpenReceiveModal = (po) => {
    setSelectedPOForReceiving(po);
    const initialInputs = {};
    po.purchase_order_items?.forEach(item => {
      const remaining = Math.max(0, item.quantity_ordered - item.quantity_received);
      initialInputs[item.id] = remaining; // Default to receiving remaining
    });
    setReceivingInputs(initialInputs);
    setIsReceiveModalOpen(true);
  };

  const handleConfirmStockReceive = async () => {
    if (!selectedPOForReceiving) return;

    const receivingMap = {};
    for (const item of selectedPOForReceiving.purchase_order_items) {
      const newlyRec = Number(receivingInputs[item.id]) || 0;
      const remaining = Math.max(0, item.quantity_ordered - item.quantity_received);

      if (newlyRec > remaining) {
        showToast(`Over-receiving prevented! Item #${item.id} max remaining is ${remaining}.`, 'error');
        return;
      }

      receivingMap[item.id] = {
        newlyReceivedQty: newlyRec,
        productId: item.product_id,
        unitPrice: item.unit_purchase_price
      };
    }

    try {
      const res = await receivePOItems({
        purchaseOrderId: selectedPOForReceiving.id,
        receivingMap
      });
      showToast(`✅ Stock Received! PO status updated to '${res.newStatus}'`, 'success');
      setIsReceiveModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Stock receiving failed: ' + err.message, 'error');
    }
  };

  const handleCancelPO = async (poId, poNumber) => {
    if (!window.confirm(`Are you sure you want to cancel Purchase Order #${poNumber}?`)) return;
    try {
      await cancelPurchaseOrder(poId, 'Cancelled by admin');
      showToast(`Purchase Order #${poNumber} cancelled.`);
      loadData();
    } catch (err) {
      showToast('Cancel failed: ' + err.message, 'error');
    }
  };

  const handleExportCSV = () => {
    if (!purchaseOrders.length) return;
    const exportRows = purchaseOrders.map(p => ({
      PO_Number: p.purchase_order_number,
      Supplier: p.suppliers?.company_name || 'N/A',
      Order_Date: p.order_date,
      Expected_Date: p.expected_date || 'N/A',
      Items_Count: p.purchase_order_items?.length || 0,
      Subtotal: p.subtotal,
      Total_Amount: p.total_amount,
      Status: p.status
    }));
    exportReportToCSV('AutoZoneIndia_Purchase_Orders', exportRows);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingCart className="text-amber-500" /> Purchase Orders & Stock Receiving
          </h1>
          <p className="text-slate-400 text-sm">
            Generate POs, track vendor fulfillment, receive stock atomically, and update inventory
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={() => {
              setPoForm({
                supplier_id: suppliers[0]?.id || '',
                expected_date: '',
                tax_amount: 0,
                discount_amount: 0,
                shipping_amount: 0,
                notes: '',
                items: [{ product_id: products[0]?.id || '', quantity_ordered: 10, unit_purchase_price: 500 }]
              });
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/20"
          >
            <Plus size={16} /> Create Purchase Order
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <span className="text-slate-400 font-medium">Supplier:</span>
          <select
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-white px-3 py-1.5 rounded-lg font-semibold"
          >
            <option value="all">All Suppliers</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.company_name}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Status:</span>
          {['all', 'draft', 'sent', 'partially_received', 'received', 'cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold uppercase transition ${
                statusFilter === st ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Purchase Orders Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <RefreshCw className="animate-spin mx-auto text-amber-500 mb-2" size={28} />
          <p className="text-sm font-medium">Loading Purchase Orders database...</p>
        </div>
      ) : purchaseOrders.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl">
          <ShoppingCart size={48} className="mx-auto mb-3 text-slate-600 opacity-60" />
          <p className="text-base font-semibold text-slate-300">No purchase orders found.</p>
          <p className="text-xs text-slate-500 mt-1">Create a new PO to begin procurement workflow.</p>
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 text-xs uppercase border-b border-slate-800">
                  <th className="p-4">PO Number & Date</th>
                  <th className="p-4">Supplier</th>
                  <th className="p-4 text-center">Items Count</th>
                  <th className="p-4 text-right">Total Amount (₹)</th>
                  <th className="p-4">Expected Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {purchaseOrders.map(po => (
                  <tr key={po.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <span className="font-mono font-bold text-amber-400 text-sm block">
                        {po.purchase_order_number}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(po.order_date).toLocaleDateString('en-IN')}
                      </span>
                    </td>
                    <td className="p-4">
                      <strong className="text-white block">{po.suppliers?.company_name || 'N/A'}</strong>
                      <span className="text-slate-400 text-[11px]">{po.suppliers?.supplier_code}</span>
                    </td>
                    <td className="p-4 text-center font-bold text-slate-200">
                      {po.purchase_order_items?.length || 0} line items
                    </td>
                    <td className="p-4 text-right font-black text-emerald-400 text-sm">
                      ₹{Number(po.total_amount).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-slate-300">
                      {po.expected_date ? new Date(po.expected_date).toLocaleDateString('en-IN') : <span className="text-slate-500 italic">Not set</span>}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-extrabold ${
                        po.status === 'received' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        po.status === 'partially_received' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                        po.status === 'sent' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                        po.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {po.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {po.status !== 'received' && po.status !== 'cancelled' && (
                        <button
                          onClick={() => handleOpenReceiveModal(po)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow"
                        >
                          Receive Stock
                        </button>
                      )}
                      {po.status !== 'cancelled' && po.status !== 'received' && (
                        <button
                          onClick={() => handleCancelPO(po.id, po.purchase_order_number)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-red-950 text-red-400 rounded-lg text-xs font-semibold transition"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Purchase Order Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="text-amber-500" size={18} /> Create Supplier Purchase Order
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreatePOSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Select Supplier *</label>
                  <select
                    required
                    value={poForm.supplier_id}
                    onChange={(e) => setPoForm({ ...poForm, supplier_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl text-xs font-semibold"
                  >
                    <option value="">-- Select Vendor --</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.company_name} ({s.supplier_code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Expected Delivery Date</label>
                  <input
                    type="date"
                    value={poForm.expected_date}
                    onChange={(e) => setPoForm({ ...poForm, expected_date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Line Items Builder */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Purchase Order Line Items</h4>
                  <button
                    type="button"
                    onClick={handleAddPoItemRow}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Line Item
                  </button>
                </div>

                {poForm.items.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                    <div className="col-span-5">
                      <select
                        required
                        value={row.product_id}
                        onChange={(e) => handlePoItemChange(idx, 'product_id', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-lg text-xs"
                      >
                        <option value="">-- Choose Product --</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.title || p.name} (SKU: {p.sku || p.partNumber})</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-3">
                      <input
                        type="number"
                        min="1"
                        required
                        placeholder="Qty"
                        value={row.quantity_ordered}
                        onChange={(e) => handlePoItemChange(idx, 'quantity_ordered', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-lg text-xs font-bold"
                      />
                    </div>

                    <div className="col-span-3">
                      <input
                        type="number"
                        min="0"
                        required
                        placeholder="Unit Cost (₹)"
                        value={row.unit_purchase_price}
                        onChange={(e) => handlePoItemChange(idx, 'unit_purchase_price', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-lg text-xs font-bold text-emerald-400"
                      />
                    </div>

                    <div className="col-span-1 text-right">
                      {poForm.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePoItemRow(idx)}
                          className="text-red-400 hover:text-red-300 font-bold text-sm"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-600 transition"
                >
                  Generate PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Receiving Modal */}
      {isReceiveModalOpen && selectedPOForReceiving && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Package className="text-emerald-400" size={18} /> Receive Stock — PO #{selectedPOForReceiving.purchase_order_number}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Vendor: {selectedPOForReceiving.suppliers?.company_name}
                </p>
              </div>
              <button onClick={() => setIsReceiveModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="space-y-3">
                {selectedPOForReceiving.purchase_order_items?.map((item) => {
                  const ordered = Number(item.quantity_ordered) || 0;
                  const alreadyRec = Number(item.quantity_received) || 0;
                  const remaining = Math.max(0, ordered - alreadyRec);
                  const prodName = item.products?.name || item.products?.title || `Product #${item.product_id}`;

                  return (
                    <div key={item.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center">
                        <strong className="text-sm text-white">{prodName}</strong>
                        <span className="text-xs font-mono text-amber-400 font-bold">₹{item.unit_purchase_price}/unit</span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900 p-2 rounded-lg">
                        <span>Ordered: <b className="text-slate-200">{ordered}</b></span>
                        <span>Already Received: <b className="text-blue-400">{alreadyRec}</b></span>
                        <span>Remaining: <b className="text-amber-400">{remaining}</b></span>
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <label className="text-xs font-semibold text-slate-300">Newly Received Qty Entry:</label>
                        <input
                          type="number"
                          min="0"
                          max={remaining}
                          value={receivingInputs[item.id] ?? remaining}
                          onChange={(e) => setReceivingInputs({ ...receivingInputs, [item.id]: e.target.value })}
                          disabled={remaining <= 0}
                          className="w-24 bg-slate-900 border border-slate-700 text-white p-2 rounded-lg text-xs font-bold text-center text-emerald-400 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReceiveModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmStockReceive}
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/20"
                >
                  Confirm & Commit Stock Receiving
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
