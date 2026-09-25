// components/RechargeModal.tsx
'use client';

import React, { useState } from 'react';
import { X, Zap, Check, ShieldCheck, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onSuccess?: (newCredits: number) => void;
  pendingRc?: string;
}

export default function RechargeModal({
  isOpen,
  onClose,
  userEmail,
  onSuccess,
  pendingRc,
}: RechargeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'CREDITS_49' | 'CREDITS_99'>('CREDITS_99');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleRecharge = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Create order
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          plan: selectedPlan,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      // 1. Cashfree Live Checkout Flow
      if (orderData.paymentSessionId && typeof window !== 'undefined') {
        const CashfreeSDK = (window as any).Cashfree;
        if (CashfreeSDK) {
          const cashfree = CashfreeSDK({ mode: 'production' });
          cashfree.checkout({
            paymentSessionId: orderData.paymentSessionId,
            redirectTarget: '_modal',
          }).then(async (result: any) => {
            if (result?.error) {
              setErrorMsg(result.error.message || 'Payment cancelled or failed.');
              setLoading(false);
              return;
            }

            try {
              const verifyRes = await fetch('/api/payment/cashfree-verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: orderData.orderId,
                  email: userEmail,
                  plan: selectedPlan,
                }),
              });
              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                setSuccessMsg(`Successfully added ${selectedPlan === 'CREDITS_49' ? 3 : 8} credits!`);
                setTimeout(() => {
                  if (onSuccess) onSuccess(verifyData.credits || 0);
                  onClose();
                  window.location.reload();
                }, 1000);
              } else {
                setErrorMsg(verifyData.message || 'Verification pending. Refreshing...');
                setTimeout(() => window.location.reload(), 1500);
              }
            } catch {
              window.location.reload();
            } finally {
              setLoading(false);
            }
          });
          return;
        }
      }

      // 2. Razorpay Fallback Flow
      const hasRealKey =
        orderData.keyId &&
        orderData.keyId.startsWith('rzp_') &&
        !orderData.keyId.includes('placeholder');

      if (typeof window !== 'undefined' && window.Razorpay && hasRealKey) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amountPaise,
          currency: 'INR',
          name: 'VeriCar Inspections',
          description:
            selectedPlan === 'CREDITS_49'
              ? '3 Vehicle Inspection Credits'
              : '8 Vehicle Inspection Credits',
          order_id: orderData.orderId,
          prefill: {
            email: userEmail,
          },
          theme: {
            color: '#171e19',
          },
          handler: async function (response: any) {
            await verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setErrorMsg(resp.error?.description || 'Payment was cancelled or failed.');
          setLoading(false);
        });
        rzp.open();
      } else {
        setErrorMsg('Payment gateway unavailable. Please refresh the page and try again.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Recharge error:', err);
      setErrorMsg(err.message || 'Payment initiation failed. Please try again.');
      setLoading(false);
    }
  };

  const verifyPayment = async (payDetails: {
    orderId: string;
    paymentId: string;
    signature: string;
  }) => {
    try {
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          orderId: payDetails.orderId,
          paymentId: payDetails.paymentId,
          signature: payDetails.signature,
          plan: selectedPlan,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || 'Payment verification failed');
      }

      setSuccessMsg(`Payment Confirmed! ${selectedPlan === 'CREDITS_49' ? '+3' : '+8'} credits added.`);
      if (onSuccess) {
        onSuccess(verifyData.credits);
      }

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl border-2 border-[#171e19] shadow-[10px_10px_0px_0px_#171e19] p-6 sm:p-8 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#171e19]/60 hover:text-[#171e19] hover:bg-[#171e19]/5 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffe17c]/40 border border-[#171e19]/20 mb-4">
          <Zap className="w-3.5 h-3.5 text-[#171e19] fill-[#171e19]" />
          <span className="font-satoshi text-[11px] font-bold uppercase tracking-wider text-[#171e19]">
            RECHARGE VEHICLE CREDITS
          </span>
        </div>

        <h2 className="font-anton text-3xl sm:text-4xl text-[#171e19] tracking-tight leading-none mb-2">
          CHOOSE YOUR AUDIT PACK
        </h2>

        <p className="font-satoshi text-xs sm:text-sm text-[#171e19]/70 mb-6">
          {pendingRc
            ? `Your free inspection has been utilized. Recharge now to inspect ${pendingRc}.`
            : 'Get instant access to live VAHAN government registry checks and DeepSeek AI maintenance forecasts.'}
        </p>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          
          {/* Plan 1: Starter */}
          <div
            onClick={() => setSelectedPlan('CREDITS_49')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
              selectedPlan === 'CREDITS_49'
                ? 'border-[#171e19] bg-[#ffe17c]/10 shadow-[4px_4px_0px_0px_#171e19]'
                : 'border-[#171e19]/20 bg-white hover:border-[#171e19]/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-satoshi text-xs font-bold uppercase tracking-wider text-[#171e19]/70">
                STARTER PACK
              </span>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedPlan === 'CREDITS_49'
                    ? 'border-[#171e19] bg-[#171e19] text-white'
                    : 'border-[#171e19]/30'
                }`}
              >
                {selectedPlan === 'CREDITS_49' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            <div className="font-anton text-3xl text-[#171e19] leading-none mb-1">
              ₹49
            </div>
            <p className="font-satoshi text-xs font-bold text-[#171e19]">
              3 Inspections
            </p>
            <p className="font-satoshi text-[11px] text-[#171e19]/60 mt-1">
              ₹16.3 per car check
            </p>
          </div>

          {/* Plan 2: Value Pack (Most Popular) */}
          <div
            onClick={() => setSelectedPlan('CREDITS_99')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
              selectedPlan === 'CREDITS_99'
                ? 'border-[#171e19] bg-[#ffe17c]/20 shadow-[4px_4px_0px_0px_#171e19]'
                : 'border-[#171e19]/20 bg-white hover:border-[#171e19]/40'
            }`}
          >
            <div className="absolute -top-2.5 right-3 px-2 py-0.5 bg-[#171e19] text-[#ffe17c] font-anton text-[10px] rounded tracking-wider">
              BEST VALUE // SAVE 40%
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="font-satoshi text-xs font-bold uppercase tracking-wider text-[#171e19]/70">
                VALUE PACK
              </span>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedPlan === 'CREDITS_99'
                    ? 'border-[#171e19] bg-[#171e19] text-white'
                    : 'border-[#171e19]/30'
                }`}
              >
                {selectedPlan === 'CREDITS_99' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            <div className="font-anton text-3xl text-[#171e19] leading-none mb-1">
              ₹99
            </div>
            <p className="font-satoshi text-xs font-bold text-[#171e19]">
              8 Inspections
            </p>
            <p className="font-satoshi text-[11px] text-[#171e19]/60 mt-1">
              ₹12.4 per car check
            </p>
          </div>

        </div>

        {/* What is included */}
        <div className="p-3.5 bg-[#f8f9fa] border border-[#171e19]/15 rounded-xl mb-6 space-y-2">
          <span className="font-satoshi text-[11px] font-bold uppercase tracking-wider text-[#171e19]/60 block mb-1">
            EVERY AUDIT INCLUDES:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-satoshi text-[#171e19]">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-green-700" />
              <span>MoRTH VAHAN Registry</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-green-700" />
              <span>DeepSeek AI Maintenance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-green-700" />
              <span>Challans & Blacklist Check</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-green-700" />
              <span>Certified PDF Export</span>
            </div>
          </div>
        </div>

        {errorMsg && (
          <p className="text-xs font-satoshi text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200 mb-4">
            {errorMsg}
          </p>
        )}

        {successMsg ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center text-green-800 font-anton text-lg">
            {successMsg}
          </div>
        ) : (
          <button
            onClick={handleRecharge}
            disabled={loading}
            className="w-full bg-[#171e19] hover:bg-black text-white hover:text-[#ffe17c] font-anton text-base py-4 rounded-xl transition-all hover:scale-[1.01] active:scale-98 shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>CONNECTING GATEWAY...</span>
              </>
            ) : (
              <>
                <span>PAY {selectedPlan === 'CREDITS_49' ? '₹49 FOR 3 CREDITS' : '₹99 FOR 8 CREDITS'}</span>
                <ArrowRight className="w-4 h-4 text-[#ffe17c]" />
              </>
            )}
          </button>
        )}

        <p className="text-center font-satoshi text-[10px] text-[#171e19]/50 mt-3">
          Secured by Razorpay • Instant Account Credit • UPI, Cards & NetBanking
        </p>

      </div>

    </div>
  );
}
