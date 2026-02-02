"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Trash2,
  Check,
  X,
  Send,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Eye,
  Zap,
  Plus
} from "lucide-react";

interface ViralTweet {
  id: string;
  tweet_id: string;
  velocity: number;
  impressions_at_detection: number;
  status: 'pending' | 'pushed' | 'dismissed';
  created_at: string;
  pushed_at?: string;
  dismissed_at?: string;
  tweets?: {
    id: string;
    author: string;
    text: string;
    timestamp: string;
    url: string;
  };
}

interface QueueStats {
  pending: number;
  pushed: number;
  dismissed: number;
}

export default function ViralQueue() {
  const [queue, setQueue] = useState<ViralTweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<QueueStats>({ pending: 0, pushed: 0, dismissed: 0 });
  const [activeTab, setActiveTab] = useState<'pending' | 'pushed' | 'dismissed'>('pending');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchQueue = useCallback(async () => {
    try {
      const response = await fetch(`/api/viral?status=${activeTab}`);
      const data = await response.json();
      if (data.queue) {
        setQueue(data.queue);
      }
    } catch (error) {
      console.error('Error fetching queue:', error);
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const [pending, pushed, dismissed] = await Promise.all([
        fetch('/api/viral?status=pending').then(r => r.json()),
        fetch('/api/viral?status=pushed').then(r => r.json()),
        fetch('/api/viral?status=dismissed').then(r => r.json())
      ]);

      setStats({
        pending: pending.queue?.length || 0,
        pushed: pushed.queue?.length || 0,
        dismissed: dismissed.queue?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await fetchQueue();
    await fetchStats();
    setLastUpdated(new Date());
    setLoading(false);
  }, [fetchQueue]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(refreshAll, 30000);
    refreshAll();

    return () => clearInterval(interval);
  }, [autoRefresh, refreshAll]);

  const handlePushToLive = async () => {
    try {
      await fetch('/api/viral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'push_to_live' })
      });
      await refreshAll();
    } catch (error) {
      console.error('Error pushing to live:', error);
    }
  };

  const handleClearQueue = async () => {
    try {
      await fetch('/api/viral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear_queue' })
      });
      await refreshAll();
    } catch (error) {
      console.error('Error clearing queue:', error);
    }
  };

  const handleDismiss = async (queueId: string) => {
    try {
      await fetch('/api/viral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dismiss', tweet_id: queueId })
      });
      await refreshAll();
    } catch (error) {
      console.error('Error dismissing:', error);
    }
  };

  const handleDelete = async (queueId: string) => {
    try {
      await fetch('/api/viral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', tweet_id: queueId })
      });
      await refreshAll();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handlePush = async (queueId: string) => {
    try {
      await fetch('/api/viral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', tweet_id: queueId, status: 'pushed' })
      });
      await refreshAll();
    } catch (error) {
      console.error('Error pushing:', error);
    }
  };

  const addTestData = async () => {
    try {
      const testTweets = [
        {
          id: `test_${Date.now()}_1`,
          author: 'elonmusk',
          text: 'We are in the beginning of the Singularity 🚀',
          url: 'https://twitter.com/elonmusk/status/2018079455873212529',
          metrics: { likes: 45000, retweets: 5200, replies: 6100, impressions: 85000 }
        },
        {
          id: `test_${Date.now()}_2`,
          author: 'CryptoKing',
          text: 'Just loaded up on $BTC. This is going to be huge! 📈',
          url: 'https://twitter.com/CryptoKing/status/1234567890',
          metrics: { likes: 12000, retweets: 3400, replies: 890, impressions: 72000 }
        },
        {
          id: `test_${Date.now()}_3`,
          author: 'TechInsider',
          text: 'Breaking: Major tech company announces revolutionary AI breakthrough',
          url: 'https://twitter.com/TechInsider/status/1234567891',
          metrics: { likes: 8900, retweets: 2100, replies: 450, impressions: 71000 }
        }
      ];

      for (const tweet of testTweets) {
        await fetch('/api/viral', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'push',
            tweet_id: tweet.id,
            author: tweet.author,
            text: tweet.text,
            url: tweet.url,
            timestamp: new Date().toISOString(),
            metrics: tweet.metrics
          })
        });
      }
      await refreshAll();
    } catch (error) {
      console.error('Error adding test data:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500 bg-yellow-500/10';
      case 'pushed': return 'text-green-500 bg-green-500/10';
      case 'dismissed': return 'text-red-500 bg-red-500/10';
      default: return 'text-white/60 bg-white/10';
    }
  };

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Viral Tweet Queue
          </h2>
          <p className="text-sm text-white/60 mt-1">
            Monitor and push viral tweets to your audience
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={addTestData}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            title="Add test data"
          >
            <Plus className="w-3 h-3" />
            Test Data
          </button>
          <button
            onClick={refreshAll}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-4 mb-6 p-3 bg-white/5 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/60">Pending:</span>
          <span className="text-yellow-500 font-bold text-lg">{stats.pending}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/60">Pushed:</span>
          <span className="text-green-500 font-bold text-lg">{stats.pushed}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/60">Dismissed:</span>
          <span className="text-red-500 font-bold text-lg">{stats.dismissed}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-white/40">
            Updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`text-xs px-2 py-1 rounded ${autoRefresh ? 'bg-green-600/30 text-green-400' : 'bg-white/10 text-white/40'}`}>
            {autoRefresh ? 'Auto' : 'Manual'}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4">
        {(['pending', 'pushed', 'dismissed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-[#ff0000] text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      {activeTab === 'pending' && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={handlePushToLive}
            disabled={stats.pending === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Send className="w-4 h-4" />
            Push All to Live
          </button>
          <button
            onClick={handleClearQueue}
            disabled={stats.pending === 0}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Queue
          </button>
        </div>
      )}

      {/* Queue List */}
      {loading ? (
        <div className="text-center py-8 text-white/60">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
          Loading viral tweets...
        </div>
      ) : queue.length === 0 ? (
        <div className="text-center py-12 text-white/40">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg mb-2">No {activeTab} tweets</p>
          <p className="text-sm">
            {activeTab === 'pending' ? 'Waiting for viral tweets from the monitor...' : 'Check other tabs'}
          </p>
          {activeTab === 'pending' && (
            <button
              onClick={addTestData}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm mx-auto"
            >
              <Plus className="w-4 h-4" />
              Add Sample Tweets
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {queue.map((item) => (
            <div
              key={item.id}
              className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors border-l-2 border-l-yellow-500/50"
            >
              {/* Tweet Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[#ff0000] font-medium">
                      @{item.tweets?.author || 'unknown'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-white text-sm mb-3 line-clamp-3">
                    {item.tweets?.text || 'Tweet content unavailable'}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-white/60 flex-wrap">
                    <span className="flex items-center gap-1" title="Impressions">
                      <Eye className="w-3 h-3" />
                      {item.impressions_at_detection.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1" title="Velocity">
                      <TrendingUp className="w-3 h-3" />
                      {item.velocity.toFixed(1)}/min
                    </span>
                    <span title="Detected">
                      🕐 {formatTime(item.created_at)}
                    </span>
                    {item.tweets?.url && (
                      <a
                        href={item.tweets.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        View Tweet ↗
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {activeTab === 'pending' && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handlePush(item.id)}
                      className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                      title="Push to Live"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDismiss(item.id)}
                      className="p-2 text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-colors"
                      title="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {activeTab === 'pushed' && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDismiss(item.id)}
                      className="p-2 text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-colors"
                      title="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {activeTab === 'dismissed' && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
