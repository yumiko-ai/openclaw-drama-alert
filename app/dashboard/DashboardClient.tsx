"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Image,
  LogOut,
  Bell,
  TrendingUp,
  MessageSquare,
} from "lucide-react";

interface DashboardStats {
  generationsToday: number;
  totalGenerations: number;
  alertsPushed: number;
}

export default function DashboardClient() {
  const [stats] = useState<DashboardStats>({
    generationsToday: 12,
    totalGenerations: 847,
    alertsPushed: 23,
  });

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-white font-bold text-xl"
              >
                <span className="text-[#ff0000]">DramaAlert</span>
                <span className="text-white/60 font-normal">Studio</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to DramaAlert Studio
          </h1>
          <p className="text-white/60">
            Push alerts to your dashboard
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <h3 className="font-semibold text-white mb-1">Alerts</h3>
            <p className="text-sm text-white/60">
              {stats.alertsPushed} alerts pushed today
            </p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <h3 className="font-semibold text-white mb-1">Generations</h3>
            <p className="text-sm text-white/60">
              {stats.generationsToday} generated today
            </p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <h3 className="font-semibold text-white mb-1">AI Chat</h3>
            <p className="text-sm text-white/60">
              Content ideas & trends
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-4">Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-white/60 mb-1">Today</p>
              <p className="text-3xl font-bold text-[#ff0000]">
                {stats.generationsToday}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/60 mb-1">This Week</p>
              <p className="text-3xl font-bold text-white">
                {stats.generationsToday * 7}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/60 mb-1">This Month</p>
              <p className="text-3xl font-bold text-white">
                {stats.generationsToday * 30}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/60 mb-1">All Time</p>
              <p className="text-3xl font-bold text-white">
                {stats.totalGenerations}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
