import Link from "next/link";
import { FlameKindling, Phone, Mail, MapPin, Instagram, Youtube, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-stone-900 to-stone-950 text-stone-300">
      {/* Om pattern strip */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-sacred-500 to-red-700" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center">
                <FlameKindling className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-serif text-orange-400">Bhrigu</span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed mb-5">
              Connecting devotees with sacred temples and learned priests across Bharat for authentic Vedic rituals online.
            </p>
            <div className="text-xs text-stone-500 font-medium tracking-widest uppercase">
              🕉 Sarve Bhavantu Sukhinah
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2">
              {[
                ["Temples", "/temples"],
                ["Pooja Services", "/poojas"],
                ["Book a Pooja", "/temples"],
                ["Priests", "/temples"],
                ["About Bhrigu", "/about"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-stone-400 hover:text-orange-300 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2">
              {[
                ["My Bookings", "/bookings"],
                ["My Profile", "/profile"],
                ["FAQ", "/about"],
                ["Cancellation Policy", "/about"],
                ["Prasad Delivery", "/about"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-stone-400 hover:text-orange-300 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-stone-400">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                +91 98765 00000
              </li>
              <li className="flex items-center gap-2 text-sm text-stone-400">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                support@bhrigu.in
              </li>
              <li className="flex items-start gap-2 text-sm text-stone-400">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                Bengaluru, Karnataka, India
              </li>
            </ul>
            <div className="flex gap-3 mt-5">
              {[Instagram, Youtube, Twitter].map((Icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-orange-600 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500">
            © 2026 Bhrigu Devotion-Tech Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-stone-500">
            <Link href="/about" className="hover:text-orange-400 transition-colors">Privacy Policy</Link>
            <Link href="/about" className="hover:text-orange-400 transition-colors">Terms of Service</Link>
            <Link href="/about" className="hover:text-orange-400 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
