-- ============================================================================
-- AUTOZONEINDIA MASTER POSTGRESQL / SUPABASE DATABASE SCHEMA
-- Authoritative Production DDL & Indexes Definition
-- Single-Owner E-Commerce Automotive Spare Parts Platform
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. CATEGORIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  status BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. BRANDS
-- ============================================================================
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  status BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. VEHICLES
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  variant TEXT,
  year_from INTEGER,
  year_to INTEGER,
  fuel_type TEXT,
  transmission TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. PRODUCTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sku TEXT UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  description TEXT,
  short_description TEXT,
  price NUMERIC(12,2) DEFAULT 0,
  sale_price NUMERIC(12,2),
  tax_percent NUMERIC(5,2) DEFAULT 0,
  warranty TEXT,
  status BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. PRODUCT IMAGES
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. PRODUCT COMPATIBILITY
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_compatibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  notes TEXT,
  UNIQUE(product_id, vehicle_id)
);

-- ============================================================================
-- 7. INVENTORY
-- ============================================================================
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID UNIQUE NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 0,
  reserved_quantity INTEGER DEFAULT 0,
  low_stock_limit INTEGER DEFAULT 5,
  warehouse TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. CUSTOMERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 9. ADDRESSES
-- ============================================================================
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  name TEXT,
  phone TEXT,
  address_line TEXT NOT NULL,
  area TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 10. ORDERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL,
  subtotal NUMERIC(12,2) DEFAULT 0,
  discount NUMERIC(12,2) DEFAULT 0,
  tax NUMERIC(12,2) DEFAULT 0,
  shipping_charge NUMERIC(12,2) DEFAULT 0,
  total_amount NUMERIC(12,2) DEFAULT 0,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  shipping_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 11. ORDER ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL,
  total_price NUMERIC(12,2) NOT NULL
);

-- ============================================================================
-- 12. ENQUIRIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  message TEXT,
  quantity INTEGER DEFAULT 1,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 13. QUOTATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id UUID REFERENCES enquiries(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  quotation_number TEXT UNIQUE NOT NULL,
  subtotal NUMERIC(12,2) DEFAULT 0,
  discount NUMERIC(12,2) DEFAULT 0,
  tax NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) DEFAULT 0,
  valid_until DATE,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 14. REVIEWS
-- ============================================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  comment TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 15. WISHLIST
-- ============================================================================
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, product_id)
);

-- ============================================================================
-- 16. COUPONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL,
  discount_value NUMERIC(12,2) NOT NULL,
  minimum_order NUMERIC(12,2) DEFAULT 0,
  maximum_discount NUMERIC(12,2),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  usage_limit INTEGER,
  status BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 17. PAYMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payment_method TEXT,
  transaction_id TEXT,
  amount NUMERIC(12,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 18. SHIPPING
-- ============================================================================
CREATE TABLE IF NOT EXISTS shipping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  courier TEXT,
  tracking_number TEXT,
  status TEXT DEFAULT 'pending',
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- ============================================================================
-- 19. ADMIN USERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin',
  status BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 20. WEBSITE SETTINGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS website_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR HIGH-PERFORMANCE QUERY EXECUTION
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_vehicles_make_model ON vehicles(make, model);
CREATE INDEX IF NOT EXISTS idx_compatibility_vehicle ON product_compatibility(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- PRODUCTS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (status = true);

-- CATEGORIES
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active categories" ON categories FOR SELECT USING (status = true);

-- BRANDS
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active brands" ON brands FOR SELECT USING (status = true);

-- VEHICLES
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view vehicles" ON vehicles FOR SELECT USING (true);

-- PRODUCT IMAGES
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view product images" ON product_images FOR SELECT USING (true);

-- COMPATIBILITY
ALTER TABLE product_compatibility ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view compatibility" ON product_compatibility FOR SELECT USING (true);


-- ============================================================================
-- 21. VEHICLES TABLE SEED DATA (16 MAJOR AUTOMOTIVE BRANDS)
-- ============================================================================

INSERT INTO vehicles (make, model, variant, year_from, year_to, fuel_type, transmission) VALUES

-- 1. MARUTI SUZUKI
('Maruti Suzuki', 'Swift', '1.2L DualJet Petrol VXi', 2018, 2024, 'Petrol', 'Manual'),
('Maruti Suzuki', 'Swift', '1.2L ZXi Plus DualTone', 2021, 2026, 'Petrol', 'Automatic'),
('Maruti Suzuki', 'Swift', '1.3L DDiS Diesel LDi/VDi', 2014, 2020, 'Diesel', 'Manual'),
('Maruti Suzuki', 'Baleno', '1.2L K12N Alpha', 2019, 2026, 'Petrol', 'Automatic'),
('Maruti Suzuki', 'Baleno', '1.2L VVT Zeta', 2015, 2022, 'Petrol', 'Manual'),
('Maruti Suzuki', 'WagonR', '1.2L DualJet ZXi+', 2019, 2026, 'Petrol', 'Manual'),
('Maruti Suzuki', 'WagonR', '1.0L LXi CNG', 2019, 2026, 'CNG', 'Manual'),
('Maruti Suzuki', 'Dzire', '1.2L K-Series ZXi', 2017, 2026, 'Petrol', 'AMT'),
('Maruti Suzuki', 'Brezza', '1.5L K15C ZXi Plus', 2020, 2026, 'Petrol', 'Automatic'),
('Maruti Suzuki', 'Vitara Brezza', '1.3L DDiS 200 ZDi', 2016, 2020, 'Diesel', 'Manual'),
('Maruti Suzuki', 'Ertiga', '1.5L K15C ZXi Smart Hybrid', 2018, 2026, 'Petrol', 'Manual'),
('Maruti Suzuki', 'Ertiga', '1.5L VXi CNG', 2019, 2026, 'CNG', 'Manual'),
('Maruti Suzuki', 'Grand Vitara', '1.5L Intelligent Hybrid Alpha+ 4WD', 2022, 2026, 'Hybrid', 'Automatic'),
('Maruti Suzuki', 'Fronx', '1.0L Boosterjet Turbo Alpha', 2023, 2026, 'Petrol', 'Automatic'),
('Maruti Suzuki', 'Alto K10', '1.0L K10C VXi+', 2022, 2026, 'Petrol', 'Manual'),
('Maruti Suzuki', 'Eeco', '1.2L G12B 5-Seater CNG', 2010, 2026, 'CNG', 'Manual'),

-- 2. HYUNDAI
('Hyundai', 'Creta', '1.5L CRDi Diesel SX(O)', 2020, 2026, 'Diesel', 'Manual'),
('Hyundai', 'Creta', '1.5L Turbo GDi SX Opt', 2020, 2026, 'Petrol', 'DCT'),
('Hyundai', 'Creta', '1.6L CRDi SX Plus', 2015, 2020, 'Diesel', 'Automatic'),
('Hyundai', 'Venue', '1.0L Turbo GDi SX(O)', 2019, 2026, 'Petrol', 'DCT'),
('Hyundai', 'Venue', '1.2L Kappa Petrol S', 2019, 2026, 'Petrol', 'Manual'),
('Hyundai', 'i20', '1.2L Kappa Asta (O)', 2020, 2026, 'Petrol', 'Manual'),
('Hyundai', 'Elite i20', '1.4L CRDi Sportz', 2014, 2020, 'Diesel', 'Manual'),
('Hyundai', 'Verna', '1.5L Turbo GDi SX Opt', 2023, 2026, 'Petrol', 'DCT'),
('Hyundai', 'Verna', '1.6L CRDi SX(O)', 2017, 2023, 'Diesel', 'Automatic'),
('Hyundai', 'Grand i10 Nios', '1.2L Kappa Asta', 2019, 2026, 'Petrol', 'AMT'),
('Hyundai', 'Exter', '1.2L Kappa SX(O) Connect', 2023, 2026, 'Petrol', 'Automatic'),
('Hyundai', 'Alcazar', '1.5L Turbo Petrol Signature', 2021, 2026, 'Petrol', 'Automatic'),
('Hyundai', 'Tucson', '2.0L CRDi AWD Signature', 2016, 2026, 'Diesel', 'Automatic'),

-- 3. TATA
('Tata', 'Nexon', '1.2L Revotron Turbo Fearless+', 2023, 2026, 'Petrol', 'DCT'),
('Tata', 'Nexon', '1.5L Revotorq Diesel XZA+', 2017, 2023, 'Diesel', 'AMT'),
('Tata', 'Nexon.ev', 'Empowered+ LR EV 40.5 kWh', 2023, 2026, 'Electric', 'Automatic'),
('Tata', 'Punch', '1.2L Revotron Creative Flagship', 2021, 2026, 'Petrol', 'Manual'),
('Tata', 'Punch.ev', 'Empowered+ Long Range EV', 2024, 2026, 'Electric', 'Automatic'),
('Tata', 'Harrier', '2.0L Kryotec Diesel Fearless+ Dark', 2023, 2026, 'Diesel', 'Automatic'),
('Tata', 'Harrier', '2.0L Kryotec Diesel XZ Plus', 2019, 2023, 'Diesel', 'Manual'),
('Tata', 'Safari', '2.0L Kryotec Diesel Accomplished+', 2021, 2026, 'Diesel', 'Automatic'),
('Tata', 'Tiago', '1.2L Revotron XZ+ iCNG', 2022, 2026, 'CNG', 'Manual'),
('Tata', 'Altroz', '1.2L i-Turbo XZ+ Opt', 2020, 2026, 'Petrol', 'DCT'),
('Tata', 'Curvv', '1.2L Hyperion GDi Accomplished', 2024, 2026, 'Petrol', 'DCT'),

-- 4. MAHINDRA
('Mahindra', 'Scorpio-N', '2.2L mHawk Diesel Z8L 4XPLOR', 2022, 2026, 'Diesel', 'Automatic'),
('Mahindra', 'Scorpio Classic', '2.2L mHawk Diesel S11', 2022, 2026, 'Diesel', 'Manual'),
('Mahindra', 'XUV700', '2.2L mHawk Diesel AX7 Luxury AWD', 2021, 2026, 'Diesel', 'Automatic'),
('Mahindra', 'XUV700', '2.0L mStallion Petrol AX5', 2021, 2026, 'Petrol', 'Manual'),
('Mahindra', 'Thar', '2.2L mHawk Diesel LX 4x4 Hard Top', 2020, 2026, 'Diesel', 'Automatic'),
('Mahindra', 'Thar Roxx', '2.2L mHawk Diesel AX7L 4WD', 2024, 2026, 'Diesel', 'Automatic'),
('Mahindra', 'Bolero Neo', '1.5L mHawk75 N10 Option', 2021, 2026, 'Diesel', 'Manual'),
('Mahindra', 'Bolero', '1.5L mHawk75 ZLX', 2011, 2020, 'Diesel', 'Manual'),
('Mahindra', 'XUV 3XO / XUV300', '1.2L mStallion TGDi AX7L', 2019, 2026, 'Petrol', 'Automatic'),

-- 5. TOYOTA
('Toyota', 'Innova Crysta', '2.4L D-4D Diesel VX 7-Seater', 2016, 2026, 'Diesel', 'Manual'),
('Toyota', 'Innova Hycross', '2.0L Strong Hybrid ZX(O)', 2023, 2026, 'Hybrid', 'Automatic'),
('Toyota', 'Fortuner', '2.8L D-4D Diesel 4x4 AT Legender', 2021, 2026, 'Diesel', 'Automatic'),
('Toyota', 'Fortuner', '2.7L VVT-i Petrol 4x2 MT', 2016, 2021, 'Petrol', 'Manual'),
('Toyota', 'Urban Cruiser Hyryder', '1.5L Strong Hybrid V AWD', 2022, 2026, 'Hybrid', 'Automatic'),
('Toyota', 'Glanza', '1.2L K-Series V AMT', 2022, 2026, 'Petrol', 'AMT'),
('Toyota', 'Camry', '2.5L Dynamic Force Hybrid', 2019, 2026, 'Hybrid', 'Automatic'),

-- 6. HONDA
('Honda', 'City', '1.5L i-VTEC ZX CVT (5th Gen)', 2020, 2026, 'Petrol', 'CVT'),
('Honda', 'City', '1.5L e:HEV Strong Hybrid ZX', 2022, 2026, 'Hybrid', 'Automatic'),
('Honda', 'City', '1.5L i-DTEC Diesel VX (4th Gen)', 2014, 2020, 'Diesel', 'Manual'),
('Honda', 'Elevate', '1.5L i-VTEC ZX CVT ADAS', 2023, 2026, 'Petrol', 'CVT'),
('Honda', 'Amaze', '1.2L i-VTEC VX CVT', 2018, 2026, 'Petrol', 'CVT'),
('Honda', 'Civic', '1.8L i-VTEC ZX CVT', 2019, 2021, 'Petrol', 'CVT'),

-- 7. KIA
('Kia', 'Seltos', '1.5L Turbo GDi GTX+ DCT', 2023, 2026, 'Petrol', 'DCT'),
('Kia', 'Seltos', '1.5L CRDi Diesel HTX AT', 2019, 2023, 'Diesel', 'Automatic'),
('Kia', 'Sonet', '1.0L Turbo GDi X-Line DCT', 2020, 2026, 'Petrol', 'DCT'),
('Kia', 'Carens', '1.5L CRDi Diesel Luxury Plus 7-Str', 2022, 2026, 'Diesel', 'Automatic'),
('Kia', 'EV6', '77.4 kWh AWD GT-Line EV', 2022, 2026, 'Electric', 'Automatic'),

-- 8. VOLKSWAGEN
('Volkswagen', 'Virtus', '1.5L TSI EVO GT Plus DSG', 2022, 2026, 'Petrol', 'DCT'),
('Volkswagen', 'Taigun', '1.5L TSI EVO GT Edge DSG', 2021, 2026, 'Petrol', 'DCT'),
('Volkswagen', 'Polo', '1.0L TSI Highline Plus', 2020, 2022, 'Petrol', 'Manual'),
('Volkswagen', 'Polo', '1.2L GT TSI DSG', 2013, 2020, 'Petrol', 'DCT'),
('Volkswagen', 'Vento', '1.0L TSI Highline Plus', 2020, 2022, 'Petrol', 'Manual'),

-- 9. SKODA
('Skoda', 'Slavia', '1.5L TSI DSG Style Matte Edition', 2022, 2026, 'Petrol', 'DCT'),
('Skoda', 'Kushaq', '1.5L TSI DSG Monte Carlo', 2021, 2026, 'Petrol', 'DCT'),
('Skoda', 'Octavia', '2.0L TSI DSG L&K', 2021, 2023, 'Petrol', 'DCT'),
('Skoda', 'Rapid', '1.0L TSI Monte Carlo', 2020, 2021, 'Petrol', 'Manual'),

-- 10. RENAULT
('Renault', 'Kwid', '1.0L SCe Climber EASY-R AMT', 2019, 2026, 'Petrol', 'AMT'),
('Renault', 'Kiger', '1.0L Turbo RXZ CVT', 2021, 2026, 'Petrol', 'CVT'),
('Renault', 'Triber', '1.0L Energy RXT EASY-R 7-Str', 2019, 2026, 'Petrol', 'AMT'),
('Renault', 'Duster', '1.3L Turbo RxZ 156 hp', 2020, 2022, 'Petrol', 'Manual'),

-- 11. NISSAN
('Nissan', 'Magnite', '1.0L HRA0 Turbo XV Premium CVT', 2020, 2026, 'Petrol', 'CVT'),
('Nissan', 'Kicks', '1.3L Turbo XV Premium', 2020, 2023, 'Petrol', 'Manual'),
('Nissan', 'Sunny', '1.5L k9k Diesel XV Premium', 2011, 2020, 'Diesel', 'Manual'),

-- 12. MG (MORRIS GARAGES)
('MG', 'Hector', '1.5L Turbo Petrol Savvy Pro CVT', 2021, 2026, 'Petrol', 'CVT'),
('MG', 'Hector', '2.0L Multijet Diesel Sharp', 2019, 2024, 'Diesel', 'Manual'),
('MG', 'ZS EV', '50.3 kWh Exclusive Pro EV', 2022, 2026, 'Electric', 'Automatic'),
('MG', 'Astor', '1.3L Turbo Petrol Savvy Pro ADAS', 2021, 2026, 'Petrol', 'Automatic'),

-- 13. JEEP
('Jeep', 'Compass', '2.0L Multijet II Diesel Model S 4x4 AT', 2021, 2026, 'Diesel', 'Automatic'),
('Jeep', 'Compass', '1.4L MultiAir Turbo Petrol Limited', 2017, 2021, 'Petrol', 'Manual'),
('Jeep', 'Meridian', '2.0L Multijet II Diesel Overland 4x4', 2022, 2026, 'Diesel', 'Automatic'),

-- 14. BMW
('BMW', '3 Series Gran Limousine', '330Li M Sport 2.0L Turbo', 2021, 2026, 'Petrol', 'Automatic'),
('BMW', '5 Series', '530i M Sport 2.0L Turbo', 2017, 2024, 'Petrol', 'Automatic'),
('BMW', 'X1', 'sDrive18d M Sport Diesel', 2020, 2026, 'Diesel', 'Automatic'),
('BMW', 'X5', 'xDrive40i M Sport 3.0L Turbo', 2019, 2026, 'Petrol', 'Automatic'),

-- 15. MERCEDES-BENZ
('Mercedes-Benz', 'C-Class', 'C 220d AMG Line 2.0L Diesel', 2022, 2026, 'Diesel', 'Automatic'),
('Mercedes-Benz', 'E-Class LWB', 'E 220d Exclusive 2.0L Diesel', 2017, 2026, 'Diesel', 'Automatic'),
('Mercedes-Benz', 'GLC', 'GLC 300 4MATIC 2.0L Turbo', 2020, 2026, 'Petrol', 'Automatic'),

-- 16. AUDI
('Audi', 'A4', '40 TFSI Technology 2.0L Turbo', 2021, 2026, 'Petrol', 'Automatic'),
('Audi', 'Q3', '40 TFSI quattro Technology', 2022, 2026, 'Petrol', 'Automatic'),
('Audi', 'Q5', '45 TFSI quattro Technology 2.0L', 2021, 2026, 'Petrol', 'Automatic');


-- ============================================================================
-- 22. CATEGORIES TABLE SEED DATA (15 CAR-PARTS CATEGORIES)
-- ============================================================================

INSERT INTO categories (name, slug, description, image_url, status) VALUES
('Engine', 'engine', 'Pistons, gaskets, timing belts, cylinder heads, spark plugs, fuel pumps & core engine assemblies', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('Brake', 'brake', 'Front & rear brake pads, disc rotors, brake drums, calipers, shoes & DOT brake fluid', 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=500&q=80', true),
('Clutch', 'clutch', 'Clutch kits, pressure plates, release bearings, flywheels, master & slave cylinders', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&q=80', true),
('Suspension', 'suspension', 'Shock absorbers, struts, coil springs, lower control arms, sway bar links & bushings', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500&q=80', true),
('Steering', 'steering', 'Power steering racks, steering pumps, tie rod ends, steering shafts & EPS modules', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80', true),
('Electrical', 'electrical', 'Sensors, alternators, starter motors, ignition coils, relays, switches & wiring harnesses', 'https://images.unsplash.com/photo-1558441719-443b38605d58?w=500&q=80', true),
('Filters', 'filters', 'Engine air filters, spin-on oil filters, activated carbon cabin AC filters & fuel filters', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('Cooling', 'cooling', 'Radiators, water pumps, cooling fans, thermostats, expansion tanks & coolant concentrate', 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&q=80', true),
('AC', 'ac', 'AC compressors, condenser coils, expansion valves, blower motors & refrigerant gas', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&q=80', true),
('Body Parts', 'body-parts', 'Wiper blades, bumpers, fenders, side view mirrors, grilles, door handles & headlight brackets', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80', true),
('Lights', 'lights', 'LED headlight bulbs, projector headlamps, fog lamp assemblies, tail lights & signal lamps', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500&q=80', true),
('Accessories', 'accessories', '7D floor mats, 360 mobile holders, seat covers, dash cameras & car detailing supplies', 'https://images.unsplash.com/photo-1558441719-443b38605d58?w=500&q=80', true),
('Battery', 'battery', '12V automotive batteries, AGM start-stop batteries, jumper cables & charger clamps', 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=500&q=80', true),
('Tyres', 'tyres', 'Tubeless radial tyres, high performance SUV tyres, alloy wheel rims & tyre pressure sensors', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('Lubricants', 'lubricants', 'Fully synthetic engine oils 5W-30/0W-20, gear oils 80W-90, transmission fluids & brake fluids', 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&q=80', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status;


-- ============================================================================
-- 23. BRANDS TABLE SEED DATA (25 OEM, OES & AFTERMARKET BRANDS)
-- ============================================================================

INSERT INTO brands (name, slug, description, logo_url, status) VALUES
('BOSCH', 'bosch', 'German OEM & OES leader in brake pads, spark plugs, sensors, wiper blades & filtration systems', 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=500&q=80', true),
('UNO MINDA', 'uno-minda', 'Leading Indian OEM manufacturer of automotive lighting, horn systems, switches & alloy wheels', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500&q=80', true),
('Lucas TVS', 'lucas-tvs', 'OEM supplier of starter motors, alternators, wiper motors, ignition coils & electrical systems', 'https://images.unsplash.com/photo-1558441719-443b38605d58?w=500&q=80', true),
('Gabriel India', 'gabriel-india', 'Pioneer in OEM ride control products, gas-charged shock absorbers & strut assemblies', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500&q=80', true),
('Castrol', 'castrol', 'World class motor lubricants, synthetic engine oils, transmission fluids & coolants', 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&q=80', true),
('Shell Helix', 'shell-helix', 'Premium synthetic motor oils featuring PurePlus technology for engine protection', 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&q=80', true),
('Motul', 'motul', 'High-performance synthetic engine lubricants, gear oils, 100% synthetic brake fluids', 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&q=80', true),
('Elofic', 'elofic', 'Indian OEM manufacturer of high-efficiency air filters, oil filters, cabin AC & fuel filters', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('Exide Batteries', 'exide-batteries', 'Leading OEM manufacturer of 12V zero-maintenance car batteries & AGM start-stop batteries', 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=500&q=80', true),
('Amaron', 'amaron', 'Long-lasting zero-maintenance automotive batteries with Silven X alloy technology', 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=500&q=80', true),
('Valeo', 'valeo', 'French OEM supplier of clutch kits, dual-mass flywheels, headlamp assemblies & wiper blades', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&q=80', true),
('SACHS', 'sachs', 'German ZF OEM brand for heavy duty clutch plates, pressure kits & damper shock absorbers', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&q=80', true),
('Monroe', 'monroe', 'Global leader in aftermarket ride control, strut assemblies & suspension shocks', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500&q=80', true),
('Denso', 'denso', 'Japanese OEM supplier of radiators, AC compressors, fuel injectors & iridium spark plugs', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('Subros', 'subros', 'India''s largest OEM manufacturer of car air conditioning compressors & thermal systems', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&q=80', true),
('Maruti Suzuki Genuine Parts (MSGP)', 'msgp', '100% Original factory parts direct from Maruti Suzuki India Limited', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('Hyundai Genuine Parts (Mobis)', 'hyundai-mobis', '100% Genuine factory original replacement parts for Hyundai vehicles', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('Tata Motors Genuine Parts', 'tata-genuine', '100% Original factory replacement parts certified for Tata passenger vehicles', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('Mahindra mGENUINE', 'mahindra-mgenuine', 'Factory authentic spare parts designed specifically for Mahindra SUVs and pickups', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('Toyota Genuine Parts', 'toyota-genuine', 'Original OEM replacement parts precision engineered for Toyota vehicles', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('MRF Tyres', 'mrf-tyres', 'India''s largest tyre manufacturer supplying OEM radial tyres for cars & SUVs', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('Apollo Tyres', 'apollo-tyres', 'High-speed tubeless radial tyres engineered for Indian road conditions', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('CEAT Tyres', 'ceat-tyres', 'High-grip tubeless tyres for all passenger cars, compact hatchbacks & SUVs', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('JK Tyre', 'jk-tyre', 'Pioneer of radial tyre technology in India providing durable tubeless car tyres', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('Brembo', 'brembo', 'World famous Italian high-performance brake discs, calipers & ceramic pads', 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=500&q=80', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  logo_url = EXCLUDED.logo_url,
  status = EXCLUDED.status;


-- ============================================================================
-- 24. PRODUCTS TABLE & IMAGES & INVENTORY SEED DATA
-- ============================================================================

DO $$
DECLARE
  v_cat_engine UUID;
  v_cat_brake UUID;
  v_cat_clutch UUID;
  v_cat_suspension UUID;
  v_cat_electrical UUID;
  v_cat_filters UUID;
  v_cat_ac UUID;
  v_cat_lights UUID;
  v_cat_battery UUID;
  v_cat_tyres UUID;
  v_cat_lubricants UUID;

  v_brand_bosch UUID;
  v_brand_minda UUID;
  v_brand_lucas UUID;
  v_brand_gabriel UUID;
  v_brand_castrol UUID;
  v_brand_elofic UUID;
  v_brand_exide UUID;
  v_brand_valeo UUID;
  v_brand_denso UUID;
  v_brand_subros UUID;
  v_brand_apollo UUID;
  v_brand_brembo UUID;

  v_p1 UUID := gen_random_uuid();
  v_p2 UUID := gen_random_uuid();
  v_p3 UUID := gen_random_uuid();
  v_p4 UUID := gen_random_uuid();
  v_p5 UUID := gen_random_uuid();
  v_p6 UUID := gen_random_uuid();
  v_p7 UUID := gen_random_uuid();
  v_p8 UUID := gen_random_uuid();
  v_p9 UUID := gen_random_uuid();
  v_p10 UUID := gen_random_uuid();
  v_p11 UUID := gen_random_uuid();
  v_p12 UUID := gen_random_uuid();
BEGIN
  -- Get Category IDs
  SELECT id INTO v_cat_engine FROM categories WHERE slug = 'engine' LIMIT 1;
  SELECT id INTO v_cat_brake FROM categories WHERE slug = 'brake' LIMIT 1;
  SELECT id INTO v_cat_clutch FROM categories WHERE slug = 'clutch' LIMIT 1;
  SELECT id INTO v_cat_suspension FROM categories WHERE slug = 'suspension' LIMIT 1;
  SELECT id INTO v_cat_electrical FROM categories WHERE slug = 'electrical' LIMIT 1;
  SELECT id INTO v_cat_filters FROM categories WHERE slug = 'filters' LIMIT 1;
  SELECT id INTO v_cat_ac FROM categories WHERE slug = 'ac' LIMIT 1;
  SELECT id INTO v_cat_lights FROM categories WHERE slug = 'lights' LIMIT 1;
  SELECT id INTO v_cat_battery FROM categories WHERE slug = 'battery' LIMIT 1;
  SELECT id INTO v_cat_tyres FROM categories WHERE slug = 'tyres' LIMIT 1;
  SELECT id INTO v_cat_lubricants FROM categories WHERE slug = 'lubricants' LIMIT 1;

  -- Get Brand IDs
  SELECT id INTO v_brand_bosch FROM brands WHERE slug = 'bosch' LIMIT 1;
  SELECT id INTO v_brand_minda FROM brands WHERE slug = 'uno-minda' LIMIT 1;
  SELECT id INTO v_brand_lucas FROM brands WHERE slug = 'lucas-tvs' LIMIT 1;
  SELECT id INTO v_brand_gabriel FROM brands WHERE slug = 'gabriel-india' LIMIT 1;
  SELECT id INTO v_brand_castrol FROM brands WHERE slug = 'castrol' LIMIT 1;
  SELECT id INTO v_brand_elofic FROM brands WHERE slug = 'elofic' LIMIT 1;
  SELECT id INTO v_brand_exide FROM brands WHERE slug = 'exide-batteries' LIMIT 1;
  SELECT id INTO v_brand_valeo FROM brands WHERE slug = 'valeo' LIMIT 1;
  SELECT id INTO v_brand_denso FROM brands WHERE slug = 'denso' LIMIT 1;
  SELECT id INTO v_brand_subros FROM brands WHERE slug = 'subros' LIMIT 1;
  SELECT id INTO v_brand_apollo FROM brands WHERE slug = 'apollo-tyres' LIMIT 1;
  SELECT id INTO v_brand_brembo FROM brands WHERE slug = 'brembo' LIMIT 1;

  -- 1. INSERT PRODUCTS
  INSERT INTO products (id, name, slug, sku, category_id, brand_id, description, short_description, price, sale_price, tax_percent, warranty, status, featured) VALUES
  (v_p1, 'Bosch High Performance Ceramic Front Brake Pad Set', 'bosch-ceramic-front-brake-pad-set', 'AZI-BOSCH-BP-9942', v_cat_brake, v_brand_bosch, 'Low-metallic ceramic front brake pad kit engineered for extreme stopping power, low dust, and high thermal resistance up to 650°C.', 'Ceramic fade-resistant front brake pad set for passenger cars.', 4200.00, 3450.00, 18.00, '12 Months / 20,000 KM Warranty', true, true),
  
  (v_p2, 'Bosch Spin-On Heavy Duty Oil Filter', 'bosch-spin-on-heavy-duty-oil-filter', 'AZI-BOSCH-OF-1042', v_cat_filters, v_brand_bosch, 'High-efficiency micro-glass fiber oil filter element providing 99% filtration efficiency against dirt and metal particles.', 'Premium spin-on oil filter for synthetic motor oil protection.', 450.00, 320.00, 18.00, '6 Months Manufacturer Warranty', true, false),

  (v_p3, 'Elofic High-Flow Engine Air Filter Assembly', 'elofic-high-flow-engine-air-filter', 'AZI-ELOFIC-AF-8821', v_cat_filters, v_brand_elofic, 'Synthetic media engine air filter designed for maximum dust holding capacity and clean air intake flow in Indian road conditions.', 'High airflow clean engine air filter element.', 850.00, 640.00, 18.00, '6 Months / 10,000 KM Warranty', true, true),

  (v_p4, 'Subros OEM AC Compressor Assembly', 'subros-oem-ac-compressor-assembly', 'AZI-SUBROS-AC-4011', v_cat_ac, v_brand_subros, 'Factory original 10PA15C swash-plate AC compressor assembly for fast cabin cooling and energy-efficient refrigerant compression.', 'Heavy duty OE car air conditioner compressor pump.', 18500.00, 15400.00, 28.00, '12 Months Manufacturer Warranty', true, true),

  (v_p5, 'Uno Minda LED Projector Headlamp Assembly (Pair)', 'uno-minda-led-projector-headlamp-pair', 'AZI-MINDA-HL-7731', v_cat_lights, v_brand_minda, 'High-intensity dual-beam LED projector headlight assemblies with integrated DRL daytime running light strips and waterproof housing.', 'Custom LED projector headlamp pair with high-visibility DRL.', 12500.00, 9800.00, 28.00, '24 Months Replacement Warranty', true, true),

  (v_p6, 'Castrol EDGE 5W-40 Fully Synthetic Motor Oil (4L)', 'castrol-edge-5w-40-fully-synthetic-oil-4l', 'AZI-CASTROL-5W40-4L', v_cat_lubricants, v_brand_castrol, 'Advanced full synthetic motor oil fortified with Fluid TITANIUM technology to double film strength and prevent oil breakdown.', '4-Litre pack 5W-40 fully synthetic engine oil for petrol & diesel cars.', 4200.00, 3250.00, 18.00, '100% Genuine Certified Lubricant', true, true),

  (v_p7, 'Exide Epiq 12V 45Ah Zero Maintenance Car Battery', 'exide-epiq-12v-45ah-car-battery', 'AZI-EXIDE-EPIQ-45AH', v_cat_battery, v_brand_exide, 'Heavy duty maintenance-free 12V automotive battery with Special 3D Grid technology for high cranking power in hot Indian summers.', '12V 45Ah maintenance-free car battery with 55-month warranty.', 7800.00, 6100.00, 28.00, '55 Months Manufacturer Warranty', true, true),

  (v_p8, 'Gabriel Gas-Charged Front Shock Absorber Pair', 'gabriel-gas-charged-front-shock-absorber-pair', 'AZI-GABRIEL-SA-5021', v_cat_suspension, v_brand_gabriel, 'Twin-tube nitrogen gas-charged front shock absorbers designed for smooth ride quality, reduced body roll, and long seal life.', 'OE replacement front strut shock absorber pair.', 5600.00, 4350.00, 18.00, '12 Months / 20,000 KM Warranty', true, false),

  (v_p9, 'Valeo OE Complete Clutch Kit (Plate + Pressure + Bearing)', 'valeo-oe-complete-clutch-kit', 'AZI-VALEO-CK-3021', v_cat_clutch, v_brand_valeo, 'Complete 3-piece clutch assembly including organic friction clutch disc, heavy duty diaphragm pressure plate, and release bearing.', 'OE 3-piece clutch plate, pressure cover and release bearing set.', 8900.00, 6950.00, 18.00, '12 Months / 20,000 KM Warranty', true, true),

  (v_p10, 'Lucas TVS Heavy Duty Starter Motor Assembly', 'lucas-tvs-heavy-duty-starter-motor', 'AZI-LUCAS-SM-6011', v_cat_electrical, v_brand_lucas, 'Direct-drive 12V high-torque starter motor assembly engineered for quick engine cold-cranking and low electrical drain.', '12V high-torque OE starter motor unit.', 6500.00, 4950.00, 18.00, '12 Months Warranty', true, false),

  (v_p11, 'Apollo Alnac 4G 185/65 R15 Tubeless Car Tyre', 'apollo-alnac-4g-185-65-r15-tubeless-tyre', 'AZI-APOLLO-185-65R15', v_cat_tyres, v_brand_apollo, 'High-grip tubeless radial tyre featuring circumferential tread grooves for water evacuation, low rolling resistance and silent ride.', '185/65 R15 tubeless radial car tyre.', 5800.00, 4650.00, 28.00, '5 Years Manufacturer Warranty', true, true),

  (v_p12, 'Brembo Ventilated Front Brake Disc Rotors (Pair)', 'brembo-ventilated-front-brake-disc-rotors-pair', 'AZI-BREMBO-BD-2022', v_cat_brake, v_brand_brembo, 'High-carbon cast iron ventilated brake disc rotors precision machined to eliminate thermal distortion and squeal vibrations.', 'High-performance ventilated front brake disc pair.', 9500.00, 7800.00, 18.00, '24 Months Warranty', true, true);

  -- 2. INSERT PRODUCT IMAGES (SUPABASE STORAGE URL INTEGRATION + PRIMARY FLAGS)
  INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
  (v_p1, 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?auto=format&fit=crop&w=800&q=80', 'Bosch Front Brake Pads - Main View', 0, true),
  (v_p1, 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80', 'Bosch Front Brake Pads - Side Angle', 1, false),

  (v_p2, 'https://images.unsplash.com/photo-1600792580403-0550a1030699?auto=format&fit=crop&w=800&q=80', 'Bosch Oil Filter - Product View', 0, true),

  (v_p3, 'https://images.unsplash.com/photo-1600792580403-0550a1030699?auto=format&fit=crop&w=800&q=80', 'Elofic Engine Air Filter', 0, true),

  (v_p4, 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80', 'Subros AC Compressor Assembly', 0, true),

  (v_p5, 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80', 'Uno Minda LED Projector Headlamp Pair', 0, true),

  (v_p6, 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80', 'Castrol EDGE 5W-40 4L Canister', 0, true),

  (v_p7, 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?auto=format&fit=crop&w=800&q=80', 'Exide Epiq 12V 45Ah Car Battery', 0, true),

  (v_p8, 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80', 'Gabriel Gas-Charged Shock Absorber Pair', 0, true),

  (v_p9, 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80', 'Valeo 3-Piece Complete Clutch Kit', 0, true),

  (v_p10, 'https://images.unsplash.com/photo-1558441719-443b38605d58?auto=format&fit=crop&w=800&q=80', 'Lucas TVS Starter Motor', 0, true),

  (v_p11, 'https://images.unsplash.com/photo-1600792580403-0550a1030699?auto=format&fit=crop&w=800&q=80', 'Apollo Alnac 4G 185/65 R15 Tyre', 0, true),

  (v_p12, 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?auto=format&fit=crop&w=800&q=80', 'Brembo Front Brake Disc Rotors Pair', 0, true);

  -- 3. INSERT INVENTORY RECORDS
  INSERT INTO inventory (product_id, quantity, reserved_quantity, low_stock_limit, warehouse) VALUES
  (v_p1, 24, 3, 5, 'Mumbai Central Hub'),
  (v_p2, 85, 5, 10, 'Mumbai Central Hub'),
  (v_p3, 60, 4, 10, 'Delhi NCR Warehouse'),
  (v_p4, 8, 1, 2, 'Mumbai Central Hub'),
  (v_p5, 15, 2, 3, 'Bengaluru Hub'),
  (v_p6, 40, 6, 8, 'Mumbai Central Hub'),
  (v_p7, 18, 2, 4, 'Delhi NCR Warehouse'),
  (v_p8, 20, 3, 5, 'Mumbai Central Hub'),
  (v_p9, 12, 1, 3, 'Mumbai Central Hub'),
  (v_p10, 14, 2, 3, 'Chennai Depot'),
  (v_p11, 32, 4, 6, 'Mumbai Central Hub'),
  (v_p12, 10, 1, 2, 'Mumbai Central Hub');

END $$;





