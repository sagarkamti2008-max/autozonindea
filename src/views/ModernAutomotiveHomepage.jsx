import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search, ShoppingCart, Heart, Car, Wrench, ShieldCheck, Zap,
  ChevronDown, Star, ArrowRight, Layers, CheckCircle2, Mic, Crown,
  User, PhoneCall, Truck, CreditCard, Wallet, Lock, Sparkles, Filter,
  MessageCircle
} from 'lucide-react';
import { getCustomerProfile } from '../services/customerAccountEngine';
import { Footer } from '../components/Footer';
import CustomSelect from '../components/CustomSelect';

// High-definition official car brand logo SVGs with exact emblem + brand typography matching Boodmo reference
const BrandLogoSvg = ({ brand }) => {
  switch (brand) {
    case 'MARUTI':
      return (
        <svg viewBox="0 0 160 70" className="w-full h-full object-contain filter drop-shadow-sm">
          {/* Red Suzuki S emblem */}
          <path d="M 28,6 H 68 L 38,30 H 68 L 28,52 H 68 L 44,34 H 28 Z" fill="#E60012" />
          {/* MARUTI SUZUKI Blue Text */}
          <text x="80" y="64" fill="#0B5394" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.5">MARUTI SUZUKI</text>
        </svg>
      );
    case 'HYUNDAI':
      return (
        <svg viewBox="0 0 160 70" className="w-full h-full object-contain filter drop-shadow-sm">
          {/* Silver/Blue Slanted H Emblem */}
          <ellipse cx="80" cy="26" rx="36" ry="21" fill="none" stroke="#002C6C" strokeWidth="5" transform="rotate(-10 80 26)" />
          <path d="M 64,38 L 70,14 M 96,38 L 90,14 M 66,26 L 94,26" stroke="#002C6C" strokeWidth="5.5" strokeLinecap="round" />
          {/* HYUNDAI Blue Text */}
          <text x="80" y="64" fill="#002C6C" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="sans-serif" letterSpacing="1">HYUNDAI</text>
        </svg>
      );
    case 'SKODA':
      return (
        <svg viewBox="0 0 160 70" className="w-full h-full object-contain filter drop-shadow-sm">
          {/* Skoda Green Winged Arrow Emblem */}
          <circle cx="80" cy="25" r="22" fill="#4BA829" stroke="#2B6615" strokeWidth="2" />
          <circle cx="80" cy="25" r="18" fill="none" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M 72,25 L 88,18 L 82,30 Z" fill="#FFFFFF" />
          <circle cx="88" cy="18" r="2.5" fill="#FFFFFF" />
          {/* ŠKODA Dark Green Text */}
          <text x="80" y="64" fill="#1C3F10" fontSize="15" fontWeight="900" textAnchor="middle" fontFamily="sans-serif" letterSpacing="1">ŠKODA</text>
        </svg>
      );
    case 'VW':
      return (
        <svg viewBox="0 0 160 70" className="w-full h-full object-contain filter drop-shadow-sm">
          {/* Blue VW Circle Emblem */}
          <circle cx="80" cy="35" r="30" fill="#001E50" stroke="#000E28" strokeWidth="2" />
          <circle cx="80" cy="35" r="26" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
          <path d="M 66,21 L 73,35 L 80,27 L 87,35 L 94,21 M 68,38 L 80,52 L 92,38" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'HONDA':
      return (
        <svg viewBox="0 0 160 70" className="w-full h-full object-contain filter drop-shadow-sm">
          {/* Silver H Emblem */}
          <rect x="58" y="6" width="44" height="42" rx="8" fill="none" stroke="#444444" strokeWidth="4.5" />
          <path d="M 67,13 V 41 M 93,13 V 41 M 67,27 Q 80,22 93,27" fill="none" stroke="#444444" strokeWidth="4.5" strokeLinecap="round" />
          {/* HONDA Red Text */}
          <text x="80" y="64" fill="#CC0000" fontSize="15" fontWeight="900" textAnchor="middle" fontFamily="sans-serif" letterSpacing="1">HONDA</text>
        </svg>
      );
    case 'NISSAN':
      return (
        <svg viewBox="0 0 160 70" className="w-full h-full object-contain filter drop-shadow-sm">
          {/* Nissan Silver Ring Badge */}
          <circle cx="80" cy="35" r="28" fill="none" stroke="#333333" strokeWidth="6" />
          <rect x="42" y="27" width="76" height="16" fill="#333333" rx="3" />
          <text x="80" y="39" fill="#FFFFFF" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="sans-serif" letterSpacing="1">NISSAN</text>
        </svg>
      );
    case 'FORD':
      return (
        <svg viewBox="0 0 160 70" className="w-full h-full object-contain filter drop-shadow-sm">
          {/* Ford Royal Blue Oval */}
          <ellipse cx="80" cy="35" r="32" ry="20" fill="#102B7B" stroke="#FFFFFF" strokeWidth="3" />
          <text x="80" y="42" fill="#FFFFFF" fontSize="22" fontWeight="900" fontStyle="italic" textAnchor="middle" fontFamily="serif">Ford</text>
        </svg>
      );
    case 'MAHINDRA':
      return (
        <svg viewBox="0 0 160 70" className="w-full h-full object-contain filter drop-shadow-sm">
          {/* Red Twin Peak M */}
          <path d="M 54,46 L 70,12 L 80,32 L 90,12 L 106,46" fill="none" stroke="#E31837" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          {/* Mahindra Dark Gray Text */}
          <text x="80" y="64" fill="#333333" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.5">Mahindra</text>
        </svg>
      );
    case 'TOYOTA':
      return (
        <svg viewBox="0 0 160 70" className="w-full h-full object-contain filter drop-shadow-sm">
          {/* Toyota Triple Ellipse */}
          <ellipse cx="80" cy="25" rx="32" ry="19" fill="none" stroke="#555555" strokeWidth="4" />
          <ellipse cx="80" cy="17" rx="18" ry="9" fill="none" stroke="#555555" strokeWidth="4" />
          <ellipse cx="80" cy="25" rx="9" ry="16" fill="none" stroke="#555555" strokeWidth="4" />
          {/* TOYOTA Red Text */}
          <text x="80" y="64" fill="#EB0A1E" fontSize="15" fontWeight="900" textAnchor="middle" fontFamily="sans-serif" letterSpacing="1">TOYOTA</text>
        </svg>
      );
    case 'TATA':
      return (
        <svg viewBox="0 0 160 70" className="w-full h-full object-contain filter drop-shadow-sm">
          {/* Tata Blue T Emblem */}
          <path d="M 56,12 H 104 M 80,12 V 42 M 60,24 C 60,38 100,38 100,24" fill="none" stroke="#00529F" strokeWidth="5" strokeLinecap="round" />
          {/* TATA Blue Text */}
          <text x="80" y="64" fill="#00529F" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="sans-serif" letterSpacing="1">TATA</text>
        </svg>
      );
    case 'RENAULT':
      return (
        <svg viewBox="0 0 160 70" className="w-full h-full object-contain filter drop-shadow-sm">
          {/* Renault Silver Diamond */}
          <path d="M 80,6 L 102,28 L 80,50 L 58,28 Z" fill="none" stroke="#222222" strokeWidth="5.5" strokeLinejoin="round" />
          <path d="M 80,16 L 91,28 L 80,40 L 69,28 Z" fill="none" stroke="#222222" strokeWidth="3" />
          {/* RENAULT Black Text */}
          <text x="80" y="65" fill="#111111" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif" letterSpacing="1">RENAULT</text>
        </svg>
      );
    case 'CHEVROLET':
      return (
        <svg viewBox="0 0 160 70" className="w-full h-full object-contain filter drop-shadow-sm">
          {/* Gold Metallic Chevrolet Bowtie */}
          <path d="M 44,28 H 60 V 16 H 100 V 28 H 116 V 38 H 100 V 50 H 60 V 38 H 44 Z" fill="#CD9834" stroke="#7A560F" strokeWidth="2.5" strokeLinejoin="round" />
          {/* CHEVROLET Text */}
          <text x="80" y="64" fill="#333333" fontSize="11.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.5">CHEVROLET</text>
        </svg>
      );
    case 'JAGUAR':
      return (
        <svg viewBox="0 0 160 70" className="w-full h-full object-contain filter drop-shadow-sm">
          {/* Silver 3D Leaping Jaguar Cat */}
          <path d="M 46,36 C 60,16 88,14 114,30 C 102,39 78,42 46,36 Z" fill="#333333" />
          <circle cx="106" cy="24" r="2" fill="#FFFFFF" />
          {/* JAGUAR Text */}
          <text x="80" y="64" fill="#222222" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="sans-serif" letterSpacing="1">JAGUAR</text>
        </svg>
      );
    case 'LEXUS':
      return (
        <svg viewBox="0 0 160 70" className="w-full h-full object-contain filter drop-shadow-sm">
          {/* Lexus Oval L */}
          <ellipse cx="80" cy="25" rx="32" ry="19" fill="none" stroke="#333333" strokeWidth="4.5" />
          <path d="M 64,15 L 80,36 H 92" fill="none" stroke="#333333" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {/* LEXUS Text */}
          <text x="80" y="64" fill="#222222" fontSize="15" fontWeight="900" textAnchor="middle" fontFamily="sans-serif" letterSpacing="1">LEXUS</text>
        </svg>
      );
    case 'CITROEN':
      return (
        <svg viewBox="0 0 160 70" className="w-full h-full object-contain filter drop-shadow-sm">
          {/* Citroën Double Chevron */}
          <path d="M 58,26 L 80,14 L 102,26 M 58,40 L 80,28 L 102,40" fill="none" stroke="#444444" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* CITROËN Red Text */}
          <text x="80" y="64" fill="#D30015" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="sans-serif" letterSpacing="1">CITROËN</text>
        </svg>
      );
    case 'BYD':
      return (
        <svg viewBox="0 0 160 70" className="w-full h-full object-contain filter drop-shadow-sm">
          {/* Red Oval BYD */}
          <ellipse cx="80" cy="35" rx="34" ry="22" fill="none" stroke="#E60012" strokeWidth="4" />
          <text x="80" y="42" fill="#E60012" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="sans-serif" letterSpacing="2">BYD</text>
        </svg>
      );
    default:
      return (
        <div className="w-12 h-12 flex items-center justify-center bg-[#0B5394] text-white rounded-full font-black text-sm shadow-md">
          {brand.slice(0, 2)}
        </div>
      );
  }
};

const RenderBrandLogo = ({ brand, logoUrl }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !logoUrl) {
    return <BrandLogoSvg brand={brand} />;
  }

  return (
    <img 
      src={logoUrl} 
      alt={brand} 
      className="max-w-full max-h-full object-contain filter drop-shadow-sm p-1" 
      onError={() => setHasError(true)}
    />
  );
};

export const ModernAutomotiveHomepage = () => {
  const { navigateTo, addToCart, buyNow, wishlist, cartItemCount, products, showToast, setSelectedBrand: setGlobalSelectedBrand, setSelectedVehicle, setSearchQuery } = useStore();
  const profileData = getCustomerProfile();

  // Search Mode state (Vehicle vs Number Plate)
  const [searchTab, setSearchTab] = useState('vehicle'); // 'vehicle' or 'number_plate'

  // Vehicle Selector dropdown states
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('');

  // Number Plate Input state & VAHAN Modal state
  const [numberPlateInput, setNumberPlateInput] = useState('');
  const [vahanModalData, setVahanModalData] = useState(null);
  const [isSearchingVahan, setIsSearchingVahan] = useState(false);

  // Live Smart Search Auto-Suggest state
  const [searchQueryInput, setSearchQueryInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter matching products for live auto-suggest dropdown
  const matchingSuggestions = (products || []).filter(p => {
    if (!searchQueryInput || searchQueryInput.trim().length < 1) return false;
    const term = searchQueryInput.toLowerCase().trim();
    return (
      (p.title && p.title.toLowerCase().includes(term)) ||
      (p.brand && p.brand.toLowerCase().includes(term)) ||
      (p.oemPartNumber && p.oemPartNumber.toLowerCase().includes(term)) ||
      (p.category && p.category.toLowerCase().includes(term)) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(term))
    );
  }).slice(0, 5);

  // Complete 31 Car Brand Companies Database with Model Years down to 2010
  const DEFAULT_CAR_YEARS = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'];

  const MODEL_VARIANTS_MAP = {
    // TOYOTA
    'INNOVA CRYSTA': ['2.4L ZX DIESEL 7-STR', '2.4L VX DIESEL 7-STR', '2.4L GX DIESEL 8-STR', '2.7L GX PETROL'],
    'INNOVA': ['2.5L V DIESEL 7-STR', '2.5L G DIESEL', '2.0L G PETROL'],
    'INNOVA HYCROSS': ['2.0L ZX(O) HYBRID E-CVT', '2.0L VX HYBRID', '2.0L GX PETROL'],
    'FORTUNER': ['2.8L 4X4 SIGMA-4 AT', '2.8L 4X2 DIESEL AT', '2.7L PETROL 4X2 MT', 'GR-SPORT 4X4 AT'],
    'URBAN CRUISER HYRYDER': ['1.5L V HYBRID E-CVT', '1.5L G HYBRID', '1.5L S NEO DRIVE', '1.5L G CNG'],
    'URBAN CRUISER': ['PREMIUM GRADE 1.5L K15B AT', 'HIGH GRADE 1.5L MT'],
    'GLANZA': ['G 1.2L PETROL', 'V 1.2L AMT', 'S 1.2L CNG', 'E 1.2L MT'],
    'CAMRY': ['2.5L HYBRID E-CVT', '2.5L PETROL AT'],
    'COROLLA ALTIS': ['1.8L VL PETROL CVT', '1.4L D-4D DIESEL'],
    'COROLLA': ['1.8L PETROL MT', '1.4L DIESEL'],
    'ETIOS': ['1.5L V PETROL', '1.4L VD DIESEL'],
    'ETIOS LIVA': ['1.2L V PETROL', '1.4L GD DIESEL'],
    'HILUX': ['2.8L 4X4 HIGH AT', '2.8L 4X4 STD MT'],
    'RUMION': ['V 1.5L NEO DRIVE AT', 'S 1.5L CNG', 'G 1.5L MT'],
    'VELLFIRE': ['2.5L HYBRID EXECUTIVE LOUNGE'],
    'LANDCRUISER': ['3.3L V6 TWIN TURBO DIESEL ZX', '4.5L V8 DIESEL'],
    'LANDCRUISER PRADO': ['2.8L DIESEL VX'],
    'YARIS': ['VX 1.5L CVT', 'G 1.5L MT'],

    // MARUTI
    'SWIFT': ['ZXI PLUS 1.2L DUALJET', 'VXI 1.2L MT', 'ZDI+ 1.3L DDIS TURBO', 'LXI 1.0L CNG'],
    'BALENO': ['ALPHA 1.2L DUALJET AMT', 'ZETA 1.2L PETROL', 'SIGMA 1.2L CNG'],
    'BREZZA': ['ZXI+ 1.5L SMART HYBRID AT', 'VXI 1.5L MT', 'ZDI+ 1.3L DDIS DIESEL'],
    'ERTIGA': ['ZXI+ 1.5L K15C AT', 'VXI 1.5L CNG', 'ZDI 1.3L DDIS'],
    'DZIRE': ['ZXI+ 1.2L DUALJET AMT', 'VXI 1.2L CNG'],
    'GRAND VITARA': ['ALPHA+ 1.5L STRONG HYBRID e-CVT', 'ZETA 1.5L ALLGRIP 4WD'],
    'JIMNY': ['ALPHA 1.5L ALLGRIP PRO 4WD AT', 'ZETA 1.5L MT'],
    'ALTO': ['VXI+ 1.0L K10C AMT', 'LXI 1.0L CNG'],
    'ALTO 800': ['LXI 0.8L PETROL', 'LXI 0.8L CNG'],
    'ALTO K10': ['VXI+ 1.0L K10C AMT', 'LXI 1.0L CNG'],
    'WAGON R': ['ZXI+ 1.2L DUALJET', 'LXI 1.0L CNG'],
    'XL6': ['ALPHA+ 1.5L K15C AT', 'ZETA 1.5L CNG'],
    'CIAZ': ['ALPHA 1.5L PETROL AT', 'ZETA 1.3L DDIS DIESEL'],
    'IGNIS': ['ALPHA 1.2L PETROL AMT', 'ZETA 1.2L MT'],

    // HYUNDAI
    'CRETA': ['SX(O) 1.5L CRDI DIESEL AT', 'SX 1.5L MPI PETROL IVT', '1.5L TURBO GDI 7DCT', 'EX 1.5L DIESEL'],
    'VENUE': ['SX(O) 1.0L TURBO GDI 7DCT', 'SX 1.5L CRDI DIESEL', 'S(O) 1.2L KAPPA MT'],
    'I20': ['ASTA(O) 1.2L KAPPA IVT', 'SPORTZ 1.2L MT', 'ASTA 1.0L TURBO DCT'],
    'VERNA': ['SX(O) 1.5L TURBO GDI 7DCT', 'SX 1.5L MPI IVT', 'SX 1.5L CRDI DIESEL'],
    'ALCAZAR': ['SIGNATURE 1.5L TURBO PETROL 7DCT', 'PRESTIGE 1.5L CRDI DIESEL'],
    'EXTER': ['SX(O) CONNECT 1.2L KAPPA AMT', 'S 1.2L CNG'],
    'AURA': ['SX PLUS 1.2L KAPPA AMT', 'S 1.2L CNG'],

    // TATA
    'NEXON': ['FEARLESS+ S 1.2L TURBO PETROL DCA', 'CREATIVE+ 1.5L REVOTORQ DIESEL', 'XM+ 1.2L PETROL'],
    'PUNCH': ['CREATIVE CUSTOM 1.2L REVOTRON AMT', 'ACCOMPLISHED 1.2L I-CNG'],
    'HARRIER': ['FEARLESS+ 2.0L KRYOTEC DIESEL AT', 'ADVENTURE+ 2.0L DIESEL'],
    'SAFARI': ['ACCOMPLISHED+ 6-STR 2.0L DIESEL AT', 'PURE+ 2.0L DIESEL'],
    'ALTROZ': ['XZ+ O(S) 1.5L DIESEL', 'XZ+ TECH 1.2L DCA PETROL', 'XE 1.2L I-CNG'],

    // MAHINDRA
    'THAR': ['LX 4X4 2.2L mHawk DIESEL AT', 'LX 4X4 2.0L mStallion PETROL AT', 'RWD 1.5L DIESEL MT'],
    'THAR ROXX': ['AX7L 4X4 2.2L DIESEL AT', 'MX5 2.0L PETROL MT'],
    'XUV700': ['AX7 LUXURY PACK 2.2L DIESEL AWD AT', 'AX5 2.0L PETROL MT', 'AX7 2.2L DIESEL AT'],
    'SCORPIO-N': ['Z8 L 2.2L DIESEL 4WD AT', 'Z6 2.2L DIESEL MT'],

    // HONDA
    'CITY': ['ZX 1.5L i-VTEC CVT', 'VX 1.5L i-DTEC DIESEL', 'e:HEV STRONG HYBRID'],
    'AMAZE': ['VX 1.2L i-VTEC CVT', 'VX 1.5L i-DTEC DIESEL'],

    // KIA
    'SELTOS': ['GTX+ 1.5L TURBO GDI 7DCT', 'HTX+ 1.5L CRDI DIESEL AT', 'HTK+ 1.5L PETROL MT'],
    'SONET': ['GTX+ 1.0L TURBO 7DCT', 'HTX 1.5L CRDI DIESEL iMT']
  };

  const getVariantsForModel = (brand, model) => {
    if (!brand) return [];
    if (model && MODEL_VARIANTS_MAP[model.trim().toUpperCase()]) {
      return MODEL_VARIANTS_MAP[model.trim().toUpperCase()];
    }
    if (model) {
      const matchKey = Object.keys(MODEL_VARIANTS_MAP).find(k => k.includes(model.trim().toUpperCase()) || model.trim().toUpperCase().includes(k));
      if (matchKey) return MODEL_VARIANTS_MAP[matchKey];
    }
    if (carDatabase[brand] && carDatabase[brand].variants) {
      return carDatabase[brand].variants;
    }
    return ['2.4L ZX DIESEL', '2.4L VX DIESEL', '2.7L GX PETROL', 'Standard Variant'];
  };

  const carDatabase = {
    'MARUTI': {
      models: ['ALTO', 'ALTO 800', 'ALTO K10', 'BALENO', 'BREZZA', 'CIAZ', 'DZIRE', 'ERTIGA', 'GRAND VITARA', 'IGNIS', 'JIMNY', 'S-CROSS', 'S-PRESSO', 'SWIFT', 'WAGON R', 'XL6'],
      years: DEFAULT_CAR_YEARS,
      variants: ['ZXI PLUS 1.2L DUALJET', 'VXI 1.2L MT', 'ZDI+ 1.3L DDIS TURBO', 'LXI 1.0L CNG']
    },
    'HYUNDAI': {
      models: ['ACCENT/ VIVA', 'ALCAZAR', 'AURA', 'CRETA', 'CRETA EV', 'ELANTRA', 'EON', 'EXTER', 'GETZ', 'GRAND I10', 'I10', 'I20', 'IONIQ 5', 'KONA', 'SANTA FE', 'SANTRO', 'SONATA', 'TERRACAN', 'TUCSON', 'VENUE', 'VERNA', 'XCENT'],
      years: DEFAULT_CAR_YEARS,
      variants: ['SX(O) 1.5L CRDI DIESEL', 'SX 1.5L MPI PETROL', '1.0L TURBO GDI IVT', 'MAGNA 1.2L CNG']
    },
    'SKODA': {
      models: ['FABIA', 'KAROQ', 'KODIAQ', 'KUSHAQ', 'KYLAQ', 'LAURA', 'OCTAVIA', 'RAPID', 'SLAVIA', 'SUPERB', 'YETI'],
      years: DEFAULT_CAR_YEARS,
      variants: ['STYLE 1.5L TSI DSG', 'AMBITION 1.0L TSI MT', 'MONTE CARLO 1.5L TSI', 'L&K 2.0L TSI 4X4']
    },
    'VW': {
      models: ['AMEO', 'BEETLE', 'CROSS POLO', 'JETTA', 'PASSAT', 'POLO', 'TAIGUN', 'TIGUAN', 'TIGUAN ALLSPACE', 'TOUAREG', 'T-ROC', 'VENTO', 'VIRTUS'],
      years: DEFAULT_CAR_YEARS,
      variants: ['GT LINE 1.5L TSI DSG', 'HIGHLINE 1.0L TSI MT', 'TOPLINE 1.0L TSI AT', 'HIGHLINE 1.5L TDI']
    },
    'HONDA': {
      models: ['ACCORD', 'AMAZE', 'BRIO', 'CITY', 'CIVIC', 'CR-V', 'ELEVATE', 'JAZZ', 'MOBILIO', 'WR-V'],
      years: DEFAULT_CAR_YEARS,
      variants: ['ZX 1.5L I-VTEC CVT', 'VX 1.5L I-DTEC DIESEL', 'E:HEV STRONG HYBRID', 'VX 1.2L I-VTEC']
    },
    'NISSAN': {
      models: ['EVALIA', 'GT-R', 'KICKS', 'MAGNITE', 'MICRA', 'MICRA ACTIVE', 'PATHFINDER', 'SUNNY', 'TERRANO', 'X-TRAIL'],
      years: DEFAULT_CAR_YEARS,
      variants: ['XV PREMIUM 1.0L TURBO CVT', 'XL 1.0L B4D MT', 'XV 1.5L K9K DIESEL']
    },
    'FORD': {
      models: ['ASPIRE', 'ECOSPORT', 'ENDEAVOUR', 'FESTIVA', 'FIGO', 'FREESTYLE', 'IKON', 'MUSTANG', 'TURNEO'],
      years: DEFAULT_CAR_YEARS,
      variants: ['TITANIUM+ 2.0L ECOBLUE 4X4', 'TITANIUM 1.5L TDCI DIESEL', 'SPORTS 1.5L TI-VCT PETROL']
    },
    'MAHINDRA': {
      models: ['ALTURAS G4', 'BOLERO', 'BOLERO MAXITRUCK', 'BOLERO NEO', 'BOLERO NEO PLUS', 'E2O', 'KUV100', 'MARAZZO', 'NUVOSPORT', 'QUANTUM', 'SCORPIO', 'SCORPIO CLASSIC', 'SCORPIO-N', 'THAR', 'THAR ROXX', 'TUV300', 'TUV300 PLUS', 'VERITO', 'XUV300', 'XUV400 EV', 'XUV700', 'XYLO'],
      years: DEFAULT_CAR_YEARS,
      variants: ['AX7 L 2.2L MHAWK DIESEL AWD', 'LX 4X4 HARDTOP 2.0L MSTALLION', 'Z8 L 2.2L DIESEL AT', 'N10 1.5L MHAWK']
    },
    'TOYOTA': {
      models: ['CAMRY', 'COROLLA', 'COROLLA ALTIS', 'ETIOS', 'ETIOS LIVA', 'FORTUNER', 'GLANZA', 'HILUX', 'INNOVA', 'INNOVA CRYSTA', 'INNOVA HYCROSS', 'LANDCRUISER', 'LANDCRUISER PRADO', 'PLATINUM ETIOS', 'QUALIS', 'RUMION', 'URBAN CRUISER HYRYDER', 'VELLFIRE', 'YARIS'],
      years: DEFAULT_CAR_YEARS,
      variants: ['2.4L ZX DIESEL 7-STR', '2.8L 4X4 SIGMA-4 AT', '1.5L V HYBRID E-CVT', 'G 1.2L PETROL']
    },
    'TATA': {
      models: ['ALTROZ', 'ARIA', 'BOLT', 'CURVV', 'CURVV EV', 'HARRIER', 'INDICA', 'INDICA V2', 'INDIGO', 'INDIGO CS', 'MANZA', 'NANO', 'NEXON', 'NEXON EV', 'PUNCH', 'PUNCH EV', 'SAFARI', 'SAFARI STORME', 'SUMO', 'SUMO GOLD', 'TIAGO', 'TIAGO EV', 'TIGOR', 'TIGOR EV', 'ZEST'],
      years: DEFAULT_CAR_YEARS,
      variants: ['XZ+ LUX 1.5L REVOTORQ DIESEL', 'FEARLESS+ S 1.2L TURBO DCA', 'ACCOMPLISHED+ 2.0L KRYOTEC AT']
    },
    'RENAULT': {
      models: ['DUSTER', 'FLUENCE', 'KIGER', 'KOLEOS', 'KWID', 'LODGY', 'PULSE', 'SCALA', 'TRIBER'],
      years: DEFAULT_CAR_YEARS,
      variants: ['RXZ 1.0L TURBO X-TRONIC CVT', 'RXT 1.0L ENERGY MT', 'RXZ 1.5L DCI DIESEL']
    },
    'CHEVROLET': {
      models: ['AVEO', 'AVEO U-VA', 'BEAT', 'CAPTIVA', 'CRUZE', 'ENJOY', 'FORESTER', 'OPTRA', 'SAIL', 'SPARK', 'TAVERA'],
      years: DEFAULT_CAR_YEARS,
      variants: ['LTZ 2.0L VCDI DIESEL', 'LT 1.0L TCDI DIESEL', 'LS 1.2L PETROL']
    },
    'JAGUAR': {
      models: ['F-PACE', 'XE', 'XF', 'XJ', 'F-TYPE', 'I-PACE'],
      years: DEFAULT_CAR_YEARS,
      variants: ['R-DYNAMIC S 2.0L INGENIUM DIESEL', 'PORTFOLIO 2.0L PETROL', 'SVR 5.0L V8 SUPERCHARGED']
    },
    'LEXUS': {
      models: ['ES 300H', 'LC 500H', 'LS 500H', 'LX 500D', 'NX', 'RX'],
      years: DEFAULT_CAR_YEARS,
      variants: ['350H LUXURY SELF-CHARGING HYBRID', 'ES 300H EXQUISITE', 'LX 500D TWIN TURBO V6']
    },
    'CITROEN': {
      models: ['BASALT', 'C3', 'C3 AIRCROSS', 'C5 AIRCROSS', 'EC3'],
      years: DEFAULT_CAR_YEARS,
      variants: ['SHINE 1.2L PURETECH TURBO AT', 'FEEL 1.2L NA MT', 'SHINE 2.0L HDI DIESEL']
    },
    'BYD': {
      models: ['ATTO 3', 'E6', 'SEAL', 'SEALION 6'],
      years: DEFAULT_CAR_YEARS,
      variants: ['EXTENDED RANGE BLADE BATTERY 60.48KWH', 'EXCELLENCE AWD 530HP DUAL MOTOR', 'PREMIUM RWD']
    },
    'FIAT': {
      models: ['500', 'ABARTH PUNTO', 'AVVENTURA', 'LINEA', 'PALIO', 'PUNTO EVO', 'URBAN CROSS'],
      years: DEFAULT_CAR_YEARS,
      variants: ['ABARTH 1.4L T-JET 145HP', 'EMOTION 1.3L MULTIJET DIESEL 90HP', 'DYNAMIC 1.2L FIRE']
    },
    'MORRIS GARAGES': {
      models: ['ASTOR', 'COMET EV', 'GLOSTER', 'HECTOR', 'HECTOR PLUS', 'WINDSOR EV', 'ZS EV'],
      years: DEFAULT_CAR_YEARS,
      variants: ['SAVVY PRO 2.0L KRYOTEC DIESEL 6MT', 'SHARP PRO 1.5L TURBO CVT', 'SAVVY 4WD 2.0L TWIN TURBO DIESEL']
    },
    'MERCEDES-BENZ': {
      models: ['A-CLASS', 'AMG GT', 'B-CLASS', 'C-CLASS', 'CLA', 'CLS', 'E-CLASS', 'EQA', 'EQB', 'EQC', 'EQE', 'EQS', 'G-WAGON / G-CLASS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'MAYBACH S-CLASS', 'S-CLASS', 'SL-CLASS'],
      years: DEFAULT_CAR_YEARS,
      variants: ['C 220D AMG LINE', 'E 220D EXCLUSIVE LWB', 'GLC 300 4MATIC', 'G 63 AMG 4.0L V8']
    },
    'JEEP': {
      models: ['CHEROKEE', 'COMPASS', 'GRAND CHEROKEE', 'MERIDIAN', 'WRANGLER'],
      years: DEFAULT_CAR_YEARS,
      variants: ['MODEL S 2.0L MULTIJET II 4X4 9AT', 'RUBICON 2.0L TURBO 4X4 ROCK-TRAC', 'LIMITED 2.0L DIESEL 6MT']
    },
    'ISUZU': {
      models: ['D-MAX V-CROSS', 'HI-LANDER', 'MU-7', 'MU-X'],
      years: DEFAULT_CAR_YEARS,
      variants: ['Z-PRESTIGE 1.9L DDI 4X4 AT', 'Z 1.9L DDI 4X2 AT', 'HI-LANDER 2.5L DDI MT']
    },
    'KIA': {
      models: ['CARENS', 'CARNIVAL', 'EV6', 'EV9', 'SELTOS', 'SONET', 'SYROS'],
      years: DEFAULT_CAR_YEARS,
      variants: ['GTX+ 1.5L TURBO GDI DCT', 'HTX+ 1.5L CRDI VGT IMT', 'GT-LINE AWD 77.4KWH EV']
    },
    'BMW': {
      models: ['1 SERIES', '2 SERIES', '3 SERIES', '3 SERIES GRAN LIMOUSINE', '5 SERIES', '6 SERIES', '7 SERIES', 'I4', 'I7', 'IX', 'IX1', 'M2', 'M3', 'M4', 'M5', 'X1', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4'],
      years: DEFAULT_CAR_YEARS,
      variants: ['330I M SPORT GRAN LIMOUSINE', '520D LUXURY LINE', 'X5 XDRIVE30D M SPORT', 'M3 COMPETITION XDRIVE']
    },
    'AUDI': {
      models: ['A3', 'A4', 'A6', 'A8L', 'E-TRON', 'E-TRON GT', 'Q2', 'Q3', 'Q3 SPORTBACK', 'Q5', 'Q7', 'Q8', 'RS5', 'RS7', 'S5 SPORTBACK', 'TT'],
      years: DEFAULT_CAR_YEARS,
      variants: ['40 TFSI TECHNOLOGY', '45 TFSI QUATTRO TECHNOLOGY', '55 TFSI QUATTRO MATRIX LED']
    },
    'MITSUBISHI': {
      models: ['CEDIA', 'LANCER', 'MONTERO', 'OUTLANDER', 'PAJERO', 'PAJERO SPORT'],
      years: DEFAULT_CAR_YEARS,
      variants: ['SELECT PLUS 2.5L DI-D 4X4 MT', '2.0L MIVEC CVT', 'CEDIA 2.0L SPORTS MT']
    },
    'PORSCHE': {
      models: ['718 BOXSTER', '718 CAYMAN', '911 CARRERA', 'CAYENNE', 'MACAN', 'PANAMERA', 'TAYCAN'],
      years: DEFAULT_CAR_YEARS,
      variants: ['CAYENNE COUPÉ 3.0L V6 TURBO', 'MACAN GTS 2.9L TWIN-TURBO V6', '911 CARRERA S 3.0L FLAT-6']
    },
    'DATSUN': {
      models: ['GO', 'GO+', 'REDI-GO'],
      years: DEFAULT_CAR_YEARS,
      variants: ['T(O) 1.2L CVT', 'T(O) 1.0L SMART DRIVE AMT', 'D 0.8L MT']
    },
    'BENTLEY': {
      models: ['BENTAYGA', 'CONTINENTAL GT', 'FLYING SPUR'],
      years: DEFAULT_CAR_YEARS,
      variants: ['V8 4.0L TWIN TURBO 542HP', 'W12 6.0L TWIN TURBO 626HP', 'HYBRID 3.0L V6 PHEV']
    },
    'VOLVO': {
      models: ['C40 RECHARGE', 'EX30', 'EX90', 'S60', 'S90', 'V90 CROSS COUNTRY', 'XC40', 'XC40 RECHARGE', 'XC60', 'XC90'],
      years: DEFAULT_CAR_YEARS,
      variants: ['B5 ULTIMATE MILD HYBRID AWD', 'TWIN MOTOR AWD 408HP EV', 'D5 INSCRIPTION AWD']
    },
    'LAND ROVER': {
      models: ['DEFENDER 110', 'DEFENDER 130', 'DEFENDER 90', 'DISCOVERY', 'DISCOVERY SPORT', 'RANGE ROVER', 'RANGE ROVER EVOQUE', 'RANGE ROVER SPORT', 'RANGE ROVER VELAR'],
      years: DEFAULT_CAR_YEARS,
      variants: ['DEFENDER 110 HSE 3.0L D300 AWD', 'RANGE ROVER AUTOBIOGRAPHY 3.0L LWB', 'DYNAMIC SE 2.0L']
    },
    'FORCE': {
      models: ['GURKHA 3-DOOR', 'GURKHA 5-DOOR', 'TRAX CASH KING', 'TRAX CRUISER', 'TRAX TOOFAN', 'TRAVELER', 'URBANIA'],
      years: DEFAULT_CAR_YEARS,
      variants: ['GURKHA 5-DOOR 2.6L FM CR DIESEL 4X4', 'GURKHA 3-DOOR 2.6L CR 4X4', 'URBANIA 3350 WB']
    }
  };

  // VAHAN Number Plate Vehicle Lookup System
  const getVahanVehicleInfo = (plateNo) => {
    const cleanPlate = plateNo.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    const statePrefix = cleanPlate.substring(0, 2);

    const stateMap = {
      'MH': 'RTO Mumbai Central, Maharashtra',
      'DL': 'RTO Delhi Mall Road, Delhi NCR',
      'KA': 'RTO Bengaluru Central, Karnataka',
      'GJ': 'RTO Ahmedabad East, Gujarat',
      'HR': 'RTO Gurugram North, Haryana',
      'UP': 'RTO Noida / Lucknow, Uttar Pradesh',
      'WB': 'RTO Kolkata South, West Bengal',
      'TN': 'RTO Chennai Central, Tamil Nadu',
      'KL': 'RTO Ernakulam, Kerala',
      'TS': 'RTO Hyderabad, Telangana',
      'RJ': 'RTO Jaipur North, Rajasthan',
      'MP': 'RTO Bhopal, Madhya Pradesh',
      'PB': 'RTO Chandigarh, Punjab'
    };

    const rtoLocation = stateMap[statePrefix] || `RTO Region (${statePrefix || 'IND'}), India`;
    const lastNum = parseInt(cleanPlate.slice(-1) || '1', 10);

    const mockVehicles = [
      { make: 'MARUTI', model: 'SWIFT', variant: '1.2L DUALJET ZXI+ (2022)', engine: '1197 cc Petrol BS6', color: 'Pearl Arctic White', owner: 'Rahul Sharma' },
      { make: 'HYUNDAI', model: 'CRETA', variant: '1.5L CRDI DIESEL SX(O) (2023)', engine: '1493 cc Turbo Diesel', color: 'Titan Grey', owner: 'Priya Verma' },
      { make: 'TATA', model: 'NEXON', variant: '1.2L REVOTRON FEARLESS+ (2024)', engine: '1199 cc Turbo Petrol', color: 'Flame Red', owner: 'Arjun Nair' },
      { make: 'MAHINDRA', model: 'THAR', variant: '2.2L MHAWK DIESEL 4X4 LX (2023)', engine: '2184 cc Turbo Diesel', color: 'Napoli Black', owner: 'Vikram Singh' },
      { make: 'SKODA', model: 'KUSHAQ', variant: '1.5L TSI MONTE CARLO DSG (2023)', engine: '1498 cc Turbo Petrol', color: 'Tornado Red', owner: 'Amit Patel' },
      { make: 'HONDA', model: 'CITY', variant: '1.5L I-VTEC ZX CVT (2022)', engine: '1498 cc i-VTEC Petrol', color: 'Platinum White', owner: 'Suresh Kumar' },
      { make: 'TOYOTA', model: 'FORTUNER', variant: '2.8L 4X4 SIGMA-4 AT (2024)', engine: '2755 cc Turbo Diesel', color: 'Super White', owner: 'Sagar Travels' },
      { make: 'VW', model: 'VIRTUS', variant: '1.5L TSI GT LINE DSG (2023)', engine: '1498 cc TSI Petrol', color: 'Wild Cherry Red', owner: 'Rohan Mehta' },
      { make: 'KIA', model: 'SELTOS', variant: '1.5L TURBO GDI GTX+ (2024)', engine: '1482 cc Turbo Petrol', color: 'Pewter Olive', owner: 'Ananya Roy' },
      { make: 'RENAULT', model: 'KIGER', variant: '1.0L TURBO RXZ CVT (2022)', engine: '999 cc Turbo Petrol', color: 'Caspian Blue', owner: 'Deepak Joshi' }
    ];

    const selectedVehicle = mockVehicles[lastNum % mockVehicles.length];

    return {
      plate: cleanPlate || 'MH01AB1234',
      rto: rtoLocation,
      make: selectedVehicle.make,
      model: selectedVehicle.model,
      variant: selectedVehicle.variant,
      engine: selectedVehicle.engine,
      color: selectedVehicle.color,
      owner: selectedVehicle.owner,
      registrationYear: '2022 - 2024',
      fitnessValidTill: '2037',
      insuranceStatus: 'Active (National Insurance Co.)'
    };
  };

  const handleVehicleSearch = (e) => {
    e.preventDefault();
    if (!selectedBrand) {
      showToast('⚠️ Please select at least a Car Brand!');
      return;
    }

    if (setSelectedVehicle) {
      setSelectedVehicle({
        makeName: selectedBrand,
        modelName: selectedModel || 'All Models',
        year: selectedYear || 'All Years'
      });
    }

    if (setGlobalSelectedBrand) {
      setGlobalSelectedBrand(selectedBrand);
    }

    if (setSearchQuery) {
      setSearchQuery(selectedModel ? `${selectedBrand} ${selectedModel}` : selectedBrand);
    }

    showToast(`🚗 Filtering spare parts for: ${selectedBrand} ${selectedModel ? `${selectedModel} ` : ''}${selectedYear ? `(${selectedYear})` : ''}`);
    navigateTo('catalog');
  };

  // Top Categories Database
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
    'BYD': '/images/logos/byd.png',
    'FIAT': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Fiat_logo.svg/320px-Fiat_logo.svg.png',
    'MORRIS GARAGES': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/MG_Motor_logo.svg/320px-MG_Motor_logo.svg.png',
    'MERCEDES-BENZ': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/320px-Mercedes-Logo.svg.png',
    'BMW': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/320px-BMW.svg.png',
    'AUDI': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Audi-Logo_2016.svg/320px-Audi-Logo_2016.svg.png',
    'KIA': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Kia-logo.svg/320px-Kia-logo.svg.png',
    'JEEP': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Jeep_logo.svg/320px-Jeep_logo.svg.png'
  };

  const topCategories = [
    {
      id: 'engine-parts',
      title: 'Engine Parts',
      count: '1,420+ Items',
      icon: '⚙️',
      image: '/engine-parts-category.jpg',
      badge: 'Core',
      desc: 'Pistons, Spark Plugs, Belts & Mounts'
    },
    {
      id: 'oils-fluids',
      title: 'Engine Oil & Fluids',
      count: '540+ Items',
      icon: '🛢️',
      image: '/engine-oil-category.jpg',
      badge: 'Fluids',
      desc: 'Engine Oils, Coolants, Brake Fluids'
    },
    {
      id: 'brake-system',
      title: 'Brakes',
      count: '890+ Items',
      icon: '🛑',
      image: '/brakes-category.jpg',
      badge: 'Safety',
      desc: 'Brake Pads, Rotors, Calipers & Shoes'
    },
    {
      id: 'filters',
      title: 'Filters',
      count: '1,200+ Items',
      icon: '🧹',
      image: '/filters-category.jpg',
      badge: 'Maintenance',
      desc: 'Air, Oil, Cabin & Fuel Filters'
    },
    {
      id: 'body-bumper',
      title: 'Body & Bumper',
      count: '950+ Items',
      icon: '🚗',
      image: '/body-bumper-category.jpg',
      badge: 'Exterior',
      desc: 'Bumpers, Mirrors, Fenders & Grilles'
    },
    {
      id: 'electrical',
      title: 'Electrical',
      count: '1,150+ Items',
      icon: '⚡',
      image: '/electrical-category.jpg',
      badge: 'Power',
      desc: 'Batteries, Alternators, Starters & Fuses'
    },
    {
      id: 'car-accessories',
      title: 'Accessories',
      count: '2,640+ Items',
      icon: '✨',
      image: '/car-accessories-category.jpg',
      badge: 'Style',
      desc: 'Mats, Seat Covers, Dash Cams & Alloys'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#FF5722] selection:text-white">


      {/* -------------------------------------------------------------
          2. HERO BANNER SECTION (Exact Match with White Theme)
      ------------------------------------------------------------- */}
      <section className="relative bg-[#F8FAFC] border-b border-slate-200 overflow-hidden py-12 sm:py-16 lg:py-20">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none" 
          style={{ backgroundImage: `url('/images/autozon_warehouse_bg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100/90 via-[#F8FAFC]/95 to-slate-100/80 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Typography & Hero Action */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-white text-slate-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-[#FF5722] animate-pulse"></span>
                <span>INDIA'S AUTO PARTS MARKETPLACE</span>
              </div>

              <h1 className="font-black leading-[0.9] tracking-tight text-slate-900 text-4xl sm:text-6xl lg:text-7xl font-sans uppercase">
                FIND THE RIGHT <br />
                <span className="text-[#FF5722] bg-gradient-to-r from-[#FF5722] to-amber-500 bg-clip-text text-transparent">PARTS</span> <br />
                FOR YOUR RIDE.
              </h1>
              
              <p className="text-slate-600 text-sm sm:text-base lg:text-lg font-medium max-w-xl leading-relaxed">
                From genuine OEM to trusted aftermarket — find the exact fit for your vehicle, delivered across India.
              </p>

              <div className="pt-2">
                <button 
                  onClick={() => navigateTo('catalog')}
                  className="bg-[#FF5722] hover:bg-[#e04816] text-white font-extrabold text-base px-8 py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  Shop by Category
                </button>
              </div>
            </div>

            {/* Right Card: SEARCH BY VEHICLE & NUMBER PLATE */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 text-slate-900 relative z-20">
              
              {/* SECTION A: SEARCH BY VEHICLE */}
              <div className="mb-6">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                  <span>SEARCH BY VEHICLE</span>
                </h3>

                <form onSubmit={handleVehicleSearch} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={selectedBrand}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedBrand(val);
                        setSelectedModel('');
                        setSelectedYear('');
                        setSelectedVariant('');
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-bold text-slate-800 outline-none focus:border-[#FF5722]"
                    >
                      <option value="">Brand</option>
                      {Object.keys(carDatabase).map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>

                    <select
                      value={selectedModel}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedModel(val);
                        setSelectedYear('');
                        setSelectedVariant('');
                      }}
                      disabled={!selectedBrand}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-bold text-slate-800 outline-none focus:border-[#FF5722] disabled:opacity-50"
                    >
                      <option value="">Model</option>
                      {selectedBrand && carDatabase[selectedBrand] && carDatabase[selectedBrand].models.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>

                    <select
                      value={selectedYear}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedYear(val);
                        setSelectedVariant('');
                      }}
                      disabled={!selectedModel}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-bold text-slate-800 outline-none focus:border-[#FF5722] disabled:opacity-50"
                    >
                      <option value="">Year</option>
                      {selectedBrand && carDatabase[selectedBrand] && carDatabase[selectedBrand].years.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>

                    <select
                      value={selectedVariant}
                      onChange={(e) => setSelectedVariant(e.target.value)}
                      disabled={!selectedYear}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-bold text-slate-800 outline-none focus:border-[#FF5722] disabled:opacity-50"
                    >
                      <option value="">Variant</option>
                      {getVariantsForModel(selectedBrand, selectedModel).map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#FF5722] hover:bg-[#e04816] text-white font-extrabold text-sm py-3.5 rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Find Parts</span>
                  </button>
                </form>
              </div>

              {/* Divider OR */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <span className="relative bg-white px-3 text-[10px] font-black uppercase text-slate-400">OR</span>
              </div>

              {/* SECTION B: SEARCH BY NUMBER PLATE */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">
                  SEARCH BY NUMBER PLATE
                </h3>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!numberPlateInput.trim()) return;
                    setIsSearchingVahan(true);
                    setTimeout(() => {
                      const res = getVahanVehicleInfo(numberPlateInput);
                      setVahanModalData(res);
                      setIsSearchingVahan(false);
                    }, 1200);
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="flex-1 flex items-center bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-slate-900 text-white px-2.5 py-2.5 text-[10px] font-black flex items-center gap-1 border-r border-slate-300 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                      <span>IND</span>
                    </div>
                    <input
                      type="text"
                      placeholder="MH 01 XY 0001"
                      value={numberPlateInput}
                      onChange={(e) => setNumberPlateInput(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2.5 text-sm font-extrabold text-slate-900 placeholder:text-slate-400 uppercase outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSearchingVahan}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>{isSearchingVahan ? 'Searching...' : 'Find'}</span>
                  </button>
                </form>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          PROMO CAROUSEL BANNER SECTION
      ------------------------------------------------------------- */}
      <section className="py-8 bg-white border-b border-slate-200 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between gap-8">
            
            {/* Left Content */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-cyan-400" /> CAR CARE & ACCESSORIES
                </span>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider">
                  🏷 Use Code: KAMTI3
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
                Special Savings on 7D Mats & Car Accessories
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-lg leading-relaxed">
                Waterproof 7D floor mats, 4K Dash Cams, LED Headlights & Polishers with Pan-India express delivery.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => navigateTo('catalog')}
                  className="bg-[#FF5722] hover:bg-[#e04816] text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2 active:scale-95"
                >
                  <span>Browse Accessories</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Deal Image Card */}
            <div className="w-full md:w-80 h-52 bg-slate-900 rounded-2xl border border-slate-700/80 overflow-hidden relative shadow-xl shrink-0 group">
              <img 
                src="https://images.unsplash.com/photo-1600793575654-910699b5e4d4?auto=format&fit=crop&w=600&q=80" 
                alt="KAMTI AUTOMOTIVE DEAL"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 bg-[#FF5722] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded shadow-md">
                KAMTI AUTOMOTIVE DEAL
              </div>
            </div>

            {/* Carousel Navigation Arrows */}
            <button className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/80 border border-slate-700 text-white flex items-center justify-center hover:bg-slate-800 transition">
              ‹
            </button>
            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/80 border border-slate-700 text-white flex items-center justify-center hover:bg-slate-800 transition">
              ›
            </button>

          </div>

          {/* Carousel Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="w-2 h-2 rounded-full bg-slate-600"></span>
            <span className="w-6 h-2 rounded-full bg-[#FF5722]"></span>
            <span className="w-2 h-2 rounded-full bg-slate-600"></span>
          </div>
        </div>
      </section>


      {/* -------------------------------------------------------------
          NEW: SPARES BY MAKE (BRAND GRID - PREMIUM BOODMO DESIGN)
      ------------------------------------------------------------- */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-slate-200 pb-4 gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
                <span>Spares by Make</span>
              </h2>
              <p className="text-xs text-slate-500 font-bold mt-0.5">
                Select your car brand to view 100% compatible genuine spare parts.
              </p>
            </div>
            <button
              onClick={() => navigateTo('brands')}
              className="text-[#0B5394] hover:text-[#073763] font-extrabold text-sm flex items-center gap-1.5 cursor-pointer transition-colors self-start sm:self-auto bg-blue-50/80 hover:bg-blue-100 px-4 py-2 rounded-xl"
            >
              <span>View All Brands</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3.5 sm:gap-4">
            {Object.keys(carDatabase).slice(0, 16).map(brand => {
              const isSelected = selectedBrand === brand;
              return (
                <div 
                  key={brand}
                  onClick={() => {
                    setSelectedBrand(brand);
                    setGlobalSelectedBrand(brand);
                    showToast(`Opening ${brand} models & spare parts catalog...`);
                    navigateTo('brand', brand);
                  }}
                  className={`rounded-2xl p-3.5 flex flex-col items-center justify-between h-[125px] sm:h-[135px] transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                    isSelected 
                      ? 'bg-gradient-to-b from-[#EBF4FF] to-white border-2 border-[#0B5394] shadow-lg ring-4 ring-[#0B5394]/15 -translate-y-1' 
                      : 'bg-white border border-slate-200/90 hover:border-[#0B5394] hover:bg-gradient-to-b hover:from-blue-50/40 hover:to-white hover:shadow-xl hover:-translate-y-1.5'
                  }`}
                >
                  <div className="w-full h-16 sm:h-20 flex items-center justify-center p-1 group-hover:scale-110 transition-transform duration-300">
                    <RenderBrandLogo brand={brand} logoUrl={brandLogos[brand]} />
                  </div>
                  <span className={`text-xs font-black text-center uppercase tracking-wider line-clamp-1 transition-colors mt-1 ${
                    isSelected ? 'text-[#0B5394]' : 'text-slate-800 group-hover:text-[#0B5394]'
                  }`}>
                    {brand}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          3. SHOP BY CATEGORIES SECTION (Exact AutoDukan Layout)
      ------------------------------------------------------------- */}
      {/* -------------------------------------------------------------
          3. SHOP BY CATEGORIES SECTION
      ------------------------------------------------------------- */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-10 border-b border-slate-200 pb-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
            Shop By Categories
          </h2>
          
          <button
            onClick={() => navigateTo('catalog')}
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1 shadow-md cursor-pointer"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 7-Column Uniform Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {topCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigateTo('catalog')}
              className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative w-full aspect-square bg-slate-100 rounded-xl overflow-hidden mb-3 flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-slate-900/90 text-white text-[10px] font-black px-2 py-0.5 rounded shadow backdrop-blur-sm">
                  {cat.badge}
                </span>
                <span className="absolute bottom-2 right-2 text-xl drop-shadow-md">
                  {cat.icon}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm group-hover:text-[#0B5394] transition-colors mb-1 line-clamp-1">
                  {cat.title}
                </h3>
                <p className="text-[10px] text-slate-500 font-medium mb-2 line-clamp-2 leading-snug">
                  {cat.desc}
                </p>
                <div className="text-[10px] font-black text-blue-600">
                  {cat.count}
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>


      {/* -------------------------------------------------------------
          4. BEST SELLERS & NEW ARRIVALS
      ------------------------------------------------------------- */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 border-b border-slate-200 pb-4 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
                Best Sellers <span className="text-[#0B5394]">🔥</span>
              </h2>
              <p className="text-xs text-slate-500 font-bold mt-1">Highly rated parts verified by thousands of mechanics.</p>
            </div>
            
            <button
              onClick={() => navigateTo('catalog')}
              className="text-xs font-black text-[#0B5394] hover:underline cursor-pointer flex items-center gap-1"
            >
              View Full Catalog <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            {((products || []).filter(p => p.isActive !== false).slice(0, 8)).map((prod) => (
              <div
                key={prod.id || prod.sku}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col justify-between p-4 relative shrink-0 w-[85%] sm:w-auto snap-center"
              >
                <div className="absolute top-4 right-4 z-10 bg-rose-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full shadow-md">
                  Best Seller
                </div>
                <div 
                  className="relative h-48 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-3 mb-3 cursor-pointer"
                  onClick={() => navigateTo('product-detail', prod)}
                >
                  <img src={prod.image || '/images/synthetic_engine_oil.jpg'} alt={prod.title || prod.name} onError={(e) => { e.target.src = '/images/synthetic_engine_oil.jpg'; }} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                  <span className="absolute top-2 left-2 bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded">
                    {prod.brand || prod.carBrand || 'Genuine'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="inline-block text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                    {prod.carBrand ? `Fits ${prod.carBrand} ${prod.carModel || ''}` : (prod.category || 'Genuine Part')}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-[#0B5394] transition-colors cursor-pointer" onClick={() => navigateTo('product-detail', prod)}>
                    {prod.name || prod.title}
                  </h3>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <div className="text-lg font-black text-slate-900">₹{Number(prod.sellingPrice || prod.price || 0).toLocaleString('en-IN')}</div>
                      {prod.mrp && <div className="text-xs text-slate-400 line-through">₹{Number(prod.mrp).toLocaleString('en-IN')}</div>}
                    </div>
                    
                    <div className="flex items-center gap-1.5 relative z-10">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(prod, 1);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                      >
                        + Add
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          buyNow(prod, 1);
                        }}
                        className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs px-3 py-1.5 rounded-lg transition cursor-pointer shadow-md shadow-orange-500/20"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 border-b border-slate-200 pb-4 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
                New Arrivals <span className="text-purple-500">✨</span>
              </h2>
              <p className="text-xs text-slate-500 font-bold mt-1">Fresh OEM stock arrived this week.</p>
            </div>
          </div>

          <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              {
                id: 'prod-new-1',
                title: 'Premium Cabin Air Filter with Activated Carbon',
                brand: 'BOSCH',
                compatibility: 'Fits Tata Harrier / Safari',
                price: 850,
                originalPrice: 1200,
                rating: 5.0,
                reviews: 12,
                image: '/oil_filter.jpg'
              },
              {
                id: 'prod-new-2',
                title: 'High Performance Alloy Wheels 16-Inch (Set of 4)',
                brand: 'NEO WHEELS',
                compatibility: 'Universal 16" PCD 100',
                price: 24500,
                originalPrice: 32000,
                rating: 4.7,
                reviews: 5,
                image: '/images/wheel_rim_exterior.jpg'
              },
              {
                id: 'prod-new-3',
                title: '7D Premium Leather Custom Fit Car Mats',
                brand: 'AUTOZON PRIME',
                compatibility: 'Fits Mahindra XUV700',
                price: 5200,
                originalPrice: 7500,
                rating: 4.9,
                reviews: 34,
                image: '/images/infotainment_installed.jpg' // Re-using image for now
              },
              {
                id: 'prod-new-4',
                title: 'NGK Iridium Spark Plugs Set',
                brand: 'NGK',
                compatibility: 'Fits Honda City / Jazz',
                price: 1800,
                originalPrice: 2200,
                rating: 4.8,
                reviews: 42,
                image: '/images/synthetic_engine_oil.jpg' // Re-using image for now
              }
            ].map((prod) => (
              <div
                key={prod.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col justify-between p-4 relative shrink-0 w-[85%] sm:w-auto snap-center"
              >
                <div className="absolute top-4 right-4 z-10 bg-purple-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full shadow-md">
                  New
                </div>
                <div 
                  className="relative h-48 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-3 mb-3 cursor-pointer"
                  onClick={() => navigateTo('product-detail', prod)}
                >
                  <img src={prod.image} alt={prod.title} onError={(e) => { e.target.src = '/oil_filter.jpg'; }} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                  <span className="absolute top-2 left-2 bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded">
                    {prod.brand}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="inline-block text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                    {prod.compatibility}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-[#0B5394] transition-colors cursor-pointer" onClick={() => navigateTo('product-detail', prod)}>
                    {prod.title}
                  </h3>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <div className="text-lg font-black text-slate-900">₹{prod.price.toLocaleString()}</div>
                      <div className="text-xs text-slate-400 line-through">₹{prod.originalPrice.toLocaleString()}</div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 relative z-10">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(prod, 1);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                      >
                        + Add
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          buyNow(prod, 1);
                        }}
                        className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs px-3 py-1.5 rounded-lg transition cursor-pointer shadow-md shadow-orange-500/20"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* VAHAN Registration Verification Modal */}
      {vahanModalData && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#0F172A] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600/30 p-2.5 rounded-2xl border border-blue-400/40">
                  <Car className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black uppercase">
                      ✓ VAHAN Verified
                    </span>
                    <span className="text-xs text-slate-300 font-mono">Ministry of Road Transport</span>
                  </div>
                  <h3 className="text-lg font-black text-white font-mono mt-0.5">{vahanModalData.plate}</h3>
                </div>
              </div>
              <button
                onClick={() => setVahanModalData(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition font-bold"
              >
                ✕
              </button>
            </div>

            {/* Vehicle Details Card Body */}
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-500">Vehicle Brand & Model:</span>
                  <span className="text-sm font-black text-slate-900">{vahanModalData.make} {vahanModalData.model}</span>
                </div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-500">Exact Trim Variant:</span>
                  <span className="text-xs font-black text-blue-700">{vahanModalData.variant}</span>
                </div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-500">Engine & Fuel Spec:</span>
                  <span className="text-xs font-bold text-slate-800">{vahanModalData.engine}</span>
                </div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-500">Registered RTO Jurisdiction:</span>
                  <span className="text-xs font-bold text-slate-800">{vahanModalData.rto}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Insurance & Fitness:</span>
                  <span className="text-xs font-bold text-emerald-600">{vahanModalData.insuranceStatus}</span>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="text-xs text-emerald-900 font-bold">
                  100% Fitment Guarantee applied for {vahanModalData.make} {vahanModalData.model}. All catalog products are automatically filtered for your car.
                </div>
              </div>

              <button
                onClick={() => {
                  setVahanModalData(null);
                  showToast(`🚀 Showing 100% Compatible Spare Parts for ${vahanModalData.plate} (${vahanModalData.make} ${vahanModalData.model})`);
                  navigateTo('catalog');
                }}
                className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white font-black text-sm py-4 rounded-2xl shadow-xl shadow-[#FF5722]/30 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>View Compatible Spare Parts for {vahanModalData.model}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sagar Travels Cross-Service Partner Banner */}
      <section className="bg-gradient-to-r from-[#0B192C] via-[#0F172A] to-[#0B192C] text-white py-8 border-t border-slate-800 font-sans mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 shadow-inner">
              <PhoneCall className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/30">
                SAGAR TRAVELS CROSS-SERVICE PARTNER
              </span>
              <h4 className="text-base sm:text-lg font-black text-white mt-1">Need a Luxury Cab or Outstation Car Rental Too?</h4>
              <p className="text-xs text-slate-300 font-medium mt-0.5">Book 24x7 verified cabs, tour packages & airport transfers with Sagar Travels.</p>
            </div>
          </div>
          <a 
            href="https://www.thesagartravels.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-[#FF5722] to-[#E64A19] hover:from-[#E64A19] hover:to-[#D84315] text-white font-extrabold text-xs px-6 py-3.5 rounded-full shadow-lg shadow-[#FF5722]/25 transition shrink-0 cursor-pointer flex items-center gap-2"
          >
            <span>Book Cab with Sagar Travels</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

    </div>
  );
};
