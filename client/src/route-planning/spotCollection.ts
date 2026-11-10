import { now, parse } from "@/plugins/dayjs";
import { RouteSpot } from "./types";

export function isCollectedToday(collectedAt?: string | null): boolean {
  if (!collectedAt) return false;
  return now().isSame(parse(collectedAt), "day");
}

/** Prefer live marker timestamp when the route stop is a cached copy. */
export function collectedAtForRouteStop(
  stop: RouteSpot,
  markers: RouteSpot[]
): string | null | undefined {
  const marker = markers.find(m => m.id === stop.id);
  return (marker && marker.collectedAt) || stop.collectedAt;
}

export function isRouteStopCollectedToday(
  stop: RouteSpot,
  markers: RouteSpot[]
): boolean {
  return isCollectedToday(collectedAtForRouteStop(stop, markers));
}
