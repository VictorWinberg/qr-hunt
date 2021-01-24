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
    <!-- dedugging QR Code -->
    <div>
      <label for="fname">WRITE QR-CODE: </label>
      <input id="fname" v-model="qrCodeTextField" type="text" name="fname" />
      <button @click="qrRead()">QR READ</button>
    </div>
    <!-- result of QR Scanner -->
    <h3>QR Code: <br />{{ qrCode }}</h3>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import QRCode from "qrcode";
import QRScanner from "qr-scanner";

// eslint-disable-next-line no-undef
QRScanner.WORKER_PATH = QrScannerWorkerPath;

interface Data {
  qrCode: string;
  qrCodeTextField: string;
  qrScanner?: QRScanner;
  qrTimeout: number;
  scanning: boolean;
}

export default Vue.extend({
  name: "QRScanner",
  data(): Data {
    return {
      qrCode: "",
      qrCodeTextField: "",
      qrScanner: undefined,
      qrTimeout: -1,
      scanning: false
    };
  },
  mounted() {
    QRCode.toCanvas(document.getElementById("qrcode"), "https://zolly.ml");

    this.qrScanner = new QRScanner(
      document.getElementById("qrscan") as HTMLVideoElement,
      (result: string) => {
        if (result) {
          //   this.emit ...
          this.qrCode = result;
          this.qrStop();
          clearTimeout(this.qrTimeout);
        }
      }
    );
  },
  methods: {
    qrScan() {
      this.qrScanner && this.qrScanner.start();
      this.scanning = true;
      this.qrTimeout = window.setTimeout(() => this.qrStop(), 10 * 1000);
    },
    qrStop() {
      this.qrScanner && this.qrScanner.stop();
      this.scanning = false;
    },
    async qrRead() {
      this.qrCode = this.qrCodeTextField;
      // const data = { comment: "Lovely!", score: 5, qrcode: this.qrCode }; // eslint-disable-line
      // const response = await fetch("/api/geocaches_collected", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify(data)
      // });
      // TODO: const result = await response.json();

      this.qrCodeTextField = "";
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

@keyframes scanning {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(100vh) translateY(-66px);
  }
}
</style>
