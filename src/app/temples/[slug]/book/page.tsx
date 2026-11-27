"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Shield, CreditCard } from "lucide-react";
import { POOJA_TIME_SLOTS } from "@/lib/slots";

interface Temple {
  id: string;
  slug: string;
  name: string;
  location: string;
  priests: Array<{ id: string; name: string; title: string }>;
}

interface Pooja {
  id: string;
  name: string;
  priceInr: number;
  durationMins: number;
  mode: string;
  benefits: string;
  description: string;
}

function BookingForm({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const poojaId = searchParams.get("poojaId") ?? "";

  const [temple, setTemple] = useState<Temple | null>(null);
  const [pooja, setPooja] = useState<Pooja | null>(null);
  const [user, setUser] = useState<{ name: string; phone: string; gotra: string; nakshatra: string } | null>(null);

  const [form, setForm] = useState({
    slotDate: "",
    slotTime: "",
    mode: "LIVE_STREAM",
    priestId: "",
    devoteeName: "",
    devoteePhone: "",
    gotra: "",
    nakshatra: "",
    sankalpamNotes: "",
    prasadAddress: "",
    paymentMethod: "UPI",
  });

  const [step, setStep] = useState<"details" | "payment" | "done">("details");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<{ bookingCode: string; amountInr: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/temples/${slug}`).then((r) => r.json()),
      fetch("/api/auth/me").then((r) => r.json()),
    ]).then(([td, ud]) => {
      let resolvedPooja: Pooja | null = null;
      if (td.temple) {
        setTemple(td.temple);
        resolvedPooja = td.temple.poojas?.find((x: Pooja) => x.id === poojaId) ?? td.temple.poojas?.[0] ?? null;
        setPooja(resolvedPooja);
      }
      if (ud.user) {
        setUser(ud.user);
        setForm((f) => ({
          ...f,
          devoteeName: ud.user.name ?? "",
          devoteePhone: ud.user.phone ?? "",
          gotra: ud.user.gotra ?? "",
          nakshatra: ud.user.nakshatra ?? "",
          mode: resolvedPooja?.mode === "IN_PERSON" ? "IN_PERSON" : "LIVE_STREAM",
        }));
      } else {
        router.push(`/login?next=/temples/${slug}/book?poojaId=${poojaId}`);
      }
    }).finally(() => setLoading(false));
  }, [slug, poojaId, router]);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit() {
    setError("");
    if (!form.slotDate || !form.slotTime) {
      setError("Please select a date and time slot.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templeId: temple!.id,
          poojaId: pooja!.id,
          priestId: form.priestId || undefined,
          slotDate: form.slotDate,
          slotTime: form.slotTime,
          mode: form.mode,
          devoteeName: form.devoteeName,
          devoteePhone: form.devoteePhone,
          gotra: form.gotra,
          nakshatra: form.nakshatra,
          sankalpamNotes: form.sankalpamNotes,
          prasadAddress: form.prasadAddress,
          paymentMethod: form.paymentMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Booking failed.");
      setBooking({ bookingCode: data.booking.bookingCode, amountInr: data.booking.amountInr });
      setStep("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Booking failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading booking details…</p>
      </div>
    </div>
  );

  if (!temple || !pooja) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">🕉</div>
        <h2 className="text-xl font-semibold text-gray-700">Pooja service not found.</h2>
      </div>
    </div>
  );

  if (step === "done" && booking) return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl border border-orange-100 shadow-xl max-w-md w-full p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <div className="text-4xl mb-3">🙏</div>
        <h2 className="text-2xl font-bold font-serif text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-5">Your pooja has been booked successfully. The temple will send you an HD live stream link before the ceremony.</p>

        <div className="bg-orange-50 rounded-2xl p-5 mb-6 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Booking Code</span>
            <span className="font-bold text-orange-700 font-mono">{booking.bookingCode}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Pooja</span>
            <span className="font-semibold text-gray-800 text-right max-w-xs">{pooja.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Temple</span>
            <span className="font-semibold text-gray-800">{temple.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Date & Time</span>
            <span className="font-semibold text-gray-800">{form.slotDate} · {form.slotTime}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-orange-100 pt-2 mt-2">
            <span className="text-gray-500">Amount Paid</span>
            <span className="font-bold text-orange-700 text-base">₹{booking.amountInr.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/bookings")}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold py-3 rounded-xl transition-all hover:shadow-md"
          >
            View My Bookings
          </button>
          <button
            onClick={() => router.push(`/temples/${slug}`)}
            className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold py-3 rounded-xl transition-all border border-orange-100"
          >
            Back to Temple
          </button>
        </div>
      </div>
    </div>
  );

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-orange-50/30 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Summary */}
        <div className="bg-gradient-to-r from-orange-600 to-red-700 rounded-2xl p-6 text-white mb-8">
          <p className="text-orange-100 text-sm mb-1">{temple.name}</p>
          <h1 className="text-2xl font-bold font-serif mb-1">{pooja.name}</h1>
          <p className="text-orange-100 text-sm mb-4">{pooja.durationMins} min · {pooja.description.substring(0, 80)}…</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-200">Total Amount</p>
              <p className="text-3xl font-bold">₹{pooja.priceInr.toLocaleString("en-IN")}</p>
            </div>
            <div className="flex items-center gap-1 text-xs bg-green-500/20 border border-green-400/30 px-3 py-1.5 rounded-full">
              <Shield className="w-3.5 h-3.5" /> Secure Booking
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 space-y-6">
          {/* Date & Time */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 text-sm font-bold flex items-center justify-center">1</span>
              Select Date & Slot
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Pooja Date *</label>
                <input
                  type="date"
                  min={minDate}
                  value={form.slotDate}
                  onChange={(e) => set("slotDate", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Time Slot *</label>
                <select
                  value={form.slotTime}
                  onChange={(e) => set("slotTime", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                >
                  <option value="">Choose a time…</option>
                  {POOJA_TIME_SLOTS.map((s) => (
                    <option key={s.time} value={s.time}>{s.time} — {s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Mode & Priest */}
          <div className="border-t border-orange-50 pt-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 text-sm font-bold flex items-center justify-center">2</span>
              Pooja Mode & Priest
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Mode</label>
                <select
                  value={form.mode}
                  onChange={(e) => set("mode", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                >
                  {pooja.mode !== "IN_PERSON" && <option value="LIVE_STREAM">📡 Live Stream</option>}
                  {pooja.mode !== "LIVE_STREAM" && <option value="IN_PERSON">🛕 In-Person</option>}
                  {pooja.mode === "BOTH" && <option value="LIVE_STREAM">📡 Live Stream</option>}
                </select>
              </div>
              {temple.priests.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Preferred Priest (optional)</label>
                  <select
                    value={form.priestId}
                    onChange={(e) => set("priestId", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                  >
                    <option value="">Any available priest</option>
                    {temple.priests.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.title})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Devotee details */}
          <div className="border-t border-orange-50 pt-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 text-sm font-bold flex items-center justify-center">3</span>
              Devotee & Sankalpam Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name *", field: "devoteeName", placeholder: "Your full name" },
                { label: "Phone *", field: "devoteePhone", placeholder: "+91 98xxx xxxxx" },
                { label: "Gotra", field: "gotra", placeholder: "e.g. Bharadwaja" },
                { label: "Nakshatra", field: "nakshatra", placeholder: "e.g. Rohini" },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="text-xs font-medium text-gray-700 block mb-1">{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={form[field as keyof typeof form]}
                    onChange={(e) => set(field, e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium text-gray-700 block mb-1">Sankalpam / Special Intention (optional)</label>
              <textarea
                rows={2}
                placeholder="e.g. For the health of my father, Ramesh Sharma, Gotra Vashishta…"
                value={form.sankalpamNotes}
                onChange={(e) => set("sankalpamNotes", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
              />
            </div>
            {form.mode === "IN_PERSON" && (
              <div className="mt-4">
                <label className="text-xs font-medium text-gray-700 block mb-1">Prasad Delivery Address (optional)</label>
                <input
                  type="text"
                  placeholder="Your full address for prasad delivery"
                  value={form.prasadAddress}
                  onChange={(e) => set("prasadAddress", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="border-t border-orange-50 pt-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 text-sm font-bold flex items-center justify-center">4</span>
              Payment Method
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {["UPI", "CARD", "NETBANKING"].map((m) => (
                <button
                  key={m}
                  onClick={() => set("paymentMethod", m)}
                  className={`flex items-center justify-center gap-1.5 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                    form.paymentMethod === m
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-200 text-gray-600 hover:border-orange-200"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  {m === "NETBANKING" ? "Net Banking" : m}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-green-500" />
              Payment is simulated. No real charges will be made.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Summary + Submit */}
          <div className="border-t border-orange-100 pt-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Total payable</p>
                <p className="text-2xl font-bold text-orange-600">₹{pooja.priceInr.toLocaleString("en-IN")}</p>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-orange-200"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                ) : (
                  <>🕉 Confirm & Pay</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    }>
      <BookingFormWrapper params={params} />
    </Suspense>
  );
}

function BookingFormWrapper({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);
  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);
  if (!slug) return null;
  return <BookingForm slug={slug} />;
}
