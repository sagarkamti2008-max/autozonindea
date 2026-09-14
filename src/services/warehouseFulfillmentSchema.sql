-- Warehouse, Multi-Location Inventory, Barcode/QR, Stock Transfers & Pick/Pack/Dispatch Schema for AutoZoneIndia

-- 1. Warehouses Master Table
CREATE TABLE IF NOT EXISTS warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. WH-BLR-01
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    contact_name VARCHAR(150),
    contact_phone VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'inactive'
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Warehouse Locations (Zone, Rack, Shelf, Bin)
CREATE TABLE IF NOT EXISTS warehouse_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    location_code VARCHAR(100) NOT NULL, -- e.g. WH1-A-R01-S02-B03
    zone VARCHAR(50) NOT NULL DEFAULT 'A',
    rack VARCHAR(50) NOT NULL DEFAULT 'R01',
    shelf VARCHAR(50) NOT NULL DEFAULT 'S01',
    bin VARCHAR(50) NOT NULL DEFAULT 'B01',
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'maintenance'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_warehouse_location_code UNIQUE (warehouse_id, location_code)
);

-- 3. Multi-Warehouse Inventory Stock Table
CREATE TABLE IF NOT EXISTS warehouse_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    location_id UUID REFERENCES warehouse_locations(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    reserved_quantity INTEGER NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    damaged_quantity INTEGER NOT NULL DEFAULT 0 CHECK (damaged_quantity >= 0),
    reorder_level INTEGER NOT NULL DEFAULT 10,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_warehouse_product_location UNIQUE (warehouse_id, product_id, location_id),
    CONSTRAINT valid_available_stock CHECK (quantity >= (reserved_quantity + damaged_quantity))
);

-- 4. Stock Transfers Header & Line Items
CREATE TABLE IF NOT EXISTS stock_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transfer_number VARCHAR(100) UNIQUE NOT NULL, -- e.g. TR-2026-0001
    source_warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    destination_warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- 'draft', 'requested', 'approved', 'in_transit', 'partially_received', 'received', 'cancelled'
    requested_by UUID,
    approved_by UUID,
    shipped_at TIMESTAMPTZ,
    received_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT different_transfer_warehouses CHECK (source_warehouse_id <> destination_warehouse_id)
);

CREATE TABLE IF NOT EXISTS stock_transfer_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transfer_id UUID NOT NULL REFERENCES stock_transfers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    quantity_requested INTEGER NOT NULL CHECK (quantity_requested > 0),
    quantity_sent INTEGER DEFAULT 0 CHECK (quantity_sent >= 0),
    quantity_received INTEGER DEFAULT 0 CHECK (quantity_received >= 0)
);

-- 5. Order Picking Lists & Items
CREATE TABLE IF NOT EXISTS pick_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pick_number VARCHAR(100) UNIQUE NOT NULL, -- e.g. PICK-2026-8801
    order_id UUID NOT NULL,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    assigned_to UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'picking', 'partially_picked', 'picked', 'short_stock', 'cancelled'
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pick_list_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pick_list_id UUID NOT NULL REFERENCES pick_lists(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    location_id UUID REFERENCES warehouse_locations(id),
    quantity_required INTEGER NOT NULL CHECK (quantity_required > 0),
    quantity_picked INTEGER DEFAULT 0 CHECK (quantity_picked >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' -- 'pending', 'picked', 'short_stock'
);

-- 6. Packing Orders & Packing Items
CREATE TABLE IF NOT EXISTS packing_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    packed_by UUID,
    package_count INTEGER DEFAULT 1 CHECK (package_count > 0),
    package_weight DECIMAL(10,2) DEFAULT 0.00, -- Weight in kg
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'packing', 'packed', 'quality_check', 'failed', 'cancelled'
    packed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS packing_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    packing_order_id UUID NOT NULL REFERENCES packing_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    verified BOOLEAN DEFAULT false,
    barcode_verified BOOLEAN DEFAULT false
);

-- 7. Fulfillment Quality Check
CREATE TABLE IF NOT EXISTS fulfillment_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    checked_by UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'passed', -- 'passed', 'failed', 'needs_review'
    checklist_json JSONB DEFAULT '{}'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Dispatch Records
CREATE TABLE IF NOT EXISTS dispatch_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    package_count INTEGER DEFAULT 1,
    weight DECIMAL(10,2) DEFAULT 0.00,
    courier_provider VARCHAR(150) NOT NULL,
    tracking_number VARCHAR(150) NOT NULL,
    dispatched_by UUID,
    dispatched_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(50) NOT NULL DEFAULT 'dispatched', -- 'ready', 'dispatched', 'handover_confirmed', 'cancelled'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Comprehensive Inventory Transactions Log
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    warehouse_id UUID REFERENCES warehouses(id) ON DELETE SET NULL,
    location_id UUID REFERENCES warehouse_locations(id) ON DELETE SET NULL,
    quantity_before INTEGER NOT NULL,
    quantity_change INTEGER NOT NULL,
    quantity_after INTEGER NOT NULL,
    reference_type VARCHAR(100) NOT NULL, -- 'purchase_received', 'sale_reserved', 'sale_dispatched', 'return_received', 'replacement_sent', 'stock_adjustment', 'warehouse_transfer_out', 'warehouse_transfer_in', 'damaged', 'lost', 'found', 'manual_correction'
    reference_id VARCHAR(100),
    performed_by UUID,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure barcode fields on products table if missing
ALTER TABLE products ADD COLUMN IF NOT EXISTS barcode VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS internal_product_code VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS barcode_type VARCHAR(50) DEFAULT 'CODE128';

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_warehouses_code ON warehouses(code);
CREATE INDEX IF NOT EXISTS idx_warehouses_status ON warehouses(status);

CREATE INDEX IF NOT EXISTS idx_wh_locations_wh_id ON warehouse_locations(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_wh_locations_code ON warehouse_locations(location_code);

CREATE INDEX IF NOT EXISTS idx_wh_inv_wh_prod ON warehouse_inventory(warehouse_id, product_id);
CREATE INDEX IF NOT EXISTS idx_wh_inv_location ON warehouse_inventory(location_id);

CREATE INDEX IF NOT EXISTS idx_stock_transfers_number ON stock_transfers(transfer_number);
CREATE INDEX IF NOT EXISTS idx_stock_transfers_status ON stock_transfers(status);

CREATE INDEX IF NOT EXISTS idx_pick_lists_order ON pick_lists(order_id);
CREATE INDEX IF NOT EXISTS idx_pick_lists_status ON pick_lists(status);

CREATE INDEX IF NOT EXISTS idx_packing_orders_order ON packing_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_dispatch_records_order ON dispatch_records(order_id);

CREATE INDEX IF NOT EXISTS idx_inv_tx_prod_wh ON inventory_transactions(product_id, warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inv_tx_created ON inventory_transactions(created_at);

-- Enable RLS
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_transfer_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pick_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE pick_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE packing_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE packing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE fulfillment_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatch_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Admin Full Access
CREATE POLICY "Admins have full access to warehouses" ON warehouses
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR current_setting('request.jwt.claims', true)::json ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to warehouse_locations" ON warehouse_locations
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR current_setting('request.jwt.claims', true)::json ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to warehouse_inventory" ON warehouse_inventory
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR current_setting('request.jwt.claims', true)::json ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to stock_transfers" ON stock_transfers
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR current_setting('request.jwt.claims', true)::json ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to stock_transfer_items" ON stock_transfer_items
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR current_setting('request.jwt.claims', true)::json ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to pick_lists" ON pick_lists
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR current_setting('request.jwt.claims', true)::json ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to pick_list_items" ON pick_list_items
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR current_setting('request.jwt.claims', true)::json ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to packing_orders" ON packing_orders
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR current_setting('request.jwt.claims', true)::json ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to packing_items" ON packing_items
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR current_setting('request.jwt.claims', true)::json ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to fulfillment_checks" ON fulfillment_checks
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR current_setting('request.jwt.claims', true)::json ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to dispatch_records" ON dispatch_records
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR current_setting('request.jwt.claims', true)::json ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to inventory_transactions" ON inventory_transactions
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR current_setting('request.jwt.claims', true)::json ->> 'role' = 'admin');
