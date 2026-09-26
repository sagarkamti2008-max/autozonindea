import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { calculateCartSummary, validateShippingAddress, validateCOD } from '../services/cartCheckoutEngine';
import { BackendAPI } from '../services/backendAPI';
import { GSTInvoiceModal } from '../components/GSTInvoiceModal';
import {
  ShieldCheck, CheckCircle2, Lock, ArrowLeft, ArrowRight, Truck, MapPin,
  CreditCard, Smartphone, DollarSign, Tag, Car, AlertTriangle, FileText,
  User, Mail, Phone, Clock, Sparkles, MessageCircle
} from 'lucide-react';

export const CheckoutView = () => {
  const {
    cart,
    buyNowProduct,
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

  const checkoutItems = buyNowProduct ? [{ ...buyNowProduct, quantity: buyNowProduct.quantity || 1 }] : (cart || []);

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
    houseNo: 'Flat 402',
    buildingName: 'AutoZon Tech Park',
    streetArea: 'Connaught Place',
    landmark: 'Near Metro Gate 3',
    addressLine1: savedAddresses[0]?.addressLine1 || 'Flat 402, AutoZon Tech Park, Connaught Place',
    addressLine2: savedAddresses[0]?.addressLine2 || 'Near Metro Gate 3',
    city: savedAddresses[0]?.city || 'New Delhi',
    state: savedAddresses[0]?.state || 'Delhi',
    postalCode: savedAddresses[0]?.postalCode || '110001',
    country: 'India'
  });

  // Vehicle Details State (car parts ke liye important)
  const [vehicleDetails, setVehicleDetails] = useState({
    carBrand: selectedVehicle?.makeName || selectedVehicle?.make || 'Maruti Suzuki',
    carModel: selectedVehicle?.modelName || selectedVehicle?.model || 'Swift',
    variant: selectedVehicle?.variant || 'ZXi Plus',
    manufacturingYear: selectedVehicle?.year || '2022',
    fuelType: selectedVehicle?.fuelType || 'Petrol',
    registrationNumber: ''
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
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Recalculate Cart Summary Server-Side Source of Truth (Rule 23, 67)
  const summary = calculateCartSummary({
    cartItems: checkoutItems,
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

  // Order Confirmation View (Super Premium Modern Design)
  if (checkoutStep === 4 && confirmedOrder) {
    const custName = confirmedOrder.shippingAddress?.fullName || confirmedOrder.customerInfo?.fullName || 'Valued Customer';
    const custPhone = confirmedOrder.shippingAddress?.phone || confirmedOrder.customerInfo?.phone || '+91 8591719499';
    const fullAddressStr = `${confirmedOrder.shippingAddress?.addressLine1 || confirmedOrder.shippingAddress?.houseNo || ''}, ${confirmedOrder.shippingAddress?.city || ''}, ${confirmedOrder.shippingAddress?.state || ''} - ${confirmedOrder.shippingAddress?.postalCode || ''}`;
    const totalAmount = confirmedOrder.totalAmount || confirmedOrder.grandTotal || 0;
    const itemsList = confirmedOrder.items || [];

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#FF5722] selection:text-white">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Main Success Hero Card */}
          <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />
            
            {/* Animated Emerald Tick Icon */}
            <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 rounded-full mx-auto mb-6 shadow-xl shadow-emerald-500/20 animate-bounce">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                <CheckCircle2 size={44} className="text-emerald-400" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" /> 🎉 ORDER BOOKED & VERIFIED SUCCESSFULLY!
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans">
              Thank You, {custName.split(' ')[0]}!
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed">
              We've received your order and dispatched instructions to our warehouse team.
            </p>

            {/* Order ID & Live Status Bar */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 mt-6 shadow-inner text-left space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">ORDER ID</span>
                  <div className="text-xl sm:text-2xl font-black text-[#FF5722] tracking-wider font-mono flex items-center gap-2">
                    #{confirmedOrder.orderNumber}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(confirmedOrder.orderNumber);
                        showToast('Order ID copied to clipboard!');
                      }}
                      className="text-[11px] text-slate-400 hover:text-white bg-slate-800 px-2 py-0.5 rounded font-sans transition"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">ESTIMATED DELIVERY</span>
                  <span className="text-sm font-black text-emerald-400 flex items-center gap-1 sm:justify-end mt-0.5">
                    <Truck className="w-4 h-4" /> 3 - 5 Business Days
                  </span>
                </div>
              </div>

              {/* Live Dispatch Tracker Timeline */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">REALTIME ORDER TRACKER</span>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-extrabold">
                  <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 p-2 rounded-xl">
                    ✓ Booked
                  </div>
                  <div className="bg-slate-900 text-slate-400 border border-slate-800 p-2 rounded-xl">
                    📦 Packing
                  </div>
                  <div className="bg-slate-900 text-slate-400 border border-slate-800 p-2 rounded-xl">
                    🚚 Dispatched
                  </div>
                  <div className="bg-slate-900 text-slate-400 border border-slate-800 p-2 rounded-xl">
                    🏠 Delivered
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Grid Buttons */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setIsInvoiceModalOpen(true)}
                className="bg-[#0B5394] hover:bg-blue-700 text-white font-black text-xs py-3.5 px-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" /> Download GST Invoice
              </button>

              <a
                href={`https://wa.me/918591719499?text=${encodeURIComponent(`Hello Kamti Automotive, I have placed Order #${confirmedOrder.orderNumber} for ₹${totalAmount}. Please confirm my order dispatch!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3.5 px-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-decoration-none cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" /> Send WhatsApp Msg
              </a>

              <button
                onClick={() => navigateTo('track-order')}
                className="bg-gradient-to-r from-[#FF5722] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs py-3.5 px-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Truck className="w-4 h-4" /> Track Order Status
              </button>
            </div>
          </div>

          {/* Details Grid: Delivery Address & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Delivery Address Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <MapPin className="w-5 h-5 text-[#FF5722]" />
                <h3 className="font-black text-white text-base">Delivery Address</h3>
              </div>
              <div className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <div className="font-extrabold text-sm text-white">{custName}</div>
                <div>{fullAddressStr}</div>
                <div className="text-slate-400 font-medium">📱 Phone: <span className="text-slate-200 font-bold">{custPhone}</span></div>
                <div className="text-slate-400 font-medium">📧 Email: <span className="text-slate-200 font-bold">{confirmedOrder.customerInfo?.email || 'Customer'}</span></div>
              </div>
            </div>

            {/* Payment & Items Breakdown Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-black text-white text-base">Payment & Summary</h3>
                </div>
                <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded border border-emerald-500/30">
                  {confirmedOrder.paymentInfo?.method || confirmedOrder.paymentMethod || 'COD'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Total Items Ordered:</span>
                  <span className="text-white font-bold">{itemsList.length} Items</span>
                </div>
                <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800/80">
                  <span className="text-slate-300 font-bold">Total Amount Payable:</span>
                  <span className="text-base font-black text-orange-400">₹{Number(totalAmount).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigateTo('catalog')}
                  className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs py-2.5 rounded-xl transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>

          </div>

          {/* Detailed Ordered Items List Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-white text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Confirmed Order Items ({itemsList.length})
              </h3>
              <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                🛡️ 100% Genuine Fitment Guarantee
              </span>
            </div>

            <div className="divide-y divide-slate-800">
              {itemsList.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-slate-950 rounded-xl p-1.5 border border-slate-800 shrink-0 overflow-hidden">
                      <img src={item.image || '/images/engine_parts_main.jpg'} alt={item.title || item.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-sm line-clamp-1">{item.title || item.name}</h4>
                      <p className="text-[11px] text-slate-400 font-medium">SKU: <span className="font-mono text-slate-300">{item.sku || item.partNumber || 'AZI-GENUINE'}</span> • Qty: <span className="font-bold text-white">{item.quantity || 1}</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-white">₹{Number((item.price || item.sellingPrice || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-slate-500 font-bold">Inclusive of 18% GST</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GST Invoice Modal */}
          <GSTInvoiceModal
            isOpen={isInvoiceModalOpen}
            onClose={() => setIsInvoiceModalOpen(false)}
            orderData={confirmedOrder}
          />
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
                <ShoppingCart size={20} color="#FF6B00" /> 🛒 Buy Now — Complete Express Checkout (Step 1 to 6)
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

              {/* 1. Customer Information Section */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0F2167', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
                  1. Customer Information
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Full Name *</label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                    />
                    {addressErrors.fullName && <span style={{ color: '#E11D48', fontSize: '0.7rem', fontWeight: 700 }}>{addressErrors.fullName}</span>}
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Mobile Number *</label>
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      maxLength={10}
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value.replace(/\D/g, '') })}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                    />
                    {addressErrors.phone && <span style={{ color: '#E11D48', fontSize: '0.7rem', fontWeight: 700 }}>{addressErrors.phone}</span>}
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>WhatsApp Number</label>
                    <input
                      type="tel"
                      placeholder="WhatsApp Number"
                      maxLength={10}
                      value={contactInfo.whatsappNumber || ''}
                      onChange={(e) => setContactInfo({ ...contactInfo, whatsappNumber: e.target.value.replace(/\D/g, '') })}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Email Address</label>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery Address Form Fields */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0F2167', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
                  2. Delivery Address
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>House / Flat No. *</label>
                    <input
                      type="text"
                      placeholder="House / Flat No."
                      value={shippingAddress.houseNo || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setShippingAddress(prev => ({
                          ...prev,
                          houseNo: val,
                          addressLine1: [val, prev.buildingName, prev.streetArea].filter(Boolean).join(', ')
                        }));
                      }}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Building / Society Name</label>
                    <input
                      type="text"
                      placeholder="Building / Society Name"
                      value={shippingAddress.buildingName || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setShippingAddress(prev => ({
                          ...prev,
                          buildingName: val,
                          addressLine1: [prev.houseNo, val, prev.streetArea].filter(Boolean).join(', ')
                        }));
                      }}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Street / Area *</label>
                    <input
                      type="text"
                      placeholder="Street / Area"
                      value={shippingAddress.streetArea || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setShippingAddress(prev => ({
                          ...prev,
                          streetArea: val,
                          addressLine1: [prev.houseNo, prev.buildingName, val].filter(Boolean).join(', ')
                        }));
                      }}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>City *</label>
                    <input
                      type="text"
                      placeholder="City"
                      value={shippingAddress.city || ''}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                    />
                    {addressErrors.city && <span style={{ color: '#E11D48', fontSize: '0.7rem', fontWeight: 700 }}>{addressErrors.city}</span>}
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>State *</label>
                    <input
                      type="text"
                      placeholder="State"
                      value={shippingAddress.state || ''}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                    />
                    {addressErrors.state && <span style={{ color: '#E11D48', fontSize: '0.7rem', fontWeight: 700 }}>{addressErrors.state}</span>}
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Pincode *</label>
                    <input
                      type="text"
                      placeholder="Pincode"
                      maxLength={6}
                      value={shippingAddress.postalCode || ''}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value.replace(/\D/g, '') })}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                    />
                    {addressErrors.postalCode && <span style={{ color: '#E11D48', fontSize: '0.7rem', fontWeight: 700 }}>{addressErrors.postalCode}</span>}
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Landmark</label>
                    <input
                      type="text"
                      placeholder="Landmark"
                      value={shippingAddress.landmark || ''}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, landmark: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>

              {/* 3. Vehicle Details — car parts ke liye important */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', marginTop: '1rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0F2167', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🚗 3. Vehicle Details — car parts ke liye important
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Car Brand *</label>
                    <input
                      type="text"
                      placeholder="e.g. Maruti Suzuki, Hyundai, Tata"
                      value={vehicleDetails.carBrand || ''}
                      onChange={(e) => setVehicleDetails({ ...vehicleDetails, carBrand: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Car Model *</label>
                    <input
                      type="text"
                      placeholder="e.g. Swift, Creta, Nexon"
                      value={vehicleDetails.carModel || ''}
                      onChange={(e) => setVehicleDetails({ ...vehicleDetails, carModel: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Variant</label>
                    <input
                      type="text"
                      placeholder="e.g. ZXi Plus, SX(O), XZ+"
                      value={vehicleDetails.variant || ''}
                      onChange={(e) => setVehicleDetails({ ...vehicleDetails, variant: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Manufacturing Year</label>
                    <input
                      type="text"
                      placeholder="e.g. 2022"
                      maxLength={4}
                      value={vehicleDetails.manufacturingYear || ''}
                      onChange={(e) => setVehicleDetails({ ...vehicleDetails, manufacturingYear: e.target.value.replace(/\D/g, '') })}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Fuel Type</label>
                    <select
                      value={vehicleDetails.fuelType || 'Petrol'}
                      onChange={(e) => setVehicleDetails({ ...vehicleDetails, fuelType: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', background: '#FFFFFF' }}
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="CNG">CNG</option>
                      <option value="Electric (EV)">Electric (EV)</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Registration Number (optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. DL-01-AB-1234"
                      value={vehicleDetails.registrationNumber || ''}
                      onChange={(e) => setVehicleDetails({ ...vehicleDetails, registrationNumber: e.target.value.toUpperCase() })}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', textTransform: 'uppercase' }}
                    />
                  </div>
                </div>
              </div>

              {/* 4. Order Details */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', marginTop: '1rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0F2167', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  📦 4. Order Details
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                  {cart.map((item, idx) => (
                    <div key={item.id || idx} style={{ background: '#FFFFFF', padding: '0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <img src={item.image} alt={item.title} style={{ width: '45px', height: '45px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #F1F5F9' }} />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F2167' }}>Product Name: {item.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Part Number: <strong>{item.partNumber || item.sku || 'OEM-PART-882'}</strong></div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Quantity: <strong>{item.quantity}</strong></div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700 }}>Price</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0F2167' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                    <span>Price (Subtotal):</span>
                    <strong style={{ color: '#0F2167' }}>₹{summary.subtotal.toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 700 }}>
                    <span>Discount:</span>
                    <strong>-₹{summary.discount.toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                    <span>Delivery Charge:</span>
                    <strong style={{ color: summary.shippingFee === 0 ? '#059669' : '#0F2167' }}>
                      {summary.shippingFee === 0 ? 'FREE' : `₹${summary.shippingFee}`}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '0.5rem', marginTop: '0.25rem', fontSize: '1rem', fontWeight: 900 }}>
                    <span style={{ color: '#0F2167' }}>Total Amount:</span>
                    <span style={{ color: '#FF6B00' }}>₹{summary.grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* 5. Payment */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', marginTop: '1rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0F2167', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  💳 5. Payment Options & Status
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  {/* Cash on Delivery (agar available ho) */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      border: paymentMethod === 'cod' ? '2px solid #FF6B00' : '1px solid #CBD5E1',
                      background: paymentMethod === 'cod' ? '#FFF7ED' : '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <strong style={{ fontSize: '0.88rem', color: '#0F2167' }}>💵 Cash on Delivery (COD)</strong>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, background: '#DCFCE7', color: '#15803D', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>Available</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Pay cash in INR when product arrives at your doorstep. (Orders up to ₹15,000)</div>
                  </div>

                  {/* Online Payment */}
                  <div
                    onClick={() => setPaymentMethod('online')}
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      border: paymentMethod === 'online' ? '2px solid #FF6B00' : '1px solid #CBD5E1',
                      background: paymentMethod === 'online' ? '#FFF7ED' : '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <strong style={{ fontSize: '0.88rem', color: '#0F2167' }}>💳 Online Payment</strong>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, background: '#E0E7FF', color: '#4338CA', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>Instant Pay</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>UPI (GPay, PhonePe, Paytm), Credit/Debit Cards & Net Banking.</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', background: '#F1F5F9', padding: '0.4rem', borderRadius: '6px', marginTop: '0.4rem' }}>
                      ℹ️ Razorpay API key will be added later. Express Checkout mode active.
                    </div>
                  </div>
                </div>

                {/* Payment Status */}
                <div style={{ background: '#FFFFFF', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569' }}>
                    Payment Status:{' '}
                    {paymentMethod === 'cod' ? (
                      <span style={{ color: '#D97706', background: '#FEF3C7', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 900 }}>
                        🟡 Pending (Pay ₹{summary.grandTotal.toLocaleString('en-IN')} on Delivery)
                      </span>
                    ) : (
                      <span style={{ color: '#059669', background: '#D1FAE5', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 900 }}>
                        🟢 Ready for Online Payment (Razorpay Express)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 6. Final Confirmation */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', marginTop: '1rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0F2167', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ✅ 6. Final Confirmation
                </h3>

                <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.5rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.4rem' }}>
                    Order Summary
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#475569' }}>Product:</span>
                    <strong style={{ color: '#0F2167', textAlign: 'right' }}>{cart[0]?.title || '7D Premium Leather Custom Fit Car Mats'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#475569' }}>Quantity:</span>
                    <strong style={{ color: '#0F2167' }}>{cart.reduce((s, i) => s + i.quantity, 0) || 1}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#475569' }}>Price:</span>
                    <strong style={{ color: '#0F2167' }}>₹{summary.subtotal.toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#475569' }}>Delivery:</span>
                    <strong style={{ color: summary.shippingFee === 0 ? '#059669' : '#0F2167' }}>
                      {summary.shippingFee === 0 ? 'FREE' : `₹${summary.shippingFee}`}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '0.5rem', marginTop: '0.4rem', fontSize: '1rem', fontWeight: 900 }}>
                    <span style={{ color: '#0F2167' }}>Total:</span>
                    <span style={{ color: '#FF6B00' }}>₹{summary.grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.75rem', borderRadius: '10px', fontSize: '0.78rem', color: '#065F46', marginBottom: '1rem' }}>
                  <strong>⚡ What happens next:</strong>
                  <div style={{ marginTop: '0.25rem' }}>• Order ID generated (e.g. SGR-2026-XXXXXX)</div>
                  <div>• Instant WhatsApp & Email/SMS confirmation</div>
                  <div>• Order recorded in <strong>My Orders</strong> history</div>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToStep2}
                  style={{ width: '100%', background: '#059669', color: '#FFFFFF', border: 'none', borderRadius: '10px', padding: '0.9rem', fontSize: '1rem', fontWeight: 900, cursor: 'pointer', display: 'flex', items: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)' }}
                >
                  ✅ Confirm Order <ArrowRight size={18} />
                </button>
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
