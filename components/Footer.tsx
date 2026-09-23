// components/Footer.tsx
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#171e19] text-white border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-anton text-3xl sm:text-4xl text-white tracking-wider">
                VERICAR<span className="text-[#ffe17c]">.</span>
              </span>
            </Link>
            <p className="font-satoshi text-sm text-[#b7c6c2] max-w-md leading-relaxed">
              India&apos;s independent automotive truth protocol. We cross-reference MoRTH Vahan registries, state police challan databases, and proprietary AI repair algorithms to protect car buyers.
            </p>
          </div>

          <div>
            <h4 className="font-anton text-sm tracking-wider text-[#ffe17c] uppercase mb-4">
              CAPABILITIES
            </h4>
            <ul className="space-y-2.5 font-satoshi text-xs text-white/70">
              <li><Link href="/#verify" className="hover:text-white transition-colors">Vahan RC Check</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors">AI Maintenance Forecaster</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors">Doorstep Vehicle Inspection</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors">e-Challan & Blacklist Scan</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-anton text-sm tracking-wider text-[#ffe17c] uppercase mb-4">
              SUPPORT & NETWORK
            </h4>
            <ul className="space-y-2.5 font-satoshi text-xs text-white/70">
              <li><span className="text-white/40">Coverage: Bengaluru, Delhi NCR, Mumbai, Hyderabad, Chennai</span></li>
              <li><span className="text-white/40">Support: support@vericar.in</span></li>
              <li><span className="text-white/40">Hours: 9:00 AM - 8:00 PM IST</span></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-satoshi text-xs text-white/40">
          <p>© {new Date().getFullYear()} VeriCar Technologies India. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Disclaimers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
