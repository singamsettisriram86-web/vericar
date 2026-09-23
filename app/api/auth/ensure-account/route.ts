// app/api/auth/ensure-account/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const displayName = name?.trim() || cleanEmail.split('@')[0];

    // Upsert: create if not exists, update name if already exists
    const user = await prisma.userAccount.upsert({
      where: { email: cleanEmail },
      update: { name: displayName },
      create: {
        email: cleanEmail,
        name: displayName,
        credits: 1, // 1 Free Inspection Credit on signup
      },
    });

    return NextResponse.json({ success: true, user: { email: user.email, name: user.name, credits: user.credits } });
  } catch (err) {
    console.error('[ensure-account] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
