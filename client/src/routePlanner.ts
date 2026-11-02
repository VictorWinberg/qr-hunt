import { now, parse } from "@/plugins/dayjs";
import { MAX_COLLECT_DISTANCE } from "@/constants";
import { calculateWalkingTime, distance } from "@/geo";

const DEFAULT_MAX_ALTERNATIVES = 5;

export interface Coords {
  lat: number;
  lng: number;
}

export interface RouteSpot extends Coords {
  id?: number | string;
  title?: string;
  missing?: boolean;
  collectedAt?: string | null;
  [key: string]: unknown;
}

export interface RoutePlan {
  start: Coords;
  end: Coords;
  stops: RouteSpot[];
  totalMeters: number;
  totalMinutes: number;
  requestedK?: number;
  actualK: number;
}

function isCollectedToday(collectedAt?: string | null): boolean {
  if (!collectedAt) return false;
  return now().isSame(parse(collectedAt), "day");
}

function toCoords(spot: RouteSpot): Coords {
  return { lat: Number(spot.lat), lng: Number(spot.lng) };
}

function spotKey(spot: RouteSpot): string {
  return spot.id != null
    ? String(spot.id)
    : `${Number(spot.lat)},${Number(spot.lng)}`;
}

function planKey(plan: RoutePlan): string {
  return plan.stops.map(spotKey).join(">");
}

export function filterRouteCandidates(
  spots: RouteSpot[],
  start: Coords,
  maxRadiusMeters: number = MAX_COLLECT_DISTANCE
): RouteSpot[] {
  return spots.filter(spot => {
    if (spot.missing) return false;
    if (isCollectedToday(spot.collectedAt)) return false;
    const lat = Number(spot.lat);
    const lng = Number(spot.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return false;
    return distance(start, { lat, lng }) <= maxRadiusMeters;
  });
}

export function totalMeters(
  start: Coords,
  orderedStops: RouteSpot[],
  end: Coords = start
): number {
  if (orderedStops.length === 0) return distance(start, end);
  let meters = 0;
  let prev: Coords = start;
  for (const stop of orderedStops) {
    const next = toCoords(stop);
    meters += distance(prev, next);
    prev = next;
  }
  meters += distance(prev, end);
  return meters;
}

function nearestNeighborStops(
  pool: RouteSpot[],
  start: Coords,
  k: number,
  forcedFirst?: RouteSpot
): RouteSpot[] {
  const remaining = [...pool];
  const stops: RouteSpot[] = [];
  let current: Coords = start;

  if (forcedFirst) {
    const idx = remaining.findIndex(s => spotKey(s) === spotKey(forcedFirst));
    if (idx >= 0) {
      const [next] = remaining.splice(idx, 1);
      stops.push(next);
      current = toCoords(next);
    }
  }

  while (stops.length < k && remaining.length > 0) {
    let bestIndex = 0;
    let bestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const d = distance(current, toCoords(remaining[i]));
      if (d < bestDist) {
        bestDist = d;
        bestIndex = i;
      }
    }
    const [next] = remaining.splice(bestIndex, 1);
    stops.push(next);
    current = toCoords(next);
  }

  return stops;
}

function twoOptImprove(
  start: Coords,
  stops: RouteSpot[],
  end: Coords
): RouteSpot[] {
  if (stops.length < 3) return stops;

  const route = [...stops];
  let improved = true;

  while (improved) {
    improved = false;
    for (let i = 0; i < route.length - 1; i++) {
      for (let j = i + 1; j < route.length; j++) {
        const a = i === 0 ? start : toCoords(route[i - 1]);
        const b = toCoords(route[i]);
        const c = toCoords(route[j]);
        const d = j === route.length - 1 ? end : toCoords(route[j + 1]);

        const before = distance(a, b) + distance(c, d);
        const after = distance(a, c) + distance(b, d);
        if (after + 1e-6 < before) {
          const reversed = route.slice(i, j + 1).reverse();
          route.splice(i, j - i + 1, ...reversed);
          improved = true;
        }
      }
    }
  }

  return route;
}

function finalizePlan(
  start: Coords,
  end: Coords,
  rawStops: RouteSpot[],
  requestedK?: number
): RoutePlan | null {
  if (rawStops.length === 0) return null;
  const stops = twoOptImprove(start, rawStops, end);
  const meters = totalMeters(start, stops, end);
  return {
    start: { ...start },
    end: { ...end },
    stops,
    totalMeters: meters,
    totalMinutes: calculateWalkingTime(meters),
    requestedK,
    actualK: stops.length
  };
}

function buildPlan(
  pool: RouteSpot[],
  start: Coords,
  end: Coords,
  k: number,
  requestedK?: number,
  forcedFirst?: RouteSpot
): RoutePlan | null {
  if (k < 1 || pool.length === 0) return null;
  const actualK = Math.min(k, pool.length);
  const nnStops = nearestNeighborStops(pool, start, actualK, forcedFirst);
  return finalizePlan(start, end, nnStops, requestedK);
}

function sortedByDistanceFrom(origin: Coords, spots: RouteSpot[]): RouteSpot[] {
  return [...spots].sort(
    (a, b) => distance(origin, toCoords(a)) - distance(origin, toCoords(b))
  );
}

function collectAlternatives(
  pool: RouteSpot[],
  start: Coords,
  end: Coords,
  k: number,
  requestedK: number | undefined,
  maxAlternatives: number,
  minutesBudget?: number
): RoutePlan[] {
  const actualK = Math.min(k, pool.length);
  if (actualK < 1) return [];

  const candidates: RoutePlan[] = [];
  const push = (plan: RoutePlan | null) => {
    if (!plan) return;
    if (minutesBudget != null && plan.totalMinutes > minutesBudget) return;
    candidates.push(plan);
  };

  // Default nearest-neighbor tour
  push(buildPlan(pool, start, end, actualK, requestedK));

  // Seed first stop with each nearby spot (different paths / often different sets)
  const nearStart = sortedByDistanceFrom(start, pool).slice(0, 12);
  for (const seed of nearStart) {
    push(buildPlan(pool, start, end, actualK, requestedK, seed));
  }

  // When pool is larger than K, drop one spot from the default set and replan
  // to surface different subsets that still hit K stops.
  const baseline = buildPlan(pool, start, end, actualK, requestedK);
  if (baseline && pool.length > actualK) {
    for (const exclude of baseline.stops) {
      const reduced = pool.filter(s => spotKey(s) !== spotKey(exclude));
      push(buildPlan(reduced, start, end, actualK, requestedK));
    }
  }

  // Prefer shorter routes; keep distinct stop sequences
  const seen = new Set<string>();
  return candidates
    .sort((a, b) => a.totalMeters - b.totalMeters)
    .filter(plan => {
      const key = planKey(plan);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, maxAlternatives);
}

export function planRouteAlternativesByCount(
  spots: RouteSpot[],
  start: Coords,
  k: number,
  end: Coords = start,
  maxRadiusMeters: number = MAX_COLLECT_DISTANCE,
  maxAlternatives: number = DEFAULT_MAX_ALTERNATIVES
): RoutePlan[] {
  const pool = filterRouteCandidates(spots, start, maxRadiusMeters);
  if (pool.length === 0 || k < 1) return [];
  return collectAlternatives(pool, start, end, k, k, maxAlternatives);
}

export function planRouteAlternativesByTime(
  spots: RouteSpot[],
  start: Coords,
  minutesBudget: number,
  end: Coords = start,
  maxRadiusMeters: number = MAX_COLLECT_DISTANCE,
  maxAlternatives: number = DEFAULT_MAX_ALTERNATIVES
): RoutePlan[] {
  const pool = filterRouteCandidates(spots, start, maxRadiusMeters);
  if (pool.length === 0 || minutesBudget < 1) return [];

  let bestK = 0;
  for (let k = 1; k <= pool.length; k++) {
    const plan = buildPlan(pool, start, end, k);
    if (!plan || plan.totalMinutes > minutesBudget) break;
    bestK = k;
  }
  if (bestK < 1) return [];

  return collectAlternatives(
    pool,
    start,
    end,
    bestK,
    undefined,
    maxAlternatives,
    minutesBudget
  );
}

export function planRouteByCount(
  spots: RouteSpot[],
  start: Coords,
  k: number,
  end: Coords = start,
  maxRadiusMeters: number = MAX_COLLECT_DISTANCE
): RoutePlan | null {
  return (
    planRouteAlternativesByCount(spots, start, k, end, maxRadiusMeters, 1)[0] ||
    null
  );
}

export function planRouteByTime(
  spots: RouteSpot[],
  start: Coords,
  minutesBudget: number,
  end: Coords = start,
  maxRadiusMeters: number = MAX_COLLECT_DISTANCE
): RoutePlan | null {
  return (
    planRouteAlternativesByTime(
      spots,
      start,
      minutesBudget,
      end,
      maxRadiusMeters,
      1
    )[0] || null
  );
}
