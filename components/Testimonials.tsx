// components/Testimonials.tsx
import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';

const TESTIMONIALS = [
  {
    rating: 5,
    quote:
      'The dealer swore this 2019 Honda City was single-owner and non-accidental. VeriCar showed 2 previous owners, an active loan lien, and ₹38,000 in overdue suspension maintenance. Saved me from a massive financial trap.',
    name: 'ROHAN MEHTA',
    role: 'Bought 2019 Honda City (Bengaluru)',
    initials: 'RM',
    accentColor: '#ffe17c',
  },
  {
    rating: 5,
    quote:
      'The doorstep mechanic flagged a repainted right quarter panel and a failing diesel particulate filter (DPF) that the dealer cleverly cleared. I used the VeriCar inspection report to negotiate ₹85,000 off the asking price on the spot.',
    name: 'PRIYA SWAMINATHAN',
    role: 'Bought 2021 Hyundai Creta (Chennai)',
    initials: 'PS',
    accentColor: '#ffe17c',
  },
  {
    rating: 5,
    quote:
      'As a first-time car buyer in Delhi NCR, the 10-year diesel rule and challan disputes terrified me. VeriCar gave me exact fitness expiry dates, 0 pending challans proof, and a clear maintenance roadmap before I signed anything.',
    name: 'KABIR MALHOTRA',
    role: 'Bought 2022 Tata Nexon (Delhi NCR)',
    initials: 'KM',
    accentColor: '#ffe17c',
  },
];

export default function Testimonials() {
  return (
    <section id="reviews" className="py-24 bg-[#ffffff] bg-grid-light border-b border-[#171e19]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#171e19]/15 bg-white mb-4">
            <span className="w-2 h-2 rounded-full bg-[#ffe17c]" />
            <span className="font-satoshi text-xs uppercase tracking-widest font-bold text-[#171e19]">
              REAL VERIFICATION AUDITS
            </span>
          </div>
          <h2 className="font-anton text-5xl sm:text-7xl text-[#171e19] tracking-tight leading-[0.9]">
            TRUSTED BY FIRST-TIME <br />
            <span className="highlight-rotate-15 px-3">INDIAN BUYERS</span>
          </h2>
          <p className="font-satoshi text-base sm:text-lg text-[#171e19]/70 max-w-xl mx-auto mt-4">
            Over 28,000 vehicles scanned. Over ₹4.2 Crore saved in concealed repairs and unaddressed mechanical liabilities.
          </p>
        </div>

        {/* Grid of 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4 pb-8">
          
          {/* Card 1: Side Card (Light: bg-white, border-charcoal/10) */}
          <div className="bg-white border border-[#171e19]/15 rounded-2xl p-8 flex flex-col justify-between brutalist-card">
            <div>
              {/* 5 Star icons in #ffe17c */}
              <div className="flex items-center gap-1 mb-6 text-[#ffe17c]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-[#ffe17c] stroke-[#ffe17c]" />
                ))}
              </div>

              <p className="font-satoshi text-lg font-medium text-[#171e19]/80 leading-relaxed mb-8">
                &ldquo;{TESTIMONIALS[0].quote}&rdquo;
              </p>
            </div>

            {/* Avatar footer */}
            <div className="flex items-center gap-4 pt-4 border-t border-[#171e19]/10">
              <div className="w-12 h-12 rounded-full bg-[#171e19] text-white font-anton text-sm flex items-center justify-center grayscale shadow-xs shrink-0">
                {TESTIMONIALS[0].initials}
              </div>
              <div>
                <p className="font-anton text-base text-[#171e19] tracking-wider uppercase">
                  {TESTIMONIALS[0].name}
                </p>
                <p className="font-satoshi text-xs text-[#171e19]/60 font-medium">
                  {TESTIMONIALS[0].role}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Center Card (Dark: bg-#171e19, text-white, 4px vertical offset: translate-y-4) */}
          <div className="bg-[#171e19] text-white rounded-2xl p-8 flex flex-col justify-between brutalist-card-dark md:translate-y-4 shadow-2xl border-2 border-[#ffe17c]">
            <div>
              <div className="flex items-center justify-between mb-6">
                {/* 5 Star icons in #ffe17c */}
                <div className="flex items-center gap-1 text-[#ffe17c]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-[#ffe17c] stroke-[#ffe17c]" />
                  ))}
                </div>
                <span className="px-2.5 py-0.5 bg-[#ffe17c] text-[#171e19] font-anton text-xs rounded">
                  FEATURED AUDIT
                </span>
              </div>

              <p className="font-satoshi text-lg font-medium text-white/90 leading-relaxed mb-8">
                &ldquo;{TESTIMONIALS[1].quote}&rdquo;
              </p>
            </div>

            {/* Avatar footer */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/15">
              <div className="w-12 h-12 rounded-full bg-[#ffe17c] text-[#171e19] font-anton text-sm font-bold flex items-center justify-center grayscale shadow-xs shrink-0">
                {TESTIMONIALS[1].initials}
              </div>
              <div>
                <p className="font-anton text-base text-white tracking-wider uppercase">
                  {TESTIMONIALS[1].name}
                </p>
                <p className="font-satoshi text-xs text-[#ffe17c] font-medium">
                  {TESTIMONIALS[1].role}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Side Card (Light: bg-white, border-charcoal/10) */}
          <div className="bg-white border border-[#171e19]/15 rounded-2xl p-8 flex flex-col justify-between brutalist-card">
            <div>
              {/* 5 Star icons in #ffe17c */}
              <div className="flex items-center gap-1 mb-6 text-[#ffe17c]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-[#ffe17c] stroke-[#ffe17c]" />
                ))}
              </div>

              <p className="font-satoshi text-lg font-medium text-[#171e19]/80 leading-relaxed mb-8">
                &ldquo;{TESTIMONIALS[2].quote}&rdquo;
              </p>
            </div>

            {/* Avatar footer */}
            <div className="flex items-center gap-4 pt-4 border-t border-[#171e19]/10">
              <div className="w-12 h-12 rounded-full bg-[#171e19] text-white font-anton text-sm flex items-center justify-center grayscale shadow-xs shrink-0">
                {TESTIMONIALS[2].initials}
              </div>
              <div>
                <p className="font-anton text-base text-[#171e19] tracking-wider uppercase">
                  {TESTIMONIALS[2].name}
                </p>
                <p className="font-satoshi text-xs text-[#171e19]/60 font-medium">
                  {TESTIMONIALS[2].role}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
