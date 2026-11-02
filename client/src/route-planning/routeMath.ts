import { distance, Coords } from "@/utils/geo";
import { RoutePlan, RouteSpot } from "./types";

export function toCoords(spot: RouteSpot): Coords {
  return { lat: Number(spot.lat), lng: Number(spot.lng) };
}

export function spotKey(spot: RouteSpot): string {
  return spot.id != null
    ? String(spot.id)
    : `${Number(spot.lat)},${Number(spot.lng)}`;
}

export function planKey(plan: RoutePlan): string {
  return plan.stops.map(spotKey).join(">");
}

export function spotInList(spot: RouteSpot, list: RouteSpot[]): boolean {
  const key = spotKey(spot);
  return list.some(s => spotKey(s) === key);
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

/** Single owner of visit-order optimization (2-opt). */
export function twoOptImprove(
  start: Coords,
  stops: RouteSpot[],
  end: Coords
): RouteSpot[] {
  if (stops.length < 2) return stops;

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
