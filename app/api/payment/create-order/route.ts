// app/api/payment/create-order/route.ts
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { prisma } from '@/lib/prisma';
import { sanitizeRcNumber } from '@/lib/vehicleService';
import { createCashfreeOrder } from '@/lib/cashfree';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email: rawEmail, plan, targetRc: rawRc, phone } = body;

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
    } else if (plan === 'RTO_DOSSIER_39' || plan === 'RTO_DOSSIER_10') {
      amountInr = 39;
      creditsAdded = 0;
      if (!cleanRc) {
        return NextResponse.json({ error: 'Vehicle RC required for RTO Dossier' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Unique order ID (Cashfree requires <= 45 alphanumeric characters)
    let orderId = `vcr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    let paymentSessionId: string | null = null;
    let gateway = 'cashfree';

    // 1. Try Cashfree Live/Sandbox Order First
    if (process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY) {
      try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.vericar.online';
        const cfOrder = await createCashfreeOrder({
          orderId,
          orderAmount: amountInr,
          customerEmail: email,
          customerPhone: phone || '9441230144',
          orderNote: plan === 'RTO_DOSSIER_39' ? `VeriCar RTO Extract - ${cleanRc}` : `VeriCar Credits - ${plan}`,
          returnUrl: `${appUrl}/api/payment/cashfree-verify?order_id={order_id}&plan=${encodeURIComponent(plan)}&targetRc=${encodeURIComponent(cleanRc || '')}&email=${encodeURIComponent(email)}`,
        });

        if (cfOrder?.payment_session_id) {
          paymentSessionId = cfOrder.payment_session_id;
          gateway = 'cashfree';
        }
      } catch (cfErr) {
        console.error('Cashfree order creation error:', cfErr);
      }
    }

    // 2. Fallback to Razorpay if Cashfree was not configured
    if (!paymentSessionId && keyId && keySecret && !keyId.includes('placeholder')) {
      gateway = 'razorpay';
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
      gateway,
      paymentSessionId,
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
