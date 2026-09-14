import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MASTER_BRANDS_DATA, generateBrandSEO } from '../data/brandMasterData';
import { BrandAPI } from '../services/brandService';
import {
  Tag, Plus, Edit3, Trash2, Eye, EyeOff, Search, Star, ShieldCheck,
  Globe, Upload, CheckCircle2, AlertTriangle, ExternalLink, Filter, X
} from 'lucide-react';

export const AdminBrandConsole = () => {
  const { products, showToast } = useStore();

  const [brandsList, setBrandsList] = useState(() => {
    try {
      const saved = localStorage.getItem('autozon_master_brands');
      return saved ? JSON.parse(saved) : MASTER_BRANDS_DATA;
    } catch (e) {
      return MASTER_BRANDS_DATA;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('autozon_master_brands', JSON.stringify(brandsList));
    } catch(e) {}
  }, [brandsList]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive' | 'featured'
  const [countryFilter, setCountryFilter] = useState('all');

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [brandForm, setBrandForm] = useState({
    name: '',
    slug: '',
    country: 'Germany',
    website_url: '',
    logo_url: '',
    description: '',
    status: true,
    featured: false,
    sort_order: 0,
    seo_title: '',
    seo_description: ''
  });

  // Pre-Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [deleteCheckInfo, setDeleteCheckInfo] = useState(null);

  // Filter Brands
  const filteredBrands = brandsList.filter(b => {
    if (statusFilter === 'active' && !b.status) return false;
    if (statusFilter === 'inactive' && b.status) return false;
    if (statusFilter === 'featured' && !b.featured) return false;

    if (countryFilter !== 'all' && (b.country || '').toLowerCase() !== countryFilter.toLowerCase()) {
      return false;
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = b.name.toLowerCase().includes(q);
      const matchSlug = b.slug.toLowerCase().includes(q);
      const matchCountry = (b.country || '').toLowerCase().includes(q);
      if (!matchName && !matchSlug && !matchCountry) return false;
    }
    return true;
  });

  // Unique Countries list for filter
  const uniqueCountries = Array.from(new Set(brandsList.map(b => b.country).filter(Boolean)));

  const handleOpenAddModal = () => {
    setEditingBrand(null);
    setBrandForm({
      name: '',
      slug: '',
      country: 'Germany',
      website_url: '',
      logo_url: '',
      description: '',
      status: true,
      featured: false,
      sort_order: brandsList.length + 1,
      seo_title: '',
      seo_description: ''
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (b) => {
    setEditingBrand(b);
    setBrandForm({
      id: b.id,
      name: b.name,
      slug: b.slug || '',
      country: b.country || 'Global',
      website_url: b.website_url || '',
      logo_url: b.logo_url || '',
      description: b.description || '',
      status: b.status !== undefined ? b.status : true,
      featured: b.featured !== undefined ? b.featured : false,
      sort_order: b.sort_order || 0,
      seo_title: b.seo_title || '',
      seo_description: b.seo_description || ''
    });
    setModalOpen(true);
  };

  // Auto-generate clean slug & SEO metadata when Brand Name changes
  const handleNameChange = (name) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const seo = generateBrandSEO(name);
    setBrandForm(prev => ({
      ...prev,
      name,
      slug: prev.slug || slug,
      seo_title: prev.seo_title || seo.seo_title,
      seo_description: prev.seo_description || seo.seo_description
    }));
  };

  // Logo File Upload handler (Supabase Storage bucket `brand-logos`)
  const handleLogoFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingLogo(true);
    const { publicUrl, error } = await BrandAPI.uploadBrandLogo(file);
    setIsUploadingLogo(false);

    if (error) {
      showToast(`❌ Error uploading logo: ${error.message || error}`, 'error');
      return;
    }

    setBrandForm(prev => ({ ...prev, logo_url: publicUrl }));
    showToast('🖼️ Brand logo uploaded to Supabase `brand-logos` bucket!');
  };

  // Save Brand Submit
  const handleSaveBrandSubmit = async (e) => {
    e.preventDefault();
    if (!brandForm.name.trim()) {
      showToast('❌ Please enter a brand name.', 'error');
      return;
    }

    const res = await BrandAPI.saveBrand(brandForm);
    if (res.error) {
      showToast(`❌ Error saving brand: ${res.error.message || res.error}`, 'error');
      return;
    }

    const existingIndex = brandsList.findIndex(b => b.id === brandForm.id || b.slug === brandForm.slug);
    if (existingIndex >= 0) {
      const updated = [...brandsList];
      updated[existingIndex] = { ...updated[existingIndex], ...brandForm };
      setBrandsList(updated);
    } else {
      setBrandsList([
        {
          id: brandForm.id || `brand-${Date.now()}`,
          ...brandForm,
          logo_text: `🏷️ ${brandForm.name}`
        },
        ...brandsList
      ]);
    }

    showToast(`🎉 Brand "${brandForm.name}" saved successfully!`);
    setModalOpen(false);
  };

  // Pre-Delete Check
  const handleRequestDelete = async (brand) => {
    setBrandToDelete(brand);
    const check = await BrandAPI.deleteBrandSafely(brand.id || brand.name, products);
    setDeleteCheckInfo(check);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteCheckInfo || !deleteCheckInfo.allowed) return;

    setBrandsList(brandsList.filter(b => b.id !== brandToDelete.id && b.slug !== brandToDelete.slug));
    showToast(`🗑️ Brand "${brandToDelete.name}" deleted.`);
    setDeleteModalOpen(false);
  };

  // Toggle Featured & Status Flags
  const handleToggleFeatured = (b) => {
    const newFeatured = !b.featured;
    setBrandsList(brandsList.map(item => item.id === b.id || item.slug === b.slug ? { ...item, featured: newFeatured } : item));
    showToast(`${newFeatured ? '⭐ Marked as Featured' : 'Removed from Featured'} brand "${b.name}"`);
  };

  const handleToggleStatus = (b) => {
    const newStatus = !b.status;
    setBrandsList(brandsList.map(item => item.id === b.id || item.slug === b.slug ? { ...item, status: newStatus } : item));
    showToast(`${newStatus ? '👁️ Enabled' : '🚫 Disabled'} brand "${b.name}"`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 selection:bg-amber-500 selection:text-slate-950">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border-b border-slate-800 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-400 font-black text-xs px-2.5 py-1 rounded-full uppercase tracking-wider border border-amber-500/30">
                Brand Master System
              </span>
              <span className="text-slate-400 text-xs font-semibold">• Supabase Storage `brand-logos` Bucket</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-center gap-3">
              <Tag className="w-8 h-8 text-amber-500" />
              <span>Automotive Brand Master Console</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Manage 20+ verified OEM/OES manufacturers, upload high-res logos, set featured brands, edit clean slugs, and configure SEO titles.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-slate-950 font-black text-xs px-5 py-3 rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New Brand
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
              placeholder="Search brand name, country, or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
              <option value="featured">Featured Only ⭐</option>
            </select>

            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Countries</option>
              {uniqueCountries.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Brands Master Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBrands.map((b, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase bg-slate-950 text-slate-400 px-2 py-1 rounded border border-slate-800">
                    {b.country || 'Global'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleFeatured(b)}
                      className={`p-1.5 rounded-lg border text-xs transition ${
                        b.featured ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'text-slate-600 border-slate-800 hover:text-slate-400'
                      }`}
                      title={b.featured ? 'Featured Brand' : 'Mark as Featured'}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <button
                      onClick={() => handleToggleStatus(b)}
                      className={`p-1.5 rounded-lg border text-xs transition ${
                        b.status ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                      title={b.status ? 'Active' : 'Disabled'}
                    >
                      {b.status ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Logo & Name */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                    {b.logo_url ? (
                      <img src={b.logo_url} alt={b.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-amber-400">{b.logo_text || b.name.charAt(0)}</span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-extrabold text-white text-base truncate group-hover:text-amber-400 transition">{b.name}</h3>
                    <div className="text-[10px] text-slate-500 font-mono">/{b.slug}</div>
                  </div>
                </div>

                <p className="text-slate-400 text-xs mt-3 line-clamp-2">{b.description}</p>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                {b.website_url ? (
                  <a
                    href={b.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Website</span> <ExternalLink className="w-3 h-3" />
                  </a>
                ) : <span className="text-[11px] text-slate-600">No Website</span>}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(b)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
                    title="Edit Brand"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleRequestDelete(b)}
                    className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/30 transition"
                    title="Delete Brand"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* =============================================================
          ADD / EDIT BRAND MODAL
      ============================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-500" />
                <span>{editingBrand ? 'Edit Brand Master' : 'Add New Automotive Brand'}</span>
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBrandSubmit} className="p-6 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BOSCH"
                    value={brandForm.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={brandForm.slug}
                    onChange={(e) => setBrandForm({ ...brandForm, slug: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Country of Origin</label>
                  <input
                    type="text"
                    placeholder="e.g. Germany, India, Japan"
                    value={brandForm.country}
                    onChange={(e) => setBrandForm({ ...brandForm, country: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Official Website URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={brandForm.website_url}
                    onChange={(e) => setBrandForm({ ...brandForm, website_url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Logo Upload Section */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Brand Logo (Supabase `brand-logos` Storage Bucket)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Logo URL or upload file..."
                    value={brandForm.logo_url}
                    onChange={(e) => setBrandForm({ ...brandForm, logo_url: e.target.value })}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />

                  <label className="bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 cursor-pointer transition flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingLogo ? 'Uploading...' : 'Upload Logo'}</span>
                    <input type="file" accept="image/*" onChange={handleLogoFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Brand Description</label>
                <textarea
                  rows={3}
                  placeholder="Official OEM/OES manufacturer overview..."
                  value={brandForm.description}
                  onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={brandForm.featured}
                    onChange={(e) => setBrandForm({ ...brandForm, featured: e.target.checked })}
                    className="accent-amber-500 rounded"
                  />
                  <span>Featured Brand (Highlight on Homepage & Directories)</span>
                </label>
              </div>

              {/* SEO Meta Fields */}
              <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl space-y-3">
                <h4 className="font-extrabold text-amber-400 text-xs flex items-center gap-1.5">
                  <Globe className="w-4 h-4" /> Brand SEO Metadata Generator
                </h4>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">SEO Title</label>
                  <input
                    type="text"
                    value={brandForm.seo_title}
                    onChange={(e) => setBrandForm({ ...brandForm, seo_title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">SEO Meta Description</label>
                  <textarea
                    rows={2}
                    value={brandForm.seo_description}
                    onChange={(e) => setBrandForm({ ...brandForm, seo_description: e.target.value })}
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
                  Save Brand Record
                </button>
              </div>

            </form>
          </div>
        </div>
      )}


      {/* =============================================================
          PRE-DELETION SAFETY WARNING MODAL
      ============================================================= */}
      {deleteModalOpen && brandToDelete && deleteCheckInfo && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-black text-white">Delete Brand Confirmation</h3>
              <p className="text-xs text-slate-400 mt-1">Brand: <strong>"{brandToDelete.name}"</strong></p>
            </div>

            {deleteCheckInfo.allowed ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-xs text-emerald-400 font-medium">
                ✓ Safety Verification Passed: Zero products are linked to this brand. Safe to delete.
              </div>
            ) : (
              <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl text-xs text-rose-300 font-medium">
                {deleteCheckInfo.message}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
              >
                Cancel
              </button>

              {deleteCheckInfo.allowed && (
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs transition cursor-pointer"
                >
                  Delete Brand
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
