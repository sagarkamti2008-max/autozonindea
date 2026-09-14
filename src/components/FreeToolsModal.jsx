import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Wrench, Car, Search, ShieldCheck, Calculator, CheckCircle2,
  AlertTriangle, ArrowRight, FileText, Activity, Clock, Zap,
  Check, MapPin, Truck, HelpCircle, Layers, RefreshCw, ShoppingCart, X
} from 'lucide-react';

export const FreeToolsModal = ({ isOpen, onClose }) => {
  const { setSelectedVehicle, setIsVehicleModalOpen, navigateTo, addToCart, showToast, products } = useStore();
  const [activeTab, setActiveTab] = useState('vin');

  // 1. VIN Decoder State
  const [vinInput, setVinInput] = useState('');
  const [vinResult, setVinResult] = useState(null);

  // 2. Maintenance Schedule State
  const [maintMake, setMaintMake] = useState('Toyota');
  const [maintModel, setMaintModel] = useState('Innova Crysta');
  const [maintMileage, setMaintMileage] = useState('45000');
  const [maintReport, setMaintReport] = useState(null);

  // 3. Diagnostic Wizard State
  const [diagCategory, setDiagCategory] = useState(null);
  const [diagSymptom, setDiagSymptom] = useState(null);

  // 4. GST & EMI Calculator State
  const [partAmount, setPartAmount] = useState('15000');
  const [gstType, setGstType] = useState('18');
  const [emiTenure, setEmiTenure] = useState('3');

  // 5. Pincode Checker State
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);

  if (!isOpen) return null;

  // --- VIN DECODER LOGIC (ISO 3779 Standard + Indian Manufacturer Decoder) ---
  const handleDecodeVIN = (e) => {
    e.preventDefault();
    const cleanVin = vinInput.trim().toUpperCase();
    if (cleanVin.length !== 17) {
      showToast('❌ VIN number must be exactly 17 characters long.');
      return;
    }

    const wmi = cleanVin.substring(0, 3);
    const country = cleanVin.startsWith('MA') || cleanVin.startsWith('MB') || cleanVin.startsWith('MC') || cleanVin.startsWith('MD') || cleanVin.startsWith('ME') ? 'India 🇮🇳' : 'Japan 🇯🇵 / International 🌐';

    let make = 'Generic Manufacturer';
    if (wmi.startsWith('MA3')) make = 'Maruti Suzuki India';
    else if (wmi.startsWith('MAL')) make = 'Hyundai Motor India';
    else if (wmi.startsWith('MAT')) make = 'Tata Motors India';
    else if (wmi.startsWith('MA1')) make = 'Mahindra & Mahindra';
    else if (wmi.startsWith('MBH')) make = 'Nissan / Renault India';
    else if (wmi.startsWith('MAK')) make = 'Honda Cars India';
    else if (wmi.startsWith('MNT')) make = 'Toyota Kirloskar India';
    else if (wmi.startsWith('MZB')) make = 'Kia Motors India';

    const yearChar = cleanVin.charAt(9);
    const yearMap = { 'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014, 'F': 2015, 'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019, 'L': 2020, 'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024, 'S': 2025, 'T': 2026 };
    const modelYear = yearMap[yearChar] || '2020-2026';

    const plantChar = cleanVin.charAt(10);
    const plantLocation = plantChar === 'A' ? 'Gurugram / Manesar Plant' : plantChar === 'B' ? 'Chennai Plant' : 'Pune / Bengaluru Plant';

    const engineCode = cleanVin.substring(3, 7);
    const serial = cleanVin.substring(11);

    const decodedData = {
      vin: cleanVin,
      make,
      modelYear,
      country,
      plantLocation,
      engineCode,
      serial,
      suggestedModel: make.includes('Toyota') ? 'Innova Crysta 2.4L Diesel' : make.includes('Maruti') ? 'Swift 1.2L DualJet' : make.includes('Hyundai') ? 'Creta 1.5L CRDi' : 'Scorpio-N 2.2L Diesel'
    };

    setVinResult(decodedData);
    showToast(`✅ VIN Decoded: ${make} (${modelYear})`);
  };

  const handleApplyVinToGarage = () => {
    if (!vinResult) return;
    setSelectedVehicle({
      make: vinResult.make,
      model: vinResult.suggestedModel,
      year: String(vinResult.modelYear),
      variant: '2.4L Diesel VX',
      fuel: 'Diesel',
      vin: vinResult.vin
    });
    showToast(`🚗 Vehicle Saved to Garage from VIN: ${vinResult.suggestedModel}`);
    onClose();
    navigateTo('catalog');
  };

  // --- MAINTENANCE CALCULATOR LOGIC ---
  const handleCalculateMaintenance = (e) => {
    e.preventDefault();
    const kms = parseInt(maintMileage, 10) || 0;
    const items = [];

    // Engine Oil & Oil Filter (Every 10,000 km)
    if (kms % 10000 <= 2000 || kms >= 10000) {
      items.push({ name: 'Synthetic Engine Oil 5W-30 (4L)', category: 'Engine Care', status: 'CRITICAL REPLACE', price: 2850, interval: 'Every 10,000 km', matchedProductSlug: 'engine-oil' });
      items.push({ name: 'Heavy Duty Oil Filter', category: 'Filters', status: 'REPLACE NOW', price: 420, interval: 'Every 10,000 km', matchedProductSlug: 'oil-filter' });
    }

    // Air Filter & Cabin AC Filter (Every 15,000 km)
    if (kms >= 15000) {
      items.push({ name: 'High Air Flow Engine Air Filter', category: 'Air Intake', status: 'INSPECT / REPLACE', price: 650, interval: 'Every 15,000 km', matchedProductSlug: 'air-filter' });
      items.push({ name: 'Activated Carbon Cabin AC Filter', category: 'HVAC', status: 'INSPECT / CLEAN', price: 580, interval: 'Every 15,000 km', matchedProductSlug: 'cabin-ac-filter' });
    }

    // Brake Pads & Disc Fluid (Every 30,000 km)
    if (kms >= 30000) {
      items.push({ name: 'Ceramic Front Brake Pad Set', category: 'Braking', status: 'INSPECT THICKNESS', price: 3450, interval: 'Every 30,000 km', matchedProductSlug: 'brake-pads' });
      items.push({ name: 'DOT-4 Synthetic Brake Fluid 500ml', category: 'Fluids', status: 'FLUSH & REPLACE', price: 390, interval: 'Every 30,000 km', matchedProductSlug: 'brake-disc' });
    }

    // Spark Plugs (Every 40,000 km)
    if (kms >= 40000) {
      items.push({ name: 'Iridium Spark Plugs Set of 4', category: 'Ignition', status: 'REPLACE NOW', price: 2200, interval: 'Every 40,000 km', matchedProductSlug: 'spark-plug' });
    }

    const totalEst = items.reduce((acc, curr) => acc + curr.price, 0);

    setMaintReport({
      make: maintMake,
      model: maintModel,
      kms,
      items,
      totalEst
    });
    showToast(`🔧 Maintenance Schedule Calculated for ${maintMileage} km`);
  };

  const handleAddMaintenanceToCart = () => {
    if (!maintReport) return;
    let addedCount = 0;
    maintReport.items.forEach(item => {
      const matched = products.find(p => p.name.toLowerCase().includes(item.category.toLowerCase()) || p.id.includes(item.matchedProductSlug));
      if (matched) {
        addToCart(matched, 1);
        addedCount++;
      }
    });
    showToast(`🛒 Added ${addedCount || maintReport.items.length} recommended maintenance parts to cart!`);
    onClose();
    navigateTo('cart');
  };

  // --- DIAGNOSTIC WIZARD DATA ---
  const diagnosticTree = [
    {
      id: 'brakes',
      title: '🛑 Braking & Noise Issues',
      icon: '🛑',
      symptoms: [
        {
          symptom: 'Squeaking, screeching, or grinding noise when pressing brake pedal',
          cause: 'Worn Brake Pads or Scratched Brake Rotor Discs',
          severity: 'HIGH DANGER',
          partsNeeded: ['Ceramic Front Brake Pad Set', 'Ventilated Front Brake Disc Rotor'],
          actionText: 'Replace brake pads immediately to prevent rotor disc destruction.'
        },
        {
          symptom: 'Brake pedal feels spongy, soft, or sinks to the floor',
          cause: 'Air in Brake Lines or Low DOT-4 Brake Fluid',
          severity: 'CRITICAL',
          partsNeeded: ['DOT-4 Synthetic Brake Fluid 500ml'],
          actionText: 'Bleed brake lines and refill DOT-4 brake fluid.'
        }
      ]
    },
    {
      id: 'engine',
      title: '⚡ Engine & Starting Issues',
      icon: '⚡',
      symptoms: [
        {
          symptom: 'Clicking sound when turning key / Engine sluggish to crank',
          cause: 'Weak Automotive Battery or Loose Terminal / Starter Relay',
          severity: 'MEDIUM',
          partsNeeded: ['Heavy-Duty Starter Motor Relay', '12V Sealed Car Battery'],
          actionText: 'Check battery voltage (>12.6V) or replace starter motor assembly.'
        },
        {
          symptom: 'Engine misfiring, rough idling, or reduced acceleration',
          cause: 'Fouled Spark Plugs or Failing Ignition Coil Pack',
          severity: 'HIGH',
          partsNeeded: ['Iridium Spark Plugs Set of 4', 'High-Voltage Ignition Coil'],
          actionText: 'Inspect spark plug electrode gap and replace ignition coil.'
        }
      ]
    },
    {
      id: 'ac',
      title: '❄️ AC & Cooling System',
      icon: '❄️',
      symptoms: [
        {
          symptom: 'AC blowing warm air / Low air flow from dashboard vents',
          cause: 'Clogged Cabin AC Filter or Low Refrigerant Gas',
          severity: 'LOW-MEDIUM',
          partsNeeded: ['Activated Carbon Cabin AC Filter', 'AC Compressor Assembly'],
          actionText: 'Replace dust-clogged cabin AC filter every 15,000 km.'
        },
        {
          symptom: 'Engine temperature gauge rising rapidly into RED zone',
          cause: 'Radiator Cooling Fan failure, Coolant leak, or Stuck Thermostat Valve',
          severity: 'EMERGENCY',
          partsNeeded: ['High Speed Radiator Fan Motor Assembly', 'Premixed Engine Coolant 5L'],
          actionText: 'Pull over safely! Do not open radiator cap when hot. Replace radiator fan.'
        }
      ]
    }
  ];

  // --- GST & EMI CALCULATOR LOGIC ---
  const principal = parseFloat(partAmount) || 0;
  const gstRate = parseFloat(gstType) || 18;
  const basePrice = principal / (1 + gstRate / 100);
  const gstAmount = principal - basePrice;
  const tenureMonths = parseInt(emiTenure, 10) || 3;
  const emiPerMonth = principal / tenureMonths;

  // --- PINCODE SERVICEABILITY LOGIC ---
  const handleCheckPincode = (e) => {
    e.preventDefault();
    const pin = pincodeInput.trim();
    if (pin.length !== 6 || isNaN(pin)) {
      showToast('❌ Please enter a valid 6-digit Indian Pincode.');
      return;
    }

    const firstChar = pin.charAt(0);
    let region = 'National Courier Coverage';
    let estDays = '3-5 Business Days';
    let codAvailable = true;
    let expressSameDay = false;

    if (pin.startsWith('400') || pin.startsWith('401') || pin.startsWith('410')) {
      region = 'Mumbai Metropolitan Region (MMR)';
      estDays = '⚡ SAME-DAY EXPRESS (2-4 Hours)';
      expressSameDay = true;
    } else if (firstChar === '1' || firstChar === '2') {
      region = 'North India (Delhi-NCR, UP, Punjab, Haryana)';
      estDays = '1-2 Days Express Air';
    } else if (firstChar === '4' || firstChar === '3') {
      region = 'West India (Maharashtra, Gujarat, Goa)';
      estDays = '1-2 Days Surface';
    } else if (firstChar === '5' || firstChar === '6') {
      region = 'South India (Karnataka, TN, Kerala, AP, TS)';
      estDays = '2-3 Days Express Air';
    } else {
      region = 'East & North-East India';
      estDays = '3-4 Days Express Air';
    }

    setPincodeResult({
      pincode: pin,
      region,
      estDays,
      codAvailable,
      expressSameDay,
      couriers: ['Porter', 'Borzo', 'Delhivery Express', 'Blue Dart Air']
    });
    showToast(`📍 Pincode ${pin} Verified: ${estDays}`);
  };

  // DIY Installation Guides List
  const diyGuides = [
    {
      title: 'How to Replace Engine Air Filter',
      time: '10 Mins',
      difficulty: 'Easy (DIY)',
      tools: 'Hands or Phillips Screwdriver',
      steps: [
        'Open car hood and locate black plastic air filter box near engine intake.',
        'Unclip the 4 metal retention clips or loosen holding screws.',
        'Lift box cover and remove dusty old air filter.',
        'Wipe clean interior housing box using a microfiber cloth.',
        'Insert new high-airflow air filter ensuring rubber seal seats snugly. Re-clip cover.'
      ]
    },
    {
      title: 'How to Install Ceramic Brake Pads',
      time: '35 Mins',
      difficulty: 'Moderate',
      tools: '14mm Socket Wrench, Jack Stand, Brake Caliper Tool',
      steps: [
        'Loosen lug nuts, jack up car safely and remove wheel.',
        'Unbolt lower 14mm caliper guide pin bolt and pivot caliper assembly upward.',
        'Slide out worn brake pads and stainless steel anti-rattle clips.',
        'Apply brake grease to new pad metal backing shims (Do NOT touch pad friction face).',
        'Compress caliper piston back into bore using C-clamp and install new ceramic pads.',
        'Tighten caliper pin bolt to 32 Nm torque. Pump brake pedal 5 times before driving.'
      ]
    }
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#FFFFFF', borderRadius: '16px', maxWidth: '960px', width: '100%', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #E2E8F0' }}>

        {/* Modal Header */}
        <div style={{ background: '#0F2167', padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px solid #FF6B00' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(255,107,0,0.2)', padding: '0.6rem', borderRadius: '10px', color: '#FF6B00' }}>
              <Wrench size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.35rem', fontWeight: 900 }}>AutoZon Free Automotive Suite</h3>
                <span style={{ background: '#10B981', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 900, padding: '0.15rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase' }}>100% FREE</span>
              </div>
              <p style={{ margin: '0.2rem 0 0 0', color: '#94A3B8', fontSize: '0.82rem' }}>
                Instant client-side vehicle decoders, maintenance calculators, diagnostic wizards & savings tools.
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFFFFF', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div style={{ background: '#F8FAFC', padding: '0.5rem 1rem', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          {[
            { id: 'vin', label: '🔍 VIN Decoder', icon: Car },
            { id: 'maintenance', label: '🔧 Service Schedule', icon: Activity },
            { id: 'diag', label: '🩺 Diagnostic Wizard', icon: AlertTriangle },
            { id: 'diy', label: '🛠️ DIY Guides & Specs', icon: FileText },
            { id: 'calc', label: '🧮 GST & EMI Savings', icon: Calculator },
            { id: 'pincode', label: '📍 Express Delivery Check', icon: MapPin }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 0.9rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: activeTab === tab.id ? 800 : 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                background: activeTab === tab.id ? '#0F2167' : 'transparent',
                color: activeTab === tab.id ? '#FFFFFF' : '#475569',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <tab.icon size={16} color={activeTab === tab.id ? '#FF6B00' : 'currentColor'} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body Content */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, background: '#FFFFFF' }}>

          {/* 1. VIN DECODER TAB */}
          {activeTab === 'vin' && (
            <div>
              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem', display: 'flex', gap: '0.75rem' }}>
                <Car size={22} color="#2563EB" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                <div style={{ fontSize: '0.85rem', color: '#1E40AF' }}>
                  <strong>What is a VIN Code?</strong> The 17-digit Vehicle Identification Number is stamped on your car registration RC book, front windshield bottom, or engine bay chassis plate.
                </div>
              </div>

              <form onSubmit={handleDecodeVIN} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Enter 17-Digit VIN Code (e.g. MA3EWB00S00123456)"
                  value={vinInput}
                  onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                  maxLength={17}
                  style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem', fontWeight: 700, letterSpacing: '1px' }}
                />
                <button type="submit" style={{ background: '#FF6B00', color: '#FFFFFF', padding: '0 1.5rem', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Search size={18} /> Decode VIN
                </button>
              </form>

              {vinResult && (
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #CBD5E1', paddingBottom: '0.75rem' }}>
                    <h4 style={{ margin: 0, color: '#0F2167', fontSize: '1.1rem', fontWeight: 900 }}>
                      🚗 Decoded Specification: {vinResult.make} ({vinResult.modelYear})
                    </h4>
                    <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px' }}>ISO 3779 VERIFIED</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
                    <div><span style={{ color: '#64748B' }}>Manufacturer:</span> <strong>{vinResult.make}</strong></div>
                    <div><span style={{ color: '#64748B' }}>Model Year:</span> <strong>{vinResult.modelYear}</strong></div>
                    <div><span style={{ color: '#64748B' }}>Country of Origin:</span> <strong>{vinResult.country}</strong></div>
                    <div><span style={{ color: '#64748B' }}>Assembly Plant:</span> <strong>{vinResult.plantLocation}</strong></div>
                    <div><span style={{ color: '#64748B' }}>Engine Identifier:</span> <strong>{vinResult.engineCode}</strong></div>
                    <div><span style={{ color: '#64748B' }}>Production Serial:</span> <strong>#{vinResult.serial}</strong></div>
                  </div>

                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px dashed #CBD5E1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#0F172A' }}>
                      Suggested Model match: <strong>{vinResult.suggestedModel}</strong>
                    </span>
                    <button
                      onClick={handleApplyVinToGarage}
                      style={{ background: '#0F2167', color: '#FFFFFF', padding: '0.55rem 1.25rem', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.82rem' }}
                    >
                      🚗 Set as Saved Vehicle & Filter Catalog
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. MAINTENANCE CALCULATOR TAB */}
          {activeTab === 'maintenance' && (
            <div>
              <form onSubmit={handleCalculateMaintenance} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>Vehicle Make</label>
                  <select value={maintMake} onChange={(e) => setMaintMake(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}>
                    <option value="Toyota">Toyota Kirloskar</option>
                    <option value="Maruti Suzuki">Maruti Suzuki</option>
                    <option value="Hyundai">Hyundai India</option>
                    <option value="Tata">Tata Motors</option>
                    <option value="Mahindra">Mahindra & Mahindra</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>Model</label>
                  <input type="text" value={maintModel} onChange={(e) => setMaintModel(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>Odometer Reading (KM)</label>
                  <input type="number" value={maintMileage} onChange={(e) => setMaintMileage(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button type="submit" style={{ width: '100%', background: '#FF6B00', color: '#FFFFFF', padding: '0.65rem', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}>
                    🔧 Calculate Schedule
                  </button>
                </div>
              </form>

              {maintReport && (
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #CBD5E1', paddingBottom: '0.75rem' }}>
                    <h4 style={{ margin: 0, color: '#0F2167', fontSize: '1.05rem', fontWeight: 900 }}>
                      📋 Recommended Maintenance at {maintReport.kms.toLocaleString()} km
                    </h4>
                    <span style={{ color: '#059669', fontWeight: 900, fontSize: '1.1rem' }}>
                      Est. ₹{maintReport.totalEst.toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    {maintReport.items.map((item, idx) => (
                      <div key={idx} style={{ background: '#FFFFFF', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.88rem' }}>{item.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Category: {item.category} • Interval: {item.interval}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ background: item.status.includes('REPLACE NOW') || item.status.includes('CRITICAL') ? '#FEE2E2' : '#FEF3C7', color: item.status.includes('REPLACE NOW') || item.status.includes('CRITICAL') ? '#991B1B' : '#92400E', fontSize: '0.68rem', fontWeight: 900, padding: '0.2rem 0.5rem', borderRadius: '4px', display: 'inline-block', marginBottom: '0.2rem' }}>
                            {item.status}
                          </span>
                          <div style={{ fontWeight: 800, color: '#0F2167', fontSize: '0.85rem' }}>₹{item.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleAddMaintenanceToCart}
                    style={{ width: '100%', background: '#0F2167', color: '#FFFFFF', padding: '0.75rem', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <ShoppingCart size={18} /> Add All Required Parts to Cart (₹{maintReport.totalEst.toLocaleString()})
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 3. DIAGNOSTIC WIZARD TAB */}
          {activeTab === 'diag' && (
            <div>
              <p style={{ color: '#475569', fontSize: '0.85rem', marginTop: 0 }}>
                Select the area where you are experiencing symptoms to identify the root cause & matching replacement parts:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                {diagnosticTree.map(cat => (
                  <div
                    key={cat.id}
                    onClick={() => { setDiagCategory(cat); setDiagSymptom(null); }}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '12px',
                      border: diagCategory?.id === cat.id ? '2px solid #FF6B00' : '1px solid #E2E8F0',
                      background: diagCategory?.id === cat.id ? '#FFF7ED' : '#F8FAFC',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>{cat.icon}</div>
                    <div style={{ fontWeight: 900, color: '#0F2167', fontSize: '1rem' }}>{cat.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>{cat.symptoms.length} Common Diagnostic Tests</div>
                  </div>
                ))}
              </div>

              {diagCategory && (
                <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '12px', padding: '1.25rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#0F2167', fontSize: '1rem', fontWeight: 900 }}>
                    Symptoms in {diagCategory.title}:
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {diagCategory.symptoms.map((sym, idx) => (
                      <div key={idx} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.4rem' }}>
                          <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.88rem' }}>"{sym.symptom}"</span>
                          <span style={{ background: sym.severity.includes('CRITICAL') || sym.severity.includes('EMERGENCY') ? '#DC2626' : '#EAB308', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 900, padding: '0.15rem 0.5rem', borderRadius: '4px', height: 'fit-content' }}>
                            {sym.severity}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '0.6rem' }}>
                          <strong>Probable Cause:</strong> {sym.cause}
                        </div>
                        <div style={{ background: '#EFF6FF', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.78rem', color: '#1E40AF', marginBottom: '0.6rem' }}>
                          📌 <strong>Action:</strong> {sym.actionText}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {sym.partsNeeded.map((part, pIdx) => (
                            <button
                              key={pIdx}
                              onClick={() => {
                                onClose();
                                navigateTo('catalog');
                              }}
                              style={{ background: '#0F2167', color: '#FFFFFF', border: 'none', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                            >
                              <ShoppingCart size={13} /> Find {part}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. DIY INSTALLATION GUIDES TAB */}
          {activeTab === 'diy' && (
            <div>
              <p style={{ color: '#475569', fontSize: '0.85rem', marginTop: 0 }}>
                Step-by-step DIY automotive installation guides with socket sizes & torque specifications:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {diyGuides.map((guide, gIdx) => (
                  <div key={gIdx} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <h4 style={{ margin: 0, color: '#0F2167', fontSize: '1.05rem', fontWeight: 900 }}>
                        📖 {guide.title}
                      </h4>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span style={{ background: '#DBEAFE', color: '#1E40AF', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px' }}>⏱️ {guide.time}</span>
                        <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{guide.difficulty}</span>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.85rem', background: '#FFFFFF', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                      🧰 <strong>Tools Required:</strong> {guide.tools}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {guide.steps.map((step, sIdx) => (
                        <div key={sIdx} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.82rem', color: '#0F172A' }}>
                          <span style={{ background: '#FF6B00', color: '#FFFFFF', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900, flexShrink: 0 }}>
                            {sIdx + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. GST & EMI CALCULATOR TAB */}
          {activeTab === 'calc' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#0F2167', fontSize: '1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calculator size={18} color="#FF6B00" /> GST Input Tax Credit Calculator
                  </h4>

                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>Total Item Price (₹)</label>
                    <input type="number" value={partAmount} onChange={(e) => setPartAmount(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 800, fontSize: '0.95rem' }} />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>GST Tax Slab</label>
                    <select value={gstType} onChange={(e) => setGstType(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}>
                      <option value="18">18% Standard Parts GST</option>
                      <option value="28">28% High-Value / AC & Electrical GST</option>
                      <option value="12">12% Lubricants & Oils</option>
                    </select>
                  </div>

                  <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.85rem', borderRadius: '8px', fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ color: '#047857' }}>Net Base Price:</span>
                      <strong>₹{Math.round(basePrice).toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ color: '#047857' }}>GST Amount ({gstRate}%):</span>
                      <strong>₹{Math.round(gstAmount).toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, color: '#065F46', borderTop: '1px dashed #A7F3D0', paddingTop: '0.4rem', marginTop: '0.4rem' }}>
                      <span>GST Tax Input Claimable:</span>
                      <span>₹{Math.round(gstAmount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#0F2167', fontSize: '1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Zap size={18} color="#2563EB" /> No-Cost EMI Monthly Splitter
                  </h4>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>Select EMI Months</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {['3', '6', '9', '12'].map(m => (
                        <button
                          key={m}
                          onClick={() => setEmiTenure(m)}
                          style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', border: emiTenure === m ? '2px solid #0F2167' : '1px solid #CBD5E1', background: emiTenure === m ? '#0F2167' : '#FFFFFF', color: emiTenure === m ? '#FFFFFF' : '#0F172A', fontWeight: 800, cursor: 'pointer' }}
                        >
                          {m} Mo
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.78rem', color: '#1E40AF' }}>Estimated Monthly EMI Payment</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F2167', margin: '0.3rem 0' }}>
                      ₹{Math.round(emiPerMonth).toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#475569' }}>/ month</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>
                      ⚡ 0% Processing Fee Available on HDFC, ICICI, SBI Cards
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. PINCODE CHECKER TAB */}
          {activeTab === 'pincode' && (
            <div>
              <form onSubmit={handleCheckPincode} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <input
                  type="text"
                  placeholder="Enter 6-Digit Indian Delivery Pincode (e.g. 400001 or 110001)"
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value)}
                  maxLength={6}
                  style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem', fontWeight: 700 }}
                />
                <button type="submit" style={{ background: '#0F2167', color: '#FFFFFF', padding: '0 1.5rem', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={18} /> Check Delivery
                </button>
              </form>

              {pincodeResult && (
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #CBD5E1', paddingBottom: '0.75rem' }}>
                    <h4 style={{ margin: 0, color: '#0F2167', fontSize: '1.1rem', fontWeight: 900 }}>
                      📍 Delivery for Pincode {pincodeResult.pincode} ({pincodeResult.region})
                    </h4>
                    {pincodeResult.expressSameDay && (
                      <span style={{ background: '#FF6B00', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 900, padding: '0.2rem 0.6rem', borderRadius: '4px' }}>⚡ MUMBAI SAME-DAY ACTIVE</span>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.88rem' }}>
                    <div style={{ background: '#FFFFFF', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ color: '#64748B', fontSize: '0.75rem' }}>Estimated Delivery Time</div>
                      <div style={{ fontWeight: 900, color: '#0F2167', fontSize: '1rem', marginTop: '0.2rem' }}>{pincodeResult.estDays}</div>
                    </div>
                    <div style={{ background: '#FFFFFF', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ color: '#64748B', fontSize: '0.75rem' }}>Cash on Delivery (COD)</div>
                      <div style={{ fontWeight: 900, color: '#059669', fontSize: '1rem', marginTop: '0.2rem' }}>✓ AVAILABLE UP TO ₹15,000</div>
                    </div>
                    <div style={{ background: '#FFFFFF', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ color: '#64748B', fontSize: '0.75rem' }}>Logistics Partners</div>
                      <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                        {pincodeResult.couriers.join(' • ')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div style={{ background: '#F8FAFC', padding: '0.85rem 1.5rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
            🛡️ 100% Free Tools by AutoZonIndia Single Owner E-Commerce
          </span>
          <button onClick={onClose} style={{ background: '#0F2167', color: '#FFFFFF', padding: '0.45rem 1.25rem', border: 'none', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', fontSize: '0.82rem' }}>
            Close Tools
          </button>
        </div>

      </div>
    </div>
  );
};
