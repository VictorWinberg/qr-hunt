<template>
  <div class="qr-scanner-wrapper">
    <div class="qr-scanner">
      <div class="qr-scanner__camera">
        <i class="fas fa-camera-retro"></i> QR SCAN
      </div>
    </div>
    <video id="qrscan"></video>
  </div>
</template>

<script>
import Vue from "vue";
import QRScanner from "qr-scanner";
import Snackbar from "@/plugins/snackbar";

// eslint-disable-next-line import/no-webpack-loader-syntax
import QrScannerWorkerPath from "!!file-loader!../../node_modules/qr-scanner/qr-scanner-worker.min.js";
QRScanner.WORKER_PATH = QrScannerWorkerPath;

export default Vue.extend({
  name: "QRScanner",
  data() {
    return {
      qrcode: "",
      scanner: undefined,
      timeout: -1,
      timeoutMs: 10 * 1000,
      scanning: true
    };
  },
  created() {
    const { qrcode } = this.$route.query;
    if (qrcode) {
      this.qrcode = qrcode;
      this.scanning = false;
    }
  },
  mounted() {
    if (!this.scanning) return this.handleQR();

    this.scanner = new QRScanner(document.getElementById("qrscan"), result => {
      if (result) {
        this.qrcode = result;
        this.scanner.stop();
        this.scanning = false;
        this.handleQR();
        clearTimeout(this.timeout);
      }
    });
    this.scanner.start();
    this.timeout = window.setTimeout(() => {
      this.scanner.stop();
      this.scanning = false;
    }, this.timeoutMs);
  },
  beforeDestroy() {
    this.scanner.destroy();
  },
  methods: {
    async handleQR() {
      const { data, err } = await this.$fetch("/api/scan/" + this.qrcode);
      if (err) return Snackbar.err(err);
      if (!data.qrcode) return Snackbar.err("Error: 404 - QR Code not found");
      if (!data.qrspot) {
        if (confirm("Do you want to create a QR Spot?")) {
          const title = prompt("Enter a title", "Placeholder");
          navigator.geolocation.getCurrentPosition(async ({ coords }) => {
            const { latitude: lat, longitude: lng } = coords;
            const { data: qrspot, err } = await this.$fetch("/api/qrspots", {
              method: "POST",
              body: JSON.stringify({ title, lat, lng, qrcode: this.qrcode })
            });
            alert(qrspot);
          });
        }
        return;
      }
      // TODO: Do you want to deactivate QR Spot?
      if (!data.qrshard) {
        if (confirm("Collect QR?")) {
          const comment = prompt("Enter a comment", "Placeholder");
          const { data: qrshard, err } = await this.$fetch("/api/qrshards", {
            method: "POST",
            body: JSON.stringify({ comment, rating: 5, qrcode: this.qrcode })
          });
          alert(qrshard);
        }
        return;
      }
      alert("QR Code is already collected");
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

#qrscan {
  position: absolute;
  top: 50%;
  left: 50%;
  width: auto;
  min-width: 100%;
  max-width: none;
  height: auto;
  min-height: 100%;
  transform: translate(-50%, -50%) scaleX(-1) !important;
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
