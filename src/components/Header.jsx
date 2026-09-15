import React, { useState } from 'react';
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
    setIsVehicleModalOpen
  } = useStore();

  const [searchQueryInput, setSearchQueryInput] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileData = getCustomerProfile();

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
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              🚚 Free shipping above ₹999
            </span>
            <span className="hidden md:inline-block text-slate-500">|</span>
            <span className="hidden md:inline-block text-amber-400 font-semibold">
              💵 COD available
            </span>
            <span className="hidden lg:inline-block text-slate-500">|</span>
            <span className="hidden lg:inline-block text-slate-300 font-semibold">
              ✅ 100% Genuine Parts
            </span>
          </div>

          <div className="flex items-center gap-4 font-semibold">
            {/* WhatsApp Direct Assistance */}
            <a 
              href="https://wa.me/918591719499?text=Hi%20AutoZonIndia,%20I%20need%20help%20finding%20a%20spare%20part" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <MessageCircle size={14} className="fill-emerald-400/20" />
              <span>WhatsApp: <b>+91 8591719499</b></span>
            </a>

            <span className="text-slate-600">|</span>

            {/* Toll-free Helpline */}
            <a 
              href="tel:1800123456" 
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <PhoneCall size={14} />
              <span className="hidden sm:inline">Helpline: <b>1800-AZ-INDIA</b></span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 lg:gap-6">
          
          {/* Mobile Hamburger Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-slate-700 hover:text-orange-500 transition-colors"
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* LEFT: Logo + Site Name */}
          <div 
            onClick={() => navigateTo('home')} 
            className="cursor-pointer flex items-center gap-2.5 shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Wrench size={22} />
            </div>
            <div className="flex flex-col">
              <h1 className="font-black text-2xl md:text-3xl tracking-tight text-slate-900 leading-none">
                AutoZon<span className="text-orange-500">India</span>
              </h1>
              <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                CAR PARTS & ACCESSORIES MARKETPLACE
              </span>
            </div>
          </div>

          {/* CENTER: Search Bar + Vehicle Selector Widget */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-3xl">
            
            {/* Search Input Box */}
            <div className="relative flex-1">
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-slate-50 border border-slate-300 rounded-2xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all shadow-inner">
                <Search className="w-5 h-5 text-slate-400 shrink-0 ml-1" />
                <input
                  type="text"
                  placeholder="Part number, car model ya part name likhein"
                  value={searchQueryInput}
                  onChange={(e) => {
                    setSearchQueryInput(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
                  className="w-full bg-transparent border-none outline-none px-3 py-1 text-sm font-medium text-slate-900 placeholder:text-slate-400"
                />
                <button 
                  type="button"
                  onClick={handleVoiceSearch}
                  className="p-1.5 text-slate-400 hover:text-orange-500 transition-colors"
                  title="Voice Search"
                >
                  <Mic className="w-4 h-4" />
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
                            navigateTo('product-detail');
                          }}
                          className="flex items-center gap-4 px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                        >
                          <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                            <img src={item.image || item.image_url} alt={item.name} className="max-w-full max-h-full object-contain" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-bold text-slate-900 line-clamp-1">{item.name || item.title}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{item.brand || 'AutoZon'} • SKU: {item.sku || 'N/A'}</div>
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

            {/* Vehicle Selector (Make ▸ Model ▸ Year ▸ Variant) + "Find Parts" Button */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsVehicleModalOpen(true)}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 px-3.5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all shadow-sm"
                title="Select Make ▸ Model ▸ Year ▸ Variant"
              >
                <Car size={16} className="text-orange-500" />
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">GARAGE VEHICLE</span>
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                    {selectedVehicle ? `${selectedVehicle.makeName} ${selectedVehicle.modelName}` : 'Make ▸ Model ▸ Year ▸ Variant'}
                  </span>
                </div>
                <ChevronDown size={14} className="text-slate-500" />
              </button>

              <button
                onClick={() => {
                  if (!selectedVehicle) {
                    setIsVehicleModalOpen(true);
                  } else {
                    navigateTo('catalog');
                  }
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-orange-500/20 shrink-0"
              >
                Find Parts
              </button>
            </div>

          </div>

          {/* RIGHT: Cart Icon, Login/Account Icon, Helpline/WhatsApp */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            
            {/* Helpline / WhatsApp Quick Action (Desktop) */}
            <div className="hidden lg:flex flex-col text-right pr-2 border-r border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">WhatsApp Helpline</span>
              <a 
                href="https://wa.me/918591719499" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-black text-emerald-600 hover:underline flex items-center gap-1 justify-end"
              >
                <MessageCircle size={12} className="fill-emerald-500" /> +91 8591719499
              </a>
            </div>

            {/* Wishlist Icon */}
            <button 
              onClick={() => navigateTo('wishlist')}
              className="relative p-2 text-slate-600 hover:text-red-500 transition-colors rounded-xl hover:bg-slate-100"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItemCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {wishlistItemCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button 
              onClick={() => navigateTo('cart')}
              className="relative p-2 text-slate-600 hover:text-orange-500 transition-colors rounded-xl hover:bg-slate-100"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 bg-orange-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Account / Login Icon */}
            <button 
              onClick={() => navigateTo('my-account')}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
              title="Login / My Account"
            >
              <User className="w-4 h-4 text-orange-400" />
              <span className="hidden sm:inline">
                {user ? (profileData.firstName || 'Account') : 'Login / Account'}
              </span>
            </button>

          </div>

        </div>

        {/* Mobile Search & Vehicle Selector Bar */}
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

          <button
            onClick={() => setIsVehicleModalOpen(true)}
            className="bg-slate-100 border border-slate-300 text-slate-800 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Car size={14} className="text-orange-500" />
              {selectedVehicle ? `${selectedVehicle.makeName} ${selectedVehicle.modelName}` : 'Make ▸ Model ▸ Year ▸ Variant'}
            </span>
            <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md">Find Parts</span>
          </button>
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
                onClick={() => { setIsVehicleModalOpen(true); setIsMobileMenuOpen(false); }} 
                className="flex items-center gap-4 w-full p-3.5 text-left font-bold text-slate-700 hover:text-orange-500 hover:bg-orange-50 rounded-xl"
              >
                <Car className="w-5 h-5 text-orange-500" /> Select Your Car
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
