// app/api/payment/cashfree-verify/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getCashfreeOrderStatus } from '@/lib/cashfree';
import { prisma } from '@/lib/prisma';
import { sanitizeRcNumber } from '@/lib/vehicleService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, email: rawEmail, plan, targetRc: rawRc } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // 1. Fetch real order status from Cashfree API
    const orderData = await getCashfreeOrderStatus(orderId);

    if (orderData.order_status !== 'PAID') {
      return NextResponse.json({
        success: false,
        status: orderData.order_status,
        message: `Order status is ${orderData.order_status}`,
      }, { status: 400 });
    }

    const email = (rawEmail || orderData.customer_details?.customer_email || '').trim().toLowerCase();
    const cleanRc = rawRc ? sanitizeRcNumber(rawRc) : null;

    // 2. Mark transaction as paid
    await prisma.paymentTransaction.updateMany({
      where: { razorpayOrderId: orderId },
      data: {
        razorpayPaymentId: orderData.cf_order_id ? `cf_${orderData.cf_order_id}` : `cf_${Date.now()}`,
        status: 'paid',
      },
    });

    // 3. Process credits or dossier unlock
    let creditsToAdd = 0;
    if (plan === 'CREDITS_49') {
      creditsToAdd = 3;
    } else if (plan === 'CREDITS_99') {
      creditsToAdd = 8;
    }

    if (creditsToAdd > 0 && email) {
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

    if ((plan === 'RTO_DOSSIER_39' || plan === 'RTO_DOSSIER_10') && cleanRc && email) {
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

    return NextResponse.json({ success: true, status: 'PAID' });
  } catch (error: any) {
    console.error('Cashfree POST verify error:', error);
    return NextResponse.json({ error: error?.message || 'Verification failed' }, { status: 500 });
  }
}

// Handles browser redirect from Cashfree return_url
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const orderId = searchParams.get('order_id');
  const plan = searchParams.get('plan');
  const targetRc = searchParams.get('targetRc');
  const email = searchParams.get('email');

  if (!orderId) {
    return NextResponse.redirect(`${origin}/`);
  }

  try {
    const orderData = await getCashfreeOrderStatus(orderId);

    if (orderData.order_status === 'PAID') {
      // Mark transaction paid
      await prisma.paymentTransaction.updateMany({
        where: { razorpayOrderId: orderId },
        data: {
          razorpayPaymentId: orderData.cf_order_id ? `cf_${orderData.cf_order_id}` : `cf_${Date.now()}`,
          status: 'paid',
        },
      });

      const userEmail = (email || orderData.customer_details?.customer_email || '').trim().toLowerCase();

      if (plan === 'CREDITS_49' || plan === 'CREDITS_99') {
        const credits = plan === 'CREDITS_49' ? 3 : 8;
        if (userEmail) {
          await prisma.userAccount.upsert({
            where: { email: userEmail },
            update: { credits: { increment: credits } },
            create: { email: userEmail, credits: 1 + credits },
          });
        }
        return NextResponse.redirect(`${origin}/?recharge=success`);
      }

      if ((plan === 'RTO_DOSSIER_39' || plan === 'RTO_DOSSIER_10') && targetRc && userEmail) {
        const cleanRc = sanitizeRcNumber(targetRc);
        await prisma.unlockedDossier.upsert({
          where: {
            userEmail_vehicleRc: {
              userEmail: userEmail,
              vehicleRc: cleanRc,
            },
          },
          update: { unlockedAt: new Date() },
          create: { userEmail: userEmail, vehicleRc: cleanRc },
        });
        return NextResponse.redirect(`${origin}/report/${encodeURIComponent(cleanRc)}?unlocked=true#rto-dossier`);
      }
    }
  } catch (err) {
    console.error('Cashfree GET verify error:', err);
  }

  if (targetRc) {
    return NextResponse.redirect(`${origin}/report/${encodeURIComponent(targetRc)}`);
  }
  return NextResponse.redirect(`${origin}/`);
}
