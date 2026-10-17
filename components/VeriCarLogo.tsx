// components/VeriCarLogo.tsx
import React from 'react';
import Image from 'next/image';

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
  const heights = {
    sm: 36,
    md: 48,
    lg: 64,
  }[size];

  // On dark backgrounds (footer) we show the same logo since it already has
  // a transparent background and looks great on dark too.
  return (
    <div className={`inline-flex items-center shrink-0 select-none ${className}`}>
      <Image
        src="/vericar-emblem.png"
        alt="VeriCar Logo"
        width={Math.round(heights * 1.65)}
        height={heights}
        priority
        className="object-contain"
        style={{ height: heights, width: 'auto' }}
      />
    </div>
  );
}
