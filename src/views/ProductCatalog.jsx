import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { rankProductSearchResults } from '../services/searchDiscoveryEngine';
import { checkVehicleProductCompatibility, isProductMatchingVehicleAndCategory } from '../services/catalogEngine';
import {
  Search, Sliders, Car, ShieldCheck, Star, Heart, ArrowRightLeft,
  Wrench, ChevronDown, Filter, X, CheckCircle2, AlertTriangle, Sparkles, ShoppingCart, Truck, Zap,
  Check, RotateCcw, Layers
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
    selectedBrand,
    setSelectedBrand,
    selectedClassification,
    setSelectedClassification,
    filterFitsVehicle,
    setFilterFitsVehicle,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    addToCart,
    buyNow,
    toggleWishlist,
    wishlist,
    navigateTo
  } = useStore();

  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [localSearch, setLocalSearch] = useState(searchQuery || '');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Extract unique filters from all products dynamically
  const { uniqueBrands, uniqueCategories, maxPriceBound, brandCounts, categoryCounts } = useMemo(() => {
    const brands = new Set();
    const categories = new Set();
    const bCounts = {};
    const cCounts = {};
    let maxP = 1000;
    
    (products || []).forEach(p => {
      if (p.brand || p.carBrand) {
        const b = p.brand || p.carBrand;
        brands.add(b);
        bCounts[b] = (bCounts[b] || 0) + 1;
      }
      if (p.category) {
        categories.add(p.category);
        cCounts[p.category] = (cCounts[p.category] || 0) + 1;
      }
      const pPrice = Number(p.sellingPrice || p.price || 0);
      if (pPrice > maxP) maxP = pPrice;
    });

    return {
      uniqueBrands: Array.from(brands).sort(),
      uniqueCategories: Array.from(categories).sort(),
      maxPriceBound: Math.max(10000, Math.ceil(maxP / 1000) * 1000),
      brandCounts: bCounts,
      categoryCounts: cCounts
    };
  }, [products]);

  // Adjust current priceRange if it is uninitialized
  React.useEffect(() => {
    if (priceRange === 0 || priceRange === 10000) {
      setPriceRange(maxPriceBound);
    }
  }, [maxPriceBound, priceRange, setPriceRange]);

  // Ranked & Filtered Products Execution
  const ranked = rankProductSearchResults(products, searchQuery, selectedVehicle);

  const finalFilteredProducts = useMemo(() => {
    return ranked.filter(prod => {
      if (!prod || (!prod.title && !prod.name)) return false;
      if (prod.isActive === false || prod.status === 'inactive' || prod.activeStatus === 'inactive') return false;

      // Check dependent vehicle & category matching
      const targetBrand = selectedVehicle ? (selectedVehicle.makeName || selectedVehicle.makeId || selectedBrand) : selectedBrand;
      const targetModel = selectedVehicle ? (selectedVehicle.modelName || selectedVehicle.modelId) : '';
      const targetVariant = selectedVehicle ? (selectedVehicle.variant || '') : '';
      const targetYear = selectedVehicle ? (selectedVehicle.year || '') : '';

      const isMatched = isProductMatchingVehicleAndCategory(
        prod,
        targetBrand,
        targetModel,
        selectedCategory,
        '',
        targetVariant,
        targetYear
      );

      if (!isMatched && (selectedVehicle || selectedCategory !== 'all')) return false;

      // Classification Match
      if (selectedClassification !== 'all' && prod.classification?.toLowerCase() !== selectedClassification.toLowerCase()) return false;
      
      // Price
      const prodPrice = Number(prod.sellingPrice || prod.price || 0);
      if (prodPrice > priceRange) return false;
      
      // Stock
      if (inStockOnly && (prod.stock || 0) <= 0) return false;
      
      // Rating
      if (minRating > 0 && (prod.rating || 0) < minRating) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'popularity') return (b.sales || 0) - (a.sales || 0);
      return 0; // relevance or featured
    });
  }, [ranked, selectedCategory, selectedBrand, selectedClassification, priceRange, inStockOnly, minRating, selectedVehicle, sortBy]);

  const handleLocalSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedClassification('all');
    setFilterFitsVehicle(false);
    setInStockOnly(false);
    setMinRating(0);
    setPriceRange(maxPriceBound);
    setSearchQuery('');
    setLocalSearch('');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedBrand !== 'all' || selectedClassification !== 'all' || filterFitsVehicle || inStockOnly || minRating > 0 || priceRange < maxPriceBound || searchQuery;

  const renderFilterContent = () => (
    <div className="space-y-6">
      {/* Header Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#FF5722]" /> Filter Spares
        </h3>
        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="text-[11px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset All
          </button>
        )}
      </div>

      {/* Vehicle Fitment Switch */}
      {selectedVehicle && (
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Car className="w-4 h-4 text-[#FF5722]" /> 100% Fit {selectedVehicle.makeName}
            </span>
            <input 
              type="checkbox"
              id="fitCheck"
              checked={filterFitsVehicle}
              onChange={(e) => setFilterFitsVehicle(e.target.checked)}
              className="w-4 h-4 accent-[#FF5722] rounded cursor-pointer"
            />
          </div>
          <p className="text-[10px] text-slate-400 font-medium leading-normal">
            Show only parts guaranteed to fit {selectedVehicle.makeName} {selectedVehicle.modelName}.
          </p>
        </div>
      )}

      {/* Stock Availability */}
      <div className="space-y-2">
        <label className="text-xs font-black text-slate-300 uppercase tracking-wider block">Availability</label>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer hover:text-white transition-colors bg-slate-950 p-3 rounded-xl border border-slate-800">
          <input 
            type="checkbox" 
            checked={inStockOnly} 
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 accent-[#FF5722] rounded cursor-pointer"
          />
          <span>In Stock Items Only</span>
        </label>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-slate-300 uppercase tracking-wider">Max Price</label>
          <span className="text-xs font-black text-[#FF5722] bg-[#FF5722]/10 px-2 py-0.5 rounded border border-[#FF5722]/20">
            ₹{priceRange.toLocaleString('en-IN')}
          </span>
        </div>
        <input 
          type="range" 
          min="100" 
          max={maxPriceBound} 
          step="500" 
          value={priceRange} 
          onChange={(e) => setPriceRange(Number(e.target.value))} 
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#FF5722]"
        />
        <div className="flex justify-between text-[10px] font-bold text-slate-500">
          <span>₹100</span>
          <span>₹{maxPriceBound.toLocaleString('en-IN')}</span>
        </div>

        {/* Quick Price Pills */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          {[
            { label: '< ₹1,000', val: 1000 },
            { label: '< ₹5,000', val: 5000 },
            { label: '< ₹15,000', val: 15000 },
            { label: 'All Prices', val: maxPriceBound }
          ].map((pill, idx) => (
            <button
              key={idx}
              onClick={() => setPriceRange(pill.val)}
              className={`text-[10px] font-black py-1.5 px-2 rounded-lg border transition-all ${
                priceRange === pill.val 
                  ? 'bg-[#FF5722] text-white border-[#FF5722]' 
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brands Filter */}
      <div className="space-y-3">
        <label className="text-xs font-black text-slate-300 uppercase tracking-wider block">Brands</label>
        <div className="max-h-48 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
          <button
            onClick={() => setSelectedBrand('all')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
              selectedBrand === 'all' 
                ? 'bg-[#FF5722] text-white' 
                : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>All Brands</span>
            <span className="text-[10px] opacity-75">{products.length}</span>
          </button>
          {uniqueBrands.map(b => (
            <button
              key={b}
              onClick={() => setSelectedBrand(b)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                selectedBrand.toLowerCase() === b.toLowerCase() 
                  ? 'bg-[#FF5722] text-white' 
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="truncate">{b}</span>
              <span className="text-[10px] opacity-75">{brandCounts[b] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Categories Filter */}
      <div className="space-y-3">
        <label className="text-xs font-black text-slate-300 uppercase tracking-wider block">Categories</label>
        <div className="max-h-48 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
              selectedCategory === 'all' 
                ? 'bg-[#FF5722] text-white' 
                : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>All Categories</span>
            <span className="text-[10px] opacity-75">{products.length}</span>
          </button>
          {uniqueCategories.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                selectedCategory.toLowerCase() === c.toLowerCase() 
                  ? 'bg-[#FF5722] text-white' 
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="truncate">{c}</span>
              <span className="text-[10px] opacity-75">{categoryCounts[c] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Customer Rating Filter */}
      <div className="space-y-3">
        <label className="text-xs font-black text-slate-300 uppercase tracking-wider block">Minimum Rating</label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: 'All Ratings', r: 0 },
            { label: '4★ & Above', r: 4 },
            { label: '4.5★ & Above', r: 4.5 },
            { label: '5★ Only', r: 5 }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => setMinRating(item.r)}
              className={`text-[10px] font-black py-2 px-2.5 rounded-xl border transition-all ${
                minRating === item.r 
                  ? 'bg-amber-500 text-slate-950 border-amber-400' 
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 py-8 font-sans pb-24 selection:bg-[#FF5722] selection:text-white">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        
        {/* Active Vehicle Banner */}
        {selectedVehicle && (
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-[#0B5394]/30 rounded-2xl shadow-2xl border border-slate-800 p-5 md:p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden backdrop-blur-xl">
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
                  Variant: <span className="text-amber-400 font-bold">{selectedVehicle.variant}</span> • Year: <span className="text-amber-400 font-bold">{selectedVehicle.year}</span>
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

        {/* Horizontal Category Pills Bar (All Parts | Engine Parts | Brakes...) */}
        <div className="flex overflow-x-auto gap-2 py-3 px-1 mb-6 border-b border-slate-800/80 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 scale-[1.02]'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Parts</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
              {products.length}
            </span>
          </button>

          {uniqueCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 scale-[1.02]'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {categoryCounts[cat] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Page Title & Sort Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#FF5722]/15 text-[#FF5722] border border-[#FF5722]/30 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                100% Guaranteed Fitment Catalog
              </span>
            </div>
            <h1 className="font-black text-2xl md:text-4xl text-white tracking-tight uppercase">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Automotive Spares Catalog'}
            </h1>
            <p className="text-slate-400 font-medium text-xs sm:text-sm mt-1">
              Showing <span className="text-white font-black">{finalFilteredProducts.length}</span> verified genuine parts & accessories
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800 flex-1 md:flex-none">
              <label className="text-xs font-bold text-slate-400 pl-2 hidden md:block uppercase tracking-wider">Sort By:</label>
              <div className="relative flex-1 md:flex-none">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)} 
                  className="w-full md:w-48 appearance-none bg-slate-900 border border-slate-800 text-white font-bold text-xs rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:border-[#FF5722] cursor-pointer"
                >
                  <option value="featured">Relevance (Default)</option>
                  <option value="popularity">Best Selling</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mr-1">Active Filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-800 text-white px-3 py-1 rounded-full border border-slate-700">
                Search: "{searchQuery}" <X className="w-3 h-3 cursor-pointer hover:text-red-400" onClick={() => setSearchQuery('')} />
              </span>
            )}
            {selectedBrand !== 'all' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#FF5722]/20 text-[#FF5722] px-3 py-1 rounded-full border border-[#FF5722]/30">
                Brand: {selectedBrand} <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedBrand('all')} />
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/30">
                Category: {selectedCategory} <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedCategory('all')} />
              </span>
            )}
            {priceRange < maxPriceBound && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
                Max ₹{priceRange.toLocaleString('en-IN')} <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setPriceRange(maxPriceBound)} />
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
                In Stock Only <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setInStockOnly(false)} />
              </span>
            )}
            {minRating > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
                {minRating}★ & Above <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setMinRating(0)} />
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

        {/* Main Product Cards Grid */}
        <div className="w-full">
          <main className="w-full">
            {finalFilteredProducts.length === 0 ? (
              <div className="flex flex-col items-center w-full">
                <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl flex flex-col items-center justify-center py-16 px-6 text-center w-full mb-8 relative overflow-hidden">
                  <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-800">
                    <Search size={32} className="text-slate-500" />
                  </div>
                  <h3 className="font-black text-2xl text-white mb-3">
                    0 Parts Found {(searchQuery || localSearch) ? `for "${searchQuery || localSearch}"` : (selectedCategory !== 'all' ? `in "${selectedCategory.replace(/-/g, ' ').toUpperCase()}"` : '')}
                  </h3>
                  <p className="text-slate-400 font-medium text-xs sm:text-sm max-w-md mx-auto mb-8 leading-relaxed">
                    We couldn't find an exact match for your active filters. Try clearing your search term, resetting price range, or speak to our live fitment team.
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-4">
                    <button 
                      onClick={clearFilters}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all cursor-pointer border border-slate-700"
                    >
                      Clear Search & Filters
                    </button>
                    <button 
                      onClick={() => navigateTo('enquiry')}
                      className="bg-[#FF5722] text-white hover:bg-orange-600 font-bold text-xs py-3 px-6 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/20"
                    >
                      <AlertTriangle size={16} />
                      Request a Part Directly
                    </button>
                  </div>
                </div>

                {/* Popular Alternatives */}
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-[#FF5722]" />
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Fast-Moving Popular Parts</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products
                      .slice(0, 6)
                      .map(prod => (
                        <div key={prod.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-[#FF5722] transition-all group">
                          <div>
                            <div className="h-44 bg-slate-900 rounded-xl p-3 flex items-center justify-center mb-3">
                              <img src={prod.image || prod.image_url} alt={prod.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300" />
                            </div>
                            <span className="text-[10px] font-bold text-[#FF5722] uppercase">{prod.brand}</span>
                            <h4 className="font-extrabold text-white text-xs mt-1 line-clamp-2">{prod.title}</h4>
                          </div>
                          <div className="pt-3 border-t border-slate-800 mt-3 flex items-center justify-between">
                            <span className="text-base font-black text-white">₹{prod.price?.toLocaleString('en-IN')}</span>
                            <button onClick={() => addToCart(prod)} className="bg-[#FF5722] text-white p-2 rounded-xl text-xs font-bold">Add</button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {finalFilteredProducts.map(prod => {
                  const fitCheck = checkVehicleProductCompatibility(prod, selectedVehicle);
                  const isWishlisted = wishlist && wishlist.some(w => w.id === prod.id);
                  const discountPercent = prod.mrp && prod.mrp > prod.price 
                    ? Math.round(((prod.mrp - prod.price) / prod.mrp) * 100) 
                    : 15;

                  return (
                    <div 
                      key={prod.id} 
                      className="bg-slate-950 border border-slate-800 hover:border-[#FF5722] rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 group relative"
                    >
                      <div>
                        {/* Product Image & Badges */}
                        <div className="relative h-48 bg-slate-900 rounded-xl overflow-hidden mb-3.5 flex items-center justify-center p-3 border border-slate-800/80">
                          <img
                            src={prod.image || prod.image_url || '/oil_filter.jpg'}
                            alt={prod.title}
                            className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-300 cursor-pointer"
                            onClick={() => navigateTo('product-detail', prod.id)}
                            onError={(e) => { e.target.onerror = null; e.target.src = '/kamti-logo.png'; }}
                          />
                          
                          <span className="absolute top-2 left-2 bg-[#FF5722] text-white font-black text-[10px] px-2 py-0.5 rounded uppercase shadow-md flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> 100% Fitment
                          </span>

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

                        {/* Brand, Car Model & SubCategory */}
                        <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 mb-1">
                          <span className="text-[#FF5722]">{prod.brand || prod.carBrand}</span>
                          <span className="text-slate-400 font-medium">{prod.carModel ? `${prod.carBrand || prod.brand || ''} ${prod.carModel}` : (prod.subCategory || prod.category || 'Spare Part')}</span>
                        </div>

                        {/* Product Title */}
                        <h4
                          onClick={() => navigateTo('product-detail', prod.id)}
                          className="font-extrabold text-white text-sm line-clamp-2 hover:text-[#FF5722] cursor-pointer transition leading-snug"
                        >
                          {prod.title}
                        </h4>

                        {/* Rating Stars */}
                        <div className="flex items-center gap-1.5 mt-2 text-amber-400 text-xs font-extrabold">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current text-amber-400" />
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold">({prod.rating || 4.8} • Verified Fit)</span>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="pt-4 border-t border-slate-800/80 mt-4 space-y-2">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <div className="text-lg font-black text-white">
                              ₹{prod.price ? prod.price.toLocaleString('en-IN') : '1,299'}
                            </div>
                            {prod.mrp && prod.mrp > prod.price && (
                              <div className="text-[10px] text-slate-500 line-through font-bold">
                                ₹{prod.mrp.toLocaleString('en-IN')}
                              </div>
                            )}
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            prod.inStock !== false && (prod.stock === undefined || prod.stock > 0)
                              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                              : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                          }`}>
                            {prod.inStock !== false && (prod.stock === undefined || prod.stock > 0) ? `In Stock (${prod.stock !== undefined ? prod.stock : 10})` : 'Out of Stock'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => {
                              addToCart(prod);
                            }}
                            className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-[#FF5722] p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold"
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
                            className="bg-gradient-to-r from-[#FF5722] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 text-xs font-black shadow-md shadow-orange-500/20"
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
    </div>
  );
};
