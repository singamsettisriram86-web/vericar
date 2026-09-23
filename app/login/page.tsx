// app/login/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, ArrowRight, ArrowLeft, CheckCircle2, Eye, EyeOff, User, Lock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabaseClient';

type AuthMode = 'signin' | 'signup';

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMsg('');
    setSuccessMsg('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const switchMode = (newMode: AuthMode) => {
    resetForm();
    setMode(newMode);
  };

  // ── Google OAuth ──────────────────────────────────────────────────────────
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
      if (error) setErrorMsg('Google sign-in failed. Please try again.');
    } catch {
      setErrorMsg('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Email + Password Sign In ──────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrorMsg('Incorrect email or password. Please try again.');
        } else if (error.message.includes('Email not confirmed')) {
          setErrorMsg('Please confirm your email first. Check your inbox for the verification link.');
        } else {
          setErrorMsg(error.message || 'Sign in failed. Please try again.');
        }
        return;
      }

      if (data?.user?.email) {
        // Ensure user account exists in DB
        await fetch('/api/auth/ensure-account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.user.email.toLowerCase(),
            name: data.user.user_metadata?.full_name || name || data.user.email.split('@')[0],
          }),
        });

        setSuccessMsg('Welcome back! Taking you to your dashboard...');
        setTimeout(() => router.push('/'), 900);
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Email + Password Sign Up ──────────────────────────────────────────────
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          setErrorMsg('An account with this email already exists. Please sign in instead.');
        } else {
          setErrorMsg(error.message || 'Account creation failed. Please try again.');
        }
        return;
      }

      // If email confirmation is disabled in Supabase, user is immediately active
      if (data?.user && !data?.user?.identities?.[0]?.identity_data?.email_verified && data?.session === null) {
        setSuccessMsg('Account created! Please check your email inbox and click the confirmation link to activate your account.');
      } else if (data?.session) {
        // No email confirmation required — log them in directly
        await fetch('/api/auth/ensure-account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            name: name.trim(),
          }),
        });
        setSuccessMsg('Account created! Welcome to VeriCar 🎉');
        setTimeout(() => router.push('/'), 900);
      } else {
        setSuccessMsg('Account created! Check your email to confirm your address and get started.');
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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

          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffe17c]/30 border border-[#ffe17c] mb-3">
              <ShieldCheck className="w-4 h-4 text-[#171e19]" />
              <span className="font-satoshi text-[11px] font-bold uppercase tracking-wider text-[#171e19]">
                VERICAR GATEWAY
              </span>
            </div>
            <h1 className="font-anton text-4xl text-[#171e19] tracking-tight leading-none">
              {mode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
            </h1>
            <p className="font-satoshi text-sm text-[#171e19]/70 mt-2 leading-relaxed">
              {mode === 'signin'
                ? 'Sign in to save vehicle searches, manage bookings, and view your credits.'
                : 'Create your free account. You get 1 free vehicle inspection credit on sign up.'}
            </p>
          </div>

          {/* Mode Tab Toggle */}
          <div className="flex rounded-xl border-2 border-[#171e19] overflow-hidden mb-6">
            <button
              onClick={() => switchMode('signin')}
              className={`flex-1 py-2.5 font-satoshi text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-[#171e19] text-[#ffe17c]'
                  : 'bg-white text-[#171e19]/60 hover:text-[#171e19] hover:bg-neutral-50'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={`flex-1 py-2.5 font-satoshi text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-l-2 border-[#171e19] ${
                mode === 'signup'
                  ? 'bg-[#171e19] text-[#ffe17c]'
                  : 'bg-white text-[#171e19]/60 hover:text-[#171e19] hover:bg-neutral-50'
              }`}
            >
              Create Account
            </button>
          </div>

          {successMsg ? (
            <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
              <p className="font-anton text-lg text-green-900">{successMsg}</p>
            </div>
          ) : (
            <div className="space-y-4">

              {/* Google OAuth Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white hover:bg-neutral-50 border-2 border-[#171e19] rounded-xl font-satoshi text-sm font-bold text-[#171e19] transition-all hover:scale-[1.01] active:scale-98 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-[#171e19]/15 w-full" />
                <span className="bg-white px-3 font-satoshi text-xs font-semibold uppercase tracking-wider text-[#171e19]/50 shrink-0">
                  OR
                </span>
              </div>

              {/* Sign In Form */}
              {mode === 'signin' && (
                <form onSubmit={handleSignIn} className="space-y-3">
                  {/* Email */}
                  <div>
                    <label className="block font-satoshi text-xs font-bold uppercase tracking-wider text-[#171e19] mb-1.5">
                      Email Address
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
                        placeholder="yourname@email.com"
                        className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border border-[#171e19]/20 rounded-xl font-satoshi text-sm text-[#171e19] focus:outline-none focus:border-[#171e19] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block font-satoshi text-xs font-bold uppercase tracking-wider text-[#171e19] mb-1.5">
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-[#171e19]/40">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your password"
                        className="w-full pl-10 pr-10 py-3 bg-[#f8f9fa] border border-[#171e19]/20 rounded-xl font-satoshi text-sm text-[#171e19] focus:outline-none focus:border-[#171e19] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-[#171e19]/40 hover:text-[#171e19] transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {errorMsg && (
                    <p className="text-xs font-satoshi text-red-800 bg-red-50 p-2.5 rounded-lg border border-red-200">
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#171e19] hover:bg-black text-white hover:text-[#ffe17c] font-anton text-base py-3.5 rounded-xl transition-all hover:scale-[1.01] active:scale-98 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{loading ? 'SIGNING IN...' : 'SIGN IN'}</span>
                    <ArrowRight className="w-4 h-4 text-[#ffe17c]" />
                  </button>

                  <p className="text-center font-satoshi text-xs text-[#171e19]/50">
                    No account yet?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('signup')}
                      className="font-bold text-[#171e19] underline cursor-pointer hover:text-[#171e19]/70"
                    >
                      Create one free
                    </button>
                  </p>
                </form>
              )}

              {/* Sign Up Form */}
              {mode === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-3">
                  {/* Full Name */}
                  <div>
                    <label className="block font-satoshi text-xs font-bold uppercase tracking-wider text-[#171e19] mb-1.5">
                      Full Name
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-[#171e19]/40">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Rajesh Kumar"
                        className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border border-[#171e19]/20 rounded-xl font-satoshi text-sm text-[#171e19] focus:outline-none focus:border-[#171e19] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-satoshi text-xs font-bold uppercase tracking-wider text-[#171e19] mb-1.5">
                      Email Address
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
                        placeholder="yourname@email.com"
                        className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border border-[#171e19]/20 rounded-xl font-satoshi text-sm text-[#171e19] focus:outline-none focus:border-[#171e19] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block font-satoshi text-xs font-bold uppercase tracking-wider text-[#171e19] mb-1.5">
                      Password <span className="font-normal text-[#171e19]/50 normal-case tracking-normal">(min. 8 characters)</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-[#171e19]/40">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="w-full pl-10 pr-10 py-3 bg-[#f8f9fa] border border-[#171e19]/20 rounded-xl font-satoshi text-sm text-[#171e19] focus:outline-none focus:border-[#171e19] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-[#171e19]/40 hover:text-[#171e19] transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block font-satoshi text-xs font-bold uppercase tracking-wider text-[#171e19] mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-[#171e19]/40">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        className="w-full pl-10 pr-10 py-3 bg-[#f8f9fa] border border-[#171e19]/20 rounded-xl font-satoshi text-sm text-[#171e19] focus:outline-none focus:border-[#171e19] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 text-[#171e19]/40 hover:text-[#171e19] transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {errorMsg && (
                    <p className="text-xs font-satoshi text-red-800 bg-red-50 p-2.5 rounded-lg border border-red-200">
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#171e19] hover:bg-black text-white hover:text-[#ffe17c] font-anton text-base py-3.5 rounded-xl transition-all hover:scale-[1.01] active:scale-98 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{loading ? 'CREATING ACCOUNT...' : 'CREATE FREE ACCOUNT'}</span>
                    <ArrowRight className="w-4 h-4 text-[#ffe17c]" />
                  </button>

                  <p className="text-center font-satoshi text-xs text-[#171e19]/50">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('signin')}
                      className="font-bold text-[#171e19] underline cursor-pointer hover:text-[#171e19]/70"
                    >
                      Sign in
                    </button>
                  </p>

                  {/* Free credit callout */}
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-[#ffe17c]/20 rounded-xl border border-[#ffe17c]/60">
                    <span className="text-base">⚡</span>
                    <p className="font-satoshi text-xs text-[#171e19]/80">
                      <span className="font-bold">1 Free Inspection Credit</span> will be added to your account on signup.
                    </p>
                  </div>
                </form>
              )}

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
