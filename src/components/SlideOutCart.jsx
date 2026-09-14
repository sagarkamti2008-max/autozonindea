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
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      ></div>

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col transform transition-transform duration-300 translate-x-0">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-xl text-orange-500">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Your Cart</h2>
            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {cart.length}
            </span>
          </div>
          <button 
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Progress */}
        {cart.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Truck className={`w-4 h-4 ${amountNeededForFreeDelivery === 0 ? 'text-emerald-500' : 'text-slate-500'}`} />
              <span className="text-xs font-bold text-slate-700">
                {amountNeededForFreeDelivery === 0 
                  ? '🎉 You have unlocked Free Delivery!'
                  : `Add ₹${amountNeededForFreeDelivery.toLocaleString('en-IN')} more for Free Delivery`
                }
              </span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${amountNeededForFreeDelivery === 0 ? 'bg-emerald-500' : 'bg-orange-500'}`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-slate-300" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-lg">Your cart is empty</h3>
                <p className="text-sm text-slate-500 mt-1">Looks like you haven't added any parts yet.</p>
              </div>
              <button 
                onClick={() => { setIsCartDrawerOpen(false); navigateTo('catalog'); }}
                className="text-orange-500 font-bold hover:text-orange-600 transition-colors"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4">
                <div className="w-20 h-20 bg-white border border-slate-200 rounded-xl overflow-hidden p-2 shrink-0">
                  <img src={item.image || item.image_url} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2">{item.name || item.title}</h4>
                    <div className="text-orange-600 font-black text-sm mt-1">
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden h-8 w-24">
                      <button 
                        onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="flex-1 flex items-center justify-center hover:bg-slate-50 text-slate-500"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="flex-1 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="flex-1 flex items-center justify-center hover:bg-slate-50 text-slate-500"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-slate-500">Subtotal</span>
              <span className="font-black text-slate-900 text-xl">₹{totals.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              Secure Checkout <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    </>
  );
};
