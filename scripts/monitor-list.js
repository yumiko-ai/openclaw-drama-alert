#!/usr/bin/env node

/**
 * Twitter List Monitor using Bird CLI
 * Fetches tweets from a Twitter list every 2 minutes
 * List ID: 1667713130078642178
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const LIST_ID = process.env.TWITTER_LIST_ID || '1667713130078642178';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRAMAALERT_URL = process.env.DRAMAALERT_URL || 'https://openclaw-drama-alert.vercel.app';
const POLL_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes
const VIRAL_THRESHOLD = 70000; // 70k impressions

// Bird CLI path
const BIRD_CLI = '/opt/homebrew/bin/bird';

async function getSupabaseClient() {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        console.log('⚠️  Supabase not configured, using local storage only');
        return null;
    }

    const { createClient } = require('@supabase/supabase-js');
    return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
}

async function fetchTweetsWithBird() {
    try {
        const output = execSync(
            `${BIRD_CLI} list-timeline ${LIST_ID} --json --count 50`,
            { encoding: 'utf8', timeout: 60000 }
        );
        
        const tweets = JSON.parse(output);
        return tweets.map(t => ({
            id: t.id,
            author: t.author?.username || 'unknown',
            text: t.text,
            timestamp: new Date(t.createdAt).toISOString(),
            url: `https://twitter.com/${t.author?.username || 'unknown'}/status/${t.id}`,
            metrics: {
                likes: t.likeCount || 0,
                retweets: t.retweetCount || 0,
                replies: t.replyCount || 0,
                // Bird doesn't give impressions directly, estimate from engagement
                impressions: estimateImpressions(t)
            }
        }));
    } catch (error) {
        console.error('❌ Bird CLI error:', error.message);
        return null;
    }
}

function estimateImpressions(tweet) {
    // Estimate impressions based on engagement metrics
    // A rough heuristic: impressions ≈ (likes + retweets) × engagement_rate
    const engagement = (tweet.likeCount || 0) + (tweet.retweetCount || 0);
    // Most tweets have 10-50x impressions than likes, use 30x as baseline
    return engagement * 30 + 1000; // Base 1000 impressions
}

async function storeTweet(supabase, tweet) {
    const { error } = await supabase
        .from('tweets')
        .upsert({
            id: tweet.id,
            author: tweet.author,
            text: tweet.text,
            timestamp: tweet.timestamp,
            url: tweet.url,
            is_active: true
        }, { onConflict: 'id' });

    if (error) {
        console.error('Error storing tweet:', error.message);
        return false;
    }
    return true;
}

async function storeMetrics(supabase, tweetId, metrics) {
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
        return false;
    }
    return true;
}

async function checkViral(supabase, tweetId, metrics) {
    // Get previous metrics for velocity calculation
    const { data: prevMetrics } = await supabase
        .from('tweet_metrics')
        .select('*')
        .eq('tweet_id', tweetId)
        .order('captured_at', { ascending: false })
        .limit(2);

    const impressions = metrics.impressions || 0;
    let velocity = 0;

    // Calculate velocity (impressions per minute)
    if (prevMetrics && prevMetrics.length >= 2) {
        const current = prevMetrics[0];
        const previous = prevMetrics[1];
        const timeDiff = (new Date(current.captured_at) - new Date(previous.captured_at)) / 1000 / 60;
        const metricDiff = (current.impressions || 0) - (previous.impressions || 0);
        
        if (timeDiff > 0) {
            velocity = metricDiff / timeDiff;
        }
    }

    // Check viral conditions: impressions >= 70k
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
            console.log(`🚨 VIRAL: @${tweetId.substring(0, 8)}... - ${impressions.toLocaleString()} impressions`);
            return true;
        }
    }

    return false;
}

async function pushToDramaAlert(tweet) {
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
                metrics: tweet.metrics
            })
        });

        if (response.ok) {
            console.log(`✅ Pushed to DramaAlert: ${tweet.id.substring(0, 16)}...`);
        }
    } catch (error) {
        console.error('Error pushing to DramaAlert:', error.message);
    }
}

async function processTweets() {
    console.log(`\n[${new Date().toISOString()}] 🐦 Fetching tweets from list ${LIST_ID}...`);

    const tweets = await fetchTweetsWithBird();
    
    if (!tweets || tweets.length === 0) {
        console.log('No tweets retrieved from Bird CLI');
        return;
    }

    console.log(`Processing ${tweets.length} tweets...`);

    const supabase = await getSupabaseClient();

    for (const tweet of tweets) {
        // Store tweet and metrics
        if (supabase) {
            await storeTweet(supabase, tweet);
            await storeMetrics(supabase, tweet.id, tweet.metrics);

            // Check for virality
            const isViral = await checkViral(supabase, tweet.id, tweet.metrics);
            if (isViral) {
                await pushToDramaAlert(tweet);
            }
        }

        // Local backup
        const logPath = path.join(__dirname, '..', 'logs', 'tweets.json');
        const existingLogs = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, 'utf8')) : [];
        existingLogs.unshift({ ...tweet, captured_at: new Date().toISOString() });
        fs.writeFileSync(logPath, JSON.stringify(existingLogs.slice(0, 1000), null, 2));
    }

    console.log(`[${new Date().toISOString()}] ✅ Processed ${tweets.length} tweets`);
}

async function main() {
    console.log('🐦 Twitter List Viral Monitor (Bird CLI)');
    console.log(`List ID: ${LIST_ID}`);
    console.log(`Poll interval: ${POLL_INTERVAL_MS / 1000 / 60} minutes`);
    console.log(`Viral threshold: ${VIRAL_THRESHOLD.toLocaleString()} impressions`);
    console.log(`Bird CLI: ${BIRD_CLI}`);

    // Ensure logs directory exists
    const logsDir = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }

    // Verify Bird CLI works
    try {
        execSync(`${BIRD_CLI} --version`, { encoding: 'utf8' });
        console.log('✅ Bird CLI verified\n');
    } catch (e) {
        console.error('❌ Bird CLI not found:', e.message);
        process.exit(1);
    }

    // Initial fetch
    await processTweets();

    // Set up interval
    setInterval(processTweets, POLL_INTERVAL_MS);
}

main().catch(console.error);
