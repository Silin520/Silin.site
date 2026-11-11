import {
  AdditiveBlending,
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  ShaderMaterial,
} from "three";
import { orbitVertexCommon, paletteGLSL } from "./orbitGLSL";
import type { SharedUniforms } from "./sceneState";

/* ---------------------------------------------------------------- orbit parameter generation */

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type OrbitData = { count: number; orbit: Float32Array; tilt: Float32Array; misc: Float32Array };

const range = (r: () => number, a: number, b: number) => a + (b - a) * r();

export function generateButterflyOrbits(count: number, seed = 11): OrbitData {
  const r = mulberry32(seed);
  const orbit = new Float32Array(count * 4);
  const tilt = new Float32Array(count * 4);
  const misc = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    const k = r();
    let R: number, Rz: number, tx: number, tz: number, yOff: number;
    if (k < 0.55) {
      // halo ring: front + back passes
      R = range(r, 2.6, 4.4); Rz = range(r, 1.8, 3.6);
      tx = range(r, -0.45, 0.45); tz = range(r, -0.5, 0.5); yOff = range(r, -0.6, 0.9);
    } else if (k < 0.8) {
      // steep ring: over the head and under the shoulders
      R = range(r, 2.2, 3.4); Rz = range(r, 1.6, 3.0);
      tx = (r() < 0.5 ? -1 : 1) * range(r, 0.95, 1.3); tz = range(r, -0.9, 0.9); yOff = range(r, -0.2, 0.7);
    } else {
      // wide outer ring
      R = range(r, 4.2, 4.8); Rz = range(r, 2.4, 3.8);
      tx = range(r, -0.3, 0.3); tz = range(r, -0.25, 0.25); yOff = range(r, -0.3, 0.6);
    }
    orbit.set([R, Rz, range(r, 0.2, 0.7), yOff], i * 4);
    tilt.set([tx, tz, range(r, 0.14, 0.42) * (r() < 0.2 ? -1 : 1), range(r, 0, Math.PI * 2)], i * 4);
    misc.set([range(r, 0.24, 0.5), r(), range(r, 7, 12.5), range(r, 0, Math.PI * 2)], i * 4);
  }
  return { count, orbit, tilt, misc };
}

export function generateDustOrbits(count: number, seed = 91): OrbitData {
  const r = mulberry32(seed);
  const orbit = new Float32Array(count * 4);
  const tilt = new Float32Array(count * 4);
  const misc = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    orbit.set([range(r, 1.8, 5.4), range(r, 1.2, 4.0), range(r, 0.1, 0.8), range(r, -1.2, 1.4)], i * 4);
    tilt.set([range(r, -1.3, 1.3), range(r, -0.8, 0.8), range(r, 0.05, 0.35) * (r() < 0.3 ? -1 : 1), range(r, 0, Math.PI * 2)], i * 4);
    misc.set([range(r, 0.025, 0.085), r(), range(r, 1, 4), range(r, 0, Math.PI * 2)], i * 4);
  }
  return { count, orbit, tilt, misc };
}

/* ---------------------------------------------------------------- procedural geometry */

/**
 * Local space: +Z = body forward, ±X = wings, +Y = wing normal (faces the camera in the swarm shader).
 * aInfo = (radial 0..1, angular 0..1, kind)  kind: 0 fore wing, 1 hind wing, 2 body, 3 antenna
 */
export function createButterflyGeometry(): BufferGeometry {
  const pos: number[] = [];
  const info: number[] = [];
  const idx: number[] = [];

  const foreRho = (u: number) => 0.45 + 0.6 * Math.pow(Math.sin(Math.PI * u), 0.6) + 0.22 * Math.exp(-Math.pow((u - 0.28) / 0.1, 2));
  const hindRho = (u: number) => 0.3 + 0.5 * Math.pow(Math.sin(Math.PI * u), 0.7) + 0.1 * Math.sin(u * Math.PI * 6) * Math.sin(Math.PI * u);

  const R = 7;
  const S = 16;
  for (const lobe of [0, 1] as const) {
    const ax = 0.04;
    const az = lobe === 0 ? 0.12 : -0.02;
    for (const side of [1, -1]) {
      const start = pos.length / 3;
      for (let i = 0; i <= R; i++) {
        const t = i / R;
        for (let j = 0; j <= S; j++) {
          const u = j / S;
          const phi = lobe === 0 ? -0.12 + (1.75 + 0.12) * u : -1.75 + (0.1 + 1.75) * u;
          const rho = lobe === 0 ? foreRho(u) : hindRho(u);
          const x = ax + t * rho * Math.cos(phi);
          const z = az + t * rho * Math.sin(phi);
          pos.push(side * x, 0.04 * t * Math.sin(u * Math.PI), z);
          info.push(t, u, lobe);
        }
      }
      for (let i = 0; i < R; i++) {
        for (let j = 0; j < S; j++) {
          const a = start + i * (S + 1) + j;
          const b = a + 1;
          const c = a + S + 1;
          const d = c + 1;
          idx.push(a, c, b, b, c, d);
        }
      }
    }
  }

  // body spindle
  {
    const N = 10;
    const start = pos.length / 3;
    for (let i = 0; i <= N; i++) {
      const s = i / N;
      const z = -0.5 + s * 1.05;
      const w = 0.05 * Math.pow(Math.sin(Math.PI * s), 0.6) + 0.008;
      pos.push(-w, 0.01, z, w, 0.01, z);
      info.push(0, 0, 2, 0, 0, 2);
    }
    for (let i = 0; i < N; i++) {
      const a = start + i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }

  // antennae
  for (const side of [1, -1]) {
    const N = 6;
    const start = pos.length / 3;
    for (let i = 0; i <= N; i++) {
      const s = i / N;
      const x = side * (0.02 + 0.3 * Math.pow(s, 1.6));
      const z = 0.5 + 0.55 * s;
      pos.push(x - 0.006, 0.01, z, x + 0.006, 0.01, z);
      info.push(0, 0, 3, 0, 0, 3);
    }
    for (let i = 0; i < N; i++) {
      const a = start + i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }

  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setAttribute("aInfo", new Float32BufferAttribute(info, 3));
  g.setIndex(idx);
  return g;
}

export function createInstancedButterflyGeometry(base: BufferGeometry, data: OrbitData) {
  const g = new InstancedBufferGeometry();
  g.index = base.index;
  g.setAttribute("position", base.getAttribute("position"));
  g.setAttribute("aInfo", base.getAttribute("aInfo"));
  g.setAttribute("aOrbit", new InstancedBufferAttribute(data.orbit, 4));
  g.setAttribute("aTilt", new InstancedBufferAttribute(data.tilt, 4));
  g.setAttribute("aMisc", new InstancedBufferAttribute(data.misc, 4));
  g.instanceCount = data.count;
  return g;
}

/* ---------------------------------------------------------------- material */

const vertex = /* glsl */ `
${orbitVertexCommon}
attribute vec3 aInfo;
varying vec3 vInfo;
varying float vSeed;

void main(){
  vec3 c = orbitAt(uTime);
  vec3 vel = orbitAt(uTime + 0.06) - c;
  vec3 vdir = normalize(vel + vec3(1e-5));
  vec2 f2 = normalize(vel.xy + vec2(1e-4, 0.0));
  vec3 F = vec3(f2, 0.0);
  vec3 Rr = vec3(-f2.y, f2.x, 0.0);
  vec3 N = vec3(0.0, 0.0, 1.0);

  vec3 lp = position * aMisc.x;
  float isWing = 1.0 - step(1.5, aInfo.z);
  float ph = uTime * aMisc.z + aMisc.w - aInfo.z * 0.45 * isWing;
  float fl = sin(ph) + 0.18 * sin(2.0 * ph + 1.3);
  float ang = (0.32 + 0.78 * fl) * isWing;
  float d = abs(lp.x);
  float sg = sign(lp.x);
  lp.y += d * sin(ang);
  lp.x = sg * d * cos(ang);

  lp = rotZ(lp, vdir.z * 0.9);
  lp = rotX(lp, -vdir.z * 0.6);

  vec3 world = c + Rr * lp.x + N * lp.y + F * lp.z;
  world = avoidMouse(world);
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(world, 1.0);
  vInfo = aInfo;
  vSeed = aMisc.y;
}
`;

const fragment = /* glsl */ `
precision highp float;
uniform float uTime;
varying vec3 vInfo;
varying float vSeed;
${paletteGLSL}
float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }

void main(){
  float t = vInfo.x;
  float u = vInfo.y;
  if (vInfo.z > 1.5) {
    vec3 c = mix(vec3(0.85, 1.0, 1.0), palette(vSeed, 0.5), 0.45);
    gl_FragColor = vec4(c * 1.4, vInfo.z > 2.5 ? 0.75 : 0.95);
    return;
  }
  float hind = step(0.5, vInfo.z);
  vec3 base = palette(vSeed, t * 0.9 + u * 0.25 * (1.0 - 2.0 * hind) + 0.1);
  float edge = smoothstep(0.80, 0.99, t) + 0.4 * smoothstep(0.94, 1.0, abs(u * 2.0 - 1.0));
  float rim = smoothstep(0.93, 1.0, t);
  float veins = pow(abs(sin(u * 3.14159 * 10.0 + t * 2.0)), 30.0) * smoothstep(0.08, 0.35, t) * (1.0 - clamp(edge, 0.0, 1.0) * 0.6);
  float cells = pow(abs(sin(t * 20.0)), 40.0) * 0.5 * smoothstep(0.2, 0.5, t) * (1.0 - clamp(edge, 0.0, 1.0));
  float sp = step(0.988, h21(floor(vec2(u * 36.0, t * 26.0)) + floor(uTime * 4.0 + vSeed * 17.0)));
  float glass = 0.05 + 0.07 * (1.0 - t);
  float a = glass + edge * 0.5 + rim * 0.35 + veins * 0.4 + cells * 0.14 + sp * 0.7;
  vec3 col = base * (0.6 + edge * 0.9 + veins * 0.7) + vec3(sp) * 0.8 + vec3(rim) * 0.25;
  gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
}
`;

export function createButterflyMaterial(shared: SharedUniforms) {
  return new ShaderMaterial({
    uniforms: { uTime: shared.uTime, uMouse: shared.uMouse, uRing: shared.uRing },
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    side: DoubleSide,
    blending: AdditiveBlending,
  });
}
