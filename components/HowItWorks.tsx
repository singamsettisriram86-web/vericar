// components/HowItWorks.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Cpu, CheckSquare } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    title: 'ENTER VEHICLE RC NUMBER',
    desc: 'Input any Indian vehicle registration number (e.g. KA01AB1234). Our high-throughput gateway taps directly into national RTO registries to reconstruct ownership history, insurance status, and hypothecation records in under 3 seconds.',
    icon: Search,
  },
  {
    num: '02',
    title: 'RUN AI COST MATRIX & CHALLAN SCAN',
    desc: 'Our proprietary model analyzes the car\'s exact engine configuration, age, and odometer wear curve against real-world Indian parts pricing. You receive an itemized annual maintenance bill forecast and instant pending challan audit.',
    icon: Cpu,
  },
  {
    num: '03',
    title: 'DISPATCH DOORSTEP 150-PT MECHANIC',
    desc: 'Book a certified field inspector to conduct paint depth micron analysis, OBD-II ECU error scanning, underbody rust inspection, and a supervised 10-km test drive. Walk into negotiations holding undeniable leverage.',
    icon: CheckSquare,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[#ffffff] bg-grid-light border-b border-[#171e19]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Two-column layout (1:2 ratio) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Sticky Anton title (4 cols out of 12) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#171e19]/15 bg-white mb-4">
              <span className="w-2 h-2 rounded-full bg-[#ffe17c]" />
              <span className="font-satoshi text-xs uppercase tracking-widest font-bold text-[#171e19]">
                VERIFICATION PROTOCOL
              </span>
            </div>

            <h2 className="font-anton text-5xl sm:text-6xl md:text-7xl text-[#171e19] tracking-tight leading-[0.9] mb-6">
              HOW IT <br />
              <span className="highlight-rotate-15 px-2">WORKS</span>
            </h2>

            <p className="font-satoshi text-[#171e19]/70 text-base sm:text-lg mb-8 leading-relaxed">
              Zero guesswork. In three definitive steps, turn a high-risk private transaction into an ironclad verified purchase.
            </p>

            <Link
              href="#verify"
              className="inline-flex items-center gap-3 font-anton text-lg text-[#171e19] bg-[#ffe17c] hover:bg-[#ffdc5c] px-6 py-3.5 rounded-xl border border-[#171e19]/20 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
            >
              <span>TEST ANY REGISTRATION</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Right Column: Vertical stack of three steps (8 cols out of 12) */}
          <div className="lg:col-span-8 space-y-8">
            {STEPS.map((step) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.num}
                  className="group p-8 sm:p-10 bg-white border border-[#171e19]/15 rounded-2xl brutalist-card relative overflow-hidden flex flex-col sm:flex-row gap-6 sm:gap-8 items-start hover:border-[#171e19] transition-all"
                >
                  {/* Massive 8xl numeral with #ffe17c/20% that changes to full opacity on hover */}
                  <div className="font-anton text-7xl sm:text-8xl md:text-9xl text-[#ffe17c]/30 group-hover:text-[#ffe17c] transition-colors duration-300 select-none leading-none shrink-0">
                    {step.num}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-[#171e19] text-white rounded-lg group-hover:bg-[#ffe17c] group-hover:text-[#171e19] transition-colors">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="font-anton text-2xl sm:text-3xl text-[#171e19] tracking-wide">
                        {step.title}
                      </h3>
                    </div>

                    <p className="font-satoshi text-[#171e19]/75 text-base leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
