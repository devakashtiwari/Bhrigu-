import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const pooja = await prisma.poojaService.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.priceInr !== undefined ? { priceInr: Number(body.priceInr) } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.durationMins !== undefined ? { durationMins: Number(body.durationMins) } : {}),
        ...(body.maxPerSlot !== undefined ? { maxPerSlot: Number(body.maxPerSlot) } : {}),
        ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
      },
    });
    return NextResponse.json({ pooja });
  } catch (err) {
    console.error("Pooja PATCH:", err);
    return NextResponse.json({ error: "Failed to update pooja service." }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    await prisma.poojaService.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Pooja DELETE:", err);
    return NextResponse.json({ error: "Failed to delete pooja service." }, { status: 500 });
  }
}
