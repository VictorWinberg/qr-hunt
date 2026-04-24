<template>
  <div class="map-shell" :class="shellClass">
    <div ref="mapEl" class="map-canvas" />
    <div class="map-ui map-ui--lb">
      <v-btn id="streak-button" class="control-button" icon variant="flat" @click="explainStreak">
        <div class="streak-wrap" :class="{ 'streak-wrap--dim': !showStreak }">
          <flame v-if="showStreak" />
          <span class="streak-count">{{ user.streak ?? 0 }}</span>
        </div>
      </v-btn>
      <v-btn
        id="position-button"
        class="control-button"
        icon
        variant="flat"
        @click="centerMapToUser()"
      >
        <v-img :src="positionBtn" alt="" width="28" height="28" contain />
      </v-btn>
    </div>
    <div class="map-ui map-ui--tl">
      <v-btn id="compass-button" class="control-button" icon variant="flat" @click="resetHeading">
        <div class="compass-tilt" :style="tiltStyle">
          <v-img :src="compassImg" alt="" width="28" height="28" contain :style="headingStyle" />
        </div>
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import { Loader } from '@googlemaps/js-api-loader';

import compassImg from '@/assets/compass.svg?url';
import positionBtn from '@/assets/position-button.svg?url';
import positionMarker from '@/assets/position-marker.svg?url';
import puff from '@/assets/puff.svg?url';
import markerFree from '@/assets/qr-spot-marker--free.svg?url';
import markerMissing from '@/assets/qr-spot-marker--missing.svg?url';
import markerNew from '@/assets/qr-spot-marker--new.svg?url';
import markerUsed from '@/assets/qr-spot-marker--used.svg?url';
import spinner from '@/assets/spinner.svg?url';
import Flame from '@/components/Flame.vue';
import { QR_SPOT_MODE, QR_SPOT_PANEL } from '@/constants';
import dayjs from '@/plugins/dayjs';
import useDialog from '@/store/DialogStore';
import useQrSpot from '@/store/QrSpotStore';
import useUser from '@/store/UserStore';
import { api } from '@/utils/api';
import { onQrSpotsUpdate } from '@/utils/app-events';

interface QrMarker {
  lat: string | number;
  lng: string | number;
  missing?: boolean;
  collectedAt?: string | null;
  lastVisitedAt?: string | null;
}

const mapEl = ref<HTMLElement | null>(null);
const mapCoords = ref<{ lat: number; lng: number }>(
  localStorage.getItem('mapCoords')
    ? JSON.parse(localStorage.getItem('mapCoords')!)
    : { lat: 0, lng: 0 }
);
const mapZoom = ref(Number(localStorage.getItem('mapZoom') ?? 14));
const mapHeading = ref(0);
const mapTilt = ref(0);
const markers = ref<QrMarker[]>([]);
let zoomTimer: ReturnType<typeof setTimeout> | null = null;

const qrStore = useQrSpot();
const userStore = useUser();
const dialog = useDialog();
const { qrSpot, mode, panel } = storeToRefs(qrStore);
const { user, coords: userCoords } = storeToRefs(userStore);

const shellClass = computed(() =>
  panel.value === QR_SPOT_PANEL.SHOW_DETAILS ? 'map-shell--collapsed' : 'map-shell--expanded'
);

const showStreak = computed(() => (user.value.streak ?? 0) > 2);

const headingStyle = computed(() => ({
  transform: `rotate(-${mapHeading.value}deg)`
}));

const tiltStyle = computed(() => ({
  transform: `rotateX(-${mapTilt.value}deg)`
}));

let googleMap: google.maps.Map | null = null;
const gMarkers: google.maps.marker.AdvancedMarkerElement[] = [];
const gCircles: google.maps.Circle[] = [];
let userMarker: google.maps.marker.AdvancedMarkerElement | null = null;
let userCircle: google.maps.Circle | null = null;
let listenerClick: google.maps.MapsEventListener | null = null;
let listenerDrag: google.maps.MapsEventListener | null = null;
let listenerZoom: google.maps.MapsEventListener | null = null;
let listenerHeading: google.maps.MapsEventListener | null = null;
let listenerTilt: google.maps.MapsEventListener | null = null;

function getIcon(m: QrMarker): string {
  if (m.missing) return markerMissing;
  if (!m.collectedAt) return markerNew;
  if (dayjs().isSame(m.collectedAt as string, 'day')) return markerUsed;
  return markerFree;
}

function clearMapShapes(): void {
  gMarkers.forEach(x => {
    x.map = null;
  });
  gCircles.forEach(x => x.setMap(null));
  gMarkers.length = 0;
  gCircles.length = 0;
}

/** Pin icon: lat/lng at bottom-center (matches classic Marker default). User/puff: centered. */
function centeredIconContent(url: string, width: number, height: number): HTMLDivElement {
  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.alignItems = 'center';
  wrap.style.justifyContent = 'center';
  const img = document.createElement('img');
  img.src = url;
  img.width = width;
  img.height = height;
  img.alt = '';
  img.draggable = false;
  wrap.appendChild(img);
  return wrap;
}

function recent(ms: QrMarker[]): QrMarker[] {
  return ms.filter(
    m =>
      m.lastVisitedAt &&
      dayjs()
        .subtract(1, 'day')
        .isBefore(m.lastVisitedAt as string)
  );
}

function renderMarkers(): void {
  if (!googleMap) return;
  clearMapShapes();

  for (const marker of markers.value) {
    const pos = { lat: Number(marker.lat), lng: Number(marker.lng) };
    const m = new google.maps.marker.AdvancedMarkerElement({
      map: googleMap,
      position: pos,
      content: centeredIconContent(getIcon(marker), 48, 48),
      // Bottom-center on lat/lng (legacy Marker with icon URL only uses same default as AdvancedMarkerElement)
      anchorLeft: '-50%',
      anchorTop: '-100%',
      gmpClickable: panel.value !== QR_SPOT_PANEL.SHOW_DETAILS
    });
    m.addListener('click', () => qrStore.select(marker as never));
    gMarkers.push(m);

    if (!marker.missing) {
      const c = new google.maps.Circle({
        map: googleMap,
        center: pos,
        radius: 15,
        strokeColor: '#54341f',
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: '#54341f',
        fillOpacity: 0.2,
        clickable: false
      });
      gCircles.push(c);
    }
  }

  for (const marker of recent(markers.value)) {
    const pos = { lat: Number(marker.lat), lng: Number(marker.lng) };
    const m = new google.maps.marker.AdvancedMarkerElement({
      map: googleMap,
      position: pos,
      content: centeredIconContent(puff, 64, 64),
      anchorLeft: '-50%',
      anchorTop: '-50%',
      zIndex: 50
    });
    gMarkers.push(m);
  }
}

async function fetchQRSpots(): Promise<void> {
  const res = await api.get('/api/qrspots');
  if (!res.err) markers.value = res.data as QrMarker[];
  renderMarkers();
}

function renderUserMarker(): void {
  if (!googleMap) return;
  if (userMarker) userMarker.map = null;
  userCircle?.setMap(null);
  userMarker = null;
  userCircle = null;

  const c = userCoords.value;
  if (c) {
    userMarker = new google.maps.marker.AdvancedMarkerElement({
      map: googleMap,
      position: c,
      zIndex: 100,
      content: centeredIconContent(positionMarker, 24, 24),
      anchorLeft: '-50%',
      anchorTop: '-50%',
      gmpClickable: true
    });
    userMarker.addListener('click', () => centerMapToUser());
    userCircle = new google.maps.Circle({
      map: googleMap,
      center: c,
      radius: 20,
      strokeColor: '#FFFFFF',
      strokeOpacity: 0.5,
      strokeWeight: 2,
      fillColor: '#0042FF',
      fillOpacity: 0.15,
      clickable: false
    });
  } else {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.alignItems = 'center';
    wrap.style.textAlign = 'center';
    const img = document.createElement('img');
    img.src = spinner;
    img.width = 100;
    img.height = 100;
    img.alt = '';
    img.draggable = false;
    wrap.appendChild(img);
    const label = document.createElement('div');
    label.textContent = 'Please enable location access';
    label.style.fontSize = '1rem';
    label.style.color = '#242424';
    wrap.appendChild(label);

    userMarker = new google.maps.marker.AdvancedMarkerElement({
      map: googleMap,
      position: { lat: 0, lng: 0 },
      zIndex: 100,
      content: wrap,
      anchorLeft: '-50%',
      anchorTop: '-50%',
      gmpClickable: true
    });
    userMarker.addListener('click', () => centerMapToUser());
  }
}

function centerMapToUser(opts: { zoom?: boolean } = {}): void {
  const m = googleMap;
  const c = userCoords.value;
  if (!m || !c) return;
  m.panTo(new google.maps.LatLng(c.lat, c.lng));
  localStorage.setItem('mapCoords', JSON.stringify(c));
  const zoom = opts.zoom !== false;
  if (zoom && m.getZoom()! < 15) m.setZoom(15);
}

function explainStreak(): void {
  dialog.setDialog({
    title: 'Your streak',
    subtitle: 'This number shows how many days in a row you have collected a QR shard. 🔥',
    options: [
      {
        name: 'OK, got it!',
        type: 'success',
        action: async () => {
          dialog.close();
        }
      }
    ]
  });
}

function resetHeading(): void {
  const m = googleMap;
  if (!m) return;
  if (mapHeading.value === 0 && mapTilt.value === 0) {
    m.setTilt(45);
  } else {
    m.setHeading(0);
    m.setTilt(0);
  }
}

let offQr: (() => void) | undefined;

onMounted(async () => {
  const key = import.meta.env.VITE_APP_GOOGLE_API_KEY;
  if (!mapEl.value || !key) return;

  const loader = new Loader({
    apiKey: key,
    version: 'weekly'
  });
  await loader.load();
  await google.maps.importLibrary('marker');

  googleMap = new google.maps.Map(mapEl.value, {
    center: mapCoords.value,
    zoom: mapZoom.value,
    mapId: '153063bbe11287f1',
    gestureHandling: 'greedy',
    zoomControl: true,
    zoomControlOptions: { position: 3 },
    scaleControl: false,
    rotateControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    clickableIcons: false,
    draggable: panel.value !== QR_SPOT_PANEL.SHOW_DETAILS
  });

  qrStore.setMap(googleMap);

  listenerClick = google.maps.event.addListener(googleMap, 'click', () => qrStore.deselect());
  listenerDrag = google.maps.event.addListener(googleMap, 'dragend', () => {
    const center = googleMap!.getCenter();
    if (center) mapCoords.value = { lat: center.lat(), lng: center.lng() };
  });
  listenerZoom = google.maps.event.addListener(googleMap, 'zoom_changed', () => {
    const z = googleMap!.getZoom();
    if (zoomTimer) clearTimeout(zoomTimer);
    zoomTimer = setTimeout(() => {
      if (z != null) mapZoom.value = z;
    }, 1000);
  });
  listenerHeading = google.maps.event.addListener(googleMap, 'heading_changed', () => {
    mapHeading.value = googleMap!.getHeading() ?? 0;
  });
  listenerTilt = google.maps.event.addListener(googleMap, 'tilt_changed', () => {
    mapTilt.value = googleMap!.getTilt() ?? 0;
  });

  await fetchQRSpots();
  offQr = onQrSpotsUpdate(fetchQRSpots);

  watchCurrentPosition();
  renderUserMarker();
});

onUnmounted(() => {
  offQr?.();
  if (listenerClick) google.maps.event.removeListener(listenerClick);
  if (listenerDrag) google.maps.event.removeListener(listenerDrag);
  if (listenerZoom) google.maps.event.removeListener(listenerZoom);
  if (listenerHeading) google.maps.event.removeListener(listenerHeading);
  if (listenerTilt) google.maps.event.removeListener(listenerTilt);
  clearMapShapes();
  if (userMarker) userMarker.map = null;
  userCircle?.setMap(null);
  qrStore.setMap(null);
});

watch(mapCoords, v => localStorage.setItem('mapCoords', JSON.stringify(v)));
watch(mapZoom, z => localStorage.setItem('mapZoom', String(z)));

watch(panel, () => {
  if (!googleMap) return;
  googleMap.setOptions({
    draggable: panel.value !== QR_SPOT_PANEL.SHOW_DETAILS
  });
  if (panel.value === QR_SPOT_PANEL.SHOW_DETAILS) {
    const position =
      mode.value === QR_SPOT_MODE.CREATE
        ? userCoords.value
        : { lat: Number(qrSpot.value.lat), lng: Number(qrSpot.value.lng) };
    if (position && position.lat != null && position.lng != null) {
      setTimeout(() => {
        googleMap?.panTo(new google.maps.LatLng(position.lat, position.lng));
      }, 200);
    }
  }
});

watch(markers, renderMarkers);
watch(userCoords, renderUserMarker);

function watchCurrentPosition(): void {
  const watchOptions: PositionOptions = {
    timeout: 60 * 60 * 1000,
    maximumAge: 0,
    enableHighAccuracy: true
  };

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      userStore.setCoords(coords);
      centerMapToUser({ zoom: false });
    },
    err => console.error(err),
    watchOptions
  );
  navigator.geolocation.watchPosition(
    ({ coords }) => userStore.setCoords(coords),
    err => console.error(err),
    watchOptions
  );
}
</script>

<style scoped lang="scss">
.map-shell {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  overflow: hidden;
}

.map-shell--collapsed .map-canvas {
  height: 25%;
  transition: height 300ms 200ms;
}

.map-shell--collapsed .map-ui--lb {
  opacity: 0;
  transition: opacity 200ms;
}

.map-shell--expanded .map-canvas {
  height: 100%;
  transition: height 300ms 0ms;
}

.map-shell--expanded .map-ui--lb {
  opacity: 1;
  transition: opacity 200ms 500ms;
}

.map-canvas {
  width: 100%;
  min-height: 120px;
}

.map-ui {
  position: absolute;
  z-index: 2;
  display: flex;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
}

.map-ui--lb {
  bottom: 12px;
  left: 12px;
  flex-direction: column;
  gap: 8px;
}

.map-ui--tl {
  top: 12px;
  left: 12px;
}

.control-button {
  width: 40px;
  height: 40px;
  background-color: #fff !important;
  box-shadow: rgb(0 0 0 / 30%) 0 1px 4px -1px;
}

.streak-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  &--dim {
    filter: opacity(0.1);
  }
}

.streak-count {
  position: absolute;
  font-family: Syne, Roboto, sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
  color: #242424;
  text-shadow: -1px -1px 1px rgb(36 36 36 / 52%);
}

.compass-tilt {
  transition: transform 500ms;
}
</style>
