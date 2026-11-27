"use client";
import { useEffect, useState } from "react";
import { Search, Filter, MapPin } from "lucide-react";
import { TempleCard } from "@/components/TempleCard";

interface Temple {
  id: string;
  slug: string;
  name: string;
  location: string;
  state: string;
  deity: string;
  tradition: string;
  imageUrl: string;
  timings: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  poojas: Array<{ id: string; priceInr: number }>;
  _count?: { bookings: number };
}

const STATES = ["All States", "Uttar Pradesh", "Andhra Pradesh", "Tamil Nadu", "Maharashtra", "Rajasthan", "Karnataka"];
const TRADITIONS = ["All", "Shaiva", "Vaishnava", "Shakta", "Ganapatya", "Kashi Shaiva"];

export default function TemplesPage() {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [state, setState] = useState("All States");
  const [tradition, setTradition] = useState("All");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (state !== "All States") params.set("state", state);

    fetch(`/api/temples?${params}`)
      .then((r) => r.json())
      .then((d) => {
        let list: Temple[] = d.temples ?? [];
        if (tradition !== "All") {
          list = list.filter((t) => t.tradition.includes(tradition));
        }
        setTemples(list);
      })
      .finally(() => setLoading(false));
  }, [search, state, tradition]);

  return (
    <div className="min-h-screen bg-orange-50/30">
      {/* Hero header */}
      <div className="bg-gradient-to-r from-orange-700 to-red-800 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-4xl mb-3">🛕</div>
          <h1 className="text-4xl font-bold font-serif mb-3">Sacred Temples of Bharat</h1>
          <p className="text-orange-100 text-lg max-w-xl mx-auto">
            Discover and book authentic pooja rituals at the most revered temples across India.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-56 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search temples, deities, locations…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-400" />
            <select
              className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-orange-400" />
            <select
              className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
              value={tradition}
              onChange={(e) => setTradition(e.target.value)}
            >
              {TRADITIONS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div className="text-sm text-gray-500 font-medium">
            {loading ? "Loading…" : `${temples.length} temple${temples.length !== 1 ? "s" : ""} found`}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-orange-100 shadow-sm">
                <div className="skeleton h-48" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                  <div className="skeleton h-3 w-2/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : temples.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No temples found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {temples.map((temple) => (
              <TempleCard key={temple.id} temple={temple} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
