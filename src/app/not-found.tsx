import Link from "next/link";
import { Home, FlameKindling } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🕉</div>
        <h1 className="text-6xl font-bold font-serif gradient-sacred mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Like a pilgrim who has strayed from the path — this page doesn&apos;t exist. Let us guide you back to the sacred.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-md transition-all">
            <Home className="w-4 h-4" /> Return Home
          </Link>
          <Link href="/temples" className="flex items-center gap-2 bg-white border border-orange-200 text-orange-700 font-semibold px-6 py-3 rounded-xl hover:bg-orange-50 transition-all">
            <FlameKindling className="w-4 h-4" /> Explore Temples
          </Link>
        </div>
      </div>
    </div>
  );
}
