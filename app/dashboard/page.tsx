"use client";

import { useState, useEffect } from "react";
import { ExternalLink, TrendingUp, TrendingDown, Minus, Twitter, Heart, MessageCircle, Repeat, Eye, Users, Activity, FileImage, Sparkles, Search, Rss, Layers, Home } from "lucide-react";
import Link from "next/link";

interface Alert {
  id: string;
  type: "viral" | "breaking" | "trending" | "mention";
  message: string;
  source: string;
  time: string;
  impact: "high" | "medium" | "low";
}

interface Tweet {
  id: string;
  content: string;
  time: string;
  likes: number;
  retweets: number;
  replies: number;
  impressions: number;
  engagement: number;
  url: string;
}

const MOCK_ALERTS: Alert[] = [
  { id: "1", type: "viral", message: "xQc tweet about CoD is going viral", source: "Twitter", time: "2m ago", impact: "high" },
  { id: "2", type: "breaking", message: "Trainwreckstv announces new tournament", source: "Twitter", time: "15m ago", impact: "high" },
  { id: "3", type: "mention", message: "Mizkif mentioned @DramaAlert", source: "Twitter", time: "32m ago", impact: "medium" },
  { id: "4", type: "trending", message: "#LudwigTournament is trending", source: "RSS", time: "1h ago", impact: "medium" },
  { id: "5", type: "viral", message: "HasanAbi clip getting 10K+ likes/min", source: "Twitter", time: "2h ago", impact: "low" },
];

const MOCK_TWEETS: Tweet[] = [
  { id: "1", content: "xQc just got exposed for camping in Call of Duty lobby for 3 hours straight. This is wild.", time: "2m ago", likes: 1243, retweets: 234, replies: 89, impressions: 45000, engagement: 3.4, url: "https://twitter.com/DramaAlert/status/1" },
  { id: "2", content: "Trainwreckstv announces new podcast episode featuring Kai Cenat.🔥", time: "15m ago", likes: 892, retweets: 156, replies: 67, impressions: 32000, engagement: 3.5, url: "https://twitter.com/DramaAlert/status/2" },
  { id: "3", content: "Ludwig's new tournament format is exactly what the community needed. Thoughts?", time: "32m ago", likes: 2100, retweets: 445, replies: 234, impressions: 78000, engagement: 4.1, url: "https://twitter.com/DramaAlert/status/3" },
];

const TRENDING_TOPICS = [
  { topic: "#xQcExposed", posts: "125K", trend: "up" },
  { topic: "Trainwreckstv", posts: "89K", trend: "up" },
  { topic: "#Ludwig Tournament", posts: "67K", trend: "up" },
  { topic: "Mizkif Break", posts: "45K", trend: "down" },
  { topic: "#HasanVsDestiny", posts: "34K", trend: "stable" },
];

type Tab = "overview" | "alerts" | "tweets" | "feeds";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [tweets, setTweets] = useState<Tweet[]>(MOCK_TWEETS);
  const [followers, setFollowers] = useState(2100000);

  useEffect(() => {
    const interval = setInterval(() => {
      setFollowers(prev => prev + Math.floor(Math.random() * 3));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => num.toLocaleString();

  const getAlertColor = (type: string) => {
    switch (type) {
      case "viral": return "text-purple-400 bg-purple-500/20";
      case "breaking": return "text-red-400 bg-red-500/20";
      case "trending": return "text-yellow-400 bg-yellow-500/20";
      case "mention": return "text-blue-400 bg-blue-500/20";
      default: return "text-white/60 bg-white/10";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "text-red-400";
      case "medium": return "text-yellow-400";
      case "low": return "text-green-400";
      default: return "text-white/40";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <Home className="w-4 h-4" />
            <span className="text-sm">Landing</span>
          </Link>
          <div className="h-6 w-px bg-white/20"></div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <Twitter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">@DramaAlert</h1>
              <p className="text-white/60 text-sm">Dashboard</p>
            </div>
          </div>
        </div>
        
        <a href="https://twitter.com/DramaAlert" target="_blank" rel="noopener noreferrer" className="drama-button flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          View Profile
        </a>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { id: "overview", label: "Overview", icon: Activity },
          { id: "alerts", label: "Alerts", icon: Twitter },
          { id: "tweets", label: "My Tweets", icon: MessageCircle },
          { id: "feeds", label: "Feeds", icon: Rss },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`drama-button flex items-center gap-2 ${activeTab === tab.id ? "bg-blue-600" : ""}`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="drama-card p-4">
              <div className="flex items-center gap-2 text-white/60 mb-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">Followers</span>
              </div>
              <div className="text-3xl font-bold">{formatNumber(followers)}</div>
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <TrendingUp className="w-3 h-3" />+3.2%
              </div>
            </div>
            <div className="drama-card p-4">
              <div className="flex items-center gap-2 text-white/60 mb-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm">Impressions</span>
              </div>
              <div className="text-3xl font-bold">450K</div>
              <div className="text-sm text-white/40">Last 24h</div>
            </div>
            <div className="drama-card p-4">
              <div className="flex items-center gap-2 text-white/60 mb-2">
                <Activity className="w-4 h-4" />
                <span className="text-sm">Avg Engagement</span>
              </div>
              <div className="text-3xl font-bold">4.1%</div>
              <div className="text-sm text-white/40">Per tweet</div>
            </div>
            <div className="drama-card p-4">
              <div className="flex items-center gap-2 text-white/60 mb-2">
                <Twitter className="w-4 h-4" />
                <span className="text-sm">New Alerts</span>
              </div>
              <div className="text-3xl font-bold text-red-400">{alerts.length}</div>
              <div className="text-sm text-white/40">Unread</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Alerts */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Twitter className="w-5 h-5 text-red-500" />
                Recent Alerts
              </h2>
              {alerts.slice(0, 4).map((alert) => (
                <div key={alert.id} className="drama-card p-4">
                  <div className="flex items-start gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getAlertColor(alert.type)}`}>
                      {alert.type.toUpperCase()}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium">{alert.message}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-white/60">
                        <span>{alert.source}</span>
                        <span>•</span>
                        <span>{alert.time}</span>
                        <span className={`ml-2 ${getImpactColor(alert.impact)}`}>
                          {alert.impact} impact
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trending */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-yellow-500" />
                Trending
              </h2>
              <div className="drama-card p-4">
                <div className="space-y-3">
                  {TRENDING_TOPICS.map((trend, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{trend.topic}</div>
                        <div className="text-xs text-white/40">{trend.posts} posts</div>
                      </div>
                      <div className={trend.trend === "up" ? "text-green-400" : trend.trend === "down" ? "text-red-400" : "text-white/40"}>
                        {trend.trend === "up" && <TrendingUp className="w-4 h-4" />}
                        {trend.trend === "down" && <TrendingDown className="w-4 h-4" />}
                        {trend.trend === "stable" && <Minus className="w-4 h-4" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === "alerts" && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Twitter className="w-5 h-5 text-red-500" />
            All Alerts
          </h2>
          {alerts.map((alert) => (
            <div key={alert.id} className="drama-card p-4">
              <div className="flex items-start gap-3">
                <span className={`px-3 py-1 rounded text-xs font-semibold ${getAlertColor(alert.type)}`}>
                  {alert.type.toUpperCase()}
                </span>
                <div className="flex-1">
                  <p className="text-lg font-medium">{alert.message}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                    <span className="flex items-center gap-1">
                      <Twitter className="w-4 h-4" />
                      {alert.source}
                    </span>
                    <span>{alert.time}</span>
                    <span className={getImpactColor(alert.impact)}>
                      {alert.impact.toUpperCase()} IMPACT
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tweets Tab */}
      {activeTab === "tweets" && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            My Tweets
          </h2>
          {tweets.map((tweet) => (
            <div key={tweet.id} className="drama-card p-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Twitter className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">@DramaAlert</span>
                    <span className="text-white/40 text-sm">• {tweet.time}</span>
                  </div>
                  <p className="text-white/90 mb-3">{tweet.content}</p>
                  <div className="flex items-center gap-6 text-white/60 text-sm">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {formatNumber(tweet.replies)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Repeat className="w-4 h-4" />
                      {formatNumber(tweet.retweets)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {formatNumber(tweet.likes)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatNumber(tweet.impressions)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feeds Tab */}
      {activeTab === "feeds" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Rss className="w-5 h-5 text-green-500" />
            Live Feeds
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="drama-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Twitter className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="font-semibold">Twitter Feed</h3>
                  <p className="text-sm text-white/60">@DramaAlert mentions & trends</p>
                </div>
              </div>
              <div className="space-y-3">
                {alerts.filter(a => a.source === "Twitter").map((alert) => (
                  <div key={alert.id} className="p-3 bg-white/5 rounded-lg">
                    <p className="text-sm">{alert.message}</p>
                    <span className="text-xs text-white/40">{alert.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="drama-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Rss className="w-6 h-6 text-orange-500" />
                <div>
                  <h3 className="font-semibold">RSS Feeds</h3>
                  <p className="text-sm text-white/60">Gaming & streaming news</p>
                </div>
              </div>
              <div className="space-y-3">
                {alerts.filter(a => a.source === "RSS").map((alert) => (
                  <div key={alert.id} className="p-3 bg-white/5 rounded-lg">
                    <p className="text-sm">{alert.message}</p>
                    <span className="text-xs text-white/40">{alert.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-white/10 text-center text-white/40 text-sm">
        <p>DramaAlert Dashboard • {new Date().toLocaleString()}</p>
      </footer>
    </div>
  );
}
