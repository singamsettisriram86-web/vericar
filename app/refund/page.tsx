// app/refund/page.tsx
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Refund & Cancellation Policy | VeriCar',
  description: 'Cancellation and refund policies for VeriCar services.',
};

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf4] text-[#171e19] flex flex-col justify-between">
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="mb-10 pb-6 border-b border-[#171e19]/10">
          <span className="font-anton text-xs uppercase tracking-widest text-[#171e19]/60 px-3 py-1 bg-[#171e19]/5 rounded-full inline-block mb-3">
            LEGAL // BILLING
          </span>
          <h1 className="font-anton text-4xl sm:text-5xl text-[#171e19] tracking-tight uppercase">
            Cancellation & Refund Policy
          </h1>
          <p className="font-satoshi text-xs text-[#171e19]/60 mt-2">
            Last Updated: September 2026 | Effective for vericar.online
          </p>
        </div>

        <div className="space-y-8 font-satoshi text-sm sm:text-base leading-relaxed text-[#171e19]/80">
          <section className="space-y-3">
            <h2 className="font-anton text-xl text-[#171e19] uppercase tracking-wide">1. Digital Products (₹39 RTO Extract & Credit Packs)</h2>
            <p>
              Digital vehicle reports and credit recharge packs are delivered instantaneously upon successful payment confirmation.
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Because digital reports are immediately generated and accessible, completed reports are generally non-refundable once viewed.</li>
              <li><strong>Failed Data Fetch:</strong> If an upstream registry server outage prevents your report or RTO Dossier from loading after payment, your credits will be refunded automatically or a full cash refund will be processed upon email request within 24 hours.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-anton text-xl text-[#171e19] uppercase tracking-wide">2. Doorstep Vehicle Inspection (₹499)</h2>
            <p>
              For physical doorstep inspections booked through VeriCar:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>Full Refund:</strong> You may cancel your booking up to <strong>4 hours before</strong> the scheduled appointment slot for a 100% refund.</li>
              <li><strong>Free Rescheduling:</strong> You can reschedule your appointment slot free of charge up to 2 hours before the technician visit.</li>
              <li><strong>Post-Dispatch:</strong> Cancellations made after a certified technician has already arrived at the location will incur a nominal technician conveyance fee (₹149), and the remaining balance will be refunded.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-anton text-xl text-[#171e19] uppercase tracking-wide">3. Refund Processing Timeline</h2>
            <p>
              All approved refunds are initiated within <strong>24 to 48 hours</strong> of verification. 
            </p>
            <p>
              The refunded amount will be credited back to the customer&apos;s <strong>original source of payment</strong> (UPI ID, NetBanking account, or Debit/Credit Card via Razorpay) within <strong>5 to 7 working business days</strong>, depending on your bank&apos;s processing cycle.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-anton text-xl text-[#171e19] uppercase tracking-wide">4. How to Request a Refund</h2>
            <p>
              To initiate a cancellation or refund, email our support team at <a href="mailto:support@vericar.online" className="underline font-semibold">support@vericar.online</a> with:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Your registered email address</li>
              <li>Vehicle Registration (RC) Number</li>
              <li>Razorpay Payment ID / Order Reference</li>
              <li>Reason for refund request</li>
            </ul>
            <p className="mt-2">
              Our support team reviews and responds to all refund requests within 24 hours.
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
