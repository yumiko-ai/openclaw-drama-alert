"use client";

import { useState, useEffect } from "react";
import { Users, TrendingUp, TrendingDown, Activity, Bell, Calendar, Target } from "lucide-react";

interface FollowerMetric {
  date: string;
  followers: number;
}

const MOCK_FOLLOWER_DATA: FollowerMetric[] = [
  { date: "Jan 1", followers: 1850000 },
  { date: "Jan 8", followers: 1890000 },
  { date: "Jan 15", followers: 1920000 },
  { date: "Jan 22", followers: 1980000 },
  { date: "Jan 29", followers: 2020000 },
  { date: "Feb 1", followers: 2100000 },
];

const ACHIEVEMENTS = [
  { name: "2 Million Followers", date: "Jan 28, 2026", icon: "🎉", achieved: true },
  { name: "100M Total Views", date: "Target: Feb 2026", icon: "👁️", achieved: false },
  { name: "10K Live Viewers", date: "Target: Mar 2026", icon: "🔴", achieved: false },
  { name: "1B Views Monthly", date: "Target: Q2 2026", icon: "🚀", achieved: false },
];

const RECENT_MILESTONES = [
  { event: "New video: xQc EXPOSED", delta: "+12K", positive: true, time: "2h ago" },
  { event: "Tweet went viral", delta: "+8K", positive: true, time: "5h ago" },
  { event: "Clip featured on TV", delta: "+25K", positive: true, time: "1d ago" },
  { event: "Collab announcement", delta: "+15K", positive: true, time: "2d ago" },
];

export default function FollowerTracker() {
  const [followers, setFollowers] = useState(2100000);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate real-time follower count
    const interval = setInterval(() => {
      setFollowers(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const calculateGrowth = () => {
    const start = MOCK_FOLLOWER_DATA[0].followers;
    const current = MOCK_FOLLOWER_DATA[MOCK_FOLLOWER_DATA.length - 1].followers;
    return ((current - start) / start * 100).toFixed(1);
  };

  const maxFollowers = Math.max(...MOCK_FOLLOWER_DATA.map(d => d.followers));
  const minFollowers = Math.min(...MOCK_FOLLOWER_DATA.map(d => d.followers));

  return (
    <div className="space-y-6">
      {/* Main Stats Card */}
      <div className="drama-card p-6 bg-gradient-to-br from-red-900/20 to-purple-900/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center font-bold text-3xl text-white">
              DA
            </div>
            <div>
              <div className="text-white/60 text-sm">@DramaAlert</div>
              <div className="text-4xl font-bold">{formatNumber(followers)}</div>
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <TrendingUp className="w-4 h-4" />
                +{calculateGrowth()}% this month
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            <div className="text-center">
              <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
                <Activity className="w-4 h-4" />
                Daily Avg
              </div>
              <div className="text-2xl font-bold">+4.2K</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
                <Target className="w-4 h-4" />
                Next Goal
              </div>
              <div className="text-2xl font-bold text-red-400">2.5M</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
                <Calendar className="w-4 h-4" />
                Est. Reach
              </div>
              <div className="text-2xl font-bold">12d</div>
            </div>
          </div>
        </div>

        {/* Mini Chart */}
        <div className="mt-6 h-16 flex items-end gap-1">
          {MOCK_FOLLOWER_DATA.map((point, idx) => (
            <div
              key={idx}
              className="flex-1 bg-gradient-to-t from-red-600 to-red-400 rounded-t"
              style={{
                height: `${((point.followers - minFollowers) / (maxFollowers - minFollowers)) * 100}%`
              }}
            />
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Growth */}
        <div className="drama-card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Growth Events</h3>
          <div className="space-y-3">
            {RECENT_MILESTONES.map((event, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="font-medium">{event.event}</div>
                  <div className="text-xs text-white/40">{event.time}</div>
                </div>
                <div className={`flex items-center gap-1 font-semibold ${
                  event.positive ? "text-green-400" : "text-red-400"
                }`}>
                  {event.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {event.delta}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="drama-card p-6">
          <h3 className="text-lg font-semibold mb-4">Milestones & Goals</h3>
          <div className="grid grid-cols-2 gap-3">
            {ACHIEVEMENTS.map((achievement, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  achievement.achieved
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <div className="text-2xl mb-2">{achievement.icon}</div>
                <div className={`font-semibold ${achievement.achieved ? "" : "text-white/60"}`}>
                  {achievement.name}
                </div>
                <div className="text-xs text-white/40">{achievement.date}</div>
                {achievement.achieved && (
                  <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Achieved
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Notification */}
      <div className="drama-card p-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="live-dot"></div>
          <span className="text-red-400 font-semibold">LIVE</span>
        </div>
        <div className="flex-1">
          <span className="text-white/80">New follower from </span>
          <span className="font-semibold">Los Angeles, CA</span>
        </div>
        <div className="text-sm text-white/40">Just now</div>
      </div>
    </div>
  );
}
