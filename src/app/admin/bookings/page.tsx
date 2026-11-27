"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Loader2, CheckCircle2, XCircle, Clock, ChevronDown } from "lucide-react";

interface Booking {
  id: string;
  bookingCode: string;
  slotDate: string;
  slotTime: string;
  mode: string;
  devoteeName: string;
  devoteePhone: string;
  gotra: string | null;
  nakshatra: string | null;
  sankalpamNotes: string | null;
  amountInr: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  transactionId: string | null;
  createdAt: string;
  user: { name: string; email: string; phone: string | null };
  temple: { name: string; slug: string };
  pooja: { name: string; priceInr: number };
  priest: { name: string } | null;
}

const STATUS_OPTIONS = ["ALL", "CONFIRMED", "COMPLETED", "PENDING", "CANCELLED"];

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  CONFIRMED: { icon: CheckCircle2, color: "text-green-700", bg: "bg-green-100" },
  COMPLETED: { icon: CheckCircle2, color: "text-blue-700", bg: "bg-blue-100" },
  CANCELLED: { icon: XCircle, color: "text-red-700", bg: "bg-red-100" },
  PENDING: { icon: Clock, color: "text-yellow-700", bg: "bg-yellow-100" },
};

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [updating, setUpdating] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (!d.user || d.user.role !== "ADMIN") { router.push("/login"); return; }
      fetch("/api/bookings?all=true").then((r) => r.json()).then((data) => setBookings(data.bookings ?? [])).finally(() => setLoading(false));
    });
  }, [router]);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    }
    setUpdating(null);
  }

  const filtered = filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-orange-400" />
          <div>
            <h1 className="text-xl font-bold">All Bookings</h1>
            <p className="text-stone-400 text-sm">{bookings.length} total bookings across all temples</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {STATUS_OPTIONS.map((s) => {
            const count = s === "ALL" ? bookings.length : bookings.filter((b) => b.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`text-sm font-semibold px-4 py-2 rounded-full border transition-all ${
                  filter === s
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-600 border-gray-200 hover:border-orange-200"
                }`}
              >
                {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()} <span className="ml-1 text-xs opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-5 py-3">Booking</th>
                  <th className="text-left px-5 py-3">Devotee</th>
                  <th className="text-left px-5 py-3">Temple & Pooja</th>
                  <th className="text-left px-5 py-3">Date & Time</th>
                  <th className="text-left px-5 py-3">Amount</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400">No bookings found.</td>
                  </tr>
                ) : filtered.map((b) => {
                  const sc = statusConfig[b.status] ?? statusConfig.PENDING;
                  const StatusIcon = sc.icon;
                  const isExp = expanded === b.id;
                  return (
                    <>
                      <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-mono text-xs font-bold text-orange-700">{b.bookingCode}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{new Date(b.createdAt).toLocaleDateString("en-IN")}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-900">{b.user.name}</p>
                          <p className="text-gray-400 text-xs">{b.user.email}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-900 truncate max-w-36">{b.temple.name}</p>
                          <p className="text-gray-400 text-xs truncate max-w-36">{b.pooja.name}</p>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-gray-700">
                          {b.slotDate}<br />
                          <span className="text-xs text-orange-600">{b.slotTime}</span>
                        </td>
                        <td className="px-5 py-4 font-bold text-gray-900">₹{b.amountInr.toLocaleString("en-IN")}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${sc.bg} ${sc.color}`}>
                            <StatusIcon className="w-3 h-3" /> {b.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {b.status === "CONFIRMED" && (
                              <button
                                onClick={() => updateStatus(b.id, "COMPLETED")}
                                disabled={updating === b.id}
                                className="text-xs font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50"
                              >
                                {updating === b.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Complete"}
                              </button>
                            )}
                            {!["CANCELLED", "COMPLETED"].includes(b.status) && (
                              <button
                                onClick={() => updateStatus(b.id, "CANCELLED")}
                                disabled={updating === b.id}
                                className="text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            )}
                            <button
                              onClick={() => setExpanded(isExp ? null : b.id)}
                              className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 hover:bg-gray-50 px-2 py-1.5 rounded-lg transition-all"
                            >
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExp ? "rotate-180" : ""}`} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExp && (
                        <tr key={b.id + "-detail"}>
                          <td colSpan={7} className="px-5 py-4 bg-orange-50/50 border-t border-orange-100">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600">
                              <div><span className="font-semibold text-gray-800 block">Mode</span>{b.mode}</div>
                              <div><span className="font-semibold text-gray-800 block">Gotra</span>{b.gotra ?? "—"}</div>
                              <div><span className="font-semibold text-gray-800 block">Nakshatra</span>{b.nakshatra ?? "—"}</div>
                              <div><span className="font-semibold text-gray-800 block">Payment</span>{b.paymentMethod ?? "UPI"} · {b.paymentStatus}</div>
                              <div><span className="font-semibold text-gray-800 block">Transaction ID</span>{b.transactionId ?? "—"}</div>
                              <div><span className="font-semibold text-gray-800 block">Phone</span>{b.devoteePhone}</div>
                              <div className="col-span-2"><span className="font-semibold text-gray-800 block">Sankalpam</span>{b.sankalpamNotes ?? "—"}</div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
