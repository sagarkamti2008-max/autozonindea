import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, ShoppingBag, CheckCircle } from 'lucide-react';

export default function BuyNowView() {
  const {
    buyNowProduct,
    setBuyNowProduct,
    addToCart,
    navigateTo,
    showToast,
    selectedVehicle,
    clearCart,
    deductInventoryStock,
    addCompletedOrder,
    appliedCouponCode,
    setAppliedCouponCode,
    savedAddresses,
    addSavedAddress,
    selectedAddressId,
    setSelectedAddressId,
    shippingAddress,
    setShippingAddress
  } = useStore();

  // Redirect if no product selected
  if (!buyNowProduct) {
    navigateTo('catalog');
    return null;
  }

  const [quantity, setQuantity] = useState(buyNowProduct.quantity || 1);
  const product = { ...buyNowProduct, quantity };

  const handleQuantity = (delta) => {
    setQuantity((q) => Math.max(1, q + delta));
  };

  const handleProceed = () => {
    // Add product to cart, clear BuyNow state, go to checkout
    addToCart(product, quantity);
    setBuyNowProduct(null);
    navigateTo('checkout');
    showToast('Product added via Buy Now – continue to checkout!', 'success');
  };

  const remainingStock = product.stock ?? product.stockCount ?? product.inventory?.quantity ?? 10;
  const isOutOfStock = remainingStock <= 0;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 font-sans">
      <div className="max-w-2xl w-full mx-4 bg-white rounded-2xl shadow-xl p-8 backdrop-filter backdrop-blur-lg bg-opacity-70 border border-slate-200">
        <button
          onClick={() => navigateTo('catalog')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Catalog
        </button>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image */}
          <div className="flex-1 flex items-center justify-center bg-slate-100 rounded-xl overflow-hidden">
            <img
              src={product.image || product.images?.[0] || 'https://via.placeholder.com/400x300?text=AutoZon'}
              alt={product.name || product.title}
              className="max-h-64 object-contain"
            />
          </div>
          {/* Details */}
          <div className="flex-1 flex flex-col">
            <h1 className="text-2xl font-black text-slate-900 mb-2">
              {product.name || product.title}
            </h1>
            <p className="text-slate-600 mb-4 line-clamp-3">
              {product.description || 'High‑quality auto part ready for your vehicle.'}
            </p>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-black text-amber-600">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-slate-400 line-through">
                  ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => handleQuantity(-1)}
                disabled={quantity <= 1}
                className="w-8 h-8 flex items-center justify-center bg-slate-200 rounded-full hover:bg-slate-300 disabled:opacity-50"
              >-</button>
              <span className="font-medium text-lg">{quantity}</span>
              <button
                onClick={() => handleQuantity(1)}
                disabled={isOutOfStock}
                className="w-8 h-8 flex items-center justify-center bg-slate-200 rounded-full hover:bg-slate-300 disabled:opacity-50"
              >+</button>
            </div>
            <button
              disabled={isOutOfStock}
              onClick={handleProceed}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-black text-white transition-all 
                ${isOutOfStock ? 'bg-slate-300 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-90'}
              `}
            >
              <ShoppingBag className="w-5 h-5" />
              {isOutOfStock ? 'Unavailable' : 'Buy Now – Checkout'}
            </button>
            {isOutOfStock && (
              <p className="mt-2 text-red-600 text-sm">This item is currently out of stock.</p>
            )}
            {/* Compatibility badge */}
            {selectedVehicle && (
              <div className="mt-6 flex items-center gap-2 text-sm">
                {product.compatibilityStatus === true ? (
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded border border-emerald-200 font-bold uppercase">
                    <CheckCircle className="w-3.5 h-3.5" /> Guaranteed Fit
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded border border-amber-200 font-bold uppercase">
                    Verify Fitment
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
