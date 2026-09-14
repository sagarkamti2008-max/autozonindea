import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingCart, Heart, User, Mic, Crown, Car, Clock, X, Menu, Settings } from 'lucide-react';
import { rankProductSearch } from '../services/searchDiscoveryEngine';
import { getCustomerProfile } from '../services/customerAccountEngine';

export const Header = () => {
  const { navigateTo, cart, wishlist, products, setSearchQuery, showToast, user, recentSearches, addRecentSearch, clearRecentSearches } = useStore();
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
    window.history.replaceState({}, '', `/search?q=${encodeURIComponent(searchQueryInput.trim())}`);
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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4 md:gap-8">
          {/* Hamburger Menu (Mobile Only) */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-1.5 -ml-2 text-slate-700 hover:text-orange-500 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div 
            onClick={() => navigateTo('home')} 
            className="cursor-pointer flex flex-col shrink-0 flex-1 lg:flex-none"
          >
            <h1 className="font-black text-2xl md:text-3xl tracking-tight text-slate-900 leading-none">
              AutoZon<span className="text-orange-500">India</span>
            </h1>
            <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Genuine Spare Parts
            </span>
          </div>
          
          {/* Main Navigation */}
          <div className="hidden lg:flex items-center gap-6 shrink-0">
            <button onClick={() => navigateTo('cars')} className="font-bold text-slate-700 hover:text-orange-500 transition-colors">
              Cars
            </button>
            <button onClick={() => navigateTo('catalog')} className="font-bold text-slate-700 hover:text-orange-500 transition-colors">
              Spare Parts
            </button>
            <button onClick={() => navigateTo('service-booking')} className="font-bold text-slate-700 hover:text-orange-500 transition-colors">
              Find a Mechanic
            </button>
            <button onClick={() => navigateTo('academy')} className="font-bold text-blue-600 hover:text-orange-500 transition-colors flex items-center gap-1.5">
              Tech Academy
            </button>
          </div>

          {/* Delivery Location (Pincode Check) */}
          <div 
            onClick={() => showToast('📍 Delivery Location Modal will open here')}
            className="hidden lg:flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors shrink-0"
          >
            <div className="text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500">Deliver to Suraj</span>
              <span className="text-sm font-black text-slate-900">Mumbai 400001</span>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="flex-1 max-w-2xl hidden md:block relative">
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-slate-50 border border-slate-300 rounded-2xl px-2 py-1.5 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all shadow-inner">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search by Part No., Part Name, Brand or Vehicle..."
                value={searchQueryInput}
                onChange={(e) => {
                  setSearchQueryInput(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="flex-1 bg-transparent border-none outline-none px-3 text-sm font-medium text-slate-900 placeholder:text-slate-400"
              />
              <button 
                type="button"
                onClick={handleVoiceSearch}
                className="p-2 text-slate-400 hover:text-orange-500 transition-colors"
                title="Voice Search"
              >
                <Mic className="w-5 h-5" />
              </button>
              <button 
                type="submit" 
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 py-2.5 rounded-xl ml-1 transition-colors"
              >
                Search
              </button>
            </form>

            {/* Search Dropdown Desktop */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-[100]">
                {/* Recent Searches */}
                {!searchQueryInput.trim() && recentSearches && recentSearches.length > 0 && (
                  <div>
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
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
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                      >
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-700">{term}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Autocomplete Suggestions */}
                {searchQueryInput.trim().length >= 2 && autocompleteSuggestions.length > 0 && (
                  <div>
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Matches</span>
                    </div>
                    {autocompleteSuggestions.map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setShowSearchDropdown(false);
                          addRecentSearch(searchQueryInput);
                          navigateTo('product', item.slug || item.id);
                        }}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                      >
                        <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
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

                {/* No Suggestions */}
                {searchQueryInput.trim().length >= 2 && autocompleteSuggestions.length === 0 && (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm font-bold text-slate-500">No instant matches for "{searchQueryInput}"</p>
                    <button onClick={handleSearchSubmit} className="mt-2 text-xs font-black text-orange-500 hover:text-orange-600">Press Enter to search catalog &rarr;</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Account, Cart, Prime, Garage Icons (Right) */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            
            {/* Wishlist */}
            <div 
              onClick={() => navigateTo('wishlist')}
              className="relative cursor-pointer text-slate-500 hover:text-red-500 transition-colors hidden sm:block"
            >
              <Heart className="w-[22px] h-[22px]" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {wishlistItemCount}
                </span>
              )}
            </div>

            {/* Cart */}
            <div 
              id="cart-icon"
              onClick={() => navigateTo('cart')}
              className="relative cursor-pointer text-slate-500 hover:text-orange-500 transition-colors hidden sm:block"
            >
              <ShoppingCart className="w-[22px] h-[22px]" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartItemCount}
                </span>
              )}
            </div>

            {/* Garage */}
            <div 
              onClick={() => navigateTo('my-garage')}
              className="cursor-pointer text-slate-500 hover:text-orange-500 transition-colors hidden sm:block"
              title="My Garage"
            >
              <Car className="w-[22px] h-[22px]" />
            </div>

            {/* Prime / Loyalty */}
            <div 
              onClick={() => navigateTo('prime')}
              className="cursor-pointer flex items-center gap-1.5 text-amber-500 hover:text-amber-600 transition-colors hidden md:flex"
              title="AutoZon Prime"
            >
              <Crown className="w-[20px] h-[20px]" fill="currentColor" />
              <span className="text-[13px] font-black tracking-tight">Prime</span>
            </div>

            {/* Profile Pill */}
            <div 
              onClick={() => navigateTo('my-account')}
              className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 p-1.5 pr-3 sm:pr-4 rounded-full transition-colors border border-transparent hover:border-slate-200 ml-1 sm:ml-2"
            >
              <div className="w-[32px] h-[32px] sm:w-[38px] sm:h-[38px] bg-slate-900 rounded-full flex items-center justify-center shrink-0">
                <span className="text-[14px] sm:text-[15px] font-black text-orange-500">{profileData.firstName?.charAt(0) || 'U'}</span>
              </div>
              <div className="hidden lg:block">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-1">Hello,</div>
                <div className="text-[14px] font-black text-slate-900 leading-none">{profileData.firstName || 'User'}</div>
              </div>
            </div>
            
          </div>
          
        </div>

        {/* Mobile Search Bar (Below Header) */}
        <div className="md:hidden pb-3 relative">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-slate-50 border border-slate-300 rounded-2xl px-2 py-1 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all shadow-inner">
            <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0" />
            <input
              type="text"
              placeholder="Search spare parts..."
              value={searchQueryInput}
              onChange={(e) => {
                setSearchQueryInput(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="flex-1 bg-transparent border-none outline-none px-3 py-1.5 text-sm font-medium text-slate-900 placeholder:text-slate-400"
            />
            <button 
              type="button"
              onClick={handleVoiceSearch}
              className="p-2 text-slate-400 hover:text-orange-500 transition-colors"
            >
              <Mic className="w-5 h-5" />
            </button>
          </form>

          {/* Search Dropdown Mobile */}
          {showSearchDropdown && autocompleteSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-[60]">
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Matches</span>
              </div>
              {autocompleteSuggestions.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    setShowSearchDropdown(false);
                    navigateTo('product', item.slug || item.id);
                  }}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-orange-50 cursor-pointer border-b border-slate-50 last:border-0"
                >
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center shrink-0 p-1">
                    <img src={item.image || item.image_url} alt={item.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-900 line-clamp-1">{item.name || item.title}</div>
                    <div className="text-xs font-black text-emerald-600">₹{item.price?.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Slide-Out Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Menu Content */}
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="p-4 flex items-center justify-between border-b border-slate-100">
              <h2 className="font-black text-xl text-slate-900">Menu</h2>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-2">
              <button 
                onClick={() => { navigateTo('cars'); setIsMobileMenuOpen(false); }} 
                className="flex items-center gap-4 w-full p-4 text-left font-bold text-slate-700 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-colors"
              >
                <Car className="w-5 h-5" /> Cars
              </button>
              <button 
                onClick={() => { navigateTo('catalog'); setIsMobileMenuOpen(false); }} 
                className="flex items-center gap-4 w-full p-4 text-left font-bold text-slate-700 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-colors"
              >
                <Settings className="w-5 h-5" /> Spare Parts
              </button>
              <button 
                onClick={() => { navigateTo('service-booking'); setIsMobileMenuOpen(false); }} 
                className="flex items-center gap-4 w-full p-4 text-left font-bold text-slate-700 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-colors"
              >
                <Clock className="w-5 h-5" /> Find a Mechanic
              </button>
              <button 
                onClick={() => { navigateTo('academy'); setIsMobileMenuOpen(false); }} 
                className="flex items-center gap-4 w-full p-4 text-left font-bold text-blue-600 hover:text-orange-500 hover:bg-blue-50 rounded-xl transition-colors"
              >
                <User className="w-5 h-5" /> Tech Academy
              </button>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={() => { navigateTo('prime'); setIsMobileMenuOpen(false); }}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
              >
                <Crown className="w-5 h-5" /> AutoZon Prime
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

