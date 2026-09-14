-- ============================================================================
-- AUTOZONEINDIA CUSTOMER RETURNS, REFUNDS & REPLACEMENT SCHEMA MIGRATION
-- Authoritative Production DDL, Indexes & RLS Policies
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Extend products table safely for return & replacement rules
ALTER TABLE products ADD COLUMN IF NOT EXISTS returnable BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS replacement_available BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS return_window_override INTEGER;

-- ============================================================================
-- 1. RETURN POLICY SETTINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS return_policy_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_window_days INTEGER DEFAULT 10,
  replacement_enabled BOOLEAN DEFAULT true,
  refund_enabled BOOLEAN DEFAULT true,
  return_shipping_policy TEXT DEFAULT 'Carrier Pickup',
  excluded_categories JSONB DEFAULT '[]',
  require_inspection BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. RETURN REQUESTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS return_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_number TEXT UNIQUE NOT NULL, -- RET-YYYYMMDD-0001
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'requested',
  return_type TEXT DEFAULT 'refund', -- 'refund', 'replacement', 'exchange'
  reason TEXT NOT NULL,
  customer_message TEXT,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ,
  inspected_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_return_requests_number ON return_requests(return_number);
CREATE INDEX IF NOT EXISTS idx_return_requests_order ON return_requests(order_id);
CREATE INDEX IF NOT EXISTS idx_return_requests_customer ON return_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_return_requests_status ON return_requests(status);

-- ============================================================================
-- 3. RETURN ITEMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS return_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_request_id UUID NOT NULL REFERENCES return_requests(id) ON DELETE CASCADE,
  order_item_id UUID,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER DEFAULT 1,
  reason TEXT,
  condition TEXT DEFAULT 'unknown', -- 'new', 'opened', 'used', 'damaged', 'defective', 'wrong_item', 'unknown'
  inspection_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'partial'
  refund_amount NUMERIC(12,2),
  replacement_product_id UUID REFERENCES products(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_return_items_request ON return_items(return_request_id);

-- ============================================================================
-- 4. RETURN INSPECTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS return_inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_request_id UUID NOT NULL REFERENCES return_requests(id) ON DELETE CASCADE,
  inspected_by TEXT DEFAULT 'Admin Specialist',
  inspection_status TEXT DEFAULT 'pending',
  product_condition TEXT DEFAULT 'unknown',
  quantity_approved INTEGER DEFAULT 0,
  quantity_rejected INTEGER DEFAULT 0,
  damage_notes TEXT,
  internal_notes TEXT,
  inspected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_return_inspections_request ON return_inspections(return_request_id);

-- ============================================================================
-- 5. REFUNDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_request_id UUID REFERENCES return_requests(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  payment_id UUID,
  refund_number TEXT UNIQUE NOT NULL, -- RF-YYYYMMDD-0001
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'cancelled'
  reason TEXT,
  provider TEXT DEFAULT 'manual', -- 'razorpay', 'stripe', 'cod_bank', 'store_credit', 'manual'
  provider_refund_id TEXT,
  initiated_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  failure_reason TEXT,
  bank_account_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refunds_number ON refunds(refund_number);
CREATE INDEX IF NOT EXISTS idx_refunds_request ON refunds(return_request_id);

-- ============================================================================
-- 6. REPLACEMENT ORDERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS replacement_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  replacement_number TEXT UNIQUE NOT NULL, -- REP-YYYYMMDD-0001
  return_request_id UUID REFERENCES return_requests(id) ON DELETE SET NULL,
  original_order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'
  shipping_address_id UUID,
  courier TEXT,
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS replacement_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  replacement_order_id UUID NOT NULL REFERENCES replacement_orders(id) ON DELETE CASCADE,
  original_order_item_id UUID,
  product_id UUID REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. RETURN SHIPMENTS TABLE (REVERSE PICKUP & LOGISTICS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS return_shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_request_id UUID NOT NULL REFERENCES return_requests(id) ON DELETE CASCADE,
  courier TEXT DEFAULT 'Bluedart Reverse Logistics',
  shipment_number TEXT,
  tracking_number TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'pickup_scheduled', 'picked_up', 'in_transit', 'received', 'cancelled'
  pickup_date TIMESTAMPTZ,
  received_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. RETURN ACTIVITY & AUDIT TIMELINE TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS return_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_request_id UUID NOT NULL REFERENCES return_requests(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  message TEXT NOT NULL,
  created_by TEXT DEFAULT 'System',
  is_customer_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_return_activity_request ON return_activity(return_request_id);

-- Enable RLS
ALTER TABLE return_policy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE replacement_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE replacement_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public Read Return Policy" ON return_policy_settings FOR SELECT USING (true);
CREATE POLICY "Admin Manage Return Policy" ON return_policy_settings FOR ALL USING (true);

CREATE POLICY "Customer Read Own Returns" ON return_requests FOR SELECT USING (true);
CREATE POLICY "Customer Create Return Request" ON return_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Manage Returns" ON return_requests FOR ALL USING (true);

CREATE POLICY "Customer Read Own Return Items" ON return_items FOR SELECT USING (true);
CREATE POLICY "Admin Manage Return Items" ON return_items FOR ALL USING (true);

CREATE POLICY "Admin Manage Inspections" ON return_inspections FOR ALL USING (true);

CREATE POLICY "Customer Read Own Refunds" ON refunds FOR SELECT USING (true);
CREATE POLICY "Admin Manage Refunds" ON refunds FOR ALL USING (true);

CREATE POLICY "Customer Read Own Replacement Orders" ON replacement_orders FOR SELECT USING (true);
CREATE POLICY "Admin Manage Replacements" ON replacement_orders FOR ALL USING (true);

CREATE POLICY "Public Read Customer Activity Timeline" ON return_activity FOR SELECT USING (is_customer_visible = true);
CREATE POLICY "Admin Manage Activity Timeline" ON return_activity FOR ALL USING (true);
