import type { ReactNode } from "react";
import { DataTicker } from "@/components/common/DataTicker";

type Props = {
  index: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  aside?: ReactNode;
  tone?: "cyan" | "violet" | "magenta";
};

const glow = {
  cyan: "rgba(0,240,255,0.14)",
  violet: "rgba(139,92,255,0.2)",
  magenta: "rgba(255,56,168,0.14)",
};

export function PageHero({ index, eyebrow, title, subtitle, aside, tone = "cyan" }: Props) {
  return (
    <header className="page-top relative overflow-hidden pb-14 md:pb-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(50% 70% at 85% 20%, ${glow[tone]}, transparent 70%)` }} />
      <span aria-hidden="true" className="display outline-text pointer-events-none absolute -right-[2vw] top-[calc(var(--nav-h)+1rem)] select-none text-[34vw] leading-none opacity-30 md:text-[22vw]">
        {index}
      </span>
      <div className="wrap relative">
        <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="font-mono text-xs text-neon-cyan">{index}</span>
          <span className="h-px w-12 bg-gradient-to-r from-neon-cyan to-transparent" />
          <span className="label">{eyebrow}</span>
          <DataTicker length={12} className="hidden text-[0.65rem] text-dim sm:inline" />
        </div>
        <h1 className="display text-[clamp(2.8rem,10.5vw,9.5rem)]">
          <span className="glitch glitch-auto" data-text={title}>
            {title}
          </span>
        </h1>
        <div className="mt-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <p className="max-w-lg text-base leading-relaxed text-mute md:text-lg">{subtitle}</p>
          {aside}
        </div>
      </div>
    </header>
  );
}
