"use client";

type Props = { targetId: string; label?: string };

export function ScrollIndicator({ targetId, label = "SCROLL" }: Props) {
  return (
    <button
      type="button"
      onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" })}
      className="group flex flex-col items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-mute transition-colors hover:text-neon-cyan"
      aria-label={`Scroll down to ${targetId}`}
    >
      {label}
      <span className="relative block h-12 w-px overflow-hidden bg-white/15">
        <span className="absolute left-0 top-0 h-4 w-px bg-neon-cyan shadow-[0_0_8px_var(--color-neon-cyan)]" style={{ animation: "bob 1.8s ease-in-out infinite" }} />
      </span>
    </button>
  );
}
