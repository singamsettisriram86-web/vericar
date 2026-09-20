// components/RtoDossierSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  ShieldCheck,
  Lock,
  Unlock,
  Check,
  ArrowRight,
  Printer,
  Download,
  AlertCircle,
  Loader2,
  Sparkles,
  Info
} from 'lucide-react';
import type { FullRtoDossier } from '@/lib/vehicleService';

interface RtoDossierSectionProps {
  rcNumber: string;
  initialUnlocked?: boolean;
}

export default function RtoDossierSection({
  rcNumber,
  initialUnlocked = false,
}: RtoDossierSectionProps) {
  const [isUnlocked, setIsUnlocked] = useState(initialUnlocked);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [previewData, setPreviewData] = useState<any>(null);
  const [fullDossier, setFullDossier] = useState<FullRtoDossier | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem('vericar_user_email');
    setUserEmail(email);

    const loadDossierStatus = async () => {
      try {
        const res = await fetch(
          `/api/vehicle/${encodeURIComponent(rcNumber)}/full-rto?email=${encodeURIComponent(
            email || ''
          )}`
        );
        const data = await res.json();
        if (data.unlocked && data.dossier) {
          setIsUnlocked(true);
          setFullDossier(data.dossier);
        } else if (data.preview) {
          setPreviewData(data.preview);
        }
      } catch (err) {
        console.error('Failed to load RTO status:', err);
      } finally {
        setFetchingData(false);
      }
    };

    loadDossierStatus();
  }, [rcNumber]);

  const handleUnlockDossier = async () => {
    if (!userEmail) {
      setErrorMsg('Please log in first to unlock this document.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Create ₹10 order
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          plan: 'RTO_DOSSIER_10',
          targetRc: rcNumber,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      const hasRealKey =
        orderData.keyId &&
        orderData.keyId.startsWith('rzp_') &&
        !orderData.keyId.includes('placeholder');

      if (typeof window !== 'undefined' && window.Razorpay && hasRealKey) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amountPaise,
          currency: 'INR',
          name: 'VeriCar RTO Dossier',
          description: `Official RTO Extract for ${rcNumber}`,
          order_id: orderData.orderId,
          prefill: { email: userEmail },
          theme: { color: '#171e19' },
          handler: async function (response: any) {
            await verifyDossierPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setErrorMsg(resp.error?.description || 'Payment was cancelled or failed.');
          setLoading(false);
        });
        rzp.open();
      } else {
        // Safe simulation fallback
        await verifyDossierPayment({
          orderId: orderData.orderId,
          paymentId: `pay_sim_rto_${Date.now()}`,
          signature: 'simulated_valid_sig',
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment initiation failed.');
      setLoading(false);
    }
  };

  const verifyDossierPayment = async (payDetails: {
    orderId: string;
    paymentId: string;
    signature: string;
  }) => {
    try {
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          orderId: payDetails.orderId,
          paymentId: payDetails.paymentId,
          signature: payDetails.signature,
          plan: 'RTO_DOSSIER_10',
          targetRc: rcNumber,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || 'Payment verification failed');
      }

      // Re-fetch unlocked dossier
      const rtoRes = await fetch(
        `/api/vehicle/${encodeURIComponent(rcNumber)}/full-rto?email=${encodeURIComponent(
          userEmail || ''
        )}`
      );
      const rtoData = await rtoRes.json();
      if (rtoData.dossier) {
        setFullDossier(rtoData.dossier);
        setIsUnlocked(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification error');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintDossier = () => {
    window.print();
  };

  const currentData = fullDossier || previewData;

  return (
    <div id="rto-dossier" className="mb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-2 border-b border-[#171e19]/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-anton text-2xl sm:text-3xl text-[#171e19] tracking-tight">
              03 // COMPLETE OFFICIAL RTO EXTRACT (MoRTH)
            </h2>
            {isUnlocked ? (
              <span className="px-2.5 py-0.5 bg-green-100 text-green-800 font-anton text-xs rounded flex items-center gap-1">
                <Unlock className="w-3 h-3" /> UNLOCKED
              </span>
            ) : (
              <span className="px-2.5 py-0.5 bg-[#ffe17c] text-[#171e19] font-anton text-xs rounded flex items-center gap-1">
                <Lock className="w-3 h-3" /> ₹10 PAYWALL
              </span>
            )}
          </div>
          <p className="font-satoshi text-xs text-[#171e19]/60 mt-1">
            Raw sovereign registry extract direct from national vehicle databases.
          </p>
        </div>

        {isUnlocked && (
          <button
            onClick={handlePrintDossier}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#171e19] hover:bg-black text-white rounded-xl font-satoshi text-xs font-bold transition-all cursor-pointer print:hidden"
          >
            <Download className="w-3.5 h-3.5 text-[#ffe17c]" />
            <span>DOWNLOAD RTO EXTRACT (PDF)</span>
          </button>
        )}
      </div>

      {/* Main Box */}
      <div className="bg-white rounded-2xl border-2 border-[#171e19] shadow-[8px_8px_0px_0px_#171e19] overflow-hidden">
        
        {/* Banner */}
        <div className="p-6 bg-[#f8f9fa] border-b border-[#171e19]/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-satoshi text-[11px] font-bold uppercase tracking-wider text-[#171e19]/60">
              NATIONAL INVENTORY REGISTRATION CARD
            </span>
            <h3 className="font-anton text-2xl text-[#171e19] tracking-wide">
              {rcNumber} // OFFICIAL VAHAN SPECIFICATION RECORD
            </h3>
            <p className="font-satoshi text-xs text-[#171e19]/70">
              Contains unmasked engine stamping, chassis number, registered owner father&apos;s name, exact RTO home address, tax receipts, and full police challan archives.
            </p>
          </div>

          {!isUnlocked && (
            <div className="shrink-0">
              <button
                onClick={handleUnlockDossier}
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#ffe17c] hover:bg-[#ffdc5c] text-[#171e19] font-anton text-base px-6 py-3.5 rounded-xl border border-[#171e19]/30 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>CONNECTING...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>UNLOCK FULL OFFICIAL SHEET (₹10)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Value Proposition Preview Notice when LOCKED */}
        {!isUnlocked && (
          <div className="p-5 bg-[#ffe17c]/20 border-b border-[#171e19]/15">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[#171e19] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-anton text-sm text-[#171e19] tracking-wider uppercase">
                  WHAT YOU WILL SEE ONCE UNLOCKED FOR ₹10:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2 font-satoshi text-xs text-[#171e19]/80">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-green-800 shrink-0" />
                    <span>Full Unmasked 17-digit Chassis No</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-green-800 shrink-0" />
                    <span>Full Engine Number & CC displacement</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-green-800 shrink-0" />
                    <span>Father / Guardian Name on RTO file</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-green-800 shrink-0" />
                    <span>Exact RTO Present & Permanent Address</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-green-800 shrink-0" />
                    <span>Gross Vehicle Weight & Wheelbase</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-green-800 shrink-0" />
                    <span>Policy Number & Road Tax Receipts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Grid */}
        <div className="p-6 relative">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Field 1: Chassis No */}
            <div className="p-4 bg-[#fcfcfc] rounded-xl border border-[#171e19]/10">
              <span className="font-satoshi text-[11px] font-bold uppercase tracking-wider text-[#171e19]/50 block">
                FULL CHASSIS NUMBER (VIN)
              </span>
              <div className="font-mono text-sm font-bold text-[#171e19] mt-1 flex items-center justify-between">
                <span>{currentData?.chassisNumber || 'ME4JF506JK••••••••'}</span>
                {!isUnlocked && <Lock className="w-3.5 h-3.5 text-neutral-400" />}
              </div>
            </div>

            {/* Field 2: Engine No */}
            <div className="p-4 bg-[#fcfcfc] rounded-xl border border-[#171e19]/10">
              <span className="font-satoshi text-[11px] font-bold uppercase tracking-wider text-[#171e19]/50 block">
                FULL ENGINE NUMBER
              </span>
              <div className="font-mono text-sm font-bold text-[#171e19] mt-1 flex items-center justify-between">
                <span>{currentData?.engineNumber || 'JF50E••••••••'}</span>
                {!isUnlocked && <Lock className="w-3.5 h-3.5 text-neutral-400" />}
              </div>
            </div>

            {/* Field 3: Father's Name */}
            <div className="p-4 bg-[#fcfcfc] rounded-xl border border-[#171e19]/10">
              <span className="font-satoshi text-[11px] font-bold uppercase tracking-wider text-[#171e19]/50 block">
                OWNER FATHER / SPOUSE NAME
              </span>
              <div className="font-satoshi text-sm font-bold text-[#171e19] mt-1 flex items-center justify-between">
                <span>{currentData?.fatherName || 'S. ••••••••••••'}</span>
                {!isUnlocked && <Lock className="w-3.5 h-3.5 text-neutral-400" />}
              </div>
            </div>

            {/* Field 4: Present Address */}
            <div className="p-4 bg-[#fcfcfc] rounded-xl border border-[#171e19]/10 sm:col-span-2">
              <span className="font-satoshi text-[11px] font-bold uppercase tracking-wider text-[#171e19]/50 block">
                RTO PRESENT REGISTERED ADDRESS
              </span>
              <div className="font-satoshi text-xs font-semibold text-[#171e19] mt-1 flex items-center justify-between">
                <span className="truncate">{currentData?.presentAddress || '8-11, Brahmana Street, Ambajipeta, ••••••••••••'}</span>
                {!isUnlocked && <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0 ml-2" />}
              </div>
            </div>

            {/* Field 5: Permanent Address */}
            <div className="p-4 bg-[#fcfcfc] rounded-xl border border-[#171e19]/10">
              <span className="font-satoshi text-[11px] font-bold uppercase tracking-wider text-[#171e19]/50 block">
                RTO PERMANENT ADDRESS
              </span>
              <div className="font-satoshi text-xs font-semibold text-[#171e19] mt-1 flex items-center justify-between">
                <span className="truncate">{currentData?.permanentAddress || 'East Godavari, Andhra Pradesh, ••••••'}</span>
                {!isUnlocked && <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0 ml-2" />}
              </div>
            </div>

            {/* Field 6: Cubic Capacity & Cylinders */}
            <div className="p-4 bg-[#fcfcfc] rounded-xl border border-[#171e19]/10">
              <span className="font-satoshi text-[11px] font-bold uppercase tracking-wider text-[#171e19]/50 block">
                ENGINE DISPLACEMENT (CC) & CYLINDERS
              </span>
              <div className="font-satoshi text-sm font-bold text-[#171e19] mt-1">
                {currentData?.cubicCapacityCc || '109 CC'} / {currentData?.cylindersCount || '1'} Cylinder(s)
              </div>
            </div>

            {/* Field 7: Seating, Standing, Sleeper */}
            <div className="p-4 bg-[#fcfcfc] rounded-xl border border-[#171e19]/10">
              <span className="font-satoshi text-[11px] font-bold uppercase tracking-wider text-[#171e19]/50 block">
                SEATING & SLEEPER CAPACITY
              </span>
              <div className="font-satoshi text-sm font-bold text-[#171e19] mt-1">
                {currentData?.seatingCapacity || '2'} Seater (Sleeper: {currentData?.sleeperCapacity || '0'})
              </div>
            </div>

            {/* Field 8: Weight & Wheelbase */}
            <div className="p-4 bg-[#fcfcfc] rounded-xl border border-[#171e19]/10">
              <span className="font-satoshi text-[11px] font-bold uppercase tracking-wider text-[#171e19]/50 block">
                UNLADEN WEIGHT & WHEELBASE
              </span>
              <div className="font-satoshi text-sm font-bold text-[#171e19] mt-1">
                {currentData?.unladenWeightKg || '109 KG'} / {currentData?.wheelbaseMm || '1238 MM'}
              </div>
            </div>

            {/* Field 9: Tax Validity & Mode */}
            <div className="p-4 bg-[#fcfcfc] rounded-xl border border-[#171e19]/10">
              <span className="font-satoshi text-[11px] font-bold uppercase tracking-wider text-[#171e19]/50 block">
                TAX VALIDITY & MODE
              </span>
              <div className="font-satoshi text-sm font-bold text-[#171e19] mt-1">
                {currentData?.taxUpto || 'L.T.T (One-Time Paid)'} ({currentData?.taxMode || 'Lifetime'})
              </div>
            </div>

            {/* Field 10: Insurance Policy No */}
            <div className="p-4 bg-[#fcfcfc] rounded-xl border border-[#171e19]/10">
              <span className="font-satoshi text-[11px] font-bold uppercase tracking-wider text-[#171e19]/50 block">
                NATIONAL INSURANCE POLICY NO
              </span>
              <div className="font-mono text-sm font-bold text-[#171e19] mt-1 flex items-center justify-between">
                <span>{currentData?.insurancePolicyNumber || 'POL-VRC-••••••••'}</span>
                {!isUnlocked && <Lock className="w-3.5 h-3.5 text-neutral-400" />}
              </div>
            </div>

            {/* Field 11: PUCC Certificate No */}
            <div className="p-4 bg-[#fcfcfc] rounded-xl border border-[#171e19]/10">
              <span className="font-satoshi text-[11px] font-bold uppercase tracking-wider text-[#171e19]/50 block">
                PUCC CERTIFICATE NO
              </span>
              <div className="font-mono text-sm font-bold text-[#171e19] mt-1 flex items-center justify-between">
                <span>{currentData?.puccNumber || 'PUC-AP05-••••••'}</span>
                {!isUnlocked && <Lock className="w-3.5 h-3.5 text-neutral-400" />}
              </div>
            </div>

          </div>

          {/* Challan Details Table if Unlocked */}
          {isUnlocked && currentData?.challanDetails && currentData.challanDetails.length > 0 && (
            <div className="mt-6 border border-[#171e19]/15 rounded-xl overflow-hidden">
              <div className="p-3 bg-[#f8f9fa] border-b border-[#171e19]/10 font-anton text-sm tracking-wider">
                POLICE E-CHALLAN ARCHIVE LOG
              </div>
              <div className="divide-y divide-[#171e19]/10">
                {currentData.challanDetails.map((c: any, i: number) => (
                  <div key={i} className="p-3 flex justify-between items-center text-xs font-satoshi">
                    <div>
                      <span className="font-mono font-bold">{c.challanNumber}</span>
                      <p className="text-neutral-500">{c.offenseDetails} • {c.challanDate}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-red-600">₹{c.amount}</span>
                      <span className="block text-[10px] text-neutral-400 uppercase">{c.challanStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Floating Banner when LOCKED */}
          {!isUnlocked && (
            <div className="mt-6 p-5 bg-[#171e19] text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-full bg-[#ffe17c] text-[#171e19] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-anton text-lg tracking-wide text-white">
                    UNLOCK THE COMPLETE OFFICIAL EXTRACT FOR JUST ₹10
                  </h4>
                  <p className="font-satoshi text-xs text-white/70">
                    Instant 1-click unlock via UPI/Card. Full unmasked PDF export included.
                  </p>
                </div>
              </div>

              <button
                onClick={handleUnlockDossier}
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#ffe17c] hover:bg-[#ffdc5c] text-[#171e19] font-anton text-base px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl shrink-0 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>PROCESSING...</span>
                  </>
                ) : (
                  <>
                    <span>PAY ₹10 & UNLOCK NOW</span>
                    <ArrowRight className="w-4 h-4 text-[#171e19]" />
                  </>
                )}
              </button>
            </div>
          )}

          {errorMsg && (
            <p className="mt-3 text-xs font-satoshi text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              {errorMsg}
            </p>
          )}

        </div>

      </div>

    </div>
  );
}
