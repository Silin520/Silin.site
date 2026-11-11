"use client";

import { useEffect, useMemo } from "react";
import { createButterflyGeometry, createButterflyMaterial, createInstancedButterflyGeometry, type OrbitData } from "./Butterfly";
import type { SharedUniforms } from "./sceneState";

type Props = { data: OrbitData; shared: SharedUniforms };

/**
 * One instanced draw call for the whole swarm. Orbit, heading, wing flap and mouse avoidance
 * are all evaluated in the vertex shader — no per-frame JS work per butterfly.
 */
export function ButterflySwarm({ data, shared }: Props) {
  const base = useMemo(() => createButterflyGeometry(), []);
  const geometry = useMemo(() => createInstancedButterflyGeometry(base, data), [base, data]);
  const material = useMemo(() => createButterflyMaterial(shared), [shared]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => base.dispose(), [base]);
  useEffect(() => () => material.dispose(), [material]);

  return <mesh geometry={geometry} material={material} frustumCulled={false} renderOrder={3} />;
}
