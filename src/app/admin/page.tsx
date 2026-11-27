"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Users, Building2, BookOpen, TrendingUp,
  IndianRupee, ChevronRight, Clock, CheckCircle2, XCircle, Loader2
} from "lucide-react";

interface Stats {
  totalUsers: number;
  totalTemples: number;
  totalBookings: number;
  totalRevenue: number;
}

interface Booking {
  id: string;
  bookingCode: string;
  slotDate: string;
  slotTime: string;
  status: string;
  amountInr: number;
  user: { name: string; email: string };
  temple: { name: string };
  pooja: { name: string };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (!d.user || d.user.role !== "ADMIN") {
        router.push("/login");
        return;
      }
      fetch("/api/admin/stats").then((r) => r.json()).then((data) => {
        setStats(data.stats);
        setRecentBookings(data.recentBookings ?? []);
      }).finally(() => setLoading(false));
    });
  }, [router]);

  const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    CONFIRMED: { icon: CheckCircle2, color: "text-green-700", bg: "bg-green-100" },
    COMPLETED: { icon: CheckCircle2, color: "text-blue-700", bg: "bg-blue-100" },
    CANCELLED: { icon: XCircle, color: "text-red-700", bg: "bg-red-100" },
    PENDING: { icon: Clock, color: "text-yellow-700", bg: "bg-yellow-100" },
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-orange-400" />
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-stone-400 text-sm">Bhrigu Temple Management Portal</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/temples" className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
              Manage Temples
            </Link>
            <Link href="/admin/bookings" className="text-sm bg-stone-700 hover:bg-stone-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
              All Bookings
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {[
            { label: "Total Devotees", value: stats?.totalUsers ?? 0, icon: Users, color: "from-blue-500 to-blue-600", suffix: "" },
            { label: "Active Temples", value: stats?.totalTemples ?? 0, icon: Building2, color: "from-orange-500 to-orange-600", suffix: "" },
            { label: "Total Bookings", value: stats?.totalBookings ?? 0, icon: BookOpen, color: "from-purple-500 to-purple-600", suffix: "" },
            { label: "Total Revenue", value: stats?.totalRevenue ?? 0, icon: IndianRupee, color: "from-green-500 to-green-600", suffix: "", isRupee: true },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {(card as { isRupee?: boolean }).isRupee ? "₹" : ""}{Number(card.value).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-xs text-green-600">
                <TrendingUp className="w-3.5 h-3.5" /> All time
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {[
            { title: "Manage Temples", desc: "Add, edit, or deactivate temples and their pooja services.", href: "/admin/temples", emoji: "🛕" },
            { title: "Manage Bookings", desc: "View all bookings, update statuses, and handle cancellations.", href: "/admin/bookings", emoji: "📋" },
            { title: "My Temple Profile", desc: "Update your managed temple's description, timings, and more.", href: "/admin/temples", emoji: "⚙️" },
          ].map((card) => (
            <Link key={card.title} href={card.href} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-orange-200 hover:shadow-md transition-all group">
              <div className="text-3xl mb-3">{card.emoji}</div>
              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-orange-700 transition-colors">{card.title}</h3>
              <p className="text-sm text-gray-500">{card.desc}</p>
              <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-orange-600">
                Go <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>

        {/* Recent bookings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-6 py-3">Code</th>
                  <th className="text-left px-6 py-3">Devotee</th>
                  <th className="text-left px-6 py-3">Temple & Pooja</th>
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-left px-6 py-3">Amount</th>
                  <th className="text-left px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">No bookings yet.</td>
                  </tr>
                ) : recentBookings.map((b) => {
                  const sc = statusConfig[b.status] ?? statusConfig.PENDING;
                  const StatusIcon = sc.icon;
                  return (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-orange-700">{b.bookingCode}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{b.user.name}</p>
                        <p className="text-gray-400 text-xs">{b.user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 truncate max-w-40">{b.temple.name}</p>
                        <p className="text-gray-400 text-xs truncate max-w-40">{b.pooja.name}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{b.slotDate} {b.slotTime}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">₹{b.amountInr.toLocaleString("en-IN")}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${sc.bg} ${sc.color}`}>
                          <StatusIcon className="w-3 h-3" /> {b.status}
                        </span>
                      </td>
                    </tr>
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
