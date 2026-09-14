import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartTotal,
    removeFromCart,
    updateQuantity,
    setIsCheckoutOpen,
    showToast
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  if (!isCartOpen) return null;

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'AUTOZON10') {
      const discount = Math.round(cartTotal * 0.1);
      setDiscountAmount(discount);
      showToast('🎉 Coupon AUTOZON10 applied! 10% Discount saved.');
    } else {
      showToast('Invalid Coupon. Try "AUTOZON10"', 'error');
    }
  };

  const gstAmount = Math.round(cartTotal * 0.18);
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  return (
    <div className="modal-backdrop">
      <div className="cart-drawer">
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <ShoppingBag size={22} />
            <h3>Your Shopping Cart ({cart.length} items)</h3>
          </div>
          <button className="drawer-close-btn" onClick={() => setIsCartOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Cart Body */}
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={64} className="empty-icon" />
              <h4>Your cart is empty</h4>
              <p>Add car accessories, clutch kits or oils to get started.</p>
              <button className="btn-primary" onClick={() => setIsCartOpen(false)}>
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.title} className="cart-item-img" />
                  <div className="cart-item-details">
                    <span className="cart-item-brand">{item.brand}</span>
                    <h4 className="cart-item-title">{item.title}</h4>
                    <div className="cart-item-price">
                      ₹{item.price.toLocaleString('en-IN')} x {item.quantity} = <b>₹{(item.price * item.quantity).toLocaleString('en-IN')}</b>
                    </div>

                    <div className="cart-item-controls">
                      <div className="qty-picker compact">
                        <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>

                      <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            {/* Coupon Code input */}
            <div className="coupon-box">
              <Tag size={16} />
              <input
                type="text"
                placeholder="Enter Coupon (AUTOZON10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button onClick={handleApplyCoupon}>Apply</button>
            </div>

            {/* Calculations */}
            <div className="bill-summary">
              <div className="bill-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="bill-row">
                <span>GST (18% Included)</span>
                <span>₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="bill-row discount-row">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="bill-row shipping-row">
                <span>Express Delivery</span>
                <span className="free-shipping">FREE</span>
              </div>
              <div className="bill-row total-row">
                <span>Total Amount</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              className="btn-primary checkout-btn"
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <span className="secure-badge"><ShieldCheck size={14} /> 256-Bit SSL Encrypted Checkout</span>
          </div>
        )}
      </div>
    </div>
  );
};
