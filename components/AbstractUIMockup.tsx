// components/AbstractUIMockup.tsx
import React from 'react';
import {
  MousePointer2,
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Layers,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Activity,
  Car,
  Wrench
} from 'lucide-react';

export default function AbstractUIMockup() {
  return (
    <section className="py-20 bg-[#ffffff] bg-grid-light border-b border-[#171e19]/10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#171e19]/60 px-3 py-1 bg-[#171e19]/5 rounded-full">
            Real-time Vehicle Audit Terminal
          </span>
          <h2 className="font-anton text-4xl sm:text-6xl text-[#171e19] mt-3 tracking-tight leading-[0.9]">
            PRECISION INSPECTION ENGINE
          </h2>
          <p className="font-satoshi text-base sm:text-lg text-[#171e19]/70 max-w-xl mx-auto mt-3">
            Every telemetry record, ownership transfer, challan dispute, and projected maintenance bill rendered in one unified terminal.
          </p>
        </div>

        {/* Browser-style mockup frame */}
        <div className="rounded-2xl border border-[#171e19]/15 shadow-2xl bg-white overflow-hidden brutalist-card">
          
          {/* Header Bar */}
          <div className="h-12 bg-[#171e19] px-4 flex items-center justify-between border-b border-[#171e19]/20">
            {/* Traffic Light Buttons */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block" />
            </div>

            {/* Centered Mockup Title */}
            <div className="font-anton text-xs tracking-widest text-white/80 uppercase">
              VERICAR AUDIT PROTOCOL // RC: KA01AB1234 // 2020 MARUTI SWIFT ZXI
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ffe17c] animate-ping" />
              <span className="font-satoshi text-[11px] font-bold text-[#ffe17c] uppercase tracking-wider">
                LIVE
              </span>
            </div>
          </div>

          {/* Body: 3-column Grid (Sidebar, Main Canvas, Properties Panel) */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[440px] bg-[#f8f9fa]">
            
            {/* 1. Sidebar (3 cols) */}
            <div className="hidden md:flex md:col-span-3 bg-white border-r border-[#171e19]/10 p-4 flex-col justify-between">
              <div className="space-y-4">
                <div className="font-anton text-sm tracking-wider text-[#171e19]/50 uppercase">
                  TELEMETRY SECTORS
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#171e19] text-white font-satoshi text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4 text-[#ffe17c]" />
                    <span>MoRTH RC Audit</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#171e19]/70 hover:bg-[#171e19]/5 font-satoshi text-xs font-medium">
                    <Activity className="w-4 h-4 text-[#171e19]/40" />
                    <span>AI Repair Forecaster</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#171e19]/70 hover:bg-[#171e19]/5 font-satoshi text-xs font-medium">
                    <Wrench className="w-4 h-4 text-[#171e19]/40" />
                    <span>150-Point Checklist</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#171e19]/70 hover:bg-[#171e19]/5 font-satoshi text-xs font-medium">
                    <FileText className="w-4 h-4 text-[#171e19]/40" />
                    <span>Police Challan Scan</span>
                  </div>
                </div>
              </div>

              {/* Status footer in sidebar */}
              <div className="p-3 bg-[#ffe17c]/20 border border-[#ffe17c] rounded-xl">
                <p className="font-anton text-xs text-[#171e19]">CHASSIS TRUST SCORE</p>
                <p className="font-anton text-3xl text-[#171e19] mt-0.5">94 / 100</p>
                <p className="font-satoshi text-[11px] text-[#171e19]/70 mt-1">
                  Low structural risk flag
                </p>
              </div>
            </div>

            {/* 2. Main Canvas (6 cols) */}
            <div className="md:col-span-6 p-6 sm:p-8 flex items-center justify-center relative bg-grid-light">
              
              {/* Centered White Card with subtle shadows */}
              <div className="w-full max-w-md bg-white rounded-xl border border-[#171e19]/15 shadow-xl p-6 relative">
                
                <div className="flex items-center justify-between pb-4 border-b border-[#171e19]/10 mb-4">
                  <div>
                    <span className="font-satoshi text-[10px] font-bold uppercase tracking-widest text-[#171e19]/50">
                      RTO REGISTRATION VERIFIED
                    </span>
                    <h3 className="font-anton text-2xl text-[#171e19] leading-tight mt-0.5">
                      MARUTI SUZUKI SWIFT ZXI
                    </h3>
                  </div>
                  <div className="px-2.5 py-1 bg-[#171e19] text-[#ffe17c] font-anton text-xs rounded-md">
                    1ST OWNER
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-2.5 bg-[#f8f9fa] rounded-lg border border-[#171e19]/5">
                    <span className="font-satoshi text-[10px] text-[#171e19]/60 uppercase">Insurance Upto</span>
                    <p className="font-anton text-sm text-[#171e19] mt-0.5">12-MAR-2027</p>
                  </div>
                  <div className="p-2.5 bg-[#f8f9fa] rounded-lg border border-[#171e19]/5">
                    <span className="font-satoshi text-[10px] text-[#171e19]/60 uppercase">Hypothecation</span>
                    <p className="font-anton text-sm text-green-700 mt-0.5">NOC CLEARED</p>
                  </div>
                  <div className="p-2.5 bg-[#f8f9fa] rounded-lg border border-[#171e19]/5">
                    <span className="font-satoshi text-[10px] text-[#171e19]/60 uppercase">PUC Validity</span>
                    <p className="font-anton text-sm text-[#171e19] mt-0.5">ACTIVE (BS-VI)</p>
                  </div>
                  <div className="p-2.5 bg-[#f8f9fa] rounded-lg border border-[#171e19]/5">
                    <span className="font-satoshi text-[10px] text-[#171e19]/60 uppercase">Est. Annual Service</span>
                    <p className="font-anton text-sm text-[#171e19] mt-0.5">₹8,500 / YR</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#171e19]/10">
                  <div className="flex items-center gap-1.5 text-xs text-green-700 font-satoshi font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>0 Pending Challans</span>
                  </div>
                  <span className="font-anton text-xs text-[#171e19] uppercase tracking-wider">
                    BENGALURU CENTRAL
                  </span>
                </div>

                {/* Floating cursor icon with user name label */}
                <div className="absolute -bottom-4 -right-4 flex items-center gap-1.5 bg-[#171e19] text-white px-3 py-1 rounded-full shadow-lg border border-[#ffe17c] pointer-events-none animate-bounce">
                  <MousePointer2 className="w-3.5 h-3.5 text-[#ffe17c] fill-[#ffe17c]" />
                  <span className="font-satoshi text-[11px] font-bold text-[#ffe17c]">
                    Inspector Vikram S.
                  </span>
                </div>

              </div>

            </div>

            {/* 3. Properties Panel (3 cols) */}
            <div className="hidden md:flex md:col-span-3 bg-white border-l border-[#171e19]/10 p-5 flex-col justify-between">
              <div className="space-y-6">
                
                <div>
                  <h4 className="font-anton text-xs tracking-wider text-[#171e19]/50 uppercase mb-3">
                    TYPOGRAPHY & DISPLAY
                  </h4>
                  <div className="p-2.5 bg-[#f8f9fa] rounded-lg border border-[#171e19]/10 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-satoshi text-[#171e19]/60">Headline Font</span>
                      <span className="font-anton text-[#171e19]">ANTON (DISPLAY)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-satoshi text-[#171e19]/60">Body Font</span>
                      <span className="font-satoshi font-bold text-[#171e19]">SATOSHI</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-anton text-xs tracking-wider text-[#171e19]/50 uppercase mb-3">
                    ALIGNMENT & DENSITY
                  </h4>
                  <div className="flex items-center gap-2 p-1.5 bg-[#f8f9fa] rounded-lg border border-[#171e19]/10">
                    <button className="flex-1 py-1.5 bg-[#171e19] text-white rounded flex items-center justify-center">
                      <AlignLeft className="w-4 h-4" />
                    </button>
                    <button className="flex-1 py-1.5 hover:bg-white text-[#171e19] rounded flex items-center justify-center transition-colors">
                      <AlignCenter className="w-4 h-4" />
                    </button>
                    <button className="flex-1 py-1.5 hover:bg-white text-[#171e19] rounded flex items-center justify-center transition-colors">
                      <AlignRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-anton text-xs tracking-wider text-[#171e19]/50 uppercase mb-3">
                    PRIMARY ACCENT SWATCH
                  </h4>
                  <div className="flex items-center gap-3 p-3 bg-[#f8f9fa] rounded-lg border border-[#171e19]/10">
                    <div className="w-9 h-9 rounded-lg bg-[#ffe17c] border border-[#171e19]/20 shadow-xs shrink-0" />
                    <div>
                      <p className="font-anton text-sm text-[#171e19] tracking-wider">#FFE17C</p>
                      <p className="font-satoshi text-[11px] text-[#171e19]/60">Golden Yellow Highlight</p>
                    </div>
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-[#171e19]/10">
                <span className="font-satoshi text-[10px] uppercase tracking-widest text-[#171e19]/40 block text-center">
                  AUDIT ID: VRC-9982-IN
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
