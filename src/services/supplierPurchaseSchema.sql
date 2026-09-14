-- AUTOZONEINDIA SUPPLIER MANAGEMENT, PURCHASE ORDERS & ADVANCED INVENTORY SCHEMA

-- 1. SUPPLIERS TABLE
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supplier_code TEXT NOT NULL UNIQUE, -- e.g., 'SUP-1001'
    company_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    phone TEXT NOT NULL,
    alternate_phone TEXT,
    email TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    country TEXT DEFAULT 'India',
    gst_number TEXT,
    pan_number TEXT,
    website_url TEXT,
    payment_terms TEXT, -- e.g., 'Net 30', 'COD', 'Advance'
    notes TEXT,
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SUPPLIER-PRODUCT RELATIONSHIP TABLE (Many-to-Many with Pricing & Lead Times)
CREATE TABLE IF NOT EXISTS public.supplier_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE RESTRICT NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    supplier_sku TEXT,
    purchase_price NUMERIC(12, 2) NOT NULL CHECK (purchase_price >= 0),
    minimum_order_quantity INT DEFAULT 1 CHECK (minimum_order_quantity >= 1),
    lead_time_days INT DEFAULT 3 CHECK (lead_time_days >= 0),
    preferred_supplier BOOLEAN DEFAULT FALSE,
    last_purchase_price NUMERIC(12, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_supplier_product UNIQUE (supplier_id, product_id)
);

-- 3. PURCHASE ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.purchase_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    purchase_order_number TEXT NOT NULL UNIQUE, -- e.g., 'PO-20260911-0001'
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE RESTRICT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'partially_received', 'received', 'cancelled')) DEFAULT 'draft',
    order_date TIMESTAMPTZ DEFAULT NOW(),
    expected_date TIMESTAMPTZ,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    shipping_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PURCHASE ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.purchase_order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    purchase_order_id UUID REFERENCES public.purchase_orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
    supplier_product_id UUID REFERENCES public.supplier_products(id) ON DELETE SET NULL,
    quantity_ordered INT NOT NULL CHECK (quantity_ordered > 0),
    quantity_received INT NOT NULL DEFAULT 0 CHECK (quantity_received >= 0),
    unit_purchase_price NUMERIC(12, 2) NOT NULL CHECK (unit_purchase_price >= 0),
    tax_rate NUMERIC(5, 2) DEFAULT 18.00,
    discount_amount NUMERIC(12, 2) DEFAULT 0,
    line_total NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_quantity_received_lte_ordered CHECK (quantity_received <= quantity_ordered)
);

-- 5. INVENTORY TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.inventory_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'sale', 'return', 'adjustment', 'damaged', 'cancelled_order', 'manual_in', 'manual_out')),
    quantity INT NOT NULL, -- positive for additions, negative for deductions
    quantity_before INT NOT NULL,
    quantity_after INT NOT NULL,
    reference_type TEXT, -- e.g., 'purchase_order', 'customer_order', 'manual_adjustment'
    reference_id TEXT,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PRODUCT PURCHASE PRICE HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.product_purchase_prices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE RESTRICT NOT NULL,
    purchase_order_id UUID REFERENCES public.purchase_orders(id) ON DELETE SET NULL,
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    purchase_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_suppliers_company_name ON public.suppliers(company_name);
CREATE INDEX IF NOT EXISTS idx_suppliers_phone ON public.suppliers(phone);
CREATE INDEX IF NOT EXISTS idx_suppliers_email ON public.suppliers(email);
CREATE INDEX IF NOT EXISTS idx_suppliers_code ON public.suppliers(supplier_code);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON public.suppliers(status);

CREATE INDEX IF NOT EXISTS idx_supplier_products_supplier_id ON public.supplier_products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_products_product_id ON public.supplier_products(product_id);

CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier_id ON public.purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON public.purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_number ON public.purchase_orders(purchase_order_number);

CREATE INDEX IF NOT EXISTS idx_po_items_po_id ON public.purchase_order_items(purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_po_items_product_id ON public.purchase_order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_inventory_tx_product_id ON public.inventory_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_tx_type ON public.inventory_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_inventory_tx_created_at ON public.inventory_transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_purchase_prices_product_id ON public.product_purchase_prices(product_id);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_purchase_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY suppliers_admin_select ON public.suppliers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.customers c
            WHERE c.id = auth.uid() AND c.role IN ('admin', 'super_admin', 'manager', 'support')
        )
    );

CREATE POLICY purchase_orders_admin_select ON public.purchase_orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.customers c
            WHERE c.id = auth.uid() AND c.role IN ('admin', 'super_admin', 'manager', 'support')
        )
    );

CREATE POLICY inventory_tx_admin_select ON public.inventory_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.customers c
            WHERE c.id = auth.uid() AND c.role IN ('admin', 'super_admin', 'manager', 'support')
        )
    );
