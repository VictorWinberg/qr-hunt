/**
 * Diversify a primary route into distinct alternatives:
 * seeded / swapped / dropped variants, sorted shortest first.
 */
import { MAX_COLLECT_DISTANCE } from "@/constants";
import { distance, Coords } from "@/utils/geo";
import {
  finalizeRoutePlan,
  planRoute,
  resolveKForTimeBudget
} from "./planRoute";
import { planKey, spotKey } from "./routeMath";
import {
  buildStopsByInsertion,
  insertionSearchPoolSize,
  sortedByCorridor
} from "./selectStops";
import { isCollectedToday } from "./spotCollection";
import { RoutePlan, RouteSpot } from "./types";

const DEFAULT_MAX_ALTERNATIVES = 5;

function filterRouteCandidates(
  spots: RouteSpot[],
  start: Coords,
  maxRadiusMeters: number = MAX_COLLECT_DISTANCE,
  end?: Coords
): RouteSpot[] {
  const directLeg = end ? distance(start, end) : 0;

  return spots.filter(spot => {
    if (spot.missing) return false;
    if (isCollectedToday(spot.collectedAt)) return false;
    const lat = Number(spot.lat);
    const lng = Number(spot.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return false;
    const coords = { lat, lng };
    const nearStart = distance(start, coords) <= maxRadiusMeters;
    if (!end) return nearStart;
    const nearEnd = distance(end, coords) <= maxRadiusMeters;
    if (nearStart || nearEnd) return true;
    const via = distance(start, coords) + distance(coords, end);
    const detour = via - directLeg;
    return detour <= maxRadiusMeters;
  });
}

function planWithSwappedStop(
  base: RoutePlan,
  swapIndex: number,
  replacement: RouteSpot,
  start: Coords,
  end: Coords,
  stopTarget: number
): RoutePlan | null {
  if (swapIndex >= base.stops.length) return null;
  const nextSet = base.stops.map((s, j) => (j === swapIndex ? replacement : s));
  const stops = buildStopsByInsertion(nextSet, start, end, nextSet.length);
  return finalizeRoutePlan(start, end, stops, stopTarget);
}

function tryAddAlternative(
  plan: RoutePlan | null,
  out: RoutePlan[],
  seen: Set<string>,
  maxAlternatives: number,
  minutesBudget?: number
): void {
  if (!plan || out.length >= maxAlternatives) return;
  if (minutesBudget != null && plan.totalMinutes > minutesBudget) return;
  const key = planKey(plan);
  if (seen.has(key)) return;
  seen.add(key);
  out.push(plan);
}

function collectAlternatives(
  pool: RouteSpot[],
  start: Coords,
  end: Coords,
  k: number,
  stopTarget: number,
  maxAlternatives: number,
  minutesBudget?: number
): RoutePlan[] {
  const pickCount = Math.min(k, pool.length);
  if (pickCount < 1) return [];

  const corridor = sortedByCorridor(start, end, pool);
  const primary = planRoute({
    pool,
    start,
    end,
    stopCount: pickCount,
    stopTarget
  });
  if (!primary) return [];

  const seen = new Set<string>();
  const out: RoutePlan[] = [];

  const consider = (plan: RoutePlan | null) => {
    tryAddAlternative(plan, out, seen, maxAlternatives, minutesBudget);
  };

  consider(primary);

  const seedCap = insertionSearchPoolSize(pickCount, corridor.length);
  for (let i = 0; i < seedCap && out.length < maxAlternatives; i++) {
    consider(
      planRoute({
        pool,
        start,
        end,
        stopCount: pickCount,
        stopTarget,
        seedFirst: corridor[i]
      })
    );
  }

  const used = new Set(primary.stops.map(spotKey));
  const unused = corridor.filter(s => !used.has(spotKey(s)));
  const swapCap = insertionSearchPoolSize(pickCount, unused.length);

  for (
    let swapIndex = 0;
    swapIndex < primary.stops.length && out.length < maxAlternatives;
    swapIndex++
  ) {
    for (let u = 0; u < swapCap && out.length < maxAlternatives; u++) {
      consider(
        planWithSwappedStop(
          primary,
          swapIndex,
          unused[u],
          start,
          end,
          stopTarget
        )
      );
    }
  }

  for (
    let i = 0;
    i < primary.stops.length && out.length < maxAlternatives;
    i++
  ) {
    const dropKey = spotKey(primary.stops[i]);
    const reduced = pool.filter(s => spotKey(s) !== dropKey);
    if (reduced.length >= pickCount) {
      consider(
        planRoute({
          pool: reduced,
          start,
          end,
          stopCount: pickCount,
          stopTarget
        })
      );
    }
  }

  for (let u = 0; u < swapCap && out.length < maxAlternatives; u++) {
    consider(
      planRoute({
        pool,
        start,
        end,
        stopCount: pickCount,
        stopTarget,
        seedFirst: unused[u]
      })
    );
  }

  return out.sort((a, b) => a.totalMeters - b.totalMeters);
}

export function planRouteAlternativesByCount(
  spots: RouteSpot[],
  start: Coords,
  k: number,
  end: Coords = start,
  maxRadiusMeters: number = MAX_COLLECT_DISTANCE,
  maxAlternatives: number = DEFAULT_MAX_ALTERNATIVES
): RoutePlan[] {
  const pool = filterRouteCandidates(spots, start, maxRadiusMeters, end);
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
  const pool = filterRouteCandidates(spots, start, maxRadiusMeters, end);
  if (pool.length === 0 || minutesBudget < 1) return [];

  const bestK = resolveKForTimeBudget(pool, start, end, minutesBudget);
  if (bestK < 1) return [];

  return collectAlternatives(
    pool,
    start,
    end,
    bestK,
    bestK,
    maxAlternatives,
    minutesBudget
  );
}
