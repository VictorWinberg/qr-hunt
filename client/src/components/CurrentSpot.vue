<template>
  <div
    class="qrspot-wrapper"
    :class="showSpotDetails ? 'large' : showSpotInfo ? 'small' : 'hide'"
  >
    <div class="qrspot-container" @click="toggle()">
      <div class="qrspot-title">{{ currentSpot.title }}</div>
      <div class="qrspot-info">
        <div class="qrspot-info__distance">
          <img alt="My Location" class="distance-icon" :src="distanceIcon" />
          <span>{{ distanceToMarker() }}</span>
        </div>
        <div class="qrspot-info__raiting">
          <img alt="Star" class="star-icon" :src="starIcon" />
          {{ currentSpot.rating || "N/A" }}
        </div>
      </div>
      <transition name="fade">
        <div v-if="showSpotDetails" class="qrspot-details">
          <div v-for="(value, key) in currentSpot" :key="key">
            <span
              ><b>{{ key }}: </b>{{ value }}</span
            >
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import distanceIcon from "./../assets/distance.png";
import starIcon from "./../assets/star.png";

const { userCoords } = localStorage;

export default Vue.extend({
  name: "CurrentSpot",
  data() {
    return {
      distanceIcon,
      starIcon,
      showDetails: false,
      userCoords: userCoords ? JSON.parse(userCoords) : { lat: 0, lng: 0 }
    };
  },
  computed: {
    hideCurrentSpot() {
      return !this.$store.getters.getShowSpotInfo;
    },
    currentSpot: {
      get() {
        return this.$store.getters.getCurrentSpot;
      },
      set(value) {
        this.$store.commit("setCurrentSpot", value);
      }
    },
    showSpotInfo: {
      get() {
        return this.$store.getters.getShowSpotInfo;
      },
      set(value) {
        this.$store.commit("setShowSpotInfo", value);
      }
    },
    showSpotDetails: {
      get() {
        return this.$store.getters.getShowSpotDetails;
      },
      set(value) {
        this.$store.commit("setShowSpotDetails", value);
      }
    }
  },
  methods: {
    toggle() {
      this.showSpotDetails = !this.showSpotDetails;
    },
    distanceToMarker() {
      const d = this.calculateDistance(this.userCoords, this.currentSpot);
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

  &.hide {
    right: 60px;
    bottom: -65px;
    left: 60px;
    height: 0;
    transition: bottom 500ms 0ms, left 0ms 500ms, right 0ms 500ms,
      height 500ms 0ms;
  }

  &.small {
    right: 60px;
    bottom: 24px;
    left: 60px;
    height: 90px;
    transition: all 300ms 200ms, height 500ms 0ms;
  }

  &.large {
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

  .distance-icon {
    height: 14px;
  }
}

.qrspot-info__raiting {
  padding: 0 10px;

  .star-icon {
    height: 14px;
  }
}
</style>
