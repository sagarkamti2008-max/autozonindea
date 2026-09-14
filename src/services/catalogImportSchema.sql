-- ============================================================================
-- AUTOZONEINDIA BULK IMPORT & CATALOG MANAGEMENT SCHEMA MIGRATION
-- Authoritative Safe DDL, Indexes & RLS Policies
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Extend products table safely with additional catalog metadata fields
ALTER TABLE products ADD COLUMN IF NOT EXISTS mrp NUMERIC(12,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS reorder_level INTEGER DEFAULT 5;
ALTER TABLE products ADD COLUMN IF NOT EXISTS supplier_sku TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS purchase_price NUMERIC(12,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_keywords TEXT;

-- Create indexes on products table for fast bulk import matching
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);

-- ============================================================================
-- 1. PRODUCT IMPORT JOBS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_import_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  import_mode TEXT NOT NULL DEFAULT 'create_update', -- 'create_only', 'update_only', 'create_update'
  total_rows INTEGER DEFAULT 0,
  valid_rows INTEGER DEFAULT 0,
  created_rows INTEGER DEFAULT 0,
  updated_rows INTEGER DEFAULT 0,
  skipped_rows INTEGER DEFAULT 0,
  failed_rows INTEGER DEFAULT 0,
  status TEXT DEFAULT 'uploaded', -- 'uploaded', 'validating', 'ready', 'processing', 'completed', 'completed_with_errors', 'failed', 'cancelled'
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by TEXT DEFAULT 'Admin',
  error_file_path TEXT,
  summary_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on import jobs created_at and status
CREATE INDEX IF NOT EXISTS idx_product_import_jobs_status ON product_import_jobs(status);
CREATE INDEX IF NOT EXISTS idx_product_import_jobs_created ON product_import_jobs(created_at DESC);

-- ============================================================================
-- 2. PRODUCT IMPORT JOB ROWS TABLE (Row-level details & Error Logging)
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_import_job_rows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES product_import_jobs(id) ON DELETE CASCADE,
  row_number INTEGER NOT NULL,
  sku TEXT,
  product_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'valid', 'created', 'updated', 'skipped', 'failed', 'warning'
  action_type TEXT DEFAULT 'skip', -- 'create', 'update', 'skip', 'error'
  error_messages TEXT[],
  warning_messages TEXT[],
  row_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on job_id and row_number
CREATE INDEX IF NOT EXISTS idx_import_job_rows_job ON product_import_job_rows(job_id);
CREATE INDEX IF NOT EXISTS idx_import_job_rows_status ON product_import_job_rows(job_id, status);

-- ============================================================================
-- 3. PRODUCT PRICE CHANGE AUDIT LOG TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT,
  old_mrp NUMERIC(12,2),
  new_mrp NUMERIC(12,2),
  old_price NUMERIC(12,2),
  new_price NUMERIC(12,2),
  old_sale_price NUMERIC(12,2),
  new_sale_price NUMERIC(12,2),
  changed_by TEXT DEFAULT 'Admin',
  change_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_price_history_sku ON product_price_history(sku);

-- Enable RLS
ALTER TABLE product_import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_import_job_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_price_history ENABLE ROW LEVEL SECURITY;

-- Allow public / admin full access policy (for dev/admin console)
CREATE POLICY "Public Read Import Jobs" ON product_import_jobs FOR SELECT USING (true);
CREATE POLICY "Public Manage Import Jobs" ON product_import_jobs FOR ALL USING (true);

CREATE POLICY "Public Read Import Job Rows" ON product_import_job_rows FOR SELECT USING (true);
CREATE POLICY "Public Manage Import Job Rows" ON product_import_job_rows FOR ALL USING (true);

CREATE POLICY "Public Read Price History" ON product_price_history FOR SELECT USING (true);
CREATE POLICY "Public Manage Price History" ON product_price_history FOR ALL USING (true);
