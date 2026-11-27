"use client";
import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { PoojaCard } from "@/components/PoojaCard";
import { POOJA_CATEGORIES } from "@/lib/slots";

interface Pooja {
  id: string;
  name: string;
  category: string;
  description: string;
  benefits: string;
  durationMins: number;
  priceInr: number;
  mode: string;
  maxPerSlot: number;
  imageUrl: string | null;
  temple: { name: string; slug: string };
}

export default function PoojasPage() {
  const [poojas, setPoojas] = useState<Pooja[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("price_asc");

  useEffect(() => {
    setLoading(true);
    fetch("/api/poojas")
      .then((r) => r.json())
      .then((d) => setPoojas(d.poojas ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = poojas
    .filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.temple.name.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.priceInr - b.priceInr;
      if (sortBy === "price_desc") return b.priceInr - a.priceInr;
      if (sortBy === "duration") return a.durationMins - b.durationMins;
      return 0;
    });

  return (
    <div className="min-h-screen bg-orange-50/30">
      <div className="bg-gradient-to-r from-red-700 to-orange-700 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-4xl mb-3">🔥</div>
          <h1 className="text-4xl font-bold font-serif mb-3">All Pooja Services</h1>
          <p className="text-orange-100 text-lg max-w-xl mx-auto">
            Authentic Vedic rituals performed by learned priests — book any pooja for in-person or live-stream.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 flex flex-wrap gap-4 items-center mb-8">
          <div className="flex-1 min-w-56 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search poojas, temples…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-orange-400" />
            <select
              className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {POOJA_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <select
            className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="duration">Shortest First</option>
          </select>

          <div className="text-sm text-gray-500 font-medium">
            {loading ? "Loading…" : `${filtered.length} poojas`}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-orange-100 p-5 space-y-3">
                <div className="skeleton h-5 w-3/4 rounded" />
                <div className="skeleton h-4 w-1/2 rounded" />
                <div className="skeleton h-16 rounded" />
                <div className="skeleton h-10 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🕉</div>
            <h3 className="text-xl font-semibold text-gray-700">No poojas found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((pooja) => (
              <PoojaCard key={pooja.id} pooja={pooja} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
