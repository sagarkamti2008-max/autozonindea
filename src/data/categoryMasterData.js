/**
 * AutoZoneIndia - Master Automotive Parts Categories & Subcategories Dataset (System 4 Taxonomy)
 * 
 * 29 Main Categories with Category-Dependent Subcategories and Part Types
 * Supports parent-child hierarchical nesting, validation, and dynamic SEO metadata.
 */

export const MASTER_CATEGORIES_DATA = [
  {
    id: 'cat-engine',
    name: 'Engine',
    slug: 'engine',
    icon: '⚙️',
    description: 'High performance OEM & OES engine components including pistons, gaskets, timing belts, valves, and oil pumps.',
    seo_title: 'Engine Parts, Pistons & Gaskets for Cars | AutoZoneIndia',
    seo_description: 'Browse compatible engine components, pistons, timing belts, head gaskets, crankshafts, and valves for all car makes.',
    subcategories: [
      { name: 'Piston', slug: 'piston', partTypes: ['Piston', 'Piston Pin', 'Piston Kit'] },
      { name: 'Piston Rings', slug: 'piston-rings', partTypes: ['Piston Ring Set', 'Compression Ring', 'Oil Control Ring'] },
      { name: 'Cylinder Head', slug: 'cylinder-head', partTypes: ['Cylinder Head Assembly', 'Head Bolt Set', 'Valve Cover'] },
      { name: 'Cylinder Block', slug: 'cylinder-block', partTypes: ['Cylinder Liner', 'Engine Block', 'Main Bearing Set'] },
      { name: 'Connecting Rod', slug: 'connecting-rod', partTypes: ['Connecting Rod', 'Rod Bearing Set', 'Rod Bolt'] },
      { name: 'Crankshaft', slug: 'crankshaft', partTypes: ['Crankshaft', 'Crankshaft Pulley', 'Harmonic Balancer'] },
      { name: 'Camshaft', slug: 'camshaft', partTypes: ['Camshaft', 'Camshaft Gear', 'Camshaft Bushing'] },
      { name: 'Engine Valve', slug: 'engine-valve', partTypes: ['Intake Valve', 'Exhaust Valve', 'Valve Rocker Arm'] },
      { name: 'Valve Guide', slug: 'valve-guide', partTypes: ['Intake Valve Guide', 'Exhaust Valve Guide'] },
      { name: 'Valve Seal', slug: 'valve-seal', partTypes: ['Valve Stem Seal Kit'] },
      { name: 'Timing Components', slug: 'timing-components', partTypes: ['Timing Belt', 'Timing Chain', 'Timing Belt Kit', 'Tensioner Pulley'] },
      { name: 'Engine Mount', slug: 'engine-mount', partTypes: ['Front Engine Mount', 'Rear Engine Mount', 'Transmission Mount'] },
      { name: 'Engine Gasket', slug: 'engine-gasket', partTypes: ['Head Gasket', 'Valve Cover Gasket', 'Full Overhaul Gasket Kit'] },
      { name: 'Oil Pump', slug: 'oil-pump', partTypes: ['Engine Oil Pump', 'Oil Pump Strainer', 'Oil Pump Drive Chain'] },
      { name: 'Water Pump', slug: 'water-pump', partTypes: ['Engine Water Pump', 'Water Pump Housing'] }
    ]
  },
  {
    id: 'cat-cooling',
    name: 'Engine Cooling System',
    slug: 'engine-cooling-system',
    icon: '🌡️',
    description: 'Prevent engine overheating with radiators, water pumps, cooling fans, and thermostat assemblies.',
    seo_title: 'Car Engine Cooling System & Radiators | AutoZoneIndia',
    seo_description: 'Browse car radiators, water pumps, cooling fan motors, coolant fluids, and thermostat housings.',
    subcategories: [
      { name: 'Radiator', slug: 'radiator', partTypes: ['Aluminum Radiator', 'Radiator Core'] },
      { name: 'Radiator Fan', slug: 'radiator-fan', partTypes: ['Cooling Fan Assembly', 'Radiator Fan Blade'] },
      { name: 'Radiator Fan Motor', slug: 'radiator-fan-motor', partTypes: ['Electric Fan Motor', 'Fan Resistor'] },
      { name: 'Water Pump', slug: 'cooling-water-pump', partTypes: ['Coolant Water Pump', 'Auxiliary Water Pump'] },
      { name: 'Thermostat', slug: 'thermostat', partTypes: ['Thermostat Valve', 'Coolant Thermostat'] },
      { name: 'Thermostat Housing', slug: 'thermostat-housing', partTypes: ['Thermostat Assembly Cover'] },
      { name: 'Radiator Hose', slug: 'radiator-hose', partTypes: ['Upper Radiator Hose', 'Lower Radiator Hose'] },
      { name: 'Coolant Hose', slug: 'coolant-hose', partTypes: ['Heater Core Hose', 'Bypass Hose'] },
      { name: 'Expansion Tank', slug: 'expansion-tank', partTypes: ['Coolant Overflow Reservoir Tank'] },
      { name: 'Radiator Cap', slug: 'radiator-cap', partTypes: ['High Pressure Radiator Cap'] },
      { name: 'Coolant Temperature Sensor', slug: 'coolant-temp-sensor', partTypes: ['ECT Sensor', 'Water Temp Gauge Sender'] },
      { name: 'Intercooler', slug: 'intercooler', partTypes: ['Turbocharged Air Intercooler'] },
      { name: 'Intercooler Hose', slug: 'intercooler-hose', partTypes: ['Silicon Turbo Intercooler Pipe'] }
    ]
  },
  {
    id: 'cat-brakes',
    name: 'Brake System',
    slug: 'brake-system',
    icon: '🛑',
    description: 'Guaranteed stopping power with ceramic brake pads, ventilated brake discs, calipers, and hydraulic lines.',
    seo_title: 'Brake Parts, Brake Pads & Discs for Cars | AutoZoneIndia',
    seo_description: 'Browse compatible brake parts, brake pads, discs, rotors, drums, and brake fluid for your vehicle.',
    subcategories: [
      { name: 'Brake Pad', slug: 'brake-pad', partTypes: ['Front Brake Pad Set', 'Rear Brake Pad Set', 'Ceramic Brake Pads'] },
      { name: 'Brake Disc', slug: 'brake-disc', partTypes: ['Ventilated Brake Rotor', 'Solid Brake Rotor'] },
      { name: 'Brake Drum', slug: 'brake-drum', partTypes: ['Rear Brake Drum Assembly'] },
      { name: 'Brake Shoe', slug: 'brake-shoe', partTypes: ['Rear Drum Brake Shoe Kit'] },
      { name: 'Brake Caliper', slug: 'brake-caliper', partTypes: ['Front Brake Caliper', 'Rear Brake Caliper'] },
      { name: 'Brake Caliper Repair Kit', slug: 'brake-caliper-repair-kit', partTypes: ['Caliper Seal Kit', 'Guide Pin Kit'] },
      { name: 'Brake Master Cylinder', slug: 'brake-master-cylinder', partTypes: ['Tandem Master Cylinder'] },
      { name: 'Brake Wheel Cylinder', slug: 'brake-wheel-cylinder', partTypes: ['Rear Wheel Cylinder Assembly'] },
      { name: 'Brake Hose', slug: 'brake-hose', partTypes: ['Hydraulic Flexible Brake Line Hose'] },
      { name: 'Brake Line', slug: 'brake-line', partTypes: ['Steel Brake Line Pipe'] },
      { name: 'Brake Booster', slug: 'brake-booster', partTypes: ['Vacuum Brake Servo Booster'] },
      { name: 'ABS Sensor', slug: 'abs-sensor', partTypes: ['Front ABS Speed Sensor', 'Rear ABS Speed Sensor'] },
      { name: 'ABS Ring', slug: 'abs-ring', partTypes: ['Wheel Speed Reluctor Ring'] },
      { name: 'Brake Fluid', slug: 'brake-fluid-sub', partTypes: ['DOT 3 Brake Fluid', 'DOT 4 Synthetic Brake Fluid', 'DOT 5.1 Fluid'] },
      { name: 'Brake Wear Sensor', slug: 'brake-wear-sensor', partTypes: ['Electronic Brake Pad Wear Indicator'] }
    ]
  },
  {
    id: 'cat-clutch',
    name: 'Clutch System',
    slug: 'clutch-system',
    icon: '💿',
    description: 'Complete clutch kits, friction plates, pressure covers, and hydraulic release bearings.',
    seo_title: 'Clutch Parts & Clutch Kits for Cars | AutoZoneIndia',
    seo_description: 'Buy genuine clutch plates, pressure plates, release bearings, and clutch cables for smooth gear shifting.',
    subcategories: [
      { name: 'Clutch Plate', slug: 'clutch-plate', partTypes: ['Friction Clutch Disc'] },
      { name: 'Clutch Cover', slug: 'clutch-cover', partTypes: ['Pressure Plate Cover Assembly'] },
      { name: 'Clutch Release Bearing', slug: 'clutch-release-bearing', partTypes: ['Concentric Slave Cylinder', 'Mechanical Release Bearing'] },
      { name: 'Flywheel', slug: 'clutch-flywheel', partTypes: ['Single Mass Flywheel', 'Dual Mass Flywheel (DMF)'] },
      { name: 'Clutch Master Cylinder', slug: 'clutch-master-cylinder', partTypes: ['Pedal Hydraulic Master Cylinder'] },
      { name: 'Clutch Slave Cylinder', slug: 'clutch-slave-cylinder', partTypes: ['Transmission Hydraulic Slave Cylinder'] },
      { name: 'Clutch Cable', slug: 'clutch-cable', partTypes: ['Manual Clutch Control Cable'] },
      { name: 'Clutch Repair Kit', slug: 'clutch-repair-kit', partTypes: ['3-Piece Full Clutch Kit'] }
    ]
  },
  {
    id: 'cat-transmission',
    name: 'Transmission',
    slug: 'transmission',
    icon: '🕹️',
    description: 'Manual and automatic gearbox components, CV joints, drive shafts, solenoids, and gear oils.',
    seo_title: 'Car Transmission & Gearbox Parts | AutoZoneIndia',
    seo_description: 'Explore transmission gears, CV axles, drive shafts, synchromesh rings, solenoids, and transmission fluids.',
    subcategories: [
      { name: 'Transmission Filter', slug: 'trans-filter', partTypes: ['Automatic Gearbox Oil Filter'] },
      { name: 'Transmission Oil Pan', slug: 'trans-oil-pan', partTypes: ['Gearbox Sump Pan'] },
      { name: 'Transmission Gasket', slug: 'trans-gasket', partTypes: ['Transmission Pan Gasket'] },
      { name: 'Transmission Mount', slug: 'trans-mount', partTypes: ['Gearbox Rear Rubber Mount'] },
      { name: 'Clutch Plate', slug: 'trans-clutch-plate', partTypes: ['Gearbox Clutch Disc'] },
      { name: 'Clutch Cover', slug: 'trans-clutch-cover', partTypes: ['Pressure Plate Cover'] },
      { name: 'Clutch Release Bearing', slug: 'trans-release-bearing', partTypes: ['Release Bearing Assembly'] },
      { name: 'Flywheel', slug: 'trans-flywheel', partTypes: ['Flywheel Ring Gear'] },
      { name: 'Torque Converter', slug: 'torque-converter', partTypes: ['Automatic Torque Converter Assembly'] },
      { name: 'Gearbox Sensor', slug: 'gearbox-sensor', partTypes: ['Speed Sensor', 'Neutral Position Sensor'] },
      { name: 'Transmission Solenoid', slug: 'trans-solenoid', partTypes: ['Shift Control Solenoid Valve'] },
      { name: 'Transmission Oil', slug: 'trans-oil', partTypes: ['ATF Fluid', 'CVT Fluid', '75W-90 Gear Oil'] },
      { name: 'CV Axle', slug: 'cv-axle', partTypes: ['Front Drive Shaft Assembly'] },
      { name: 'CV Joint', slug: 'cv-joint', partTypes: ['Outer CV Joint Kit', 'Inner CV Joint Kit'] }
    ]
  },
  {
    id: 'cat-suspension',
    name: 'Suspension and Arms',
    slug: 'suspension-and-arms',
    icon: '🔩',
    description: 'Smooth ride quality with gas-charged shock absorbers, control arms, strut mounts, and ball joints.',
    seo_title: 'Suspension & Shock Absorbers for Cars | AutoZoneIndia',
    seo_description: 'Shop shock absorbers, struts, coil springs, control arms, ball joints, and stabilizer links for all cars.',
    subcategories: [
      { name: 'Shock Absorber', slug: 'shock-absorber', partTypes: ['Front Shock Absorber', 'Rear Shock Absorber'] },
      { name: 'Strut', slug: 'strut', partTypes: ['MacPherson Strut Assembly'] },
      { name: 'Coil Spring', slug: 'coil-spring', partTypes: ['Front Coil Spring', 'Rear Coil Spring'] },
      { name: 'Leaf Spring', slug: 'leaf-spring', partTypes: ['Rear Suspension Leaf Spring Assembly'] },
      { name: 'Control Arm', slug: 'control-arm', partTypes: ['Lower Control Arm', 'Upper Control Arm', 'A-Arm'] },
      { name: 'Ball Joint', slug: 'ball-joint', partTypes: ['Lower Suspension Ball Joint', 'Upper Ball Joint'] },
      { name: 'Stabilizer Link', slug: 'stabilizer-link', partTypes: ['Sway Bar Link Rod'] },
      { name: 'Stabilizer Bushing', slug: 'stabilizer-bushing', partTypes: ['Anti-Roll Bar Rubber Bush'] },
      { name: 'Suspension Bushing', slug: 'suspension-bushing', partTypes: ['Control Arm Bushing Set'] },
      { name: 'Tie Rod End', slug: 'suspension-tie-rod-end', partTypes: ['Outer Tie Rod End'] },
      { name: 'Track Rod', slug: 'track-rod', partTypes: ['Rear Suspension Track Rod'] },
      { name: 'Wheel Hub', slug: 'wheel-hub', partTypes: ['Front Wheel Hub Flange', 'Rear Wheel Hub'] },
      { name: 'Wheel Bearing', slug: 'wheel-bearing', partTypes: ['Wheel Bearing Kit with ABS Sensor'] },
      { name: 'Suspension Mount', slug: 'suspension-mount', partTypes: ['Strut Mounting Bearing Top Cushion'] }
    ]
  },
  {
    id: 'cat-steering',
    name: 'Steering',
    slug: 'steering',
    icon: '☸️',
    description: 'Precision handling with power steering racks, tie rod ends, rack ends, and column shafts.',
    seo_title: 'Car Steering Parts & Racks | AutoZoneIndia',
    seo_description: 'Buy power steering racks, tie rod ends, steering boots, and column components for accurate vehicle control.',
    subcategories: [
      { name: 'Steering Rack', slug: 'steering-rack', partTypes: ['EPS Electronic Steering Rack', 'Hydraulic Steering Rack'] },
      { name: 'Steering Pump', slug: 'steering-pump', partTypes: ['Power Steering Vane Pump'] },
      { name: 'Steering Column', slug: 'steering-column', partTypes: ['Universal Joint Steering Column Shaft'] },
      { name: 'Tie Rod', slug: 'tie-rod', partTypes: ['Inner Tie Rod / Axial Joint'] },
      { name: 'Tie Rod End', slug: 'steering-tie-rod-end', partTypes: ['Outer Steering Tie Rod Ball Joint'] },
      { name: 'Steering Knuckle', slug: 'steering-knuckle', partTypes: ['Front Wheel Stub Axle Steering Knuckle'] },
      { name: 'Power Steering Hose', slug: 'power-steering-hose', partTypes: ['High Pressure Steering Fluid Pipe'] },
      { name: 'Steering Boot', slug: 'steering-boot', partTypes: ['Rubber Steering Gear Bellow Boot'] },
      { name: 'Steering Joint', slug: 'steering-joint', partTypes: ['Steering Shaft Cross Joint'] }
    ]
  },
  {
    id: 'cat-electrical',
    name: 'Electric Components',
    slug: 'electric-components',
    icon: '⚡',
    description: 'Alternators, starter motors, sensors, horn assemblies, relays, and wiring harnesses.',
    seo_title: 'Car Electrical Parts & Components | AutoZoneIndia',
    seo_description: 'Explore car alternators, starter motors, battery units, fuses, relays, horns, and wiring harnesses.',
    subcategories: [
      { name: 'Starter Motor', slug: 'starter-motor', partTypes: ['Engine Starter Motor Assembly', 'Starter Solenoid Switch'] },
      { name: 'Alternator', slug: 'alternator', partTypes: ['Battery Charging Alternator', 'Alternator Pulley'] },
      { name: 'Battery', slug: 'battery', partTypes: ['35Ah Car Battery', '45Ah Car Battery', '65Ah Car Battery', 'AGM Battery'] },
      { name: 'Fuse', slug: 'fuse', partTypes: ['Blade Fuse Kit', 'High Amperage Maxi Fuse'] },
      { name: 'Relay', slug: 'relay', partTypes: ['4-Pin 12V Relay', '5-Pin Automotive Relay'] },
      { name: 'Starter Relay', slug: 'starter-relay', partTypes: ['High Power Ignition Starter Relay'] },
      { name: 'Horn', slug: 'horn', partTypes: ['Dual Windtone Horn Set', 'Trumpet Horn'] },
      { name: 'Wiring Harness', slug: 'wiring-harness', partTypes: ['Engine Wiring Loom', 'Headlight Wiring Harness with Relay'] },
      { name: 'Battery Cable', slug: 'battery-cable', partTypes: ['Positive Battery Cable', 'Negative Ground Strap'] },
      { name: 'Ignition Switch', slug: 'ignition-switch', partTypes: ['Key Starter Switch Lock Cylinder'] },
      { name: 'Window Motor', slug: 'window-motor', partTypes: ['Power Window Regulator Motor'] },
      { name: 'Blower Motor', slug: 'blower-motor', partTypes: ['HVAC Heater Blower Fan Motor'] },
      { name: 'Electric Motor', slug: 'electric-motor', partTypes: ['Wiper Motor', 'Radiator Fan Motor'] },
      { name: 'Voltage Regulator', slug: 'voltage-regulator', partTypes: ['Alternator Voltage Regulator Rectifier'] }
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
      { name: 'Engine Air Filter', slug: 'engine-air-filter', partTypes: ['Pleated Paper Air Filter', 'High Flow Air Filter'] },
      { name: 'Oil Filter', slug: 'oil-filter', partTypes: ['Spin-On Oil Filter', 'Cartridge Element Oil Filter'] },
      { name: 'Fuel Filter', slug: 'fuel-filter', partTypes: ['In-Line Fuel Filter', 'Diesel Fuel Filter Assembly'] },
      { name: 'Cabin Air Filter', slug: 'cabin-air-filter', partTypes: ['Activated Carbon Cabin Filter', 'PM2.5 Dust Filter'] },
      { name: 'AC Filter', slug: 'ac-filter', partTypes: ['AC Evaporator Air Filter Element'] },
      { name: 'Transmission Filter', slug: 'trans-filter-sub', partTypes: ['Automatic Transmission Strainer Filter'] },
      { name: 'Hydraulic Filter', slug: 'hydraulic-filter', partTypes: ['Steering & Hydraulic Fluid Filter'] },
      { name: 'Diesel Fuel Filter', slug: 'diesel-fuel-filter', partTypes: ['Water Separator Diesel Filter'] },
      { name: 'Air Dryer Filter', slug: 'air-dryer-filter', partTypes: ['Brake Air Dryer Cartridge'] }
    ]
  },
  {
    id: 'cat-fuel',
    name: 'Fuel Supply System',
    slug: 'fuel-supply-system',
    icon: '⛽',
    description: 'Fuel injectors, high pressure fuel pumps, fuel rails, and tank sender units.',
    seo_title: 'Car Fuel System & Injectors | AutoZoneIndia',
    seo_description: 'Explore fuel injectors, fuel pumps, pressure regulators, fuel rails, and fuel tanks.',
    subcategories: [
      { name: 'Fuel Injector', slug: 'fuel-injector', partTypes: ['Common Rail Diesel Injector', 'Petrol MPFI Injector'] },
      { name: 'Fuel Pump', slug: 'fuel-pump', partTypes: ['In-Tank Electric Fuel Pump', 'Low Pressure Fuel Pump'] },
      { name: 'High Pressure Fuel Pump', slug: 'hp-fuel-pump', partTypes: ['CRDI High Pressure Fuel Pump'] },
      { name: 'Fuel Rail', slug: 'fuel-rail', partTypes: ['Fuel Delivery Rail Bar'] },
      { name: 'Fuel Pressure Regulator', slug: 'fuel-pressure-regulator', partTypes: ['Fuel Pressure Control Valve'] },
      { name: 'Fuel Tank', slug: 'fuel-tank', partTypes: ['Plastic/Metal Fuel Tank Assembly'] },
      { name: 'Fuel Tank Cap', slug: 'fuel-tank-cap', partTypes: ['Lockable Fuel Filler Cap'] },
      { name: 'Fuel Hose', slug: 'fuel-hose', partTypes: ['Reinforced Rubber Fuel Return Hose'] }
    ]
  },
  {
    id: 'cat-ignition',
    name: 'Ignition and Glowplug System',
    slug: 'ignition-and-glowplug-system',
    icon: '🔥',
    description: 'Iridium spark plugs, glow plugs, ignition coils, and high-tension spark plug wires.',
    seo_title: 'Ignition Coils, Spark Plugs & Glow Plugs | AutoZoneIndia',
    seo_description: 'Shop iridium spark plugs, diesel glow plugs, ignition coil packs, and HT cables.',
    subcategories: [
      { name: 'Spark Plug', slug: 'spark-plug', partTypes: ['Iridium Spark Plug', 'Platinum Spark Plug', 'Nickel Spark Plug'] },
      { name: 'Glow Plug', slug: 'glow-plug', partTypes: ['Diesel Cold-Start Glow Plug'] },
      { name: 'Ignition Coil', slug: 'ignition-coil', partTypes: ['Pencil Ignition Coil', 'Block Coil Pack'] },
      { name: 'Ignition Wire', slug: 'ignition-wire', partTypes: ['High Tension Ignition Wire Set'] },
      { name: 'HT Cable', slug: 'ht-cable', partTypes: ['Silicone Core HT Cable'] },
      { name: 'Distributor', slug: 'distributor', partTypes: ['Ignition Distributor Cap & Rotor'] }
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
      { name: 'AC Compressor', slug: 'ac-compressor', partTypes: ['Original Swash Plate AC Compressor', 'Compressor Clutch'] },
      { name: 'AC Condenser', slug: 'ac-condenser', partTypes: ['Aluminum Parallel Flow AC Condenser'] },
      { name: 'AC Evaporator', slug: 'ac-evaporator', partTypes: ['Cabin AC Cooling Coil Evaporator'] },
      { name: 'AC Expansion Valve', slug: 'ac-expansion-valve', partTypes: ['Thermostatic Block Expansion Valve'] },
      { name: 'AC Receiver Drier', slug: 'ac-receiver-drier', partTypes: ['AC Filter Drier Bottle'] },
      { name: 'AC Filter', slug: 'ac-filter-sub', partTypes: ['Cabin Fresh Air AC Filter'] },
      { name: 'Blower Motor', slug: 'ac-blower-motor', partTypes: ['HVAC Blower Motor Fan'] },
      { name: 'Blower Resistor', slug: 'ac-blower-resistor', partTypes: ['Heater Blower Control Resistor'] },
      { name: 'AC Pressure Sensor', slug: 'ac-pressure-sensor', partTypes: ['AC Trinary Pressure Switch Sensor'] },
      { name: 'AC Hose', slug: 'ac-hose', partTypes: ['High Pressure AC Hose'] },
      { name: 'AC Pipe', slug: 'ac-pipe', partTypes: ['Aluminum AC Suction Pipe'] }
    ]
  },
  {
    id: 'cat-exhaust',
    name: 'Exhaust System',
    slug: 'exhaust-system',
    icon: '💨',
    description: 'Catalytic converters, mufflers, exhaust manifolds, oxygen sensors, and exhaust pipes.',
    seo_title: 'Car Exhaust Systems & Mufflers | AutoZoneIndia',
    seo_description: 'Buy catalytic converters, mufflers, exhaust manifolds, DPF filters, and oxygen sensors.',
    subcategories: [
      { name: 'Catalytic Converter', slug: 'catalytic-converter', partTypes: ['BS4 Catalytic Converter', 'BS6 Catalytic Converter'] },
      { name: 'Muffler', slug: 'muffler', partTypes: ['Rear Exhaust Silencer Muffler'] },
      { name: 'Exhaust Manifold', slug: 'exhaust-manifold', partTypes: ['Cast Iron Exhaust Manifold'] },
      { name: 'Exhaust Pipe', slug: 'exhaust-pipe', partTypes: ['Flex Pipe Center Exhaust Section'] },
      { name: 'Oxygen Sensor', slug: 'oxygen-sensor', partTypes: ['Upstream O2 Sensor', 'Downstream O2 Sensor'] },
      { name: 'DPF Filter', slug: 'dpf-filter', partTypes: ['Diesel Particulate Filter Assembly'] },
      { name: 'Exhaust Gasket', slug: 'exhaust-gasket', partTypes: ['Exhaust Manifold Gasket'] }
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
      { name: 'Headlight', slug: 'headlight', partTypes: ['Halogen Headlight Assembly', 'Projector LED Headlight'] },
      { name: 'Tail Light', slug: 'tail-light', partTypes: ['Rear Combination Tail Lamp'] },
      { name: 'Fog Light', slug: 'fog-light', partTypes: ['Front Bumper Fog Lamp Kit'] },
      { name: 'Daytime Running Light', slug: 'drl', partTypes: ['LED DRL Light Bar'] },
      { name: 'Indicator', slug: 'indicator', partTypes: ['Side Mirror Turn Signal Indicator'] },
      { name: 'Brake Light', slug: 'brake-light', partTypes: ['High Mount Stop Brake Light'] },
      { name: 'Reverse Light', slug: 'reverse-light', partTypes: ['Backing Reverse Lamp Bulb'] },
      { name: 'Number Plate Light', slug: 'number-plate-light', partTypes: ['License Plate LED Light'] },
      { name: 'Bulb', slug: 'bulb', partTypes: ['H4 Halogen Bulb', 'H7 Halogen Bulb', 'H11 Bulb'] },
      { name: 'LED Bulb', slug: 'led-bulb', partTypes: ['High Lumen H4 LED Conversion Kit'] },
      { name: 'Headlight Motor', slug: 'headlight-motor', partTypes: ['Headlight Leveling Adjuster Motor'] }
    ]
  },
  {
    id: 'cat-body',
    name: 'Body',
    slug: 'body',
    icon: '🚗',
    description: 'Bumpers, fenders, bonnets, side mirrors, grilles, door handles, and tailgate panels.',
    seo_title: 'Car Body Parts, Bumpers & Mirrors | AutoZoneIndia',
    seo_description: 'Browse car bumpers, fenders, bonnets, side mirrors, front grilles, and door handles.',
    subcategories: [
      { name: 'Bumper', slug: 'bumper', partTypes: ['Front Bumper Cover', 'Rear Bumper Cover'] },
      { name: 'Bonnet', slug: 'bonnet', partTypes: ['Engine Hood Bonnet Panel'] },
      { name: 'Fender', slug: 'fender', partTypes: ['Front Left Fender', 'Front Right Fender'] },
      { name: 'Door', slug: 'door', partTypes: ['Front Door Shell', 'Rear Door Shell'] },
      { name: 'Door Handle', slug: 'door-handle', partTypes: ['Outer Chrome Door Handle', 'Black Outer Door Handle'] },
      { name: 'Door Lock', slug: 'door-lock', partTypes: ['Central Door Lock Actuator Mechanism'] },
      { name: 'Mirror', slug: 'mirror', partTypes: ['Electric Folding ORVM Side Mirror', 'Manual Side Mirror'] },
      { name: 'Grille', slug: 'grille', partTypes: ['Front Bumper Lower Grille'] },
      { name: 'Radiator Grille', slug: 'radiator-grille', partTypes: ['Chrome Radiator Grille Assembly'] },
      { name: 'Tailgate', slug: 'tailgate', partTypes: ['Boot Lid Hatchback Tailgate Panel'] },
      { name: 'Boot Lid', slug: 'boot-lid', partTypes: ['Trunk Boot Lid'] },
      { name: 'Door Hinge', slug: 'door-hinge', partTypes: ['Upper Door Hinge', 'Lower Door Hinge'] },
      { name: 'Bonnet Hinge', slug: 'bonnet-hinge', partTypes: ['Hood Bonnet Support Hinge Bracket'] },
      { name: 'Window Regulator', slug: 'window-regulator', partTypes: ['Electric Power Window Regulator Mechanism'] },
      { name: 'Window Glass', slug: 'window-glass', partTypes: ['Door Glass', 'Windshield Glass'] }
    ]
  },
  {
    id: 'cat-interior',
    name: 'Interior and Comfort',
    slug: 'interior-and-comfort',
    icon: '🛋️',
    description: 'Dashboard panels, door trims, seat covers, power window switches, and infotainment accessories.',
    seo_title: 'Car Interior Parts & Comfort | AutoZoneIndia',
    seo_description: 'Explore car interior door trims, power window switches, gear knobs, and armrests.',
    subcategories: [
      { name: 'Seat', slug: 'seat', partTypes: ['Driver Seat Assembly', 'Passenger Seat'] },
      { name: 'Seat Cover', slug: 'seat-cover', partTypes: ['Custom PU Leatherette Seat Cover Set'] },
      { name: 'Dashboard', slug: 'dashboard', partTypes: ['Dashboard Console Trim Panel'] },
      { name: 'Door Trim', slug: 'door-trim', partTypes: ['Inner Door Card Trim Panel'] },
      { name: 'Door Panel', slug: 'door-panel', partTypes: ['Door Fabric Insert Panel'] },
      { name: 'Interior Handle', slug: 'interior-handle', partTypes: ['Chrome Inner Door Release Handle'] },
      { name: 'Floor Mat', slug: 'floor-mat', partTypes: ['7D Custom Fit Floor Mats', 'Rubber All-Weather Floor Mats'] },
      { name: 'Sun Visor', slug: 'sun-visor', partTypes: ['Driver Side Sun Visor with Mirror'] },
      { name: 'Armrest', slug: 'armrest', partTypes: ['Center Console Leatherette Sliding Armrest'] },
      { name: 'Center Console', slug: 'center-console', partTypes: ['Gear Box Center Console Box'] },
      { name: 'Switch', slug: 'switch', partTypes: ['Hazard Warning Switch', 'Headlight Switch'] },
      { name: 'Window Switch', slug: 'window-switch', partTypes: ['Driver Door Master Window Control Switch'] },
      { name: 'AC Control Panel', slug: 'ac-control-panel', partTypes: ['HVAC Heater Climate Control Unit'] },
      { name: 'Infotainment Unit', slug: 'infotainment-unit', partTypes: ['Android Car Display Touchscreen Head Unit'] },
      { name: 'Speaker', slug: 'speaker', partTypes: ['6.5 Inch Coaxial Door Speakers', 'Component Tweeter Set'] }
    ]
  },
  {
    id: 'cat-wheels',
    name: 'Wheels',
    slug: 'wheels',
    icon: '⚙️',
    description: 'Steel wheel rims, alloy rims, wheel caps, studs, and TPMS sensors.',
    seo_title: 'Car Wheel Rims & TPMS Sensors | AutoZoneIndia',
    seo_description: 'Buy steel wheel rims, alloy rims, wheel caps, studs, and TPMS sensors.',
    subcategories: [
      { name: 'Steel Wheel Rim', slug: 'steel-wheel-rim', partTypes: ['14 Inch Steel Rim', '15 Inch Steel Rim'] },
      { name: 'Alloy Wheel Rim', slug: 'alloy-wheel-rim', partTypes: ['Precision Diamond Cut Alloy Rim'] },
      { name: 'Wheel Cover', slug: 'wheel-cover', partTypes: ['Full Hub Wheel Cap Set'] },
      { name: 'Wheel Bolt', slug: 'wheel-bolt', partTypes: ['Chrome Lug Bolt Stud'] },
      { name: 'Wheel Nut', slug: 'wheel-nut', partTypes: ['Steel Lug Nut Set'] },
      { name: 'TPMS Sensor', slug: 'tpms-sensor', partTypes: ['Direct TPMS Tire Pressure Sensor'] }
    ]
  },
  {
    id: 'cat-tyres',
    name: 'Tyres and Alloys',
    slug: 'tyres-and-alloys',
    icon: '🛞',
    description: 'Tubeless tyres from MRF, Apollo, CEAT, alloy wheels, balancing weights, and valves.',
    seo_title: 'Car Tyres & Alloy Wheels Online | AutoZoneIndia',
    seo_description: 'Buy tubeless car tyres, alloy wheels, wheel caps, and TPMS sensors.',
    subcategories: [
      { name: 'Car Tyre', slug: 'car-tyre', partTypes: ['165/70 R14 Tyre', '185/65 R15 Tyre', '205/60 R16 Tyre'] },
      { name: 'Alloy Wheel', slug: 'alloy-wheel', partTypes: ['15 Inch Alloy Wheel Set', '16 Inch Alloy Wheel Set'] },
      { name: 'Wheel Balancing Weight', slug: 'wheel-balancing-weight', partTypes: ['Adhesive Zinc Wheel Weight Strip'] },
      { name: 'Tyre Valve', slug: 'tyre-valve', partTypes: ['Tubeless Rubber Tyre Valve Stem'] }
    ]
  },
  {
    id: 'cat-belts-chains',
    name: 'Belts, Chains and Rollers',
    slug: 'belts-chains-and-rollers',
    icon: '➰',
    description: 'Timing belts, serpentine drive belts, V-belts, timing chain kits, and tensioner pulleys.',
    seo_title: 'Car Timing Belts & Serpentine Belts | AutoZoneIndia',
    seo_description: 'Shop heavy duty timing belts, drive belts, tensioner pulleys, and timing chain kits.',
    subcategories: [
      { name: 'Timing Belt', slug: 'timing-belt-sub', partTypes: ['HTD Rubber Timing Belt'] },
      { name: 'Serpentine Belt', slug: 'serpentine-belt', partTypes: ['Multi-Ribbed Alternator Fan Belt'] },
      { name: 'V-Belt', slug: 'v-belt', partTypes: ['AC Compressor Drive V-Belt'] },
      { name: 'Timing Chain', slug: 'timing-chain-sub', partTypes: ['Duplex Steel Timing Chain Kit'] },
      { name: 'Belt Tensioner', slug: 'belt-tensioner', partTypes: ['Automatic Belt Tensioner Assembly'] },
      { name: 'Idler Pulley', slug: 'idler-pulley', partTypes: ['Serpentine Belt Idler Bearing Pulley'] },
      { name: 'Timing Kit', slug: 'timing-kit', partTypes: ['Full Timing Belt + Water Pump Kit'] }
    ]
  },
  {
    id: 'cat-pipes-hoses',
    name: 'Pipes and Hoses',
    slug: 'pipes-and-hoses',
    icon: '🧪',
    description: 'Radiator hoses, hydraulic brake hoses, fuel lines, AC pipes, and vacuum hoses.',
    seo_title: 'Car Pipes & Hoses | AutoZoneIndia',
    seo_description: 'Shop radiator EPDM hoses, hydraulic brake hoses, fuel pipes, and AC suction lines.',
    subcategories: [
      { name: 'Radiator Hose', slug: 'rad-hose', partTypes: ['Upper EPDM Radiator Hose', 'Lower Radiator Hose'] },
      { name: 'Brake Hose', slug: 'brake-hose-sub', partTypes: ['Front Hydraulic Brake Line Hose'] },
      { name: 'Fuel Hose', slug: 'fuel-hose-sub', partTypes: ['Braided Fuel Supply Line Pipe'] },
      { name: 'AC Hose', slug: 'ac-hose-sub', partTypes: ['Flexible AC Hose Assembly'] },
      { name: 'Power Steering Hose', slug: 'ps-hose', partTypes: ['Power Steering High Pressure Return Hose'] },
      { name: 'Vacuum Hose', slug: 'vacuum-hose', partTypes: ['Silicone Brake Booster Vacuum Line'] },
      { name: 'Turbo Hose', slug: 'turbo-hose', partTypes: ['Intercooler Turbo Charge Air Hose'] }
    ]
  },
  {
    id: 'cat-gaskets-seals',
    name: 'Gaskets and Sealing Rings',
    slug: 'gaskets-and-sealing-rings',
    icon: '⭕',
    description: 'Head gaskets, valve cover gaskets, oil pan gaskets, oil seals, and O-rings.',
    seo_title: 'Car Gaskets & Oil Seals | AutoZoneIndia',
    seo_description: 'Buy cylinder head gaskets, valve cover gaskets, crankshaft seals, and oil sump gaskets.',
    subcategories: [
      { name: 'Head Gasket', slug: 'head-gasket', partTypes: ['Multi-Layer Steel MLS Head Gasket'] },
      { name: 'Valve Cover Gasket', slug: 'valve-cover-gasket', partTypes: ['Rubber Rocker Cover Gasket'] },
      { name: 'Exhaust Gasket', slug: 'exhaust-gasket-sub', partTypes: ['Exhaust Manifold Flange Gasket'] },
      { name: 'Intake Manifold Gasket', slug: 'intake-gasket', partTypes: ['Intake Runner Gasket Set'] },
      { name: 'Oil Pan Gasket', slug: 'oil-pan-gasket', partTypes: ['Engine Sump Gasket'] },
      { name: 'Crankshaft Seal', slug: 'crankshaft-seal', partTypes: ['Front Crankshaft Oil Seal', 'Rear Main Oil Seal'] },
      { name: 'Valve Stem Seal', slug: 'valve-stem-seal', partTypes: ['Viton Valve Stem Seal Kit'] },
      { name: 'O-Ring', slug: 'o-ring', partTypes: ['Fuel Injector Rubber O-Ring Set'] }
    ]
  },
  {
    id: 'cat-sensors-relays',
    name: 'Sensors, Relays and Control Units',
    slug: 'sensors-relays-and-control-units',
    icon: '📡',
    description: 'Oxygen sensors, ABS sensors, MAP/MAF sensors, crankshaft position sensors, and ECUs.',
    seo_title: 'Car Sensors, Relays & ECUs | AutoZoneIndia',
    seo_description: 'Explore O2 sensors, ABS speed sensors, MAP/MAF sensors, knock sensors, and engine control units.',
    subcategories: [
      { name: 'Oxygen Sensor', slug: 'o2-sensor', partTypes: ['Upstream Oxygen Sensor', 'Downstream Oxygen Sensor'] },
      { name: 'ABS Sensor', slug: 'abs-sensor-sub', partTypes: ['Wheel Speed ABS Sensor'] },
      { name: 'MAP Sensor', slug: 'map-sensor', partTypes: ['Manifold Absolute Pressure Sensor'] },
      { name: 'MAF Sensor', slug: 'maf-sensor', partTypes: ['Mass Air Flow Meter Sensor'] },
      { name: 'Crankshaft Position Sensor', slug: 'crank-sensor', partTypes: ['Crankshaft Angle Sensor'] },
      { name: 'Camshaft Position Sensor', slug: 'cam-sensor', partTypes: ['Camshaft Timing Sensor'] },
      { name: 'Coolant Temperature Sensor', slug: 'ect-sensor', partTypes: ['Engine Coolant Temp Switch'] },
      { name: 'Oil Pressure Sensor', slug: 'oil-pressure-sensor', partTypes: ['Oil Pressure Switch Sender'] },
      { name: 'Knock Sensor', slug: 'knock-sensor', partTypes: ['Engine Knock Detonation Sensor'] },
      { name: 'ECU Engine Control Unit', slug: 'ecu', partTypes: ['Engine ECU Computer Module'] },
      { name: 'Transmission Control Unit', slug: 'tcu', partTypes: ['Automatic TCU Gearbox Module'] }
    ]
  },
  {
    id: 'cat-service',
    name: 'Maintenance Service Parts',
    slug: 'maintenance-service-parts',
    icon: '🧰',
    description: 'Periodic service kits, spark plug sets, wiper blade sets, and brake pad & disc packages.',
    seo_title: 'Car Service & Maintenance Kits | AutoZoneIndia',
    seo_description: 'Buy full service kits (Engine Oil + Air + Oil + Cabin Filter), wiper blades, and spark plug sets.',
    subcategories: [
      { name: 'Service Kit', slug: 'service-kit', partTypes: ['Full Oil + Air + Oil Filter Maintenance Package'] },
      { name: 'Inspection Kit', slug: 'inspection-kit', partTypes: ['Spark Plug + Filter Service Kit'] },
      { name: 'Spark Plug Set', slug: 'spark-plug-set', partTypes: ['4-Piece Spark Plug Kit'] },
      { name: 'Wiper Blade Set', slug: 'wiper-blade-set', partTypes: ['Frameless Aerodynamic Wiper Blades Pair'] },
      { name: 'Brake Pad & Disc Kit', slug: 'brake-kit', partTypes: ['Front Brake Pad & Disc Combo Kit'] }
    ]
  },
  {
    id: 'cat-lubricants',
    name: 'Oils and Fluids',
    slug: 'oils-and-fluids',
    icon: '🛢️',
    description: 'Fully synthetic engine oils (5W-30, 0W-20), transmission fluids, brake oil, coolants, and greases.',
    seo_title: 'Engine Oil & Automotive Fluids | AutoZoneIndia',
    seo_description: 'Buy 5W-30, 0W-20, 5W-40 fully synthetic engine oils, gear oils, coolant fluids, and brake oils.',
    subcategories: [
      { name: 'Engine Oil', slug: 'engine-oil', partTypes: ['5W-30 Fully Synthetic', '0W-20 Synthetic', '15W-40 Mineral Engine Oil'] },
      { name: 'Transmission Fluid', slug: 'transmission-fluid', partTypes: ['Synthetic ATF Fluid', 'CVT Fluid', '75W-90 Gear Oil'] },
      { name: 'Brake Fluid', slug: 'brake-fluid-cat', partTypes: ['DOT 4 Synthetic Brake Oil', 'DOT 3 Brake Oil'] },
      { name: 'Coolant', slug: 'coolant-cat', partTypes: ['Premixed Engine Coolant Green/Red', 'Concentrate Coolant'] },
      { name: 'Power Steering Fluid', slug: 'ps-fluid', partTypes: ['Hydraulic Steering Oil'] },
      { name: 'Differential Oil', slug: 'differential-oil', partTypes: ['80W-90 LSD Gear Oil'] },
      { name: 'Gear Oil', slug: 'gear-oil-cat', partTypes: ['80W-90 Manual Gear Oil'] },
      { name: 'ATF', slug: 'atf-fluid', partTypes: ['Automatic Transmission Fluid Dexron III / VI'] },
      { name: 'CVT Fluid', slug: 'cvt-fluid', partTypes: ['CVT Transmission Fluid'] },
      { name: 'Washer Fluid', slug: 'washer-fluid-sub', partTypes: ['Concentrated Wiper Washer Fluid'] },
      { name: 'Grease', slug: 'grease', partTypes: ['High Temp Wheel Bearing Lithium Grease'] }
    ]
  },
  {
    id: 'cat-accessories',
    name: 'Accessories',
    slug: 'accessories',
    icon: '📱',
    description: 'Car body covers, custom floor mats, seat covers, mud flaps, door visors, phone holders, fast chargers.',
    seo_title: 'Car Accessories & Mobile Holders | AutoZoneIndia',
    seo_description: 'Buy custom car floor mats, body covers, door rain visors, mud flaps, and mobile holders.',
    subcategories: [
      { name: 'Car Cover', slug: 'car-cover', partTypes: ['Waterproof Metallic Car Cover'] },
      { name: 'Floor Mat', slug: 'floor-mat-acc', partTypes: ['7D Luxury Custom Floor Mats', '3D Rubber Mats'] },
      { name: 'Seat Cover', slug: 'seat-cover-acc', partTypes: ['Bucket Fit Leatherette Seat Cover'] },
      { name: 'Mud Flaps', slug: 'mud-flaps', partTypes: ['Heavy Duty Rubber Mudguard Flap Set'] },
      { name: 'Door Visor', slug: 'door-visor', partTypes: ['Injection Molded Rain Deflector Door Visor'] },
      { name: 'Phone Holder', slug: 'phone-holder', partTypes: ['360 Automatic Dashboard Car Phone Mount'] },
      { name: 'Fast Charger', slug: 'fast-charger', partTypes: ['Dual Port QC 3.0 & Type-C Car Fast Charger'] },
      { name: 'Dash Cam', slug: 'dash-cam', partTypes: ['Full HD Front & Rear Dash Camera'] }
    ]
  },
  {
    id: 'cat-repair-kits',
    name: 'Repair Kits',
    slug: 'repair-kits',
    icon: '🔧',
    description: 'Brake caliper repair kits, steering rack repair kits, clutch kits, and puncture repair kits.',
    seo_title: 'Automotive Repair Kits & Seal Kits | AutoZoneIndia',
    seo_description: 'Shop brake caliper seal repair kits, clutch rebuild kits, and tubeless tyre puncture kits.',
    subcategories: [
      { name: 'Brake Caliper Repair Kit', slug: 'caliper-repair-kit', partTypes: ['Caliper Piston Seal Boot Kit'] },
      { name: 'Carburetor Repair Kit', slug: 'carburetor-repair-kit', partTypes: ['Carburetor Jet & Gasket Rebuild Kit'] },
      { name: 'Steering Rack Repair Kit', slug: 'steering-rack-repair-kit', partTypes: ['Power Steering Seal Kit'] },
      { name: 'Clutch Repair Kit', slug: 'clutch-repair-kit-sub', partTypes: ['Clutch Release Spring & Bearing Kit'] },
      { name: 'Puncture Repair Kit', slug: 'puncture-repair-kit', partTypes: ['Tubeless Tyre Puncture Strip Tool Kit'] }
    ]
  },
  {
    id: 'cat-consumables',
    name: 'Workshop Consumables',
    slug: 'workshop-consumables',
    icon: '🧪',
    description: 'Brake cleaner spray, penetrating oil spray, RTV gasket maker silicone, threadlocker, and degreasers.',
    seo_title: 'Car Workshop Consumables & Chemicals | AutoZoneIndia',
    seo_description: 'Shop aerosol brake cleaner, WD-40 penetrating spray, high temp RTV silicone, and threadlockers.',
    subcategories: [
      { name: 'Brake Cleaner', slug: 'brake-cleaner', partTypes: ['Aerosol Brake & Clutch Parts Cleaner Spray'] },
      { name: 'Penetrating Spray', slug: 'penetrating-spray', partTypes: ['Rust Release Lubricant Spray'] },
      { name: 'Gasket Maker Silicone', slug: 'gasket-maker', partTypes: ['High Temperature RTV Silicone Gasket Maker'] },
      { name: 'Threadlocker', slug: 'threadlocker', partTypes: ['Anaerobic Medium & High Strength Threadlocker'] },
      { name: 'Degreaser', slug: 'degreaser', partTypes: ['Heavy Duty Engine Degreaser Fluid'] },
      { name: 'Wire Tape', slug: 'wire-tape', partTypes: ['Automotive Harness Fabric Wire Tape'] }
    ]
  },
  {
    id: 'cat-car-care',
    name: 'Car Care and Detailing',
    slug: 'car-care-and-detailing',
    icon: '✨',
    description: 'High pressure car washers, plush microfiber towels, car shampoo, dashboard polish, and ceramic wax.',
    seo_title: 'Car Washing, Detailing & Microfiber Towels | AutoZoneIndia',
    seo_description: 'Explore car pressure washers, microfiber towels, car shampoo, dashboard polish, and tire shiners.',
    subcategories: [
      { name: 'Car Shampoo', slug: 'car-shampoo', partTypes: ['pH Neutral High Foam Car Wash Shampoo'] },
      { name: 'Car Polish', slug: 'car-polish', partTypes: ['Carnauba Wax Polish', 'Dashboard Dresser Polish'] },
      { name: 'Microfiber Cloth', slug: 'microfiber-cloth', partTypes: ['800 GSM Plush Microfiber Drying Towel Set'] },
      { name: 'Pressure Washer', slug: 'pressure-washer', partTypes: ['1800W High Pressure Car Washer Machine'] },
      { name: 'Foam Cannon', slug: 'foam-cannon', partTypes: ['Brass Snow Foam Lance Cannon'] },
      { name: 'Tire Polish', slug: 'tire-polish', partTypes: ['High Gloss Tire Shiner Gel'] },
      { name: 'Interior Cleaner', slug: 'interior-cleaner', partTypes: ['Upholstery Fabric & Leather Foam Cleaner'] }
    ]
  },
  {
    id: 'cat-universal',
    name: 'Universal',
    slug: 'universal',
    icon: '🌐',
    description: 'Universal fitment accessories, emergency toolkits, frameless wiper blades, and clip fasteners.',
    seo_title: 'Universal Car Parts & Accessories | AutoZoneIndia',
    seo_description: 'Browse universal fitment wiper blades, emergency jumper cables, fast chargers, and plastic body clips.',
    subcategories: [
      { name: 'Universal Accessories', slug: 'universal-acc', partTypes: ['Universal Phone Mounts', 'Organizer Bags'] },
      { name: 'Emergency Tools', slug: 'emergency-tools', partTypes: ['Heavy Duty Jumper Cables', 'Digital Tyre Inflator'] },
      { name: 'Wiper Blades', slug: 'wiper-blades-universal', partTypes: ['Universal Hook Type Frameless Wiper Blades'] },
      { name: 'Universal Clips & Fasteners', slug: 'universal-clips', partTypes: ['Multi-Size Nylon Car Fender Trim Retainer Clips'] }
    ]
  }
];

/**
 * Get Subcategories for a given category name, slug, or ID
 */
export const getSubcategoriesForCategory = (categoryIdOrSlugOrName) => {
  if (!categoryIdOrSlugOrName || categoryIdOrSlugOrName === 'all') return [];
  const query = categoryIdOrSlugOrName.toString().toLowerCase().trim();
  const cat = MASTER_CATEGORIES_DATA.find(c => 
    c.id.toLowerCase() === query ||
    c.slug.toLowerCase() === query ||
    c.name.toLowerCase() === query ||
    query.includes(c.name.toLowerCase()) ||
    c.name.toLowerCase().includes(query)
  );
  return cat ? cat.subcategories : [];
};

/**
 * Get Part Types for a given subcategory within a category
 */
export const getPartTypesForSubcategory = (categoryIdOrSlug, subcategoryNameOrSlug) => {
  const subs = getSubcategoriesForCategory(categoryIdOrSlug);
  if (!subs.length || !subcategoryNameOrSlug || subcategoryNameOrSlug === 'all') return [];
  const query = subcategoryNameOrSlug.toString().toLowerCase().trim();
  const sub = subs.find(s => 
    s.slug.toLowerCase() === query || 
    s.name.toLowerCase() === query
  );
  return sub ? (sub.partTypes || []) : [];
};

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
