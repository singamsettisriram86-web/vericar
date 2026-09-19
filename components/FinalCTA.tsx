// components/FinalCTA.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShieldCheck, Car, Check } from 'lucide-react';

export default function FinalCTA() {
  const [rcInput, setRcInput] = useState('');
  const [submittedWaitlist, setSubmittedWaitlist] = useState(false);
  const router = useRouter();

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = rcInput.trim().toUpperCase();
    if (!clean) return;

    if (clean.includes('@')) {
      // Email waitlist
      setSubmittedWaitlist(true);
      return;
    }

    // RC lookup
    router.push(`/report/${encodeURIComponent(clean)}`);
  };

  return (
    <section className="relative py-28 md:py-36 bg-[#ffe17c] text-[#171e19] overflow-hidden">
      
      {/* Background decorative elements: massive Anton text overlays with 10% opacity */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden -z-0">
        <span className="font-anton text-[16vw] leading-none text-[#171e19]/10 tracking-widest whitespace-nowrap -rotate-2">
          VERICAR AUDIT PROTOCOL
        </span>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#171e19]/20 bg-white/50 mb-8 shadow-xs backdrop-blur-xs">
          <ShieldCheck className="w-4 h-4 text-[#171e19]" />
          <span className="font-satoshi text-xs uppercase tracking-widest font-bold text-[#171e19]">
            START YOUR AUDIT IN 10 SECONDS
          </span>
        </div>

        {/* Centralized Anton headline (8xl, leading-0.9) */}
        <h2 className="font-anton text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#171e19] tracking-tight leading-[0.9] mb-8">
          DON&apos;T SIGN UNTIL <br />
          YOU SCAN.
        </h2>

        {/* Satoshi subtext (2xl, max-w-2xl) */}
        <p className="font-satoshi text-xl sm:text-2xl text-[#171e19]/85 max-w-2xl mx-auto mb-12 font-normal leading-relaxed">
          Every used car has a past. Make sure you don&apos;t end up paying for someone else&apos;s negligence.
        </p>

        {/* Large centered form with input and button (bg-charcoal, shadow-xl, hover:scale-105) */}
        <div className="max-w-xl mx-auto">
          {submittedWaitlist ? (
            <div className="p-6 bg-[#171e19] text-white rounded-2xl flex items-center justify-center gap-3 shadow-2xl">
              <Check className="w-6 h-6 text-[#ffe17c]" />
              <span className="font-anton text-xl tracking-wide">
                YOU&apos;RE ON THE PRIORITY ACCESS LIST!
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleAction}
              className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl border-2 border-[#171e19] shadow-2xl transition-all"
            >
              <div className="relative flex-1 flex items-center">
                <span className="pl-4 pr-2 text-[#171e19]/40">
                  <Car className="w-6 h-6 text-[#171e19]" />
                </span>
                <input
                  type="text"
                  value={rcInput}
                  onChange={(e) => setRcInput(e.target.value.toUpperCase())}
                  placeholder="ENTER VEHICLE RC (E.G. MH02CD5678)"
                  className="w-full py-4 pr-4 font-anton text-lg sm:text-xl text-[#171e19] placeholder:text-[#171e19]/35 uppercase tracking-wider bg-transparent focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="bg-[#171e19] hover:bg-black text-white hover:text-[#ffe17c] font-anton text-xl px-8 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>VERIFY</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </form>
          )}

          <p className="mt-4 font-satoshi text-xs uppercase tracking-widest text-[#171e19]/60 font-semibold">
            NO CREDIT CARD REQUIRED FOR RC HISTORY // INSTANT RTO LOOKUP
          </p>
        </div>

      </div>
    </section>
  );
}
