import React from 'react';
import { useStore } from '../context/StoreContext';
import { Star, ShoppingCart, Heart, CheckCircle, Shield, Eye, Wrench } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { selectedVehicle, addToCart, toggleWishlist, wishlist, setActiveProductModal } = useStore();

  const isWishlisted = wishlist.some(item => item.id === product.id);

  // Check compatibility with selected garage vehicle
  let isCompatible = true;
  if (selectedVehicle) {
    const vehicleKey = `${selectedVehicle.makeId}-${selectedVehicle.modelId}`;
    isCompatible = product.isUniversal || product.compatibleVehicles.includes(vehicleKey);
  }

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
        {product.isUniversal ? (
          <span className="badge-fit universal"><CheckCircle size={12} /> Universal Fit</span>
        ) : (
          <span className={`badge-fit ${isCompatible ? 'fits' : 'not-fits'}`}>
            <CheckCircle size={12} /> {selectedVehicle ? (isCompatible ? `Fits ${selectedVehicle.modelName}` : 'Check Fitment') : 'Model Specific'}
          </span>
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
      <div className="card-img-container" onClick={() => setActiveProductModal(product)}>
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

        <h3 className="card-title" onClick={() => setActiveProductModal(product)}>
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

          <button className="btn-add-cart" onClick={() => addToCart(product)}>
            <ShoppingCart size={18} /> Add
          </button>
        </div>
      </div>
    </div>
  );
};
