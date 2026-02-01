"use client";

import { Sparkles, Clock, Image, FileText, ExternalLink, ArrowRight, Download } from "lucide-react";
import Link from "next/link";

const QUICK_ACTIONS = [
  { 
    label: "Generate New", 
    href: "/generator", 
    icon: Sparkles, 
    color: "from-red-500 to-red-700",
    description: "Create a new DramaAlert thumbnail"
  },
  { 
    label: "AI Chat", 
    href: "/chat", 
    icon: FileText, 
    color: "from-purple-500 to-purple-700",
    description: "Get ideas from AI assistant"
  },
  { 
    label: "Open Generator", 
    href: "http://100.88.15.95:5050", 
    icon: ExternalLink, 
    color: "from-blue-500 to-blue-700",
    description: "Full web interface",
    external: true
  },
];

const RECENT_THUMBNAILS = [
  { name: "Alcaraz Made History", date: "Today", status: "completed" },
  { name: "Clavicular Crashed", date: "Today", status: "completed" },
  { name: "xQc Exposed", date: "Yesterday", status: "completed" },
];

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="live-dot"></div>
          <span className="text-red-400 text-sm font-semibold">DRAMAALERT STUDIO</span>
        </div>
        <h1 className="text-5xl font-bold mb-2">Create Impactful Thumbnails</h1>
        <p className="text-white/60 text-lg">Professional DramaAlert-style thumbnails with AI assistance</p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              target={action.external ? "_blank" : "_self"}
              className="drama-card p-6 group"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${action.color} mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-1 group-hover:text-red-300 transition-colors">
                {action.label}
              </h3>
              <p className="text-white/60 text-sm">
                {action.description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm">Go</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          );
        })}
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recent Thumbnails</h2>
          <Link href="/generator" className="text-red-400 hover:text-red-300 text-sm">
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RECENT_THUMBNAILS.map((thumb) => (
            <div key={thumb.name} className="drama-card p-4">
              <div className="aspect-video bg-white/5 rounded-lg mb-3 flex items-center justify-center">
                <Image className="w-12 h-12 text-white/20" />
              </div>
              <h4 className="font-semibold">{thumb.name}</h4>
              <div className="flex items-center justify-between mt-2">
                <span className="text-white/40 text-sm">{thumb.date}</span>
                <span className="text-green-400 text-sm flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {thumb.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="drama-card p-4 text-center">
          <div className="text-3xl font-bold text-red-500">24</div>
          <div className="text-white/60 text-sm">Thumbnails Created</div>
        </div>
        <div className="drama-card p-4 text-center">
          <div className="text-3xl font-bold text-green-500">3</div>
          <div className="text-white/60 text-sm">This Week</div>
        </div>
        <div className="drama-card p-4 text-center">
          <div className="text-3xl font-bold text-purple-500">5</div>
          <div className="text-white/60 text-sm">Templates</div>
        </div>
        <div className="drama-card p-4 text-center">
          <div className="text-3xl font-bold text-blue-500">100%</div>
          <div className="text-white/60 text-sm">Downloads</div>
        </div>
      </section>

      <section className="mt-8 drama-card p-6">
        <h2 className="text-xl font-bold mb-4">Popular Presets</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {["GOT EXPOSED", "IN DRAMA", "REACTS", "IS DONE", "GOT CLAPPED", "BREAKING"].map((preset) => (
            <Link
              key={preset}
              href={`/generator?action=${encodeURIComponent(preset)}`}
              className="drama-button text-center text-sm"
            >
              {preset}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
