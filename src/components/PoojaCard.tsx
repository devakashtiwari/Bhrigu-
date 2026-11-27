import Image from "next/image";
import Link from "next/link";
import { Clock, Flame, Wifi, Users } from "lucide-react";

interface Pooja {
  id: string;
  name: string;
  category: string;
  description: string;
  benefits: string;
  durationMins: number;
  priceInr: number;
  mode: string;
  maxPerSlot: number;
  imageUrl: string | null;
  temple?: { name: string; slug: string };
}

export function PoojaCard({ pooja, templeSlug }: { pooja: Pooja; templeSlug?: string }) {
  const slug = templeSlug ?? pooja.temple?.slug;

  const modeColors: Record<string, string> = {
    BOTH: "bg-purple-100 text-purple-700",
    LIVE_STREAM: "bg-blue-100 text-blue-700",
    IN_PERSON: "bg-green-100 text-green-700",
  };

  const modeLabels: Record<string, string> = {
    BOTH: "In-Person & Live",
    LIVE_STREAM: "Live Stream",
    IN_PERSON: "In-Person Only",
  };

  return (
    <div className="card-sacred group bg-white rounded-2xl overflow-hidden border border-orange-100 flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
      <div className="relative h-44 overflow-hidden bg-orange-50">
        <Image
          src={pooja.imageUrl || "/images/pooja-ritual.jpg"}
          alt={pooja.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          <span className="text-xs bg-orange-100/95 text-orange-800 font-medium px-2.5 py-0.5 rounded-full shadow-sm">
            {pooja.category}
          </span>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm ${modeColors[pooja.mode]}`}>
            {pooja.mode === "LIVE_STREAM" ? (
              <Wifi className="w-3 h-3" />
            ) : (
              <Flame className="w-3 h-3" />
            )}
            {modeLabels[pooja.mode]}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-base leading-tight">{pooja.name}</h3>
            {pooja.temple && (
              <p className="text-xs text-orange-600 mt-0.5">at {pooja.temple.name}</p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl font-bold text-orange-600">₹{pooja.priceInr.toLocaleString("en-IN")}</p>
          </div>
        </div>

      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{pooja.description}</p>

      <div className="bg-orange-50 rounded-lg p-3 text-xs text-gray-600">
        <p className="font-medium text-gray-800 mb-1">Benefits</p>
        <p className="line-clamp-2">{pooja.benefits}</p>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-orange-400" />
          {pooja.durationMins} min
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-orange-400" />
          Max {pooja.maxPerSlot} per slot
        </div>
      </div>

      <div className="pt-2 border-t border-orange-50">
        {slug ? (
          <Link
            href={`/temples/${slug}/book?poojaId=${pooja.id}`}
            className="w-full block text-center bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold text-sm py-2.5 rounded-xl transition-all shadow-sm hover:shadow-orange-200 hover:shadow-md"
          >
            🕉 Book This Pooja
          </Link>
        ) : (
          <p className="text-xs text-gray-400 text-center">Select a temple to book</p>
        )}
      </div>
      </div>
    </div>
  );
}
