// app/book/[rcNumber]/page.tsx
'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Car,
  User,
  Phone,
  Mail,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Lock,
  Wrench,
  Check
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface BookingPageProps {
  params: Promise<{
    rcNumber: string;
  }>;
}

export default function BookingPage({ params }: BookingPageProps) {
  const resolvedParams = use(params);
  const rcNumber = (resolvedParams.rcNumber || '').toUpperCase();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 01:00 PM');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !date || !address) {
      setErrorMsg('Please complete all required fields (Name, Phone, Address, Date)');
      return;
    }

    if (phone.replace(/[^0-9]/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit Indian phone number');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      // 1. Create order
      const orderRes = await fetch('/api/inspection/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rcNumber,
          customerName: fullName,
          city,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize payment');
      }

      // 2. Confirm booking
      const confirmRes = await fetch('/api/inspection/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleRc: rcNumber,
          customerName: fullName,
          customerPhone: phone,
          customerEmail: email,
          city,
          inspectionDate: date,
          timeSlot,
          razorpayOrderId: orderData.orderId,
          razorpayPaymentId: `pay_${Date.now()}_simulated`,
        }),
      });

      const confirmData = await confirmRes.json();
      if (!confirmData.success) {
        throw new Error(confirmData.error || 'Failed to save booking');
      }

      setBookingSuccess({
        bookingId: confirmData.bookingId,
        orderId: orderData.orderId,
        mode: orderData.mode,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#171e19]">
      <Navbar />

      <main className="pt-28 pb-20 bg-[#ffffff] bg-grid-light flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <div className="py-4 mb-6 border-b border-[#171e19]/10">
            <Link
              href={`/report/${encodeURIComponent(rcNumber)}`}
              className="inline-flex items-center gap-2 font-satoshi text-xs font-bold uppercase tracking-wider text-[#171e19]/70 hover:text-[#171e19] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {rcNumber} Report</span>
            </Link>
          </div>

          {bookingSuccess ? (
            /* Success State */
            <div className="bg-[#171e19] text-white rounded-2xl p-8 sm:p-14 text-center max-w-2xl mx-auto brutalist-card-dark border-2 border-[#ffe17c] shadow-2xl">
              <div className="w-16 h-16 bg-[#ffe17c] text-[#171e19] rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <span className="px-3 py-1 bg-[#ffe17c]/20 text-[#ffe17c] font-anton text-xs rounded uppercase tracking-wider">
                PAYMENT VERIFIED • SLOT CONFIRMED
              </span>

              <h1 className="font-anton text-4xl sm:text-5xl text-white mt-4 mb-3 tracking-tight">
                INSPECTION BOOKED!
              </h1>

              <p className="font-satoshi text-white/70 text-base mb-8 max-w-md mx-auto">
                A certified VeriCar technician has been assigned to audit vehicle <strong className="text-white">{rcNumber}</strong> in {city}.
              </p>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 text-left space-y-3 font-satoshi text-sm">
                <div className="flex justify-between pb-2 border-b border-white/10">
                  <span className="text-white/50">Booking Reference:</span>
                  <span className="font-mono text-white font-bold">{bookingSuccess.bookingId.substring(0, 16)}...</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/10">
                  <span className="text-white/50">Inspection Date:</span>
                  <span className="text-white font-semibold">{date}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/10">
                  <span className="text-white/50">Assigned Window:</span>
                  <span className="text-white font-semibold">{timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Amount Paid:</span>
                  <span className="text-[#ffe17c] font-anton text-base">₹499 (INCL. GST)</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`/report/${encodeURIComponent(rcNumber)}`}
                  className="px-6 py-3.5 bg-[#ffe17c] text-[#171e19] font-anton text-base rounded-xl transition-transform hover:scale-105"
                >
                  RETURN TO VEHICLE REPORT
                </Link>
                <Link
                  href="/"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-anton text-base rounded-xl transition-colors"
                >
                  HOME
                </Link>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Form Details (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-[#171e19]/15 p-6 sm:p-8 brutalist-card shadow-sm">
                
                <div className="mb-6">
                  <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#171e19]/50">
                    DOORSTEP FIELD INSPECTION
                  </span>
                  <h1 className="font-anton text-3xl sm:text-4xl text-[#171e19] tracking-tight mt-1">
                    SCHEDULE PHYSICAL AUDIT
                  </h1>
                  <p className="font-satoshi text-sm text-[#171e19]/70 mt-1">
                    Book an independent mechanic to inspect this vehicle before paying the seller.
                  </p>
                </div>

                <form onSubmit={handleCheckout} className="space-y-5">
                  {/* Vehicle Tag */}
                  <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[#171e19]/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Car className="w-5 h-5 text-[#171e19]" />
                      <div>
                        <span className="font-satoshi text-[10px] text-[#171e19]/50 uppercase font-bold">Target Vehicle</span>
                        <p className="font-anton text-lg text-[#171e19]">{rcNumber}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-green-100 text-green-800 font-anton text-xs rounded">
                      RTO VERIFIED
                    </span>
                  </div>

                  {/* Customer Full Name */}
                  <div>
                    <label className="block font-satoshi text-xs font-bold uppercase tracking-wider text-[#171e19] mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Vikram Sharma"
                      className="w-full px-4 py-3 bg-white border border-[#171e19]/20 rounded-xl font-satoshi text-sm text-[#171e19] focus:outline-none focus:border-[#171e19]"
                    />
                  </div>

                  {/* Contact Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-satoshi text-xs font-bold uppercase tracking-wider text-[#171e19] mb-1.5">
                        WhatsApp / Mobile No. *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full px-4 py-3 bg-white border border-[#171e19]/20 rounded-xl font-satoshi text-sm text-[#171e19] focus:outline-none focus:border-[#171e19]"
                      />
                    </div>

                    <div>
                      <label className="block font-satoshi text-xs font-bold uppercase tracking-wider text-[#171e19] mb-1.5">
                        Email Address (For Report)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. vikram@gmail.com"
                        className="w-full px-4 py-3 bg-white border border-[#171e19]/20 rounded-xl font-satoshi text-sm text-[#171e19] focus:outline-none focus:border-[#171e19]"
                      />
                    </div>
                  </div>

                  {/* City & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-satoshi text-xs font-bold uppercase tracking-wider text-[#171e19] mb-1.5">
                        Metro City *
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-[#171e19]/20 rounded-xl font-satoshi text-sm text-[#171e19] focus:outline-none focus:border-[#171e19]"
                      >
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Delhi NCR">Delhi NCR</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Pune">Pune</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-satoshi text-xs font-bold uppercase tracking-wider text-[#171e19] mb-1.5">
                        Inspection Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-[#171e19]/20 rounded-xl font-satoshi text-sm text-[#171e19] focus:outline-none focus:border-[#171e19]"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block font-satoshi text-xs font-bold uppercase tracking-wider text-[#171e19] mb-1.5">
                      Inspection Location / Dealer Lot Address *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Seller showroom name, dealer lot address, or apartment location..."
                      className="w-full px-4 py-3 bg-white border border-[#171e19]/20 rounded-xl font-satoshi text-sm text-[#171e19] focus:outline-none focus:border-[#171e19]"
                    />
                  </div>

                  {/* Time slot preference */}
                  <div>
                    <label className="block font-satoshi text-xs font-bold uppercase tracking-wider text-[#171e19] mb-1.5">
                      Preferred Time Window
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setTimeSlot('10:00 AM - 01:00 PM')}
                        className={`p-3 rounded-xl border text-xs font-anton tracking-wider transition-all text-center cursor-pointer ${
                          timeSlot === '10:00 AM - 01:00 PM'
                            ? 'bg-[#171e19] text-[#ffe17c] border-[#171e19]'
                            : 'bg-white text-[#171e19] border-[#171e19]/20 hover:border-[#171e19]'
                        }`}
                      >
                        MORNING (10 AM - 1 PM)
                      </button>

                      <button
                        type="button"
                        onClick={() => setTimeSlot('02:00 PM - 05:00 PM')}
                        className={`p-3 rounded-xl border text-xs font-anton tracking-wider transition-all text-center cursor-pointer ${
                          timeSlot === '02:00 PM - 05:00 PM'
                            ? 'bg-[#171e19] text-[#ffe17c] border-[#171e19]'
                            : 'bg-white text-[#171e19] border-[#171e19]/20 hover:border-[#171e19]'
                        }`}
                      >
                        AFTERNOON (2 PM - 5 PM)
                      </button>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-satoshi text-red-700">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#171e19] hover:bg-black text-white hover:text-[#ffe17c] font-anton text-lg py-4 rounded-xl transition-all hover:scale-[1.01] active:scale-95 shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>INITIALIZING SECURE CHECKOUT...</span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-[#ffe17c]" />
                        <span>PAY ₹499 & CONFIRM MECHANIC</span>
                        <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                      </>
                    )}
                  </button>

                  <p className="text-center font-satoshi text-[11px] text-[#171e19]/60">
                    Instant 100% refund if the seller cancels or vehicle becomes unavailable before mechanic dispatch.
                  </p>
                </form>
              </div>

              {/* Right Column: Order Summary (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Summary Card */}
                <div className="bg-[#171e19] text-white rounded-2xl p-6 sm:p-8 brutalist-card-dark border-2 border-[#171e19]">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                    <span className="font-anton text-lg text-[#ffe17c]">ORDER SUMMARY</span>
                    <span className="px-2 py-0.5 bg-white/10 text-white font-mono text-[11px] rounded">
                      TAX INVOICE
                    </span>
                  </div>

                  <div className="space-y-3 pb-4 border-b border-white/10 font-satoshi text-xs text-white/70">
                    <div className="flex justify-between text-white">
                      <span className="font-bold">150-Point Doorstep Audit</span>
                      <span>₹422.88</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Electronic OBD-II Diagnostic Scan</span>
                      <span className="text-[#ffe17c] font-bold">INCLUDED</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Paint Thickness Digital Micron Test</span>
                      <span className="text-[#ffe17c] font-bold">INCLUDED</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Underbody & Suspension Ramp Check</span>
                      <span className="text-[#ffe17c] font-bold">INCLUDED</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Integrated GST (18%)</span>
                      <span>₹76.12</span>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between pt-4">
                    <span className="font-anton text-lg text-white">TOTAL DUE</span>
                    <div className="text-right">
                      <span className="font-anton text-3xl text-[#ffe17c]">₹499</span>
                      <span className="block font-satoshi text-[10px] text-white/50">INR All-Inclusive</span>
                    </div>
                  </div>
                </div>

                {/* Mechanic Guarantee Card */}
                <div className="bg-[#f8f9fa] rounded-2xl p-6 border border-[#171e19]/15 space-y-3">
                  <div className="flex items-center gap-2 text-[#171e19]">
                    <ShieldCheck className="w-5 h-5 text-green-700" />
                    <h4 className="font-anton text-base">VERICAR BUYER PROTECTION</h4>
                  </div>
                  <ul className="space-y-2 font-satoshi text-xs text-[#171e19]/75">
                    <li className="flex items-start gap-2">
                      <span className="text-green-700 font-bold">✓</span>
                      <span>Zero conflict of interest: inspectors are barred from collecting dealer commissions.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-700 font-bold">✓</span>
                      <span>Detailed PDF report with high-res photographs sent to your WhatsApp in 60 minutes.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-700 font-bold">✓</span>
                      <span>Includes real market negotiation margin advice.</span>
                    </li>
                  </ul>
                </div>

              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
