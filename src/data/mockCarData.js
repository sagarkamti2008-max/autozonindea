export const carsData = [
  {
    id: 'car_001',
    make: 'Hyundai',
    model: 'Creta',
    variant: 'SX (O) 1.5 Diesel AT',
    year: 2024,
    status: 'new', // new, used, upcoming
    body_type: 'SUV',
    budget_segment: '15L - 25L',
    price_ex_showroom: 1999900,
    price_on_road: 2350000,
    fuel_type: 'Diesel',
    transmission: 'Automatic',
    mileage: '19.1 kmpl',
    safety_rating: '4 Star Global NCAP',
    images: [
      'https://images.unsplash.com/photo-1633504589255-a50d2bb09c68?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop'
    ],
    key_specs: {
      power: '114 bhp @ 4000 rpm',
      torque: '250 Nm @ 1500-2750 rpm',
      engine: '1493 cc',
      seating: 5,
      boot_space: '433 Litres',
      ground_clearance: '190 mm'
    },
    features: ['Panoramic Sunroof', 'Ventilated Seats', '10.25-inch Touchscreen', 'ADAS Level 2', 'Bose Premium Audio'],
    reviews: { rating: 4.6, count: 2145 },
    is_popular: true,
    is_latest: false
  },
  {
    id: 'car_002',
    make: 'Tata',
    model: 'Nexon',
    variant: 'Fearless Plus S 1.2 Revotron',
    year: 2024,
    status: 'new',
    body_type: 'Compact SUV',
    budget_segment: '10L - 15L',
    price_ex_showroom: 1359900,
    price_on_road: 1580000,
    fuel_type: 'Petrol',
    transmission: 'Manual',
    mileage: '17.44 kmpl',
    safety_rating: '5 Star Global NCAP',
    images: [
      'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=1200&auto=format&fit=crop'
    ],
    key_specs: {
      power: '118.27 bhp @ 5500 rpm',
      torque: '170 Nm @ 1750-4000 rpm',
      engine: '1199 cc',
      seating: 5,
      boot_space: '382 Litres',
      ground_clearance: '208 mm'
    },
    features: ['360 Degree Camera', 'Blind Spot Monitor', '10.25-inch Digital Cluster', 'JBL Sound System'],
    reviews: { rating: 4.8, count: 3102 },
    is_popular: true,
    is_latest: true
  },
  {
    id: 'car_003',
    make: 'Maruti Suzuki',
    model: 'Swift',
    variant: 'ZXI Plus AMT',
    year: 2024,
    status: 'new',
    body_type: 'Hatchback',
    budget_segment: 'Under 10L',
    price_ex_showroom: 914000,
    price_on_road: 1040000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    mileage: '22.56 kmpl',
    safety_rating: '2 Star Global NCAP',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1200&auto=format&fit=crop'
    ],
    key_specs: {
      power: '88.50 bhp @ 6000 rpm',
      torque: '113 Nm @ 4400 rpm',
      engine: '1197 cc',
      seating: 5,
      boot_space: '268 Litres',
      ground_clearance: '163 mm'
    },
    features: ['LED Projector Headlamps', 'SmartPlay Pro+ Info', 'Cruise Control', 'Auto AC'],
    reviews: { rating: 4.3, count: 5410 },
    is_popular: true,
    is_latest: false
  },
  {
    id: 'car_004',
    make: 'Honda',
    model: 'City',
    variant: 'ZX CVT',
    year: 2021,
    status: 'used',
    body_type: 'Sedan',
    budget_segment: '10L - 15L',
    price_ex_showroom: null, // used cars only have selling price
    price_on_road: 1250000, // this is the selling price
    used_details: {
      odometer: '42,000 km',
      owners: '1st Owner',
      location: 'New Delhi',
      registration: 'DL-8C',
      history: 'Non-accidental, Full service history available'
    },
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    mileage: '18.4 kmpl',
    safety_rating: '4 Star ASEAN NCAP',
    images: [
      'https://images.unsplash.com/photo-1543343110-3844f620cb2a?q=80&w=1200&auto=format&fit=crop'
    ],
    key_specs: {
      power: '119.35 bhp @ 6600 rpm',
      torque: '145 Nm @ 4300 rpm',
      engine: '1498 cc',
      seating: 5,
      boot_space: '506 Litres',
      ground_clearance: '165 mm'
    },
    features: ['LaneWatch Camera', 'Electric Sunroof', 'Leather Seats', 'Ambient Lighting'],
    reviews: { rating: 4.7, count: 124 },
    is_popular: false,
    is_latest: false
  },
  {
    id: 'car_005',
    make: 'Mahindra',
    model: 'Thar',
    variant: 'Armada (5-Door)',
    year: 2024,
    status: 'upcoming',
    body_type: 'SUV',
    budget_segment: '15L - 25L',
    price_ex_showroom: 1800000, // Expected
    price_on_road: 2100000, // Expected
    expected_launch: 'August 2024',
    fuel_type: 'Diesel',
    transmission: 'Automatic',
    mileage: '14.0 kmpl (Expected)',
    safety_rating: 'Expected 4 Star',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop'
    ],
    key_specs: {
      power: '130 bhp @ 3750 rpm',
      torque: '300 Nm @ 1600-2800 rpm',
      engine: '2184 cc',
      seating: 5,
      boot_space: 'TBD',
      ground_clearance: '226 mm'
    },
    features: ['Hard Top', '4x4 System', 'Larger Touchscreen', 'Rear AC Vents'],
    reviews: { rating: 0, count: 0 },
    is_popular: true,
    is_latest: false
  }
];
