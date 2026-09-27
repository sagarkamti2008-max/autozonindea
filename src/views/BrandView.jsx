import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { isProductMatchingVehicleAndCategory } from '../services/catalogEngine';
import {
  ArrowLeft, ChevronRight, Car, CheckCircle2, ShieldCheck, Filter,
  Search, ShoppingCart, Heart, ArrowRight, Sparkles, Wrench, Layers, Tag,
  Truck, Clock, RotateCcw, PhoneCall, Zap, Star
} from 'lucide-react';

// Real HD brand logos map
const brandLogos = {
  'MARUTI': '/images/logos/maruti.png',
  'HYUNDAI': '/images/logos/hyundai.png',
  'SKODA': '/images/logos/skoda.png',
  'VW': '/images/logos/vw.png',
  'HONDA': '/images/logos/honda.png',
  'NISSAN': '/images/logos/nissan.png',
  'FORD': '/images/logos/ford.png',
  'MAHINDRA': '/images/logos/mahindra.png',
  'TOYOTA': '/images/logos/toyota.png',
  'TATA': '/images/logos/tata.png',
  'RENAULT': '/images/logos/renault.png',
  'CHEVROLET': '/images/logos/chevrolet.png',
  'JAGUAR': '/images/logos/jaguar.png',
  'LEXUS': '/images/logos/lexus.png',
  'CITROEN': '/images/logos/citroen.png',
  'BYD': '/images/logos/byd.png'
};

// Popular Car Models Database per Brand
const BRAND_MODELS_DATA = {
  'MARUTI': [
    { name: 'SWIFT', type: 'Hatchback', years: '2005 - 2026', tag: 'Top Seller' },
    { name: 'BALENO', type: 'Premium Hatchback', years: '2015 - 2026', tag: 'Popular' },
    { name: 'BREZZA', type: 'Compact SUV', years: '2016 - 2026', tag: 'Best SUV' },
    { name: 'ERTIGA', type: 'MPV 7-Seater', years: '2012 - 2026', tag: 'Family' },
    { name: 'DZIRE', type: 'Compact Sedan', years: '2008 - 2026', tag: 'Best Sedan' },
    { name: 'ALTO K10 / 800', type: 'Hatchback', years: '2000 - 2026', tag: 'Budget' },
    { name: 'GRAND VITARA', type: 'Midsize SUV', years: '2022 - 2026', tag: 'Hybrid' },
    { name: 'JIMNY', type: 'Offroad 4x4', years: '2023 - 2026', tag: '4x4' },
    { name: 'WAGON R', type: 'Tallboy Hatchback', years: '1999 - 2026', tag: 'Popular' },
    { name: 'XL6', type: 'Premium MPV', years: '2019 - 2026', tag: 'Luxury' },
    { name: 'CIAZ', type: 'Sedan', years: '2014 - 2026', tag: 'Sedan' },
    { name: 'S-PRESSO', type: 'Mini SUV', years: '2019 - 2026', tag: 'Compact' }
  ],
  'HYUNDAI': [
    { name: 'CRETA', type: 'Midsize SUV', years: '2015 - 2026', tag: 'Top Seller' },
    { name: 'I20 / ELITE I20', type: 'Premium Hatchback', years: '2008 - 2026', tag: 'Popular' },
    { name: 'VENUE', type: 'Compact SUV', years: '2019 - 2026', tag: 'Best SUV' },
    { name: 'VERNA', type: 'Sedan', years: '2006 - 2026', tag: 'Best Sedan' },
    { name: 'ALCAZAR', type: '7-Seater SUV', years: '2021 - 2026', tag: 'Family' },
    { name: 'EXTER', type: 'Micro SUV', years: '2023 - 2026', tag: 'New Arrival' },
    { name: 'AURA / XCENT', type: 'Compact Sedan', years: '2014 - 2026', tag: 'Economical' },
    { name: 'GRAND I10 / NIOS', type: 'Hatchback', years: '2013 - 2026', tag: 'Popular' },
    { name: 'TUCSON', type: 'Luxury SUV', years: '2005 - 2026', tag: 'Premium' },
    { name: 'IONIQ 5 / KONA EV', type: 'Electric SUV', years: '2019 - 2026', tag: 'Electric' },
    { name: 'SANTRO', type: 'Hatchback', years: '1998 - 2022', tag: 'Classic' }
  ],
  'SKODA': [
    { name: 'KUSHAQ', type: 'Midsize SUV', years: '2021 - 2026', tag: 'Top Seller' },
    { name: 'SLAVIA', type: 'Sedan', years: '2022 - 2026', tag: 'Popular' },
    { name: 'KODIAQ', type: 'Luxury 4x4 SUV', years: '2017 - 2026', tag: '4x4' },
    { name: 'KYLAQ', type: 'Compact SUV', years: '2025 - 2026', tag: 'New' },
    { name: 'OCTAVIA', type: 'Premium Sedan', years: '2001 - 2023', tag: 'Classic' },
    { name: 'SUPERB', type: 'Luxury Sedan', years: '2004 - 2024', tag: 'Flagship' },
    { name: 'RAPID', type: 'Sedan', years: '2011 - 2021', tag: 'Popular' }
  ],
  'VW': [
    { name: 'VIRTUS', type: 'Sedan', years: '2022 - 2026', tag: 'Top Seller' },
    { name: 'TAIGUN', type: 'Compact SUV', years: '2021 - 2026', tag: 'Popular' },
    { name: 'POLO', type: 'Hatchback', years: '2010 - 2022', tag: 'Iconic' },
    { name: 'VENTO', type: 'Sedan', years: '2010 - 2022', tag: 'Classic' },
    { name: 'TIGUAN', type: 'Luxury SUV', years: '2017 - 2026', tag: 'Premium' },
    { name: 'PASSAT / JETTA', type: 'Premium Sedan', years: '2007 - 2020', tag: 'Executive' }
  ],
  'HONDA': [
    { name: 'CITY', type: 'Sedan', years: '1998 - 2026', tag: 'Top Seller' },
    { name: 'ELEVATE', type: 'Midsize SUV', years: '2023 - 2026', tag: 'New SUV' },
    { name: 'AMAZE', type: 'Compact Sedan', years: '2013 - 2026', tag: 'Popular' },
    { name: 'WR-V / JAZZ', type: 'Crossover / Hatchback', years: '2009 - 2023', tag: 'Spacious' },
    { name: 'CIVIC', type: 'Premium Sedan', years: '2006 - 2021', tag: 'Sports' },
    { name: 'CR-V', type: 'SUV 4x4', years: '2003 - 2021', tag: 'Luxury SUV' }
  ],
  'TATA': [
    { name: 'NEXON / NEXON EV', type: 'Compact SUV', years: '2017 - 2026', tag: '#1 SUV' },
    { name: 'PUNCH / PUNCH EV', type: 'Micro SUV', years: '2021 - 2026', tag: 'Top Seller' },
    { name: 'HARRIER', type: 'Midsize SUV', years: '2019 - 2026', tag: 'Premium' },
    { name: 'SAFARI', type: 'Flagship 7-Seater', years: '2021 - 2026', tag: 'Luxury' },
    { name: 'ALTROZ', type: 'Premium Hatchback', years: '2020 - 2026', tag: '5-Star Safety' },
    { name: 'TIAGO / TIAGO EV', type: 'Hatchback', years: '2016 - 2026', tag: 'Popular' },
    { name: 'TIGOR / TIGOR EV', type: 'Compact Sedan', years: '2017 - 2026', tag: 'EV Sedan' },
    { name: 'CURVV / CURVV EV', type: 'SUV Coupe', years: '2024 - 2026', tag: 'Futuristic' }
  ],
  'MAHINDRA': [
    { name: 'THAR / THAR ROXX', type: 'Offroad 4x4 SUV', years: '2010 - 2026', tag: 'Iconic 4x4' },
    { name: 'SCORPIO-N', type: 'Big SUV', years: '2022 - 2026', tag: 'Top Seller' },
    { name: 'SCORPIO CLASSIC', type: 'SUV', years: '2002 - 2026', tag: 'Legendary' },
    { name: 'XUV700', type: 'Luxury Tech SUV', years: '2021 - 2026', tag: 'Flagship' },
    { name: 'XUV300 / XUV3XO', type: 'Compact SUV', years: '2019 - 2026', tag: '5-Star Safety' },
    { name: 'BOLERO / BOLERO NEO', type: 'Rugged Utility SUV', years: '2000 - 2026', tag: 'Best Seller' },
    { name: 'XUV400 EV', type: 'Electric SUV', years: '2023 - 2026', tag: 'Electric' }
  ],
  'TOYOTA': [
    { name: 'CAMRY', type: 'Luxury Hybrid Sedan', years: '2002 - 2026', tag: 'Luxury' },
    { name: 'COROLLA', type: 'Sedan', years: '2003 - 2013', tag: 'Classic' },
    { name: 'COROLLA ALTIS', type: 'Premium Sedan', years: '2008 - 2020', tag: 'Popular' },
    { name: 'ETIOS', type: 'Sedan', years: '2010 - 2020', tag: 'Economical' },
    { name: 'ETIOS LIVA', type: 'Hatchback', years: '2011 - 2020', tag: 'Budget' },
    { name: 'FORTUNER', type: 'Luxury SUV 4x4', years: '2009 - 2026', tag: 'King SUV' },
    { name: 'GLANZA', type: 'Premium Hatchback', years: '2019 - 2026', tag: 'Popular' },
    { name: 'INNOVA', type: 'MUV 7-Seater', years: '2005 - 2016', tag: 'Legendary' },
    { name: 'INNOVA CRYSTA', type: 'MPV 7-Seater', years: '2016 - 2026', tag: 'Top Seller' },
    { name: 'INNOVA HYCROSS', type: 'Strong Hybrid MPV', years: '2023 - 2026', tag: 'Hybrid Leader' },
    { name: 'LANDCRUISER', type: 'Flagship 4x4 SUV', years: '2007 - 2026', tag: 'Flagship' },
    { name: 'LANDCRUISER PRADO', type: 'Luxury Offroad 4x4', years: '2004 - 2020', tag: '4x4' },
    { name: 'PLATINUM ETIOS', type: 'Executive Sedan', years: '2016 - 2020', tag: 'Commercial' },
    { name: 'QUALIS', type: 'Classic MUV', years: '2000 - 2005', tag: 'Iconic' },
    { name: 'YARIS', type: 'Sedan', years: '2018 - 2021', tag: 'Popular' },
    { name: 'URBAN CRUISER HYRYDER', type: 'Hybrid SUV', years: '2022 - 2026', tag: 'Hybrid SUV' },
    { name: 'HILUX', type: '4x4 Pickup Truck', years: '2022 - 2026', tag: 'Extreme 4x4' },
    { name: 'RUMION', type: 'MPV 7-Seater', years: '2023 - 2026', tag: 'Family' },
    { name: 'VELLFIRE', type: 'Ultra-Luxury MPV', years: '2020 - 2026', tag: 'VVIP MPV' }
  ],
  'NISSAN': [
    { name: 'MAGNITE', type: 'Compact SUV', years: '2020 - 2026', tag: 'Top Seller' },
    { name: 'KICKS', type: 'SUV', years: '2019 - 2023', tag: 'Crossover' },
    { name: 'SUNNY / TERRANO', type: 'Sedan / SUV', years: '2011 - 2020', tag: 'Popular' }
  ],
  'FORD': [
    { name: 'ENDEAVOUR', type: 'Luxury 4x4 SUV', years: '2003 - 2022', tag: 'Iconic 4x4' },
    { name: 'ECOSPORT', type: 'Compact SUV', years: '2013 - 2021', tag: 'Top Seller' },
    { name: 'FIGO / ASPIRE', type: 'Hatchback / Sedan', years: '2010 - 2021', tag: 'Popular' }
  ],
  'RENAULT': [
    { name: 'KWID', type: 'Hatchback', years: '2015 - 2026', tag: 'Top Seller' },
    { name: 'TRIBER', type: '7-Seater MPV', years: '2019 - 2026', tag: 'Family' },
    { name: 'KIGER', type: 'Compact SUV', years: '2021 - 2026', tag: 'SUV' },
    { name: 'DUSTER', type: 'Iconic SUV', years: '2012 - 2022', tag: 'Classic' }
  ],
  'CHEVROLET': [
    { name: 'BEAT', type: 'Hatchback', years: '2010 - 2017', tag: 'Popular' },
    { name: 'CRUZE', type: 'Diesel Rocket Sedan', years: '2009 - 2017', tag: 'Iconic' },
    { name: 'TAVERA / ENJOY', type: 'MUV / MPV', years: '2004 - 2017', tag: 'Commercial' }
  ],
  'JAGUAR': [
    { name: 'F-PACE', type: 'Luxury SUV', years: '2016 - 2026', tag: 'Luxury SUV' },
    { name: 'XE / XF', type: 'Sports Sedan', years: '2015 - 2026', tag: 'Executive' },
    { name: 'F-TYPE', type: 'Sports Coupe', years: '2014 - 2024', tag: 'Supercar' }
  ],
  'LEXUS': [
    { name: 'ES 300H', type: 'Luxury Hybrid Sedan', years: '2017 - 2026', tag: 'Top Seller' },
    { name: 'NX / RX', type: 'Luxury Hybrid SUV', years: '2018 - 2026', tag: 'Hybrid SUV' },
    { name: 'LX 500D', type: 'Flagship 4x4 SUV', years: '2022 - 2026', tag: 'Flagship' }
  ],
  'CITROEN': [
    { name: 'C3 / EC3', type: 'Hatchback / EV', years: '2022 - 2026', tag: 'Popular' },
    { name: 'C3 AIRCROSS / BASALT', type: 'SUV / Coupe', years: '2023 - 2026', tag: 'New SUV' },
    { name: 'C5 AIRCROSS', type: 'Comfort SUV', years: '2021 - 2026', tag: 'Luxury Comfort' }
  ],
  'BYD': [
    { name: 'ATTO 3', type: 'Electric SUV', years: '2022 - 2026', tag: 'EV Leader' },
    { name: 'SEAL', type: 'Electric Sports Sedan', years: '2024 - 2026', tag: 'Sports EV' },
    { name: 'E6 / SEALION 6', type: 'Electric MPV / SUV', years: '2021 - 2026', tag: 'MPV' }
  ]
};

// 14 Master Categories for filtering as requested
const MAIN_CATEGORIES = [
  { id: 'all', name: 'All Parts', icon: '✨' },
  { id: 'engine-parts', name: 'Engine Parts', icon: '⚙️' },
  { id: 'brake-parts', name: 'Brake Parts', icon: '🛑' },
  { id: 'suspension-parts', name: 'Suspension Parts', icon: '🔩' },
  { id: 'electrical-parts', name: 'Electrical Parts', icon: '⚡' },
  { id: 'body-parts', name: 'Body Parts', icon: '🚗' },
  { id: 'ac-parts', name: 'AC Parts', icon: '❄️' },
  { id: 'transmission-parts', name: 'Transmission Parts', icon: '🕹️' },
  { id: 'steering-parts', name: 'Steering Parts', icon: '☸️' },
  { id: 'filters', name: 'Filters', icon: '🧹' },
  { id: 'clutch-parts', name: 'Clutch Parts', icon: '💿' },
  { id: 'cooling-system', name: 'Cooling System', icon: '🌡️' },
  { id: 'fuel-system', name: 'Fuel System', icon: '⛽' },
  { id: 'interior-parts', name: 'Interior Parts', icon: '💺' },
  { id: 'accessories', name: 'Accessories', icon: '👑' }
];

export const BrandView = () => {
  const { selectedBrand, navigateTo, addToCart, buyNow, products, showToast, toggleWishlist, wishlist } = useStore();

  const currentBrand = (selectedBrand && selectedBrand !== 'all') ? selectedBrand.toUpperCase() : 'HYUNDAI';
  const logoUrl = brandLogos[currentBrand] || `/images/logos/${currentBrand.toLowerCase()}.png`;

  const availableModels = BRAND_MODELS_DATA[currentBrand] || [
    { name: `${currentBrand} MODEL 1`, type: 'SUV', years: '2018 - 2026', tag: 'Popular' },
    { name: `${currentBrand} MODEL 2`, type: 'Sedan', years: '2016 - 2026', tag: 'Popular' },
    { name: `${currentBrand} MODEL 3`, type: 'Hatchback', years: '2015 - 2026', tag: 'Economical' }
  ];

  // Selection states
  const [activeModel, setActiveModel] = useState('');
  const [activeVariant, setActiveVariant] = useState('All');
  const [activeFuel, setActiveFuel] = useState('All');
  const [activeYear, setActiveYear] = useState('All');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Update SEO Page Title
  React.useEffect(() => {
    document.title = `${currentBrand} Spare Parts & Car Models Catalog | AutoZonIndia`;
  }, [currentBrand]);

  // Filter products for this brand & vehicle & category
  const filteredProducts = (products || []).filter(p => {
    // 0. Active status check
    if (p.isActive === false || p.status === 'inactive' || p.activeStatus === 'inactive') return false;

    const isMatched = isProductMatchingVehicleAndCategory(
      p,
      currentBrand,
      activeModel,
      activeCategory,
      '',
      activeVariant,
      activeYear
    );
    if (!isMatched) return false;

    // Fuel Type
    if (activeFuel && activeFuel !== 'All') {
      const fuelLower = activeFuel.toLowerCase();
      const pTitleLower = (p.title || '').toLowerCase();
      const pDescLower = (p.description || '').toLowerCase();
      const matchFuel = (p.fuelType && p.fuelType.toLowerCase().includes(fuelLower)) ||
                        pTitleLower.includes(fuelLower) ||
                        pDescLower.includes(fuelLower);
      if (!matchFuel && !p.isUniversal) return false;
    }

    // Search Term / Part Number / OEM Number
    if (searchTerm.trim().length > 0) {
      const term = searchTerm.toLowerCase().trim();
      const pTitleLower = (p.title || '').toLowerCase();
      const pDescLower = (p.description || '').toLowerCase();
      const pPartNum = (p.partNumber || p.mpn || '').toLowerCase();
      const pOemNum = (p.oemPartNumber || p.oemNumber || '').toLowerCase();
      const pBrand = (p.brand || '').toLowerCase();

      const matchText = pTitleLower.includes(term) ||
                        pOemNum.includes(term) ||
                        pPartNum.includes(term) ||
                        pBrand.includes(term) ||
                        (p.subCategory && p.subCategory.toLowerCase().includes(term)) ||
                        pDescLower.includes(term);
      if (!matchText) return false;
    }

    return true;
  });

  // Strict catalog display (never show cross-model fallback when model/filters are active)
  const displayProducts = filteredProducts;
  const isShowingFallback = false;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-24 selection:bg-[#FF5722] selection:text-white">
      
      {/* -------------------------------------------------------------
          1. BREADCRUMB NAVIGATION & HERO BRAND HEADER
      ------------------------------------------------------------- */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden shadow-sm">
        
        {/* Glowing Background FX */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-5 relative z-10">
          
          {/* SEO Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span onClick={() => navigateTo('home')} className="hover:text-[#FF5722] cursor-pointer transition">
              Home
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span onClick={() => navigateTo('home')} className="hover:text-[#FF5722] cursor-pointer transition">
              Spares By Make
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#FF5722] font-black uppercase tracking-wider">
              {currentBrand} SPARE PARTS
            </span>
          </div>

          {/* Main Brand Card Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-md border border-slate-200 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="flex items-center gap-5 z-10">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-slate-50 p-3 flex items-center justify-center shrink-0 shadow-sm border border-slate-200 group hover:scale-105 transition-transform duration-300">
                <img src={logoUrl} alt={currentBrand} className="max-h-full max-w-full object-contain filter drop-shadow-sm" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="bg-emerald-50 text-emerald-700 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 border border-emerald-200 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 100% Genuine {currentBrand} Parts
                  </span>
                  <span className="bg-amber-50 text-amber-800 font-extrabold text-[10px] px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Direct OEM Warranty
                  </span>
                  <span className="bg-blue-50 text-blue-700 font-extrabold text-[10px] px-3 py-1 rounded-full border border-blue-200 shadow-sm">
                    🚚 Express Pan-India Delivery
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 uppercase flex items-center gap-3">
                  <span>{currentBrand} SPARE PARTS & ACCESSORIES</span>
                </h1>
                
                <p className="text-slate-600 text-xs sm:text-sm mt-1.5 max-w-2xl font-medium leading-relaxed">
                  Select your specific <strong>{currentBrand}</strong> car model below to get 100% fitment guarantee on genuine OEM & OES spare parts, filters, oils, and body components.
                </p>
              </div>
            </div>

            {/* Quick Actions & Stats */}
            <div className="flex flex-col sm:flex-row items-center gap-3 z-10 w-full md:w-auto">
              <button
                onClick={() => {
                  setActiveModel('');
                  setActiveCategory('all');
                  setSearchTerm('');
                  showToast(`Cleared filters for ${currentBrand}`);
                }}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs px-5 py-3 rounded-xl border border-slate-300 transition cursor-pointer flex items-center justify-center gap-2 shadow-sm hover:border-[#FF5722]"
              >
                <Filter className="w-4 h-4 text-[#FF5722]" /> Reset Filters
              </button>
            </div>

            {/* Subtle background brand glow */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-slate-100 to-transparent pointer-events-none" />
          </div>

          {/* Quick Assurance Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center gap-3 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-black text-slate-900">100% Genuine Guarantee</div>
                <div className="text-[10px] text-slate-500 font-medium">Direct from OEM factories</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center gap-3 shadow-sm">
              <Truck className="w-5 h-5 text-[#0B5394] shrink-0" />
              <div>
                <div className="text-xs font-black text-slate-900">Fast Doorstep Delivery</div>
                <div className="text-[10px] text-slate-500 font-medium">Safe packaging across 19,000+ pin codes</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center gap-3 shadow-sm">
              <RotateCcw className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <div className="text-xs font-black text-slate-900">Easy Returns</div>
                <div className="text-[10px] text-slate-500 font-medium">Hassle-free 10-day replacement</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center gap-3 shadow-sm">
              <Zap className="w-5 h-5 text-[#FF5722] shrink-0" />
              <div>
                <div className="text-xs font-black text-slate-900">Verified Fitment Engine</div>
                <div className="text-[10px] text-slate-500 font-medium">Match by chassis & registration</div>
              </div>
            </div>
          </div>

        </div>
      </div>


      {/* -------------------------------------------------------------
          2. CAR MODEL SELECTION SECTION (POPULAR MODELS GRID)
      ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2.5">
              <Car className="w-6 h-6 text-[#FF5722]" />
              <span>Select {currentBrand} Car Model</span>
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Click on your car model below to filter compatible spare parts, service kits, and accessories.
            </p>
          </div>

          {activeModel && (
            <div className="bg-orange-50 border border-orange-300 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-900 shadow-md">
              <span>Selected Model: <strong className="text-[#FF5722] font-black uppercase">{activeModel}</strong></span>
              <button 
                onClick={() => setActiveModel('')} 
                className="bg-[#FF5722] text-white hover:bg-orange-600 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-black ml-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Responsive Grid of Car Models */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {availableModels.map((car) => {
            const isSelected = activeModel === car.name;
            return (
              <div
                key={car.name}
                onClick={() => {
                  if (isSelected) {
                    setActiveModel('');
                    showToast(`Showing all ${currentBrand} models`);
                  } else {
                    setActiveModel(car.name);
                    showToast(`Filtered spare parts for ${currentBrand} ${car.name}`);
                  }
                }}
                className={`rounded-2xl p-4 flex flex-col justify-between h-[155px] transition-all duration-300 cursor-pointer relative overflow-hidden group border ${
                  isSelected
                    ? 'bg-gradient-to-br from-orange-50 via-white to-amber-50/50 border-2 border-[#FF5722] shadow-xl shadow-orange-500/10 ring-4 ring-orange-500/15 -translate-y-1'
                    : 'bg-white border-slate-200 hover:border-[#FF5722] hover:bg-slate-50/80 hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {/* Accent top line for selected card */}
                {isSelected && <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF5722]" />}

                {/* Badge */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                    isSelected ? 'bg-[#FF5722] text-white shadow-sm' : 'bg-slate-100 text-slate-700 group-hover:bg-orange-50 group-hover:text-[#FF5722]'
                  }`}>
                    {car.tag || car.type}
                  </span>
                  <div className={`p-1.5 rounded-lg transition-colors ${isSelected ? 'bg-orange-100 text-[#FF5722]' : 'bg-slate-50 text-slate-400 group-hover:text-[#FF5722] group-hover:bg-orange-50'}`}>
                    <Car className="w-4 h-4" />
                  </div>
                </div>

                {/* Car Info */}
                <div className="my-2">
                  <h3 className={`font-black text-sm sm:text-base leading-tight line-clamp-1 transition-colors ${
                    isSelected ? 'text-[#FF5722]' : 'text-slate-900 group-hover:text-[#FF5722]'
                  }`}>
                    {car.name}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-500 mt-1">
                    {car.years}
                  </p>
                </div>

                {/* Button / Action */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">{car.type}</span>
                  <span className={`text-[10px] font-black flex items-center gap-0.5 ${
                    isSelected ? 'text-[#FF5722]' : 'text-slate-500 group-hover:text-[#FF5722]'
                  }`}>
                    {isSelected ? 'Active ✓' : 'View Parts →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </section>


      {/* -------------------------------------------------------------
          3. CATEGORIES & FILTER TOOLBAR
      ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        
        {/* Category Pills Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FF5722]" /> Select Spare Parts Category
            </h3>
            {activeCategory !== 'all' && (
              <button
                onClick={() => setActiveCategory('all')}
                className="text-[11px] font-bold text-[#FF5722] hover:underline cursor-pointer"
              >
                Show All Categories
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {MAIN_CATEGORIES.map((cat) => {
              const isCatActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    showToast(`Filtered by ${cat.name}`);
                  }}
                  className={`px-4 py-2.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 shrink-0 border ${
                    isCatActive
                      ? 'bg-[#FF5722] text-white border-[#FF5722] shadow-lg shadow-orange-500/20 scale-105 ring-2 ring-[#FF5722]/30'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-[#FF5722] hover:text-slate-900'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Dropdowns Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          
          {/* Model Selector */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Filter Model</label>
            <select
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#FF5722]"
            >
              <option value="">All {currentBrand} Models</option>
              {availableModels.map(m => (
                <option key={m.name} value={m.name}>{m.name} ({m.years})</option>
              ))}
            </select>
          </div>

          {/* Fuel Type */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Fuel Type</label>
            <select
              value={activeFuel}
              onChange={(e) => setActiveFuel(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#FF5722]"
            >
              <option value="All">All Fuel Types (Petrol/Diesel/CNG/EV)</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="EV">Electric (EV)</option>
            </select>
          </div>

          {/* Model Year */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Year</label>
            <select
              value={activeYear}
              onChange={(e) => setActiveYear(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#FF5722]"
            >
              <option value="All">All Years (2000 - 2026)</option>
              {['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Search Part Keyword */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Search Part Name / OEM No.</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Brake Pad, Oil Filter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl pl-3 pr-8 py-2.5 focus:outline-none focus:border-[#FF5722] placeholder-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

      </section>


      {/* -------------------------------------------------------------
          4. FILTERED SPARE PARTS CATALOG PRODUCTS GRID
      ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <span>{currentBrand} GENUINE SPARE PARTS CATALOG</span>
            {activeModel && <span className="text-[#FF5722] font-extrabold text-sm">({activeModel})</span>}
          </h3>
          
          <div className="flex items-center gap-2">
            {isShowingFallback && (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1">
                ⭐ Featured Fast-Moving OEM Catalog
              </span>
            )}
            <span className="text-xs font-bold text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              Showing {displayProducts.length} Items
            </span>
          </div>
        </div>

        {displayProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col items-center justify-center py-16 px-6 text-center w-full mb-8 relative overflow-hidden">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-200 text-amber-500">
              <Search size={32} />
            </div>
            <h3 className="font-black text-2xl text-slate-900 mb-3 uppercase tracking-tight">
              No products found for {currentBrand} {activeModel || ''} {activeCategory !== 'all' ? activeCategory.replace('-', ' ') : ''}
            </h3>
            <p className="text-slate-500 font-medium text-xs sm:text-sm max-w-md mx-auto mb-8 leading-relaxed">
              We couldn't find any products matching your specific vehicle model and category selection. Try selecting another category or speak with our live fitment team.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => {
                  setActiveModel('');
                  setActiveCategory('all');
                  setActiveVariant('All');
                  setActiveYear('All');
                  setSearchTerm('');
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs py-3 px-6 rounded-xl transition-all cursor-pointer border border-slate-200"
              >
                Reset Vehicle & Category Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {displayProducts.map((product) => {
              const isWishlisted = wishlist && wishlist.some(item => item.id === product.id);
              const discountPercent = product.mrp && product.mrp > product.price 
                ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
                : 15;
              const isOutOfStock = product.stockStatus === 'out_of_stock' || (product.stock !== undefined && product.stock <= 0) || product.inStock === false;

              return (
                <div
                  key={product.id}
                  className="bg-white border border-slate-200 hover:border-[#FF5722] rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl group relative"
                >
                  <div>
                    {/* Product Image & Badges */}
                    <div className="relative h-48 bg-slate-50 rounded-xl overflow-hidden mb-3.5 flex items-center justify-center p-3 border border-slate-100">
                      <img
                        src={product.image || product.image_url || '/images/synthetic_engine_oil.jpg'}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-300"
                      />
                      
                      <span className="absolute top-2 left-2 bg-[#FF5722] text-white font-black text-[10px] px-2 py-0.5 rounded uppercase shadow-md flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> 100% Fitment
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className={`absolute top-2 right-2 p-2 rounded-full border backdrop-blur-md transition ${
                          isWishlisted 
                            ? 'bg-red-500 text-white border-red-400' 
                            : 'bg-white/80 text-slate-400 hover:text-slate-800 border-slate-200'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                      </button>

                      {(product.oemPartNumber || product.partNumber) && (
                        <span className="absolute bottom-2 left-2 bg-slate-900/90 text-amber-300 text-[9px] font-mono px-2 py-0.5 rounded border border-slate-800">
                          OEM: {product.oemPartNumber || product.partNumber}
                        </span>
                      )}

                      {discountPercent > 0 && (
                        <span className="absolute bottom-2 right-2 bg-emerald-600 text-white font-black text-[9px] px-2 py-0.5 rounded">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Brand & SubCategory */}
                    <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500 mb-1">
                      <span className="text-[#FF5722]">{product.brand || currentBrand}</span>
                      <span className="text-slate-500">{product.subCategory || product.category || 'Spare Part'}</span>
                    </div>

                    {/* Product Title */}
                    <h4
                      onClick={() => navigateTo('product-detail', product.id)}
                      className="font-extrabold text-slate-900 text-sm line-clamp-2 hover:text-[#FF5722] cursor-pointer transition leading-snug"
                    >
                      {product.title}
                    </h4>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-1.5 mt-2 text-amber-500 text-xs font-extrabold">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold">(4.9 • Verified Fit)</span>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-lg font-black text-slate-900">
                          ₹{product.price ? product.price.toLocaleString('en-IN') : '1,299'}
                        </div>
                        {product.mrp && product.mrp > product.price && (
                          <div className="text-[10px] text-slate-400 line-through font-bold">
                            ₹{product.mrp.toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isOutOfStock 
                          ? 'text-rose-600 bg-rose-50 border-rose-200' 
                          : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      }`}>
                        {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        disabled={isOutOfStock}
                        onClick={() => {
                          if (isOutOfStock) return;
                          addToCart(product);
                          showToast(`Added "${product.title}" to Cart 🛒`);
                        }}
                        className={`p-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs font-bold ${
                          isOutOfStock
                            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 hover:border-[#FF5722] cursor-pointer'
                        }`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-[#FF5722]" />
                        <span>Add</span>
                      </button>

                      <button
                        type="button"
                        disabled={isOutOfStock}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (isOutOfStock) return;
                          buyNow(product);
                        }}
                        className={`p-2.5 rounded-xl transition-all flex items-center justify-center gap-1 text-xs font-black ${
                          isOutOfStock
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#FF5722] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md shadow-orange-500/20 cursor-pointer'
                        }`}
                      >
                        <span>{isOutOfStock ? 'Unavailable' : 'Buy Now'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* -------------------------------------------------------------
          5. FLOATING WHATSAPP / EXPERT SUPPORT WIDGET
      ------------------------------------------------------------- */}
      <a
        href={`https://wa.me/919876543210?text=Hi%20AutoZonIndia,%20I%20need%20help%20finding%20spare%20parts%20for%20my%20${currentBrand}%20car.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 transition-transform hover:scale-105 border-2 border-white/20"
      >
        <PhoneCall className="w-4 h-4 animate-bounce" />
        <span>Ask {currentBrand} Fitment Expert</span>
      </a>
    </div>
  );
};


