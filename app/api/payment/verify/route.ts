// app/api/payment/verify/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sanitizeRcNumber } from '@/lib/vehicleService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email: rawEmail,
      orderId,
      paymentId,
      signature,
      plan,
      targetRc: rawRc,
    } = body;

    if (!rawEmail || !rawEmail.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const email = rawEmail.trim().toLowerCase();
    const cleanRc = rawRc ? sanitizeRcNumber(rawRc) : null;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If live signature verification is possible
    if (keySecret && signature && orderId && paymentId) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret.trim())
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      if (generatedSignature !== signature) {
        return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
      }
    }

    // Determine credit additions or dossier unlock
    let creditsToAdd = 0;
    if (plan === 'CREDITS_49') {
      creditsToAdd = 3;
    } else if (plan === 'CREDITS_99') {
      creditsToAdd = 8;
    }

    // Update or create payment transaction
    if (orderId) {
      await prisma.paymentTransaction.updateMany({
        where: { razorpayOrderId: orderId },
        data: {
          razorpayPaymentId: paymentId || `pay_${Date.now()}`,
          razorpaySignature: signature || null,
          status: 'paid',
        },
      });
    }

    // Apply benefits
    if (creditsToAdd > 0) {
      const updatedUser = await prisma.userAccount.upsert({
        where: { email },
        update: {
          credits: { increment: creditsToAdd },
        },
        create: {
          email,
          credits: 1 + creditsToAdd,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Successfully added ${creditsToAdd} inspection credits!`,
        credits: updatedUser.credits,
        plan,
      });
    }

    if ((plan === 'RTO_DOSSIER_39' || plan === 'RTO_DOSSIER_10') && cleanRc) {
      // Record unlock in UnlockedDossier
      await prisma.unlockedDossier.upsert({
        where: {
          userEmail_vehicleRc: {
            userEmail: email,
            vehicleRc: cleanRc,
          },
        },
        update: {
          unlockedAt: new Date(),
        },
        create: {
          userEmail: email,
          vehicleRc: cleanRc,
        },
      });

      const user = await prisma.userAccount.findUnique({ where: { email } });

      return NextResponse.json({
        success: true,
        message: `Successfully unlocked complete RTO extract for ${cleanRc}!`,
        unlockedRc: cleanRc,
        credits: user?.credits || 0,
        plan,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
