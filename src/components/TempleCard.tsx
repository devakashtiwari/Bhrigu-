import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Clock, ChevronRight } from "lucide-react";

interface Temple {
  id: string;
  slug: string;
  name: string;
  location: string;
  deity: string;
  tradition: string;
  imageUrl: string;
  timings: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  poojas: Array<{ id: string; priceInr: number }>;
  _count?: { bookings: number };
}

export function TempleCard({ temple }: { temple: Temple }) {
  const minPrice = temple.poojas.length
    ? Math.min(...temple.poojas.map((p) => p.priceInr))
    : null;

  return (
    <div className="card-sacred group bg-white rounded-2xl overflow-hidden border border-orange-100 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={temple.imageUrl}
          alt={temple.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {temple.featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            ✨ Featured
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <p className="text-white text-xs font-medium opacity-90">{temple.tradition}</p>
            <p className="text-orange-200 text-xs">{temple.deity}</p>
          </div>
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs font-semibold">{temple.rating}</span>
            <span className="text-white/60 text-xs">({temple.reviewCount})</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base leading-tight mb-2 group-hover:text-orange-700 transition-colors line-clamp-2">
          {temple.name}
        </h3>

        <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
          <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          {temple.location}
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-xs mb-4">
          <Clock className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          {temple.timings}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-orange-50">
          <div>
            {minPrice ? (
              <p className="text-xs text-gray-500">
                Poojas from{" "}
                <span className="font-bold text-orange-600 text-sm">₹{minPrice.toLocaleString("en-IN")}</span>
              </p>
            ) : (
              <p className="text-xs text-gray-400">No services listed</p>
            )}
            <p className="text-xs text-gray-400">{temple.poojas.length} pooja{temple.poojas.length !== 1 ? "s" : ""} available</p>
          </div>
          <Link
            href={`/temples/${temple.slug}`}
            className="flex items-center gap-1 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
          >
            View <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
