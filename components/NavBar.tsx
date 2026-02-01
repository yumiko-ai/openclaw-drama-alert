"use client";

import Link from "next/link";
import { Search, Zap, Image, MessageSquare, ArrowLeft } from "lucide-react";

const navItems = [
  { href: "/", label: "Studio", icon: Zap },
  { href: "/generator", label: "Generator", icon: Image },
  { href: "/chat", label: "AI Chat", icon: MessageSquare },
];

export default function NavBar() {
  return (
    <nav className="drama-card sticky top-0 z-50 mx-4 mt-4 px-6 py-3">
      <div className="flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center font-bold text-white border-2 border-red-400">
            DA
          </div>
          <span className="text-xl font-bold hidden sm:block">DramaAlert Studio</span>
        </Link>

        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search templates..."
              className="drama-input w-full pl-10 pr-4"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="drama-button flex items-center gap-2 text-sm"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <Link 
          href="http://100.88.15.95:3000" 
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden md:inline">Main</span>
        </Link>
      </div>
    </nav>
  );
}
