"use client";

import { useEffect, useState } from "react";

/** Tiny decorative stream of changing hex characters. Updates ~7×/s in an isolated component. */
export function DataTicker({ length = 16, className = "" }: { length?: number; className?: string }) {
  const [text, setText] = useState("0".repeat(length));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const hex = "0123456789ABCDEF";
    const id = window.setInterval(() => {
      let s = "";
      for (let i = 0; i < length; i++) s += hex[Math.floor(Math.random() * 16)];
      setText(s);
    }, 140);
    return () => window.clearInterval(id);
  }, [length]);

  return (
    <span aria-hidden="true" className={`font-mono tracking-[0.2em] ${className}`}>
      {text}
    </span>
  );
}
