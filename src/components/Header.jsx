import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingCart, Heart, User, Mic, Crown, Car, Clock, X, Menu, Settings, PhoneCall, MessageCircle, ChevronDown, Wrench, ShieldCheck } from 'lucide-react';
import { rankProductSearch } from '../services/searchDiscoveryEngine';
import { getCustomerProfile } from '../services/customerAccountEngine';

export const Header = () => {
  const { 
    navigateTo, 
    cart, 
    wishlist, 
    products, 
    setSearchQuery, 
    showToast, 
    user, 
    recentSearches, 
    addRecentSearch, 
    clearRecentSearches,
    selectedVehicle,
    setSelectedVehicle,
    setIsVehicleModalOpen,
    setActiveProductId
  } = useStore();

  const [searchQueryInput, setSearchQueryInput] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileData = getCustomerProfile();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const cartItemCount = cart ? cart.length : 0;
  const wishlistItemCount = wishlist ? wishlist.length : 0;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQueryInput.trim()) return;
    setSearchQuery(searchQueryInput);
    addRecentSearch(searchQueryInput);
    setShowSearchDropdown(false);
    navigateTo('catalog');
  };

  const autocompleteSuggestions = React.useMemo(() => {
    if (!searchQueryInput || searchQueryInput.trim().length < 2) return [];
    return rankProductSearch(products || [], searchQueryInput, null).slice(0, 5);
  }, [searchQueryInput, products]);

  const handleVoiceSearch = () => {
    showToast('🎙️ Listening for Voice Command... Speak now');
    setTimeout(() => {
      const voiceTerm = 'Innova Brake Pads';
      setSearchQueryInput(voiceTerm);
      setSearchQuery(voiceTerm);
      showToast(`✅ Voice Captured: "${voiceTerm}"`);
      navigateTo('catalog');
    }, 2000);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm font-sans">
      
      {/* Top Utility Bar (Helpline & WhatsApp) */}
      <div className="bg-[#0b192c] text-white text-[10px] sm:text-xs py-1.5 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start sm:gap-4">
            <span className="flex items-center gap-1 text-amber-300 font-bold whitespace-nowrap">
              🚚 Free shipping above ₹999
            </span>
            <span className="hidden md:inline-block text-slate-500">|</span>
            <span className="hidden md:inline-block text-emerald-400 font-bold whitespace-nowrap">
              💵 COD available
            </span>
            <span className="hidden lg:inline-block text-slate-500">|</span>
            <span className="hidden lg:inline-block text-cyan-300 font-bold whitespace-nowrap">
              ✅ 100% Genuine Parts
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 font-semibold">
            <a 
              href="https://wa.me/918591719499?text=Hi%20Kamti%20Automotive,%20I%20need%20help%20finding%20a%20spare%20part" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap"
            >
              <MessageCircle size={12} className="fill-emerald-400/20" />
              <span>WhatsApp: <b>+91 8591719499</b></span>
            </a>
            <span className="hidden sm:inline text-slate-500">|</span>
            <a 
              href="tel:8591719499" 
              className="flex items-center gap-1 text-white hover:text-amber-300 transition-colors whitespace-nowrap"
            >
              <PhoneCall size={12} />
              <span className="hidden sm:inline">Helpline: <b>+91 8591719499</b></span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          
          {/* Mobile Hamburger Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-slate-700 hover:text-[#FF5722] transition-colors shrink-0"
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Brand Logo & Name */}
          <div 
            onClick={() => navigateTo('home')} 
            className="cursor-pointer flex items-center gap-2.5 shrink min-w-0"
          >
            <img 
              src="/kamti-logo.png" 
              alt="KAMTI AUTOMOTIVE Logo" 
              className="h-9 sm:h-12 w-auto object-contain rounded-xl bg-white p-1 shadow-sm border border-slate-200 shrink-0" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
            <div className="flex flex-col min-w-0">
              <h1 className="font-black text-xl sm:text-2xl md:text-3xl tracking-tight text-[#0F172A] leading-none truncate">
                KAMTI<span className="text-[#FF5722]">AUTOMOTIVE</span>
              </h1>
              <span className="hidden sm:block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 whitespace-nowrap">
                GENUINE SPARE PARTS & ACCESSORIES
              </span>
            </div>
          </div>

          {/* Search Bar Container */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-2xl">
            <div className="relative flex-1" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-slate-100 border border-slate-200 rounded-full px-4 py-1.5 shadow-inner focus-within:ring-2 focus-within:ring-[#FF5722]/30 focus-within:border-[#FF5722]">
                <input
                  type="text"
                  placeholder="Search: Alto k10 Blower Motor, Brake Pads, Filters..."
                  value={searchQueryInput}
                  onChange={(e) => {
                    setSearchQueryInput(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
                  className="w-full bg-transparent border-none outline-none px-2 py-1.5 text-sm font-medium text-slate-800 placeholder:text-slate-400"
                />
                <button 
                  type="button"
                  onClick={handleVoiceSearch}
                  className="p-1.5 text-red-500 hover:text-red-600 transition-colors"
                  title="Voice Search"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  className="ml-1 bg-[#FF5722] hover:bg-[#e04816] text-white p-2 rounded-full transition-colors flex items-center justify-center shadow-md shrink-0"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Search Dropdown */}
              {showSearchDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-[100]">
                  {/* Recent Searches */}
                  {!searchQueryInput.trim() && recentSearches && recentSearches.length > 0 && (
                    <div>
                      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Searches</span>
                        <button onClick={clearRecentSearches} className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors">Clear</button>
                      </div>
                      {recentSearches.map((term, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setSearchQueryInput(term);
                            setSearchQuery(term);
                            addRecentSearch(term);
                            setShowSearchDropdown(false);
                            navigateTo('catalog');
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                        >
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-bold text-slate-700">{term}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Autocomplete Matches */}
                  {searchQueryInput.trim().length >= 2 && autocompleteSuggestions.length > 0 && (
                    <div>
                      <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Matches</span>
                      </div>
                      {autocompleteSuggestions.map(item => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setShowSearchDropdown(false);
                            addRecentSearch(searchQueryInput);
                            if (setActiveProductId) setActiveProductId(item);
                            navigateTo('product-detail', item);
                          }}
                          className="flex items-center gap-4 px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                        >
                          <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                            <img src={item.image || item.image_url} alt={item.name} className="max-w-full max-h-full object-contain" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-bold text-slate-900 line-clamp-1">{item.name || item.title}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{item.brand || 'Kamti'} • SKU: {item.sku || 'N/A'}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs font-black text-emerald-600">₹{item.price?.toLocaleString('en-IN')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Action Icons (My Car Badge, Wishlist, Cart) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* "My Car" Persistent Badge */}
            {selectedVehicle ? (
              <div className="flex items-center gap-1.5 bg-[#0b192c] text-white px-2.5 sm:px-3 py-1.5 rounded-full border border-amber-500/40 text-xs shadow-sm">
                <Car className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="flex flex-col text-left leading-tight min-w-0">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">My Car</span>
                  <span className="font-extrabold text-xs text-amber-300 truncate max-w-[120px] sm:max-w-[160px]">
                    {selectedVehicle.makeName || selectedVehicle.make} {selectedVehicle.modelName || selectedVehicle.model} {selectedVehicle.year}
                  </span>
                </div>
                <button
                  onClick={() => setIsVehicleModalOpen(true)}
                  className="ml-1 px-2 py-0.5 text-[10px] font-black uppercase rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-colors cursor-pointer"
                  title="Change Selected Car"
                >
                  Change
                </button>
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="p-1 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                  title="Clear Car Filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsVehicleModalOpen(true)}
                className="flex items-center gap-1.5 bg-[#0B5394] hover:bg-[#073763] text-white px-3 sm:px-4 py-1.5 rounded-full text-xs font-black transition-all shadow-md shadow-blue-900/20 cursor-pointer active:scale-95"
              >
                <Car className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">Select Your Car</span>
                <span className="sm:hidden">My Car</span>
              </button>
            )}

            <button 
              onClick={() => navigateTo('wishlist')}
              className="relative p-2 text-slate-700 hover:text-[#FF5722] transition-colors rounded-xl hover:bg-slate-100"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItemCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {wishlistItemCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => navigateTo('cart')}
              className="relative p-2 text-slate-700 hover:text-[#FF5722] transition-colors rounded-xl hover:bg-slate-100 flex items-center gap-1"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF5722] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3 pt-1 flex flex-col gap-2">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-slate-50 border border-slate-300 rounded-2xl px-3 py-1.5 shadow-inner">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Part number, car model ya part name likhein"
              value={searchQueryInput}
              onChange={(e) => setSearchQueryInput(e.target.value)}
              className="w-full bg-transparent border-none outline-none px-2 text-xs font-medium text-slate-900 placeholder:text-slate-400"
            />
            <button 
              type="submit" 
              className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-lg shrink-0"
            >
              Search
            </button>
          </form>
        </div>

      </div>

      {/* Mobile Slide-Out Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="p-4 flex items-center justify-between border-b border-slate-100">
              <h2 className="font-black text-xl text-slate-900">AutoZon Menu</h2>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-2">
              <button 
                onClick={() => { navigateTo('catalog'); setIsMobileMenuOpen(false); }} 
                className="flex items-center gap-4 w-full p-3.5 text-left font-bold text-slate-700 hover:text-orange-500 hover:bg-orange-50 rounded-xl"
              >
                <Search className="w-5 h-5" /> Browse All Parts
              </button>
              <button 
                onClick={() => { navigateTo('my-account'); setIsMobileMenuOpen(false); }} 
                className="flex items-center gap-4 w-full p-3.5 text-left font-bold text-slate-700 hover:text-orange-500 hover:bg-orange-50 rounded-xl"
              >
                <User className="w-5 h-5" /> My Account & Orders
              </button>
              <a 
                href="https://wa.me/918591719499"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 w-full p-3.5 text-left font-bold text-emerald-600 bg-emerald-50 rounded-xl"
              >
                <MessageCircle className="w-5 h-5" /> WhatsApp: +91 8591719499
              </a>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
