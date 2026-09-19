// lib/vehicleService.ts
import { prisma } from './prisma';

export interface VehicleReportData {
  rcNumber: string;
  ownerName: string;
  ownerCount: number;
  makerModel: string;
  make: string;
  model: string;
  variant: string;
  vehicleClass: string;
  regDate: string;
  registrationYear: number;
  vehicleAgeYears: number;
  fuelType: string;
  emissionNorm: string;
  rtoLocation: string;
  rtoState: string;
  insuranceCompany: string;
  insuranceExpiry: string;
  insuranceStatus: 'ACTIVE' | 'EXPIRED' | 'EXPIRING_SOON';
  fitnessUpto: string;
  pucUpto: string;
  pucStatus: 'ACTIVE' | 'EXPIRED';
  chassisLast4: string;
  engineLast4: string;
  color: string;
  financer: string | null;
  hypothecationStatus: string;
  blacklistStatus: 'CLEAN' | 'CHALLAN_PENDING' | 'BLACKLISTED';
  pendingChallansCount: number;
  pendingChallansAmount: number;
  estimatedOdometerKm: number;
  trustScore: number; // 0-100
  dataSource: 'VAHAN_API' | 'LOCAL_CACHE' | 'RTO_SIMULATION';
}

const RTO_STATE_MAP: Record<string, { state: string; city: string }> = {
  KA: { state: 'Karnataka', city: 'Bengaluru Central (KA-01)' },
  MH: { state: 'Maharashtra', city: 'Mumbai West (MH-02)' },
  DL: { state: 'Delhi', city: 'Delhi Sheikh Sarai (DL-03)' },
  TN: { state: 'Tamil Nadu', city: 'Chennai Central (TN-01)' },
  TS: { state: 'Telangana', city: 'Hyderabad Central (TS-09)' },
  UP: { state: 'Uttar Pradesh', city: 'Noida (UP-16)' },
  HR: { state: 'Haryana', city: 'Gurugram (HR-26)' },
  GJ: { state: 'Gujarat', city: 'Ahmedabad (GJ-01)' },
  KL: { state: 'Kerala', city: 'Ernakulam (KL-07)' },
  WB: { state: 'West Bengal', city: 'Kolkata (WB-01)' },
};

const SAMPLE_VEHICLES: Record<string, Partial<VehicleReportData>> = {
  KA01AB1234: {
    ownerName: 'Rahul V. Sharma',
    ownerCount: 1,
    makerModel: 'Maruti Suzuki Swift ZXi',
    make: 'Maruti Suzuki',
    model: 'Swift',
    variant: 'ZXi 1.2L DualJet',
    vehicleClass: 'Motor Car (LMV)',
    regDate: '14-Mar-2020',
    registrationYear: 2020,
    fuelType: 'Petrol',
    emissionNorm: 'BS-VI',
    rtoLocation: 'Bengaluru Central (KA-01)',
    rtoState: 'Karnataka',
    insuranceCompany: 'HDFC ERGO General Insurance',
    insuranceExpiry: '12-Mar-2027',
    insuranceStatus: 'ACTIVE',
    fitnessUpto: '13-Mar-2035',
    pucUpto: '10-Nov-2026',
    pucStatus: 'ACTIVE',
    chassisLast4: '8821',
    engineLast4: '4390',
    color: 'Pearl Arctic White',
    financer: 'HDFC Bank Ltd (Hypothecation Cleared)',
    hypothecationStatus: 'NOC Issued / Hypothecation Free',
    blacklistStatus: 'CLEAN',
    pendingChallansCount: 0,
    pendingChallansAmount: 0,
    estimatedOdometerKm: 42500,
    trustScore: 94,
  },
  DL3CCA1234: {
    ownerName: 'Amanpreet Singh',
    ownerCount: 1,
    makerModel: 'Hyundai Creta SX (O) Diesel',
    make: 'Hyundai',
    model: 'Creta',
    variant: 'SX (O) 1.5 CRDi AT',
    vehicleClass: 'Motor Car (LMV)',
    regDate: '21-Aug-2021',
    registrationYear: 2021,
    fuelType: 'Diesel',
    emissionNorm: 'BS-VI',
    rtoLocation: 'Delhi Sheikh Sarai (DL-03)',
    rtoState: 'Delhi',
    insuranceCompany: 'ICICI Lombard GIC Ltd',
    insuranceExpiry: '19-Aug-2026',
    insuranceStatus: 'ACTIVE',
    fitnessUpto: '20-Aug-2036',
    pucUpto: '15-Jan-2027',
    pucStatus: 'ACTIVE',
    chassisLast4: '3104',
    engineLast4: '9924',
    color: 'Titan Grey Metallic',
    financer: 'Kotak Mahindra Prime Ltd',
    hypothecationStatus: 'Active Hypothecation',
    blacklistStatus: 'CHALLAN_PENDING',
    pendingChallansCount: 1,
    pendingChallansAmount: 1000,
    estimatedOdometerKm: 51200,
    trustScore: 88,
  },
  MH02CD5678: {
    ownerName: 'Vikram S. Kulkarni',
    ownerCount: 2,
    makerModel: 'Honda City ZX CVT',
    make: 'Honda',
    model: 'City',
    variant: 'ZX 1.5 i-VTEC CVT',
    vehicleClass: 'Motor Car (LMV)',
    regDate: '10-Feb-2019',
    registrationYear: 2019,
    fuelType: 'Petrol',
    emissionNorm: 'BS-IV',
    rtoLocation: 'Mumbai West (MH-02)',
    rtoState: 'Maharashtra',
    insuranceCompany: 'Bajaj Allianz GIC Ltd',
    insuranceExpiry: '08-Feb-2027',
    insuranceStatus: 'ACTIVE',
    fitnessUpto: '09-Feb-2034',
    pucUpto: '18-Oct-2026',
    pucStatus: 'ACTIVE',
    chassisLast4: '6543',
    engineLast4: '1287',
    color: 'Platinum White Pearl',
    financer: null,
    hypothecationStatus: 'Free of Encumbrance',
    blacklistStatus: 'CLEAN',
    pendingChallansCount: 0,
    pendingChallansAmount: 0,
    estimatedOdometerKm: 68000,
    trustScore: 86,
  },
  TS09EF9012: {
    ownerName: 'K. Sneha Reddy',
    ownerCount: 1,
    makerModel: 'Tata Nexon Fearless Plus S',
    make: 'Tata',
    model: 'Nexon',
    variant: 'Fearless+ S 1.2 Turbo',
    vehicleClass: 'Motor Car (LMV)',
    regDate: '05-Dec-2022',
    registrationYear: 2022,
    fuelType: 'Petrol',
    emissionNorm: 'BS-VI Phase 2',
    rtoLocation: 'Hyderabad Central (TS-09)',
    rtoState: 'Telangana',
    insuranceCompany: 'Tata AIG General Insurance',
    insuranceExpiry: '04-Dec-2027',
    insuranceStatus: 'ACTIVE',
    fitnessUpto: '04-Dec-2037',
    pucUpto: '20-Nov-2026',
    pucStatus: 'ACTIVE',
    chassisLast4: '4718',
    engineLast4: '5501',
    color: 'Daytona Grey with Dual Tone Roof',
    financer: 'State Bank of India',
    hypothecationStatus: 'Active Hypothecation',
    blacklistStatus: 'CLEAN',
    pendingChallansCount: 0,
    pendingChallansAmount: 0,
    estimatedOdometerKm: 28400,
    trustScore: 96,
  }
};

export function sanitizeRcNumber(rc: string): string {
  return rc.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export async function getVehicleReport(rawRc: string): Promise<VehicleReportData> {
  const rc = sanitizeRcNumber(rawRc);

  // 1. Check SQLite Cache
  try {
    const existing = await prisma.vehicle.findUnique({ where: { rcNumber: rc } });
    if (existing && existing.rawDetails) {
      const parsed = JSON.parse(existing.rawDetails) as VehicleReportData;
      return { ...parsed, dataSource: 'LOCAL_CACHE' };
    }
  } catch {
    // continue if DB read has issues
  }

  // 2. Check if known sample or generate deterministic realistic Indian vehicle
  let vehicleData: VehicleReportData;

  if (SAMPLE_VEHICLES[rc]) {
    const sample = SAMPLE_VEHICLES[rc];
    const currentYear = new Date().getFullYear();
    const age = Math.max(0.5, currentYear - (sample.registrationYear || 2020));
    vehicleData = {
      rcNumber: rc,
      ownerName: sample.ownerName || 'Verified Citizen',
      ownerCount: sample.ownerCount || 1,
      makerModel: sample.makerModel || 'Maruti Suzuki Swift VXi',
      make: sample.make || 'Maruti Suzuki',
      model: sample.model || 'Swift',
      variant: sample.variant || 'VXi',
      vehicleClass: sample.vehicleClass || 'Motor Car (LMV)',
      regDate: sample.regDate || '12-May-2020',
      registrationYear: sample.registrationYear || 2020,
      vehicleAgeYears: Number(age.toFixed(1)),
      fuelType: sample.fuelType || 'Petrol',
      emissionNorm: sample.emissionNorm || 'BS-VI',
      rtoLocation: sample.rtoLocation || 'Bengaluru RTO (KA-01)',
      rtoState: sample.rtoState || 'Karnataka',
      insuranceCompany: sample.insuranceCompany || 'National Insurance Co. Ltd',
      insuranceExpiry: sample.insuranceExpiry || '10-May-2027',
      insuranceStatus: sample.insuranceStatus || 'ACTIVE',
      fitnessUpto: sample.fitnessUpto || '11-May-2035',
      pucUpto: sample.pucUpto || '15-Dec-2026',
      pucStatus: sample.pucStatus || 'ACTIVE',
      chassisLast4: sample.chassisLast4 || '4921',
      engineLast4: sample.engineLast4 || '7812',
      color: sample.color || 'Arctic White',
      financer: sample.financer || null,
      hypothecationStatus: sample.hypothecationStatus || 'Free of Encumbrance',
      blacklistStatus: sample.blacklistStatus || 'CLEAN',
      pendingChallansCount: sample.pendingChallansCount || 0,
      pendingChallansAmount: sample.pendingChallansAmount || 0,
      estimatedOdometerKm: sample.estimatedOdometerKm || Math.round(age * 11000),
      trustScore: sample.trustScore || 90,
      dataSource: 'RTO_SIMULATION',
    };
  } else {
    // Generate realistic record based on State Code
    const statePrefix = rc.substring(0, 2);
    const rtoInfo = RTO_STATE_MAP[statePrefix] || { state: 'India (Central RTO)', city: `${statePrefix} RTO Division` };
    
    // Deterministic seed based on RC digits
    const hash = rc.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const carCatalogue = [
      { make: 'Maruti Suzuki', model: 'Baleno', variant: 'Zeta 1.2', class: 'Motor Car (LMV)', fuel: 'Petrol', color: 'Nexa Blue' },
      { make: 'Hyundai', model: 'i20', variant: 'Asta (O) 1.2', class: 'Motor Car (LMV)', fuel: 'Petrol', color: 'Polar White' },
      { make: 'Tata', model: 'Punch', variant: 'Creative Dazzle', class: 'Motor Car (LMV)', fuel: 'Petrol', color: 'Tropical Mist' },
      { make: 'Kia', model: 'Seltos', variant: 'HTX 1.5 Diesel', class: 'Motor Car (LMV)', fuel: 'Diesel', color: 'Gravity Grey' },
      { make: 'Mahindra', model: 'Thar', variant: 'LX 4x4 Hard Top', class: 'Motor Car (LMV)', fuel: 'Diesel', color: 'Napoli Black' },
      { make: 'Toyota', model: 'Innova Crysta', variant: '2.4 GX 7S', class: 'Motor Car (LMV)', fuel: 'Diesel', color: 'Silver Metallic' },
      { make: 'Honda', model: 'Amaze', variant: 'VX CVT', class: 'Motor Car (LMV)', fuel: 'Petrol', color: 'Radiant Red' },
    ];

    const car = carCatalogue[hash % carCatalogue.length];
    const regYear = 2017 + (hash % 7); // 2017 to 2023
    const age = Math.max(1, new Date().getFullYear() - regYear);
    const ownerCount = (hash % 10 > 7) ? 2 : 1;
    const hasChallan = (hash % 5 === 0);

    vehicleData = {
      rcNumber: rc,
      ownerName: `${['Rajesh', 'Pooja', 'Anand', 'Kavita', 'Sanjay', 'Arun', 'Deepak'][hash % 7]} ${['K.', 'M.', 'S.', 'V.', 'R.'][hash % 5]} ${['Gupta', 'Patel', 'Nair', 'Iyer', 'Sharma', 'Reddy'][hash % 6]}`,
      ownerCount,
      makerModel: `${car.make} ${car.model} ${car.variant}`,
      make: car.make,
      model: car.model,
      variant: car.variant,
      vehicleClass: car.class,
      regDate: `18-Jun-${regYear}`,
      registrationYear: regYear,
      vehicleAgeYears: Number(age.toFixed(1)),
      fuelType: car.fuel,
      emissionNorm: regYear >= 2020 ? 'BS-VI' : 'BS-IV',
      rtoLocation: rtoInfo.city,
      rtoState: rtoInfo.state,
      insuranceCompany: ['Bajaj Allianz', 'HDFC ERGO', 'ICICI Lombard', 'Tata AIG', 'United India Insurance'][hash % 5],
      insuranceExpiry: `15-Jun-${new Date().getFullYear() + 1}`,
      insuranceStatus: 'ACTIVE',
      fitnessUpto: `17-Jun-${regYear + 15}`,
      pucUpto: `20-Dec-${new Date().getFullYear()}`,
      pucStatus: 'ACTIVE',
      chassisLast4: String(1000 + (hash * 37) % 9000),
      engineLast4: String(1000 + (hash * 53) % 9000),
      color: car.color,
      financer: hash % 2 === 0 ? 'State Bank of India (Hypothecated)' : null,
      hypothecationStatus: hash % 2 === 0 ? 'Active Hypothecation' : 'Free of Encumbrance',
      blacklistStatus: hasChallan ? 'CHALLAN_PENDING' : 'CLEAN',
      pendingChallansCount: hasChallan ? 1 : 0,
      pendingChallansAmount: hasChallan ? 1000 : 0,
      estimatedOdometerKm: Math.round(age * 12500),
      trustScore: hasChallan ? 82 : (ownerCount === 1 ? 92 : 84),
      dataSource: 'RTO_SIMULATION',
    };
  }

  // Persist into SQLite
  try {
    await prisma.vehicle.upsert({
      where: { rcNumber: rc },
      update: {
        rawDetails: JSON.stringify(vehicleData),
        updatedAt: new Date(),
      },
      create: {
        rcNumber: rc,
        ownerName: vehicleData.ownerName,
        ownerCount: vehicleData.ownerCount,
        makerModel: vehicleData.makerModel,
        regDate: vehicleData.regDate,
        fuelType: vehicleData.fuelType,
        rtoLocation: vehicleData.rtoLocation,
        insuranceExpiry: vehicleData.insuranceExpiry,
        fitnessUpto: vehicleData.fitnessUpto,
        pucUpto: vehicleData.pucUpto,
        chassisLast4: vehicleData.chassisLast4,
        engineLast4: vehicleData.engineLast4,
        vehicleAgeYears: vehicleData.vehicleAgeYears,
        rawDetails: JSON.stringify(vehicleData),
      },
    });
  } catch {
    // Continue smoothly
  }

  return vehicleData;
}
