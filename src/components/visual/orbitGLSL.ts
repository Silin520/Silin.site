/**
 * Shared GLSL: every butterfly / trail / dust particle follows a parametric 3D orbit evaluated on the GPU.
 *   aOrbit = (R, Rz, yAmp, yOffset)   ellipse radii (x / depth), vertical wave, vertical centre
 *   aTilt  = (tiltX, tiltZ, speed, phase)
 *   aMisc  = (scale|size, colourSeed, flapFreq|twinkleFreq, flapPhase|twinklePhase)
 * Depth (Rz * sin θ) gives true front/back passes around the portrait at z = 0.
 */
export const orbitVertexCommon = /* glsl */ `
attribute vec4 aOrbit;
attribute vec4 aTilt;
attribute vec4 aMisc;
uniform float uTime;
uniform vec2 uMouse;
uniform float uRing;

vec3 rotX(vec3 p, float a){ float c = cos(a), s = sin(a); return vec3(p.x, c*p.y - s*p.z, s*p.y + c*p.z); }
vec3 rotZ(vec3 p, float a){ float c = cos(a), s = sin(a); return vec3(c*p.x - s*p.y, s*p.x + c*p.y, p.z); }

vec3 orbitAt(float t){
  float th = aTilt.w + aTilt.z * t;
  float seed = aMisc.y;
  float R = aOrbit.x * (1.0 + 0.07 * sin(th * 3.0 + seed * 9.0));
  vec3 p = vec3(
    R * cos(th),
    aOrbit.w + aOrbit.z * sin(th * 2.0 + seed * 6.2831) + 0.18 * sin(t * 0.7 + seed * 10.0),
    aOrbit.y * sin(th) + 0.25 * sin(t * 0.5 + seed * 7.0)
  );
  p = rotX(p, aTilt.x);
  p = rotZ(p, aTilt.y);
  return p * uRing;
}

vec3 avoidMouse(vec3 p){
  vec2 d = p.xy - uMouse;
  float dist = length(d);
  float k = smoothstep(2.6, 0.0, dist);
  p.xy += d / (dist + 0.001) * k * k * 1.2;
  p.z += k * 0.9;
  return p;
}
`;

export const paletteGLSL = /* glsl */ `
vec3 palette(float seed, float t){
  vec3 cy = vec3(0.0, 0.94, 1.0);
  vec3 vi = vec3(0.55, 0.36, 1.0);
  vec3 mg = vec3(1.0, 0.22, 0.66);
  vec3 lm = vec3(0.72, 1.0, 0.23);
  vec3 a; vec3 b;
  if (seed < 0.30) { a = cy; b = vi; }
  else if (seed < 0.55) { a = vi; b = mg; }
  else if (seed < 0.80) { a = cy; b = lm; }
  else { a = mg; b = cy; }
  return mix(a, b, smoothstep(0.05, 0.95, t));
}
`;
