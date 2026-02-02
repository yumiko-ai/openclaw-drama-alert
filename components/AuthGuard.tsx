"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check for login page
      if (pathname === "/login") {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();

        if (!data.authenticated) {
          router.push("/login");
          return;
        }

        setIsAuthenticated(true);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ff0000]/30 border-t-[#ff0000] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
}
