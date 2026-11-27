import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, MapPin, Clock, Users, Wifi, Flame, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PoojaCard } from "@/components/PoojaCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const temple = await prisma.temple.findUnique({ where: { slug } });
  if (!temple) return { title: "Temple Not Found" };
  return {
    title: `${temple.name} | Bhrigu`,
    description: temple.description.substring(0, 160),
  };
}

export default async function TempleDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const temple = await prisma.temple.findUnique({
    where: { slug },
    include: {
      poojas: { where: { isActive: true }, orderBy: { priceInr: "asc" } },
      priests: { where: { isAvailable: true } },
      _count: { select: { bookings: true } },
    },
  });

  if (!temple) notFound();

  return (
    <div className="min-h-screen bg-orange-50/30">
      {/* Hero */}
      <div className="relative h-96 overflow-hidden">
        <Image
          src={temple.imageUrl}
          alt={temple.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

        <div className="absolute bottom-8 left-6 right-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-orange-500/90 text-white text-xs font-bold px-3 py-1 rounded-full">{temple.tradition}</span>
            <span className="text-orange-200 text-sm">{temple.deity}</span>
          </div>
          <h1 className="text-4xl font-bold font-serif text-white mb-2">{temple.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-stone-200">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-orange-300" />{temple.location}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-orange-300" />{temple.timings}</span>
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />{temple.rating} ({temple.reviewCount} reviews)
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-orange-300" />{temple._count.bookings} bookings
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-2xl border border-orange-100 p-6">
              <h2 className="text-xl font-bold font-serif text-gray-900 mb-3">About the Temple</h2>
              <p className="text-gray-700 leading-relaxed">{temple.description}</p>
            </div>

            {/* Pooja Services */}
            <div>
              <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">Available Pooja Services</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {temple.poojas.map((pooja) => (
                  <PoojaCard key={pooja.id} pooja={pooja} templeSlug={temple.slug} />
                ))}
              </div>
            </div>

            {/* Priests */}
            {temple.priests.length > 0 && (
              <div className="bg-white rounded-2xl border border-orange-100 p-6">
                <h2 className="text-xl font-bold font-serif text-gray-900 mb-5">Our Priests</h2>
                <div className="space-y-4">
                  {temple.priests.map((priest) => (
                    <div key={priest.id} className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-700 flex items-center justify-center shrink-0">
                        <span className="text-white text-lg font-bold">🕉</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{priest.name}</p>
                        <p className="text-sm text-orange-600">{priest.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {priest.experienceYrs} yrs experience · {priest.languages}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-100 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Available
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-5">
            {/* Quick book card */}
            <div className="bg-white rounded-2xl border border-orange-200 shadow-md p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 text-lg mb-1">Ready to Book?</h3>
              <p className="text-sm text-gray-500 mb-5">Select any pooja below to pick your slot and proceed to booking.</p>
              <div className="space-y-3">
                {temple.poojas.slice(0, 3).map((pooja) => (
                  <Link
                    key={pooja.id}
                    href={`/temples/${temple.slug}/book?poojaId=${pooja.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-100 hover:border-orange-200 transition-all group"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-orange-700 transition-colors leading-tight">{pooja.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{pooja.durationMins} min</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-orange-600">₹{pooja.priceInr.toLocaleString("en-IN")}</p>
                      <ChevronRight className="w-4 h-4 text-orange-400 ml-auto" />
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-5 pt-5 border-t border-orange-100 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Wifi className="w-4 h-4 text-orange-400" /> HD Live Streaming available
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Flame className="w-4 h-4 text-orange-400" /> Personalised Sankalpam
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="text-orange-400">📦</span> Prasad home delivery
                </div>
              </div>
            </div>

            {/* Temple info */}
            <div className="bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl p-5 text-white">
              <h3 className="font-bold mb-3">Temple Information</h3>
              <div className="space-y-2 text-sm text-orange-100">
                <div className="flex justify-between">
                  <span>Deity</span>
                  <span className="text-white font-medium">{temple.deity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tradition</span>
                  <span className="text-white font-medium">{temple.tradition}</span>
                </div>
                <div className="flex justify-between">
                  <span>Darshan Timings</span>
                  <span className="text-white font-medium text-right text-xs">{temple.timings}</span>
                </div>
                <div className="flex justify-between">
                  <span>Priests Available</span>
                  <span className="text-white font-medium">{temple.priests.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pooja Services</span>
                  <span className="text-white font-medium">{temple.poojas.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
