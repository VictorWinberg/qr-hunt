<template>
  <div class="qr-scanner-wrapper">
    <div class="qr-scanner">
      <div class="qr-scanner__camera">
        <i class="fas fa-camera-retro"></i> QR SCAN
      </div>
      <div v-if="hasFlash" class="qr-scanner__flash" @click="toggleFlash">
        <i v-if="flashOn" class="fas fa-bolt"></i>
        <i v-else class="far fa-bolt"></i>
      </div>
    </div>
    <div class="qrscan"><video id="qrscan"></video></div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapMutations, mapActions } from "vuex";
import QRScanner from "qr-scanner";

import { QR_SPOT_PANEL } from "@/constants";
// eslint-disable-next-line import/no-webpack-loader-syntax
import QRScannerWorkerPath from "!!file-loader!../../node_modules/qr-scanner/qr-scanner-worker.min.js";
QRScanner.WORKER_PATH = QRScannerWorkerPath;

export default Vue.extend({
  name: "QRScanner",
  data() {
    return {
      hasFlash: false,
      flashOn: false,
      scanner: undefined,
      timeout: -1,
      timeoutMs: 10 * 1000
    };
  },
  computed: mapState("scan", ["scanning"]),
  created() {
    const { query } = this.$route;
    if (this.$route.path !== "/") this.$router.push({ path: "/", query });

    this.$store.commit("popup/setPopup", false);
    this.$store.commit("qrSpot/setModalState", QR_SPOT_PANEL.HIDE);

    // DEV ONLY
    if (query.qrcode) {
      setTimeout(() => {
        this.handleQR(query.qrcode);
        this.stopScan();
      }, 600);
    }
  },
  mounted() {
    if (!this.scanning) return;

    this.initScanner();
  },
  beforeDestroy() {
    this.scanner && this.scanner.destroy();
    clearTimeout(this.timeout);
  },
  methods: {
    ...mapMutations("scan", ["stopScan"]),
    ...mapActions("scan", ["handleQR"]),
    async initScanner() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === "videoinput");
      const camera = cameras[cameras.length - 1];

      this.scanner = new QRScanner(
        document.getElementById("qrscan"),
        qrcode => {
          if (qrcode) {
            this.handleQR(qrcode);
            this.stopScan();
            clearTimeout(this.timeout);
          }
        },
        QRScanner._onDecodeError,
        QRScanner._calculateScanRegion,
        camera.deviceId
      );
      await this.scanner.start();
      this.hasFlash = await this.scanner.hasFlash();

      this.timeout = window.setTimeout(() => {
        this.handleQR(null);
        this.stopScan();
      }, this.timeoutMs);
    },
    async toggleFlash() {
      if (!this.scanner) return;
      await this.scanner.toggleFlash();
      this.flashOn = !this.flashOn;
    }
  }
});
</script>

<style lang="scss">
.qr-scanner-wrapper {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 5;
  overflow: hidden;
  background: $seconday-color;
  animation: slide-up 1s forwards;

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
      content: "";
      background-color: rgba($text-color, 0.5);
      box-shadow: 0 0 50px $text-color;
      animation: scanning 5s infinite cubic-bezier(0.7, 0.3, 0.3, 0.7);
      animation-delay: 1s;
    }

    .qr-scanner__camera {
      position: absolute;
      top: 20px;
      right: 0;
      left: 0;
      font-size: 2rem;
      font-weight: bold;
    }

    .qr-scanner__flash {
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 2rem;
    }
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
    top: 100%;
  }

  100% {
    top: 0;
  }
}
</style>
