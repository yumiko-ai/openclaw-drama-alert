"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated, else dashboard
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#ff0000]/30 border-t-[#ff0000] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/60">Loading...</p>
      </div>
    </div>
  );
}
