import React, { useState, useEffect } from 'react';
import { Building, Plus, Search, Filter, Edit3, CheckCircle, XCircle, RefreshCw, Phone, Mail, MapPin, Tag, Download } from 'lucide-react';
import { fetchSuppliers, saveSupplier, updateSupplierStatus, fetchSupplierProducts, assignSupplierProduct } from '../services/supplierPurchaseService';
import { exportReportToCSV } from '../services/adminAnalyticsEngine';
import { useStore } from '../context/StoreContext';

export default function AdminSupplierConsole() {
  const { products, showToast } = useStore();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Add/Edit Supplier Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [form, setForm] = useState({
    company_name: '',
    contact_person: '',
    phone: '',
    alternate_phone: '',
    email: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    gst_number: '',
    pan_number: '',
    payment_terms: 'Net 30',
    notes: '',
    status: 'active'
  });

  // Supplier Products Mapping Modal State
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [selectedSupplierForMapping, setSelectedSupplierForMapping] = useState(null);
  const [mappingForm, setMappingForm] = useState({
    product_id: '',
    supplier_sku: '',
    purchase_price: 0,
    minimum_order_quantity: 1,
    lead_time_days: 3,
    preferred_supplier: false
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchSuppliers(searchTerm, statusFilter);
      setSuppliers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchTerm, statusFilter]);

  const handleOpenAddModal = () => {
    setEditingSupplier(null);
    setForm({
      company_name: '',
      contact_person: '',
      phone: '',
      alternate_phone: '',
      email: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      pincode: '',
      gst_number: '',
      pan_number: '',
      payment_terms: 'Net 30',
      notes: '',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sup) => {
    setEditingSupplier(sup);
    setForm({ ...sup });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company_name || !form.phone || !form.email) {
      showToast('Please fill Company Name, Phone, and Email.', 'error');
      return;
    }
    try {
      await saveSupplier(form);
      showToast(`Supplier '${form.company_name}' saved successfully!`, 'success');
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Failed to save supplier: ' + err.message, 'error');
    }
  };

  const handleToggleStatus = async (sup) => {
    const newSt = sup.status === 'active' ? 'inactive' : 'active';
    try {
      await updateSupplierStatus(sup.id, newSt);
      showToast(`Supplier '${sup.company_name}' status set to ${newSt}.`);
      loadData();
    } catch (err) {
      showToast('Status update failed.', 'error');
    }
  };

  const handleSaveMapping = async (e) => {
    e.preventDefault();
    if (!mappingForm.product_id || !mappingForm.purchase_price) {
      showToast('Please select product and valid purchase price.', 'error');
      return;
    }
    try {
      await assignSupplierProduct({
        ...mappingForm,
        supplier_id: selectedSupplierForMapping.id
      });
      showToast('Supplier-Product relation saved!');
      setIsMappingModalOpen(false);
    } catch (err) {
      showToast('Failed to save relation: ' + err.message, 'error');
    }
  };

  const handleExportCSV = () => {
    if (!suppliers.length) return;
    const exportRows = suppliers.map(s => ({
      Supplier_Code: s.supplier_code,
      Company_Name: s.company_name,
      Contact_Person: s.contact_person,
      Phone: s.phone,
      Email: s.email,
      City: s.city,
      State: s.state,
      GST_Number: s.gst_number || 'N/A',
      Status: s.status,
      Payment_Terms: s.payment_terms
    }));
    exportReportToCSV('AutoZoneIndia_Suppliers', exportRows);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building className="text-amber-500" /> Supplier Directory & Management
          </h1>
          <p className="text-slate-400 text-sm">
            Manage OEM/OES suppliers, purchase terms, GST details, and supplier-part relations
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
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/20"
          >
            <Plus size={16} /> Add Supplier
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder="Search by Company, Supplier Code, Contact, Phone, City..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-white pl-9 pr-4 py-2 rounded-lg text-xs focus:outline-none focus:border-amber-500"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Status:</span>
          {['all', 'active', 'inactive'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition ${
                statusFilter === st ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Suppliers Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <RefreshCw className="animate-spin mx-auto text-amber-500 mb-2" size={28} />
          <p className="text-sm font-medium">Loading registered suppliers...</p>
        </div>
      ) : suppliers.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl">
          <Building size={48} className="mx-auto mb-3 text-slate-600 opacity-60" />
          <p className="text-base font-semibold text-slate-300">No suppliers found.</p>
          <p className="text-xs text-slate-500 mt-1">Click "Add Supplier" above to register a new vendor.</p>
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 text-xs uppercase border-b border-slate-800">
                  <th className="p-4">Supplier Code & Name</th>
                  <th className="p-4">Contact Person</th>
                  <th className="p-4">Phone / Email</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">GST Number</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {suppliers.map(sup => (
                  <tr key={sup.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono font-bold text-[10px] border border-amber-500/30">
                        {sup.supplier_code}
                      </span>
                      <strong className="block text-white text-sm mt-1">{sup.company_name}</strong>
                    </td>
                    <td className="p-4 text-slate-300 font-medium">{sup.contact_person}</td>
                    <td className="p-4 text-slate-300 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <Phone size={12} className="text-amber-400" /> {sup.phone}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Mail size={12} className="text-blue-400" /> {sup.email}
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">
                      <span className="font-semibold text-slate-200">{sup.city}</span>, {sup.state}
                    </td>
                    <td className="p-4 font-mono text-slate-400">
                      {sup.gst_number ? (
                        <span className="text-emerald-400 font-bold">{sup.gst_number}</span>
                      ) : (
                        <span className="text-slate-500 italic">Unregistered</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-extrabold ${
                        sup.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {sup.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedSupplierForMapping(sup);
                          setIsMappingModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-semibold transition"
                        title="Map Part Catalog"
                      >
                        Map Parts
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(sup)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                        title="Edit Supplier"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(sup)}
                        className={`p-1.5 rounded-lg transition ${
                          sup.status === 'active' ? 'bg-red-950/60 text-red-400 hover:bg-red-900' : 'bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900'
                        }`}
                        title={sup.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {sup.status === 'active' ? <XCircle size={14} /> : <CheckCircle size={14} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">
                {editingSupplier ? `Edit Supplier (${editingSupplier.supplier_code})` : 'Register New OEM/OES Supplier'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={form.company_name}
                    onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl text-xs"
                    placeholder="e.g. Bosch Automotive India Ltd"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={form.contact_person}
                    onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl text-xs"
                    placeholder="e.g. Rajesh Kumar"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl text-xs"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl text-xs"
                    placeholder="supplier@bosch.co.in"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Address Line 1 *</label>
                  <input
                    type="text"
                    required
                    value={form.address_line1}
                    onChange={(e) => setForm({ ...form, address_line1: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl text-xs"
                    placeholder="Plot 45, Industrial Suburb"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl text-xs"
                    placeholder="Pune"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl text-xs"
                    placeholder="Maharashtra"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl text-xs"
                    placeholder="411018"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">GST Number</label>
                  <input
                    type="text"
                    value={form.gst_number}
                    onChange={(e) => setForm({ ...form, gst_number: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl text-xs font-mono"
                    placeholder="27AAACB9876F1Z2"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Payment Terms</label>
                  <select
                    value={form.payment_terms}
                    onChange={(e) => setForm({ ...form, payment_terms: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl text-xs font-semibold"
                  >
                    <option value="Net 30">Net 30 Days</option>
                    <option value="Net 15">Net 15 Days</option>
                    <option value="COD">Cash On Delivery</option>
                    <option value="Advance">100% Advance Payment</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-600 transition"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Map Part Catalog Modal */}
      {isMappingModalOpen && selectedSupplierForMapping && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">
                Map Product to {selectedSupplierForMapping.company_name}
              </h3>
              <button onClick={() => setIsMappingModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveMapping} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Select Catalog Product *</label>
                <select
                  required
                  value={mappingForm.product_id}
                  onChange={(e) => setMappingForm({ ...mappingForm, product_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl text-xs font-semibold"
                >
                  <option value="">-- Select Product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title || p.name} (SKU: {p.sku || p.partNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Supplier Part SKU</label>
                  <input
                    type="text"
                    value={mappingForm.supplier_sku}
                    onChange={(e) => setMappingForm({ ...mappingForm, supplier_sku: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl text-xs"
                    placeholder="e.g. BOSCH-0986-IN"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Purchase Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={mappingForm.purchase_price}
                    onChange={(e) => setMappingForm({ ...mappingForm, purchase_price: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl text-xs font-bold text-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Min Order Qty (MOQ)</label>
                  <input
                    type="number"
                    value={mappingForm.minimum_order_quantity}
                    onChange={(e) => setMappingForm({ ...mappingForm, minimum_order_quantity: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Lead Time (Days)</label>
                  <input
                    type="number"
                    value={mappingForm.lead_time_days}
                    onChange={(e) => setMappingForm({ ...mappingForm, lead_time_days: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pref_sup"
                  checked={mappingForm.preferred_supplier}
                  onChange={(e) => setMappingForm({ ...mappingForm, preferred_supplier: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="pref_sup" className="text-xs font-semibold text-slate-300 cursor-pointer">
                  Mark as Preferred Supplier for this product
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsMappingModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-600 transition"
                >
                  Save Mapping
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
