"use client";

import { useEffect, useState } from "react";

/** Inline loading veil for the hero visual. Fades out, then unmounts once `visible` turns false. */
export function LoadingScreen({ visible }: { visible: boolean }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (visible) return;
    const id = window.setTimeout(() => setGone(true), 700);
    return () => window.clearTimeout(id);
  }, [visible]);

  if (gone) return null;

  return (
    <div
      aria-hidden={!visible}
      className={`pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <p className="pixel text-[0.7rem] text-neon-cyan">
        INITIALIZING PHANTOM<span className="blink">_</span>
      </p>
      <span className="relative block h-px w-48 overflow-hidden bg-white/10">
        <span className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-neon-cyan to-transparent" style={{ animation: "marquee 1.4s linear infinite", width: "60%" }} />
      </span>
    </div>
  );
}
