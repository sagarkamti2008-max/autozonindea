import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { calculateCartSummary, checkProductCompatibility } from '../services/cartCheckoutEngine';
import {
  ShoppingBag, Trash2, Tag, ArrowRight, ShieldCheck, ArrowLeft, Truck, Car,
  AlertTriangle, RefreshCw, Bookmark, CheckCircle2, Info, Sparkles, X
} from 'lucide-react';

export const CartView = () => {
  const {
    cart,
    savedForLater,
    products,
    selectedVehicle,
    setIsVehicleModalOpen,
    appliedCouponCode,
    setAppliedCouponCode,
    removeFromCart,
    updateQuantity,
    updateCartQuantity,
    moveToSavedForLater,
    moveToCartFromSaved,
    navigateTo,
    showToast
  } = useStore();

  const [inputCoupon, setInputCoupon] = useState(appliedCouponCode || '');
  const [shippingMethod, setShippingMethod] = useState('standard'); // 'standard' | 'express'

  // Server-Side Revalidated Cart Summary
  const summary = calculateCartSummary({
    cartItems: cart,
    couponCode: appliedCouponCode,
    shippingMethod,
    selectedVehicle,
    productsDatabase: products
  });

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;

    const res = summary.couponResult;
    if (res.valid) {
      setAppliedCouponCode(inputCoupon.trim().toUpperCase());
      showToast(res.message, 'success');
    } else {
      showToast(res.message || 'Coupon is invalid or no longer available.', 'error');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCouponCode('');
    setInputCoupon('');
    showToast('Coupon removed.', 'info');
  };

  if (cart.length === 0 && savedForLater.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: '#F8FAFC', padding: '3rem 2rem', borderRadius: '24px', border: '1px dashed #CBD5E1' }}>
          <div style={{ background: '#FFF7ED', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#FF6B00' }}>
            <ShoppingBag size={42} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F2167', marginBottom: '0.5rem' }}>Your Shopping Cart is Empty</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Explore India's leading single-owner catalog for genuine OEM & OES spare parts, lubricants, filters, and accessories.
          </p>
          <button
            onClick={() => navigateTo('catalog')}
            style={{ background: '#FF6B00', color: '#FFFFFF', border: 'none', borderRadius: '12px', padding: '0.9rem 2rem', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 14px rgba(255, 107, 0, 0.3)' }}
          >
            Explore Spare Parts Catalog <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '1350px', padding: '2rem 1rem' }}>
      {/* Top Header Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button
          onClick={() => navigateTo('catalog')}
          style={{ background: 'none', border: 'none', color: '#0F2167', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={18} /> Back to Product Catalog
        </button>

        {/* Selected Vehicle Badge Bar (Rule 8) */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0.4rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Car size={18} color="#FF6B00" />
          <div style={{ fontSize: '0.8rem' }}>
            <span style={{ color: '#64748B', fontWeight: 600 }}>Fitment Vehicle: </span>
            <strong style={{ color: '#0F2167' }}>
              {selectedVehicle ? `${selectedVehicle.makeName} ${selectedVehicle.modelName} (${selectedVehicle.variant})` : 'All Vehicles'}
            </strong>
          </div>
          <button
            onClick={() => setIsVehicleModalOpen(true)}
            style={{ background: '#FFF7ED', color: '#FF6B00', border: '1px solid #FFD8A8', borderRadius: '6px', padding: '0.2rem 0.6rem', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
          >
            Change Vehicle
          </button>
        </div>
      </div>

      <h1 style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 900, color: '#0F2167', marginBottom: '1.5rem' }}>
        Shopping Cart ({summary.validatedItems.length} Items)
      </h1>

      {/* Warning Banners for Price Updates or Out of Stock Items */}
      {summary.hasPriceChanges && (
        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1E40AF', padding: '0.85rem 1.25rem', borderRadius: '12px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 700 }}>
          <Info size={20} />
          <span>Notice: One or more item prices have been updated to match current catalog pricing. Review prices before proceeding to checkout.</span>
        </div>
      )}

      {summary.hasOutOfStock && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '0.85rem 1.25rem', borderRadius: '12px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 700 }}>
          <AlertTriangle size={20} />
          <span>Attention: One or more items in your cart are out of stock. Remove them or save for later to proceed to checkout.</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
        {/* Left Column: Cart Items List */}
        <div>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden', marginBottom: '2rem' }}>
            {summary.validatedItems.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  padding: '1.25rem',
                  borderBottom: idx === summary.validatedItems.length - 1 ? 'none' : '1px solid #F1F5F9',
                  background: item.outOfStock ? '#FDF2F2' : '#FFFFFF',
                  display: 'grid',
                  gridTemplateColumns: '90px 1fr 140px 120px 40px',
                  gap: '1.25rem',
                  alignItems: 'center'
                }}
              >
                {/* Item Image */}
                <div style={{ position: 'relative' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '90px', height: '90px', objectFit: 'contain', background: '#F8FAFC', borderRadius: '10px', padding: '0.25rem' }}
                  />
                  {item.outOfStock && (
                    <span style={{ position: 'absolute', inset: 0, background: 'rgba(239, 68, 68, 0.85)', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 900, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', textTransform: 'uppercase' }}>
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Item Info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#FF6B00', background: '#FFF7ED', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>
                      {item.brand}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>
                      SKU: {item.sku}
                    </span>
                  </div>

                  <h3
                    onClick={() => navigateTo('product-detail', item.id)}
                    style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F2167', margin: '0 0 0.35rem 0', cursor: 'pointer', lineHeight: 1.3 }}
                  >
                    {item.title}
                  </h3>

                  {/* Vehicle Compatibility Badge (Rule 7) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem' }}>
                    {item.isCompatible ? (
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.15rem 0.55rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <CheckCircle2 size={13} /> {item.compatibilityStatus}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#D97706', background: '#FFFBEB', border: '1px solid #FDE68A', padding: '0.15rem 0.55rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <AlertTriangle size={13} /> {item.compatibilityStatus}
                      </span>
                    )}
                  </div>

                  {/* Price Update Notice */}
                  {item.priceChanged && (
                    <div style={{ fontSize: '0.72rem', color: '#D97706', fontWeight: 700, marginTop: '0.35rem' }}>
                      ⚠ Price updated from ₹{item.originalCartPrice} to ₹{item.price}
                    </div>
                  )}
                </div>

                {/* Quantity Controls (Rule 2) */}
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '8px', overflow: 'hidden', background: '#F8FAFC' }}>
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.outOfStock || item.quantity <= 1}
                      style={{ border: 'none', background: 'none', padding: '0.4rem 0.75rem', fontWeight: 900, cursor: 'pointer', color: '#0F2167' }}
                    >
                      -
                    </button>

                    <input
                      type="number"
                      value={item.quantity}
                      disabled={item.outOfStock}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        updateCartQuantity(item.id, val);
                      }}
                      style={{ width: '40px', textAlign: 'center', border: 'none', background: 'none', fontSize: '0.85rem', fontWeight: 800, color: '#0F2167', outline: 'none' }}
                    />

                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      disabled={item.outOfStock || item.quantity >= item.availableInventory}
                      style={{ border: 'none', background: 'none', padding: '0.4rem 0.75rem', fontWeight: 900, cursor: 'pointer', color: '#0F2167' }}
                    >
                      +
                    </button>
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#64748B', marginTop: '0.2rem', textAlign: 'center' }}>
                    Max: {item.availableInventory} units
                  </div>
                </div>

                {/* Item Price & Subtotal */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0F2167' }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                    ₹{((item.mrp || item.price * 1.2) * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Actions: Save for Later & Remove */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                  <button
                    onClick={() => moveToSavedForLater(item.id)}
                    title="Save for Later"
                    style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}
                  >
                    <Bookmark size={17} />
                  </button>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    title="Remove Item"
                    style={{ background: 'none', border: 'none', color: '#E11D48', cursor: 'pointer' }}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Saved For Later Section (Rule 1, 5) */}
          {savedForLater.length > 0 && (
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.25rem', marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F2167', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bookmark size={18} color="#FF6B00" /> Saved for Later ({savedForLater.length} Items)
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                {savedForLater.map(item => (
                  <div key={item.id} style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '12px', padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <img src={item.image} alt={item.title} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F2167', margin: 0 }}>{item.title}</h4>
                      <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#FF6B00', marginTop: '0.2rem' }}>₹{item.price}</div>
                      <button
                        onClick={() => moveToCartFromSaved(item.id)}
                        style={{ marginTop: '0.4rem', background: '#0F2167', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Move to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary & Coupon Card */}
        <div style={{ position: 'sticky', top: '100px' }}>
          {/* Coupon Code Card */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.25rem', marginBottom: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0F2167', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Tag size={16} color="#FF6B00" /> Apply Coupon Code
            </h3>

            {appliedCouponCode ? (
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '0.6rem 0.85rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <strong style={{ fontSize: '0.85rem' }}>{appliedCouponCode}</strong>
                  <div style={{ fontSize: '0.72rem' }}>Coupon Applied! Saved ₹{summary.couponDiscount}</div>
                </div>
                <button onClick={handleRemoveCoupon} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                  <X size={16} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Enter Code (e.g. AUTO10, FREESHIP)"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  style={{ flex: 1, border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.82rem', uppercase: true, outline: 'none' }}
                />
                <button type="submit" style={{ background: '#0F2167', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                  Apply
                </button>
              </form>
            )}

            {/* Quick Coupons List */}
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span onClick={() => { setInputCoupon('AUTO10'); setAppliedCouponCode('AUTO10'); }} style={{ fontSize: '0.68rem', background: '#F1F5F9', border: '1px dashed #94A3B8', borderRadius: '4px', padding: '0.15rem 0.4rem', cursor: 'pointer', fontWeight: 700 }}>AUTO10</span>
              <span onClick={() => { setInputCoupon('FREESHIP'); setAppliedCouponCode('FREESHIP'); }} style={{ fontSize: '0.68rem', background: '#F1F5F9', border: '1px dashed #94A3B8', borderRadius: '4px', padding: '0.15rem 0.4rem', cursor: 'pointer', fontWeight: 700 }}>FREESHIP</span>
              <span onClick={() => { setInputCoupon('BOSCH15'); setAppliedCouponCode('BOSCH15'); }} style={{ fontSize: '0.68rem', background: '#F1F5F9', border: '1px dashed #94A3B8', borderRadius: '4px', padding: '0.15rem 0.4rem', cursor: 'pointer', fontWeight: 700 }}>BOSCH15</span>
              <span onClick={() => { setInputCoupon('FIRST500'); setAppliedCouponCode('FIRST500'); }} style={{ fontSize: '0.68rem', background: '#F1F5F9', border: '1px dashed #94A3B8', borderRadius: '4px', padding: '0.15rem 0.4rem', cursor: 'pointer', fontWeight: 700 }}>FIRST500</span>
            </div>
          </div>

          {/* Order Summary Bill */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F2167', marginBottom: '1rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem' }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: '#475569' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal ({summary.availableItems.length} items)</span>
                <strong style={{ color: '#0F2167' }}>₹{summary.subtotal.toLocaleString('en-IN')}</strong>
              </div>

              {summary.productDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                  <span>Catalog Product Discount</span>
                  <span>-₹{summary.productDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {summary.couponDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                  <span>Coupon ({appliedCouponCode}) Savings</span>
                  <span>-₹{summary.couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Estimated GST (18% Included)</span>
                <span>₹{summary.taxTotal.toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Delivery Shipping Fee</span>
                {summary.isFreeShipping ? (
                  <span style={{ background: '#DCFCE7', color: '#15803D', fontWeight: 900, fontSize: '0.75rem', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>
                    FREE
                  </span>
                ) : (
                  <span>₹{summary.shippingFee}</span>
                )}
              </div>

              <hr style={{ border: 'none', borderTop: '1px dashed #CBD5E1', margin: '0.5rem 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 900, color: '#0F2167' }}>
                <span>Grand Total</span>
                <span style={{ color: '#FF6B00' }}>₹{summary.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Trigger Button */}
            <button
              onClick={() => navigateTo('checkout')}
              disabled={summary.availableItems.length === 0 || summary.hasOutOfStock}
              style={{
                width: '100%',
                marginTop: '1.25rem',
                background: (summary.availableItems.length === 0 || summary.hasOutOfStock) ? '#94A3B8' : '#FF6B00',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '0.9rem',
                fontSize: '1rem',
                fontWeight: 900,
                cursor: (summary.availableItems.length === 0 || summary.hasOutOfStock) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: (summary.availableItems.length === 0 || summary.hasOutOfStock) ? 'none' : '0 4px 14px rgba(255, 107, 0, 0.3)'
              }}
            >
              Proceed to Secure Checkout <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1rem', fontSize: '0.72rem', color: '#64748B' }}>
              <ShieldCheck size={14} color="#059669" />
              <span>100% Single-Owner Genuine Spare Parts Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
