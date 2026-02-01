"use client";

import { useState, useEffect } from "react";
import { ExternalLink, TrendingUp, TrendingDown, Minus, Twitter, Heart, MessageCircle, Repeat, Share, Eye, Users, Activity } from "lucide-react";

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

const MOCK_TWEETS: Tweet[] = [
  {
    id: "1",
    content: "xQc just got exposed for camping in Call of Duty lobby for 3 hours straight. This is wild.",
    time: "2m ago",
    likes: 1243,
    retweets: 234,
    replies: 89,
    impressions: 45000,
    engagement: 3.4,
    url: "https://twitter.com/DramaAlert/status/1"
  },
  {
    id: "2",
    content: "Trainwreckstv announces new podcast episode featuring Kai Cenat.🔥",
    time: "15m ago",
    likes: 892,
    retweets: 156,
    replies: 67,
    impressions: 32000,
    engagement: 3.5,
    url: "https://twitter.com/DramaAlert/status/2"
  },
  {
    id: "3",
    content: "Ludwig's new tournament format is exactly what the community needed. Thoughts?",
    time: "32m ago",
    likes: 2100,
    retweets: 445,
    replies: 234,
    impressions: 78000,
    engagement: 4.1,
    url: "https://twitter.com/DramaAlert/status/3"
  },
  {
    id: "4",
    content: "Mizkif reveals why he took that break. Emotional stream tonight.",
    time: "1h ago",
    likes: 3400,
    retweets: 678,
    replies: 345,
    impressions: 120000,
    engagement: 4.5,
    url: "https://twitter.com/DramaAlert/status/4"
  },
  {
    id: "5",
    content: "Breaking: Hasanabi and Destiny called each other out again. Full breakdown incoming.",
    time: "2h ago",
    likes: 5600,
    retweets: 1200,
    replies: 567,
    impressions: 200000,
    engagement: 5.2,
    url: "https://twitter.com/DramaAlert/status/5"
  },
];

const TRENDING_TOPICS = [
  { topic: "#xQcExposed", posts: "125K", trend: "up" },
  { topic: "Trainwreckstv", posts: "89K", trend: "up" },
  { topic: "#Ludwig Tournament", posts: "67K", trend: "up" },
  { topic: "Mizkif Break", posts: "45K", trend: "down" },
  { topic: "#HasanVsDestiny", posts: "34K", trend: "stable" },
];

export default function TwitterDashboard() {
  const [tweets, setTweets] = useState<Tweet[]>(MOCK_TWEETS);
  const [followers, setFollowers] = useState(2100000);
  const [selectedTweet, setSelectedTweet] = useState<Tweet | null>(null);

  useEffect(() => {
    // Simulate real-time follower updates
    const interval = setInterval(() => {
      setFollowers(prev => prev + Math.floor(Math.random() * 3));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const avgEngagement = tweets.reduce((acc, t) => acc + t.engagement, 0) / tweets.length;
  const totalImpressions = tweets.reduce((acc, t) => acc + t.impressions, 0);
  const totalEngagement = tweets.reduce((acc, t) => acc + t.likes + t.retweets + t.replies, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center">
            <Twitter className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">@DramaAlert</h1>
            <p className="text-white/60">Breaking news from the streaming world</p>
          </div>
        </div>
        
        <a 
          href="https://twitter.com/DramaAlert" 
          target="_blank" 
          rel="noopener noreferrer"
          className="drama-button flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          View Profile
        </a>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="drama-card p-4">
          <div className="flex items-center gap-2 text-white/60 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">Followers</span>
          </div>
          <div className="text-3xl font-bold">{formatNumber(followers)}</div>
          <div className="flex items-center gap-1 text-green-400 text-sm">
            <TrendingUp className="w-3 h-3" />
            +3.2% this week
          </div>
        </div>

        <div className="drama-card p-4">
          <div className="flex items-center gap-2 text-white/60 mb-2">
            <Eye className="w-4 h-4" />
            <span className="text-sm">Impressions</span>
          </div>
          <div className="text-3xl font-bold">{formatNumber(totalImpressions)}</div>
          <div className="text-sm text-white/40">Last 24h</div>
        </div>

        <div className="drama-card p-4">
          <div className="flex items-center gap-2 text-white/60 mb-2">
            <Activity className="w-4 h-4" />
            <span className="text-sm">Avg Engagement</span>
          </div>
          <div className="text-3xl font-bold">{avgEngagement.toFixed(1)}%</div>
          <div className="text-sm text-white/40">Per tweet</div>
        </div>

        <div className="drama-card p-4">
          <div className="flex items-center gap-2 text-white/60 mb-2">
            <Heart className="w-4 h-4" />
            <span className="text-sm">Total Engagement</span>
          </div>
          <div className="text-3xl font-bold">{formatNumber(totalEngagement)}</div>
          <div className="text-sm text-white/40">Likes + RTs</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tweets */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Twitter className="w-5 h-5 text-blue-500" />
            Recent Tweets
          </h2>

          {tweets.map((tweet) => (
            <div 
              key={tweet.id} 
              className="drama-card p-4 cursor-pointer hover:bg-white/10 transition-colors"
              onClick={() => setSelectedTweet(tweet)}
            >
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tweet Composer Preview */}
          <div className="drama-card p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Twitter className="w-4 h-4 text-blue-500" />
              Compose Tweet
            </h3>
            <textarea
              placeholder="What's happening in the streaming world?"
              className="drama-input w-full h-24 resize-none mb-3"
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-2 text-white/40">
                <span className="text-xs">0/280</span>
              </div>
              <button className="drama-button text-sm">
                Tweet
              </button>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="drama-card p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-500" />
              Trending in Streaming
            </h3>
            <div className="space-y-3">
              {TRENDING_TOPICS.map((trend, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                  <div>
                    <div className="font-medium text-sm">{trend.topic}</div>
                    <div className="text-xs text-white/40">{trend.posts} posts</div>
                  </div>
                  <div className={`${
                    trend.trend === "up" ? "text-green-400" : 
                    trend.trend === "down" ? "text-red-400" : "text-white/40"
                  }`}>
                    {trend.trend === "up" && <TrendingUp className="w-4 h-4" />}
                    {trend.trend === "down" && <TrendingDown className="w-4 h-4" />}
                    {trend.trend === "stable" && <Minus className="w-4 h-4" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="drama-card p-4">
            <h3 className="font-semibold mb-3">This Week</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Tweets</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Impressions</span>
                <span className="font-semibold">450K</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Mentions</span>
                <span className="font-semibold">2.3K</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">New Followers</span>
                <span className="font-semibold text-green-400">+4.2K</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Tweet Modal */}
      {selectedTweet && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTweet(null)}
        >
          <div className="drama-card p-6 max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <div className="flex gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                <Twitter className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold">@DramaAlert</div>
                <div className="text-white/40 text-sm">{selectedTweet.time}</div>
              </div>
            </div>
            <p className="text-lg mb-4">{selectedTweet.content}</p>
            
            <div className="grid grid-cols-4 gap-4 p-4 bg-white/5 rounded-xl mb-4">
              <div className="text-center">
                <div className="text-xl font-bold">{formatNumber(selectedTweet.impressions)}</div>
                <div className="text-xs text-white/60">Impressions</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{formatNumber(selectedTweet.likes)}</div>
                <div className="text-xs text-white/60">Likes</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{formatNumber(selectedTweet.retweets)}</div>
                <div className="text-xs text-white/60">Retweets</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{selectedTweet.engagement}%</div>
                <div className="text-xs text-white/60">Engagement</div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedTweet(null)}
              className="drama-button w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
