// components/ReportActions.tsx
'use client';

import React, { useState } from 'react';
import { Download, Share2, Printer, ShieldAlert, Sparkles, Check, ArrowRight } from 'lucide-react';

interface ReportActionsProps {
  rcNumber: string;
  makerModel: string;
  ownerName: string;
  insuranceStatus: string;
  annualMaintenanceCostINR: number;
}

export default function ReportActions({
  rcNumber,
}: {
  rcNumber: string;
  makerModel?: string;
  ownerName?: string;
  insuranceStatus?: string;
  annualMaintenanceCostINR?: number;
}) {


  return (
    <div className="no-print mb-8">
      {/* High-Converting ₹39 Full Details & Certified Extract Action Bar */}
      <div className="p-4 sm:p-5 bg-[#171e19] text-white rounded-2xl border-2 border-[#171e19] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#ffe17c] text-[#171e19] font-anton text-xs rounded tracking-wider">
              OFFICIAL RTO DOSSIER
            </span>
            <span className="font-satoshi text-xs text-white/70">
              Complete VAHAN MoRTH Extract
            </span>
          </div>
          <h3 className="font-anton text-xl sm:text-2xl text-white tracking-wide">
            WANT THE UNMASKED RTO SHEET & OFFICIAL CERTIFIED PDF?
          </h3>
          <p className="font-satoshi text-xs text-white/80 max-w-xl">
            Get the full unmasked 17-digit VIN/Chassis number, engine number, registered owner father&apos;s name, exact RTO home address, tax validity, and the downloadable certified PDF report.
          </p>
        </div>

        <button
          onClick={() => {
            const el = document.getElementById('rto-dossier');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-[#ffe17c] hover:bg-[#ffdc5c] text-[#171e19] font-anton text-base sm:text-lg px-7 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl shrink-0 cursor-pointer"
        >
          <span>VIEW FULL RTO DETAILS (₹39)</span>
          <ArrowRight className="w-5 h-5 text-[#171e19] stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
