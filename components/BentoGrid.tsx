// components/BentoGrid.tsx
import React from 'react';
import {
  ShieldAlert,
  Zap,
  CheckCircle,
  Database,
  Cpu,
  Wrench,
  Search,
  Check,
  Flame,
  FileCheck2,
  Users
} from 'lucide-react';

export default function BentoGrid() {
  return (
    <section id="features" className="py-24 bg-white border-b border-[#171e19]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#171e19]/15 bg-[#f8f9fa] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#ffe17c]" />
              <span className="font-satoshi text-xs uppercase tracking-widest font-bold text-[#171e19]">
                ARCHITECTURE & INTELLIGENCE
              </span>
            </div>
            <h2 className="font-anton text-5xl sm:text-7xl text-[#171e19] tracking-tight leading-[0.9]">
              ENGINEERED FOR <br />
              <span className="highlight-rotate-15 px-2">ABSOLUTE CLARITY</span>
            </h2>
          </div>
          <p className="font-satoshi text-base sm:text-lg text-[#171e19]/70 max-w-md">
            Four defensive layers designed to catch what dealer cosmetic details and surface-level polishes actively conceal.
          </p>
        </div>

        {/* 3-Column Bento Grid with auto-rows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
          
          {/* Feature 1: Span 2 Columns (Light #f8f9fa background) */}
          <div className="md:col-span-2 bg-[#f8f9fa] border border-[#171e19]/10 rounded-2xl p-8 sm:p-10 flex flex-col justify-between brutalist-card relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <span className="font-anton text-sm tracking-widest text-[#171e19]/40 uppercase">
                  MODULE 01 // REGISTRY FORENSICS
                </span>
                <span className="px-3 py-1 bg-[#171e19] text-[#ffe17c] font-anton text-xs rounded-md">
                  VAHAN API LIVE
                </span>
              </div>

              <h3 className="font-anton text-3xl sm:text-4xl text-[#171e19] tracking-tight leading-tight mb-3">
                SOVEREIGN VEHICLE REGISTRATION AUDIT
              </h3>
              <p className="font-satoshi text-[#171e19]/75 text-base max-w-xl leading-relaxed">
                Connect directly into Indian RTO servers. Uncover authentic owner count, blacklist flags, hypothecation status, and emission validity without seller interference.
              </p>
            </div>

            {/* Abstract UI element: code snippet / telemetry log in bg-dark */}
            <div className="mt-8 bg-[#171e19] rounded-xl p-5 border border-[#171e19] text-white font-mono text-xs overflow-x-auto shadow-lg relative">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-white/40">
                <span className="text-white/60 font-sans text-xs">Terminal: vahan.parivahan.gov.in/telemetry</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] text-green-400 font-bold">200 OK</span>
                </div>
              </div>
              <div className="space-y-1 text-white/80">
                <p className="text-[#ffe17c]">&gt; GET /api/rc/KA01AB1234 --verify-chassis</p>
                <p className="text-white/60">&#123;</p>
                <p className="pl-4"><span className="text-[#ffe17c]">&quot;rc_status&quot;</span>: <span className="text-green-400">&quot;ACTIVE&quot;</span>,</p>
                <p className="pl-4"><span className="text-[#ffe17c]">&quot;owner_sequence&quot;</span>: <span className="text-white">1</span>,</p>
                <p className="pl-4"><span className="text-[#ffe17c]">&quot;hypothecation&quot;</span>: <span className="text-white">&quot;HDFC Bank Ltd (NOC ISSUED)&quot;</span>,</p>
                <p className="pl-4"><span className="text-[#ffe17c]">&quot;blacklist_alert&quot;</span>: <span className="text-green-400">false</span></p>
                <p className="text-white/60">&#125;</p>
              </div>
            </div>
          </div>

          {/* Feature 2: 1 Column (Contrast #171e19 background) */}
          <div className="bg-[#171e19] text-white rounded-2xl p-8 sm:p-10 flex flex-col justify-between brutalist-card-dark relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <span className="font-anton text-sm tracking-widest text-[#ffe17c] uppercase">
                  MODULE 02 // AI ENGINE
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffe17c] animate-ping" />
              </div>

              <h3 className="font-anton text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-3">
                ANNUAL COST PROJECTION
              </h3>
              <p className="font-satoshi text-white/70 text-sm leading-relaxed">
                Trained on over 40,000 Indian service invoices across Maruti, Hyundai, Tata, Honda, and Mahindra.
              </p>
            </div>

            {/* Abstract UI element: Animated pulse blocks */}
            <div className="mt-8 space-y-3">
              <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <p className="font-satoshi text-xs text-white/50 uppercase">Synthetic Oil Service</p>
                  <p className="font-anton text-lg text-white">₹3,500 - ₹4,800</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#ffe17c]/20 flex items-center justify-center text-[#ffe17c]">
                  <Zap className="w-4 h-4" />
                </div>
              </div>

              <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <p className="font-satoshi text-xs text-white/50 uppercase">Brake Pad Overhaul</p>
                  <p className="font-anton text-lg text-[#ffe17c]">₹3,800</p>
                </div>
                <div className="px-2 py-0.5 bg-[#ffe17c] text-[#171e19] font-anton text-[10px] rounded">
                  LOW RISK
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3: 1 Column (#f8f9fa background) */}
          <div className="bg-[#f8f9fa] border border-[#171e19]/10 rounded-2xl p-8 sm:p-10 flex flex-col justify-between brutalist-card relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <span className="font-anton text-sm tracking-widest text-[#171e19]/40 uppercase">
                  MODULE 03 // ON-DEMAND
                </span>
                <span className="px-2.5 py-0.5 bg-[#ffe17c] text-[#171e19] font-anton text-xs rounded-md">
                  ₹499
                </span>
              </div>

              <h3 className="font-anton text-3xl sm:text-4xl text-[#171e19] tracking-tight leading-tight mb-3">
                150-POINT INSPECTION
              </h3>
              <p className="font-satoshi text-[#171e19]/75 text-sm leading-relaxed">
                Doorstep mechanics equipped with magnetic paint gauges, compression testers, and OBD-II scanners.
              </p>
            </div>

            {/* Abstract UI element: Avatar stack of certified mechanics */}
            <div className="mt-8 p-4 bg-white rounded-xl border border-[#171e19]/10">
              <div className="flex items-center justify-between mb-3">
                <span className="font-satoshi text-xs font-bold text-[#171e19] uppercase tracking-wider">
                  Verified Field Technicians
                </span>
                <span className="font-anton text-xs text-green-700">120+ ACTIVE</span>
              </div>
              <div className="flex items-center -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-[#171e19] text-[#ffe17c] font-anton text-xs flex items-center justify-center">
                  AK
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-[#272727] text-white font-anton text-xs flex items-center justify-center">
                  RS
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-[#ffe17c] text-[#171e19] font-anton text-xs flex items-center justify-center font-bold">
                  VS
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-[#171e19] text-white font-anton text-xs flex items-center justify-center">
                  +95
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4: Span 2 Columns (#171e19 Dark background) */}
          <div className="md:col-span-2 bg-[#171e19] text-white rounded-2xl p-8 sm:p-10 flex flex-col justify-between brutalist-card-dark relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <span className="font-anton text-sm tracking-widest text-[#ffe17c] uppercase">
                  MODULE 04 // DEFENSIVE INTELLIGENCE
                </span>
                <span className="px-3 py-1 bg-white/10 text-white font-anton text-xs rounded-md border border-white/20">
                  REAL-TIME SHIELD
                </span>
              </div>

              <h3 className="font-anton text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-3">
                POLICE CHALLAN & HYPOTHECATION SCANNER
              </h3>
              <p className="font-satoshi text-white/70 text-base max-w-xl leading-relaxed">
                Zero surprise liabilities. Automatically audit traffic camera violations, speeding warrants, active bank liens, and NOC clearances before cash changes hands.
              </p>
            </div>

            {/* Abstract UI element: Challan scan badge metrics */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <span className="font-satoshi text-[11px] text-white/50 uppercase">Dispute Resolution</span>
                <p className="font-anton text-2xl text-white mt-1">100% AUDITED</p>
                <p className="font-satoshi text-xs text-green-400 mt-0.5">Court & e-Challan DB</p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <span className="font-satoshi text-[11px] text-white/50 uppercase">Bank Encumbrance</span>
                <p className="font-anton text-2xl text-[#ffe17c] mt-1">FORM 35 NOC</p>
                <p className="font-satoshi text-xs text-white/60 mt-0.5">Verified against lender</p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <span className="font-satoshi text-[11px] text-white/50 uppercase">Buyer Savings</span>
                <p className="font-anton text-2xl text-white mt-1">₹45,000 AVG</p>
                <p className="font-satoshi text-xs text-[#ffe17c] mt-0.5">Dealer price correction</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
