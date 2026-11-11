"use client";

import { useMemo } from "react";
import { Vector2 } from "three";
import { Bloom, ChromaticAberration, EffectComposer } from "@react-three/postprocessing";

type Props = { intensity: number; aberration: boolean };

/** Restrained bloom (high threshold → only neon wings / rim light / speckles glow) + faint chromatic aberration. */
export function PostProcessing({ intensity, aberration }: Props) {
  const offset = useMemo(() => new Vector2(0.0007, 0.0009), []);
  if (aberration) {
    return (
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom intensity={intensity} luminanceThreshold={0.8} luminanceSmoothing={0.3} mipmapBlur radius={0.7} />
        <ChromaticAberration offset={offset} radialModulation={false} modulationOffset={0} />
      </EffectComposer>
    );
  }
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom intensity={intensity} luminanceThreshold={0.8} luminanceSmoothing={0.3} mipmapBlur radius={0.7} />
    </EffectComposer>
  );
}
