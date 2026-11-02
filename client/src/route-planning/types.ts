import { Coords } from "@/utils/geo";

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
  stopTarget: number;
  stopCount: number;
}

/** Input for building a single route from a candidate pool. */
export interface RoutePlanInput {
  pool: RouteSpot[];
  start: Coords;
  end: Coords;
  /** How many stops to select. */
  stopCount: number;
  /** UI target for partial-k warnings; often equals stopCount. */
  stopTarget: number;
  seedFirst?: RouteSpot;
}
