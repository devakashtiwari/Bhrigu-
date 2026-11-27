import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateBookingCode, generateTransactionId } from "@/lib/slots";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const templeId = url.searchParams.get("templeId");
    const featured = url.searchParams.get("featured");
    const state = url.searchParams.get("state");
    const search = url.searchParams.get("search");

    const temples = await prisma.temple.findMany({
      where: {
        isActive: true,
        ...(templeId ? { id: templeId } : {}),
        ...(featured === "true" ? { featured: true } : {}),
        ...(state ? { state } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search } },
                { location: { contains: search } },
                { deity: { contains: search } },
              ],
            }
          : {}),
      },
      include: {
        poojas: { where: { isActive: true }, orderBy: { priceInr: "asc" } },
        priests: { where: { isAvailable: true } },
        _count: { select: { bookings: true } },
      },
      orderBy: [{ featured: "desc" }, { rating: "desc" }],
    });

    return NextResponse.json({ temples });
  } catch (err) {
    console.error("Temples GET:", err);
    return NextResponse.json({ error: "Failed to fetch temples." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      slug, name, location, state, deity, tradition,
      description, imageUrl, timings,
    } = body;

    if (!slug || !name || !location || !deity) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const temple = await prisma.temple.create({
      data: {
        slug, name, location, state: state ?? location.split(",").pop()?.trim() ?? "",
        deity, tradition: tradition ?? "Hindu",
        description: description ?? "", imageUrl: imageUrl ?? "/images/hero-temple.jpg",
        timings: timings ?? "6:00 AM – 9:00 PM",
        managerId: session.userId,
      },
    });

    return NextResponse.json({ temple }, { status: 201 });
  } catch (err) {
    console.error("Temple POST:", err);
    return NextResponse.json({ error: "Failed to create temple." }, { status: 500 });
  }
}
