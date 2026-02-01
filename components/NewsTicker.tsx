"use client";

import { useState, useEffect } from "react";
import { ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface NewsItem {
  title: string;
  link: string;
  source: string;
  time: string;
  category: string;
}

const RSS_FEEDS = [
  { name: "Twitter/X", url: "https://nitter.net/DramaAlert", category: "Social" },
  { name: "Twitch", url: "https://twitch.tv/dramaalert", category: "Streaming" },
  { name: "YouTube", url: "https://youtube.com/@DramaAlert", category: "Video" },
];

const MOCK_NEWS: NewsItem[] = [
  { title: "xQc streams for 14 hours straight, breaks own record", link: "https://twitter.com", source: "Twitter/X", time: "2m ago", category: "Stream" },
  { title: "Ludwig announces new tournament series", link: "https://youtube.com", source: "YouTube", time: "15m ago", category: "Event" },
  { title: "Trainwreckstv podcast hits 1M views", link: "https://twitter.com", source: "Twitter/X", time: "32m ago", category: "Content" },
  { title: "Mizkif reveals new studio location", link: "https://twitch.tv", source: "Twitch", time: "1h ago", category: "Update" },
  { title: "Apex legends pro accused of cheating", link: "https://twitter.com", source: "Twitter/X", time: "2h ago", category: "Drama" },
  { title: "Pokimane announces break from streaming", link: "https://instagram.com", source: "Instagram", time: "3h ago", category: "News" },
];

export default function NewsTicker() {
  const [news, setNews] = useState<NewsItem[]>(MOCK_NEWS);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // In production, fetch from actual RSS feeds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [news.length]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Stream: "text-red-400",
      Event: "text-purple-400",
      Content: "text-blue-400",
      Update: "text-yellow-400",
      Drama: "text-orange-400",
      News: "text-green-400",
    };
    return colors[category] || "text-white/60";
  };

  return (
    <div className="drama-card mb-6 overflow-hidden">
      <div className="flex items-center">
        <div className="bg-red-600 px-4 py-2 flex items-center gap-2">
          <span className="live-dot"></span>
          <span className="text-sm font-bold">LIVE FEED</span>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-6 px-4 py-3 animate-marquee whitespace-nowrap">
            {news.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className={`text-xs font-semibold ${getCategoryColor(item.category)}`}>
                  {item.category}
                </span>
                <span className="text-sm text-white/80">{item.title}</span>
                <span className="text-xs text-white/40">• {item.source}</span>
                <span className="text-xs text-white/40">{item.time}</span>
              </div>
            ))}
            {news.map((item, idx) => (
              <div key={`dup-${idx}`} className="flex items-center gap-3">
                <span className={`text-xs font-semibold ${getCategoryColor(item.category)}`}>
                  {item.category}
                </span>
                <span className="text-sm text-white/80">{item.title}</span>
                <span className="text-xs text-white/40">• {item.source}</span>
                <span className="text-xs text-white/40">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-2 border-l border-white/10">
          <a 
            href="https://twitter.com/DramaAlert" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white text-sm flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            Follow
          </a>
        </div>
      </div>
    </div>
  );
}
