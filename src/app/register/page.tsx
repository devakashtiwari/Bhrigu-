"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FlameKindling, Loader2, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "", gotra: "", nakshatra: "", rashi: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Registration failed.");
      router.push("/temples");
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-700 shadow-lg mb-4">
            <FlameKindling className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold font-serif gradient-sacred">Bhrigu</h1>
          <p className="text-gray-500 text-sm mt-1">Create your sacred account</p>
        </div>

        <div className="bg-white rounded-2xl border border-orange-100 shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Join Bhrigu 🕉</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name *", field: "name", type: "text", placeholder: "Your full name", span: true },
                { label: "Email *", field: "email", type: "email", placeholder: "you@example.com", span: false },
                { label: "Phone", field: "phone", type: "tel", placeholder: "+91 98765 43210", span: false },
                { label: "Gotra", field: "gotra", type: "text", placeholder: "e.g. Bharadwaja", span: false },
                { label: "Nakshatra", field: "nakshatra", type: "text", placeholder: "e.g. Rohini", span: false },
                { label: "Rashi", field: "rashi", type: "text", placeholder: "e.g. Vrishabha", span: false },
              ].map(({ label, field, type, placeholder, span }) => (
                <div key={field} className={span ? "sm:col-span-2" : ""}>
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1.5">{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[field as keyof typeof form]}
                    onChange={(e) => set(field, e.target.value)}
                    required={["name", "email"].includes(field)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
              ))}

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1.5">Password *</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
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
            </div>

            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-orange-200"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account…</> : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already a devotee?{" "}
            <Link href="/login" className="text-orange-600 font-semibold hover:text-orange-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
