-- ============================================================================
-- AUTOZONEINDIA MASTER ORDER MANAGEMENT SYSTEM
-- PostgreSQL / Supabase DDL, Indexes, & Row Level Security Policies
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ORDERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL, -- e.g., AZI-20260911-0001
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax NUMERIC(12,2) NOT NULL DEFAULT 0,
  shipping_charge NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, processing, packed, shipped, delivered, cancelled
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed, refunded
  shipping_status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, shipped, out_for_delivery, delivered, returned
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. ORDER ITEMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL,
  total_price NUMERIC(12,2) NOT NULL
);

-- ============================================================================
-- 3. PAYMENTS TABLE (Zero card/UPI credentials stored)
-- ============================================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payment_method TEXT NOT NULL, -- cod, upi, card, netbanking
  transaction_id TEXT,
  amount NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed, refunded
  paid_at TIMESTAMPTZ
);

-- ============================================================================
-- 4. SHIPPING TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS shipping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  courier TEXT,
  tracking_number TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, shipped, out_for_delivery, delivered, returned
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- ============================================================================
-- 5. PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipping_order_id ON shipping(order_id);

-- ============================================================================
-- 6. SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping ENABLE ROW LEVEL SECURITY;

-- Customers can view their own orders & order items
DROP POLICY IF EXISTS "Customers view own orders" ON orders;
CREATE POLICY "Customers view own orders" ON orders 
  FOR SELECT USING (auth.uid() = customer_id OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Customers view own order items" ON order_items;
CREATE POLICY "Customers view own order items" ON order_items 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.customer_id = auth.uid() OR auth.role() = 'authenticated')
    )
  );

-- Admins full management privileges
DROP POLICY IF EXISTS "Admins manage orders" ON orders;
CREATE POLICY "Admins manage orders" ON orders FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins manage order items" ON order_items;
CREATE POLICY "Admins manage order items" ON order_items FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins manage payments" ON payments;
CREATE POLICY "Admins manage payments" ON payments FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins manage shipping" ON shipping;
CREATE POLICY "Admins manage shipping" ON shipping FOR ALL USING (auth.role() = 'authenticated');
