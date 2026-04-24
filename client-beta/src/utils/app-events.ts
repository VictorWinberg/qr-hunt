type Listener = () => void;

const authListeners: Set<Listener> = new Set();
const apiListeners: Set<Listener> = new Set();
const qrSpotListeners: Set<Listener> = new Set();

export function onAuthChange(fn: Listener): () => void {
  authListeners.add(fn);
  return () => authListeners.delete(fn);
}

export function emitAuthChange(): void {
  authListeners.forEach(fn => fn());
}

export function onApiMutation(fn: Listener): () => void {
  apiListeners.add(fn);
  return () => apiListeners.delete(fn);
}

export function emitApiMutation(): void {
  apiListeners.forEach(fn => fn());
}

export function onQrSpotsUpdate(fn: Listener): () => void {
  qrSpotListeners.add(fn);
  return () => qrSpotListeners.delete(fn);
}

export function emitQrSpotsUpdate(): void {
  qrSpotListeners.forEach(fn => fn());
}
