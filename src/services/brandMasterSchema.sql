-- ============================================================================
-- AUTOZONEINDIA MASTER BRAND MANAGEMENT SYSTEM
-- PostgreSQL / Supabase DDL, Indexes, Storage Bucket & Row Level Security Policies
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. BRANDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  description TEXT,
  country TEXT,
  website_url TEXT,
  status BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure products.brand_id index
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);

-- ============================================================================
-- 2. PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_status ON brands(status);
CREATE INDEX IF NOT EXISTS idx_brands_featured ON brands(featured);

-- ============================================================================
-- 3. SUPABASE ROW LEVEL SECURITY (RLS) POLICIES FOR BRANDS
-- ============================================================================
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Customers can view active brands
DROP POLICY IF EXISTS "Public can view active brands" ON brands;
CREATE POLICY "Public can view active brands" ON brands 
  FOR SELECT USING (status = true);

-- Admins full management privileges
DROP POLICY IF EXISTS "Admins manage brands" ON brands;
CREATE POLICY "Admins manage brands" ON brands 
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- 4. SUPABASE STORAGE BUCKET: brand-logos
-- ============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('brand-logos', 'brand-logos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policy: Public Read Access
DROP POLICY IF EXISTS "Public Read Brand Logos" ON storage.objects;
CREATE POLICY "Public Read Brand Logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'brand-logos');

-- Storage Policy: Admin Upload / Update / Delete
DROP POLICY IF EXISTS "Admin Upload Brand Logos" ON storage.objects;
CREATE POLICY "Admin Upload Brand Logos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'brand-logos' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin Manage Brand Logos" ON storage.objects;
CREATE POLICY "Admin Manage Brand Logos" ON storage.objects
  FOR DELETE USING (bucket_id = 'brand-logos' AND auth.role() = 'authenticated');
