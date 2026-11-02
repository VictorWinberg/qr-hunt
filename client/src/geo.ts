export function distance(
  { lat: lat1, lng: lng1 },
  { lat: lat2, lng: lng2 }
): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateWalkingTime(distanceInMeters: number): number {
  const walkingSpeed = 1.2;
  const walkingTimeInSeconds = distanceInMeters / walkingSpeed;
  return Math.ceil(walkingTimeInSeconds / 60);
}
