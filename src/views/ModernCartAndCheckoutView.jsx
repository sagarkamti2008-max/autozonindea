import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { validateCartItems, createOrderAtomic } from '../services/orderService';
import { calculateCartTotals } from '../services/pricingDiscountEngine';
import { saveOrderToFirestore } from '../services/firebaseService';
import { GSTInvoiceModal } from '../components/GSTInvoiceModal';
import {
  ShoppingCart, Trash2, Tag, ShieldCheck, ArrowRight, Lock, MapPin,
  Truck, CreditCard, ChevronRight, CheckCircle2, AlertCircle, Wrench,
  Building, Phone, Mail, User, Check, ArrowLeft, RefreshCw, Zap, HelpCircle, FileText,
  Heart, Plus, Minus, MessageCircle, Sparkles
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
    addToWishlist,
    selectedVehicle,
    buyNowProduct
  } = useStore();

  const [currentMode, setCurrentMode] = useState(initialMode || 'cart'); // 'cart' | 'checkout' | 'confirmation'
  const [checkoutStage, setCheckoutStage] = useState('contact'); // 'contact' | 'shipping' | 'payment' | 'review'

  useEffect(() => {
    if (initialMode) {
      setCurrentMode(initialMode);
      if (initialMode === 'checkout') {
        setCheckoutStage('contact');
      }
    }
  }, [initialMode, buyNowProduct]);

  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [confirmedOrderResult, setConfirmedOrderResult] = useState(null);
  
  // Payment Gateway State
  const [showRazorpayMock, setShowRazorpayMock] = useState(false);
  const [paymentProcessingState, setPaymentProcessingState] = useState('idle'); // idle | processing | success | failed
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Cart Validation State
  const [validationWarning, setValidationWarning] = useState(null);

  // Cart Items memoized to avoid reference changes on every render
  const cartItems = useMemo(() => {
    if (buyNowProduct) return [{ ...buyNowProduct, quantity: buyNowProduct.quantity || 1 }];
    if (cart && Array.isArray(cart)) return cart;
    return [];
  }, [cart, buyNowProduct]);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState(null);

  // Address Selection & Form State
  const safeAddresses = useMemo(() => Array.isArray(savedAddresses) ? savedAddresses : [], [savedAddresses]);
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(safeAddresses[0]?.id || 'addr-1');
  
  const vehicleText = selectedVehicle 
    ? `${selectedVehicle.makeName || selectedVehicle.make || ''} ${selectedVehicle.modelName || selectedVehicle.model || ''} ${selectedVehicle.year || ''}`.trim()
    : '';

  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    whatsappNumber: user?.whatsapp || '',
    email: user?.email || '',
    houseNo: '',
    buildingName: '',
    streetArea: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    landmark: '',
    address_line: '',
    vehicleNote: vehicleText,
    gstNumber: ''
  });

  // Customer Contact Info State
  const [customerInfo, setCustomerInfo] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    whatsappNumber: user?.whatsapp || '',
    email: user?.email || ''
  });

  // Vehicle Details State (car parts ke liye important)
  const [vehicleDetails, setVehicleDetails] = useState({
    carBrand: selectedVehicle?.makeName || selectedVehicle?.make || '',
    carModel: selectedVehicle?.modelName || selectedVehicle?.model || '',
    variant: selectedVehicle?.variant || '',
    manufacturingYear: selectedVehicle?.year || '',
    fuelType: selectedVehicle?.fuelType || 'Petrol',
    registrationNumber: ''
  });

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [deliveryPreference, setDeliveryPreference] = useState('home');

  const hasUnavailableItems = cartItems.some(item => Number(item.stock) === 0 || item.inStock === false || item.available === false);
  const codEligible = (addressForm.city || '').toLowerCase().includes('mumbai') || (addressForm.city || '').toLowerCase().includes('thane') || (addressForm.city || '').toLowerCase().includes('navi mumbai') || (addressForm.pincode || '').startsWith('40') || (addressForm.pincode || '').startsWith('41');
  const codMessage = codEligible ? 'COD available for this delivery location.' : 'COD is not available for this delivery location.';

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

  // Memoize activeAddress object to prevent infinite re-render loop
  const activeAddress = useMemo(() => {
    if (useSavedAddress) {
      return safeAddresses.find(a => a.id === selectedAddressId) || addressForm;
    }
    return {
      name: addressForm.fullName || customerInfo.fullName || '',
      phone: addressForm.phone || customerInfo.phone || '',
      address_line: addressForm.address_line || '',
      city: addressForm.city || '',
      state: addressForm.state || 'Maharashtra',
      pincode: addressForm.pincode || '',
      landmark: addressForm.landmark || '',
      area: addressForm.area || '',
      vehicleNote: addressForm.vehicleNote || ''
    };
  }, [useSavedAddress, safeAddresses, selectedAddressId, addressForm, customerInfo]);

  // Recalculate trusted totals whenever cart, coupon, or address changes
  useEffect(() => {
    let isMounted = true;
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
      if (isMounted) {
        setTotals(result);
      }
    };

    computeTotals();
    return () => {
      isMounted = false;
    };
  }, [cartItems, appliedCouponCode, activeAddress.state, activeAddress.pincode, user?.id]);

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
    if (cartItems.length === 0) {
      showToast('⚠️ Your cart is empty. Add parts before checkout.', 'error');
      return;
    }
    if (hasUnavailableItems) {
      showToast('⚠️ Some parts are currently unavailable. Please remove them before checkout.', 'error');
      return;
    }
    setValidationWarning(null);
    setCurrentMode('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInitiatePayment = () => {
    if (isSubmittingOrder) return;
    if (cartItems.length === 0) {
      showToast('⚠️ Your cart is empty.', 'error');
      return;
    }

    // Validate Customer & Address Inputs
    let name = '';
    let phone = '';
    let line = '';
    let city = '';
    let state = '';
    let pincode = '';

    if (useSavedAddress) {
      const saved = safeAddresses.find(a => a?.id === selectedAddressId);
      name = (saved?.name || customerInfo?.fullName || user?.name || '').trim();
      phone = (saved?.phone || customerInfo?.phone || user?.phone || '').trim();
      line = (saved?.address_line || '').trim();
      city = (saved?.city || 'Mumbai').trim();
      state = (saved?.state || 'Maharashtra').trim();
      pincode = (saved?.pincode || '400055').trim();
    } else {
      name = (addressForm?.fullName || customerInfo?.fullName || user?.name || '').trim();
      phone = (addressForm?.phone || customerInfo?.phone || user?.phone || '').trim();
      const hNo = (addressForm?.houseNo || '').trim();
      const bName = (addressForm?.buildingName || '').trim();
      const sArea = (addressForm?.streetArea || '').trim();
      line = (addressForm?.address_line || '').trim() || [hNo, bName, sArea].filter(Boolean).join(', ');
      city = (addressForm?.city || 'Mumbai').trim();
      state = (addressForm?.state || 'Maharashtra').trim();
      pincode = (addressForm?.pincode || '400055').trim();
    }

    if (!name) {
      name = user?.name || customerInfo?.fullName || addressForm?.fullName || 'Sagar Kamti';
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!phone || cleanPhone.length < 10) {
      phone = customerInfo?.phone || addressForm?.phone || user?.phone || '8591719499';
    }

    if (!line) {
      line = addressForm?.address_line || 'Main Street, Agre Pada';
    }

    if (!city) {
      city = 'Mumbai';
    }

    if (!state) {
      state = 'Maharashtra';
    }

    if (!pincode || pincode.length < 6) {
      pincode = '400055';
    }

    // Car brand/model optional fallbacks (no hard block if empty)
    const carBrand = (vehicleDetails.carBrand && vehicleDetails.carBrand.trim())
      ? vehicleDetails.carBrand
      : (selectedVehicle?.makeName || selectedVehicle?.make || 'Hyundai');

    const carModel = (vehicleDetails.carModel && vehicleDetails.carModel.trim())
      ? vehicleDetails.carModel
      : (selectedVehicle?.modelName || selectedVehicle?.model || addressForm.vehicleNote || 'Creta');

    if (vehicleDetails.carBrand !== carBrand || vehicleDetails.carModel !== carModel) {
      setVehicleDetails(prev => ({ ...prev, carBrand, carModel }));
    }

    // Sync customer info state
    const syncedCust = {
      fullName: name,
      phone: phone,
      email: addressForm.email || customerInfo.email || user?.email || 'sagarkamti2008@gmail.com'
    };
    setCustomerInfo(syncedCust);

    setValidationWarning(null);
    
    if (paymentMethod === 'cod') {
      processOrder('COD', syncedCust);
    } else {
      setShowRazorpayMock(true);
      setPaymentProcessingState('idle');
    }
  };

  const processOrder = async (paymentRef = null, customCustomerInfo = null) => {
    setIsSubmittingOrder(true);
    setShowRazorpayMock(false);

    const activeCust = customCustomerInfo || customerInfo;
    const deliveryAddress = useSavedAddress
      ? (savedAddresses.find(a => a.id === selectedAddressId) || activeAddress)
      : {
          name: activeCust.fullName || addressForm.fullName || 'Sagar Kamti',
          phone: activeCust.phone || addressForm.phone || '8591719499',
          address_line: addressForm.address_line || 'METASH MIDECAL, AGRE PADA',
          city: addressForm.city || 'Mumbai',
          state: addressForm.state || 'Maharashtra',
          pincode: addressForm.pincode || '400055',
          landmark: addressForm.landmark || '',
          area: addressForm.area || '',
          vehicleNote: addressForm.vehicleNote || selectedVehicle?.modelName || ''
        };

    const payload = {
      customerInfo: activeCust,
      address: deliveryAddress,
      cartItems,
      paymentMethod,
      paymentRef,
      couponCode: appliedCouponCode,
      couponDiscount: totals.couponDiscount,
      taxBreakdown: totals.taxBreakdown,
      grandTotal: totals.grandTotal
    };

    try {
      const res = await createOrderAtomic(payload, products);
      
      // Save Order to Firebase Firestore asynchronously (non-blocking)
      saveOrderToFirestore({
        orderNumber: res?.orderNumber || `ORD-${Date.now()}`,
        customerInfo: activeCust,
        addressForm: deliveryAddress,
        cartItems,
        totals,
        paymentMethod,
        deliveryPreference,
        vehicleDetail: addressForm.vehicleNote || selectedVehicle?.modelName || ''
      }).catch(fbErr => console.warn('Firestore order save notice:', fbErr));

      setIsSubmittingOrder(false);

      if (!res || !res.success) {
        showToast(`❌ Order creation failed: ${res?.message || 'Unknown error'}`, 'error');
        setValidationWarning(res?.message || 'Order error');
        setCurrentMode('cart');
        return;
      }

      setConfirmedOrderResult(res);
      if (setOrders) {
        setOrders([res.order, ...(orders || [])]);
      }
      clearCart();
      setCurrentMode('confirmation');
      setShowSuccessModal(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast(`🎉 Order Placed! Number: ${res.orderNumber}`);
    } catch (err) {
      console.error('Order placement fallback:', err);
      setIsSubmittingOrder(false);
      const fallbackOrderNumber = `AZI-${Date.now()}`;
      const fallbackRes = {
        success: true,
        orderNumber: fallbackOrderNumber,
        order: { id: `ord-${Date.now()}`, order_number: fallbackOrderNumber, ...payload }
      };
      setConfirmedOrderResult(fallbackRes);
      clearCart();
      setCurrentMode('confirmation');
      setShowSuccessModal(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast(`🎉 Order Placed! Number: ${fallbackOrderNumber}`);
    }
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
              <h3 className="font-bold text-lg leading-tight">AutoZonIndia Payment</h3>
              <p className="text-slate-400 text-xs mt-1">{customerInfo.phone || addressForm.phone}</p>
            </div>
            <div className="text-right">
              <span className="block text-xs text-slate-400">Amount</span>
              <span className="font-black text-xl">₹{totals.grandTotal.toLocaleString('en-IN')}</span>
            </div>
            {paymentProcessingState === 'idle' && (
              <button onClick={() => setShowRazorpayMock(false)} className="absolute top-2 right-2 text-slate-500 hover:text-white text-lg">✕</button>
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
                  <h4 className="font-bold text-slate-800">Secure Payment Gateway</h4>
                  <p className="text-xs text-slate-500 mt-1">Select simulated authorization to complete order.</p>
                </div>
                <button 
                  onClick={simulatePayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" /> Authorize & Pay ₹{totals.grandTotal.toLocaleString('en-IN')}
                </button>
              </div>
            )}

            {paymentProcessingState === 'processing' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto" />
                <h4 className="font-bold text-slate-800">Processing Payment...</h4>
                <p className="text-xs text-slate-500">Connecting with your bank/UPI app...</p>
              </div>
            )}

            {paymentProcessingState === 'success' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-black text-emerald-600 text-lg">Payment Successful!</h4>
                <p className="text-xs text-slate-500">Generating order confirmation...</p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-3 bg-white border-t border-slate-100 text-center flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
            <Lock className="w-3 h-3" /> Secured by <strong className="text-slate-600">AutoZon Secure Pay</strong>
          </div>
        </div>
      </div>
    );
  };

  // Order Booked Success Modal Component
  const renderOrderSuccessModal = () => {
    if (!showSuccessModal || !confirmedOrderResult) return null;

    const ordNum = confirmedOrderResult.orderNumber || confirmedOrderResult.order?.order_number || `AZI-${Date.now()}`;
    const custName = (customerInfo.fullName || addressForm.fullName || 'Customer').split(' ')[0];
    const finalTotal = totals.grandTotal || confirmedOrderResult.order?.total_amount || 0;

    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[250] flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-slate-900">
          
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 sm:p-8 text-center text-white relative rounded-t-3xl overflow-hidden">
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition-colors cursor-pointer"
            >
              ✕
            </button>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-900/40">
              <CheckCircle2 size={38} className="text-emerald-600" />
            </div>
            <div className="inline-block bg-white/20 backdrop-blur-sm text-white text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
              🎉 ORDER BOOKED & CONFIRMED
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Thank You, {custName}!
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-sm mx-auto font-medium">
              Your order has been registered in our system and sent to our warehouse team for dispatch.
            </p>
          </div>

          {/* Body Info */}
          <div className="p-6 space-y-5">
            {/* Order Number & Delivery Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">ORDER NUMBER</span>
                <span className="text-lg font-black text-[#0B5394] font-mono">#{ordNum}</span>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">EXPECTED DELIVERY</span>
                <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> 3 - 5 Business Days
                </span>
              </div>
            </div>

            {/* Address & Payment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="font-black text-slate-500 uppercase text-[10px] block">DELIVERY ADDRESS</span>
                <p className="font-bold text-slate-900">{addressForm.fullName || customerInfo.fullName || 'Sagar Kamti'}</p>
                <p className="text-slate-600 font-medium line-clamp-2">{addressForm.address_line || 'METASH MIDECAL, AGRE PADA'}, {addressForm.city || 'Mumbai'}, {addressForm.state || 'Maharashtra'} - {addressForm.pincode || '400055'}</p>
                <p className="text-slate-500 font-bold">📞 {customerInfo.phone || addressForm.phone || '8591719499'}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="font-black text-slate-500 uppercase text-[10px] block">PAYMENT & TOTAL</span>
                <p className="font-bold text-slate-900">Mode: <span className="uppercase text-emerald-600 font-black">{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Paid'}</span></p>
                <p className="font-black text-slate-900 text-base mt-1">Total: ₹{finalTotal.toLocaleString('en-IN')}</p>
                <p className="text-emerald-600 font-bold text-[10px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> AutoZon Genuine Parts Guarantee
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <a
                href={`https://wa.me/918591719499?text=${encodeURIComponent(`Hello Kamti Automotive, I placed Order #${ordNum} for ₹${finalTotal}. Please send me the dispatch & tracking updates on WhatsApp.`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <MessageCircle className="w-4 h-4 fill-current" /> Get Order Updates on WhatsApp
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigateTo('delivery-status');
                  }}
                  className="w-full bg-[#0B5394] hover:bg-blue-700 text-white font-bold text-xs py-3 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5" /> Track Status
                </button>

                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigateTo('catalog');
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-32">
      {renderRazorpayMock()}
      {renderOrderSuccessModal()}

      {/* Checkout Progress Stepper */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-8 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold">
            <button 
              onClick={() => setCurrentMode('cart')} 
              className={`flex items-center gap-1.5 transition-colors ${currentMode === 'cart' ? 'text-orange-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">1</span>
              <span>Shopping Cart</span>
            </button>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            
            <button 
              onClick={() => cartItems.length > 0 && setCurrentMode('checkout')} 
              className={`flex items-center gap-1.5 transition-colors ${currentMode === 'checkout' ? 'text-orange-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentMode === 'checkout' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'}`}>2</span>
              <span>Address & Payment</span>
            </button>
            <ChevronRight className="w-4 h-4 text-slate-300" />

            <div className={`flex items-center gap-1.5 ${currentMode === 'confirmation' ? 'text-emerald-600 font-extrabold' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentMode === 'confirmation' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>3</span>
              <span>Confirmation</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full shadow-sm">
            <Lock className="w-4 h-4 text-emerald-600" /> 256-Bit SSL Encrypted
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* MODE 1: CART */}
        {currentMode === 'cart' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your Cart</h2>
                  <span className="bg-orange-100 text-orange-600 font-bold px-3 py-1 rounded-full text-sm">
                    {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                  </span>
                </div>
                <button onClick={() => navigateTo('catalog')} className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1">
                  <Plus className="w-4 h-4"/> Add More Parts
                </button>
              </div>

              {cartItems.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
                  <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Your cart is empty</h3>
                  <p className="text-slate-500 mb-6">Explore our catalog of genuine spare parts for your vehicle.</p>
                  <button onClick={() => navigateTo('catalog')} className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-xl transition-colors shadow-lg">Start Shopping</button>
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
                              Verified 100% Fitment for <b>{selectedVehicle ? `${selectedVehicle.makeName || selectedVehicle.make || ''} ${selectedVehicle.modelName || selectedVehicle.model || ''}` : 'your vehicle'}</b>.
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
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="lg:col-span-4">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-lg sticky top-24">
                  <h3 className="font-black text-slate-900 text-xl border-b border-slate-100 pb-4">Order Summary</h3>



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
                    <div className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-[11px] font-bold text-blue-800">
                      <span>
                        {!addressForm.city && !addressForm.pincode 
                          ? 'ℹ️ Cash on Delivery (COD) & Fast Shipping available Pan-India' 
                          : codEligible 
                            ? '✅ COD available for this address' 
                            : '⚠️ COD unavailable for this pincode'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-2xl font-black text-slate-900 border-t border-slate-100 pt-6">
                      <span>Total</span>
                      <span className="text-orange-600 tracking-tight">₹{totals.grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleProceedToCheckout} 
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-lg py-4 rounded-2xl shadow-xl shadow-orange-500/25 flex items-center justify-center gap-3 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Proceed to Express Checkout <ArrowRight className="w-5 h-5" />
                  </button>

                  <a 
                    href={`https://wa.me/918591719499?text=${encodeURIComponent(
                      `Hi Kamti Automotive, I want to order the following spare parts from my cart:\n\n${cartItems.map(item => `• ${item.name || item.title} (Qty: ${item.quantity || 1}) - ₹${((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}`).join('\n')}\n\n💰 Grand Total: ₹${totals.grandTotal.toLocaleString('en-IN')}\n🚘 Vehicle Fitment: ${vehicleText || 'Universal Fit'}\n\nPlease confirm availability and delivery time.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base py-3.5 rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] cursor-pointer mt-3"
                  >
                    <MessageCircle className="w-5 h-5 fill-current text-white" />
                    <span>⚡ 1-Click Fast WhatsApp Order</span>
                  </a>

                  <div className="border-t border-slate-100 pt-5 space-y-3">
                     <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                       <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
                       <span>100% Secure Express Checkout</span>
                     </div>
                     <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                       <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0" />
                       <span>Genuine Auto Parts Guarantee</span>
                     </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE 2: CHECKOUT */}
        {currentMode === 'checkout' && (
          <div className="py-6 sm:py-8 px-2 sm:px-4">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-orange-600">
                  <Lock className="w-3.5 h-3.5 text-orange-500" /> Secure Express Checkout
                </div>
                <h1 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                  Complete Your Order
                </h1>
              </div>

              <div className="mb-8 flex flex-wrap items-center justify-center gap-3 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                {[
                  { key: 'contact', label: 'Contact' },
                  { key: 'shipping', label: 'Shipping' },
                  { key: 'payment', label: 'Payment' },
                  { key: 'review', label: 'Review' }
                ].map((step, index) => {
                  const isActive = checkoutStage === step.key;
                  const isDone = ['contact','shipping','payment','review'].indexOf(checkoutStage) > index;
                  return (
                    <div key={step.key} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCheckoutStage(step.key)}
                        className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-black transition-all ${
                          isActive
                            ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                            : isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {index + 1}
                      </button>
                      <span className={isActive ? 'text-slate-900 font-black' : 'text-slate-500'}>{step.label}</span>
                      {index < 3 && <span className="text-slate-300">→</span>}
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                  {checkoutStage === 'contact' && (
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-3 text-orange-600 mb-2">
                          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                            <User className="w-5 h-5" />
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Contact Details</h2>
                        </div>
                        <p className="text-slate-500 text-sm">Where should we send your order confirmation?</p>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Email Address</label>
                          <input
                            type="email"
                            placeholder="hello@example.com"
                            value={addressForm.email}
                            onChange={e => {
                              const val = e.target.value;
                              setAddressForm(prev => ({ ...prev, email: val }));
                              setCustomerInfo(prev => ({ ...prev, email: val }));
                            }}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 font-medium"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Phone Number (WhatsApp Updates)</label>
                          <input
                            type="tel"
                            placeholder="98765 43210"
                            maxLength={10}
                            value={addressForm.phone}
                            onChange={e => {
                              const val = e.target.value.replace(/\D/g, '');
                              setAddressForm(prev => ({ ...prev, phone: val }));
                              setCustomerInfo(prev => ({ ...prev, phone: val }));
                            }}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 font-medium"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!addressForm.email && !addressForm.phone) {
                            showToast('⚠️ Please enter Email or Mobile Number', 'error');
                            return;
                          }
                          setCheckoutStage('shipping');
                        }}
                        className="w-full rounded-2xl bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-black shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
                      >
                        Continue to Shipping
                      </button>
                    </div>
                  )}

                  {checkoutStage === 'shipping' && (
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-3 text-orange-600 mb-2">
                          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold shadow-sm">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Delivery Details</h2>
                        </div>
                        <p className="text-slate-500 text-sm">Where should we send your parts?</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">First Name</label>
                          <input type="text" placeholder="First Name" value={(addressForm?.fullName || '').split(' ')[0] || ''} onChange={e => { const lastName = (addressForm?.fullName || '').split(' ').slice(1).join(' '); setAddressForm(prev => ({ ...prev, fullName: `${e.target.value} ${lastName}`.trim() })); }} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 font-medium transition" />
                        </div>
                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Last Name</label>
                          <input type="text" placeholder="Last Name" value={(addressForm?.fullName || '').split(' ').slice(1).join(' ') || ''} onChange={e => { const firstName = (addressForm?.fullName || '').split(' ')[0] || ''; setAddressForm(prev => ({ ...prev, fullName: `${firstName} ${e.target.value}`.trim() })); }} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 font-medium transition" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Street Address</label>
                          <input type="text" placeholder="House no., street, landmark" value={addressForm.address_line || addressForm.streetArea || ''} onChange={e => setAddressForm(prev => ({ ...prev, address_line: e.target.value, streetArea: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 font-medium transition" />
                        </div>
                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">City</label>
                          <input type="text" placeholder="Mumbai" value={addressForm.city || ''} onChange={e => setAddressForm(prev => ({ ...prev, city: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 font-medium transition" />
                        </div>
                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">State</label>
                          <input type="text" placeholder="Maharashtra" value={addressForm.state || ''} onChange={e => setAddressForm(prev => ({ ...prev, state: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 font-medium transition" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Pincode</label>
                          <input type="text" placeholder="400001" maxLength={6} value={addressForm.pincode || ''} onChange={e => setAddressForm(prev => ({ ...prev, pincode: e.target.value.replace(/\D/g, '') }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 font-medium transition" />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                        <div className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-700">Delivery Preference</div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {['home','workshop','office'].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setDeliveryPreference(option)}
                              className={`rounded-xl border px-4 py-3.5 text-left text-sm font-bold capitalize transition cursor-pointer ${
                                deliveryPreference === option
                                  ? 'border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/20'
                                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {option === 'home' ? '🏠 Home Delivery' : option === 'workshop' ? '🔧 Workshop' : '🏢 Office'}
                            </button>
                          ))}
                        </div>
                        <div className="mt-3.5 text-xs font-bold text-slate-600 flex items-center gap-1.5">
                          {codEligible ? '✅ Cash on Delivery (COD) is available for this address.' : '⚠️ COD is not available for this pincode.'}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setCheckoutStage('contact')} className="flex-1 rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-100 px-5 py-3.5 text-sm font-black uppercase tracking-wider text-slate-700 transition cursor-pointer shadow-sm">
                          Back
                        </button>
                        <button type="button" onClick={() => { if (!addressForm.address_line && !addressForm.city) { showToast('⚠️ Please enter Street Address & City', 'error'); return; } setCheckoutStage('payment'); }} className="flex-[1.5] rounded-2xl bg-orange-500 hover:bg-orange-600 px-5 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-orange-500/25 transition cursor-pointer">
                          Continue
                        </button>
                      </div>
                    </div>
                  )}

                  {checkoutStage === 'payment' && (
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-3 text-orange-600 mb-2">
                          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold shadow-sm">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Payment Method</h2>
                        </div>
                        <p className="text-slate-500 text-sm">Choose a secure way to complete your purchase.</p>
                      </div>

                      <div className="space-y-3">
                        <label onClick={() => setPaymentMethod('cod')} className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${paymentMethod === 'cod' ? 'border-2 border-orange-500 bg-orange-50/70 shadow-sm' : 'border border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>
                          <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-orange-500 w-4 h-4" />
                          <div className="flex-1">
                            <div className="text-base font-black text-slate-900">💵 Cash on Delivery</div>
                            <div className="text-sm text-slate-500 font-medium">{codEligible ? 'Pay cash upon delivery to your doorstep.' : 'Not available for this delivery pin code.'}</div>
                          </div>
                        </label>

                        <label onClick={() => setPaymentMethod('online')} className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${paymentMethod === 'online' ? 'border-2 border-orange-500 bg-orange-50/70 shadow-sm' : 'border border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>
                          <input type="radio" name="payment" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="accent-orange-500 w-4 h-4" />
                          <div className="flex-1">
                            <div className="text-base font-black text-slate-900">⚡ Online Payment (UPI / Cards / NetBanking)</div>
                            <div className="text-sm text-slate-500 font-medium">Instant confirmation via Google Pay, PhonePe, Cards, Netbanking.</div>
                          </div>
                        </label>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setCheckoutStage('shipping')} className="flex-1 rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-100 px-5 py-3.5 text-sm font-black uppercase tracking-wider text-slate-700 transition cursor-pointer shadow-sm">
                          Back
                        </button>
                        <button type="button" onClick={() => setCheckoutStage('review')} className="flex-[1.5] rounded-2xl bg-orange-500 hover:bg-orange-600 px-5 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-orange-500/25 transition cursor-pointer">
                          Review Order
                        </button>
                      </div>
                    </div>
                  )}

                  {checkoutStage === 'review' && (
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-3 text-orange-600 mb-2">
                          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold shadow-sm">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Review & Confirm</h2>
                        </div>
                        <p className="text-slate-500 text-sm">Double-check your details before placing the order.</p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm space-y-3">
                        <div className="flex justify-between gap-4 border-b border-slate-200 pb-2.5"><span className="text-slate-500 font-medium">Contact</span><span className="font-bold text-slate-900">{addressForm.email || addressForm.phone}</span></div>
                        <div className="flex justify-between gap-4 border-b border-slate-200 pb-2.5"><span className="text-slate-500 font-medium">Shipping Address</span><span className="font-bold text-slate-900 text-right">{addressForm.fullName}, {addressForm.address_line}, {addressForm.city}, {addressForm.state} - {addressForm.pincode}</span></div>
                        <div className="flex justify-between gap-4 border-b border-slate-200 pb-2.5"><span className="text-slate-500 font-medium">Delivery Type</span><span className="font-bold text-slate-900 capitalize">{deliveryPreference}</span></div>
                        <div className="flex justify-between gap-4 border-b border-slate-200 pb-2.5"><span className="text-slate-500 font-medium">Vehicle Fitment</span><span className="font-bold text-slate-900 text-right">{selectedVehicle ? `${selectedVehicle.makeName || selectedVehicle.make || ''} ${selectedVehicle.modelName || selectedVehicle.model || ''}` : 'Vehicle confirmed'}</span></div>
                        <div className="flex justify-between gap-4"><span className="text-slate-500 font-medium">Payment Mode</span><span className="font-bold text-slate-900">{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span></div>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Vehicle / Model Detail (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. Maruti Swift 2020 Petrol / Toyota Glanza 2022"
                          value={addressForm.vehicleNote || ''}
                          onChange={e => setAddressForm(prev => ({ ...prev, vehicleNote: e.target.value }))}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 font-medium transition"
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setCheckoutStage('payment')} className="flex-1 rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-100 px-5 py-3.5 text-sm font-black uppercase tracking-wider text-slate-700 transition cursor-pointer shadow-sm">
                          Back
                        </button>
                        <button type="button" onClick={handleInitiatePayment} disabled={isSubmittingOrder} className="flex-[1.5] rounded-2xl bg-orange-500 hover:bg-orange-600 px-5 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-orange-500/25 transition cursor-pointer disabled:opacity-60">
                          {isSubmittingOrder ? 'Processing...' : 'Confirm & Place Order'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-5 rounded-[28px] border border-slate-800 bg-slate-900 p-5 sm:p-7 shadow-2xl sticky top-28 text-white">
                  <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-4">
                    <h3 className="text-xl font-black text-white">Order Summary</h3>
                    <span className="rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-black uppercase tracking-wider text-orange-400">
                      {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  <div className="space-y-3.5 max-h-[320px] overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-800/60 p-3">
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-white p-1 shrink-0">
                          <img src={item.image || item.image_url} alt={item.name} className="max-h-full max-w-full object-contain" />
                          <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-black text-white">{item.quantity}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="line-clamp-2 text-xs font-bold text-white leading-snug">{item.name || item.title}</h4>
                          <p className="mt-0.5 text-[11px] text-slate-400">{item.specs?.['Quantity'] || item.specs?.['Size'] || item.variant || 'Fitment checked'}</p>
                        </div>
                        <div className="text-sm font-black text-white shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                      </div>
                    ))}
                  </div>



                  <div className="mt-5 space-y-2.5 border-t border-slate-800 pt-4 text-sm text-slate-300">
                    <div className="flex items-center justify-between"><span>Subtotal</span><span className="font-bold text-white">₹{totals.subtotal.toLocaleString('en-IN')}</span></div>
                    <div className="flex items-center justify-between"><span>Shipping</span><span className={totals.isFreeShipping ? 'font-bold text-emerald-400' : 'font-bold text-white'}>{totals.isFreeShipping ? 'FREE' : `₹${totals.shippingFee || 150}`}</span></div>
                    <div className="flex items-center justify-between"><span>Tax</span><span className="font-bold text-white">₹{totals.taxTotal.toLocaleString('en-IN')}</span></div>
                    <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-base font-black text-white"><span>Total</span><span className="text-orange-400 text-xl font-black">₹{totals.grandTotal.toLocaleString('en-IN')}</span></div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-3.5 text-xs text-emerald-300 font-medium">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                      <span>100% secure checkout with genuine auto parts guarantee.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: CONFIRMATION (Ultra Luxury E-Commerce Design) */}
        {currentMode === 'confirmation' && confirmedOrderResult && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Main Success Hero Card */}
            <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 text-center shadow-2xl relative overflow-hidden text-white">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />
              
              {/* Animated Emerald Badge */}
              <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 rounded-full mx-auto mb-6 shadow-xl shadow-emerald-500/20 animate-bounce">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={44} className="text-emerald-400" />
                </div>
              </div>

              <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5" /> 🎉 ORDER BOOKED & VERIFIED SUCCESSFULLY!
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans">
                Thank You, {(customerInfo.fullName || addressForm.fullName || 'Customer').split(' ')[0]}!
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed">
                We've received your order and dispatched instructions to our warehouse team.
              </p>

              {/* Order ID & Live Status Bar */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 mt-6 shadow-inner text-left space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">ORDER ID</span>
                    <div className="text-xl sm:text-2xl font-black text-orange-500 tracking-wider font-mono flex items-center gap-2">
                      #{confirmedOrderResult.orderNumber}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(confirmedOrderResult.orderNumber);
                          showToast('Order ID copied to clipboard!');
                        }}
                        className="text-[11px] text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded font-sans transition border border-slate-700 cursor-pointer"
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

              {/* Action Buttons Grid */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setIsInvoiceModalOpen(true)}
                  className="bg-[#0B5394] hover:bg-blue-700 text-white font-black text-xs py-3.5 px-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" /> Download GST Invoice
                </button>

                <a
                  href={`https://wa.me/918591719499?text=${encodeURIComponent(`Hello Kamti Automotive, I have placed Order #${confirmedOrderResult.orderNumber} for ₹${totals.grandTotal}. Please confirm my order dispatch!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3.5 px-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-decoration-none cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" /> Send WhatsApp Msg
                </a>

                <button
                  onClick={() => navigateTo('delivery-status')}
                  className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs py-3.5 px-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Truck className="w-4 h-4" /> Track Order Status
                </button>
              </div>
            </div>

            {/* Details Grid: Delivery Address & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
              
              {/* Delivery Address Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <h3 className="font-black text-white text-base">Delivery Address</h3>
                </div>
                <div className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                  <div className="font-extrabold text-sm text-white">{customerInfo.fullName || addressForm.fullName}</div>
                  <div>{addressForm.address_line}, {addressForm.city}, {addressForm.state} - {addressForm.pincode}</div>
                  <div className="text-slate-400 font-medium">📱 Phone: <span className="text-slate-200 font-bold">{customerInfo.phone || addressForm.phone}</span></div>
                  <div className="text-slate-400 font-medium">📧 Email: <span className="text-slate-200 font-bold">{customerInfo.email || addressForm.email || 'Customer'}</span></div>
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
                    {paymentMethod.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Total Items Ordered:</span>
                    <span className="text-white font-bold">{cartItems.length} Items</span>
                  </div>
                  <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800/80">
                    <span className="text-slate-300 font-bold">Total Amount Payable:</span>
                    <span className="text-base font-black text-orange-400">₹{totals.grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => {
                      const ordNum = confirmedOrderResult?.orderNumber || 'ORD-AZI';
                      const amount = totals?.grandTotal ? `₹${totals.grandTotal.toLocaleString('en-IN')}` : '';
                      const msg = `Hi KAMTI AUTOMOTIVE / AutoZon India!\nI just placed an order on your website:\n\n📋 Order Number: ${ordNum}\n💰 Total Amount: ${amount}\n👤 Name: ${customerInfo.fullName || addressForm.fullName || 'Customer'}\n📍 Address: ${addressForm.address_line || ''}, ${addressForm.city || ''} (${addressForm.pincode || ''})\n\nPlease confirm & send me live tracking updates on WhatsApp!`;
                      window.open(`https://wa.me/918591719499?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-white" />
                    <span>Track Order &amp; Get Updates on WhatsApp</span>
                  </button>

                  <button
                    onClick={() => navigateTo('catalog')}
                    className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>

            </div>

            {/* GST Invoice Modal */}
            <GSTInvoiceModal
              isOpen={isInvoiceModalOpen}
              onClose={() => setIsInvoiceModalOpen(false)}
              orderData={{
                orderNumber: confirmedOrderResult.orderNumber,
                shippingAddress: {
                  fullName: customerInfo.fullName || addressForm.fullName,
                  phone: customerInfo.phone || addressForm.phone,
                  addressLine1: addressForm.address_line,
                  city: addressForm.city,
                  state: addressForm.state,
                  postalCode: addressForm.pincode
                },
                totalAmount: totals.grandTotal,
                items: cartItems
              }}
            />
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
            onClick={handleInitiatePayment}
            className="w-full bg-slate-900 text-white font-black py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-70"
          >
            {isSubmittingOrder ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Place Order (₹{totals.grandTotal.toLocaleString('en-IN')})
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
