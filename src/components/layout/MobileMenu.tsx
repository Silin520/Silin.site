"use client";

import Link from "next/link";
import { useEffect } from "react";
import { navItems, siteConfig } from "@/data/site";

type Props = { open: boolean; onClose: () => void; pathname: string; brand: string };

export function MobileMenu({ open, onClose, pathname }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-0 z-[75] flex flex-col bg-void/[0.97] px-[var(--edge)] pb-10 pt-[calc(var(--nav-h)+2rem)] backdrop-blur-2xl md:hidden"
      style={{ animation: "page-in 0.4s ease both" }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-60" style={{ background: "radial-gradient(70% 50% at 80% 90%, rgba(139,92,255,0.25), transparent 70%), radial-gradient(60% 40% at 10% 10%, rgba(0,240,255,0.14), transparent 70%)" }} />
      <nav aria-label="Mobile" className="relative flex-1">
        <ul className="flex flex-col">
          {navItems.map((item, i) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href} className="menu-item border-b border-white/[0.07]" style={{ animationDelay: `${80 + i * 70}ms` }}>
                <Link href={item.href} onClick={onClose} aria-current={active ? "page" : undefined} className="flex items-baseline gap-4 py-5">
                  <span className="font-mono text-xs text-neon-cyan">{String(i).padStart(2, "0")}</span>
                  <span className={`display text-[clamp(2.2rem,11vw,3.6rem)] ${active ? "text-ink" : "text-mute"}`}>{item.label}</span>
                  {active && <span className="ml-auto h-2 w-2 bg-neon-cyan shadow-[0_0_12px_var(--color-neon-cyan)]" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="menu-item relative flex items-end justify-between" style={{ animationDelay: "480ms" }}>
        <div>
          <p className="label">SIGNAL</p>
          <p className="mt-1 font-mono text-xs text-mute">{siteConfig.email}</p>
        </div>
        <p className="pixel text-[0.7rem] text-neon-violet">SILIN SPACE</p>
      </div>
    </div>
  );
}
