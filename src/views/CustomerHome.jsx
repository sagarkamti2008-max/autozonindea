import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search, Car, ShieldCheck, Truck, Clock, RefreshCw, Star, ArrowRight,
  Package, Wrench, Sparkles, ChevronRight, Zap, CheckCircle2, Award, Heart,
  Sliders, MessageCircle, ChevronLeft, ArrowUpRight, ChevronDown, Disc,
  Settings, Armchair, Droplets, Gauge, Filter, Flame, CircleDot, Fan,
  Wind, Activity, Fuel, Circle, Layers, ShoppingCart
} from 'lucide-react';

const CategoryPillIcon = ({ name, isActive }) => {
  const color = isActive ? '#F59E0B' : '#0F172A';

  switch (name) {
    case 'SERVICE PARTS':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
      );
    case 'STEERING & SUSPENSION':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9"/>
          <circle cx="12" cy="12" r="3"/>
          <line x1="12" y1="3" x2="12" y2="9"/>
          <line x1="12" y1="15" x2="12" y2="21"/>
          <line x1="3" y1="12" x2="9" y2="12"/>
          <line x1="15" y1="12" x2="21" y2="12"/>
        </svg>
      );
    case 'CONSUMABLES, GENERAL':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 2h8v4H8zM6 6h12v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6z"/>
          <circle cx="12" cy="13" r="2.5"/>
        </svg>
      );
    case 'ELECTRICAL':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      );
    case 'WHEELS':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9"/>
          <circle cx="12" cy="12" r="3.5"/>
          <path d="M12 3v5.5M12 15.5V21M3 12h5.5M15.5 12H21"/>
        </svg>
      );
    case 'VISION & SAFETY':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      );
    case 'INTERIORS':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="7" y="3" width="10" height="7" rx="2"/>
          <path d="M5 10h14v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8z"/>
          <line x1="3" y1="14" x2="21" y2="14"/>
        </svg>
      );
    case 'BODY':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 13l2-5h14l2 5M2 13h20v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4z"/>
          <circle cx="7" cy="17" r="2"/>
          <circle cx="17" cy="17" r="2"/>
        </svg>
      );
    case 'MISCELLANEOUS':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 6l6 6M4 16l6 6M8 8l8 8M16 4l4 4"/>
          <circle cx="6" cy="6" r="2"/>
          <circle cx="18" cy="18" r="2"/>
        </svg>
      );
    case 'FILTERS':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="3" width="12" height="18" rx="3"/>
          <line x1="6" y1="8" x2="18" y2="8"/>
          <line x1="6" y1="13" x2="18" y2="13"/>
          <line x1="6" y1="18" x2="18" y2="18"/>
        </svg>
      );
    case 'ENGINE':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="3" width="6" height="6" rx="1"/>
          <rect x="14" y="3" width="6" height="6" rx="1"/>
          <path d="M7 9v12M17 9v12M3 21h8M13 21h8"/>
        </svg>
      );
    case 'BRAKES':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9"/>
          <circle cx="12" cy="12" r="3"/>
          <rect x="15" y="4" width="5" height="7" rx="1"/>
        </svg>
      );
    case 'HVAC':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 12c-2-3 0-6 2-6s2 3 0 6c3 2 6 0 6-2s-3-2-6 0c2 3 0 6-2 6s-2-3 0-6c-3-2-6 0-6 2s3 2 6 0z"/>
        </svg>
      );
    case 'TRANSMISSION':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="6" r="2.5"/>
          <circle cx="18" cy="6" r="2.5"/>
          <circle cx="6" cy="18" r="2.5"/>
          <circle cx="18" cy="18" r="2.5"/>
          <path d="M6 8.5v7M18 8.5v7M8.5 6h7M8.5 18h7M12 6v12"/>
        </svg>
      );
    case 'COOLING':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2"/>
          <line x1="7" y1="5" x2="7" y2="19"/>
          <line x1="11" y1="5" x2="11" y2="19"/>
          <line x1="15" y1="5" x2="15" y2="19"/>
        </svg>
      );
    case 'EXHAUST':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12h4l2-3h8l2 3h4"/>
          <line x1="6" y1="12" x2="6" y2="17"/>
          <line x1="18" y1="12" x2="18" y2="17"/>
        </svg>
      );
    case 'FUEL SYSTEM':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 22V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v17"/>
          <path d="M13 11h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4"/>
          <line x1="7" y1="8" x2="11" y2="8"/>
        </svg>
      );
    case 'OILS, COOLANTS, FLUIDS':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2h4v3h-4z"/>
          <path d="M6 7l4-2h4l4 2v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7z"/>
          <path d="M12 12c-1.5 1.5-2 2.5-2 3.5a2 2 0 0 0 4 0c0-1-.5-2-2-3.5z"/>
        </svg>
      );
    case 'CLUTCH':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9"/>
          <circle cx="12" cy="12" r="4"/>
          <line x1="12" y1="3" x2="12" y2="8"/>
          <line x1="12" y1="16" x2="12" y2="21"/>
          <line x1="3" y1="12" x2="8" y2="12"/>
          <line x1="16" y1="12" x2="21" y2="12"/>
        </svg>
      );
    case 'BODY SHOP':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="20" x2="20" y2="20"/>
          <path d="M6 16l6-8 6 8"/>
          <path d="M6 12l6 8 6-8"/>
          <rect x="2" y="5" width="20" height="3" rx="1"/>
        </svg>
      );
    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      );
  }
};

export const CustomerHome = () => {
  const {
    products,
    selectedVehicle,
    setIsVehicleModalOpen,
    addToCart,
    toggleWishlist,
    wishlist,
    navigateTo,
    setSelectedCategory,
    setSelectedBrand,
    setSearchQuery
  } = useStore();

  const [heroSearch, setHeroSearch] = useState('');
  const [activeCategoryPill, setActiveCategoryPill] = useState('SERVICE PARTS');
  const [productTab, setProductTab] = useState('bestsellers'); // 'bestsellers' or 'newarrivals'
  const [subcatPage, setSubcatPage] = useState(1);
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSectionExpand = (secId) => {
    setExpandedSections(prev => ({ ...prev, [secId]: !prev[secId] }));
  };

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigateTo('catalog');
    }
  };

  const promoCards = [
    {
      id: 1,
      discount: '15% OFF',
      title: 'ON PLASTIC PARTS',
      brand: 'Anu Industries AM group',
      image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=500&q=80',
      bgGradient: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
      badgeBg: '#0284C7',
      category: 'interiors'
    },
    {
      id: 2,
      discount: '35% OFF',
      title: 'ON ALL CAR FILTERS',
      brand: 'MANN FILTER',
      image: 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=500&q=80',
      bgGradient: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
      badgeBg: '#047857',
      category: 'filters'
    },
    {
      id: 3,
      discount: '28% OFF',
      title: 'ON BRAKE DISCS',
      brand: 'K-TEK BRAKES',
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&q=80',
      bgGradient: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
      badgeBg: '#1D4ED8',
      category: 'brakes'
    }
  ];

  const categoryPills = [
    { name: 'ENGINE PARTS', icon: Flame, catKey: 'engine_parts' },
    { name: 'BRAKING SYSTEM', icon: CircleDot, catKey: 'braking_system' },
    { name: 'SUSPENSION & STEERING', icon: Disc, catKey: 'suspension_steering' },
    { name: 'FILTERS & OILS', icon: Droplets, catKey: 'filters_oils' },
    { name: 'LIGHTING & ELECTRICAL', icon: Zap, catKey: 'lighting_electrical' },
    { name: 'INTERIOR & EXTERIOR ACCESSORIES', icon: Sparkles, catKey: 'interior_exterior_accessories' },
    { name: 'SERVICE PARTS', icon: Wrench, catKey: 'filters_oils' },
    { name: 'CLUTCH & TRANSMISSION', icon: Layers, catKey: 'engine_parts' },
    { name: 'CAR CARE & DETAILING', icon: ShieldCheck, catKey: 'interior_exterior_accessories' }
  ];

  const visualSubcategoriesPage1 = [
    { title: 'SPARK PLUG', image: '/spark_plug.jpg', query: 'Spark Plug' },
    { title: 'BLADE, WIPER SET', image: '/wiper_blades.jpg', query: 'Wiper' },
    { title: 'LAMP ASSY, HEAD (WITH MOTOR, RH)', image: '/headlight_assy.jpg', query: 'Headlight' },
    { title: 'PUMP ASSY, FUEL (ELECTRONIC)', image: '/clean_fuel_pump.png', query: 'Fuel Pump' },
    { title: 'PAD SET, BRAKE (RR)', image: '/clean_pad_rr.png', query: 'Brake Pad' },
    { title: 'FILTER, OIL', image: '/clean_oil_filter.png', query: 'Oil Filter' },
    { title: 'DISC, BRAKE (RR)', image: '/brake_disc_rr.jpg', query: 'Brake Disc' },
    { title: 'DISC, BRAKE (FR)', image: '/clean_shock.png', query: 'Front Brake Disc' },
    { title: 'COIL ASSY, IGNITION', image: '/ignition_coil.jpg', query: 'Ignition Coil' },
    { title: 'COMPRESSOR ASSY, A/C', image: '/ac_compressor.jpg', query: 'Compressor' },
    { title: 'FAN ASSY, RADIATOR', image: '/radiator_fan.jpg', query: 'Radiator Fan' },
    { title: 'LINING, FENDER (RH/LH)', image: '/clean_fender_lining.png', query: 'Fender' }
  ];

  const visualSubcategoriesPage2 = [
    { title: 'LINING, FENDER (RR, RH)', image: '/fender_lining.jpg', query: 'Fender' },
    { title: 'SWITCH, COMBINATION', image: '/clean_switch.png', query: 'Combination Switch' },
    { title: 'SHOCK ABSORBER SET (FR)', image: '/clean_shock.png', query: 'Shock Absorber' },
    { title: 'CLUTCH SET', image: '/clean_clutch.png', query: 'Clutch Set' },
    { title: 'PAD SET, BRAKE (FR)', image: '/clean_pad_fr.png', query: 'Front Brake Pad' }
  ];

  const steeringSuspensionPages = {
    1: [
      { title: 'SHOCK ABSORBER (FR, RH)', image: '/steering_suspension/item_1.png', query: 'Shock Absorber' },
      { title: 'SHOCK ABSORBER SET (RR)', image: '/steering_suspension/item_2.png', query: 'Shock Absorber Set' },
      { title: 'SHOCK ABSORBER (RR, RH)', image: '/steering_suspension/item_3.png', query: 'Rear Right Shock' },
      { title: 'SHOCK ABSORBER (RR, LH)', image: '/steering_suspension/item_4.png', query: 'Rear Left Shock' },
      { title: 'SHOCK ABSORBER (FR, LH)', image: '/steering_suspension/item_5.png', query: 'Front Left Shock' },
      { title: 'SHOCK ABSORBER (RR)', image: '/steering_suspension/item_6.png', query: 'Rear Shock' },
      { title: 'SHOCK ABSORBER (FR)', image: '/steering_suspension/item_7.png', query: 'Front Shock' },
      { title: 'STEERING, HORN CAP', image: '/steering_suspension/item_8.png', query: 'Horn Cap' },
      { title: 'BELT, POWER STEERING', image: '/steering_suspension/item_9.png', query: 'Steering Belt' },
      { title: 'JOINT CROSS, UNIVERSAL', image: '/steering_suspension/item_10.png', query: 'Universal Joint' },
      { title: 'KNUCKLE, STEERING (FR, LH)', image: '/steering_suspension/item_11.png', query: 'Steering Knuckle' },
      { title: 'LINK BUSH (FR)', image: '/steering_suspension/item_12.png', query: 'Link Bush' }
    ],
    2: [
      { title: 'SUPPORT, STRUT (FR)', image: '/steering_suspension/item_13.png', query: 'Strut Support' },
      { title: 'LINK ROD ASSY, CENTRE', image: '/steering_suspension/item_14.png', query: 'Link Rod' },
      { title: 'END SET, TIE ROD', image: '/steering_suspension/item_15.png', query: 'Tie Rod End Set' },
      { title: 'END, TIE ROD (LH)', image: '/steering_suspension/item_16.png', query: 'Tie Rod End LH' },
      { title: 'END, TIE ROD (RH)', image: '/steering_suspension/item_17.png', query: 'Tie Rod End RH' },
      { title: 'BALL JOINT, STABILIZER BAR (FR)', image: '/steering_suspension/item_18.png', query: 'Stabilizer Ball Joint' },
      { title: 'BALL JOINT, STABILIZER BAR (LH)', image: '/steering_suspension/item_19.png', query: 'Stabilizer Ball Joint LH' },
      { title: 'BALL JOINT, STABILIZER BAR (RH)', image: '/steering_suspension/item_20.png', query: 'Stabilizer Ball Joint RH' },
      { title: 'BALL JOINT, STABILIZER BAR (RR)', image: '/steering_suspension/item_21.png', query: 'Stabilizer Ball Joint RR' },
      { title: 'BALL JOINT, UPPER', image: '/steering_suspension/item_22.png', query: 'Upper Ball Joint' },
      { title: 'PIPE, POWER STEERING', image: '/steering_suspension/item_23.png', query: 'Power Steering Pipe' },
      { title: 'PULLEY, POWER STEERING PUMP', image: '/steering_suspension/item_24.png', query: 'Steering Pulley' }
    ],
    3: [
      { title: 'PUMP, POWER STEERING', image: '/steering_suspension/item_25.png', query: 'Power Steering Pump' },
      { title: 'ARM, LOWER CONTROL', image: '/steering_suspension/item_26.png', query: 'Lower Control Arm' },
      { title: 'ARM, LOWER CONTROL (LH)', image: '/steering_suspension/item_27.png', query: 'Lower Control Arm LH' },
      { title: 'ARM, LOWER CONTROL (LOWER, LH)', image: '/steering_suspension/item_28.png', query: 'Lower Arm LH' },
      { title: 'ARM, LOWER CONTROL (LOWER, RH)', image: '/steering_suspension/item_29.png', query: 'Lower Arm RH' },
      { title: 'ARM, LOWER CONTROL (RH)', image: '/steering_suspension/item_30.png', query: 'Lower Control Arm RH' },
      { title: 'ARM, LOWER CONTROL (RR, LH)', image: '/steering_suspension/item_31.png', query: 'Lower Arm RR LH' },
      { title: 'ARM, LOWER CONTROL (RR, RH)', image: '/steering_suspension/item_32.png', query: 'Lower Arm RR RH' },
      { title: 'ARM, TRAILING (WITH BUSH)', image: '/steering_suspension/item_33.png', query: 'Trailing Arm' },
      { title: 'BALL JOINT SET, STEERING', image: '/steering_suspension/item_34.png', query: 'Steering Ball Joint' },
      { title: 'RUBBER, CENTRE JOINT', image: '/steering_suspension/item_35.png', query: 'Centre Joint Rubber' },
      { title: 'SHAFT ASSY, PROPELLER (FR, 4X4)', image: '/steering_suspension/item_36.png', query: 'Propeller Shaft' }
    ],
    4: [
      { title: 'SHAFT ASSY, PROPELLER (RR)', image: '/steering_suspension/item_37.png', query: 'Propeller Shaft RR' },
      { title: 'SHAFT, STEERING INTERMEDIATE', image: '/steering_suspension/item_38.png', query: 'Steering Shaft' },
      { title: 'SPACER, COIL SPRING (EXTRA HEIGHT)', image: '/steering_suspension/item_39.png', query: 'Spring Spacer' },
      { title: 'SPRING, COIL (FR)', image: '/steering_suspension/item_40.png', query: 'Coil Spring FR' },
      { title: 'SPRING, COIL (RR)', image: '/steering_suspension/item_41.png', query: 'Coil Spring RR' },
      { title: 'SPRING, LEAF', image: '/steering_suspension/item_42.png', query: 'Leaf Spring' },
      { title: 'STEERING BRACKET', image: '/steering_suspension/item_43.png', query: 'Steering Bracket' },
      { title: 'STEERING SHOCK ABSORBER', image: '/steering_suspension/item_44.png', query: 'Steering Damper' },
      { title: 'STRUT ASSY (FR, LH)', image: '/steering_suspension/item_45.png', query: 'Strut Assy LH' },
      { title: 'STRUT ASSY (FR, RH)', image: '/steering_suspension/item_46.png', query: 'Strut Assy RH' },
      { title: 'STRUT PLATE (FR)', image: '/steering_suspension/item_47.png', query: 'Strut Plate FR' },
      { title: 'STRUT PLATE (RR)', image: '/steering_suspension/item_48.png', query: 'Strut Plate RR' }
    ],
    5: [
      { title: 'BALL JOINT, INNER', image: '/steering_suspension/item_49.png', query: 'Inner Ball Joint' },
      { title: 'BALL JOINT, LOWER (LH)', image: '/steering_suspension/item_50.png', query: 'Lower Ball Joint LH' },
      { title: 'BALL JOINT, LOWER (RH)', image: '/steering_suspension/item_51.png', query: 'Lower Ball Joint RH' },
      { title: 'BALL JOINT, OUTER', image: '/steering_suspension/item_52.png', query: 'Outer Ball Joint' },
      { title: 'BALL JOINT, STEERING (INNER)', image: '/steering_suspension/item_53.png', query: 'Inner Steering Joint' },
      { title: 'SHOCK ABSORBER SET (FR)', image: '/steering_suspension/item_54.png', query: 'Front Shock Set' },
      { title: 'BALL JOINT, STEERING', image: '/steering_suspension/item_55.png', query: 'Steering Ball Joint' },
      { title: 'BALL JOINT, LOWER', image: '/steering_suspension/item_56.png', query: 'Lower Ball Joint' },
      { title: 'STRUT ASSY (FR)', image: '/steering_suspension/item_57.png', query: 'Strut Assy FR' },
      { title: 'BEARING, CENTER JOINT', image: '/steering_suspension/item_58.png', query: 'Center Joint Bearing' },
      { title: 'BEARING, STRUT SUPPORT (FR)', image: '/steering_suspension/item_59.png', query: 'Strut Support Bearing' },
      { title: 'BOX ASSY, STEERING GEAR', image: '/steering_suspension/item_60.png', query: 'Steering Gearbox' }
    ],
    6: [
      { title: 'BUSH, STABILIZER BAR', image: '/steering_suspension/item_1.png', query: 'Stabilizer Bush' },
      { title: 'BOOT, STEERING GEARBOX', image: '/steering_suspension/item_7.png', query: 'Gearbox Boot' },
      { title: 'RACK, STEERING GEAR', image: '/steering_suspension/item_11.png', query: 'Steering Rack' },
      { title: 'PIN, KING PIN SET', image: '/steering_suspension/item_24.png', query: 'King Pin' },
      { title: 'ROD, TIE ROD ASSY', image: '/steering_suspension/item_34.png', query: 'Tie Rod Assy' },
      { title: 'BEARING, WHEEL HUB (FR)', image: '/steering_suspension/item_44.png', query: 'Wheel Hub Bearing' }
    ]
  };

  // SECTION 1: CAR ACCESSORIES, INTERIOR & GADGETS
  const secCarAccessories = [
    { id: 'acc-1', name: 'Wiper Blades (Front)', desc: 'Sabse zyada bikne wala part, har season demand', price: 499, originalPrice: 899, image: '/sections/wiper_blades.jpg', badge: '🔥 TOP SELLER', rating: 4.9 },
    { id: 'acc-2', name: 'Wiper Blades (Rear)', desc: 'Hatchback & SUV rear glass wiper blade', price: 299, originalPrice: 599, image: '/sections/wiper_rear.jpg', badge: '🌧️ REAR WIPER', rating: 4.8 },
    { id: 'acc-3', name: 'Car Mobile Holders', desc: 'Dashboard, AC vent, magnetic mounts', price: 349, originalPrice: 699, image: '/sections/mobile_holder.jpg', badge: '📱 FAST CHARGE', rating: 4.8 },
    { id: 'acc-4', name: 'Car Perfumes & Air Fresheners', desc: 'Gel, spray & automatic diffuse kits', price: 249, originalPrice: 499, image: '/sections/car_perfume.jpg', badge: '✨ POPULAR', rating: 4.7 },
    { id: 'acc-5', name: 'Microfiber Cloths (400+ GSM)', desc: 'Car cleaning plush towels set of 4', price: 299, originalPrice: 599, image: '/sections/microfiber.jpg', badge: '✨ BEST SELLER', rating: 4.8 },
    { id: 'acc-6', name: 'Car Fast Chargers', desc: 'Dual-port & Type-C fast charging adapters', price: 399, originalPrice: 799, image: '/sections/fast_charger.jpg', badge: '⚡ FAST CHARGE', rating: 4.8 },
    { id: 'acc-7', name: 'Interior Ambient Lighting', desc: 'App & remote control dashboard strip lights', price: 699, originalPrice: 1499, image: '/sections/ambient_light.jpg', badge: '🌈 RGB LED', rating: 4.7 },
    { id: 'acc-8', name: 'Car Key Fob Shells & Covers', desc: 'Silicone button protective key cover', price: 199, originalPrice: 399, image: '/sections/key_fob.jpg', badge: '🔑 KEY PROTECT', rating: 4.9 },
    { id: 'acc-9', name: 'Steering Wheel Covers', desc: 'Leather stitch-on & rubber grip covers', price: 499, originalPrice: 999, image: '/sections/steering_cover.jpg', badge: '🚗 COMFORT GRIP', rating: 4.8 },
    { id: 'acc-10', name: 'Car Microfiber Dusters', desc: 'Roj subah dhool saaf karne wala lamba duster', price: 349, originalPrice: 699, image: '/sections/car_duster.jpg', badge: '🧹 DAILY CLEAN', rating: 4.9 },
    { id: 'acc-11', name: 'Anti-Slip Dashboard Mats', desc: 'Phone & key holder sticky rubber mat', price: 149, originalPrice: 299, image: '/sections/anti_slip_mat.jpg', badge: '📱 NON-SLIP', rating: 4.8 },
    { id: 'acc-12', name: 'Car Seat Neck Pillows & Cushions', desc: 'Long drive comfort memory foam pillows', price: 599, originalPrice: 1199, image: '/sections/neck_pillow.jpg', badge: '🛋️ LONG DRIVE', rating: 4.9 },
    { id: 'acc-13', name: 'Car Body Covers', desc: 'Waterproof & dustproof heavy fabric cover', price: 999, originalPrice: 1999, image: '/sections/body_cover.jpg', badge: '🛡️ WATERPROOF', rating: 4.8 },
    { id: 'acc-14', name: 'LED Headlight & Fog Lights', desc: 'H4/H7 white LED & bumper projector fog lights', price: 1499, originalPrice: 2999, image: '/sections/led_headlight.jpg', badge: '💡 WHITE LED', rating: 5.0 }
  ];

  // =========================================================================
  // 100% PURE ISOLATED CATEGORY PRODUCT SECTIONS
  // =========================================================================

  // PURE ENGINE OILS SECTION (ONLY ENGINE OILS)
  const secPureEngineOils = [
    { id: 'oil-1', name: 'Engine Oil (5W-30 Full Synthetic 4L)', desc: '100% Full Synthetic high performance petrol & diesel motor oil', price: 1899, originalPrice: 2499, image: '/sections/oil_5w30.jpg', badge: '🛢️ 5W-30 SYNTHETIC', rating: 4.9 },
    { id: 'oil-2', name: 'Engine Oil (0W-20 Ultra Premium 3.5L)', desc: 'Fuel efficient ultra low friction synthetic motor oil', price: 1999, originalPrice: 2699, image: '/sections/oil_0w20.jpg', badge: '🛢️ 0W-20 PREMIUM', rating: 4.9 },
    { id: 'oil-3', name: 'Engine Oil (15W-40 Heavy Duty Diesel 5L)', desc: 'Heavy duty commercial & SUV diesel engine oil', price: 1699, originalPrice: 2299, image: '/sections/oil_15w40.jpg', badge: '🛢️ 15W-40 DIESEL', rating: 4.8 },
    { id: 'oil-4', name: 'Motul 7100 10W-40 Fully Synthetic (1L)', desc: 'Ester technology high RPM performance engine oil', price: 899, originalPrice: 1199, image: '/sections/gear_oil.jpg', badge: '🛢️ MOTUL SYNTHETIC', rating: 5.0 },
    { id: 'oil-5', name: 'Castrol MAGNATEC 5W-30 Engine Oil (3.5L)', desc: 'Duralock technology dual action engine protection oil', price: 1749, originalPrice: 2250, image: '/sections/oil_5w30.jpg', badge: '🛢️ CASTROL MAGNATEC', rating: 4.9 },
    { id: 'oil-6', name: 'Shell Helix Ultra 5W-40 Synthetic (4L)', desc: 'PurePlus technology gas-to-liquid synthetic motor oil', price: 2199, originalPrice: 2899, image: '/sections/oil_0w20.jpg', badge: '🛢️ SHELL HELIX', rating: 4.9 }
  ];

  // PURE FILTERS SECTION (ONLY AIR, OIL & AC FILTERS)
  const secPureFilters = [
    { id: 'flt-1', name: 'Spin-On Engine Oil Filter', desc: 'Spin-on oil filter element with anti-drain valve', price: 199, originalPrice: 399, image: '/sections/oil_filter.jpg', badge: '🛢️ OIL FILTER', rating: 4.9 },
    { id: 'flt-2', name: 'High-Flow Engine Air Filter', desc: 'Polyurethane high filtration rate engine intake air filter', price: 399, originalPrice: 750, image: '/sections/oil_filter.jpg', badge: '🌬️ AIR FILTER', rating: 4.9 },
    { id: 'flt-3', name: 'Activated Carbon Cabin AC Filter', desc: 'Anti-bacterial cabin PM2.5 air filter for car AC', price: 299, originalPrice: 599, image: '/sections/oil_filter.jpg', badge: '❄️ AC CABIN FILTER', rating: 4.8 },
    { id: 'flt-4', name: 'In-Line Fuel & Petrol Filter Assembly', desc: 'High pressure micro-mesh fuel line filter unit', price: 499, originalPrice: 899, image: '/sections/fuel_filter.jpg', badge: '⛽ FUEL FILTER', rating: 4.8 }
  ];

  // PURE BRAKE SYSTEM SECTION (ONLY BRAKE PADS, DISCS & BRAKE SHOES)
  const secPureBraking = [
    { id: 'brk-1', name: 'Low-Dust Ceramic Front Brake Pads Set', desc: 'Low-dust noise-free ceramic front brake pad set', price: 899, originalPrice: 1599, image: '/sections/brake_pads.jpg', badge: '🛑 CERAMIC PADS', rating: 4.9 },
    { id: 'brk-2', name: 'Rear Drum Brake Shoes Set', desc: 'Heavy duty high friction rear drum brake shoes', price: 699, originalPrice: 1299, image: '/sections/brake_shoes.jpg', badge: '🛑 BRAKE SHOES', rating: 4.8 },
    { id: 'brk-3', name: 'Vented Cast Iron Front Brake Rotors Pair', desc: 'Vented cast iron front brake rotor disc pair', price: 1899, originalPrice: 3200, image: '/sections/brake_disc.jpg', badge: '🛑 VENTED DISCS', rating: 4.9 },
    { id: 'brk-4', name: 'Synthetic Brake Fluid DOT 4 (500ml)', desc: 'High boiling point synthetic hydraulic brake oil', price: 199, originalPrice: 350, image: '/sections/brake_dot4.jpg', badge: '🛑 DOT 4 BRAKE OIL', rating: 4.9 }
  ];

  // PURE SPARK PLUGS & IGNITION SECTION (ONLY SPARK PLUGS & COILS)
  const secPureSparkPlugs = [
    { id: 'ign-1', name: 'NGK Iridium IX Spark Plugs (Pack of 4)', desc: '0.6mm fine iridium tip ultra high spark efficiency plugs', price: 1499, originalPrice: 2400, image: '/sections/spark_plug.jpg', badge: '⚡ NGK IRIDIUM', rating: 5.0 },
    { id: 'ign-2', name: 'Bosch Nickel Spark Plug Set (Pack of 4)', desc: 'Yttrium enhanced copper core OEM spark plugs', price: 449, originalPrice: 850, image: '/sections/spark_plug.jpg', badge: '⚡ BOSCH PLUGS', rating: 4.8 },
    { id: 'ign-3', name: 'High Voltage Direct Ignition Coil Pack', desc: 'Direct coil-on-plug high output ignition transformer', price: 1299, originalPrice: 2200, image: '/sections/ignition_coil.jpg', badge: '⚡ IGNITION COIL', rating: 4.9 },
    { id: 'ign-4', name: 'Denso Twin Tip Iridium Spark Plugs (Pack of 4)', desc: '0.4mm iridium center electrode performance plugs', price: 1699, originalPrice: 2800, image: '/sections/spark_plug.jpg', badge: '⚡ DENSO TT', rating: 4.9 }
  ];

  // PURE CAR LIGHTING SECTION (ONLY LED HEADLIGHTS & FOG LIGHTS)
  const secPureLighting = [
    { id: 'lit-1', name: 'LED Headlight Bulbs H4 (120W 6000K)', desc: 'Super bright 6000K pure white LED conversion kit H4', price: 1499, originalPrice: 2999, image: '/lighting_electrical/led_h4.jpg', badge: '💡 H4 WHITE LED', rating: 4.9 },
    { id: 'lit-2', name: 'LED Headlight Bulbs H7 (Projector Focus)', desc: 'High focus projector LED headlight bulb pair H7', price: 1599, originalPrice: 3199, image: '/lighting_electrical/led_h7.jpg', badge: '💡 H7 WHITE LED', rating: 4.9 },
    { id: 'lit-3', name: 'LED Fog Lamp Pair H11 / H16 (Dual Color)', desc: 'All-weather yellow/white dual color fog lamp LED pair', price: 1399, originalPrice: 2799, image: '/lighting_electrical/led_h11.jpg', badge: '🌫️ H11 FOG LED', rating: 4.8 },
    { id: 'lit-4', name: 'Bi-LED 3-inch Waterproof Fog Projectors', desc: 'Bi-LED projector fog lamp assembly pair with high beam', price: 2499, originalPrice: 4999, image: '/lighting_electrical/fog_projector.jpg', badge: '🌫️ BI-LED FOG', rating: 5.0 }
  ];

  // PURE CAR CARE & CLEANERS SECTION (ONLY SHAMPOO, POLISH & SPRAYS)
  const secPureCarCare = [
    { id: 'car-1', name: 'High-Foam Car Wash Shampoo Bottle (1L)', desc: 'pH neutral high-foam car wash shampoo bottle with sponge', price: 299, originalPrice: 499, image: '/sections/car_shampoo.jpg', badge: '🧼 CAR SHAMPOO', rating: 4.8 },
    { id: 'car-2', name: 'Dashboard & Tyre Instant Shine Polish', desc: 'UV protective non-greasy instant dashboard polish spray', price: 349, originalPrice: 599, image: '/sections/dash_polish.jpg', badge: '✨ DASH POLISH', rating: 4.8 },
    { id: 'car-3', name: 'Multi-Purpose Rust Remover Spray (WD-40 Style)', desc: 'Rust penetrant, moisture displacer & squeak lubricant 400ml', price: 299, originalPrice: 599, image: '/sections/rust_remover.jpg', badge: '✨ RUST SPRAY', rating: 4.9 },
    { id: 'car-4', name: 'Scratch Remover Rubbing Compound Wax', desc: 'Micro-abrasive paint swirl & scratch repair rubbing wax', price: 299, originalPrice: 599, image: '/sections/scratch_remover.jpg', badge: '✨ SCRATCH WAX', rating: 4.7 }
  ];

  // PURE CAR MATS & ACCESSORIES SECTION (ONLY FLOOR MATS & COVERS)
  const secPureAccessories = [
    { id: 'acs-1', name: 'Universal 7D Diamond Leatherette Floor Mats', desc: 'Custom fit 7D waterproof anti-skid leather floor mats 5-pc', price: 1899, originalPrice: 3499, image: '/interior_exterior/mats_7d.jpg', badge: '🛋️ 7D MATS', rating: 4.9 },
    { id: 'acs-2', name: 'Ergonomic Memory Foam Neck Pillow Pair', desc: 'Cervical support breathable memory foam headrest pillows', price: 599, originalPrice: 1199, image: '/interior_exterior/neck_pillow.jpg', badge: '🛋️ NECK PILLOW', rating: 4.9 },
    { id: 'acs-3', name: 'Leather Stitch-on Steering Wheel Cover', desc: 'Soft micro-fiber leather needle thread wrap steering cover', price: 399, originalPrice: 799, image: '/interior_exterior/leather_steering.jpg', badge: '🚗 STEERING WRAP', rating: 4.8 },
    { id: 'acs-4', name: 'Waterproof Premium All-Weather Car Body Cover', desc: 'Triple-stitched metallic silver heat resistant car cover', price: 999, originalPrice: 1999, image: '/interior_exterior/body_cover.jpg', badge: '🛡️ BODY COVER', rating: 4.8 }
  ];

  // SECTION 5: 💡 CAR LIGHTING & ELECTRICAL UPGRADES (20 ITEMS)
  const secLightingElectrical = [
    { id: 'ele-1', name: 'LED Headlight Bulbs (H4 Model)', desc: 'High brightness 120W 6000K pure white LED bulb pair', price: 1499, originalPrice: 2999, image: '/lighting_electrical/led_h4.jpg', badge: '💡 H4 WHITE LED', rating: 4.9 },
    { id: 'ele-2', name: 'LED Headlight Bulbs (H7 Model)', desc: 'High focus projector LED headlight bulb kit H7', price: 1599, originalPrice: 3199, image: '/lighting_electrical/led_h7.jpg', badge: '💡 H7 WHITE LED', rating: 4.9 },
    { id: 'ele-3', name: 'LED Headlight Bulbs (H11 / H16 Fog)', desc: 'All-weather yellow/white dual color fog lamp LED pair', price: 1399, originalPrice: 2799, image: '/lighting_electrical/led_h11.jpg', badge: '🌫️ H11 FOG LED', rating: 4.8 },
    { id: 'ele-4', name: 'App-Controlled Ambient Lighting Kits', desc: 'Bluetooth app RGB interior strip light kit', price: 699, originalPrice: 1499, image: '/lighting_electrical/ambient_kit.jpg', badge: '🌈 APP CONTROL', rating: 4.8 },
    { id: 'ele-5', name: 'Underbody Neon Glow LED Strips', desc: 'Waterproof chassis underglow music sync LED strips', price: 1299, originalPrice: 2499, image: '/lighting_electrical/underbody_neon.jpg', badge: '✨ NEON GLOW', rating: 4.7 },
    { id: 'ele-6', name: 'HID Xenon Conversion Kits', desc: '55W AC fast-bright HID ballast bulb kit 5500K', price: 2199, originalPrice: 3999, image: '/lighting_electrical/hid_xenon.jpg', badge: '⚡ HID XENON', rating: 4.9 },
    { id: 'ele-7', name: 'LED Parking Light Bulbs (T10)', desc: 'T10 SMD high bright white pilot parking bulb pair', price: 199, originalPrice: 399, image: '/lighting_electrical/t10_parking.jpg', badge: '💡 T10 PARKING', rating: 4.8 },
    { id: 'ele-8', name: 'LED Roof / Cabin Lights', desc: 'Super bright white interior dome cabin light panel', price: 249, originalPrice: 499, image: '/lighting_electrical/roof_cabin_led.jpg', badge: '💡 CABIN DOME', rating: 4.8 },
    { id: 'ele-9', name: 'Sequential LED Indicator Strips', desc: 'Audi style dynamic sweeping DRL indicator strip', price: 499, originalPrice: 999, image: '/lighting_electrical/sequential_blinker.jpg', badge: '⚡ SEQUENTIAL', rating: 4.8 },
    { id: 'ele-10', name: 'Matrix Style Rear LED Tail-light Strips', desc: 'Pillar & trunk brake matrix LED light strip', price: 799, originalPrice: 1599, image: '/lighting_electrical/matrix_taillight.jpg', badge: '🚗 TAIL MATRIX', rating: 4.8 },
    { id: 'ele-11', name: 'LED Fog Light Projector Assemblies', desc: 'Bi-LED 3-inch waterproof projector fog lamp pair', price: 2499, originalPrice: 4999, image: '/lighting_electrical/fog_projector.jpg', badge: '🌫️ BI-LED FOG', rating: 5.0 },
    { id: 'ele-12', name: 'Car Dash Cameras (Front View)', desc: 'Full HD 1080P night vision windshield dashcam', price: 1999, originalPrice: 3999, image: '/lighting_electrical/dashcam_front.jpg', badge: '📹 1080P DASHCAM', rating: 4.9 },
    { id: 'ele-13', name: 'Dual Dash Cameras (Front & Rear)', desc: 'Front 4K + Rear 1080P loop recording dashcam kit', price: 3499, originalPrice: 6999, image: '/lighting_electrical/dashcam_dual.jpg', badge: '📹 DUAL 4K DASHCAM', rating: 4.9 },
    { id: 'ele-14', name: 'Android Infotainment Touch Screens', desc: '9-inch HD IPS display Android stereo 2GB/32GB', price: 5499, originalPrice: 9999, image: '/lighting_electrical/android_touch.jpg', badge: '📱 ANDROID TOUCH', rating: 4.9 },
    { id: 'ele-15', name: 'Rear Parking Sensors Kits', desc: '4-sensor reverse parking assistance kit with buzzer', price: 699, originalPrice: 1399, image: '/lighting_electrical/parking_sensors.jpg', badge: '🔊 PARKING SENSOR', rating: 4.8 },
    { id: 'ele-16', name: 'Reverse Parking Camera Assemblies', desc: '170 degree wide angle HD night vision camera', price: 599, originalPrice: 1199, image: '/lighting_electrical/reverse_camera.jpg', badge: '📷 REVERSE CAM', rating: 4.8 },
    { id: 'ele-17', name: 'Car Central Locking Actuators', desc: 'Heavy duty 12V door lock motor actuator 2-wire/5-wire', price: 349, originalPrice: 699, image: '/lighting_electrical/central_locking.jpg', badge: '🔒 DOOR LOCK', rating: 4.8 },
    { id: 'ele-18', name: 'GPS Trackers (Sim-card Security)', desc: 'Real-time vehicle live tracking & engine cut-off GPS', price: 1499, originalPrice: 2999, image: '/lighting_electrical/gps_tracker.jpg', badge: '🛰️ GPS SECURITY', rating: 4.9 },
    { id: 'ele-19', name: 'Heavy Duty Relay Wiring Kits', desc: '100W headlight ceramic socket wiring harness relay', price: 449, originalPrice: 899, image: '/lighting_electrical/relay_wiring.jpg', badge: '⚡ RELAY HARNESS', rating: 4.9 },
    { id: 'ele-20', name: 'Car Electrical Couplers & Connectors', desc: 'Automotive waterproof male female wire connector set', price: 299, originalPrice: 599, image: '/lighting_electrical/wire_connectors.jpg', badge: '🔌 CONNECTORS', rating: 4.8 }
  ];

  // SECTION 6: 🚘 INTERIOR & EXTERIOR ACCESSORIES (20 ITEMS)
  const secInteriorExterior = [
    { id: 'ine-1', name: 'Magnetic Dashboard Mobile Holders', desc: '360 degree rotation powerful neodymium magnet mount', price: 299, originalPrice: 599, image: '/interior_exterior/magnetic_holder.jpg', badge: '📱 MAGNETIC MOUNT', rating: 4.9 },
    { id: 'ine-2', name: 'AC Vent Gravity Mobile Mounts', desc: 'Auto lock gravity clamping AC vent phone holder', price: 349, originalPrice: 699, image: '/interior_exterior/ac_vent_mount.jpg', badge: '📱 AC VENT MOUNT', rating: 4.8 },
    { id: 'ine-3', name: 'Wireless Charging Car Mounts', desc: '15W fast Qi wireless charging sensor automatic mount', price: 999, originalPrice: 1999, image: '/interior_exterior/wireless_mount.jpg', badge: '⚡ 15W WIRELESS', rating: 4.9 },
    { id: 'ine-4', name: 'Dual-Port USB Fast Car Chargers', desc: 'Qualcomm QuickCharge 3.0 dual USB metal adapter', price: 399, originalPrice: 799, image: '/interior_exterior/dual_usb_charger.jpg', badge: '⚡ FAST CHARGER', rating: 4.8 },
    { id: 'ine-5', name: 'Type-C to Type-C Heavy Cables', desc: '100W PD fast charging braided nylon 1.2m cable', price: 249, originalPrice: 499, image: '/interior_exterior/typec_cable.jpg', badge: '🔌 100W TYPE-C', rating: 4.8 },
    { id: 'ine-6', name: 'Dashboard Anti-Slip Rubber Mats', desc: 'Heat resistant sticky silicone mat for mobile & keys', price: 149, originalPrice: 299, image: '/interior_exterior/dashboard_mat.jpg', badge: '📱 ANTI-SLIP', rating: 4.8 },
    { id: 'ine-7', name: 'Car Perfume Gel Tins', desc: 'Long lasting organic gel air freshener tin 60g', price: 199, originalPrice: 399, image: '/interior_exterior/perfume_gel.jpg', badge: '✨ GEL FRESHENER', rating: 4.8 },
    { id: 'ine-8', name: 'Dashboard Hanging Perfume Bottles', desc: 'Wooden cap essential oil aroma diffuser bottle', price: 149, originalPrice: 299, image: '/interior_exterior/hanging_perfume.jpg', badge: '🌸 AROMA DIFFUSER', rating: 4.7 },
    { id: 'ine-9', name: 'AC Vent Clip Air Fresheners', desc: 'Subtle fragrance AC vent louver fragrance clips 4-pack', price: 199, originalPrice: 399, image: '/interior_exterior/ac_clip_perfume.jpg', badge: '🌸 VENT CLIP', rating: 4.8 },
    { id: 'ine-10', name: 'Memory Foam Neck Pillows', desc: 'Ergonomic cervical support car seat neck pillow pair', price: 599, originalPrice: 1199, image: '/interior_exterior/neck_pillow.jpg', badge: '🛋️ MEMORY FOAM', rating: 4.9 },
    { id: 'ine-11', name: 'Orthopedic Seat Lumbar Cushions', desc: 'Lower back support breathable mesh posture cushion', price: 699, originalPrice: 1399, image: '/interior_exterior/lumbar_cushion.jpg', badge: '🛋️ LUMBAR SUPPORT', rating: 4.9 },
    { id: 'ine-12', name: 'Leather Stitch-on Steering Covers', desc: 'Soft micro-fiber leather thread needle wrap cover', price: 399, originalPrice: 799, image: '/interior_exterior/leather_steering.jpg', badge: '🚗 LEATHER WRAP', rating: 4.8 },
    { id: 'ine-13', name: 'Silicon Slip-on Steering Grips', desc: 'Stretchable non-slip washable silicone wheel grip', price: 299, originalPrice: 599, image: '/interior_exterior/silicon_steering.jpg', badge: '🚗 SILICONE GRIP', rating: 4.8 },
    { id: 'ine-14', name: 'Universal 7D Car Floor Mats', desc: 'Diamond leatherette custom fit 7D waterproof mat set', price: 1899, originalPrice: 3499, image: '/interior_exterior/mats_7d.jpg', badge: '🛋️ 7D MATS', rating: 4.9 },
    { id: 'ine-15', name: 'PVC Transparent Car Mats', desc: 'Clear heavy duty washable PVC noodle floor mats 5-piece', price: 799, originalPrice: 1499, image: '/interior_exterior/mats_pvc.jpg', badge: '🧹 PVC MATS', rating: 4.8 },
    { id: 'ine-16', name: 'Waterproof Premium Car Body Covers', desc: 'Heavy triple-stitch metallic silver All-Weather cover', price: 999, originalPrice: 1999, image: '/interior_exterior/body_cover.jpg', badge: '🛡️ BODY COVER', rating: 4.8 },
    { id: 'ine-17', name: 'Magnetic Car Window Sunshades', desc: 'Custom mesh magnetic sunshade curtains set of 4', price: 699, originalPrice: 1299, image: '/interior_exterior/window_sunshades.jpg', badge: '☀️ SUNSHADES', rating: 4.8 },
    { id: 'ine-18', name: 'Door Edge Scratch Guard Protectors', desc: 'Rubber U-channel door trim anti-collision strip 5m', price: 249, originalPrice: 499, image: '/interior_exterior/door_guards.jpg', badge: '🛡️ DOOR GUARD', rating: 4.8 },
    { id: 'ine-19', name: 'Car Key Fob Silicon Covers', desc: 'Soft silicone remote key button case protector', price: 149, originalPrice: 299, image: '/interior_exterior/key_fob_silicon.jpg', badge: '🔑 KEY COVER', rating: 4.9 },
    { id: 'ine-20', name: 'Replacement Car Key Shells', desc: 'Blank flip key replacement casing with pad', price: 299, originalPrice: 599, image: '/interior_exterior/key_shell_plastic.jpg', badge: '🔑 KEY SHELL', rating: 4.8 }
  ];

  // SECTION 7: 🧼 CAR CARE, DETAILING & EMERGENCY KITS (16 ITEMS)
  const secCareEmergency = [
    { id: 'cre-1', name: 'High-Foam Car Body Wash Shampoos', desc: 'PH neutral thick snow foam car wash shampoo 1L', price: 299, originalPrice: 499, image: '/care_emergency/foam_shampoo.jpg', badge: '🧼 HIGH FOAM', rating: 4.8 },
    { id: 'cre-2', name: 'Waterless Car Wash Sprays', desc: 'No-water instant dirt cleaning & gloss shine spray 500ml', price: 349, originalPrice: 699, image: '/care_emergency/waterless_wash.jpg', badge: '💧 WATERLESS WASH', rating: 4.8 },
    { id: 'cre-3', name: 'Dashboard & Interior Vinyl Polish', desc: 'UV protection anti-dust dashboard dresser spray 500ml', price: 349, originalPrice: 599, image: '/care_emergency/vinyl_polish.jpg', badge: '✨ INTERIOR POLISH', rating: 4.8 },
    { id: 'cre-4', name: 'Tyre Dresser & Shiner Sprays', desc: 'Deep black wet look long lasting tyre shine spray 500ml', price: 299, originalPrice: 599, image: '/care_emergency/tyre_dresser.jpg', badge: '🛞 WET LOOK SHINE', rating: 4.8 },
    { id: 'cre-5', name: 'Carnauba Car Paste Waxes', desc: 'Brazilian carnauba deep gloss protective paste wax 230g', price: 449, originalPrice: 899, image: '/care_emergency/carnauba_wax.jpg', badge: '✨ CARNAUBA WAX', rating: 4.9 },
    { id: 'cre-6', name: 'Liquid Gloss Wax Sprays', desc: 'Instant spray-on hydrophobic ceramic glass wax 500ml', price: 399, originalPrice: 799, image: '/care_emergency/gloss_spray.jpg', badge: '✨ LIQUID WAX', rating: 4.8 },
    { id: 'cre-7', name: 'Scratch Rubbing Compounds', desc: 'Fine & coarse scratch remover paint restorer paste 100g', price: 299, originalPrice: 599, image: '/care_emergency/rubbing_compound.jpg', badge: '🛠️ SCRATCH REMOVER', rating: 4.7 },
    { id: 'cre-8', name: 'Microfiber Cloths (400 GSM)', desc: 'General cleaning ultra absorbent microfiber towels set of 4', price: 299, originalPrice: 599, image: '/care_emergency/microfiber_400gsm.jpg', badge: '✨ 400 GSM', rating: 4.8 },
    { id: 'cre-9', name: 'Premium Microfiber Towels (600+ GSM)', desc: 'Plush edgeless water drying microfiber towel for cars', price: 399, originalPrice: 799, image: '/care_emergency/microfiber_600gsm.jpg', badge: '✨ 600 GSM DRYING', rating: 4.9 },
    { id: 'cre-10', name: 'Microfiber Cleaning Dusters', desc: 'Extendable stainless steel handle wax treated duster', price: 349, originalPrice: 699, image: '/care_emergency/extendable_duster.jpg', badge: '🧹 EXTENDABLE', rating: 4.9 },
    { id: 'cre-11', name: 'Car Washing Foam Sponges / Mitts', desc: 'Scratch-free chenille microfiber washing glove mitt', price: 199, originalPrice: 399, image: '/care_emergency/washing_mitts.jpg', badge: '🧼 SCRATCH-FREE', rating: 4.8 },
    { id: 'cre-12', name: 'Glass Cleaner Sprays (Anti-fog)', desc: 'Streak-free anti-glare windshield glass cleaner spray', price: 249, originalPrice: 499, image: '/care_emergency/glass_cleaner.jpg', badge: '🌧️ ANTI-FOG GLASS', rating: 4.8 },
    { id: 'cre-13', name: 'Clay Bars (Paint Decontamination)', desc: 'Automotive grade paint smooth surface clay bar 100g', price: 349, originalPrice: 699, image: '/care_emergency/clay_bar.jpg', badge: '✨ CLAY BAR', rating: 4.8 },
    { id: 'cre-14', name: 'Portable Digital Tyre Inflators', desc: '12V 150 PSI auto shut-off digital car air pump compressor', price: 1999, originalPrice: 3999, image: '/care_emergency/tyre_inflator.jpg', badge: '🚨 12V AIR PUMP', rating: 4.9 },
    { id: 'cre-15', name: 'Battery Jumper Cables (Heavy Duty)', desc: '1000A copper copper-clad emergency battery booster cable', price: 799, originalPrice: 1499, image: '/care_emergency/jumper_cables.jpg', badge: '🚨 1000A JUMPER', rating: 4.9 },
    { id: 'cre-16', name: 'Car Tow Ropes (Nylon with Hooks)', desc: '5-Ton 4-meter heavy duty nylon tow strap with forged hooks', price: 499, originalPrice: 999, image: '/care_emergency/tow_rope.jpg', badge: '🚨 5-TON TOW ROPE', rating: 4.8 }
  ];

  // SECTION 8: ⚡ EV SPECIALS & SMART AUTOMOTIVE GADGETS (14 ITEMS)
  const secEvSmartGadgets = [
    { id: 'evg-1', name: 'Portable EV Charging Cable Bags', desc: 'Heavy duty round zipped waterproof charger bag for Nexon & Tiago EV', price: 499, originalPrice: 999, image: '/ev_smart_gadgets/ev_cable_bag.jpg', badge: '⚡ EV CABLE BAG', rating: 4.9 },
    { id: 'evg-2', name: 'EV Charger Wall Mount Hooks', desc: 'Heavy steel gun-style EV charging cable holder & nozzle holster', price: 399, originalPrice: 799, image: '/ev_smart_gadgets/ev_wall_hook.jpg', badge: '🔌 WALL MOUNT', rating: 4.8 },
    { id: 'evg-3', name: '16A to 15A Extension Boards for EV', desc: '16 Amp heavy 4mm brass socket 5m extension cord for home EV charging', price: 1299, originalPrice: 2499, image: '/ev_smart_gadgets/ev_extension_board.jpg', badge: '⚡ 16A HEAVY CORD', rating: 4.9 },
    { id: 'evg-4', name: 'Heads-Up Display (HUD Projector)', desc: 'Windshield OBD2 & GPS speed, RPM, voltage digital projector', price: 1899, originalPrice: 3499, image: '/ev_smart_gadgets/hud_projector.jpg', badge: '💡 HUD PROJECTOR', rating: 4.8 },
    { id: 'evg-5', name: 'Wireless Apple CarPlay / Android Auto', desc: 'Plug & Play 5GHz mini wireless CarPlay & Android Auto adapter', price: 2999, originalPrice: 5999, image: '/ev_smart_gadgets/wireless_carplay.jpg', badge: '📱 WIRELESS ADAPTER', rating: 4.9 },
    { id: 'evg-6', name: 'Smart Tire Pressure Monitoring (TPMS)', desc: 'Solar-powered LCD display wireless 4-wheel external TPMS sensor kit', price: 1699, originalPrice: 3299, image: '/ev_smart_gadgets/solar_tpms.jpg', badge: '☀️ SOLAR TPMS', rating: 4.9 },
    { id: 'evg-7', name: 'OBD2 Car Diagnostic Bluetooth Scanners', desc: 'ELM327 OBDII bluetooth car engine fault code scanner for phone', price: 599, originalPrice: 1199, image: '/ev_smart_gadgets/obd2_scanner.jpg', badge: '🛠️ OBD2 SCANNER', rating: 4.8 },
    { id: 'evg-8', name: 'GPS Tracker with Engine Cut-off', desc: 'SIM card live mobile tracking & remote engine immobilizer GPS', price: 1499, originalPrice: 2999, image: '/ev_smart_gadgets/gps_engine_cutoff.jpg', badge: '🛰️ ENGINE CUT-OFF', rating: 4.9 },
    { id: 'evg-9', name: 'Car Window Breaker & Seatbelt Cutter', desc: '2-in-1 spring loaded emergency tungsten window punch & cutter', price: 249, originalPrice: 499, image: '/ev_smart_gadgets/glass_breaker.jpg', badge: '🚨 EMERGENCY TOOL', rating: 4.9 },
    { id: 'evg-10', name: 'Smart Keychains with Bluetooth Tracker', desc: 'Anti-lost smart key finder tag with smartphone app alarm', price: 349, originalPrice: 699, image: '/ev_smart_gadgets/smart_keychain.jpg', badge: '🔑 KEY FINDER', rating: 4.7 },
    { id: 'evg-11', name: 'Automatic Cordless Car Vacuum Cleaners', desc: 'High suction 120W USB rechargeable cordless portable car vacuum', price: 999, originalPrice: 1999, image: '/ev_smart_gadgets/cordless_vacuum.jpg', badge: '🧹 CORDLESS VACUUM', rating: 4.8 },
    { id: 'evg-12', name: 'Solar-Powered Car Air Purifiers', desc: 'HEPA filter & ionizer solar auto-charging air purifier for car', price: 1299, originalPrice: 2499, image: '/ev_smart_gadgets/solar_air_purifier.jpg', badge: '☀️ SOLAR PURIFIER', rating: 4.8 },
    { id: 'evg-13', name: 'Blind Spot Mirrors (Convex Pair)', desc: '360 degree frameless HD glass convex blind spot side mirror pair', price: 199, originalPrice: 399, image: '/ev_smart_gadgets/blind_spot_mirrors.jpg', badge: '🪞 BLIND SPOT', rating: 4.8 },
    { id: 'evg-14', name: 'Car Mattress for Backseat Bed', desc: 'Inflatable travel air bed mattress with pump & pillows for backseat', price: 1499, originalPrice: 2999, image: '/ev_smart_gadgets/car_backseat_mattress.jpg', badge: '🛋️ CAR BED', rating: 4.9 }
  ];

  // SECTION 9: 🧳 TRAVEL, OFF-ROADING & UTILITY GEARS (10 ITEMS)
  const secTravelUtility = [
    { id: 'trv-1', name: 'Roof Luggage Carrier Elastic Nets', desc: 'Heavy duty stretchable Bungee net with 12 ABS hooks for roof carriers', price: 399, originalPrice: 799, image: '/travel_utility/roof_carrier_net.jpg', badge: '🧳 LUGGAGE NET', rating: 4.9 },
    { id: 'trv-2', name: 'Waterproof Roof Luggage Bags', desc: 'Heavy PVC 420L capacity waterproof roof top cargo carrier bag', price: 1899, originalPrice: 3499, image: '/travel_utility/roof_luggage_bag.jpg', badge: '🛡️ WATERPROOF BAG', rating: 4.9 },
    { id: 'trv-3', name: 'Foldable Trunk Organizers', desc: 'Multi-pocket Oxford fabric collapsible car boot organizer storage bag', price: 699, originalPrice: 1399, image: '/travel_utility/trunk_organizer.jpg', badge: '📦 BOOT ORGANIZER', rating: 4.8 },
    { id: 'trv-4', name: 'Car Backseat Organizer Trays', desc: 'Leather backseat storage pocket with foldable dining & tablet tray', price: 799, originalPrice: 1499, image: '/travel_utility/backseat_organizer.jpg', badge: '🛋️ BACKSEAT TRAY', rating: 4.8 },
    { id: 'trv-5', name: 'Car Trash Cans (Mini Dustbin)', desc: 'Leakproof press-type door & console mini car dustbin', price: 249, originalPrice: 499, image: '/travel_utility/car_trash_can.jpg', badge: '🧹 CAR DUSTBIN', rating: 4.8 },
    { id: 'trv-6', name: 'Window Sunshade Umbrellas', desc: 'Foldable titanium silver 10-rib windshield umbrella heat reflector', price: 499, originalPrice: 999, image: '/travel_utility/sunshade_umbrella.jpg', badge: '☀️ SUN UMBRELLA', rating: 4.9 },
    { id: 'trv-7', name: 'Heavy-Duty Mud Flaps (Set of 4)', desc: 'Flexible unbreakable rubber mud guard splash flap set for cars & SUVs', price: 399, originalPrice: 799, image: '/travel_utility/heavy_mud_flaps.jpg', badge: '🛡️ MUD FLAPS', rating: 4.8 },
    { id: 'trv-8', name: 'Car Roof Rack Bars (Universal)', desc: 'Aluminum alloy heavy lockable cross roof rail rack bar pair', price: 2499, originalPrice: 4999, image: '/travel_utility/roof_rack_bars.jpg', badge: '🚗 ROOF RACK', rating: 4.9 },
    { id: 'trv-9', name: 'Multi-Pocket Seat Side Pockets', desc: 'Console side gap filler leather storage pocket with cup holder', price: 299, originalPrice: 599, image: '/travel_utility/seat_side_pockets.jpg', badge: '📦 GAP POCKET', rating: 4.7 },
    { id: 'trv-10', name: 'Car Inverter (12V DC to 220V AC)', desc: '200W car power inverter adapter with 220V AC socket & 4 USB ports', price: 1299, originalPrice: 2499, image: '/travel_utility/car_power_inverter.jpg', badge: '⚡ 220V INVERTER', rating: 4.9 }
  ];

  // SECTION 10: ⚙️ ADVANCED ENGINE & PERFORMANCE PARTS (10 ITEMS)
  const secAdvancedEngine = [
    { id: 'aeg-1', name: 'Oxygen Sensors (O2 Exhaust Sensors)', desc: '4-wire heated exhaust gas O2 sensor for fuel efficiency', price: 1499, originalPrice: 2899, image: '/advanced_engine/o2_sensor.jpg', badge: '⚙️ O2 SENSOR', rating: 4.9 },
    { id: 'aeg-2', name: 'Mass Air Flow (MAF) Sensors', desc: 'Precision intake mass air flow meter sensor assembly', price: 1899, originalPrice: 3499, image: '/advanced_engine/maf_sensor.jpg', badge: '⚙️ MAF SENSOR', rating: 4.9 },
    { id: 'aeg-3', name: 'Engine Fuel Injectors', desc: 'High pressure petrol & diesel multi-hole fuel injector nozzle', price: 1299, originalPrice: 2499, image: '/advanced_engine/fuel_injector.jpg', badge: '⛽ INJECTOR NOZZLE', rating: 4.8 },
    { id: 'aeg-4', name: 'Radiator Fan Assemblies', desc: '12V high speed engine cooling radiator fan with shroud', price: 1699, originalPrice: 3199, image: '/advanced_engine/radiator_fan.jpg', badge: '❄️ RADIATOR FAN', rating: 4.9 },
    { id: 'aeg-5', name: 'Engine Water Pumps', desc: 'Aluminum impeller coolant circulating engine water pump', price: 1199, originalPrice: 2299, image: '/advanced_engine/water_pump.jpg', badge: '❄️ WATER PUMP', rating: 4.8 },
    { id: 'aeg-6', name: 'Timing Belt Kits (With Tensioners)', desc: 'High strength HSN timing belt & bearing tensioner pulley kit', price: 1599, originalPrice: 2999, image: '/advanced_engine/timing_belt_kit.jpg', badge: '⚙️ TIMING KIT', rating: 4.9 },
    { id: 'aeg-7', name: 'Ignition Switches (Lock Cylinder)', desc: 'Key starter ignition lock switch cylinder with 2 keys', price: 799, originalPrice: 1499, image: '/advanced_engine/ignition_switch.jpg', badge: '🔑 IGNITION SWITCH', rating: 4.8 },
    { id: 'aeg-8', name: 'Power Window Switches (Main & Single)', desc: 'Driver door master power window control switch panel', price: 699, originalPrice: 1299, image: '/advanced_engine/power_window_switch.jpg', badge: '⚡ WINDOW SWITCH', rating: 4.8 },
    { id: 'aeg-9', name: 'Wiper Washer Motor Pumps', desc: '12V dual outlet windshield washer fluid pump motor', price: 299, originalPrice: 599, image: '/advanced_engine/washer_pump.jpg', badge: '🌧️ WASHER PUMP', rating: 4.8 },
    { id: 'aeg-10', name: 'Fuel Tank Caps (With Keys)', desc: 'Leakproof locking fuel filler cap with 2 matching keys', price: 349, originalPrice: 699, image: '/advanced_engine/fuel_tank_cap.jpg', badge: '⛽ FUEL CAP', rating: 4.8 }
  ];

  // SECTION 11: 🎨 STYLING, CHROME & MODIFICATION ESSENTIALS (10 ITEMS)
  const secStylingChrome = [
    { id: 'stc-1', name: 'Chrome Door Handle Catch Covers', desc: 'Triple chrome-plated door handle & bowl protector cover set of 8', price: 499, originalPrice: 999, image: '/styling_chrome/chrome_handle_covers.jpg', badge: '✨ CHROME FINISH', rating: 4.9 },
    { id: 'stc-2', name: 'Chrome Window Line Garnish Strips', desc: 'Stainless steel lower window line chrome trim strip 6-piece set', price: 799, originalPrice: 1599, image: '/styling_chrome/chrome_window_strips.jpg', badge: '✨ WINDOW CHROME', rating: 4.8 },
    { id: 'stc-3', name: 'Car Door Welcome Projection LED', desc: 'Wireless HD car brand logo ghost shadow projector light pair', price: 399, originalPrice: 799, image: '/styling_chrome/door_logo_projector.jpg', badge: '💡 LOGO PROJECTOR', rating: 4.9 },
    { id: 'stc-4', name: 'Silencer Exhaust Tip Cutters', desc: 'Stainless steel / carbon fiber look dual-pipe exhaust tip muffler', price: 599, originalPrice: 1199, image: '/styling_chrome/exhaust_tip_cutter.jpg', badge: '🏎️ EXHAUST TIP', rating: 4.8 },
    { id: 'stc-5', name: 'Bumper Corner Guards (Set of 4)', desc: 'Flexible anti-scratch rubber bumper protector guard strip set', price: 299, originalPrice: 599, image: '/styling_chrome/bumper_corner_guards.jpg', badge: '🛡️ BUMPER GUARD', rating: 4.8 },
    { id: 'stc-6', name: 'Roof Shark Fin Antennas', desc: 'FM/AM signal radio booster shark fin roof antenna', price: 349, originalPrice: 699, image: '/styling_chrome/shark_fin_antenna.jpg', badge: '📻 SHARK FIN', rating: 4.8 },
    { id: 'stc-7', name: 'Carbon Fiber Vinyl Wrap Rolls', desc: '3D/6D textured bubble-free self-adhesive carbon wrap film 1.5m', price: 499, originalPrice: 999, image: '/styling_chrome/carbon_wrap_roll.jpg', badge: '🏎️ 6D CARBON FILM', rating: 4.8 },
    { id: 'stc-8', name: 'Car Wheel Caps (Dual-Tone)', desc: '13-15 inch silver & glossy black sports hubcap wheel cover set of 4', price: 999, originalPrice: 1999, image: '/styling_chrome/wheel_caps.jpg', badge: '🛞 SPORT WHEEL CAPS', rating: 4.9 },
    { id: 'stc-9', name: 'Universal Front Bumper Lip Spoilers', desc: 'Rubber splitter chin spoiler protective lip skirt strip 2.5m', price: 699, originalPrice: 1399, image: '/styling_chrome/bumper_lip_spoiler.jpg', badge: '🏎️ BUMPER LIP', rating: 4.8 },
    { id: 'stc-10', name: 'Car Body Decals & Graphics Stickers', desc: 'Side body vinyl racing stripe graphic sticker decal set', price: 499, originalPrice: 999, image: '/styling_chrome/car_body_stickers.jpg', badge: '🎨 RACING STRIPES', rating: 4.8 }
  ];

  // SECTION 12: 🛠️ SPECIAL TOOLS & DIY GARAGE KITS (6 ITEMS)
  const secSpecialTools = [
    { id: 'stk-1', name: 'Hydraulic Bottle Jacks (2-Ton to 5-Ton)', desc: 'Heavy duty 2-Ton hydraulic bottle jack with safety overload valve', price: 1299, originalPrice: 2499, image: '/special_tools/hydraulic_jack.jpg', badge: '🛠️ HYDRAULIC JACK', rating: 4.9 },
    { id: 'stk-2', name: 'Car Wheel Spanners (Cross & L-Shape)', desc: 'Heavy chrome vanadium steel extendable L-type car wheel nut wrench', price: 499, originalPrice: 999, image: '/special_tools/wheel_spanner.jpg', badge: '🔧 WHEEL SPANNER', rating: 4.8 },
    { id: 'stk-3', name: 'Screwdriver & Socket Wrench Tool Sets', desc: '46-in-1 ¼ inch ratchet socket wrench driver tool set box for cars', price: 899, originalPrice: 1799, image: '/special_tools/socket_wrench_set.jpg', badge: '🧰 46-IN-1 TOOLSET', rating: 4.9 },
    { id: 'stk-4', name: 'Car Fuse Puller & Voltage Tester Pens', desc: '6V-24V DC automotive circuit voltage continuity tester pen with clip', price: 199, originalPrice: 399, image: '/special_tools/fuse_tester_pen.jpg', badge: '⚡ TESTER PEN', rating: 4.8 },
    { id: 'stk-5', name: 'Trim Removal Tool Kits (Plastic Set)', desc: '12-piece scratch-free nylon plastic car door panel & trim pry tool set', price: 299, originalPrice: 599, image: '/special_tools/trim_removal_kit.jpg', badge: '🛠️ TRIM REMOVAL', rating: 4.8 },
    { id: 'stk-6', name: 'Tire Puncture Repair DIY Kits', desc: 'Heavy duty T-handle tubeless tire puncture repair strip needle kit', price: 249, originalPrice: 499, image: '/special_tools/puncture_repair_kit.jpg', badge: '🛞 PUNCTURE KIT', rating: 4.9 }
  ];

  // SECTION 13: 🕶️ WINDOW COMFORT & PREMIUM SUNSHADES (10 ITEMS)
  const secWindowComfort = [
    { id: 'wcf-1', name: 'Zipper Magnetic Sunshades (Set of 4)', desc: 'Custom fit magnetic window mesh curtains with zipper opening for toll', price: 799, originalPrice: 1599, image: '/window_comfort/zipper_sunshades.jpg', badge: '🕶️ ZIPPER SUNSHADE', rating: 4.9 },
    { id: 'wcf-2', name: 'Roll-Up Automatic Window Sunshades', desc: 'Retractable woven mesh automatic roll-up car window blinds pair', price: 499, originalPrice: 999, image: '/window_comfort/rollup_sunshades.jpg', badge: '🕶️ ROLL-UP MESH', rating: 4.8 },
    { id: 'wcf-3', name: 'Rear Windshield Mesh Curtain Shades', desc: 'Suction cup rear windshield sun shade mesh protector screen', price: 349, originalPrice: 699, image: '/window_comfort/rear_windshield_curtain.jpg', badge: '🕶️ REAR SUNSHADE', rating: 4.8 },
    { id: 'wcf-4', name: 'Car Window Rain Visors / Deflectors', desc: 'Injection molded smoke black door rain visor wind deflector set of 4', price: 899, originalPrice: 1799, image: '/window_comfort/door_rain_visors.jpg', badge: '🌧️ RAIN VISOR', rating: 4.9 },
    { id: 'wcf-5', name: 'UV-Block Front Windshield Parasols', desc: 'Titanium silver 10-skeleton car windshield sunshade umbrella reflector', price: 599, originalPrice: 1199, image: '/window_comfort/front_parasol_umbrella.jpg', badge: '☀️ UV PARASOL', rating: 4.9 },
    { id: 'wcf-6', name: 'Car Window Glass Tint Film Rolls', desc: 'Anti-scratch heat rejection solar control car window tint film roll', price: 449, originalPrice: 899, image: '/window_comfort/window_tint_film.jpg', badge: '🕶️ SOLAR TINT', rating: 4.7 },
    { id: 'wcf-7', name: 'Suction-Cup Roller Sun Blinds', desc: 'Universal PVC retractable suction cup side window roller sun blind', price: 299, originalPrice: 599, image: '/window_comfort/suction_roller_blinds.jpg', badge: '🕶️ SUCTION BLIND', rating: 4.7 },
    { id: 'wcf-8', name: 'Custom-Fit Half-Body Car Covers', desc: 'Silver coated waterproof half roof & windshield sun protection cover', price: 699, originalPrice: 1399, image: '/window_comfort/half_body_car_cover.jpg', badge: '🚗 HALF COVER', rating: 4.8 },
    { id: 'wcf-9', name: 'Car Door Rubber Weatherstrips (16m)', desc: 'B-shape self-adhesive soundproofing noise insulation rubber seal strip', price: 399, originalPrice: 799, image: '/window_comfort/door_weatherstrips.jpg', badge: '🔇 NOISE SEAL', rating: 4.8 },
    { id: 'wcf-10', name: 'Anti-Glare Night Vision Visor Extenders', desc: '2-in-1 day & night anti-glare anti-dazzle driving sun visor extender', price: 349, originalPrice: 699, image: '/window_comfort/antiglare_visor_extender.jpg', badge: '👓 ANTI-GLARE', rating: 4.8 }
  ];

  // SECTION 14: 🔊 AUDIO, BASS & SOUND UPGRADES (10 ITEMS)
  const secAudioSound = [
    { id: 'aud-1', name: 'Coaxial 2-Way Car Speakers (6.5-Inch)', desc: '300W peak 6.5 inch dual cone coaxial door speaker pair', price: 1299, originalPrice: 2499, image: '/audio_sound/coaxial_speakers.jpg', badge: '🔊 COAXIAL SPEAKERS', rating: 4.9 },
    { id: 'aud-2', name: 'Component Car Speakers (With Tweeters)', desc: '350W 6.5 inch component speaker system with silk dome tweeters & crossover', price: 2999, originalPrice: 5999, image: '/audio_sound/component_speakers.jpg', badge: '🎵 COMPONENT SET', rating: 4.9 },
    { id: 'aud-3', name: 'Under-Seat Active Powered Subwoofers', desc: '8-inch 600W slim powered underseat car subwoofer amplifier', price: 6499, originalPrice: 11999, image: '/audio_sound/underseat_subwoofer.jpg', badge: '🔊 UNDERSEAT BASS', rating: 4.9 },
    { id: 'aud-4', name: 'Heavy Bass Tube Subwoofers (12-Inch)', desc: '1000W peak 12 inch bass reflex cylinder enclosure subwoofer box', price: 3499, originalPrice: 6999, image: '/audio_sound/heavy_bass_tube.jpg', badge: '🔊 BASS TUBE', rating: 4.8 },
    { id: 'aud-5', name: '4-Channel High Power Car Amplifiers', desc: '2000W 4-channel MOSFET Class A/B audio power amplifier board', price: 3999, originalPrice: 7999, image: '/audio_sound/four_channel_amp.jpg', badge: '⚡ 4-CHANNEL AMP', rating: 4.9 },
    { id: 'aud-6', name: 'Sound Damping Deadening Sheets (Pack of 4)', desc: 'Butyl rubber self-adhesive car door vibration soundproofing sheets', price: 1499, originalPrice: 2999, image: '/audio_sound/sound_damping_sheets.jpg', badge: '🔇 SOUND DAMPING', rating: 4.9 },
    { id: 'aud-7', name: 'Car Audio Wiring Amplifier Kits (8-Gauge)', desc: 'Complete 8 AWG amplifier installation wiring kit with fuse holder', price: 799, originalPrice: 1499, image: '/audio_sound/audio_wiring_kit.jpg', badge: '🔌 WIRING KIT', rating: 4.8 },
    { id: 'aud-8', name: 'High-to-Low Audio Converter Adapters', desc: '2-channel speaker wire to RCA high to low audio line output converter', price: 299, originalPrice: 599, image: '/audio_sound/line_output_converter.jpg', badge: '🎵 LINE CONVERTER', rating: 4.7 },
    { id: 'aud-9', name: 'Bluetooth FM Transmitters (Hands-Free)', desc: 'Dual USB QC3.0 fast charging Bluetooth 5.0 FM car audio receiver', price: 499, originalPrice: 999, image: '/audio_sound/bluetooth_fm_transmitter.jpg', badge: '📻 FM TRANSMITTER', rating: 4.8 },
    { id: 'aud-10', name: 'High Frequency Silk Dome Tweeters', desc: '150W neodymium silk dome micro car tweeter speaker pair with crossover', price: 449, originalPrice: 899, image: '/audio_sound/dome_tweeters.jpg', badge: '🎵 DOME TWEETERS', rating: 4.8 }
  ];

  // SECTION 15: 👑 LUXURY INTERIOR DETAILING & COMFORT (10 ITEMS)
  const secLuxuryInterior = [
    { id: 'lxi-1', name: 'Alcantara Suede Fabric Wrap Rolls', desc: 'Self-adhesive stretchable premium alcantara suede fabric roll 1.5m', price: 699, originalPrice: 1399, image: '/luxury_interior/alcantara_wrap.jpg', badge: '👑 SUEDE FABRIC', rating: 4.9 },
    { id: 'lxi-2', name: 'Seat Belt Soft Comfort Cushion Pads', desc: 'Soft breathable carbon fiber / plush leather seatbelt shoulder pad pair', price: 299, originalPrice: 599, image: '/luxury_interior/seatbelt_pads.jpg', badge: '🛋️ BELT PAD', rating: 4.8 },
    { id: 'lxi-3', name: 'Memory Foam Center Armrest Cushions', desc: 'Ergonomic leather memory foam console armrest pad with phone pocket', price: 499, originalPrice: 999, image: '/luxury_interior/armrest_cushion.jpg', badge: '🛋️ ARMREST CUSHION', rating: 4.9 },
    { id: 'lxi-4', name: 'Tissue Box Holders for Sun Visor', desc: 'PU leather visor & headrest back hanging tissue paper box case', price: 349, originalPrice: 699, image: '/luxury_interior/visor_tissue_box.jpg', badge: '📦 TISSUE HOLDER', rating: 4.8 },
    { id: 'lxi-5', name: 'Car Steering Wheel Power Spinner Knobs', desc: 'Heavy duty 360 degree smooth bearing steering assist knob ball', price: 399, originalPrice: 799, image: '/luxury_interior/steering_spinner_knob.jpg', badge: '🏎️ SPINNER KNOB', rating: 4.8 },
    { id: 'lxi-6', name: 'Universal Fit PU Leather Seat Covers Set', desc: 'Full set breathable PU leather front & rear car seat cover set', price: 2499, originalPrice: 4999, image: '/luxury_interior/pu_leather_seat_covers.jpg', badge: '👑 LEATHER SEATS', rating: 4.9 },
    { id: 'lxi-7', name: 'Beaded Wooden Seat Massager Mats', desc: 'Natural wooden bead ventilation back pain relief seat mat cushion', price: 599, originalPrice: 1199, image: '/luxury_interior/wooden_bead_mat.jpg', badge: '🪵 WOODEN BEAD MAT', rating: 4.8 },
    { id: 'lxi-8', name: 'Car Interior Dust Cleaning Gel Slime', desc: 'Reusable magic dust cleaning jelly putty for AC vents & keyboard', price: 199, originalPrice: 399, image: '/luxury_interior/cleaning_gel_slime.jpg', badge: '🧹 CLEANING GEL', rating: 4.7 },
    { id: 'lxi-9', name: 'Car Headrest Coat & Bag Hanger Hooks', desc: 'Heavy duty stainless steel / ABS backseat headrest organizer hook pair', price: 249, originalPrice: 499, image: '/luxury_interior/headrest_coat_hooks.jpg', badge: '🧥 HEADREST HOOK', rating: 4.8 },
    { id: 'lxi-10', name: 'Gear Shift Knob Silicon & Leather Covers', desc: 'Universal slip-on anti-scratch gear knob protective sleeve cover', price: 199, originalPrice: 399, image: '/luxury_interior/gear_shift_cover.jpg', badge: '🕹️ GEAR COVER', rating: 4.7 }
  ];

  // SECTION 16: 🛡️ CAR SAFETY, BODY PROTECTION & STYLING (10 ITEMS)
  const secBodyProtection = [
    { id: 'bpr-1', name: 'Rubber Bumper Protector Guard Strips', desc: 'Flexible anti-scratch rubber corner guard protector strips set of 4', price: 299, originalPrice: 599, image: '/body_protection/bumper_protector_strips.jpg', badge: '🛡️ BUMPER GUARD', rating: 4.9 },
    { id: 'bpr-2', name: 'Door Open Safety Reflective Stickers', desc: 'High visibility night warning open door reflective safety sticker set', price: 149, originalPrice: 299, image: '/body_protection/door_reflective_stickers.jpg', badge: '🚨 REFLECTIVE STICKERS', rating: 4.8 },
    { id: 'bpr-3', name: 'Car Wheel Rim Protector Rings (8m)', desc: 'Flexible rubber alloy wheel rim anti-scratch decor protector strip', price: 399, originalPrice: 799, image: '/body_protection/wheel_rim_protectors.jpg', badge: '🛞 RIM PROTECTOR', rating: 4.8 },
    { id: 'bpr-4', name: 'Vehicle-Specific Car Mud Flaps Set', desc: 'Custom molded flexible rubber splash guard mud flap kit of 4', price: 449, originalPrice: 899, image: '/body_protection/vehicle_mud_flaps.jpg', badge: '🛡️ MUD FLAPS', rating: 4.9 },
    { id: 'bpr-5', name: 'Car Bonnet Hood Scoop Vents', desc: 'Carbon fiber look decorative air intake bonnet hood scoop pair', price: 499, originalPrice: 999, image: '/body_protection/hood_scoop_vents.jpg', badge: '🏎️ HOOD SCOOP', rating: 4.8 },
    { id: 'bpr-6', name: 'Side Mirror Rain Eyebrow Guards', desc: 'Flexible PVC smoke black side mirror rain visor shield cover pair', price: 199, originalPrice: 399, image: '/body_protection/mirror_rain_eyebrows.jpg', badge: '🌧️ MIRROR VISOR', rating: 4.8 },
    { id: 'bpr-7', name: 'Underbody Anti-Rust Coating Sprays', desc: 'Rubberized underbody rust proofing anti-corrosion spray 500ml', price: 349, originalPrice: 699, image: '/body_protection/underbody_antirust_spray.jpg', badge: '🛡️ ANTI-RUST SPRAY', rating: 4.9 },
    { id: 'bpr-8', name: 'Silencer Zinc Exhaust Coating Sprays', desc: 'High temperature 600°C zinc silencer anti-corrosion spray 500ml', price: 399, originalPrice: 799, image: '/body_protection/silencer_zinc_spray.jpg', badge: '🔥 SILENCER SPRAY', rating: 4.9 },
    { id: 'bpr-9', name: 'High-Gloss PPF Door Edge Tapes', desc: 'Self-healing clear paint protection film DIY tape roll for door edges 5m', price: 299, originalPrice: 599, image: '/body_protection/ppf_protection_tapes.jpg', badge: '✨ PPF TAPE', rating: 4.8 },
    { id: 'bpr-10', name: 'Car Door Welcome Scuff Sill Plates', desc: 'Stainless steel threshold scuff plate foot step protector set of 4', price: 699, originalPrice: 1399, image: '/body_protection/door_sill_plates.jpg', badge: '✨ SILL PLATES', rating: 4.9 }
  ];

  // SECTION 17: ⛺ WINTER, RAIN & EMERGENCY OFF-ROADING GEARS (10 ITEMS)
  const secEmergencyOffroad = [
    { id: 'emo-1', name: 'Anti-Fog Rainproof Side Mirror Films', desc: 'Nano hydrophobic anti-fog anti-glare waterproof side mirror sticker pair', price: 199, originalPrice: 399, image: '/emergency_offroad/antifog_mirror_film.jpg', badge: '🌧️ ANTI-FOG FILM', rating: 4.8 },
    { id: 'emo-2', name: 'Foldable Windshield Snow & Sun Covers', desc: 'All-weather magnetic frost ice snow & UV protector windshield guard', price: 499, originalPrice: 999, image: '/emergency_offroad/snow_sun_windshield_cover.jpg', badge: '❄️ SNOW & SUN COVER', rating: 4.9 },
    { id: 'emo-3', name: 'Heavy Duty Steel Towing Chains (4m)', desc: '8-Ton heavy steel tow chain with safety forged clevis latch hooks', price: 999, originalPrice: 1999, image: '/emergency_offroad/heavy_towing_chains.jpg', badge: '🚨 8-TON CHAIN', rating: 4.9 },
    { id: 'emo-4', name: 'Car Emergency First Aid Kits (RTO Compliant)', desc: 'RTO compliant medical emergency first aid pouch with bandages & antiseptics', price: 299, originalPrice: 599, image: '/emergency_offroad/first_aid_kit.jpg', badge: '🚑 RTO FIRST AID', rating: 4.9 },
    { id: 'emo-5', name: 'Portable Car Battery Charger Boosters', desc: '12000mAh 12V 1000A peak emergency jump starter power bank with LED flash', price: 2999, originalPrice: 5999, image: '/emergency_offroad/battery_jump_booster.jpg', badge: '⚡ JUMP STARTER', rating: 4.9 },
    { id: 'emo-6', name: 'Tire Traction Escape Mats (Pair)', desc: 'Heavy polypropylene non-slip tire traction board tracks for mud & sand', price: 1299, originalPrice: 2499, image: '/emergency_offroad/tire_traction_mats.jpg', badge: '🛞 TRACTION MAT', rating: 4.8 },
    { id: 'emo-7', name: 'Car Breakdown Warning Triangle Stands', desc: 'Reflective red hazard safety triangle warning stand for night emergencies', price: 249, originalPrice: 499, image: '/emergency_offroad/warning_triangles.jpg', badge: '⚠️ WARNING STAND', rating: 4.8 },
    { id: 'emo-8', name: 'Fire Extinguisher Sprays for Car Cabin', desc: 'Compact 500ml foam fire stop extinguisher spray bottle with mount bracket', price: 349, originalPrice: 699, image: '/emergency_offroad/fire_extinguisher_spray.jpg', badge: '🔥 FIRE EXTINGUISHER', rating: 4.9 },
    { id: 'emo-9', name: 'Yellow Halogen Fog Light Bulbs (H4/H7)', desc: '3000K golden yellow 100W high visibility fog halogen bulb pair', price: 399, originalPrice: 799, image: '/emergency_offroad/yellow_halogen_fog_bulbs.jpg', badge: '💡 FOG BULBS', rating: 4.8 },
    { id: 'emo-10', name: 'Universal Car Roof Rain Gutter Rails', desc: 'Flexible rubber roof water rain diversion gutter molding strip 2m', price: 349, originalPrice: 699, image: '/emergency_offroad/roof_rain_gutter_rails.jpg', badge: '🌧️ RAIN GUTTER', rating: 4.7 }
  ];

  // SECTION 18: ⛺ LIFESTYLE, CAMPING & IN-CAR DINING (10 ITEMS)
  const secLifestyleCamping = [
    { id: 'lfc-1', name: 'Car Steering Wheel Eat & Work Trays', desc: 'Dual-sided steering wheel clip-on food dining & laptop desk tray', price: 499, originalPrice: 999, image: '/lifestyle_camping/steering_eat_work_tray.jpg', badge: '🍱 WORK & EAT TRAY', rating: 4.9 },
    { id: 'lfc-2', name: '12V Car Electric Kettles (500ml)', desc: '12V cigarette lighter stainless steel rapid water boiler tea kettle', price: 1299, originalPrice: 2499, image: '/lifestyle_camping/electric_kettle_12v.jpg', badge: '☕ 12V KETTLE', rating: 4.9 },
    { id: 'lfc-3', name: 'Mini Car Refrigerator & Warmer (7.5L)', desc: '7.5L portable 12V dual cooling & heating mini fridge for cars & travel', price: 2999, originalPrice: 5999, image: '/lifestyle_camping/mini_car_fridge.jpg', badge: '❄️ MINI CAR FRIDGE', rating: 4.9 },
    { id: 'lfc-4', name: 'Car Seat Back Dining & Drink Tables', desc: 'Foldable backseat dining tray table with phone holder & cup slot', price: 799, originalPrice: 1499, image: '/lifestyle_camping/backseat_dining_table.jpg', badge: '🍽️ DINING TABLE', rating: 4.8 },
    { id: 'lfc-5', name: 'Car Window Camping Mosquito Mesh Curtains', desc: 'Elastic breathable door frame camping mosquito net screen pair', price: 399, originalPrice: 799, image: '/lifestyle_camping/camping_window_mesh.jpg', badge: '⛺ CAMPING MESH', rating: 4.8 },
    { id: 'lfc-6', name: 'Multi-Cup Holder Expander Adapters', desc: '360 degree rotating 2-in-1 car console cup holder expander & tray', price: 349, originalPrice: 699, image: '/lifestyle_camping/cupholder_expander.jpg', badge: '🥤 CUP EXPANDER', rating: 4.8 },
    { id: 'lfc-7', name: 'Car Backseat Cloth Hanging Garment Bags', desc: 'Foldable backseat suit coat hanger wardrobe storage organizer', price: 899, originalPrice: 1799, image: '/lifestyle_camping/backseat_hanging_wardrobe.jpg', badge: '🧥 CAR WARDROBE', rating: 4.8 },
    { id: 'lfc-8', name: 'Portable Hanging Car Umbrella Holder Bags', desc: 'Waterproof leather backseat hanging wet umbrella storage pouch', price: 249, originalPrice: 499, image: '/lifestyle_camping/umbrella_holder_bag.jpg', badge: '☂️ UMBRELLA BAG', rating: 4.7 },
    { id: 'lfc-9', name: 'Car Seat Gap Organizer Pockets', desc: 'PU leather console side gap filler drop catcher storage box pair', price: 399, originalPrice: 799, image: '/lifestyle_camping/seat_gap_filler_organizer.jpg', badge: '📦 GAP ORGANIZER', rating: 4.8 },
    { id: 'lfc-10', name: '12V Plug-In Heated Seat Cushion Mats', desc: '12V fast heating plush velvet winter car seat warmer cushion pad', price: 1199, originalPrice: 2299, image: '/lifestyle_camping/heated_seat_cushion_12v.jpg', badge: '🔥 HEATED SEAT', rating: 4.9 }
  ];

  // SECTION 19: 🛡️ CAR SECURITY, ANTI-THEFT & CHILD SAFETY (10 ITEMS)
  const secSecuritySafety = [
    { id: 'sec-1', name: 'Heavy-Duty Steering Wheel Clutch Locks', desc: 'Hardened steel extendable steering pedal anti-theft bar lock with 3 keys', price: 999, originalPrice: 1999, image: '/security_safety/steering_wheel_lock.jpg', badge: '🔒 STEERING LOCK', rating: 4.9 },
    { id: 'sec-2', name: 'Universal Car Wheel Tire Clamp Locks', desc: 'Heavy steel anti-theft wheel immobilization clamp for cars & SUVs', price: 1499, originalPrice: 2999, image: '/security_safety/wheel_clamp_lock.jpg', badge: '🔒 WHEEL CLAMP', rating: 4.9 },
    { id: 'sec-3', name: 'Gear Shift Lever Lock Assemblies', desc: 'Heavy-duty steel gear lever console anti-theft pin lock', price: 1299, originalPrice: 2499, image: '/security_safety/gear_shift_lock.jpg', badge: '🔒 GEAR LOCK', rating: 4.8 },
    { id: 'sec-4', name: 'ISOFIX Compatible Child Safety Car Seats', desc: 'Group 0+/1/2/3 360 degree rotating ISOFIX reclining baby car seat', price: 6999, originalPrice: 12999, image: '/security_safety/child_car_seat.jpg', badge: '👶 CHILD SEAT', rating: 4.9 },
    { id: 'sec-5', name: 'Car Seat Belt Adjusters for Kids', desc: 'Triangle safety positioner belt cover clip pad for children', price: 199, originalPrice: 399, image: '/security_safety/seatbelt_adjuster_kids.jpg', badge: '👶 BELT ADJUSTER', rating: 4.8 },
    { id: 'sec-6', name: 'Smart RFID Signal Blocker Key Pouches', desc: 'Faraday cage signal blocking pouch for keyless entry car key fobs', price: 299, originalPrice: 599, image: '/security_safety/rfid_key_blocker_pouch.jpg', badge: '🛡️ RFID BLOCKER', rating: 4.9 },
    { id: 'sec-7', name: 'Car Battery Master Disconnect Switches', desc: 'Heavy duty 12V 250A battery power cut-off isolator switch knob', price: 349, originalPrice: 699, image: '/security_safety/battery_disconnect_switch.jpg', badge: '⚡ BATTERY SWITCH', rating: 4.8 },
    { id: 'sec-8', name: 'High-Visibility Reflective Safety Vests', desc: 'RTO compliant neon yellow fluorescent reflective breakdown safety jacket', price: 199, originalPrice: 399, image: '/security_safety/reflective_safety_vest.jpg', badge: '🚨 SAFETY VEST', rating: 4.8 },
    { id: 'sec-9', name: 'Digital HUD with Fatigue Driving Alerts', desc: 'Smart GPS & OBD2 HUD speed display with fatigue & overspeed buzzer', price: 1999, originalPrice: 3999, image: '/security_safety/hud_fatigue_alert.jpg', badge: '💡 FATIGUE ALERT', rating: 4.9 },
    { id: 'sec-10', name: 'Car Door Safety Reflective Tape Rolls (5m)', desc: 'High brightness honeycomb reflective warning tape roll for doors', price: 149, originalPrice: 299, image: '/security_safety/reflective_tape_roll.jpg', badge: '🚨 REFLECTIVE TAPE', rating: 4.8 }
  ];

  // SECTION 20: 🎨 CUSTOM INTERIORS & HYDRO-DIPPING UPGRADES (10 ITEMS)
  const secCustomInteriors = [
    { id: 'cti-1', name: 'DIY Hydro-Dipping Film Rolls (Carbon & Marble)', desc: 'Water transfer printing hydrographic film roll with activator spray kit', price: 499, originalPrice: 999, image: '/custom_interiors/hydro_dipping_film.jpg', badge: '🎨 HYDRO DIPPING', rating: 4.9 },
    { id: 'cti-2', name: 'Universal Car Dashboard Leather Wrap Liners', desc: 'Self-adhesive microfiber leather vinyl fabric roll for interior trims 2m', price: 699, originalPrice: 1399, image: '/custom_interiors/dashboard_leather_wrap.jpg', badge: '✨ LEATHER WRAP', rating: 4.9 },
    { id: 'cti-3', name: 'Car Roof USB Star Light Atmosphere Projector', desc: 'USB plug-in romantic galaxy starlight night light for interior roof', price: 199, originalPrice: 399, image: '/custom_interiors/roof_starlight_usb.jpg', badge: '✨ STARLIGHT USB', rating: 4.9 },
    { id: 'cti-4', name: 'Aluminium Alloy Racing Car Pedal Covers', desc: 'Non-slip aluminium sports pedal pad set for manual & automatic cars', price: 399, originalPrice: 799, image: '/custom_interiors/alloy_racing_pedals.jpg', badge: '🏎️ RACING PEDALS', rating: 4.8 },
    { id: 'cti-5', name: 'Aluminium Chrome Door Lock Pin Knobs', desc: 'Universal aluminium interior door lock pull pin replacement set of 4', price: 249, originalPrice: 499, image: '/custom_interiors/door_lock_pin_knobs.jpg', badge: '✨ LOCK PINS', rating: 4.8 },
    { id: 'cti-6', name: 'Interior Pillar Fabric Suede Wraps (2m)', desc: 'Self-adhesive velvet suede cloth fabric wrap roll for A/B/C pillars', price: 799, originalPrice: 1599, image: '/custom_interiors/pillar_suede_wrap.jpg', badge: '✨ SUEDE WRAP', rating: 4.8 },
    { id: 'cti-7', name: 'Car Seat Back Anti-Kick Protector Pads', desc: 'PU leather seat back anti-dirty kick guard cover with organizer pockets', price: 349, originalPrice: 699, image: '/custom_interiors/seatback_kick_protector.jpg', badge: '🛡️ KICK PROTECTOR', rating: 4.8 },
    { id: 'cti-8', name: 'Customisable Bluetooth LED Welcome Sill Plates', desc: 'App-controlled custom text RGB LED moving door sill scuff plates', price: 1299, originalPrice: 2599, image: '/custom_interiors/custom_led_sill_plates.jpg', badge: '✨ LED SILL PLATES', rating: 4.9 },
    { id: 'cti-9', name: 'Sun Visor Magnetic Sunglasses Clip Holder', desc: 'Leather magnetic sun visor glasses clip & card holder organizer', price: 199, originalPrice: 399, image: '/custom_interiors/visor_sunglasses_clip.jpg', badge: '🕶️ VISOR CLIP', rating: 4.8 },
    { id: 'cti-10', name: 'Car Center Console Armrest Leather Pads', desc: 'Soft waterproof PU leather center armrest console cushion cover pad', price: 299, originalPrice: 599, image: '/custom_interiors/center_console_leather_pad.jpg', badge: '✨ CONSOLE PAD', rating: 4.9 }
  ];

  // SECTION 21: 🧼 PRO-DETAILING COMPOUNDS & MACHINE GEARS (10 ITEMS)
  const secProDetailing = [
    { id: 'dtl-1', name: '12V Cordless Dual Action Car Buffer Polishers', desc: '12V lithium rechargeable dual action orbital car buffer polishing machine kit', price: 2999, originalPrice: 5999, image: '/pro_detailing/cordless_buffer_polisher.jpg', badge: '🧼 BUFFER POLISHER', rating: 4.9 },
    { id: 'dtl-2', name: 'Car Polishing Sponge Foam Pads Set (5 Pcs)', desc: 'Cut, polish & finish waffle foam sponge buffering pads kit 5-6 inch', price: 499, originalPrice: 999, image: '/pro_detailing/polishing_foam_pads.jpg', badge: '✨ POLISHING PADS', rating: 4.8 },
    { id: 'dtl-3', name: '9H Hardness Nano Ceramic Coating DIY Kits', desc: '9H nano ceramic crystal coating 30ml liquid kit for high gloss paint protection', price: 799, originalPrice: 1599, image: '/pro_detailing/ceramic_coating_kit.jpg', badge: '✨ 9H CERAMIC KIT', rating: 4.9 },
    { id: 'dtl-4', name: 'Ultra-Gloss Graphene Spray Coating Cans', desc: 'Advanced graphene oxide hydrophobic shine & scratch protection spray 500ml', price: 699, originalPrice: 1399, image: '/pro_detailing/graphene_coating_spray.jpg', badge: '✨ GRAPHENE SPRAY', rating: 4.9 },
    { id: 'dtl-5', name: 'Iron & Wheel Fallout Decontaminating Sprays', desc: 'Color changing iron particle brake dust remover spray 500ml for alloy wheels', price: 449, originalPrice: 899, image: '/pro_detailing/iron_fallout_remover.jpg', badge: '🧼 IRON REMOVER', rating: 4.8 },
    { id: 'dtl-6', name: 'Car Leather Seat Cleaner & Conditioner Creams', desc: 'pH balanced premium leather seat cleaning & nourishing conditioner cream 300g', price: 399, originalPrice: 799, image: '/pro_detailing/leather_cleaner_conditioner.jpg', badge: '✨ LEATHER CLEANER', rating: 4.8 },
    { id: 'dtl-7', name: 'Headlight Restoration Liquid Repair Kits', desc: 'Oxidation yellowing removal liquid restorer & UV protective sealant for headlights', price: 299, originalPrice: 599, image: '/pro_detailing/headlight_restoration_kit.jpg', badge: '💡 HEADLIGHT REPAIR', rating: 4.9 },
    { id: 'dtl-8', name: 'Car Engine Bay Dressing & Protection Sprays', desc: 'High temp non-greasy engine bay rubber & plastic shine restorer spray 500ml', price: 349, originalPrice: 699, image: '/pro_detailing/engine_bay_dressing.jpg', badge: '🏎️ ENGINE DRESSING', rating: 4.8 },
    { id: 'dtl-9', name: 'Microfiber Car Wash Mitt Cleaning Gloves', desc: 'Chenille scratch-free plush microfiber car washing hand mitt glove', price: 199, originalPrice: 399, image: '/pro_detailing/microfiber_wash_mitt.jpg', badge: '🧽 WASH MITT', rating: 4.8 },
    { id: 'dtl-10', name: 'Waterless Car Wash & Wax Concentrates (1L)', desc: 'High dilution 1:10 waterless wash & hydrophobic carnauba gloss concentrate 1L', price: 599, originalPrice: 1199, image: '/pro_detailing/waterless_wash_concentrate.jpg', badge: '🧼 WATERLESS 1L', rating: 4.9 }
  ];

  // SECTION 22: 🔧 PERFORMANCE, EXHAUST & MODIFICATION PARTS (10 ITEMS)
  const secPerformanceMod = [
    { id: 'pmo-1', name: 'Universal High-Performance Cold Air Intake Systems', desc: 'Aluminum induction pipe with washable high-flow cone air filter kit', price: 1499, originalPrice: 2999, image: '/performance_mod/cold_air_intake.jpg', badge: '🏎️ COLD AIR INTAKE', rating: 4.9 },
    { id: 'pmo-2', name: 'Car Exhaust Muffler Turbo Whistle Sound Emulators', desc: 'Aluminum tail pipe turbo sound whistle simulator gadget size XL', price: 299, originalPrice: 599, image: '/performance_mod/turbo_muffler_whistle.jpg', badge: '🔊 TURBO WHISTLE', rating: 4.8 },
    { id: 'pmo-3', name: 'Remote-Controlled Electric Exhaust Valve Cutouts', desc: '2.5 inch stainless steel electric cutout bypass valve with wireless remote', price: 3999, originalPrice: 7999, image: '/performance_mod/remote_exhaust_valve.jpg', badge: '🏎️ EXHAUST CUTOUT', rating: 4.9 },
    { id: 'pmo-4', name: 'Premium Carbon Fiber Muffler Exhaust Tips', desc: 'Real carbon fiber stainless steel dual outlet exhaust tip muffler pipe', price: 1299, originalPrice: 2499, image: '/performance_mod/carbon_exhaust_tip.jpg', badge: '✨ CARBON TIP', rating: 4.9 },
    { id: 'pmo-5', name: 'High-Performance Silicon Spark Plug Ignition Wires', desc: '8mm low resistance high voltage silicone ignition wire cable set', price: 799, originalPrice: 1599, image: '/performance_mod/spark_plug_wires.jpg', badge: '⚡ IGNITION WIRES', rating: 4.8 },
    { id: 'pmo-6', name: 'Car Bonnet Engine Hood Hydraulic Damper Struts', desc: 'Custom gas spring hydraulic bonnet lift support strut shock kit', price: 899, originalPrice: 1799, image: '/performance_mod/bonnet_hydraulic_struts.jpg', badge: '🔧 HOOD STRUTS', rating: 4.8 },
    { id: 'pmo-7', name: 'Universal GT F1 Style Rear Trunk Spoiler Wings', desc: 'Lightweight aluminum alloy racing GT rear spoiler wing 110cm', price: 2499, originalPrice: 4999, image: '/performance_mod/rear_spoiler_wing.jpg', badge: '🏎️ GT SPOILER', rating: 4.9 },
    { id: 'pmo-8', name: 'Car Body Fender Flares Wheel Arch Trim Kit', desc: 'Universal flexible polyurethane wheel arch fender flares set of 4', price: 1199, originalPrice: 2399, image: '/performance_mod/fender_flares_arches.jpg', badge: '🏎️ FENDER FLARES', rating: 4.8 },
    { id: 'pmo-9', name: 'Universal Bumper Racing Tow Hooks & Straps', desc: 'CNC aluminum alloy front bumper folding tow ring trailer hook kit', price: 499, originalPrice: 999, image: '/performance_mod/bumper_tow_hook.jpg', badge: '🚨 TOW HOOK', rating: 4.8 },
    { id: 'pmo-10', name: 'Car Bonnet Hood Thermal Sound Deadening Shields', desc: 'Aluminum foil self-adhesive heat insulation engine hood damping mat', price: 599, originalPrice: 1199, image: '/performance_mod/hood_sound_deadening.jpg', badge: '🔇 HOOD SHIELD', rating: 4.8 }
  ];

  // SECTION 23: 📱 ADVANCED IN-CAR SCREENS & CAMERA TECH (10 ITEMS)
  const secScreensTech = [
    { id: 'stk-1', name: '360-Degree Surround View 3D Camera Systems', desc: '4-camera HD 360 degree panoramic surround view parking system kit', price: 4999, originalPrice: 9999, image: '/car_screens_tech/surround_360_camera.jpg', badge: '📱 360° CAMERA', rating: 4.9 },
    { id: 'stk-2', name: '10-Inch Touch Rearview Mirror Dual Dashcams', desc: 'Full touch screen rearview mirror dual front & rear recording dashcam', price: 3499, originalPrice: 6999, image: '/car_screens_tech/rearview_mirror_dashcam.jpg', badge: '📹 MIRROR DASHCAM', rating: 4.9 },
    { id: 'stk-3', name: 'Wireless Steering Wheel Remote Control Button Pads', desc: 'Universal bluetooth steering wheel media control button pad pair', price: 699, originalPrice: 1399, image: '/car_screens_tech/steering_wheel_buttons.jpg', badge: '📱 STEERING BUTTONS', rating: 4.8 },
    { id: 'stk-4', name: 'Universal 10.1-Inch Headrest Monitor Android Screens', desc: 'Backseat HD touch screen Android headrest entertainment monitor', price: 5999, originalPrice: 11999, image: '/car_screens_tech/headrest_monitor_screen.jpg', badge: '📺 HEADREST SCREEN', rating: 4.9 },
    { id: 'stk-5', name: 'Car OBD2 Digital HUD Gauge with GPS & Compass', desc: 'Multi-function OBD2 + GPS smart HUD gauge display with fault code scanner', price: 2499, originalPrice: 4999, image: '/car_screens_tech/obd2_hud_gauge.jpg', badge: '💡 OBD2 HUD', rating: 4.9 },
    { id: 'stk-6', name: 'Car A-Pillar Blind Spot Radar Detection Systems', desc: '24GHz microwave radar BSD blind spot monitoring system with LED indicators', price: 3999, originalPrice: 7999, image: '/car_screens_tech/blind_spot_radar.jpg', badge: '🛡️ BLIND SPOT RADAR', rating: 4.8 },
    { id: 'stk-7', name: 'Voice & Music Control Interior LED Light Controllers', desc: 'Smart app & sound reactive music sync controller box for ambient lights', price: 499, originalPrice: 999, image: '/car_screens_tech/voice_led_controller.jpg', badge: '🎵 VOICE LIGHTING', rating: 4.8 },
    { id: 'stk-8', name: 'Heavy-Duty 4-Pin Backup Camera Extension Cables (10m)', desc: '10m pure copper 4-pin aviation extension cable for reverse camera', price: 399, originalPrice: 799, image: '/car_screens_tech/camera_extension_cable.jpg', badge: '🔌 CAMERA CABLE', rating: 4.8 },
    { id: 'stk-9', name: 'Car-Specific Android Stereo Dashboard Frames (9/10")', desc: 'Custom molded ABS plastic car fascia frame panel for Android stereo', price: 799, originalPrice: 1599, image: '/car_screens_tech/android_stereo_frame.jpg', badge: '📱 DASHBOARD FRAME', rating: 4.8 },
    { id: 'stk-10', name: 'Bluetooth 5.0 Audio Receiver Adapters with 3.5mm Aux', desc: 'Hands-free wireless bluetooth 5.0 music receiver adapter for car stereo', price: 299, originalPrice: 599, image: '/car_screens_tech/bluetooth_aux_receiver.jpg', badge: '🎵 BT AUX RECEIVER', rating: 4.9 }
  ];

  // SECTION 24: 🛌 PREMIUM SUV & LONG-TRAVEL COMFORT ESSENTIALS (10 ITEMS)
  const secSuvTravelComfort = [
    { id: 'stc-1', name: 'Heavy-Duty Double-Layer Inflatable Car Mattress Beds', desc: 'Flocked PVC backseat air bed mattress with 12V air pump & 2 pillows', price: 1799, originalPrice: 3499, image: '/suv_travel_comfort/inflatable_car_bed.jpg', badge: '🛌 INFLATABLE BED', rating: 4.9 },
    { id: 'stc-2', name: 'Zipper Magnetic Mesh Window Sunshades (Set of 4)', desc: 'Custom fit magnetic window sunshade curtains with smooth zipper openings', price: 899, originalPrice: 1799, image: '/suv_travel_comfort/zipper_mesh_sunshades.jpg', badge: '☀️ ZIPPER SHADES', rating: 4.9 },
    { id: 'stc-3', name: 'Adjustable Car Headrest Neck Side Support Pillows', desc: '180 degree rotating memory foam side headrest pillow support for sleeping', price: 1199, originalPrice: 2399, image: '/suv_travel_comfort/headrest_side_pillows.jpg', badge: '💤 SIDE PILLOWS', rating: 4.9 },
    { id: 'stc-4', name: 'Memory Foam Driver Seat Height Wedge Cushions', desc: 'Orthopedic wedge seat cushion for improved posture & driving visibility', price: 699, originalPrice: 1399, image: '/suv_travel_comfort/seat_wedge_height_cushion.jpg', badge: '🪑 SEAT WEDGE', rating: 4.8 },
    { id: 'stc-5', name: 'Center Console Armrest Organizers with Dual USB Hub', desc: 'PU leather padded console storage tray with built-in dual USB charging ports', price: 999, originalPrice: 1999, image: '/suv_travel_comfort/armrest_usb_organizer.jpg', badge: '📦 CONSOLE USB HUB', rating: 4.9 },
    { id: 'stc-6', name: 'Foldable Trunk Storage Organizer Box with Cooler Bag', desc: 'Heavy duty multi-compartment trunk storage bag with insulated thermal cooler', price: 1299, originalPrice: 2599, image: '/suv_travel_comfort/trunk_box_cooler_bag.jpg', badge: '📦 COOLER TRUNK BOX', rating: 4.9 },
    { id: 'stc-7', name: 'Universal Backseat Grocery & Umbrella Hanger Hooks (4-Pack)', desc: 'Heavy duty ABS headrest pole hanger hooks for shopping bags & umbrellas', price: 199, originalPrice: 399, image: '/suv_travel_comfort/seatback_grocery_hangers.jpg', badge: '🪝 HANGER HOOKS', rating: 4.8 },
    { id: 'stc-8', name: 'Anti-Glare Car Sun Visor Extension Slide Shields', desc: 'Polarized anti-glare day & night driving windshield sun visor extender', price: 349, originalPrice: 699, image: '/suv_travel_comfort/sunvisor_extension_shield.jpg', badge: '🕶️ VISOR EXTENDER', rating: 4.8 },
    { id: 'stc-9', name: 'Non-Slip DIY Leather Steering Wheel Stitching Kits', desc: 'Microfiber leather steering wheel wrap cover with heavy thread & needle', price: 299, originalPrice: 599, image: '/suv_travel_comfort/steering_leather_stitch_kit.jpg', badge: '🧵 STITCH COVER', rating: 4.8 },
    { id: 'stc-10', name: 'Anti-Sweat Natural Wooden Bead Seat Backrest Mats', desc: 'Breathable wooden bead massager back cushion pad for long distance driving', price: 449, originalPrice: 899, image: '/suv_travel_comfort/wooden_bead_backrest_pad.jpg', badge: '🪵 WOOD BEAD MAT', rating: 4.9 }
  ];

  // SECTION 25: 🔧 PRECISION ENGINE DIAGNOSTICS & SENSOR TECH (10 ITEMS)
  const secEngineSensors = [
    { id: 'sen-1', name: 'Engine Crankshaft Position Sensors (CKP)', desc: 'OEM precision magnetic crankshaft position sensor assembly', price: 699, originalPrice: 1399, image: '/engine_sensors/crankshaft_position_sensor.jpg', badge: '🔧 CRANK SENSOR', rating: 4.9 },
    { id: 'sen-2', name: 'Engine Camshaft Position Sensors (CMP)', desc: 'High accuracy hall effect camshaft position timing sensor', price: 649, originalPrice: 1299, image: '/engine_sensors/camshaft_position_sensor.jpg', badge: '🔧 CAM SENSOR', rating: 4.9 },
    { id: 'sen-3', name: 'Engine Coolant Temperature (ECT) Sensors', desc: 'Brass thread radiator coolant temperature sensor sender unit', price: 299, originalPrice: 599, image: '/engine_sensors/coolant_temp_sensor.jpg', badge: '🌡️ ECT SENSOR', rating: 4.8 },
    { id: 'sen-4', name: 'Wheel Speed ABS Sensors (Vehicle Specific)', desc: 'Front & rear wheel speed anti-lock braking ABS sensor wire harness', price: 799, originalPrice: 1599, image: '/engine_sensors/wheel_speed_abs_sensor.jpg', badge: '⚙️ ABS SENSOR', rating: 4.9 },
    { id: 'sen-5', name: 'Intake Manifold Absolute Pressure (MAP) Sensors', desc: 'Boost pressure intake manifold absolute pressure sensor switch', price: 899, originalPrice: 1799, image: '/engine_sensors/map_pressure_sensor.jpg', badge: '🔧 MAP SENSOR', rating: 4.8 },
    { id: 'sen-6', name: 'Car Alternator Voltage Regulator Assemblies', desc: 'Heavy duty 14V alternator electronic voltage regulator unit with brushes', price: 999, originalPrice: 1999, image: '/engine_sensors/alternator_voltage_regulator.jpg', badge: '⚡ VOLTAGE REGULATOR', rating: 4.8 },
    { id: 'sen-7', name: 'EGR (Exhaust Gas Recirculation) Valves', desc: 'Electric emission control EGR valve assembly for petrol & diesel cars', price: 2499, originalPrice: 4999, image: '/engine_sensors/egr_valve.jpg', badge: '⚙️ EGR VALVE', rating: 4.9 },
    { id: 'sen-8', name: 'Idle Air Control (IAC) Stepper Motor Valves', desc: 'Throttle body idle speed air control stepper motor valve assembly', price: 799, originalPrice: 1599, image: '/engine_sensors/iac_valve.jpg', badge: '⚙️ IAC VALVE', rating: 4.8 },
    { id: 'sen-9', name: 'Fuel Pump Relay Switches (12V 4-Pin/5-Pin)', desc: 'Heavy duty 12V 40A fuel pump power supply relay switch module', price: 199, originalPrice: 399, image: '/engine_sensors/fuel_pump_relay.jpg', badge: '⚡ FUEL RELAY', rating: 4.8 },
    { id: 'sen-10', name: 'Engine Ignition Knock Sensors (KS)', desc: 'Piezoelectric ceramic engine detonation knock vibration sensor', price: 549, originalPrice: 1099, image: '/engine_sensors/knock_sensor.jpg', badge: '🔧 KNOCK SENSOR', rating: 4.8 }
  ];

  // SECTION 26: 💎 EXTERIOR AERO-STYLING, SPOILERS & BODY KITS (10 ITEMS)
  const secExteriorAero = [
    { id: 'aer-1', name: 'Universal 3-Piece Front Bumper Lip Chin Splitters', desc: 'Glossy black ABS 3-piece adjustable front bumper lip splitter spoiler kit', price: 1299, originalPrice: 2599, image: '/exterior_aero/front_bumper_lip_splitter.jpg', badge: '💎 FRONT LIP', rating: 4.9 },
    { id: 'aer-2', name: 'Universal Car Rear Bumper Diffuser with LED Brake Light', desc: 'Shark fin rear bumper lip diffuser valance panel with F1 style LED brake light', price: 1499, originalPrice: 2999, image: '/exterior_aero/rear_bumper_diffuser_led.jpg', badge: '💎 REAR DIFFUSER', rating: 4.9 },
    { id: 'aer-3', name: 'Universal Side Skirt Extensions Lip Strips (2m)', desc: 'Flexible rubber side skirt rocker panel extensions chin lip protector strips', price: 799, originalPrice: 1599, image: '/exterior_aero/side_skirt_extensions.jpg', badge: '🏎️ SIDE SKIRTS', rating: 4.8 },
    { id: 'aer-4', name: 'Carbon Fiber Style Hatchback Roof Spoiler Wings', desc: 'Lightweight carbon pattern rear window roof top ducktail spoiler wing', price: 1199, originalPrice: 2399, image: '/exterior_aero/hatchback_roof_spoiler.jpg', badge: '💎 ROOF SPOILER', rating: 4.9 },
    { id: 'aer-5', name: 'Universal Car Fender Side Vent Grill Stickers (Pair)', desc: '3D chrome & carbon fiber mesh side air flow fender intake vent stickers', price: 299, originalPrice: 599, image: '/exterior_aero/fender_vent_stickers.jpg', badge: '✨ FENDER VENTS', rating: 4.8 },
    { id: 'aer-6', name: 'Car Rear Quarter Window Louver Cover Shutter Trim', desc: 'Sporty ABS plastic rear side triangle window louver shade covers pair', price: 499, originalPrice: 999, image: '/exterior_aero/window_louver_covers.jpg', badge: '💎 WINDOW LOUVER', rating: 4.8 },
    { id: 'aer-7', name: 'Matte Black SUV Hood Bonnet Scoop Cowl Covers', desc: 'Aggressive 3D molded engine bonnet cowl scoop intake vent cover panel', price: 899, originalPrice: 1799, image: '/exterior_aero/bonnet_scoop_cowl_cover.jpg', badge: '🏎️ BONNET SCOOP', rating: 4.8 },
    { id: 'aer-8', name: 'Chrome Front Grille Trim Strip Molding Overlays (5m)', desc: 'Self-adhesive chrome styling molding strip tape for front grille & bumper', price: 249, originalPrice: 499, image: '/exterior_aero/chrome_grille_strips.jpg', badge: '✨ GRILLE STRIPS', rating: 4.8 },
    { id: 'aer-9', name: 'Universal Car Door Edge Guard U-Shape Rubber Molding (5m)', desc: 'Internal steel clip U-channel rubber door edge scratch protector trim roll', price: 299, originalPrice: 599, image: '/exterior_aero/door_edge_guard_molding.jpg', badge: '🛡️ DOOR MOLDING', rating: 4.8 },
    { id: 'aer-10', name: 'High-Gloss Dual-Tone Car Wheel Rim Protect Tapes (8m)', desc: 'Self-adhesive colortrim alloy wheel rim edge protector decal tape roll', price: 349, originalPrice: 699, image: '/exterior_aero/wheel_rim_protect_tape.jpg', badge: '🛞 RIM PROTECTION', rating: 4.8 }
  ];

  const isSteeringCat = activeCategoryPill === 'STEERING & SUSPENSION';
  const totalSubcatPages = isSteeringCat ? 6 : 2;

  const currentVisualSubcategories = isSteeringCat
    ? (steeringSuspensionPages[subcatPage] || steeringSuspensionPages[1])
    : (subcatPage === 1 ? visualSubcategoriesPage1 : visualSubcategoriesPage2);

  const bestSellerProducts = [
    {
      id: 'bs-1',
      title: 'Head Lamp Bulb 100/90W H4',
      sku: 'F002H10019P43',
      brand: 'BOSCH',
      mrp: 85.00,
      price: 72.25,
      discount: '-15%',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1597766353980-87729965a396?w=400&q=80'
    },
    {
      id: 'bs-2',
      title: 'Brake Disc Rotor Assembly',
      sku: '29932974',
      brand: 'TVS-GIRLING',
      mrp: 5554.00,
      price: 4554.28,
      discount: '-18%',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&q=80'
    },
    {
      id: 'bs-3',
      title: 'CLIP Fender Fastener',
      sku: '09401M12405',
      brand: 'MGP',
      mrp: 2.45,
      price: 2.33,
      discount: '-5%',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&q=80'
    },
    {
      id: 'bs-4',
      title: 'Fuel Filter, Petrol',
      sku: 'ZP-2004',
      brand: 'ZIP',
      mrp: 95.00,
      price: 80.75,
      discount: '-15%',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400&q=80'
    },
    {
      id: 'bs-5',
      title: 'Wiper Blade Eco 18"',
      sku: '3397011652',
      brand: 'BOSCH',
      mrp: 351.00,
      price: 298.35,
      discount: '-15%',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=400&q=80'
    },
    {
      id: 'bs-6',
      title: 'Wiper Blade Aerotwin Set',
      sku: '3397006944',
      brand: 'BOSCH',
      mrp: 810.00,
      price: 688.50,
      discount: '-15%',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&q=80'
    }
  ];

  const oesBrands = [
    {
      name: 'BOSCH',
      count: '100+ Products',
      logo: 'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Bosch-logo.svg&width=300',
      brandKey: 'Bosch'
    },
    {
      name: 'ELOFIC',
      count: '100+ Products',
      logo: 'https://logo.clearbit.com/elofic.com',
      brandKey: 'Elofic'
    },
    {
      name: 'BHARATH FILTERS',
      count: '100+ Products',
      logo: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=200&q=80',
      brandKey: 'Bharath'
    },
    {
      name: 'PHILIPS',
      count: '84 Products',
      logo: 'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Philips_logo.svg&width=300',
      brandKey: 'Philips'
    },
    {
      name: 'DAYCO',
      count: '100+ Products',
      logo: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=200&q=80',
      brandKey: 'Dayco'
    },
    {
      name: 'ZIP',
      count: '100+ Products',
      logo: 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=200&q=80',
      brandKey: 'Zip'
    }
  ];

  const oemBrands = [
    {
      name: 'TOYOTA',
      count: '100+ Products',
      logo: 'https://img.icons8.com/color/96/toyota.png',
      makeKey: 'Toyota'
    },
    {
      name: 'NISSAN',
      count: '100+ Products',
      logo: 'https://img.icons8.com/color/96/nissan.png',
      makeKey: 'Nissan'
    },
    {
      name: 'RENAULT',
      count: '100+ Products',
      logo: 'https://img.icons8.com/color/96/renault.png',
      makeKey: 'Renault'
    },
    {
      name: 'SKODA',
      count: '100+ Products',
      logo: 'https://img.icons8.com/color/96/skoda.png',
      makeKey: 'Skoda'
    },
    {
      name: 'VOLKSWAGEN',
      count: '100+ Products',
      logo: 'https://img.icons8.com/color/96/volkswagen.png',
      makeKey: 'Volkswagen'
    },
    {
      name: 'HYUNDAI',
      count: '100+ Products',
      logo: 'https://img.icons8.com/color/96/hyundai.png',
      makeKey: 'Hyundai'
    },
    {
      name: 'MGP',
      count: '100+ Products',
      logo: 'https://img.icons8.com/color/96/suzuki.png',
      makeKey: 'Maruti'
    },
    {
      name: 'HONDA',
      count: '100+ Products',
      logo: 'https://img.icons8.com/color/96/honda.png',
      makeKey: 'Honda'
    },
    {
      name: 'TATA',
      count: '100+ Products',
      logo: 'https://img.icons8.com/color/96/tata.png',
      makeKey: 'Tata'
    }
  ];

  return (
    <div className="customer-home-wrapper" style={{ background: '#F8FAFC', position: 'relative' }}>
      {/* Active Vehicle Fitment Bar */}
      {selectedVehicle && (
        <div style={{ background: '#0F2167', color: '#FFFFFF', padding: '0.6rem 1rem', textAlign: 'center', fontSize: '0.85rem' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            <Car size={16} color="#FF6B00" />
            <span>Showing verified compatible spare parts for <b>{selectedVehicle.makeName} {selectedVehicle.modelName} ({selectedVehicle.variant})</b></span>
            <button
              onClick={() => setIsVehicleModalOpen(true)}
              style={{ background: '#FF6B00', color: '#FFFFFF', border: 'none', borderRadius: '4px', padding: '0.15rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer', marginLeft: '0.5rem' }}
            >
              Change Vehicle
            </button>
          </div>
        </div>
      )}

      {/* KEY FEATURES & PLATFORM OBJECTIVE TRUST BANNER */}
      <section style={{ background: '#0F2167', color: '#FFFFFF', padding: '1.25rem 0', borderBottom: '4px solid #FF6B00', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            
            {/* Feature 1: Vehicle Compatibility Selector */}
            <div
              onClick={() => setIsVehicleModalOpen(true)}
              style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer', border: '1px solid rgba(255, 255, 255, 0.15)', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 107, 0, 0.2)'; e.currentTarget.style.borderColor = '#FF6B00'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; }}
            >
              <div style={{ background: '#FF6B00', borderRadius: '50%', padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                <Car size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  Vehicle Fitment Filter <span style={{ background: '#10B981', color: '#FFFFFF', fontSize: '0.6rem', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>ZERO RETURNS</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#CBD5E1', marginTop: '0.15rem' }}>
                  {selectedVehicle ? `${selectedVehicle.makeName} ${selectedVehicle.modelName} (${selectedVehicle.year})` : 'Brand ➔ Model ➔ Year ➔ Fuel Filter'}
                </div>
              </div>
            </div>

            {/* Feature 2: 100% Genuine & 10-Day Refund */}
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.85rem', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ background: '#10B981', borderRadius: '50%', padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#FFFFFF' }}>
                  100% Genuine OES/OEM
                </div>
                <div style={{ fontSize: '0.72rem', color: '#CBD5E1', marginTop: '0.15rem' }}>
                  100% Original Part or 10-Day 100% Full Refund Guarantee
                </div>
              </div>
            </div>

            {/* Feature 3: Mumbai Same-Day Delivery */}
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.85rem', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ background: '#E11D48', borderRadius: '50%', padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                <Clock size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  Mumbai Same-Day Express <span style={{ background: '#F59E0B', color: '#0F172A', fontSize: '0.6rem', fontWeight: 900, padding: '0.1rem 0.4rem', borderRadius: '3px' }}>2-4 HRS</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#CBD5E1', marginTop: '0.15rem' }}>
                  Hyper-Local Instant Delivery via Porter & Borzo
                </div>
              </div>
            </div>

            {/* Feature 4: Tech Stack & Pan-India Dispatch */}
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.85rem', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ background: '#3B82F6', borderRadius: '50%', padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                <Truck size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#FFFFFF' }}>
                  Pan-India Shipping & COD
                </div>
                <div style={{ fontSize: '0.72rem', color: '#CBD5E1', marginTop: '0.15rem' }}>
                  Powered by Shiprocket, Delhivery, Razorpay & Cashfree
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Promo Banner Grid Section */}
      <section style={{ padding: '1.5rem 0 1rem 0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {promoCards.map(card => (
              <div
                key={card.id}
                style={{
                  background: card.bgGradient,
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 140px',
                  gap: '1rem',
                  alignItems: 'center',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  border: '1px solid #E2E8F0',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div>
                  <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#DC2626', margin: 0, lineHeight: 1 }}>
                    {card.discount}
                  </h2>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0.25rem 0 0.75rem 0', textTransform: 'uppercase' }}>
                    {card.title}
                  </h3>
                  <div style={{ background: '#FFFFFF', padding: '0.25rem 0.6rem', borderRadius: '4px', display: 'inline-block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '1rem', border: '1px solid #CBD5E1' }}>
                    {card.brand}
                  </div>
                  <div>
                    <button
                      className="btn-primary"
                      style={{ borderRadius: '20px', padding: '0.45rem 1.25rem', fontSize: '0.85rem', fontWeight: 700, background: '#3B82F6', borderColor: '#3B82F6' }}
                      onClick={() => { setSelectedCategory(card.category); navigateTo('catalog'); }}
                    >
                      ORDER NOW
                    </button>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <img src={card.image} alt={card.title} style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEARCH BY CATEGORY Horizontal Pill Section + Visual Subcategory Grid */}
      <section style={{ background: '#FFFFFF', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', padding: '1.5rem 0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              SEARCH BY <span style={{ color: '#0F2167', fontWeight: 800 }}>CATEGORY</span>
            </h3>
            <button
              onClick={() => navigateTo('catalog')}
              style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '20px', padding: '0.3rem 0.9rem', fontSize: '0.8rem', fontWeight: 700, color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              View All <span style={{ background: '#DC2626', color: '#FFFFFF', borderRadius: '10px', padding: '0.05rem 0.4rem', fontSize: '0.7rem' }}>21</span>
            </button>
          </div>

          {/* Category Pill Buttons */}
          <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '1.25rem', scrollbarWidth: 'none' }}>
            {categoryPills.map((pill, idx) => {
              const isActive = activeCategoryPill === pill.name;
              const IconComp = pill.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveCategoryPill(pill.name);
                    setSelectedCategory(pill.catKey);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: isActive ? '#1B2834' : '#EDF7FF',
                    color: isActive ? '#F59E0B' : '#1E293B',
                    border: isActive ? '1px solid #1B2834' : '1px solid #D0E8FF',
                    boxShadow: isActive ? '0 4px 12px rgba(27,40,52,0.2)' : 'none'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: isActive ? 'rgba(245, 158, 11, 0.15)' : 'rgba(15, 23, 42, 0.04)', padding: '0.25rem', borderRadius: '50%' }}>
                    <CategoryPillIcon name={pill.name} isActive={isActive} />
                  </span>
                  <span>{pill.name}</span>
                </button>
              );
            })}
          </div>

          {/* Visual Subcategory Spare Part Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1.1rem', marginTop: '0.5rem' }}>
            {currentVisualSubcategories.map((sub, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSearchQuery(sub.query);
                  navigateTo('catalog');
                }}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '0.85rem 0.85rem 1.1rem 0.85rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = '#3B82F6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                {/* Yellow SAMPLE IMAGE badge matching screenshot 2 */}
                <div style={{ background: '#FACC15', color: '#1E293B', fontSize: '0.55rem', fontWeight: 900, padding: '0.1rem 0.4rem', borderRadius: '3px', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
                  SAMPLE IMAGE
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={sub.image} alt={sub.title} style={{ maxHeight: '135px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Subcategory Pagination Bar Matching Uploaded Screenshot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1.5rem', fontSize: '0.8rem', flexWrap: 'wrap' }}>
            {subcatPage > 1 && (
              <button onClick={() => setSubcatPage(1)} style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '0.3rem 0.65rem', borderRadius: '4px', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>First</button>
            )}
            {subcatPage > 1 && (
              <button onClick={() => setSubcatPage(prev => Math.max(1, prev - 1))} style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '0.3rem 0.65rem', borderRadius: '4px', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>Prev</button>
            )}

            {Array.from({ length: totalSubcatPages }, (_, i) => i + 1).map(pNum => (
              <button
                key={pNum}
                onClick={() => setSubcatPage(pNum)}
                style={{
                  background: subcatPage === pNum ? '#D97706' : '#F1F5F9',
                  color: subcatPage === pNum ? '#FFFFFF' : '#475569',
                  border: subcatPage === pNum ? '1px solid #D97706' : '1px solid #CBD5E1',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '4px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  minWidth: '32px'
                }}
              >
                {pNum}
              </button>
            ))}

            {subcatPage < totalSubcatPages && (
              <button onClick={() => setSubcatPage(prev => Math.min(totalSubcatPages, prev + 1))} style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '0.3rem 0.65rem', borderRadius: '4px', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>Next</button>
            )}
            {subcatPage < totalSubcatPages && (
              <button onClick={() => setSubcatPage(totalSubcatPages)} style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '0.3rem 0.65rem', borderRadius: '4px', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>Last</button>
            )}
            <span style={{ background: '#E0F2FE', color: '#0284C7', padding: '0.3rem 0.75rem', borderRadius: '4px', fontWeight: 700, marginLeft: '0.5rem', border: '1px solid #BAE6FD' }}>
              {subcatPage} of {totalSubcatPages}
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 1: 📱 CAR ACCESSORIES, INTERIOR & GADGETS */}
      <section style={{ background: '#F8FAFC', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#FEF3C7', color: '#D97706', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                📱 CAR ACCESSORIES, INTERIOR & GADGETS
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                CAR ACCESSORIES & DAILY ESSENTIALS
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B', background: '#FFFFFF', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
              Showing {Math.min(expandedSections['secCarAccessories'] ? secCarAccessories.length : 6, secCarAccessories.length)} of {secCarAccessories.length} Items
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {(expandedSections['secCarAccessories'] ? secCarAccessories : secCarAccessories.slice(0, 6)).map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.09)';
                  e.currentTarget.style.borderColor = '#F59E0B';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#F8FAFC', borderRadius: '8px' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                        ₹{prod.price}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{prod.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', marginLeft: 'auto' }}>
                        {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#F1F5F9', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => {
                          addToCart({ ...prod, title: prod.name });
                          navigateTo('checkout');
                        }}
                        style={{ background: '#D97706', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View More Button for Section 1 */}
          {secCarAccessories.length > 6 && (
            <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
              <button
                onClick={() => toggleSectionExpand('secCarAccessories')}
                style={{
                  background: '#0F2167',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '24px',
                  padding: '0.65rem 1.75rem',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(15,33,103,0.25)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s'
                }}
              >
                {expandedSections['secCarAccessories'] ? 'Show Less ⬆️' : `View More (${secCarAccessories.length - 6} More Accessories) ➔`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: 🛢️ 100% PURE ENGINE OILS & MOTOR OILS */}
      <section style={{ background: '#FFFFFF', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#FEF3C7', color: '#B45309', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🛢️ PURE ENGINE OILS SECTION
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                100% GENUINE ENGINE OILS & MOTOR OILS ONLY
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#F8FAFC', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secPureEngineOils.length} Engine Oils
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secPureEngineOils.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>₹{prod.price}</span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>₹{prod.originalPrice}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#FFFFFF', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => { addToCart({ ...prod, title: prod.name }); navigateTo('checkout'); }}
                        style={{ background: '#B45309', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* SECTION 3: 🌬️ 100% PURE AIR, OIL & AC CABIN FILTERS */}
      <section style={{ background: '#F8FAFC', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#EFF6FF', color: '#1D4ED8', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🌬️ PURE FILTERS SECTION
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                AIR FILTERS, OIL FILTERS & AC CABIN FILTERS ONLY
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#FFFFFF', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secPureFilters.length} Filters
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secPureFilters.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#DBEAFE', color: '#1E40AF', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#F8FAFC', borderRadius: '8px' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>₹{prod.price}</span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>₹{prod.originalPrice}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#F1F5F9', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => { addToCart({ ...prod, title: prod.name }); navigateTo('checkout'); }}
                        style={{ background: '#1D4ED8', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* SECTION 4: 🛑 100% PURE BRAKE PADS & DISCS */}
      <section style={{ background: '#FFFFFF', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#FEE2E2', color: '#DC2626', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🛑 PURE BRAKING SYSTEM SECTION
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                BRAKE PADS, BRAKE DISCS & BRAKE SHOES ONLY
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#F8FAFC', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secPureBraking.length} Brakes
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secPureBraking.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#FEE2E2', color: '#991B1B', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>₹{prod.price}</span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>₹{prod.originalPrice}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#FFFFFF', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => { addToCart({ ...prod, title: prod.name }); navigateTo('checkout'); }}
                        style={{ background: '#DC2626', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* SECTION 5: ⚡ 100% PURE SPARK PLUGS & IGNITION COILS */}
      <section style={{ background: '#F8FAFC', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#FEF3C7', color: '#B45309', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                ⚡ PURE IGNITION & SPARK PLUGS
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                SPARK PLUGS & IGNITION COILS ONLY
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#FFFFFF', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secPureSparkPlugs.length} Plugs
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secPureSparkPlugs.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#F8FAFC', borderRadius: '8px' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>₹{prod.price}</span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>₹{prod.originalPrice}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#F1F5F9', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => { addToCart({ ...prod, title: prod.name }); navigateTo('checkout'); }}
                        style={{ background: '#B45309', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* SECTION 6: 💡 CAR LIGHTING & ELECTRICAL UPGRADES (20 ITEMS) */}
      <section style={{ background: '#F8FAFC', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#FEF2F2', color: '#DC2626', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                💡 CAR LIGHTING & ELECTRICAL UPGRADES
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                LED BULBS, DASHCAMS & ELECTRONIC ACCESSORIES
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#FFFFFF', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {Math.min(expandedSections['secLightingElectrical'] ? secLightingElectrical.length : 6, secLightingElectrical.length)} of {secLightingElectrical.length} Items
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {(expandedSections['secLightingElectrical'] ? secLightingElectrical : secLightingElectrical.slice(0, 6)).map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.09)';
                  e.currentTarget.style.borderColor = '#EF4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#F8FAFC', borderRadius: '8px' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                        ₹{prod.price}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{prod.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', marginLeft: 'auto' }}>
                        {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#F1F5F9', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => {
                          addToCart({ ...prod, title: prod.name });
                          navigateTo('checkout');
                        }}
                        style={{ background: '#DC2626', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View More Button for Section 6 */}
          {secLightingElectrical.length > 6 && (
            <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
              <button
                onClick={() => toggleSectionExpand('secLightingElectrical')}
                style={{
                  background: '#0F2167',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '24px',
                  padding: '0.65rem 1.75rem',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(15,33,103,0.25)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s'
                }}
              >
                {expandedSections['secLightingElectrical'] ? 'Show Less ⬆️' : `View More (${secLightingElectrical.length - 6} More Electrical Items) ➔`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 7: 🚘 INTERIOR & EXTERIOR ACCESSORIES */}
      <section style={{ background: '#FFFFFF', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#FFF7ED', color: '#C2410C', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🚘 INTERIOR & EXTERIOR ACCESSORIES
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                CAR SEAT CUSHIONS, MOUNTS, MATS & PROTECTION
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#F8FAFC', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {Math.min(expandedSections['secInteriorExterior'] ? secInteriorExterior.length : 6, secInteriorExterior.length)} of {secInteriorExterior.length} Items
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {(expandedSections['secInteriorExterior'] ? secInteriorExterior : secInteriorExterior.slice(0, 6)).map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#FFF7ED', color: '#C2410C', border: '1px solid #FFEDD5', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>₹{prod.price}</span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>₹{prod.originalPrice}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#FFFFFF', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => { addToCart({ ...prod, title: prod.name }); navigateTo('checkout'); }}
                        style={{ background: '#C2410C', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View More Button for Section 7 */}
          {secInteriorExterior.length > 6 && (
            <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
              <button
                onClick={() => toggleSectionExpand('secInteriorExterior')}
                style={{
                  background: '#0F2167',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '24px',
                  padding: '0.65rem 1.75rem',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(15,33,103,0.25)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s'
                }}
              >
                {expandedSections['secInteriorExterior'] ? 'Show Less ⬆️' : `View More (${secInteriorExterior.length - 6} More Accessories) ➔`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 6: 🚘 INTERIOR & EXTERIOR ACCESSORIES (20 ITEMS) */}
      <section style={{ background: '#FFFFFF', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#FFF7ED', color: '#C2410C', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🚘 INTERIOR & EXTERIOR ACCESSORIES
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                CAR SEAT CUSHIONS, MOUNTS, MATS & PROTECTION
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#F8FAFC', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secInteriorExterior.length} Accessories
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secInteriorExterior.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = '#EA580C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#FFF7ED', color: '#EA580C', border: '1px solid #FFEDD5', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                        ₹{prod.price}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{prod.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', marginLeft: 'auto' }}>
                        {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#FFFFFF', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => {
                          addToCart({ ...prod, title: prod.name });
                          navigateTo('checkout');
                        }}
                        style={{ background: '#C2410C', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* SECTION 7: 🧼 CAR CARE, DETAILING & EMERGENCY KITS (16 ITEMS) */}
      <section style={{ background: '#F8FAFC', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#ECFDF5', color: '#047857', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🧼 CAR CARE, DETAILING & EMERGENCY KITS
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                WASH SHAMPOOS, WAXES, MICROFIBER & EMERGENCY TOOLS
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#FFFFFF', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secCareEmergency.length} Items
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secCareEmergency.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.09)';
                  e.currentTarget.style.borderColor = '#059669';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#F8FAFC', borderRadius: '8px' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                        ₹{prod.price}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{prod.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', marginLeft: 'auto' }}>
                        {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#F1F5F9', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => {
                          addToCart({ ...prod, title: prod.name });
                          navigateTo('checkout');
                        }}
                        style={{ background: '#059669', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* SECTION 8: ⚡ EV SPECIALS & SMART AUTOMOTIVE GADGETS (14 ITEMS) */}
      <section style={{ background: '#FFFFFF', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#F0FDF4', color: '#16A34A', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                ⚡ EV SPECIALS & SMART AUTOMOTIVE GADGETS
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                EV CHARGING ACCESSORIES, HUD & SMART CAR TECH
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#F8FAFC', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secEvSmartGadgets.length} Items
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secEvSmartGadgets.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = '#16A34A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                        ₹{prod.price}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{prod.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', marginLeft: 'auto' }}>
                        {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#FFFFFF', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => {
                          addToCart({ ...prod, title: prod.name });
                          navigateTo('checkout');
                        }}
                        style={{ background: '#16A34A', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* SECTION 9: 🧳 TRAVEL, OFF-ROADING & UTILITY GEARS (10 ITEMS) */}
      <section style={{ background: '#F8FAFC', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#FEF3C7', color: '#B45309', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🧳 TRAVEL, OFF-ROADING & UTILITY GEARS
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                ROOF RACKS, TRUNK ORGANIZERS, SUNSHADES & 220V INVERTERS
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#FFFFFF', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secTravelUtility.length} Items
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secTravelUtility.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.09)';
                  e.currentTarget.style.borderColor = '#D97706';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#F8FAFC', borderRadius: '8px' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                        ₹{prod.price}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{prod.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', marginLeft: 'auto' }}>
                        {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#F1F5F9', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => {
                          addToCart({ ...prod, title: prod.name });
                          navigateTo('checkout');
                        }}
                        style={{ background: '#D97706', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* SECTION 10: ⚙️ ADVANCED ENGINE & PERFORMANCE PARTS (10 ITEMS) */}
      <section style={{ background: '#FFFFFF', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#EFF6FF', color: '#1D4ED8', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                ⚙️ ADVANCED ENGINE & PERFORMANCE PARTS
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                O2 SENSORS, MAF METERS, FUEL INJECTORS & SWITCHES
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#F8FAFC', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secAdvancedEngine.length} Parts
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secAdvancedEngine.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = '#2563EB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#F0F9FF', color: '#0284C7', border: '1px solid #BAE6FD', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                        ₹{prod.price}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{prod.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', marginLeft: 'auto' }}>
                        {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#FFFFFF', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => {
                          addToCart({ ...prod, title: prod.name });
                          navigateTo('checkout');
                        }}
                        style={{ background: '#1D4ED8', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* SECTION 11: 🎨 STYLING, CHROME & MODIFICATION ESSENTIALS (10 ITEMS) */}
      <section style={{ background: '#F8FAFC', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#FAF5FF', color: '#9333EA', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🎨 STYLING, CHROME & MODIFICATION ESSENTIALS
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                CHROME TRIMS, LOGO PROJECTORS, CARBON WRAPS & SPOILERS
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#FFFFFF', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secStylingChrome.length} Items
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secStylingChrome.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.09)';
                  e.currentTarget.style.borderColor = '#A855F7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#FAF5FF', color: '#9333EA', border: '1px solid #E9D5FF', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#F8FAFC', borderRadius: '8px' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                        ₹{prod.price}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{prod.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', marginLeft: 'auto' }}>
                        {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#F1F5F9', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => {
                          addToCart({ ...prod, title: prod.name });
                          navigateTo('checkout');
                        }}
                        style={{ background: '#9333EA', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* SECTION 12: 🛠️ SPECIAL TOOLS & DIY GARAGE KITS (6 ITEMS) */}
      <section style={{ background: '#FFFFFF', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#FEF2F2', color: '#DC2626', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🛠️ SPECIAL TOOLS & DIY GARAGE KITS
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                HYDRAULIC JACKS, 46-IN-1 TOOLSETS, SPANNERS & PUNCTURE KITS
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#F8FAFC', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secSpecialTools.length} Tool Kits
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secSpecialTools.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = '#DC2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                        ₹{prod.price}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{prod.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', marginLeft: 'auto' }}>
                        {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#FFFFFF', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => {
                          addToCart({ ...prod, title: prod.name });
                          navigateTo('checkout');
                        }}
                        style={{ background: '#DC2626', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* SECTION 13: 🕶️ WINDOW COMFORT & PREMIUM SUNSHADES (10 ITEMS) */}
      <section style={{ background: '#F8FAFC', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#F0FDF4', color: '#047857', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🕶️ WINDOW COMFORT & PREMIUM SUNSHADES
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                ZIPPER SUNSHADES, RAIN VISORS, TINT FILMS & WEATHERSTRIPS
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#FFFFFF', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secWindowComfort.length} Items
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secWindowComfort.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.09)';
                  e.currentTarget.style.borderColor = '#047857';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #6EE7B7', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#F8FAFC', borderRadius: '8px' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                        ₹{prod.price}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{prod.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', marginLeft: 'auto' }}>
                        {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#F1F5F9', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => {
                          addToCart({ ...prod, title: prod.name });
                          navigateTo('checkout');
                        }}
                        style={{ background: '#047857', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* SECTION 14: 🔊 AUDIO, BASS & SOUND UPGRADES (10 ITEMS) */}
      <section style={{ background: '#FFFFFF', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#FEE2E2', color: '#B91C1C', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🔊 AUDIO, BASS & SOUND UPGRADES
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                COAXIAL & COMPONENT SPEAKERS, UNDER-SEAT BASS & AMPS
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#F8FAFC', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secAudioSound.length} Items
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secAudioSound.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = '#DC2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#FEE2E2', color: '#B91C1C', border: '1px solid #FCA5A5', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                        ₹{prod.price}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{prod.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', marginLeft: 'auto' }}>
                        {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#FFFFFF', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => {
                          addToCart({ ...prod, title: prod.name });
                          navigateTo('checkout');
                        }}
                        style={{ background: '#B91C1C', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* SECTION 15: 👑 LUXURY INTERIOR DETAILING & COMFORT (10 ITEMS) */}
      <section style={{ background: '#F8FAFC', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#FFF7ED', color: '#C2410C', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                👑 LUXURY INTERIOR DETAILING & COMFORT
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                ALCANTARA WRAPS, ARMREST CUSHIONS, PU SEAT COVERS & CLEANING GELS
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#FFFFFF', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secLuxuryInterior.length} Items
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secLuxuryInterior.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.09)';
                  e.currentTarget.style.borderColor = '#EA580C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#FFF7ED', color: '#C2410C', border: '1px solid #FFEDD5', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#F8FAFC', borderRadius: '8px' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                        ₹{prod.price}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{prod.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', marginLeft: 'auto' }}>
                        {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#F1F5F9', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => {
                          addToCart({ ...prod, title: prod.name });
                          navigateTo('checkout');
                        }}
                        style={{ background: '#EA580C', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* SECTION 16: 🛡️ CAR SAFETY, BODY PROTECTION & STYLING (10 ITEMS) */}
      <section style={{ background: '#FFFFFF', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#F1F5F9', color: '#334155', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🛡️ CAR SAFETY, BODY PROTECTION & STYLING
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                BUMPER GUARDS, REFLECTIVE STICKERS, RIM PROTECTORS & SPRAYS
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#F8FAFC', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secBodyProtection.length} Items
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secBodyProtection.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = '#475569';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#F1F5F9', color: '#334155', border: '1px solid #CBD5E1', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                        ₹{prod.price}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{prod.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', marginLeft: 'auto' }}>
                        {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#FFFFFF', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => {
                          addToCart({ ...prod, title: prod.name });
                          navigateTo('checkout');
                        }}
                        style={{ background: '#334155', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* SECTION 17: ⛺ WINTER, RAIN & EMERGENCY OFF-ROADING GEARS (10 ITEMS) */}
      <section style={{ background: '#F8FAFC', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#FEF2F2', color: '#B91C1C', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                ⛺ WINTER, RAIN & EMERGENCY OFF-ROADING GEARS
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                JUMP STARTERS, TOW CHAINS, TRACTION MATS & FIRST AID KITS
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#FFFFFF', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secEmergencyOffroad.length} Items
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secEmergencyOffroad.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.09)';
                  e.currentTarget.style.borderColor = '#DC2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FCA5A5', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#F8FAFC', borderRadius: '8px' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                        ₹{prod.price}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{prod.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', marginLeft: 'auto' }}>
                        {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#F1F5F9', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => {
                          addToCart({ ...prod, title: prod.name });
                          navigateTo('checkout');
                        }}
                        style={{ background: '#DC2626', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* SECTION 18: ⛺ LIFESTYLE, CAMPING & IN-CAR DINING (10 ITEMS) */}
      <section style={{ background: '#FFFFFF', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#ECFDF5', color: '#047857', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                ⛺ LIFESTYLE, CAMPING & IN-CAR DINING
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                WORK/EAT TRAYS, 12V KETTLES, MINI FRIDGES & CAMPING MESH
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#F8FAFC', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secLifestyleCamping.length} Items
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secLifestyleCamping.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = '#059669';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #6EE7B7', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                        ₹{prod.price}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{prod.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', marginLeft: 'auto' }}>
                        {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#FFFFFF', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => {
                          addToCart({ ...prod, title: prod.name });
                          navigateTo('checkout');
                        }}
                        style={{ background: '#047857', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* SECTION 19: 🛡️ CAR SECURITY, ANTI-THEFT & CHILD SAFETY (10 ITEMS) */}
      <section style={{ background: '#F8FAFC', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#EEF2FF', color: '#3730A3', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🛡️ CAR SECURITY, ANTI-THEFT & CHILD SAFETY
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                STEERING LOCKS, WHEEL CLAMPS, CHILD SEATS & RFID POUCHES
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#FFFFFF', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secSecuritySafety.length} Items
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secSecuritySafety.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.09)';
                  e.currentTarget.style.borderColor = '#4338CA';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#EEF2FF', color: '#3730A3', border: '1px solid #A5B4FC', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#F8FAFC', borderRadius: '8px' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                        ₹{prod.price}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{prod.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', marginLeft: 'auto' }}>
                        {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#F1F5F9', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => {
                          addToCart({ ...prod, title: prod.name });
                          navigateTo('checkout');
                        }}
                        style={{ background: '#4338CA', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* SECTION 20: 🎨 CUSTOM INTERIORS & HYDRO-DIPPING UPGRADES (10 ITEMS) */}
      <section style={{ background: '#FFFFFF', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#FDF2F8', color: '#BE185D', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🎨 CUSTOM INTERIORS & HYDRO-DIPPING UPGRADES
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                HYDRO-DIPPING FILMS, DASHBOARD LEATHER, STARLIGHT USB & RACING PEDALS
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#F8FAFC', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secCustomInteriors.length} Items
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secCustomInteriors.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = '#BE185D';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#FDF2F8', color: '#BE185D', border: '1px solid #FBCFE8', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                        ₹{prod.price}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{prod.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', marginLeft: 'auto' }}>
                        {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#FFFFFF', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => {
                          addToCart({ ...prod, title: prod.name });
                          navigateTo('checkout');
                        }}
                        style={{ background: '#BE185D', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* SECTION 21: 🧼 PRO-DETAILING COMPOUNDS & MACHINE GEARS (10 ITEMS) */}
      <section style={{ background: '#F8FAFC', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#EFF6FF', color: '#1D4ED8', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🧼 PRO-DETAILING COMPOUNDS & MACHINE GEARS
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                BUFFER POLISHERS, 9H CERAMIC KITS, GRAPHENE SPRAYS & FOAM PADS
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#FFFFFF', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secProDetailing.length} Items
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secProDetailing.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.09)';
                  e.currentTarget.style.borderColor = '#2563EB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #93C5FD', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#F8FAFC', borderRadius: '8px' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                        ₹{prod.price}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{prod.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', marginLeft: 'auto' }}>
                        {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#F1F5F9', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => {
                          addToCart({ ...prod, title: prod.name });
                          navigateTo('checkout');
                        }}
                        style={{ background: '#2563EB', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* SECTION 22: 🔧 PERFORMANCE, EXHAUST & MODIFICATION PARTS (10 ITEMS) */}
      <section style={{ background: '#FFFFFF', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#FFF7ED', color: '#C2410C', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🔧 PERFORMANCE, EXHAUST & MODIFICATION PARTS
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                COLD AIR INTAKES, EXHAUST VALVES, TURBO WHISTLES & GT SPOILERS
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#F8FAFC', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secPerformanceMod.length} Items
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secPerformanceMod.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = '#EA580C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#FFF7ED', color: '#C2410C', border: '1px solid #FDBA74', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                        ₹{prod.price}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{prod.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', marginLeft: 'auto' }}>
                        {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#FFFFFF', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => {
                          addToCart({ ...prod, title: prod.name });
                          navigateTo('checkout');
                        }}
                        style={{ background: '#EA580C', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* SECTION 23: 📱 ADVANCED IN-CAR SCREENS & CAMERA TECH (10 ITEMS) */}
      <section style={{ background: '#F8FAFC', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#F0FDF4', color: '#15803D', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                📱 ADVANCED IN-CAR SCREENS & CAMERA TECH
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                360° SURROUND CAMERAS, MIRROR DASHCAMS & HEADREST MONITORS
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#FFFFFF', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secScreensTech.length} Items
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secScreensTech.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.09)';
                  e.currentTarget.style.borderColor = '#16A34A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#F0FDF4', color: '#15803D', border: '1px solid #86EFAC', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#F8FAFC', borderRadius: '8px' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                        ₹{prod.price}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{prod.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', marginLeft: 'auto' }}>
                        {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#F1F5F9', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => {
                          addToCart({ ...prod, title: prod.name });
                          navigateTo('checkout');
                        }}
                        style={{ background: '#16A34A', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* SECTION 24: 🛌 PREMIUM SUV & LONG-TRAVEL COMFORT ESSENTIALS (10 ITEMS) */}
      <section style={{ background: '#FFFFFF', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#FEF3C7', color: '#B45309', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🛌 PREMIUM SUV & LONG-TRAVEL COMFORT ESSENTIALS
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                INFLATABLE BEDS, ZIPPER SHADES, SIDE PILLOWS & TRUNK COOLER BOXES
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#F8FAFC', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secSuvTravelComfort.length} Items
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secSuvTravelComfort.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = '#D97706';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                        ₹{prod.price}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{prod.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', marginLeft: 'auto' }}>
                        {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#FFFFFF', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => {
                          addToCart({ ...prod, title: prod.name });
                          navigateTo('checkout');
                        }}
                        style={{ background: '#D97706', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* SECTION 25: 🔧 PRECISION ENGINE DIAGNOSTICS & SENSOR TECH (10 ITEMS) */}
      <section style={{ background: '#F8FAFC', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#F0FDFA', color: '#0D9488', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🔧 PRECISION ENGINE DIAGNOSTICS & SENSOR TECH
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                CRANKSHAFT, CAMSHAFT, MAP, ABS & COOLANT TEMP SENSORS
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#FFFFFF', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secEngineSensors.length} Items
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secEngineSensors.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.09)';
                  e.currentTarget.style.borderColor = '#0D9488';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#F0FDFA', color: '#0D9488', border: '1px solid #99F6E4', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#F8FAFC', borderRadius: '8px' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                        ₹{prod.price}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{prod.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', marginLeft: 'auto' }}>
                        {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#F1F5F9', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => {
                          addToCart({ ...prod, title: prod.name });
                          navigateTo('checkout');
                        }}
                        style={{ background: '#0D9488', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* SECTION 26: 💎 EXTERIOR AERO-STYLING, SPOILERS & BODY KITS (10 ITEMS) */}
      <section style={{ background: '#FFFFFF', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#F5F3FF', color: '#6D28D9', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                💎 EXTERIOR AERO-STYLING, SPOILERS & BODY KITS
              </span>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                FRONT BUMPER LIPS, REAR DIFFUSERS, ROOF SPOILERS & FENDER VENTS
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', background: '#F8FAFC', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1' }}>
              Showing {secExteriorAero.length} Items
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {secExteriorAero.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = '#7C3AED';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: '#F5F3FF', color: '#6D28D9', border: '1px solid #DDD6FE', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {prod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    ⭐ {prod.rating}
                  </span>
                </div>

                <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <img src={prod.image} alt={prod.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3' }}>
                      {prod.name}
                    </h4>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                        ₹{prod.price}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{prod.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', marginLeft: 'auto' }}>
                        {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => addToCart({ ...prod, title: prod.name })}
                        style={{ background: '#FFFFFF', color: '#1E293B', border: '1px solid #CBD5E1', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <ShoppingCart size={13} /> Add
                      </button>
                      <button
                        onClick={() => {
                          addToCart({ ...prod, title: prod.name });
                          navigateTo('checkout');
                        }}
                        style={{ background: '#7C3AED', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
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

      {/* BEST SELLERS & NEW ARRIVALS PRODUCT CAROUSEL SECTION */}
      <section style={{ background: '#FFFFFF', padding: '2rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          {/* Tab Selector Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <button
              onClick={() => setProductTab('bestsellers')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                background: productTab === 'bestsellers' ? '#1E293B' : '#F0F9FF',
                color: productTab === 'bestsellers' ? '#F59E0B' : '#0F2167',
                border: productTab === 'bestsellers' ? '1px solid #1E293B' : '1px solid #BAE6FD'
              }}
            >
              <Award size={18} color={productTab === 'bestsellers' ? '#F59E0B' : '#0F2167'} />
              <span>Best Sellers</span>
            </button>

            <button
              onClick={() => setProductTab('newarrivals')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                background: productTab === 'newarrivals' ? '#1E293B' : '#F0F9FF',
                color: productTab === 'newarrivals' ? '#06B6D4' : '#0F2167',
                border: productTab === 'newarrivals' ? '1px solid #1E293B' : '1px solid #BAE6FD'
              }}
            >
              <Sparkles size={18} color={productTab === 'newarrivals' ? '#06B6D4' : '#0F2167'} />
              <span>New Arrivals</span>
            </button>
          </div>

          {/* Product Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {bestSellerProducts.map((p) => (
              <div
                key={p.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                }}
              >
                <div>
                  <div style={{ height: '140px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <img src={p.image} alt={p.title} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>

                  <h4
                    style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', margin: '0.25rem 0', height: '40px', overflow: 'hidden', cursor: 'pointer' }}
                    onClick={() => navigateTo('product-detail', p.id)}
                  >
                    {p.title}
                  </h4>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#64748B', marginBottom: '0.5rem' }}>
                    <span>SKU#: <code>{p.sku}</code></span>
                    <span style={{ background: '#CCFBF1', color: '#0D9488', padding: '0.05rem 0.35rem', borderRadius: '4px', fontWeight: 700 }}>In Stock</span>
                  </div>

                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    {p.brand}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: '#94A3B8' }}>₹{p.mrp.toFixed(2)}</span>
                    <b style={{ fontSize: '1.05rem', color: '#0F172A' }}>₹{p.price.toFixed(2)}</b>
                    <span style={{ background: '#3B82F6', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 800, padding: '0.1rem 0.35rem', borderRadius: '4px', marginLeft: 'auto' }}>
                      {p.discount}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn-primary"
                      style={{ flex: 1, padding: '0.45rem', fontSize: '0.78rem', background: '#1D4ED8', borderColor: '#1D4ED8', justifyContent: 'center' }}
                      onClick={() => addToCart(p)}
                    >
                      ADD TO CART
                    </button>
                    <button
                      onClick={() => toggleWishlist(p)}
                      style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.45rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Heart size={16} color={wishlist.some(w => w.id === p.id) ? '#EF4444' : '#94A3B8'} fill={wishlist.some(w => w.id === p.id) ? '#EF4444' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE FLASH SALE DEALS WITH COUNTDOWN TIMER */}
      <section style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)', color: '#FFFFFF', padding: '2.5rem 0', borderBottom: '4px solid #F59E0B' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: '#EF4444', color: '#FFFFFF', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 900, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', animation: 'pulse 1.5s infinite' }}>
                <Zap size={18} /> FLASH SALE
              </div>
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#FFFFFF' }}>
                TODAY'S TOP AUTOMOTIVE DEALS
              </h3>
            </div>

            {/* Countdown Timer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Clock size={16} color="#F59E0B" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#E0E7FF' }}>Ends In:</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#F59E0B', fontFamily: 'monospace', letterSpacing: '1px' }}>04h : 18m : 32s</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.25rem' }}>
            {[
              { name: 'BOSCH Aerotwin Frameless Wiper Pair', orig: 1499, price: 688, discount: '54% OFF', claimed: 88, image: '/wiper_blades.jpg', badge: '⚡ HOT DEAL' },
              { name: 'Castrol EDGE Fully Synthetic 5W-40 4L', orig: 3999, price: 2799, discount: '30% OFF', claimed: 92, image: '/engine_oil.jpg', badge: '🛢️ TOP SELLER' },
              { name: '10-Inch Touch Screen Rearview Dual Dashcam', orig: 6999, price: 3499, discount: '50% OFF', claimed: 79, image: '/car_screens_tech/touch_mirror_dashcam.jpg', badge: '📷 DASHCAM' },
              { name: '9H Ceramic Coating DIY Liquid Shield Kit', orig: 2499, price: 999, discount: '60% OFF', claimed: 95, image: '/pro_detailing/ceramic_coating_kit.jpg', badge: '✨ SHINE KIT' }
            ].map((deal, idx) => (
              <div key={idx} style={{ background: '#FFFFFF', color: '#0F172A', borderRadius: '14px', padding: '1rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ background: '#EF4444', color: '#FFFFFF', fontSize: '0.62rem', fontWeight: 900, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>{deal.badge}</span>
                    <span style={{ background: '#FEF3C7', color: '#B45309', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{deal.discount}</span>
                  </div>

                  <div style={{ height: '130px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.5rem' }}>
                    <img src={deal.image} alt={deal.name} style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>

                  <h4 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '0.88rem', fontWeight: 800, lineHeight: 1.3, height: '36px', overflow: 'hidden' }}>{deal.name}</h4>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', margin: '0.4rem 0' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#DC2626' }}>₹{deal.price}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', textDecoration: 'line-through' }}>₹{deal.orig}</span>
                  </div>

                  {/* Claimed progress bar */}
                  <div style={{ margin: '0.5rem 0 0.75rem 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 700, color: '#64748B', marginBottom: '0.2rem' }}>
                      <span>Claimed: {deal.claimed}%</span>
                      <span style={{ color: '#EF4444' }}>Limited Stock</span>
                    </div>
                    <div style={{ width: '100%', background: '#E2E8F0', borderRadius: '10px', height: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${deal.claimed}%`, background: 'linear-gradient(90deg, #F59E0B, #EF4444)', height: '100%', borderRadius: '10px' }} />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addToCart({ id: `flash-${idx}`, name: deal.name, price: deal.price, originalPrice: deal.orig, image: deal.image });
                    navigateTo('cart');
                  }}
                  style={{ width: '100%', background: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.5rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                >
                  <ShoppingCart size={14} /> GRAB FLASH DEAL
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VERIFIED CUSTOMER REVIEWS & SOCIAL PROOF SECTION */}
      <section style={{ background: '#FFFFFF', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              ⭐ 4.9/5 RATED BY 25,000+ CAR OWNERS
            </span>
            <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.6rem', fontWeight: 900, color: '#0F172A' }}>
              What Indian Car Enthusiasts & Mechanics Say
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {[
              { name: 'Rajesh Sharma', city: 'Mumbai', car: 'Maruti Swift VXi 2021', review: 'Porter express delivery in Mumbai arrived in just 2.5 hours! The Bosch wiper blades and brake pads were 100% original OEM fit.', rating: 5, date: '2 days ago' },
              { name: 'Amitabh Sen', city: 'Kolkata', car: 'Hyundai Creta SX 2022', review: 'Vehicle fitment dropdown guarantees 0 mistakes. Selected Creta 2022 and got the exact cabin filter & Castrol oil delivered safely.', rating: 5, date: '4 days ago' },
              { name: 'Vikramaditya Rao', city: 'Bengaluru', car: 'Toyota Innova Crysta 2.8', review: 'Ordered shock absorbers and brake discs. 100% genuine part guarantee gives peace of mind. Price was 20% cheaper than local shop!', rating: 5, date: '1 week ago' },
              { name: 'Prashant Kadam', city: 'Pune', car: 'Tata Nexon Petrol 2020', review: 'Dashboard leather wrap and ambient LED lights fit perfectly. Customer support on WhatsApp answered all fitment queries instantly.', rating: 5, date: '1 week ago' }
            ].map((rev, idx) => (
              <div key={idx} style={{ background: '#F8FAFC', borderRadius: '12px', padding: '1.25rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ color: '#F59E0B', fontSize: '0.85rem' }}>{'⭐'.repeat(rev.rating)}</div>
                    <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '4px' }}>VERIFIED BUYER</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.5, fontStyle: 'italic', margin: '0 0 0.85rem 0' }}>"{rev.review}"</p>
                </div>

                <div style={{ borderTop: '1px dashed #CBD5E1', paddingTop: '0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', display: 'block' }}>{rev.name}</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{rev.city} • <b>{rev.car}</b></span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION */}
      <section style={{ background: '#F8FAFC', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#0F172A' }}>
              Frequently Asked Questions (FAQ)
            </h2>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
              Everything you need to know about fitment guarantee, shipping & genuine parts
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { q: 'How does the Vehicle Compatibility Filter guarantee zero returns?', a: 'By selecting your Car Brand ➔ Model ➔ Year ➔ Variant in our top filter bar, our database cross-references manufacturer OEM part numbers with your exact engine code. You will only see parts verified to fit your car with 100% precision.' },
              { q: 'Is Mumbai Same-Day Delivery available for all car parts?', a: 'Yes! For customers ordering within Mumbai, Thane, and Navi Mumbai, we offer hyper-local express delivery in 2 to 4 hours via Porter and Borzo rider dispatches for all in-stock items.' },
              { q: 'Are all spare parts 100% Genuine OEM & OES certified?', a: 'Absolutely. We source 100% directly from verified manufacturers like Bosch, Elofic, Castrol, TVS-Girling, Uno Minda, and MGP. Every product comes with our 10-Day Full Refund Guarantee.' },
              { q: 'What payment methods do you accept?', a: 'We support all major payment modes including UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Netbanking via Razorpay & Cashfree, as well as Cash on Delivery (COD) across Pan-India.' }
            ].map((faq, idx) => (
              <details key={idx} style={{ background: '#FFFFFF', borderRadius: '10px', padding: '1rem 1.25rem', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                <summary style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', outline: 'none' }}>
                  {faq.q}
                </summary>
                <p style={{ margin: '0.65rem 0 0 0', fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* SMART MILEAGE MAINTENANCE SERVICE CALCULATOR */}
      <section style={{ background: '#FFFFFF', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ background: 'linear-gradient(135deg, #0F2167 0%, #1E3A8A 100%)', borderRadius: '16px', padding: '2rem', color: '#FFFFFF', boxShadow: '0 10px 30px rgba(15,33,103,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ background: '#FF6B00', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 900, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                  ⚙️ AUTOZON SERVICE ESTIMATOR
                </span>
                <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF' }}>
                  Smart Odometer Service Packages by Mileage
                </h3>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>
                Select your car's total driven kilometers to get verified service bundles
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {[
                { km: '10,000 KM', title: 'Basic Oil & Filter Service', items: ['Syntactic Engine Oil 3.5L', 'OEM Oil Filter Element', 'Full Vehicle Inspection'], orig: 2499, price: 1799, badge: '🟢 BASIC SERVICE' },
                { km: '30,000 KM', title: 'Comprehensive Maintenance Kit', items: ['5W-40 Synthetic Engine Oil', 'Oil Filter + Air Filter', 'Cabin AC Filter + Spark Plugs'], orig: 4999, price: 3499, badge: '🟡 RECOMMENDED' },
                { km: '50,000 KM', title: 'Brake & Major Fluid Renewal', items: ['Front Brake Pad Set', 'DOT 4 Brake Fluid 1L', 'Radiator Coolant Concentrate'], orig: 6499, price: 4299, badge: '🔵 MAJOR SERVICE' },
                { km: '100,000 KM', title: 'Complete Overhaul Care Package', items: ['Clutch Disc Assembly', 'Timing Belt Kit', 'Shock Absorber Set'], orig: 14999, price: 10999, badge: '🔴 FULL OVERHAUL' }
              ].map((pack, idx) => (
                <div key={idx} style={{ background: '#FFFFFF', color: '#0F172A', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ background: '#F1F5F9', color: '#0F2167', fontSize: '0.75rem', fontWeight: 900, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{pack.km}</span>
                      <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#059669' }}>{pack.badge}</span>
                    </div>

                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>{pack.title}</h4>

                    <ul style={{ margin: '0 0 1rem 0', paddingLeft: '1.1rem', fontSize: '0.78rem', color: '#475569', lineHeight: 1.6 }}>
                      {pack.items.map((it, i) => <li key={i}>{it}</li>)}
                    </ul>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A' }}>₹{pack.price}</span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>₹{pack.orig}</span>
                    </div>

                    <button
                      onClick={() => {
                        addToCart({ id: `service-${idx}`, name: `${pack.km} ${pack.title}`, price: pack.price, originalPrice: pack.orig, image: '/engine_oil.jpg' });
                        navigateTo('cart');
                      }}
                      style={{ width: '100%', background: '#0F2167', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.55rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                    >
                      Add Package to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AUTOZON CERTIFIED INSTALLATION PARTNER GARAGES NETWORK */}
      <section style={{ background: '#F8FAFC', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <span style={{ background: '#FEF3C7', color: '#B45309', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>
              📍 PAN-INDIA GARAGE NETWORK
            </span>
            <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 900, color: '#0F172A' }}>
              Get Parts Installed at Certified Partner Garages
            </h2>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
              Order parts online & book hassle-free installation at 500+ verified partner workshops
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {[
              { city: 'Mumbai', garage: 'AutoZon Master Garage - Andheri East', rating: 4.9, address: 'Near Western Express Highway, Andheri East, Mumbai', slots: '12 Slots Open Today' },
              { city: 'Thane & Navi Mumbai', garage: 'SpeedCare Motors - Thane West', rating: 4.8, address: 'Ghopdeo Compound, Majiwada, Thane West', slots: '8 Slots Open Today' },
              { city: 'Delhi NCR', garage: 'ProTech Performance - Connaught Place', rating: 4.9, address: 'Block C, Outer Circle, Connaught Place, New Delhi', slots: '15 Slots Open Today' },
              { city: 'Bengaluru', garage: 'Silicon Valley Auto Hub - Koramangala', rating: 4.9, address: '80 Feet Road, 4th Block, Koramangala, Bengaluru', slots: '10 Slots Open Today' }
            ].map((gar, idx) => (
              <div key={idx} style={{ background: '#FFFFFF', borderRadius: '12px', padding: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ background: '#E0F2FE', color: '#0369A1', fontSize: '0.68rem', fontWeight: 900, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>📍 {gar.city}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669' }}>⭐ {gar.rating}</span>
                  </div>

                  <h4 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>{gar.garage}</h4>
                  <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4 }}>{gar.address}</p>
                </div>

                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16A34A', display: 'block', marginBottom: '0.65rem' }}>🟢 {gar.slots}</span>
                  <button
                    onClick={() => {
                      showToast(`📍 Installation Slot Booked at ${gar.garage}!`);
                    }}
                    style={{ width: '100%', background: '#F1F5F9', color: '#0F172A', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0.45rem', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
                  >
                    Book Fitment Slot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE CAR BATTERY FINDER WITH OLD BATTERY BUYBACK EXCHANGE */}
      <section style={{ background: '#FFFFFF', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)', borderRadius: '16px', padding: '2rem', color: '#FFFFFF', boxShadow: '0 10px 30px rgba(22,101,52,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ background: '#F59E0B', color: '#0F172A', fontSize: '0.72rem', fontWeight: 900, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                  🔋 BATTERY FINDER & BUYBACK
                </span>
                <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF' }}>
                  Car Battery Replacement with Old Battery Exchange (₹500 - ₹1,000 Off)
                </h3>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#DCFCE7' }}>
                Free Doorstep Delivery & 55-Minute Installation in Mumbai & Major Cities
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {[
                { brand: 'AMARON', name: 'Amaron FLO 35Ah Maintenance Free', warranty: '55 Months Warranty', orig: 4899, price: 3699, exchangePrice: 3199, cap: '35Ah Petrol', image: '/ev_smart_gadgets/portable_ev_charger.jpg' },
                { brand: 'EXIDE', name: 'Exide Epiq 45Ah Heavy Duty Battery', warranty: '68 Months Warranty', orig: 5999, price: 4499, exchangePrice: 3899, cap: '45Ah Diesel/SUV', image: '/ev_smart_gadgets/portable_ev_charger.jpg' },
                { brand: 'AMARON', name: 'Amaron PRO 65Ah High CCA Battery', warranty: '60 Months Warranty', orig: 7999, price: 5999, exchangePrice: 5199, cap: '65Ah Commercial/SUV', image: '/ev_smart_gadgets/portable_ev_charger.jpg' },
                { brand: 'SF SONIC', name: 'SF Sonic Flash 35Ah Car Battery', warranty: '48 Months Warranty', orig: 4299, price: 3299, exchangePrice: 2799, cap: '35Ah Hatchback', image: '/ev_smart_gadgets/portable_ev_charger.jpg' }
              ].map((bat, idx) => (
                <div key={idx} style={{ background: '#FFFFFF', color: '#0F172A', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '0.65rem', fontWeight: 900, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>{bat.brand}</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#15803D' }}>{bat.warranty}</span>
                    </div>

                    <h4 style={{ margin: '0.4rem 0 0.25rem 0', fontSize: '0.9rem', fontWeight: 800 }}>{bat.name}</h4>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', marginBottom: '0.75rem' }}>Cap: <b>{bat.cap}</b></span>

                    <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '0.5rem', borderRadius: '6px', marginBottom: '0.85rem' }}>
                      <div style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 700 }}>With Old Battery Exchange:</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#15803D' }}>₹{bat.exchangePrice} <span style={{ fontSize: '0.7rem', color: '#94A3B8', textDecoration: 'line-through' }}>₹{bat.price}</span></div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToCart({ id: `bat-${idx}`, name: bat.name, price: bat.exchangePrice, originalPrice: bat.orig, image: bat.image });
                      navigateTo('cart');
                    }}
                    style={{ width: '100%', background: '#15803D', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.5rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                  >
                    Buy with Battery Exchange
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHEEL & TIRE UPSIZE FITMENT CALCULATOR */}
      <section style={{ background: '#F8FAFC', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <span style={{ background: '#E0F2FE', color: '#0369A1', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>
              🛞 WHEEL & TIRE FITMENT CALCULATOR
            </span>
            <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 900, color: '#0F172A' }}>
              Safe Tire Upsizing & Alloy Rim Compatibility Advisor
            </h2>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
              Calculate diameter variance to ensure &lt; 3% error rule before buying new wheels & tires
            </p>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.5rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', alignItems: 'center' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>1. CURRENT TIRE SIZE</label>
                <select style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700 }}>
                  <option>185/65 R15 (Stock Swift/Baleno)</option>
                  <option>205/60 R16 (Stock Creta/Seltos)</option>
                  <option>215/60 R17 (Stock Harrier/Safari)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>2. TARGET UPSIZE SIZE</label>
                <select style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700 }}>
                  <option>195/60 R16 (+0.8% Diameter Diff - SAFE)</option>
                  <option>215/55 R17 (+1.4% Diameter Diff - SAFE)</option>
                  <option>225/50 R18 (+2.1% Diameter Diff - ACCEPTABLE)</option>
                </select>
              </div>

              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '0.85rem', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>RESULT STATUS</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#15803D', margin: '0.15rem 0' }}>✅ +0.8% SAFE FITMENT</div>
                <span style={{ fontSize: '0.7rem', color: '#475569' }}>Speedometer Error: +0.5 km/h</span>
              </div>

              <div>
                <button
                  onClick={() => {
                    setSelectedCategory('wheels');
                    navigateTo('catalog');
                  }}
                  style={{ width: '100%', background: '#0F2167', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.7rem', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Browse Compatible Rims & Tires
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH BY OES & OEM SECTION */}
      <section style={{ background: '#F8FAFC', padding: '2rem 0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.15rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            SEARCH BY <span style={{ color: '#0F2167', fontWeight: 800 }}>OES & OEM</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Left Column: OES BRANDS */}
            <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h4 style={{ textAlign: 'center', margin: '0 0 1.25rem 0', fontSize: '0.9rem', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                OES BRANDS
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {oesBrands.map((b, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedBrand(b.brandKey);
                      navigateTo('catalog');
                    }}
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '1rem 0.5rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#3B82F6';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ height: '55px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <img
                        src={b.logo}
                        alt={b.name}
                        style={{ maxHeight: '50px', maxWidth: '100px', objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div style={{ display: 'none', background: '#0F2167', color: '#FFFFFF', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 900 }}>
                        {b.name}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A', display: 'block' }}>{b.name}</span>
                    <span style={{ fontSize: '0.7rem', color: '#0284C7', fontWeight: 600, display: 'block', marginTop: '0.2rem' }}>{b.count}</span>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                <button
                  onClick={() => navigateTo('catalog')}
                  style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '20px', padding: '0.35rem 1rem', fontSize: '0.8rem', fontWeight: 700, color: '#DC2626', cursor: 'pointer' }}
                >
                  View All 81
                </button>
              </div>
            </div>

            {/* Right Column: OEM BRANDS */}
            <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h4 style={{ textAlign: 'center', margin: '0 0 1.25rem 0', fontSize: '0.9rem', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                OEM BRANDS
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                {oemBrands.map((b, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSearchQuery(b.makeKey);
                      navigateTo('catalog');
                    }}
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '1rem 0.5rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#3B82F6';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ height: '55px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <img
                        src={b.logo}
                        alt={b.name}
                        style={{ maxHeight: '50px', maxWidth: '100px', objectFit: 'contain' }}
                        onError={(e) => {
                          const fallbackMap = {
                            TOYOTA: 'https://img.icons8.com/color/96/toyota.png',
                            NISSAN: 'https://img.icons8.com/color/96/nissan.png',
                            RENAULT: 'https://img.icons8.com/color/96/renault.png',
                            SKODA: 'https://img.icons8.com/color/96/skoda.png',
                            VOLKSWAGEN: 'https://img.icons8.com/color/96/volkswagen.png',
                            HYUNDAI: 'https://img.icons8.com/color/96/hyundai.png',
                            HONDA: 'https://img.icons8.com/color/96/honda.png',
                            TATA: 'https://img.icons8.com/color/96/tata.png'
                          };
                          if (fallbackMap[b.name] && e.target.src !== fallbackMap[b.name]) {
                            e.target.src = fallbackMap[b.name];
                          }
                        }}
                      />
                      <div style={{ display: 'none', background: '#FF6B00', color: '#FFFFFF', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 900 }}>
                        {b.name}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A', display: 'block' }}>{b.name}</span>
                    <span style={{ fontSize: '0.7rem', color: '#0284C7', fontWeight: 600, display: 'block', marginTop: '0.2rem' }}>{b.count}</span>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                <button
                  onClick={() => navigateTo('catalog')}
                  style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '20px', padding: '0.35rem 1rem', fontSize: '0.8rem', fontWeight: 700, color: '#DC2626', cursor: 'pointer' }}
                >
                  View All 9
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Finder Bar */}
      <section className="hero-banner-section" style={{ background: 'linear-gradient(135deg, #0B192C 0%, #0F2167 100%)', color: '#FFFFFF', padding: '2.5rem 1rem', margin: '1.5rem 0' }}>
        <div className="container" style={{ maxWidth: '1350px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'center' }}>
          <div>
            <span style={{ background: 'rgba(255, 107, 0, 0.2)', color: '#FF6B00', border: '1px solid #FF6B00', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
              100% Genuine Owner Direct Stock
            </span>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '2.2rem', margin: '0.75rem 0', color: '#FFFFFF' }}>
              Find Compatible Spare Parts For Your Vehicle
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#94A3B8', maxWidth: '560px', marginBottom: '1.5rem' }}>
              Search by part name, car model, brand, or OEM part number (e.g. 04465-0K240). Guaranteed vehicle fitment & fast Pan-India shipping.
            </p>

            <form onSubmit={handleHeroSearchSubmit} style={{ display: 'flex', gap: '0.5rem', background: '#FFFFFF', padding: '0.35rem', borderRadius: '10px', maxWidth: '540px' }}>
              <input
                type="text"
                placeholder="Search by part name, SKU, OEM # or car..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                style={{ flex: 1, border: 'none', outline: 'none', padding: '0.65rem 1rem', fontSize: '0.9rem', color: '#0F172A' }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '0.65rem 1.25rem', borderRadius: '8px' }}>
                <Search size={16} /> Search Parts
              </button>
            </form>
          </div>

          <div style={{ background: '#FFFFFF', color: '#0F172A', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Car size={22} color="#FF6B00" />
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0F2167' }}>Select Your Vehicle Fitment</h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.25rem' }}>
              Filter store catalog to show only parts verified to fit your car.
            </p>
            <button className="btn-primary" style={{ width: '100%', padding: '0.7rem', justifyContent: 'center' }} onClick={() => setIsVehicleModalOpen(true)}>
              <Wrench size={16} /> Choose Vehicle (Make / Model)
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Catalog */}
      <section className="container" style={{ maxWidth: '1350px', padding: '1rem 1rem 3rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ margin: 0, color: '#0F2167' }}>Featured Spare Parts Catalog</h2>
            <p style={{ margin: '0.25rem 0 0 0', color: '#64748B', fontSize: '0.9rem' }}>Direct from Owner stock with verified vehicle fitment</p>
          </div>
          <button className="btn-secondary" onClick={() => navigateTo('catalog')}>
            Explore All Products <ChevronRight size={16} />
          </button>
        </div>

        <div className="offers-grid">
          {products.slice(0, 8).map(prod => (
            <div key={prod.id} className="product-card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <img src={prod.image} alt={prod.title} style={{ height: '150px', width: '100%', objectFit: 'contain' }} />
                <button
                  style={{ position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => toggleWishlist(prod)}
                >
                  <Heart size={20} color={wishlist.some(w => w.id === prod.id) ? '#EF4444' : '#94A3B8'} fill={wishlist.some(w => w.id === prod.id) ? '#EF4444' : 'none'} />
                </button>
              </div>

              <span className="verified-tag good" style={{ fontSize: '0.7rem', marginTop: '0.5rem', display: 'inline-block' }}>
                {prod.classification} Genuine
              </span>

              <h4 style={{ fontSize: '0.9rem', margin: '0.4rem 0', height: '40px', overflow: 'hidden', color: '#0F2167', cursor: 'pointer' }} onClick={() => navigateTo('product-detail', prod.id)}>
                {prod.title}
              </h4>

              <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.5rem' }}>
                Part #: <code>{prod.partNumber}</code>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: '#94A3B8', marginRight: '0.3rem' }}>₹{prod.mrp}</span>
                  <b style={{ fontSize: '1.1rem', color: '#0F2167' }}>₹{prod.price}</b>
                </div>
                <button className="btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }} onClick={() => addToCart(prod)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MUMBAI INSTANT PORTER EXPRESS PINCODE CHECKER */}
      <section style={{ background: '#FFFFFF', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ background: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)', borderRadius: '16px', padding: '2rem', color: '#FFFFFF', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'center', boxShadow: '0 10px 30px rgba(225,29,72,0.2)' }}>
            <div>
              <span style={{ background: '#FFFFFF', color: '#BE123C', fontSize: '0.72rem', fontWeight: 900, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                ⚡ MUMBAI EXPRESS DELIVERY CHECKER
              </span>
              <h3 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF' }}>
                Same-Day Porter / Borzo Rider Dispatch (2 to 4 Hours)
              </h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#FECDD3' }}>
                Check if your Mumbai, Thane, or Navi Mumbai delivery pincode qualifies for instant 2-4 hr rider dispatch!
              </p>
            </div>

            <div style={{ background: '#FFFFFF', color: '#0F172A', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.4rem' }}>
                ENTER MUMBAI REGION PINCODE
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="e.g. 400053, 400001, 400703"
                  style={{ flex: 1, padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontWeight: 700 }}
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('⚡ LIVE PORTER RIDER DISPATCH CONFIRMED! 2-4 Hour Delivery Available for your Pincode.');
                  }}
                  style={{ background: '#E11D48', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '0.55rem 1rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Check Speed
                </button>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 800 }}>
                🟢 Active in Mumbai City, Suburbs, Thane & Navi Mumbai
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* B2B WHOLESALE WORKSHOP & MECHANIC BULK ORDER DISCOUNT QUOTE */}
      <section style={{ background: '#F8FAFC', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '2rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
              <div>
                <span style={{ background: '#0F2167', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 900, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                  🏢 B2B WHOLESALE & MECHANIC TRADE
                </span>
                <h2 style={{ margin: '0.5rem 0 0.5rem 0', fontSize: '1.6rem', fontWeight: 900, color: '#0F172A' }}>
                  Bulk Workshop & Fleet Spare Parts Pricing (Up to 35% Off)
                </h2>
                <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                  Are you a garage owner, mechanic, auto spare parts retailer, or fleet operator? Get direct owner bulk pricing, GST tax invoices, and dedicated account manager support.
                </p>

                <div style={{ display: 'flex', gap: '1.25rem' }}>
                  <div style={{ borderLeft: '3px solid #FF6B00', paddingLeft: '0.75rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F2167', display: 'block' }}>15% - 35%</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Trade Discount Margins</span>
                  </div>
                  <div style={{ borderLeft: '3px solid #10B981', paddingLeft: '0.75rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F2167', display: 'block' }}>GST Credit</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Full Tax Invoicing</span>
                  </div>
                  <div style={{ borderLeft: '3px solid #3B82F6', paddingLeft: '0.75rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F2167', display: 'block' }}>Credit Line</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>30-Day Pay Terms</span>
                  </div>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', border: '1px solid #CBD5E1' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', color: '#0F2167', fontSize: '0.95rem', fontWeight: 800 }}>
                  Request B2B Trade Discount Quote
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <input type="text" placeholder="Workshop / Garage Name" style={{ padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }} />
                  <input type="text" placeholder="Contact Person Phone & GST No." style={{ padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }} />
                  <textarea placeholder="List of required spare parts (Part # or Model)..." rows={3} style={{ padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem', resize: 'none' }} />
                  <button
                    onClick={() => {
                      showToast('💼 B2B Trade Discount Quote Submitted! Account Manager will contact you within 30 minutes.');
                    }}
                    style={{ background: '#0F2167', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '0.65rem', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}
                  >
                    Submit B2B Quote Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SMART CAR DIAGNOSTIC SYMPTOM TROUBLESHOOTER */}
      <section style={{ background: '#FFFFFF', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <span style={{ background: '#FEE2E2', color: '#DC2626', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>
              🩺 CAR DIAGNOSTIC WIZARD
            </span>
            <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 900, color: '#0F172A' }}>
              Troubleshoot Car Symptoms & Find Exact Solution Parts
            </h2>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
              Select what issue your vehicle is experiencing to view verified diagnostic solutions
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {[
              { sym: '🌡️ Engine Overheating', cause: 'Low coolant, faulty radiator fan or stuck thermostat valve', parts: 'Coolant Concentrate, Radiator Fan Assy, ECT Sensor', query: 'Coolant' },
              { sym: '🚗 Squeaking Noise on Braking', cause: 'Worn brake pad lining or scored rotor disc surface', parts: 'Front/Rear Brake Pad Set, Brake Disc Rotor, Brake Oil', query: 'Brake Pad' },
              { sym: '🔋 Slow Engine Crank / Dead Battery', cause: 'Weak battery voltage or alternator regulator fault', parts: 'Amaron 35Ah/45Ah Battery, Voltage Regulator, Jump Starter', query: 'Battery' },
              { sym: '💨 Black Smoke & Mileage Drop', cause: 'Clogged air filter, faulty MAP sensor or dirty fuel injector', parts: 'Engine Air Filter, MAP Sensor, Fuel Injector Cleaner', query: 'Air Filter' }
            ].map((diag, idx) => (
              <div key={idx} style={{ background: '#F8FAFC', borderRadius: '12px', padding: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '0.95rem', fontWeight: 800, color: '#DC2626' }}>{diag.sym}</h4>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                    <b>Probable Cause:</b> {diag.cause}
                  </p>
                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '0.5rem', borderRadius: '6px', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#0F2167', display: 'block' }}>RECOMMENDED FIX PARTS:</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>{diag.parts}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSearchQuery(diag.query);
                    navigateTo('catalog');
                  }}
                  style={{ width: '100%', background: '#0F2167', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '0.5rem', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  View Fix Parts in Catalog
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOM CAR MODIFICATION & DETAILING COMBO PACKAGES */}
      <section style={{ background: '#F8FAFC', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <span style={{ background: '#F5F3FF', color: '#6D28D9', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>
              🎨 CUSTOM CAR MODIFICATION BUNDLES
            </span>
            <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 900, color: '#0F172A' }}>
              Curated Style, Detailing & Travel Combo Packs (Save 30% - 40%)
            </h2>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
              Complete all-in-one upgrade packages for interior luxury, pro shine detailing & road trips
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {[
              { title: 'VIP Interior Luxury Style Pack', items: ['Star Light Projector USB', 'Universal 7D Leather Mats', 'Alcantara Wrap Roll', 'Neck Rest Side Pillows'], orig: 4999, price: 3499, discount: '30% OFF', badge: '👑 VIP INTERIOR' },
              { title: 'Pro Detailing & Gloss Shine Pack', items: ['12V Cordless Buffer Polisher', '9H DIY Ceramic Coating Kit', 'Microfiber Mitt Glove', 'Graphene Polish Spray'], orig: 7999, price: 4999, discount: '38% OFF', badge: '✨ PRO DETAILING' },
              { title: 'Ultimate Road Trip & Camping Pack', items: ['Double Layer Inflatable Bed', '12V Electric Kettle', 'Steering Wheel Work Tray', 'Window Camping Mesh Screens'], orig: 4599, price: 2999, discount: '35% OFF', badge: '🏕️ ROAD TRIP' }
            ].map((combo, idx) => (
              <div key={idx} style={{ background: '#FFFFFF', borderRadius: '12px', padding: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ background: '#F5F3FF', color: '#6D28D9', fontSize: '0.68rem', fontWeight: 900, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>{combo.badge}</span>
                    <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{combo.discount}</span>
                  </div>

                  <h4 style={{ margin: '0.4rem 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>{combo.title}</h4>

                  <ul style={{ margin: '0 0 1rem 0', paddingLeft: '1.1rem', fontSize: '0.78rem', color: '#475569', lineHeight: 1.6 }}>
                    {combo.items.map((it, i) => <li key={i}>{it}</li>)}
                  </ul>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A' }}>₹{combo.price}</span>
                    <span style={{ fontSize: '0.78rem', color: '#94A3B8', textDecoration: 'line-through' }}>₹{combo.orig}</span>
                  </div>

                  <button
                    onClick={() => {
                      addToCart({ id: `combo-${idx}`, name: combo.title, price: combo.price, originalPrice: combo.orig, image: '/luxury_interior/star_light_projector.jpg' });
                      navigateTo('cart');
                    }}
                    style={{ width: '100%', background: '#7C3AED', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.55rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                  >
                    Add Combo Bundle to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE OEM EXPLODED PARTS SCHEMATIC SCHEME VIEWER */}
      <section style={{ background: '#FFFFFF', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <span style={{ background: '#EFF6FF', color: '#1D4ED8', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>
              📐 MECHANIC & DIY EXPLODED DIAGRAMS
            </span>
            <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 900, color: '#0F172A' }}>
              Interactive OEM Exploded Assembly Schematics
            </h2>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
              Click on numbered assembly diagram hotspots to view & order exact OEM component parts
            </p>
          </div>

          <div style={{ background: '#F8FAFC', borderRadius: '14px', padding: '1.5rem', border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ background: '#FFFFFF', borderRadius: '10px', padding: '1rem', border: '1px dashed #CBD5E1', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F2167', display: 'block', marginBottom: '0.5rem' }}>
                FRONT SUSPENSION STRUT & BRAKE ASSEMBLY SCHEMATIC
              </span>
              <div style={{ height: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#F1F5F9', borderRadius: '8px', position: 'relative' }}>
                <img src="/clean_shock.png" alt="Front Shock Absorber Strut Schematic" style={{ maxHeight: '180px', objectFit: 'contain' }} />
                <span style={{ position: 'absolute', top: '20px', left: '40%', background: '#EF4444', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 900, borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="#1 Front Strut Support">#1</span>
                <span style={{ position: 'absolute', top: '70px', left: '48%', background: '#3B82F6', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 900, borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="#2 Coil Spring">#2</span>
                <span style={{ position: 'absolute', bottom: '30px', right: '35%', background: '#10B981', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 900, borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="#3 Shock Absorber">#3</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '0.85rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A' }}>#1 STRUT SUPPORT (FR)</span>
                  <b style={{ fontSize: '0.85rem', color: '#1D4ED8' }}>₹699</b>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Part #: 41710M68P00</span>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '0.85rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A' }}>#2 SPRING, COIL (FR)</span>
                  <b style={{ fontSize: '0.85rem', color: '#1D4ED8' }}>₹899</b>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Part #: 41111M68P00</span>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '0.85rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A' }}>#3 SHOCK ABSORBER (FR)</span>
                  <b style={{ fontSize: '0.85rem', color: '#1D4ED8' }}>₹2,199</b>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Part #: 41601M68P00</span>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory('suspension');
                  navigateTo('catalog');
                }}
                style={{ background: '#0F2167', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.65rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', textAlign: 'center' }}
              >
                Order Full Front Suspension Assembly
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* INSURANCE CLAIM APPROVED OEM PARTS DIRECTORY */}
      <section style={{ background: '#F8FAFC', padding: '2.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          <div style={{ background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', borderRadius: '16px', padding: '2rem', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', boxShadow: '0 10px 30px rgba(2,132,199,0.2)' }}>
            <div>
              <span style={{ background: '#FFFFFF', color: '#0284C7', fontSize: '0.72rem', fontWeight: 900, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                🛡️ CASHLESS CLAIM CERTIFIED
              </span>
              <h3 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF' }}>
                Insurance Claim Approved OEM Body & Lighting Parts
              </h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#E0F2FE' }}>
                100% IRDAI & Insurance Surveyor Approved Body Panels, Bumpers, Mirrors & Headlights with GST Tax Invoices
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('body');
                navigateTo('catalog');
              }}
              style={{ background: '#FFFFFF', color: '#0284C7', border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem', fontSize: '0.88rem', fontWeight: 900, cursor: 'pointer' }}
            >
              Browse Insurance Approved Parts
            </button>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Quick Support Button */}
      <a
        href="https://wa.me/918591719499?text=Hi%20AutoZonIndia,%20I%20need%20help%20finding%20a%20spare%20part"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '25px',
          right: '25px',
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 6px 20px rgba(37, 211, 102, 0.4)',
          zIndex: 9999,
          transition: 'transform 0.2s'
        }}
        title="Chat on WhatsApp (+91 8591719499)"
      >
        <MessageCircle size={32} />
      </a>
    </div>
  );
};
