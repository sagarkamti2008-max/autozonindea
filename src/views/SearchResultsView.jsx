import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { rankSearchResults, logSearchQuery } from '../services/advancedSearchEngine';
import { checkProductCompatibility } from '../services/compatibilityService';
import { Search, Filter, SlidersHorizontal, X, CheckCircle2, AlertCircle, HelpCircle, ArrowUpDown, ChevronRight, Car, ShoppingCart, Eye } from 'lucide-react';

export default function SearchResultsView() {
  const { products, categories, brands, selectedVehicle, navigateTo, addToCart, showToast } = useStore();

  // Read URL query params
  const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      q: params.get('q') || '',
      category: params.get('category') || 'all',
      brand: params.get('brand') || 'all',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
      stock: params.get('stock') || 'all',
      sort: params.get('sort') || 'relevance'
    };
  };

  const initialParams = getUrlParams();
  const [query, setQuery] = useState(initialParams.q);
  const [selectedCategory, setSelectedCategory] = useState(initialParams.category);
  const [selectedBrand, setSelectedBrand] = useState(initialParams.brand);
  const [minPrice, setMinPrice] = useState(initialParams.minPrice);
  const [maxPrice, setMaxPrice] = useState(initialParams.maxPrice);
  const [stockFilter, setStockFilter] = useState(initialParams.stock);
  const [sortBy, setSortBy] = useState(initialParams.sort);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Compatibility map cache: productId -> 'compatible' | 'not_compatible' | 'not_confirmed'
  const [compatibilityMap, setCompatibilityMap] = useState({});

  useEffect(() => {
    // Sync state with URL params changes
    const p = getUrlParams();
    setQuery(p.q);
  }, [window.location.search]);

  // Update URL Query Parameters for persistence & sharing
  const updateUrlParams = (newParams) => {
    const url = new URL(window.location.href);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val && val !== 'all' && val !== '') {
        url.searchParams.set(key, val);
      } else {
        url.searchParams.delete(key);
      }
    });
    window.history.replaceState({}, '', url.toString());
  };

  // Execute Relevance Ranking & Filtering
  const filteredProducts = useMemo(() => {
    let result = rankSearchResults(products, query, selectedVehicle);

    // Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => (p.category || p.category_id || '').toString().toLowerCase() === selectedCategory.toLowerCase());
    }

    // Brand Filter
    if (selectedBrand !== 'all') {
      result = result.filter(p => (p.brand || p.brand_id || '').toString().toLowerCase() === selectedBrand.toLowerCase());
    }

    // Min & Max Price Filters
    if (minPrice !== '') {
      result = result.filter(p => Number(p.price || 0) >= Number(minPrice));
    }
    if (maxPrice !== '') {
      result = result.filter(p => Number(p.price || 0) <= Number(maxPrice));
    }

    // Stock Filter
    if (stockFilter === 'in_stock') {
      result = result.filter(p => (p.stock || 0) > 0);
    } else if (stockFilter === 'out_of_stock') {
      result = result.filter(p => (p.stock || 0) <= 0);
    }

    // Sorting
    if (sortBy === 'price_low_high') {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortBy === 'price_high_low') {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    return result;
  }, [products, query, selectedCategory, selectedBrand, minPrice, maxPrice, stockFilter, sortBy, selectedVehicle]);

  // Log Search Analytics & Preload Compatibility
  useEffect(() => {
    if (query) {
      logSearchQuery({
        query,
        resultCount: filteredProducts.length,
        vehicleId: selectedVehicle?.id
      });
    }

    // Evaluate explicit vehicle compatibility if vehicle selected
    if (selectedVehicle && filteredProducts.length > 0) {
      filteredProducts.forEach(async (p) => {
        const fitStatus = await checkProductCompatibility(p.id, selectedVehicle.id || selectedVehicle);
        setCompatibilityMap(prev => ({ ...prev, [p.id]: fitStatus }));
      });
    }
  }, [query, selectedVehicle, filteredProducts.length]);

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setMinPrice('');
    setMaxPrice('');
    setStockFilter('all');
    setSortBy('relevance');
    updateUrlParams({ q: query, category: 'all', brand: 'all', minPrice: '', maxPrice: '', stock: 'all', sort: 'relevance' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Search Info Bar */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
            <span>Store Catalog Search</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-amber-400 font-bold">"{query || 'All Spare Parts'}"</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Search Results for <span className="text-amber-400">"{query || 'All Parts'}"</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Showing <strong className="text-white">{filteredProducts.length}</strong> matching automotive replacement parts
          </p>
        </div>

        {/* Selected Vehicle Badge context */}
        {selectedVehicle && (
          <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-3 flex items-center space-x-3 text-xs">
            <Car className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div>
              <span className="text-slate-400 text-[11px] uppercase font-bold block">Vehicle Fitment Active</span>
              <span className="font-bold text-white">
                {selectedVehicle.make || selectedVehicle.makeName} {selectedVehicle.model || selectedVehicle.modelName} ({selectedVehicle.year || 'All Years'})
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-500" /> Catalog Filters
            </h3>
            <button onClick={handleClearFilters} className="text-xs text-amber-400 hover:underline font-semibold">
              Clear All
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                updateUrlParams({ category: e.target.value });
              }}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:border-amber-500 outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Brand / OEM</label>
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                updateUrlParams({ brand: e.target.value });
              }}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:border-amber-500 outline-none"
            >
              <option value="all">All Brands</option>
              {brands.map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Stock Availability Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Stock Availability</label>
            <select
              value={stockFilter}
              onChange={(e) => {
                setStockFilter(e.target.value);
                updateUrlParams({ stock: e.target.value });
              }}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:border-amber-500 outline-none"
            >
              <option value="all">All Inventory Statuses</option>
              <option value="in_stock">In Stock Only</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          {/* Price Range Slider & Inputs */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Price Range (₹)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  updateUrlParams({ minPrice: e.target.value });
                }}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 outline-none"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  updateUrlParams({ maxPrice: e.target.value });
                }}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Main Product Grid & Controls */}
        <div className="lg:col-span-3">
          {/* Sorting Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden w-full sm:w-auto px-4 py-2 bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center space-x-2"
            >
              <Filter className="w-4 h-4 text-amber-500" />
              <span>Filter Catalog</span>
            </button>

            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <span className="text-xs text-slate-400 font-medium">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  updateUrlParams({ sort: e.target.value });
                }}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 font-medium focus:border-amber-500 outline-none"
              >
                <option value="relevance">Relevance Priority</option>
                <option value="price_low_high">Price: Low to High</option>
                <option value="price_high_low">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Product Grid or No-Result Fallback */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => {
                const fitStatus = compatibilityMap[p.id] || (selectedVehicle ? 'not_confirmed' : null);
                const isAvailable = (p.stock || 0) > 0;

                return (
                  <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition shadow-lg group">
                    <div>
                      {/* Brand & Stock Header */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{p.brand || 'OE Quality'}</span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
                          isAvailable ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {isAvailable ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      {/* Product Name & SKU */}
                      <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition line-clamp-2 mb-1">
                        {p.name || p.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono mb-3">SKU: {p.sku || 'AZI-SKU-VERIFIED'}</p>

                      {/* Compatibility Badge (Explicit Verification Rule) */}
                      {selectedVehicle && (
                        <div className="mb-4">
                          {fitStatus === 'compatible' ? (
                            <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold inline-flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Fits {selectedVehicle.model || selectedVehicle.modelName}
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-400 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Compatibility not confirmed
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Price & Action Button */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-500 block">Price (incl. GST)</span>
                        <span className="text-xl font-black text-white">₹{Number(p.price || 0).toLocaleString('en-IN')}</span>
                      </div>

                      <button
                        onClick={() => {
                          addToCart(p);
                          showToast(`Added "${p.name || p.title}" to cart!`, 'success');
                        }}
                        disabled={!isAvailable}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition disabled:opacity-50 flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* No Result Fallback Experience */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center shadow-xl">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Sorry, we couldn't find an exact match</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">
                We couldn't find any catalog spare parts matching "{query}". Try checking your spelling or use our Vehicle Part Finder.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => navigateTo('parts-for-my-car')}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <Car className="w-4 h-4" /> Find Parts for My Car
                </button>
                <button
                  onClick={() => navigateTo('all-categories')}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-sm border border-slate-700 transition"
                >
                  Browse Categories
                </button>
                <button
                  onClick={() => navigateTo('support')}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-xl text-sm border border-slate-700 transition flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4" /> Send Part Enquiry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
