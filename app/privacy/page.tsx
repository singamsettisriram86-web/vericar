// app/privacy/page.tsx
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy | VeriCar',
  description: 'Privacy Policy and data protection standards for VeriCar.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf4] text-[#171e19] flex flex-col justify-between">
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="mb-10 pb-6 border-b border-[#171e19]/10">
          <span className="font-anton text-xs uppercase tracking-widest text-[#171e19]/60 px-3 py-1 bg-[#171e19]/5 rounded-full inline-block mb-3">
            LEGAL // PRIVACY
          </span>
          <h1 className="font-anton text-4xl sm:text-5xl text-[#171e19] tracking-tight uppercase">
            Privacy Policy
          </h1>
          <p className="font-satoshi text-xs text-[#171e19]/60 mt-2">
            Last Updated: September 2026 | Effective for vericar.online
          </p>
        </div>

        <div className="space-y-8 font-satoshi text-sm sm:text-base leading-relaxed text-[#171e19]/80">
          <section className="space-y-3">
            <h2 className="font-anton text-xl text-[#171e19] uppercase tracking-wide">1. Information We Collect</h2>
            <p>
              When you use <strong>VeriCar</strong> (<Link href="/" className="underline font-semibold">https://vericar.online</Link>), we may collect the following information:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>Account Information:</strong> Name and email address provided during Google OAuth authentication or direct sign-in.</li>
              <li><strong>Vehicle Lookups:</strong> Registration numbers (RC numbers) queried to generate verification reports.</li>
              <li><strong>Booking Details:</strong> Contact phone number, location address, and preferred time slot for doorstep vehicle inspections.</li>
              <li><strong>Technical Data:</strong> Browser type, IP address, and cookie tokens necessary for authentication and session management.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-anton text-xl text-[#171e19] uppercase tracking-wide">2. How We Use Your Data</h2>
            <p>
              Your data is used solely to:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Provide vehicle registry checks and AI maintenance projections.</li>
              <li>Manage your credit balance, report access, and transaction history.</li>
              <li>Coordinate certified mechanic visits for doorstep vehicle inspections.</li>
              <li>Communicate service updates, transaction receipts, and customer support.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-anton text-xl text-[#171e19] uppercase tracking-wide">3. Payment Security & PCI-DSS</h2>
            <p>
              We prioritize the security of your financial data. All payments (micro-transactions, credit recharges, and inspection bookings) are processed via <strong>Razorpay</strong>, an RBI-licensed, PCI-DSS Level 1 compliant payment gateway. <strong>VeriCar does not store or process your debit/credit card credentials, CVVs, or UPI PINs.</strong>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-anton text-xl text-[#171e19] uppercase tracking-wide">4. Data Sharing & Third Parties</h2>
            <p>
              We do not sell, rent, or trade your personal information to third parties. We share information only with trusted service partners strictly necessary to deliver our services (e.g., payment aggregators for transactions, certified inspection technicians for on-ground audits).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-anton text-xl text-[#171e19] uppercase tracking-wide">5. Data Retention & Your Rights</h2>
            <p>
              You have the right to access, review, or request the deletion of your account and associated search history at any time. Contact us at <a href="mailto:support@vericar.online" className="underline font-semibold">support@vericar.online</a> with your registered email to request data erasure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-anton text-xl text-[#171e19] uppercase tracking-wide">6. Grievance Redressal</h2>
            <p>
              In accordance with the Information Technology Act 2000 and the rules made thereunder, any privacy grievances can be addressed to our Grievance Desk at <a href="mailto:support@vericar.online" className="underline font-semibold">support@vericar.online</a>.
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
