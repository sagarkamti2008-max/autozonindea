import React, { useState, useEffect, useMemo } from 'react';
import { AddToCartAnimation } from '../components/AddToCartAnimation';
import { useStore } from '../context/StoreContext';
import { checkProductCompatibility } from '../services/fitmentEngine';
import PincodeDeliveryChecker from '../components/PincodeDeliveryChecker';
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
  HelpCircle, Bell, TrendingDown, Camera, ThumbsUp, Filter, Send, AlertCircle, X, Phone, Copy, Info, Eye
} from 'lucide-react';

const RATING_LABELS = {
  5: '5.0 - Excellent! 🌟 Perfect fitment & quality',
  4: '4.0 - Very Good! 👍 Satisfied with purchase',
  3: '3.0 - Average 😐 Decent product for price',
  2: '2.0 - Below Average 👎 Needs improvement',
  1: '1.0 - Poor Quality 😡 Dissatisfied with part'
};

export const ProductDetailView = () => {
  const [flyInfo, setFlyInfo] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [copiedOem, setCopiedOem] = useState(false);
  const [isFullCompatDrawerOpen, setIsFullCompatDrawerOpen] = useState(false);
  const [isCrossRefModalOpen, setIsCrossRefModalOpen] = useState(false);
  const [showIncompatModal, setShowIncompatModal] = useState(false);

  const {
    products,
    activeProductId,
    addToCart,
    buyNow,
    navigateTo,
    showToast,
    selectedVehicle,
    setIsVehicleModalOpen,
    user,
    isInWishlist,
    toggleWishlist,
    toggleCompare,
    recentlyViewed,
    addToRecentlyViewed,
    setIsCartDrawerOpen
  } = useStore();

  // Find active product
  const storeProduct = (typeof activeProductId === 'object' && activeProductId !== null) 
    ? activeProductId 
    : ((products || []).find(p => String(p.id) === String(activeProductId) || p.sku === activeProductId || p.oemPartNumber === activeProductId));
  
  const rawProduct = storeProduct || {
    id: 'prod-001',
    name: 'Toyota Camry Genuine Engine Oil Filter',
    title: 'Toyota Camry Genuine Engine Oil Filter',
    brand: 'Toyota',
    sku: 'KA-TOY-CAM-001',
    oemPartNumber: '90915-YZZN2',
    mpn: '90915-YZZN2',
    price: 599,
    originalPrice: 800,
    mrp: 800,
    rating: 4.8,
    reviewsCount: 142,
    stock: 12,
    inStock: true,
    category: 'Maintenance Service Parts',
    subCategory: 'Filters',
    partType: 'Oil Filter',
    position: 'Engine Compartment',
    crossReferences: ['ABC-123', 'XYZ-456', 'MANN-HU7009Z'],
    images: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80'
    ],
    fitments: [
      { id: 'f-1', make: 'Toyota', model: 'Camry', yearFrom: '2018', yearTo: '2020', generation: 'XV70', variant: '2.5L Petrol', engine: '2.5L A25A-FKS', fuelType: 'Petrol', transmission: 'Automatic' },
      { id: 'f-2', make: 'Toyota', model: 'Camry', yearFrom: '2021', yearTo: '2023', generation: 'XV70 Facelift', variant: '2.5L Hybrid', engine: '2.5L Hybrid A25A-FXS', fuelType: 'Hybrid', transmission: 'e-CVT' },
      { id: 'f-3', make: 'Toyota', model: 'Corolla', yearFrom: '2019', yearTo: '2023', generation: 'E210', variant: '1.8L Hybrid', engine: '1.8L 2ZR-FXE', fuelType: 'Hybrid', transmission: 'Automatic' }
    ],
    technicalSpecs: {
      'Thread Size': '3/4-16 UNF',
      'Height': '86 mm',
      'Outer Diameter': '74 mm',
      'Filter Type': 'Spin-On Oil Filter',
      'Gasket Material': 'Nitrile Rubber',
      'Bypass Valve Pressure': '1.0 bar'
    }
  };

  const product = {
    ...rawProduct,
    id: rawProduct.id || 'AZI-PROD-GENERIC',
    name: rawProduct.title || rawProduct.name || 'Kamti Automotive Spare Part',
    price: typeof rawProduct.price === 'number' ? rawProduct.price : (parseFloat(rawProduct.price) || 0),
    mrp: typeof rawProduct.mrp === 'number' ? rawProduct.mrp : (parseFloat(rawProduct.mrp || rawProduct.originalPrice) || (rawProduct.price ? Math.round(rawProduct.price * 1.25) : 0)),
    brand: typeof rawProduct.brand === 'object' ? (rawProduct.brand?.name || 'Kamti Automotive') : (rawProduct.brand || 'Kamti Automotive'),
    oemPartNumber: rawProduct.oemPartNumber || rawProduct.oem || '90915-YZZN2',
    sku: rawProduct.sku || `KA-${(rawProduct.id || '001').toUpperCase()}`,
    stockCount: rawProduct.stock !== undefined ? rawProduct.stock : (rawProduct.stockCount || 10),
    crossReferences: Array.isArray(rawProduct.crossReferences) ? rawProduct.crossReferences : (rawProduct.cross_references || ['ABC-123', 'XYZ-456']),
    fitments: Array.isArray(rawProduct.fitments) ? rawProduct.fitments : (rawProduct.compatibility || []),
    images: Array.isArray(rawProduct.images) ? rawProduct.images : [rawProduct.image || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80']
  };

  const savingsAmount = product.mrp > product.price ? product.mrp - product.price : 0;
  const discountPercent = product.mrp > product.price ? Math.round((savingsAmount / product.mrp) * 100) : 0;

  // Gallery Images
  const galleryImages = product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80'];
  const [selectedImage, setSelectedImage] = useState(galleryImages[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');

  useEffect(() => {
    if (galleryImages && galleryImages.length > 0) {
      setSelectedImage(galleryImages[0]);
    }
  }, [product.id]);

  // Set Page Title & Product Schema JSON-LD
  useEffect(() => {
    document.title = `${product.name} | OEM ${product.oemPartNumber} | Kamti Automotive`;
    
    // Add Schema.org JSON-LD structured data
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = 'product-schema-jsonld';
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org/',
      '@type': 'Product',
      'name': product.name,
      'image': galleryImages,
      'description': product.description || `${product.name} genuine automotive part`,
      'sku': product.sku,
      'mpn': product.mpn || product.oemPartNumber,
      'brand': {
        '@type': 'Brand',
        'name': product.brand
      },
      'offers': {
        '@type': 'Offer',
        'url': window.location.href,
        'priceCurrency': 'INR',
        'price': product.price,
        'availability': product.stockCount > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        'itemCondition': 'https://schema.org/NewCondition'
      }
    });

    const existingSchema = document.getElementById('product-schema-jsonld');
    if (existingSchema) existingSchema.remove();
    document.head.appendChild(schemaScript);

    return () => {
      if (schemaScript) schemaScript.remove();
    };
  }, [product.id, product.name]);

  // Auto Check Compatibility
  const fitmentResult = useMemo(() => {
    return checkProductCompatibility(product, selectedVehicle);
  }, [product, selectedVehicle]);

  // Engagement & Review Data
  const [reviewSummary, setReviewSummary] = useState({
    reviews: [],
    totalReviews: 0,
    averageRating: 0,
    starCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    verifiedCount: 0,
    photos: []
  });
  const [questions, setQuestions] = useState([]);
  const [isAskQuestionOpen, setIsAskQuestionOpen] = useState(false);
  const [qName, setQName] = useState(user?.name || '');
  const [qEmail, setQEmail] = useState(user?.email || '');
  const [qText, setQText] = useState('');
  const [qSubmitting, setQSubmitting] = useState(false);
  const [qFeedback, setQFeedback] = useState(null);

  useEffect(() => {
    loadEngagementData();
    addToRecentlyViewed(product);
  }, [product.id]);

  const loadEngagementData = async () => {
    const summary = await getProductReviewSummary(product.id, 'newest', 'all');
    setReviewSummary(summary);
    const qList = await getProductQuestionsDB(product.id);
    setQuestions(qList);
  };

  // Copy OEM Part Number
  const handleCopyOem = () => {
    if (navigator.clipboard && product.oemPartNumber) {
      navigator.clipboard.writeText(product.oemPartNumber);
      setCopiedOem(true);
      if (showToast) showToast(`✓ Copied OEM Part #: ${product.oemPartNumber}`);
      setTimeout(() => setCopiedOem(false), 2000);
    }
  };

  // Add to Cart / Buy Now Validation (Point 17 & 18 & 40)
  const handleValidatedAddToCart = (e, isBuyNowFlow = false) => {
    if (e && e.preventDefault) e.preventDefault();

    // 1. Stock check
    if (product.stockCount <= 0 && !product.availableOnOrder) {
      if (showToast) showToast('⚠️ Product is currently out of stock.');
      return;
    }

    // 2. Compatibility Mismatch Check
    if (selectedVehicle && fitmentResult.status === 'NOT_COMPATIBLE') {
      setShowIncompatModal(true);
      return;
    }

    // 3. Execute Action
    if (isBuyNowFlow) {
      buyNow(product, quantity);
    } else {
      addToCart(product, quantity);
      setIsCartDrawerOpen(true);
      if (showToast) showToast(`🛒 Added ${product.name} (${quantity}) to cart!`);
    }
  };

  // Related Products
  const relatedProducts = useMemo(() => {
    return (products || [])
      .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
      .slice(0, 4);
  }, [products, product]);

  const isLiked = isInWishlist(product.id);
  const isOutOfStock = product.stockCount <= 0 && !product.availableOnOrder;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20 font-sans selection:bg-[#FF5722] selection:text-white">
      
      {/* Breadcrumb Bar */}
      <div className="bg-slate-950 border-b border-slate-800 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-bold text-slate-400 overflow-x-auto whitespace-nowrap">
          <span onClick={() => navigateTo('home')} className="hover:text-[#FF5722] cursor-pointer transition">Home</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span onClick={() => navigateTo('catalog')} className="hover:text-[#FF5722] cursor-pointer transition">{product.category || 'Spares'}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-white font-extrabold truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* -------------------------------------------------- */}
        {/* 6. PROMINENT TOP VEHICLE COMPATIBILITY BOX          */}
        {/* -------------------------------------------------- */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 mb-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-start gap-4">
              <div className={`p-3.5 rounded-2xl border shrink-0 ${
                fitmentResult.status === 'COMPATIBLE' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : fitmentResult.status === 'NOT_COMPATIBLE'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}>
                {fitmentResult.status === 'COMPATIBLE' ? (
                  <ShieldCheck size={32} />
                ) : fitmentResult.status === 'NOT_COMPATIBLE' ? (
                  <AlertCircle size={32} />
                ) : (
                  <Car size={32} />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">CHECK COMPATIBILITY</span>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded border ${fitmentResult.badgeColor}`}>
                    {fitmentResult.badgeText}
                  </span>
                </div>

                {selectedVehicle ? (
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                      <span>Customer Vehicle: {selectedVehicle.makeName || selectedVehicle.make} {selectedVehicle.modelName || selectedVehicle.model} ({selectedVehicle.year})</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5 font-medium">
                      Generation: <span className="text-amber-400 font-bold">{selectedVehicle.generation || 'Standard'}</span> • Variant: <span className="text-amber-400 font-bold">{selectedVehicle.variant || 'All'}</span> • Engine: <span className="text-amber-400 font-bold">{selectedVehicle.engine || 'All'}</span>
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-base font-black text-white uppercase">Check if this part fits your car</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Select your exact vehicle (Brand → Model → Year) to verify fitment before ordering.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Change Vehicle & View Full Compatibility Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsVehicleModalOpen(true)}
                className="bg-[#FF5722] hover:bg-orange-600 text-white font-black text-xs px-4 py-2.5 rounded-xl transition shadow-lg shadow-orange-500/20 flex items-center gap-2 cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>{selectedVehicle ? 'Change Vehicle' : 'Select Your Vehicle'}</span>
              </button>

              <button
                onClick={() => setIsFullCompatDrawerOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>View Full Compatibility</span>
              </button>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* MAIN PRODUCT DETAIL GRID (IMAGE + DETAILS)        */}
        {/* -------------------------------------------------- */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden mb-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Gallery Left Column */}
            <div className="lg:col-span-5 p-6 bg-slate-900/50 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col gap-4">
              
              {/* Main Image Preview */}
              <div className="relative w-full aspect-square max-h-[420px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center p-4 group">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-500 cursor-pointer"
                  onClick={() => setIsLightboxOpen(true)}
                  onError={(e) => { e.target.onerror = null; e.target.src = '/kamti-logo.png'; }}
                />

                <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="p-2.5 bg-slate-900/90 text-slate-300 hover:text-white rounded-xl border border-slate-700 shadow-lg backdrop-blur-md transition"
                    title="Zoom Image"
                  >
                    <Camera className="w-4 h-4 text-[#FF5722]" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-2.5 rounded-xl border backdrop-blur-md transition ${
                      isLiked ? 'bg-red-500 text-white border-red-400' : 'bg-slate-900/90 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                    title="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Thumbnail Selector */}
              <div className="flex gap-3 overflow-x-auto py-1 scrollbar-none">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl bg-slate-950 border-2 overflow-hidden shrink-0 transition ${
                      selectedImage === img ? 'border-[#FF5722] ring-2 ring-[#FF5722]/30 scale-105' : 'border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>

              {/* Delivery & Shipping Info Box */}
              <div className="mt-2 bg-slate-950 border border-slate-800 rounded-2xl p-4">
                <PincodeDeliveryChecker compact={true} variant="dark" />
              </div>

            </div>

            {/* Details & Actions Right Column */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                
                {/* Taxonomy & Brand */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-black text-[#FF5722] uppercase tracking-wider">{product.brand}</span>
                  <span className="text-[11px] font-bold text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                    {product.category} • {product.partType || 'Auto Part'}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-4 leading-tight">
                  {product.name}
                </h1>

                {/* OEM & Identifiers Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">OEM Part Number</span>
                      <span className="text-sm font-mono font-bold text-amber-400">{product.oemPartNumber}</span>
                    </div>
                    <button
                      onClick={handleCopyOem}
                      className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer transition"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#FF5722]" />
                      <span>{copiedOem ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">SKU / Part ID</span>
                      <span className="text-xs font-mono font-bold text-slate-200">{product.sku}</span>
                    </div>
                    {product.crossReferences.length > 0 && (
                      <button
                        onClick={() => setIsCrossRefModalOpen(true)}
                        className="text-[10px] font-bold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Cross-Ref ({product.crossReferences.length})
                      </button>
                    )}
                  </div>
                </div>

                {/* Price Display Section (Point 4) */}
                <div className="flex items-baseline justify-between border-t border-b border-slate-800 py-4 mb-6">
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.mrp > product.price && (
                        <span className="text-lg font-bold text-slate-500 line-through">
                          ₹{product.mrp.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {savingsAmount > 0 && (
                      <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
                        <span>Save ₹{savingsAmount.toLocaleString('en-IN')} ({discountPercent}% OFF)</span>
                      </div>
                    )}
                  </div>

                  {/* Stock Badge (Point 5) */}
                  <div className="text-right">
                    <span className={`inline-block text-xs font-black px-3 py-1 rounded-full border ${
                      product.stockCount > 5
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : product.stockCount > 0
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : product.availableOnOrder
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {product.stockCount > 5 
                        ? '✓ In Stock' 
                        : product.stockCount > 0 
                          ? `Only ${product.stockCount} left` 
                          : product.availableOnOrder 
                            ? 'Available on Order' 
                            : 'Currently Unavailable'}
                    </span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Quantity:</span>
                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-1 text-white">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                      className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white font-bold"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-black text-sm">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stockCount || 99, quantity + 1))} 
                      className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white font-bold"
                      disabled={quantity >= (product.stockCount || 99)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* CTA Buttons (Add to Cart & Buy Now) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <button
                    onClick={(e) => handleValidatedAddToCart(e, false)}
                    disabled={isOutOfStock}
                    className={`py-4 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                      isOutOfStock
                        ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                        : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 hover:border-[#FF5722]'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4 text-[#FF5722]" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={(e) => handleValidatedAddToCart(e, true)}
                    disabled={isOutOfStock}
                    className={`py-4 px-6 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg ${
                      isOutOfStock
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-[#FF5722] hover:bg-orange-600 text-white shadow-orange-500/20'
                    }`}
                  >
                    <span>Buy Now</span>
                  </button>
                </div>

                {/* Trust Highlights */}
                <div className="grid grid-cols-3 gap-2 border-t border-slate-800 pt-4">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#FF5722] shrink-0" />
                    <div className="text-[10px] font-bold text-slate-300">
                      <div>Fast Shipping</div>
                      <div className="text-slate-500 font-normal">Pan-India</div>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="text-[10px] font-bold text-slate-300">
                      <div>100% Genuine</div>
                      <div className="text-slate-500 font-normal">OEM / OES</div>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div className="text-[10px] font-bold text-slate-300">
                      <div>7 Days Return</div>
                      <div className="text-slate-500 font-normal">Easy replacement</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Specifications & Description Tabs */}
          <div className="border-t border-slate-800 bg-slate-950">
            <div className="flex border-b border-slate-800">
              <button
                onClick={() => setActiveTab('specs')}
                className={`flex-1 py-4 text-xs font-black uppercase tracking-wider transition ${
                  activeTab === 'specs' ? 'text-[#FF5722] border-b-2 border-[#FF5722] bg-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                Specifications & Technical Details
              </button>
              <button
                onClick={() => setActiveTab('desc')}
                className={`flex-1 py-4 text-xs font-black uppercase tracking-wider transition ${
                  activeTab === 'desc' ? 'text-[#FF5722] border-b-2 border-[#FF5722] bg-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                Structured Description
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {activeTab === 'specs' ? (
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Technical Specifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between text-xs">
                      <span className="font-bold text-slate-400">Brand</span>
                      <span className="font-extrabold text-white">{product.brand}</span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between text-xs">
                      <span className="font-bold text-slate-400">Part Type</span>
                      <span className="font-extrabold text-white">{product.partType || product.category}</span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between text-xs">
                      <span className="font-bold text-slate-400">OEM Part Number</span>
                      <span className="font-mono font-bold text-amber-400">{product.oemPartNumber}</span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between text-xs">
                      <span className="font-bold text-slate-400">Condition</span>
                      <span className="font-extrabold text-emerald-400">100% Brand New</span>
                    </div>
                    {product.position && (
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between text-xs">
                        <span className="font-bold text-slate-400">Position / Location</span>
                        <span className="font-extrabold text-white">{product.position}</span>
                      </div>
                    )}
                    {Object.entries(product.technicalSpecs || {}).map(([key, val]) => (
                      val ? (
                        <div key={key} className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between text-xs">
                          <span className="font-bold text-slate-400">{key}</span>
                          <span className="font-extrabold text-white">{val}</span>
                        </div>
                      ) : null
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Product Description</h3>
                  <p>{product.description || 'High quality genuine OEM grade automotive spare part designed for long service life and reliable vehicle performance.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* RELATED PRODUCTS SECTION (Point 23)                */}
        {/* -------------------------------------------------- */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF5722]" />
              <span>Related Compatible Products</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map(rel => (
                <div key={rel.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-[#FF5722] transition">
                  <div>
                    <div className="h-36 bg-slate-900 rounded-xl p-2 flex items-center justify-center mb-3">
                      <img src={rel.image || rel.image_url} alt={rel.title} className="max-h-full max-w-full object-contain" />
                    </div>
                    <span className="text-[10px] font-black text-[#FF5722] uppercase">{rel.brand}</span>
                    <h4 className="font-bold text-xs text-white line-clamp-2 mt-1">{rel.title || rel.name}</h4>
                  </div>
                  <div className="pt-3 border-t border-slate-800 mt-3 flex items-center justify-between">
                    <span className="text-sm font-black text-white">₹{rel.price?.toLocaleString('en-IN')}</span>
                    <button onClick={() => navigateTo('product-detail', rel.id)} className="text-xs font-bold text-[#FF5722] hover:underline">View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* -------------------------------------------------- */}
      {/* COMPATIBILITY DRAWER MODAL (Point 10)              */}
      {/* -------------------------------------------------- */}
      {isFullCompatDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-xl bg-slate-900 h-full p-6 overflow-y-auto space-y-6 border-l border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Car className="w-5 h-5 text-[#FF5722]" /> Complete Vehicle Compatibility Matrix
              </h3>
              <button onClick={() => setIsFullCompatDrawerOpen(false)} className="text-slate-400 hover:text-white p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3">
              {product.fitments && product.fitments.length > 0 ? (
                product.fitments.map((fit, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-white">{fit.make} {fit.model}</span>
                      <span className="text-xs font-bold text-amber-400">{fit.yearFrom} – {fit.yearTo}</span>
                    </div>
                    <p className="text-xs text-slate-300">Variant: {fit.variant || 'All Variants'} • Engine: {fit.engine || 'All Engines'}</p>
                    <p className="text-[11px] text-slate-400">Fuel: {fit.fuelType || 'Any'} • Transmission: {fit.transmission || 'Any'}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">Compatibility records are pending verification for this product.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* INCOMPATIBLE VEHICLE WARNING MODAL                 */}
      {/* -------------------------------------------------- */}
      {showIncompatModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center mx-auto text-rose-400">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-lg font-black text-white uppercase">Incompatible Part Warning</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This product is <strong className="text-rose-400">NOT compatible</strong> with your currently selected vehicle ({selectedVehicle?.makeName} {selectedVehicle?.modelName}).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  setShowIncompatModal(false);
                  setIsVehicleModalOpen(true);
                }}
                className="bg-[#FF5722] text-white font-bold text-xs py-3 px-4 rounded-xl"
              >
                Change Vehicle
              </button>
              <button
                onClick={() => {
                  setShowIncompatModal(false);
                  addToCart(product, quantity);
                  setIsCartDrawerOpen(true);
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-3 px-4 rounded-xl border border-slate-700"
              >
                Proceed Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <button onClick={() => setIsLightboxOpen(false)} className="absolute top-4 right-4 p-3 text-white bg-slate-800 rounded-full">
            <X className="w-6 h-6" />
          </button>
          <img src={selectedImage} alt="lightbox" className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl" />
        </div>
      )}

    </div>
  );
};
