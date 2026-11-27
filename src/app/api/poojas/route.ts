import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      templeId, name, category, description, benefits,
      durationMins, priceInr, mode, maxPerSlot, imageUrl,
    } = body;

    if (!templeId || !name || !priceInr) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const pooja = await prisma.poojaService.create({
      data: {
        templeId,
        name,
        category: category ?? "Archana",
        description: description ?? "",
        benefits: benefits ?? "",
        durationMins: Number(durationMins) || 60,
        priceInr: Number(priceInr),
        mode: mode ?? "BOTH",
        maxPerSlot: Number(maxPerSlot) || 5,
        imageUrl: imageUrl ?? null,
      },
    });

    return NextResponse.json({ pooja }, { status: 201 });
  } catch (err) {
    console.error("Pooja POST:", err);
    return NextResponse.json({ error: "Failed to create pooja service." }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const templeId = url.searchParams.get("templeId");

  const poojas = await prisma.poojaService.findMany({
    where: {
      isActive: true,
      ...(templeId ? { templeId } : {}),
    },
    include: { temple: { select: { name: true, slug: true } } },
    orderBy: { priceInr: "asc" },
  });

  return NextResponse.json({ poojas });
}
