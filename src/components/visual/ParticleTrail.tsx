"use client";

import { useEffect, useMemo } from "react";
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, ShaderMaterial } from "three";
import { orbitVertexCommon, paletteGLSL } from "./orbitGLSL";
import type { OrbitData } from "./Butterfly";
import type { SharedUniforms } from "./sceneState";

const vertex = /* glsl */ `
${orbitVertexCommon}
${paletteGLSL}
attribute float aLag;
uniform float uPointScale;
uniform float uSteps;
varying vec3 vCol;
varying float vA;

void main(){
  #ifdef TRAIL
    float lag = aLag * 0.085;
    vec3 p = orbitAt(uTime - lag);
    p += 0.03 * aLag * vec3(sin(uTime * 3.0 + aLag * 5.0 + aMisc.y * 20.0), cos(uTime * 2.7 + aLag * 4.0), sin(aLag * 3.0 + aMisc.y * 9.0));
    float f = 1.0 - aLag / uSteps;
    vA = f * f * 0.9;
    float size = aMisc.x * 0.2 * (0.35 + 0.65 * f);
  #else
    vec3 p = orbitAt(uTime);
    float tw = 0.5 + 0.5 * sin(uTime * aMisc.z + aMisc.w);
    vA = 0.25 + 0.75 * tw;
    float size = aMisc.x;
  #endif
  p = avoidMouse(p);
  vec4 mv = viewMatrix * modelMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = max(1.0, size * uPointScale / -mv.z);
  vCol = palette(aMisc.y, fract(aMisc.y * 7.0 + aLag * 0.05));
}
`;

const fragment = /* glsl */ `
precision highp float;
varying vec3 vCol;
varying float vA;
void main(){
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float a = pow(max(0.0, 1.0 - d), 2.0);
  gl_FragColor = vec4(vCol * 1.6, a * vA);
}
`;

export function createOrbitPointsMaterial(shared: SharedUniforms, trail: boolean, steps: number) {
  return new ShaderMaterial({
    uniforms: {
      uTime: shared.uTime,
      uMouse: shared.uMouse,
      uRing: shared.uRing,
      uPointScale: shared.uPointScale,
      uSteps: { value: Math.max(1, steps) },
    },
    defines: trail ? { TRAIL: 1 } : {},
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
}

export function createOrbitPointsGeometry(data: OrbitData, replicate: number) {
  const n = data.count * replicate;
  const orbit = new Float32Array(n * 4);
  const tilt = new Float32Array(n * 4);
  const misc = new Float32Array(n * 4);
  const lag = new Float32Array(n);
  for (let i = 0; i < data.count; i++) {
    for (let k = 0; k < replicate; k++) {
      const o = (i * replicate + k) * 4;
      orbit.set(data.orbit.subarray(i * 4, i * 4 + 4), o);
      tilt.set(data.tilt.subarray(i * 4, i * 4 + 4), o);
      misc.set(data.misc.subarray(i * 4, i * 4 + 4), o);
      lag[i * replicate + k] = replicate > 1 ? k + 1 : 0;
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(new Float32Array(n * 3), 3));
  g.setAttribute("aOrbit", new Float32BufferAttribute(orbit, 4));
  g.setAttribute("aTilt", new Float32BufferAttribute(tilt, 4));
  g.setAttribute("aMisc", new Float32BufferAttribute(misc, 4));
  g.setAttribute("aLag", new Float32BufferAttribute(lag, 1));
  return g;
}

type Props = { data: OrbitData; steps: number; shared: SharedUniforms };

/** Glowing particle wake behind every butterfly — each trail particle samples the same orbit at an earlier time. */
export function ParticleTrail({ data, steps, shared }: Props) {
  const geometry = useMemo(() => createOrbitPointsGeometry(data, steps), [data, steps]);
  const material = useMemo(() => createOrbitPointsMaterial(shared, true, steps), [shared, steps]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);
  return <points geometry={geometry} material={material} frustumCulled={false} renderOrder={2} />;
}
