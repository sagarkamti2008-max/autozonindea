-- CMS, Blog, SEO, FAQs & Dynamic Landing Pages Schema for AutoZoneIndia

-- 1. CMS Pages
CREATE TABLE IF NOT EXISTS cms_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    page_type VARCHAR(50) NOT NULL DEFAULT 'page', -- 'page', 'landing_page', 'faq', 'policy', 'guide'
    content TEXT NOT NULL DEFAULT '',
    excerpt TEXT,
    featured_image_url TEXT,
    alt_text VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'archived'
    meta_title VARCHAR(255),
    meta_description TEXT,
    canonical_url TEXT,
    noindex BOOLEAN DEFAULT false,
    created_by UUID,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CMS Page Versions
CREATE TABLE IF NOT EXISTS cms_page_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES cms_pages(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL DEFAULT 1,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    canonical_url TEXT,
    noindex BOOLEAN DEFAULT false,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Blog Categories
CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'inactive'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL DEFAULT '',
    featured_image_url TEXT,
    alt_text VARCHAR(255),
    author_id UUID,
    category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'archived'
    meta_title VARCHAR(255),
    meta_description TEXT,
    canonical_url TEXT,
    noindex BOOLEAN DEFAULT false,
    product_ids UUID[] DEFAULT '{}',
    vehicle_ids UUID[] DEFAULT '{}',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Post Versions
CREATE TABLE IF NOT EXISTS blog_post_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL DEFAULT 1,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    meta_title VARCHAR(255),
    meta_description TEXT,
    canonical_url TEXT,
    noindex BOOLEAN DEFAULT false,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FAQs System
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category_id UUID,
    product_id UUID,
    vehicle_id UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'published', -- 'draft', 'published', 'archived'
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SEO Redirects
CREATE TABLE IF NOT EXISTS seo_redirects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_path VARCHAR(500) UNIQUE NOT NULL,
    destination_path VARCHAR(500) NOT NULL,
    status_code INTEGER NOT NULL DEFAULT 301, -- 301 or 302
    active BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure SEO and Image Alt fields on core tables if missing
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS noindex BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS alt_text VARCHAR(255);

ALTER TABLE categories ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS noindex BOOLEAN DEFAULT false;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS alt_text VARCHAR(255);

ALTER TABLE brands ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255);
ALTER TABLE brands ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS noindex BOOLEAN DEFAULT false;

ALTER TABLE vehicle_master ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255);
ALTER TABLE vehicle_master ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE vehicle_master ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE vehicle_master ADD COLUMN IF NOT EXISTS noindex BOOLEAN DEFAULT false;

-- Indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX IF NOT EXISTS idx_cms_pages_status ON cms_pages(status);
CREATE INDEX IF NOT EXISTS idx_cms_pages_published_at ON cms_pages(published_at);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);

CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_status ON blog_categories(status);

CREATE INDEX IF NOT EXISTS idx_faqs_product_id ON faqs(product_id);
CREATE INDEX IF NOT EXISTS idx_faqs_category_id ON faqs(category_id);
CREATE INDEX IF NOT EXISTS idx_faqs_vehicle_id ON faqs(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_faqs_status ON faqs(status);

CREATE INDEX IF NOT EXISTS idx_seo_redirects_source_path ON seo_redirects(source_path);
CREATE INDEX IF NOT EXISTS idx_seo_redirects_active ON seo_redirects(active);

-- Enable RLS
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_page_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_redirects ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (Only published content is readable by anon)
CREATE POLICY "Public can view published CMS pages" ON cms_pages
    FOR SELECT USING (status = 'published' AND (published_at IS NULL OR published_at <= NOW()));

CREATE POLICY "Public can view active blog categories" ON blog_categories
    FOR SELECT USING (status = 'active');

CREATE POLICY "Public can view published blog posts" ON blog_posts
    FOR SELECT USING (status = 'published' AND (published_at IS NULL OR published_at <= NOW()));

CREATE POLICY "Public can view published FAQs" ON faqs
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view active redirects" ON seo_redirects
    FOR SELECT USING (active = true);

-- Admin Full Access Policies
CREATE POLICY "Admins have full access to cms_pages" ON cms_pages
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR current_setting('request.jwt.claims', true)::json ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to cms_page_versions" ON cms_page_versions
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR current_setting('request.jwt.claims', true)::json ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to blog_categories" ON blog_categories
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR current_setting('request.jwt.claims', true)::json ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to blog_posts" ON blog_posts
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR current_setting('request.jwt.claims', true)::json ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to blog_post_versions" ON blog_post_versions
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR current_setting('request.jwt.claims', true)::json ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to faqs" ON faqs
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR current_setting('request.jwt.claims', true)::json ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to seo_redirects" ON seo_redirects
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR current_setting('request.jwt.claims', true)::json ->> 'role' = 'admin');
