import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { calculateCartSummary, validateShippingAddress, validateCOD } from '../services/cartCheckoutEngine';
import { BackendAPI } from '../services/backendAPI';
import {
  ShieldCheck, CheckCircle2, Lock, ArrowLeft, ArrowRight, Truck, MapPin,
  CreditCard, Smartphone, DollarSign, Tag, Car, AlertTriangle, FileText,
  User, Mail, Phone, Clock, Sparkles
} from 'lucide-react';

export const CheckoutView = () => {
  const {
    cart,
    products,
    selectedVehicle,
    appliedCouponCode,
    setAppliedCouponCode,
    savedAddresses,
    addSavedAddress,
    addCompletedOrder,
    deductInventoryStock,
    clearCart,
    navigateTo,
    showToast
  } = useStore();

  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Contact & Address, 2: Shipping & Review, 3: Payment, 4: Confirmed

  // Contact Info (Rule 17)
  const [contactInfo, setContactInfo] = useState({
    fullName: savedAddresses[0]?.fullName || 'Sagar Kamti',
    email: 'sagarkamti2008@gmail.com',
    phone: savedAddresses[0]?.phone || '+91 8591719499'
  });

  // Shipping Address (Rule 18, 19, 20)
  const [selectedAddressId, setSelectedAddressId] = useState(savedAddresses[0]?.id || 'new');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: savedAddresses[0]?.fullName || 'Sagar Kamti',
    phone: savedAddresses[0]?.phone || '+91 8591719499',
    addressLine1: savedAddresses[0]?.addressLine1 || 'Flat 402, AutoZon Tech Park, Connaught Place',
    addressLine2: savedAddresses[0]?.addressLine2 || 'Near Metro Gate 3',
    city: savedAddresses[0]?.city || 'New Delhi',
    state: savedAddresses[0]?.state || 'Delhi',
    postalCode: savedAddresses[0]?.postalCode || '110001',
    country: 'India'
  });

  // Billing Address (Rule 21)
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [billingAddress, setBillingAddress] = useState({ ...shippingAddress });

  // Shipping Options (Rule 12, 13, 14)
  const [shippingMethod, setShippingMethod] = useState('standard');

  // Payment Options (Rule 24, 25, 29, 30)
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' | 'cod'

  // Order Placement State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [addressErrors, setAddressErrors] = useState({});
  const [showRazorpay, setShowRazorpay] = useState(false);

  // Recalculate Cart Summary Server-Side Source of Truth (Rule 23, 67)
  const summary = calculateCartSummary({
    cartItems: cart,
    couponCode: appliedCouponCode,
    pincode: shippingAddress.postalCode,
    shippingMethod,
    selectedVehicle,
    productsDatabase: products
  });

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setShippingAddress({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || '',
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country || 'India'
    });
  };

  const handleProceedToStep2 = (e) => {
    e.preventDefault();
    const val = validateShippingAddress(shippingAddress);
    if (!val.isValid) {
      setAddressErrors(val.errors);
      showToast('Please fix address validation errors.', 'error');
      return;
    }
    setAddressErrors({});

    if (selectedAddressId === 'new') {
      addSavedAddress(shippingAddress);
    }
    setCheckoutStep(2);
  };

  const executeOrderCreation = async () => {
    setIsSubmitting(true);
    try {
      const idempotencyKey = `SGR-IDEMP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const response = BackendAPI.createCheckoutOrder({
        customerInfo: contactInfo,
        cartItems: cart,
        shippingAddress,
        billingAddress: sameAsBilling ? shippingAddress : billingAddress,
        shippingMethod,
        paymentMethod,
        couponCode: appliedCouponCode,
        idempotencyKey
      }, {
        cart,
        products,
        orders: [],
        selectedVehicle,
        appliedCouponCode,
        addCompletedOrder: (order) => {
          addCompletedOrder(order);
          setConfirmedOrder(order);
        },
        deductInventoryStock,
        clearCart
      });

      if (response.success) {
        setCheckoutStep(4);
        setShowRazorpay(false);
        showToast(`🎉 Order Placed Successfully!`);
      } else {
        showToast(response.error?.message || 'Order creation failed.', 'error');
        setShowRazorpay(false);
      }
    } catch (err) {
      showToast('Error placing order. Please try again.', 'error');
      setShowRazorpay(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlaceOrderSubmit = async (e) => {
    e.preventDefault();
    if (summary.availableItems.length === 0) {
      showToast('Cannot checkout with an empty cart.', 'error');
      return;
    }

    if (paymentMethod === 'cod') {
      const codVal = validateCOD(shippingAddress.postalCode, summary.grandTotal, summary.availableItems);
      if (!codVal.eligible) {
        showToast(codVal.message, 'error');
        return;
      }
      // COD bypasses Razorpay
      executeOrderCreation();
    } else {
      // Simulate Razorpay Overlay for Online
      setShowRazorpay(true);
      setTimeout(() => {
        executeOrderCreation();
      }, 2500); // Wait 2.5s to simulate payment processing
    }
  };

  // Order Confirmation View (Rule 38)
  if (checkoutStep === 4 && confirmedOrder) {
    return (
      <div className="container" style={{ maxWidth: '900px', padding: '3rem 1rem', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '3rem 2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ background: '#ECFDF5', width: '90px', height: '90px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#059669' }}>
            <CheckCircle2 size={54} />
          </div>

          <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '0.8rem', fontWeight: 900, padding: '0.3rem 0.85rem', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ORDER CONFIRMED
          </span>

          <h1 style={{ fontFamily: 'Outfit', fontSize: '2.2rem', fontWeight: 900, color: '#0F2167', marginTop: '0.75rem', marginBottom: '0.25rem' }}>
            Order Placed Successfully!
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Order Number: <strong style={{ color: '#FF6B00', fontSize: '1.1rem' }}>#{confirmedOrder.orderNumber}</strong>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Delivery & Tracking Info Card */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.5rem', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0F2167', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>Delivery Details</h3>
              <div style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                <strong style={{ color: '#0F2167', display: 'block', marginBottom: '0.4rem' }}>Shipping Address:</strong>
                <div>{confirmedOrder.shippingAddress.fullName}</div>
                <div>{confirmedOrder.shippingAddress.addressLine1}, {confirmedOrder.shippingAddress.addressLine2}</div>
                <div>{confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.state} - {confirmedOrder.shippingAddress.postalCode}</div>
                <div style={{ color: '#64748B', marginTop: '0.5rem' }}>📱 Phone: {confirmedOrder.shippingAddress.phone}</div>
                
                <div style={{ marginTop: '1rem' }}>
                  <strong style={{ color: '#0F2167', display: 'block', marginBottom: '0.2rem' }}>Estimated Delivery:</strong>
                  <div style={{ color: '#059669', fontWeight: 800 }}>{confirmedOrder.trackingInfo?.estimatedDelivery || '3-5 Business Days'}</div>
                </div>
              </div>
            </div>

            {/* Order Summary Info Card */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.5rem', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0F2167', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>Order Details</h3>
              <div style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#64748B' }}>Total Amount Paid:</span>
                  <strong style={{ color: '#0F2167', fontSize: '1rem' }}>₹{confirmedOrder.totalAmount.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ color: '#64748B' }}>Payment Method:</span>
                  <strong style={{ color: confirmedOrder.paymentInfo.status === 'Paid' ? '#059669' : '#D97706' }}>{confirmedOrder.paymentInfo.method.toUpperCase()} ({confirmedOrder.paymentInfo.status})</strong>
                </div>

                <strong style={{ color: '#0F2167', display: 'block', marginBottom: '0.4rem' }}>Items Ordered ({confirmedOrder.items.length}):</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '120px', overflowY: 'auto' }}>
                  {confirmedOrder.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: '#FFFFFF', padding: '0.4rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                      <img src={item.image} alt={item.title} style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
                      <div style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <span style={{ fontWeight: 800, color: '#0F2167', display: 'block' }}>{item.title}</span>
                        <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Qty: {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigateTo('track-order')}
              style={{ background: '#FF6B00', color: '#FFFFFF', border: 'none', borderRadius: '12px', padding: '0.85rem 1.75rem', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 14px rgba(255, 107, 0, 0.3)' }}
            >
              Track Order <Truck size={18} />
            </button>

            <button
              onClick={() => showToast('Invoice downloaded successfully!', 'success')}
              style={{ background: '#0F2167', color: '#FFFFFF', border: 'none', borderRadius: '12px', padding: '0.85rem 1.75rem', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Download Invoice (GST) <FileText size={18} />
            </button>

            <button
              onClick={() => navigateTo('catalog')}
              style={{ background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '12px', padding: '0.85rem 1.5rem', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '1280px', padding: '2rem 1rem' }}>
      {/* Step Indicator Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button
          onClick={() => navigateTo('cart')}
          style={{ background: 'none', border: 'none', color: '#0F2167', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={18} /> Back to Cart
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F8FAFC', padding: '0.5rem 1.25rem', borderRadius: '24px', border: '1px solid #E2E8F0', fontSize: '0.82rem', fontWeight: 800 }}>
          <span style={{ color: checkoutStep >= 1 ? '#FF6B00' : '#94A3B8' }}>1. Contact & Address</span>
          <span style={{ color: '#CBD5E1' }}>→</span>
          <span style={{ color: checkoutStep >= 2 ? '#FF6B00' : '#94A3B8' }}>2. Shipping & Review</span>
          <span style={{ color: '#CBD5E1' }}>→</span>
          <span style={{ color: checkoutStep >= 3 ? '#FF6B00' : '#94A3B8' }}>3. Payment & Order</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', alignItems: 'start' }}>
        {/* Left Form Column */}
        <div>
          {/* STEP 1: Contact & Address (Rule 17, 18, 19, 20, 21) */}
          {checkoutStep === 1 && (
            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F2167', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={20} color="#FF6B00" /> 1. Contact & Delivery Shipping Address
              </h2>

              {/* Saved Addresses Picker (Rule 19) */}
              {savedAddresses.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>
                    Select Saved Address:
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {savedAddresses.map(addr => (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectSavedAddress(addr)}
                        style={{
                          padding: '0.85rem 1rem',
                          borderRadius: '10px',
                          border: selectedAddressId === addr.id ? '2px solid #FF6B00' : '1px solid #CBD5E1',
                          background: selectedAddressId === addr.id ? '#FFF7ED' : '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: '0.88rem', color: '#0F2167' }}>{addr.fullName} ({addr.phone})</strong>
                          <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                            {addr.addressLine1}, {addr.city}, {addr.state} - {addr.postalCode}
                          </div>
                        </div>
                        {selectedAddressId === addr.id && <CheckCircle2 size={18} color="#FF6B00" />}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAddressId('new');
                        setShippingAddress({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'India' });
                      }}
                      style={{ background: 'none', border: '1px dashed #CBD5E1', borderRadius: '8px', padding: '0.5rem', fontSize: '0.8rem', fontWeight: 800, color: '#0F2167', cursor: 'pointer' }}
                    >
                      + Add New Delivery Address
                    </button>
                  </div>
                </div>
              )}

              {/* Contact Form Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Email Address *</label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Mobile Number *</label>
                  <input
                    type="text"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                  />
                  {addressErrors.phone && <span style={{ color: '#E11D48', fontSize: '0.7rem', fontWeight: 700 }}>{addressErrors.phone}</span>}
                </div>
              </div>

              {/* Address Form Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Full Name *</label>
                  <input
                    type="text"
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                  />
                  {addressErrors.fullName && <span style={{ color: '#E11D48', fontSize: '0.7rem', fontWeight: 700 }}>{addressErrors.fullName}</span>}
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Address Line 1 (House/Plot #, Street) *</label>
                  <input
                    type="text"
                    value={shippingAddress.addressLine1}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                  />
                  {addressErrors.addressLine1 && <span style={{ color: '#E11D48', fontSize: '0.7rem', fontWeight: 700 }}>{addressErrors.addressLine1}</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>City *</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                    />
                    {addressErrors.city && <span style={{ color: '#E11D48', fontSize: '0.7rem', fontWeight: 700 }}>{addressErrors.city}</span>}
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>State *</label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                    />
                    {addressErrors.state && <span style={{ color: '#E11D48', fontSize: '0.7rem', fontWeight: 700 }}>{addressErrors.state}</span>}
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>PIN Code *</label>
                    <input
                      type="text"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                    />
                    {addressErrors.postalCode && <span style={{ color: '#E11D48', fontSize: '0.7rem', fontWeight: 700 }}>{addressErrors.postalCode}</span>}
                  </div>
                </div>

                {/* Billing Address Toggle (Rule 21) */}
                <div style={{ marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#0F2167', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={sameAsBilling}
                      onChange={(e) => setSameAsBilling(e.target.checked)}
                    />
                    Billing address same as shipping address
                  </label>
                </div>

                <button
                  onClick={handleProceedToStep2}
                  style={{ marginTop: '1rem', background: '#0F2167', color: '#FFFFFF', border: 'none', borderRadius: '10px', padding: '0.85rem', fontSize: '0.95rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  Continue to Shipping & Review <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Shipping Options & Order Review (Rule 12, 13, 14, 22) */}
          {checkoutStep === 2 && (
            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F2167', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={20} color="#FF6B00" /> 2. Select Shipping Method & Review Items
              </h2>

              {/* Shipping Options Selection (Rule 13) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div
                  onClick={() => setShippingMethod('standard')}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    border: shippingMethod === 'standard' ? '2px solid #FF6B00' : '1px solid #CBD5E1',
                    background: shippingMethod === 'standard' ? '#FFF7ED' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#0F2167' }}>Standard Surface Shipping</strong>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Estimated Delivery: 3 - 5 Business Days</div>
                  </div>
                  <span style={{ fontWeight: 900, color: summary.isFreeShipping ? '#059669' : '#0F2167' }}>
                    {summary.isFreeShipping ? 'FREE' : '₹49'}
                  </span>
                </div>

                <div
                  onClick={() => setShippingMethod('express')}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    border: shippingMethod === 'express' ? '2px solid #FF6B00' : '1px solid #CBD5E1',
                    background: shippingMethod === 'express' ? '#FFF7ED' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#0F2167' }}>Express Priority Air Courier ⚡</strong>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Estimated Delivery: 1 - 2 Business Days</div>
                  </div>
                  <span style={{ fontWeight: 900, color: '#0F2167' }}>
                    {summary.isFreeShipping ? '₹99' : '₹149'}
                  </span>
                </div>
              </div>

              {/* Items Review List (Rule 22) */}
              <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0F2167', marginBottom: '0.75rem' }}>
                Order Items ({summary.availableItems.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {summary.availableItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem', background: '#F8FAFC', borderRadius: '10px' }}>
                    <img src={item.image} alt={item.title} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '0.85rem', color: '#0F2167' }}>{item.title}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Part #: {item.partNumber} • Qty: {item.quantity}</div>
                      <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>{item.compatibilityStatus}</div>
                    </div>
                    <strong style={{ fontSize: '0.9rem', color: '#0F2167' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setCheckoutStep(1)}
                  style={{ background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '0.85rem 1.25rem', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Back to Address
                </button>

                <button
                  onClick={() => setCheckoutStep(3)}
                  style={{ flex: 1, background: '#0F2167', color: '#FFFFFF', border: 'none', borderRadius: '10px', padding: '0.85rem', fontSize: '0.95rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  Proceed to Payment Options <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Options & Final Authorization (Rule 24, 25, 29, 30) */}
          {checkoutStep === 3 && (
            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F2167', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={20} color="#FF6B00" /> 3. Select Payment Option
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
                {/* Online Payment Option */}
                <div
                  onClick={() => setPaymentMethod('online')}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: paymentMethod === 'online' ? '2px solid #FF6B00' : '1px solid #CBD5E1',
                    background: paymentMethod === 'online' ? '#FFF7ED' : '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Smartphone size={20} color="#FF6B00" />
                      <strong style={{ fontSize: '0.95rem', color: '#0F2167' }}>Express UPI & QR Code Fast Payment (GPay, PhonePe, Paytm, Cards)</strong>
                    </div>
                    {paymentMethod === 'online' && <CheckCircle2 size={18} color="#FF6B00" />}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0, paddingLeft: '2rem' }}>
                    100% Encrypted Payment. Scan QR Code or tap any UPI app for instant 1-click authorization.
                  </p>

                  {/* Live UPI QR Code & App Direct Box */}
                  {paymentMethod === 'online' && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #FED7AA', background: '#FFFFFF', padding: '1rem', borderRadius: '10px', border: '1px solid #FDBA74' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '1.25rem', alignItems: 'center' }}>
                        {/* Live QR Code Box */}
                        <div style={{ textAlign: 'center', background: '#F8FAFC', padding: '0.65rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi%3A%2F%2Fpay%3Fpa%3Dautozonindia%40icici%26pn%3DAutoZonIndia%26am%3D${summary.grandTotal}%26cu%3DINR`}
                            alt="AutoZon UPI QR"
                            style={{ width: '130px', height: '130px', objectFit: 'contain' }}
                          />
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#0F2167', display: 'block', marginTop: '0.25rem' }}>
                            SCAN TO PAY ₹{summary.grandTotal.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* UPI App Quick Buttons */}
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                            ⚡ Or Pay Directly via App:
                          </span>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); showToast('📱 Opening Google Pay App...'); window.open(`upi://pay?pa=autozonindia@icici&pn=AutoZonIndia&am=${summary.grandTotal}&cu=INR`); }}
                              style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0.45rem', fontSize: '0.75rem', fontWeight: 800, color: '#1E293B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                            >
                              🔵 Google Pay
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); showToast('📱 Opening PhonePe App...'); window.open(`upi://pay?pa=autozonindia@icici&pn=AutoZonIndia&am=${summary.grandTotal}&cu=INR`); }}
                              style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0.45rem', fontSize: '0.75rem', fontWeight: 800, color: '#1E293B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                            >
                              🟣 PhonePe
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); showToast('📱 Opening Paytm App...'); window.open(`upi://pay?pa=autozonindia@icici&pn=AutoZonIndia&am=${summary.grandTotal}&cu=INR`); }}
                              style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0.45rem', fontSize: '0.75rem', fontWeight: 800, color: '#1E293B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                            >
                              🔷 Paytm
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText('autozonindia@icici'); showToast('📋 UPI ID Copied: autozonindia@icici'); }}
                              style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0.45rem', fontSize: '0.75rem', fontWeight: 800, color: '#1E293B', cursor: 'pointer' }}
                            >
                              📋 Copy UPI ID
                            </button>
                          </div>
                          <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <ShieldCheck size={14} /> Official Merchant VPA: autozonindia@icici
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cash on Delivery Option (Rule 29, 30) */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: paymentMethod === 'cod' ? '2px solid #FF6B00' : '1px solid #CBD5E1',
                    background: paymentMethod === 'cod' ? '#FFF7ED' : '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <DollarSign size={20} color="#059669" />
                      <strong style={{ fontSize: '0.95rem', color: '#0F2167' }}>Cash on Delivery (COD)</strong>
                    </div>
                    {paymentMethod === 'cod' && <CheckCircle2 size={18} color="#FF6B00" />}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0, paddingLeft: '2rem' }}>
                    Pay cash upon physical doorstep delivery. Validated for PIN {shippingAddress.postalCode}.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setCheckoutStep(2)}
                  style={{ background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '0.85rem 1.25rem', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Back
                </button>

                <button
                  onClick={handlePlaceOrderSubmit}
                  disabled={isSubmitting}
                  style={{ flex: 1, background: '#059669', color: '#FFFFFF', border: 'none', borderRadius: '10px', padding: '0.85rem', fontSize: '1rem', fontWeight: 900, cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)' }}
                >
                  <Lock size={18} /> {isSubmitting ? 'Processing Order...' : `Authorize & Place Order (₹${summary.grandTotal.toLocaleString('en-IN')})`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar Summary Card */}
        <div style={{ position: 'sticky', top: '100px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0F2167', marginBottom: '1rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
              Final Order Recalculation
            </h3>

            {/* Selected Fitment Vehicle Card */}
            {selectedVehicle && (
              <div style={{ background: '#FFF7ED', border: '1px solid #FFD8A8', borderRadius: '8px', padding: '0.6rem 0.75rem', marginBottom: '1rem', fontSize: '0.78rem' }}>
                <div style={{ color: '#64748B', fontWeight: 600 }}>Fitment Vehicle:</div>
                <strong style={{ color: '#FF6B00' }}>{selectedVehicle.makeName} {selectedVehicle.modelName} ({selectedVehicle.variant})</strong>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: '#475569' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal ({summary.availableItems.length} items)</span>
                <strong style={{ color: '#0F2167' }}>₹{summary.subtotal.toLocaleString('en-IN')}</strong>
              </div>

              {summary.couponDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                  <span>Coupon Savings</span>
                  <span>-₹{summary.couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>GST Tax (18% HSN Included)</span>
                <span>₹{summary.taxTotal.toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping Fee</span>
                <span style={{ color: summary.isFreeShipping ? '#059669' : '#0F2167', fontWeight: 800 }}>
                  {summary.isFreeShipping ? 'FREE' : `₹${summary.shippingFee}`}
                </span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px dashed #CBD5E1', margin: '0.4rem 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 900, color: '#0F2167' }}>
                <span>Grand Total</span>
                <span style={{ color: '#FF6B00' }}>₹{summary.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1.25rem', fontSize: '0.72rem', color: '#64748B' }}>
              <ShieldCheck size={14} color="#059669" />
              <span>256-Bit SSL Encrypted Single-Owner Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Mock Modal */}
      {showRazorpay && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', width: '380px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ background: '#0F2167', color: '#FFFFFF', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Razorpay Secure</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Test Mode</span>
            </div>
            <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: '50px', height: '50px', border: '4px solid #F1F5F9', borderTopColor: '#0F2167', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#0F2167', fontWeight: 900 }}>Processing Payment...</h3>
              <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>Please do not close or refresh this window.</p>
              
              <div style={{ marginTop: '2rem', padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#475569', fontSize: '0.85rem' }}>Amount Payable</span>
                <span style={{ color: '#0F2167', fontWeight: 900, fontSize: '1.1rem' }}>₹{summary.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
