// app/api/payment/create-order/route.ts
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { prisma } from '@/lib/prisma';
import { sanitizeRcNumber } from '@/lib/vehicleService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email: rawEmail, plan, targetRc: rawRc } = body;

    if (!rawEmail || !rawEmail.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const email = rawEmail.trim().toLowerCase();
    const cleanRc = rawRc ? sanitizeRcNumber(rawRc) : null;

    let amountInr = 49;
    let creditsAdded = 3;

    if (plan === 'CREDITS_49') {
      amountInr = 49;
      creditsAdded = 3;
    } else if (plan === 'CREDITS_99') {
      amountInr = 99;
      creditsAdded = 8;
    } else if (plan === 'RTO_DOSSIER_10') {
      amountInr = 10;
      creditsAdded = 0;
      if (!cleanRc) {
        return NextResponse.json({ error: 'Vehicle RC required for RTO Dossier' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    let orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // If Razorpay live/test keys are provided in environment
    if (keyId && keySecret && !keyId.includes('placeholder')) {
      try {
        const rzp = new Razorpay({
          key_id: keyId.trim(),
          key_secret: keySecret.trim(),
        });

        const rzpOrder = await rzp.orders.create({
          amount: amountInr * 100, // paise
          currency: 'INR',
          receipt: `rcpt_${Date.now().toString().slice(-8)}`,
          notes: {
            userEmail: email,
            plan,
            targetRc: cleanRc || '',
          },
        });

        if (rzpOrder?.id) {
          orderId = rzpOrder.id;
        }
      } catch (rzpErr) {
        console.warn('Razorpay API notice, using fallback order:', rzpErr);
      }
    }

    // Ensure user exists
    await prisma.userAccount.upsert({
      where: { email },
      update: {},
      create: { email, credits: 1 },
    });

    // Record transaction in DB
    const transaction = await prisma.paymentTransaction.create({
      data: {
        userEmail: email,
        orderType: plan,
        amountInr,
        creditsAdded,
        targetRc: cleanRc,
        razorpayOrderId: orderId,
        status: 'created',
      },
    });

    return NextResponse.json({
      success: true,
      orderId,
      amountInr,
      amountPaise: amountInr * 100,
      currency: 'INR',
      keyId: keyId || 'rzp_test_placeholder',
      plan,
      targetRc: cleanRc,
      transactionId: transaction.id,
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
