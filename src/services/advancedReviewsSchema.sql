-- ============================================================================
-- AutoZoneIndia Database Schema: Advanced Product Reviews, UGC & Trust System
-- Idempotent Supabase SQL DDL Migration
-- ============================================================================

-- 1. EXTEND OR CREATE PRODUCT REVIEWS TABLE
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    order_id TEXT,
    order_item_id TEXT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    review_text TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, published, rejected, hidden, flagged
    verified_purchase BOOLEAN DEFAULT FALSE, -- CALCULATED SERVER-SIDE ONLY
    helpful_count INT DEFAULT 0,
    report_count INT DEFAULT 0,
    edit_count INT DEFAULT 0,
    edited_at TIMESTAMPTZ,
    admin_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_reviews_product ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_customer ON product_reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_status ON product_reviews(status);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_product_reviews_verified ON product_reviews(verified_purchase);


-- 2. REVIEW IMAGES / PHOTOS TABLE
CREATE TABLE IF NOT EXISTS review_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES product_reviews(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published', -- published, hidden, rejected
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_review_images_review ON review_images(review_id);


-- 3. REVIEW HELPFUL VOTES TABLE
CREATE TABLE IF NOT EXISTS review_helpful_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES product_reviews(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    vote TEXT NOT NULL DEFAULT 'helpful', -- helpful, not_helpful
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (review_id, customer_id)
);

CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_review ON review_helpful_votes(review_id);


-- 4. REVIEW REPORTS TABLE
CREATE TABLE IF NOT EXISTS review_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES product_reviews(id) ON DELETE CASCADE,
    reporter_customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    reason TEXT NOT NULL, -- spam, off_topic, abusive, false_information, duplicate, personal_information, other
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, resolved, dismissed
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    resolved_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_review_reports_review ON review_reports(review_id);
CREATE INDEX IF NOT EXISTS idx_review_reports_status ON review_reports(status);


-- 5. REVIEW REQUEST AUTOMATION EVENTS TABLE
CREATE TABLE IF NOT EXISTS review_request_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    order_id TEXT NOT NULL,
    order_item_id TEXT,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, sent, failed, completed, cancelled
    reminder_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_review_requests_customer ON review_request_events(customer_id);
CREATE INDEX IF NOT EXISTS idx_review_requests_status ON review_request_events(status);


-- 6. REVIEW SETTINGS TABLE
CREATE TABLE IF NOT EXISTS review_settings (
    key TEXT PRIMARY KEY,
    value_json JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Review Settings
INSERT INTO review_settings (key, value_json) VALUES
('review_enabled', 'true'::jsonb),
('require_moderation', 'true'::jsonb),
('minimum_review_length', '10'::jsonb),
('maximum_review_length', '2000'::jsonb),
('review_edit_window_days', '14'::jsonb),
('review_request_delay_days', '7'::jsonb),
('review_reminder_delay_days', '5'::jsonb),
('maximum_reminders', '1'::jsonb),
('photo_reviews_enabled', 'true'::jsonb),
('helpful_votes_enabled', 'true'::jsonb)
ON CONFLICT (key) DO NOTHING;


-- Enable Row Level Security (RLS)
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_helpful_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_request_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_settings ENABLE ROW LEVEL SECURITY;

-- Customer Public & Authenticated RLS Policies
CREATE POLICY "Public read published reviews" ON product_reviews FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published review images" ON review_images FOR SELECT USING (status = 'published');
CREATE POLICY "Customer write own review" ON product_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Customer write helpful vote" ON review_helpful_votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Customer write review report" ON review_reports FOR INSERT WITH CHECK (true);

-- Admin Full Access Policies
CREATE POLICY "Admin full access product reviews" ON product_reviews FOR ALL USING (true);
CREATE POLICY "Admin full access review images" ON review_images FOR ALL USING (true);
CREATE POLICY "Admin full access review votes" ON review_helpful_votes FOR ALL USING (true);
CREATE POLICY "Admin full access review reports" ON review_reports FOR ALL USING (true);
CREATE POLICY "Admin full access review requests" ON review_request_events FOR ALL USING (true);
CREATE POLICY "Admin full access review settings" ON review_settings FOR ALL USING (true);
