"use client";

import { ArrowUp } from "lucide-react";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-mute transition-colors hover:text-neon-cyan"
    >
      Top <ArrowUp size={14} className="transition-transform group-hover:-translate-y-1" />
    </button>
  );
}
