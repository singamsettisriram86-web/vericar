// components/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, User, LogOut, ShieldCheck, Menu, X, Zap } from 'lucide-react';
import LoginModal from './LoginModal';
import RechargeModal from './RechargeModal';
import { createClient } from '@/lib/supabaseClient';

export default function Navbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    setIsMobileMenuOpen(false);
  };

  const handleRunRcCheck = (e: React.MouseEvent) => {
    setIsMobileMenuOpen(false);
    if (!currentUser) {
      e.preventDefault();
      setIsLoginModalOpen(true);
    } else {
      // If already on homepage, scroll smoothly to the RC input box and focus
      if (typeof window !== 'undefined' && window.location.pathname === '/') {
        const rcInput = (document.querySelector('input[placeholder*="AP05"]') ||
          document.querySelector('input[placeholder*="KA"]') ||
          document.querySelector('input[type="text"]')) as HTMLInputElement;
        if (rcInput) {
          e.preventDefault();
          rcInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => rcInput.focus(), 250);
        }
      }
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 sm:h-20 bg-white/95 backdrop-blur-md z-40 border-b border-[#171e19]/10 transition-all">
        <div className="max-w-7xl mx-auto h-full px-3 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo left */}
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-1 group shrink-0">
            <span className="font-anton text-2xl sm:text-3xl md:text-4xl text-[#171e19] tracking-wider transition-colors group-hover:text-black">
              VERICAR<span className="text-[#ffe17c] text-3xl sm:text-4xl">.</span>
            </span>
          </Link>

          {/* Center nav links (desktop) */}
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

          {/* Right action group (desktop & mobile) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {currentUser ? (
              <>
                {/* Mobile Credits compact button */}
                <button
                  onClick={() => setIsRechargeModalOpen(true)}
                  title="Click to recharge inspection credits"
                  className="md:hidden inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#171e19] bg-[#ffe17c] font-anton text-xs text-[#171e19] active:scale-95 transition-transform"
                >
                  <span>⚡</span>
                  <span>{credits !== null ? credits : '0'}</span>
                  <span className="text-[10px] uppercase font-satoshi font-bold">CR</span>
                </button>

                {/* Desktop Credits full button */}
                <button
                  onClick={() => setIsRechargeModalOpen(true)}
                  title="Click to recharge inspection credits"
                  className={`hidden md:inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border-2 font-anton text-xs sm:text-sm tracking-wider transition-all hover:scale-[1.02] active:scale-95 shadow-xs cursor-pointer ${
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

                {/* Desktop Account details chip */}
                <div className="hidden md:flex items-center gap-2 px-2.5 py-1.5 bg-[#f8f9fa] border border-[#171e19]/20 rounded-xl">
                  <div className="w-5 h-5 rounded-full bg-[#171e19] text-[#ffe17c] font-anton text-[10px] flex items-center justify-center shrink-0">
                    {currentUser.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-satoshi text-xs font-bold text-[#171e19] max-w-[130px] truncate">
                    {currentUser}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                </div>

                {/* Desktop Sign Out button */}
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="hidden md:inline-flex p-2 text-[#171e19]/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="font-satoshi text-xs sm:text-sm font-semibold text-[#171e19]/80 hover:text-[#171e19] transition-colors cursor-pointer px-2 py-1"
              >
                Login
              </button>
            )}

            {/* Desktop Run RC Check */}
            <button
              type="button"
              onClick={handleRunRcCheck}
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#171e19] hover:bg-black text-white font-satoshi text-xs sm:text-sm font-medium px-3 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all hover:scale-105 shadow-sm active:scale-95 cursor-pointer shrink-0"
            >
              <span>Run RC Check</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#ffe17c]" />
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 text-[#171e19] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#171e19]/15 shadow-xl animate-in slide-in-from-top-2 duration-150 px-4 pt-3 pb-6 space-y-4">
            
            {/* User status card on mobile */}
            {currentUser && (
              <div className="p-3 bg-[#f8f9fa] border border-[#171e19]/15 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#171e19] text-[#ffe17c] font-anton text-xs flex items-center justify-center shrink-0">
                      {currentUser.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-satoshi text-xs font-bold text-[#171e19] max-w-[170px] truncate">
                      {currentUser}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1 text-[11px] font-satoshi font-semibold text-red-600 hover:text-red-700 p-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#171e19]/10">
                  <span className="font-satoshi text-xs text-[#171e19]/70">
                    Available Credits: <strong className="font-anton text-sm text-[#171e19]">{credits !== null ? credits : 0}</strong>
                  </span>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsRechargeModalOpen(true);
                    }}
                    className="px-2.5 py-1 bg-[#ffe17c] border border-[#171e19] rounded-md font-anton text-xs text-[#171e19] active:scale-95"
                  >
                    + RECHARGE
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-2 pt-1 font-satoshi text-sm font-semibold text-[#171e19]">
              <Link
                href="/#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-2 hover:bg-neutral-50 rounded-lg uppercase tracking-wider text-xs"
              >
                Capabilities
              </Link>
              <Link
                href="/#the-difference"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-2 hover:bg-neutral-50 rounded-lg uppercase tracking-wider text-xs"
              >
                The Difference
              </Link>
              <Link
                href="/#how-it-works"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-2 hover:bg-neutral-50 rounded-lg uppercase tracking-wider text-xs"
              >
                Protocol
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-2 hover:bg-neutral-50 rounded-lg uppercase tracking-wider text-xs text-[#171e19]/70"
              >
                Support & Contact
              </Link>
            </div>

            {/* Mobile Run RC Check Primary Action */}
            <button
              type="button"
              onClick={handleRunRcCheck}
              className="w-full flex items-center justify-center gap-2 bg-[#171e19] text-white py-3 rounded-xl font-anton text-sm tracking-wider shadow-md cursor-pointer active:scale-98"
            >
              <span>RUN RC CHECK NOW</span>
              <ArrowRight className="w-4 h-4 text-[#ffe17c]" />
            </button>

          </div>
        )}
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

