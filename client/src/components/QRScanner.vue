<template>
  <div class="qr-scanner-wrapper">
    <div class="qr-scanner">
      <div class="qr-scanner__camera">
        <i class="fas fa-camera-retro"></i> QR SCAN
      </div>
    </div>
    <div class="qrscan"><video id="qrscan"></video></div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapMutations, mapActions } from "vuex";
import QRScanner from "qr-scanner";

import { QR_SPOT_MODAL_STATE } from "@/constans";
// eslint-disable-next-line import/no-webpack-loader-syntax
import QrScannerWorkerPath from "!!file-loader!../../node_modules/qr-scanner/qr-scanner-worker.min.js";
QRScanner.WORKER_PATH = QrScannerWorkerPath;

export default Vue.extend({
  name: "QRScanner",
  data() {
    return {
      scanner: undefined,
      timeout: -1,
      timeoutMs: 10 * 1000
    };
  },
  computed: mapState("scan", ["scanning"]),
  created() {
    this.$store.commit("modal/setModal", false);
    this.$store.commit("qrSpot/setModalState", QR_SPOT_MODAL_STATE.HIDE);

    const { qrcode } = this.$route.query;
    if (qrcode) {
      this.handleQR(qrcode);
      this.stopScan();
    }
  },
  mounted() {
    if (!this.scanning) return;

    this.scanner = new QRScanner(document.getElementById("qrscan"), qrcode => {
      if (qrcode) {
        this.handleQR(qrcode);
        this.stopScan();
        clearTimeout(this.timeout);
      }
    });
    this.scanner.start();
    this.timeout = window.setTimeout(() => {
      this.handleQR(null);
      this.stopScan();
    }, this.timeoutMs);
  },
  beforeDestroy() {
    this.scanner && this.scanner.destroy();
    clearTimeout(this.timeout);
  },
  methods: {
    ...mapMutations("scan", ["stopScan"]),
    ...mapActions("scan", ["handleQR"])
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
  background: rgba($primary, 0.5);
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
      color: $text-color;
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
