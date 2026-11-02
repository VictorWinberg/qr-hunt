import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  filterRouteCandidates,
  planRouteAlternativesByCount,
  planRouteByCount,
  planRouteByTime,
  totalMeters,
  RouteSpot
} from "@/routePlanner";
import { calculateWalkingTime } from "@/geo";

dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = "Europe/Stockholm";
const start = { lat: 57.7, lng: 11.97 };

function spot(
  id: number,
  lat: number,
  lng: number,
  overrides: Partial<RouteSpot> = {}
): RouteSpot {
  return { id, title: `Spot ${id}`, lat, lng, ...overrides };
}

describe("filterRouteCandidates", () => {
  it("excludes missing and collected-today spots", () => {
    const spots = [
      spot(1, 57.701, 11.971),
      spot(2, 57.702, 11.972, { missing: true }),
      spot(3, 57.703, 11.973, {
        collectedAt: dayjs()
          .tz(TZ)
          .toISOString()
      }),
      spot(4, 57.704, 11.974, {
        collectedAt: dayjs()
          .tz(TZ)
          .subtract(2, "day")
          .toISOString()
      })
    ];

    const result = filterRouteCandidates(spots, start);
    expect(result.map(s => s.id)).toEqual([1, 4]);
  });

  it("excludes spots outside the radius", () => {
    const spots = [spot(1, 57.701, 11.971), spot(2, 58.5, 12.5)];

    const result = filterRouteCandidates(spots, start, 10000);
    expect(result.map(s => s.id)).toEqual([1]);
  });
});

describe("planRouteByCount", () => {
  const spots = [
    spot(1, 57.701, 11.971),
    spot(2, 57.702, 11.972),
    spot(3, 57.703, 11.973),
    spot(4, 57.704, 11.974)
  ];

  it("returns null when no candidates", () => {
    expect(planRouteByCount([], start, 3)).toBeNull();
  });

  it("returns a loop with up to K stops when end equals start", () => {
    const plan = planRouteByCount(spots, start, 3);
    expect(plan).not.toBeNull();
    if (!plan) return;
    expect(plan.actualK).toBe(3);
    expect(plan.requestedK).toBe(3);
    expect(plan.stops).toHaveLength(3);
    expect(plan.totalMeters).toBeGreaterThan(0);
    expect(plan.totalMinutes).toBe(calculateWalkingTime(plan.totalMeters));
    expect(plan.start).toEqual(start);
    expect(plan.end).toEqual(start);
  });

  it("caps at available spots and reports requestedK", () => {
    const plan = planRouteByCount(spots, start, 10);
    expect(plan).not.toBeNull();
    if (!plan) return;
    expect(plan.actualK).toBe(4);
    expect(plan.requestedK).toBe(10);
  });

  it("totalMeters matches helper for ordered stops", () => {
    const plan = planRouteByCount(spots, start, 2);
    expect(plan).not.toBeNull();
    if (!plan) return;
    expect(plan.totalMeters).toBeCloseTo(
      totalMeters(start, plan.stops, plan.end),
      5
    );
  });

  it("supports a different end point", () => {
    const end = { lat: 57.705, lng: 11.975 };
    const loop = planRouteByCount(spots, start, 2);
    const open = planRouteByCount(spots, start, 2, end);
    expect(loop).not.toBeNull();
    expect(open).not.toBeNull();
    if (!loop || !open) return;
    expect(open.end).toEqual(end);
    expect(open.totalMeters).not.toBe(loop.totalMeters);
  });

  it("returns multiple distinct alternatives with the same K", () => {
    const many = [
      spot(1, 57.701, 11.971),
      spot(2, 57.702, 11.972),
      spot(3, 57.703, 11.973),
      spot(4, 57.704, 11.974),
      spot(5, 57.7015, 11.975),
      spot(6, 57.705, 11.9715),
      spot(7, 57.699, 11.973)
    ];
    const alts = planRouteAlternativesByCount(many, start, 3);
    expect(alts.length).toBeGreaterThan(1);
    expect(alts.every(p => p.actualK === 3)).toBe(true);
    const keys = new Set(alts.map(p => p.stops.map(s => s.id).join(">")));
    expect(keys.size).toBe(alts.length);
    expect(alts[0].totalMeters).toBeLessThanOrEqual(
      alts[alts.length - 1].totalMeters
    );
  });
});

describe("planRouteByTime", () => {
  const spots = [
    spot(1, 57.701, 11.971),
    spot(2, 57.702, 11.972),
    spot(3, 57.703, 11.973)
  ];

  it("returns null when budget is too small for one stop", () => {
    expect(planRouteByTime(spots, start, 1)).toBeNull();
  });

  it("picks the largest K that fits the budget", () => {
    const one = planRouteByCount(spots, start, 1);
    const two = planRouteByCount(spots, start, 2);
    const three = planRouteByCount(spots, start, 3);
    expect(one).not.toBeNull();
    expect(two).not.toBeNull();
    expect(three).not.toBeNull();
    if (!one || !two || !three) return;

    expect(one.totalMinutes).toBeLessThan(two.totalMinutes);
    expect(two.totalMinutes).toBeLessThan(three.totalMinutes);

    const plan = planRouteByTime(spots, start, two.totalMinutes);
    expect(plan).not.toBeNull();
    if (!plan) return;
    expect(plan.actualK).toBe(2);
    expect(plan.totalMinutes).toBeLessThanOrEqual(two.totalMinutes);
  });
});
