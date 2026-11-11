"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navItems, siteConfig } from "@/data/site";
import { MobileMenu } from "./MobileMenu";

export function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openFor, setOpenFor] = useState<string | null>(null);

  // Menu auto-closes on navigation: it is only "open" for the pathname it was opened on.
  const menuOpen = open && openFor === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggle = () => {
    setOpen(!menuOpen);
    setOpenFor(pathname);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ${
          scrolled || menuOpen
            ? "border-b border-white/[0.06] bg-void/70 backdrop-blur-xl"
            : "border-b border-transparent bg-gradient-to-b from-void/60 to-transparent backdrop-blur-[2px]"
        }`}
      >
        <div className="wrap flex h-[var(--nav-h)] items-center justify-between">
          <Link href="/" className="group flex items-center gap-3" aria-label="SILIN SPACE — home">
            <span className="relative block h-2.5 w-2.5 rotate-45 border border-neon-cyan">
              <span className="absolute inset-[2px] bg-neon-cyan opacity-70 transition-opacity group-hover:opacity-100" />
            </span>
            <span className="font-display text-[0.95rem] font-semibold tracking-[0.32em] text-ink">
              SILIN<span className="text-neon-cyan"> </span>SPACE
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1 lg:gap-3">
              {navItems.map((item, i) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`group relative flex items-center gap-2 px-3 py-2 font-mono text-[0.7rem] uppercase tracking-[0.26em] transition-colors lg:px-4 ${
                        active ? "text-ink" : "text-mute hover:text-neon-cyan"
                      }`}
                    >
                      <span className={`text-[0.55rem] ${active ? "text-neon-cyan" : "text-dim group-hover:text-neon-cyan"}`}>
                        {String(i).padStart(2, "0")}
                      </span>
                      {item.label}
                      <span
                        className={`absolute inset-x-3 -bottom-px h-px origin-left bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-magenta transition-transform duration-500 lg:inset-x-4 ${
                          active ? "scale-x-100 shadow-[0_0_10px_var(--color-neon-cyan)]" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            type="button"
            onClick={toggle}
            className="relative z-[90] flex h-11 w-11 items-center justify-center border border-white/10 text-ink transition-colors hover:border-neon-cyan md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setOpen(false)} pathname={pathname} brand={siteConfig.brand} />
    </>
  );
}
