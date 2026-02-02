# DramaAlert Studio - Project Guidelines

## Overview

A professionally built, password-protected DramaAlert dashboard with authenticated APIs for agent integration. Built with Next.js, Vercel, and Supabase.

**Repository:** `yumiko-ai/openclaw-drama-alert`
**Live URL:** `https://openclaw-drama-alert.vercel.app`

---

## Project Structure

```
openclaw-drama-alert/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── login/
│   │   └── page.tsx                # Password login
│   ├── dashboard/
│   │   └── page.tsx                # Main dashboard (protected)
│   ├── generator/
│   │   └── page.tsx                # Thumbnail generator (protected)
│   ├── api/
│   │   ├── auth/
│   │   │   └── route.ts            # Login/validate endpoint
│   │   ├── generate/
│   │   │   └── route.ts            # Thumbnail generation (auth required)
│   │   ├── chat/
│   │   │   └── route.ts            # AI chat (auth required)
│   │   └── webhooks/
│   │       └── route.ts            # Agent webhook endpoints
│   ├── components/
│   │   ├── AuthGuard.tsx           # Route protection HOC
│   │   ├── Dashboard.tsx           # Main dashboard component
│   │   └── ThumbnailGenerator.tsx  # Generator component
│   └── globals.css                 # Tailwind styles
├── lib/
│   ├── supabase.ts                 # Supabase client
│   ├── auth.ts                     # Auth utilities
│   └── api.ts                      # API helpers
├── supabase/
│   ├── schema.sql                  # Database schema
│   └── seed.sql                    # Seed data
├── skills/
│   └── drama-alert/                # OpenClaw skill for APIs
│       ├── SKILL.md                # Skill documentation
│       └── config.json             # Skill config
├── .env.local                      # Environment variables (local)
├── vercel.json                     # Vercel configuration
├── next.config.ts                  # Next.js configuration
└── package.json
```

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 14 (App Router), React, Tailwind CSS |
| Backend | Next.js API Routes (Edge/Node) |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth (password-based) |
| Deployment | Vercel |
| Version Control | Git, GitHub |
| Image Processing | Sharp |
| Agent Integration | Webhook APIs |

---

## Environment Variables

Create `.env.local` in project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Secrets (use strong random values)
APP_PASSWORD=your-secure-password-here
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# API Keys (optional)
OPENCLAW_API_URL=http://100.88.15.95:3000
GEMINI_API_KEY=your-gemini-key
```

---

## Database Schema (Supabase)

### Run in Supabase SQL Editor:

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for future user auth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Thumbnail presets
CREATE TABLE presets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',
    is_default BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat history
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public presets are viewable by everyone" ON presets
    FOR SELECT USING (is_default = true);

CREATE POLICY "Authenticated users can manage their own data" ON presets
    FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can create generations" ON generations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own chat history" ON chat_messages
    FOR SELECT USING (auth.uid() = user_id);
```

### Seed default presets:

```sql
INSERT INTO presets (name, config, is_default) VALUES
    ('Standard', '{"nameSize": 55, "actionSize": 110, "subtextSize": 22, "padding": 55}', true),
    ('Compact', '{"nameSize": 40, "actionSize": 80, "subtextSize": 18, "padding": 40}', false),
    ('Large', '{"nameSize": 70, "actionSize": 130, "subtextSize": 26, "padding": 70}', false);
```

---

## Authentication Flow

### Password-Based Login
1. User enters password on `/login` page
2. Server validates against `APP_PASSWORD` env var
3. On success, set encrypted cookie with JWT token
4. Redirect to `/dashboard`

### Protected Routes
All `/dashboard/*` and `/generator/*` routes use `AuthGuard` component:
- Check for valid JWT cookie
- Redirect to `/login` if invalid
- Refresh token if expired (optional)

### API Authentication
All `/api/*` endpoints (except `/api/auth/login`) require:
- `Authorization: Bearer <token>` header
- Valid JWT token verification

---

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with password |

**Request:**
```json
{
  "password": "your-password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 86400
}
```

### Protected Endpoints (Require Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate` | Generate thumbnail |
| POST | `/api/chat` | AI chat endpoint |
| GET/POST | `/api/presets` | List/Create presets |
| GET/POST | `/api/generations` | List/Save generations |
| GET/POST | `/api/webhooks/agent` | Agent webhook endpoint |

#### POST /api/generate

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "image_url": "https://example.com/image.jpg",
  "name": "XQC",
  "action": "GOT EXPOSED",
  "subtext": "EXCLUSIVE BREAKING NEWS",
  "name_size": 55,
  "action_size": 110,
  "subtext_size": 22,
  "padding": 55
}
```

**Response:**
```json
{
  "success": true,
  "url": "data:image/png;base64,...",
  "filename": "drama_abc123.png"
}
```

#### POST /api/webhooks/agent

Agent can push data to this endpoint for dashboard updates.

**Headers:**
```
Authorization: Bearer <agent-token>
Content-Type: application/json
```

**Request:**
```json
{
  "type": "alert",
  "data": {
    "title": "Breaking News",
    "description": "Something happened",
    "priority": "high"
  }
}
```

---

## Git Workflow

### Branches
- `main` - Production branch (protected)
- `develop` - Development branch
- `feature/*` - Feature branches

### Commands
```bash
# Create feature branch
git checkout -b feature/new-dashboard

# Make changes
git add .
git commit -m "Add new dashboard feature"

# Push to GitHub
git push origin feature/new-dashboard

# Create Pull Request on GitHub
# Merge to develop after review
# Deploy from main branch
```

### Vercel Deployment
1. Connect GitHub repo in Vercel dashboard
2. Vercel auto-deploys on push to `main`
3. Environment variables set in Vercel project settings

---

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm run test
```

---

## Progress Tracker

### Phase 1: Foundation
- [x] Set up Next.js project
- [x] Configure Tailwind CSS
- [x] Install Supabase client
- [x] Set up lib utilities (supabase, auth, api)
- [x] Set up Git repository

### Phase 2: Authentication
- [x] Create login page (`/login`)
- [x] Implement JWT auth (`lib/auth.ts`)
- [x] Add AuthGuard component
- [x] Protect dashboard routes
- [x] Create auth API routes (`/api/auth/*`)

### Phase 3: Dashboard
- [x] Build dashboard page (`/dashboard`)
- [x] Build generator page (`/generator`)
- [x] Implement generation API (`/api/generate`)
- [x] Add preset management (`/api/presets`)
- [x] Integrate AI chat (`/api/chat`, generator UI)

### Phase 4: Agent Integration
- [x] Create webhook endpoints (`/api/webhooks/agent`)
- [x] Write agent documentation (`skills/drama-alert/SKILL.md`)
- [x] Create skill config (`skills/drama-alert/config.json`)
- [x] Add generations history (`/api/generations`)

### Phase 5: Polish & Deploy
- [x] Add error handling
- [x] Set up CORS headers
- [ ] Configure Vercel env vars
- [ ] Deploy to production
- [ ] Set up monitoring

---

## Files Created

| File | Purpose |
|------|---------|
| `lib/supabase.ts` | Supabase client |
| `lib/auth.ts` | JWT authentication utilities |
| `lib/api.ts` | API helpers and middleware |
| `app/login/page.tsx` | Password login page |
| `app/api/auth/route.ts` | Login endpoint |
| `app/api/auth/check/route.ts` | Auth check endpoint |
| `app/api/auth/logout/route.ts` | Logout endpoint |
| `components/AuthGuard.tsx` | Route protection component |
| `app/dashboard/page.tsx` | Protected dashboard page |
| `app/dashboard/DashboardClient.tsx` | Dashboard UI |
| `app/generator/page.tsx` | Protected generator page |
| `app/generator/GeneratorClient.tsx` | Generator UI with AI Chat |
| `app/api/generate/route.ts` | Thumbnail generation API |
| `app/api/webhooks/agent/route.ts` | Agent webhook endpoint |
| `app/api/presets/route.ts` | Preset CRUD API |
| `app/api/chat/route.ts` | AI chat API |
| `app/api/generations/route.ts` | Generation history API |
| `skills/drama-alert/SKILL.md` | Agent skill documentation |
| `skills/drama-alert/config.json` | Skill configuration |
| `supabase/schema.sql` | Database schema |

---

## Notes

### Password Security
- Use strong password (min 16 chars, mixed case, numbers, symbols)
- Store in environment variable only
- Consider hashing for future user auth expansion

### API Security
- All APIs require JWT verification
- Rate limiting on auth endpoints
- Input validation on all endpoints
- CORS properly configured

### Agent Integration
- Use Supabase webhooks or API routes for agent communication
- Store agent tokens in Supabase secrets table
- Log all agent interactions for debugging

---

## Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [OpenClaw Skills](https://docs.openclaw.ai/skills)

---

## Last Updated
2026-02-01
