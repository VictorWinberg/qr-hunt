import { calculateWalkingTime, Coords } from "@/utils/geo";
import { totalMeters, twoOptImprove } from "./routeMath";
import { selectStopsForShortestPath } from "./selectStops";
import { RoutePlan, RoutePlanInput, RouteSpot } from "./types";

/** Optimize order once and attach length / walking-time metrics. */
export function finalizeRoutePlan(
  start: Coords,
  end: Coords,
  rawStops: RouteSpot[],
  stopTarget: number
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
    stopTarget,
    stopCount: stops.length
  };
}

/** Select stops from the pool, then finalize (single 2-opt pass). */
export function planRoute(input: RoutePlanInput): RoutePlan | null {
  const { pool, start, end, stopCount, stopTarget, seedFirst } = input;
  if (stopCount < 1 || pool.length === 0) return null;
  const pickCount = Math.min(stopCount, pool.length);
  const stops = selectStopsForShortestPath(
    pool,
    start,
    end,
    pickCount,
    seedFirst
  );
  return finalizeRoutePlan(start, end, stops, stopTarget);
}

/**
 * Largest stop count whose shortest plan still fits the walking-time budget.
 * Returns 0 when even a 1-stop plan exceeds the budget (or pool is empty).
 */
export function resolveKForTimeBudget(
  pool: RouteSpot[],
  start: Coords,
  end: Coords,
  minutesBudget: number
): number {
  if (pool.length === 0 || minutesBudget < 1) return 0;

  let bestK = 0;
  for (let k = 1; k <= pool.length; k++) {
    const plan = planRoute({
      pool,
      start,
      end,
      stopCount: k,
      stopTarget: k
    });
    if (!plan || plan.totalMinutes > minutesBudget) break;
    bestK = k;
  }
  return bestK;
}
