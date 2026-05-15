import React from 'react';

interface LogoMarkProps {
  size?: number;
  spinning?: boolean;
}

const LogoMark: React.FC<LogoMarkProps> = ({ size = 40, spinning = false }) => (
  <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {spinning && (
      <div className="parsing-ring" style={{ position: 'absolute', inset: -10 }} />
    )}
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="hsl(252,75%,55%)" />
      {/* Calendar body */}
      <rect x="8" y="14" width="24" height="18" rx="3" fill="white" fillOpacity="0.95" />
      {/* Calendar header stripe */}
      <rect x="8" y="14" width="24" height="6" rx="3" fill="white" fillOpacity="0.2" />
      {/* Pegs */}
      <rect x="14" y="8" width="3" height="9" rx="1.5" fill="white" />
      <rect x="23" y="8" width="3" height="9" rx="1.5" fill="white" />
      {/* Grid dots */}
      <rect x="12" y="25" width="3.5" height="3.5" rx="1" fill="hsl(252,75%,55%)" fillOpacity="0.65" />
      <rect x="18.25" y="25" width="3.5" height="3.5" rx="1" fill="hsl(252,75%,55%)" fillOpacity="0.65" />
      <rect x="24.5" y="25" width="3.5" height="3.5" rx="1" fill="hsl(252,75%,55%)" fillOpacity="0.4" />
      {/* Sparkle */}
      <path d="M31 7 L32.1 9.9 L35 11 L32.1 12.1 L31 15 L29.9 12.1 L27 11 L29.9 9.9 Z" fill="white" fillOpacity="0.8" />
    </svg>
  </div>
);

export default LogoMark;
