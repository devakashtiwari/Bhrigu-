import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const temple = await prisma.temple.findUnique({
      where: { slug },
      include: {
        poojas: { where: { isActive: true }, orderBy: { priceInr: "asc" } },
        priests: { where: { isAvailable: true } },
        _count: { select: { bookings: true } },
      },
    });

    if (!temple) {
      return NextResponse.json({ error: "Temple not found." }, { status: 404 });
    }

    return NextResponse.json({ temple });
  } catch (err) {
    console.error("Temple by slug:", err);
    return NextResponse.json({ error: "Failed to fetch temple." }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const temple = await prisma.temple.update({
      where: { slug },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.timings !== undefined ? { timings: body.timings } : {}),
        ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
        ...(body.featured !== undefined ? { featured: body.featured } : {}),
        ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl } : {}),
      },
    });
    return NextResponse.json({ temple });
  } catch (err) {
    console.error("Temple PATCH:", err);
    return NextResponse.json({ error: "Failed to update temple." }, { status: 500 });
  }
}
