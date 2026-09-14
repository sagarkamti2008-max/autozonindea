-- AUTOZONEINDIA ADMIN DASHBOARD, AUDIT LOGS, INVENTORY MOVEMENTS & ALERTS SCHEMA

-- 1. ADMIN AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    admin_email TEXT,
    action TEXT NOT NULL, -- e.g., 'PRODUCT_CREATED', 'STOCK_UPDATED', 'ORDER_STATUS_CHANGED'
    entity_type TEXT NOT NULL, -- e.g., 'product', 'inventory', 'order', 'coupon', 'review'
    entity_id TEXT,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb, -- Must never store raw credentials or payment secrets
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INVENTORY MOVEMENTS AUDIT TABLE
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('purchase', 'sale', 'reservation', 'release', 'return', 'manual_adjustment', 'correction')),
    quantity INT NOT NULL,
    previous_stock INT NOT NULL,
    new_stock INT NOT NULL,
    reference_type TEXT, -- e.g., 'order', 'po', 'admin_action'
    reference_id TEXT,
    note TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ADMIN DASHBOARD ALERTS TABLE
CREATE TABLE IF NOT EXISTS public.admin_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL, -- e.g., 'low_stock', 'out_of_stock', 'new_order', 'failed_payment', 'pending_enquiry', 'pending_review'
    priority TEXT NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')) DEFAULT 'medium',
    message TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    status TEXT NOT NULL CHECK (status IN ('unread', 'read', 'resolved')) DEFAULT 'unread',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CRITICAL PERFORMANCE INDEXES FOR BUSINESS ANALYTICS
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at);

CREATE INDEX IF NOT EXISTS idx_shipping_status ON public.shipping(status);
CREATE INDEX IF NOT EXISTS idx_shipping_created_at ON public.shipping(created_at);

CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries(created_at);

CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON public.inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_stock_qty ON public.inventory(stock_quantity);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.admin_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_user_id ON public.admin_audit_logs(admin_user_id);

CREATE INDEX IF NOT EXISTS idx_admin_alerts_status_priority ON public.admin_alerts(status, priority);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_alerts ENABLE ROW LEVEL SECURITY;

-- Only admins/super_admins can read audit logs, movements and alerts
CREATE POLICY admin_audit_logs_admin_select ON public.admin_audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.customers c
            WHERE c.id = auth.uid() AND c.role IN ('admin', 'super_admin', 'manager', 'support')
        )
    );

CREATE POLICY inventory_movements_admin_select ON public.inventory_movements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.customers c
            WHERE c.id = auth.uid() AND c.role IN ('admin', 'super_admin', 'manager')
        )
    );

CREATE POLICY admin_alerts_admin_select ON public.admin_alerts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.customers c
            WHERE c.id = auth.uid() AND c.role IN ('admin', 'super_admin', 'manager', 'support')
        )
    );
