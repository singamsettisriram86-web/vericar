// components/AuthGate.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import LoginModal from './LoginModal';

interface AuthGateProps {
  rcNumber: string;
}

export default function AuthGate({ rcNumber }: AuthGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('vericar_user_email');
    setIsAuthenticated(Boolean(user));
  }, []);

  if (isAuthenticated === null || isAuthenticated === true) {
    return null; // Already logged in, no gate needed
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-[#171e19]/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border-2 border-[#171e19] shadow-[12px_12px_0px_0px_#ffe17c] rounded-2xl p-8 text-center brutalist-card">
          
          <div className="w-16 h-16 bg-[#ffe17c] text-[#171e19] rounded-full flex items-center justify-center mx-auto mb-5 shadow-xs">
            <Lock className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#171e19]/5 border border-[#171e19]/15 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#171e19]" />
            <span className="font-satoshi text-[11px] font-bold uppercase tracking-wider text-[#171e19]">
              MEMBERSHIP VERIFICATION REQUIRED
            </span>
          </div>

          <h2 className="font-anton text-3xl text-[#171e19] tracking-tight leading-none mb-3">
            UNLOCK VEHICLE AUDIT FOR {rcNumber}
          </h2>

          <p className="font-satoshi text-xs sm:text-sm text-[#171e19]/70 mb-6 leading-relaxed">
            Create a free VeriCar account or sign in with Google/Gmail to view the complete RTO ownership chain, active bank hypothecation, and AI maintenance projections.
          </p>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-[#171e19] hover:bg-black text-white hover:text-[#ffe17c] font-anton text-base py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-98 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>SIGN UP / LOG IN TO UNLOCK</span>
            <ArrowRight className="w-4 h-4 text-[#ffe17c]" />
          </button>

          <p className="font-satoshi text-[10px] text-[#171e19]/50 mt-4">
            Takes 5 seconds. No credit card required.
          </p>
        </div>
      </div>

      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pendingRc={rcNumber}
        initialMode="signup"
        onLoginSuccess={() => setIsAuthenticated(true)}
      />
    </>
  );
}
