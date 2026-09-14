-- ============================================================================
-- AUTOZONEINDIA MASTER VEHICLE DATA SYSTEM (SCALABLE 6-TIER ARCHITECTURE)
-- PostgreSQL / Supabase DDL, Indexes, Views & Row Level Security Policies
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. VEHICLE MANUFACTURERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicle_manufacturers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL,
  logo_url TEXT,
  status BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. VEHICLE MODELS
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicle_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manufacturer_id UUID NOT NULL REFERENCES vehicle_manufacturers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  body_type TEXT, -- Hatchback, Sedan, SUV, MUV, Coupe, Convertible, Wagon
  status BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(manufacturer_id, name)
);

-- ============================================================================
-- 3. VEHICLE GENERATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicle_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES vehicle_models(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., '2nd Generation (AN140)'
  generation_code TEXT, -- e.g., 'AN140', 'G20', 'W206'
  year_from INTEGER NOT NULL,
  year_to INTEGER, -- NULL indicates current production
  status BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(model_id, name)
);

-- ============================================================================
-- 4. VEHICLE VARIANTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicle_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id UUID NOT NULL REFERENCES vehicle_generations(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., '2.4 ZX Diesel AT'
  engine TEXT, -- e.g., '2.4L 2GD-FTV Turbocharged I4'
  engine_cc INTEGER, -- e.g., 2393
  fuel_type TEXT NOT NULL, -- Petrol, Diesel, CNG, Hybrid, EV
  transmission TEXT NOT NULL, -- Manual, Automatic, AMT, CVT, DCT
  drivetrain TEXT DEFAULT 'FWD', -- FWD, RWD, AWD, 4WD
  power TEXT, -- e.g., '148 bhp @ 3400 rpm'
  year_from INTEGER NOT NULL,
  year_to INTEGER,
  status BOOLEAN DEFAULT true,
  source_name TEXT DEFAULT 'Verified OEM Specifications',
  source_url TEXT,
  source_last_checked DATE DEFAULT CURRENT_DATE,
  source_confidence NUMERIC(3,2) DEFAULT 1.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(generation_id, name, fuel_type, transmission, year_from)
);

-- ============================================================================
-- 5. VEHICLE MARKETS
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicle_markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country TEXT NOT NULL,
  region TEXT NOT NULL, -- South Asia, Europe, North America, Global
  currency TEXT DEFAULT 'INR',
  status BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(country, region)
);

-- ============================================================================
-- 6. VEHICLE MARKET VARIANTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicle_market_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID NOT NULL REFERENCES vehicle_variants(id) ON DELETE CASCADE,
  market_id UUID NOT NULL REFERENCES vehicle_markets(id) ON DELETE CASCADE,
  market_name TEXT, -- Local trim badge name in that market
  status BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(variant_id, market_id)
);

-- ============================================================================
-- 7. PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_v_models_mfr ON vehicle_models(manufacturer_id);
CREATE INDEX IF NOT EXISTS idx_v_models_slug ON vehicle_models(slug);
CREATE INDEX IF NOT EXISTS idx_v_gens_model ON vehicle_generations(model_id);
CREATE INDEX IF NOT EXISTS idx_v_gens_years ON vehicle_generations(year_from, year_to);
CREATE INDEX IF NOT EXISTS idx_v_variants_gen ON vehicle_variants(generation_id);
CREATE INDEX IF NOT EXISTS idx_v_variants_fuel ON vehicle_variants(fuel_type);
CREATE INDEX IF NOT EXISTS idx_v_variants_trans ON vehicle_variants(transmission);
CREATE INDEX IF NOT EXISTS idx_v_variants_years ON vehicle_variants(year_from, year_to);
CREATE INDEX IF NOT EXISTS idx_v_variants_source ON vehicle_variants(source_name);

-- ============================================================================
-- 8. UNIFIED BACKWARD-COMPATIBLE VIEW: vehicles
-- ============================================================================
CREATE OR REPLACE VIEW vehicles AS
SELECT 
  v.id AS id,
  m.name AS make,
  m.slug AS make_slug,
  m.country AS country,
  mod.name AS model,
  mod.slug AS model_slug,
  mod.body_type AS body_type,
  gen.name AS generation,
  gen.generation_code AS generation_code,
  v.name AS variant,
  v.engine AS engine,
  v.engine_cc AS engine_cc,
  v.fuel_type AS fuel_type,
  v.transmission AS transmission,
  v.drivetrain AS drivetrain,
  v.power AS power,
  v.year_from AS year_from,
  v.year_to AS year_to,
  v.status AS status,
  v.source_name AS source_name,
  v.source_confidence AS source_confidence,
  v.created_at AS created_at
FROM vehicle_variants v
JOIN vehicle_generations gen ON v.generation_id = gen.id
JOIN vehicle_models mod ON gen.model_id = mod.id
JOIN vehicle_manufacturers m ON mod.manufacturer_id = m.id;

-- ============================================================================
-- 9. SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE vehicle_manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_market_variants ENABLE ROW LEVEL SECURITY;

-- Customers & Anon can view active vehicle records
DROP POLICY IF EXISTS "Public can view active manufacturers" ON vehicle_manufacturers;
CREATE POLICY "Public can view active manufacturers" ON vehicle_manufacturers FOR SELECT USING (status = true);

DROP POLICY IF EXISTS "Public can view active models" ON vehicle_models;
CREATE POLICY "Public can view active models" ON vehicle_models FOR SELECT USING (status = true);

DROP POLICY IF EXISTS "Public can view active generations" ON vehicle_generations;
CREATE POLICY "Public can view active generations" ON vehicle_generations FOR SELECT USING (status = true);

DROP POLICY IF EXISTS "Public can view active variants" ON vehicle_variants;
CREATE POLICY "Public can view active variants" ON vehicle_variants FOR SELECT USING (status = true);

DROP POLICY IF EXISTS "Public can view active markets" ON vehicle_markets;
CREATE POLICY "Public can view active markets" ON vehicle_markets FOR SELECT USING (status = true);

DROP POLICY IF EXISTS "Public can view active market variants" ON vehicle_market_variants;
CREATE POLICY "Public can view active market variants" ON vehicle_market_variants FOR SELECT USING (status = true);

-- Admins full modification privileges
DROP POLICY IF EXISTS "Admins manage manufacturers" ON vehicle_manufacturers;
CREATE POLICY "Admins manage manufacturers" ON vehicle_manufacturers FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins manage models" ON vehicle_models;
CREATE POLICY "Admins manage models" ON vehicle_models FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins manage generations" ON vehicle_generations;
CREATE POLICY "Admins manage generations" ON vehicle_generations FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins manage variants" ON vehicle_variants;
CREATE POLICY "Admins manage variants" ON vehicle_variants FOR ALL USING (auth.role() = 'authenticated');
