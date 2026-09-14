import React, { useState, useEffect } from 'react';
import { cmsSeoService } from '../services/cmsSeoService';
import { SupabaseAPI } from '../services/supabaseClient';
import { Plus, Edit2, Trash2, Search, HelpCircle, Check, X } from 'lucide-react';

export const AdminFaqConsole = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    question: '',
    answer: '',
    category_id: '',
    product_id: '',
    vehicle_id: '',
    status: 'published',
    sort_order: 0
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    loadFaqs();
    loadDropdownOptions();
  }, [statusFilter]);

  const loadFaqs = async () => {
    setLoading(true);
    const { data } = await cmsSeoService.getFaqs({ status: statusFilter });
    setFaqs(data || []);
    setLoading(false);
  };

  const loadDropdownOptions = async () => {
    const [{ data: cats }, { data: prods }, { data: vehs }] = await Promise.all([
      SupabaseAPI.getCategories(),
      SupabaseAPI.getCatalogProducts(),
      SupabaseAPI.getVehicles()
    ]);

    setCategories(cats || []);
    setProducts((prods || []).map(p => ({ id: p.id, name: p.name || p.title })));
    setVehicles((vehs || []).map(v => ({ id: v.id, name: `${v.make} ${v.model} (${v.variant || 'Base'})` })));
  };

  const handleSave = async () => {
    if (!formData.question || !formData.answer) return;
    setSaving(true);
    setMsg(null);

    const payload = {
      ...formData,
      category_id: formData.category_id || null,
      product_id: formData.product_id || null,
      vehicle_id: formData.vehicle_id || null,
      sort_order: parseInt(formData.sort_order || 0, 10)
    };

    let res;
    if (formData.id) {
      res = await cmsSeoService.updateFaq(formData.id, payload);
    } else {
      res = await cmsSeoService.createFaq(payload);
    }

    setSaving(false);
    if (res.error) {
      setMsg({ type: 'error', text: res.error.message || 'Failed to save FAQ.' });
    } else {
      setShowModal(false);
      loadFaqs();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this FAQ entry permanently?')) return;
    await cmsSeoService.deleteFaq(id);
    loadFaqs();
  };

  const filteredFaqs = faqs.filter(f =>
    f.question.toLowerCase().includes(search.toLowerCase()) ||
    f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <HelpCircle size={24} className="text-emerald-400" /> FAQ System Console
          </h1>
          <p className="text-xs text-slate-400">
            Manage global and item-specific FAQs with dynamic FAQ Schema.org output.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              id: null,
              question: '',
              answer: '',
              category_id: '',
              product_id: '',
              vehicle_id: '',
              status: 'published',
              sort_order: 0
            });
            setShowModal(true);
          }}
          className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-1.5"
        >
          <Plus size={16} /> Add New FAQ
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search questions or answers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
        >
          <option value="">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading FAQs...</div>
        ) : filteredFaqs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No FAQs found.</div>
        ) : (
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3.5">Sort</th>
                <th className="p-3.5">Question</th>
                <th className="p-3.5">Associated Target</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredFaqs.map((f) => (
                <tr key={f.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-slate-400">{f.sort_order}</td>
                  <td className="p-3.5 font-bold text-slate-100">
                    <div className="mb-1">{f.question}</div>
                    <div 
                      className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-normal"
                      dangerouslySetInnerHTML={{ __html: f.answer }}
                    />
                  </td>
                  <td className="p-3.5">
                    {f.product_id ? (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                        Product Specific
                      </span>
                    ) : f.vehicle_id ? (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded">
                        Vehicle Specific
                      </span>
                    ) : f.category_id ? (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded">
                        Category Specific
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-400 rounded">
                        General Website
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                      f.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => {
                        setFormData(f);
                        setShowModal(true);
                      }}
                      className="p-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="p-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">{formData.id ? 'Edit FAQ' : 'New FAQ Item'}</h3>
              <button onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Question *</label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Answer *</label>
                <textarea
                  rows={4}
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Target Category (Optional)</label>
                  <select
                    value={formData.category_id || ''}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                  >
                    <option value="">General / All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Target Product (Optional)</label>
                  <select
                    value={formData.product_id || ''}
                    onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                  >
                    <option value="">General / None</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                  />
                </div>
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
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded"
              >
                Save FAQ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
