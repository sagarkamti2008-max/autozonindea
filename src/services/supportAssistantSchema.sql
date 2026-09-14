-- ============================================================================
-- AutoZoneIndia Database Schema: Customer Support & AI Assistant Engine
-- Idempotent Supabase SQL DDL Migration
-- ============================================================================

-- 1. SUPPORT TICKETS TABLE
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number TEXT UNIQUE NOT NULL, -- AZI-TKT-YYYYMMDD-0001
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    order_id TEXT,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'technical', -- order, payment, shipping, return, refund, product, compatibility, account, quotation, technical, other
    priority TEXT NOT NULL DEFAULT 'normal', -- low, normal, high, urgent
    status TEXT NOT NULL DEFAULT 'open', -- open, in_progress, waiting_customer, waiting_internal, resolved, closed
    assigned_to TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_customer ON support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_number ON support_tickets(ticket_number);


-- 2. SUPPORT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL, -- customer, agent, ai, system
    sender_id UUID,
    message TEXT NOT NULL,
    attachments_json JSONB DEFAULT '[]'::jsonb,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_messages_ticket ON support_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_sender ON support_messages(sender_type);


-- 3. SUPPORT ESCALATIONS TABLE
CREATE TABLE IF NOT EXISTS support_escalations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'high',
    assigned_to TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, assigned, resolved
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_support_escalations_ticket ON support_escalations(ticket_id);


-- 4. AI CONVERSATIONS & MESSAGES TABLES
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    session_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active', -- active, resolved, escalated
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL, -- user, assistant, tool, system
    content TEXT NOT NULL,
    tool_calls_json JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation ON ai_messages(conversation_id);


-- 5. SUPPORT KNOWLEDGE BASE ARTICLES TABLE
CREATE TABLE IF NOT EXISTS support_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    status TEXT NOT NULL DEFAULT 'published', -- draft, published, archived
    searchable_text TEXT,
    created_by TEXT,
    updated_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_articles_slug ON support_articles(slug);
CREATE INDEX IF NOT EXISTS idx_support_articles_status ON support_articles(status);


-- 6. AI FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS ai_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
    message_id UUID REFERENCES ai_messages(id) ON DELETE CASCADE,
    rating TEXT NOT NULL, -- helpful, incorrect, needs_review
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 7. AI UNANSWERED QUESTIONS QUEUE TABLE
CREATE TABLE IF NOT EXISTS ai_unanswered_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    reason TEXT NOT NULL, -- data_missing, unverified_compatibility, customer_escalated, negative_feedback
    status TEXT NOT NULL DEFAULT 'pending', -- pending, converted_faq, converted_article, converted_task, dismissed
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 8. AI USAGE LOGS TABLE
CREATE TABLE IF NOT EXISTS ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES ai_conversations(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    model TEXT NOT NULL DEFAULT 'gemini-1.5-flash',
    input_tokens INT,
    output_tokens INT,
    latency_ms INT,
    estimated_cost NUMERIC(10, 6),
    status TEXT NOT NULL DEFAULT 'success',
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 9. SUPPORT SETTINGS TABLE
CREATE TABLE IF NOT EXISTS support_settings (
    key TEXT PRIMARY KEY,
    value_json JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Support Settings
INSERT INTO support_settings (key, value_json) VALUES
('ai_enabled', 'true'::jsonb),
('assistant_enabled', 'true'::jsonb),
('human_handoff_enabled', 'true'::jsonb),
('max_messages_per_session', '30'::jsonb),
('max_daily_messages', '100'::jsonb),
('support_email', '"support@autozonindia.com"'::jsonb),
('support_hours', '"Mon-Sat 09:00 - 20:00 IST"'::jsonb),
('ai_disclaimer', '"AutoZoneIndia AI Assistant retrieves verified database compatibility and stock data only. It does not fabricate availability."'::jsonb),
('default_ticket_priority', '"normal"'::jsonb)
ON CONFLICT (key) DO NOTHING;


-- Enable Row Level Security (RLS)
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_unanswered_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_settings ENABLE ROW LEVEL SECURITY;

-- Customer RLS Policies
CREATE POLICY "Customer read own tickets" ON support_tickets FOR SELECT USING (auth.uid() = customer_id OR customer_id IS NULL);
CREATE POLICY "Customer read public messages" ON support_messages FOR SELECT USING (is_internal = FALSE);
CREATE POLICY "Customer read published articles" ON support_articles FOR SELECT USING (status = 'published');

-- Admin Full Access Policies
CREATE POLICY "Admin full access support tickets" ON support_tickets FOR ALL USING (true);
CREATE POLICY "Admin full access support messages" ON support_messages FOR ALL USING (true);
CREATE POLICY "Admin full access escalations" ON support_escalations FOR ALL USING (true);
CREATE POLICY "Admin full access conversations" ON ai_conversations FOR ALL USING (true);
CREATE POLICY "Admin full access ai messages" ON ai_messages FOR ALL USING (true);
CREATE POLICY "Admin full access support articles" ON support_articles FOR ALL USING (true);
CREATE POLICY "Admin full access ai feedback" ON ai_feedback FOR ALL USING (true);
CREATE POLICY "Admin full access unanswered" ON ai_unanswered_questions FOR ALL USING (true);
CREATE POLICY "Admin full access ai usage" ON ai_usage_logs FOR ALL USING (true);
CREATE POLICY "Admin full access support settings" ON support_settings FOR ALL USING (true);
