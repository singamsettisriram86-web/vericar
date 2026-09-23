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
  makerModel,
  ownerName,
  insuranceStatus,
  annualMaintenanceCostINR,
}: ReportActionsProps) {
  const [copied, setCopied] = useState(false);

  // Suggested negotiation deduction
  let deduction = 0;
  if (insuranceStatus === 'EXPIRED') deduction += 7500;
  if (annualMaintenanceCostINR > 10000) deduction += 15000;
  else deduction += 8000;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `🚗 *VERICAR Vehicle Audit Report*\n` +
      `Registration: *${rcNumber}*\n` +
      `Model: *${makerModel}*\n` +
      `Registered Owner: ${ownerName}\n` +
      `Insurance: ${insuranceStatus}\n` +
      `Est. Annual Maintenance: ₹${annualMaintenanceCostINR.toLocaleString('en-IN')}\n\n` +
      `💡 *Negotiation Leverage*: Recommend deducting ₹${deduction.toLocaleString('en-IN')} off seller quote for upcoming renewals & maintenance.\n` +
      `View Full Audit: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="no-print mb-8 space-y-4">
      {/* Negotiation advisory banner */}
      <div className="p-4 bg-[#ffe17c]/30 border-2 border-[#171e19] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#171e19] text-[#ffe17c] rounded-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-anton text-sm text-[#171e19] tracking-wider block">
              BUYER NEGOTIATION LEVERAGE: DEDUCT ₹{deduction.toLocaleString('en-IN')}
            </span>
            <span className="font-satoshi text-xs text-[#171e19]/75">
              Based on {insuranceStatus === 'EXPIRED' ? 'expired insurance renewal + ' : ''}projected wearable components.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 bg-white border border-[#171e19]/20 hover:border-[#171e19] rounded-lg font-satoshi text-xs font-bold text-[#171e19] transition-all cursor-pointer flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share Link'}</span>
          </button>
        </div>
      </div>

      {/* High-Converting ₹39 Full Details & Certified Extract Action Bar */}
      <div className="p-4 sm:p-5 bg-[#171e19] text-white rounded-2xl border-2 border-[#171e19] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#ffe17c] text-[#171e19] font-anton text-xs rounded tracking-wider">
              OFFICIAL SOVEREIGN DOSSIER
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
