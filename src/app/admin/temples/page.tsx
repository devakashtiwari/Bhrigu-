"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Building2, Loader2, ToggleLeft, ToggleRight, ChevronDown, ChevronUp } from "lucide-react";

interface Pooja {
  id: string;
  name: string;
  category: string;
  priceInr: number;
  durationMins: number;
  mode: string;
  isActive: boolean;
}

interface Temple {
  id: string;
  slug: string;
  name: string;
  location: string;
  deity: string;
  timings: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  featured: boolean;
  poojas: Pooja[];
  priests: Array<{ id: string; name: string; title: string }>;
  _count?: { bookings: number };
}

export default function AdminTemplesPage() {
  const router = useRouter();
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editPooja, setEditPooja] = useState<Partial<Pooja> | null>(null);
  const [addPoojaTempleId, setAddPoojaTempleId] = useState<string | null>(null);
  const [newPooja, setNewPooja] = useState({ name: "", category: "Archana", priceInr: "", durationMins: "60", mode: "BOTH", description: "", benefits: "", maxPerSlot: "5" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (!d.user || d.user.role !== "ADMIN") { router.push("/login"); return; }
      loadTemples();
    });
  }, [router]);

  function loadTemples() {
    fetch("/api/temples").then((r) => r.json()).then((d) => setTemples(d.temples ?? [])).finally(() => setLoading(false));
  }

  async function toggleActive(slug: string, current: boolean) {
    await fetch(`/api/temples/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    setTemples((prev) => prev.map((t) => t.slug === slug ? { ...t, isActive: !current } : t));
  }

  async function toggleFeatured(slug: string, current: boolean) {
    await fetch(`/api/temples/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !current }),
    });
    setTemples((prev) => prev.map((t) => t.slug === slug ? { ...t, featured: !current } : t));
  }

  async function savePooja(templeId: string) {
    if (!newPooja.name || !newPooja.priceInr) return;
    setSaving(true);
    const res = await fetch("/api/poojas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templeId, ...newPooja, priceInr: Number(newPooja.priceInr), durationMins: Number(newPooja.durationMins), maxPerSlot: Number(newPooja.maxPerSlot) }),
    });
    if (res.ok) {
      setMsg("Pooja added successfully!");
      setAddPoojaTempleId(null);
      setNewPooja({ name: "", category: "Archana", priceInr: "", durationMins: "60", mode: "BOTH", description: "", benefits: "", maxPerSlot: "5" });
      loadTemples();
    }
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  }

  async function updatePooja(id: string, data: Partial<Pooja>) {
    setSaving(true);
    const res = await fetch(`/api/poojas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setMsg("Pooja updated!");
      setEditPooja(null);
      loadTemples();
    }
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  }

  async function deactivatePooja(id: string) {
    if (!confirm("Deactivate this pooja service?")) return;
    await fetch(`/api/poojas/${id}`, { method: "DELETE" });
    loadTemples();
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-orange-400" />
            <div>
              <h1 className="text-xl font-bold">Temple Management</h1>
              <p className="text-stone-400 text-sm">{temples.length} temples registered</p>
            </div>
          </div>
          {msg && <div className="text-sm bg-green-500/20 border border-green-400/30 text-green-300 px-4 py-2 rounded-lg">{msg}</div>}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-5">
        {temples.map((temple) => (
          <div key={temple.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Temple header */}
            <div className="p-5 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-700 flex items-center justify-center shrink-0">
                  <span className="text-white text-xl">🛕</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900 text-lg">{temple.name}</h3>
                    {temple.featured && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">Featured</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${temple.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {temple.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{temple.location} · {temple.deity} · {temple._count?.bookings ?? 0} bookings</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => toggleFeatured(temple.slug, temple.featured)}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-orange-600 border border-gray-200 hover:border-orange-200 px-3 py-2 rounded-lg transition-all"
                >
                  ✨ {temple.featured ? "Unfeature" : "Feature"}
                </button>
                <button
                  onClick={() => toggleActive(temple.slug, temple.isActive)}
                  className={`flex items-center gap-1.5 text-xs font-medium border px-3 py-2 rounded-lg transition-all ${
                    temple.isActive
                      ? "text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                      : "text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
                  }`}
                >
                  {temple.isActive ? <><ToggleRight className="w-4 h-4" /> Deactivate</> : <><ToggleLeft className="w-4 h-4" /> Activate</>}
                </button>
                <button
                  onClick={() => setExpanded(expanded === temple.id ? null : temple.id)}
                  className="flex items-center gap-1.5 text-xs font-medium bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-100 px-3 py-2 rounded-lg transition-all"
                >
                  Poojas ({temple.poojas.length})
                  {expanded === temple.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Poojas section (expanded) */}
            {expanded === temple.id && (
              <div className="border-t border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-800">Pooja Services</h4>
                  <button
                    onClick={() => setAddPoojaTempleId(addPoojaTempleId === temple.id ? null : temple.id)}
                    className="flex items-center gap-1.5 text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Pooja
                  </button>
                </div>

                {/* Add pooja form */}
                {addPoojaTempleId === temple.id && (
                  <div className="bg-orange-50 rounded-xl border border-orange-100 p-4 mb-4">
                    <h5 className="font-semibold text-gray-800 mb-3">Add New Pooja Service</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: "Pooja Name *", key: "name", type: "text", placeholder: "e.g. Rudrabhishek" },
                        { label: "Price (₹) *", key: "priceInr", type: "number", placeholder: "e.g. 2100" },
                        { label: "Duration (min)", key: "durationMins", type: "number", placeholder: "60" },
                        { label: "Max Per Slot", key: "maxPerSlot", type: "number", placeholder: "5" },
                      ].map(({ label, key, type, placeholder }) => (
                        <div key={key}>
                          <label className="text-xs font-medium text-gray-700 block mb-1">{label}</label>
                          <input
                            type={type}
                            placeholder={placeholder}
                            value={newPooja[key as keyof typeof newPooja]}
                            onChange={(e) => setNewPooja((f) => ({ ...f, [key]: e.target.value }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                          />
                        </div>
                      ))}
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">Category</label>
                        <select
                          value={newPooja.category}
                          onChange={(e) => setNewPooja((f) => ({ ...f, category: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                        >
                          {["Abhishekam", "Archana", "Homam / Havan", "Kalyanotsavam", "Special Darshan"].map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">Mode</label>
                        <select
                          value={newPooja.mode}
                          onChange={(e) => setNewPooja((f) => ({ ...f, mode: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                        >
                          <option value="BOTH">Both</option>
                          <option value="LIVE_STREAM">Live Stream Only</option>
                          <option value="IN_PERSON">In-Person Only</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-medium text-gray-700 block mb-1">Description</label>
                        <textarea
                          rows={2}
                          placeholder="Describe the pooja ritual…"
                          value={newPooja.description}
                          onChange={(e) => setNewPooja((f) => ({ ...f, description: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-medium text-gray-700 block mb-1">Benefits</label>
                        <input
                          type="text"
                          placeholder="e.g. Peace, health, prosperity"
                          value={newPooja.benefits}
                          onChange={(e) => setNewPooja((f) => ({ ...f, benefits: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => savePooja(temple.id)}
                        disabled={saving}
                        className="flex items-center gap-1.5 text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Save Pooja
                      </button>
                      <button onClick={() => setAddPoojaTempleId(null)} className="text-sm text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">Cancel</button>
                    </div>
                  </div>
                )}

                {/* Pooja list */}
                <div className="space-y-2">
                  {temple.poojas.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No pooja services yet. Add one above.</p>
                  ) : temple.poojas.map((pooja) => (
                    <div key={pooja.id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl">
                      {editPooja?.id === pooja.id ? (
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={editPooja.name ?? ""}
                            onChange={(e) => setEditPooja((p) => ({ ...p, name: e.target.value }))}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                          />
                          <input
                            type="number"
                            value={editPooja.priceInr ?? ""}
                            onChange={(e) => setEditPooja((p) => ({ ...p, priceInr: Number(e.target.value) }))}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                            placeholder="Price ₹"
                          />
                          <div className="flex gap-2">
                            <button onClick={() => updatePooja(pooja.id, { name: editPooja.name, priceInr: editPooja.priceInr })} disabled={saving} className="flex-1 text-sm bg-orange-500 text-white rounded-lg py-2 hover:bg-orange-600 transition-colors">Save</button>
                            <button onClick={() => setEditPooja(null)} className="flex-1 text-sm bg-gray-200 text-gray-700 rounded-lg py-2 hover:bg-gray-300 transition-colors">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${pooja.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {pooja.isActive ? "Active" : "Inactive"}
                              </span>
                              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{pooja.category}</span>
                            </div>
                            <p className="font-medium text-gray-900 text-sm mt-1">{pooja.name}</p>
                            <p className="text-xs text-gray-500">₹{pooja.priceInr.toLocaleString("en-IN")} · {pooja.durationMins} min · {pooja.mode}</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => setEditPooja({ ...pooja })} className="text-xs text-blue-600 hover:text-blue-700 border border-blue-200 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1">
                              <Edit2 className="w-3 h-3" /> Edit
                            </button>
                            {pooja.isActive && (
                              <button onClick={() => deactivatePooja(pooja.id)} className="text-xs text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-all">
                                Deactivate
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
