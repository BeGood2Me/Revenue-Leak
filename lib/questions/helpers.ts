import type { CategoryWeight } from "../types";

/** Clamp value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Linear interpolation: map value from [inMin,inMax] to [outMin,outMax] */
export function lerp(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  if (inMax === inMin) return outMin;
  const t = (value - inMin) / (inMax - inMin);
  return outMin + t * (outMax - outMin);
}

/** Higher value = worse (more leak). E.g. churn rate, missed call rate */
export function higherIsWorse(
  value: number,
  goodThreshold: number,
  badThreshold: number
): number {
  return clamp(lerp(value, goodThreshold, badThreshold, 0, 100), 0, 100);
}

/** Lower value = worse. E.g. conversion rate, booking rate */
export function lowerIsWorse(
  value: number,
  goodThreshold: number,
  badThreshold: number
): number {
  return clamp(lerp(value, badThreshold, goodThreshold, 100, 0), 0, 100);
}

export function cw(
  category: CategoryWeight["category"],
  weight: number
): CategoryWeight {
  return { category, weight };
}
