"use client";

interface ButterflyIconProps {
  color?: string;
  accent?: string;
  size?: number;
}

export function ButterflyIcon({ color = "currentColor", accent, size = 36 }: ButterflyIconProps) {
  const a = accent || color;
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 40 34" fill="none">
      <path d="M20 17 Q 12 2, 3 6 Q 1 14, 8 17 Q 4 14, 6 11 Q 11 8, 15 12 Q 18 14, 20 17 Z"
        stroke={color} strokeWidth="1.3" strokeLinejoin="round" fill={a} fillOpacity="0.18" />
      <path d="M20 17 Q 28 2, 37 6 Q 39 14, 32 17 Q 36 14, 34 11 Q 29 8, 25 12 Q 22 14, 20 17 Z"
        stroke={color} strokeWidth="1.3" strokeLinejoin="round" fill={a} fillOpacity="0.18" />
      <path d="M20 17 Q 14 28, 8 28 Q 5 24, 9 20 Q 14 18, 20 17 Z"
        stroke={color} strokeWidth="1.3" strokeLinejoin="round" fill={a} fillOpacity="0.28" />
      <path d="M20 17 Q 26 28, 32 28 Q 35 24, 31 20 Q 26 18, 20 17 Z"
        stroke={color} strokeWidth="1.3" strokeLinejoin="round" fill={a} fillOpacity="0.28" />
      <circle cx="9" cy="9" r="1.4" fill={color} />
      <circle cx="31" cy="9" r="1.4" fill={color} />
      <circle cx="11" cy="23" r="1" fill={color} />
      <circle cx="29" cy="23" r="1" fill={color} />
      <ellipse cx="20" cy="18" rx="1.2" ry="9" fill={color} />
      <path d="M20 9 Q 17 4, 14 3" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M20 9 Q 23 4, 26 3" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <circle cx="14" cy="3" r="0.9" fill={color} />
      <circle cx="26" cy="3" r="0.9" fill={color} />
    </svg>
  );
}

export function ArrowIcon({ color = "currentColor", size = 60 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={30} viewBox="0 0 60 30" fill="none">
      <path d="M3 18 Q 20 4, 40 14 T 55 16" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M48 10 L 56 16 L 48 22" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
