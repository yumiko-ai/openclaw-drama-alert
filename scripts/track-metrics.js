#!/usr/bin/env node

/**
 * Tweet Metrics Tracker using Bird CLI
 * Tracks tweet metrics every 10 minutes for 12 hours
 * Detects velocity spikes and viral content
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRAMAALERT_URL = process.env.DRAMAALERT_URL || 'https://openclaw-drama-alert.vercel.app';
const METRICS_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_TRACKING_HOURS = 12;
const VIRAL_THRESHOLD = 70000;

// Bird CLI path
const BIRD_CLI = '/opt/homebrew/bin/bird';

async function getSupabaseClient() {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        console.log('⚠️  Supabase not configured');
        return null;
    }

    const { createClient } = require('@supabase/supabase-js');
    return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
}

async function fetchTweetMetricsWithBird(tweetId) {
    try {
        const output = execSync(
            `${BIRD_CLI} read ${tweetId} --json`,
            { encoding: 'utf8', timeout: 30000 }
        );
        
        const tweet = JSON.parse(output);
        return {
            likes: tweet.likeCount || 0,
            retweets: tweet.retweetCount || 0,
            replies: tweet.replyCount || 0,
            impressions: estimateImpressions(tweet)
        };
    } catch (error) {
        console.error(`❌ Bird CLI error fetching ${tweetId}:`, error.message);
        return null;
    }
}

function estimateImpressions(tweet) {
    const engagement = (tweet.likeCount || 0) + (tweet.retweetCount || 0);
    return engagement * 30 + 1000;
}

async function getActiveTweets(supabase) {
    if (!supabase) {
        // Read from local file
        const logPath = path.join(__dirname, '..', 'logs', 'tweets.json');
        if (fs.existsSync(logPath)) {
            const tweets = JSON.parse(fs.readFileSync(logPath, 'utf8'));
            const cutoff = new Date(Date.now() - MAX_TRACKING_HOURS * 60 * 60 * 1000);
            return tweets.filter(t => new Date(t.timestamp) > cutoff);
        }
        return [];
    }

    const { data, error } = await supabase
        .from('tweets')
        .select('id, author, text, timestamp, url')
        .eq('is_active', true)
        .gte('timestamp', new Date(Date.now() - MAX_TRACKING_HOURS * 60 * 60 * 1000).toISOString());

    if (error) {
        console.error('Error fetching active tweets:', error.message);
        return [];
    }
    return data || [];
}

async function getPreviousMetrics(supabase, tweetId) {
    if (!supabase) return null;

    const { data } = await supabase
        .from('tweet_metrics')
        .select('*')
        .eq('tweet_id', tweetId)
        .order('captured_at', { ascending: false })
        .limit(2);

    return data || [];
}

async function storeMetrics(supabase, tweetId, metrics) {
    if (!supabase) return;

    const { error } = await supabase
        .from('tweet_metrics')
        .insert({
            tweet_id: tweetId,
            likes: metrics.likes,
            retweets: metrics.retweets,
            replies: metrics.replies,
            impressions: metrics.impressions
        });

    if (error) {
        console.error('Error storing metrics:', error.message);
    }
}

async function calculateVelocity(prevMetrics, currentImpressions) {
    if (!prevMetrics || prevMetrics.length < 2) {
        return { velocity: 0, isSpike: false };
    }

    const current = prevMetrics[0];
    const previous = prevMetrics[1];

    const timeDiff = (new Date(current.captured_at) - new Date(previous.captured_at)) / 1000 / 60;
    const metricDiff = currentImpressions - (previous.impressions || 0);

    let velocity = 0;
    if (timeDiff > 0) {
        velocity = metricDiff / timeDiff;
    }

    // Velocity spike: 50% increase in impressions rate
    const isSpike = velocity > (previous.impressions || 1) * 0.5;

    return { velocity, isSpike };
}

async function checkAndQueueViral(supabase, tweetId, metrics, velocity) {
    if (!supabase) return false;

    const impressions = metrics.impressions || 0;
    const isViral = impressions >= VIRAL_THRESHOLD;

    if (isViral) {
        // Check if already in queue
        const { data: existing } = await supabase
            .from('viral_queue')
            .select('id')
            .eq('tweet_id', tweetId)
            .in('status', ['pending', 'pushed'])
            .single();

        if (!existing) {
            await supabase
                .from('viral_queue')
                .insert({
                    tweet_id: tweetId,
                    velocity: velocity,
                    impressions_at_detection: impressions,
                    status: 'pending'
                });

            console.log(`🚨 VIRAL: ${tweetId.substring(0, 12)}... - ${impressions.toLocaleString()} impressions, ${velocity.toFixed(2)}/min`);
            return true;
        }
    }

    return false;
}

async function pushToDramaAlert(tweet, metrics, velocity) {
    try {
        const response = await fetch(`${DRAMAALERT_URL}/api/viral`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'push',
                tweet_id: tweet.id,
                author: tweet.author,
                text: tweet.text,
                url: tweet.url,
                timestamp: tweet.timestamp,
                metrics: metrics,
                velocity: velocity
            })
        });

        if (response.ok) {
            console.log(`✅ Pushed viral to DramaAlert: ${tweet.id.substring(0, 12)}...`);
        }
    } catch (error) {
        console.error('Error pushing to DramaAlert:', error.message);
    }
}

async function updateTweetStatus(supabase, tweetId, isActive) {
    if (!supabase) return;

    await supabase
        .from('tweets')
        .update({ is_active: isActive })
        .eq('id', tweetId);
}

async function trackMetrics() {
    console.log(`\n[${new Date().toISOString()}] 📊 Tracking tweet metrics...`);

    const supabase = await getSupabaseClient();
    const tweets = await getActiveTweets(supabase);

    if (tweets.length === 0) {
        console.log('No active tweets to track');
        return;
    }

    console.log(`Tracking ${tweets.length} tweets...`);

    for (const tweet of tweets) {
        try {
            // Fetch current metrics using Bird CLI
            const metrics = await fetchTweetMetricsWithBird(tweet.id);

            if (!metrics) {
                continue;
            }

            // Get previous metrics for velocity calculation
            const prevMetrics = await getPreviousMetrics(supabase, tweet.id);

            // Calculate velocity
            const { velocity, isSpike } = await calculateVelocity(prevMetrics, metrics.impressions);

            // Store current metrics
            await storeMetrics(supabase, tweet.id, metrics);

            // Check for viral conditions
            const isViral = metrics.impressions >= VIRAL_THRESHOLD || isSpike;

            if (isViral) {
                const wasQueued = await checkAndQueueViral(supabase, tweet.id, metrics, velocity);
                if (wasQueued) {
                    await pushToDramaAlert(tweet, metrics, velocity);
                }
            }

            // Deactivate old tweets (older than MAX_TRACKING_HOURS)
            const tweetAge = Date.now() - new Date(tweet.timestamp).getTime();
            if (tweetAge > MAX_TRACKING_HOURS * 60 * 60 * 1000) {
                await updateTweetStatus(supabase, tweet.id, false);
                console.log(`📴 Deactivated old tweet: ${tweet.id.substring(0, 12)}...`);
            }

        } catch (error) {
            console.error(`Error tracking ${tweet.id}:`, error.message);
        }
    }

    console.log(`[${new Date().toISOString()}] ✅ Metrics tracking complete`);
}

async function main() {
    console.log('📊 Tweet Metrics Tracker (Bird CLI)');
    console.log(`Tracking interval: ${METRICS_INTERVAL_MS / 1000 / 60} minutes`);
    console.log(`Max tracking duration: ${MAX_TRACKING_HOURS} hours`);
    console.log(`Viral threshold: ${VIRAL_THRESHOLD.toLocaleString()} impressions`);
    console.log(`Bird CLI: ${BIRD_CLI}\n`);

    // Verify Bird CLI
    try {
        execSync(`${BIRD_CLI} --version`, { encoding: 'utf8' });
        console.log('✅ Bird CLI verified\n');
    } catch (e) {
        console.error('❌ Bird CLI not found:', e.message);
        process.exit(1);
    }

    // Initial tracking
    await trackMetrics();

    // Set up interval
    setInterval(trackMetrics, METRICS_INTERVAL_MS);
}

main().catch(console.error);
