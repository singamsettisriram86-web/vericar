// components/ReportActions.tsx
'use client';

import React, { useState } from 'react';
import { Download, Share2, Printer, ShieldAlert, Sparkles, Check } from 'lucide-react';

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

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handlePrint}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#171e19] hover:bg-black text-white hover:text-[#ffe17c] font-anton text-sm rounded-xl border border-[#171e19] transition-all hover:scale-[1.02] active:scale-95 shadow-md cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#ffe17c]" />
          <span>DOWNLOAD CERTIFIED PDF</span>
        </button>

        <button
          onClick={handleWhatsAppShare}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-satoshi text-xs font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-md cursor-pointer uppercase tracking-wider"
        >
          <span>Share via WhatsApp</span>
        </button>

        <button
          onClick={handlePrint}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-3.5 bg-white border border-[#171e19]/20 hover:border-[#171e19] text-[#171e19] font-satoshi text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Dossier</span>
        </button>
      </div>
    </div>
  );
}
