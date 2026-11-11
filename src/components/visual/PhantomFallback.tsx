/** Static, readable fallback when WebGL is unavailable or fails to initialise. CSS-only; never a black screen. */
export function PhantomFallback({ portrait }: { portrait: string | null }) {
  const flies = [
    { x: "14%", y: "22%", s: 1, c: "#00f0ff", d: "0s" },
    { x: "80%", y: "18%", s: 0.8, c: "#8b5cff", d: "0.4s" },
    { x: "8%", y: "62%", s: 0.7, c: "#ff38a8", d: "0.8s" },
    { x: "86%", y: "60%", s: 1.1, c: "#b8ff3b", d: "0.2s" },
    { x: "26%", y: "82%", s: 0.6, c: "#8b5cff", d: "0.6s" },
    { x: "70%", y: "84%", s: 0.75, c: "#00f0ff", d: "1s" },
  ];
  return (
    <div className="absolute inset-0 flex items-center justify-center" role="img" aria-label="Digital phantom portrait with orbiting luminous butterflies (static fallback)">
      <div className="relative h-[78%] max-h-[640px] aspect-[9/16]">
        <svg className="absolute -inset-[40%] h-[180%] w-[180%]" viewBox="0 0 100 100" aria-hidden="true">
          <ellipse cx="50" cy="50" rx="46" ry="18" fill="none" stroke="rgba(0,240,255,0.25)" strokeWidth="0.15" transform="rotate(-18 50 50)" />
          <ellipse cx="50" cy="50" rx="40" ry="24" fill="none" stroke="rgba(139,92,255,0.3)" strokeWidth="0.15" strokeDasharray="0.6 1" transform="rotate(24 50 50)" />
        </svg>
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            backgroundImage: portrait ? `url(${portrait})` : "radial-gradient(ellipse at 50% 40%, #aaa, #000 65%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(1) contrast(1.5)",
            WebkitMaskImage: "linear-gradient(#000 70%, transparent)",
            maskImage: "linear-gradient(#000 70%, transparent)",
          }}
        />
        <div className="halftone absolute inset-0 mix-blend-multiply" style={{ backgroundSize: "5px 5px", opacity: 0.8 }} />
      </div>
      {flies.map((f, i) => (
        <svg key={i} viewBox="0 0 40 30" className="absolute w-10 md:w-14" style={{ left: f.x, top: f.y, transform: `scale(${f.s})`, filter: `drop-shadow(0 0 8px ${f.c})` }} aria-hidden="true">
          <g style={{ transformOrigin: "20px 15px", animation: `flap 1.1s ease-in-out ${f.d} infinite` }}>
            <path d="M20 15 C 12 0, 0 2, 2 12 C 3 18, 12 18, 20 15 Z M20 15 C 28 0, 40 2, 38 12 C 37 18, 28 18, 20 15 Z" fill={f.c} fillOpacity="0.25" stroke={f.c} strokeWidth="0.8" />
            <path d="M20 15 C 14 20, 8 28, 14 28 C 18 28, 20 22, 20 15 Z M20 15 C 26 20, 32 28, 26 28 C 22 28, 20 22, 20 15 Z" fill={f.c} fillOpacity="0.2" stroke={f.c} strokeWidth="0.8" />
          </g>
        </svg>
      ))}
    </div>
  );
}
