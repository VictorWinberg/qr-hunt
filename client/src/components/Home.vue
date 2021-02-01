<template>
  <div class="home">
    <Header />
    <div class="map-wrapper">
      <google-maps />
      <CurrentSpot />
    </div>
    <qr-scanner />
  </div>
</template>

<script>
import Vue from "vue";
import Header from "./Header.vue";
import GoogleMaps from "./GoogleMaps.vue";
import QrScanner from "./QRScanner.vue";
import CurrentSpot from "./CurrentSpot.vue";

export default Vue.extend({
  name: "Home",
  components: { GoogleMaps, QrScanner, Header, CurrentSpot }
});
</script>

<style lang="scss">
.home {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.map-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
