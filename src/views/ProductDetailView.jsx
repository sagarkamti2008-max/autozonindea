import React, { useState, useEffect } from 'react';
import { AddToCartAnimation } from '../components/AddToCartAnimation';
import { useStore } from '../context/StoreContext';
import { checkProductCompatibility } from '../services/compatibilityService';
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
  const { products, activeProductId, addToCart, navigateTo, showToast, selectedVehicle, user, isInWishlist, toggleWishlist, toggleCompare, recentlyViewed, addToRecentlyViewed } = useStore();

  // Fallback Product if none selected
  const product = (products || []).find(p => p.id === activeProductId) || {
    id: 'prod-ceramic-brake-pads',
    name: 'Ceramic High-Performance Front Brake Pad Kit',
    brand: 'BOSCH OEM ORIGINAL',
    sku: 'AZI-BRK-994201',
    oemPartNumber: '04465-0K280 / 04465-0K360',
    price: 3450,
    originalPrice: 4200,
    rating: 4.9,
    reviewsCount: 142,
    inStock: true,
    stockCount: 24,
    images: [
      'https://images.unsplash.com/photo-1600792580403-0550a1030699?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1632823462573-097561f0e4b7?auto=format&fit=crop&w=800&q=80', // Angle shot
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80' // Installation shot
    ],
    specs: {
      material: 'Low-Metallic High Carbon Ceramic Compound',
      weight: '1.85 kg',
      axlePosition: 'Front Axle (Left & Right)',
      operatingTemp: '0°C to 650°C (Fade Resistant)',
      warranty: '1 Year / 20,000 KM Warranty'
    }
  };

  // Image Gallery Helpers
  const getGalleryImages = () => {
    if (product.product_images && Array.isArray(product.product_images) && product.product_images.length > 0) {
      return product.product_images.map(img => img.image_url);
    }
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images.map(img => (typeof img === 'string' ? img : img.image_url || img.url));
    }
    return [product.image || 'https://via.placeholder.com/400x300?text=AutoZon+Spare+Part'];
  };

  const galleryImages = getGalleryImages();
  const [selectedImage, setSelectedImage] = useState(galleryImages[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');

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
    if (selectedVehicle) {
      checkProductCompatibility(product.id, selectedVehicle.id).then(res => {
        setFitmentResult(res);
      });
    } else {
      setFitmentResult(null);
    }
  }, [product.id, selectedVehicle]);

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
          <span onClick={() => navigateTo('home')} className="hover:text-orange-500 cursor-pointer transition-colors">Home</span>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span onClick={() => navigateTo('catalog')} className="hover:text-orange-500 cursor-pointer transition-colors">Catalog</span>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="text-slate-800 font-black truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Main Product Section Layout */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Gallery Column (Left) */}
            <div className="lg:col-span-5 p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-slate-100 bg-gradient-to-br from-slate-50 to-slate-100/50">
              <div className="relative aspect-square bg-white border border-slate-200/60 rounded-3xl overflow-hidden flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] group">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {product.originalPrice && (
                  <div className="absolute top-5 left-5 bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-xs uppercase tracking-wider py-1.5 px-3 rounded-xl shadow-lg shadow-red-500/30 border border-red-400/20">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </div>
                )}
                {/* Floating Action Buttons */}
                <div className="absolute top-5 right-5 flex flex-col gap-3 z-10">
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="p-3.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 hover:scale-110 transition-all group/heart"
                    title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-slate-400 group-hover/heart:text-red-500'}`} />
                  </button>
                  <button
                    onClick={() => toggleCompare(product)}
                    className="p-3.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 hover:scale-110 transition-all group/compare"
                    title="Compare Product"
                  >
                    <RefreshCw className="w-5 h-5 text-slate-400 group-hover/compare:text-indigo-500" />
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      showToast('Link copied to clipboard! 📋');
                    }}
                    className="p-3.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 hover:scale-110 transition-all group/share"
                    title="Share Product"
                  >
                    <Share2 className="w-5 h-5 text-slate-400 group-hover/share:text-blue-500" />
                  </button>
                </div>
              </div>

              {/* Thumbnail Row */}
              <div className="flex gap-4 overflow-x-auto py-5 mt-2 scrollbar-hide snap-x snap-mandatory">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`snap-center w-24 h-24 rounded-2xl bg-white border-2 overflow-hidden shrink-0 transition-all duration-300 ${
                      selectedImage === img ? 'border-orange-500 shadow-lg shadow-orange-500/20 scale-105' : 'border-slate-100 hover:border-orange-300 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-contain p-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Details & Actions Column (Right) */}
            <div className="lg:col-span-7 p-6 lg:p-10 flex flex-col bg-white">
              
              {/* Brand, Classification & Title */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <div className="inline-block bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-3 rounded-lg shadow-sm">
                    {product.brand?.name || product.brand || 'AutoZon'}
                  </div>
                  {product.classification && (
                    <div className="inline-block bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-3 rounded-lg shadow-sm flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> {product.classification}
                    </div>
                  )}
                  {product.condition && (
                    <div className={`inline-block text-[10px] font-black uppercase tracking-widest py-1.5 px-3 rounded-lg shadow-sm ${product.condition === 'New' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                      {product.condition}
                    </div>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-[1.15] mb-4">
                  {product.name}
                </h1>
                
                {/* Ratings & Social Proof */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-orange-50 px-3.5 py-2 rounded-xl border border-amber-200/60 shadow-sm">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span className="font-black text-amber-700">{reviewSummary.averageRating || product.rating || '4.9'}</span>
                    <span className="text-amber-600/70 font-semibold text-xs">({reviewSummary.totalReviews || product.reviewsCount || 0} reviews)</span>
                  </div>
                  {product.sku && (
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">SKU: {product.sku}</span>
                  )}
                </div>
              </div>

              {/* Transparent Pricing Banner */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200/80 rounded-3xl p-6 mb-8 flex flex-col gap-4 shadow-sm relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"></div>
                
                <div className="relative z-10 flex flex-wrap items-start justify-between gap-4 border-b border-slate-200/60 pb-4">
                  <div>
                    <div className="flex items-end gap-3 mb-1">
                      <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">₹{Number(product.price).toLocaleString('en-IN')}</span>
                      {product.originalPrice && (
                        <span className="text-xl text-slate-400 font-bold line-through mb-1.5">
                          ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-200/50 px-2 py-1 rounded">Inclusive of all taxes (18% GST)</span>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    {isOutOfStock ? (
                      <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-xl border border-red-200 shadow-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-wider">Out of Stock</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-200 shadow-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-800">In Stock & Ready to Ship</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="relative z-10 flex items-center gap-6 text-sm font-bold text-slate-600">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-400">MRP</span>
                    <span>₹{Number(product.originalPrice || product.price).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-slate-300">-</div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-400">Discount</span>
                    <span className="text-emerald-600">- ₹{Number((product.originalPrice || product.price) - product.price).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-slate-300">=</div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-400">Selling Price</span>
                    <span className="text-slate-900">₹{Number(product.price).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Fitment & Delivery Verification Box */}
              <div className="bg-white border-2 border-slate-100 rounded-3xl p-5 mb-8 shadow-sm">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Verification & Delivery
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Vehicle Fitment Box */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black uppercase text-slate-500 mb-2 flex items-center gap-1.5"><Car className="w-3.5 h-3.5"/> Vehicle Fitment</div>
                    {selectedVehicle ? (
                      fitmentResult?.isCompatible ? (
                        <div>
                          <div className="font-black text-emerald-700 text-sm flex items-center gap-1.5 mb-1"><CheckCircle className="w-4 h-4" /> 100% Guaranteed Fit</div>
                          <div className="text-slate-600 text-[11px] font-medium leading-tight">For {selectedVehicle.make} {selectedVehicle.model} {selectedVehicle.variant} ({selectedVehicle.year})</div>
                        </div>
                      ) : (
                        <div className="bg-red-50 border border-red-200 p-2 rounded-xl">
                          <div className="font-black text-red-600 text-sm flex items-center gap-1.5 mb-1"><AlertTriangle className="w-4 h-4" /> Does NOT Fit</div>
                          <div className="text-red-500 text-[11px] font-bold leading-tight">This part does not fit your {selectedVehicle.make} {selectedVehicle.model}.</div>
                        </div>
                      )
                    ) : (
                      <div>
                        <div className="font-black text-slate-700 text-sm mb-2">Check Your Vehicle</div>
                        <button className="w-full text-xs font-black bg-white border-2 border-slate-200 text-slate-900 py-2 rounded-xl hover:border-orange-500 transition-colors">
                          Select Vehicle
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Pincode Delivery Box */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black uppercase text-slate-500 mb-2 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> Check Delivery</div>
                    <div className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        placeholder="Enter Pincode" 
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                        maxLength="6"
                      />
                      <button className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors">
                        Check
                      </button>
                    </div>
                    <div className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" /> Fast delivery in 2-4 days
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Action Buttons */}
              <div className="mt-auto">
                {!isOutOfStock ? (
                  <>
                    <div className="flex items-center gap-4 mb-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center bg-slate-100 rounded-xl border border-slate-200 p-1 shrink-0">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center font-black text-slate-600 hover:text-orange-500 transition-colors">-</button>
                        <span className="w-10 text-center font-black text-slate-900">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center font-black text-slate-600 hover:text-orange-500 transition-colors">+</button>
                      </div>

                      <button
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          addToCart(product, quantity);
                          setFlyInfo({ src: galleryImages[0], startRect: rect });
                        }}
                        className="flex-1 py-4 rounded-xl font-black bg-slate-900 text-white hover:bg-slate-800 shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        Add to Cart
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <button
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          addToCart(product, quantity);
                          navigateTo('cart');
                          setFlyInfo({ src: galleryImages[0], startRect: rect });
                        }}
                        className="py-3 rounded-xl font-bold bg-orange-500 text-white hover:bg-orange-600 shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        Buy Now
                      </button>
                      <button
                        onClick={() => setIsRequestPartOpen(true)}
                        className="py-3 rounded-xl font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        <AlertCircle className="w-4 h-4" />
                        Request Part
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 mb-6">
                    <button
                      onClick={() => setIsStockAlertOpen(true)}
                      className="w-full py-4 rounded-xl font-black bg-slate-900 text-white hover:bg-slate-800 shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <Bell className="w-5 h-5 text-orange-500" />
                      Notify Me When Available
                    </button>
                    <button
                      onClick={() => setIsRequestPartOpen(true)}
                      className="w-full py-3 rounded-xl font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 flex items-center justify-center gap-2 transition-all"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Can't find it? Request Part
                    </button>
                  </div>
                )}

                {/* Trust & Warranty Policy */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 border-t border-slate-100 pt-6">
                  <div className="flex flex-col items-center justify-center text-center gap-1.5 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase text-slate-600 leading-tight">100% Genuine <br/> OEM/OES</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center gap-1.5 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <Truck className="w-5 h-5 text-blue-500" />
                    <span className="text-[10px] font-black uppercase text-slate-600 leading-tight">Fast <br/> Delivery</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center gap-1.5 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <RefreshCw className="w-5 h-5 text-orange-500" />
                    <span className="text-[10px] font-black uppercase text-slate-600 leading-tight">Easy <br/> Returns</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center gap-1.5 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase text-slate-600 leading-tight">{product.specs?.warranty || '1 Year'} <br/> Warranty</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center gap-1.5 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <Lock className="w-5 h-5 text-purple-500" />
                    <span className="text-[10px] font-black uppercase text-slate-600 leading-tight">100% Secure <br/> Payment</span>
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
                            <div className="text-sm font-black text-slate-900 mb-2">₹{seller.price.toLocaleString('en-IN')}</div>
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
          </div>
          
          {/* Details & Specs Tabs */}
          <div className="border-t border-slate-200">
            <div className="flex border-b border-slate-200">
              <button 
                onClick={() => setActiveTab('specs')}
                className={`flex-1 py-4 text-sm font-black uppercase tracking-wider transition-colors ${activeTab === 'specs' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50/30' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                Specifications
              </button>
              <button 
                onClick={() => setActiveTab('desc')}
                className={`flex-1 py-4 text-sm font-black uppercase tracking-wider transition-colors ${activeTab === 'desc' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50/30' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                Description
              </button>
            </div>
            
            <div className="p-6 lg:p-10 bg-slate-50/50">
              {activeTab === 'specs' ? (
                <div>
                  <h3 className="font-black text-lg text-slate-900 mb-6">Technical Specifications</h3>
                  {product.specs ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                      {Object.entries(product.specs).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-3 border-b border-slate-200 last:border-0">
                          <span className="font-bold text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="font-bold text-slate-900 text-right">{value}</span>
                        </div>
                      ))}
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
              className="mt-5 md:mt-0 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all active:scale-95"
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

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <Tag className="w-5 h-5 text-orange-500" />
              Related Parts & Accessories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(rp => (
                <div key={rp.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer group" onClick={() => navigateTo('product', rp.id)}>
                  <div className="aspect-square bg-slate-50 p-4 flex items-center justify-center relative overflow-hidden">
                    <img src={rp.image || rp.images?.[0] || 'https://via.placeholder.com/300?text=Part'} alt={rp.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-800 text-sm line-clamp-2 mb-2 group-hover:text-orange-500 transition-colors">{rp.name}</h3>
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
        {recentlyViewed && recentlyViewed.length > 1 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-500" />
              Recently Viewed
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
              {recentlyViewed.filter(p => p.id !== product.id).slice(0, 5).map(rv => (
                <div key={rv.id} className="min-w-[180px] max-w-[180px] bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer group snap-start" onClick={() => navigateTo('product', rv.id)}>
                  <div className="aspect-square bg-slate-50 p-3 flex items-center justify-center">
                    <img src={rv.image || rv.images?.[0] || 'https://via.placeholder.com/300?text=Part'} alt={rv.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-slate-800 text-xs line-clamp-2 mb-1 group-hover:text-orange-500 transition-colors">{rv.name}</h3>
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
      {/* Mobile Sticky Add to Cart Bar */}
      <div className="fixed bottom-[70px] left-0 right-0 p-3 bg-white border-t border-slate-200 z-[999] md:hidden flex gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] pb-safe">
        {!isOutOfStock ? (
          <>
            <button
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                addToCart(product, quantity);
                setFlyInfo({ src: galleryImages[0], startRect: rect });
              }}
              className="flex-1 py-3 rounded-xl font-black bg-slate-900 text-white shadow-md flex items-center justify-center gap-2 text-sm"
            >
              <ShoppingBag className="w-4 h-4" /> Add
            </button>
            <button
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                addToCart(product, quantity);
                navigateTo('cart');
                setFlyInfo({ src: galleryImages[0], startRect: rect });
              }}
              className="flex-1 py-3 rounded-xl font-black bg-orange-500 text-white shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 text-sm"
            >
              Buy Now
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsStockAlertOpen(true)}
            className="w-full py-3 rounded-xl font-black bg-slate-900 text-white shadow-md flex items-center justify-center gap-2 text-sm"
          >
            <Bell className="w-4 h-4 text-orange-500" /> Notify Me
          </button>
        )}
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
      
      <ToastContainer />
    </div>
  );
};
