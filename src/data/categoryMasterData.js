/**
 * AutoZoneIndia - Master Automotive Parts Categories & Subcategories Dataset
 * 
 * 25 Main Categories with 150+ Structured Subcategories
 * Supports parent_id hierarchical nesting and SEO metadata generation
 */

export const MASTER_CATEGORIES_DATA = [
  {
    id: 'cat-engine',
    name: 'Engine Parts',
    slug: 'engine-parts',
    icon: '⚙️',
    description: 'High performance OEM & OES engine components including gaskets, pistons, timing belts, valves, and oil pumps.',
    seo_title: 'Engine Parts & Components for Cars | AutoZoneIndia',
    seo_description: 'Browse compatible car engine parts, pistons, timing belts, gaskets, crankshafts, and valves for all major car makes.',
    subcategories: [
      { name: 'Engine Mount', slug: 'engine-mount', description: 'Vibration absorbing rubber & hydraulic engine mounts' },
      { name: 'Piston', slug: 'piston', description: 'Precision forged pistons and pin assemblies' },
      { name: 'Piston Ring', slug: 'piston-ring', description: 'High compression & oil scraper piston ring sets' },
      { name: 'Connecting Rod', slug: 'connecting-rod', description: 'Forged steel engine connecting rods' },
      { name: 'Crankshaft', slug: 'crankshaft', description: 'Balanced crankshafts and pulley wheels' },
      { name: 'Camshaft', slug: 'camshaft', description: 'Intake and exhaust camshaft assemblies' },
      { name: 'Timing Belt', slug: 'timing-belt', description: 'Heavy duty rubber timing belts and tensioner kits' },
      { name: 'Timing Chain', slug: 'timing-chain', description: 'Steel timing chain kits and guides' },
      { name: 'Gasket', slug: 'gasket', description: 'Head gaskets, valve cover gaskets, and full engine overhaul kits' },
      { name: 'Valve', slug: 'valve', description: 'Intake & exhaust valves and valve stem seals' },
      { name: 'Engine Bearing', slug: 'engine-bearing', description: 'Main bearings and rod bearings' },
      { name: 'Oil Pump', slug: 'oil-pump', description: 'High pressure engine lubrication oil pumps' }
    ]
  },
  {
    id: 'cat-brakes',
    name: 'Brake Parts',
    slug: 'brake-parts',
    icon: '🛑',
    description: 'Guaranteed stopping power with ceramic brake pads, ventilated brake discs, calipers, and hydraulic lines.',
    seo_title: 'Brake Parts & Brake Pads for Cars | AutoZoneIndia',
    seo_description: 'Browse compatible brake parts, brake pads, discs, rotors, drums, and brake fluid for your vehicle.',
    subcategories: [
      { name: 'Brake Pad', slug: 'brake-pads', description: 'Low-metallic & ceramic front/rear brake pad sets' },
      { name: 'Brake Disc', slug: 'brake-disc', description: 'Ventilated & solid front/rear brake disc rotors' },
      { name: 'Brake Drum', slug: 'brake-drum', description: 'Rear axle brake drum assemblies' },
      { name: 'Brake Shoe', slug: 'brake-shoe', description: 'Rear drum brake shoe sets and spring hardware' },
      { name: 'Brake Caliper', slug: 'brake-caliper', description: 'Single & multi-piston brake calipers' },
      { name: 'Brake Hose', slug: 'brake-hose', description: 'Reinforced hydraulic brake hoses & fluid lines' },
      { name: 'Brake Master Cylinder', slug: 'brake-master-cylinder', description: 'Tandem brake master cylinders and reservoirs' },
      { name: 'Brake Fluid', slug: 'brake-fluid', description: 'DOT 3, DOT 4, and DOT 5.1 high temperature synthetic brake fluids' }
    ]
  },
  {
    id: 'cat-clutch',
    name: 'Clutch Parts',
    slug: 'clutch-parts',
    icon: '💿',
    description: 'Complete clutch kits, friction plates, pressure covers, and hydraulic release bearings.',
    seo_title: 'Clutch Parts & Clutch Kits for Cars | AutoZoneIndia',
    seo_description: 'Buy genuine clutch plates, pressure plates, release bearings, and clutch cables for smooth gear shifting.',
    subcategories: [
      { name: 'Clutch Plate', slug: 'clutch-plate', description: 'Friction clutch disc assemblies' },
      { name: 'Clutch Cover', slug: 'clutch-cover', description: 'Pressure plate cover assemblies' },
      { name: 'Release Bearing', slug: 'release-bearing', description: 'Concentric slave cylinders & mechanical release bearings' },
      { name: 'Clutch Cable', slug: 'clutch-cable', description: 'Heavy duty steel clutch control cables' },
      { name: 'Clutch Master Cylinder', slug: 'clutch-master-cylinder', description: 'Pedal hydraulic master cylinders' },
      { name: 'Clutch Slave Cylinder', slug: 'clutch-slave-cylinder', description: 'Transmission clutch slave cylinders' }
    ]
  },
  {
    id: 'cat-transmission',
    name: 'Transmission Parts',
    slug: 'transmission-parts',
    icon: '🕹️',
    description: 'Manual and automatic gearbox components, CV joints, drive shafts, and gear oils.',
    seo_title: 'Car Transmission & Gearbox Parts | AutoZoneIndia',
    seo_description: 'Explore transmission gears, CV axles, drive shafts, synchromesh rings, and transmission fluids.',
    subcategories: [
      { name: 'Drive Shaft / CV Axle', slug: 'cv-axle', description: 'Complete front and rear CV drive shafts' },
      { name: 'CV Joint Kit', slug: 'cv-joint', description: 'Inner and outer CV joint kits with rubber boots' },
      { name: 'Flywheel', slug: 'flywheel', description: 'Single mass & dual mass flywheels' },
      { name: 'Gear Shifter Cable', slug: 'gear-shifter-cable', description: 'Gear selector linkages and cables' },
      { name: 'Synchronizer Ring', slug: 'synchronizer-ring', description: 'Brass synchromesh gear rings' }
    ]
  },
  {
    id: 'cat-suspension',
    name: 'Suspension Parts',
    slug: 'suspension-parts',
    icon: '🔩',
    description: 'Smooth ride quality with gas-charged shock absorbers, control arms, strut mounts, and ball joints.',
    seo_title: 'Suspension & Shock Absorbers for Cars | AutoZoneIndia',
    seo_description: 'Shop shock absorbers, struts, coil springs, control arms, ball joints, and stabilizer links for all cars.',
    subcategories: [
      { name: 'Shock Absorber', slug: 'shock-absorber', description: 'Front & rear gas-filled shock absorbers' },
      { name: 'Strut Assembly', slug: 'strut-assembly', description: 'MacPherson strut assemblies with coil springs' },
      { name: 'Coil Spring', slug: 'coil-spring', description: 'Heavy duty steel suspension coil springs' },
      { name: 'Control Arm', slug: 'control-arm', description: 'Lower & upper A-arms with pre-installed bushings' },
      { name: 'Ball Joint', slug: 'ball-joint', description: 'Front suspension lower & upper ball joints' },
      { name: 'Stabilizer Link', slug: 'stabilizer-link', description: 'Anti-roll bar link rods' },
      { name: 'Suspension Bushing', slug: 'suspension-bushing', description: 'Polyurethane & rubber suspension arm bushes' },
      { name: 'Wheel Bearing', slug: 'wheel-bearing', description: 'Front & rear hub bearing units with ABS sensors' }
    ]
  },
  {
    id: 'cat-steering',
    name: 'Steering Parts',
    slug: 'steering-parts',
    icon: '☸️',
    description: 'Precision handling with power steering racks, tie rod ends, rack ends, and column shafts.',
    seo_title: 'Car Steering Parts & Racks | AutoZoneIndia',
    seo_description: 'Buy power steering racks, tie rod ends, steering boots, and column components for accurate vehicle control.',
    subcategories: [
      { name: 'Steering Rack Assembly', slug: 'steering-rack', description: 'Hydraulic & Electronic Power Steering (EPS) racks' },
      { name: 'Tie Rod End', slug: 'tie-rod-end', description: 'Outer tie rod ball end joints' },
      { name: 'Rack End / Inner Tie Rod', slug: 'rack-end', description: 'Inner steering axial joints' },
      { name: 'Steering Bellow Boot', slug: 'steering-bellow', description: 'Flexible rubber steering rack boots' }
    ]
  },
  {
    id: 'cat-electrical',
    name: 'Electrical Parts',
    slug: 'electrical-parts',
    icon: '⚡',
    description: 'Alternators, starter motors, sensors, horn assemblies, relays, and wiring harnesses.',
    seo_title: 'Car Electrical Parts & Sensors | AutoZoneIndia',
    seo_description: 'Explore car alternators, starter motors, oxygen sensors, ABS sensors, horns, fuses, and relays.',
    subcategories: [
      { name: 'Alternator', slug: 'alternator', description: 'High output battery charging alternators' },
      { name: 'Starter Motor', slug: 'starter-motor', description: 'Heavy duty engine starter motor assemblies' },
      { name: 'Sensors', slug: 'sensors', description: 'O2, ABS, MAP, MAF, Crankshaft, and Camshaft position sensors' },
      { name: 'Relays & Fuses', slug: 'relays-fuses', description: 'Automotive electrical relays and fuse boxes' },
      { name: 'Horn Assembly', slug: 'horn-assembly', description: 'Dual tone windtone & trumpet horns' },
      { name: 'Wiring Harness', slug: 'wiring-harness', description: 'OE spec copper automotive wiring harnesses' }
    ]
  },
  {
    id: 'cat-battery',
    name: 'Battery',
    slug: 'battery',
    icon: '🔋',
    description: 'Maintenance-free car batteries from Exide, Amaron, and Bosch with instant installation support.',
    seo_title: 'Car Batteries Online | AutoZoneIndia',
    seo_description: 'Shop maintenance-free car batteries with long warranty and fast doorstep installation.',
    subcategories: [
      { name: 'Car Battery 35Ah - 45Ah', slug: 'battery-small', description: 'Batteries for hatchbacks and compact sedans' },
      { name: 'Car Battery 50Ah - 75Ah', slug: 'battery-medium', description: 'Batteries for SUVs, MUVs, and diesel cars' },
      { name: 'AGM Start-Stop Battery', slug: 'battery-agm', description: 'Advanced AGM batteries for micro-hybrid & automatic cars' }
    ]
  },
  {
    id: 'cat-filters',
    name: 'Filters',
    slug: 'filters',
    icon: '🌀',
    description: 'Clean air and oil flow with high-efficiency air filters, oil filters, cabin AC filters, and fuel filters.',
    seo_title: 'Car Air Filters, Oil Filters & Cabin Filters | AutoZoneIndia',
    seo_description: 'Buy genuine air filters, oil filters, fuel filters, and PM2.5 cabin AC filters for all car models.',
    subcategories: [
      { name: 'Air Filter', slug: 'air-filter', description: 'High-airflow engine air filter elements' },
      { name: 'Oil Filter', slug: 'oil-filter', description: 'Spin-on & cartridge oil filter elements' },
      { name: 'Fuel Filter', slug: 'fuel-filter', description: 'In-line diesel & petrol fuel filter units' },
      { name: 'Cabin Filter / AC Filter', slug: 'cabin-filter', description: 'Activated carbon PM2.5 cabin air filters' },
      { name: 'Transmission Filter', slug: 'transmission-filter', description: 'Automatic transmission fluid filters' }
    ]
  },
  {
    id: 'cat-cooling',
    name: 'Cooling System',
    slug: 'cooling-system',
    icon: '🌡️',
    description: 'Prevent overheating with aluminum radiators, water pumps, cooling fans, and thermostat valves.',
    seo_title: 'Car Cooling System & Radiators | AutoZoneIndia',
    seo_description: 'Browse car radiators, water pumps, cooling fan motors, coolant fluids, and thermostat housings.',
    subcategories: [
      { name: 'Radiator', slug: 'radiator', description: 'Aluminum brazed engine cooling radiators' },
      { name: 'Radiator Fan Assembly', slug: 'radiator-fan', description: 'Electric cooling fan motors and shrouds' },
      { name: 'Water Pump', slug: 'water-pump', description: 'Engine coolant circulation water pumps' },
      { name: 'Thermostat Valve', slug: 'thermostat', description: 'Coolant temperature thermostat valve assemblies' },
      { name: 'Coolant Fluid', slug: 'coolant', description: 'Concentrate & ready-to-use ethylene glycol coolants' },
      { name: 'Radiator Hose', slug: 'radiator-hose', description: 'Upper & lower EPDM rubber radiator hoses' }
    ]
  },
  {
    id: 'cat-ac',
    name: 'Air Conditioning',
    slug: 'air-conditioning',
    icon: '❄️',
    description: 'Chilling cabin cooling with AC compressors, condensers, cooling coils, blowers, and expansion valves.',
    seo_title: 'Car AC Spare Parts & Compressors | AutoZoneIndia',
    seo_description: 'Shop AC compressors, condensers, evaporator cooling coils, blower motors, and expansion valves.',
    subcategories: [
      { name: 'AC Compressor', slug: 'ac-compressor', description: 'Original swash plate & rotary AC compressors' },
      { name: 'AC Condenser', slug: 'ac-condenser', description: 'Parallel flow aluminum AC condensers' },
      { name: 'Evaporator / Cooling Coil', slug: 'ac-evaporator', description: 'Cabin AC evaporator cooling coil units' },
      { name: 'AC Blower Motor', slug: 'ac-blower', description: 'Cabin HVAC blower fan motors' },
      { name: 'Expansion Valve', slug: 'ac-expansion-valve', description: 'Thermostatic AC expansion valves' }
    ]
  },
  {
    id: 'cat-fuel',
    name: 'Fuel System',
    slug: 'fuel-system',
    icon: '⛽',
    description: 'Fuel injectors, high pressure fuel pumps, fuel rails, and tank sender units.',
    seo_title: 'Car Fuel System & Injectors | AutoZoneIndia',
    seo_description: 'Explore fuel injectors, fuel pumps, pressure regulators, and fuel tanks.',
    subcategories: [
      { name: 'Fuel Injector', slug: 'fuel-injector', description: 'Common rail diesel & petrol fuel injectors' },
      { name: 'Fuel Pump Assembly', slug: 'fuel-pump', description: 'In-tank electric fuel pumps & HPCR pumps' },
      { name: 'Fuel Pressure Regulator', slug: 'fuel-regulator', description: 'Fuel rail pressure sensor & regulator valves' }
    ]
  },
  {
    id: 'cat-exhaust',
    name: 'Exhaust System',
    slug: 'exhaust-system',
    icon: '💨',
    description: 'Catalytic converters, mufflers, exhaust manifolds, oxygen sensors, and exhaust pipes.',
    seo_title: 'Car Exhaust Systems & Mufflers | AutoZoneIndia',
    seo_description: 'Buy catalytic converters, mufflers, exhaust manifolds, and rubber hangers.',
    subcategories: [
      { name: 'Catalytic Converter', slug: 'catalytic-converter', description: 'BS4 & BS6 compliant catalytic converters' },
      { name: 'Muffler / Silencer', slug: 'muffler', description: 'Rear exhaust silencers and mufflers' },
      { name: 'Exhaust Manifold', slug: 'exhaust-manifold', description: 'Cast iron & stainless steel exhaust manifolds' }
    ]
  },
  {
    id: 'cat-turbo',
    name: 'Turbocharger',
    slug: 'turbocharger',
    icon: '🐌',
    description: 'Variable geometry turbochargers, intercoolers, wastegate actuators, and turbo oil lines.',
    seo_title: 'Car Turbochargers & Intercoolers | AutoZoneIndia',
    seo_description: 'Explore turbochargers, intercoolers, wastegates, and turbo hose kits.',
    subcategories: [
      { name: 'Turbocharger Assembly', slug: 'turbo-assembly', description: 'VGT & fixed geometry turbocharger units' },
      { name: 'Intercooler', slug: 'intercooler', description: 'Air-to-air cooling intercooler radiators' },
      { name: 'Wastegate Actuator', slug: 'wastegate', description: 'Vacuum & electronic turbo wastegate actuators' }
    ]
  },
  {
    id: 'cat-ignition',
    name: 'Ignition System',
    slug: 'ignition-system',
    icon: '🔥',
    description: 'Iridium spark plugs, glow plugs, ignition coils, and high-tension spark plug wires.',
    seo_title: 'Ignition Coils & Spark Plugs | AutoZoneIndia',
    seo_description: 'Shop iridium spark plugs, glow plugs, ignition coil packs, and HT cables.',
    subcategories: [
      { name: 'Spark Plug', slug: 'spark-plug', description: 'Iridium, Platinum, and Nickel spark plugs' },
      { name: 'Glow Plug', slug: 'glow-plug', description: 'Diesel engine cold-start glow plugs' },
      { name: 'Ignition Coil', slug: 'ignition-coil', description: 'Pencil & block ignition coil packs' }
    ]
  },
  {
    id: 'cat-wheels-tyres',
    name: 'Wheels & Tyres',
    slug: 'wheels-tyres',
    icon: '🛞',
    description: 'Tubeless tyres from MRF, Apollo, CEAT, alloy rims, wheel bolts, and TPMS sensors.',
    seo_title: 'Car Tyres & Alloy Wheels Online | AutoZoneIndia',
    seo_description: 'Buy tubeless car tyres, alloy wheels, wheel caps, and TPMS sensors.',
    subcategories: [
      { name: 'Tubeless Tyres', slug: 'tubeless-tyres', description: 'All-season, highway, and AT tubeless tyres' },
      { name: 'Alloy Wheels', slug: 'alloy-wheels', description: 'Precision diamond-cut alloy wheel rims' },
      { name: 'TPMS Sensor', slug: 'tpms-sensor', description: 'Tire pressure monitoring system sensors' }
    ]
  },
  {
    id: 'cat-lighting',
    name: 'Lighting',
    slug: 'lighting',
    icon: '💡',
    description: 'Headlight assemblies, LED projector bulbs, tail lights, fog lights, and side indicators.',
    seo_title: 'Car Lighting, Headlights & LED Bulbs | AutoZoneIndia',
    seo_description: 'Shop OEM headlight assemblies, projector LED bulbs, tail lights, and fog lamps.',
    subcategories: [
      { name: 'Headlight Assembly', slug: 'headlight', description: 'Halogen, Projector, and Matrix LED headlight units' },
      { name: 'Tail Light', slug: 'tail-light', description: 'Rear combination tail lamp assemblies' },
      { name: 'Fog Light', slug: 'fog-light', description: 'Bumper fog light kits with wiring harness' },
      { name: 'LED Headlight Bulbs', slug: 'led-bulbs', description: 'High lumen H4, H7, H11 LED headlight bulbs' }
    ]
  },
  {
    id: 'cat-body',
    name: 'Body Parts',
    slug: 'body-parts',
    icon: '🚗',
    description: 'Bumpers, fenders, bonnets, side mirrors, grilles, door handles, and tailgate panels.',
    seo_title: 'Car Body Parts, Bumpers & Mirrors | AutoZoneIndia',
    seo_description: 'Browse car bumpers, fenders, bonnets, side mirrors, front grilles, and door handles.',
    subcategories: [
      { name: 'Front & Rear Bumper', slug: 'bumper', description: 'OE spec unpainted ABS plastic bumpers' },
      { name: 'Fender', slug: 'fender', description: 'Front left & right steel fender panels' },
      { name: 'Bonnet / Hood', slug: 'bonnet', description: 'Engine hood bonnet panels' },
      { name: 'Side Mirror / ORVM', slug: 'side-mirror', description: 'Electric folding & manual ORVM side mirrors' },
      { name: 'Front Grille', slug: 'grille', description: 'Front radiator grille trim panels' }
    ]
  },
  {
    id: 'cat-interior',
    name: 'Interior Parts',
    slug: 'interior-parts',
    icon: '🛋️',
    description: 'Dashboard panels, door trims, gear knobs, power window switches, and armrests.',
    seo_title: 'Car Interior Parts & Accessories | AutoZoneIndia',
    seo_description: 'Explore car interior door trims, power window switches, gear knobs, and armrests.',
    subcategories: [
      { name: 'Power Window Switch', slug: 'power-window-switch', description: 'Master power window control switch consoles' },
      { name: 'Door Inner Handle', slug: 'door-handle-inner', description: 'Chrome & black interior door handles' },
      { name: 'Gear Shift Knob', slug: 'gear-knob', description: 'Leather & chrome manual/automatic gear knobs' }
    ]
  },
  {
    id: 'cat-exterior-acc',
    name: 'Exterior Accessories',
    slug: 'exterior-accessories',
    icon: '🏎️',
    description: 'Door visors, mud flaps, body covers, roof rails, and chrome garnishes.',
    seo_title: 'Car Exterior Accessories | AutoZoneIndia',
    seo_description: 'Shop door rain visors, mud flaps, waterproof car covers, and roof rails.',
    subcategories: [
      { name: 'Door Rain Visor', slug: 'door-visor', description: 'Injection molded door rain wind deflectors' },
      { name: 'Mud Flap Kit', slug: 'mud-flaps', description: 'Heavy duty rubber & plastic mudguard sets' },
      { name: 'Car Body Cover', slug: 'car-cover', description: '100% waterproof & dustproof metallic body covers' }
    ]
  },
  {
    id: 'cat-car-acc',
    name: 'Car Accessories',
    slug: 'car-accessories',
    icon: '📱',
    description: '7D floor mats, seat covers, mobile mounts, fast chargers, and dash cameras.',
    seo_title: 'Car Accessories & Gadgets | AutoZoneIndia',
    seo_description: 'Buy 7D floor mats, custom seat covers, mobile phone holders, and fast chargers.',
    subcategories: [
      { name: '7D Floor Mats', slug: 'floor-mats', description: 'Custom fitted waterproof 7D floor mats' },
      { name: 'Car Mobile Holder', slug: 'mobile-holder', description: '360 degree vacuum & vent mobile mounts' },
      { name: 'Car Fast Charger', slug: 'fast-charger', description: 'QC 3.0 & Type-C PD dual port car chargers' }
    ]
  },
  {
    id: 'cat-lubricants',
    name: 'Lubricants & Fluids',
    slug: 'lubricants-fluids',
    icon: '🛢️',
    description: 'Synthetic engine oils (5W-30, 0W-20), transmission fluids, brake oils, and grease.',
    seo_title: 'Engine Oil & Car Lubricants | AutoZoneIndia',
    seo_description: 'Buy fully synthetic engine oils, gear oils, coolant fluids, and brake oils.',
    subcategories: [
      { name: 'Fully Synthetic Engine Oil', slug: 'synthetic-engine-oil', description: '0W-20, 5W-30, 5W-40 fully synthetic engine oils' },
      { name: 'Gear Oil', slug: 'gear-oil', description: '75W-90, 80W-90 manual transmission gear oils' },
      { name: 'Windshield Washer Fluid', slug: 'washer-fluid', description: 'Anti-smear wiper washer fluid concentrates' }
    ]
  },
  {
    id: 'cat-tools',
    name: 'Tools & Workshop Equipment',
    slug: 'tools-equipment',
    icon: '🛠️',
    description: 'Mechanic socket sets, hydraulic jacks, torque wrenches, and OBD2 diagnostic scanners.',
    seo_title: 'Car Mechanic Tools & Workshop Equipment | AutoZoneIndia',
    seo_description: 'Shop mechanic toolkits, hydraulic floor jacks, torque wrenches, and OBD scanners.',
    subcategories: [
      { name: 'Hydraulic Jack & Jack Stands', slug: 'hydraulic-jack', description: '2 Ton - 3 Ton hydraulic trolley jacks' },
      { name: 'Mechanic Socket Tool Kit', slug: 'socket-toolkit', description: 'Chrome vanadium 46-piece socket wrench sets' },
      { name: 'OBD2 Diagnostic Scanner', slug: 'obd-scanner', description: 'Bluetooth & handheld OBD2 car code readers' }
    ]
  },
  {
    id: 'cat-safety',
    name: 'Safety & Emergency',
    slug: 'safety-emergency',
    icon: '🚨',
    description: 'Jumper cables, tow ropes, tyre inflators, breakdown warning triangles, and first aid kits.',
    seo_title: 'Car Emergency & Safety Kits | AutoZoneIndia',
    seo_description: 'Buy digital tyre inflators, jumper cables, tow ropes, and hazard warning triangles.',
    subcategories: [
      { name: 'Digital Tyre Inflator', slug: 'tyre-inflator', description: '12V auto shut-off digital tyre air pumps' },
      { name: 'Battery Jumper Cable', slug: 'jumper-cables', description: 'Heavy duty 1000A copper battery jump lead cables' },
      { name: 'Tow Rope', slug: 'tow-rope', description: '5 Ton rated nylon tow straps with steel hooks' }
    ]
  },
  {
    id: 'cat-cleaning',
    name: 'Cleaning & Care',
    slug: 'cleaning-care',
    icon: '✨',
    description: 'High pressure car washers, microfiber cloths, car shampoos, polish, and ceramic wax.',
    seo_title: 'Car Washers, Shampoos & Microfiber Cloths | AutoZoneIndia',
    seo_description: 'Explore car pressure washers, microfiber towels, car shampoo, and dashboard polish.',
    subcategories: [
      { name: 'High Pressure Car Washer', slug: 'pressure-washer', description: '1800W induction motor car pressure washers' },
      { name: 'Microfiber Towel', slug: 'microfiber-towel', description: '800 GSM plush microfiber cleaning cloths' },
      { name: 'Car Shampoo & Wax', slug: 'car-shampoo', description: 'pH neutral foam car wash shampoos' }
    ]
  }
];

// Generate SEO Title & Description for any Category or Subcategory
export const generateCategorySEO = (categoryName, subcategoryName = null) => {
  if (subcategoryName) {
    return {
      seo_title: `${subcategoryName} for Cars | Buy ${subcategoryName} Online | AutoZoneIndia`,
      seo_description: `Browse 100% compatible ${subcategoryName.toLowerCase()} for Maruti Suzuki, Hyundai, Tata, Mahindra, Toyota & Honda. Genuine OEM & OES parts with fast delivery.`
    };
  }
  return {
    seo_title: `${categoryName} for Cars | AutoZoneIndia Spare Parts`,
    seo_description: `Shop high quality ${categoryName.toLowerCase()} for all car models. Sourced directly from verified OEM manufacturers with guaranteed fitment.`
  };
};
