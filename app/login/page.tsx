"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Lock } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Login failed");
        return;
      }

      // Store token and redirect
      document.cookie = `auth-token=${data.token}; path=/; max-age=${604800}; SameSite=Lax`;
      router.push("/dashboard");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#ff0000]/10 mb-4">
            <Sparkles className="w-8 h-8 text-[#ff0000]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">DramaAlert Studio</h1>
          <p className="text-white/60">Enter your password to continue</p>
        </div>

        {/* Login Form */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-white/60 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="drama-input w-full pl-12"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="drama-button w-full py-4 text-lg"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Verifying...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Enter Studio
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-white/40 text-sm mt-6">
          Protected area. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
