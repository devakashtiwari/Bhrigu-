"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Save, Loader2 } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  gotra: string | null;
  nakshatra: string | null;
  rashi: string | null;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", gotra: "", nakshatra: "", rashi: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) { router.push("/login"); return; }
        setUser(d.user);
        setForm({
          name: d.user.name ?? "",
          phone: d.user.phone ?? "",
          gotra: d.user.gotra ?? "",
          nakshatra: d.user.nakshatra ?? "",
          rashi: d.user.rashi ?? "",
        });
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save.");
      setUser(data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-orange-50/30 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-700 rounded-2xl p-6 text-white mb-8 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <span className="text-3xl font-bold">{user?.name[0]}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold font-serif">{user?.name}</h1>
            <p className="text-orange-100 text-sm">{user?.email}</p>
            {user?.role === "ADMIN" && (
              <span className="inline-block mt-1 bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                Admin
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <User className="w-5 h-5 text-orange-500" /> Profile & Jyotish Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { label: "Full Name", field: "name", placeholder: "Your name" },
              { label: "Phone Number", field: "phone", placeholder: "+91 98765 43210" },
              { label: "Gotra", field: "gotra", placeholder: "e.g. Bharadwaja, Vashishta" },
              { label: "Nakshatra (Birth Star)", field: "nakshatra", placeholder: "e.g. Rohini, Ashwini" },
              { label: "Rashi (Moon Sign)", field: "rashi", placeholder: "e.g. Vrishabha, Mesha" },
            ].map(({ label, field, placeholder }) => (
              <div key={field} className={field === "name" ? "sm:col-span-2" : ""}>
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1.5">
                  {label}
                </label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={form[field as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                />
              </div>
            ))}
          </div>

          <div className="mt-3 p-3 bg-orange-50 rounded-xl text-xs text-gray-600">
            🕉 Your Gotra, Nakshatra, and Rashi will be automatically filled when you book a pooja, ensuring a personalized Sankalpam.
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>
          )}
          {saved && (
            <div className="mt-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              ✅ Profile updated successfully!
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </div>

        {/* Account info */}
        <div className="mt-5 bg-white rounded-2xl border border-orange-100 p-5 text-sm text-gray-600">
          <h3 className="font-bold text-gray-900 mb-3">Account Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Role</span>
              <span className="font-medium capitalize">{user?.role?.toLowerCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Member Since</span>
              <span className="font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
