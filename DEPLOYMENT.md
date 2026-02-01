# DramaAlert Studio - Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd openclaw-drama-alert
vercel
```

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository: `yumiko-ai/openclaw-drama-alert`
3. Configure settings (defaults are fine)
4. Click "Deploy"

## Environment Variables

Create a `.env.local` file with optional API keys:

```env
# OpenClaw AI API (for AI chat)
OPENCLAW_API_URL=http://100.88.15.95:3000

# Twitter API (optional - for real data)
TWITTER_BEARER_TOKEN=your_twitter_bearer_token

# Gemini API (optional - for AI images)
GEMINI_API_KEY=your_gemini_api_key
```

## Local Development

```bash
cd openclaw-drama-alert
npm install
npm run dev
```

Visit: http://localhost:3002

## Project Structure

```
openclaw-drama-alert/
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/
│   │   └── page.tsx          # Main dashboard
│   ├── generator/
│   │   └── page.tsx          # Thumbnail generator
│   ├── api/
│   │   ├── generate/         # Thumbnail generation API
│   │   ├── chat/             # AI chat API
│   │   └── upload/           # File upload API
│   └── globals.css           # Global styles
├── components/               # Reusable components
├── vercel.json              # Vercel config
└── package.json
```

## Features

- **Landing Page** (`/`) - Tool cards and feature overview
- **Dashboard** (`/dashboard`) - Alerts, tweets, feeds, AI chat
- **Generator** (`/generator`) - Thumbnail creator with live preview
- **AI Chat** - Content ideas and trend analysis

## API Endpoints

- `POST /api/generate` - Generate thumbnail from image URL
- `POST /api/chat` - AI chat for content ideas
- `POST /api/upload` - Upload reference images

## Deploy to OpenClaw Agents

To make this accessible from other OpenClaw agents:

1. The app runs on port 3002
2. Accessible at: `http://100.88.15.95:3002`
3. Add to your agent's tools configuration:

```json
{
  "drama_alert_studio": {
    "url": "http://100.88.15.95:3002",
    "description": "Thumbnail generator and Twitter dashboard"
  }
}
```

## Troubleshooting

### Build Fails
```bash
npm run build
```

### Sharp Installation Issues
```bash
npm rebuild sharp
```

### Port Already in Use
```bash
lsof -i :3002
kill -9 <PID>
```

## Production URL

Once deployed, your app will be available at:
`https://openclaw-drama-alert.vercel.app`

Or your custom domain if configured.
