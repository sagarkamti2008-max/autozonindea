import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search, ShoppingCart, Heart, Car, Wrench, ShieldCheck, Zap,
  ChevronDown, Star, ArrowRight, Layers, CheckCircle2, Mic, Crown,
  User, PhoneCall, Truck, CreditCard, Wallet, Lock, Sparkles, Filter
} from 'lucide-react';
import { getCustomerProfile } from '../services/customerAccountEngine';
import { Footer } from '../components/Footer';
import CustomSelect from '../components/CustomSelect';

export const ModernAutomotiveHomepage = () => {
  const { navigateTo, addToCart, wishlist, cartItemCount, filteredProducts: products, showToast } = useStore();
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

  // Complete 31 Car Brand Companies Database (Exact All Brands from User Callout)
  const carDatabase = {
    'MARUTI': {
      models: ['ALTO', 'ALTO 800', 'ALTO K10', 'BALENO', 'BREZZA', 'CIAZ', 'DZIRE', 'ERTIGA', 'GRAND VITARA', 'IGNIS', 'JIMNY', 'S-CROSS', 'S-PRESSO', 'SWIFT', 'WAGON R', 'XL6'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016'],
      variants: ['ZXI PLUS 1.2L DUALJET', 'VXI 1.2L MT', 'ZDI+ 1.3L DDIS TURBO', 'LXI 1.0L CNG']
    },
    'HYUNDAI': {
      models: ['ACCENT/ VIVA', 'ALCAZAR', 'AURA', 'CRETA', 'CRETA EV', 'ELANTRA', 'EON', 'EXTER', 'GETZ', 'GRAND I10', 'I10', 'I20', 'IONIQ 5', 'KONA', 'SANTA FE', 'SANTRO', 'SONATA', 'TERRACAN', 'TUCSON', 'VENUE', 'VERNA', 'XCENT'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'],
      variants: ['SX(O) 1.5L CRDI DIESEL', 'SX 1.5L MPI PETROL', '1.0L TURBO GDI IVT', 'MAGNA 1.2L CNG']
    },
    'SKODA': {
      models: ['FABIA', 'KAROQ', 'KODIAQ', 'KUSHAQ', 'KYLAQ', 'LAURA', 'OCTAVIA', 'RAPID', 'SLAVIA', 'SUPERB', 'YETI'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'],
      variants: ['STYLE 1.5L TSI DSG', 'AMBITION 1.0L TSI MT', 'MONTE CARLO 1.5L TSI', 'L&K 2.0L TSI 4X4']
    },
    'VW': {
      models: ['AMEO', 'BEETLE', 'CROSS POLO', 'JETTA', 'PASSAT', 'POLO', 'TAIGUN', 'TIGUAN', 'TIGUAN ALLSPACE', 'TOUAREG', 'T-ROC', 'VENTO', 'VIRTUS'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'],
      variants: ['GT LINE 1.5L TSI DSG', 'HIGHLINE 1.0L TSI MT', 'TOPLINE 1.0L TSI AT', 'HIGHLINE 1.5L TDI']
    },
    'HONDA': {
      models: ['ACCORD', 'AMAZE', 'BRIO', 'CITY', 'CIVIC', 'CR-V', 'ELEVATE', 'JAZZ', 'MOBILIO', 'WR-V'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'],
      variants: ['ZX 1.5L I-VTEC CVT', 'VX 1.5L I-DTEC DIESEL', 'E:HEV STRONG HYBRID', 'VX 1.2L I-VTEC']
    },
    'NISSAN': {
      models: ['EVALIA', 'GT-R', 'KICKS', 'MAGNITE', 'MICRA', 'MICRA ACTIVE', 'PATHFINDER', 'SUNNY', 'TERRANO', 'X-TRAIL'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019'],
      variants: ['XV PREMIUM 1.0L TURBO CVT', 'XL 1.0L B4D MT', 'XV 1.5L K9K DIESEL']
    },
    'FORD': {
      models: ['ASPIRE', 'ECOSPORT', 'ENDEAVOUR', 'FESTIVA', 'FIGO', 'FREESTYLE', 'IKON', 'MUSTANG', 'TURNEO'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'],
      variants: ['TITANIUM+ 2.0L ECOBLUE 4X4', 'TITANIUM 1.5L TDCI DIESEL', 'SPORTS 1.5L TI-VCT PETROL']
    },
    'MAHINDRA': {
      models: ['ALTURAS G4', 'BOLERO', 'BOLERO MAXITRUCK', 'BOLERO NEO', 'BOLERO NEO PLUS', 'E2O', 'KUV100', 'MARAZZO', 'NUVOSPORT', 'QUANTUM', 'SCORPIO', 'SCORPIO CLASSIC', 'SCORPIO-N', 'THAR', 'THAR ROXX', 'TUV300', 'TUV300 PLUS', 'VERITO', 'XUV300', 'XUV400 EV', 'XUV700', 'XYLO'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'],
      variants: ['AX7 L 2.2L MHAWK DIESEL AWD', 'LX 4X4 HARDTOP 2.0L MSTALLION', 'Z8 L 2.2L DIESEL AT', 'N10 1.5L MHAWK']
    },
    'TOYOTA': {
      models: ['CAMRY', 'COROLLA ALTIS', 'ETIOS', 'ETIOS LIVA', 'FORTUNER', 'GLANZA', 'HILUX', 'INNOVA', 'INNOVA CRYSTA', 'INNOVA HYCROSS', 'LAND CRUISER', 'PRIUS', 'QUALIS', 'RUMION', 'URBAN CRUISER', 'URBAN CRUISER HYRYDER', 'VELLFIRE', 'YARIS'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'],
      variants: ['2.4L ZX DIESEL 7-STR', '2.8L 4X4 SIGMA-4 AT', '1.5L V HYBRID E-CVT', 'G 1.2L PETROL']
    },
    'TATA': {
      models: ['ALTROZ', 'ARIA', 'BOLT', 'CURVV', 'CURVV EV', 'HARRIER', 'INDICA', 'INDICA V2', 'INDIGO', 'INDIGO CS', 'MANZA', 'NANO', 'NEXON', 'NEXON EV', 'PUNCH', 'PUNCH EV', 'SAFARI', 'SAFARI STORME', 'SUMO', 'SUMO GOLD', 'TIAGO', 'TIAGO EV', 'TIGOR', 'TIGOR EV', 'ZEST'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'],
      variants: ['XZ+ LUX 1.5L REVOTORQ DIESEL', 'FEARLESS+ S 1.2L TURBO DCA', 'ACCOMPLISHED+ 2.0L KRYOTEC AT']
    },
    'RENAULT': {
      models: ['DUSTER', 'FLUENCE', 'KIGER', 'KOLEOS', 'KWID', 'LODGY', 'PULSE', 'SCALA', 'TRIBER'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019'],
      variants: ['RXZ 1.0L TURBO X-TRONIC CVT', 'RXT 1.0L ENERGY MT', 'RXZ 1.5L DCI DIESEL']
    },
    'CHEVROLET': {
      models: ['AVEO', 'AVEO U-VA', 'BEAT', 'CAPTIVA', 'CRUZE', 'ENJOY', 'FORESTER', 'OPTRA', 'SAIL', 'SPARK', 'TAVERA'],
      years: ['2022', '2020', '2018', '2016', '2014', '2012'],
      variants: ['LTZ 2.0L VCDI DIESEL', 'LT 1.0L TCDI DIESEL', 'LS 1.2L PETROL']
    },
    'JAGUAR': {
      models: ['F-PACE', 'XE', 'XF', 'XJ', 'F-TYPE', 'I-PACE'],
      years: ['2026', '2025', '2024', '2023', '2022', '2020'],
      variants: ['R-DYNAMIC S 2.0L INGENIUM DIESEL', 'PORTFOLIO 2.0L PETROL', 'SVR 5.0L V8 SUPERCHARGED']
    },
    'LEXUS': {
      models: ['ES 300H', 'LC 500H', 'LS 500H', 'LX 500D', 'NX', 'RX'],
      years: ['2026', '2025', '2024', '2023', '2022'],
      variants: ['350H LUXURY SELF-CHARGING HYBRID', 'ES 300H EXQUISITE', 'LX 500D TWIN TURBO V6']
    },
    'CITROEN': {
      models: ['BASALT', 'C3', 'C3 AIRCROSS', 'C5 AIRCROSS', 'EC3'],
      years: ['2026', '2025', '2024', '2023', '2022'],
      variants: ['SHINE 1.2L PURETECH TURBO AT', 'FEEL 1.2L NA MT', 'SHINE 2.0L HDI DIESEL']
    },
    'BYD': {
      models: ['ATTO 3', 'E6', 'SEAL', 'SEALION 6'],
      years: ['2026', '2025', '2024', '2023', '2022'],
      variants: ['EXTENDED RANGE BLADE BATTERY 60.48KWH', 'EXCELLENCE AWD 530HP DUAL MOTOR', 'PREMIUM RWD']
    },
    'FIAT': {
      models: ['500', 'ABARTH PUNTO', 'AVVENTURA', 'LINEA', 'PALIO', 'PUNTO EVO', 'URBAN CROSS'],
      years: ['2022', '2020', '2018', '2016', '2014'],
      variants: ['ABARTH 1.4L T-JET 145HP', 'EMOTION 1.3L MULTIJET DIESEL 90HP', 'DYNAMIC 1.2L FIRE']
    },
    'MORRIS GARAGES': {
      models: ['ASTOR', 'COMET EV', 'GLOSTER', 'HECTOR', 'HECTOR PLUS', 'WINDSOR EV', 'ZS EV'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020'],
      variants: ['SAVVY PRO 2.0L KRYOTEC DIESEL 6MT', 'SHARP PRO 1.5L TURBO CVT', 'SAVVY 4WD 2.0L TWIN TURBO DIESEL']
    },
    'MERCEDES-BENZ': {
      models: ['A-CLASS', 'AMG GT', 'B-CLASS', 'C-CLASS', 'CLA', 'CLS', 'E-CLASS', 'EQA', 'EQB', 'EQC', 'EQE', 'EQS', 'G-WAGON / G-CLASS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'MAYBACH S-CLASS', 'S-CLASS', 'SL-CLASS'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020'],
      variants: ['C 220D AMG LINE', 'E 220D EXCLUSIVE LWB', 'GLC 300 4MATIC', 'G 63 AMG 4.0L V8']
    },
    'JEEP': {
      models: ['CHEROKEE', 'COMPASS', 'GRAND CHEROKEE', 'MERIDIAN', 'WRANGLER'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020'],
      variants: ['MODEL S 2.0L MULTIJET II 4X4 9AT', 'RUBICON 2.0L TURBO 4X4 ROCK-TRAC', 'LIMITED 2.0L DIESEL 6MT']
    },
    'ISUZU': {
      models: ['D-MAX V-CROSS', 'HI-LANDER', 'MU-7', 'MU-X'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021'],
      variants: ['Z-PRESTIGE 1.9L DDI 4X4 AT', 'Z 1.9L DDI 4X2 AT', 'HI-LANDER 2.5L DDI MT']
    },
    'KIA': {
      models: ['CARENS', 'CARNIVAL', 'EV6', 'EV9', 'SELTOS', 'SONET', 'SYROS'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020'],
      variants: ['GTX+ 1.5L TURBO GDI DCT', 'HTX+ 1.5L CRDI VGT IMT', 'GT-LINE AWD 77.4KWH EV']
    },
    'BMW': {
      models: ['1 SERIES', '2 SERIES', '3 SERIES', '3 SERIES GRAN LIMOUSINE', '5 SERIES', '6 SERIES', '7 SERIES', 'I4', 'I7', 'IX', 'IX1', 'M2', 'M3', 'M4', 'M5', 'X1', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020'],
      variants: ['330I M SPORT GRAN LIMOUSINE', '520D LUXURY LINE', 'X5 XDRIVE30D M SPORT', 'M3 COMPETITION XDRIVE']
    },
    'AUDI': {
      models: ['A3', 'A4', 'A6', 'A8L', 'E-TRON', 'E-TRON GT', 'Q2', 'Q3', 'Q3 SPORTBACK', 'Q5', 'Q7', 'Q8', 'RS5', 'RS7', 'S5 SPORTBACK', 'TT'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020'],
      variants: ['40 TFSI TECHNOLOGY', '45 TFSI QUATTRO TECHNOLOGY', '55 TFSI QUATTRO MATRIX LED']
    },
    'MITSUBISHI': {
      models: ['CEDIA', 'LANCER', 'MONTERO', 'OUTLANDER', 'PAJERO', 'PAJERO SPORT'],
      years: ['2022', '2020', '2018', '2016', '2014', '2012'],
      variants: ['SELECT PLUS 2.5L DI-D 4X4 MT', '2.0L MIVEC CVT', 'CEDIA 2.0L SPORTS MT']
    },
    'PORSCHE': {
      models: ['718 BOXSTER', '718 CAYMAN', '911 CARRERA', 'CAYENNE', 'MACAN', 'PANAMERA', 'TAYCAN'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021'],
      variants: ['CAYENNE COUPÉ 3.0L V6 TURBO', 'MACAN GTS 2.9L TWIN-TURBO V6', '911 CARRERA S 3.0L FLAT-6']
    },
    'DATSUN': {
      models: ['GO', 'GO+', 'REDI-GO'],
      years: ['2022', '2020', '2018', '2016'],
      variants: ['T(O) 1.2L CVT', 'T(O) 1.0L SMART DRIVE AMT', 'D 0.8L MT']
    },
    'BENTLEY': {
      models: ['BENTAYGA', 'CONTINENTAL GT', 'FLYING SPUR'],
      years: ['2026', '2025', '2024', '2023', '2022'],
      variants: ['V8 4.0L TWIN TURBO 542HP', 'W12 6.0L TWIN TURBO 626HP', 'HYBRID 3.0L V6 PHEV']
    },
    'VOLVO': {
      models: ['C40 RECHARGE', 'EX30', 'EX90', 'S60', 'S90', 'V90 CROSS COUNTRY', 'XC40', 'XC40 RECHARGE', 'XC60', 'XC90'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021'],
      variants: ['B5 ULTIMATE MILD HYBRID AWD', 'TWIN MOTOR AWD 408HP EV', 'D5 INSCRIPTION AWD']
    },
    'LAND ROVER': {
      models: ['DEFENDER 110', 'DEFENDER 130', 'DEFENDER 90', 'DISCOVERY', 'DISCOVERY SPORT', 'RANGE ROVER', 'RANGE ROVER EVOQUE', 'RANGE ROVER SPORT', 'RANGE ROVER VELAR'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021'],
      variants: ['DEFENDER 110 HSE 3.0L D300 AWD', 'RANGE ROVER AUTOBIOGRAPHY 3.0L LWB', 'DYNAMIC SE 2.0L']
    },
    'FORCE': {
      models: ['GURKHA 3-DOOR', 'GURKHA 5-DOOR', 'TRAX CASH KING', 'TRAX CRUISER', 'TRAX TOOFAN', 'TRAVELER', 'URBANIA'],
      years: ['2026', '2025', '2024', '2023', '2022', '2021'],
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
    if (searchTab === 'vehicle') {
      if (!selectedBrand || !selectedModel) {
        showToast('⚠️ Please select at least Car Brand and Model!');
        return;
      }
      showToast(`🚗 Filtering spare parts for: ${selectedBrand} ${selectedModel} ${selectedYear ? `(${selectedYear})` : ''}`);
      navigateTo('catalog');
    } else {
      if (!numberPlateInput || numberPlateInput.trim().length < 4) {
        showToast('⚠️ Please enter a valid registration number (e.g. MH01AB1234)!');
        return;
      }

      setIsSearchingVahan(true);
      setTimeout(() => {
        setIsSearchingVahan(false);
        const info = getVahanVehicleInfo(numberPlateInput);
        setVahanModalData(info);
        showToast(`✅ VAHAN Record Verified for ${info.plate}!`);
      }, 700);
    }
  };

  // Top Categories Database
  const topCategories = [
    {
      id: 'engine-parts',
      title: 'Engine Parts',
      count: '1,420+ Items',
      icon: '⚙️',
      image: '/images/synthetic_engine_oil.jpg',
      badge: 'Core',
      desc: 'Pistons, Spark Plugs, Belts & Mounts'
    },
    {
      id: 'oils-fluids',
      title: 'Engine Oil & Fluids',
      count: '540+ Items',
      icon: '🛢️',
      image: '/images/synthetic_engine_oil.jpg',
      badge: 'Fluids',
      desc: 'Engine Oils, Coolants, Brake Fluids'
    },
    {
      id: 'brake-system',
      title: 'Brakes',
      count: '890+ Items',
      icon: '🛑',
      image: '/images/brake_disc_rotor.jpg',
      badge: 'Safety',
      desc: 'Brake Pads, Rotors, Calipers & Shoes'
    },
    {
      id: 'filters',
      title: 'Filters',
      count: '1,200+ Items',
      icon: '🧹',
      image: '/images/autozon_warehouse_bg.jpg',
      badge: 'Maintenance',
      desc: 'Air, Oil, Cabin & Fuel Filters'
    },
    {
      id: 'body-bumper',
      title: 'Body & Bumper',
      count: '950+ Items',
      icon: '🚗',
      image: '/images/wheel_rim_exterior.jpg',
      badge: 'Exterior',
      desc: 'Bumpers, Mirrors, Fenders & Grilles'
    },
    {
      id: 'electrical',
      title: 'Electrical',
      count: '1,150+ Items',
      icon: '⚡',
      image: '/images/led_headlight_exterior.jpg',
      badge: 'Power',
      desc: 'Batteries, Alternators, Starters & Fuses'
    },
    {
      id: 'car-accessories',
      title: 'Accessories',
      count: '2,640+ Items',
      icon: '✨',
      image: '/images/infotainment_installed.jpg',
      badge: 'Style',
      desc: 'Mats, Seat Covers, Dash Cams & Alloys'
    },
    {
      id: 'car-care',
      title: 'Car Care',
      count: '320+ Items',
      icon: '🧽',
      image: '/images/autozon_warehouse_bg.jpg',
      badge: 'Cleaning',
      desc: 'Shampoos, Polishes, Microfibers & Wax'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#FF5722] selection:text-white">
      
      {/* -------------------------------------------------------------
          1. HEADER SECTION (Exact AutoDukan Navigation Bar)
      ------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* AutoZonIndia Brand Logo */}
            <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => navigateTo('home')}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] flex items-center justify-center text-white shadow-md">
                <Car className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-[#1E293B]">
                  Auto<span className="text-[#FF5722]">Zon</span><span className="text-[#00E5FF]">India</span>
                </span>
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase -mt-1">
                  100% Genuine Car Parts Direct Store
                </span>
              </div>
            </div>

            {/* Central Search Bar (Live Smart Auto-Suggest) */}
            <div className="flex-1 max-w-2xl hidden md:flex items-center relative">
              <input
                type="text"
                placeholder="Search by Part Name, Part No., Brand (e.g. Brake, Spark, Oil, LED, Bosch)..."
                value={searchQueryInput}
                onChange={(e) => {
                  setSearchQueryInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full bg-[#F1F5F9] border border-slate-300 text-slate-800 placeholder-slate-400 text-sm font-semibold rounded-full pl-6 pr-24 py-3 focus:outline-none focus:border-[#FF5722] focus:bg-white transition shadow-inner"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setShowSuggestions(false);
                    showToast(`🔍 Searching for: "${searchQueryInput}"`);
                    navigateTo('catalog');
                  }
                }}
              />
              <div className="absolute right-2 flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const voiceTerm = 'Bosch Brake Pads';
                    setSearchQueryInput(voiceTerm);
                    setShowSuggestions(true);
                    showToast(`🎙️ Voice Captured: "${voiceTerm}"`);
                  }}
                  title="Voice Search"
                  className="p-2 text-slate-400 hover:text-[#FF5722] transition"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setShowSuggestions(false);
                    navigateTo('catalog');
                  }}
                  className="bg-[#FF5722] hover:bg-[#E64A19] text-white p-2.5 rounded-full transition shadow-md cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Instant Auto-Suggest Popup Dropdown */}
              {showSuggestions && searchQueryInput.trim().length >= 1 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <Sparkles className="w-3.5 h-3.5" /> Instant Live Suggestions for "{searchQueryInput}"
                    </span>
                    <span className="text-slate-400 text-[10px]">{matchingSuggestions.length} Matches Found</span>
                  </div>

                  {matchingSuggestions.length > 0 ? (
                    <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                      {matchingSuggestions.map(item => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setShowSuggestions(false);
                            showToast(`🔍 Viewing ${item.title}`);
                            navigateTo('catalog');
                          }}
                          className="p-3 hover:bg-slate-50 transition cursor-pointer flex items-center gap-3.5 group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                            <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black uppercase text-[#FF5722]">{item.brand}</span>
                              {item.oemPartNumber && (
                                <span className="text-[9px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.2 rounded font-mono">
                                  OEM: {item.oemPartNumber}
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-[#FF5722] transition">
                              {item.title}
                            </h4>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xs font-black text-slate-900">₹{item.price.toLocaleString()}</div>
                            {item.discount && (
                              <span className="text-[9px] font-black bg-rose-100 text-rose-600 px-1.5 py-0.2 rounded">
                                {item.discount}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-500 space-y-1">
                      <div>No direct part number match found for "{searchQueryInput}"</div>
                      <div className="text-[11px] text-[#2563EB] font-bold">Press Enter to search entire AutoZon catalog</div>
                    </div>
                  )}

                  {/* Quick Filter Pill Chips */}
                  <div className="bg-slate-50 p-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="text-slate-400 font-bold mr-1">Popular:</span>
                    {['Brake Pads', 'Spark Plugs', 'Engine Oils', 'LED Lights', 'Coolants', 'Filters'].map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          setSearchQueryInput(tag);
                          setShowSuggestions(true);
                        }}
                        className="bg-white border border-slate-200 hover:border-[#FF5722] hover:text-[#FF5722] text-slate-700 px-2.5 py-1 rounded-full font-bold transition text-[10px]"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Header Action Icons & Auth Buttons */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              
              {/* Wishlist Icon */}
              <button onClick={() => navigateTo('wishlist')} className="p-2 text-slate-600 hover:text-[#FF5722] transition relative">
                <Heart className="w-6 h-6" />
                {wishlist && wishlist.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-rose-600 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Icon */}
              <button onClick={() => navigateTo('cart')} className="p-2 text-slate-600 hover:text-[#FF5722] transition relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#FF5722] text-white font-extrabold text-[10px] rounded-full flex items-center justify-center">
                  {cartItemCount || 3}
                </span>
              </button>

              {/* Garage / Vehicle Icon */}
              <button onClick={() => navigateTo('my-garage')} className="p-2 text-slate-600 hover:text-[#FF5722] transition hidden sm:block">
                <Car className="w-6 h-6" />
              </button>


            </div>
          </div>
        </div>
      </header>


      {/* -------------------------------------------------------------
          2. HERO BANNER SECTION (High Impact First Impression)
      ------------------------------------------------------------- */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-16 sm:py-24">
        {/* Background Graphic */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent z-10" />
          <img 
            src="/images/autozon_warehouse_bg.jpg" 
            alt="AutoZon Warehouse" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content: High Impact Copy & Brands */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-black uppercase tracking-wider">
                ⚡ UPTO 60% OFF ON TOP BRANDS
              </div>

              <h1 className="text-4xl sm:text-6xl font-black leading-[1.1] tracking-tight text-white">
                India me Car Parts Online — <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500 text-3xl sm:text-5xl mt-2 block">
                  Engine Parts, Oils, Bumper, Accessories
                </span>
              </h1>
              
              <p className="text-slate-300 text-lg sm:text-xl font-medium max-w-lg">
                Apni car select karein aur sahi parts ghar baithe mangwayein.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button 
                  onClick={() => navigateTo('catalog')}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-black text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-lg shadow-orange-500/30 transition-all cursor-pointer flex items-center gap-2"
                >
                  Shop by Category
                </button>
                <button 
                  onClick={() => {
                    const selector = document.getElementById('vehicle-selector-widget');
                    if (selector) selector.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all cursor-pointer"
                >
                  Apni Car Chuno
                </button>
              </div>

              {/* Brand Logos (Visual Representation) */}
              <div className="pt-4 flex items-center gap-6 opacity-80">
                <div className="font-black text-2xl tracking-tighter italic">MARUTI</div>
                <div className="font-black text-2xl tracking-tighter">HYUNDAI</div>
                <div className="font-black text-2xl tracking-tighter">TATA</div>
                <div className="font-black text-2xl tracking-tighter">MAHINDRA</div>
              </div>
            </div>

            {/* Right Content: Quick Vehicle Selector Widget */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
              <div className="absolute -top-4 -right-4 bg-orange-500 text-white text-xs font-black px-4 py-2 rounded-xl shadow-lg transform rotate-3">
                100% Fitment Guarantee
              </div>
              
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <Car className="text-orange-500 w-6 h-6" />
                Select Your Car
              </h3>

              <form onSubmit={handleVehicleSearch} className="space-y-4">
                {/* Brand Select */}
                <CustomSelect
                  label="1. Select Brand"
                  placeholder="e.g. Maruti Suzuki"
                  value={selectedBrand}
                  onChange={(val) => {
                    setSelectedBrand(val);
                    setSelectedModel('');
                    setSelectedYear('');
                  }}
                  options={Object.keys(carDatabase)}
                />

                {/* Model & Year Select Row */}
                <div className="grid grid-cols-2 gap-4">
                  <CustomSelect
                    label="2. Select Model"
                    placeholder="e.g. Swift"
                    value={selectedModel}
                    onChange={setSelectedModel}
                    options={selectedBrand && carDatabase[selectedBrand] ? carDatabase[selectedBrand].models : []}
                    disabled={!selectedBrand}
                  />

                  <CustomSelect
                    label="3. Select Year"
                    placeholder="e.g. 2022"
                    value={selectedYear}
                    onChange={setSelectedYear}
                    options={selectedBrand && carDatabase[selectedBrand] ? carDatabase[selectedBrand].years : []}
                    disabled={!selectedModel}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-black text-lg py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <Search className="w-5 h-5" />
                  Find Parts For My Car
                </button>
              </form>
            </div>
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

        {/* 6-Column Responsive Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {topCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigateTo('catalog')}
              className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative h-32 sm:h-40 bg-slate-50 rounded-xl overflow-hidden mb-4 flex items-center justify-center p-2">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                  {cat.badge}
                </span>
                <span className="absolute bottom-2 right-2 text-2xl drop-shadow-md">
                  {cat.icon}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-orange-500 transition-colors mb-1">
                  {cat.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium mb-2 line-clamp-2">
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
                Best Sellers <span className="text-orange-500">🔥</span>
              </h2>
              <p className="text-xs text-slate-500 font-bold mt-1">Highly rated parts verified by thousands of mechanics.</p>
            </div>
            
            <button
              onClick={() => navigateTo('catalog')}
              className="text-xs font-black text-orange-500 hover:underline cursor-pointer flex items-center gap-1"
            >
              View Full Catalog <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              {
                id: 'prod-1',
                title: 'High-Performance Ventilated Brake Disc Rotor with Red Caliper',
                brand: 'BOSCH OEM',
                compatibility: 'Fits Innova Crysta / Fortuner',
                price: 3450,
                originalPrice: 4200,
                rating: 4.9,
                reviews: 128,
                image: '/images/brake_disc_rotor.jpg'
              },
              {
                id: 'prod-2',
                title: 'Full Synthetic Motor Engine Oil 5W-30 (4 Litres)',
                brand: 'MOBIL 1 SUPER',
                compatibility: 'Fits Swift, Baleno, Creta',
                price: 2850,
                originalPrice: 3500,
                rating: 5.0,
                reviews: 240,
                image: '/images/synthetic_engine_oil.jpg'
              },
              {
                id: 'prod-3',
                title: 'Ultra-Bright Matrix LED Projector Headlight',
                brand: 'PHILIPS X-TREME',
                compatibility: 'Universal 12V All Hatchback',
                price: 4200,
                originalPrice: 5400,
                rating: 4.8,
                reviews: 95,
                image: '/images/led_headlight_exterior.jpg'
              },
              {
                id: 'prod-4',
                title: '9-Inch HD Android Touchscreen Infotainment System',
                brand: 'PIONEER AUDIO',
                compatibility: 'Fits Swift, Dzire, Baleno',
                price: 14500,
                originalPrice: 18900,
                rating: 4.9,
                reviews: 310,
                image: '/images/infotainment_installed.jpg'
              }
            ].map((prod) => (
              <div
                key={prod.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col justify-between p-4 relative shrink-0 w-[85%] sm:w-auto snap-center"
              >
                <div className="absolute top-4 right-4 z-10 bg-rose-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full shadow-md">
                  Best Seller
                </div>
                <div 
                  className="relative h-48 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-3 mb-3 cursor-pointer"
                  onClick={() => navigateTo('product-detail', prod)}
                >
                  <img src={prod.image} alt={prod.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                  <span className="absolute top-2 left-2 bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded">
                    {prod.brand}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="inline-block text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                    {prod.compatibility}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-orange-500 transition-colors cursor-pointer" onClick={() => navigateTo('product-detail', prod)}>
                    {prod.title}
                  </h3>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <div className="text-lg font-black text-slate-900">₹{prod.price.toLocaleString()}</div>
                      <div className="text-xs text-slate-400 line-through">₹{prod.originalPrice.toLocaleString()}</div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(prod, 1);
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer shadow-md shadow-orange-500/20 relative z-10"
                    >
                      + Add
                    </button>
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
                image: '/images/car_filter.jpg'
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
                  <img src={prod.image} alt={prod.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                  <span className="absolute top-2 left-2 bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded">
                    {prod.brand}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="inline-block text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                    {prod.compatibility}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-orange-500 transition-colors cursor-pointer" onClick={() => navigateTo('product-detail', prod)}>
                    {prod.title}
                  </h3>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <div className="text-lg font-black text-slate-900">₹{prod.price.toLocaleString()}</div>
                      <div className="text-xs text-slate-400 line-through">₹{prod.originalPrice.toLocaleString()}</div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(prod, 1);
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer shadow-md shadow-orange-500/20 relative z-10"
                    >
                      + Add
                    </button>
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

      {/* -------------------------------------------------------------
          5. FOOTER SECTION
      ------------------------------------------------------------- */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="flex justify-center items-center gap-2 text-white font-black text-xl">
            Auto<span className="text-[#FF5722]">Zon</span><span className="text-[#00E5FF]">India</span>
          </div>
          <p className="text-slate-400">
            © 2026 AutoZonIndia Direct Store (Sagar Travels & Auto Parts). All Rights Reserved. 100% Genuine Car Parts & Accessories.
          </p>
        </div>
      </footer>

    </div>
  );
};
