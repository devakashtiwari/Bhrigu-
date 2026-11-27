"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FlameKindling, Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed.");
      router.push(data.user?.role === "ADMIN" ? "/admin" : "/temples");
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-700 shadow-lg mb-4">
            <FlameKindling className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold font-serif gradient-sacred">Bhrigu</h1>
          <p className="text-gray-500 text-sm mt-1">Sacred Pooja & Temple Platform</p>
        </div>

        <div className="bg-white rounded-2xl border border-orange-100 shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Welcome Back, Devotee 🙏</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1.5">Email</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-orange-200 mt-2"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing In…</> : "Sign In"}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 p-4 bg-orange-50 rounded-xl border border-orange-100 text-xs text-gray-600 space-y-1">
            <p className="font-semibold text-gray-800 mb-2">Demo Credentials</p>
            <p>👤 Devotee: <span className="font-mono text-orange-700">aarav@devotee.in</span> / <span className="font-mono text-orange-700">devotee123</span></p>
            <p>🛡 Admin: <span className="font-mono text-orange-700">manager@bhrigu.in</span> / <span className="font-mono text-orange-700">admin123</span></p>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            New devotee?{" "}
            <Link href="/register" className="text-orange-600 font-semibold hover:text-orange-700">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
