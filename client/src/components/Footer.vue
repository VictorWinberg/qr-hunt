<template>
  <footer>
    <div class="footer-content"></div>
    <img
      id="qrcode"
      :src="require('@/assets/qr-scanner-button.svg')"
      @click="qrscan()"
    />
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
    ...mapMutations("scan", ["toggleScan"]),
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
  background: $primary-color;
  box-shadow: 0 -2px 6px 0 rgba($black, 0.2);
}

#qrcode {
  position: absolute;
  top: -50px;
  cursor: pointer;
  width: 130px;
  // border: solid $dark-brand-color 10px;
  border-radius: 50%;
  filter: drop-shadow(0 -4px 4px rgba($black, 0.75));
}
</style>
