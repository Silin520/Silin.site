"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useState } from "react";
import type { Group, PerspectiveCamera } from "three";
import { DigitalPhantom } from "./DigitalPhantom";
import { ButterflySwarm } from "./ButterflySwarm";
import { ButterflyOrbit } from "./ButterflyOrbit";
import { ParticleTrail } from "./ParticleTrail";
import { PostProcessing } from "./PostProcessing";
import { generateButterflyOrbits, generateDustOrbits } from "./Butterfly";
import { createSharedUniforms, sceneState, type SharedUniforms } from "./sceneState";
import type { DeviceTier } from "@/hooks/useDeviceTier";

type TierConfig = {
  butterflies: number;
  trail: number;
  dust: number;
  dpr: number;
  bloom: number;
  ring: number;
  portrait: number;
  density: number;
  aberration: boolean;
  shift: number;
};

const TIERS: Record<DeviceTier, TierConfig> = {
  desktop: { butterflies: 34, trail: 12, dust: 520, dpr: 2, bloom: 0.6, ring: 1, portrait: 1, density: 100, aberration: true, shift: 0.9 },
  tablet: { butterflies: 22, trail: 8, dust: 420, dpr: 1.5, bloom: 0.55, ring: 0.78, portrait: 1, density: 84, aberration: false, shift: 0 },
  mobile: { butterflies: 14, trail: 5, dust: 220, dpr: 1.25, bloom: 0.5, ring: 0.62, portrait: 1.02, density: 66, aberration: false, shift: 0 },
};

const PORTRAIT_HEIGHT = 4.6;
const RING_HALF_WIDTH = 5.0;

type SceneProps = { cfg: TierConfig; shared: SharedUniforms; portrait: string | null; reduced: boolean; onReady: () => void };

function Scene({ cfg, shared, portrait, reduced, onReady }: SceneProps) {
  const rig = useRef<Group>(null);
  const phantomGroup = useRef<Group>(null);
  const smooth = useRef({ mx: 0, my: 0, sc: 0 });
  const { size } = useThree();
  void size;

  const butterflies = useMemo(() => generateButterflyOrbits(cfg.butterflies, 11), [cfg.butterflies]);
  const dust = useMemo(() => generateDustOrbits(cfg.dust, 91), [cfg.dust]);
  const motion = reduced ? 0.25 : 1;

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const s = smooth.current;
    shared.uTime.value += dt * motion;

    s.mx += (sceneState.mouse.x - s.mx) * 0.06;
    s.my += (sceneState.mouse.y - s.my) * 0.06;
    s.sc += (sceneState.scroll - s.sc) * 0.08;
    sceneState.scroll = Math.min(Math.max(sceneState.scroll, 0), 1);

    const cam = state.camera as PerspectiveCamera;
    const fovRad = (cam.fov * Math.PI) / 180;
    const aspect = state.size.width / state.size.height;
    const tanH = Math.tan(fovRad / 2);

    // fit the whole orbit ring horizontally on narrow viewports
    const neededZ = (RING_HALF_WIDTH * cfg.ring * 2 * 1.04) / (2 * tanH * aspect);
    const targetZ = Math.max(10, neededZ) + s.sc * 1.5;
    cam.position.z += (targetZ - cam.position.z) * 0.08;
    cam.position.y = 0.1 - s.sc * 1.1;

    const halfH = cam.position.z * tanH;
    if (sceneState.active) shared.uMouse.value.set(s.mx * halfH * aspect, s.my * halfH);
    else shared.uMouse.value.set(99, 99);
    shared.uRing.value = cfg.ring * (1 + s.sc * 0.3);
    shared.uPointScale.value = (state.size.height * state.gl.getPixelRatio()) / (2 * tanH);

    if (rig.current) {
      rig.current.rotation.y = s.mx * 0.12;
      rig.current.rotation.x = -s.my * 0.06;
      rig.current.position.x = cfg.shift * Math.min(1, Math.max(0, (aspect - 1.2) / 0.5));
    }
    if (phantomGroup.current) {
      phantomGroup.current.position.x = -s.mx * 0.14;
      phantomGroup.current.position.y = -0.05 - s.my * 0.06;
    }
  });

  return (
    <>
      <group ref={rig}>
        <group ref={phantomGroup}>
          <DigitalPhantom src={portrait} shared={shared} height={PORTRAIT_HEIGHT * cfg.portrait} density={cfg.density} motion={motion} onReady={onReady} />
        </group>
        <ButterflyOrbit dust={dust} guides={butterflies} guideCount={6} shared={shared} />
        <ParticleTrail data={butterflies} steps={cfg.trail} shared={shared} />
        <ButterflySwarm data={butterflies} shared={shared} />
      </group>
      <PostProcessing intensity={cfg.bloom} aberration={cfg.aberration} />
    </>
  );
}

type Props = { tier: DeviceTier; portrait: string | null; reduced: boolean; active: boolean; onReady: () => void };

export default function PhantomCanvas({ tier, portrait, reduced, active, onReady }: Props) {
  const cfg = TIERS[tier];
  const shared = useMemo(() => createSharedUniforms(), []);
  const [dpr, setDpr] = useState(cfg.dpr);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={Math.min(dpr, cfg.dpr)}
      camera={{ fov: 38, position: [0, 0.1, 10], near: 0.1, far: 60 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{ touchAction: "pan-y" }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(cfg.dpr)} flipflops={2}>
        <Scene cfg={cfg} shared={shared} portrait={portrait} reduced={reduced} onReady={onReady} />
      </PerformanceMonitor>
    </Canvas>
  );
}
