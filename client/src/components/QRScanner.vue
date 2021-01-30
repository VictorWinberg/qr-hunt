<template>
  <div>
    <!-- printed QR Code -->
    <canvas id="qrcode"></canvas>
    <br />
    <br />
    <!-- actual QR Scanner -->
    <div class="qr-scanner" :class="!scanning && 'hidden'">
      <div class="qr-scanner-inner">
        <h3><span style="color: red">&#8226;</span> QR SCAN</h3>
      </div>
      <video id="qrscan"></video>
    </div>
    <button @click="qrScan()">QR SCAN</button>
    <br />
    <br />
    <h3>QR Code: <br />{{ qrcode }}</h3>
  </div>
</template>

<script>
import Vue from "vue";
import QRCode from "qrcode";
import QRScanner from "qr-scanner";

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
      scanning: false
    };
  },
  mounted() {
    const { qrcode } = this.$route.query;
    if (qrcode) {
      this.qrcode = qrcode;
      this.qrRead();
    }

    QRCode.toCanvas(document.getElementById("qrcode"), "https://zolly.ml");

    this.scanner = new QRScanner(document.getElementById("qrscan"), result => {
      if (result) {
        this.qrcode = result;
        this.qrRead();
        this.qrStop();
        clearTimeout(this.timeout);
      }
    });
  },
  methods: {
    qrScan() {
      this.scanner && this.scanner.start();
      this.scanning = true;
      this.timeout = window.setTimeout(() => this.qrStop(), this.timeoutMs);
    },
    qrStop() {
      this.scanner && this.scanner.stop();
      this.scanning = false;
    },
    async qrRead() {
      const { data, err } = await this.fetch("/api/scan/" + this.qrcode);
      if (err) return alert(err);
      if (!data.qrcode) return alert("Error: 404 - QR Code not found");
      if (!data.qrspot) {
        if (confirm("Do you want to create a QR Spot?")) {
          const title = prompt("Enter a title", "Placeholder");
          navigator.geolocation.getCurrentPosition(async ({ coords }) => {
            const { latitude: lat, longitude: lng } = coords;
            const { data: qrspot, err } = await this.fetch("/api/qrspots", {
              method: "POST",
              body: JSON.stringify({ title, lat, lng, qrcode: this.qrcode })
            });
            console.log(qrspot, err);
          });
        }
        return;
      }
      // TODO: Do you want to deactivate QR Spot?
      if (!data.qrshard) {
        if (confirm("Collect QR?")) {
          const comment = prompt("Enter a comment", "Placeholder");
          const { data: qrshard, err } = await this.fetch("/api/qrshards", {
            method: "POST",
            body: JSON.stringify({ comment, rating: 5, qrcode: this.qrcode })
          });
          console.log(qrshard, err);
        }
        return;
      }
      alert("QR Code is already collected");
    }
  }
});
</script>

<style lang="scss">
.hidden {
  display: none;
}

.qr-scanner {
  position: fixed;
  overflow: hidden;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  .qr-scanner-inner {
    position: absolute;
    overflow: hidden;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    border: 3px solid white;
    z-index: 1;

    h3 {
      position: absolute;
      top: 20px;
      right: 20px;
      color: white;
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 20px;
      animation: scanning 5s infinite cubic-bezier(0.7, 0.3, 0.3, 0.7);
      background-color: rgba(red, 0.5);
      box-shadow: 0 0 50px red;
    }
  }
}

#qrscan {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scaleX(-1) !important;

  min-width: 100%;
  min-height: 100%;
  max-width: none;
  width: auto;
  height: auto;
}
</style>
