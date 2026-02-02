# Twitter List Viral Monitor

This module monitors a Twitter list for viral tweets and pushes them to the DramaAlert dashboard.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Bird CLI    │────▶│ Monitor     │────▶│ Supabase    │
│ (List Pull) │     │ (Metrics)   │     │ (Storage)   │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ DramaAlert  │
                    │ Dashboard   │
                    └─────────────┘
```

## Setup

### 1. Supabase Schema

Run the SQL in `supabase/schema.sql` in your Supabase SQL Editor to create the required tables:
- `tweets` - Stores tweet data
- `tweet_metrics` - Tracks metrics over time
- `viral_queue` - Queue for detected viral tweets

### 2. Environment Variables

Add these to your `.env.local`:

```env
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Twitter API
TWITTER_BEARER_TOKEN=your-bearer-token
TWITTER_LIST_ID=1667713130078642178

# DramaAlert
DRAMAALERT_URL=https://openclaw-drama-alert.vercel.app
```

### 3. Install Dependencies

The monitoring scripts use `@supabase/supabase-js` which is already in package.json.

## Usage

### Start Monitoring

```bash
# Monitor list for new tweets (every 2 minutes)
npm run monitor:list

# Track metrics of active tweets (every 10 minutes)
npm run monitor:metrics

# Run both in background
npm run monitor:start
```

### Stop Monitoring

```bash
npm run monitor:stop
```

## How It Works

### 1. Tweet Collection (`monitor-list.js`)

- Fetches tweets from the configured Twitter List every 2 minutes
- Supports both Twitter API v2 and Bird CLI
- Stores tweets in Supabase `tweets` table
- Creates a local backup in `logs/tweets.json`

### 2. Metrics Tracking (`track-metrics.js`)

- Tracks metrics (likes, retweets, replies, impressions) every 10 minutes
- Continues tracking for 12 hours per tweet
- Calculates velocity (impressions per minute)
- Detects velocity spikes (150% increase threshold)

### 3. Viral Detection

A tweet is considered viral when:
- **Impressions ≥ 70,000** OR
- **Velocity spike detected** (150%+ increase in engagement rate)

When viral, the tweet is automatically:
1. Added to `viral_queue` table with status `pending`
2. An alert is created in the `alerts` table
3. Pushed to the DramaAlert dashboard

## Dashboard Integration

The `/dashboard` page includes a **Viral Tweet Queue** section with:

- **Queue Display**: Shows pending/pushed/dismissed viral tweets
- **Push to Live**: Mark pending tweets as pushed
- **Clear Queue**: Remove all pending tweets
- **Individual Actions**:
  - ✓ Push to live
  - ✗ Dismiss
  - 🗑 Delete

## API Endpoints

### GET `/api/viral`

Get viral queue items.

Query params:
- `status` - Filter by status: `pending`, `pushed`, or `dismissed`

### POST `/api/viral`

Perform actions on the viral queue.

Body params:
- `action` - One of:
  - `push` - Add new tweet to queue
  - `update_status` - Update status of queue item
  - `clear_queue` - Clear all pending items
  - `push_to_live` - Push all pending to live
  - `dismiss` - Dismiss a single item
  - `delete` - Delete a queue item

## Monitoring Process

### Continuous Operation

For persistent monitoring, run with a process manager:

```bash
# Using pm2
pm2 start scripts/monitor-list.js --name "twitter-monitor-list"
pm2 start scripts/track-metrics.js --name "twitter-metrics-tracker"

# View logs
pm2 logs twitter-monitor-list
pm2 logs twitter-metrics-tracker

# Restart on changes
pm2 restart all
```

### Docker (Optional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN mkdir -p logs
CMD ["sh", "-c", "npm run monitor:list & npm run monitor:metrics"]
```

## Troubleshooting

### No tweets being fetched
- Check `TWITTER_BEARER_TOKEN` is valid
- Verify `TWITTER_LIST_ID` exists and is accessible
- Check Bird CLI path if using CLI mode

### No virality detection
- Ensure metrics are being captured (check `tweet_metrics` table)
- Verify thresholds: 70k impressions or 1.5x velocity spike
- Check that Supabase is configured correctly

### Dashboard not updating
- Verify `DRAMAALERT_URL` is correct
- Check Supabase connection in API routes
- Ensure RLS policies allow reads/writes

## Performance Notes

- Each poll fetches up to 100 tweets
- Metrics tracking runs in parallel
- Old tweets (>12h) are auto-deactivated
- Local JSON backup prevents data loss on Supabase issues
