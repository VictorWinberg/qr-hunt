import { distance, Coords } from "@/utils/geo";
import { spotInList, spotKey, toCoords, totalMeters } from "./routeMath";
import { RouteSpot } from "./types";

/** Extra walk vs the straight start→end chord (meters). */
export function corridorDetour(
  start: Coords,
  end: Coords,
  spot: RouteSpot
): number {
  const coords = toCoords(spot);
  return distance(start, coords) + distance(coords, end) - distance(start, end);
}

/** Prefer spots that lie closer to the straight walk from start to end. */
export function sortedByCorridor(
  start: Coords,
  end: Coords,
  spots: RouteSpot[]
): RouteSpot[] {
  return [...spots].sort(
    (a, b) => corridorDetour(start, end, a) - corridorDetour(start, end, b)
  );
}

export function insertionSearchPoolSize(
  k: number,
  candidateCount: number
): number {
  return Math.min(candidateCount, Math.max(k + 10, k * 5));
}

function insertSpotAtBestPosition(
  stops: RouteSpot[],
  spot: RouteSpot,
  start: Coords,
  end: Coords
): { stops: RouteSpot[]; length: number } {
  let bestStops = stops;
  let bestLen = Infinity;

  for (let insertAt = 0; insertAt <= stops.length; insertAt++) {
    const trial = [...stops];
    trial.splice(insertAt, 0, spot);
    const len = totalMeters(start, trial, end);
    if (len < bestLen) {
      bestLen = len;
      bestStops = trial;
    }
  }

  return { stops: bestStops, length: bestLen };
}

/**
 * Grow the visit list by repeatedly inserting the spot that adds the least
 * distance. Does not run 2-opt — ordering is owned by routeMath / finalize.
 */
export function buildStopsByInsertion(
  searchPool: RouteSpot[],
  start: Coords,
  end: Coords,
  k: number,
  seedFirst?: RouteSpot
): RouteSpot[] {
  let stops: RouteSpot[] = [];
  let remaining = [...searchPool];

  if (seedFirst && spotInList(seedFirst, remaining)) {
    remaining = remaining.filter(s => spotKey(s) !== spotKey(seedFirst));
    ({ stops } = insertSpotAtBestPosition(stops, seedFirst, start, end));
  }

  while (stops.length < k && remaining.length > 0) {
    let pickSpot: RouteSpot | null = null;
    let pickResult: { stops: RouteSpot[]; length: number } | null = null;
    let bestLen = Infinity;

    for (const spot of remaining) {
      const result = insertSpotAtBestPosition(stops, spot, start, end);
      if (result.length < bestLen) {
        bestLen = result.length;
        pickSpot = spot;
        pickResult = result;
      }
    }

    if (!pickSpot || !pickResult) break;
    const chosen = pickSpot;
    stops = pickResult.stops;
    remaining = remaining.filter(s => spotKey(s) !== spotKey(chosen));
  }

  return stops;
}

function selectStopsByInsertion(
  candidates: RouteSpot[],
  start: Coords,
  end: Coords,
  k: number,
  seedFirst?: RouteSpot
): RouteSpot[] {
  const searchPool = candidates.slice(
    0,
    insertionSearchPoolSize(k, candidates.length)
  );
  const pickCount = Math.min(k, searchPool.length);
  return buildStopsByInsertion(searchPool, start, end, pickCount, seedFirst);
}

export function selectStopsForShortestPath(
  pool: RouteSpot[],
  start: Coords,
  end: Coords,
  k: number,
  seedFirst?: RouteSpot
): RouteSpot[] {
  const candidates = sortedByCorridor(start, end, pool);
  const pickCount = Math.min(k, candidates.length);
  if (pickCount < 1) return [];

  return selectStopsByInsertion(candidates, start, end, pickCount, seedFirst);
}
