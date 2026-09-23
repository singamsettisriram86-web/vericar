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
    // 1. Check cookies first (set immediately by OAuth callback redirect)
    const getCookie = (name: string) => {
      if (typeof document === 'undefined') return null;
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    };

    const cookieEmail = getCookie('vericar_user_email');
    if (cookieEmail) {
      localStorage.setItem('vericar_user_email', cookieEmail);
      setCurrentUser(cookieEmail);
      fetchCredits(cookieEmail);
    }

    // 2. Check local storage session
    const local = localStorage.getItem('vericar_user_email');
    if (local && !cookieEmail) {
      setCurrentUser(local);
      fetchCredits(local);
    }

    // 3. Listen to Supabase auth state change
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user?.email) {
          const userEmail = data.user.email.toLowerCase();
          setCurrentUser(userEmail);
          localStorage.setItem('vericar_user_email', userEmail);
          fetchCredits(userEmail);
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user?.email) {
          const userEmail = session.user.email.toLowerCase();
          setCurrentUser(userEmail);
          localStorage.setItem('vericar_user_email', userEmail);
          fetchCredits(userEmail);
        }
      });

      return () => {
        authListener?.subscription.unsubscribe();
      };
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
          </nav>

          {/* Right action group */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {currentUser ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Clear prominent credits pill */}
                <button
                  onClick={() => setIsRechargeModalOpen(true)}
                  title="Click to recharge inspection credits"
                  className={`inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border-2 font-anton text-xs sm:text-sm tracking-wider transition-all hover:scale-[1.02] active:scale-95 shadow-xs cursor-pointer ${
                    credits === 0
                      ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
                      : 'bg-[#ffe17c] border-[#171e19] text-[#171e19] hover:bg-[#ffdc5c]'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <span>⚡</span>
                    <span>{credits !== null ? credits : '0'}</span>
                    <span className="font-satoshi text-xs font-bold uppercase">{credits === 1 ? 'CREDIT' : 'CREDITS'}</span>
                  </span>
                  <span className="px-1.5 py-0.5 bg-[#171e19] text-white text-[10px] rounded font-satoshi font-bold uppercase tracking-wider">
                    +RECHARGE
                  </span>
                </button>

                {/* Account details chip */}
                <div className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-[#f8f9fa] border border-[#171e19]/20 rounded-xl">
                  <div className="w-5 h-5 rounded-full bg-[#171e19] text-[#ffe17c] font-anton text-[10px] flex items-center justify-center shrink-0">
                    {currentUser.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-satoshi text-xs font-bold text-[#171e19] max-w-[90px] sm:max-w-[140px] truncate">
                    {currentUser}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 text-[#171e19]/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
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

