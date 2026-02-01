"use client";

import { useState } from "react";
import { Sparkles, ExternalLink, Download, Calendar, Zap, MessageSquare } from "lucide-react";
import Link from "next/link";
import NewsTicker from "@/components/NewsTicker";
import CompetitorAnalysis from "@/components/CompetitorAnalysis";
import Analytics from "@/components/Analytics";
import FollowerTracker from "@/components/FollowerTracker";
import DocketTopics from "@/components/DocketTopics";

type Tab = "home" | "competitors" | "analytics" | "docket";

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
    icon: MessageSquare, 
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

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  return (
    <div className="max-w-7xl mx-auto">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { id: "home", label: "Home", icon: Zap },
          { id: "competitors", label: "Competitors", icon: Sparkles },
          { id: "analytics", label: "Analytics", icon: Calendar },
          { id: "docket", label: "Docket", icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`drama-button flex items-center gap-2 ${
                activeTab === tab.id ? "bg-red-600" : ""
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* News Ticker */}
      <NewsTicker />

      {/* Tab Content */}
      {activeTab === "home" && (
        <div className="space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="live-dot"></div>
              <span className="text-red-400 text-sm font-semibold">DRAMAALERT STUDIO</span>
            </div>
            <h1 className="text-5xl font-bold mb-2">Create Impactful Thumbnails</h1>
            <p className="text-white/60 text-lg">Professional DramaAlert-style thumbnails with AI assistance</p>
          </div>

          {/* Quick Actions */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <p className="text-white/60 text-sm">{action.description}</p>
                </Link>
              );
            })}
          </section>

          {/* Follower Tracker */}
          <section>
            <FollowerTracker />
          </section>

          {/* Stats Grid */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="drama-card p-4 text-center">
              <div className="text-3xl font-bold text-red-500">2.1M</div>
              <div className="text-white/60 text-sm">Followers</div>
            </div>
            <div className="drama-card p-4 text-center">
              <div className="text-3xl font-bold text-green-500">+3.2%</div>
              <div className="text-white/60 text-sm">Growth</div>
            </div>
            <div className="drama-card p-4 text-center">
              <div className="text-3xl font-bold text-purple-500">1.4M</div>
              <div className="text-white/60 text-sm">Weekly Views</div>
            </div>
            <div className="drama-card p-4 text-center">
              <div className="text-3xl font-bold text-blue-500">9.8%</div>
              <div className="text-white/60 text-sm">Engagement</div>
            </div>
          </section>
        </div>
      )}

      {activeTab === "competitors" && <CompetitorAnalysis />}

      {activeTab === "analytics" && <Analytics />}

      {activeTab === "docket" && <DocketTopics />}

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-white/10 text-center text-white/40 text-sm">
        <p>DramaAlert Studio • Connected to live feeds • Last updated: {new Date().toLocaleTimeString()}</p>
      </footer>
    </div>
  );
}
