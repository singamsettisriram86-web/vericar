import type { Metadata, Viewport } from 'next';
import { Anton } from 'next/font/google';
import './globals.css';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'VERICAR | Uncover The Truth Before You Buy Any Used Car',
  description:
    'India\'s high-precision used car verification platform. Instant Vahan RC check, AI annual maintenance projections, and certified doorstep vehicle inspections.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
  },
};

import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${anton.variable} scroll-smooth overflow-x-hidden`}>
      <body className="font-satoshi bg-[#ffffff] text-[#171e19] antialiased selection:bg-[#ffe17c] selection:text-[#171e19] min-h-screen flex flex-col overflow-x-hidden">
        {children}
        <Script
          src="https://sdk.cashfree.com/js/v3/cashfree.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}

