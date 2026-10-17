// components/VeriCarLogo.tsx
import React from 'react';

interface VeriCarLogoProps {
  variant?: 'light' | 'dark';
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function VeriCarLogo({
  variant = 'light',
  showText = true,
  size = 'md',
  className = '',
}: VeriCarLogoProps) {
  const isDark = variant === 'dark';

  const iconDimensions = {
    sm: 'w-6 h-6 sm:w-7 sm:h-7',
    md: 'w-8 h-8 sm:w-9 sm:h-9',
    lg: 'w-11 h-11 sm:w-12 sm:h-12',
  }[size];

  const textSizes = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-2xl sm:text-3xl md:text-4xl',
    lg: 'text-4xl sm:text-5xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2 sm:gap-2.5 group select-none ${className}`}>
      {/* 100% Transparent, Simple Minimalist Vector Icon: Car Roofline + Verification V-Check */}
      <div className={`${iconDimensions} relative flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 44 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Sleek Minimal Car Roofline Profile */}
          <path
            d="M 2 15 C 6 14.5, 12 14, 15 8 C 17 4, 27 4, 30 7.5 C 32 10, 33 12, 34 13"
            stroke={isDark ? '#ffffff' : '#171e19'}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Left Wing of 'V' */}
          <path
            d="M 5 19 L 14.5 32"
            stroke={isDark ? '#ffffff' : '#171e19'}
            strokeWidth="3.8"
            strokeLinecap="round"
          />

          {/* Verification Checkmark Stem (Forms Right Wing of 'V') */}
          <path
            d="M 12 21 L 18 28.5 L 40 8"
            stroke="#16a34a"
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Clean Brand Typography */}
      {showText && (
        <span
          className={`font-anton ${textSizes} tracking-wider transition-colors leading-none ${
            isDark ? 'text-white' : 'text-[#171e19]'
          }`}
        >
          VERICAR<span className="text-[#ffe17c]">.</span>
        </span>
      )}
    </div>
  );
}
