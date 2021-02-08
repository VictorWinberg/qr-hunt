<template>
  <div class="home">
    <div class="map-wrapper">
      <GoogleMaps />
      <CurrentSpot />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import GoogleMaps from "./GoogleMaps.vue";
import CurrentSpot from "./CurrentSpot.vue";

export default Vue.extend({
  name: "Home",
  components: { GoogleMaps, CurrentSpot }
});
</script>

<style lang="scss">
.home {
  flex: 1;
}

.map-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
