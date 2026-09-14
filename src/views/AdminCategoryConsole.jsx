import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MASTER_CATEGORIES_DATA, generateCategorySEO } from '../data/categoryMasterData';
import { CategoryAPI } from '../services/categoryService';
import {
  Layers, FolderPlus, Edit3, Trash2, Eye, EyeOff, Search, ChevronRight,
  ShieldCheck, AlertTriangle, CheckCircle2, Image, FileText, Globe, ArrowUp, ArrowDown, X, Plus
} from 'lucide-react';

export const AdminCategoryConsole = () => {
  const { products, showToast } = useStore();

  const [categoriesTree, setCategoriesTree] = useState(() => {
    try {
      const saved = localStorage.getItem('autozon_master_categories');
      return saved ? JSON.parse(saved) : MASTER_CATEGORIES_DATA;
    } catch (e) {
      return MASTER_CATEGORIES_DATA;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('autozon_master_categories', JSON.stringify(categoriesTree));
    } catch(e) {}
  }, [categoriesTree]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParentId, setSelectedParentId] = useState('all');

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    parent_id: '',
    description: '',
    image_url: '',
    sort_order: 0,
    status: true,
    seo_title: '',
    seo_description: ''
  });

  // Pre-Deletion Warning Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteWarningInfo, setDeleteWarningInfo] = useState(null);

  // Filter Categories
  const filteredCategories = categoriesTree.filter(cat => {
    if (selectedParentId !== 'all' && selectedParentId !== '' && cat.id !== selectedParentId) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = cat.name.toLowerCase().includes(q);
      const matchSlug = cat.slug.toLowerCase().includes(q);
      const matchSub = cat.subcategories.some(s => s.name.toLowerCase().includes(q));
      if (!matchName && !matchSlug && !matchSub) return false;
    }
    return true;
  });

  const handleOpenAddModal = (parentId = '') => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      slug: '',
      parent_id: parentId,
      description: '',
      image_url: '',
      sort_order: categoriesTree.length + 1,
      status: true,
      seo_title: '',
      seo_description: ''
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (cat, isSub = false, parentId = '') => {
    setEditingCategory(cat);
    setCategoryForm({
      id: cat.id,
      name: cat.name,
      slug: cat.slug || '',
      parent_id: isSub ? parentId : (cat.parent_id || ''),
      description: cat.description || '',
      image_url: cat.image_url || '',
      sort_order: cat.sort_order || 0,
      status: cat.status !== undefined ? cat.status : true,
      seo_title: cat.seo_title || '',
      seo_description: cat.seo_description || ''
    });
    setModalOpen(true);
  };

  // Auto-generate SEO metadata when Category Name changes
  const handleNameChange = (name) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const seo = generateCategorySEO(name);
    setCategoryForm(prev => ({
      ...prev,
      name,
      slug: prev.slug || slug,
      seo_title: prev.seo_title || seo.seo_title,
      seo_description: prev.seo_description || seo.seo_description
    }));
  };

  // Save Category Form Submit
  const handleSaveCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      showToast('❌ Please enter a category name.', 'error');
      return;
    }

    const res = await CategoryAPI.saveCategory(categoryForm);
    if (res.error) {
      showToast(`❌ Error saving category: ${res.error.message || res.error}`, 'error');
      return;
    }

    // Update Local Tree State
    if (categoryForm.parent_id) {
      // Adding/Editing a Subcategory under a Parent
      setCategoriesTree(categoriesTree.map(main => {
        if (main.id === categoryForm.parent_id) {
          const existingSubIndex = main.subcategories.findIndex(s => s.slug === categoryForm.slug || s.name === categoryForm.name);
          let newSubs = [...main.subcategories];
          if (existingSubIndex >= 0) {
            newSubs[existingSubIndex] = { ...newSubs[existingSubIndex], ...categoryForm };
          } else {
            newSubs.push({ name: categoryForm.name, slug: categoryForm.slug, description: categoryForm.description });
          }
          return { ...main, subcategories: newSubs };
        }
        return main;
      }));
    } else {
      // Main Category
      const existingIndex = categoriesTree.findIndex(c => c.id === categoryForm.id || c.slug === categoryForm.slug);
      if (existingIndex >= 0) {
        const updated = [...categoriesTree];
        updated[existingIndex] = { ...updated[existingIndex], ...categoryForm };
        setCategoriesTree(updated);
      } else {
        setCategoriesTree([
          ...categoriesTree,
          {
            id: categoryForm.id || `cat-${Date.now()}`,
            name: categoryForm.name,
            slug: categoryForm.slug,
            icon: '📂',
            description: categoryForm.description,
            subcategories: []
          }
        ]);
      }
    }

    showToast(`🎉 Category "${categoryForm.name}" saved successfully!`);
    setModalOpen(false);
  };

  // Pre-Deletion Protection Check
  const handleRequestDelete = async (cat) => {
    setCategoryToDelete(cat);
    const check = await CategoryAPI.deleteCategorySafely(cat.id || cat.slug, products);
    setDeleteWarningInfo(check);
    setDeleteModalOpen(true);
  };

  // Confirm Delete (if allowed)
  const handleConfirmDelete = () => {
    if (!deleteWarningInfo || !deleteWarningInfo.allowed) return;

    setCategoriesTree(categoriesTree.filter(c => c.id !== categoryToDelete.id && c.slug !== categoryToDelete.slug));
    showToast(`🗑️ Category "${categoryToDelete.name}" deleted successfully.`);
    setDeleteModalOpen(false);
  };

  // Toggle Category Active/Disabled Status
  const handleToggleStatus = (cat) => {
    const newStatus = cat.status === undefined ? false : !cat.status;
    setCategoriesTree(categoriesTree.map(c => {
      if (c.slug === cat.slug || c.id === cat.id) {
        return { ...c, status: newStatus };
      }
      return c;
    }));
    showToast(`${newStatus ? '👁️ Enabled' : '🚫 Disabled'} category "${cat.name}"`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Banner Header */}
      <div className="bg-slate-900 border-b border-slate-800 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-400 font-black text-xs px-2.5 py-1 rounded-full uppercase tracking-wider border border-amber-500/30">
                Category Master
              </span>
              <span className="text-slate-400 text-xs font-semibold">• Unlimited Hierarchical Subcategories</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-center gap-3">
              <Layers className="w-8 h-8 text-amber-500" />
              <span>Category & Subcategory Console</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Manage 25 main categories and subcategories, edit SEO metadata (`seo_title`, `seo_description`), reorder displays, and safeguard products with pre-delete protection.
            </p>
          </div>

          <button
            onClick={() => handleOpenAddModal('')}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-slate-950 font-black text-xs px-5 py-3 rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Main Category
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Search & Filter Toolbar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search category name, subcategory, or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="text-xs text-slate-400 font-semibold">
            Showing <strong className="text-white">{filteredCategories.length}</strong> Main Categories
          </div>
        </div>

        {/* Categories Master Tree List */}
        <div className="space-y-4">
          {filteredCategories.map((mainCat, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              
              {/* Main Category Header Row */}
              <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl shrink-0">
                    {mainCat.icon || '📂'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-white text-base">{mainCat.name}</h3>
                      <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded">
                        /{mainCat.slug}
                      </span>
                      {mainCat.status === false && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded uppercase">
                          Disabled
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-xs mt-0.5 max-w-xl">{mainCat.description}</p>
                  </div>
                </div>

                {/* Actions Group */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleOpenAddModal(mainCat.id || mainCat.slug)}
                    className="bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1 cursor-pointer"
                  >
                    <FolderPlus className="w-3.5 h-3.5" /> Subcategory
                  </button>

                  <button
                    onClick={() => handleToggleStatus(mainCat)}
                    className={`p-2 rounded-lg border text-xs transition cursor-pointer ${
                      mainCat.status === false 
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                        : 'bg-slate-800 text-emerald-400 border-slate-700'
                    }`}
                    title={mainCat.status === false ? 'Enable Category' : 'Disable Category'}
                  >
                    {mainCat.status === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(mainCat, false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-lg border border-slate-700 transition cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleRequestDelete(mainCat)}
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 p-2 rounded-lg border border-rose-500/30 transition cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Subcategories Grid List */}
              <div className="p-4 sm:p-5 bg-slate-950/50">
                <div className="text-[11px] font-black uppercase text-slate-500 tracking-wider mb-3 flex items-center justify-between">
                  <span>Subcategories ({mainCat.subcategories?.length || 0})</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {mainCat.subcategories?.map((sub, sIdx) => (
                    <div
                      key={sIdx}
                      className="bg-slate-900 border border-slate-800/80 hover:border-amber-500/40 p-3 rounded-xl flex items-center justify-between gap-2 group transition"
                    >
                      <div className="truncate">
                        <div className="font-bold text-slate-200 text-xs truncate group-hover:text-amber-400 transition">
                          {sub.name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">/{sub.slug || sub.name.toLowerCase().replace(/ /g, '-')}</div>
                      </div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 shrink-0">
                        <button
                          onClick={() => handleOpenEditModal(sub, true, mainCat.id || mainCat.slug)}
                          className="p-1 hover:text-white text-slate-400 transition"
                          title="Edit Subcategory"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* =============================================================
          ADD / EDIT CATEGORY MODAL
      ============================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-500" />
                <span>{editingCategory ? 'Edit Category' : 'Add New Category / Subcategory'}</span>
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategorySubmit} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engine Parts or Brake Pad"
                  value={categoryForm.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Parent Category (Optional)</label>
                  <select
                    value={categoryForm.parent_id}
                    onChange={(e) => setCategoryForm({ ...categoryForm, parent_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">None (Top Level Main Category)</option>
                    {categoriesTree.map((main, i) => (
                      <option key={i} value={main.id || main.slug}>{main.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Category Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={categoryForm.image_url}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image_url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* SEO Meta Fields */}
              <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl space-y-3">
                <h4 className="font-extrabold text-amber-400 text-xs flex items-center gap-1.5">
                  <Globe className="w-4 h-4" /> Dynamic SEO Metadata Generator
                </h4>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">SEO Title</label>
                  <input
                    type="text"
                    value={categoryForm.seo_title}
                    onChange={(e) => setCategoryForm({ ...categoryForm, seo_title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">SEO Meta Description</label>
                  <textarea
                    rows={2}
                    value={categoryForm.seo_description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, seo_description: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition cursor-pointer"
                >
                  Save Category
                </button>
              </div>

            </form>
          </div>
        </div>
      )}


      {/* =============================================================
          PRE-DELETION SAFETY WARNING MODAL
      ============================================================= */}
      {deleteModalOpen && categoryToDelete && deleteWarningInfo && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-black text-white">Delete Category Confirmation</h3>
              <p className="text-xs text-slate-400 mt-1">Category: <strong>"{categoryToDelete.name}"</strong></p>
            </div>

            {deleteWarningInfo.allowed ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-xs text-emerald-400 font-medium">
                ✓ Safety Verification Passed: Zero products are assigned to this category. Safe to delete.
              </div>
            ) : (
              <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl text-xs text-rose-300 font-medium">
                {deleteWarningInfo.message}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
              >
                Cancel
              </button>

              {deleteWarningInfo.allowed && (
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs transition cursor-pointer"
                >
                  Delete Category
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
