<template>
  <div class="current-spot-wrapper" :class="{ 'hide-info': hideCurrentSpot }">
    <div v-for="(value, key) in currentSpot" :key="key">
      <strong>{{ key }}: </strong>
      <span>{{ value || "N/A" }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "CurrentSpot",
  data() {
    return {};
  },
  computed: {
    hideCurrentSpot() {
      return !this.$store.getters.getShowSpotDetails;
    },
    currentSpot: {
      get() {
        return this.$store.getters.getCurrentSpot;
      },
      set(value) {
        this.$store.commit("setCurrentSpot", value);
      }
    }
  }
});
</script>

<style lang="scss">
.current-spot-wrapper {
  position: relative;
  flex: 3;
  height: 0px;
  transition: all 1s;
  box-shadow: 0 -2px 6px 0 rgba($black, 0.2);

  &.hide-info {
    flex: 0;
    transition: all 1s;
  }
}
</style>
