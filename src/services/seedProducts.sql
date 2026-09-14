-- ============================================================================
-- AUTOZONEINDIA - PRODUCTS & PRODUCT IMAGES & INVENTORY SEED DATA
-- Postgres / Supabase SQL Script
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
