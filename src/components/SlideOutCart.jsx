import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, X, Plus, Minus, ArrowRight, Trash2, Truck } from 'lucide-react';
import { calculateCartTotals } from '../services/pricingDiscountEngine';

export const SlideOutCart = () => {
  const { 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    navigateTo,
    user
  } = useStore();

  const [totals, setTotals] = useState({ subtotal: 0, grandTotal: 0 });

  const FREE_DELIVERY_THRESHOLD = 500;

  useEffect(() => {
    const getTotals = async () => {
      const calc = await calculateCartTotals({
        cartItems: cart,
        customerId: user?.id,
      });
      setTotals(calc);
    };
    if (isCartDrawerOpen) {
      getTotals();
    }
  }, [cart, isCartDrawerOpen, user]);

  if (!isCartDrawerOpen) return null;

  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - totals.subtotal);
  const progressPercent = Math.min(100, (totals.subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  const handleCheckout = () => {
    setIsCartDrawerOpen(false);
    navigateTo('checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      ></div>

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[#121212] text-white z-[101] shadow-2xl flex flex-col transform transition-transform duration-300 border-l border-zinc-800 font-sans">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between bg-[#121212]">
          <h2 className="text-xl font-black font-sans tracking-wide text-white">
            Your Bag ({cart.length})
          </h2>
          <button 
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Progress */}
        {cart.length > 0 && (
          <div className="px-6 py-4 bg-[#18181b] border-b border-zinc-800">
            <div className="flex items-center justify-between text-xs font-medium text-zinc-300 mb-2">
              <span>
                {amountNeededForFreeDelivery === 0 
                  ? '🎉 Free shipping unlocked!'
                  : `Add ₹${amountNeededForFreeDelivery.toLocaleString('en-IN')} more for free shipping`
                }
              </span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${amountNeededForFreeDelivery === 0 ? 'bg-amber-400' : 'bg-[#C59B4E]'}`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-zinc-500" />
              </div>
              <div>
                <h3 className="font-bold font-sans text-white text-lg">Your bag is empty</h3>
                <p className="text-xs text-zinc-400 mt-1">Explore our catalog for genuine items.</p>
              </div>
              <button 
                onClick={() => { setIsCartDrawerOpen(false); navigateTo('catalog'); }}
                className="text-[#C59B4E] text-xs font-bold uppercase tracking-wider hover:underline"
              >
                Browse Shop
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 pb-6 border-b border-zinc-800/60 last:border-0">
                <div className="w-20 h-20 bg-white rounded-xl overflow-hidden p-2 shrink-0 flex items-center justify-center">
                  <img src={item.image || item.image_url} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold font-sans text-white text-sm leading-snug line-clamp-2 pr-2">{item.name || item.title}</h4>
                      <span className="text-white font-extrabold font-sans text-sm">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      {item.specs?.['Quantity'] || item.specs?.['Size'] || item.variant || '100ml'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-full px-2 py-0.5">
                      <button 
                        onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="text-zinc-400 hover:text-white px-2 py-0.5 text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="text-zinc-400 hover:text-white px-2 py-0.5 text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-zinc-400 hover:text-red-400 text-[10px] font-mono tracking-wider uppercase flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> REMOVE
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 bg-[#121212] border-t border-zinc-800 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Subtotal</span>
              <span className="font-extrabold font-sans text-white text-lg">₹{totals.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-[#C59B4E] hover:bg-[#b58b3e] text-slate-950 font-black text-sm py-3.5 rounded-full shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              Checkout · ₹{totals.subtotal.toLocaleString('en-IN')}
            </button>
          </div>
        )}

      </div>
    </>
  );
};
