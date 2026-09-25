// app/api/inspection/create-order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rcNumber, customerName, city } = body;

    const amountInr = 499;
    const amountPaise = amountInr * 100;

    // 1. Try Cashfree Live Order
    if (process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY) {
      try {
        const { createCashfreeOrder } = await import('@/lib/cashfree');
        const orderId = `vcr_insp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.vericar.online';

        const cfOrder = await createCashfreeOrder({
          orderId,
          orderAmount: amountInr,
          customerEmail: body.email || 'customer@vericar.online',
          customerPhone: body.phone || '9441230144',
          customerName: customerName || 'Valued Buyer',
          orderNote: `Doorstep Vehicle Inspection - ${rcNumber}`,
          returnUrl: `${appUrl}/book/${encodeURIComponent(rcNumber)}?order_id={order_id}`,
        });

        if (cfOrder?.payment_session_id) {
          return NextResponse.json({
            success: true,
            mode: 'LIVE_CASHFREE',
            orderId,
            paymentSessionId: cfOrder.payment_session_id,
            amount: amountPaise,
            amountInr,
            currency: 'INR',
          });
        }
      } catch (cfErr) {
        console.error('Cashfree inspection order error:', cfErr);
      }
    }

    const razorpayKey = process.env.RAZORPAY_KEY_ID;
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    if (razorpayKey && razorpaySecret && razorpayKey.trim() !== '' && !razorpayKey.includes('your_key')) {
      try {
        const razorpay = new Razorpay({
          key_id: razorpayKey,
          key_secret: razorpaySecret,
        });

        const order = await razorpay.orders.create({
          amount: amountPaise,
          currency: 'INR',
          receipt: `vericar_${rcNumber}_${Date.now()}`,
          notes: {
            vehicleRc: rcNumber,
            customerName: customerName || 'Valued Buyer',
            city: city || 'Bengaluru',
          },
        });

        return NextResponse.json({
          success: true,
          mode: 'LIVE_RAZORPAY',
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: razorpayKey,
        });
      } catch (err) {
        console.warn('Razorpay live order failed, switching to sandbox simulation:', err);
      }
    }

    // Interactive Demo / Sandbox order fallback
    const simulatedOrderId = `order_demo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return NextResponse.json({
      success: true,
      mode: 'DEMO_SANDBOX',
      orderId: simulatedOrderId,
      amount: amountPaise,
      amountInr,
      currency: 'INR',
      keyId: 'rzp_test_demo_vericar',
    });
  } catch (error) {
    console.error('Error creating inspection order:', error);
    return NextResponse.json(
      { error: 'Failed to initialize inspection payment order' },
      { status: 500 }
    );
  }
}
