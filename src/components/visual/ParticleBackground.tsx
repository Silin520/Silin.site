"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

type P = { x: number; y: number; r: number; vy: number; vx: number; hue: number; a: number; ph: number };
const HUES = ["0,240,255", "139,92,255", "255,56,168", "184,255,59"];
const CHARS = "01<>/\\|+*#=:;";

/** Global, restrained digital-space backdrop: neon glows + slow particles + occasional glyph flicker. */
export function ParticleBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let particles: P[] = [];
    const glyphs: { x: number; y: number; c: string; life: number }[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, Math.max(28, (w * h) / 22000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.3,
        vy: -(Math.random() * 0.12 + 0.02),
        vx: (Math.random() - 0.5) * 0.05,
        hue: Math.floor(Math.random() * HUES.length),
        a: Math.random() * 0.5 + 0.15,
        ph: Math.random() * 6.28,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -4) p.y = h + 4;
        if (p.x < -4) p.x = w + 4;
        if (p.x > w + 4) p.x = -4;
        const tw = 0.6 + 0.4 * Math.sin(t * 0.001 + p.ph);
        ctx.fillStyle = `rgba(${HUES[p.hue]},${p.a * tw})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fill();
      }
      if (!reduced) {
        if (Math.random() < 0.012 && glyphs.length < 6) {
          glyphs.push({ x: Math.random() * w, y: Math.random() * h, c: CHARS[Math.floor(Math.random() * CHARS.length)], life: 1 });
        }
        ctx.font = "12px 'IBM Plex Mono', monospace";
        for (let i = glyphs.length - 1; i >= 0; i--) {
          const g = glyphs[i];
          g.life -= 0.016;
          if (g.life <= 0) {
            glyphs.splice(i, 1);
            continue;
          }
          ctx.fillStyle = `rgba(0,240,255,${g.life * 0.35 * (Math.random() > 0.2 ? 1 : 0.2)})`;
          ctx.fillText(g.c, g.x, g.y);
        }
      }
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) raf = requestAnimationFrame(loop);
    };

    resize();
    if (reduced) draw(0);
    else raf = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-void via-deep to-void" />
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: isHome ? 1 : 0.6,
          background:
            "radial-gradient(60% 45% at 78% 8%, rgba(139,92,255,0.20), transparent 70%), radial-gradient(50% 40% at 8% 55%, rgba(0,240,255,0.10), transparent 70%), radial-gradient(55% 40% at 90% 92%, rgba(255,56,168,0.11), transparent 70%)",
        }}
      />
      <canvas ref={ref} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: isHome ? 1 : 0.55 }} />
    </div>
  );
}
