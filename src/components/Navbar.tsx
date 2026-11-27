"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, FlameKindling, User, LogOut, LayoutDashboard, BookOpen } from "lucide-react";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function Navbar() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .catch(() => setUser(null));
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  }

  const navLinks = [
    { href: "/temples", label: "Temples" },
    { href: "/poojas", label: "Poojas" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center shadow-md group-hover:shadow-orange-300 transition-shadow">
              <FlameKindling className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-serif gradient-sacred">Bhrigu</span>
            <span className="hidden sm:block text-xs text-orange-600 font-medium border border-orange-200 rounded px-1.5 py-0.5 ml-1">SACRED</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors ${
                  pathname.startsWith(l.href)
                    ? "text-orange-600 border-b-2 border-orange-500 pb-0.5"
                    : "text-gray-700 hover:text-orange-600"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-full px-3 py-1.5 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user.name[0]}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800 max-w-24 truncate">{user.name}</span>
                </button>

                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-orange-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-orange-50">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                      {user.role === "ADMIN" && (
                        <span className="inline-block mt-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Admin</span>
                      )}
                    </div>
                    <Link href="/profile" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors">
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <Link href="/bookings" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors">
                      <BookOpen className="w-4 h-4" /> My Bookings
                    </Link>
                    {user.role === "ADMIN" && (
                      <Link href="/admin" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <button onClick={() => { setDropOpen(false); logout(); }} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">Sign In</Link>
                <Link href="/register" className="text-sm font-semibold bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg hover:shadow-md hover:shadow-orange-200 transition-all">
                  Join Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-orange-50"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-orange-100 bg-white px-4 py-4 space-y-3">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-medium text-gray-700 hover:text-orange-600 py-1"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-orange-50 space-y-2">
            {user ? (
              <>
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-700 py-1">My Profile</Link>
                <Link href="/bookings" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-700 py-1">My Bookings</Link>
                {user.role === "ADMIN" && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-700 py-1">Admin Dashboard</Link>
                )}
                <button onClick={() => { setMenuOpen(false); logout(); }} className="block text-sm text-red-600 py-1">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-700 py-1">Sign In</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="block text-sm font-semibold text-orange-600 py-1">Join Free →</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
