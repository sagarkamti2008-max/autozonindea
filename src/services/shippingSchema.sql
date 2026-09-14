-- ====================================================================
-- AUTOZONEINDIA - SHIPPING, COURIER & ORDER TRACKING SCHEMA MIGRATION
-- ====================================================================

-- 1. ENHANCE / VERIFY SHIPPING TABLE FIELDS
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shipping' AND column_name='customer_id') THEN
        ALTER TABLE public.shipping ADD COLUMN customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shipping' AND column_name='shipping_address_id') THEN
        ALTER TABLE public.shipping ADD COLUMN shipping_address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shipping' AND column_name='courier_provider') THEN
        ALTER TABLE public.shipping ADD COLUMN courier_provider VARCHAR(64) DEFAULT 'manual';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shipping' AND column_name='shipment_id') THEN
        ALTER TABLE public.shipping ADD COLUMN shipment_id VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shipping' AND column_name='tracking_url') THEN
        ALTER TABLE public.shipping ADD COLUMN tracking_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shipping' AND column_name='shipping_method') THEN
        ALTER TABLE public.shipping ADD COLUMN shipping_method VARCHAR(64) DEFAULT 'standard';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shipping' AND column_name='shipping_charge') THEN
        ALTER TABLE public.shipping ADD COLUMN shipping_charge DECIMAL(12,2) DEFAULT 0.00;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shipping' AND column_name='estimated_delivery_date') THEN
        ALTER TABLE public.shipping ADD COLUMN estimated_delivery_date TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shipping' AND column_name='shipped_at') THEN
        ALTER TABLE public.shipping ADD COLUMN shipped_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shipping' AND column_name='out_for_delivery_at') THEN
        ALTER TABLE public.shipping ADD COLUMN out_for_delivery_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shipping' AND column_name='delivered_at') THEN
        ALTER TABLE public.shipping ADD COLUMN delivered_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shipping' AND column_name='cancelled_at') THEN
        ALTER TABLE public.shipping ADD COLUMN cancelled_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shipping' AND column_name='returned_at') THEN
        ALTER TABLE public.shipping ADD COLUMN returned_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shipping' AND column_name='created_at') THEN
        ALTER TABLE public.shipping ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shipping' AND column_name='updated_at') THEN
        ALTER TABLE public.shipping ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- 2. SHIPMENT TRACKING EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.shipment_tracking_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipping_id UUID NOT NULL REFERENCES public.shipping(id) ON DELETE CASCADE,
    status VARCHAR(64) NOT NULL, -- picked_up, in_transit, out_for_delivery, delivered, delayed, returned
    location VARCHAR(255) NOT NULL DEFAULT 'Logistics Facility',
    description TEXT NOT NULL,
    event_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source VARCHAR(64) DEFAULT 'system', -- system, courier_api, admin
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SERVICEABLE PINCODES TABLE
CREATE TABLE IF NOT EXISTS public.serviceable_pincodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pincode VARCHAR(10) UNIQUE NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    is_serviceable BOOLEAN DEFAULT true,
    estimated_days INT DEFAULT 3,
    cod_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_shipping_order_id ON public.shipping(order_id);
CREATE INDEX IF NOT EXISTS idx_shipping_customer_id ON public.shipping(customer_id);
CREATE INDEX IF NOT EXISTS idx_shipping_tracking_num ON public.shipping(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipping_status ON public.shipping(status);
CREATE INDEX IF NOT EXISTS idx_shipping_provider ON public.shipping(courier_provider);

CREATE INDEX IF NOT EXISTS idx_tracking_events_shipping ON public.shipment_tracking_events(shipping_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_time ON public.shipment_tracking_events(event_time);

CREATE INDEX IF NOT EXISTS idx_pincode_lookup ON public.serviceable_pincodes(pincode);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.shipping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.serviceable_pincodes ENABLE ROW LEVEL SECURITY;

-- Customers view own shipments
CREATE POLICY "Customers view own shipping records" ON public.shipping
    FOR SELECT USING (
        auth.uid() = customer_id 
        OR customer_id IS NULL 
        OR EXISTS (
            SELECT 1 FROM public.orders WHERE orders.id = shipping.order_id AND (orders.customer_id = auth.uid() OR orders.customer_id IS NULL)
        )
    );

-- Admins manage all shipping records
CREATE POLICY "Admins manage shipping" ON public.shipping
    FOR ALL USING (auth.role() = 'authenticated');

-- Customers view tracking events for their shipments
CREATE POLICY "Customers view tracking events" ON public.shipment_tracking_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.shipping 
            WHERE shipping.id = shipment_tracking_events.shipping_id 
            AND (shipping.customer_id = auth.uid() OR shipping.customer_id IS NULL)
        )
    );

-- Admins manage tracking events
CREATE POLICY "Admins manage tracking events" ON public.shipment_tracking_events
    FOR ALL USING (auth.role() = 'authenticated');

-- Everyone can read serviceable pincodes (Public delivery lookup)
CREATE POLICY "Public read serviceable pincodes" ON public.serviceable_pincodes
    FOR SELECT USING (true);

-- 6. SEED MAJOR INDIAN METRO PINCODES
INSERT INTO public.serviceable_pincodes (pincode, city, state, is_serviceable, estimated_days, cod_available) VALUES
('110001', 'New Delhi', 'Delhi', true, 2, true),
('110020', 'Okhla', 'Delhi', true, 2, true),
('201301', 'Noida', 'Uttar Pradesh', true, 2, true),
('122001', 'Gurugram', 'Haryana', true, 2, true),
('400001', 'Mumbai', 'Maharashtra', true, 3, true),
('400050', 'Bandra', 'Mumbai', true, 3, true),
('560001', 'Bengaluru', 'Karnataka', true, 3, true),
('560034', 'Koramangala', 'Bengaluru', true, 3, true),
('600001', 'Chennai', 'Tamil Nadu', true, 4, true),
('700001', 'Kolkata', 'West Bengal', true, 4, true),
('500001', 'Hyderabad', 'Telangana', true, 3, true),
('380001', 'Ahmedabad', 'Gujarat', true, 3, true),
('411001', 'Pune', 'Maharashtra', true, 3, true),
('302001', 'Jaipur', 'Rajasthan', true, 3, true),
('141001', 'Ludhiana', 'Punjab', true, 3, true)
ON CONFLICT (pincode) DO UPDATE SET is_serviceable = EXCLUDED.is_serviceable;
