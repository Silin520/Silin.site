"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CanvasTexture, LinearFilter, NoColorSpace, TextureLoader, type Mesh, type Texture } from "three";
import { createPhantomMaterial, createPhantomUniforms } from "./DigitalPhantomShader";
import { sceneState, type SharedUniforms } from "./sceneState";

type Props = {
  src: string | null;
  shared: SharedUniforms;
  height: number;
  density: number;
  motion: number;
  onReady?: () => void;
};

/** Procedural abstract silhouette used when no portrait image is configured (or it fails to load). */
function createFallbackPortrait(): CanvasTexture {
  const w = 512;
  const h = 910;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  // shoulders
  let grd = ctx.createRadialGradient(w * 0.42, h * 0.78, 10, w * 0.5, h * 0.9, w * 0.7);
  grd.addColorStop(0, "#9a9a9a");
  grd.addColorStop(1, "#000");
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.ellipse(w / 2, h * 0.98, w * 0.5, h * 0.2, 0, Math.PI, 0);
  ctx.fill();
  // neck
  ctx.fillStyle = "#555";
  ctx.fillRect(w * 0.42, h * 0.6, w * 0.16, h * 0.18);
  // head
  grd = ctx.createRadialGradient(w * 0.42, h * 0.38, 10, w * 0.5, h * 0.44, w * 0.34);
  grd.addColorStop(0, "#f2f2f2");
  grd.addColorStop(0.6, "#7a7a7a");
  grd.addColorStop(1, "#1a1a1a");
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.ellipse(w / 2, h * 0.44, w * 0.25, h * 0.19, 0, 0, Math.PI * 2);
  ctx.fill();
  const tex = new CanvasTexture(c);
  tex.colorSpace = NoColorSpace;
  tex.minFilter = LinearFilter;
  return tex;
}

export function DigitalPhantom({ src, shared, height, density, motion, onReady }: Props) {
  const mesh = useRef<Mesh>(null);
  const aspectRef = useRef(910 > 0 ? 512 / 910 : 0.5625);
  const uniforms = useMemo(() => createPhantomUniforms(density, motion), [density, motion]);
  const material = useMemo(() => createPhantomMaterial(uniforms), [uniforms]);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  // fallback texture (always available instantly)
  useEffect(() => {
    const fallback = createFallbackPortrait();
    uniforms.uTex.value = fallback;
    uniforms.uAspect.value = 512 / 910;
    aspectRef.current = 512 / 910;
    return () => {
      if (uniforms.uTex.value === fallback) uniforms.uTex.value = null;
      fallback.dispose();
    };
  }, [uniforms]);

  // portrait image (replaceable via heroConfig.portrait)
  useEffect(() => {
    if (!src) {
      readyRef.current?.();
      return;
    }
    let cancelled = false;
    let loaded: Texture | null = null;
    new TextureLoader().load(
      src,
      (tex) => {
        if (cancelled) {
          tex.dispose();
          return;
        }
        tex.colorSpace = NoColorSpace;
        tex.anisotropy = 4;
        loaded = tex;
        const img = tex.image as { width: number; height: number };
        const a = img.width / img.height;
        aspectRef.current = a;
        uniforms.uAspect.value = a;
        uniforms.uTex.value = tex;
        readyRef.current?.();
      },
      undefined,
      () => {
        if (!cancelled) readyRef.current?.();
      },
    );
    return () => {
      cancelled = true;
      loaded?.dispose();
    };
  }, [src, uniforms]);

  useEffect(() => () => material.dispose(), [material]);

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const a = aspectRef.current;
    const breathe = 1 + Math.sin(shared.uTime.value * 1.3) * 0.004;
    m.scale.set(height * a * breathe, height * breathe, 1);
    uniforms.uTime.value = shared.uTime.value;
    uniforms.uScroll.value = sceneState.scroll;
    const mx = shared.uMouse.value.x;
    const my = shared.uMouse.value.y;
    uniforms.uMouseUv.value.set((mx - m.position.x) / (height * a) + 0.5, (my - m.position.y) / height + 0.5);
  });

  return (
    <mesh ref={mesh} material={material} renderOrder={1}>
      <planeGeometry args={[1, 1, 1, 1]} />
    </mesh>
  );
}
