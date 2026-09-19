// components/Navbar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Search, ArrowRight, Car } from 'lucide-react';

export default function Navbar() {
  const [quickRc, setQuickRc] = useState('');

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-md z-50 border-b border-[#171e19]/10 transition-all">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo left */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="font-anton text-3xl sm:text-4xl text-[#171e19] tracking-wider transition-colors group-hover:text-black">
            VERICAR<span className="text-[#ffe17c] text-4xl">.</span>
          </span>
        </Link>

        {/* Center nav links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/#features"
            className="font-satoshi text-sm font-medium text-[#171e19]/80 hover:text-[#171e19] transition-colors uppercase tracking-wider"
          >
            Capabilities
          </Link>
          <Link
            href="/#the-difference"
            className="font-satoshi text-sm font-medium text-[#171e19]/80 hover:text-[#171e19] transition-colors uppercase tracking-wider"
          >
            The Difference
          </Link>
          <Link
            href="/#how-it-works"
            className="font-satoshi text-sm font-medium text-[#171e19]/80 hover:text-[#171e19] transition-colors uppercase tracking-wider"
          >
            Protocol
          </Link>
          <Link
            href="/#reviews"
            className="font-satoshi text-sm font-medium text-[#171e19]/80 hover:text-[#171e19] transition-colors uppercase tracking-wider"
          >
            Verifications
          </Link>
        </nav>

        {/* Right action group */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/#verify"
            className="font-satoshi text-sm font-semibold text-[#171e19]/80 hover:text-[#171e19] transition-colors hidden sm:inline-block"
          >
            Login
          </Link>

          <Link
            href="/#verify"
            className="inline-flex items-center gap-2 bg-[#171e19] hover:bg-black text-white font-satoshi text-sm font-medium px-5 sm:px-6 py-2.5 rounded-full transition-all hover:scale-105 shadow-sm active:scale-95"
          >
            <span>Run RC Check</span>
            <ArrowRight className="w-4 h-4 text-[#ffe17c]" />
          </Link>
        </div>

      </div>
    </header>
  );
}
