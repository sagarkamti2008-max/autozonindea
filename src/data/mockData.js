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
          { id: 'city-zx-p', name: 'ZX 1.5L i-VTEC Petrol', engine: '1498 cc Petrol', transmission: 'CVT / 6-Speed MT' },
          { id: 'city-vx-d', name: 'VX 1.5L i-DTEC Diesel', engine: '1498 cc Diesel', transmission: '6-Speed MT' }
        ]
      },
      {
        id: 'amaze',
        name: 'Amaze',
        years: ['2021-2024', '2018-2020'],
        variants: [
          { id: 'amaze-vx-p', name: 'VX 1.2L i-VTEC Petrol', engine: '1199 cc Petrol', transmission: 'CVT / 5-Speed MT' }
        ]
      }
    ]
  },
  {
    id: 'toyota',
    name: 'Toyota',
    country: 'Japan',
    logo: '🚘',
    models: [
      {
        id: 'camry',
        name: 'Camry',
        years: ['2020', '2019', '2018', '2021', '2022', '2023-2024', '2018-2022'],
        variants: [
          { id: 'camry-25-petrol', name: '2.5L Petrol', engine: '2487 cc Petrol', transmission: '8-Speed AT' },
          { id: 'camry-hybrid', name: '2.5L Hybrid Electric', engine: '2487 cc Strong Hybrid', transmission: 'e-CVT' }
        ]
      },
      {
        id: 'innova-crysta',
        name: 'Innova Crysta',
        years: ['2020-2024', '2016-2020'],
        variants: [
          { id: 'crysta-zx-d', name: '2.4L ZX Diesel 7-Str', engine: '2393 cc Turbo Diesel', transmission: '5-Speed MT' },
          { id: 'crysta-vx-d', name: '2.4L VX Diesel 7-Str', engine: '2393 cc Turbo Diesel', transmission: '5-Speed MT' },
          { id: 'crysta-gx-d', name: '2.4L GX Diesel 8-Str', engine: '2393 cc Turbo Diesel', transmission: '5-Speed MT' },
          { id: 'crysta-gx-p', name: '2.7L GX Petrol', engine: '2694 cc Petrol', transmission: '5-Speed MT / 6-Speed AT' }
        ]
      },
      {
        id: 'fortuner',
        name: 'Fortuner',
        years: ['2021-2024', '2016-2020'],
        variants: [
          { id: 'fortuner-sigma4', name: '2.8L 4x4 Sigma-4 AT', engine: '2755 cc Turbo Diesel', transmission: '6-Speed AT' },
          { id: 'fortuner-4x2-d', name: '2.8L 4x2 Diesel AT', engine: '2755 cc Turbo Diesel', transmission: '6-Speed AT' },
          { id: 'fortuner-gr', name: 'GR-Sport 4x4 AT', engine: '2755 cc Turbo Diesel', transmission: '6-Speed AT' }
        ]
      },
      {
        id: 'hyryder',
        name: 'Urban Cruiser Hyryder',
        years: ['2022-2024'],
        variants: [
          { id: 'hyryder-v-hybrid', name: '1.5L V Hybrid e-CVT', engine: '1490 cc Strong Hybrid', transmission: 'e-CVT' },
          { id: 'hyryder-g-cng', name: '1.5L G CNG', engine: '1462 cc K15C CNG', transmission: '5-Speed MT' }
        ]
      },
      {
        id: 'glanza',
        name: 'Glanza',
        years: ['2022-2024', '2019-2021'],
        variants: [
          { id: 'glanza-g', name: 'G 1.2L Petrol', engine: '1197 cc Petrol', transmission: '5-Speed MT / AMT' },
          { id: 'glanza-v', name: 'V 1.2L Petrol AMT', engine: '1197 cc Petrol', transmission: 'AMT' }
        ]
      },
      {
        id: 'hycross',
        name: 'Innova Hycross',
        years: ['2022-2024'],
        variants: [
          { id: 'hycross-zx-o', name: '2.0L ZX(O) Hybrid e-CVT', engine: '1987 cc Strong Hybrid', transmission: 'e-CVT' },
          { id: 'hycross-vx', name: '2.0L VX Hybrid', engine: '1987 cc Strong Hybrid', transmission: 'e-CVT' }
        ]
      }
    ]
  },
  {
    id: 'bmw',
    name: 'BMW',
    country: 'Germany',
    logo: '🏎️',
    models: [
      {
        id: '3-series',
        name: '3 Series / 3 Series Gran Limousine',
        years: ['2023-2024', '2019-2022', '2012-2018'],
        variants: [
          { id: '330li', name: '330Li M Sport (2.0L Turbo Petrol)', engine: '1998 cc Turbo Petrol', transmission: '8-Speed Steptronic AT' },
          { id: '320d', name: '320d Luxury Line (2.0L Turbo Diesel)', engine: '1995 cc Turbo Diesel', transmission: '8-Speed AT' }
        ]
      },
      {
        id: 'x5',
        name: 'X5',
        years: ['2023-2024', '2019-2022'],
        variants: [
          { id: 'x5-xDrive30d', name: 'xDrive30d M Sport (3.0L Inline-6 Diesel)', engine: '2993 cc Turbo Diesel', transmission: '8-Speed Steptronic AT' }
        ]
      }
    ]
  },
  {
    id: 'mercedes',
    name: 'Mercedes-Benz',
    country: 'Germany',
    logo: '⭐',
    models: [
      {
        id: 'e-class',
        name: 'E-Class (LWB)',
        years: ['2021-2024', '2017-2020'],
        variants: [
          { id: 'e220d', name: 'E 220d Exclusive (2.0L Turbo Diesel)', engine: '1950 cc Diesel', transmission: '9G-TRONIC AT' },
          { id: 'e200', name: 'E 200 Expression (2.0L Turbo Petrol)', engine: '1991 cc Petrol', transmission: '9G-TRONIC AT' }
        ]
      },
      {
        id: 'glc',
        name: 'GLC SUV',
        years: ['2023-2024', '2016-2022'],
        variants: [
          { id: 'glc220d', name: 'GLC 220d 4MATIC (2.0L Diesel)', engine: '1993 cc Diesel', transmission: '9G-TRONIC AT' }
        ]
      }
    ]
  },
  {
    id: 'audi',
    name: 'Audi',
    country: 'Germany',
    logo: '⭕',
    models: [
      {
        id: 'a4',
        name: 'A4',
        years: ['2021-2024', '2016-2020'],
        variants: [
          { id: 'a4-40tfsi', name: '40 TFSI Technology (2.0L Turbo Petrol)', engine: '1984 cc Turbo Petrol', transmission: '7-Speed S tronic' }
        ]
      },
      {
        id: 'q5',
        name: 'Q5',
        years: ['2021-2024', '2018-2020'],
        variants: [
          { id: 'q5-45tfsi', name: '45 TFSI Technology quattro', engine: '1984 cc Turbo Petrol', transmission: '7-Speed S tronic' }
        ]
      }
    ]
  },
  {
    id: 'volkswagen',
    name: 'Volkswagen',
    country: 'Germany',
    logo: '🚗',
    models: [
      {
        id: 'virtus',
        name: 'Virtus',
        years: ['2022-2024'],
        variants: [
          { id: 'virtus-gt', name: 'GT Plus 1.5L TSI EVO (7DSG)', engine: '1498 cc TSI Petrol', transmission: '7-Speed DSG' },
          { id: 'virtus-topline', name: 'Topline 1.0L TSI (6AT)', engine: '999 cc TSI Petrol', transmission: '6-Speed AT' }
        ]
      },
      {
        id: 'taigun',
        name: 'Taigun',
        years: ['2021-2024'],
        variants: [
          { id: 'taigun-gt', name: 'GT Edge 1.5L TSI DSG', engine: '1498 cc TSI Petrol', transmission: '7-Speed DSG' }
        ]
      }
    ]
  },
  {
    id: 'skoda',
    name: 'Skoda',
    country: 'Czech Republic',
    logo: '🚗',
    models: [
      {
        id: 'slavia',
        name: 'Slavia',
        years: ['2022-2024'],
        variants: [
          { id: 'slavia-style-15', name: 'Style 1.5L TSI DSG', engine: '1498 cc TSI Petrol', transmission: '7-Speed DSG' },
          { id: 'slavia-style-10', name: 'Style 1.0L TSI MT', engine: '999 cc TSI Petrol', transmission: '6-Speed MT' }
        ]
      },
      {
        id: 'kushaq',
        name: 'Kushaq',
        years: ['2021-2024'],
        variants: [
          { id: 'kushaq-monte-carlo', name: 'Monte Carlo 1.5L TSI DSG', engine: '1498 cc TSI Petrol', transmission: '7-Speed DSG' }
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
  { id: 'Engine Parts', name: 'Engine Parts', icon: '🔧', subcategories: ['Cylinder Block', 'Piston', 'Piston Rings', 'Gaskets', 'Timing Belts', 'Valves', 'Spark Plugs', 'Engine Mounts'] },
  { id: 'Transmission Parts', name: 'Transmission Parts', icon: '⚙️', subcategories: ['Clutch Kit', 'Flywheel', 'Gearbox', 'Drive Shaft', 'CV Joint', 'Automatic Transmission Filter'] },
  { id: 'Brake Parts', name: 'Brake Parts', icon: '🛑', subcategories: ['Brake Pads', 'Brake Discs & Rotors', 'Brake Calipers', 'Brake Drums', 'Brake Shoes', 'Brake Caliper Piston', 'Brake Fluid'] },
  { id: 'Suspension & Steering', name: 'Suspension & Steering', icon: '🚗', subcategories: ['Shock Absorbers', 'Struts', 'Control Arms', 'Steering Rack', 'Power Steering Pump', 'Tie Rod Ends', 'Ball Joints'] },
  { id: 'Electrical Parts', name: 'Electrical Parts', icon: '⚡', subcategories: ['Alternators', 'Starter Motors', 'Sensors (O2, ABS, MAP)', 'Relays & Fuses', 'Horns', 'Ignition Coils'] },
  { id: 'AC & HVAC', name: 'AC & HVAC', icon: '❄️', subcategories: ['AC Compressor', 'Condenser', 'Cabin AC Filter', 'Expansion Valve', 'Evaporator Core'] },
  { id: 'Cooling System', name: 'Cooling System', icon: '🌡️', subcategories: ['Radiator Assembly', 'Water Pump', 'Coolant Hose', 'Thermostat Valve', 'Coolant Reservoir'] },
  { id: 'Fuel System', name: 'Fuel System', icon: '⛽', subcategories: ['Fuel Injectors', 'Fuel Pump Assembly', 'Fuel Rail', 'Fuel Filter', 'Fuel Pressure Regulator'] },
  { id: 'Exhaust System', name: 'Exhaust System', icon: '💨', subcategories: ['Exhaust Manifold', 'Catalytic Converter', 'Muffler', 'Exhaust Pipe', 'O2 Lambda Sensor'] },
  { id: 'Body Parts', name: 'Body Parts', icon: '🚘', subcategories: ['Bumpers', 'Fenders', 'Side Mirrors', 'Wiper Blades', 'Grilles', 'Bonnet & Hood', 'Door Handles'] },
  { id: 'Lighting', name: 'Lighting', icon: '💡', subcategories: ['Headlight Assemblies', 'Tail Lights', 'Fog Lamps', 'LED Bulbs', 'Turn Signals'] },
  { id: 'Interior Parts', name: 'Interior Parts', icon: '🪑', subcategories: ['Seat Covers', '7D Floor Mats', 'Dashboard Trims', 'Steering Covers', 'Mobile Holders', 'Dash Cams'] },
  { id: 'Wheels & Tyres', name: 'Wheels & Tyres', icon: '🛞', subcategories: ['Tubeless Tyres', 'Alloy Wheels', 'TPMS Sensors', 'Wheel Bearings', 'Valves & Caps'] },
  { id: 'Filters', name: 'Filters', icon: '🌀', subcategories: ['Engine Air Filters', 'Oil Filters', 'Cabin AC Filters', 'Fuel Filters', 'Transmission Filters'] },
  { id: 'Service Parts', name: 'Service Parts', icon: '🧰', subcategories: ['Comprehensive Maintenance Kits', 'Spark Plugs', 'Engine Oil 5W-30', 'Coolants', 'Wiper Fluid'] }
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
    id: 'AZ-PROD-FILTER-001',
    title: 'Elofic High-Efficiency Engine Oil Filter Element',
    name: 'Elofic High-Efficiency Engine Oil Filter Element',
    category: 'filters',
    categorySlug: 'filters',
    subCategory: 'Oil Filters',
    brand: 'Elofic',
    carBrand: 'Maruti Suzuki',
    carModel: 'Swift',
    partNumber: 'ELF-OF-9921',
    oemNumber: '16510-M68P00',
    sku: 'ELF-FLT-OF01',
    mrp: 350,
    price: 220,
    sellingPrice: 220,
    discountPercent: 37,
    gstPercent: 18,
    stock: 150,
    classification: 'OEM',
    isUniversal: true,
    compatibleVehicles: ['maruti-swift', 'maruti-baleno', 'maruti-dzire', 'hyundai-creta', 'tata-nexon', 'honda-city', 'toyota-innova'],
    rating: 4.9,
    reviewsCount: 420,
    warranty: '6 Months Replacement Warranty',
    seller: 'Elofic Official Store',
    weight: '300 grams',
    dimensions: '10 x 10 x 12 cm',
    deliveryDays: '1-2 Days',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80',
    description: 'Heavy duty spin-on oil filter with high dust-holding capacity micro-glass media for maximum engine sludge protection.',
    specifications: {
      'Filter Type': 'Spin-On Oil Filter',
      'Media Type': 'Synthetic Micro-Glass',
      'Anti-Drain Back Valve': 'Silicone Rubber Valve',
      'Bypass Valve Relief Pressure': '1.2 Bar'
    }
  },
  {
    id: 'AZ-PROD-FILTER-002',
    title: 'Bosch High-Flow Engine Air Filter Assembly',
    name: 'Bosch High-Flow Engine Air Filter Assembly',
    category: 'filters',
    categorySlug: 'filters',
    subCategory: 'Air Filters',
    brand: 'BOSCH',
    carBrand: 'Hyundai',
    carModel: 'Creta',
    partNumber: 'BSH-AF-0986',
    oemNumber: '28113-F2000',
    sku: 'BSH-FLT-AF02',
    mrp: 750,
    price: 499,
    sellingPrice: 499,
    discountPercent: 33,
    gstPercent: 18,
    stock: 85,
    classification: 'OEM',
    isUniversal: true,
    compatibleVehicles: ['hyundai-creta', 'hyundai-i20', 'maruti-swift', 'tata-nexon', 'honda-city', 'toyota-innova'],
    rating: 4.8,
    reviewsCount: 310,
    warranty: '6 Months Warranty',
    seller: 'Bosch Automotive Official Store',
    weight: '400 grams',
    dimensions: '25 x 18 x 5 cm',
    deliveryDays: '2 Business Days',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=80',
    description: 'Bosch precision pleated air filter prevents dust particles, sand, and dirt from entering engine cylinders.',
    specifications: {
      'Filter Media': 'High-Efficiency Polyurethane Pleated Paper',
      'Filtration Efficiency': '99.5% at 5 microns',
      'Gasket Material': 'Soft Polyurethane Seal'
    }
  },
  {
    id: 'AZ-PROD-FILTER-003',
    title: 'Uno Minda Activated Carbon Cabin AC Filter',
    name: 'Uno Minda Activated Carbon Cabin AC Filter',
    category: 'filters',
    categorySlug: 'filters',
    subCategory: 'Cabin Filters',
    brand: 'UNO MINDA',
    carBrand: 'Toyota',
    carModel: 'Innova Crysta',
    partNumber: 'MND-CF-8871',
    oemNumber: '87139-0K030',
    sku: 'MND-FLT-CF03',
    mrp: 890,
    price: 580,
    sellingPrice: 580,
    discountPercent: 35,
    gstPercent: 18,
    stock: 95,
    classification: 'OES',
    isUniversal: true,
    compatibleVehicles: ['toyota-innova', 'toyota-fortuner', 'maruti-swift', 'hyundai-creta', 'honda-city'],
    rating: 4.9,
    reviewsCount: 275,
    warranty: '1 Year Warranty',
    seller: 'Uno Minda Spare Hub',
    weight: '250 grams',
    dimensions: '22 x 20 x 3 cm',
    deliveryDays: '2 Days',
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80',
    description: 'Multi-layer activated carbon cabin filter neutralizes harmful gases, odors, smog, and PM2.5 pollutants inside vehicle cabin.',
    specifications: {
      'Layer 1': 'Pre-filter electrostatic mesh',
      'Layer 2': 'Coconut shell activated carbon layer',
      'PM2.5 Reduction': '> 98%'
    }
  },
  {
    id: 'AZ-PROD-FILTER-004',
    title: 'Elofic Diesel & Petrol Fuel Filter Assembly',
    name: 'Elofic Diesel & Petrol Fuel Filter Assembly',
    category: 'filters',
    categorySlug: 'filters',
    subCategory: 'Fuel Filters',
    brand: 'Elofic',
    carBrand: 'Toyota',
    carModel: 'Innova',
    partNumber: 'ELF-FF-3301',
    oemNumber: '23390-0L070',
    sku: 'ELF-FLT-FF04',
    mrp: 1200,
    price: 799,
    sellingPrice: 799,
    discountPercent: 33,
    gstPercent: 18,
    stock: 60,
    classification: 'OEM',
    isUniversal: true,
    compatibleVehicles: ['toyota-innova', 'toyota-fortuner', 'maruti-swift', 'hyundai-creta'],
    rating: 4.8,
    reviewsCount: 190,
    warranty: '6 Months Warranty',
    seller: 'Elofic Official Store',
    weight: '350 grams',
    dimensions: '12 x 12 x 15 cm',
    deliveryDays: '2 Days',
    image: 'https://images.unsplash.com/photo-1620987278429-ab178d6eb547?w=600&auto=format&fit=crop&q=80',
    description: 'High-pressure fuel filter removing water emulsion and microscopic contaminants before entering common rail fuel injectors.',
    specifications: {
      'Water Separation Efficiency': '> 95%',
      'Filtration Micron Rating': '3 Microns'
    }
  },
  {
    id: 'AZ-PROD-004',
    title: 'Motul 8100 X-cess 5W-40 Fully Synthetic Engine Oil (4L)',
    name: 'Motul 8100 X-cess 5W-40 Fully Synthetic Engine Oil (4L)',
    category: 'oils-fluids',
    categorySlug: 'oils-fluids',
    subCategory: 'Engine Oil',
    brand: 'Motul',
    carBrand: 'Universal',
    partNumber: 'MOTUL-5W40-4L',
    oemNumber: 'API-SN-5W40',
    sku: 'MTL-OIL-5W40-4',
    mrp: 4200,
    price: 3290,
    sellingPrice: 3290,
    discountPercent: 22,
    gstPercent: 18,
    stock: 35,
    classification: 'OES',
    isUniversal: true,
    compatibleVehicles: ['maruti-swift', 'hyundai-creta', 'tata-nexon', 'honda-city', 'toyota-innova'],
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
    id: 'AZ-PROD-003',
    title: 'Castrol Brake Fluid DOT 4 Synthetic Heavy-Duty Hydraulic Oil (500ml)',
    name: 'Castrol Brake Fluid DOT 4 Synthetic Heavy-Duty Hydraulic Oil (500ml)',
    category: 'oils-fluids',
    categorySlug: 'oils-fluids',
    subCategory: 'Brake Fluid',
    brand: 'Castrol',
    carBrand: 'Universal',
    partNumber: 'CAS-BF-DOT4-500',
    oemNumber: 'DOT4-HYD-500',
    sku: 'CST-FL-DOT4',
    mrp: 550,
    price: 385,
    sellingPrice: 385,
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
    id: 'AZ-PROD-CAMRY-BRK-001',
    title: 'Toyota Camry Front Ceramic Brake Pad Set (2018-2022)',
    name: 'Toyota Camry Front Ceramic Brake Pad Set (2018-2022)',
    category: 'Brake Parts',
    categorySlug: 'brake-parts',
    subCategory: 'Brake Pads',
    brand: 'Toyota',
    carBrand: 'Toyota',
    carModel: 'Camry',
    years: '2018, 2019, 2020, 2021, 2022',
    variant: '2.5L Petrol',
    partNumber: '04465-33480',
    oemNumber: '04465-33480',
    sku: 'TOY-CAM-BP01',
    mrp: 4500,
    price: 3200,
    sellingPrice: 3200,
    discountPercent: 28,
    gstPercent: 18,
    stock: 45,
    classification: 'OEM',
    isUniversal: false,
    compatibleVehicles: ['toyota-camry', 'camry', 'toyota-camry-2020', 'camry-2020'],
    rating: 4.9,
    reviewsCount: 184,
    warranty: '1 Year Genuine Warranty',
    seller: 'Toyota Authorized Parts',
    weight: '1.4 kg',
    dimensions: '16 x 10 x 8 cm',
    deliveryDays: '2 Business Days',
    image: 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=600&auto=format&fit=crop&q=80',
    description: 'Genuine Toyota Camry Front Ceramic Brake Pad set engineered for low noise, minimal dust, and maximum thermal stopping power.',
    specifications: {
      'Material': 'Premium Ceramic Compound',
      'Fitment Position': 'Front Axle',
      'OEM Part Number': '04465-33480',
      'Compatible Models': 'Toyota Camry 2018-2022 2.5L Petrol & Hybrid'
    }
  },
  {
    id: 'AZ-PROD-CAMRY-ENG-002',
    title: 'Toyota Camry 2.5L Petrol Engine Oil Filter & Gasket',
    name: 'Toyota Camry 2.5L Petrol Engine Oil Filter & Gasket',
    category: 'Engine Parts',
    categorySlug: 'engine-parts',
    subCategory: 'Oil Filters',
    brand: 'Toyota',
    carBrand: 'Toyota',
    carModel: 'Camry',
    years: '2018, 2019, 2020, 2021, 2022',
    variant: '2.5L Petrol',
    partNumber: '04152-YZZA1',
    oemNumber: '04152-YZZA1',
    sku: 'TOY-CAM-OF02',
    mrp: 950,
    price: 680,
    sellingPrice: 680,
    discountPercent: 28,
    gstPercent: 18,
    stock: 90,
    classification: 'OEM',
    isUniversal: false,
    compatibleVehicles: ['toyota-camry', 'camry', 'toyota-camry-2020', 'camry-2020'],
    rating: 4.8,
    reviewsCount: 120,
    warranty: '6 Months Warranty',
    seller: 'Toyota Genuine Parts',
    weight: '250 grams',
    dimensions: '10 x 10 x 10 cm',
    deliveryDays: '1-2 Days',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80',
    description: 'Original Toyota cartridge oil filter with O-ring seal designed specifically for Dynamic Force 2.5L engines.',
    specifications: {
      'Filter Element': 'Synthetic Fiber Cartridge',
      'OEM Reference': '04152-YZZA1',
      'Engine Compatibility': '2.5L Petrol A25A-FKS'
    }
  },
  {
    id: 'AZ-PROD-CAMRY-AC-003',
    title: 'Toyota Camry Cabin AC Filter & Compressor Clutch Kit',
    name: 'Toyota Camry Cabin AC Filter & Compressor Clutch Kit',
    category: 'AC Parts',
    categorySlug: 'ac-parts',
    subCategory: 'Cabin AC Filters',
    brand: 'Denso',
    carBrand: 'Toyota',
    carModel: 'Camry',
    years: '2018, 2019, 2020, 2021, 2022',
    variant: '2.5L Petrol',
    partNumber: '87139-58010',
    oemNumber: '87139-58010',
    sku: 'DNS-CAM-AC03',
    mrp: 1800,
    price: 1250,
    sellingPrice: 1250,
    discountPercent: 30,
    gstPercent: 18,
    stock: 55,
    classification: 'OEM',
    isUniversal: false,
    compatibleVehicles: ['toyota-camry', 'camry', 'toyota-camry-2020', 'camry-2020'],
    rating: 4.9,
    reviewsCount: 95,
    warranty: '1 Year Warranty',
    seller: 'Denso India Official',
    weight: '350 grams',
    dimensions: '22 x 20 x 4 cm',
    deliveryDays: '2 Days',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=80',
    description: 'Denso High-efficiency activated carbon cabin AC filter removes allergens, odors, and PM2.5 particles for Toyota Camry.',
    specifications: {
      'Filtration': 'PM2.5 Activated Charcoal',
      'OEM Part Number': '87139-58010'
    }
  },
  {
    id: 'AZ-PROD-006',
    title: 'Bosch Low-Metallic Heavy Duty Front Disc Brake Pad Set',
    name: 'Bosch Low-Metallic Heavy Duty Front Disc Brake Pad Set',
    category: 'brake-parts',
    categorySlug: 'brake-parts',
    subCategory: 'Brake Pads',
    brand: 'BOSCH',
    carBrand: 'Maruti Suzuki',
    carModel: 'Swift',
    partNumber: 'BOSCH-BP-0986',
    oemNumber: '55810-M74L00',
    sku: 'BSH-BRK-BP09',
    mrp: 1850,
    price: 1290,
    sellingPrice: 1290,
    discountPercent: 30,
    gstPercent: 18,
    stock: 60,
    classification: 'OEM',
    isUniversal: true,
    compatibleVehicles: ['maruti-swift', 'maruti-baleno', 'maruti-dzire', 'hyundai-creta'],
    rating: 4.8,
    reviewsCount: 220,
    warranty: '6 Months Warranty',
    weight: '1.2 kg',
    dimensions: '15 x 10 x 8 cm',
    deliveryDays: '2 Business Days',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=80',
    description: 'High performance ceramic brake pads offering superior stopping power, lower dust, and fade resistance under extreme temperatures.',
    specifications: {
      'Friction Material': 'Low-Metallic Asbestos Free',
      'Noise Damping': 'Multi-layer rubber core shims',
      'Position': 'Front Axle Left & Right'
    }
  },
  {
    id: 'AZ-PROD-002',
    title: 'BOSCH Genuine OE Clutch Assembly Kit (Pressure Plate + Friction Disc)',
    name: 'BOSCH Genuine OE Clutch Assembly Kit (Pressure Plate + Friction Disc)',
    category: 'clutch-parts',
    categorySlug: 'clutch-parts',
    subCategory: 'Clutch Plates',
    brand: 'BOSCH',
    carBrand: 'Maruti Suzuki',
    carModel: 'Swift',
    partNumber: 'BOSCH-CK-22019',
    oemNumber: '22100-M74L00',
    sku: 'BSH-CLT-SWF12',
    mrp: 4899,
    price: 3450,
    sellingPrice: 3450,
    discountPercent: 30,
    gstPercent: 18,
    stock: 18,
    classification: 'OEM',
    isUniversal: true,
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
      'Diameter': '200 mm'
    }
  },
  {
    id: 'AZ-PROD-ENG-001',
    title: 'NGK Laser Iridium High Performance Spark Plug Set (Pack of 4)',
    name: 'NGK Laser Iridium High Performance Spark Plug Set (Pack of 4)',
    category: 'engine-parts',
    categorySlug: 'engine-parts',
    subCategory: 'Spark Plugs',
    brand: 'NGK',
    carBrand: 'Universal',
    partNumber: 'NGK-ILKAR7B11',
    oemNumber: '09482-M00640',
    sku: 'NGK-ENG-SP4',
    mrp: 3200,
    price: 2150,
    sellingPrice: 2150,
    discountPercent: 32,
    gstPercent: 18,
    stock: 75,
    classification: 'OEM',
    isUniversal: true,
    compatibleVehicles: ['maruti-swift', 'hyundai-creta', 'honda-city', 'tata-nexon'],
    rating: 4.9,
    reviewsCount: 340,
    warranty: '1 Year Warranty',
    seller: 'NGK Official Dealer',
    weight: '300 grams',
    dimensions: '10 x 8 x 3 cm',
    deliveryDays: '2 Days',
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600&auto=format&fit=crop&q=80',
    description: 'Laser welded iridium tip center electrode ensuring high durability and steady spark ignition for improved engine mileage.',
    specifications: {
      'Center Electrode': 'Iridium Tip',
      'Thread Diameter': '12 mm',
      'Reach': '26.5 mm'
    }
  },
  {
    id: 'AZ-PROD-008',
    title: 'Uno Minda OEM High-Tone Dual Trumpet Electric Horn Set (12V)',
    name: 'Uno Minda OEM High-Tone Dual Trumpet Electric Horn Set (12V)',
    category: 'electrical',
    categorySlug: 'electrical',
    subCategory: 'Horns',
    brand: 'UNO MINDA',
    carBrand: 'Universal',
    partNumber: 'MINDA-HN-DTH12',
    oemNumber: 'HN-12V-DUAL',
    sku: 'MND-ELC-HN12',
    mrp: 1250,
    price: 849,
    sellingPrice: 849,
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
      'Voltage': '12 Volts'
    }
  },
  {
    id: 'AZ-PROD-007',
    title: 'AutoZon 4K Ultra HD Dual Dash Camera with Built-in GPS & Night Vision',
    name: 'AutoZon 4K Ultra HD Dual Dash Camera with Built-in GPS & Night Vision',
    category: 'car-accessories',
    categorySlug: 'car-accessories',
    subCategory: 'Dash Cameras',
    brand: 'AutoZon Originals',
    carBrand: 'Universal',
    partNumber: 'AZ-DC-4KGPS',
    oemNumber: 'DASH-CAM-4K',
    sku: 'AZ-ELC-DC4K',
    mrp: 9999,
    price: 5999,
    sellingPrice: 5999,
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
      'Sensor': 'Sony STARVIS IMX335'
    }
  },
  {
    id: 'AZ-PROD-005',
    title: 'AutoZon 7D Luxury All-Weather Custom Fit Car Floor Mats (Set of 5)',
    name: 'AutoZon 7D Luxury All-Weather Custom Fit Car Floor Mats (Set of 5)',
    category: 'car-accessories',
    categorySlug: 'car-accessories',
    subCategory: 'Floor Mats',
    brand: 'AutoZon Originals',
    carBrand: 'Universal',
    partNumber: 'AZ-7D-MAT-BLK',
    oemNumber: 'MAT-7D-CUSTOM',
    sku: 'AZ-INT-7DMAT',
    mrp: 4999,
    price: 2499,
    sellingPrice: 2499,
    discountPercent: 50,
    gstPercent: 18,
    stock: 25,
    classification: 'Aftermarket',
    isUniversal: true,
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
      'Material': 'PU Leather + Detachable Curly Mat',
      'Waterproof': 'Yes (100% Washable)'
    }
  }
];
const OLD_PRODUCTS_DATA = [
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

export const INITIAL_ORDERS = [];

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
    author: 'Kamti Automotive Technical Team',
    date: '2026-08-18',
    category: 'Troubleshooting',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80',
    content: 'Is your clutch pedal feeling soft or slipping on steep inclines? Here are 5 tell-tale symptoms that indicate it is time to replace your pressure plate and friction disc.'
  }
];

export const INITIAL_CUSTOMERS = [];

export const INITIAL_ADDRESSES = [];

export const INITIAL_ENQUIRIES = [];
export const INITIAL_QUOTATIONS = [];
export const INITIAL_REVIEWS = [];
export const INITIAL_COUPONS = [];
export const INITIAL_PAYMENTS = [];
export const INITIAL_SHIPPING = [];

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

export const INITIAL_FAQS = [
  // Product & Compatibility
  {
    id: 'faq-pc-1',
    category: 'Product & Compatibility',
    question: 'Will this part fit my car?',
    answer: 'Select your car Brand, Model, Variant, and Year using our <strong>Check Compatibility</strong> selector tool on the homepage or product page to verify exact fitment before ordering.',
    status: 'published',
    sort_order: 1
  },
  {
    id: 'faq-pc-2',
    category: 'Product & Compatibility',
    question: 'What if I cannot find my car model?',
    answer: 'Contact our support team via WhatsApp or Email (+91 98765 43210 / support@autozonindia.com) and share your car details or 17-digit VIN number for manual verification.',
    status: 'published',
    sort_order: 2
  },
  {
    id: 'faq-pc-3',
    category: 'Product & Compatibility',
    question: 'Are the products genuine?',
    answer: 'Each product clearly mentions whether it is Genuine/OEM (Original Equipment Manufacturer) or a high-quality Aftermarket certified part with manufacturer warranty.',
    status: 'published',
    sort_order: 3
  },
  {
    id: 'faq-pc-4',
    category: 'Product & Compatibility',
    question: 'What is the OEM/Part Number?',
    answer: 'The OEM or Part Number is displayed on the product details page under specifications. You can use it to cross-check exact fitment.',
    status: 'published',
    sort_order: 4
  },
  {
    id: 'faq-pc-5',
    category: 'Product & Compatibility',
    question: 'Can I see product images before ordering?',
    answer: 'Yes. Multiple high-resolution product images from various angles are available on every product details page.',
    status: 'published',
    sort_order: 5
  },

  // Price & Payment
  {
    id: 'faq-pp-1',
    category: 'Price & Payment',
    question: 'What is the final price of the product?',
    answer: 'The final price of the product includes product price, GST, and any applicable shipping charges displayed transparently at checkout.',
    status: 'published',
    sort_order: 6
  },
  {
    id: 'faq-pp-2',
    category: 'Price & Payment',
    question: 'Is Cash on Delivery (COD) available?',
    answer: 'Yes, Cash on Delivery (COD) is available for eligible pin codes across India.',
    status: 'published',
    sort_order: 7
  },
  {
    id: 'faq-pp-3',
    category: 'Price & Payment',
    question: 'What payment methods are available?',
    answer: 'We accept UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards, Net Banking, and Cash on Delivery (COD).',
    status: 'published',
    sort_order: 8
  },
  {
    id: 'faq-pp-4',
    category: 'Price & Payment',
    question: 'Will I receive a GST invoice?',
    answer: 'Yes, an official tax invoice with GST breakdown is provided for every order.',
    status: 'published',
    sort_order: 9
  },
  {
    id: 'faq-pp-5',
    category: 'Price & Payment',
    question: 'Are discounts available?',
    answer: 'Yes, active coupon codes (such as AUTOZON10 or FESTIVE250) can be applied at checkout for discounts.',
    status: 'published',
    sort_order: 10
  },

  // Shipping & Delivery
  {
    id: 'faq-sd-1',
    category: 'Shipping & Delivery',
    question: 'How long will my order take to arrive?',
    answer: 'Standard delivery across India usually takes 3 to 7 business days depending on your location.',
    status: 'published',
    sort_order: 11
  },
  {
    id: 'faq-sd-2',
    category: 'Shipping & Delivery',
    question: 'Do you deliver across India?',
    answer: 'Yes, we deliver auto spare parts to over 19,000+ pincodes across India.',
    status: 'published',
    sort_order: 12
  },
  {
    id: 'faq-sd-3',
    category: 'Shipping & Delivery',
    question: 'How much are the shipping charges?',
    answer: 'Shipping charges depend on weight and location, calculated transparently at checkout. Free shipping is available on orders above ₹999.',
    status: 'published',
    sort_order: 13
  },
  {
    id: 'faq-sd-4',
    category: 'Shipping & Delivery',
    question: 'How can I track my order?',
    answer: 'You can track your order using the <strong>Track Order</strong> page on our website by entering your Order ID or tracking number.',
    status: 'published',
    sort_order: 14
  },
  {
    id: 'faq-sd-5',
    category: 'Shipping & Delivery',
    question: 'What should I do if my order is delayed?',
    answer: 'Contact our support team or check real-time courier tracking updates via your account dashboard.',
    status: 'published',
    sort_order: 15
  },

  // Returns & Replacement
  {
    id: 'faq-rr-1',
    category: 'Returns & Replacement',
    question: 'Can I return a product?',
    answer: 'Yes, we offer a 7-day return policy for unopened, unused parts in their original packaging.',
    status: 'published',
    sort_order: 16
  },
  {
    id: 'faq-rr-2',
    category: 'Returns & Replacement',
    question: 'What should I do if I receive the wrong part?',
    answer: 'Raise a return or replacement request via support with photos within 48 hours. We will arrange pickup and ship the correct part.',
    status: 'published',
    sort_order: 17
  },
  {
    id: 'faq-rr-3',
    category: 'Returns & Replacement',
    question: 'What should I do if the product arrives damaged?',
    answer: 'Report damaged packages within 24 hours of delivery along with unboxing images for an immediate replacement.',
    status: 'published',
    sort_order: 18
  },
  {
    id: 'faq-rr-4',
    category: 'Returns & Replacement',
    question: 'How long does a replacement take?',
    answer: 'Once verified, replacement parts are dispatched within 2 to 3 business days.',
    status: 'published',
    sort_order: 19
  },
  {
    id: 'faq-rr-5',
    category: 'Returns & Replacement',
    question: 'How does the refund process work?',
    answer: 'Refunds are processed back to your original payment method or bank account within 5 to 7 business days after return verification.',
    status: 'published',
    sort_order: 20
  },

  // Installation
  {
    id: 'faq-in-1',
    category: 'Installation',
    question: 'Do you provide installation services?',
    answer: 'We provide doorstep and partner garage installation services in select major cities.',
    status: 'published',
    sort_order: 21
  },
  {
    id: 'faq-in-2',
    category: 'Installation',
    question: 'Can I get help finding a mechanic for installation?',
    answer: 'Yes, contact our support team or use our Mechanic Locator tool to find verified partner garages near your location.',
    status: 'published',
    sort_order: 22
  },
  {
    id: 'faq-in-3',
    category: 'Installation',
    question: 'Does the product come with installation instructions?',
    answer: 'Most OEM and major aftermarket products include printed user manuals or downloadable digital installation guides.',
    status: 'published',
    sort_order: 23
  },

  // Orders
  {
    id: 'faq-ord-1',
    category: 'Orders',
    question: 'How do I place an order?',
    answer: 'Follow our easy flow: <strong>Select Car → Brand → Model → Variant → Year → Compatible Parts → Product Details → Add to Cart → Checkout → Payment → Order Confirmation → Order Tracking</strong>.',
    status: 'published',
    sort_order: 24
  },
  {
    id: 'faq-ord-2',
    category: 'Orders',
    question: 'How can I cancel my order?',
    answer: 'You can cancel directly from your "My Orders" section before the order is dispatched.',
    status: 'published',
    sort_order: 25
  },
  {
    id: 'faq-ord-3',
    category: 'Orders',
    question: 'Can I change my delivery address after placing an order?',
    answer: 'Address changes are allowed prior to shipment by contacting our customer support team immediately.',
    status: 'published',
    sort_order: 26
  },
  {
    id: 'faq-ord-4',
    category: 'Orders',
    question: 'How can I check my order status?',
    answer: 'Log in and visit "My Orders" or use the "Track Order" page with your Order ID.',
    status: 'published',
    sort_order: 27
  },
  {
    id: 'faq-ord-5',
    category: 'Orders',
    question: 'What should I do if I did not receive my order confirmation?',
    answer: 'Check your email spam folder, check your account dashboard, or contact support with your mobile number.',
    status: 'published',
    sort_order: 28
  }
];











