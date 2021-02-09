<template>
  <footer>
    <div class="footer-content"></div>
    <canvas id="qrcode" @click="qrscan()"></canvas>
  </footer>
</template>

<script>
import Vue from "vue";
import { mapMutations } from "vuex";
import QRCode from "qrcode";

export default Vue.extend({
  name: "Footer",
  mounted() {
    const options = {
      margin: 0.5,
      width: 80
    };

    QRCode.toCanvas(
      document.getElementById("qrcode"),
      "https://zolly.ml",
      options
    );
  },
  methods: {
    ...mapMutations(["toggleScan"]),
    qrscan() {
      this.toggleScan();
    }
  }
});
</script>

<style lang="scss">
footer {
  position: relative;
  z-index: 6;
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
  cursor: pointer;
  border: solid $white 10px;
  border-radius: 50%;
  box-shadow: 0 -4px 4px 2px rgba($black, 0.2);
}
</style>
