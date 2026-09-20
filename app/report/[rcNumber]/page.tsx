// app/report/[rcNumber]/page.tsx
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Wrench,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Zap,
  Gauge,
  MapPin,
  Clock,
  Printer,
  Sparkles,
  Car
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReportActions from '@/components/ReportActions';
import AuthGate from '@/components/AuthGate';
import { getVehicleReport, sanitizeRcNumber } from '@/lib/vehicleService';
import { estimateMaintenanceCost } from '@/lib/costEstimatorService';

interface ReportPageProps {
  params: Promise<{
    rcNumber: string;
  }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { rcNumber: rawRc } = await params;
  if (!rawRc) notFound();

  const cleanRc = sanitizeRcNumber(rawRc);
  const vehicle = await getVehicleReport(cleanRc);
  const maintenance = await estimateMaintenanceCost({
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.registrationYear,
    odometer: vehicle.estimatedOdometerKm,
    fuelType: vehicle.fuelType,
  });

  const isLowRisk = vehicle.trustScore >= 85;

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#171e19]">
      <Navbar />
      <AuthGate rcNumber={cleanRc} />

      <main className="pt-28 pb-20 bg-[#ffffff] bg-grid-light flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back link & audit id */}
          <div className="flex items-center justify-between py-4 mb-6 border-b border-[#171e19]/10">
            <Link
              href="/#verify"
              className="inline-flex items-center gap-2 font-satoshi text-xs font-bold uppercase tracking-wider text-[#171e19]/70 hover:text-[#171e19] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Verify Another Registration</span>
            </Link>

            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[#171e19]/50">
                DATA SOURCE: {vehicle.dataSource}
              </span>
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            </div>
          </div>

          {/* Top Hero Banner */}
          <div className="bg-[#171e19] text-white rounded-2xl p-8 sm:p-12 mb-8 brutalist-card-dark relative overflow-hidden border-2 border-[#171e19]">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3.5 py-1 bg-[#ffe17c] text-[#171e19] font-anton text-sm rounded tracking-wider">
                    {vehicle.rcNumber}
                  </span>
                  <span className="px-3 py-1 bg-white/10 text-white font-satoshi text-xs font-semibold uppercase tracking-wider rounded border border-white/10">
                    {vehicle.vehicleClass}
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 font-satoshi text-xs font-semibold uppercase tracking-wider rounded border border-green-500/30">
                    {vehicle.ownerCount === 1 ? '1ST OWNER REGISTERED' : `${vehicle.ownerCount} PREVIOUS OWNERS`}
                  </span>
                </div>

                <h1 className="font-anton text-4xl sm:text-6xl text-white tracking-tight leading-[0.95] mb-3">
                  {vehicle.makerModel}
                </h1>

                <p className="font-satoshi text-white/70 text-sm sm:text-base flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#ffe17c]" />
                    {vehicle.rtoLocation}
                  </span>
                  <span>•</span>
                  <span>Registered: {vehicle.regDate}</span>
                  <span>•</span>
                  <span>Age: {vehicle.vehicleAgeYears} Years</span>
                  <span>•</span>
                  <span>Odo Estimate: ~{vehicle.estimatedOdometerKm.toLocaleString('en-IN')} km</span>
                </p>
              </div>

              {/* Trust score & Booking CTA */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-4 shrink-0">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-left lg:text-right">
                  <span className="font-satoshi text-[11px] uppercase tracking-widest text-[#ffe17c] font-bold block">
                    CHASSIS TRUST SCORE
                  </span>
                  <div className="font-anton text-4xl sm:text-5xl text-white mt-0.5">
                    {vehicle.trustScore} <span className="text-xl text-white/50">/ 100</span>
                  </div>
                  <span className="font-satoshi text-xs text-white/60">
                    {isLowRisk ? 'Low Risk Profile' : 'Attention Required'}
                  </span>
                </div>

                <Link
                  href={`/book/${encodeURIComponent(vehicle.rcNumber)}`}
                  className="inline-flex items-center gap-2 bg-[#ffe17c] hover:bg-[#ffdc5c] text-[#171e19] font-anton text-base px-6 py-3.5 rounded-xl border border-[#171e19]/20 transition-all hover:scale-105 active:scale-95 shadow-xl"
                >
                  <Wrench className="w-4 h-4 text-[#171e19]" />
                  <span>BOOK 150-PT INSPECTION (₹499)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Action Bar: Download PDF, WhatsApp Share & Negotiation Advisory */}
          <ReportActions
            rcNumber={vehicle.rcNumber}
            makerModel={vehicle.makerModel}
            ownerName={vehicle.ownerName}
            insuranceStatus={vehicle.insuranceStatus}
            annualMaintenanceCostINR={maintenance.annualMaintenanceCostINR}
          />

          {/* Print-Only Official Certified Header */}
          <div className="hidden print-only mb-6 p-4 border-2 border-black">
            <div className="flex justify-between items-center pb-2 border-b border-black">
              <div>
                <h1 className="font-anton text-2xl tracking-wider">VERICAR AUTOMOTIVE AUDIT CERTIFICATE</h1>
                <p className="font-satoshi text-xs text-neutral-600">OFFICIAL SOVEREIGN VEHICLE VERIFICATION DOSSIER</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-bold">CERTIFICATE ID: VRC-{vehicle.rcNumber}</span>
                <p className="font-satoshi text-[10px] text-neutral-500">Issued: {new Date().toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Section 1: RTO Forensic Intelligence */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#171e19]/10">
              <h2 className="font-anton text-2xl sm:text-3xl text-[#171e19] tracking-tight">
                01 // SOVEREIGN RTO REGISTRY FORENSICS
              </h2>
              <span className="font-satoshi text-xs text-green-700 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                MoRTH Authenticated
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-5 bg-white rounded-xl border border-[#171e19]/15 brutalist-card">
                <span className="font-satoshi text-xs text-[#171e19]/50 uppercase tracking-wider font-semibold block">
                  Registered Owner
                </span>
                <p className="font-anton text-xl text-[#171e19] mt-1.5">
                  {vehicle.ownerName}
                </p>
                <p className="font-satoshi text-xs text-[#171e19]/60 mt-1">
                  Sequence: #{vehicle.ownerCount} Owner
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-[#171e19]/15 brutalist-card">
                <span className="font-satoshi text-xs text-[#171e19]/50 uppercase tracking-wider font-semibold block">
                  Bank Hypothecation
                </span>
                <p className={`font-anton text-xl mt-1.5 ${vehicle.financer ? 'text-amber-700' : 'text-green-700'}`}>
                  {vehicle.hypothecationStatus}
                </p>
                <p className="font-satoshi text-xs text-[#171e19]/60 mt-1">
                  {vehicle.financer || 'Free of legal liens'}
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-[#171e19]/15 brutalist-card">
                <span className="font-satoshi text-xs text-[#171e19]/50 uppercase tracking-wider font-semibold block">
                  Insurance Validity
                </span>
                <p className="font-anton text-xl text-[#171e19] mt-1.5">
                  {vehicle.insuranceExpiry}
                </p>
                <p className="font-satoshi text-xs text-[#171e19]/60 mt-1 truncate">
                  {vehicle.insuranceCompany}
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-[#171e19]/15 brutalist-card">
                <span className="font-satoshi text-xs text-[#171e19]/50 uppercase tracking-wider font-semibold block">
                  Fitness & Emission
                </span>
                <p className="font-anton text-xl text-[#171e19] mt-1.5">
                  {vehicle.fitnessUpto}
                </p>
                <p className="font-satoshi text-xs text-[#171e19]/60 mt-1">
                  Norm: {vehicle.emissionNorm} (PUC Active)
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-[#171e19]/15 brutalist-card">
                <span className="font-satoshi text-xs text-[#171e19]/50 uppercase tracking-wider font-semibold block">
                  Traffic Challan Status
                </span>
                <p className={`font-anton text-xl mt-1.5 ${vehicle.pendingChallansCount > 0 ? 'text-red-600' : 'text-green-700'}`}>
                  {vehicle.pendingChallansCount > 0 ? `${vehicle.pendingChallansCount} CHALLAN PENDING` : '0 PENDING CHALLANS'}
                </p>
                <p className="font-satoshi text-xs text-[#171e19]/60 mt-1">
                  {vehicle.pendingChallansCount > 0 ? `Total Fine: ₹${vehicle.pendingChallansAmount.toLocaleString('en-IN')}` : 'Police e-challan record clean'}
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-[#171e19]/15 brutalist-card">
                <span className="font-satoshi text-xs text-[#171e19]/50 uppercase tracking-wider font-semibold block">
                  Fuel Type & Color
                </span>
                <p className="font-anton text-xl text-[#171e19] mt-1.5">
                  {vehicle.fuelType}
                </p>
                <p className="font-satoshi text-xs text-[#171e19]/60 mt-1">
                  Exterior: {vehicle.color}
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-[#171e19]/15 brutalist-card">
                <span className="font-satoshi text-xs text-[#171e19]/50 uppercase tracking-wider font-semibold block">
                  Chassis & Engine Digits
                </span>
                <p className="font-anton text-xl text-[#171e19] mt-1.5">
                  ***{vehicle.chassisLast4} / ***{vehicle.engineLast4}
                </p>
                <p className="font-satoshi text-xs text-[#171e19]/60 mt-1">
                  Must match engine bay stamping
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-[#171e19]/15 brutalist-card">
                <span className="font-satoshi text-xs text-[#171e19]/50 uppercase tracking-wider font-semibold block">
                  RTO Authority
                </span>
                <p className="font-anton text-xl text-[#171e19] mt-1.5">
                  {vehicle.rtoState}
                </p>
                <p className="font-satoshi text-xs text-[#171e19]/60 mt-1 truncate">
                  {vehicle.rtoLocation}
                </p>
              </div>

            </div>
          </div>

          {/* Section 2: AI Maintenance Cost Projection */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#171e19]/10">
              <h2 className="font-anton text-2xl sm:text-3xl text-[#171e19] tracking-tight">
                02 // AI ANNUAL MAINTENANCE PROJECTIONS
              </h2>
              <span className="px-2.5 py-0.5 bg-[#ffe17c] text-[#171e19] font-anton text-xs rounded">
                INDIAN MARKET MODEL
              </span>
            </div>

            {/* Cost Overview Bento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              <div className="p-6 bg-[#ffe17c] text-[#171e19] rounded-2xl border-2 border-[#171e19] shadow-md brutalist-card">
                <span className="font-satoshi text-xs uppercase tracking-widest font-bold block text-[#171e19]/70">
                  PROJECTED ANNUAL EXPENSE
                </span>
                <div className="font-anton text-4xl sm:text-5xl text-[#171e19] mt-2">
                  ₹{maintenance.annualMaintenanceCostINR.toLocaleString('en-IN')}
                </div>
                <p className="font-satoshi text-xs text-[#171e19]/80 mt-2 font-medium">
                  Estimated for 10,000 - 12,000 km annual Indian city + highway driving.
                </p>
              </div>

              <div className="p-6 bg-[#171e19] text-white rounded-2xl border border-[#171e19] shadow-md brutalist-card-dark">
                <span className="font-satoshi text-xs uppercase tracking-widest font-bold block text-white/50">
                  MONTHLY EQUIVALENT
                </span>
                <div className="font-anton text-4xl sm:text-5xl text-white mt-2">
                  ₹{maintenance.monthlyEstimateINR.toLocaleString('en-IN')} <span className="text-lg text-white/40">/ MO</span>
                </div>
                <p className="font-satoshi text-xs text-white/60 mt-2">
                  Cost per km: ~₹{maintenance.costPerKmINR} / km (excluding fuel).
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-[#171e19]/15 shadow-md brutalist-card flex flex-col justify-between">
                <div>
                  <span className="font-satoshi text-xs uppercase tracking-widest font-bold block text-[#171e19]/50">
                    MAINTENANCE RISK LEVEL
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-3 py-1 font-anton text-lg rounded ${maintenance.maintenanceRiskTier === 'LOW' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                      {maintenance.maintenanceRiskTier} RISK
                    </span>
                  </div>
                </div>
                <p className="font-satoshi text-xs text-[#171e19]/70 mt-3">
                  {maintenance.modelRecommendation}
                </p>
              </div>

            </div>

            {/* Itemized Service Breakdown Table */}
            <div className="bg-white rounded-2xl border border-[#171e19]/15 overflow-hidden shadow-sm">
              <div className="p-5 bg-[#f8f9fa] border-b border-[#171e19]/10 flex items-center justify-between">
                <h3 className="font-anton text-lg sm:text-xl text-[#171e19] tracking-wider">
                  ITEMIZED SERVICE & WEAR FORECAST (12-MONTH HORIZON)
                </h3>
                <span className="font-satoshi text-xs text-[#171e19]/50 hidden sm:inline-block">
                  Indexed against OEM & Aftermarket pricing
                </span>
              </div>

              <div className="divide-y divide-[#171e19]/10">
                {maintenance.detailedItems.map((item, index) => (
                  <div key={index} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#f8f9fa] transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-anton text-base text-[#171e19] tracking-wide">
                          {item.name}
                        </span>
                        <span className="px-2 py-0.5 bg-[#171e19]/5 text-[#171e19]/70 font-satoshi text-[10px] font-bold uppercase rounded">
                          {item.category}
                        </span>
                      </div>
                      <p className="font-satoshi text-xs text-[#171e19]/60">
                        {item.notes} • Frequency: {item.frequency}
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="font-anton text-xl text-[#171e19]">
                        ₹{item.estimatedCostInr.toLocaleString('en-IN')}
                      </span>
                      <span className={`block font-satoshi text-[11px] font-bold ${item.urgency === 'HIGH' ? 'text-red-600' : 'text-[#171e19]/50'}`}>
                        {item.urgency} PRIORITY
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-[#ffe17c]/20 border-t border-[#171e19]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-satoshi text-[#171e19]">
                <p>
                  <strong>Insight:</strong> {maintenance.summaryInsight}
                </p>
                <span className="font-mono text-[11px] text-[#171e19]/60 shrink-0">
                  ESTIMATOR V2.4
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Physical Inspection CTA Banner */}
          <div className="bg-[#ffe17c] border-2 border-[#171e19] rounded-2xl p-8 sm:p-12 text-[#171e19] shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <span className="font-satoshi text-xs font-bold uppercase tracking-widest px-3 py-1 bg-white/70 rounded-full inline-block mb-4">
                  STEP 3 // PHYSICAL GROUND TRUTH
                </span>
                <h3 className="font-anton text-3xl sm:text-5xl tracking-tight leading-[0.9] mb-4">
                  WANT A CERTIFIED MECHANIC TO AUDIT THIS EXACT CAR?
                </h3>
                <p className="font-satoshi text-base sm:text-lg text-[#171e19]/80 leading-relaxed">
                  Book a doorstep 150-point inspection in Bengaluru, Delhi NCR, Mumbai, Hyderabad, or Chennai. Our technician will test compression, paint gauge micron levels, and check underbody frame alignment for just ₹499.
                </p>
              </div>

              <Link
                href={`/book/${encodeURIComponent(vehicle.rcNumber)}`}
                className="inline-flex items-center justify-center gap-3 bg-[#171e19] hover:bg-black text-white hover:text-[#ffe17c] font-anton text-xl px-8 py-5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl shrink-0 cursor-pointer"
              >
                <span>BOOK FOR ₹499</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
