import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, Search, Car, ShoppingCart, User } from 'lucide-react';

export function MobileBottomNav() {
  const { currentView, navigateTo, cart } = useStore();
  const cartItemCount = cart ? cart.length : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 border-t border-slate-800 backdrop-blur-lg flex justify-around items-center h-16 px-1 pb-safe z-50 md:hidden shadow-[0_-4px_25px_rgba(0,0,0,0.5)]">
      <button
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${currentView === 'home' ? 'text-orange-400 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-200'}`}
        onClick={() => navigateTo('home')}
      >
        <Home className={`w-5 h-5 ${currentView === 'home' ? 'fill-orange-500/20 text-orange-400' : ''}`} />
        <span className="text-[10px] font-bold">Home</span>
      </button>

      <button
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${currentView === 'catalog' ? 'text-orange-400 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-200'}`}
        onClick={() => navigateTo('catalog')}
      >
        <Search className={`w-5 h-5 ${currentView === 'catalog' ? 'stroke-[2.5px] text-orange-400' : ''}`} />
        <span className="text-[10px] font-bold">Search</span>
      </button>

      <button
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${currentView === 'my-garage' ? 'text-orange-400 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-200'}`}
        onClick={() => navigateTo('my-garage')}
      >
        <Car className={`w-5 h-5 ${currentView === 'my-garage' ? 'fill-orange-500/20 text-orange-400' : ''}`} />
        <span className="text-[10px] font-bold">Garage</span>
      </button>

      <button
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all relative ${currentView === 'cart' ? 'text-orange-400 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-200'}`}
        onClick={() => navigateTo('cart')}
      >
        <div className="relative">
          <ShoppingCart className={`w-5 h-5 ${currentView === 'cart' ? 'fill-orange-500/20 text-orange-400' : ''}`} />
          {cartItemCount > 0 && (
            <span className="absolute -top-1.5 -right-2.5 bg-orange-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-slate-900 shadow">
              {cartItemCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold">Cart</span>
      </button>

      <button
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${currentView === 'orders' || currentView === 'my-account' ? 'text-orange-400 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-200'}`}
        onClick={() => navigateTo('orders')}
      >
        <User className={`w-5 h-5 ${currentView === 'orders' || currentView === 'my-account' ? 'fill-orange-500/20 text-orange-400' : ''}`} />
        <span className="text-[10px] font-bold">Account</span>
      </button>
    </div>
  );
}

export default MobileBottomNav;
