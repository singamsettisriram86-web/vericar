// components/HeroSection.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, CheckCircle2, ShieldAlert, ArrowRight, Car } from 'lucide-react';

const SAMPLE_CHIPS = [
  { label: 'KA01AB1234', desc: 'Maruti Swift (Petrol)' },
  { label: 'DL3CCA1234', desc: 'Hyundai Creta (Diesel)' },
  { label: 'MH02CD5678', desc: 'Honda City (CVT)' },
  { label: 'TS09EF9012', desc: 'Tata Nexon (BS6)' },
];

export default function HeroSection() {
  const [rcNumber, setRcNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent, customRc?: string) => {
    if (e) e.preventDefault();
    const query = (customRc || rcNumber).trim().toUpperCase();
    if (!query) {
      setErrorMsg('Please enter an Indian RC number');
      return;
    }
    if (query.length < 5) {
      setErrorMsg('Enter a valid RC (e.g. KA01AB1234)');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    router.push(`/report/${encodeURIComponent(query)}`);
  };

  return (
    <section id="verify" className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#ffffff] bg-grid-light overflow-hidden border-b border-[#171e19]/10">
      
      {/* Subtle ambient light glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#ffe17c]/20 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#171e19]/15 bg-white/80 shadow-xs mb-8 backdrop-blur-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffe17c] animate-pulse" />
          <span className="font-satoshi text-xs uppercase tracking-widest font-bold text-[#171e19]">
            INDIA&apos;S SOVEREIGN VEHICLE INTELLIGENCE PLATFORM
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-anton text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#171e19] tracking-tight leading-[0.92] sm:leading-[0.88] max-w-5xl mx-auto mb-8">
          UNCOVER THE TRUTH <br className="hidden sm:inline" />
          <span className="highlight-rotate-15 text-[#171e19] px-3 pb-1 inline-block">
            BEFORE YOU BUY.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="font-satoshi text-lg sm:text-xl text-[#171e19]/75 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Instant Vahan government registry audit, AI-forecasted annual maintenance costs in ₹ INR, and 150-point physical mechanic inspections for first-time used car buyers in India.
        </p>

        {/* Primary RC Lookup Form */}
        <div className="max-w-2xl mx-auto mb-6">
          <form
            onSubmit={(e) => handleSearch(e)}
            className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl border-2 border-[#171e19] shadow-[6px_6px_0px_0px_#171e19] transition-all"
          >
            <div className="relative flex-1 flex items-center">
              <span className="pl-4 pr-2 text-[#171e19]/40">
                <Car className="w-6 h-6 text-[#171e19]" />
              </span>
              <input
                type="text"
                value={rcNumber}
                onChange={(e) => {
                  setRcNumber(e.target.value.toUpperCase());
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="ENTER RC (E.G. KA01AB1234)"
                className="w-full py-4 pr-4 font-anton text-lg sm:text-xl text-[#171e19] placeholder:text-[#171e19]/35 uppercase tracking-wider bg-transparent focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#ffe17c] hover:bg-[#ffdc5c] text-[#171e19] font-anton text-xl px-8 py-4 rounded-xl border border-[#171e19]/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>SCANNING...</span>
              ) : (
                <>
                  <span>INSPECT NOW</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {errorMsg && (
            <p className="mt-2 text-sm text-red-600 font-satoshi font-medium text-left px-2">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Quick Sample RCs */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
          <span className="font-satoshi text-xs uppercase tracking-wider text-[#171e19]/50 font-bold mr-1">
            Try Sample Cars:
          </span>
          {SAMPLE_CHIPS.map((chip) => (
            <button
              key={chip.label}
              onClick={(e) => {
                setRcNumber(chip.label);
                handleSearch(e, chip.label);
              }}
              type="button"
              className="px-3 py-1 bg-white border border-[#171e19]/15 hover:border-[#171e19] hover:bg-[#ffe17c]/20 text-xs font-anton tracking-wider text-[#171e19] rounded-md transition-all cursor-pointer"
            >
              {chip.label} <span className="text-[10px] font-satoshi font-normal text-[#171e19]/60">({chip.desc})</span>
            </button>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-14 pt-8 border-t border-[#171e19]/10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#171e19]" />
            <span className="font-satoshi text-xs font-semibold uppercase tracking-wider text-[#171e19]/80">
              Direct MoRTH Vahan Data
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#171e19]" />
            <span className="font-satoshi text-xs font-semibold uppercase tracking-wider text-[#171e19]/80">
              AI Projected Repair Matrix
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#171e19]" />
            <span className="font-satoshi text-xs font-semibold uppercase tracking-wider text-[#171e19]/80">
              150-Point Physical Audit
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#171e19]" />
            <span className="font-satoshi text-xs font-semibold uppercase tracking-wider text-[#171e19]/80">
              Challan & Hypothecation Check
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
