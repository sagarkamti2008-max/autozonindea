-- ====================================================================
-- AUTOZONEINDIA - ADVANCED SEARCH & MY GARAGE SCHEMA MIGRATION
-- ====================================================================

-- 1. SEARCH LOGS TABLE FOR ANALYTICS
CREATE TABLE IF NOT EXISTS public.search_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    query TEXT NOT NULL,
    result_count INTEGER NOT NULL DEFAULT 0,
    selected_vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CUSTOMER SAVED VEHICLES (MY GARAGE)
CREATE TABLE IF NOT EXISTS public.customer_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    generation VARCHAR(100),
    variant VARCHAR(100),
    year INTEGER,
    fuel_type VARCHAR(50),
    transmission VARCHAR(50),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. INDEXES FOR PERFORMANCE & FULL-TEXT SEARCH
CREATE INDEX IF NOT EXISTS idx_search_logs_query ON public.search_logs(query);
CREATE INDEX IF NOT EXISTS idx_search_logs_count ON public.search_logs(result_count);
CREATE INDEX IF NOT EXISTS idx_search_logs_created ON public.search_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_customer_vehicles_cust ON public.customer_vehicles(customer_id);

CREATE INDEX IF NOT EXISTS idx_products_search_name ON public.products(name);
CREATE INDEX IF NOT EXISTS idx_products_search_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);

CREATE INDEX IF NOT EXISTS idx_compatibility_prod ON public.product_compatibility(product_id);
CREATE INDEX IF NOT EXISTS idx_compatibility_veh ON public.product_compatibility(vehicle_id);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_vehicles ENABLE ROW LEVEL SECURITY;

-- Search logs insert for analytics
CREATE POLICY "Public insert search logs" ON public.search_logs
    FOR INSERT WITH CHECK (true);

-- Admins full access to search logs
CREATE POLICY "Admins full access to search logs" ON public.search_logs
    FOR ALL USING (auth.role() = 'authenticated');

-- Customers view & manage own vehicles in My Garage
CREATE POLICY "Customers manage own saved vehicles" ON public.customer_vehicles
    FOR ALL USING (auth.uid() = customer_id);

-- Admins full access to customer vehicles
CREATE POLICY "Admins manage customer vehicles" ON public.customer_vehicles
    FOR ALL USING (auth.role() = 'authenticated');
