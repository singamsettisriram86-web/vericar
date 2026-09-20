// app/api/vehicle/[rcNumber]/full-rto/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getFullRtoDossier, sanitizeRcNumber } from '@/lib/vehicleService';

export async function GET(
  request: Request,
  props: { params: Promise<{ rcNumber: string }> }
) {
  const { rcNumber: rawRc } = await props.params;
  const { searchParams } = new URL(request.url);
  const rawEmail = searchParams.get('email');

  if (!rawRc) {
    return NextResponse.json({ error: 'RC number required' }, { status: 400 });
  }

  const cleanRc = sanitizeRcNumber(rawRc);
  const email = rawEmail ? rawEmail.trim().toLowerCase() : null;

  try {
    const fullDossier = await getFullRtoDossier(cleanRc);

    // Check if current user has unlocked this dossier
    let isUnlocked = false;
    if (email) {
      const record = await prisma.unlockedDossier.findUnique({
        where: {
          userEmail_vehicleRc: {
            userEmail: email,
            vehicleRc: cleanRc,
          },
        },
      });
      if (record) isUnlocked = true;
    }

    if (isUnlocked) {
      return NextResponse.json({
        unlocked: true,
        dossier: fullDossier,
      });
    }

    // Return masked teaser preview to inspire confidence
    const maskStr = (str: string, keepCount = 3) => {
      if (!str || str.length <= keepCount) return '••••••';
      return str.slice(0, keepCount) + '••••••••••' + str.slice(-2);
    };

    const maskedPreview = {
      rcNumber: fullDossier.rcNumber,
      registrationDate: fullDossier.registrationDate,
      rcExpiryDate: fullDossier.rcExpiryDate,
      ownerName: fullDossier.ownerName,
      ownerSerial: fullDossier.ownerSerial,
      fatherName: maskStr(fullDossier.fatherName || 'On Record', 2),
      presentAddress: maskStr(fullDossier.presentAddress, 10),
      permanentAddress: maskStr(fullDossier.permanentAddress, 10),
      vehicleClass: fullDossier.vehicleClass,
      bodyType: fullDossier.bodyType,
      makerDescription: fullDossier.makerDescription,
      makerModel: fullDossier.makerModel,
      fuelType: fullDossier.fuelType,
      emissionNorms: fullDossier.emissionNorms,
      engineNumber: maskStr(fullDossier.engineNumber, 3),
      chassisNumber: maskStr(fullDossier.chassisNumber, 4),
      cubicCapacityCc: fullDossier.cubicCapacityCc,
      cylindersCount: fullDossier.cylindersCount,
      seatingCapacity: fullDossier.seatingCapacity,
      standingCapacity: fullDossier.standingCapacity,
      sleeperCapacity: fullDossier.sleeperCapacity,
      unladenWeightKg: fullDossier.unladenWeightKg,
      grossVehicleWeightKg: fullDossier.grossVehicleWeightKg,
      wheelbaseMm: fullDossier.wheelbaseMm,
      color: fullDossier.color,
      registeringAuthority: fullDossier.registeringAuthority,
      rtoState: fullDossier.rtoState,
      taxUpto: fullDossier.taxUpto,
      taxMode: fullDossier.taxMode,
      insuranceCompany: fullDossier.insuranceCompany,
      insurancePolicyNumber: maskStr(fullDossier.insurancePolicyNumber, 4),
      insuranceExpiryDate: fullDossier.insuranceExpiryDate,
      puccNumber: maskStr(fullDossier.puccNumber, 4),
      puccExpiryDate: fullDossier.puccExpiryDate,
      financed: fullDossier.financed,
      financerName: fullDossier.financerName,
      hypothecationType: fullDossier.hypothecationType,
      rcStatus: fullDossier.rcStatus,
      blacklistStatus: fullDossier.blacklistStatus,
      challanCount: fullDossier.challanCount,
    };

    return NextResponse.json({
      unlocked: false,
      preview: maskedPreview,
    });
  } catch (error) {
    console.error('Error fetching RTO extract:', error);
    return NextResponse.json({ error: 'Failed to retrieve RTO extract' }, { status: 500 });
  }
}
