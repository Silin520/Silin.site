"use client";

import { useCallback, useRef, useState } from "react";
import { Maximize2 } from "lucide-react";
import type { GalleryItem } from "@/data/gallery";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { GalleryViewer } from "@/components/ui/GalleryViewer";

const SPAN: Record<GalleryItem["span"], string> = {
  xl: "md:col-span-7",
  lg: "md:col-span-5",
  md: "md:col-span-4",
  sm: "md:col-span-3",
};

export function GalleryExperience({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", String(((e.clientX - r.left) / r.width) * 2 - 1));
    el.style.setProperty("--my", String(((e.clientY - r.top) / r.height) * 2 - 1));
  };

  const open = (i: number, target: HTMLElement) => {
    lastFocus.current = target;
    setActive(i);
  };
  const close = useCallback(() => {
    setActive(null);
    lastFocus.current?.focus();
  }, []);

  return (
    <section className="wrap pb-12" aria-label="Image archive">
      <div ref={wrap} onPointerMove={onMove} className="grid items-start gap-x-8 gap-y-14 md:grid-cols-12 md:gap-y-20" style={{ perspective: "1400px" }}>
        {items.map((item, i) => (
          <figure
            key={item.id}
            className={`spatial-item ${SPAN[item.span]}`}
            style={
              {
                "--rot": `${item.rotate}deg`,
                "--dx": `${item.depth * -0.4}px`,
                "--dy": `${item.depth * -0.25}px`,
                "--mt": `${(i % 3) * 28}px`,
              } as React.CSSProperties
            }
          >
            <button
              type="button"
              onClick={(e) => open(i, e.currentTarget)}
              className="card-hover group relative block w-full text-left"
              aria-label={`Open ${item.title} in viewer`}
            >
              <div className="media-frame border border-white/10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]" style={{ aspectRatio: item.ratio }}>
                <PlaceholderImage src={item.src} alt={item.title} hue={item.hue} label={`[${item.id.toUpperCase()}]`} />
                <span className="neon-edge" />
                <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center border border-white/20 bg-void/60 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Maximize2 size={15} />
                </span>
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between gap-4">
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-ink">
                  <span className="mr-2 text-neon-cyan">{String(i + 1).padStart(2, "0")}</span>
                  {item.title}
                </span>
                <span className="hidden font-mono text-[0.6rem] tracking-[0.2em] text-dim sm:inline">{item.coord}</span>
              </figcaption>
            </button>
          </figure>
        ))}
      </div>
      <GalleryViewer items={items} index={active} onClose={close} onChange={setActive} />
    </section>
  );
}
