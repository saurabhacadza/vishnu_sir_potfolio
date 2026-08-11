'use client';

import { useEffect } from 'react';

const items = [
  { text: 'E = mc²', top: '12%', left: '8%', size: 24, rot: -6 },
  { text: '∫ F · dr', top: '28%', left: '78%', size: 22, rot: 8 },
  { text: 'Δx · Δp ≥ ħ/2', top: '40%', left: '16%', size: 20, rot: -4 },
  { text: 'PV = nRT', top: '62%', left: '12%', size: 20, rot: 5 },
  { text: '∑ f_i = ma', top: '54%', left: '70%', size: 22, rot: -3 },
  { text: 'sin²θ + cos²θ = 1', top: '72%', left: '32%', size: 18, rot: 2 },
  { text: 'v = u + at', top: '18%', left: '54%', size: 18, rot: 10 },
  { text: 'd/dx (e^x) = e^x', top: '48%', left: '46%', size: 18, rot: -8 },
];

const diagrams = [
  { top: '18%', left: '30%', scale: 1.0 },
  { top: '66%', left: '58%', scale: 0.9 },
];

export default function StemOverlay() {
  // Inject minimal keyframes once
  useEffect(() => {
    const id = 'stem-overlay-kf';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes stemFloat { 
        0% { transform: translateY(0) rotate(var(--rot,0deg)); opacity: 0.22; } 
        50% { transform: translateY(-8px) rotate(calc(var(--rot,0deg) + 2deg)); opacity: 0.3; }
        100% { transform: translateY(6px) rotate(var(--rot,0deg)); opacity: 0.2; }
      }
      @keyframes stemDrift {
        0% { transform: translateX(0); }
        100% { transform: translateX(14px); }
      }
      @keyframes stemPulse {
        0% { transform: scale(var(--scale,1)) rotate(0deg); opacity: 0.08; }
        50% { transform: scale(calc(var(--scale,1) * 1.05)) rotate(1deg); opacity: 0.12; }
        100% { transform: scale(var(--scale,1)) rotate(0deg); opacity: 0.08; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div
      className="stem-overlay-layer"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -2,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        color: 'rgba(226, 232, 240, 0.8)',
        fontFamily: 'var(--font-heading, "Montserrat", sans-serif)',
      }}
    >
      {items.map((item, i) => (
        <span
          key={item.text + i}
          style={{
            position: 'absolute',
            top: item.top,
            left: item.left,
            fontSize: item.size,
            fontWeight: 700,
            letterSpacing: 0.4,
            opacity: 0.24,
            '--rot': `${item.rot}deg`,
            animation: 'stemFloat 8s ease-in-out infinite, stemDrift 22s linear infinite',
            animationDelay: `${i * 0.6}s`,
            whiteSpace: 'nowrap',
          } as React.CSSProperties}
        >
          {item.text}
        </span>
      ))}

      {diagrams.map((d, i) => (
        <svg
          key={`diag-${i}`}
          viewBox="0 0 120 120"
          style={{
            position: 'absolute',
            top: d.top,
            left: d.left,
            width: `${120 * d.scale}px`,
            height: `${120 * d.scale}px`,
            opacity: 0.1,
            '--scale': d.scale,
            animation: 'stemPulse 10s ease-in-out infinite',
            animationDelay: `${i * 1.2}s`,
          } as React.CSSProperties}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="60" cy="60" r="36" />
          <line x1="12" y1="60" x2="108" y2="60" />
          <line x1="60" y1="12" x2="60" y2="108" />
          <path d="M24 92 C48 64, 72 64, 96 92" />
          <polygon points="60,18 54,30 66,30" />
        </svg>
      ))}
    </div>
  );
}
