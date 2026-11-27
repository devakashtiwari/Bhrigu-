import Image from "next/image";
import Link from "next/link";
import { Star, Shield, Flame, Wifi, Award, ChevronRight, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getFeaturedData() {
  const [temples, stats] = await Promise.all([
    prisma.temple.findMany({
      where: { isActive: true, featured: true },
      include: {
        poojas: { where: { isActive: true }, orderBy: { priceInr: "asc" } },
        priests: { where: { isAvailable: true } },
        _count: { select: { bookings: true } },
      },
      orderBy: { rating: "desc" },
      take: 3,
    }),
    prisma.booking.aggregate({ _count: true }),
  ]);
  return { temples, totalBookings: stats._count };
}

export default async function HomePage() {
  const { temples, totalBookings } = await getFeaturedData();

  const features = [
    { icon: Shield, title: "Vedic Authenticity", desc: "Hereditary priests and traditional rituals, performed exactly as prescribed by Shastra." },
    { icon: Wifi, title: "Live Stream HD", desc: "Watch your pooja in real-time from anywhere on Earth with 4K live streaming." },
    { icon: Award, title: "Prasad Home Delivery", desc: "Sacred prasad, vibhuti, and tulasi shipped to your doorstep across India." },
    { icon: Flame, title: "Personalised Sankalpam", desc: "Every ritual conducted in your Gotra, Nakshatra, and family name." },
  ];

  const testimonials = [
    { name: "Priya Krishnamurthy", location: "Singapore", text: "Booked Rudrabhishek for my parents in Kashi while living abroad. The live stream was crystal clear and the priest performed the sankalpam in our family gotra. Truly divine!", rating: 5 },
    { name: "Rahul Verma", location: "Bengaluru", text: "My mother's satyanarayan pooja via Bhrigu was perfect — priest was knowledgeable, prasad arrived same day, and the entire experience felt sacred.", rating: 5 },
    { name: "Meenakshi Sundaram", location: "Chennai", text: "The Tirupati Kalyanotsavam booking process was seamless. This is the future of devotional services in India.", rating: 5 },
  ];

  return (
    <div className="sacred-bg">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <Image
          src="/images/hero-temple.jpg"
          alt="Sacred Temple"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
          <div className="max-w-2xl">
            {/* Om badge */}
            <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-400/40 text-orange-200 text-sm px-4 py-1.5 rounded-full mb-6">
              <span className="text-lg">🕉</span>
              Bhrigu Sacred Platform — Bharat&apos;s Most Trusted Pooja Booking
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold font-serif text-white leading-tight mb-6">
              Connect with the{" "}
              <span className="gradient-sacred block sm:inline">Divine</span>
              {" "}from Anywhere
            </h1>

            <p className="text-lg text-stone-200 leading-relaxed mb-8 max-w-xl">
              Book authentic Vedic poojas at India&apos;s most sacred temples — Kashi, Tirupati, Madurai and more — with live streaming, personalized sankalpam in your Gotra and Nakshatra, and prasad home delivery.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link
                href="/temples"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold text-base px-7 py-3.5 rounded-xl shadow-lg hover:shadow-orange-500/40 transition-all"
              >
                🛕 Explore Temples
              </Link>
              <Link
                href="/poojas"
                className="bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white border border-white/30 font-semibold text-base px-7 py-3.5 rounded-xl transition-all"
              >
                Browse All Poojas →
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              {[
                ["4+", "Sacred Temples"],
                [totalBookings > 0 ? `${totalBookings}+` : "500+", "Poojas Performed"],
                ["12+", "Expert Priests"],
                ["4.9★", "Average Rating"],
              ].map(([val, label]) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-bold text-orange-300">{val}</p>
                  <p className="text-xs text-stone-300">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 text-xs animate-bounce">
          <span>Scroll</span>
          <ChevronRight className="w-4 h-4 rotate-90" />
        </div>
      </section>

      {/* Features strip */}
      <section className="bg-gradient-to-r from-orange-600 to-red-700 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">{f.title}</p>
                  <p className="text-xs text-orange-100 leading-tight hidden sm:block">{f.desc.substring(0, 50)}…</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Temples */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-2">🌸 Featured</p>
          <h2 className="text-4xl font-bold font-serif text-gray-900 mb-3">Sacred Temples</h2>
          <p className="text-gray-600 max-w-xl mx-auto">Experience the divine presence of India&apos;s most revered temples, now accessible from wherever you are.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {temples.map((temple) => (
            <div key={temple.id} className="card-sacred group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-orange-100 transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={temple.imageUrl}
                  alt={temple.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  ✨ Featured
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-orange-200 text-xs mb-1">{temple.deity} · {temple.tradition}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm font-semibold">{temple.rating}</span>
                    <span className="text-white/60 text-xs">({temple.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg mb-1">{temple.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{temple.location}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Poojas from</p>
                    <p className="text-lg font-bold text-orange-600">
                      ₹{temple.poojas.length > 0
                        ? Math.min(...temple.poojas.map((p) => p.priceInr)).toLocaleString("en-IN")
                        : "—"}
                    </p>
                  </div>
                  <Link
                    href={`/temples/${temple.slug}`}
                    className="bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold text-sm px-4 py-2 rounded-xl transition-colors"
                  >
                    View Temple →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/temples" className="inline-flex items-center gap-2 bg-white border-2 border-orange-200 hover:border-orange-400 text-orange-700 font-semibold px-6 py-3 rounded-xl transition-all hover:bg-orange-50">
            View All Temples <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gradient-to-b from-orange-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-2">Simple & Sacred</p>
            <h2 className="text-4xl font-bold font-serif text-gray-900">How Bhrigu Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", emoji: "🔍", title: "Browse Temples", desc: "Explore sacred temples across India filtered by deity, tradition, state, or pooja type." },
              { step: "02", emoji: "🗓️", title: "Choose Pooja & Slot", desc: "Select your desired pooja ritual and pick a convenient date and time slot." },
              { step: "03", emoji: "🕉️", title: "Enter Sankalpam", desc: "Provide your Gotra, Nakshatra, and family details for a personalized ritual." },
              { step: "04", emoji: "✨", title: "Receive Blessings", desc: "Watch live or receive a recording, and get prasad delivered to your home." },
            ].map((step) => (
              <div key={step.step} className="text-center group">
                <div className="relative mx-auto w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-4 group-hover:from-orange-500 group-hover:to-red-600 transition-all duration-300">
                  <span className="text-3xl">{step.emoji}</span>
                  <div className="absolute -top-1 -right-1 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{step.step}</span>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-2">🙏 Devotee Stories</p>
          <h2 className="text-4xl font-bold font-serif text-gray-900">What Devotees Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl border border-orange-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{t.name[0]}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.location}</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-red-800 py-20 px-6">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Ccircle cx=\"20\" cy=\"20\" r=\"10\" fill=\"white\"%3E%3C/circle%3E%3C/svg%3E')" }} />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">🕉</div>
          <h2 className="text-4xl font-bold font-serif text-white mb-4">Begin Your Sacred Journey</h2>
          <p className="text-orange-100 text-lg mb-8">Join thousands of devotees who perform Vedic rituals at the most sacred temples in India — from anywhere in the world.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register" className="bg-white text-orange-700 hover:bg-orange-50 font-bold text-base px-8 py-3.5 rounded-xl shadow-lg transition-all hover:shadow-xl">
              Create Free Account
            </Link>
            <Link href="/temples" className="bg-orange-500/30 hover:bg-orange-500/50 text-white border border-white/30 font-semibold text-base px-8 py-3.5 rounded-xl transition-all">
              Explore Temples
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
