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
      { url: '/favicon.svg?v=4', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png?v=4', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png?v=4', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico?v=4' },
    ],
    shortcut: '/favicon.ico?v=4',
    apple: [
      { url: '/apple-touch-icon.png?v=4', sizes: '180x180', type: 'image/png' },
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

