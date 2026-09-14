import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { rankProductSearchResults } from '../services/searchDiscoveryEngine';
import { checkVehicleProductCompatibility } from '../services/catalogEngine';
import {
  Search, Sliders, Car, ShieldCheck, Star, Heart, ArrowRightLeft,
  Wrench, ChevronDown, Filter, X, CheckCircle2, AlertTriangle, Sparkles
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
    toggleWishlist,
    wishlist,
    navigateTo
  } = useStore();

  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [localSearch, setLocalSearch] = useState(searchQuery || '');

  // Extract unique filters from all products dynamically
  const { uniqueBrands, uniqueCategories, maxPriceBound } = useMemo(() => {
    const brands = new Set();
    const categories = new Set();
    let maxP = 1000;
    
    (products || []).forEach(p => {
      if (p.brand) brands.add(p.brand);
      if (p.category) categories.add(p.category);
      if (p.price && p.price > maxP) maxP = p.price;
    });

    return {
      uniqueBrands: Array.from(brands).sort(),
      uniqueCategories: Array.from(categories).sort(),
      maxPriceBound: Math.ceil(maxP / 1000) * 1000 // Round up to nearest 1000
    };
  }, [products]);

  // Adjust current priceRange if it exceeds bounds or is uninitialized
  React.useEffect(() => {
    if (priceRange === 0 || priceRange > maxPriceBound || priceRange === 10000) {
      setPriceRange(maxPriceBound);
    }
  }, [maxPriceBound, priceRange, setPriceRange]);

  // Ranked & Filtered Products Execution
  const ranked = rankProductSearchResults(products, searchQuery, selectedVehicle);

  const finalFilteredProducts = useMemo(() => {
    return ranked.filter(prod => {
      if (!prod || !prod.title) return false;
      
      // Category Match
      if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
        // Fallback exact match or alias match logic
        const categoryMap = {
          'engine_parts': ['engine_parts', 'engine', 'spare_parts', 'clutch_transmission', 'service_parts'],
          'braking_system': ['braking_system', 'brakes', 'spare_parts'],
          'suspension_steering': ['suspension_steering', 'suspension', 'steering_suspension', 'spare_parts'],
          'filters_oils': ['filters_oils', 'oils_fluids', 'service_parts', 'filters', 'engine'],
          'lighting_electrical': ['lighting_electrical', 'electrical', 'electronics'],
          'interior_exterior_accessories': ['interior_exterior_accessories', 'interior', 'exterior', 'interiors', 'car_care', 'body_shop', 'accessories']
        };
        const aliases = categoryMap[selectedCategory] || [selectedCategory];
        if (!aliases.includes(prod.category)) return false;
      }
      
      // Brand Match
      if (selectedBrand !== 'all' && prod.brand?.toLowerCase() !== selectedBrand.toLowerCase()) return false;
      
      // Classification Match
      if (selectedClassification !== 'all' && prod.classification?.toLowerCase() !== selectedClassification.toLowerCase()) return false;
      
      // Price
      if (prod.price > priceRange) return false;
      
      // Stock
      if (inStockOnly && (prod.stock || 0) <= 0) return false;
      
      // Rating
      if (minRating > 0 && (prod.rating || 0) < minRating) return false;
  
      // Vehicle Fitment
      if (filterFitsVehicle && selectedVehicle) {
        const check = checkVehicleProductCompatibility(prod, selectedVehicle);
        if (!check.compatible) return false;
      }
  
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'popularity') return (b.sales || 0) - (a.sales || 0);
      return 0; // relevance or featured
    });
  }, [ranked, selectedCategory, selectedBrand, selectedClassification, priceRange, inStockOnly, minRating, filterFitsVehicle, selectedVehicle, sortBy]);

  const handleLocalSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedClassification('all');
    setFilterFitsVehicle(false);
    setMinRating(0);
    setPriceRange(maxPriceBound);
    setSearchQuery('');
    setLocalSearch('');
  };

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen py-8 font-sans">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl pb-20 md:pb-8">
        
        {/* Active Vehicle Banner */}
        {selectedVehicle && (
          <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-4 md:p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-orange-500/20 p-3 rounded-xl shrink-0">
                <Car size={32} className="text-orange-500" />
              </div>
              <div>
                <h4 className="text-white font-black text-lg md:text-xl m-0 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-emerald-400 shrink-0" />
                  <span className="line-clamp-1">Showing verified parts for: {selectedVehicle.makeName} {selectedVehicle.modelName}</span>
                </h4>
                <p className="text-slate-400 text-sm mt-1">
                  Variant: <span className="text-slate-300 font-semibold">{selectedVehicle.variant}</span> • Year: <span className="text-slate-300 font-semibold">{selectedVehicle.year}</span>
                </p>
              </div>
            </div>
            <button 
              className="w-full md:w-auto bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              onClick={() => setIsVehicleModalOpen(true)}
            >
              <ArrowRightLeft size={16} /> Change Vehicle
            </button>
          </div>
        )}

        {/* Page Title & Sort Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <div>
            <h1 className="font-black text-2xl md:text-4xl text-slate-900 tracking-tight mb-1 md:mb-2">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Automotive Spares Catalog'}
            </h1>
            <p className="text-slate-500 font-medium text-sm md:text-base">
              Showing <span className="text-slate-900 font-bold">{finalFilteredProducts.length}</span> verified products
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              className="lg:hidden flex items-center justify-center gap-2 flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-2.5 rounded-xl shadow-sm"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <Filter size={18} className="text-orange-500" /> Filters
            </button>
            <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex-1 md:flex-none">
              <label className="text-sm font-bold text-slate-500 pl-2 hidden md:block">Sort:</label>
              <div className="relative flex-1 md:flex-none">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)} 
                  className="w-full md:w-48 appearance-none bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-sm rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500/50 cursor-pointer"
                >
                  <option value="featured">Relevance (Default)</option>
                  <option value="popularity">Best Selling</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Filters Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <aside className={`lg:col-span-1 ${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:sticky lg:top-24">
              
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                  <Filter size={20} className="text-orange-500" /> Filters
                </h3>
                <button 
                  className="text-slate-400 hover:text-red-500 text-xs font-bold uppercase tracking-wider transition-colors"
                  onClick={clearFilters}
                >
                  Clear All
                </button>
              </div>

              {/* Local Search */}
              <div className="mb-6">
                <form onSubmit={handleLocalSearchSubmit} className="relative">
                  <input 
                    type="text" 
                    placeholder="Search catalog..." 
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </form>
              </div>

              {/* Vehicle Compatibility Filter */}
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 border-2 rounded border-slate-300 group-hover:border-orange-500 transition-colors">
                    <input 
                      type="checkbox" 
                      className="absolute opacity-0 cursor-pointer"
                      checked={filterFitsVehicle} 
                      onChange={(e) => setFilterFitsVehicle(e.target.checked)} 
                    />
                    {filterFitsVehicle && <CheckCircle2 size={16} className="text-orange-500 absolute" />}
                  </div>
                  <span className="font-bold text-slate-700 text-sm group-hover:text-slate-900 transition-colors">Only Fits My Vehicle</span>
                </label>
                {!selectedVehicle && filterFitsVehicle && (
                  <p className="text-xs text-orange-600 font-medium mt-2 bg-orange-50 p-2 rounded-lg border border-orange-100">
                    Please select a vehicle first to use this filter.
                  </p>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-bold text-sm text-slate-900 mb-3 uppercase tracking-wider">Category</h4>
                <div className="relative">
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)} 
                    className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl py-2.5 pl-4 pr-10 focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {uniqueCategories.map(cat => (
                      <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="font-bold text-sm text-slate-900 mb-3 uppercase tracking-wider">Brand</h4>
                <div className="relative">
                  <select 
                    value={selectedBrand} 
                    onChange={(e) => setSelectedBrand(e.target.value)} 
                    className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl py-2.5 pl-4 pr-10 focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="all">All Brands</option>
                    {uniqueBrands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Classification Filter (OEM vs Aftermarket) */}
              <div className="mb-6">
                <h4 className="font-bold text-sm text-slate-900 mb-3 uppercase tracking-wider">Part Type</h4>
                <div className="relative">
                  <select 
                    value={selectedClassification} 
                    onChange={(e) => setSelectedClassification(e.target.value)} 
                    className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl py-2.5 pl-4 pr-10 focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="all">All Types</option>
                    <option value="oem">OEM (Original Equipment Manufacturer)</option>
                    <option value="oes">OES (Original Equipment Supplier)</option>
                    <option value="aftermarket">Aftermarket</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="mb-6">
                <div className="flex justify-between items-end mb-3">
                  <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Max Price</h4>
                  <span className="text-orange-500 font-black text-sm">₹{priceRange.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max={maxPriceBound} 
                  step="100" 
                  value={priceRange} 
                  onChange={(e) => setPriceRange(Number(e.target.value))} 
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500" 
                />
                <div className="flex justify-between text-xs text-slate-400 font-semibold mt-1.5">
                  <span>₹100</span>
                  <span>₹{maxPriceBound.toLocaleString()}</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="font-bold text-sm text-slate-900 mb-3 uppercase tracking-wider">Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(stars => (
                    <label key={stars} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-5 h-5 border-2 rounded-full border-slate-300 group-hover:border-orange-500 transition-colors">
                        <input 
                          type="radio" 
                          name="minRating"
                          className="absolute opacity-0 cursor-pointer"
                          checked={minRating === stars} 
                          onChange={() => setMinRating(stars)} 
                        />
                        {minRating === stars && <div className="w-2.5 h-2.5 rounded-full bg-orange-500 absolute" />}
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < stars ? "text-amber-400 fill-amber-400" : "text-slate-300"} />
                        ))}
                        <span className="text-sm font-medium text-slate-600 ml-1">& Up</span>
                      </div>
                    </label>
                  ))}
                  <label className="flex items-center gap-3 cursor-pointer group pt-1">
                    <div className="relative flex items-center justify-center w-5 h-5 border-2 rounded-full border-slate-300 group-hover:border-orange-500 transition-colors">
                      <input 
                        type="radio" 
                        name="minRating"
                        className="absolute opacity-0 cursor-pointer"
                        checked={minRating === 0} 
                        onChange={() => setMinRating(0)} 
                      />
                      {minRating === 0 && <div className="w-2.5 h-2.5 rounded-full bg-orange-500 absolute" />}
                    </div>
                    <span className="font-medium text-slate-600 text-sm">Any Rating</span>
                  </label>
                </div>
              </div>

            </div>
          </aside>

          {/* Product Cards Grid */}
          <main className="lg:col-span-3">
            {finalFilteredProducts.length === 0 ? (
              <div className="flex flex-col items-center w-full">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center py-16 px-6 text-center w-full mb-8 relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Search size={32} className="text-slate-400" />
                  </div>
                  <h3 className="font-black text-2xl text-slate-900 mb-3">0 Results Found for "{searchQuery || localSearch}"</h3>
                  <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
                    We couldn't find an exact match. Try adjusting your filters, searching by OEM number, or let our experts find it for you.
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-4">
                    <button 
                      onClick={clearFilters}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition-all"
                    >
                      Clear Search & Filters
                    </button>
                    <button 
                      onClick={() => navigateTo('enquiry')}
                      className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all"
                    >
                      <AlertTriangle size={18} />
                      Request a Part
                    </button>
                  </div>
                </div>

                {/* Alternative Products (Popular / Highly Rated) */}
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                    <h3 className="text-xl font-black text-slate-900">You might also like</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products
                      .filter(p => p.rating >= 4.5 && p.stock > 0)
                      .slice(0, 3)
                      .map(prod => {
                        const fitCheck = checkVehicleProductCompatibility(prod, selectedVehicle);
                        const isWishlisted = wishlist.some(w => w.id === prod.id);
                        return (
                          <div key={prod.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-orange-300 transition-all duration-300 group flex flex-col">
                            {/* Alternative Product Card Content (Simplified) */}
                            <div className="relative h-48 bg-slate-50 p-6 flex items-center justify-center group-hover:bg-orange-50/50 transition-colors cursor-pointer" onClick={() => navigateTo('product', prod.slug || prod.id)}>
                              <img src={prod.image || 'https://via.placeholder.com/400x300?text=AutoZonIndia'} alt={prod.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" />
                              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                                <span className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider py-1 px-2.5 rounded shadow-sm">Popular</span>
                              </div>
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                              <div className="mb-1 text-xs font-bold text-slate-400 uppercase tracking-wider">{prod.brand}</div>
                              <h3 className="font-black text-slate-900 text-lg leading-tight mb-2 line-clamp-2 cursor-pointer hover:text-orange-500" onClick={() => navigateTo('product', prod.slug || prod.id)}>{prod.title}</h3>
                              <div className="mt-auto pt-4 flex items-end justify-between">
                                <div><span className="text-xs text-slate-400 font-bold block mb-0.5">Price</span><span className="text-xl font-black text-slate-900">₹{Number(prod.price).toLocaleString('en-IN')}</span></div>
                                <button onClick={(e) => { e.stopPropagation(); addToCart(prod); }} className="bg-slate-900 hover:bg-slate-800 text-white p-3 rounded-xl transition-colors"><ShoppingCart size={18} /></button>
                              </div>
                            </div>
                          </div>
                        );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {finalFilteredProducts.map(prod => {
                  const fitCheck = checkVehicleProductCompatibility(prod, selectedVehicle);
                  const isWishlisted = wishlist.some(w => w.id === prod.id);
                  
                  return (
                    <div key={prod.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-orange-300 transition-all duration-300 group flex flex-col">
                      {/* Image Area */}
                      <div className="relative h-48 bg-slate-50 p-6 flex items-center justify-center group-hover:bg-orange-50/50 transition-colors">
                        <img 
                          src={prod.image || 'https://via.placeholder.com/400x300?text=AutoZonIndia'} 
                          alt={prod.title} 
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" 
                        />
                        
                        {/* Wishlist Button */}
                        <button 
                          className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-red-50 transition-colors z-10"
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(prod); }}
                        >
                          <Heart size={16} className={isWishlisted ? "text-red-500 fill-red-500" : "text-slate-400"} />
                        </button>
                        
                        {/* Status Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                          {prod.isFeatured && (
                            <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider py-1 px-2.5 rounded shadow-sm">
                              Featured
                            </span>
                          )}
                          {prod.stock <= 5 && prod.stock > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-wider py-1 px-2.5 rounded shadow-sm">
                              Only {prod.stock} Left
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-5 flex flex-col flex-grow">
                        {/* Vehicle Fitment Tag */}
                        <div className="mb-3 min-h-[24px]">
                          {selectedVehicle ? (
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full ${fitCheck.compatible ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                              {fitCheck.compatible ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                              {fitCheck.compatible ? `Fits ${selectedVehicle.makeName} ${selectedVehicle.modelName}` : 'Does Not Fit'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                              <Car size={12} /> {prod.compatibility || 'Universal / Multiple Vehicles'}
                            </span>
                          )}
                        </div>

                        {/* Title & Brand */}
                        <div className="mb-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {prod.brand || 'AutoZon'}
                        </div>
                        <h4 
                          className="font-bold text-slate-900 text-[15px] leading-snug mb-3 line-clamp-2 cursor-pointer hover:text-orange-500 transition-colors"
                          onClick={() => navigateTo('product-detail', prod.id)}
                          title={prod.title}
                        >
                          {prod.title}
                        </h4>

                        <div className="mt-auto">
                          {/* Price & Rating */}
                          <div className="flex justify-between items-end mb-4">
                            <div>
                              <div className="text-xs text-slate-400 font-semibold mb-0.5 line-through">
                                ₹{Math.round(prod.price * 1.15).toLocaleString()}
                              </div>
                              <div className="font-black text-xl text-slate-900">
                                ₹{prod.price.toLocaleString()}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded">
                              <Star size={14} className="text-amber-500 fill-amber-500" />
                              <span className="font-bold text-amber-700 text-sm">{prod.rating || '4.5'}</span>
                              <span className="text-amber-600/60 text-xs ml-0.5">({prod.reviews || 0})</span>
                            </div>
                          </div>

                          {/* Add to Cart & View Buttons */}
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <button 
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-colors text-xs"
                              onClick={(e) => { e.stopPropagation(); navigateTo('product-detail', prod.id); }}
                            >
                              Details
                            </button>
                            <button 
                              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl shadow-md shadow-orange-500/20 transition-colors text-xs flex items-center justify-center gap-1"
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                addToCart(prod, 1);
                              }}
                            >
                              + Add to Cart
                            </button>
                          </div>
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
