import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const [
      totalUsers, totalTemples, totalBookings, totalRevenue,
      recentBookings, bookingsByStatus, bookingsByMonth,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "DEVOTEE" } }),
      prisma.temple.count({ where: { isActive: true } }),
      prisma.booking.count(),
      prisma.booking.aggregate({
        _sum: { amountInr: true },
        where: { paymentStatus: "PAID" },
      }),
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          temple: { select: { name: true } },
          pooja: { select: { name: true } },
        },
      }),
      prisma.booking.groupBy({
        by: ["status"],
        _count: true,
      }),
      prisma.booking.groupBy({
        by: ["slotDate"],
        _count: true,
        orderBy: { slotDate: "asc" },
        take: 30,
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalTemples,
        totalBookings,
        totalRevenue: totalRevenue._sum.amountInr ?? 0,
      },
      recentBookings,
      bookingsByStatus,
      bookingsByMonth,
    });
  } catch (err) {
    console.error("Admin stats:", err);
    return NextResponse.json({ error: "Failed to fetch stats." }, { status: 500 });
  }
}
