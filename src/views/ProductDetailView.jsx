import React, { useState, useEffect } from 'react';
import { AddToCartAnimation } from '../components/AddToCartAnimation';
import { useStore } from '../context/StoreContext';
import { checkProductCompatibility } from '../services/cartCheckoutEngine';
import {
  getProductReviewSummary,
  submitProductReview,
  canCustomerReviewProduct,
  getProductQuestionsDB,
  submitProductQuestion,
  subscribeStockNotification,
  subscribePriceAlert,
  submitReviewReport
} from '../services/engagementService';
import {
  Car, ShieldCheck, Truck, RefreshCw, Star, ArrowRight,
  CheckCircle, ShoppingBag, Heart, Wrench, AlertTriangle, MapPin,
  ChevronRight, Share2, Tag, FileText, Check, Lock, MessageSquare,
  HelpCircle, Bell, TrendingDown, Camera, ThumbsUp, Filter, Send, AlertCircle, X, Phone
} from 'lucide-react';

export const ProductDetailView = () => {
  const [flyInfo, setFlyInfo] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [purchaseType, setPurchaseType] = useState('onetime');
  const { products, activeProductId, addToCart, buyNow, navigateTo, showToast, selectedVehicle, setIsVehicleModalOpen, user, isInWishlist, toggleWishlist, toggleCompare, recentlyViewed, addToRecentlyViewed, setIsCartDrawerOpen } = useStore();

  // Fallback Product if none selected
  const storeProduct = (typeof activeProductId === 'object' && activeProductId !== null) 
    ? activeProductId 
    : ((products || []).find(p => String(p.id) === String(activeProductId) || p.sku === activeProductId || p.oemPartNumber === activeProductId));
  
  const rawProduct = storeProduct || {
    id: 'prod-piston-set',
    name: 'Piston Set — Maruti Swift 1.2L Petrol',
    brand: 'Mahle',
    sku: 'AZI-ENG-PS102',
    oemPartNumber: '12111-M74L00',
    price: 4500,
    originalPrice: 6000,
    rating: 4.8,
    reviewsCount: 89,
    inStock: true,
    stockCount: 15,
    images: [
      '/images/piston_set.jpg',
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1632823462573-097561f0e4b7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80'
    ],
    specs: {
      'Fits': 'Maruti Swift 2018-2023, Baleno 2019-2022, Dzire 2018-2023',
      'Engine': '1.2L K12 Petrol',
      'Part Type': 'Piston with Rings',
      'Quantity': 'Set of 4',
      'Warranty': '6 months / 1 year',
      'HSN Code': '84099191',
      'Weight': '1.2 kg',
      'Dimensions': '15 x 15 x 10 cm'
    }
  };

  const product = {
    ...rawProduct,
    id: rawProduct.id || 'AZI-PROD-GENERIC',
    name: rawProduct.name || rawProduct.title || 'AutoZon Genuine Spare Part',
    price: typeof rawProduct.price === 'number' ? rawProduct.price : (parseFloat(rawProduct.price) || 0),
    originalPrice: typeof rawProduct.originalPrice === 'number' ? rawProduct.originalPrice : (parseFloat(rawProduct.originalPrice || rawProduct.mrp) || (rawProduct.price ? rawProduct.price * 1.2 : 0)),
    brand: typeof rawProduct.brand === 'object' ? (rawProduct.brand?.name || 'AutoZon') : (rawProduct.brand || 'AutoZon'),
    specs: {
      'Brand': (typeof rawProduct.brand === 'object' ? rawProduct.brand?.name : rawProduct.brand) || 'OEM Grade',
      'Part Number': rawProduct.oemPartNumber || rawProduct.sku || rawProduct.id || 'AZI-GEN-001',
      'Compatibility': rawProduct.compatibility || rawProduct.fits || 'Universal / Exact Fit',
      'Warranty': rawProduct.warranty || '1 Year Manufacturer Warranty',
      ...(rawProduct.specs || {})
    },
    images: Array.isArray(rawProduct.images) ? rawProduct.images : [rawProduct.image || '/images/piston_set.jpg']
  };

  // Image Gallery Helpers
  const getGalleryImages = () => {
    if (product.product_images && Array.isArray(product.product_images) && product.product_images.length > 0) {
      return product.product_images.map(img => img.image_url || '/images/piston_set.jpg');
    }
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images.map(img => (typeof img === 'string' ? img : img.image_url || img.url || '/images/piston_set.jpg'));
    }
    return [product.image || '/images/piston_set.jpg'];
  };

  const galleryImages = getGalleryImages();
  const [selectedImage, setSelectedImage] = useState(galleryImages[0] || '/images/piston_set.jpg');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');

  useEffect(() => {
    const imgs = getGalleryImages();
    if (imgs && imgs.length > 0) {
      setSelectedImage(imgs[0]);
    }
  }, [product.id, rawProduct.image]);

  // Related Products logic (same category or brand)
  const relatedProducts = (products || [])
    .filter(p => p.id !== product.id && (p.category_id === product.category_id || p.brand_id === product.brand_id))
    .slice(0, 4);

  // Compatibility State
  const [fitmentResult, setFitmentResult] = useState(null);

  // Reviews & Ratings State
  const [reviewSummary, setReviewSummary] = useState({
    reviews: [],
    totalReviews: 0,
    averageRating: 0,
    starCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    verifiedCount: 0,
    photos: []
  });
  const [reviewSort, setReviewSort] = useState('newest');
  const [reviewStarFilter, setReviewStarFilter] = useState('all');
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [reviewEligibility, setReviewEligibility] = useState(null);

  // Review Reporting State
  const [reportingReview, setReportingReview] = useState(null);
  const [reportReason, setReportReason] = useState('Spam');
  const [reportMessage, setReportMessage] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportFeedback, setReportFeedback] = useState(null);

  // Review Form state
  const [revRating, setRevRating] = useState(5);
  const [revTitle, setRevTitle] = useState('');
  const [revText, setRevText] = useState('');
  const [revImages, setRevImages] = useState([]);
  const [revSubmitting, setRevSubmitting] = useState(false);
  const [revFeedback, setRevFeedback] = useState(null);

  // Product Q&A State
  const [questions, setQuestions] = useState([]);
  const [isAskQuestionOpen, setIsAskQuestionOpen] = useState(false);
  const [qName, setQName] = useState(user?.name || '');
  const [qEmail, setQEmail] = useState(user?.email || '');
  const [qText, setQText] = useState('');
  const [qSubmitting, setQSubmitting] = useState(false);
  const [qFeedback, setQFeedback] = useState(null);

  // Stock / Price Alerts State
  const [isStockAlertOpen, setIsStockAlertOpen] = useState(false);
  const [isPriceAlertOpen, setIsPriceAlertOpen] = useState(false);
  const [alertEmail, setAlertEmail] = useState(user?.email || '');
  const [alertPhone, setAlertPhone] = useState('');
  const [alertFeedback, setAlertFeedback] = useState(null);

  // Request a Part State
  const [isRequestPartOpen, setIsRequestPartOpen] = useState(false);
  const [requestPartForm, setRequestPartForm] = useState({ name: '', phone: '', partDetails: '' });
  const [requestPartFeedback, setRequestPartFeedback] = useState(null);

  // Load Review Summary & Questions
  useEffect(() => {
    loadEngagementData();
    addToRecentlyViewed(product);
  }, [product.id, reviewSort, reviewStarFilter]);

  // Check vehicle fitment when vehicle changes
  useEffect(() => {
    if (selectedVehicle && product) {
      const res = checkProductCompatibility(product, selectedVehicle);
      setFitmentResult(res);
    } else {
      setFitmentResult(null);
    }
  }, [product?.id, selectedVehicle]);

  const loadEngagementData = async () => {
    const summary = await getProductReviewSummary(product.id, reviewSort, reviewStarFilter);
    setReviewSummary(summary);

    const qList = await getProductQuestionsDB(product.id);
    setQuestions(qList);
  };

  const handleOpenReportModal = (review) => {
    setReportingReview(review);
    setReportReason('Spam');
    setReportMessage('');
    setReportFeedback(null);
  };

  const handleSubmitReportForm = async (e) => {
    e.preventDefault();
    setReportSubmitting(true);
    setReportFeedback(null);

    const res = await submitReviewReport({
      reviewId: reportingReview.id,
      reporterCustomerId: user?.id || null,
      reason: reportReason,
      message: reportMessage
    });

    if (res.success) {
      setReportFeedback({ type: 'success', text: res.message });
      setTimeout(() => {
        setReportingReview(null);
      }, 1500);
    } else {
      setReportFeedback({ type: 'error', text: res.message });
    }
    setReportSubmitting(false);
  };

  const handleOpenWriteReview = async () => {
    setIsWriteReviewOpen(true);
    setRevFeedback(null);
    const check = await canCustomerReviewProduct(user?.id, product.id, user?.email);
    setReviewEligibility(check);
  };

  const handleSubmitReviewForm = async (e) => {
    e.preventDefault();
    setRevSubmitting(true);
    setRevFeedback(null);

    const res = await submitProductReview({
      productId: product.id,
      customerId: user?.id,
      customerName: user?.name || user?.email?.split('@')[0] || 'Verified Buyer',
      customerEmail: user?.email,
      orderId: reviewEligibility?.orders?.[0]?.id || null,
      rating: revRating,
      title: revTitle,
      reviewText: revText,
      imageFiles: revImages
    });

    if (res.success) {
      setRevFeedback({ type: 'success', text: res.message });
      setTimeout(() => {
        setIsWriteReviewOpen(false);
        loadEngagementData();
      }, 1500);
    } else {
      setRevFeedback({ type: 'error', text: res.message });
    }
    setRevSubmitting(false);
  };

  const handleSubmitQuestionForm = async (e) => {
    e.preventDefault();
    setQSubmitting(true);
    setQFeedback(null);

    const res = await submitProductQuestion({
      productId: product.id,
      customerId: user?.id || null,
      customerName: qName,
      customerEmail: qEmail,
      vehicleId: selectedVehicle?.id || null,
      question: qText
    });

    if (res.success) {
      setQFeedback({ type: 'success', text: res.message });
      setTimeout(() => {
        setIsAskQuestionOpen(false);
        setQText('');
      }, 1500);
    } else {
      setQFeedback({ type: 'error', text: res.message });
    }
    setQSubmitting(false);
  };

  const handleSubscribeStockAlert = async (e) => {
    e.preventDefault();
    setAlertFeedback(null);
    const res = await subscribeStockNotification({
      productId: product.id,
      customerId: user?.id || null,
      email: alertEmail,
      phone: alertPhone
    });
    if (res.success) {
      setAlertFeedback({ type: 'success', text: res.message });
      setTimeout(() => setIsStockAlertOpen(false), 1500);
    } else {
      setAlertFeedback({ type: 'error', text: res.message });
    }
  };

  const handleSubscribePriceAlert = async (e) => {
    e.preventDefault();
    setAlertFeedback(null);
    const res = await subscribePriceAlert({
      productId: product.id,
      customerId: user?.id || null,
      email: alertEmail,
      observedPrice: product.price
    });
    if (res.success) {
      setAlertFeedback({ type: 'success', text: res.message });
      setTimeout(() => setIsPriceAlertOpen(false), 1500);
    } else {
      setAlertFeedback({ type: 'error', text: res.message });
    }
  };

  const handleRequestPartSubmit = (e) => {
    e.preventDefault();
    setRequestPartFeedback({ type: 'success', text: 'Request submitted successfully! Our team will contact you within 24 hours.' });
    setTimeout(() => {
      setIsRequestPartOpen(false);
      setRequestPartFeedback(null);
      setRequestPartForm({ name: '', phone: '', partDetails: '' });
    }, 2000);
  };

  const isLiked = isInWishlist(product.id);
  const isOutOfStock = (product.stockCount ?? product.stock_quantity ?? product.stock ?? 10) <= 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-8 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-[13px] font-bold text-slate-500 overflow-x-auto whitespace-nowrap">
          <span onClick={() => navigateTo('home')} className="hover:text-[#0B5394] cursor-pointer transition-colors">Home</span>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span onClick={() => navigateTo('catalog')} className="hover:text-[#0B5394] cursor-pointer transition-colors">Engine Parts</span>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span onClick={() => navigateTo('catalog')} className="hover:text-[#0B5394] cursor-pointer transition-colors">Piston</span>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="text-slate-800 font-black truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Main Product Section Layout */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-0">
            
            {/* Gallery Column (Left) - Sticky h-fit */}
            <div className="lg:col-span-5 p-4 sm:p-6 lg:sticky lg:top-24 h-fit bg-gradient-to-br from-slate-50 to-slate-100/50 flex flex-col gap-4 border-b lg:border-b-0 lg:border-r border-slate-100">
              <div className="relative w-full aspect-square max-h-[440px] bg-white border border-slate-200/60 rounded-3xl overflow-hidden flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] group mx-auto">
                <img
                  src={selectedImage}
                  alt={product.name}
                  onError={(e) => { e.target.src = '/images/piston_set.jpg'; }}
                  className="max-h-full max-w-full object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Representational Image Red Overlay Banner */}
                <div className="absolute bottom-3 left-3 right-3 bg-red-600/90 backdrop-blur-sm text-white text-center py-1.5 px-3 rounded-xl font-extrabold text-[11px] sm:text-xs tracking-wide shadow-md border border-red-500/30">
                  This image is only for representational purpose only.
                </div>

                {/* Floating Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2.5 z-10">
                  <button
                    onClick={() => {
                      setLightboxIndex(galleryImages.indexOf(selectedImage));
                      setIsLightboxOpen(true);
                    }}
                    className="p-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 hover:scale-110 transition-all group/zoom cursor-pointer"
                    title="Zoom Image"
                  >
                    <Camera className="w-4 h-4 text-slate-400 group-hover/zoom:text-emerald-500" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="p-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 hover:scale-110 transition-all group/heart cursor-pointer"
                    title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-4 h-4 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-slate-400 group-hover/heart:text-red-500'}`} />
                  </button>
                </div>
              </div>

              {/* Thumbnail Row */}
              <div className="flex gap-2.5 overflow-x-auto py-1 scrollbar-thin snap-x snap-mandatory">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`snap-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 overflow-hidden shrink-0 transition-all duration-300 cursor-pointer ${
                      selectedImage === img ? 'border-[#0B5394] ring-2 ring-[#0B5394]/20 shadow-md scale-105' : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-contain p-1.5" />
                  </button>
                ))}
              </div>

              {/* Vehicle Compatibility & Warranty Guarantee Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-2.5 mt-1">
                <div className="flex items-center gap-2 text-xs font-black text-slate-900 border-b border-slate-100 pb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Fitment & Quality Guarantee</span>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 gap-2">
                    <span className="font-bold shrink-0">Compatible Vehicle:</span>
                    <span className="font-extrabold text-slate-900 text-right truncate">
                      {selectedVehicle ? `${selectedVehicle.makeName || selectedVehicle.make || ''} ${selectedVehicle.modelName || selectedVehicle.model || ''}` : (product.specs?.['Fits'] || 'Universal / Exact Fit')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-bold">Quality Grade:</span>
                    <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">100% Genuine OES</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-bold">Warranty:</span>
                    <span className="font-bold text-slate-800">{product.specs?.['Warranty'] || '6 Month Manufacturer Warranty'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Details & Actions Column (Right) */}
            <div className="lg:col-span-7 p-6 lg:p-10 flex flex-col justify-between bg-white">
              <div>
                {/* 1. Product Title */}
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mb-4 leading-tight">
                  {product.name}
                </h1>

                {/* 2. Badges Row (AutoZoneIndia Theme) */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="px-3 py-1 bg-[#073763]/10 text-[#073763] rounded-lg text-xs font-bold border border-[#073763]/20">
                    Brand: <strong className="font-extrabold">{product.brand?.name || product.brand || 'PRASCO'}</strong>
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200">
                    Part No: <strong className="text-slate-900 font-bold">{product.oemPartNumber || product.sku || 'vals'}</strong>
                  </span>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-500/20">
                    Type: <strong className="font-extrabold">{product.classification || product.type || 'OES'}</strong>
                  </span>
                </div>

                {/* 3. Price & View Catalog Row */}
                <div className="flex items-center justify-between gap-4 border-t border-b border-slate-100 py-5 mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-black text-[#D84315] tracking-tight">
                      ₹{Number(product.price).toFixed(2)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-lg text-slate-400 font-bold line-through">
                        ₹{Number(product.originalPrice).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => navigateTo('catalog')}
                    className="px-4 py-2 border-2 border-[#0B5394] text-[#0B5394] hover:bg-[#0B5394] hover:text-white text-xs font-extrabold rounded-xl transition-all shadow-sm whitespace-nowrap"
                  >
                    View Catalog
                  </button>
                </div>

                {/* Size Selector */}
                <div className="mb-6">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">SIZE / VARIANT</span>
                  <div className="inline-flex items-center px-4 py-2 bg-[#0F172A] text-white rounded-full text-xs font-bold shadow-sm">
                    {product.specs?.['Quantity'] || product.specs?.['Size'] || '100ml'}
                  </div>
                </div>

                {/* Purchase Options Radio Box (Integrated with Site Theme) */}
                <div className="mb-6 bg-[#0F172A] border border-slate-800 rounded-3xl p-4 text-white space-y-3 shadow-xl">
                  {/* One-Time Purchase */}
                  <label 
                    onClick={() => setPurchaseType('onetime')}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      purchaseType === 'onetime' 
                        ? 'border-amber-400 bg-slate-800/90 ring-1 ring-amber-400/50' 
                        : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${purchaseType === 'onetime' ? 'border-amber-400 bg-amber-400' : 'border-slate-500'}`}>
                        {purchaseType === 'onetime' && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">One-Time Purchase</div>
                        <div className="text-xs text-slate-400 mt-0.5">Standard direct checkout</div>
                      </div>
                    </div>
                    <span className="font-sans text-lg font-black text-white tracking-tight">
                      ₹{Number(product.price).toLocaleString('en-IN')}
                    </span>
                  </label>

                  {/* Subscribe & Save */}
                  <label 
                    onClick={() => setPurchaseType('subscribe')}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      purchaseType === 'subscribe' 
                        ? 'border-amber-400 bg-slate-800/90 ring-1 ring-amber-400/50' 
                        : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${purchaseType === 'subscribe' ? 'border-amber-400 bg-amber-400' : 'border-slate-500'}`}>
                        {purchaseType === 'subscribe' && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-amber-400">Subscribe & Save 15%</div>
                        <div className="text-xs text-slate-400 mt-0.5">Auto-delivered on your schedule. Cancel anytime.</div>
                      </div>
                    </div>
                    <span className="font-sans text-lg font-black text-amber-400 tracking-tight">
                      ₹{Math.round(product.price * 0.85).toLocaleString('en-IN')}
                    </span>
                  </label>
                </div>

                {/* Quantity Row */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">QUANTITY</span>
                  <div className="flex items-center bg-[#0F172A] border border-slate-800 rounded-full px-4 py-1.5 text-white">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white text-base font-bold">-</button>
                    <span className="w-8 text-center font-black text-sm text-white">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white text-base font-bold">+</button>
                  </div>
                </div>

                {/* Primary Action Buttons (Gold Add to Bag + Heart Wishlist + Solid Black Buy Now) */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const finalPrice = purchaseType === 'subscribe' ? Math.round(product.price * 0.85) : product.price;
                        addToCart({ ...product, price: finalPrice }, quantity);
                        setIsCartDrawerOpen(true);
                        setFlyInfo({ src: galleryImages[0], startRect: rect });
                      }}
                      className="flex-1 py-4 px-6 rounded-full font-extrabold bg-[#C59B4E] hover:bg-[#b58b3e] text-slate-950 shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm tracking-wide"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to Bag
                    </button>

                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`p-4 rounded-full transition-all shrink-0 ${
                        isLiked ? 'bg-red-500 text-white' : 'bg-[#0F172A] text-white hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => {
                      const finalPrice = purchaseType === 'subscribe' ? Math.round(product.price * 0.85) : product.price;
                      buyNow({ ...product, price: finalPrice }, quantity);
                    }}
                    className="w-full py-4 px-6 rounded-full font-black bg-slate-950 hover:bg-black text-white shadow-xl flex items-center justify-center gap-2 transition-all border border-slate-900 active:scale-[0.98] text-sm tracking-wider uppercase"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Secondary Action Links (WISHLIST & SHARE) */}
                <div className="flex items-center justify-center gap-8 pt-2 mb-8">
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`text-xs font-bold flex items-center gap-2 transition-colors uppercase tracking-wider ${
                      isLiked ? 'text-red-500' : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-slate-500'}`} />
                    <span>WISHLIST</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      const text = `Check out ${product.name} (₹${product.price}) on KAMTI AUTOMOTIVE: ${window.location.href}`;
                      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-2 transition-colors uppercase tracking-wider"
                  >
                    <Share2 className="w-4 h-4 text-slate-500" />
                    <span>SHARE</span>
                  </button>
                </div>
              </div>

              {/* 7. Trust Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-6">
                <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3.5 flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-[#0B5394] rounded-xl">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">Fast Delivery</h5>
                    <p className="text-[10px] text-slate-500 font-medium">Pan-India shipping</p>
                  </div>
                </div>

                <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3.5 flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">Quality Assured</h5>
                    <p className="text-[10px] text-slate-500 font-medium">100% genuine parts</p>
                  </div>
                </div>

                <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3.5 flex items-center gap-3">
                  <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">Easy Returns</h5>
                    <p className="text-[10px] text-slate-500 font-medium">Hassle-free policy</p>
                  </div>
                </div>
              </div>

              {/* Seller & Location Information */}
              {product.other_sellers && product.other_sellers.length > 0 ? (
                <div className="mt-6">
                  <h3 className="text-sm font-black text-slate-900 mb-3">Other Sellers on AutoZon</h3>
                  <div className="space-y-3">
                    {product.other_sellers.map((seller) => (
                      <div key={seller.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
                        <div>
                          <h4 className="text-sm font-black text-slate-900">{seller.name}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {seller.rating}
                            </span>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${seller.condition === 'New' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {seller.condition}
                            </span>
                          </div>
                          {seller.condition !== 'New' && (
                            <p className="text-[10px] text-slate-500 mt-1">Limited warranty. Final sale.</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-slate-900 mb-2">₹{Number(seller.price || 0).toLocaleString('en-IN')}</div>
                          <button 
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              addToCart({ ...product, price: seller.price, seller: seller.name }, quantity);
                              setFlyInfo({ src: galleryImages[0], startRect: rect });
                            }}
                            className="text-xs font-black bg-slate-900 text-white px-4 py-1.5 rounded-lg hover:bg-slate-800"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-6 p-4 rounded-2xl bg-white border border-slate-200 flex flex-col gap-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-slate-50 rounded-xl shadow-sm border border-slate-100">
                      <MapPin className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Sold by {product.seller?.name || 'AutoZonIndia Official'}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Ships from {product.seller?.location || 'New Delhi Warehouse'}</p>
                      <div className="flex gap-4 mt-2">
                        <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md">
                          <CheckCircle className="w-3.5 h-3.5" /> AutoZon Assured
                        </p>
                        <p className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {product.seller?.rating || '4.9'} Seller Rating
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Details & Specs Tabs */}
          <div className="border-t border-slate-200">
            <div className="flex border-b border-slate-200">
              <button 
                onClick={() => setActiveTab('specs')}
                className={`flex-1 py-4 text-sm font-black uppercase tracking-wider transition-colors ${activeTab === 'specs' ? 'text-[#0B5394] border-b-2 border-[#0B5394] bg-[#E3F2FD]/30' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                Specifications
              </button>
              <button 
                onClick={() => setActiveTab('desc')}
                className={`flex-1 py-4 text-sm font-black uppercase tracking-wider transition-colors ${activeTab === 'desc' ? 'text-[#0B5394] border-b-2 border-[#0B5394] bg-[#E3F2FD]/30' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                Description
              </button>
            </div>
            
            <div className="p-6 lg:p-10 bg-slate-50/50">
              {activeTab === 'specs' ? (
                <div>
                  <h3 className="font-black text-lg text-slate-900 mb-6">Specifications & Fitment</h3>
                  {product.specs && typeof product.specs === 'object' ? (
                    <div>
                      <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-sm mb-8">
                        <table className="w-full text-left text-sm">
                          <tbody>
                            {Object.entries(product.specs).map(([key, value], idx) => (
                              <tr key={key} className={idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                                <th className="py-4 px-6 font-bold text-slate-500 border-b border-slate-100 w-1/3 align-top">{key.replace(/([A-Z])/g, ' $1').trim()}</th>
                                <td className="py-4 px-6 font-bold text-slate-900 border-b border-slate-100">{String(value)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* What's Included Box */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h4 className="font-black text-sm text-slate-900 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" /> What's Included in the Box
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0" /> 1 × {product.name} Assembly
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0" /> Mounting Clips & Hardware Pack
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0" /> Manufacturer Warranty & QA Certificate
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0" /> Step-by-Step Installation Guide
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 font-medium">No specifications provided for this product.</p>
                  )}
                </div>
              ) : (
                <div className="prose prose-slate max-w-none">
                  <h3 className="font-black text-lg text-slate-900 mb-4">Product Description</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    {product.description || `Premium quality ${product.name} manufactured by ${product.brand || 'our trusted partners'}. Engineered to meet or exceed OEM specifications for exact fit, perfect form, and reliable function. Ideal for direct replacement.`}
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2 text-slate-600 font-medium"><CheckCircle className="w-4 h-4 text-emerald-500" /> Premium quality materials</li>
                    <li className="flex items-center gap-2 text-slate-600 font-medium"><CheckCircle className="w-4 h-4 text-emerald-500" /> Direct-fit replacement</li>
                    <li className="flex items-center gap-2 text-slate-600 font-medium"><CheckCircle className="w-4 h-4 text-emerald-500" /> Rigorously tested for performance</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =============================================================
            SECTION: QUESTIONS & ANSWERS (Q&A)
        ============================================================= */}
        <div className="mt-16 bg-white border border-slate-200/80 rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center space-x-3 mb-1">
                <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <span>Questions & Answers</span>
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Ask our technical experts about fitment, part numbers, or specifications
              </p>
            </div>

            <button
              onClick={() => setIsAskQuestionOpen(true)}
              className="mt-4 sm:mt-0 px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl flex items-center space-x-2 shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Ask About This Product</span>
            </button>
          </div>

          {questions.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              <p className="text-slate-500 font-medium">No questions answered yet. Be the first to ask about this product!</p>
            </div>
          ) : (
            <div className="space-y-5">
              {questions.map((q) => (
                <div key={q.id} className="bg-slate-50/80 border border-slate-100 p-6 rounded-2xl transition-all hover:bg-slate-50">
                  <div className="font-black text-slate-900 mb-1">Q: {q.question}</div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Asked by {q.customer_name}</div>

                  {q.answer && (
                    <div className="bg-white border border-slate-200 p-4 rounded-xl text-sm text-slate-700 font-medium shadow-sm flex items-start gap-3 mt-4">
                      <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-black text-slate-900 block mb-0.5">AutoZon Expert</span>
                        {q.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* =============================================================
            SECTION: RATINGS & REVIEWS
        ============================================================= */}
        <div className="mt-12 bg-white border border-slate-200/80 rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-100 mb-10">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center space-x-3 mb-1">
                <div className="bg-amber-50 p-2 rounded-xl text-amber-500">
                  <Star className="w-6 h-6 fill-amber-500" />
                </div>
                <span>Ratings & Verified Reviews</span>
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Authentic reviews from verified AutoZoneIndia customers
              </p>
            </div>

            <button
              onClick={handleOpenWriteReview}
              className="mt-5 md:mt-0 px-6 py-3 bg-[#0B5394] hover:bg-[#073763] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#0B5394]/30 transition-all active:scale-95"
            >
              Write a Review
            </button>
          </div>

          {/* Review Summary Breakdown Histogram */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12 pb-10 border-b border-slate-100">
            <div className="md:col-span-4 text-center md:text-left flex flex-col justify-center bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="text-6xl font-black text-slate-900 mb-3 tracking-tighter">
                {reviewSummary.averageRating || '0.0'}
              </div>
              <div className="flex justify-center md:justify-start text-amber-400 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-6 h-6 ${
                      s <= Math.round(reviewSummary.averageRating || 0)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200 fill-slate-100'
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Based on {reviewSummary.totalReviews} approved reviews
              </div>
            </div>

            {/* Histogram Bars */}
            <div className="md:col-span-8 space-y-3 pl-0 md:pl-6">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviewSummary.starCounts[star] || 0;
                const pct = reviewSummary.totalReviews > 0 ? (count / reviewSummary.totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center space-x-4 text-sm font-bold">
                    <span className="w-16 text-slate-500">{star} Stars</span>
                    <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                        style={{ width: `${pct}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 w-full h-full"></div>
                      </div>
                    </div>
                    <span className="w-10 text-right text-slate-400">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer Photos Gallery */}
          {reviewSummary.photos && reviewSummary.photos.length > 0 && (
            <div className="mb-12">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-4">
                Customer Photos ({reviewSummary.photos.length})
              </h3>
              <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                {reviewSummary.photos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo.url}
                    alt="Customer review photo"
                    className="w-28 h-28 object-cover rounded-2xl border border-slate-200 shadow-sm shrink-0 hover:scale-105 transition-transform cursor-pointer"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Review List & Filters Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 mr-2">Filter By:</span>
              {['all', '5', '4', '3', '2', '1', 'verified'].map((flt) => (
                <button
                  key={flt}
                  onClick={() => setReviewStarFilter(flt)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    reviewStarFilter === flt
                      ? 'bg-slate-900 text-white shadow-slate-900/20'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {flt === 'all' ? 'All Reviews' : flt === 'verified' ? '✓ Verified Only' : `${flt} ★`}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Sort:</span>
              <select
                value={reviewSort}
                onChange={(e) => setReviewSort(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="newest">Most Recent</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="verified">Verified Purchases</option>
              </select>
            </div>
          </div>

          {reviewSummary.reviews.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
              <p className="text-slate-500 font-bold">No approved customer reviews match the selected filter.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviewSummary.reviews.map((rev) => (
                <div key={rev.id} className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${
                              s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-100'
                            }`}
                          />
                        ))}
                      </div>
                      <h4 className="font-bold text-slate-900">{rev.title}</h4>
                    </div>

                    {rev.verified_purchase && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shadow-sm flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Verified Purchase
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-600 mb-4 leading-relaxed font-medium">
                    "{rev.review_text || rev.comment}"
                  </p>

                  {rev.images && rev.images.length > 0 && (
                    <div className="flex space-x-3 mb-4">
                      {rev.images.map((img, idx) => (
                        <a key={idx} href={img} target="_blank" rel="noreferrer">
                          <img
                            src={img}
                            alt="Customer photo"
                            className="w-16 h-16 object-cover rounded-xl border border-slate-200 hover:opacity-80 hover:shadow-md transition-all"
                          />
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-slate-400 font-medium flex justify-between items-center pt-4 border-t border-slate-100">
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold uppercase text-[10px]">
                        {(rev.customer_name || 'V')[0]}
                      </span>
                      By <strong className="text-slate-700">{rev.customer_name || 'Verified Customer'}</strong> • {new Date(rev.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <button
                      onClick={() => handleOpenReportModal(rev)}
                      className="text-xs text-slate-400 hover:text-rose-600 font-bold flex items-center space-x-1 px-2 py-1 rounded hover:bg-rose-50 transition-colors"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Report</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

        {/* Frequently Bought Together Bundle */}
        {relatedProducts.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-lg sm:text-xl font-black mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-400" />
                Frequently Bought Together
              </h2>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3 overflow-x-auto pb-2 w-full md:w-auto">
                  <div className="bg-white/10 p-3 rounded-2xl border border-white/10 shrink-0 text-center w-36">
                    <img src={selectedImage} alt={product.name} className="w-20 h-20 object-contain mx-auto mb-2" />
                    <div className="text-[11px] font-bold truncate">{product.name}</div>
                    <div className="text-xs font-black text-amber-400">₹{product.price}</div>
                  </div>
                  <span className="text-2xl font-black text-amber-400">+</span>
                  <div className="bg-white/10 p-3 rounded-2xl border border-white/10 shrink-0 text-center w-36">
                    <img src={relatedProducts[0].image || relatedProducts[0].images?.[0] || '/images/piston_set.jpg'} alt={relatedProducts[0].name} className="w-20 h-20 object-contain mx-auto mb-2" />
                    <div className="text-[11px] font-bold truncate">{relatedProducts[0].name}</div>
                    <div className="text-xs font-black text-amber-400">₹{relatedProducts[0].price}</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto text-center md:text-right">
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold">Total Bundle Price</div>
                    <div className="text-2xl font-black text-amber-400">₹{Number(product.price + relatedProducts[0].price).toLocaleString('en-IN')}</div>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(product, 1, false);
                      addToCart(relatedProducts[0], 1, false);
                      showToast('Bundle added to Cart! 🛒');
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 bg-amber-400 text-slate-900 font-black rounded-xl hover:bg-amber-300 transition-all shadow-lg active:scale-95"
                  >
                    Add Both to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#0B5394]" />
              Related Parts & Accessories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(rp => (
                <div key={rp.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer group" onClick={() => navigateTo('product-detail', rp.id)}>
                  <div className="aspect-square bg-slate-50 p-4 flex items-center justify-center relative overflow-hidden">
                    <img src={rp.image || rp.images?.[0] || '/images/piston_set.jpg'} alt={rp.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-800 text-sm line-clamp-2 mb-2 group-hover:text-[#0B5394] transition-colors">{rp.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900">₹{rp.price}</span>
                      {rp.originalPrice && <span className="text-xs text-slate-400 line-through">₹{rp.originalPrice}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Section */}
        {recentlyViewed && Array.isArray(recentlyViewed) && recentlyViewed.length > 1 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-500" />
              Recently Viewed
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
              {recentlyViewed.filter(p => p && p.id !== product.id).slice(0, 5).map(rv => (
                <div key={rv.id} className="min-w-[180px] max-w-[180px] bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer group snap-start" onClick={() => navigateTo('product-detail', rv.id)}>
                  <div className="aspect-square bg-slate-50 p-3 flex items-center justify-center">
                    <img src={rv.image || rv.images?.[0] || '/images/piston_set.jpg'} alt={rv.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-slate-800 text-xs line-clamp-2 mb-1 group-hover:text-[#0B5394] transition-colors">{rv.name}</h3>
                    <span className="font-black text-slate-900 text-sm">₹{rv.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Report Review Modal */}
      {reportingReview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setReportingReview(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-1">Report Review</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Flagging review: "{reportingReview.title}"
            </p>

            {reportFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-medium mb-4 ${
                  reportFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                }`}
              >
                {reportFeedback.text}
              </div>
            )}

            <form onSubmit={handleSubmitReportForm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Reason for Report</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm font-semibold"
                >
                  <option value="Spam">Spam or Advertising</option>
                  <option value="Offensive">Offensive or Profane Language</option>
                  <option value="Irrelevant">Irrelevant to Product</option>
                  <option value="Incorrect information">Incorrect Information</option>
                  <option value="Other">Other Reason</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Details (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Provide additional details..."
                  value={reportMessage}
                  onChange={(e) => setReportMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl text-sm bg-background"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setReportingReview(null)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl border border-border hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reportSubmitting}
                  className="px-5 py-2 text-sm font-semibold rounded-xl bg-rose-600 text-white hover:bg-rose-700"
                >
                  {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =============================================================
          MODALS: REVIEW / QUESTION / STOCK / PRICE
      ============================================================= */}
      {/* 1. Write Review Modal */}
      {isWriteReviewOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setIsWriteReviewOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-1">Write a Review</h2>
            <p className="text-xs text-muted-foreground mb-4">{product.name}</p>

            {reviewEligibility && !reviewEligibility.eligible ? (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-xs font-medium mb-4">
                <AlertCircle className="w-4 h-4 inline mr-1 text-amber-600" />
                {reviewEligibility.message}
              </div>
            ) : (
              <form onSubmit={handleSubmitReviewForm} className="space-y-4">
                {revFeedback && (
                  <div
                    className={`p-3 rounded-xl text-xs font-medium ${
                      revFeedback.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {revFeedback.text}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button type="button" key={s} onClick={() => setRevRating(s)}>
                        <Star
                          className={`w-7 h-7 ${s <= revRating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Review Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Perfect fitment for my car!"
                    value={revTitle}
                    onChange={(e) => setRevTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-xl text-sm bg-background"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Review Text</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe product performance, build quality, and fitment..."
                    value={revText}
                    onChange={(e) => setRevText(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-xl text-sm bg-background"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Photo Upload (Optional)</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setRevImages(Array.from(e.target.files))}
                    className="text-xs text-muted-foreground"
                  />
                </div>

                <button
                  type="submit"
                  disabled={revSubmitting}
                  className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm shadow-md"
                >
                  {revSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. Ask Question Modal */}
      {isAskQuestionOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setIsAskQuestionOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-1">Ask About This Product</h2>
            <p className="text-xs text-muted-foreground mb-4">{product.name}</p>

            {qFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-medium mb-4 ${
                  qFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                }`}
              >
                {qFeedback.text}
              </div>
            )}

            <form onSubmit={handleSubmitQuestionForm} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Rahul Sharma"
                  value={qName}
                  onChange={(e) => setQName(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl text-sm bg-background"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  placeholder="rahul@gmail.com"
                  value={qEmail}
                  onChange={(e) => setQEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl text-sm bg-background"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Question</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Ask about compatibility, dimensions, or specifications..."
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl text-sm bg-background"
                />
              </div>

              <button
                type="submit"
                disabled={qSubmitting}
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm shadow-md"
              >
                {qSubmitting ? 'Sending Question...' : 'Submit Question'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Stock Alert Modal */}
      {isStockAlertOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setIsStockAlertOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-1">Notify Me When Available</h2>
            <p className="text-xs text-muted-foreground mb-4">We will notify you immediately when stock arrives.</p>

            {alertFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-medium mb-4 ${
                  alertFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                }`}
              >
                {alertFeedback.text}
              </div>
            )}

            <form onSubmit={handleSubscribeStockAlert} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="customer@example.com"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl text-sm bg-background"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={alertPhone}
                  onChange={(e) => setAlertPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl text-sm bg-background"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm shadow-md"
              >
                Set Back-in-Stock Alert
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Price Alert Modal */}
      {isPriceAlertOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setIsPriceAlertOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-1">Price Drop Notification</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Current price: ₹{Number(product.price).toLocaleString('en-IN')}
            </p>

            {alertFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-medium mb-4 ${
                  alertFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                }`}
              >
                {alertFeedback.text}
              </div>
            )}

            <form onSubmit={handleSubscribePriceAlert} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="customer@example.com"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl text-sm bg-background"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm shadow-md"
              >
                Track Price Drops
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Mobile Sticky Action & Instant WhatsApp Order Bar */}
      <div className="fixed bottom-[64px] left-0 right-0 p-2.5 bg-slate-950/95 border-t border-slate-800 backdrop-blur-md z-40 md:hidden flex items-center justify-between gap-2 shadow-[0_-8px_25px_rgba(0,0,0,0.4)] pb-safe">
        
        {/* Price & Stock Display */}
        <div className="shrink-0 pl-1">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mera Price</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-orange-400">₹{Number(product.price).toLocaleString('en-IN')}</span>
            {product.originalPrice > product.price && (
              <span className="text-[11px] line-through text-slate-500">₹{Number(product.originalPrice).toLocaleString('en-IN')}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {!isOutOfStock ? (
            <>
              {/* Add to Cart */}
              <button
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  addToCart(product, quantity);
                  setFlyInfo({ src: galleryImages[0], startRect: rect });
                  showToast('🛒 Added to Cart!');
                }}
                className="py-2.5 px-3 rounded-xl font-bold bg-slate-900 border border-slate-700 text-white text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
                <span>+ Cart</span>
              </button>

              {/* Instant WhatsApp Order */}
              <a
                href={`https://wa.me/918591719499?text=${encodeURIComponent(
                  `Hi Kamti Automotive, I want to order this spare part:\n\n📦 Product: ${product.name}\n🏷️ SKU / OEM: ${product.oemPartNumber || product.sku || 'KAMTI-AUTO'}\n💰 Selling Price: ₹${product.price}\n🚘 Car Vehicle Fitment: ${selectedVehicle ? `${selectedVehicle.brand || ''} ${selectedVehicle.model || ''}` : product.specs?.['Fits'] || 'Universal Fit'}\n\nPlease confirm availability and delivery time.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3.5 rounded-xl font-black bg-emerald-600 hover:bg-emerald-500 text-white text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95 transition"
              >
                <Phone className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp Order</span>
              </a>
            </>
          ) : (
            <button
              onClick={() => setIsStockAlertOpen(true)}
              className="py-2.5 px-4 rounded-xl font-black bg-slate-900 border border-amber-500/40 text-amber-400 text-xs flex items-center justify-center gap-1.5 shadow-md"
            >
              <Bell className="w-3.5 h-3.5" /> Notify Stock
            </button>
          )}
        </div>
      </div>

      {/* Request Part Modal */}
      {isRequestPartOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsRequestPartOpen(false)}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-500" />
                Request a Part
              </h3>
              <button onClick={() => setIsRequestPartOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <p className="text-slate-600 text-sm font-medium mb-6">Can't find the exact part you need? Let our sourcing team find it for you.</p>
              
              {requestPartFeedback && (
                <div className={`p-4 rounded-xl text-sm font-bold mb-6 flex items-start gap-2 ${requestPartFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                  {requestPartFeedback.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
                  {requestPartFeedback.text}
                </div>
              )}

              <form onSubmit={handleRequestPartSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                  <input required type="text" value={requestPartForm.name} onChange={e => setRequestPartForm({...requestPartForm, name: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500" placeholder="e.g. Rahul Sharma" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input required type="tel" value={requestPartForm.phone} onChange={e => setRequestPartForm({...requestPartForm, phone: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500" placeholder="+91 9876543210" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Part Details / OEM Number</label>
                  <textarea required value={requestPartForm.partDetails} onChange={e => setRequestPartForm({...requestPartForm, partDetails: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 min-h-[100px]" placeholder="e.g. Need an Alternator for 2018 Hyundai Creta 1.6 Diesel. OEM part number: 37300-2B010..."></textarea>
                </div>
                
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-colors shadow-md mt-2">
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Lightbox Zoom Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-amber-400 p-3 bg-white/10 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => setLightboxIndex((lightboxIndex - 1 + galleryImages.length) % galleryImages.length)}
            className="absolute left-6 text-white hover:text-amber-400 p-4 bg-white/10 rounded-full transition-all"
          >
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>

          <div className="max-w-4xl max-h-[80vh] flex items-center justify-center">
            <img 
              src={galleryImages[lightboxIndex]} 
              alt="Zoomed product view" 
              className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />
          </div>

          <button 
            onClick={() => setLightboxIndex((lightboxIndex + 1) % galleryImages.length)}
            className="absolute right-6 text-white hover:text-amber-400 p-4 bg-white/10 rounded-full transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <div className="absolute bottom-6 text-white/80 font-bold text-sm bg-black/40 px-4 py-1.5 rounded-full border border-white/10">
            {lightboxIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
      {/* End of Product Detail View */}
    </div>
  );
};
