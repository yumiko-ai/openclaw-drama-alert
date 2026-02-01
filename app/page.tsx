"use client";

import { useState } from "react";
import { ExternalLink, Layers, FileImage, Sparkles, Search, Rss, Twitter, ArrowRight } from "lucide-react";
import Link from "next/link";

const TOOLS = [
  { 
    label: "Tweet Media Generator", 
    href: "/generator", 
    icon: FileImage, 
    color: "from-red-500 to-red-700",
    description: "Create stunning thumbnails for your tweets",
    external: false
  },
  { 
    label: "Discovery", 
    href: "/dashboard", 
    icon: Sparkles, 
    color: "from-purple-500 to-purple-700",
    description: "AI-powered tweet creation & content ideas",
  },
  { 
    label: "Competitors", 
    href: "/dashboard", 
    icon: Search, 
    color: "from-blue-500 to-blue-700",
    description: "Track viral tweets from competitors",
  },
  { 
    label: "Feeds", 
    href: "/dashboard", 
    icon: Rss, 
    color: "from-green-500 to-green-700",
    description: "Live RSS & Twitter account monitoring",
  },
];

const FEATURES = [
  { title: "Real-time Alerts", desc: "Monitor breaking news across streaming", icon: "🚨" },
  { title: "Competitor Tracking", desc: "See what rivals are posting", icon: "👀" },
  { title: "Auto-Generation", desc: "AI creates content for you", icon: "🤖" },
  { title: "Live Feeds", desc: "RSS & Twitter in one place", icon: "📡" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2 mb-6">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          <span className="text-red-400 text-sm font-semibold">DRAMAALERT STUDIO</span>
        </div>
        
        <h1 className="text-6xl font-bold mb-4">
          All Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-500">Drama Alert</span> Tools
        </h1>
        <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
          Create viral thumbnails, track competitors, monitor feeds, and generate AI content — all in one dashboard.
        </p>

        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
        >
          Open Dashboard
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Tools Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Layers className="w-6 h-6 text-white/60" />
          Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <a
                key={tool.label}
                href={tool.href}
                target={tool.external ? "_blank" : "_self"}
                className="drama-card p-6 group hover:bg-white/10 transition-all"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${tool.color} mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-red-300 transition-colors">
                  {tool.label}
                </h3>
                <p className="text-white/60 text-sm">{tool.description}</p>
                {tool.external && (
                  <ExternalLink className="w-4 h-4 text-white/40 mt-3" />
                )}
              </a>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold mb-6">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="drama-card p-6 text-center">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-white/60 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-white/40 text-sm">
        <p>DramaAlert Studio • {new Date().toLocaleDateString()}</p>
      </footer>
    </div>
  );
}
