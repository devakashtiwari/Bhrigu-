import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        temple: true,
        pooja: true,
        priest: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    if (session.role !== "ADMIN" && booking.userId !== session.userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    return NextResponse.json({ booking });
  } catch (err) {
    console.error("Booking GET:", err);
    return NextResponse.json({ error: "Failed to fetch booking." }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const existing = await prisma.booking.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    if (session.role !== "ADMIN" && existing.userId !== session.userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    // Devotee can only cancel; admin can change status to anything
    const allowedStatus =
      session.role === "ADMIN"
        ? ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]
        : ["CANCELLED"];

    if (body.status && !allowedStatus.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status change." }, { status: 400 });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.paymentStatus !== undefined ? { paymentStatus: body.paymentStatus } : {}),
      },
    });

    return NextResponse.json({ booking });
  } catch (err) {
    console.error("Booking PATCH:", err);
    return NextResponse.json({ error: "Failed to update booking." }, { status: 500 });
  }
}
