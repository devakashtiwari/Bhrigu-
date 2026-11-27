"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Loader2 } from "lucide-react";
import { BookingCard } from "@/components/BookingCard";

interface Booking {
  id: string;
  bookingCode: string;
  slotDate: string;
  slotTime: string;
  mode: string;
  devoteeName: string;
  amountInr: number;
  status: "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED";
  paymentStatus: "PAID" | "PENDING" | "REFUNDED";
  paymentMethod?: string;
  createdAt: string;
  temple: { name: string; slug: string; imageUrl?: string; location?: string };
  pooja: { name: string; priceInr?: number; durationMins?: number };
  priest?: { name: string; title: string } | null;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (!d.user) { router.push("/login"); return; }
    });

    fetch("/api/bookings")
      .then((r) => r.json())
      .then((d) => setBookings(d.bookings ?? []))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleCancel(id: string) {
    if (!confirm("Cancel this booking? This cannot be undone.")) return;
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    if (res.ok) {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" } : b))
      );
    }
  }

  const filtered = filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);

  const counts = {
    ALL: bookings.length,
    CONFIRMED: bookings.filter((b) => b.status === "CONFIRMED").length,
    COMPLETED: bookings.filter((b) => b.status === "COMPLETED").length,
    CANCELLED: bookings.filter((b) => b.status === "CANCELLED").length,
  };

  return (
    <div className="min-h-screen bg-orange-50/30 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-serif text-gray-900">My Bookings</h1>
            <p className="text-gray-500 text-sm">{bookings.length} total pooja booking{bookings.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["ALL", "CONFIRMED", "COMPLETED", "CANCELLED"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-sm font-semibold px-4 py-2 rounded-full border transition-all ${
                filter === s
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-200 hover:text-orange-600"
              }`}
            >
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
              <span className={`ml-1.5 text-xs font-bold ${filter === s ? "text-orange-200" : "text-gray-400"}`}>
                {counts[s]}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-24">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your sacred bookings…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-orange-100">
            <div className="text-5xl mb-4">🕉</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {filter === "ALL" ? "No bookings yet" : `No ${filter.toLowerCase()} bookings`}
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === "ALL"
                ? "Start your sacred journey by booking a pooja at your favourite temple."
                : "Try a different filter."}
            </p>
            {filter === "ALL" && (
              <a
                href="/temples"
                className="inline-block bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-md"
              >
                Explore Temples
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((booking) => (
              <BookingCard key={booking.id} booking={booking} onCancel={handleCancel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
