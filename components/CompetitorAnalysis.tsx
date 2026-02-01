"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Users, Eye, MessageSquare, Share2, Target, Zap } from "lucide-react";

interface Competitor {
  name: string;
  followers: number;
  growth: number;
  engagement: number;
  status: "up" | "down" | "stable";
  logo: string;
}

const COMPETITORS: Competitor[] = [
  { name: "xQc", followers: 9100000, growth: 2.4, engagement: 8.2, status: "up", logo: "🔴" },
  { name: "Ludwig", followers: 3100000, growth: 1.8, engagement: 12.5, status: "up", logo: "🟣" },
  { name: "Mizkif", followers: 2800000, growth: -0.3, engagement: 7.8, status: "down", logo: "🟠" },
  { name: "Trainwreckstv", followers: 2400000, growth: 5.2, engagement: 15.3, status: "up", logo: "🔵" },
  { name: "Pokimane", followers: 6200000, growth: 0.5, engagement: 6.2, status: "stable", logo: "💜" },
  { name: "HasanAbi", followers: 4200000, growth: -1.2, engagement: 9.1, status: "down", logo: "🟢" },
];

const METRICS = [
  { label: "Total Reach", value: "24.8M", change: "+5.2%", positive: true },
  { label: "Avg Views", value: "1.2M", change: "+12%", positive: true },
  { label: "Engagement", value: "8.4%", change: "-0.5%", positive: false },
  { label: "Shares", value: "45.2K", change: "+23%", positive: true },
];

export default function CompetitorAnalysis() {
  const [selectedMetric, setSelectedMetric] = useState<"followers" | "engagement" | "growth">("followers");

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
            <Target className="w-6 h-6 text-red-500" />
            Competitor Analysis
          </h2>
          <p className="text-white/60 text-sm">Streaming landscape monitoring</p>
        </div>
        
        <div className="flex gap-2">
          {(["followers", "engagement", "growth"] as const).map((metric) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`drama-button text-xs py-2 px-3 capitalize ${
                selectedMetric === metric ? "bg-red-600" : ""
              }`}
            >
              {metric}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {METRICS.map((metric) => (
          <div key={metric.label} className="drama-card p-4">
            <div className="text-white/60 text-sm mb-1">{metric.label}</div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold">{metric.value}</span>
              <span className={`text-sm mb-1 flex items-center gap-1 ${
                metric.positive ? "text-green-400" : "text-red-400"
              }`}>
                {metric.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Competitor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {COMPETITORS.map((competitor) => (
          <div key={competitor.name} className="drama-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{competitor.logo}</span>
                <div>
                  <div className="font-semibold">{competitor.name}</div>
                  <div className="text-xs text-white/60">@ {competitor.name.toLowerCase()}</div>
                </div>
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                competitor.status === "up" ? "text-green-400" :
                competitor.status === "down" ? "text-red-400" : "text-white/40"
              }`}>
                {competitor.status === "up" && <TrendingUp className="w-4 h-4" />}
                {competitor.status === "down" && <TrendingDown className="w-4 h-4" />}
                {competitor.status === "stable" && <span className="w-4 h-4 flex items-center justify-center">-</span>}
                <span>{competitor.growth > 0 ? "+" : ""}{competitor.growth}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-2 bg-white/5 rounded-lg">
                <Users className="w-4 h-4 mx-auto mb-1 text-white/40" />
                <div className="text-lg font-bold">{formatNumber(competitor.followers)}</div>
                <div className="text-xs text-white/40">Followers</div>
              </div>
              <div className="text-center p-2 bg-white/5 rounded-lg">
                <MessageSquare className="w-4 h-4 mx-auto mb-1 text-white/40" />
                <div className="text-lg font-bold">{competitor.engagement}%</div>
                <div className="text-xs text-white/40">Engagement</div>
              </div>
            </div>

            <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-purple-500"
                style={{ width: `${Math.min(100, (competitor.followers / 10000000) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* DramaAlert Stats */}
      <div className="drama-card p-6 bg-gradient-to-br from-red-900/30 to-purple-900/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center font-bold text-2xl text-white">
              DA
            </div>
            <div>
              <div className="text-2xl font-bold">@DramaAlert</div>
              <div className="text-white/60">Official Account</div>
            </div>
          </div>
          
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">2.1M</div>
              <div className="text-sm text-white/60">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">+3.2%</div>
              <div className="text-sm text-white/60">Growth</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">9.8%</div>
              <div className="text-sm text-white/60">Engagement</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
