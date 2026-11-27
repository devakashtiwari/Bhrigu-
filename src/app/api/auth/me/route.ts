import { NextResponse } from "next/server";
import { getCurrentUser, getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  return NextResponse.json({ user });
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, phone, gotra, nakshatra, rashi } = body;

    const updated = await prisma.user.update({
      where: { id: session.userId },
      data: {
        ...(name !== undefined ? { name: String(name).trim() } : {}),
        ...(phone !== undefined ? { phone: phone ? String(phone).trim() : null } : {}),
        ...(gotra !== undefined ? { gotra: gotra ? String(gotra).trim() : null } : {}),
        ...(nakshatra !== undefined
          ? { nakshatra: nakshatra ? String(nakshatra).trim() : null }
          : {}),
        ...(rashi !== undefined ? { rashi: rashi ? String(rashi).trim() : null } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gotra: true,
        nakshatra: true,
        rashi: true,
        role: true,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
