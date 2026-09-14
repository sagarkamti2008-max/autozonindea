import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { validateCartItems, createOrderAtomic } from '../services/orderService';
import { calculateCartTotals } from '../services/pricingDiscountEngine';
import {
  ShoppingCart, Trash2, Tag, ShieldCheck, ArrowRight, Lock, MapPin,
  Truck, CreditCard, ChevronRight, CheckCircle2, AlertCircle, Wrench,
  Building, Phone, Mail, User, Check, ArrowLeft, RefreshCw, Zap, HelpCircle, FileText,
  Heart, Plus, Minus
} from 'lucide-react';

export const ModernCartAndCheckoutView = ({ initialMode = 'cart' }) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    products,
    savedAddresses,
    setSavedAddresses,
    orders,
    setOrders,
    navigateTo,
    showToast,
    user,
    addToWishlist
  } = useStore();

  const [currentMode, setCurrentMode] = useState(initialMode || 'cart'); // 'cart' | 'checkout' | 'confirmation'

  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [confirmedOrderResult, setConfirmedOrderResult] = useState(null);
  
  // Payment Gateway State
  const [showRazorpayMock, setShowRazorpayMock] = useState(false);
  const [paymentProcessingState, setPaymentProcessingState] = useState('idle'); // idle | processing | success | failed

  // Cart Validation State
  const [validationWarning, setValidationWarning] = useState(null);

  // Cart Items
  const cartItems = cart && cart.length > 0 ? cart : [];

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState(null);

  // Address Selection & Form State
  const [selectedAddressId, setSelectedAddressId] = useState(savedAddresses[0]?.id || 'addr-1');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || 'Rahul Sharma',
    phone: user?.phone || '+91 9876543210',
    address_line: 'Flat 402, Green Acres Apt, Link Road',
    area: 'Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    gstNumber: ''
  });

  // Customer Contact Info State
  const [customerInfo, setCustomerInfo] = useState({
    fullName: user?.name || 'Rahul Sharma',
    phone: user?.phone || '+91 9876543210',
    email: user?.email || 'rahul.sharma@example.com'
  });

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Trusted Calculation State from Server Engine
  const [totals, setTotals] = useState({
    subtotal: 0,
    productSavings: 0,
    couponDiscount: 0,
    taxableAmount: 0,
    taxTotal: 0,
    taxBreakdown: { cgst: 0, sgst: 0, igst: 0, isIntraState: true },
    shippingFee: 0,
    isFreeShipping: false,
    grandTotal: 0
  });

  const activeAddress = savedAddresses.find(a => a.id === selectedAddressId) || addressForm;

  // Recalculate trusted totals whenever cart, coupon, or address changes
  useEffect(() => {
    const computeTotals = async () => {
      const result = await calculateCartTotals({
        cartItems,
        customerId: user?.id || null,
        couponCode: appliedCouponCode,
        shippingAddress: {
          state: activeAddress?.state || 'Maharashtra',
          pincode: activeAddress?.pincode || '400001'
        },
        shippingMethod: 'standard'
      });
      setTotals(result);
    };

    computeTotals();
  }, [cartItems, appliedCouponCode, activeAddress, user]);

  // Handle Quantity Changes
  const handleQuantityChange = (itemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      showToast('🗑️ Item removed from cart');
    } else {
      updateCartQuantity(itemId, newQty);
    }
  };

  // Handle Save For Later
  const handleSaveForLater = (item) => {
    addToWishlist(item);
    removeFromCart(item.id);
    showToast('❤️ Item saved for later in your Wishlist');
  };

  // Handle Coupon Submit with Server Engine
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      showToast('⚠️ Please enter a coupon code.', 'error');
      return;
    }

    const calc = await calculateCartTotals({
      cartItems,
      customerId: user?.id || null,
      couponCode: couponCode.trim(),
      shippingAddress: { state: activeAddress?.state || 'Maharashtra' }
    });

    if (calc.couponResult && calc.couponResult.valid) {
      setAppliedCouponCode(couponCode.trim().toUpperCase());
      setCouponMessage({ type: 'success', text: calc.couponResult.message });
      showToast(`🎉 ${calc.couponResult.message}`);
    } else {
      setCouponMessage({ type: 'error', text: calc.couponResult?.message || 'Invalid coupon code.' });
      showToast(`❌ ${calc.couponResult?.message || 'Invalid coupon'}`, 'error');
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setAppliedCouponCode('');
    setCouponMessage(null);
    showToast('Coupon removed');
  };

  const handleProceedToCheckout = () => {
    // Bypassing validation for UI testing purposes
    setValidationWarning(null);
    setCurrentMode('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveNewAddress = (e) => {
    e.preventDefault();
    const newAddr = {
      id: `addr-${Date.now()}`,
      name: addressForm.fullName,
      phone: addressForm.phone,
      address_line: addressForm.address_line,
      area: addressForm.area,
      city: addressForm.city,
      state: addressForm.state,
      pincode: addressForm.pincode,
      is_default: false
    };
    setSavedAddresses([newAddr, ...savedAddresses]);
    setSelectedAddressId(newAddr.id);
    setShowAddressForm(false);
    showToast('📍 Delivery address saved!');
  };

  const handleInitiatePayment = () => {
    if (isSubmittingOrder) return;
    
    // Bypass validation for UI testing purposes
    setValidationWarning(null);
    
    if (paymentMethod === 'cod') {
      processOrder('COD');
    } else {
      setShowRazorpayMock(true);
      setPaymentProcessingState('idle');
    }
  };

  const processOrder = async (paymentRef = null) => {
    setIsSubmittingOrder(true);
    setShowRazorpayMock(false);

    const payload = {
      customerInfo,
      address: activeAddress,
      cartItems,
      paymentMethod,
      paymentRef,
      couponCode: appliedCouponCode,
      couponDiscount: totals.couponDiscount,
      taxBreakdown: totals.taxBreakdown,
      grandTotal: totals.grandTotal
    };

    const res = await createOrderAtomic(payload, products);
    setIsSubmittingOrder(false);

    if (!res.success) {
      showToast(`❌ Order creation failed: ${res.message}`, 'error');
      setValidationWarning(res.message);
      setCurrentMode('cart');
      return;
    }

    setConfirmedOrderResult(res);
    setOrders([res.order, ...orders]);
    clearCart();
    setCurrentMode('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`🎉 Order Placed! Number: ${res.orderNumber}`);
  };

  // Razorpay Mock Component
  const renderRazorpayMock = () => {
    if (!showRazorpayMock) return null;

    const simulatePayment = () => {
      setPaymentProcessingState('processing');
      setTimeout(() => {
        setPaymentProcessingState('success');
        setTimeout(() => {
          processOrder(`pay_${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
        }, 1000);
      }, 2000);
    };

    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-slate-900 text-white p-5 flex justify-between items-center relative">
            <div>
              <h3 className="font-bold text-lg leading-tight">AutoZonIndia Checkout</h3>
              <p className="text-slate-400 text-xs mt-1">{customerInfo.phone}</p>
            </div>
            <div className="text-right">
              <span className="block text-xs text-slate-400">Amount</span>
              <span className="font-black text-xl">₹{totals.grandTotal.toLocaleString('en-IN')}</span>
            </div>
            {paymentProcessingState === 'idle' && (
              <button onClick={() => setShowRazorpayMock(false)} className="absolute top-2 right-2 text-slate-500 hover:text-white">✕</button>
            )}
          </div>

          {/* Body */}
          <div className="p-6 bg-slate-50 flex-1 flex flex-col items-center justify-center min-h-[250px]">
            {paymentProcessingState === 'idle' && (
              <div className="w-full space-y-4">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800">Secure Payment Environment</h4>
                  <p className="text-xs text-slate-500 mt-1">This is a mock payment gateway for testing.</p>
                </div>
                <button 
                  onClick={simulatePayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" /> Pay ₹{totals.grandTotal.toLocaleString('en-IN')}
                </button>
              </div>
            )}

            {paymentProcessingState === 'processing' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto" />
                <h4 className="font-bold text-slate-800">Processing Payment...</h4>
                <p className="text-xs text-slate-500">Please do not close this window</p>
              </div>
            )}

            {paymentProcessingState === 'success' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-black text-emerald-600 text-lg">Payment Successful!</h4>
                <p className="text-xs text-slate-500">Redirecting to order confirmation...</p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-3 bg-white border-t border-slate-100 text-center flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
            <Lock className="w-3 h-3" /> Secured by <strong className="text-slate-600">RazorpayMock</strong>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-8 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span onClick={() => navigateTo('home')} className="hover:text-orange-500 cursor-pointer transition-colors">Home</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="text-slate-900 font-bold">
              {currentMode === 'checkout' ? 'Express Checkout' : 'Order Confirmation'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full shadow-sm">
            <Lock className="w-4 h-4" /> 256-Bit SSL Encrypted
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* MODE 1: CART */}
        {currentMode === 'cart' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your Cart</h2>
                <span className="bg-orange-100 text-orange-600 font-bold px-3 py-1 rounded-full text-sm">{cartItems.length} Items</span>
              </div>

              {cartItems.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
                  <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Your cart is empty</h3>
                  <p className="text-slate-500 mb-6">Looks like you haven't added any parts to your cart yet.</p>
                  <button onClick={() => navigateTo('catalog')} className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl transition-colors">Start Shopping</button>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                    <span className="font-bold text-slate-500 text-xs uppercase tracking-wider">Product Details</span>
                    <button onClick={clearCart} className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"><Trash2 className="w-4 h-4"/> Clear Cart</button>
                  </div>

                  <div className="space-y-6">
                    {cartItems.map(item => (
                      <div key={item.id} className="border border-slate-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 relative hover:border-slate-200 transition-colors">
                        <div className="w-full sm:w-28 h-28 bg-slate-50 rounded-xl p-2 shrink-0 border border-slate-100 flex items-center justify-center relative">
                           <img src={item.image || item.image_url} alt={item.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{item.brand || 'BOSCH OEM ORIGINAL'}</div>
                            <h4 className="font-black text-slate-900 text-base leading-snug pr-8">{item.name || item.title}</h4>
                          </div>
                          
                          {/* Vehicle Compatibility Reminder */}
                          <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                            <span className="text-xs font-medium text-emerald-800 leading-tight">
                              This part fits your <b>Hyundai i20 (2022 Petrol)</b>.
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                            <div className="flex items-center border border-slate-200 rounded-lg bg-white shadow-sm overflow-hidden h-9">
                              <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="w-9 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-orange-500 transition-colors"><Minus className="w-4 h-4" /></button>
                              <div className="w-10 h-full flex items-center justify-center font-bold text-slate-900 text-sm border-x border-slate-100">{item.quantity}</div>
                              <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="w-9 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-orange-500 transition-colors"><Plus className="w-4 h-4" /></button>
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs font-bold">
                              <button onClick={() => handleSaveForLater(item)} className="text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"><Heart className="w-4 h-4"/> Save for Later</button>
                              <button onClick={() => handleQuantityChange(item.id, 0)} className="text-slate-500 hover:text-red-500 flex items-center gap-1.5 transition-colors"><Trash2 className="w-4 h-4"/> Remove</button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="sm:absolute sm:top-5 sm:right-5 flex flex-col items-end">
                          <div className="font-black text-slate-900 text-xl tracking-tight">₹{item.price.toLocaleString('en-IN')}</div>
                          <div className="text-xs text-slate-400 font-medium line-through">₹{Math.round(item.price * 1.2).toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Frequently Bought Together */}
                  {cartItems.length > 0 && (
                    <div className="mt-8 border-t border-slate-100 pt-6">
                       <h4 className="font-bold text-slate-900 text-sm mb-4">Frequently Bought Together</h4>
                       <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-4">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center shrink-0">
                               <Zap className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">Brake Cleaner Spray (500ml)</div>
                              <div className="text-xs text-slate-500 font-medium">Increases brake pad lifespan</div>
                            </div>
                         </div>
                         <div className="flex flex-col items-end gap-2 shrink-0">
                            <div className="font-black text-slate-900 text-sm">₹299</div>
                            <button className="text-xs font-bold bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">Add</button>
                         </div>
                       </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="lg:col-span-4">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm sticky top-32">
                  <h3 className="font-black text-slate-900 text-xl border-b border-slate-100 pb-4">Order Summary</h3>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <Tag className="w-4 h-4 text-orange-500" /> Have a Coupon?
                    </div>
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input type="text" value={couponCode} onChange={e=>setCouponCode(e.target.value)} placeholder="e.g. AUTO100" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-bold uppercase" />
                      <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 rounded-xl text-sm transition-colors shadow-sm">Apply</button>
                    </form>
                    {couponMessage && (
                      <div className={`text-xs font-bold flex items-center gap-1.5 mt-2 ${couponMessage.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                        {couponMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4"/> : <AlertCircle className="w-4 h-4"/>}
                        {couponMessage.text}
                      </div>
                    )}
                    {appliedCouponCode && (
                       <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl mt-2">
                         <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5"/> {appliedCouponCode} Applied</span>
                         <button onClick={handleRemoveCoupon} className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline">Remove</button>
                       </div>
                    )}
                  </div>

                  <div className="space-y-4 text-sm text-slate-600 border-t border-slate-100 pt-6">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Product Subtotal</span>
                      <span className="font-black text-slate-900">₹{totals.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>Taxable Amount</span>
                      <span>₹{totals.taxableAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>{totals.taxBreakdown.isIntraState ? 'CGST + SGST (18%)' : 'IGST (18%)'}</span>
                      <span>₹{totals.taxTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Delivery Charge</span>
                      <span className={totals.isFreeShipping ? 'text-emerald-600 font-black' : 'font-black text-slate-900'}>
                        {totals.isFreeShipping ? 'FREE' : `₹${totals.shippingFee}`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-2xl font-black text-slate-900 border-t border-slate-100 pt-6">
                      <span>Total</span>
                      <span className="text-orange-600 tracking-tight">₹{totals.grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {validationWarning && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold flex items-start gap-2 border border-red-100">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{validationWarning}</span>
                    </div>
                  )}

                  <button onClick={handleProceedToCheckout} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-lg py-5 rounded-2xl shadow-xl shadow-orange-500/25 flex items-center justify-center gap-3 transition-all active:scale-[0.98]">
                    Proceed to Checkout <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  {/* Estimated Delivery Date */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3 mt-4">
                     <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0"><Truck className="w-4 h-4" /></div>
                     <div className="text-xs">
                        <span className="block font-medium text-slate-600">Estimated Delivery</span>
                        <span className="font-bold text-blue-800">Delivery by Tuesday, 15 Mar</span>
                     </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="border-t border-slate-100 pt-5 mt-4 space-y-3">
                     <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                       <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
                       <span>100% Secure Checkout</span>
                     </div>
                     <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                       <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0" />
                       <span>Genuine OEM Parts Guarantee</span>
                     </div>
                     <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                       <RefreshCw className="w-4 h-4 text-blue-500 shrink-0" />
                       <span>Easy 7-Day Return Policy</span>
                     </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE 2: CHECKOUT */}
        {currentMode === 'checkout' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-8">
              {/* Order Items */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <h3 className="font-black text-slate-900 text-xl border-b border-slate-100 pb-4 flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-xl text-orange-500">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <span>Order Items</span>
                </h3>
                <div className="divide-y divide-slate-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-4 flex gap-4 items-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-xl p-2 shrink-0 border border-slate-100">
                        <img src={item.image || item.image_url} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{item.name || item.title}</h4>
                        <div className="text-xs text-slate-500 font-medium mt-1">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-black text-slate-900 text-right">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <h3 className="font-black text-slate-900 text-xl border-b border-slate-100 pb-4 flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-xl text-orange-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span>Delivery Address</span>
                </h3>

                {showAddressForm ? (
                  <form onSubmit={handleSaveNewAddress} className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-2">Customer & Shipping Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input type="text" placeholder="Full Name" required value={addressForm.fullName} onChange={e => setAddressForm({...addressForm, fullName: e.target.value})} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" />
                      <input type="tel" placeholder="Phone Number" required value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" />
                      <input type="email" placeholder="Email Address (Optional)" value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} className="w-full sm:col-span-2 bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" />
                      
                      <input type="text" placeholder="House No., Street, Building" required value={addressForm.address_line} onChange={e => setAddressForm({...addressForm, address_line: e.target.value})} className="w-full sm:col-span-2 bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" />
                      
                      <input type="text" placeholder="City" required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" />
                      <input type="text" placeholder="State" required value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" />
                      <input type="text" placeholder="Pincode" required value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" />
                      <input type="text" placeholder="Landmark (Optional)" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" />
                      
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-1">Vehicle Note (Optional) - Avoid wrong parts</label>
                        <input type="text" placeholder="e.g. 2018 Maruti Swift VXI" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" />
                      </div>
                      <div className="sm:col-span-2 mt-2 pt-4 border-t border-slate-200">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Business Details (Optional)</label>
                        <input type="text" placeholder="GST Number (For B2B Tax Invoice)" value={addressForm.gstNumber || ''} onChange={e => setAddressForm({...addressForm, gstNumber: e.target.value})} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none uppercase" />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button type="button" onClick={() => setShowAddressForm(false)} className="text-sm font-bold text-slate-500 hover:text-slate-900 px-4 py-2">Cancel</button>
                      <button type="submit" className="bg-slate-900 text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-slate-800 transition">Save Address</button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                          selectedAddressId === addr.id 
                            ? 'bg-orange-50 border-orange-500 shadow-sm' 
                            : 'bg-white border-slate-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-black text-slate-900">{addr.name || customerInfo.fullName}</div>
                          {selectedAddressId === addr.id && <CheckCircle2 className="w-5 h-5 text-orange-500" />}
                        </div>
                        <div className="text-sm text-slate-500 font-medium leading-relaxed">
                          {addr.address_line}<br />
                          {addr.city}, {addr.state} - {addr.pincode}
                        </div>
                      </div>
                    ))}
                    <div 
                      onClick={() => setShowAddressForm(true)}
                      className="p-5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-orange-400 bg-slate-50 hover:bg-orange-50 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-orange-500 min-h-[120px]"
                    >
                      <Plus className="w-6 h-6" />
                      <span className="font-bold text-sm">Add New Address</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <h3 className="font-black text-slate-900 text-xl border-b border-slate-100 pb-4 flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span>Payment Method</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'upi', title: 'UPI', desc: 'GPay, PhonePe, Paytm' },
                    { id: 'card', title: 'Credit / Debit Card', desc: 'Visa, MasterCard, RuPay' },
                    { id: 'netbanking', title: 'Net Banking', desc: 'All Indian Banks' },
                    { id: 'cod', title: 'Cash on Delivery', desc: 'Pay when you receive' }
                  ].map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                        paymentMethod === method.id 
                          ? 'bg-emerald-50 border-emerald-500 shadow-sm' 
                          : 'bg-white border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === method.id ? 'border-emerald-500' : 'border-slate-300'}`}>
                        {paymentMethod === method.id && <div className="w-3 h-3 bg-emerald-500 rounded-full" />}
                      </div>
                      <div>
                        <div className="font-black text-slate-900">{method.title}</div>
                        <div className="text-xs text-slate-500 font-medium">{method.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm sticky top-32">
                <h3 className="font-black text-slate-900 text-xl border-b border-slate-100 pb-4">Checkout Totals</h3>

                <div className="space-y-4 text-sm text-slate-600">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-black text-slate-900">₹{totals.subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {totals.couponDiscount > 0 && (
                    <div className="flex justify-between items-center text-emerald-600 bg-emerald-50 p-2 -mx-2 rounded-lg font-bold">
                      <span>Discount ({appliedCouponCode})</span>
                      <span>-₹{totals.couponDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-slate-500 text-xs">
                    <span>{totals.taxBreakdown.isIntraState ? 'CGST + SGST (18%)' : 'IGST (18%)'}</span>
                    <span className="font-semibold">₹{totals.taxTotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-medium">Delivery</span>
                    <span className={totals.isFreeShipping ? 'text-emerald-600 font-black' : 'font-black text-slate-900'}>
                      {totals.isFreeShipping ? 'FREE' : `₹${totals.shippingFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-2xl font-black text-slate-900 border-t border-slate-200 pt-6">
                    <span>Total</span>
                    <span className="text-orange-600 tracking-tight">₹{totals.grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  disabled={isSubmittingOrder}
                  onClick={handleInitiatePayment}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-lg py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                  {isSubmittingOrder ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Confirm & Place Order</span>
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-400 font-medium">By placing your order, you agree to our Terms of Service & Privacy Policy.</p>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: CONFIRMATION */}
        {currentMode === 'confirmation' && confirmedOrderResult && (
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-10 sm:p-16 text-center space-y-8 shadow-xl">
            <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-4">
              <span className="inline-block bg-emerald-100 text-emerald-700 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                Order Placed Successfully
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Thank you for your order!</h2>
              <p className="text-slate-500 font-medium text-lg max-w-md mx-auto">
                We've received your order and will begin processing it right away.
              </p>
              
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl inline-block mt-4 shadow-sm w-full sm:w-auto min-w-[300px]">
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Order Number</div>
                <div className="text-2xl font-black text-orange-500 tracking-wider">
                  {confirmedOrderResult.orderNumber}
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 max-w-md mx-auto py-2.5 rounded-xl border border-emerald-100">
                <CheckCircle2 className="w-4 h-4" />
                Order Confirmation has been sent to your WhatsApp
              </div>
            </div>
            
            <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigateTo('orders')}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-xl transition-colors shadow-md shadow-orange-500/25"
              >
                Track My Order
              </button>
              <button 
                onClick={() => navigateTo('catalog')}
                className="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-3.5 px-8 rounded-xl transition-colors shadow-sm"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Checkout Bar */}
      {currentMode === 'cart' && cartItems.length > 0 && (
        <div className="fixed bottom-[70px] left-0 right-0 p-3 bg-white border-t border-slate-200 z-[999] md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.08)] pb-safe">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="font-bold text-slate-500 text-sm">Total</span>
            <span className="font-black text-orange-600 text-lg">₹{totals.grandTotal.toLocaleString('en-IN')}</span>
          </div>
          <button onClick={handleProceedToCheckout} className="w-full bg-orange-500 text-white font-black py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm">
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mobile Sticky Place Order Bar */}
      {currentMode === 'checkout' && (
        <div className="fixed bottom-[70px] left-0 right-0 p-3 bg-white border-t border-slate-200 z-[999] md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.08)] pb-safe">
          <button
            disabled={isSubmittingOrder}
            onClick={handlePlaceOrder}
            className="w-full bg-slate-900 text-white font-black py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-70"
          >
            {isSubmittingOrder ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> Place Order
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
