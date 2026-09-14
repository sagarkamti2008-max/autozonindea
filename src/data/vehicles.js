export const VEHICLE_MAKES = [
  {
    id: 'maruti',
    name: 'Maruti Suzuki',
    logo: '🚗',
    models: [
      { id: 'alto_800', name: 'Alto 800', years: ['2012-2019'], variants: ['0.8L F8D Petrol', 'LXi', 'VXi'], status: 'discontinued' },
      { id: 'alto_k10', name: 'Alto K10', years: ['2010-2026'], variants: ['1.0L K10C Petrol', 'VXi+', 'LXi'], status: 'current' },
      { id: 'spresso', name: 'S-Presso', years: ['2019-2026'], variants: ['1.0L K10C Petrol', 'VXi+', 'Std'], status: 'current' },
      { id: 'wagonr', name: 'WagonR', years: ['2010-2026'], variants: ['1.0L K-Series', '1.2L DualJet', 'ZXi+'], status: 'current' },
      { id: 'swift', name: 'Swift', years: ['2011-2026'], variants: ['1.2L DualJet Petrol', '1.3L DDiS Diesel', 'ZXi Plus', 'VXi'], status: 'current' },
      { id: 'baleno', name: 'Baleno', years: ['2015-2026'], variants: ['1.2L K12N Petrol', 'Alpha', 'Zeta', 'Delta'], status: 'current' },
      { id: 'ignis', name: 'Ignis', years: ['2017-2026'], variants: ['1.2L VVT Petrol', 'Alpha', 'Zeta'], status: 'current' },
      { id: 'celerio', name: 'Celerio', years: ['2014-2026'], variants: ['1.0L K10C Petrol', 'ZXi+', 'VXi'], status: 'current' },
      { id: 'dzire', name: 'Dzire', years: ['2012-2026'], variants: ['1.2L K-Series Petrol', '1.3L Diesel', 'ZXi+'], status: 'current' },
      { id: 'ciaz', name: 'Ciaz', years: ['2014-2023'], variants: ['1.5L K15B Petrol', '1.3L DDiS Diesel', 'Alpha'], status: 'discontinued' },
      { id: 'ertiga', name: 'Ertiga', years: ['2012-2026'], variants: ['1.5L K15C Petrol Smart Hybrid', '1.3L Diesel', 'ZXi+'], status: 'current' },
      { id: 'xl6', name: 'XL6', years: ['2019-2026'], variants: ['1.5L K15C Petrol Smart Hybrid', 'Alpha+'], status: 'current' },
      { id: 'brezza', name: 'Brezza / Vitara Brezza', years: ['2016-2026'], variants: ['1.5L K15C Petrol', '1.3L DDiS Diesel', 'ZXi+'], status: 'current' },
      { id: 'fronx', name: 'Fronx', years: ['2023-2026'], variants: ['1.0L Boosterjet Turbo', '1.2L K-Series', 'Alpha'], status: 'current' },
      { id: 'grand_vitara', name: 'Grand Vitara', years: ['2022-2026'], variants: ['1.5L Intelligent Electric Hybrid', '1.5L K15C', 'Alpha+ AllGrip'], status: 'current' },
      { id: 'scross', name: 'S-Cross', years: ['2015-2020'], variants: ['1.3L DDiS 200', '1.6L DDiS 320', 'Alpha'], status: 'discontinued' },
      { id: 'jimny', name: 'Jimny', years: ['2023-2026'], variants: ['1.5L K15B Petrol 4x4', 'Alpha AllGrip Pro'], status: 'current' },
      { id: 'eeco', name: 'Eeco', years: ['2010-2026'], variants: ['1.2L G12B Petrol', '5-Seater', '7-Seater CNG'], status: 'current' },
      { id: 'omni', name: 'Omni', years: ['2000-2019'], variants: ['0.8L F8B Petrol', 'MPI 5-Seater', 'Cargo'], status: 'discontinued' },
      { id: 'invicto', name: 'Invicto', years: ['2023-2026'], variants: ['2.0L Strong Hybrid', 'Alpha+ 7-Seater'], status: 'current' },
      { id: 'maruti_zen', name: 'Zen / Estilo', years: ['1993-2006'], variants: ['1.0L All Aluminium Engine', 'LX', 'VX'], status: 'discontinued' },
      { id: 'maruti_esteem', name: 'Esteem', years: ['1994-2008'], variants: ['1.3L G13BB Petrol', 'LX', 'VXi'], status: 'discontinued' },
      { id: 'maruti_800', name: 'Maruti 800', years: ['1983-2014'], variants: ['0.8L F8B Petrol', 'Std', 'EX MPFi'], status: 'discontinued' },
      { id: 'maruti_versa', name: 'Versa', years: ['2001-2010'], variants: ['1.3L G13BB Petrol', 'DX2 8-Seater'], status: 'discontinued' }
    ]
  },
  {
    id: 'hyundai',
    name: 'Hyundai Motors',
    logo: '🚘',
    models: [
      { id: 'santro', name: 'Santro', years: ['2018-2022', '1998-2014'], variants: ['1.1L Epsilon Petrol', 'Sportz', 'Asta'], status: 'discontinued' },
      { id: 'grand_i10', name: 'Grand i10', years: ['2013-2020'], variants: ['1.2L Kappa Petrol', '1.1L U2 CRDi Diesel', 'Asta'], status: 'discontinued' },
      { id: 'grand_i10_nios', name: 'Grand i10 Nios', years: ['2019-2026'], variants: ['1.2L Kappa Petrol', '1.0L Turbo GDi', 'Asta'], status: 'current' },
      { id: 'i10', name: 'i10', years: ['2007-2016'], variants: ['1.1L i-IRDE Petrol', '1.2L Kappa', 'Sportz'], status: 'discontinued' },
      { id: 'i20', name: 'i20 / Elite i20', years: ['2008-2026'], variants: ['1.2L Kappa Petrol', '1.0L Turbo GDi', '1.4L CRDi', 'Asta (O)'], status: 'current' },
      { id: 'aura', name: 'Aura', years: ['2020-2026'], variants: ['1.2L Kappa Petrol', '1.2L Bi-Fuel CNG', 'SX+'], status: 'current' },
      { id: 'xcent', name: 'Xcent', years: ['2014-2020'], variants: ['1.2L Kappa Petrol', '1.1L CRDi Diesel', 'SX'], status: 'discontinued' },
      { id: 'verna', name: 'Verna', years: ['2006-2026'], variants: ['1.5L Turbo GDi', '1.5L CRDi Diesel', 'SX Opt'], status: 'current' },
      { id: 'elantra', name: 'Elantra', years: ['2012-2020'], variants: ['2.0L Nu Petrol', '1.5L U2 CRDi Diesel', 'SX Option'], status: 'discontinued' },
      { id: 'creta', name: 'Creta', years: ['2015-2026'], variants: ['1.5L CRDi Diesel', '1.5L MPi Petrol', '1.5L Turbo GDi', 'SX(O)'], status: 'current' },
      { id: 'venue', name: 'Venue', years: ['2019-2026'], variants: ['1.2L Kappa Petrol', '1.5L CRDi Diesel', '1.0L Turbo GDi', 'SX(O)'], status: 'current' },
      { id: 'exter', name: 'Exter', years: ['2023-2026'], variants: ['1.2L Kappa Petrol', 'SX(O) Connect'], status: 'current' },
      { id: 'alcazar', name: 'Alcazar', years: ['2021-2026'], variants: ['2.0L Petrol', '1.5L Turbo Petrol', '1.5L Diesel', 'Signature'], status: 'current' },
      { id: 'tucson', name: 'Tucson', years: ['2016-2026'], variants: ['2.0L R Diesel AWD', '2.0L MPi Petrol', 'Signature'], status: 'current' },
      { id: 'santa_fe', name: 'Santa Fe', years: ['2010-2023'], variants: ['2.2L CRDi Diesel 4WD', 'High 7-Seater'], status: 'discontinued' },
      { id: 'ioniq_5', name: 'Ioniq 5', years: ['2023-2026'], variants: ['72.6 kWh EV RWD', 'Ultra Fast Charging'], status: 'current' },
      { id: 'accent', name: 'Accent', years: ['1999-2012'], variants: ['1.5L Alpha Petrol', '1.5L CRDi Diesel', 'GLE'], status: 'discontinued' },
      { id: 'getz', name: 'Getz / Prime', years: ['2004-2010'], variants: ['1.3L Petrol', '1.5L CRDi Turbo Diesel'], status: 'discontinued' },
      { id: 'sonata', name: 'Sonata / Embera / Transform', years: ['1998-2019'], variants: ['2.4L GDi Petrol', '2.0L CRDi Diesel'], status: 'discontinued' }
    ]
  },
  {
    id: 'tata',
    name: 'Tata Motors',
    logo: '🏎️',
    models: [
      { id: 'nano', name: 'Nano', years: ['2008-2019'], variants: ['624cc MPFi Petrol', 'GenX Easy Shift AMT', 'Twist XT'], status: 'discontinued' },
      { id: 'indica', name: 'Indica / V2 / Vista', years: ['2001-2018'], variants: ['1.4L DLX Diesel', '1.3L Quadrajet', 'LS'], status: 'discontinued' },
      { id: 'indigo', name: 'Indigo / CS / Manza', years: ['2002-2018'], variants: ['1.4L TDI Diesel', '1.3L Quadrajet', 'VX'], status: 'discontinued' },
      { id: 'tiago', name: 'Tiago', years: ['2016-2026'], variants: ['1.2L Revotron Petrol', 'Tiago iCNG', 'XZ+'], status: 'current' },
      { id: 'tigor', name: 'Tigor', years: ['2017-2026'], variants: ['1.2L Revotron Petrol', 'Tigor EV', 'XZ+'], status: 'current' },
      { id: 'altroz', name: 'Altroz', years: ['2020-2026'], variants: ['1.2L i-Turbo Petrol', '1.5L Revotorq Diesel', 'XZ+ O'], status: 'current' },
      { id: 'bolt', name: 'Bolt', years: ['2015-2019'], variants: ['1.2L Revotron Turbo', '1.3L Quadrajet', 'XT'], status: 'discontinued' },
      { id: 'zest', name: 'Zest', years: ['2014-2019'], variants: ['1.2L Revotron Turbo', '1.3L Quadrajet AMT', 'XT'], status: 'discontinued' },
      { id: 'punch', name: 'Punch', years: ['2021-2026'], variants: ['1.2L Revotron Petrol', 'Punch.ev', 'Creative Flagship'], status: 'current' },
      { id: 'nexon', name: 'Nexon', years: ['2017-2026'], variants: ['1.2L Revotron Turbo Petrol', '1.5L Revotorq Diesel', 'Nexon.ev', 'Fearless+'], status: 'current' },
      { id: 'harrier', name: 'Harrier', years: ['2019-2026'], variants: ['2.0L Kryotec Turbo Diesel', 'XZ Plus', 'Fearless+ Dark Edition'], status: 'current' },
      { id: 'safari', name: 'Safari', years: ['2021-2026', '1998-2019'], variants: ['2.0L Kryotec Diesel', 'Accomplished+ 6/7-Str'], status: 'current' },
      { id: 'hexa', name: 'Hexa', years: ['2017-2020'], variants: ['2.2L VARICOR 400 Diesel', 'XT 4x4', 'XTA'], status: 'discontinued' },
      { id: 'curvv', name: 'Curvv', years: ['2024-2026'], variants: ['1.2L Hyperion GDi Petrol', '1.5L Diesel', 'Curvv.ev'], status: 'current' },
      { id: 'sumo', name: 'Sumo / Grande / Gold', years: ['1994-2019'], variants: ['3.0L CR4 Diesel', '2.0L Turbo Diesel'], status: 'discontinued' },
      { id: 'winger', name: 'Winger', years: ['2008-2020'], variants: ['2.2L DICOR Diesel', '15-Seater Van'], status: 'discontinued' }
    ]
  },
  {
    id: 'mahindra',
    name: 'Mahindra & Mahindra',
    logo: '🚙',
    models: [
      { id: 'bolero', name: 'Bolero / Bolero Neo', years: ['2000-2026'], variants: ['1.5L mHawk75 Diesel', 'ZLX', 'N10 Option'], status: 'current' },
      { id: 'scorpio', name: 'Scorpio Classic', years: ['2002-2026'], variants: ['2.2L mHawk Diesel S11', 'S5'], status: 'current' },
      { id: 'scorpio_n', name: 'Scorpio-N', years: ['2022-2026'], variants: ['2.2L mHawk Diesel 4XPLOR', '2.0L mStallion Petrol', 'Z8L AWD'], status: 'current' },
      { id: 'xuv300', name: 'XUV300 / XUV 3XO', years: ['2019-2026'], variants: ['1.2L mStallion TGDi', '1.5L Turbo Diesel', 'AX7L'], status: 'current' },
      { id: 'xuv400', name: 'XUV400 EV', years: ['2023-2026'], variants: ['39.4 kWh Dual-Tone EL Pro EV'], status: 'current' },
      { id: 'xuv700', name: 'XUV700', years: ['2021-2026'], variants: ['2.2L mHawk Diesel AWD', '2.0L mStallion Petrol', 'AX7 Luxury 7-Str'], status: 'current' },
      { id: 'thar', name: 'Thar / Thar Roxx', years: ['2010-2026'], variants: ['2.0L mStallion Turbo Petrol', '2.2L mHawk Diesel', 'LX 4x4 Hard Top'], status: 'current' },
      { id: 'marazzo', name: 'Marazzo', years: ['2018-2022'], variants: ['1.5L D15 Diesel', 'M6 Plus 7-Str'], status: 'discontinued' },
      { id: 'kuv100', name: 'KUV100 Nxt', years: ['2016-2022'], variants: ['1.2L mFalcon G80 Petrol', '1.2L mFalcon D75 Diesel'], status: 'discontinued' },
      { id: 'tuv300', name: 'TUV300', years: ['2015-2020'], variants: ['1.5L mHawk100 Diesel', 'T10 Option'], status: 'discontinued' },
      { id: 'xuv500', name: 'XUV500', years: ['2011-2021'], variants: ['2.2L mHawk155 Diesel AWD', 'W11 Option'], status: 'discontinued' },
      { id: 'be_6', name: 'BE 6e EV', years: ['2025-2026'], variants: ['INGLO Dedicated EV Architecture'], status: 'current' },
      { id: 'xylo', name: 'Xylo', years: ['2009-2019'], variants: ['2.2L mHawk Diesel', 'E8 ABS 7-Str'], status: 'discontinued' },
      { id: 'verito', name: 'Verito / Vibe', years: ['2011-2019'], variants: ['1.5L dCi Diesel', 'D4'], status: 'discontinued' },
      { id: 'quanto', name: 'Quanto', years: ['2012-2017'], variants: ['1.5L mCR100 Diesel', 'C8'], status: 'discontinued' }
    ]
  },
  {
    id: 'honda',
    name: 'Honda Cars',
    logo: '🚘',
    models: [
      { id: 'city', name: 'City', years: ['1998-2026'], variants: ['1.5L i-VTEC Petrol', '1.5L i-DTEC Diesel', '1.5L e:HEV Hybrid', 'ZX CVT'], status: 'current' },
      { id: 'amaze', name: 'Amaze', years: ['2013-2026'], variants: ['1.2L i-VTEC Petrol', '1.5L i-DTEC Diesel', 'VX CVT'], status: 'current' },
      { id: 'jazz', name: 'Jazz', years: ['2009-2020'], variants: ['1.2L i-VTEC Petrol', '1.5L i-DTEC Diesel', 'VX CVT'], status: 'discontinued' },
      { id: 'brio', name: 'Brio', years: ['2011-2019'], variants: ['1.2L i-VTEC Petrol', 'VX MT'], status: 'discontinued' },
      { id: 'wrv', name: 'WR-V', years: ['2017-2022'], variants: ['1.2L i-VTEC Petrol', '1.5L i-DTEC Diesel', 'VX'], status: 'discontinued' },
      { id: 'brv', name: 'BR-V', years: ['2016-2020'], variants: ['1.5L i-VTEC Petrol', '1.5L i-DTEC Diesel', 'VX 7-Str'], status: 'discontinued' },
      { id: 'civic', name: 'Civic', years: ['2006-2021'], variants: ['1.8L i-VTEC Petrol', '1.6L i-DTEC Turbo Diesel', 'ZX CVT'], status: 'discontinued' },
      { id: 'crv', name: 'CR-V', years: ['2003-2022'], variants: ['2.0L i-VTEC Petrol', '1.6L i-DTEC AWD Diesel', 'Exclusive Edition'], status: 'discontinued' },
      { id: 'elevate', name: 'Elevate', years: ['2023-2026'], variants: ['1.5L i-VTEC Petrol', 'ZX CVT ADAS'], status: 'current' }
    ]
  },
  {
    id: 'toyota',
    name: 'Toyota India',
    logo: '🚙',
    models: [
      { id: 'etios', name: 'Etios', years: ['2010-2020'], variants: ['1.5L Petrol', '1.4L D-4D Diesel', 'VX'], status: 'discontinued' },
      { id: 'etios_liva', name: 'Etios Liva', years: ['2011-2020'], variants: ['1.2L Petrol', '1.4L D-4D Diesel', 'VX Dual Tone'], status: 'discontinued' },
      { id: 'innova', name: 'Innova (1st Gen)', years: ['2005-2016'], variants: ['2.5L D-4D Diesel', '2.0L VVT-i Petrol', 'VX 7-Str'], status: 'discontinued' },
      { id: 'innova_crysta', name: 'Innova Crysta / Hycross', years: ['2016-2026'], variants: ['2.4L Diesel VX', '2.0L Strong Hybrid ZX'], status: 'current' },
      { id: 'fortuner', name: 'Fortuner / Legender', years: ['2009-2026'], variants: ['2.8L Diesel 4x4 AT', '2.7L Petrol MT', 'Legender 4x4'], status: 'current' },
      { id: 'glanza', name: 'Glanza', years: ['2019-2026'], variants: ['1.2L K-Series Petrol', 'V AMT'], status: 'current' },
      { id: 'urban_cruiser', name: 'Urban Cruiser', years: ['2020-2022'], variants: ['1.5L K15B Petrol', 'Premium AT'], status: 'discontinued' },
      { id: 'hyryder', name: 'Urban Cruiser Hyryder', years: ['2022-2026'], variants: ['1.5L Self-Charging Strong Hybrid', '1.5L Neodrive AWD'], status: 'current' },
      { id: 'rumion', name: 'Rumion', years: ['2022-2026'], variants: ['1.5L K15C Petrol', 'V AT 7-Str'], status: 'current' },
      { id: 'camry', name: 'Camry Hybrid', years: ['2002-2026'], variants: ['2.5L Dynamic Force Self-Charging Hybrid'], status: 'current' },
      { id: 'corolla_altis', name: 'Corolla Altis', years: ['2003-2021'], variants: ['1.8L Dual VVT-i Petrol', '1.4L D-4D Diesel', 'VL CVT'], status: 'discontinued' }
    ]
  },
  {
    id: 'kia',
    name: 'Kia India',
    logo: '🚘',
    models: [
      { id: 'seltos', name: 'Seltos', years: ['2019-2026'], variants: ['1.5L Smartstream Turbo GDi', '1.5L CRDi Diesel', 'GTX+ AWD'], status: 'current' },
      { id: 'sonet', name: 'Sonet', years: ['2020-2026'], variants: ['1.0L Turbo GDi', '1.5L CRDi Diesel', '1.2L Petrol', 'X-Line'], status: 'current' },
      { id: 'carens', name: 'Carens', years: ['2022-2026'], variants: ['1.5L Turbo Petrol', '1.5L CRDi Diesel', 'Luxury Plus 6/7-Str'], status: 'current' },
      { id: 'ev6', name: 'EV6', years: ['2022-2026'], variants: ['77.4 kWh EV AWD 325 hp GT-Line'], status: 'current' }
    ]
  },
  {
    id: 'volkswagen',
    name: 'Volkswagen India',
    logo: '🚗',
    models: [
      { id: 'polo', name: 'Polo', years: ['2010-2022'], variants: ['1.0L TSI Turbo', '1.2L GT TSI', '1.5L TDI Diesel', 'Highline Plus'], status: 'discontinued' },
      { id: 'vento', name: 'Vento', years: ['2010-2022'], variants: ['1.0L TSI Turbo', '1.2L TSI', '1.5L TDI DSG', 'Highline Plus'], status: 'discontinued' },
      { id: 'taigun', name: 'Taigun', years: ['2021-2026'], variants: ['1.5L TSI EVO DSG', '1.0L TSI', 'GT Edge DSG'], status: 'current' },
      { id: 'virtus', name: 'Virtus', years: ['2022-2026'], variants: ['1.5L TSI EVO DSG', '1.0L TSI', 'GT Plus Matte'], status: 'current' }
    ]
  },
  {
    id: 'skoda',
    name: 'Skoda Auto India',
    logo: '🚗',
    models: [
      { id: 'rapid', name: 'Rapid', years: ['2011-2020'], variants: ['1.0L TSI Turbo', '1.6L MPI Petrol', '1.5L TDI DSG', 'Monte Carlo'], status: 'discontinued' },
      { id: 'octavia', name: 'Octavia', years: ['2001-2022'], variants: ['2.0L TSI DSG', '1.8L TSI', '2.0L TDI', 'L&K'], status: 'discontinued' },
      { id: 'superb', name: 'Superb', years: ['2002-2023'], variants: ['2.0L TSI DSG 190 hp', 'L&K'], status: 'discontinued' },
      { id: 'kushaq', name: 'Kushaq', years: ['2021-2026'], variants: ['1.5L TSI DSG', '1.0L TSI', 'Monte Carlo'], status: 'current' },
      { id: 'slavia', name: 'Slavia', years: ['2022-2026'], variants: ['1.5L TSI DSG', '1.0L TSI', 'Style Matte'], status: 'current' }
    ]
  },
  {
    id: 'renault',
    name: 'Renault India',
    logo: '🚘',
    models: [
      { id: 'kwid', name: 'Kwid', years: ['2015-2026'], variants: ['1.0L SCe Petrol', '0.8L SCe', 'Climber AMT'], status: 'current' },
      { id: 'duster', name: 'Duster', years: ['2012-2022'], variants: ['1.3L Turbo Petrol 156 hp', '1.5L dCi Diesel AWD', 'RxZ'], status: 'discontinued' },
      { id: 'triber', name: 'Triber', years: ['2019-2026'], variants: ['1.0L Energy Petrol', 'RXT EASY-R AMT 7-Str'], status: 'current' },
      { id: 'kiger', name: 'Kiger', years: ['2021-2026'], variants: ['1.0L Turbo CVT', '1.0L Energy Petrol', 'RXZ'], status: 'current' }
    ]
  },
  {
    id: 'nissan',
    name: 'Nissan India',
    logo: '🚘',
    models: [
      { id: 'micra', name: 'Micra / Active', years: ['2010-2020'], variants: ['1.2L Petrol CVT', '1.5L dCi Diesel', 'XV'], status: 'discontinued' },
      { id: 'sunny', name: 'Sunny', years: ['2011-2020'], variants: ['1.5L Petrol CVT', '1.5L k9k Diesel', 'XV Premium'], status: 'discontinued' },
      { id: 'magnite', name: 'Magnite', years: ['2020-2026'], variants: ['1.0L HRA0 Turbo CVT', '1.0L B4D Petrol', 'XV Premium'], status: 'current' }
    ]
  },
  {
    id: 'ford',
    name: 'Ford India',
    logo: '🚗',
    models: [
      { id: 'figo', name: 'Figo', years: ['2010-2021'], variants: ['1.2L Ti-VCT Petrol', '1.5L TDCi Diesel', 'Titanium Blu'], status: 'discontinued' },
      { id: 'aspire', name: 'Aspire', years: ['2015-2021'], variants: ['1.2L Ti-VCT Petrol', '1.5L TDCi Diesel', 'Titanium+'], status: 'discontinued' },
      { id: 'ecosport', name: 'EcoSport', years: ['2013-2021'], variants: ['1.5L TDCi Diesel', '1.5L Ti-VCT Petrol', '1.0L EcoBoost', 'S Trim'], status: 'discontinued' },
      { id: 'endeavour', name: 'Endeavour', years: ['2003-2021'], variants: ['3.2L TDCi 5-Cyl 4x4', '2.0L EcoBlue 10-Speed AT', 'Titanium+'], status: 'discontinued' }
    ]
  },
  {
    id: 'chevrolet',
    name: 'Chevrolet India',
    logo: '🚗',
    models: [
      { id: 'beat', name: 'Beat', years: ['2010-2017'], variants: ['1.0L TCDi Diesel', '1.2L Smartech Petrol', 'LTZ'], status: 'discontinued' },
      { id: 'spark', name: 'Spark', years: ['2007-2015'], variants: ['1.0L S-TEC Petrol', 'LT'], status: 'discontinued' },
      { id: 'cruze', name: 'Cruze', years: ['2009-2017'], variants: ['2.0L VCDi Turbo Diesel 166 hp', 'LTZ AT'], status: 'discontinued' }
    ]
  },
  {
    id: 'datsun',
    name: 'Datsun India',
    logo: '🚘',
    models: [
      { id: 'datsun_go', name: 'GO', years: ['2014-2020'], variants: ['1.2L Petrol', 'T(O) CVT'], status: 'discontinued' },
      { id: 'datsun_goplus', name: 'GO+', years: ['2015-2020'], variants: ['1.2L Petrol 7-Seater', 'T(O) CVT'], status: 'discontinued' },
      { id: 'datsun_redigo', name: 'redi-GO', years: ['2016-2022'], variants: ['0.8L i-SAT', '1.0L Smart Drive AMT'], status: 'discontinued' }
    ]
  },
  {
    id: 'fiat',
    name: 'Fiat India',
    logo: '🏎️',
    models: [
      { id: 'fiat_punto', name: 'Punto / EVO / Abarth', years: ['2009-2018'], variants: ['1.3L Multijet Diesel', '1.4L FIRE Petrol', '1.4L T-Jet Abarth 145 hp'], status: 'discontinued' },
      { id: 'fiat_linea', name: 'Linea', years: ['2009-2018'], variants: ['1.4L T-Jet Petrol 125 hp', '1.3L Multijet Diesel', 'Emotion'], status: 'discontinued' },
      { id: 'fiat_palio', name: 'Palio / Stile / NV', years: ['2001-2011'], variants: ['1.6L GTX 100 hp', '1.2L Petrol', '1.3L Multijet'], status: 'discontinued' }
    ]
  },
  {
    id: 'mitsubishi',
    name: 'Mitsubishi India',
    logo: '🚙',
    models: [
      { id: 'mitsubishi_pajero', name: 'Pajero / SFX / Sport', years: ['2002-2015'], variants: ['2.8L Intercooler Turbo Diesel', '2.5L DI-D 4x4'], status: 'discontinued' },
      { id: 'mitsubishi_lancer', name: 'Lancer / Cedia', years: ['2005-2012'], variants: ['2.0L Select Petrol 115 hp', '1.5L Petrol', '2.0L Diesel'], status: 'discontinued' },
      { id: 'mitsubishi_outlander', name: 'Outlander', years: ['2014-2018'], variants: ['2.4L MIVEC Petrol 4WD CVT'], status: 'discontinued' }
    ]
  },
  {
    id: 'isuzu',
    name: 'Isuzu Motors',
    logo: '🚙',
    models: [
      { id: 'isuzu_dmax', name: 'D-Max', years: ['2015-2026'], variants: ['2.5L Commercial Pickup', 'Single / Crew Cab'], status: 'current' },
      { id: 'isuzu_mux', name: 'MU-X', years: ['2017-2026'], variants: ['1.9L Ddi D-Max Diesel 4x4 AT', '3.0L 4x4'], status: 'current' },
      { id: 'isuzu_vcross', name: 'D-Max V-Cross', years: ['2017-2026'], variants: ['1.9L Ddi 4x4 Z-Prestige AT'], status: 'current' }
    ]
  },
  {
    id: 'force',
    name: 'Force Motors',
    logo: '🚙',
    models: [
      { id: 'force_trax', name: 'Trax Cruiser / Toofan', years: ['2005-2020'], variants: ['2.6L FM2.6 CR Diesel 13-Seater'], status: 'discontinued' },
      { id: 'force_gurkha', name: 'Gurkha 3-Door / 5-Door', years: ['2010-2026'], variants: ['2.6L FM2.6 CR Diesel 4x4 Diff-Locks'], status: 'current' }
    ]
  },
  {
    id: 'citroen',
    name: 'Citroën India',
    logo: '🚘',
    models: [
      { id: 'citroen_c3', name: 'C3', years: ['2022-2026'], variants: ['1.2L PureTech 110 Turbo', '1.2L PureTech 82', 'Shine'], status: 'current' },
      { id: 'citroen_c3_aircross', name: 'C3 Aircross', years: ['2023-2026'], variants: ['1.2L Turbo 5+2 Flexi Seater', 'Max AT'], status: 'current' },
      { id: 'citroen_ec3', name: 'eC3 EV', years: ['2023-2026'], variants: ['29.2 kWh EV 320 km Range', 'Feel Vibe Pack'], status: 'current' }
    ]
  },
  {
    id: 'land_rover',
    name: 'Land Rover India',
    logo: '🚙',
    models: [
      { id: 'range_rover', name: 'Range Rover / Sport', years: ['2002-2026'], variants: ['3.0L Ingenium Diesel AWD', '4.4L V8 Twin Turbo', 'Autobiography'], status: 'current' },
      { id: 'evoque', name: 'Range Rover Evoque', years: ['2012-2026'], variants: ['2.0L R-Dynamic SE Petrol', '2.0L Diesel'], status: 'current' },
      { id: 'discovery_sport', name: 'Discovery Sport', years: ['2015-2026'], variants: ['2.0L Ingenium Petrol / Diesel AWD 7-Str'], status: 'current' },
      { id: 'defender', name: 'Defender 90 / 110 / 130', years: ['2020-2026'], variants: ['3.0L D300 Diesel Air Suspension', '2.0L P300'], status: 'current' }
    ]
  },
  {
    id: 'volvo',
    name: 'Volvo Cars India',
    logo: '🚗',
    models: [
      { id: 'volvo_xc40', name: 'XC40 / Recharge EV', years: ['2018-2026'], variants: ['Ultimate B4 Mild Hybrid', 'Twin Motor 408 hp EV'], status: 'current' },
      { id: 'volvo_xc60', name: 'XC60', years: ['2010-2026'], variants: ['B5 Ultimate Mild Hybrid AWD', 'D5 PowerPulse'], status: 'current' },
      { id: 'volvo_xc90', name: 'XC90', years: ['2007-2026'], variants: ['B6 Ultimate Mild Hybrid 7-Str', 'Recharge T8 Plug-in Hybrid'], status: 'current' },
      { id: 'volvo_s90', name: 'S90', years: ['2016-2026'], variants: ['B5 Ultimate Mild Hybrid Bowers & Wilkins'], status: 'current' }
    ]
  },
  {
    id: 'lexus',
    name: 'Lexus India',
    logo: '🏎️',
    models: [
      { id: 'lexus_es', name: 'ES 300h', years: ['2017-2026'], variants: ['2.5L Self-Charging Hybrid Ultra Luxury'], status: 'current' },
      { id: 'lexus_nx', name: 'NX 350h', years: ['2018-2026'], variants: ['2.5L Self-Charging Hybrid AWD F-Sport'], status: 'current' },
      { id: 'lexus_rx', name: 'RX 350h / 500h', years: ['2016-2026'], variants: ['2.4L Turbo Hybrid F Sport Performance'], status: 'current' }
    ]
  },
  {
    id: 'byd',
    name: 'BYD India (EV)',
    logo: '⚡',
    models: [
      { id: 'byd_atto3', name: 'Atto 3 EV', years: ['2023-2026'], variants: ['60.48 kWh Blade Battery 521 km Range'], status: 'current' },
      { id: 'byd_seal', name: 'Seal EV', years: ['2024-2026'], variants: ['82.56 kWh AWD 530 hp 0-100 3.8s'], status: 'current' }
    ]
  },
  {
    id: 'mg',
    name: 'MG Motor India',
    logo: '🚘',
    models: [
      { id: 'hector', name: 'Hector / Hector Plus', years: ['2019-2026'], variants: ['1.5L Turbo Petrol CVT', '2.0L Multijet Diesel', 'Savvy Pro'], status: 'current' },
      { id: 'astor', name: 'Astor', years: ['2021-2026'], variants: ['1.3L Turbo Petrol AT', '1.5L VTi Tech', 'Savvy Pro ADAS'], status: 'current' },
      { id: 'zs_ev', name: 'ZS EV', years: ['2020-2026'], variants: ['50.3 kWh EV 461 km Range', 'Exclusive Pro'], status: 'current' },
      { id: 'comet', name: 'Comet EV', years: ['2023-2026'], variants: ['17.3 kWh Urban EV', 'Exclusive Fast Charge'], status: 'current' }
    ]
  },
  {
    id: 'jeep',
    name: 'Jeep India',
    logo: '🚙',
    models: [
      { id: 'compass', name: 'Compass', years: ['2017-2026'], variants: ['2.0L Multijet II Turbo Diesel 4x4', '1.4L MultiAir Turbo Petrol', 'Model S'], status: 'current' },
      { id: 'meridian', name: 'Meridian', years: ['2022-2026'], variants: ['2.0L Multijet II Diesel 4x4 9-Speed AT', 'Overland 7-Str'], status: 'current' }
    ]
  },
  {
    id: 'bmw',
    name: 'BMW India',
    logo: '🏎️',
    models: [
      { id: 'bmw_3series', name: '3 Series / Gran Limousine', years: ['2005-2026'], variants: ['330Li M Sport Petrol', '320d Luxury Line'], status: 'current' },
      { id: 'bmw_5series', name: '5 Series', years: ['2003-2026'], variants: ['530i M Sport', '520d Luxury Line'], status: 'current' },
      { id: 'bmw_x1', name: 'X1', years: ['2010-2026'], variants: ['sDrive18i M Sport', 'sDrive18d Diesel'], status: 'current' },
      { id: 'bmw_x5', name: 'X5', years: ['2007-2026'], variants: ['xDrive40i M Sport', 'xDrive30d xLine'], status: 'current' }
    ]
  },
  {
    id: 'mercedes',
    name: 'Mercedes-Benz India',
    logo: '🏎️',
    models: [
      { id: 'c_class', name: 'C-Class', years: ['2001-2026'], variants: ['C 200 Petrol', 'C 220d Diesel', 'C 300d AMG Line'], status: 'current' },
      { id: 'e_class', name: 'E-Class LWB', years: ['2002-2026'], variants: ['E 200 Exclusive', 'E 220d AMG Line', 'E 350d V6 Diesel'], status: 'current' },
      { id: 'glc', name: 'GLC', years: ['2016-2026'], variants: ['GLC 300 4MATIC Petrol', 'GLC 220d 4MATIC Diesel'], status: 'current' }
    ]
  },
  {
    id: 'audi',
    name: 'Audi India',
    logo: '🏎️',
    models: [
      { id: 'audi_a4', name: 'A4', years: ['2005-2026'], variants: ['40 TFSI 2.0L Turbo Petrol', 'Technology Line'], status: 'current' },
      { id: 'audi_q3', name: 'Q3 / Sportback', years: ['2012-2026'], variants: ['40 TFSI quattro', 'Technology'], status: 'current' },
      { id: 'audi_q5', name: 'Q5', years: ['2009-2026'], variants: ['45 TFSI quattro 2.0L Turbo', 'Technology'], status: 'current' }
    ]
  }
];
