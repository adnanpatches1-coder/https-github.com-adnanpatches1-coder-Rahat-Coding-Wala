import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#1e3a8a" />
      </linearGradient>
      <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#60a5fa" stopOpacity="1" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Outer Ring */}
    <circle cx="50" cy="50" r="48" stroke="#94a3b8" strokeWidth="1" fill="#f8fafc" />
    <circle cx="50" cy="50" r="44" stroke="url(#logoGradient)" strokeWidth="2" fill="white" />

    {/* Inner Background */}
    <circle cx="50" cy="50" r="38" fill="url(#logoGradient)" />
    
    {/* Stylized Wings */}
    <path d="M12 45 C 12 30, 35 35, 50 45" stroke="#60a5fa" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M88 45 C 88 30, 65 35, 50 45" stroke="#60a5fa" strokeWidth="2" fill="none" strokeLinecap="round" />
    
    <path d="M18 52 C 18 40, 38 42, 50 48" stroke="#93c5fd" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M82 52 C 82 40, 62 42, 50 48" stroke="#93c5fd" strokeWidth="1.5" fill="none" strokeLinecap="round" />

    {/* Circuit details */}
    <circle cx="12" cy="45" r="2" fill="#60a5fa" />
    <circle cx="88" cy="45" r="2" fill="#60a5fa" />
    <circle cx="50" cy="20" r="2" fill="#60a5fa" />

    {/* Text RA */}
    <text x="50" y="65" fontFamily="sans-serif" fontSize="22" fontWeight="900" fill="white" textAnchor="middle" filter="url(#glow)" style={{ letterSpacing: '1px' }}>RA</text>
    
    {/* Gloss */}
    <path d="M25 35 Q 50 15 75 35" stroke="white" strokeWidth="1" strokeOpacity="0.3" fill="none" />
  </svg>
);