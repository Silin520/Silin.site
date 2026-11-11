import { NoColorSpace, ShaderMaterial, Vector2, type IUniform, type Texture } from "three";

export const phantomVertex = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * Digital Phantom fragment shader.
 * Pipeline: slice glitch + pixel blocks → per-channel luminance (RGB split) → rotated halftone dots →
 * neon rim light from luminance gradient → film grain / speckle / scanlines → silhouette mask with
 * dithered edges + bottom data-fragment dissolve. Dark background pixels are discarded so the portrait
 * writes real depth and the butterflies can pass in front of / behind it.
 */
export const phantomFragment = /* glsl */ `
precision highp float;
uniform sampler2D uTex;
uniform float uTime;
uniform float uAspect;
uniform float uDensity;
uniform float uMotion;
uniform float uScroll;
uniform vec2 uMouseUv;
varying vec2 vUv;

float h11(float p){ p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float lum(vec2 uv){ return dot(texture2D(uTex, clamp(uv, 0.0, 1.0)).rgb, vec3(0.299, 0.587, 0.114)); }

void main(){
  float T = uTime;
  float M = uMotion;
  vec2 uv = vUv;

  // intermittent glitch bursts, amplified by scroll progress
  float burst = smoothstep(0.62, 0.97, sin(T * 1.1) * sin(T * 0.43 + 1.7) * 0.5 + 0.5);
  burst = max(burst, step(0.982, h11(floor(T * 7.0))));
  burst = clamp(burst * M + uScroll * 0.7, 0.0, 1.0);

  // local disturbance around the pointer
  float md = distance(vUv * vec2(uAspect, 1.0), uMouseUv * vec2(uAspect, 1.0));
  float near = exp(-md * md * 14.0);

  // horizontal data slices
  float rowA = floor(uv.y * 42.0);
  float rA = h21(vec2(rowA, floor(T * 9.0)));
  float gateA = step(0.90 - burst * 0.12 - near * 0.18, rA);
  float rowB = floor(uv.y * 7.0);
  float rB = h21(vec2(rowB + 11.0, floor(T * 2.0)));
  float gateB = step(0.86 - burst * 0.1, rB);
  float shift = gateA * (rA - 0.5) * 0.22 * (0.3 + burst) + gateB * (rB - 0.5) * 0.35 * burst;
  shift += sin(uv.y * 60.0 + T * 3.0) * 0.0015 * M;
  uv.x += shift;

  // pixelated fragments
  float bh = h21(floor(uv * vec2(18.0, 32.0)) + floor(T * 3.0));
  float pix = step(0.975 - burst * 0.04, bh);
  vec2 pg = vec2(34.0, 60.0);
  uv = mix(uv, (floor(uv * pg) + 0.5) / pg, pix);

  // RGB split sampling
  float split = (0.0035 + 0.014 * burst + gateA * 0.01 + near * 0.012) * (0.4 + 0.6 * M);
  vec3 L = vec3(lum(uv + vec2(split, 0.0)), lum(uv), lum(uv - vec2(split, 0.0)));
  float breath = 0.5 + 0.5 * sin(T * 1.3 * M);
  L = clamp((L - 0.05) * 1.6, 0.0, 1.25);
  L = pow(L, vec3(0.88));
  L *= 0.9 + 0.12 * breath;

  // halftone dots (45° screen)
  vec2 p = vec2(vUv.x * uAspect, vUv.y) * uDensity;
  p = mat2(0.7071, -0.7071, 0.7071, 0.7071) * p;
  float d = length(fract(p) - 0.5);
  vec3 rad = sqrt(clamp(L, 0.0, 1.0)) * 0.68;
  vec3 dots = (1.0 - smoothstep(rad - 0.09, rad + 0.09, vec3(d))) * smoothstep(0.02, 0.14, rad);
  vec3 solid = smoothstep(0.78, 1.05, L);
  vec3 col = max(dots, solid * 0.9) * vec3(0.9, 0.93, 0.98);

  // neon rim light from luminance gradient
  vec2 e = vec2(0.006, 0.006);
  float gx = lum(uv + vec2(e.x, 0.0)) - lum(uv - vec2(e.x, 0.0));
  float gy = lum(uv + vec2(0.0, e.y)) - lum(uv - vec2(0.0, e.y));
  float edge = smoothstep(0.07, 0.4, length(vec2(gx, gy)));
  vec3 rimCol = mix(vec3(1.0, 0.22, 0.66), vec3(0.0, 0.94, 1.0), smoothstep(-0.2, 0.2, gx));
  rimCol = mix(rimCol, vec3(0.55, 0.36, 1.0), smoothstep(0.35, 0.9, vUv.y) * 0.55 * (0.5 + 0.5 * sin(T * 0.5)));
  col += rimCol * edge * (0.5 + 0.25 * breath);

  // grain, speckle, scanlines
  float g = h21(gl_FragCoord.xy + fract(T) * 100.0);
  col += (g - 0.5) * 0.22 * (0.3 + L.g);
  col += step(0.9992, h21(gl_FragCoord.xy * 0.5 + floor(T * 12.0)));
  col *= 0.9 + 0.1 * sin(gl_FragCoord.y * 1.6);

  // silhouette mask: photo luminance, plus a narrow shoulder support under the neck so the
  // portrait does not float. No procedural head ellipse behind the face.
  float bl = (lum(uv) + lum(uv + vec2(0.012, 0.0)) + lum(uv - vec2(0.012, 0.0)) + lum(uv + vec2(0.0, 0.012)) + lum(uv - vec2(0.0, 0.012))) / 5.0;
  float m = smoothstep(0.012, 0.05, bl);
  float sh = 1.0 - smoothstep(0.9, 1.0, length((uv - vec2(0.5, 0.10)) / vec2(0.42, 0.22)));
  m = max(m, sh);
  m *= smoothstep(0.0, 0.02, vUv.x) * smoothstep(1.0, 0.98, vUv.x) * smoothstep(1.0, 0.97, vUv.y);

  // bottom dissolves into data fragments
  float dis = smoothstep(0.0, 0.3, vUv.y) - uScroll * 0.3;
  float blk = h21(floor(vUv * vec2(46.0, 66.0)) + floor(T * 1.5) * 0.37);
  if (blk > dis * 1.25 + 0.02) discard;
  if (m + (h21(gl_FragCoord.xy) - 0.5) * 0.25 < 0.5) discard;

  vec3 outc = vec3(0.012, 0.016, 0.03) + col;
  outc *= 1.0 - uScroll * 0.25;
  gl_FragColor = vec4(outc, 1.0);
}
`;

export type PhantomUniforms = {
  uTex: IUniform<Texture | null>;
  uTime: IUniform<number>;
  uAspect: IUniform<number>;
  uDensity: IUniform<number>;
  uMotion: IUniform<number>;
  uScroll: IUniform<number>;
  uMouseUv: IUniform<Vector2>;
};

export function createPhantomUniforms(density: number, motion: number): PhantomUniforms {
  return {
    uTex: { value: null },
    uTime: { value: 0 },
    uAspect: { value: 0.5625 },
    uDensity: { value: density },
    uMotion: { value: motion },
    uScroll: { value: 0 },
    uMouseUv: { value: new Vector2(-9, -9) },
  };
}

export function createPhantomMaterial(uniforms: PhantomUniforms) {
  return new ShaderMaterial({ uniforms: uniforms as unknown as Record<string, IUniform>, vertexShader: phantomVertex, fragmentShader: phantomFragment });
}

export { NoColorSpace };
