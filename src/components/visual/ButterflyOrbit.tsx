"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, LineBasicMaterial, type Group } from "three";
import { createOrbitPointsGeometry, createOrbitPointsMaterial } from "./ParticleTrail";
import type { OrbitData } from "./Butterfly";
import type { SharedUniforms } from "./sceneState";

type Props = { dust: OrbitData; guides: OrbitData; guideCount: number; shared: SharedUniforms };

const PALETTE: [number, number, number][] = [
  [0, 0.94, 1],
  [0.55, 0.36, 1],
  [1, 0.22, 0.66],
  [0.72, 1, 0.23],
];

/** Ambient particle stream along the orbits + very faint orbit guide rings that reinforce the 3D halo. */
export function ButterflyOrbit({ dust, guides, guideCount, shared }: Props) {
  const group = useRef<Group>(null);

  const dustGeo = useMemo(() => createOrbitPointsGeometry(dust, 1), [dust]);
  const dustMat = useMemo(() => createOrbitPointsMaterial(shared, false, 1), [shared]);

  const lineGeo = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const seg = 96;
    const n = Math.min(guideCount, guides.count);
    for (let i = 0; i < n; i++) {
      const [R, Rz, , yOff] = guides.orbit.subarray(i * 4, i * 4 + 4);
      const [tx, tz] = guides.tilt.subarray(i * 4, i * 4 + 4);
      const col = PALETTE[Math.floor(guides.misc[i * 4 + 1] * 4) % 4];
      const pt = (k: number) => {
        const th = (k / seg) * Math.PI * 2;
        let x = R * Math.cos(th);
        let y = yOff;
        let z = Rz * Math.sin(th);
        const cy = Math.cos(tx) * y - Math.sin(tx) * z;
        z = Math.sin(tx) * y + Math.cos(tx) * z;
        y = cy;
        const nx = Math.cos(tz) * x - Math.sin(tz) * y;
        y = Math.sin(tz) * x + Math.cos(tz) * y;
        x = nx;
        return [x, y, z];
      };
      for (let k = 0; k < seg; k++) {
        positions.push(...pt(k), ...pt(k + 1));
        colors.push(...col, ...col);
      }
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(positions, 3));
    g.setAttribute("color", new Float32BufferAttribute(colors, 3));
    return g;
  }, [guides, guideCount]);
  const lineMat = useMemo(
    () => new LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.09, blending: AdditiveBlending, depthWrite: false }),
    [],
  );

  useEffect(() => () => dustGeo.dispose(), [dustGeo]);
  useEffect(() => () => dustMat.dispose(), [dustMat]);
  useEffect(() => () => lineGeo.dispose(), [lineGeo]);
  useEffect(() => () => lineMat.dispose(), [lineMat]);

  useFrame(() => {
    if (group.current) group.current.scale.setScalar(shared.uRing.value);
  });

  return (
    <>
      <points geometry={dustGeo} material={dustMat} frustumCulled={false} renderOrder={1} />
      <group ref={group}>
        <lineSegments geometry={lineGeo} material={lineMat} frustumCulled={false} renderOrder={0} />
      </group>
    </>
  );
}
