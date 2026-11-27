import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateBookingCode, generateTransactionId } from "@/lib/slots";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const url = new URL(req.url);
  const all = url.searchParams.get("all");

  try {
    if (all === "true" && session.role === "ADMIN") {
      const bookings = await prisma.booking.findMany({
        include: {
          user: { select: { name: true, email: true, phone: true } },
          temple: { select: { name: true, slug: true } },
          pooja: { select: { name: true, priceInr: true } },
          priest: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ bookings });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: session.userId },
      include: {
        temple: { select: { name: true, slug: true, imageUrl: true, location: true } },
        pooja: { select: { name: true, priceInr: true, durationMins: true, mode: true } },
        priest: { select: { name: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (err) {
    console.error("Bookings GET:", err);
    return NextResponse.json({ error: "Failed to fetch bookings." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      templeId, poojaId, priestId, slotDate, slotTime,
      mode, devoteeName, devoteePhone, gotra, nakshatra,
      sankalpamNotes, prasadAddress, paymentMethod,
    } = body;

    if (!templeId || !poojaId || !slotDate || !slotTime) {
      return NextResponse.json({ error: "Missing required booking fields." }, { status: 400 });
    }

    const pooja = await prisma.poojaService.findUnique({ where: { id: poojaId } });
    if (!pooja) {
      return NextResponse.json({ error: "Pooja service not found." }, { status: 404 });
    }

    // Count existing bookings for this slot
    const slotCount = await prisma.booking.count({
      where: {
        poojaId,
        slotDate,
        slotTime,
        status: { not: "CANCELLED" },
      },
    });

    if (slotCount >= pooja.maxPerSlot) {
      return NextResponse.json({ error: "Selected slot is fully booked. Please choose another time." }, { status: 409 });
    }

    const bookingCode = generateBookingCode();
    const transactionId = generateTransactionId(paymentMethod ?? "UPI");

    const booking = await prisma.booking.create({
      data: {
        bookingCode,
        userId: session.userId,
        templeId,
        poojaId,
        priestId: priestId ?? null,
        slotDate,
        slotTime,
        mode: mode ?? "IN_PERSON",
        devoteeName: devoteeName ?? session.name,
        devoteePhone: devoteePhone ?? "",
        gotra: gotra ?? null,
        nakshatra: nakshatra ?? null,
        sankalpamNotes: sankalpamNotes ?? null,
        prasadAddress: prasadAddress ?? null,
        amountInr: pooja.priceInr,
        status: "CONFIRMED",
        paymentStatus: "PAID",
        paymentMethod: paymentMethod ?? "UPI",
        transactionId,
        paidAt: new Date(),
      },
      include: {
        temple: { select: { name: true, slug: true } },
        pooja: { select: { name: true } },
        priest: { select: { name: true } },
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err) {
    console.error("Booking POST:", err);
    return NextResponse.json({ error: "Booking failed. Please try again." }, { status: 500 });
  }
}
