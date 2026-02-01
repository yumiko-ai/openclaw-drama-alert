"use client";

import { useState, useEffect } from "react";
import { ExternalLink, TrendingUp, TrendingDown, Minus, Twitter, Heart, MessageCircle, Repeat, Share, Eye, Users, Activity, Image, MessageSquare, Sparkles } from "lucide-react";
import Link from "next/link";
import TwitterDashboard from "@/components/TwitterDashboard";

type Tab = "twitter" | "generator" | "chat";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("twitter");

  return (
    <div className="max-w-7xl mx-auto">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { id: "twitter", label: "Twitter/X", icon: Twitter },
          { id: "generator", label: "Generator", icon: Image },
          { id: "chat", label: "AI Chat", icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`drama-button flex items-center gap-2 ${
                activeTab === tab.id ? "bg-blue-600" : ""
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "twitter" && <TwitterDashboard />}
      
      {activeTab === "generator" && (
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold drama-title">Thumbnail Generator</h1>
              <p className="text-white/60">Create professional DramaAlert-style thumbnails</p>
            </div>
            <a
              href="http://100.88.15.95:5050"
              target="_blank"
              rel="noopener noreferrer"
              className="drama-button flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open Web Generator
            </a>
          </div>
          {/* Generator content would go here - using link to full generator for now */}
          <div className="drama-card p-12 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2">Full Generator</h2>
            <p className="text-white/60 mb-4">Open the full thumbnail generator with all features</p>
            <a
              href="http://100.88.15.95:5050"
              target="_blank"
              rel="noopener noreferrer"
              className="drama-button inline-flex items-center gap-2"
            >
              Open Generator
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {activeTab === "chat" && (
        <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col">
          <div className="drama-card p-4 mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              AI Chat Assistant
            </h2>
            <p className="text-white/60 text-sm">Get thumbnail ideas and content suggestions</p>
          </div>
          {/* Chat content - redirecting for now */}
          <div className="drama-card p-12 text-center flex-1 flex flex-col items-center justify-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-purple-500" />
            <h2 className="text-2xl font-bold mb-2">AI Chat</h2>
            <p className="text-white/60">Chat with AI for thumbnail ideas and content suggestions</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-white/10 text-center text-white/40 text-sm">
        <p>DramaAlert Studio • @DramaAlert Twitter Dashboard • {new Date().toLocaleDateString()}</p>
      </footer>
    </div>
  );
}
