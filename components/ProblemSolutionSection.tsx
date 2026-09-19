// components/ProblemSolutionSection.tsx
import React from 'react';
import { XCircle, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

const PROBLEMS = [
  {
    title: 'Hidden Odometer Rollbacks',
    detail: 'Over 38% of used cars in Indian metros have manipulated clusters to conceal 100,000+ km of commercial abuse.',
  },
  {
    title: 'Surprise ₹50k+ Repair Bills',
    detail: 'Dealers mask worn clutches, failing dual-mass flywheels, and blown turbos with temporary additives.',
  },
  {
    title: 'Unsettled Bank Loans & RTO Blacklists',
    detail: 'Buyers unknowingly purchase hypothecated vehicles with unpaid RC penalties and unserved police challans.',
  },
  {
    title: 'Flood & Severe Structural Accidents',
    detail: 'Cosmetically polished quarter panels conceal compromised chassis weld joints and rusted electronics.',
  },
];

const SOLUTIONS = [
  {
    title: 'Sovereign Vahan RC Forensics',
    detail: 'Verify genuine ownership chain, hypothecation NOC status, RTO blacklist flags, and authentic fitness validity in seconds.',
  },
  {
    title: 'AI Indian Maintenance Cost Matrix',
    detail: 'Predict realistic annual ownership expenditure broken down by engine oil, brake pads, tyres, and typical Indian road wear.',
  },
  {
    title: '150-Point Doorstep Mechanic Audit',
    detail: 'Certified mechanics inspect paint thickness via digital gauges, OBD-II ECU codes, engine compression, and underbody rust.',
  },
  {
    title: 'Instant Fair Value & Negotiation Leverage',
    detail: 'Empower yourself with hard repair estimates and chassis proof to negotiate ₹30,000 to ₹1,20,000 off dealer quotes.',
  },
];

export default function ProblemSolutionSection() {
  return (
    <section id="the-difference" className="w-full bg-[#171e19] text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Half: The Old Way (Problem) */}
        <div className="p-8 sm:p-12 lg:p-16 xl:p-20 bg-[#171e19] border-b lg:border-b-0 lg:border-r border-[#b7c6c2]/10 flex flex-col items-start justify-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-red-500/10 border border-red-500/20 text-red-400 font-satoshi text-xs uppercase tracking-widest font-bold mb-6">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>The Reality of Used Car Lots</span>
          </div>

          <h2 className="font-anton text-4xl sm:text-6xl text-white tracking-tight leading-[0.9] mb-4">
            THE OLD WAY
          </h2>

          <p className="font-satoshi text-[#b7c6c2] text-base sm:text-lg mb-12 max-w-lg leading-relaxed">
            Blind trust in smooth-talking brokers, dubious dealer claims, and relying on a casual 5-minute test drive around the block.
          </p>

          <div className="space-y-8 w-full">
            {PROBLEMS.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 group">
                <div className="mt-1 p-1 rounded-full bg-red-500/10 text-red-400 shrink-0">
                  <XCircle className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-anton text-xl text-white/90 tracking-wide mb-1 group-hover:text-red-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-satoshi text-sm text-[#b7c6c2]/80 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Half: The VeriCar Way (Solution) */}
        <div className="p-8 sm:p-12 lg:p-16 xl:p-20 bg-[#272727] border-l-0 lg:border-l-2 border-[#ffe17c] flex flex-col items-start justify-start relative">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#ffe17c]/10 border border-[#ffe17c]/30 text-[#ffe17c] font-satoshi text-xs uppercase tracking-widest font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#ffe17c]" />
            <span>The VeriCar Standard</span>
          </div>

          <h2 className="font-anton text-4xl sm:text-6xl text-[#ffe17c] tracking-tight leading-[0.9] mb-4">
            THE VERICAR WAY
          </h2>

          <p className="font-satoshi text-white/80 text-base sm:text-lg mb-12 max-w-lg leading-relaxed">
            Forensic RTO intelligence paired with AI cost projections and certified ground truth physical mechanics.
          </p>

          <div className="space-y-8 w-full">
            {SOLUTIONS.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 group">
                <div className="mt-1 p-1 rounded-full bg-[#ffe17c]/15 text-[#ffe17c] shrink-0">
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-anton text-xl text-white tracking-wide mb-1 group-hover:text-[#ffe17c] transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-satoshi text-sm text-white/70 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
