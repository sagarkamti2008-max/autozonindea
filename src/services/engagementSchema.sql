-- ============================================================================
-- AUTOZONEINDIA CUSTOMER ENGAGEMENT SYSTEM SCHEMA
-- Wishlist + Product Reviews + Review Reports + Product Q&A + Product Answers + Customer Feedback DDL
-- ============================================================================

-- 1. WISHLIST TABLE & INDEXES
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_customer ON wishlist(customer_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product ON wishlist(product_id);

-- 2. PRODUCT REVIEWS TABLE & INDEXES
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  order_item_id UUID REFERENCES order_items(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  review_text TEXT NOT NULL,
  comment TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  verified_purchase BOOLEAN DEFAULT false,
  admin_note TEXT,
  rejection_reason TEXT,
  is_flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  customer_name TEXT,
  customer_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure existing reviews table has required columns if already created
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='order_id') THEN
    ALTER TABLE reviews ADD COLUMN order_id UUID REFERENCES orders(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='order_item_id') THEN
    ALTER TABLE reviews ADD COLUMN order_item_id UUID REFERENCES order_items(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='review_text') THEN
    ALTER TABLE reviews ADD COLUMN review_text TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='verified_purchase') THEN
    ALTER TABLE reviews ADD COLUMN verified_purchase BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='admin_note') THEN
    ALTER TABLE reviews ADD COLUMN admin_note TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='rejection_reason') THEN
    ALTER TABLE reviews ADD COLUMN rejection_reason TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='is_flagged') THEN
    ALTER TABLE reviews ADD COLUMN is_flagged BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='flag_reason') THEN
    ALTER TABLE reviews ADD COLUMN flag_reason TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='images') THEN
    ALTER TABLE reviews ADD COLUMN images JSONB DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='updated_at') THEN
    ALTER TABLE reviews ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Create product_reviews view/alias if needed
CREATE OR REPLACE VIEW product_reviews AS SELECT * FROM reviews;

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_order ON reviews(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at);

-- 3. REVIEW REPORTS TABLE & INDEXES
CREATE TABLE IF NOT EXISTS review_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  reporter_customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  reason TEXT NOT NULL CHECK (reason IN ('Spam', 'Offensive', 'Irrelevant', 'Incorrect information', 'Other')),
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed', 'actioned')),
  reviewed_by UUID REFERENCES customers(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_review_reports_review ON review_reports(review_id);
CREATE INDEX IF NOT EXISTS idx_review_reports_status ON review_reports(status);

-- 4. PRODUCT QUESTIONS TABLE & INDEXES
CREATE TABLE IF NOT EXISTS product_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  answer TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'hidden', 'new', 'answered', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  answered_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_questions_product ON product_questions(product_id);
CREATE INDEX IF NOT EXISTS idx_questions_customer ON product_questions(customer_id);
CREATE INDEX IF NOT EXISTS idx_questions_status ON product_questions(status);

-- 5. PRODUCT ANSWERS TABLE & INDEXES
CREATE TABLE IF NOT EXISTS product_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES product_questions(id) ON DELETE CASCADE,
  answered_by UUID REFERENCES customers(id) ON DELETE SET NULL,
  answered_by_name TEXT,
  answer TEXT NOT NULL,
  is_official BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'hidden')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_answers_question ON product_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_status ON product_answers(status);

-- 6. CUSTOMER FEEDBACK TABLE & INDEXES
CREATE TABLE IF NOT EXISTS customer_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT,
  customer_email TEXT,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('Product', 'Website', 'Delivery', 'Support', 'Payment', 'Other')),
  message TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'resolved', 'closed')),
  internal_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_feedback_category ON customer_feedback(category);
CREATE INDEX IF NOT EXISTS idx_customer_feedback_status ON customer_feedback(status);
CREATE INDEX IF NOT EXISTS idx_customer_feedback_customer ON customer_feedback(customer_id);

-- 7. STOCK NOTIFICATIONS & PRICE ALERTS
CREATE TABLE IF NOT EXISTS stock_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'notified', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  notified_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  email TEXT,
  observed_price NUMERIC(12,2) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'notified', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ROW LEVEL SECURITY POLICIES
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

-- Wishlist RLS
DROP POLICY IF EXISTS "Customers view own wishlist" ON wishlist;
CREATE POLICY "Customers view own wishlist" ON wishlist FOR SELECT USING (true);
DROP POLICY IF EXISTS "Customers insert own wishlist" ON wishlist;
CREATE POLICY "Customers insert own wishlist" ON wishlist FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Customers delete own wishlist" ON wishlist;
CREATE POLICY "Customers delete own wishlist" ON wishlist FOR DELETE USING (true);

-- Reviews RLS
DROP POLICY IF EXISTS "Public view approved reviews" ON reviews;
CREATE POLICY "Public view approved reviews" ON reviews FOR SELECT USING (status = 'approved' OR status = 'Published');
DROP POLICY IF EXISTS "Customers insert reviews" ON reviews;
CREATE POLICY "Customers insert reviews" ON reviews FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Customers update own review" ON reviews;
CREATE POLICY "Customers update own review" ON reviews FOR UPDATE USING (auth.uid() = customer_id);

-- Product Questions RLS
DROP POLICY IF EXISTS "Public view approved questions" ON product_questions;
CREATE POLICY "Public view approved questions" ON product_questions FOR SELECT USING (status IN ('approved', 'answered'));
DROP POLICY IF EXISTS "Anyone insert product question" ON product_questions;
CREATE POLICY "Anyone insert product question" ON product_questions FOR INSERT WITH CHECK (true);

-- Product Answers RLS
DROP POLICY IF EXISTS "Public view approved answers" ON product_answers;
CREATE POLICY "Public view approved answers" ON product_answers FOR SELECT USING (status = 'approved');

-- Customer Feedback RLS
DROP POLICY IF EXISTS "Customers insert feedback" ON customer_feedback;
CREATE POLICY "Customers insert feedback" ON customer_feedback FOR INSERT WITH CHECK (true);

-- 9. SUPABASE STORAGE BUCKET FOR REVIEW IMAGES
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-images', 'review-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read review images" ON storage.objects;
CREATE POLICY "Public read review images" ON storage.objects
FOR SELECT USING (bucket_id = 'review-images');

DROP POLICY IF EXISTS "Authenticated users upload review images" ON storage.objects;
CREATE POLICY "Authenticated users upload review images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'review-images');

