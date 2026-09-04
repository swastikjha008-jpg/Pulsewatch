'use client';

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';

export interface WarpTextProps {
  text: string;
  color?: string;
  warpStrength?: number;
  warpScale?: number;
  speed?: number;
  pointerInfluence?: number;
  pointerStrength?: number;
  refraction?: number;
  ripple?: boolean;
  fontSize?: string;
  fontWeight?: number;
  className?: string;
  style?: CSSProperties;
}

export default function WarpText({
  text,
  color = '#f8f5ff',
  warpStrength = 0.08,
  warpScale = 1.7,
  speed = 0.55,
  pointerInfluence = 0.4,
  pointerStrength = 0.35,
  refraction = 0.015,
  ripple = false,
  fontSize = 'clamp(2.4rem, 6.4vw, 5.4rem)',
  fontWeight = 800,
  className = '',
  style,
}: WarpTextProps) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const filterId = `warp-${rawId}`;
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(warpStrength * 220);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let seed = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (reduced) return;
      seed += 0.06 * speed;
      if (turbRef.current) {
        turbRef.current.setAttribute('seed', String(Math.floor(seed)));
        if (ripple) {
          const bf = 0.008 * warpScale + Math.sin(seed * 0.05) * 0.003 * warpScale;
          turbRef.current.setAttribute('baseFrequency', `${bf} ${bf * 1.6}`);
        }
      }
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [speed, ripple, warpScale]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || pointerInfluence <= 0) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      const dist = Math.min(1, Math.hypot(dx, dy));
      const boost = 1 + (1 - dist) * pointerInfluence * pointerStrength * 6;
      setScale(warpStrength * 220 * boost);
    };
    const onLeave = () => setScale(warpStrength * 220);

    window.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [pointerInfluence, pointerStrength, warpStrength]);

  return (
    <div
      ref={containerRef}
      className={`relative flex w-full items-center justify-center ${className}`}
      style={style}
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency={`${0.008 * warpScale} ${0.012 * warpScale}`}
              numOctaves={2}
              seed={1}
              result="turb"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turb"
              scale={scale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
            {refraction > 0 && (
              <feColorMatrix
                type="matrix"
                values={`1 0 0 0 ${refraction} 0 1 0 0 0 0 0 1 0 ${refraction} 0 0 0 1 0`}
              />
            )}
          </filter>
        </defs>
      </svg>

      <span
        style={{
          fontSize,
          fontWeight,
          color,
          filter: `url(#${filterId})`,
          lineHeight: 1.02,
          letterSpacing: '-0.02em',
        }}
        className="select-none text-center"
      >
        {text}
      </span>
    </div>
  );
}
