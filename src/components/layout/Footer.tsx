import Link from "next/link";
import { navItems, siteConfig } from "@/data/site";
import { BackToTop } from "@/components/common/BackToTop";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t hairline bg-gradient-to-b from-transparent to-void/80">
      <div className="wrap py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="display text-4xl md:text-5xl">
              SILIN <span className="outline-text">SPACE</span>
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-mute">{siteConfig.tagline}</p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <p className="label mb-5">INDEX</p>
            <ul className="space-y-3">
              {navItems.map((item, i) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-line inline-flex gap-3 font-mono text-xs uppercase tracking-[0.2em] text-mute hover:text-ink">
                    <span className="text-dim">{String(i).padStart(2, "0")}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <p className="label mb-5">SIGNAL</p>
            <p className="font-mono text-sm text-ink">{siteConfig.email}</p>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              {siteConfig.socialLinks.map((s) => (
                <li key={s.label}>
                  {s.href ? (
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-line font-mono text-xs uppercase tracking-[0.18em] text-mute hover:text-neon-cyan">
                      {s.label}
                    </a>
                  ) : (
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-dim" aria-disabled="true">
                      {s.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t hairline pt-6 md:flex-row md:items-center md:justify-between">
          <p className="label">{siteConfig.copyright}</p>
          <div className="flex items-center gap-6">
            <p className="pixel text-[0.65rem] text-dim">
              <span className="blink text-neon-lime">●</span> SYS ONLINE
            </p>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
