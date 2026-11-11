import { Vector2, type IUniform } from "three";

/** Mutable, non-reactive state shared between DOM listeners and the render loop (never triggers React renders). */
export const sceneState = {
  mouse: { x: 0, y: 0 }, // normalised -1..1 relative to the hero
  scroll: 0, // 0..1 hero scroll progress (target)
  active: false, // true once a fine pointer has moved over the hero
};

export type SharedUniforms = {
  uTime: IUniform<number>;
  uMouse: IUniform<Vector2>;
  uRing: IUniform<number>;
  uPointScale: IUniform<number>;
};

export function createSharedUniforms(): SharedUniforms {
  return {
    uTime: { value: 0 },
    uMouse: { value: new Vector2(99, 99) },
    uRing: { value: 1 },
    uPointScale: { value: 800 },
  };
}
