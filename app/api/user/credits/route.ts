// app/api/user/credits/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitizeRcNumber } from '@/lib/vehicleService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawEmail = searchParams.get('email');

  if (!rawEmail || !rawEmail.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  const email = rawEmail.trim().toLowerCase();

  try {
    // Find or automatically create user with 1 FREE credit!
    let user = await prisma.userAccount.findUnique({
      where: { email },
      include: {
        inspections: true,
        unlockedDossiers: true,
      },
    });

    if (!user) {
      user = await prisma.userAccount.create({
        data: {
          email,
          credits: 1, // 1 Free Inspection Credit on signup
          inspectionsCount: 0,
        },
        include: {
          inspections: true,
          unlockedDossiers: true,
        },
      });
    }

    const inspectedRcs = user.inspections.map((i) => i.vehicleRc);
    const unlockedDossiers = user.unlockedDossiers.map((u) => u.vehicleRc);

    return NextResponse.json({
      email: user.email,
      credits: user.credits,
      inspectionsCount: user.inspectionsCount,
      inspectedRcs,
      unlockedDossiers,
    });
  } catch (error) {
    console.error('Error fetching user credits:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawEmail = body.email;
    const rawRc = body.rcNumber;

    if (!rawEmail || !rawEmail.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    if (!rawRc) {
      return NextResponse.json({ error: 'RC Number required' }, { status: 400 });
    }

    const email = rawEmail.trim().toLowerCase();
    const cleanRc = sanitizeRcNumber(rawRc);

    // Fetch user
    let user = await prisma.userAccount.findUnique({
      where: { email },
      include: { inspections: true },
    });

    if (!user) {
      user = await prisma.userAccount.create({
        data: {
          email,
          credits: 1, // Free 1st credit
        },
        include: { inspections: true },
      });
    }

    // Check if user already unlocked / inspected this vehicle before
    const alreadyInspected = user.inspections.some((i) => i.vehicleRc === cleanRc);
    if (alreadyInspected) {
      return NextResponse.json({
        success: true,
        credits: user.credits,
        alreadyInspected: true,
      });
    }

    // If new car and user has no credits left
    if (user.credits <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'INSUFFICIENT_CREDITS',
          message: 'You have used your free inspection. Recharge to unlock more vehicle audits.',
          credits: 0,
        },
        { status: 403 }
      );
    }

    // Deduct 1 credit and log inspection
    const updated = await prisma.$transaction([
      prisma.userAccount.update({
        where: { email },
        data: {
          credits: { decrement: 1 },
          inspectionsCount: { increment: 1 },
        },
      }),
      prisma.userInspection.create({
        data: {
          userEmail: email,
          vehicleRc: cleanRc,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      credits: updated[0].credits,
      alreadyInspected: false,
    });
  } catch (error) {
    console.error('Error deducting credit:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
