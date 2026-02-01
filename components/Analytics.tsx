"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, Eye, Clock, Play, ThumbsUp, Share2, Calendar } from "lucide-react";

const ANALYTICS_DATA: { views: { date: string; views: number }[]; topVideos: { title: string; views: string; thumbnail: string }[]; hourlyActivity: { hour: string; views: number }[] } = {
  views: [
    { date: "Mon", views: 120000 },
    { date: "Tue", views: 150000 },
    { date: "Wed", views: 180000 },
    { date: "Thu", views: 140000 },
    { date: "Fri", views: 220000 },
    { date: "Sat", views: 280000 },
    { date: "Sun", views: 310000 },
  ],
  topVideos: [
    { title: "xQc EXPOSED for cheating", views: "2.3M", thumbnail: "🔴" },
    { title: "Trainwreckstv SCANDAL", views: "1.8M", thumbnail: "🔵" },
    { title: "Ludwig reacts to drama", views: "1.2M", thumbnail: "🟣" },
    { title: "Mizkif in 4K moment", views: "980K", thumbnail: "🟠" },
  ],
  hourlyActivity: [
    { hour: "6AM", views: 12000 },
    { hour: "9AM", views: 45000 },
    { hour: "12PM", views: 89000 },
    { hour: "3PM", views: 156000 },
    { hour: "6PM", views: 234000 },
    { hour: "9PM", views: 312000 },
    { hour: "12AM", views: 198000 },
  ],
};

const TIMEFRAMES = ["7D", "30D", "90D", "1Y"];

export default function Analytics() {
  const [timeframe, setTimeframe] = useState("7D");
  const [selectedMetric, setSelectedMetric] = useState<"views" | "engagement" | "subscribers">("views");

  const maxViews = Math.max(...ANALYTICS_DATA.views.map(d => d.views));
  const maxHourly = Math.max(...ANALYTICS_DATA.hourlyActivity.map(d => d.views));

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(0) + "K";
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-500" />
            Analytics Dashboard
          </h2>
          <p className="text-white/60 text-sm">Performance metrics & insights</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`drama-button text-xs py-2 px-3 ${
                  timeframe === tf ? "bg-purple-600" : ""
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="drama-card p-4">
          <div className="flex items-center gap-2 text-white/60 mb-2">
            <Eye className="w-4 h-4" />
            <span className="text-sm">Total Views</span>
          </div>
          <div className="text-3xl font-bold">1.4M</div>
          <div className="flex items-center gap-1 text-green-400 text-sm mt-1">
            <TrendingUp className="w-3 h-3" />
            +18.2% vs last period
          </div>
        </div>

        <div className="drama-card p-4">
          <div className="flex items-center gap-2 text-white/60 mb-2">
            <Play className="w-4 h-4" />
            <span className="text-sm">Watch Time</span>
          </div>
          <div className="text-3xl font-bold">89.2K</div>
          <div className="flex items-center gap-1 text-green-400 text-sm mt-1">
            <TrendingUp className="w-3 h-3" />
            +12.5% vs last period
          </div>
        </div>

        <div className="drama-card p-4">
          <div className="flex items-center gap-2 text-white/60 mb-2">
            <ThumbsUp className="w-4 h-4" />
            <span className="text-sm">Engagement</span>
          </div>
          <div className="text-3xl font-bold">9.8%</div>
          <div className="flex items-center gap-1 text-red-400 text-sm mt-1">
            <TrendingUp className="w-3 h-3 rotate-180" />
            -0.5% vs last period
          </div>
        </div>

        <div className="drama-card p-4">
          <div className="flex items-center gap-2 text-white/60 mb-2">
            <Share2 className="w-4 h-4" />
            <span className="text-sm">Shares</span>
          </div>
          <div className="text-3xl font-bold">45.2K</div>
          <div className="flex items-center gap-1 text-green-400 text-sm mt-1">
            <TrendingUp className="w-3 h-3" />
            +23.1% vs last period
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Views Chart */}
        <div className="drama-card p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Views</h3>
          <div className="flex items-end justify-between gap-2 h-48">
            {ANALYTICS_DATA.views.map((day, idx) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-xs text-white/60 w-full text-center">
                  {formatNumber(day.views)}
                </div>
                <div 
                  className="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-lg transition-all duration-300 hover:from-red-500 hover:to-red-300"
                  style={{ height: `${(day.views / maxViews) * 100}%` }}
                />
                <div className="text-xs text-white/60">{day.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Activity */}
        <div className="drama-card p-6">
          <h3 className="text-lg font-semibold mb-4">Hourly Activity</h3>
          <div className="flex items-end justify-between gap-1 h-48">
            {ANALYTICS_DATA.hourlyActivity.map((hour) => (
              <div key={hour.hour} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-[10px] text-white/60">{formatNumber(hour.views)}</div>
                <div 
                  className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg"
                  style={{ height: `${(hour.views / maxHourly) * 100}%` }}
                />
                <div className="text-[10px] text-white/60">{hour.hour}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Videos */}
      <div className="drama-card p-6">
        <h3 className="text-lg font-semibold mb-4">Top Performing Content</h3>
        <div className="space-y-3">
          {ANALYTICS_DATA.topVideos.map((video, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <div className="text-2xl">{video.thumbnail}</div>
              <div className="flex-1">
                <div className="font-semibold">{video.title}</div>
                <div className="text-sm text-white/60">Posted 2 days ago</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-red-400">{video.views}</div>
                <div className="text-xs text-white/60">views</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
