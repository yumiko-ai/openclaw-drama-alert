"use client";

import { useState, useEffect, useRef } from "react";
import { ExternalLink, TrendingUp, TrendingDown, Minus, Twitter, Heart, MessageCircle, Repeat, Eye, Users, Activity, FileImage, Sparkles, Search, Rss, Layers, Home, Send, Bot, Loader2, Zap } from "lucide-react";
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

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: string;
  trending: boolean;
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

const MOCK_NEWS: NewsItem[] = [
  { id: "1", title: "xQc breaks 14-hour stream record", source: "Twitter/X", time: "5m ago", category: "Stream", trending: true },
  { id: "2", title: "Ludwig announces $500K charity tournament", source: "YouTube", time: "12m ago", category: "Event", trending: true },
  { id: "3", title: "Trainwreckstv podcast hits #1 on Apple Podcasts", source: "RSS", time: "25m ago", category: "Podcast", trending: false },
  { id: "4", title: "Mizkif reveals new studio expansion plans", source: "Twitch", time: "45m ago", category: "Update", trending: false },
  { id: "5", title: "Apex Legends pro accused of cheating during tournament", source: "Twitter/X", time: "1h ago", category: "Drama", trending: true },
  { id: "6", title: "Pokimane announces month-long break from streaming", source: "Instagram", time: "1h ago", category: "News", trending: false },
  { id: "7", title: " HasanAbi and Destiny debate draws 200K viewers", source: "Twitter/X", time: "2h ago", category: "Drama", trending: true },
  { id: "8", title: "Ninja returns to competitive gaming after 3-year hiatus", source: "ESPN", time: "2h ago", category: "Esports", trending: false },
];

const TRENDING_TOPICS = [
  { topic: "#xQcExposed", posts: "125K", trend: "up" },
  { topic: "Trainwreckstv", posts: "89K", trend: "up" },
  { topic: "#LudwigTournament", posts: "67K", trend: "up" },
  { topic: "MizkifBreak", posts: "45K", trend: "down" },
  { topic: "#HasanVsDestiny", posts: "34K", trend: "stable" },
];

type Tab = "overview" | "alerts" | "tweets" | "feeds";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [tweets, setTweets] = useState<Tweet[]>(MOCK_TWEETS);
  const [news, setNews] = useState<NewsItem[]>(MOCK_NEWS);
  const [newsIndex, setNewsIndex] = useState(0);
  const [followers, setFollowers] = useState(2100000);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: "Hey! I'm your DramaAlert AI assistant. Ask me about trending topics, competitor analysis, or content ideas. How can I help?", timestamp: new Date() }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Time state for hydration fix
  const [currentTime, setCurrentTime] = useState<string>("");
  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFollowers(prev => prev + Math.floor(Math.random() * 3));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // News ticker rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % news.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [news.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

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

  const getNewsCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Stream: "text-red-400",
      Event: "text-purple-400",
      Podcast: "text-green-400",
      Update: "text-yellow-400",
      Drama: "text-orange-400",
      News: "text-blue-400",
      Esports: "text-cyan-400",
    };
    return colors[category] || "text-white/60";
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsChatLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on current trends, I'd suggest focusing on the xQc camping story. It's getting massive engagement.",
        "The #LudwigTournament hashtag is hot right now. Great opportunity for engagement.",
        "Competitor analysis shows Trainwreckstv's podcast is dominating the space. Consider a reaction video.",
        "Mizkif's studio announcement is trending. Could be good for a follow-up piece.",
        "Historical data suggests drama content performs best between 6-9 PM EST.",
      ];
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, aiMsg]);
      setIsChatLoading(false);
    }, 1500);
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <>
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

              {/* Recent Alerts */}
              <div className="space-y-4">
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
            </>
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending */}
          <div className="drama-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-yellow-500" />
              Trending
            </h3>
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

          {/* AI Chat */}
          <div className="drama-card p-4 flex flex-col h-96">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-500" />
              AI Assistant
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-2">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                    msg.role === "user" 
                      ? "bg-blue-500/20 border border-blue-500/30" 
                      : "bg-white/5 border border-white/10"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-white/60">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                placeholder="Ask about trends..."
                className="drama-input flex-1 text-sm"
              />
              <button
                onClick={sendChatMessage}
                disabled={isChatLoading || !chatInput.trim()}
                className="drama-button p-3"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live News Ticker Footer */}
      <div className="mt-8 drama-card p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="live-dot"></div>
          <span className="text-red-400 text-sm font-semibold">LIVE NEWS</span>
          <span className="text-white/40 text-sm">{currentTime || "..."}</span>
        </div>
        
        <div className="flex items-center gap-6 overflow-x-auto pb-2">
          {news.map((item, idx) => (
            <div 
              key={item.id} 
              className={`flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 whitespace-nowrap ${
                idx === newsIndex ? "ring-2 ring-red-500/50" : ""
              }`}
            >
              <span className={`text-xs font-semibold ${getNewsCategoryColor(item.category)}`}>
                {item.category}
              </span>
              <span className="text-sm">{item.title}</span>
              <span className="text-xs text-white/40">{item.source}</span>
              {item.trending && <Zap className="w-3 h-3 text-yellow-400" />}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-6 pt-6 border-t border-white/10 text-center text-white/40 text-sm">
        <p>DramaAlert Dashboard • {currentTime || "..."}</p>
      </footer>
    </div>
  );
}
