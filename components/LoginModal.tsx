// components/LoginModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, ShieldCheck, Mail, ArrowRight, CheckCircle2, User, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabaseClient';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (userEmail: string) => void;
  pendingRc?: string;
  initialMode?: 'signup' | 'login';
}

export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
  pendingRc,
  initialMode = 'signup',
}: LoginModalProps) {
  const [mode, setMode] = useState<'signup' | 'login'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMsg('');
    if (pendingRc) {
      localStorage.setItem('vericar_pending_rc', pendingRc);
    }

    try {
      const supabase = createClient();
      const nextPath = pendingRc ? `/report/${encodeURIComponent(pendingRc)}` : '/';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        },
      });

      if (error) {
        setErrorMsg('Enter your Gmail address below for instant 1-click verification.');
      }
    } catch {
      setErrorMsg('Enter your Gmail address below to proceed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid Gmail / Email address');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setErrorMsg('Please enter your name');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const displayName = name.trim() || cleanEmail.split('@')[0];
    localStorage.setItem('vericar_user_email', cleanEmail);
    localStorage.setItem('vericar_user_name', displayName);

    const message = mode === 'signup' ? `Account created! Welcome, ${displayName}.` : `Welcome back, ${displayName}!`;
    setSuccessMsg(message);

    setTimeout(() => {
      if (onLoginSuccess) onLoginSuccess(cleanEmail);
      onClose();

      const targetRc = pendingRc || localStorage.getItem('vericar_pending_rc');
      if (targetRc) {
        localStorage.removeItem('vericar_pending_rc');
        router.push(`/report/${encodeURIComponent(targetRc)}`);
      }
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl border-2 border-[#171e19] shadow-[10px_10px_0px_0px_#171e19] p-6 sm:p-8 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#171e19]/60 hover:text-[#171e19] hover:bg-[#171e19]/5 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pending vehicle banner if trying to inspect */}
        {pendingRc && (
          <div className="mb-4 p-2.5 bg-[#ffe17c]/40 border border-[#171e19]/30 rounded-xl flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#171e19]" />
            <span className="font-anton text-xs text-[#171e19] tracking-wider">
              CREATE ACCOUNT TO UNLOCK AUDIT FOR {pendingRc}
            </span>
          </div>
        )}

        {/* Mode Toggle (Sign Up vs Sign In) */}
        <div className="flex items-center gap-2 p-1 bg-[#f8f9fa] border border-[#171e19]/15 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-anton tracking-wider rounded-lg transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#171e19] text-[#ffe17c] shadow-xs'
                : 'text-[#171e19]/60 hover:text-[#171e19]'
            }`}
          >
            CREATE ACCOUNT (SIGN UP)
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-anton tracking-wider rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-[#171e19] text-[#ffe17c] shadow-xs'
                : 'text-[#171e19]/60 hover:text-[#171e19]'
            }`}
          >
            SIGN IN (LOG IN)
          </button>
        </div>

        {/* Header */}
        <div className="mb-5">
          <h2 className="font-anton text-2xl sm:text-3xl text-[#171e19] tracking-tight leading-none">
            {mode === 'signup' ? 'START YOUR VERIFICATION ACCOUNT' : 'WELCOME BACK TO VERICAR'}
          </h2>
          <p className="font-satoshi text-xs text-[#171e19]/70 mt-2 leading-relaxed">
            {mode === 'signup'
              ? 'Create a free account with Google/Gmail to inspect vehicles, download certified PDFs, and save car history.'
              : 'Sign in to access your saved reports and inspection bookings.'}
          </p>
        </div>

        {successMsg ? (
          <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
            <p className="font-anton text-lg text-green-900">{successMsg}</p>
            <p className="font-satoshi text-xs text-green-700">Loading your vehicle intelligence...</p>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Google / Gmail button */}
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-neutral-50 border-2 border-[#171e19] rounded-xl font-satoshi text-xs font-bold text-[#171e19] transition-all hover:scale-[1.01] active:scale-98 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{mode === 'signup' ? 'Sign up with Google / Gmail' : 'Continue with Google / Gmail'}</span>
            </button>

            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-[#171e19]/15 w-full" />
              <span className="bg-white px-3 font-satoshi text-[11px] font-bold uppercase tracking-wider text-[#171e19]/50 shrink-0">
                OR WITH GMAIL ADDRESS
              </span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'signup' && (
                <div>
                  <label className="block font-satoshi text-[11px] font-bold uppercase tracking-wider text-[#171e19] mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-[#171e19]/40">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required={mode === 'signup'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sriram Singamsetti"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#f8f9fa] border border-[#171e19]/20 rounded-xl font-satoshi text-xs text-[#171e19] focus:outline-none focus:border-[#171e19]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-satoshi text-[11px] font-bold uppercase tracking-wider text-[#171e19] mb-1">
                  Gmail / Email Address *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-[#171e19]/40">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#f8f9fa] border border-[#171e19]/20 rounded-xl font-satoshi text-xs text-[#171e19] focus:outline-none focus:border-[#171e19]"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs font-satoshi text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#171e19] hover:bg-black text-white hover:text-[#ffe17c] font-anton text-sm py-3 rounded-xl transition-all hover:scale-[1.01] active:scale-98 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{mode === 'signup' ? 'CREATE FREE ACCOUNT & UNLOCK AUDIT' : 'SIGN IN & CONTINUE'}</span>
                <ArrowRight className="w-4 h-4 text-[#ffe17c]" />
              </button>
            </form>

            <p className="text-center font-satoshi text-[10px] text-[#171e19]/50 mt-2">
              Free instant account. No credit card required.
            </p>

          </div>
        )}

      </div>

    </div>
  );
}
