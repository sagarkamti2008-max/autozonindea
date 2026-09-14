import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, CheckCircle2, ShieldCheck, CreditCard, Smartphone, Truck, PackageCheck, Car } from 'lucide-react';

export const CheckoutModal = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, cartTotal, clearCart, showToast } = useStore();

  const [step, setStep] = useState(1); // 1: Shipping Address, 2: Payment Method, 3: Success Confirmation
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: 'Delhi'
  });
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isPlacing, setIsPlacing] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.pincode) {
      showToast('Please fill all required address fields', 'error');
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = () => {
    setIsPlacing(true);
    setTimeout(() => {
      setIsPlacing(false);
      setStep(3);
      clearCart();
      showToast('🎉 Order Placed Successfully!');
    }, 1500);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container checkout-modal-container">
        <button className="modal-close-btn" onClick={() => setIsCheckoutOpen(false)}>
          <X size={20} />
        </button>

        {/* Step Indicator */}
        <div className="checkout-steps">
          <div className={`step-badge ${step >= 1 ? 'active' : ''}`}>1. Shipping Address</div>
          <div className={`step-badge ${step >= 2 ? 'active' : ''}`}>2. Payment Method</div>
          <div className={`step-badge ${step === 3 ? 'active' : ''}`}>3. Order Placed</div>
        </div>

        {/* Step 1: Address */}
        {step === 1 && (
          <form className="checkout-form" onSubmit={handleAddressSubmit}>
            <h3>Delivery Address</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Phone Number (for Live Tracking updates) *</label>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group full-width">
                <label>Complete House / Garage Address *</label>
                <input
                  type="text"
                  required
                  placeholder="House No, Street, Landmark"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Delhi"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Pincode *</label>
                <input
                  type="text"
                  required
                  placeholder="110001"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Proceed to Payment ₹{cartTotal.toLocaleString('en-IN')}
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="checkout-payment-step">
            <h3>Select Payment Option</h3>
            <div className="payment-options">
              <label className={`payment-card ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                <Smartphone size={24} className="pay-icon" />
                <div>
                  <h4>Instant UPI (GPay / PhonePe / Paytm / BHIM)</h4>
                  <p>Fastest & zero transaction charges</p>
                </div>
              </label>

              <label className={`payment-card ${paymentMethod === 'card' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                <CreditCard size={24} className="pay-icon" />
                <div>
                  <h4>Credit / Debit Card</h4>
                  <p>Visa, MasterCard, RuPay, Maestro</p>
                </div>
              </label>

              <label className={`payment-card ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                <Truck size={24} className="pay-icon" />
                <div>
                  <h4>Cash on Delivery (COD)</h4>
                  <p>Pay cash or UPI upon delivery at your doorstep</p>
                </div>
              </label>
            </div>

            <div className="payment-order-summary">
              <span>Payable Amount: <b>₹{cartTotal.toLocaleString('en-IN')}</b></span>
            </div>

            <div className="form-actions">
              <button className="btn-secondary" onClick={() => setStep(1)} disabled={isPlacing}>
                Back to Address
              </button>
              <button className="btn-primary" onClick={handlePlaceOrder} disabled={isPlacing}>
                {isPlacing ? 'Processing Order...' : `Confirm & Pay ₹${cartTotal.toLocaleString('en-IN')}`}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="order-success-box">
            <PackageCheck size={72} className="success-icon" />
            <h2>Order Placed Successfully! 🎉</h2>
            <p className="order-id">Order ID: <b>#AZ-{Math.floor(100000 + Math.random() * 900000)}</b></p>
            <p className="success-msg">
              Thank you for shopping at <b>AutoZonIndia</b>. Your order confirmation and live WhatsApp tracking link have been dispatched to <b>+91 {formData.phone}</b>.
            </p>

            <div className="delivery-est-card">
              <Car size={24} />
              <div>
                <h4>Estimated Express Delivery</h4>
                <p>Delivery by <b>Tomorrow, 5:00 PM</b> via Bluedart / Delhivery Express.</p>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={() => {
                setIsCheckoutOpen(false);
                setStep(1);
              }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
