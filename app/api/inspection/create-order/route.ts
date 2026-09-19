// app/api/inspection/create-order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rcNumber, customerName, city } = body;

    const amountInr = 499;
    const amountPaise = amountInr * 100;

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
