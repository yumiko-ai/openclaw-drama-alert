# DramaAlert Studio

A specialized dashboard for creating professional DramaAlert-style thumbnails with AI assistance.

![DramaAlert Studio](https://via.placeholder.com/800x400/1a1a2e/ff0000?text=DramaAlert+Studio)

## Features

- 🎨 **Thumbnail Generator** - Quick preset-based thumbnail creation
- 🤖 **AI Chat Assistant** - Get ideas and suggestions from AI
- 📁 **Reference Image Upload** - Use images as inspiration
- 🔗 **Direct Generator Access** - Opens the full web generator
- 📊 **Recent Thumbnails** - Track your creation history
- ⚡ **Quick Presets** - One-click access to popular styles

## Quick Presets

- GOT EXPOSED
- IN DRAMA
- REACTS
- IS DONE
- GOT CLAPPED
- BREAKING NEWS

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yumiko-ai/openclaw-drama-alert.git
cd openclaw-drama-alert

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

## Project Structure

```
openclaw-drama-alert/
├── app/
│   ├── api/
│   │   ├── chat/         # AI chat endpoint
│   │   └── upload/       # File upload endpoint
│   ├── chat/             # AI chat page
│   ├── generator/        # Thumbnail generator page
│   ├── globals.css       # Global styles + drama effects
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable components
│   └── NavBar.tsx        # Glass navigation bar
└── public/               # Static assets
```

## Connecting to DramaAlert Server

The dashboard connects to your DramaAlert generator at:
- **Web Generator:** http://100.88.15.95:5050
- **API:** Configurable via environment

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Related Projects

- [OpenClaw Home](https://github.com/yumiko-ai/openclaw-home) - Main dashboard
- [DramaAlert Generator](https://github.com/yumiko-ai/drama-alert-generator) - Core generator

## License

MIT License

## Author

[Yumiko AI](https://github.com/yumiko-ai)
