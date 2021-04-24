<template>
  <div class="qrspot-wrapper" :class="showQrSpot">
    <div
      class="qrspot-container"
      @click="setShowQrSpot(modalStateQRspot.SHOW_DETAILS)"
    >
      <div v-if="modeQrSpot === modeStateQRSpot.VIEW">
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
      </div>
      <transition name="fade">
        <div>
          <div v-if="modeQrSpot === modeStateQRSpot.CREATE">
            <h1>Create new Spot</h1>
            <form lass="form">
              <label for="title"
                >Create an awesome title for your new spot:</label
              >
              <input
                id="title"
                type="text"
                autocomplete="off"
                :value="qrSpot.title"
                @input="
                  e => setQrSpotValue({ key: 'title', value: e.target.value })
                "
              />

              <label for="note"
                >Tell your master plan behind this unique spot</label
              >
              <input
                id="note"
                type="text"
                autocomplete="off"
                :value="qrSpot.note"
                @input="
                  e => setQrSpotValue({ key: 'note', value: e.target.value })
                "
              />

              <label for="hint"
                >Do you want to give the searches a hint of where to find this
                treasure?</label
              >
              <input
                id="hint"
                type="text"
                autocomplete="off"
                :hint="qrSpot.hint"
                @input="
                  e => setQrSpotValue({ key: 'hint', value: e.target.value })
                "
              />

              <div v-if="loadingCoords">
                Loading amazing coordinates...
                <br />
                <img
                  alt="Loading..."
                  class="spinner-icon"
                  :src="require('@/assets/spinner.svg')"
                />
              </div>

              <button
                type="button"
                class="saveBtn"
                :class="{ disabled: loadingCoords }"
                @click="save"
              >
                Save Spot
              </button>
            </form>
          </div>
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
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapMutations } from "vuex";
import { modeStateQRSpot, modalStateQRspot } from "@/constans";

const { userCoords } = localStorage;

export default Vue.extend({
  name: "CurrentSpot",
  data() {
    return {
      userCoords: userCoords ? JSON.parse(userCoords) : { lat: 0, lng: 0 },
      loadingCoords: false,
      modeStateQRSpot,
      modalStateQRspot
    };
  },
  computed: {
    ...mapState("qrSpot", ["qrSpot", "modeQrSpot", "showQrSpot"])
  },
  methods: {
    ...mapMutations("qrSpot", ["setQrSpot", "setQrSpotValue", "setShowQrSpot"]),
    save() {
      this.$store.dispatch("createQRSpot");
    },
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
    height: 75%;
    transition: all 200ms 0ms, height 500ms;
  }
}

.qrspot-container {
  height: 100%;
  overflow: scroll;
  color: $black;
  cursor: pointer;
  background-color: $white;
  border-radius: 2px;
  box-shadow: $shadow-color;
  padding: 1em 1em 2em;
  box-sizing: border-box;
}

.qrspot-title {
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

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.saveBtn,
input[type="text"] {
  width: 100%;
  border: solid #bbbbbb 1px;
  padding: 0.5em;
  box-sizing: border-box;
  margin-bottom: 1em;
}

.saveBtn {
  background-color: green;
  color: white;

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

.spinner-icon {
  width: 50px;
  animation: spin 1500ms linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
