<template>
  <footer>
    <!-- printed QR Code -->
    <div class="footer-content"></div>
    <canvas id="qrcode" @click="qrScan()"></canvas>
    <!-- actual QR Scanner -->
    <div class="qr-scanner" :class="!scanning && 'hidden'">
      <div class="qr-scanner-inner">
        <h3><span style="color: red;">&#8226;</span> QR SCAN</h3>
      </div>
      <video id="qrscan"></video>
    </div>
  </footer>
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
    const options = {
      margin: 0.5,
      width: 80
    };

    QRCode.toCanvas(
      document.getElementById("qrcode"),
      "https://zolly.ml",
      options
    );

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
            alert(qrspot);
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
footer {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 65px;
}

.footer-content {
  width: 100%;
  height: 100%;
  background: $white;
  box-shadow: 0 -2px 6px 0 rgba($black, 0.2);
}

#qrcode {
  position: absolute;
  top: -35px;
  border: solid $white 10px;
  border-radius: 50%;
  box-shadow: 0 -4px 4px 2px rgba($black, 0.2);
}

.hidden {
  display: none;
}

.qr-scanner {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  margin-top: 50px;
  overflow: hidden;

  .qr-scanner-inner {
    position: absolute;
    top: 20px;
    right: 20px;
    bottom: 20px;
    left: 20px;
    z-index: 1;
    overflow: hidden;
    border: 3px solid white;

    h3 {
      position: absolute;
      top: 20px;
      right: 20px;
      color: white;
    }

    &::after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 20px;
      content: "";
      background-color: rgba(red, 0.5);
      box-shadow: 0 0 50px red;
      animation: scanning 5s infinite cubic-bezier(0.7, 0.3, 0.3, 0.7);
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
</style>
