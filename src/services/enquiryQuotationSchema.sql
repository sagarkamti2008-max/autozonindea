-- AUTOZONEINDIA CUSTOMER ENQUIRY, QUOTATION, LEAD MANAGEMENT & FOLLOW-UP SCHEMA

-- 1. ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    enquiry_number TEXT NOT NULL UNIQUE, -- e.g., 'ENQ-20260911-0001'
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    vehicle_id TEXT,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    quantity INT DEFAULT 1,
    source TEXT NOT NULL CHECK (source IN ('website', 'whatsapp', 'phone', 'admin', 'other')) DEFAULT 'website',
    status TEXT NOT NULL CHECK (status IN ('new', 'contacted', 'waiting_customer', 'quotation_sent', 'converted', 'closed', 'cancelled')) DEFAULT 'new',
    priority TEXT NOT NULL CHECK (priority IN ('low', 'normal', 'high', 'urgent')) DEFAULT 'normal',
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ
);

-- 2. BULK ENQUIRY ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.enquiry_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    vehicle_id TEXT,
    requested_product_name TEXT NOT NULL,
    sku TEXT,
    quantity INT DEFAULT 1 CHECK (quantity > 0),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENQUIRY ACTIVITY TIMELINE TABLE
CREATE TABLE IF NOT EXISTS public.enquiry_activity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE CASCADE NOT NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN (
        'created', 'assigned', 'status_changed', 'note_added', 'customer_contacted',
        'quotation_created', 'quotation_sent', 'quotation_accepted', 'quotation_rejected', 'converted', 'closed'
    )),
    message TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ENQUIRY FOLLOW-UPS TABLE
CREATE TABLE IF NOT EXISTS public.enquiry_followups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE CASCADE NOT NULL,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    follow_up_at TIMESTAMPTZ NOT NULL,
    note TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. QUOTATIONS TABLE
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quotation_number TEXT NOT NULL UNIQUE, -- e.g., 'QT-20260911-0001'
    enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    vehicle_id TEXT,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    shipping_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    valid_until TIMESTAMPTZ,
    status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired', 'converted', 'cancelled')) DEFAULT 'draft',
    secure_token TEXT NOT NULL UNIQUE, -- Unique token for public URL `/quotation/[secureToken]`
    notes TEXT,
    terms TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. QUOTATION ITEMS TABLE (With historical snapshot fields)
CREATE TABLE IF NOT EXISTS public.quotation_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quotation_id UUID REFERENCES public.quotations(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name_snapshot TEXT NOT NULL,
    sku_snapshot TEXT,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    discount_amount NUMERIC(12, 2) DEFAULT 0,
    tax_rate NUMERIC(5, 2) DEFAULT 18.00,
    line_total NUMERIC(12, 2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COMMUNICATION LOGS TABLE
CREATE TABLE IF NOT EXISTS public.communication_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'phone', 'email', 'website')),
    direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    message_summary TEXT NOT NULL,
    provider_message_id TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 8. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_priority ON public.enquiries(priority);
CREATE INDEX IF NOT EXISTS idx_enquiries_customer_id ON public.enquiries(customer_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_product_id ON public.enquiries(product_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_assigned_to ON public.enquiries(assigned_to);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries(created_at);

CREATE INDEX IF NOT EXISTS idx_quotations_status ON public.quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotations_customer_id ON public.quotations(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotations_enquiry_id ON public.quotations(enquiry_id);
CREATE INDEX IF NOT EXISTS idx_quotations_token ON public.quotations(secure_token);
CREATE INDEX IF NOT EXISTS idx_quotations_created_at ON public.quotations(created_at);

CREATE INDEX IF NOT EXISTS idx_followups_follow_up_at ON public.enquiry_followups(follow_up_at);
CREATE INDEX IF NOT EXISTS idx_followups_status ON public.enquiry_followups(status);

CREATE INDEX IF NOT EXISTS idx_comm_logs_enquiry_id ON public.communication_logs(enquiry_id);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;

-- Allow public users to insert new enquiries
CREATE POLICY enquiries_public_insert ON public.enquiries
    FOR INSERT WITH CHECK (true);

-- Allow public users to view public quotations ONLY via secure_token
CREATE POLICY quotations_public_token_select ON public.quotations
    FOR SELECT USING (
        secure_token IS NOT NULL OR
        EXISTS (
            SELECT 1 FROM public.customers c
            WHERE c.id = auth.uid() AND c.role IN ('admin', 'super_admin', 'manager', 'support')
        )
    );

-- Allow admins full access to enquiries & quotations
CREATE POLICY enquiries_admin_all ON public.enquiries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.customers c
            WHERE c.id = auth.uid() AND c.role IN ('admin', 'super_admin', 'manager', 'support')
        )
    );

CREATE POLICY quotations_admin_all ON public.quotations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.customers c
            WHERE c.id = auth.uid() AND c.role IN ('admin', 'super_admin', 'manager', 'support')
        )
    );
