export interface Coords {
  lat: number;
  lng: number;
}

export function distance(
  { lat: lat1, lng: lng1 }: Coords,
  { lat: lat2, lng: lng2 }: Coords
): number {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateWalkingTime(distanceInMeters: number): number {
  const walkingSpeed = 1.2;
  const walkingTimeInSeconds = distanceInMeters / walkingSpeed;
  return Math.ceil(walkingTimeInSeconds / 60);
}

export function coordsEqual(
  a: Coords | null | undefined,
  b: Coords | null | undefined,
  epsilon = 1e-7
): boolean {
  if (!a || !b) return false;
  return (
    Math.abs(Number(a.lat) - Number(b.lat)) < epsilon &&
    Math.abs(Number(a.lng) - Number(b.lng)) < epsilon
  );
}

export function formatDistance(meters: number | null | undefined): string {
  if (meters == null || Number.isNaN(meters)) return "N/A";
  return meters < 1000
    ? `${meters.toFixed(0)} m`
    : `${(meters / 1000).toFixed(1)} km`;
}
