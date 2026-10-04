<template>
  <div class="qr-scanner-wrapper">
    <div class="qr-scanner">
      <div class="qr-scanner__camera text-h6">
        <v-icon start icon="mdi-camera" />
        {{ t('scanner.title') }}
      </div>
      <v-btn v-if="hasFlash" class="qr-scanner__flash" icon variant="text" @click="toggleFlash">
        <v-icon :icon="flashOn ? 'mdi-flash' : 'mdi-flash-off'" />
      </v-btn>
    </div>
    <div class="qrscan">
      <video id="qrscan" ref="qrscan">
        <track kind="captions" label="empty" />
      </video>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import QrScanner from 'qr-scanner';
import workerUrl from 'qr-scanner/qr-scanner-worker.min.js?url';

import { QR_SPOT_PANEL } from '@/constants';
import useDialog from '@/store/DialogStore';
import useQrSpot from '@/store/QrSpotStore';
import useScan from '@/store/ScanStore';
import { findCamera } from '@/utils/geo';

QrScanner.WORKER_PATH = workerUrl;

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const scanStore = useScan();
const qrStore = useQrSpot();
const dialog = useDialog();
const { scanning } = storeToRefs(scanStore);

const qrscan = ref<HTMLVideoElement | null>(null);
const hasFlash = ref(false);
const flashOn = ref(false);
let scanner: QrScanner | undefined;
let timeout = -1;
const timeoutMs = 10 * 1000;

onMounted(async () => {
  if (route.path !== '/') {
    await router.replace({ path: '/', query: route.query });
  }
  dialog.close();
  qrStore.setModalState(QR_SPOT_PANEL.HIDE);

  const qrcode = route.query.qrcode;
  if (typeof qrcode === 'string' && qrcode) {
    setTimeout(() => {
      void scanStore.handleQR(qrcode);
      scanStore.stopScan();
    }, 600);
    return;
  }

  if (!scanning.value) return;
  await initScanner();
});

onUnmounted(() => {
  scanner?.destroy();
  window.clearTimeout(timeout);
});

async function initScanner(): Promise<void> {
  await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
  const devices = await navigator.mediaDevices.enumerateDevices();
  const camera = findCamera(devices);
  const el = qrscan.value;
  if (!camera?.deviceId || !el) return;

  scanner = new QrScanner(
    el,
    (result: string | { data: string }) => {
      const qrcode = typeof result === 'string' ? result : result.data;
      if (qrcode) {
        void scanStore.handleQR(qrcode);
        scanStore.stopScan();
        window.clearTimeout(timeout);
      }
    },
    () => {},
    undefined,
    camera.deviceId
  );
  await scanner.start();
  hasFlash.value = await scanner.hasFlash();

  timeout = window.setTimeout(() => {
    void scanStore.handleQR(null);
    scanStore.stopScan();
  }, timeoutMs);
}

async function toggleFlash(): Promise<void> {
  if (!scanner) return;
  await scanner.toggleFlash();
  flashOn.value = !flashOn.value;
}
</script>

<style scoped lang="scss">
.qr-scanner-wrapper {
  position: fixed;
  inset: 0;
  z-index: 2000;
  overflow: hidden;
  background: #575759;
  animation: slide-up 1s forwards;
}

.qr-scanner {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 20px;
    pointer-events: none;
    content: '';
    background-color: rgb(239 240 235 / 50%);
    box-shadow: 0 0 50px #eff0eb;
    animation: scanning 5s infinite cubic-bezier(0.7, 0.3, 0.3, 0.7) 1s;
  }

  .qr-scanner__camera {
    position: absolute;
    top: 20px;
    right: 0;
    left: 0;
    font-weight: 700;
    text-align: center;
    text-transform: uppercase;
  }

  .qr-scanner__flash {
    position: absolute;
    top: 8px;
    right: 8px;
  }
}

.qrscan {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
}

#qrscan {
  object-fit: cover;
  width: auto;
  min-width: 100%;
  height: auto;
  min-height: 100%;
}

@keyframes scanning {
  0%,
  100% {
    top: 0;
  }

  50% {
    top: calc(100% - 20px);
  }
}

@keyframes slide-up {
  0% {
    transform: translateY(100%);
  }

  100% {
    transform: translateY(0);
  }
}
</style>
