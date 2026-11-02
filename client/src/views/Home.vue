<template>
  <div class="home">
    <div class="map-wrapper">
      <GoogleMaps />
      <RoutePlanner />
      <QRSpot />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import GoogleMaps from "../components/GoogleMaps.vue";
import RoutePlanner from "../components/RoutePlanner.vue";
import QRSpot from "../components/QRSpot.vue";

export default Vue.extend({
  name: "Home",
  components: { GoogleMaps, RoutePlanner, QRSpot }
});
</script>

<style lang="scss">
.home {
  flex: 1;
  overflow: hidden;
}

.map-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
