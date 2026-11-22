import React from 'react';

interface LogoMarkProps {
  className?: string;
  strokeWidth?: number;
}

export function NivantoLogoMark({
  className = 'w-8 h-auto',
  strokeWidth = 7.5,
}: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 200 136"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M 8,124 A 92,92 0 0,1 76,33"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 124,33 A 92,92 0 0,1 192,124"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="100" cy="27" r="13.5" fill="currentColor" />
    </svg>
  );
}

interface LockupProps {
  variant?: 'primary' | 'reversed';
  size?: 'sm' | 'md' | 'lg';
}

export function NivantoLogoLockup({
  variant = 'primary',
  size = 'md',
}: LockupProps) {
  const colorClass = variant === 'reversed' ? 'text-white' : 'text-[#2B5FAA]';
  const markSize =
    size === 'sm' ? 'w-6' : size === 'lg' ? 'w-12' : 'w-8';
  const textSize =
    size === 'sm'
      ? 'text-[15px] tracking-[4px]'
      : size === 'lg'
        ? 'text-[26px] tracking-[7px]'
        : 'text-[18px] tracking-[5px]';

  return (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 ${colorClass}`}>
      <NivantoLogoMark className={`${markSize} h-auto shrink-0`} strokeWidth={9} />
      <span className={`font-display font-extrabold leading-none ${textSize}`}>
        NIVANTO
      </span>
    </span>
  );
}

/**
 * Clean flat SVG brand illustration (no stock photography) matching Brand Identity Preview.
 */
export function BrandGrowthIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Nivanto growth architecture illustration"
    >
      <rect width="360" height="280" rx="24" fill="#232D4F" />
      <rect
        x="24"
        y="24"
        width="312"
        height="232"
        rx="18"
        fill="#1C2440"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1.5"
      />

      {/* Chart bars */}
      <rect x="48" y="164" width="38" height="68" rx="8" fill="#2B5FAA" opacity="0.28" />
      <rect x="98" y="132" width="38" height="100" rx="8" fill="#2B5FAA" opacity="0.6" />
      <rect x="148" y="96" width="38" height="136" rx="8" fill="#2B5FAA" />

      {/* Growth curve */}
      <path
        d="M66 154 Q138 96 244 58"
        stroke="#E8900A"
        strokeWidth="3.5"
        strokeDasharray="6,5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="244" cy="58" r="14" fill="#E8900A" opacity="0.2" />
      <circle cx="244" cy="58" r="7" fill="#E8900A" />

      {/* Browser card inside illustration */}
      <rect
        x="206"
        y="124"
        width="110"
        height="88"
        rx="14"
        fill="#F8F6F2"
      />
      <rect x="218" y="138" width="52" height="6" rx="3" fill="#2B5FAA" opacity="0.85" />
      <rect x="218" y="150" width="36" height="5" rx="2.5" fill="#1C2440" opacity="0.35" />
      <rect x="218" y="168" width="86" height="30" rx="8" fill="#2B5FAA" opacity="0.1" />
      <path
        d="M 244,191 A 17,17 0 0,1 257,174"
        stroke="#2B5FAA"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 265,174 A 17,17 0 0,1 278,191"
        stroke="#2B5FAA"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="261" cy="173" r="3" fill="#E8900A" />
    </svg>
  );
}
