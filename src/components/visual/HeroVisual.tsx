"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useDeviceTier, useReducedMotion } from "@/hooks/useDeviceTier";
import { heroConfig } from "@/data/site";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { PhantomFallback } from "./PhantomFallback";
import { sceneState } from "./sceneState";

const PhantomCanvas = dynamic(() => import("./PhantomCanvas"), { ssr: false });

class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[SILIN SPACE] 3D scene failed, showing static fallback:", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function detectWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Hero 3D visual: digital phantom + butterfly halo. Handles WebGL detection, visibility pausing, pointer + scroll input. */
export function HeroVisual() {
  const tier = useDeviceTier();
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setWebgl(detectWebGL());
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && !document.hidden), { threshold: 0 });
    io.observe(el);
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      sceneState.mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      sceneState.mouse.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      sceneState.active = true;
    };
    const onLeave = () => {
      sceneState.active = false;
      sceneState.mouse.x = 0;
      sceneState.mouse.y = 0;
    };
    const onScroll = () => {
      sceneState.scroll = Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight * 0.9)));
    };
    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      sceneState.scroll = 0;
      sceneState.active = false;
    };
  }, []);

  const onReady = useCallback(() => setReady(true), []);

  const fallback = <PhantomFallback portrait={heroConfig.portrait} />;

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0">
      {webgl === false ? (
        fallback
      ) : webgl && tier ? (
        <SceneBoundary fallback={fallback}>
          <PhantomCanvas tier={tier} portrait={heroConfig.portrait} reduced={reduced} active={visible} onReady={onReady} />
        </SceneBoundary>
      ) : null}
      {webgl !== false && <LoadingScreen visible={!ready} />}
    </div>
  );
}
