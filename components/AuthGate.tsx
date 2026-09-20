// components/AuthGate.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import LoginModal from './LoginModal';
import RechargeModal from './RechargeModal';

interface AuthGateProps {
  rcNumber: string;
}

export default function AuthGate({ rcNumber }: AuthGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const checkUserAccess = async (email: string) => {
    try {
      const res = await fetch('/api/user/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          rcNumber,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setHasAccess(true);
      } else {
        setHasAccess(false);
        setIsRechargeModalOpen(true);
      }
    } catch {
      setHasAccess(true);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem('vericar_user_email');
    if (user) {
      setIsAuthenticated(true);
      setUserEmail(user);
      checkUserAccess(user);
    } else {
      setIsAuthenticated(false);
    }
  }, [rcNumber]);

  if (isAuthenticated === true && hasAccess === true) {
    return null; // Full access granted
  }

  return (
    <>
      {/* Unauthenticated Gate */}
      {isAuthenticated === false && (
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
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full bg-[#171e19] hover:bg-black text-white hover:text-[#ffe17c] font-anton text-base py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-98 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>SIGN UP / LOG IN TO UNLOCK</span>
              <ArrowRight className="w-4 h-4 text-[#ffe17c]" />
            </button>

            <p className="font-satoshi text-[10px] text-[#171e19]/50 mt-4">
              Takes 5 seconds. 1 Free Inspection included.
            </p>
          </div>
        </div>
      )}

      {/* 0 Credits Block Gate for Logged-In User */}
      {isAuthenticated === true && hasAccess === false && (
        <div className="fixed inset-0 z-50 bg-[#171e19]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border-2 border-[#171e19] shadow-[12px_12px_0px_0px_#ffe17c] rounded-2xl p-8 text-center brutalist-card">
            
            <div className="w-16 h-16 bg-[#ffe17c] text-[#171e19] rounded-full flex items-center justify-center mx-auto mb-5 shadow-xs">
              <Zap className="w-8 h-8 stroke-[2.5] text-[#171e19]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 mb-3">
              <span className="font-satoshi text-[11px] font-bold uppercase tracking-wider text-amber-900">
                0 INSPECTION CREDITS REMAINING
              </span>
            </div>

            <h2 className="font-anton text-3xl text-[#171e19] tracking-tight leading-none mb-3">
              RECHARGE TO AUDIT {rcNumber}
            </h2>

            <p className="font-satoshi text-xs sm:text-sm text-[#171e19]/70 mb-6 leading-relaxed">
              You have completed your free vehicle inspection. Recharge your account with our Starter Pack (₹49 for 3 checks) or Value Pack (₹99 for 8 checks) to inspect {rcNumber}.
            </p>

            <button
              onClick={() => setIsRechargeModalOpen(true)}
              className="w-full bg-[#171e19] hover:bg-black text-white hover:text-[#ffe17c] font-anton text-base py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-98 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>RECHARGE NOW (FROM ₹49)</span>
              <ArrowRight className="w-4 h-4 text-[#ffe17c]" />
            </button>
          </div>
        </div>
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        pendingRc={rcNumber}
        initialMode="signup"
        onLoginSuccess={(email) => {
          setIsAuthenticated(true);
          setUserEmail(email);
          checkUserAccess(email);
        }}
      />

      <RechargeModal
        isOpen={isRechargeModalOpen}
        onClose={() => setIsRechargeModalOpen(false)}
        userEmail={userEmail}
        pendingRc={rcNumber}
        onSuccess={() => {
          setHasAccess(true);
        }}
      />
    </>
  );
}

