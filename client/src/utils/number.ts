export interface ClampOpts {
  min: number;
  max: number;
}

export function clamp(value: unknown, { min, max }: ClampOpts): number {
  const raw = Number(value);
  const next = Number.isFinite(raw) ? raw : min;
  return Math.min(max, Math.max(min, next));
}

export function range(min: number, max: number, step: number): number[] {
  const values: number[] = [];
  for (let n = min; n <= max; n += step) {
    values.push(n);
  }
  return values;
}
