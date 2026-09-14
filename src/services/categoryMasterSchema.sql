-- ============================================================================
-- AUTOZONEINDIA MASTER CATEGORY & SUBCATEGORY DATA SYSTEM
-- PostgreSQL / Supabase DDL, Indexes, & Row Level Security Policies
-- Supports Unlimited Hierarchical Subcategory Nesting via parent_id
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  status BOOLEAN DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_status ON categories(status);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON categories(sort_order);

-- ============================================================================
-- 3. SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Customers & Public can read active categories
DROP POLICY IF EXISTS "Public can view active categories" ON categories;
CREATE POLICY "Public can view active categories" ON categories 
  FOR SELECT USING (status = true);

-- Admins full management privileges
DROP POLICY IF EXISTS "Admins manage categories" ON categories;
CREATE POLICY "Admins manage categories" ON categories 
  FOR ALL USING (auth.role() = 'authenticated');
