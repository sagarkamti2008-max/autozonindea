import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { checkProductCompatibility } from '../services/compatibilityService';
import { Trash2, ShoppingBag, CheckCircle, AlertTriangle, Heart, ArrowRight, TrendingDown, Bell } from 'lucide-react';

export default function WishlistView({ onNavigate }) {
  const { wishlist, removeFromWishlist, addToCart, selectedVehicle, buyNow } = useStore();
  const [compatibilityMap, setCompatibilityMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAllFitments = async () => {
      setLoading(true);
      if (!selectedVehicle || wishlist.length === 0) {
        setCompatibilityMap({});
        setLoading(false);
        return;
      }

      const map = {};
      for (const item of wishlist) {
        const prodId = item.id || item;
        try {
          const res = await checkProductCompatibility(prodId, selectedVehicle.id);
          map[prodId] = res?.isCompatible === true;
        } catch (e) {
          map[prodId] = false;
        }
      }
      setCompatibilityMap(map);
      setLoading(false);
    };

    checkAllFitments();
  }, [wishlist, selectedVehicle]);

  const handleMoveToCart = (product) => {
    const isOutOfStock = (product.inventory?.quantity || product.stockCount || product.stock || 10) <= 0;
    if (isOutOfStock) return;

    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 font-sans">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        
        {/* Header & Vehicle Context Badge */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 mb-8 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-red-50 p-3 rounded-2xl">
                <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">My Wishlist</h1>
            </div>
            <p className="text-slate-500 font-medium">
              Saved auto components and spare parts for future purchases. ({wishlist.length} items)
            </p>
          </div>

          {selectedVehicle && (
            <div className="mt-4 md:mt-0 px-5 py-3 bg-slate-900 rounded-xl flex items-center gap-3 shadow-lg">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Active Vehicle</div>
                <div className="text-sm font-bold text-white">
                  {selectedVehicle.make} {selectedVehicle.model} {selectedVehicle.variant}
                </div>
              </div>
            </div>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-3">Your wishlist is empty</h2>
            <p className="text-slate-500 font-medium mb-8">
              Browse our catalog of genuine spare parts and save your favorite products to your wishlist so you never lose track of them.
            </p>
            <button
              onClick={() => onNavigate && onNavigate('catalog')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-black flex items-center justify-center gap-2 mx-auto transition-all shadow-lg shadow-orange-500/30"
            >
              <span>Explore Spare Parts</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => {
              const isOutOfStock = (product.inventory?.quantity ?? product.stockCount ?? product.stock ?? 10) <= 0;
              const regularPrice = product.originalPrice || product.price || 0;
              const salePrice = product.price;
              const isCompatible = compatibilityMap[product.id];
              const primaryImg = product.image || (product.images && product.images[0]) || 'https://via.placeholder.com/400x300?text=AutoZon+Spare';

              return (
                <div
                  key={product.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col hover:shadow-xl hover:border-orange-300 transition-all duration-300 group"
                >
                  <div className="relative aspect-square bg-slate-50 rounded-xl overflow-hidden mb-5 flex items-center justify-center p-4">
                    <img
                      src={primaryImg}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Stock Status Badge */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {isOutOfStock ? (
                        <span className="px-2.5 py-1 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider rounded border border-red-200">
                          Out of Stock
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded border border-emerald-200">
                          In Stock
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Brand & Category */}
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    {product.brand?.name || product.brand || 'AutoZon'}
                  </div>

                  {/* Product Title */}
                  <h3
                    onClick={() => onNavigate && onNavigate('product', product.slug || product.id)}
                    className="font-bold text-slate-900 text-[15px] leading-snug line-clamp-2 hover:text-orange-500 cursor-pointer mb-3"
                  >
                    {product.name || product.title}
                  </h3>

                  {/* Pricing */}
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-2xl font-black text-slate-900 tracking-tight">
                      ₹{Number(salePrice).toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-slate-400 font-bold line-through mb-1">
                        ₹{Number(regularPrice).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  
                  {/* Vehicle Compatibility Status */}
                  <div className="mb-5 h-8">
                    {selectedVehicle ? (
                      isCompatible ? (
                        <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 font-bold px-2 py-1 rounded border border-emerald-200 uppercase tracking-wider">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Guaranteed Fit</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 font-bold px-2 py-1 rounded border border-amber-200 uppercase tracking-wider">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Verify Fitment</span>
                        </div>
                      )
                    ) : null}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto space-y-2">
                    <div className="flex flex-col gap-2">
                      <button
                        disabled={isOutOfStock}
                        onClick={() => handleMoveToCart(product)}
                        className={`w-full py-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all ${
                          isOutOfStock
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-900 text-white hover:bg-orange-500 shadow-md active:scale-95'
                        }`}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>{isOutOfStock ? 'Unavailable' : 'Move to Cart'}</span>
                      </button>
                      <button
                        disabled={isOutOfStock}
                        onClick={() => buyNow(product, 1)}
                        className={`w-full py-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all ${
                          isOutOfStock
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:opacity-90 shadow-md active:scale-95'
                        }`}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>{isOutOfStock ? 'Unavailable' : 'Buy Now'}</span>
                      </button>
                    </div>

                    {/* Price Drop Notification Placeholder */}
                    <button className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-colors border border-transparent hover:border-slate-200 hover:bg-slate-50">
                      <Bell className="w-3.5 h-3.5" />
                      <span>Enable Price Drop Alert</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
