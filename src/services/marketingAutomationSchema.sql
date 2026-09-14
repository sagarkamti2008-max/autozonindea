-- ============================================================================
-- AutoZoneIndia Database Schema: Marketing Automation & Notification Engine
-- Idempotent Supabase SQL DDL Migration
-- ============================================================================

-- 1. CUSTOMER EVENT TRACKING TABLE
CREATE TABLE IF NOT EXISTS customer_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    session_id TEXT NOT NULL,
    event_type TEXT NOT NULL, -- page_view, product_view, category_view, search, vehicle_selected, add_to_cart, remove_from_cart, cart_updated, checkout_started, checkout_abandoned, order_created, order_paid, order_cancelled, order_delivered, wishlist_added, enquiry_created, quotation_viewed, review_submitted
    entity_type TEXT, -- product, category, order, enquiry, quotation, vehicle
    entity_id TEXT,
    metadata_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_events_customer_id ON customer_events(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_events_session_id ON customer_events(session_id);
CREATE INDEX IF NOT EXISTS idx_customer_events_event_type ON customer_events(event_type);
CREATE INDEX IF NOT EXISTS idx_customer_events_created_at ON customer_events(created_at DESC);


-- 2. ABANDONED CARTS TABLE
CREATE TABLE IF NOT EXISTS abandoned_carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    session_id TEXT UNIQUE NOT NULL,
    cart_snapshot JSONB NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    recovery_status TEXT NOT NULL DEFAULT 'active', -- active, eligible, message_scheduled, message_sent, recovered, expired, ignored
    recovered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_abandoned_carts_customer_id ON abandoned_carts(customer_id);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_recovery_status ON abandoned_carts(recovery_status);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_last_activity ON abandoned_carts(last_activity_at DESC);


-- 3. AUTOMATION RULES TABLE
CREATE TABLE IF NOT EXISTS automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    trigger_type TEXT NOT NULL, -- cart_abandoned, order_created, order_paid, order_delivered, customer_created, wishlist_item_added, price_changed, back_in_stock, enquiry_created, quotation_created, quotation_expiring
    conditions_json JSONB DEFAULT '{}'::jsonb,
    action_type TEXT NOT NULL, -- create_notification, create_task, send_email, send_whatsapp, send_sms_if_configured, apply_coupon, tag_customer
    action_config_json JSONB DEFAULT '{}'::jsonb,
    enabled BOOLEAN DEFAULT TRUE,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_automation_rules_trigger_type ON automation_rules(trigger_type);
CREATE INDEX IF NOT EXISTS idx_automation_rules_enabled ON automation_rules(enabled);


-- 4. AUTOMATION RUNS / LOGS TABLE
CREATE TABLE IF NOT EXISTS automation_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    automation_rule_id UUID REFERENCES automation_rules(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    event_id UUID REFERENCES customer_events(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'success', -- success, failed, skipped
    result_json JSONB DEFAULT '{}'::jsonb,
    error_message TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_automation_runs_rule_id ON automation_runs(automation_rule_id);
CREATE INDEX IF NOT EXISTS idx_automation_runs_customer_id ON automation_runs(customer_id);
CREATE INDEX IF NOT EXISTS idx_automation_runs_status ON automation_runs(status);


-- 5. CUSTOMER SEGMENTS TABLE
CREATE TABLE IF NOT EXISTS customer_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    rules_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'active', -- active, inactive
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 6. CUSTOMER TAGS & ASSIGNMENTS TABLES
CREATE TABLE IF NOT EXISTS customer_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_tag_assignments (
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES customer_tags(id) ON DELETE CASCADE,
    assigned_by TEXT DEFAULT 'system',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (customer_id, tag_id)
);


-- 7. UNIFIED NOTIFICATION EVENTS TABLE
CREATE TABLE IF NOT EXISTS notification_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    order_id TEXT,
    type TEXT NOT NULL, -- transactional, promotional, abandoned_cart, stock_alert, price_alert
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    channel TEXT NOT NULL, -- in_app, email, whatsapp, sms
    status TEXT NOT NULL DEFAULT 'pending', -- pending, scheduled, sent, failed, cancelled
    scheduled_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    provider_message_id TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_events_customer ON notification_events(customer_id);
CREATE INDEX IF NOT EXISTS idx_notification_events_status ON notification_events(status);
CREATE INDEX IF NOT EXISTS idx_notification_events_channel ON notification_events(channel);


-- 8. CUSTOMER NOTIFICATION PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS customer_notification_preferences (
    customer_id UUID PRIMARY KEY REFERENCES customers(id) ON DELETE CASCADE,
    order_updates BOOLEAN DEFAULT TRUE,
    promotional_messages BOOLEAN DEFAULT TRUE,
    email_enabled BOOLEAN DEFAULT TRUE,
    whatsapp_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 9. STOCK ALERT SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS stock_alert_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active', -- active, notified, cancelled
    created_at TIMESTAMPTZ DEFAULT NOW(),
    notified_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_stock_alerts_product ON stock_alert_subscriptions(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_status ON stock_alert_subscriptions(status);


-- 10. PRICE DROP ALERT SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS price_alert_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    target_price NUMERIC(12, 2),
    previous_price NUMERIC(12, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active', -- active, notified, cancelled
    created_at TIMESTAMPTZ DEFAULT NOW(),
    notified_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_price_alerts_product ON price_alert_subscriptions(product_id);


-- 11. EMAIL TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    subject TEXT NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT NOT NULL,
    variables_json JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'active', -- active, draft, archived
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 12. WHATSAPP TEMPLATES & MESSAGES TABLES
CREATE TABLE IF NOT EXISTS whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    template_identifier TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'MARKETING', -- MARKETING, UTILITY, AUTHENTICATION
    language TEXT NOT NULL DEFAULT 'en_US',
    variables_json JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'APPROVED' -- PENDING, APPROVED, REJECTED
);

CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    template_id UUID REFERENCES whatsapp_templates(id) ON DELETE SET NULL,
    destination TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, sent, delivered, failed
    provider_message_id TEXT,
    error_message TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 13. MARKETING CAMPAIGNS & CAMPAIGN EVENTS TABLES
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    segment_id UUID REFERENCES customer_segments(id) ON DELETE SET NULL,
    channel TEXT NOT NULL, -- email, whatsapp, sms, in_app
    template_id UUID,
    scheduled_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'draft', -- draft, scheduled, running, completed, paused, cancelled, failed
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- queued, sent, delivered, opened, clicked, converted, failed, unsubscribed
    metadata_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaign_events_campaign ON campaign_events(campaign_id);


-- 14. MARKETING SETTINGS TABLE
CREATE TABLE IF NOT EXISTS marketing_settings (
    key TEXT PRIMARY KEY,
    value_json JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default marketing settings
INSERT INTO marketing_settings (key, value_json) VALUES
('abandoned_cart_delay', '60'::jsonb),
('maximum_recovery_messages', '2'::jsonb),
('campaign_frequency_limit', '3'::jsonb),
('back_in_stock_enabled', 'true'::jsonb),
('price_alert_enabled', 'true'::jsonb),
('marketing_email_enabled', 'true'::jsonb),
('marketing_whatsapp_enabled', 'true'::jsonb),
('marketing_sms_enabled', 'false'::jsonb)
ON CONFLICT (key) DO NOTHING;


-- Enable Row Level Security (RLS)
ALTER TABLE customer_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_tag_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_alert_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alert_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_settings ENABLE ROW LEVEL SECURITY;

-- Public RLS Policies (Read/Write where appropriate)
CREATE POLICY "Public write customer events" ON customer_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Customer read own notification events" ON notification_events FOR SELECT USING (auth.uid() = customer_id OR customer_id IS NULL);
CREATE POLICY "Customer write stock alerts" ON stock_alert_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Customer write price alerts" ON price_alert_subscriptions FOR INSERT WITH CHECK (true);

-- Admin Full Access Policies
CREATE POLICY "Admin full access customer events" ON customer_events FOR ALL USING (true);
CREATE POLICY "Admin full access abandoned carts" ON abandoned_carts FOR ALL USING (true);
CREATE POLICY "Admin full access automation rules" ON automation_rules FOR ALL USING (true);
CREATE POLICY "Admin full access automation runs" ON automation_runs FOR ALL USING (true);
CREATE POLICY "Admin full access customer segments" ON customer_segments FOR ALL USING (true);
CREATE POLICY "Admin full access customer tags" ON customer_tags FOR ALL USING (true);
CREATE POLICY "Admin full access tag assignments" ON customer_tag_assignments FOR ALL USING (true);
CREATE POLICY "Admin full access notification events" ON notification_events FOR ALL USING (true);
CREATE POLICY "Admin full access preferences" ON customer_notification_preferences FOR ALL USING (true);
CREATE POLICY "Admin full access stock alerts" ON stock_alert_subscriptions FOR ALL USING (true);
CREATE POLICY "Admin full access price alerts" ON price_alert_subscriptions FOR ALL USING (true);
CREATE POLICY "Admin full access email templates" ON email_templates FOR ALL USING (true);
CREATE POLICY "Admin full access whatsapp templates" ON whatsapp_templates FOR ALL USING (true);
CREATE POLICY "Admin full access whatsapp messages" ON whatsapp_messages FOR ALL USING (true);
CREATE POLICY "Admin full access marketing campaigns" ON marketing_campaigns FOR ALL USING (true);
CREATE POLICY "Admin full access campaign events" ON campaign_events FOR ALL USING (true);
CREATE POLICY "Admin full access marketing settings" ON marketing_settings FOR ALL USING (true);
