-- ====================================================================
-- AUTOZONEINDIA - PAYMENT, INVOICE & NOTIFICATION SCHEMA MIGRATION
-- ====================================================================

-- 1. INVOICES TABLE
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    invoice_number VARCHAR(64) UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    discount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    tax DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    shipping_charge DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    grand_total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    billing_name VARCHAR(255) NOT NULL,
    billing_phone VARCHAR(50) NOT NULL,
    billing_email VARCHAR(255),
    billing_address TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'issued', -- issued, paid, cancelled, refunded
    pdf_url TEXT,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup by order or invoice number
CREATE INDEX IF NOT EXISTS idx_invoices_order_id ON public.invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON public.invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON public.invoices(customer_id);

-- 2. NOTIFICATION LOGS TABLE
CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    channel VARCHAR(32) NOT NULL DEFAULT 'whatsapp', -- whatsapp, email, sms
    event_type VARCHAR(64) NOT NULL, -- ORDER_CREATED, PAYMENT_SUCCESS, ORDER_CONFIRMED, ORDER_SHIPPED, ORDER_OUT_FOR_DELIVERY, ORDER_DELIVERED, ORDER_CANCELLED, INVOICE_READY
    recipient VARCHAR(100) NOT NULL,
    provider VARCHAR(64) NOT NULL DEFAULT 'mock_whatsapp',
    status VARCHAR(32) NOT NULL DEFAULT 'queued', -- queued, sent, failed
    provider_message_id VARCHAR(255),
    error_message TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_order ON public.notification_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notification_logs(status);

-- 3. ORDER EVENTS HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.order_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    status VARCHAR(64) NOT NULL,
    note TEXT,
    created_by VARCHAR(255) DEFAULT 'System',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_events_order ON public.order_events(order_id);

-- 4. VERIFY / ENHANCE PAYMENTS TABLE FIELDS
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payments' AND column_name='provider') THEN
        ALTER TABLE public.payments ADD COLUMN provider VARCHAR(64) DEFAULT 'cod';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payments' AND column_name='provider_order_id') THEN
        ALTER TABLE public.payments ADD COLUMN provider_order_id VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payments' AND column_name='provider_payment_id') THEN
        ALTER TABLE public.payments ADD COLUMN provider_payment_id VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payments' AND column_name='gateway_response_reference') THEN
        ALTER TABLE public.payments ADD COLUMN gateway_response_reference TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payments' AND column_name='paid_at') THEN
        ALTER TABLE public.payments ADD COLUMN paid_at TIMESTAMPTZ;
    END IF;
END $$;

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;

-- Customers can view their own invoices
CREATE POLICY "Customers view own invoices" ON public.invoices
    FOR SELECT USING (auth.uid() = customer_id OR customer_id IS NULL);

-- Admins full access to invoices
CREATE POLICY "Admins full access to invoices" ON public.invoices
    FOR ALL USING (auth.role() = 'authenticated');

-- Customers view their own notification logs
CREATE POLICY "Customers view own notification logs" ON public.notification_logs
    FOR SELECT USING (auth.uid() = customer_id);

-- Admins full access to notification logs
CREATE POLICY "Admins full access to notification logs" ON public.notification_logs
    FOR ALL USING (auth.role() = 'authenticated');

-- Order events RLS
CREATE POLICY "Customers view own order events" ON public.order_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_events.order_id 
            AND (orders.customer_id = auth.uid() OR orders.customer_id IS NULL)
        )
    );

CREATE POLICY "Admins full access to order events" ON public.order_events
    FOR ALL USING (auth.role() = 'authenticated');

-- 6. CREATE STORAGE BUCKET FOR INVOICE PDFS (Run via Supabase Dashboard or API if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('invoice-pdfs', 'invoice-pdfs', true) ON CONFLICT (id) DO NOTHING;
