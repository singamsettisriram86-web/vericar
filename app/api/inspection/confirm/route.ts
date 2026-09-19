// app/api/inspection/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitizeRcNumber } from '@/lib/vehicleService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      vehicleRc,
      customerName,
      customerPhone,
      customerEmail,
      city,
      inspectionDate,
      timeSlot,
      razorpayOrderId,
      razorpayPaymentId,
    } = body;

    if (!vehicleRc || !customerName || !customerPhone || !inspectionDate) {
      return NextResponse.json(
        { error: 'Missing required booking parameters' },
        { status: 400 }
      );
    }

    const cleanRc = sanitizeRcNumber(vehicleRc);

    const booking = await prisma.inspectionBooking.create({
      data: {
        vehicleRc: cleanRc,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        city: city || 'Bengaluru',
        inspectionDate,
        timeSlot: timeSlot || '10:00 AM - 01:00 PM',
        amountInr: 499,
        razorpayOrderId: razorpayOrderId || `demo_pay_${Date.now()}`,
        paymentStatus: razorpayPaymentId ? 'paid' : 'demo_confirmed',
        inspectionStatus: 'scheduled',
      },
    });

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      booking,
    });
  } catch (error) {
    console.error('Error confirming inspection booking:', error);
    return NextResponse.json(
      { error: 'Failed to record inspection booking' },
      { status: 500 }
    );
  }
}
