import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MASTER_CATEGORIES_DATA, generateCategorySEO } from '../data/categoryMasterData';
import {
  ArrowLeft, Star, ShoppingCart, ArrowRightLeft, Layers, CheckCircle2,
  Filter, SlidersHorizontal, Car, Tag, ShieldCheck, ChevronRight
} from 'lucide-react';

export const CategoryView = () => {
  const { selectedCategory, activeSlug, products, setSelectedCategory, navigateTo, addToCart, toggleCompare, selectedVehicle } = useStore();

  const categorySlug = selectedCategory || activeSlug || 'brake-parts';
  
  // Find main category or subcategory from master dataset
  let mainCategory = MASTER_CATEGORIES_DATA.find(c => c.slug === categorySlug || c.id === categorySlug);
  let activeSubcategory = null;

  if (!mainCategory) {
    // Search subcategories
    for (const main of MASTER_CATEGORIES_DATA) {
      const sub = main.subcategories.find(s => s.slug === categorySlug);
      if (sub) {
        mainCategory = main;
        activeSubcategory = sub;
        break;
      }
    }
  }

  if (!mainCategory) mainCategory = MASTER_CATEGORIES_DATA[1]; // Fallback Brake Parts

  // Filters State
  const [selectedSubPill, setSelectedSubPill] = useState(activeSubcategory ? activeSubcategory.name : 'all');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('all');
  const [priceMaxFilter, setPriceMaxFilter] = useState(25000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'price-low' | 'price-high' | 'rating'

  // Generate Dynamic SEO Metadata
  const seo = generateCategorySEO(mainCategory.name, activeSubcategory ? activeSubcategory.name : null);

  // Filter Products
  let categoryProducts = products.filter(p => {
    const matchCat = p.category === mainCategory.id || p.category === mainCategory.slug || p.category === 'brakes' || p.category === 'braking_system';
    if (!matchCat) return false;

    if (selectedSubPill !== 'all' && p.subCategory && p.subCategory.toLowerCase() !== selectedSubPill.toLowerCase()) {
      return false;
    }

    if (selectedBrandFilter !== 'all' && p.brand.toLowerCase() !== selectedBrandFilter.toLowerCase()) {
      return false;
    }

    if (p.price > priceMaxFilter) return false;

    if (inStockOnly && (p.stock <= 0 && (!p.stockCount || p.stockCount <= 0))) return false;

    // Vehicle compatibility filter if selectedVehicle is active
    if (selectedVehicle && p.compatibleVehicles) {
      const vMatch = p.compatibleVehicles.some(v => 
        v.toLowerCase().includes(selectedVehicle.make.toLowerCase()) || 
        v.toLowerCase().includes(selectedVehicle.model.toLowerCase())
      );
      if (!vMatch && !p.isUniversal) return false;
    }

    return true;
  });

  // Sort Products
  if (sortBy === 'price-low') {
    categoryProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    categoryProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    categoryProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  // Get Unique Brands in this Category
  const uniqueBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 selection:bg-neon-orange selection:text-white">
      
      {/* Breadcrumb & Banner Header */}
      <div className="bg-slate-900 border-b border-slate-800 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-3">
          
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
            <span onClick={() => navigateTo('home')} className="hover:text-neon-orange cursor-pointer transition">Home</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span onClick={() => navigateTo('categories')} className="hover:text-neon-orange cursor-pointer transition">All Categories</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold">{mainCategory.name}</span>
            {activeSubcategory && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-neon-orange font-bold">{activeSubcategory.name}</span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                <span className="text-3xl">{mainCategory.icon}</span>
                <span>{activeSubcategory ? activeSubcategory.name : mainCategory.name}</span>
                <span className="text-xs bg-slate-800 text-slate-400 font-extrabold px-3 py-1 rounded-full uppercase">
                  {categoryProducts.length} Products
                </span>
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
                {activeSubcategory ? activeSubcategory.description : mainCategory.description}
              </p>
            </div>

            {selectedVehicle && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-bold shrink-0">
                <Car className="w-4 h-4" />
                <span>Filtered for {selectedVehicle.make} {selectedVehicle.model}</span>
              </div>
            )}
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Subcategories Horizontal Scroll Bar */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedSubPill('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer shrink-0 ${
              selectedSubPill === 'all'
                ? 'bg-neon-orange text-white shadow-lg shadow-neon-orange/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            All Subcategories ({mainCategory.subcategories.length})
          </button>

          {mainCategory.subcategories.map((sub, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSubPill(sub.name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                selectedSubPill === sub.name
                  ? 'bg-neon-orange text-white shadow-lg shadow-neon-orange/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>

        {/* Filters & Products Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar Filters */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-black text-white text-sm flex items-center gap-2">
                  <Filter className="w-4 h-4 text-neon-orange" />
                  <span>Filter Products</span>
                </h3>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">Manufacturer Brand</label>
                <select
                  value={selectedBrandFilter}
                  onChange={(e) => setSelectedBrandFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-orange"
                >
                  <option value="all">All Brands ({uniqueBrands.length})</option>
                  {uniqueBrands.map((b, i) => (
                    <option key={i} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                  <span>Max Price</span>
                  <span className="text-neon-orange">₹{priceMaxFilter.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="25000"
                  step="500"
                  value={priceMaxFilter}
                  onChange={(e) => setPriceMaxFilter(Number(e.target.value))}
                  className="w-full accent-neon-orange bg-slate-950"
                />
              </div>

              {/* Availability Filter */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <input
                  type="checkbox"
                  id="instock"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-neon-orange rounded"
                />
                <label htmlFor="instock" className="text-xs font-bold text-slate-300 cursor-pointer">
                  In Stock Only
                </label>
              </div>

              {/* Sort By */}
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-xs font-bold text-slate-400 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-orange"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

            </div>
          </div>

          {/* Right Products Grid */}
          <div className="lg:col-span-9 space-y-6">
            
            {categoryProducts.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
                <Layers className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-lg font-black text-white">No products found matching filters</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try adjusting your price slider, brand filter, or vehicle fitment selection.
                </p>
                <button
                  onClick={() => { setSelectedSubPill('all'); setSelectedBrandFilter('all'); setPriceMaxFilter(25000); setInStockOnly(false); }}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {categoryProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-slate-900 border border-slate-800 hover:border-neon-orange/40 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl group"
                  >
                    <div>
                      <div className="relative h-44 bg-slate-950 rounded-xl overflow-hidden mb-3 flex items-center justify-center p-3">
                        <img
                          src={product.image || product.image_url}
                          alt={product.title || product.name}
                          className="max-h-full object-contain group-hover:scale-105 transition duration-300"
                        />
                        <span className="absolute top-2 right-2 bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 uppercase">
                          {product.classification || 'OEM'}
                        </span>
                      </div>

                      <div className="text-[11px] font-bold text-slate-400">{product.brand}</div>
                      <h4
                        onClick={() => navigateTo('product-detail', product.id)}
                        className="font-extrabold text-white text-xs mt-0.5 line-clamp-2 hover:text-neon-orange cursor-pointer transition"
                      >
                        {product.title || product.name}
                      </h4>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        <div className="text-base font-black text-white">₹{product.price.toLocaleString('en-IN')}</div>
                        {product.mrp && <div className="text-[11px] text-slate-500 line-through">₹{product.mrp.toLocaleString('en-IN')}</div>}
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        className="bg-gradient-to-r from-neon-orange to-amber-500 hover:from-amber-500 hover:to-neon-orange text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-neon-orange/20 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* Category SEO Content Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3 mt-12">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>{seo.seo_title}</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {seo.seo_description} AutoZonIndia supplies 100% genuine original equipment manufacturer (OEM) & certified OES automotive spare parts across India with 7-day fitment guarantee and fast express delivery.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
