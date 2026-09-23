// app/terms/page.tsx
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms of Service | VeriCar',
  description: 'Terms and Conditions for using VeriCar vehicle intelligence platform.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf4] text-[#171e19] flex flex-col justify-between">
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="mb-10 pb-6 border-b border-[#171e19]/10">
          <span className="font-anton text-xs uppercase tracking-widest text-[#171e19]/60 px-3 py-1 bg-[#171e19]/5 rounded-full inline-block mb-3">
            LEGAL // POLICIES
          </span>
          <h1 className="font-anton text-4xl sm:text-5xl text-[#171e19] tracking-tight uppercase">
            Terms & Conditions
          </h1>
          <p className="font-satoshi text-xs text-[#171e19]/60 mt-2">
            Last Updated: September 2026 | Effective for vericar.online
          </p>
        </div>

        <div className="space-y-8 font-satoshi text-sm sm:text-base leading-relaxed text-[#171e19]/80">
          <section className="space-y-3">
            <h2 className="font-anton text-xl text-[#171e19] uppercase tracking-wide">1. Acceptance of Terms</h2>
            <p>
              By accessing and using <strong>VeriCar</strong> (accessible at <Link href="/" className="underline font-semibold">https://vericar.online</Link>), you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree, please do not use our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-anton text-xl text-[#171e19] uppercase tracking-wide">2. Scope of Services</h2>
            <p>
              VeriCar is an independent automotive intelligence platform providing:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Instant verification of vehicle registration details sourced from public MoRTH VAHAN registries.</li>
              <li>Proprietary AI-projected annual maintenance and repair estimates in Indian Rupees (₹).</li>
              <li>Official RTO Dossier extracts (Form 23 extracts) for ₹39.</li>
              <li>Doorstep vehicle inspections performed by certified third-party technicians for ₹499.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-anton text-xl text-[#171e19] uppercase tracking-wide">3. User Accounts & Credits</h2>
            <p>
              Users may sign up using Google OAuth or email. New users receive 1 Free Inspection Credit. Additional credits can be purchased via recharge packs (₹49 for 3 credits, ₹99 for 8 credits). Credits are non-transferable and are tied to your registered email account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-anton text-xl text-[#171e19] uppercase tracking-wide">4. Payments & Billing</h2>
            <p>
              All fees and charges are displayed in Indian National Rupees (₹ INR). Payments are processed securely via RBI-authorized payment gateway aggregators (including Razorpay). We do not store or process debit/credit card numbers or UPI PINs directly on our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-anton text-xl text-[#171e19] uppercase tracking-wide">5. Disclaimers & Limitation of Liability</h2>
            <p>
              While VeriCar endeavors to provide accurate and up-to-date data, vehicle records are aggregated from public RTO databases. Maintenance cost matrices are algorithmic predictive estimations. Physical doorstep inspections reflect vehicle status at the time of check and do not constitute an insurance policy or mechanical warranty against internal defects. VeriCar shall not be liable for indirect or consequential damages.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-anton text-xl text-[#171e19] uppercase tracking-wide">6. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of the use of this website shall be subject to the exclusive jurisdiction of the courts of India.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-anton text-xl text-[#171e19] uppercase tracking-wide">7. Contact Information</h2>
            <p>
              For any queries concerning these Terms, reach out to our team at <a href="mailto:support@vericar.online" className="underline font-semibold">support@vericar.online</a>.
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
