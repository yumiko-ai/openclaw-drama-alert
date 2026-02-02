# DramaAlert Skill

Agent skill for interacting with DramaAlert Studio dashboard and thumbnail generation.

## Overview

DramaAlert Studio is a password-protected dashboard for generating YouTube-style thumbnail images and managing content alerts. Agents can push webhook data to update the dashboard and trigger thumbnail generation.

**Base URL:** `https://openclaw-drama-alert.vercel.app`
**Authentication:** Bearer token via environment variable

---

## Configuration

### Environment Variables

```json
{
  "DRAMA_ALERT_URL": "https://openclaw-drama-alert.vercel.app",
  "DRAMA_ALERT_TOKEN": "your-agent-token-here"
}
```

### Skill Configuration (clawdhub.json)

```json
{
  "name": "drama-alert",
  "version": "1.0.0",
  "description": "Generate thumbnails and push alerts to DramaAlert dashboard",
  "author": "Yumiko",
  "capabilities": [
    "thumbnail_generation",
    "webhook_push"
  ],
  "env": [
    {
      "name": "DRAMA_ALERT_URL",
      "required": true,
      "description": "Base URL of DramaAlert Studio"
    },
    {
      "name": "DRAMA_ALERT_TOKEN",
      "required": true,
      "description": "Agent authentication token"
    }
  ]
}
```

---

## Capabilities

### 1. Thumbnail Generation

Generate YouTube-style drama alert thumbnails.

**Endpoint:** `POST /api/generate`

**Input Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `image_url` | string | Yes | URL of source image |
| `name` | string | Yes | Name/person (white text) |
| `action` | string | Yes | Action phrase (red text) |
| `subtext` | string | No | Subtext (default: "EXCLUSIVE BREAKING NEWS") |
| `name_size` | number | No | Font size for name (default: 55) |
| `action_size` | number | No | Font size for action (default: 110) |
| `subtext_size` | number | No | Font size for subtext (default: 22) |
| `padding` | number | No | Bottom padding (default: 55) |

**Example:**

```typescript
// Generate a drama thumbnail
const result = await agent.skills.dramaAlert.generateThumbnail({
  image_url: "https://example.com/streamer-face.jpg",
  name: "XQC",
  action: "GOT EXPOSED",
  subtext: "BREAKING NEWS",
  action_size: 120,
  padding: 60
});

// Returns: { success: true, url: "data:image/png;base64,...", filename: "drama_abc.png"}
```

---

### 2. Push Alert to Dashboard

Push breaking news or alerts to the dashboard for display.

**Endpoint:** `POST /api/webhooks/agent`

**Input Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | Alert type: "alert", "news", "trend" |
| `data.title` | string | Yes | Alert title |
| `data.description` | string | No | Alert description |
| `data.priority` | string | No | "low", "medium", "high" |
| `data.image_url` | string | Thumbnail URL |

**Example:**

```typescript
// Push breaking news alert
await agent.skills.dramaAlert.pushAlert({
  type: "alert",
  data: {
    title: "Major Streamer Drama",
    description: "XQC just got exposed for cheating",
    priority: "high",
    image_url: "https://example.com/screenshot.jpg"
  }
});
```

---

### 3. List Presets

Get available thumbnail presets.

**Endpoint:** `GET /api/presets`

**Example:**

```typescript
const presets = await agent.skills.dramaAlert.listPresets();
// Returns: [{ id: "uuid", name: "Standard", config: {...}, isDefault: true }]
```

---

### 4. Get Generation History

Retrieve past thumbnail generations.

**Endpoint:** `GET /api/generations`

**Example:**

```typescript
const history = await agent.skills.dramaAlert.getHistory();
// Returns: [{ id, name, action, subtext, imageUrl, generatedUrl, createdAt }]
```

---

## Error Handling

All methods throw on failure:

```typescript
try {
  await agent.skills.dramaAlert.generateThumbnail({...});
} catch (error) {
  if (error.code === 'AUTH_FAILED') {
    // Token expired or invalid
    await agent.skills.dramaAlert.refreshToken();
  } else if (error.code === 'INVALID_IMAGE') {
    // Image URL not accessible
  } else {
    // Generic error
  }
}
```

**Error Codes:**

| Code | Description |
|------|-------------|
| `AUTH_FAILED` | Invalid or expired token |
| `INVALID_IMAGE` | Image URL inaccessible or invalid |
| `RATE_LIMITED` | Too many requests |
| `QUOTA_EXCEEDED` | Monthly generation limit reached |
| `SERVER_ERROR` | Internal server error |

---

## Authentication

Agents authenticate using a Bearer token in the `Authorization` header:

```
Authorization: Bearer <DRAMA_ALERT_TOKEN>
```

Tokens are managed via Supabase and can be rotated without downtime.

---

## Usage Examples

### Content Alert Workflow

```typescript
// Agent detects drama on Twitch
const drama = await agent.skills.monitor.checkTwitchDrama("xqc");

if (drama.isDrama) {
  // Generate thumbnail
  const thumbnail = await agent.skills.dramaAlert.generateThumbnail({
    image_url: drama.screenshotUrl,
    name: drama.streamerName,
    action: "GOT EXPOSED",
    subtext: "BREAKING DRAMA",
    action_size: Math.min(drama.intensity * 10, 150)
  });

  // Push to dashboard
  await agent.skills.dramaAlert.pushAlert({
    type: "alert",
    data: {
      title: `${drama.streamerName} Drama Detected`,
      description: drama.summary,
      priority: drama.intensity > 80 ? "high" : "medium",
      image_url: thumbnail.url
    }
  });

  console.log(`Alert pushed: ${drama.streamerName}`);
}
```

### Batch Generation

```typescript
const streamers = ["xqc", " HasanAbi", "Trainwreckstv"];

for (const streamer of streamers) {
  const thumbnail = await agent.skills.dramaAlert.generateThumbnail({
    image_url: `https://example.com/${streamer}.jpg`,
    name: streamer.toUpperCase(),
    action: "CRASHED OUT",
    subtext: "LIVE NOW"
  });
  
  await agent.skills.dramaAlert.saveGeneration({
    name: streamer,
    action: "CRASHED OUT",
    subtext: "LIVE NOW",
    generatedUrl: thumbnail.url
  });
}
```

---

## Rate Limits

- **Generation:** 100 requests/hour per agent
- **Webhooks:** 500 requests/hour per agent
- **History queries:** 1000 requests/hour

Contact Oli to increase limits for high-volume agents.

---

## Changelog

### v1.0.0 (2026-02-01)
- Initial release
- Thumbnail generation API
- Webhook push capability
- Preset management
- Generation history

---

## Support

- **Issues:** Report via OpenClaw GitHub issues
- **Docs:** See `PROJECT.md` in repo
- **Dashboard:** https://openclaw-drama-alert.vercel.app
