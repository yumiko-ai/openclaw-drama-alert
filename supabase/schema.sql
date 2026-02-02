-- DramaAlert Studio Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for future user auth expansion)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE,
    password_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Thumbnail presets
CREATE TABLE presets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',
    is_default BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated thumbnails log
CREATE TABLE generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    name TEXT,
    action TEXT,
    subtext TEXT,
    image_url TEXT,
    generated_url TEXT,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent webhooks log
CREATE TABLE webhook_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id TEXT NOT NULL,
    type TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}',
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dashboard alerts (for agent pushes)
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    priority TEXT DEFAULT 'medium',
    is_read BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Only owner can access their data
CREATE POLICY "Users can access own data" ON users
    FOR ALL USING (auth.uid() = id);

-- Presets: Public presets visible to all, private only to owner
CREATE POLICY "Public presets are viewable by everyone" ON presets
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage own presets" ON presets
    FOR ALL USING (auth.uid() = user_id);

-- Generations: Owner can manage, public can view counts
CREATE POLICY "Users can manage own generations" ON generations
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view generation counts" ON generations
    FOR SELECT USING (true);

-- Chat messages: Only owner can access
CREATE POLICY "Users can access own chat messages" ON chat_messages
    FOR ALL USING (auth.uid() = user_id);

-- Webhook logs: Admin only
CREATE POLICY "Service role can manage webhook logs" ON webhook_logs
    FOR ALL USING (auth.role() = 'service_role');

-- Alerts: Owner can manage
CREATE POLICY "Users can manage own alerts" ON alerts
    FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

-- Seed default presets
INSERT INTO presets (name, config, is_default, is_public) VALUES
    ('Standard', '{"nameSize": 55, "actionSize": 110, "subtextSize": 22, "padding": 55}', true, true),
    ('Compact', '{"nameSize": 40, "actionSize": 80, "subtextSize": 18, "padding": 40}', false, true),
    ('Large', '{"nameSize": 70, "actionSize": 130, "subtextSize": 26, "padding": 70}', false, true),
    ('Drama King', '{"nameSize": 60, "actionSize": 140, "subtextSize": 24, "padding": 65}', false, true);

-- Create indexes for performance
CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_created_at ON generations(created_at DESC);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX idx_alerts_is_read ON alerts(is_read) WHERE is_read = false;
CREATE INDEX idx_webhook_logs_created_at ON webhook_logs(created_at DESC);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply auto-update to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_presets_updated_at BEFORE UPDATE ON presets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
