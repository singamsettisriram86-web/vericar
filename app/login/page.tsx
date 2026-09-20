// app/login/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setErrorMsg('Enter your Gmail address below to access your terminal.');
      }
    } catch {
      setErrorMsg('Enter your Gmail address below for fast access.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email or Gmail address');
      return;
    }

    setLoading(true);
    localStorage.setItem('vericar_user_email', cleanEmail);
    localStorage.setItem('vericar_user_name', cleanEmail.split('@')[0]);
    setSuccessMsg(`Access granted for ${cleanEmail}!`);
    setTimeout(() => {
      router.push('/');
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#171e19]">
      <Navbar />

      <main className="pt-32 pb-24 bg-[#ffffff] bg-grid-light flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl border-2 border-[#171e19] shadow-[12px_12px_0px_0px_#171e19] p-8 brutalist-card relative">
          
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-satoshi text-xs font-bold uppercase tracking-wider text-[#171e19]/60 hover:text-[#171e19] mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffe17c]/30 border border-[#ffe17c] mb-3">
              <ShieldCheck className="w-4 h-4 text-[#171e19]" />
              <span className="font-satoshi text-[11px] font-bold uppercase tracking-wider text-[#171e19]">
                VERICAR GATEWAY
              </span>
            </div>

            <h1 className="font-anton text-4xl text-[#171e19] tracking-tight leading-none">
              SIGN IN TO VERICAR
            </h1>

            <p className="font-satoshi text-sm text-[#171e19]/70 mt-2 leading-relaxed">
              Sign in with your Google or Gmail account to save vehicle searches, manage bookings, and download inspection reports.
            </p>
          </div>

          {successMsg ? (
            <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
              <p className="font-anton text-lg text-green-900">{successMsg}</p>
              <p className="font-satoshi text-xs text-green-700">Redirecting to terminal...</p>
            </div>
          ) : (
            <div className="space-y-4">
              
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white hover:bg-neutral-50 border-2 border-[#171e19] rounded-xl font-satoshi text-sm font-bold text-[#171e19] transition-all hover:scale-[1.01] active:scale-98 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google / Gmail</span>
              </button>

              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-[#171e19]/15 w-full" />
                <span className="bg-white px-3 font-satoshi text-xs font-semibold uppercase tracking-wider text-[#171e19]/50 shrink-0">
                  OR ENTER GMAIL ADDRESS
                </span>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <div>
                  <label className="block font-satoshi text-xs font-bold uppercase tracking-wider text-[#171e19] mb-1.5">
                    Your Gmail Address
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-[#171e19]/40">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="yourname@gmail.com"
                      className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border border-[#171e19]/20 rounded-xl font-satoshi text-sm text-[#171e19] focus:outline-none focus:border-[#171e19]"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs font-satoshi text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#171e19] hover:bg-black text-white hover:text-[#ffe17c] font-anton text-base py-3.5 rounded-xl transition-all hover:scale-[1.01] active:scale-98 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>SIGN IN</span>
                  <ArrowRight className="w-4 h-4 text-[#ffe17c]" />
                </button>
              </form>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
