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

  const badgeDimensions = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-12 h-12 sm:w-14 sm:h-14',
  }[size];

  const textSizes = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-2xl sm:text-3xl md:text-4xl',
    lg: 'text-4xl sm:text-5xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {/* Brand Icon Mark: Brutalist Automotive Shield + Verification Checkmark */}
      <div
        className={`${badgeDimensions} relative rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105 ${
          isDark
            ? 'bg-[#ffe17c] shadow-[2px_2px_0px_0px_#ffffff]'
            : 'bg-[#171e19] shadow-[3px_3px_0px_0px_#ffe17c]'
        }`}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5/6 h-5/6"
        >
          {/* Subtle aerodynamic hood line */}
          <path
            d="M 6 11 L 30 11"
            stroke={isDark ? '#171e19' : '#ffe17c'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.45"
          />
          {/* Geometric Verification 'V' + Checkmark */}
          <path
            d="M 8 13.5 L 15.5 25.5 L 28.5 8.5"
            stroke={isDark ? '#171e19' : '#ffffff'}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Accent Truth Dot */}
          <circle
            cx="28.5"
            cy="8.5"
            r="2"
            fill={isDark ? '#171e19' : '#ffe17c'}
          />
        </svg>
      </div>

      {/* Brand Wordmark Typography */}
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
