// app/contact/page.tsx
import React from 'react';
import Link from 'next/link';
import { Mail, Clock, MapPin, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Contact Us | VeriCar',
  description: 'Get in touch with the VeriCar automotive intelligence support team.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf4] text-[#171e19] flex flex-col justify-between">
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="mb-10 pb-6 border-b border-[#171e19]/10">
          <span className="font-anton text-xs uppercase tracking-widest text-[#171e19]/60 px-3 py-1 bg-[#171e19]/5 rounded-full inline-block mb-3">
            SUPPORT // REACH OUT
          </span>
          <h1 className="font-anton text-4xl sm:text-5xl text-[#171e19] tracking-tight uppercase">
            Contact Us
          </h1>
          <p className="font-satoshi text-xs text-[#171e19]/60 mt-2">
            VeriCar Technologies India | Customer Support & Inquiries
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Card 1: Direct Support */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#171e19] shadow-md space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#ffe17c] flex items-center justify-center border border-[#171e19]">
              <Mail className="w-6 h-6 text-[#171e19]" />
            </div>
            <h2 className="font-anton text-2xl text-[#171e19] uppercase tracking-wide">
              Customer Support Email
            </h2>
            <p className="font-satoshi text-sm text-[#171e19]/70 leading-relaxed">
              For any queries regarding vehicle reports, credit recharges, doorstep inspection bookings, or billing:
            </p>
            <div className="pt-2">
              <a
                href="mailto:support@vericar.online"
                className="font-mono text-base font-bold text-[#171e19] underline hover:text-[#171e19]/70 transition-colors"
              >
                support@vericar.online
              </a>
            </div>
          </div>

          {/* Card 2: Operating Hours */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#171e19] shadow-md space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#ffe17c] flex items-center justify-center border border-[#171e19]">
              <Clock className="w-6 h-6 text-[#171e19]" />
            </div>
            <h2 className="font-anton text-2xl text-[#171e19] uppercase tracking-wide">
              Operational Hours
            </h2>
            <p className="font-satoshi text-sm text-[#171e19]/70 leading-relaxed">
              Our inspection scheduling and customer assistance desks operate during standard Indian business hours:
            </p>
            <div className="pt-2 space-y-1 font-satoshi text-sm font-semibold text-[#171e19]">
              <p>Monday – Saturday: 9:00 AM – 8:00 PM IST</p>
              <p className="text-xs text-[#171e19]/60 font-normal">Sunday: 10:00 AM – 4:00 PM IST</p>
            </div>
          </div>
        </div>

        {/* Metro Presence & Grievance */}
        <div className="bg-[#171e19] text-white p-6 sm:p-8 rounded-2xl border-2 border-[#171e19] shadow-lg space-y-6">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-[#ffe17c]" />
            <h3 className="font-anton text-xl sm:text-2xl text-white tracking-wide uppercase">
              Operational Inspection Network
            </h3>
          </div>
          <p className="font-satoshi text-sm text-white/80 leading-relaxed">
            Doorstep vehicle inspection services are actively serviced across major metropolitan corridors:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-satoshi text-xs font-semibold text-center">
            <span className="p-2.5 bg-white/10 rounded-lg border border-white/10">Bengaluru</span>
            <span className="p-2.5 bg-white/10 rounded-lg border border-white/10">Delhi NCR</span>
            <span className="p-2.5 bg-white/10 rounded-lg border border-white/10">Mumbai</span>
            <span className="p-2.5 bg-white/10 rounded-lg border border-white/10">Hyderabad</span>
            <span className="p-2.5 bg-white/10 rounded-lg border border-white/10">Chennai</span>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-white/60 font-satoshi">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ffe17c]" />
              <span>Grievance Officer: support@vericar.online</span>
            </div>
            <span>Entity: VeriCar Technologies India</span>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
