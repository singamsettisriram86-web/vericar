// app/api/vehicle/[rcNumber]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getVehicleReport, sanitizeRcNumber } from '@/lib/vehicleService';
import { estimateMaintenanceCost } from '@/lib/costEstimatorService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ rcNumber: string }> }
) {
  try {
    const { rcNumber: rawRc } = await params;
    if (!rawRc || rawRc.trim().length < 4) {
      return NextResponse.json(
        { error: 'Invalid or missing RC number' },
        { status: 400 }
      );
    }

    const rcNumber = sanitizeRcNumber(rawRc);
    const vehicle = await getVehicleReport(rcNumber);

    const maintenance = await estimateMaintenanceCost({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.registrationYear,
      odometer: vehicle.estimatedOdometerKm,
      fuelType: vehicle.fuelType,
    });

    return NextResponse.json({
      success: true,
      vehicle,
      maintenance,
    });
  } catch (error) {
    console.error('Error fetching vehicle report:', error);
    return NextResponse.json(
      { error: 'Unable to fetch vehicle history. Please check the RC number.' },
      { status: 500 }
    );
  }
}
