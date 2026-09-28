import React from 'react';
import { useStore } from '../context/StoreContext';
import { checkProductCompatibility } from '../services/fitmentEngine';
import { Star, ShoppingCart, Heart, CheckCircle, Shield, Eye, Wrench, AlertTriangle, XCircle, Info } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { selectedVehicle, selectedCategory, addToCart, buyNow, toggleWishlist, wishlist, setActiveProductModal, navigateTo } = useStore();

  const isWishlisted = wishlist.some(item => item.id === product.id);

  // Evaluate strict compatibility status
  const compatResult = checkProductCompatibility(product, selectedVehicle, selectedCategory);

  // Primary Image Resolution Logic
  const getPrimaryImageUrl = () => {
    if (product.product_images && Array.isArray(product.product_images) && product.product_images.length > 0) {
      const primary = product.product_images.find(img => img.is_primary);
      if (primary && primary.image_url) return primary.image_url;
      if (product.product_images[0]?.image_url) return product.product_images[0].image_url;
    }

    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      const primaryObj = product.images.find(img => typeof img === 'object' && img.is_primary);
      if (primaryObj && primaryObj.image_url) return primaryObj.image_url;
      const first = product.images[0];
      if (typeof first === 'string') return first;
      if (typeof first === 'object' && (first.image_url || first.url)) return first.image_url || first.url;
    }

    return product.image || 'https://via.placeholder.com/400x300?text=AutoZon+Spare+Part';
  };

  return (
    <div className="product-card">
      {/* Top Badges */}
      <div className="card-top-badges">
        {product.discount && <span className="badge-discount">{product.discount}</span>}
        {compatResult.status === 'COMPATIBLE' && (
          <span className="badge-fit fits"><CheckCircle size={12} /> {compatResult.badgeText}</span>
        )}
        {compatResult.status === 'COMPATIBILITY_NOT_VERIFIED' && (
          <span className="badge-fit pending" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#D97706', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
            <AlertTriangle size={12} /> ⚠ Compatibility Not Verified
          </span>
        )}
        {compatResult.status === 'NOT_COMPATIBLE' && (
          <span className="badge-fit not-fits"><XCircle size={12} /> ✕ Not Compatible</span>
        )}
        {compatResult.status === 'NO_VEHICLE_SELECTED' && (
          <span className="badge-fit model-specific"><Info size={12} /> Select Vehicle to Check Fit</span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
        onClick={() => toggleWishlist(product)}
        title="Add to Wishlist"
      >
        <Heart size={18} fill={isWishlisted ? '#EF4444' : 'none'} color={isWishlisted ? '#EF4444' : '#6B7280'} />
      </button>

      {/* Image Container */}
      <div className="card-img-container cursor-pointer" onClick={() => navigateTo('product-detail', product)}>
        <img 
          src={getPrimaryImageUrl()} 
          alt={product.title} 
          className="product-img" 
          loading="lazy" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/400x300?text=AutoZon+Spare+Part';
          }}
        />
        <button className="quick-view-overlay" onClick={(e) => { e.stopPropagation(); setActiveProductModal(product); }}>
          <Eye size={16} /> Quick View
        </button>
      </div>

      {/* Card Content */}
      <div className="card-content">
        <div className="brand-part-row">
          <span className="card-brand">{product.brand}</span>
          {product.oemPartNumber && <span className="card-partno">Part #: {product.oemPartNumber}</span>}
        </div>

        <h3 className="card-title cursor-pointer" onClick={() => navigateTo('product-detail', product)}>
          {product.title}
        </h3>

        {/* Rating */}
        <div className="rating-row">
          <div className="stars">
            <Star size={14} fill="#F59E0B" color="#F59E0B" />
            <span className="rating-score">{product.rating}</span>
          </div>
          <span className="reviews-count">({product.reviewsCount} reviews)</span>
          <span className="warranty-tag"><Shield size={12} /> {product.warranty}</span>
        </div>

        {/* Price & Action Row */}
        <div className="card-footer-row">
          <div className="price-box">
            <span className="current-price">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <span className="original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button className="btn-add-cart" onClick={(e) => { e.stopPropagation(); addToCart(product); }}>
              <ShoppingCart size={16} /> Add
            </button>
            <button 
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-xs px-3 py-2 rounded-xl transition cursor-pointer shadow-md shadow-orange-500/20" 
              onClick={(e) => { e.stopPropagation(); buyNow(product); }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
