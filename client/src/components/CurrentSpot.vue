<template>
  <div class="qrspot-wrapper" :class="showQrSpot">
    <div
      class="qrspot-container"
      @click="setShowQrSpot(modalStateQRspot.SHOW_DETAILS)"
    >
      <div class="qrspot-title">{{ qrSpot.title }}</div>
      <div class="qrspot-info">
        <div class="qrspot-info__distance">
          <i class="fas fa-route"></i>
          <span>{{ distanceToMarker() }}</span>
        </div>
        <div class="qrspot-info__rating">
          <i class="far fa-star"></i>
          {{ qrSpot.rating || "N/A" }}
        </div>
      </div>
      <transition name="fade">
        <div
          v-if="showQrSpot === modalStateQRspot.SHOW_DETAILS"
          class="qrspot-details"
        >
          <div v-for="(value, key) in qrSpot" :key="key">
            <span>
              <b>{{ key }}: </b>{{ value }}
            </span>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapMutations } from "vuex";
import { modalStateQRspot } from "@/constans";

const { userCoords } = localStorage;

export default Vue.extend({
  name: "CurrentSpot",
  data() {
    return {
      userCoords: userCoords ? JSON.parse(userCoords) : { lat: 0, lng: 0 },
      modalStateQRspot
    };
  },
  computed: {
    ...mapState("qrSpot", ["qrSpot", "showQrSpot"])
  },
  methods: {
    ...mapMutations("qrSpot", ["setShowQrSpot"]),
    distanceToMarker() {
      const d = this.calculateDistance(this.userCoords, this.qrSpot);
      return d < 1000 ? d.toFixed(1) + " meter" : (d / 1000).toFixed(1) + " km";
    },
    calculateDistance({ lat: lat1, lng: lng1 }, { lat: lat2, lng: lng2 }) {
      const R = 6371e3;
      const φ1 = (lat1 * Math.PI) / 180;
      const φ2 = (lat2 * Math.PI) / 180;
      const Δφ = ((lat2 - lat1) * Math.PI) / 180;
      const Δλ = ((lng2 - lng1) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;
      return d;
    }
  }
});
</script>

<style lang="scss">
.qrspot-wrapper {
  position: absolute;
  box-shadow: 0 -2px 6px 0 rgba($black, 0.2);

  &.HIDE {
    right: 60px;
    bottom: -65px;
    left: 60px;
    height: 0;
    transition: bottom 500ms 0ms, left 0ms 500ms, right 0ms 500ms,
      height 500ms 0ms;
  }

  &.SHOW_INFO {
    right: 60px;
    bottom: 24px;
    left: 60px;
    height: 90px;
    transition: all 300ms 200ms, height 500ms 0ms;
  }

  &.SHOW_DETAILS {
    right: 0;
    bottom: 0;
    left: 0;
    height: 70%;
    transition: all 200ms 0ms, height 500ms;
  }
}

.qrspot-container {
  height: 100%;
  color: $black;
  cursor: pointer;
  background-color: $white;
  border-radius: 2px;
  box-shadow: $shadow-color;
}

.qrspot-title {
  padding: 10px;
  font-size: 22px;
}

.qrspot-info {
  display: flex;
  justify-content: center;
  max-width: 500px;
  margin: 0 auto;
  font-size: 14px;
}

.qrspot-info__distance {
  padding: 0 10px;
}

.qrspot-info__rating {
  padding: 0 10px;
}
</style>
