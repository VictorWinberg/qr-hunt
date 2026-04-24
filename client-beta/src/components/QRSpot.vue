<template>
  <div class="qrspot-wrapper" :class="panel">
    <v-sheet
      class="qrspot-container"
      rounded
      @click="qrStore.setModalState(QR_SPOT_PANEL.SHOW_DETAILS)"
    >
      <v-btn
        v-if="
          panel === QR_SPOT_PANEL.SHOW_DETAILS &&
          mode === QR_SPOT_MODE.VIEW &&
          (qrSpot.isOwner || user.isAdmin)
        "
        class="fab-edit"
        icon="mdi-pencil"
        :color="!qrSpot.isOwner && user.isAdmin ? 'error' : 'primary'"
        @click.stop="qrStore.setMode(QR_SPOT_MODE.EDIT)"
      />
      <v-fade-transition mode="out-in">
        <div v-if="mode === QR_SPOT_MODE.VIEW" key="view">
          <div class="text-h6 mb-2">{{ qrSpot.title }}</div>
          <div class="d-flex flex-wrap justify-center ga-4 text-body-2">
            <span>
              <v-icon size="small" icon="mdi-map-marker-distance" class="mr-1" />
              {{ distanceToMarker(userCoords, qrSpot) }}
            </span>
            <span>
              <v-icon size="small" icon="mdi-walk" class="mr-1" />
              {{ walkingTimeToMarker(userCoords, qrSpot) }}
            </span>
          </div>
          <div v-if="panel === QR_SPOT_PANEL.SHOW_DETAILS" class="mt-4">
            <QRSpotView />
          </div>
        </div>
        <QRSpotUpdate v-else key="update" />
      </v-fade-transition>
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import type { QrSpotRecord } from '@/interfaces/QrSpot';

import QRSpotUpdate from '@/components/QRSpotUpdate.vue';
import QRSpotView from '@/components/QRSpotView.vue';
import { QR_SPOT_MODE, QR_SPOT_PANEL } from '@/constants';
import useQrSpot from '@/store/QrSpotStore';
import useUser from '@/store/UserStore';
import { calculateWalkingTime, distance } from '@/utils/geo';

const qrStore = useQrSpot();
const userStore = useUser();
const { qrSpot, mode, panel } = storeToRefs(qrStore);
const user = computed(() => userStore.user);
const userCoords = computed(() => userStore.coords);

function distanceToMarker(pos1: { lat: number; lng: number } | null, pos2: QrSpotRecord): string {
  if (!pos1 || pos2.lat == null || pos2.lng == null) return 'N/A';
  const d = distance(pos1, { lat: Number(pos2.lat), lng: Number(pos2.lng) });
  return d < 1000 ? d.toFixed(0) + ' m' : (d / 1000).toFixed(1) + ' km';
}

function walkingTimeToMarker(
  pos1: { lat: number; lng: number } | null,
  pos2: QrSpotRecord
): string {
  if (!pos1 || pos2.lat == null || pos2.lng == null) return 'N/A';
  const d = distance(pos1, { lat: Number(pos2.lat), lng: Number(pos2.lng) });
  const min = calculateWalkingTime(d);
  return min < 60 ? min.toFixed(0) + ' min' : (min / 60).toFixed(1) + ' hr';
}
</script>

<style scoped lang="scss">
.qrspot-wrapper {
  position: absolute;
  right: 60px;
  bottom: -65px;
  left: 60px;
  z-index: 4;
  height: 0;
  box-shadow: 0 -2px 6px 0 rgb(0 0 0 / 20%);
  transition:
    bottom 500ms 0ms,
    left 0ms 500ms,
    right 0ms 500ms,
    height 500ms 0ms;

  &.SHOW_INFO {
    bottom: 1rem;
    height: 8rem;
    transition:
      all 300ms 200ms,
      height 500ms 0ms;

    .qrspot-container {
      background-color: rgb(87 87 89 / 0.7);
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
    }
  }

  &.SHOW_DETAILS {
    right: 0;
    bottom: 0;
    left: 0;
    height: 75%;
    transition:
      all 200ms 0ms,
      height 500ms;
  }
}

.qrspot-container {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  padding: 1rem;
  overflow: auto;
  cursor: pointer;
  background-color: #575759;
  padding-bottom: 5rem;
}

.fab-edit {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
}
</style>
