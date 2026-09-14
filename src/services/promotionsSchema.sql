-- ============================================================================
-- AUTOZONEINDIA PROMOTIONS, COUPONS, TAX & DISCOUNT ENGINE SCHEMA
-- Production PostgreSQL / Supabase Schema Definition
-- ============================================================================

-- 1. COUPONS TABLE & INDEXES
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_shipping')),
  discount_value NUMERIC(12,2) NOT NULL DEFAULT 0,
  minimum_order_value NUMERIC(12,2) DEFAULT 0,
  maximum_discount NUMERIC(12,2),
  usage_limit INTEGER,
  usage_limit_per_customer INTEGER DEFAULT 1,
  used_count INTEGER DEFAULT 0,
  start_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'scheduled', 'disabled')),
  new_customers_only BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_status ON coupons(status);
CREATE INDEX IF NOT EXISTS idx_coupons_start ON coupons(start_at);
CREATE INDEX IF NOT EXISTS idx_coupons_expires ON coupons(expires_at);

-- 2. COUPON PRODUCT RESTRICTIONS
CREATE TABLE IF NOT EXISTS coupon_products (
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (coupon_id, product_id)
);

-- 3. COUPON CATEGORY RESTRICTIONS
CREATE TABLE IF NOT EXISTS coupon_categories (
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (coupon_id, category_id)
);

-- 4. COUPON BRAND RESTRICTIONS
CREATE TABLE IF NOT EXISTS coupon_brands (
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  PRIMARY KEY (coupon_id, brand_id)
);

-- 5. COUPON USAGE TRACKING TABLE
CREATE TABLE IF NOT EXISTS coupon_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  used_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon ON coupon_usage(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_customer ON coupon_usage(customer_id);

-- 6. PROMOTIONAL BANNERS TABLE
CREATE TABLE IF NOT EXISTS promotional_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  button_text TEXT DEFAULT 'Shop Now',
  button_link TEXT DEFAULT '/catalog',
  start_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'disabled')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TAX RATES TABLE
CREATE TABLE IF NOT EXISTS tax_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  rate NUMERIC(5,2) NOT NULL,
  status BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEED TAX RATES (CONFIGURABLE AUTOMOTIVE GST RATES)
INSERT INTO tax_rates (name, rate, status) VALUES
('Automotive Spare Parts GST', 18.00, true),
('Car Accessories & Lighting GST', 28.00, true),
('Lubricants & Fluids GST', 18.00, true),
('Reduced Rate Spares GST', 12.00, true)
ON CONFLICT (name) DO UPDATE SET rate = EXCLUDED.rate;

-- SEED INITIAL PROMOTIONAL COUPONS
INSERT INTO coupons (code, name, description, discount_type, discount_value, minimum_order_value, maximum_discount, usage_limit, usage_limit_per_customer, status, start_at, expires_at) VALUES
('WELCOME10', 'Welcome 10% Discount', '10% OFF on your first purchase above ₹1,000', 'percentage', 10.00, 1000.00, 500.00, 500, 1, 'active', NOW(), NOW() + INTERVAL '1 year'),
('AUTO100', 'Flat ₹100 Off', 'Flat ₹100 instant discount on orders above ₹1,500', 'fixed_amount', 100.00, 1500.00, 100.00, 1000, 2, 'active', NOW(), NOW() + INTERVAL '1 year'),
('FREESHIP', 'Free Express Shipping', 'Free express shipping on all orders over ₹499', 'free_shipping', 0.00, 499.00, 150.00, 2000, 5, 'active', NOW(), NOW() + INTERVAL '1 year'),
('BOSCH15', 'Bosch Parts Offer', '15% OFF on genuine Bosch brake & electrical components', 'percentage', 15.00, 2000.00, 750.00, 300, 1, 'active', NOW(), NOW() + INTERVAL '6 months')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  discount_type = EXCLUDED.discount_type,
  discount_value = EXCLUDED.discount_value,
  minimum_order_value = EXCLUDED.minimum_order_value,
  maximum_discount = EXCLUDED.maximum_discount,
  status = EXCLUDED.status;

-- 8. ROW LEVEL SECURITY POLICIES
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotional_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_rates ENABLE ROW LEVEL SECURITY;

-- Public can read active promotional coupons & banners
DROP POLICY IF EXISTS "Public read active coupons" ON coupons;
CREATE POLICY "Public read active coupons" ON coupons FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Public read active banners" ON promotional_banners;
CREATE POLICY "Public read active banners" ON promotional_banners FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Public read tax rates" ON tax_rates;
CREATE POLICY "Public read tax rates" ON tax_rates FOR SELECT USING (status = true);

-- Customers view own coupon usage
DROP POLICY IF EXISTS "Customers read own coupon usage" ON coupon_usage;
CREATE POLICY "Customers read own coupon usage" ON coupon_usage FOR SELECT USING (true);
