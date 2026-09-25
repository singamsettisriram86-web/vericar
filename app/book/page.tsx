// app/book/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Wrench, ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BookFallbackPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#171e19]">
      <Navbar />

      <main className="pt-28 pb-20 bg-[#ffffff] bg-grid-light flex-1 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
          
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-satoshi text-xs font-bold uppercase tracking-wider text-[#171e19]/60 hover:text-[#171e19] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="bg-[#171e19] text-white rounded-3xl p-8 sm:p-12 border-2 border-[#171e19] shadow-[12px_12px_0px_0px_#ffe17c] text-center relative overflow-hidden">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffe17c] text-[#171e19] font-anton text-xs uppercase tracking-widest mb-6">
              <Clock className="w-3.5 h-3.5" />
              <span>COMING SOON</span>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
              <Wrench className="w-8 h-8 text-[#ffe17c]" />
            </div>

            <h1 className="font-anton text-3xl sm:text-5xl text-white tracking-tight uppercase leading-tight mb-4">
              150-Point Doorstep Inspection
            </h1>

            <p className="font-satoshi text-base sm:text-lg text-white/80 max-w-lg mx-auto leading-relaxed mb-8">
              Doorstep physical mechanic inspections are currently under preparation and will be launching soon in major metro cities!
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 text-left max-w-md mx-auto space-y-2.5 font-satoshi text-xs sm:text-sm text-white/80">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#ffe17c] shrink-0" />
                <span>Certified mechanic on-site evaluation</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#ffe17c] shrink-0" />
                <span>OBD-II ECU computer engine diagnostics</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#ffe17c] shrink-0" />
                <span>Digital paint gauge thickness & accidental check</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#ffe17c] shrink-0" />
                <span>Underbody chassis & road test inspection</span>
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-[#ffe17c] hover:bg-[#ffdc5c] text-[#171e19] font-anton text-base px-8 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
            >
              <span>RUN ONLINE RC CHECK</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
