import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { MASTER_CATEGORIES_DATA, getSubcategoriesForCategory, getPartTypesForSubcategory } from '../data/categoryMasterData';
import { checkProductCompatibility } from '../services/fitmentEngine';
import { isProductMatchingVehicleAndCategory } from '../services/catalogEngine';
import { rankProductSearchResults } from '../services/searchDiscoveryEngine';
import {
  Search, Sliders, Car, ShieldCheck, Star, Heart, ArrowRightLeft,
  Wrench, ChevronDown, Filter, X, CheckCircle2, AlertTriangle, Sparkles, ShoppingCart, Truck, Zap,
  RotateCcw, Layers, SlidersHorizontal, Tag, Check, ChevronRight, Share2, HelpCircle
} from 'lucide-react';

export const ProductCatalog = () => {
  const {
    products,
    selectedVehicle,
    setIsVehicleModalOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    selectedPartType,
    setSelectedPartType,
    selectedBrand,
    setSelectedBrand,
    selectedClassification,
    setSelectedClassification,
    filterFitsVehicle,
    setFilterFitsVehicle,
    priceRange,
    setPriceRange,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    availabilityFilter,
    setAvailabilityFilter,
    productTypeFilter,
    setProductTypeFilter,
    sortBy,
    setSortBy,
    addToCart,
    buyNow,
    toggleWishlist,
    wishlist,
    navigateTo
  } = useStore();

  const [localSearch, setLocalSearch] = useState(searchQuery || '');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);

  // Parse & Sync URL Query Parameters on Load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('category');
      const subParam = params.get('subcategory');
      const brandParam = params.get('brand');
      const minPParam = params.get('minPrice');
      const maxPParam = params.get('maxPrice');
      const sortParam = params.get('sort');

      if (catParam && catParam !== selectedCategory) setSelectedCategory(catParam);
      if (subParam && subParam !== selectedSubcategory) setSelectedSubcategory(subParam);
      if (brandParam && brandParam !== selectedBrand) setSelectedBrand(brandParam);
      if (minPParam) setMinPrice(Number(minPParam));
      if (maxPParam) setMaxPrice(Number(maxPParam));
      if (sortParam) setSortBy(sortParam);
    } catch (e) {
      console.warn('URL sync error:', e);
    }
  }, []);

  // Update URL parameters when filters change
  useEffect(() => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
      if (selectedSubcategory && selectedSubcategory !== 'all') params.set('subcategory', selectedSubcategory);
      if (selectedPartType && selectedPartType !== 'all') params.set('partType', selectedPartType);
      if (selectedBrand && selectedBrand !== 'all') params.set('brand', selectedBrand);
      if (minPrice > 0) params.set('minPrice', minPrice);
      if (maxPrice < 500000 && maxPrice > 0) params.set('maxPrice', maxPrice);
      if (sortBy && sortBy !== 'featured') params.set('sort', sortBy);
      if (searchQuery) params.set('q', searchQuery);

      const queryString = params.toString();
      const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    } catch (e) {}
  }, [selectedCategory, selectedSubcategory, selectedPartType, selectedBrand, minPrice, maxPrice, sortBy, searchQuery]);

  // Dependent Subcategories for active Category
  const availableSubcategories = useMemo(() => {
    return getSubcategoriesForCategory(selectedCategory);
  }, [selectedCategory]);

  // Dependent Part Types for active Subcategory
  const availablePartTypes = useMemo(() => {
    return getPartTypesForSubcategory(selectedCategory, selectedSubcategory);
  }, [selectedCategory, selectedSubcategory]);

  // Rank Search Results
  const rankedProducts = useMemo(() => {
    return rankProductSearchResults(products || [], searchQuery, selectedVehicle);
  }, [products, searchQuery, selectedVehicle]);

  // Calculate Dynamic Filter Counts & Bounds
  const { maxPriceBound, dynamicBrandCounts, dynamicCategoryCounts, dynamicSubcategoryCounts } = useMemo(() => {
    let maxP = 1000;
    const bCounts = {};
    const cCounts = {};
    const sCounts = {};

    (products || []).forEach(p => {
      const pPrice = Number(p.sellingPrice || p.price || 0);
      if (pPrice > maxP) maxP = pPrice;

      // Brand count
      const b = p.brand || p.manufacturer || 'Generic';
      bCounts[b] = (bCounts[b] || 0) + 1;

      // Category count
      const c = p.category || p.categorySlug || 'Other';
      cCounts[c] = (cCounts[c] || 0) + 1;

      // Subcategory count
      if (p.subCategory || p.subcategoryId) {
        const s = p.subCategory || p.subcategoryId;
        sCounts[s] = (sCounts[s] || 0) + 1;
      }
    });

    return {
      maxPriceBound: Math.max(10000, Math.ceil(maxP / 1000) * 1000),
      dynamicBrandCounts: bCounts,
      dynamicCategoryCounts: cCounts,
      dynamicSubcategoryCounts: sCounts
    };
  }, [products]);

  // Filtered Products Execution
  const finalFilteredProducts = useMemo(() => {
    return rankedProducts.filter(prod => {
      if (!prod || (!prod.title && !prod.name)) return false;

      // Advanced engine matching
      const matchesEngine = isProductMatchingVehicleAndCategory(
        prod,
        selectedBrand,
        selectedVehicle ? (selectedVehicle.modelName || selectedVehicle.modelId) : 'all',
        selectedCategory,
        selectedSubcategory,
        selectedVehicle ? (selectedVehicle.variant || '') : '',
        selectedVehicle ? (selectedVehicle.year || '') : '',
        selectedPartType,
        selectedVehicle ? (selectedVehicle.engine || '') : '',
        selectedVehicle ? (selectedVehicle.fuelType || '') : '',
        {
          minPrice: minPrice || 0,
          maxPrice: maxPrice || priceRange || Infinity,
          availability: availabilityFilter,
          classification: selectedClassification,
          productType: productTypeFilter,
          selectedVehicle: filterFitsVehicle ? selectedVehicle : null,
          searchQuery
        }
      );

      if (!matchesEngine) return false;

      // Minimum Rating filter
      if (minRating > 0 && (prod.rating || 0) < minRating) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'popularity') return (b.sales || b.reviewsCount || 0) - (a.sales || a.reviewsCount || 0);
      if (sortBy === 'newest') return (b.createdAt || b.id || '').localeCompare(a.createdAt || a.id || '');
      return 0; // relevance
    });
  }, [
    rankedProducts, selectedCategory, selectedSubcategory, selectedPartType, 
    selectedBrand, selectedClassification, minPrice, maxPrice, priceRange, 
    availabilityFilter, productTypeFilter, selectedVehicle, filterFitsVehicle, 
    minRating, sortBy, searchQuery
  ]);

  // Reset Filters Handler
  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSelectedPartType('all');
    setSelectedBrand('all');
    setSelectedClassification('all');
    setFilterFitsVehicle(false);
    setMinPrice(0);
    setMaxPrice(maxPriceBound);
    setPriceRange(maxPriceBound);
    setAvailabilityFilter('in_stock');
    setProductTypeFilter('all');
    setMinRating(0);
    setSearchQuery('');
    setLocalSearch('');
  };

  const hasActiveFilters = 
    selectedCategory !== 'all' || 
    selectedSubcategory !== 'all' || 
    selectedPartType !== 'all' || 
    selectedBrand !== 'all' || 
    selectedClassification !== 'all' || 
    filterFitsVehicle || 
    availabilityFilter !== 'in_stock' || 
    productTypeFilter !== 'all' || 
    minPrice > 0 || 
    (maxPrice > 0 && maxPrice < maxPriceBound) || 
    minRating > 0 || 
    Boolean(searchQuery);

  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedSubcategory !== 'all',
    selectedPartType !== 'all',
    selectedBrand !== 'all',
    selectedClassification !== 'all',
    filterFitsVehicle,
    availabilityFilter !== 'in_stock',
    productTypeFilter !== 'all',
    minPrice > 0,
    maxPrice < maxPriceBound,
    minRating > 0,
    Boolean(searchQuery)
  ].filter(Boolean).length;

  // Render Sidebar Filters Content
  const renderSidebarFilters = () => (
    <div className="space-y-6 text-slate-200">
      
      {/* Header Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#FF5722]" /> Filter Spares
        </h3>
        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="text-[11px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Clear All
          </button>
        )}
      </div>

      {/* Vehicle Fitment Switch */}
      {selectedVehicle && (
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
              <Car className="w-4 h-4 text-[#FF5722] shrink-0" /> 100% Fit {selectedVehicle.makeName || selectedVehicle.make}
            </span>
            <input 
              type="checkbox"
              id="fitCheck"
              checked={filterFitsVehicle}
              onChange={(e) => setFilterFitsVehicle(e.target.checked)}
              className="w-4 h-4 accent-[#FF5722] rounded cursor-pointer shrink-0"
            />
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-normal">
            Show only verified parts for {selectedVehicle.makeName || selectedVehicle.make} {selectedVehicle.modelName || selectedVehicle.model}.
          </p>
        </div>
      )}

      {/* Main Categories Accordion Filter */}
      <div className="space-y-2">
        <label className="text-xs font-black text-slate-300 uppercase tracking-wider block">
          Category ({MASTER_CATEGORIES_DATA.length})
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 text-white font-bold text-xs rounded-xl p-3 focus:outline-none focus:border-[#FF5722] cursor-pointer"
        >
          <option value="all">All Categories ({products.length})</option>
          {MASTER_CATEGORIES_DATA.map(cat => (
            <option key={cat.id} value={cat.slug || cat.name}>
              {cat.icon} {cat.name} ({dynamicCategoryCounts[cat.name] || dynamicCategoryCounts[cat.slug] || 0})
            </option>
          ))}
        </select>
      </div>

      {/* Dependent Subcategories Filter */}
      {availableSubcategories.length > 0 && (
        <div className="space-y-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
          <label className="text-xs font-black text-slate-300 uppercase tracking-wider block">
            Subcategory ({availableSubcategories.length})
          </label>
          <div className="max-h-40 overflow-y-auto space-y-1 custom-scrollbar pr-1">
            <button
              onClick={() => setSelectedSubcategory('all')}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-between ${
                selectedSubcategory === 'all' 
                  ? 'bg-[#FF5722] text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>All Subcategories</span>
            </button>
            {availableSubcategories.map(sub => (
              <button
                key={sub.slug || sub.name}
                onClick={() => setSelectedSubcategory(sub.slug || sub.name)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-between ${
                  selectedSubcategory.toLowerCase() === (sub.slug || sub.name).toLowerCase()
                    ? 'bg-[#FF5722] text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="truncate">{sub.name}</span>
                <span className="text-[10px] opacity-75">
                  ({dynamicSubcategoryCounts[sub.name] || 0})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dependent Part Types Filter */}
      {availablePartTypes.length > 0 && (
        <div className="space-y-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
          <label className="text-xs font-black text-slate-300 uppercase tracking-wider block">
            Part Type ({availablePartTypes.length})
          </label>
          <select
            value={selectedPartType}
            onChange={(e) => setSelectedPartType(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-white font-bold text-xs rounded-xl p-2.5 focus:outline-none focus:border-[#FF5722] cursor-pointer"
          >
            <option value="all">All Part Types</option>
            {availablePartTypes.map(pt => (
              <option key={pt} value={pt}>{pt}</option>
            ))}
          </select>
        </div>
      )}

      {/* Price Range Filter (Min & Max Manual Input + Slider) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-slate-300 uppercase tracking-wider">Price Range (₹)</label>
          <span className="text-[11px] font-black text-[#FF5722] bg-[#FF5722]/10 px-2 py-0.5 rounded border border-[#FF5722]/20">
            ₹{minPrice.toLocaleString('en-IN')} — ₹{(maxPrice || maxPriceBound).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Dual Input Fields */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">Min Price</label>
            <input 
              type="number"
              min="0"
              max={maxPriceBound}
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 text-white font-bold text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#FF5722]"
              placeholder="₹0"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">Max Price</label>
            <input 
              type="number"
              min="0"
              max={maxPriceBound}
              value={maxPrice || maxPriceBound}
              onChange={(e) => {
                const val = Number(e.target.value);
                setMaxPrice(val);
                setPriceRange(val);
              }}
              className="w-full bg-slate-950 border border-slate-800 text-white font-bold text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#FF5722]"
              placeholder={`₹${maxPriceBound}`}
            />
          </div>
        </div>

        <input 
          type="range" 
          min="100" 
          max={maxPriceBound} 
          step="500" 
          value={maxPrice || maxPriceBound} 
          onChange={(e) => {
            const val = Number(e.target.value);
            setMaxPrice(val);
            setPriceRange(val);
          }} 
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#FF5722]"
        />

        {/* Quick Price Pills */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          {[
            { label: '< ₹1,000', max: 1000 },
            { label: '< ₹5,000', max: 5000 },
            { label: '< ₹15,000', max: 15000 },
            { label: 'All Prices', max: maxPriceBound }
          ].map((pill, idx) => (
            <button
              key={idx}
              onClick={() => {
                setMinPrice(0);
                setMaxPrice(pill.max);
                setPriceRange(pill.max);
              }}
              className={`text-[10px] font-black py-1.5 px-2 rounded-lg border transition-all ${
                maxPrice === pill.max 
                  ? 'bg-[#FF5722] text-white border-[#FF5722]' 
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Brands Filter */}
      <div className="space-y-2">
        <label className="text-xs font-black text-slate-300 uppercase tracking-wider block">Part Brand</label>
        <div className="max-h-40 overflow-y-auto space-y-1 custom-scrollbar pr-1">
          <button
            onClick={() => setSelectedBrand('all')}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-between ${
              selectedBrand === 'all' 
                ? 'bg-[#FF5722] text-white' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>All Brands</span>
            <span className="text-[10px] opacity-75">{products.length}</span>
          </button>
          {Object.keys(dynamicBrandCounts).map(b => (
            <button
              key={b}
              onClick={() => setSelectedBrand(b)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-between ${
                selectedBrand.toLowerCase() === b.toLowerCase() 
                  ? 'bg-[#FF5722] text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="truncate">{b}</span>
              <span className="text-[10px] opacity-75">{dynamicBrandCounts[b] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* OEM / Aftermarket Classification */}
      <div className="space-y-2">
        <label className="text-xs font-black text-slate-300 uppercase tracking-wider block">Classification</label>
        <div className="grid grid-cols-2 gap-1.5">
          {['all', 'OEM', 'Aftermarket', 'Genuine', 'Equivalent'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedClassification(type)}
              className={`text-[10px] font-bold py-1.5 px-2 rounded-lg border transition-all uppercase ${
                selectedClassification.toLowerCase() === type.toLowerCase()
                  ? 'bg-[#FF5722] text-white border-[#FF5722]'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {type === 'all' ? 'All Types' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="space-y-2">
        <label className="text-xs font-black text-slate-300 uppercase tracking-wider block">Availability</label>
        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 text-white font-bold text-xs rounded-xl p-2.5 focus:outline-none focus:border-[#FF5722] cursor-pointer"
        >
          <option value="in_stock">In Stock Items Only (Default)</option>
          <option value="all">Show All (Including Out of Stock)</option>
          <option value="on_order">Available on Order</option>
          <option value="out_of_stock">Out of Stock Only</option>
        </select>
      </div>

      {/* Product Type (Vehicle Specific vs Universal) */}
      <div className="space-y-2">
        <label className="text-xs font-black text-slate-300 uppercase tracking-wider block">Product Type</label>
        <div className="grid grid-cols-3 gap-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'vehicle_specific', label: 'Vehicle Specific' },
            { id: 'universal', label: 'Universal' }
          ].map(pt => (
            <button
              key={pt.id}
              onClick={() => setProductTypeFilter(pt.id)}
              className={`text-[10px] font-bold py-2 px-1 rounded-lg border text-center transition ${
                productTypeFilter === pt.id
                  ? 'bg-[#FF5722] text-white border-[#FF5722]'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {pt.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 py-6 font-sans pb-24 selection:bg-[#FF5722] selection:text-white">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        
        {/* Active Vehicle Header Banner */}
        {selectedVehicle && (
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-[#0B5394]/30 rounded-2xl shadow-2xl border border-slate-800 p-5 md:p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden backdrop-blur-xl">
            <div className="flex items-center gap-4 z-10">
              <div className="bg-[#FF5722]/20 border border-[#FF5722]/30 p-3.5 rounded-2xl shrink-0">
                <Car size={32} className="text-[#FF5722]" />
              </div>
              <div>
                <h4 className="text-white font-black text-lg md:text-xl m-0 flex items-center gap-2 uppercase tracking-wide">
                  <ShieldCheck size={20} className="text-emerald-400 shrink-0" />
                  <span className="line-clamp-1">VERIFIED SPARE PARTS FOR: {selectedVehicle.makeName} {selectedVehicle.modelName}</span>
                </h4>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 font-semibold">
                  Variant: <span className="text-amber-400 font-bold">{selectedVehicle.variant || 'All Variants'}</span> • Year: <span className="text-amber-400 font-bold">{selectedVehicle.year}</span>
                </p>
              </div>
            </div>
            <button 
              className="w-full md:w-auto bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-[#FF5722] text-white transition-all duration-200 px-5 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer z-10 shadow-lg"
              onClick={() => setIsVehicleModalOpen(true)}
            >
              <ArrowRightLeft size={16} className="text-[#FF5722]" /> Change Vehicle
            </button>
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#FF5722]/10 to-transparent pointer-events-none" />
          </div>
        )}

        {/* Category Horizontal Bar (29 Main Categories) */}
        <div className="flex overflow-x-auto gap-2 py-3 px-1 mb-6 border-b border-slate-800/80 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-[#FF5722] text-white shadow-md shadow-orange-500/20 scale-[1.02]'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Categories ({products.length})</span>
          </button>

          {MASTER_CATEGORIES_DATA.map(cat => {
            const cnt = dynamicCategoryCounts[cat.name] || dynamicCategoryCounts[cat.slug] || 0;
            const isSelected = selectedCategory.toLowerCase() === (cat.slug || cat.name).toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug || cat.name)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#FF5722] text-white shadow-md shadow-orange-500/20 scale-[1.02]'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                {cnt > 0 && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {cnt}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Page Title & Mobile Trigger / Sort Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 border-b border-slate-800 pb-6">
          <div>
            <h1 className="font-black text-2xl md:text-3xl text-white tracking-tight uppercase">
              {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory !== 'all' ? selectedCategory.replace(/-/g, ' ').toUpperCase() : 'AUTOMOTIVE PARTS CATALOG'}
            </h1>
            <p className="text-slate-400 font-medium text-xs sm:text-sm mt-1">
              Showing <span className="text-white font-black">{finalFilteredProducts.length}</span> matching verified parts
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Mobile Filter Trigger Button */}
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden flex-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4 text-[#FF5722]" />
              <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800 flex-1 md:flex-none">
              <label className="text-xs font-bold text-slate-400 pl-2 hidden md:block uppercase tracking-wider">Sort By:</label>
              <div className="relative flex-1 md:flex-none">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)} 
                  className="w-full md:w-48 appearance-none bg-slate-900 border border-slate-800 text-white font-bold text-xs rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:border-[#FF5722] cursor-pointer"
                >
                  <option value="featured">Relevance (Default)</option>
                  <option value="popularity">Popularity / Best Selling</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest Arrival</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Removable Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mr-1">Active Filters:</span>
            
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#FF5722]/20 text-[#FF5722] px-3 py-1 rounded-full border border-[#FF5722]/30">
                Category: {selectedCategory} <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedCategory('all')} />
              </span>
            )}

            {selectedSubcategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
                Subcategory: {selectedSubcategory} <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedSubcategory('all')} />
              </span>
            )}

            {selectedPartType !== 'all' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
                Part Type: {selectedPartType} <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedPartType('all')} />
              </span>
            )}

            {selectedBrand !== 'all' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/30">
                Brand: {selectedBrand} <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedBrand('all')} />
              </span>
            )}

            {selectedClassification !== 'all' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
                Type: {selectedClassification} <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedClassification('all')} />
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-800 text-white px-3 py-1 rounded-full border border-slate-700">
                Search: "{searchQuery}" <X className="w-3 h-3 cursor-pointer hover:text-red-400" onClick={() => setSearchQuery('')} />
              </span>
            )}

            <button 
              onClick={clearFilters}
              className="text-[11px] font-bold text-slate-400 hover:text-white ml-auto underline cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Layout: Sidebar (Desktop) + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 bg-slate-950/80 p-5 rounded-3xl border border-slate-800 h-fit sticky top-24 shadow-2xl">
            {renderSidebarFilters()}
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {finalFilteredProducts.length === 0 ? (
              <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-800">
                  <Search size={32} className="text-[#FF5722]" />
                </div>
                
                <h3 className="font-black text-xl md:text-2xl text-white mb-2">
                  No compatible products found.
                </h3>
                
                <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
                  {selectedVehicle 
                    ? `No part matching your selected active filters exists for ${selectedVehicle.makeName} ${selectedVehicle.modelName}. Try one of the steps below:`
                    : "No products matched all selected filter criteria."}
                </p>

                {/* Helpful Guidance Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mb-6">
                  <button 
                    onClick={() => setSelectedCategory('all')} 
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs p-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-[#FF5722]" /> Try another category
                  </button>

                  <button 
                    onClick={() => setIsVehicleModalOpen(true)} 
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs p-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Car className="w-4 h-4 text-[#FF5722]" /> Change vehicle
                  </button>

                  <button 
                    onClick={clearFilters} 
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs p-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-[#FF5722]" /> Remove filters
                  </button>

                  <button 
                    onClick={() => {
                      const msg = `Hi Kamti Automotive! I am searching by OEM part number for ${selectedVehicle ? `${selectedVehicle.makeName} ${selectedVehicle.modelName}` : 'my car'}. Can you assist?`;
                      window.open(`https://wa.me/918591719499?text=${encodeURIComponent(msg)}`, '_blank');
                    }} 
                    className="bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs p-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4" /> Search by OEM Part #
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {finalFilteredProducts.map(prod => {
                  const fitCheck = checkProductCompatibility(prod, selectedVehicle);
                  const isWishlisted = wishlist && wishlist.some(w => w.id === prod.id);
                  const discountPercent = prod.mrp && prod.mrp > prod.price 
                    ? Math.round(((prod.mrp - prod.price) / prod.mrp) * 100) 
                    : 0;

                  return (
                    <div 
                      key={prod.id} 
                      className="bg-slate-950 border border-slate-800 hover:border-[#FF5722] rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 group relative"
                    >
                      <div>
                        {/* Product Image & Badges */}
                        <div className="relative h-48 bg-slate-900 rounded-xl overflow-hidden mb-3 flex items-center justify-center p-3 border border-slate-800">
                          <img
                            src={prod.image || prod.image_url || '/oil_filter.jpg'}
                            alt={prod.title || prod.name}
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                            onClick={() => navigateTo('product-detail', prod.id)}
                            onError={(e) => { e.target.onerror = null; e.target.src = '/kamti-logo.png'; }}
                          />
                          
                          {/* Fitment Compatibility Badges */}
                          {selectedVehicle ? (
                            fitCheck.status === 'COMPATIBLE' ? (
                              <span className="absolute top-2 left-2 bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 rounded uppercase shadow-md flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> ✓ Compatible
                              </span>
                            ) : (
                              <span className="absolute top-2 left-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black text-[10px] px-2 py-0.5 rounded uppercase shadow-md flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> ⚠ Compatibility Not Verified
                              </span>
                            )
                          ) : (
                            <button
                              onClick={() => setIsVehicleModalOpen(true)}
                              className="absolute top-2 left-2 bg-slate-900/90 hover:bg-[#FF5722] text-slate-300 hover:text-white font-bold text-[9px] px-2 py-1 rounded border border-slate-700 transition"
                            >
                              Select vehicle to check fit
                            </button>
                          )}

                          {/* Wishlist Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(prod);
                            }}
                            className={`absolute top-2 right-2 p-2 rounded-full border backdrop-blur-md transition ${
                              isWishlisted 
                                ? 'bg-red-500 text-white border-red-400' 
                                : 'bg-slate-900/80 text-slate-400 hover:text-white border-slate-700'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                          </button>

                          {/* OEM Number Badge */}
                          {prod.oemPartNumber && (
                            <span className="absolute bottom-2 left-2 bg-slate-950/90 text-amber-400 text-[9px] font-mono px-2 py-0.5 rounded border border-slate-800">
                              OEM: {prod.oemPartNumber}
                            </span>
                          )}

                          {discountPercent > 0 && (
                            <span className="absolute bottom-2 right-2 bg-emerald-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded">
                              {discountPercent}% OFF
                            </span>
                          )}
                        </div>

                        {/* Brand & Subcategory */}
                        <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 mb-1">
                          <span className="text-[#FF5722] uppercase">{prod.brand || prod.manufacturer}</span>
                          <span className="text-slate-500 font-medium truncate max-w-[120px]">
                            {prod.subCategory || prod.category || 'Part'}
                          </span>
                        </div>

                        {/* Product Title */}
                        <h4
                          onClick={() => navigateTo('product-detail', prod.id)}
                          className="font-extrabold text-white text-xs sm:text-sm line-clamp-2 hover:text-[#FF5722] cursor-pointer transition leading-snug"
                        >
                          {prod.title || prod.name}
                        </h4>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 text-amber-400 text-xs font-extrabold mt-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current text-amber-400" />
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold">({prod.rating || 4.8})</span>
                        </div>
                      </div>

                      {/* Pricing & Add to Cart / Buy Now */}
                      <div className="pt-3 border-t border-slate-800/80 mt-3 space-y-2">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <div className="text-base font-black text-white">
                              ₹{prod.price ? prod.price.toLocaleString('en-IN') : '999'}
                            </div>
                            {prod.mrp && prod.mrp > prod.price && (
                              <div className="text-[10px] text-slate-500 line-through font-bold">
                                ₹{prod.mrp.toLocaleString('en-IN')}
                              </div>
                            )}
                          </div>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                            prod.stock !== 0 && prod.inStock !== false
                              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                              : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                          }`}>
                            {prod.stock !== 0 && prod.inStock !== false ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => addToCart(prod)}
                            className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-[#FF5722] p-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold"
                          >
                            <ShoppingCart className="w-3.5 h-3.5 text-[#FF5722]" />
                            <span>Add</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              buyNow(prod);
                            }}
                            className="bg-[#FF5722] hover:bg-orange-600 text-white p-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1 text-xs font-black shadow-md"
                          >
                            <span>Buy Now</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>

      </div>

      {/* Mobile Slide-Up Filter Modal / Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end md:hidden">
          <div className="w-full max-w-sm bg-slate-900 h-full p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-300 border-l border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#FF5722]" /> Mobile Filters
              </h3>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {renderSidebarFilters()}

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-[#FF5722] text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider"
              >
                Apply Filters ({finalFilteredProducts.length} Parts)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
