<template>
  <div class="home">
    <h3>QR-Hunt</h3>
    <google-maps />
    <qr-scanner />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GoogleMaps from "./GoogleMaps.vue";
import QrScanner from "./QRScanner.vue";

export default Vue.extend({
  name: "Home",
  components: { GoogleMaps, QrScanner },
});
</script>

<style lang="scss">
h3 {
  margin: 40px 0 0;
}
</style>
