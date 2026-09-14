// Comprehensive Automotive Mock Datasets for AutoZonIndia

export const VEHICLE_DATABASE = [
  {
    id: 'maruti',
    name: 'Maruti Suzuki',
    country: 'India / Japan',
    logo: '🚗',
    models: [
      {
        id: 'swift',
        name: 'Swift',
        years: ['2020-2024', '2018-2020', '2014-2017', '2010-2013'],
        variants: [
          { id: 'swift-zxi-plus', name: 'ZXi Plus (1.2L K12N DualJet Petrol)', engine: '1197 cc Petrol', transmission: '5-Speed MT / AMT' },
          { id: 'swift-vxi', name: 'VXi (1.2L DualJet Petrol)', engine: '1197 cc Petrol', transmission: '5-Speed MT' },
          { id: 'swift-ddis', name: 'ZDi (1.3L DDiS Turbo Diesel)', engine: '1248 cc Diesel', transmission: '5-Speed MT' }
        ]
      },
      {
        id: 'baleno',
        name: 'Baleno',
        years: ['2022-2024', '2015-2021'],
        variants: [
          { id: 'baleno-alpha', name: 'Alpha (1.2L K12N Petrol)', engine: '1197 cc Petrol', transmission: '5-Speed MT / AMT' },
          { id: 'baleno-zeta', name: 'Zeta (1.2L DualJet)', engine: '1197 cc Petrol', transmission: '5-Speed MT' }
        ]
      },
      {
        id: 'brezza',
        name: 'Brezza / Vitara Brezza',
        years: ['2022-2024', '2016-2021'],
        variants: [
          { id: 'brezza-zxi', name: 'ZXi+ (1.5L K15C Smart Hybrid Petrol)', engine: '1462 cc Petrol', transmission: '6-Speed AT / 5-Speed MT' },
          { id: 'brezza-ddis', name: 'ZDi+ (1.3L DDiS Diesel)', engine: '1248 cc Diesel', transmission: '5-Speed MT' }
        ]
      },
      {
        id: 'dzire',
        name: 'Dzire',
        years: ['2017-2024', '2012-2016'],
        variants: [
          { id: 'dzire-zxi', name: 'ZXi (1.2L K-Series Petrol)', engine: '1197 cc Petrol', transmission: '5-Speed MT' }
        ]
      }
    ]
  },
  {
    id: 'hyundai',
    name: 'Hyundai Motors',
    country: 'South Korea',
    logo: '🚘',
    models: [
      {
        id: 'creta',
        name: 'Creta',
        years: ['2020-2024', '2015-2019'],
        variants: [
          { id: 'creta-sx-d', name: 'SX(O) 1.5L CRDi Diesel', engine: '1493 cc Diesel', transmission: '6-Speed Automatic / MT' },
          { id: 'creta-sx-p', name: 'SX 1.5L MPi Petrol', engine: '1497 cc Petrol', transmission: '6-Speed MT / IVT' },
          { id: 'creta-turbo', name: '1.4L Turbo GDi Petrol', engine: '1353 cc Turbo Petrol', transmission: '7-Speed DCT' }
        ]
      },
      {
        id: 'i20',
        name: 'i20 / Elite i20',
        years: ['2020-2024', '2014-2019'],
        variants: [
          { id: 'i20-asta', name: 'Asta(O) 1.2L Kappa Petrol', engine: '1197 cc Petrol', transmission: '5-Speed MT' }
        ]
      },
      {
        id: 'venue',
        name: 'Venue',
        years: ['2019-2024'],
        variants: [
          { id: 'venue-sx', name: 'SX 1.0L Turbo GDi Petrol', engine: '998 cc Turbo Petrol', transmission: '6-Speed iMT / DCT' }
        ]
      }
    ]
  },
  {
    id: 'tata',
    name: 'Tata Motors',
    country: 'India',
    logo: '🏎️',
    models: [
      {
        id: 'nexon',
        name: 'Nexon',
        years: ['2023-2024', '2017-2022'],
        variants: [
          { id: 'nexon-xz-p', name: 'Fearless 1.2L Revotron Turbo Petrol', engine: '1199 cc Turbo Petrol', transmission: '6-Speed MT / DCA' },
          { id: 'nexon-xz-d', name: 'Creative 1.5L Revotorq Diesel', engine: '1497 cc Turbo Diesel', transmission: '6-Speed MT / AMT' }
        ]
      },
      {
        id: 'punch',
        name: 'Punch',
        years: ['2021-2024'],
        variants: [
          { id: 'punch-creative', name: 'Creative Flagship 1.2L Revotron', engine: '1199 cc Petrol', transmission: '5-Speed MT' }
        ]
      },
      {
        id: 'harrier',
        name: 'Harrier',
        years: ['2019-2024'],
        variants: [
          { id: 'harrier-xz', name: 'Fearless+ 2.0L Kryotec Turbo Diesel', engine: '1956 cc Diesel', transmission: '6-Speed AT' }
        ]
      }
    ]
  },
  {
    id: 'mahindra',
    name: 'Mahindra & Mahindra',
    country: 'India',
    logo: '🚙',
    models: [
      {
        id: 'thar',
        name: 'Thar / Thar Roxx',
        years: ['2020-2024'],
        variants: [
          { id: 'thar-lx-d', name: 'LX 2.2L mHawk Diesel 4x4', engine: '2184 cc Turbo Diesel', transmission: '6-Speed AT / MT' },
          { id: 'thar-lx-p', name: 'LX 2.0L mStallion Petrol 4x4', engine: '1997 cc Turbo Petrol', transmission: '6-Speed AT' }
        ]
      },
      {
        id: 'xuv700',
        name: 'XUV700',
        years: ['2021-2024'],
        variants: [
          { id: 'xuv700-ax7', name: 'AX7 Luxury Pack 2.2L mHawk Diesel AWD', engine: '2184 cc Diesel', transmission: '6-Speed AT' }
        ]
      },
      {
        id: 'scorpio',
        name: 'Scorpio Classic / Scorpio-N',
        years: ['2022-2024', '2014-2021'],
        variants: [
          { id: 'scorpio-z8', name: 'Z8L 2.2L mHawk Diesel 4WD', engine: '2184 cc Diesel', transmission: '6-Speed AT' }
        ]
      }
    ]
  },
  {
    id: 'honda',
    name: 'Honda Cars',
    country: 'Japan',
    logo: '🚘',
    models: [
      {
        id: 'city',
        name: 'City 5th Gen / 4th Gen',
        years: ['2020-2024', '2014-2019'],
        variants: [
          { id: 'city-zx-p', name: 'ZX 1.5L i-VTEC Petrol', engine: '1498 cc Petrol', transmission: 'CVT / 6-Speed MT' }
        ]
      }
    ]
  }
];

// Sample VIN database for VIN Search
export const SAMPLE_VIN_DATABASE = {
  'MA3FDB11S00123456': { makeId: 'maruti', makeName: 'Maruti Suzuki', modelId: 'swift', modelName: 'Swift', year: '2020-2024', variant: 'ZXi Plus (1.2L K12N DualJet Petrol)' },
  'MALC511CDMB789012': { makeId: 'hyundai', makeName: 'Hyundai Motors', modelId: 'creta', modelName: 'Creta', year: '2020-2024', variant: 'SX(O) 1.5L CRDi Diesel' },
  'MAT612345NEX56789': { makeId: 'tata', makeName: 'Tata Motors', modelId: 'nexon', modelName: 'Nexon', year: '2023-2024', variant: 'Fearless 1.2L Revotron Turbo Petrol' }
};

// Sample Indian Registration Number database
export const SAMPLE_REGISTRATION_DATABASE = {
  'DL01AB1234': { makeId: 'maruti', makeName: 'Maruti Suzuki', modelId: 'swift', modelName: 'Swift', year: '2020-2024', variant: 'ZXi Plus (1.2L K12N DualJet Petrol)', owner: 'Rahul Sharma', city: 'Delhi NCR' },
  'MH02CB5678': { makeId: 'hyundai', makeName: 'Hyundai Motors', modelId: 'creta', modelName: 'Creta', year: '2020-2024', variant: 'SX(O) 1.5L CRDi Diesel', owner: 'Priya Verma', city: 'Mumbai' },
  'KA03MN9012': { makeId: 'tata', makeName: 'Tata Motors', modelId: 'nexon', modelName: 'Nexon', year: '2023-2024', variant: 'Fearless 1.2L Revotron Turbo Petrol', owner: 'Arjun Nair', city: 'Bengaluru' }
};

export const CATEGORIES_DATABASE = [
  { id: 'engine_parts', name: 'Engine Parts', icon: '⚙️', subcategories: ['Gaskets', 'Timing Belts', 'Pistons', 'Valves', 'Spark Plugs', 'Fuel Injectors', 'Clutch Plates'] },
  { id: 'braking_system', name: 'Braking System', icon: '🛑', subcategories: ['Brake Pads', 'Brake Discs & Rotors', 'Brake Drums', 'Brake Shoes', 'Brake Fluid', 'Brake Calipers'] },
  { id: 'suspension_steering', name: 'Suspension & Steering', icon: '🔩', subcategories: ['Shock Absorbers', 'Struts', 'Control Arms', 'Ball Joints', 'Tie Rod Ends', 'Steering Racks'] },
  { id: 'filters_oils', name: 'Filters & Oils', icon: '🛢️', subcategories: ['Engine Oil', 'Air Filters', 'Oil Filters', 'Cabin AC Filters', 'Fuel Filters', 'Transmission Fluid', 'Coolant'] },
  { id: 'lighting_electrical', name: 'Lighting & Electrical', icon: '💡', subcategories: ['Headlight Assemblies', 'Tail Lights', 'LED Bulbs', 'Car Batteries', 'Alternators', 'Starters', 'Horns', 'Fuses & Relays'] },
  { id: 'interior_exterior_accessories', name: 'Interior & Exterior Accessories', icon: '📱', subcategories: ['7D Floor Mats', 'Seat Covers', 'Mobile Holders', 'Dash Cameras', 'Body Covers', 'Wiper Blades', 'Roof Racks'] }
];

export const BRANDS_DATABASE = [
  { id: 'bosch', name: 'BOSCH', type: 'OEM Supplier', logo: '⚡', country: 'Germany', category: 'Spark Plugs, Brake Pads, Filters' },
  { id: 'castrol', name: 'Castrol', type: 'OES Lubricants', logo: '🛢️', country: 'UK', category: 'Engine Oil, Brake Oil' },
  { id: 'uno_minda', name: 'UNO MINDA', type: 'OEM Supplier', logo: '💡', country: 'India', category: 'Lighting, Horns, Switches' },
  { id: 'tvs_lucas', name: 'TVS Lucas', type: 'OEM Mechanical', logo: '⚙️', country: 'India', category: 'Starters, Alternators, Brakes' },
  { id: 'gabriel', name: 'Gabriel India', type: 'OEM Suspension', logo: '🔩', country: 'India', category: 'Shock Absorbers, Struts' },
  { id: 'elofic', name: 'Elofic', type: 'OEM Filtration', logo: '🌀', country: 'India', category: 'Air Filters, Oil Filters' },
  { id: 'shell', name: 'Shell Helix', type: 'OES Lubricants', logo: '⛽', country: 'Netherlands', category: 'Synthetic Motor Oils' },
  { id: 'motul', name: 'Motul', type: 'Aftermarket Fluids', logo: '🏎️', country: 'France', category: 'Heavy Duty Oils, Gear Oils' },
  { id: 'exide', name: 'Exide Batteries', type: 'OEM Electrical', logo: '🔋', country: 'India', category: 'Car Batteries' }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'AZ-PROD-001',
    title: 'AutoZon Pro Ultra-Grip 360° Dashboard Car Mobile Holder',
    category: 'interiors',
    subCategory: 'Mobile Holders',
    brand: 'AutoZon Originals',
    partNumber: 'AZ-MH-360PRO',
    oemNumber: 'UNIVERSAL-MH-01',
    sku: 'AZ-ACC-MH01',
    mrp: 1299,
    price: 699,
    discountPercent: 46,
    gstPercent: 18,
    stock: 45,
    classification: 'Aftermarket', // OEM, OES, Aftermarket
    isUniversal: true,
    compatibleVehicles: ['maruti-swift', 'maruti-baleno', 'hyundai-creta', 'tata-nexon', 'mahindra-thar', 'honda-city'],
    rating: 4.8,
    reviewsCount: 342,
    warranty: '1 Year Replacement Warranty',
    seller: 'AutoZon Direct',
    weight: '250 grams',
    dimensions: '12 x 8 x 6 cm',
    deliveryDays: '2-3 Business Days',
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80',
    description: '360° Rotating magnetic & vacuum suction car mobile mount. Heavy-duty lock mechanism designed for Indian road vibrations.',
    specifications: {
      'Mounting Type': 'Suction Cup & Air Vent',
      'Material': 'ABS Polycarbonate & Heat-Resistant Silicone',
      'Phone Compatibility': '4.0 to 7.0 Inch Smartphones',
      'Rotation': '360 Degree Telescopic Arm'
    }
  },
  {
    id: 'AZ-PROD-002',
    title: 'BOSCH Genuine OE Clutch Assembly Kit (Pressure Plate + Friction Disc)',
    category: 'clutch_transmission',
    subCategory: 'Clutch Plates',
    brand: 'BOSCH',
    partNumber: 'BOSCH-CK-22019',
    oemNumber: '22100-M74L00',
    sku: 'BSH-CLT-SWF12',
    mrp: 4899,
    price: 3450,
    discountPercent: 30,
    gstPercent: 18,
    stock: 18,
    classification: 'OEM',
    isUniversal: false,
    compatibleVehicles: ['maruti-swift', 'maruti-dzire', 'maruti-baleno'],
    rating: 4.9,
    reviewsCount: 189,
    warranty: '6 Months / 10,000 KM Warranty',
    seller: 'Bosch Automotive Official Store',
    weight: '4.2 kg',
    dimensions: '28 x 28 x 8 cm',
    deliveryDays: '2 Business Days',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80',
    description: 'Original Equipment Bosch Clutch Assembly for smooth pedal operation, high thermal endurance, and anti-shudder performance.',
    specifications: {
      'Components Included': 'Clutch Friction Disc, Pressure Plate & Release Bearing',
      'Material': 'Heavy-duty organic friction material',
      'Diameter': '200 mm',
      'Spline Count': '18 Teeth'
    }
  },
  {
    id: 'AZ-PROD-003',
    title: 'Castrol Brake Fluid DOT 4 Synthetic Heavy-Duty Hydraulic Oil (500ml)',
    category: 'brakes',
    subCategory: 'Brake Fluid',
    brand: 'Castrol',
    partNumber: 'CAS-BF-DOT4-500',
    oemNumber: 'DOT4-HYD-500',
    sku: 'CST-FL-DOT4',
    mrp: 550,
    price: 385,
    discountPercent: 30,
    gstPercent: 18,
    stock: 120,
    classification: 'OES',
    isUniversal: true,
    compatibleVehicles: ['maruti-swift', 'hyundai-creta', 'tata-nexon', 'mahindra-thar', 'honda-city'],
    rating: 4.9,
    reviewsCount: 512,
    warranty: 'Sealed Bottle Guarantee',
    seller: 'Castrol Lubricants India',
    weight: '550 grams',
    dimensions: '8 x 8 x 20 cm',
    deliveryDays: '1-2 Days',
    image: 'https://images.unsplash.com/photo-1620987278429-ab178d6eb547?w=600&auto=format&fit=crop&q=80',
    description: 'High boiling point synthetic hydraulic brake fluid for disc and drum brake systems preventing vapor lock under high thermal stress.',
    specifications: {
      'Specification Standard': 'FMVSS 116 DOT 4 / SAE J1704',
      'Dry Boiling Point': '> 260°C',
      'Wet Boiling Point': '> 165°C',
      'Volume': '500 ml'
    }
  },
  {
    id: 'AZ-PROD-004',
    title: 'Motul 8100 X-cess 5W-40 Fully Synthetic Engine Oil (4L)',
    category: 'engine',
    subCategory: 'Engine Oil',
    brand: 'Motul',
    partNumber: 'MOTUL-5W40-4L',
    oemNumber: 'API-SN-5W40',
    sku: 'MTL-OIL-5W40-4',
    mrp: 4200,
    price: 3290,
    discountPercent: 22,
    gstPercent: 18,
    stock: 35,
    classification: 'OES',
    isUniversal: false,
    compatibleVehicles: ['maruti-swift', 'hyundai-creta', 'tata-nexon', 'honda-city'],
    rating: 4.9,
    reviewsCount: 290,
    warranty: '100% Authentic Motul Hologram',
    seller: 'Performance Auto Oils',
    weight: '3.8 kg',
    dimensions: '25 x 15 x 30 cm',
    deliveryDays: '2 Business Days',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&auto=format&fit=crop&q=80',
    description: '100% Synthetic engine lubricant engineered for powerful modern petrol and diesel engines requiring API SN / CF standards.',
    specifications: {
      'Viscosity Grade': 'SAE 5W-40',
      'API Standards': 'API SN / CF',
      'ACEA Standards': 'ACEA A3 / B4',
      'Volume': '4 Litres'
    }
  },
  {
    id: 'AZ-PROD-005',
    title: 'AutoZon 7D Luxury All-Weather Custom Fit Car Floor Mats (Set of 5)',
    category: 'interiors',
    subCategory: 'Floor Mats (7D/3D)',
    brand: 'AutoZon Originals',
    partNumber: 'AZ-7D-MAT-BLK',
    oemNumber: 'MAT-7D-CUSTOM',
    sku: 'AZ-INT-7DMAT',
    mrp: 4999,
    price: 2499,
    discountPercent: 50,
    gstPercent: 18,
    stock: 25,
    classification: 'Aftermarket',
    isUniversal: false,
    compatibleVehicles: ['maruti-swift', 'hyundai-creta', 'tata-nexon', 'mahindra-thar', 'maruti-baleno'],
    rating: 4.7,
    reviewsCount: 164,
    warranty: '1 Year Stitching & Material Warranty',
    seller: 'AutoZon Comfort Tech',
    weight: '3.5 kg',
    dimensions: '60 x 50 x 20 cm',
    deliveryDays: '3 Business Days',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80',
    description: 'Custom molded 7D floor mats with detachable curly grass layer. Waterproof, anti-skid velcro backing, easy to wash.',
    specifications: {
      'Material': 'PU Leather + Detachable Polypropylene Curly Mat',
      'Pieces': 'Set of 5 (Front + Rear)',
      'Waterproof': 'Yes (100% Washable)',
      'Driver Heel Pad': 'Reinforced Stainless Steel Pad'
    }
  },
  {
    id: 'AZ-PROD-006',
    title: 'Bosch Low-Metallic Heavy Duty Front Disc Brake Pad Set',
    category: 'brakes',
    subCategory: 'Brake Pads',
    brand: 'BOSCH',
    partNumber: 'BOSCH-BP-0986',
    oemNumber: '55810-M74L00',
    sku: 'BSH-BRK-BP09',
    mrp: 1850,
    price: 1290,
    discountPercent: 30,
    gstPercent: 18,
    stock: 60,
    classification: 'OEM',
    isUniversal: false,
    compatibleVehicles: ['maruti-swift', 'maruti-baleno', 'maruti-dzire'],
    rating: 4.8,
    reviewsCount: 220,
    warranty: '6 Months Warranty',
    weight: '1.2 kg',
    dimensions: '15 x 10 x 8 cm',
    deliveryDays: '2 Business Days',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=80',
    description: 'High performance ceramic brake pads offering superior stopping power, lower dust, and fade resistance under extreme temperatures. Direct OEM replacement for select models.',
    classification: 'OEM ORIGINAL',
    condition: 'New',
    other_sellers: [
      { id: 's_01', name: 'Delhi Auto Parts', rating: 4.5, price: 3500, condition: 'New' },
      { id: 's_02', name: 'Suraj Spares (Refurbished)', rating: 4.8, price: 2100, condition: 'Refurbished' },
      { id: 's_03', name: 'ScrapYard India', rating: 4.1, price: 950, condition: 'Used - Good' }
    ],
    seller: {
      name: 'AutoZonIndia Official',
      rating: '4.9',
      location: 'New Delhi Warehouse'
    },
    specifications: {
      'Friction Material': 'Low-Metallic Asbestos Free',
      'Noise Damping': 'Multi-layer rubber core shims',
      'Position': 'Front Axle Left & Right',
      'Wear Indicator': 'Acoustic Wear Sensor'
    }
  },
  {
    id: 'AZ-PROD-007',
    title: 'AutoZon 4K Ultra HD Dual Dash Camera with Built-in GPS & Night Vision',
    category: 'electronics',
    subCategory: 'Dash Cameras',
    brand: 'AutoZon Originals',
    partNumber: 'AZ-DC-4KGPS',
    oemNumber: 'DASH-CAM-4K',
    sku: 'AZ-ELC-DC4K',
    mrp: 9999,
    price: 5999,
    discountPercent: 40,
    gstPercent: 18,
    stock: 14,
    classification: 'Aftermarket',
    isUniversal: true,
    compatibleVehicles: ['maruti-swift', 'hyundai-creta', 'tata-nexon', 'mahindra-thar', 'honda-city'],
    rating: 4.9,
    reviewsCount: 145,
    warranty: '1 Year Replacement Warranty',
    seller: 'AutoZon Electronics',
    weight: '450 grams',
    dimensions: '10 x 5 x 4 cm',
    deliveryDays: '2-3 Business Days',
    image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&auto=format&fit=crop&q=80',
    description: 'Dual channel front 4K + rear 1080P video recording dash camera with Sony STARVIS sensor and mobile app control.',
    specifications: {
      'Resolution': 'Front 4K (2160P) + Rear 1080P',
      'Sensor': 'Sony STARVIS IMX335',
      'Connectivity': 'Built-in Wi-Fi & GPS Module',
      'Parking Guard': '24-Hour G-Sensor Collision Lock'
    }
  },
  {
    id: 'AZ-PROD-008',
    title: 'Uno Minda OEM High-Tone Dual Trumpet Electric Horn Set (12V)',
    category: 'electrical',
    subCategory: 'Horns',
    brand: 'UNO MINDA',
    partNumber: 'MINDA-HN-DTH12',
    oemNumber: 'HN-12V-DUAL',
    sku: 'MND-ELC-HN12',
    mrp: 1250,
    price: 849,
    discountPercent: 32,
    gstPercent: 18,
    stock: 50,
    classification: 'OEM',
    isUniversal: true,
    compatibleVehicles: ['maruti-swift', 'hyundai-creta', 'tata-nexon', 'mahindra-thar', 'honda-city'],
    rating: 4.8,
    reviewsCount: 310,
    warranty: '1 Year Manufacturer Warranty',
    seller: 'Uno Minda Spare Hub',
    weight: '750 grams',
    dimensions: '18 x 12 x 8 cm',
    deliveryDays: '2 Business Days',
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600&auto=format&fit=crop&q=80',
    description: 'Factory grade twin acoustic trumpet horn system producing a crisp 110dB signal for highway driving safety.',
    specifications: {
      'Sound Pressure': '110 dB (A)',
      'Frequency': 'High Tone 500Hz / Low Tone 400Hz',
      'Voltage': '12 Volts',
      'Water Resistance': 'IP54 Diaphragm Casing'
    }
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'o801a1e2-1001-4000-8000-000000000001',
    customer_id: 'c801a1e2-1001-4000-8000-000000000001',
    order_number: 'AZ-ORD-98421',
    subtotal: 4220,
    discount: 0,
    tax: 760,
    shipping_charge: 0,
    total_amount: 4220,
    status: 'Shipped', // Pending, Confirmed, Packed, Shipped, Delivered, Cancelled
    payment_status: 'Paid',
    shipping_status: 'In Transit',
    created_at: '2026-08-24T10:30:00.000Z',
    // UI Aliases
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul.sharma@example.com',
    customerPhone: '+91 9876543210',
    shippingAddress: 'Flat 402, Green Park Apartments, Connaught Place, New Delhi - 110001',
    date: '2026-08-24',
    orderStatus: 'Shipped',
    paymentMethod: 'UPI (Google Pay)',
    items: [
      {
        id: 'i801a1e2-1001-4000-8000-000000000001',
        order_id: 'o801a1e2-1001-4000-8000-000000000001',
        product_id: 'AZ-PROD-002',
        product_name: 'BOSCH Genuine OE Clutch Assembly Kit',
        quantity: 1,
        unit_price: 3450,
        total_price: 3450,
        // UI Aliases
        title: 'BOSCH Genuine OE Clutch Assembly Kit',
        price: 3450
      },
      {
        id: 'i801a1e2-1001-4000-8000-000000000002',
        order_id: 'o801a1e2-1001-4000-8000-000000000001',
        product_id: 'AZ-PROD-003',
        product_name: 'Castrol Brake Fluid DOT 4 (500ml)',
        quantity: 2,
        unit_price: 385,
        total_price: 770,
        // UI Aliases
        title: 'Castrol Brake Fluid DOT 4 (500ml)',
        price: 385
      }
    ],
    gstAmount: 760,
    shippingFee: 0,
    totalAmount: 4220,
    trackingNumber: 'BLUEDART-88291039',
    expectedDelivery: '2026-08-26'
  },
  {
    id: 'o801a1e2-1001-4000-8000-000000000002',
    customer_id: 'c801a1e2-1001-4000-8000-000000000003',
    order_number: 'AZ-ORD-98422',
    subtotal: 3870,
    discount: 0,
    tax: 696,
    shipping_charge: 0,
    total_amount: 3870,
    status: 'Confirmed',
    payment_status: 'Pending',
    shipping_status: 'Pending Dispatch',
    created_at: '2026-08-24T14:15:00.000Z',
    // UI Aliases
    customerName: 'Vikram Singh (Guru Auto Garage)',
    customerEmail: 'guruauto@example.com',
    customerPhone: '+91 9811223344',
    shippingAddress: 'Plot 12, Industrial Area Phase 2, Okhla, New Delhi - 110020',
    date: '2026-08-24',
    orderStatus: 'Confirmed',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    items: [
      {
        id: 'i801a1e2-1001-4000-8000-000000000003',
        order_id: 'o801a1e2-1001-4000-8000-000000000002',
        product_id: 'AZ-PROD-006',
        product_name: 'Bosch Low-Metallic Front Disc Brake Pad Set',
        quantity: 3,
        unit_price: 1290,
        total_price: 3870,
        // UI Aliases
        title: 'Bosch Low-Metallic Front Disc Brake Pad Set',
        price: 1290
      }
    ],
    gstAmount: 696,
    shippingFee: 0,
    totalAmount: 3870,
    trackingNumber: 'DELHIVERY-992014',
    expectedDelivery: '2026-08-25'
  }
];

export const INITIAL_BLOGS = [
  {
    id: 'blog-01',
    title: 'How to Choose the Right Engine Oil Viscosity (5W-30 vs 5W-40) for Indian Summers',
    author: 'Er. Rajesh Kumar (Senior Automotive Engineer)',
    date: '2026-08-20',
    category: 'Maintenance Guide',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&auto=format&fit=crop&q=80',
    content: 'Choosing the correct engine oil grade is critical for preventing cylinder scuffing during hot Indian summers. Learn the difference between 5W-30 and 5W-40 synthetic lubricants.'
  },
  {
    id: 'blog-02',
    title: '5 Warning Signs Your Car Clutch Plate Needs Immediate Replacement',
    author: 'AutoZon Technical Team',
    date: '2026-08-18',
    category: 'Troubleshooting',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80',
    content: 'Is your clutch pedal feeling soft or slipping on steep inclines? Here are 5 tell-tale symptoms that indicate it is time to replace your pressure plate and friction disc.'
  }
];

export const INITIAL_FAQS = [
  { q: 'How do I check if a spare part fits my car?', a: 'Use our Vehicle Selector tool at the top of the page to choose your Car Make, Model, and Year. All compatible products will display a green "Fits Your Vehicle" badge.' },
  { q: 'Are all parts listed on AutoZonIndia 100% Genuine?', a: 'Yes! We source directly from authorized OEM & OES manufacturers like BOSCH, Castrol, Uno Minda, TVS Lucas, and Gabriel.' },
  { q: 'What is your return and fitment exchange policy?', a: 'We offer a 7-Day Hassle-Free Return policy. If a part does not fit your vehicle, we provide free pickup and instant replacement.' }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'c801a1e2-1001-4000-8000-000000000001',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 9876543210',
    created_at: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'c801a1e2-1001-4000-8000-000000000002',
    name: 'Sagar Kamti',
    email: 'sagarkamti2008@gmail.com',
    phone: '+91 8591719499',
    created_at: '2026-01-15T09:30:00.000Z'
  },
  {
    id: 'c801a1e2-1001-4000-8000-000000000003',
    name: 'Vikram Singh',
    email: 'guruauto@example.com',
    phone: '+91 9811223344',
    created_at: '2026-07-20T14:15:00.000Z'
  },
  {
    id: 'c801a1e2-1001-4000-8000-000000000004',
    name: 'Anish Verma',
    email: 'anish.verma@example.com',
    phone: '+91 9765432109',
    created_at: '2026-08-12T11:45:00.000Z'
  },
  {
    id: 'c801a1e2-1001-4000-8000-000000000005',
    name: 'Pooja Patel',
    email: 'pooja.patel@example.com',
    phone: '+91 9822334455',
    created_at: '2026-08-22T16:20:00.000Z'
  }
];

export const INITIAL_ADDRESSES = [
  {
    id: 'a801a1e2-1001-4000-8000-000000000001',
    customer_id: 'c801a1e2-1001-4000-8000-000000000002',
    name: 'Sagar Kamti',
    phone: '+91 8591719499',
    address_line: 'Flat 402, AutoZon Tech Park, Connaught Place',
    area: 'Near Metro Gate 3',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    is_default: true
  },
  {
    id: 'a801a1e2-1001-4000-8000-000000000002',
    customer_id: 'c801a1e2-1001-4000-8000-000000000001',
    name: 'Rahul Sharma',
    phone: '+91 9876543210',
    address_line: 'House 14, Green Park Extension',
    area: 'Hauz Khas',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110016',
    is_default: true
  },
  {
    id: 'a801a1e2-1001-4000-8000-000000000003',
    customer_id: 'c801a1e2-1001-4000-8000-000000000003',
    name: 'Vikram Singh (Guru Auto Garage)',
    phone: '+91 9811223344',
    address_line: 'Plot 12, Industrial Area Phase 2',
    area: 'Okhla Industrial Estate',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110020',
    is_default: true
  }
];

export const INITIAL_ENQUIRIES = [
  {
    id: 'e801a1e2-1001-4000-8000-000000000001',
    customer_name: 'Amit Verma',
    phone: '+91 9876543210',
    vehicle_id: 'creta-sx-d',
    product_id: 'AZ-PROD-006',
    message: 'Mujhe Hyundai Creta ka brake pad chahiye. Delivery kitne din me milegi?',
    quantity: 2,
    status: 'New', // New, In Progress, Quoted, Resolved, Closed
    created_at: '2026-09-10T11:20:00.000Z',
    vehicleName: 'Hyundai Creta (2020-2024)',
    productName: 'Bosch Low-Metallic Front Disc Brake Pad Set'
  },
  {
    id: 'e801a1e2-1001-4000-8000-000000000002',
    customer_name: 'Rajesh Kumar',
    phone: '+91 9811223344',
    vehicle_id: 'swift-vxi',
    product_id: 'AZ-PROD-002',
    message: 'Maruti Swift VXi 2021 model ke liye BOSCH Genuine OE Clutch Kit available hai kya?',
    quantity: 1,
    status: 'In Progress',
    created_at: '2026-09-09T16:45:00.000Z',
    vehicleName: 'Maruti Suzuki Swift VXi (2018-2024)',
    productName: 'BOSCH Genuine OE Clutch Assembly Kit'
  },
  {
    id: 'e801a1e2-1001-4000-8000-000000000003',
    customer_name: 'Vikram Singh (Garage Owner)',
    phone: '+91 9899887766',
    vehicle_id: 'nexon-xz-d',
    product_id: 'AZ-PROD-004',
    message: 'Tata Nexon Diesel ke liye Motul 8100 5W-40 4L engine oil ke 5 cans ki bulk enquiry.',
    quantity: 5,
    status: 'Quoted',
    created_at: '2026-09-08T14:10:00.000Z',
    vehicleName: 'Tata Nexon 1.5L Diesel',
    productName: 'Motul 8100 X-cess 5W-40 Fully Synthetic Engine Oil (4L)'
  }
];

export const INITIAL_QUOTATIONS = [
  {
    id: 'q901b2f3-2002-5000-9000-000000000001',
    enquiry_id: 'e801a1e2-1001-4000-8000-000000000003',
    customer_id: 'cust-101',
    quotation_number: 'QT-2026-09-001',
    subtotal: 13500.00,
    discount: 1350.00,
    tax: 2187.00,
    total: 14337.00,
    valid_until: '2026-09-25',
    status: 'Sent', // Draft, Sent, Accepted, Rejected, Expired
    created_at: '2026-09-09T10:30:00.000Z',
    customerName: 'Vikram Singh (Garage Owner)',
    phone: '+91 9899887766',
    itemsSummary: '5x Motul 8100 X-cess 5W-40 Synthetic Engine Oil (4L)'
  },
  {
    id: 'q901b2f3-2002-5000-9000-000000000002',
    enquiry_id: 'e801a1e2-1001-4000-8000-000000000001',
    customer_id: 'cust-102',
    quotation_number: 'QT-2026-09-002',
    subtotal: 4500.00,
    discount: 450.00,
    tax: 729.00,
    total: 4779.00,
    valid_until: '2026-09-20',
    status: 'Draft',
    created_at: '2026-09-10T12:00:00.000Z',
    customerName: 'Amit Verma',
    phone: '+91 9876543210',
    itemsSummary: '2x Bosch Low-Metallic Front Disc Brake Pad Set (Hyundai Creta)'
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'r101c3d4-3003-6000-1000-000000000001',
    product_id: 'AZ-PROD-001',
    customer_id: 'cust-101',
    rating: 5,
    title: 'Excellent Original Bosch Quality!',
    comment: 'Fitted on my Maruti Swift 2021 model. Brake noise is completely gone and pedal bite feels solid like brand new vehicle.',
    status: 'Approved', // Pending, Approved, Rejected, Flagged
    created_at: '2026-09-08T09:15:00.000Z',
    customerName: 'Rohan Sharma',
    productName: 'BOSCH Genuine OE Front Brake Disc Pad Set'
  },
  {
    id: 'r101c3d4-3003-6000-1000-000000000002',
    product_id: 'AZ-PROD-004',
    customer_id: 'cust-102',
    rating: 5,
    title: 'Smooth Engine Performance',
    comment: 'Motul 8100 oil improved engine refinement significantly on my Nexon Diesel. Fast delivery by AutoZon India team.',
    status: 'Approved',
    created_at: '2026-09-09T14:20:00.000Z',
    customerName: 'Vikram Singh',
    productName: 'Motul 8100 X-cess 5W-40 Fully Synthetic Engine Oil (4L)'
  },
  {
    id: 'r101c3d4-3003-6000-1000-000000000003',
    product_id: 'AZ-PROD-002',
    customer_id: 'cust-103',
    rating: 4,
    title: 'Good clutch bite, fast shipping',
    comment: 'Package arrived in 2 days with authentic QR verification code. Installation at local garage went smooth.',
    status: 'Pending',
    created_at: '2026-09-10T10:00:00.000Z',
    customerName: 'Pankaj Mehta',
    productName: 'BOSCH Genuine OE Clutch Assembly Kit'
  }
];

export const INITIAL_COUPONS = [
  {
    id: 'c101d4e5-4004-7000-1000-000000000001',
    code: 'AUTOZON10',
    discount_type: 'percentage', // percentage or flat
    discount_value: 10,
    minimum_order: 1500,
    maximum_discount: 500,
    start_date: '2026-09-01',
    end_date: '2026-12-31',
    usage_limit: 500,
    status: 'Active' // Active, Inactive, Expired
  },
  {
    id: 'c101d4e5-4004-7000-1000-000000000002',
    code: 'FESTIVE250',
    discount_type: 'flat',
    discount_value: 250,
    minimum_order: 2500,
    maximum_discount: 250,
    start_date: '2026-09-05',
    end_date: '2026-10-30',
    usage_limit: 200,
    status: 'Active'
  },
  {
    id: 'c101d4e5-4004-7000-1000-000000000003',
    code: 'B2BGARAGE',
    discount_type: 'percentage',
    discount_value: 15,
    minimum_order: 10000,
    maximum_discount: 2500,
    start_date: '2026-08-01',
    end_date: '2026-12-31',
    usage_limit: 100,
    status: 'Active'
  }
];

export const INITIAL_PAYMENTS = [
  {
    id: 'p202e5f6-5005-8000-1000-000000000001',
    order_id: 'ord-1001',
    orderNumber: 'AZ-2026-8801',
    customerName: 'Rahul Sharma',
    payment_method: 'UPI (GPay / PhonePe)',
    transaction_id: 'pay_Nz81kL29XmP0', // Gateway reference token only
    amount: 3450.00,
    status: 'Captured', // Pending, Authorized, Captured, Failed, Refunded
    paid_at: '2026-09-08T14:32:00.000Z'
  },
  {
    id: 'p202e5f6-5005-8000-1000-000000000002',
    order_id: 'ord-1002',
    orderNumber: 'AZ-2026-8802',
    customerName: 'Anil Gupta',
    payment_method: 'Credit/Debit Card (Razorpay Token)',
    transaction_id: 'pay_Kq92mA38ZpL9',
    amount: 7200.00,
    status: 'Captured',
    paid_at: '2026-09-09T11:15:00.000Z'
  },
  {
    id: 'p202e5f6-5005-8000-1000-000000000003',
    order_id: 'ord-1003',
    orderNumber: 'AZ-2026-8803',
    customerName: 'Suresh Patel',
    payment_method: 'Cash On Delivery (COD)',
    transaction_id: 'cod_ref_AZ8803',
    amount: 1850.00,
    status: 'Pending',
    paid_at: '2026-09-10T09:45:00.000Z'
  }
];

export const INITIAL_SHIPPING = [
  {
    id: 's303f6a7-6006-9000-1000-000000000001',
    order_id: 'ord-1001',
    orderNumber: 'AZ-2026-8801',
    customerName: 'Rahul Sharma',
    courier: 'Bluedart Express',
    tracking_number: 'AWB987654321IN',
    status: 'In Transit', // Manifested, Picked Up, In Transit, Out for Delivery, Delivered, Returned
    shipped_at: '2026-09-09T08:30:00.000Z',
    delivered_at: null
  },
  {
    id: 's303f6a7-6006-9000-1000-000000000002',
    order_id: 'ord-1002',
    orderNumber: 'AZ-2026-8802',
    customerName: 'Anil Gupta',
    courier: 'Delhivery Surface',
    tracking_number: 'DEL881234567',
    status: 'Delivered',
    shipped_at: '2026-09-07T10:15:00.000Z',
    delivered_at: '2026-09-09T16:00:00.000Z'
  },
  {
    id: 's303f6a7-6006-9000-1000-000000000003',
    order_id: 'ord-1003',
    orderNumber: 'AZ-2026-8803',
    customerName: 'Suresh Patel',
    courier: 'DTDC Express',
    tracking_number: 'DTDC77341290',
    status: 'Manifested',
    shipped_at: '2026-09-10T11:00:00.000Z',
    delivered_at: null
  }
];

export const INITIAL_ADMIN_USERS = [
  {
    id: 'a404g7h8-7007-0000-1000-000000000001',
    name: 'Sagar Travel Owner',
    email: 'admin@autozonindia.com',
    role: 'Super Admin', // Super Admin, Admin, Product Manager, Order Manager, Support
    status: 'Active',
    created_at: '2026-08-01T00:00:00.000Z'
  },
  {
    id: 'a404g7h8-7007-0000-1000-000000000002',
    name: 'Rajiv Sharma',
    email: 'catalog@autozonindia.com',
    role: 'Product Manager',
    status: 'Active',
    created_at: '2026-08-15T10:30:00.000Z'
  },
  {
    id: 'a404g7h8-7007-0000-1000-000000000003',
    name: 'Pooja Verma',
    email: 'fulfillment@autozonindia.com',
    role: 'Order Manager',
    status: 'Active',
    created_at: '2026-09-01T12:00:00.000Z'
  },
  {
    id: 'a404g7h8-7007-0000-1000-000000000004',
    name: 'Deepak Kumar',
    email: 'support@autozonindia.com',
    role: 'Support',
    status: 'Active',
    created_at: '2026-09-05T09:15:00.000Z'
  }
];

export const INITIAL_WEBSITE_SETTINGS = [
  { id: 'ws-101', setting_key: 'website_name', setting_value: 'AutoZon India', updated_at: '2026-09-10T12:00:00.000Z' },
  { id: 'ws-102', setting_key: 'logo_url', setting_value: '/autozon-logo.png', updated_at: '2026-09-10T12:00:00.000Z' },
  { id: 'ws-103', setting_key: 'whatsapp_number', setting_value: '+919876543210', updated_at: '2026-09-10T12:00:00.000Z' },
  { id: 'ws-104', setting_key: 'contact_number', setting_value: '+91 98765 43210', updated_at: '2026-09-10T12:00:00.000Z' },
  { id: 'ws-105', setting_key: 'support_email', setting_value: 'support@autozonindia.com', updated_at: '2026-09-10T12:00:00.000Z' },
  { id: 'ws-106', setting_key: 'instagram_url', setting_value: 'https://instagram.com/autozonindia', updated_at: '2026-09-10T12:00:00.000Z' },
  { id: 'ws-107', setting_key: 'facebook_url', setting_value: 'https://facebook.com/autozonindia', updated_at: '2026-09-10T12:00:00.000Z' },
  { id: 'ws-108', setting_key: 'shipping_settings', setting_value: '{"flatRate": 99, "freeShippingMin": 1499}', updated_at: '2026-09-10T12:00:00.000Z' },
  { id: 'ws-109', setting_key: 'tax_settings', setting_value: '{"gstPercent": 18, "inclusiveTax": true}', updated_at: '2026-09-10T12:00:00.000Z' }
];










