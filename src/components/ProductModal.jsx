import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, ShoppingCart, ShieldCheck, CheckCircle2, Truck, RefreshCw, Car, Wrench } from 'lucide-react';

export const ProductModal = () => {
  const { activeProductModal, setActiveProductModal, addToCart, selectedVehicle, setIsCartOpen } = useStore();
  const [qty, setQty] = useState(1);

  if (!activeProductModal) return null;

  const product = activeProductModal;

  const handleBuyNow = () => {
    addToCart(product, qty);
    setActiveProductModal(null);
    setIsCartOpen(true);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container product-modal-container">
        <button className="modal-close-btn" onClick={() => setActiveProductModal(null)}>
          <X size={20} />
        </button>

        <div className="product-modal-grid">
          {/* Left Column: Image Gallery */}
          <div className="product-modal-gallery">
            <img src={product.image} alt={product.title} className="modal-main-img" />
            <div className="modal-trust-pills">
              <span><ShieldCheck size={16} /> 100% Genuine</span>
              <span><Truck size={16} /> Fast Dispatch</span>
              <span><RefreshCw size={16} /> 7-Day Returns</span>
            </div>
          </div>

          {/* Right Column: Specifications & Actions */}
          <div className="product-modal-details">
            <span className="detail-brand">{product.brand}</span>
            <h2 className="detail-title">{product.title}</h2>

            <div className="detail-partno-row">
              {product.oemPartNumber && <span className="partno-badge">OEM Part #: {product.oemPartNumber}</span>}
              <span className="stock-status">In Stock ({product.stock} units available)</span>
            </div>

            {/* Rating */}
            <div className="rating-row">
              <Star size={16} fill="#F59E0B" color="#F59E0B" />
              <span className="rating-score">{product.rating}</span>
              <span className="reviews-count">({product.reviewsCount} verified customer ratings)</span>
            </div>

            {/* Price Box */}
            <div className="detail-price-box">
              <span className="detail-current-price">₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice && (
                <span className="detail-original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              )}
              {product.discount && <span className="detail-discount-tag">{product.discount}</span>}
              <span className="taxes-inclusive">(Inclusive of 18% GST)</span>
            </div>

            {/* Vehicle Compatibility Banner */}
            <div className="detail-fitment-box">
              <Car size={20} className="fitment-icon" />
              <div>
                <h4>Vehicle Compatibility Check</h4>
                <p>
                  {product.isUniversal ? (
                    '✅ Universal Fit – Compatible with all Cars & SUVs.'
                  ) : selectedVehicle ? (
                    `Compatible with ${selectedVehicle.makeName} ${selectedVehicle.modelName} ${selectedVehicle.year}`
                  ) : (
                    'Fits Maruti Suzuki Swift, Baleno, Hyundai Creta, Tata Nexon & more.'
                  )}
                </p>
              </div>
            </div>

            {/* Product Description */}
            <p className="detail-description">{product.description}</p>

            {/* Features List */}
            <div className="detail-features">
              <h4>Key Features:</h4>
              <ul>
                {product.features?.map((f, i) => (
                  <li key={i}><CheckCircle2 size={16} color="#10B981" /> {f}</li>
                ))}
              </ul>
            </div>

            {/* Quantity & CTA Buttons */}
            <div className="detail-actions">
              <div className="qty-picker">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                <span>{qty}</span>
                <button onClick={() => setQty(qty + 1)}>+</button>
              </div>

              <button className="btn-secondary modal-add-cart-btn" onClick={() => addToCart(product, qty)}>
                <ShoppingCart size={18} /> Add to Cart
              </button>

              <button className="btn-primary modal-buy-now-btn" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
