import { HeroVisual } from "@/components/visual/HeroVisual";
import { ScrollIndicator } from "@/components/common/ScrollIndicator";
import { Button } from "@/components/ui/Button";
import { heroConfig, siteConfig } from "@/data/site";

export function HeroSection() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden" aria-label="Introduction">
      {/* giant cropped background type */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0 flex select-none items-center justify-center">
        <span
          className="display outline-text whitespace-nowrap text-[44vw] leading-none lg:text-[30vw]"
          style={{ transform: "translateY(-6%)", backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.07), transparent 80%)", WebkitBackgroundClip: "text", backgroundClip: "text" }}
        >
          SILIN
        </span>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70" style={{ background: "radial-gradient(40% 45% at 50% 46%, rgba(139,92,255,0.18), transparent 70%)" }} />

      {/* 3D visual — full hero on desktop, top portion on small screens */}
      <div className="absolute inset-x-0 top-0 h-[68svh] lg:inset-0 lg:h-auto">
        <HeroVisual />
      </div>

      {/* legibility scrim over the 3D layer, behind the copy */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block" style={{ background: "linear-gradient(90deg, rgba(5,6,11,0.88) 0%, rgba(5,6,11,0.7) 24%, rgba(5,6,11,0) 46%)" }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[48svh] lg:hidden" style={{ background: "linear-gradient(0deg, rgba(5,6,11,0.92) 30%, rgba(5,6,11,0))" }} />

      {/* copy */}
      <div className="wrap pointer-events-none relative z-10 flex min-h-[100svh] flex-col justify-end pb-32 pt-[calc(var(--nav-h)+2rem)] lg:justify-center lg:pb-24">
        <div className="pointer-events-auto max-w-[34rem]">
          <p className="mb-5 flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-neon-cyan">
            <span className="blink inline-block h-1.5 w-1.5 bg-neon-cyan" />
            {siteConfig.brand} // 001
          </p>
          <h1 className="display text-[clamp(2.1rem,5.2vw,4.6rem)]">
            <span className="glitch glitch-auto" data-text={heroConfig.headline}>
              {heroConfig.headline}
            </span>
          </h1>
          <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-mute">{heroConfig.subtitle}</p>
          <p className="pixel mt-5 text-[0.62rem] leading-loose text-neon-violet md:text-[0.68rem]">{heroConfig.tags}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/works">Explore works</Button>
            <Button href="/blog" variant="ghost">
              Journal
            </Button>
          </div>
        </div>

        <dl className="pointer-events-none absolute bottom-28 right-[var(--edge)] hidden text-right font-mono text-[0.65rem] uppercase tracking-[0.2em] text-dim lg:block">
          {[
            ["ENTITY", "DIGITAL PHANTOM"],
            ["STATE", "RECONSTRUCTING"],
            ["ORBIT", "3D / PARAMETRIC"],
            ["MODE", "REAL-TIME"],
          ].map(([k, v]) => (
            <div key={k} className="mb-1.5 flex justify-end gap-4">
              <dt>{k}</dt>
              <dd className="text-mute">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="absolute inset-x-0 bottom-5 z-10 flex justify-center">
        <ScrollIndicator targetId="about" />
      </div>
    </section>
  );
}
