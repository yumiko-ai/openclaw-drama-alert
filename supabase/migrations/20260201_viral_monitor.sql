-- Twitter Viral Monitor Tables (using gen_random_uuid())

-- Tweets table - stores tweet data from monitored lists
CREATE TABLE IF NOT EXISTS tweets (
    id TEXT PRIMARY KEY,  -- Twitter tweet ID
    author TEXT NOT NULL,
    text TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tweet metrics - tracks metrics over time for virality detection
CREATE TABLE IF NOT EXISTS tweet_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tweet_id TEXT NOT NULL REFERENCES tweets(id) ON DELETE CASCADE,
    likes INTEGER DEFAULT 0,
    retweets INTEGER DEFAULT 0,
    replies INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    captured_at TIMESTAMPTZ DEFAULT NOW()
);

-- Viral queue - stores detected viral tweets pending review
CREATE TABLE IF NOT EXISTS viral_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tweet_id TEXT NOT NULL REFERENCES tweets(id) ON DELETE CASCADE,
    velocity DOUBLE PRECISION DEFAULT 0,
    impressions_at_detection INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'pushed', 'dismissed')),
    pushed_at TIMESTAMPTZ,
    dismissed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tweets_timestamp ON tweets(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_tweets_is_active ON tweets(is_active);
CREATE INDEX IF NOT EXISTS idx_tweet_metrics_tweet_id ON tweet_metrics(tweet_id);
CREATE INDEX IF NOT EXISTS idx_tweet_metrics_captured_at ON tweet_metrics(captured_at DESC);
CREATE INDEX IF NOT EXISTS idx_viral_queue_status ON viral_queue(status);
CREATE INDEX IF NOT EXISTS idx_viral_queue_created_at ON viral_queue(created_at DESC);

-- Enable RLS for new tables
ALTER TABLE tweets ENABLE ROW LEVEL SECURITY;
ALTER TABLE tweet_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE viral_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies for viral monitor tables
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_policies WHERE policyname = 'Anyone can view tweets' AND tablename = 'tweets') THEN
        CREATE POLICY "Anyone can view tweets" ON tweets FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_policies WHERE policyname = 'Service role can manage tweets' AND tablename = 'tweets') THEN
        CREATE POLICY "Service role can manage tweets" ON tweets FOR ALL USING (auth.role() = 'service_role');
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_policies WHERE policyname = 'Anyone can view tweet metrics' AND tablename = 'tweet_metrics') THEN
        CREATE POLICY "Anyone can view tweet metrics" ON tweet_metrics FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_policies WHERE policyname = 'Service role can manage tweet metrics' AND tablename = 'tweet_metrics') THEN
        CREATE POLICY "Service role can manage tweet metrics" ON tweet_metrics FOR ALL USING (auth.role() = 'service_role');
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_policies WHERE policyname = 'Anyone can view viral queue' AND tablename = 'viral_queue') THEN
        CREATE POLICY "Anyone can view viral queue" ON viral_queue FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_policies WHERE policyname = 'Service role can manage viral queue' AND tablename = 'viral_queue') THEN
        CREATE POLICY "Service role can manage viral queue" ON viral_queue FOR ALL USING (auth.role() = 'service_role');
    END IF;
END $$;
