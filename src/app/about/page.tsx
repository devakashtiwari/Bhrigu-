import Link from "next/link";
import { Shield, Wifi, Award, Flame, Heart, BookOpen } from "lucide-react";

export default function AboutPage() {
  const values = [
    { icon: Shield, title: "Vedic Authenticity", desc: "Every ritual follows traditional Shastra guidelines. All priests are verified, trained hereditary Pandits." },
    { icon: Wifi, title: "Technology for Devotion", desc: "High-definition live streams, instant booking, and digital prasad receipts — devotion meets modernity." },
    { icon: Award, title: "Temple Partnership", desc: "We work directly with temple administrations, ensuring every booking contributes to their preservation." },
    { icon: Flame, title: "Personalised Rituals", desc: "No generic pooja — every ritual is performed with your Gotra, Nakshatra, and family intention." },
    { icon: Heart, title: "Community", desc: "A growing community of 10,000+ devotees across India and the diaspora." },
    { icon: BookOpen, title: "Transparency", desc: "Clear pricing, no hidden fees, instant confirmation, and full money-back for cancellations." },
  ];

  const faqs = [
    { q: "How does the live stream work?", a: "After booking, you receive a private HD live stream link 1 hour before the pooja. The priest announces your Sankalpam and you can watch the full ritual in real time." },
    { q: "Can I request a specific priest?", a: "Yes! When booking, you can choose from the available priests listed for each temple. If your preferred priest is unavailable, we assign the most senior available priest." },
    { q: "How is prasad delivered?", a: "Sacred prasad is packed by the temple and dispatched via courier within 24 hours of the ritual. Delivery takes 2-5 business days depending on your location." },
    { q: "What is a Sankalpam?", a: "A Sankalpam is a sacred vow/intention stated at the beginning of a ritual. It includes your name, Gotra (lineage), Nakshatra (birth star), and the purpose of the pooja — making the ritual spiritually personal." },
    { q: "What is your cancellation policy?", a: "Free cancellation up to 24 hours before the slot. Cancellations within 24 hours receive a 50% refund. No-shows are non-refundable." },
    { q: "Is my payment secure?", a: "Yes. All payments are processed via encrypted payment gateways. We use industry-standard SSL/TLS encryption for all transactions." },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-700 to-red-900 text-white py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-4">🕉</div>
          <h1 className="text-4xl font-bold font-serif mb-4">About Bhrigu</h1>
          <p className="text-orange-100 text-lg leading-relaxed">
            Bhrigu is India&apos;s premier sacred technology platform connecting devotees worldwide with authentic Vedic temples and learned priests — bridging the timeless with the modern.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold font-serif text-gray-900 mb-5">Our Mission</h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          In a world where devotees are separated from their sacred heritage by distance, time, and circumstance — Bhrigu exists to ensure that no one is ever far from the divine. We believe that authentic Vedic rituals should be accessible to every Hindu family, whether they live in Varanasi or Vancouver.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Named after the great Vedic sage Bhrigu Maharishi — who was the first to systematize the science of Jyotish and spiritual counseling — our platform is built on the same principles: knowledge, accessibility, and devotion.
        </p>
      </section>

      {/* Values */}
      <section className="bg-orange-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold font-serif text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl border border-orange-100 p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold font-serif text-gray-900 text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-5">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-white rounded-2xl border border-orange-100 p-6">
              <h3 className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                <span className="text-orange-500 text-lg leading-none">🙏</span>
                {faq.q}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-orange-600 to-red-700 text-white py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold font-serif mb-4">Ready to Begin?</h2>
          <p className="text-orange-100 mb-8">Create your free account and book your first pooja in minutes.</p>
          <Link href="/register" className="inline-block bg-white text-orange-700 font-bold px-8 py-4 rounded-xl hover:bg-orange-50 transition-all shadow-lg">
            Join Bhrigu Free →
          </Link>
        </div>
      </section>
    </div>
  );
}
