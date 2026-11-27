import { CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";

type BookingStatus = "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED";
type PaymentStatus = "PAID" | "PENDING" | "REFUNDED";

interface Booking {
  id: string;
  bookingCode: string;
  slotDate: string;
  slotTime: string;
  mode: string;
  devoteeName: string;
  amountInr: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  createdAt: string;
  temple: { name: string; slug: string; imageUrl?: string; location?: string };
  pooja: { name: string; priceInr?: number; durationMins?: number };
  priest?: { name: string; title: string } | null;
}

const statusConfig: Record<BookingStatus, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  CONFIRMED: { icon: CheckCircle2, color: "text-green-700", bg: "bg-green-100", label: "Confirmed" },
  PENDING: { icon: Clock, color: "text-yellow-700", bg: "bg-yellow-100", label: "Pending" },
  COMPLETED: { icon: CheckCircle2, color: "text-blue-700", bg: "bg-blue-100", label: "Completed" },
  CANCELLED: { icon: XCircle, color: "text-red-700", bg: "bg-red-100", label: "Cancelled" },
};

const paymentConfig: Record<PaymentStatus, { color: string; label: string }> = {
  PAID: { color: "text-green-600", label: "Paid" },
  PENDING: { color: "text-yellow-600", label: "Pending" },
  REFUNDED: { color: "text-blue-600", label: "Refunded" },
};

export function BookingCard({
  booking,
  onCancel,
}: {
  booking: Booking;
  onCancel?: (id: string) => void;
}) {
  const sc = statusConfig[booking.status] || statusConfig.PENDING;
  const pc = paymentConfig[booking.paymentStatus] || paymentConfig.PENDING;
  const StatusIcon = sc.icon;

  const formattedDate = new Date(booking.slotDate + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Header strip */}
      <div className="h-1.5 bg-gradient-to-r from-orange-400 via-sacred-500 to-red-600" />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-0.5 rounded-full font-bold">
                {booking.bookingCode}
              </span>
              <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${sc.bg} ${sc.color}`}>
                <StatusIcon className="w-3 h-3" /> {sc.label}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-base">{booking.pooja.name}</h3>
            <p className="text-sm text-orange-600">{booking.temple.name}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl font-bold text-orange-600">₹{booking.amountInr.toLocaleString("en-IN")}</p>
            <p className={`text-xs font-semibold ${pc.color}`}>{pc.label} · {booking.paymentMethod ?? "UPI"}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Date & Time</p>
            <p className="font-semibold text-gray-800">{formattedDate}</p>
            <p className="text-orange-600">{booking.slotTime}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Mode</p>
            <p className="font-semibold text-gray-800">
              {booking.mode === "LIVE_STREAM" ? "📡 Live Stream" : "🛕 In-Person"}
            </p>
            {booking.priest && (
              <p className="text-xs text-gray-500">
                {booking.priest.title}: {booking.priest.name}
              </p>
            )}
          </div>
        </div>

        {booking.status === "CONFIRMED" && onCancel && (
          <button
            onClick={() => onCancel(booking.id)}
            className="text-xs text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
}
