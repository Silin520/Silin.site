"use client";

import { useState } from "react";

type Props = {
  src: string | null | undefined;
  alt: string;
  label?: string;
  hue?: number;
  className?: string;
};

/**
 * Renders the real image when `src` is provided and loads; otherwise a designed placeholder
 * (never a broken-image icon). Must sit inside a positioned, aspect-ratio'd parent.
 */
export function PlaceholderImage({ src, alt, label = "[IMAGE]", hue = 190, className = "" }: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (src && failedSrc !== src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading="lazy" onError={() => setFailedSrc(src)} className={`media-inner absolute inset-0 h-full w-full object-cover ${className}`} />;
  }

  const h2 = (hue + 75) % 360;
  return (
    <div
      role="img"
      aria-label={alt}
      className={`media-inner absolute inset-0 overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 90% at 18% 8%, hsla(${hue},100%,55%,0.38), transparent 58%), radial-gradient(90% 80% at 88% 95%, hsla(${h2},100%,60%,0.30), transparent 58%), linear-gradient(160deg, #0d1324, #05060b)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1.7px)",
          backgroundSize: "8px 8px",
          WebkitMaskImage: "linear-gradient(135deg, #000 0%, transparent 62%)",
          maskImage: "linear-gradient(135deg, #000 0%, transparent 62%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" strokeWidth="0.25">
          <circle cx="62" cy="46" r="22" stroke={`hsla(${hue},100%,65%,0.55)`} />
          <circle cx="62" cy="46" r="32" stroke={`hsla(${h2},100%,70%,0.3)`} strokeDasharray="1 2" />
          <path d="M20 78 L80 18" stroke="rgba(255,255,255,0.2)" />
        </g>
        <rect x="14" y="62" width="34" height="1.6" fill={`hsla(${hue},100%,60%,0.7)`} />
        <rect x="20" y="66" width="24" height="1.6" fill={`hsla(${h2},100%,65%,0.6)`} />
        <rect x="10" y="70" width="14" height="1.6" fill="rgba(255,255,255,0.35)" />
      </svg>
      <span className="absolute bottom-3 left-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/55">{label}</span>
      <span className="absolute right-3 top-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/35">NO SIGNAL</span>
    </div>
  );
}
