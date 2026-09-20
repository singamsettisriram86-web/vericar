// components/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, User, LogOut, ShieldCheck } from 'lucide-react';
import LoginModal from './LoginModal';
import RechargeModal from './RechargeModal';
import { createClient } from '@/lib/supabaseClient';

export default function Navbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);

  const fetchCredits = async (email: string) => {
    try {
      const res = await fetch(`/api/user/credits?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data && typeof data.credits === 'number') {
        setCredits(data.credits);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    // 1. Check local session
    const local = localStorage.getItem('vericar_user_email');
    if (local) {
      setCurrentUser(local);
      fetchCredits(local);
    }

    // 2. Check Supabase auth session
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user?.email) {
          setCurrentUser(data.user.email);
          localStorage.setItem('vericar_user_email', data.user.email);
          fetchCredits(data.user.email);
        }
      });
    } catch {
      // ignore
    }
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('vericar_user_email');
    localStorage.removeItem('vericar_user_name');
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setCurrentUser(null);
    setCredits(null);
  };


  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-md z-40 border-b border-[#171e19]/10 transition-all">
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
          <div className="flex items-center gap-3 sm:gap-5">
            
            {currentUser ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Credits pill */}
                <button
                  onClick={() => setIsRechargeModalOpen(true)}
                  title="Click to recharge credits"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-satoshi text-xs font-bold transition-all border cursor-pointer ${
                    credits === 0
                      ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
                      : 'bg-[#ffe17c]/25 hover:bg-[#ffe17c]/40 border-[#171e19]/20 text-[#171e19]'
                  }`}
                >
                  <span>⚡ {credits !== null ? credits : '...'} {credits === 1 ? 'Credit' : 'Credits'}</span>
                  <span className="text-[10px] uppercase font-bold text-[#171e19]/60 underline hidden sm:inline">
                    +Recharge
                  </span>
                </button>

                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#f8f9fa] border border-[#171e19]/15 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-satoshi text-xs font-bold text-[#171e19] max-w-[130px] truncate">
                    {currentUser}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="font-satoshi text-xs font-semibold text-[#171e19]/60 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer ml-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="font-satoshi text-sm font-semibold text-[#171e19]/80 hover:text-[#171e19] transition-colors cursor-pointer"
              >
                Login
              </button>
            )}

            <Link
              href="/#verify"
              className="inline-flex items-center gap-2 bg-[#171e19] hover:bg-black text-white font-satoshi text-sm font-medium px-4 sm:px-6 py-2.5 rounded-full transition-all hover:scale-105 shadow-sm active:scale-95 text-xs sm:text-sm"
            >
              <span>Run RC Check</span>
              <ArrowRight className="w-4 h-4 text-[#ffe17c]" />
            </Link>
          </div>

        </div>
      </header>

      {/* Interactive Google/Gmail Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(email) => {
          setCurrentUser(email);
          fetchCredits(email);
        }}
      />

      {/* Recharge Credits Modal */}
      <RechargeModal
        isOpen={isRechargeModalOpen}
        onClose={() => setIsRechargeModalOpen(false)}
        userEmail={currentUser || ''}
        onSuccess={(newCredits) => {
          setCredits(newCredits);
        }}
      />
    </>
  );
}

