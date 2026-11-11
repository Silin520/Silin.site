"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import type { GalleryItem } from "@/data/gallery";
import { PlaceholderImage } from "./PlaceholderImage";

type Props = { items: GalleryItem[]; index: number | null; onClose: () => void; onChange: (i: number) => void };

export function GalleryViewer({ items, index, onClose, onChange }: Props) {
  const [zoomState, setZoomState] = useState<{ index: number | null; on: boolean }>({ index: null, on: false });
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const zoom = zoomState.index === index && zoomState.on;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onChange((index + dir + items.length) % items.length);
    },
    [index, items.length, onChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, go]);

  if (index === null) return null;
  const item = items[index];

  return (
    <div role="dialog" aria-modal="true" aria-label={`Image viewer: ${item.title}`} className="fixed inset-0 z-[90] flex flex-col bg-void/95 backdrop-blur-xl" style={{ animation: "page-in 0.35s ease both" }}>
      <div className="flex items-center justify-between px-[var(--edge)] py-5">
        <p className="font-mono text-xs tracking-[0.22em] text-mute">
          <span className="text-neon-cyan">{String(index + 1).padStart(2, "0")}</span> / {String(items.length).padStart(2, "0")}
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setZoomState({ index, on: !zoom })} className="flex h-11 w-11 items-center justify-center border border-white/10 text-ink hover:border-neon-cyan" aria-label={zoom ? "Zoom out" : "Zoom in"}>
            {zoom ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
          </button>
          <button ref={closeRef} type="button" onClick={onClose} className="flex h-11 w-11 items-center justify-center border border-white/10 text-ink hover:border-neon-magenta" aria-label="Close viewer (Esc)">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-24">
        <button type="button" onClick={() => go(-1)} className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center border border-white/10 bg-void/60 text-ink hover:border-neon-cyan md:left-8" aria-label="Previous image">
          <ChevronLeft size={22} />
        </button>
        <div className="flex h-full w-full items-center justify-center overflow-hidden">
          <div
            key={item.id}
            onClick={() => setZoomState({ index, on: !zoom })}
            className="media-frame relative max-h-full cursor-zoom-in border border-white/10 transition-transform duration-500"
            style={{
              aspectRatio: item.ratio,
              width: `min(100%, calc(62svh * ${item.ratio}))`,
              transform: zoom ? "scale(1.5)" : "scale(1)",
              cursor: zoom ? "zoom-out" : "zoom-in",
              animation: "page-in 0.45s ease both",
            }}
          >
            <PlaceholderImage src={item.src} alt={item.title} hue={item.hue} label={`[${item.id.toUpperCase()}]`} />
          </div>
        </div>
        <button type="button" onClick={() => go(1)} className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center border border-white/10 bg-void/60 text-ink hover:border-neon-cyan md:right-8" aria-label="Next image">
          <ChevronRight size={22} />
        </button>
      </div>

      <div className="px-[var(--edge)] py-6 text-center">
        <p className="label mb-2">{item.coord}</p>
        <h2 className="display text-2xl md:text-4xl">{item.title}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-mute">{item.description}</p>
      </div>
    </div>
  );
}
