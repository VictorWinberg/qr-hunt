<template>
  <GmapMap
    ref="mapRef"
    :center="mapCoords"
    :zoom="mapZoom"
    :options="{
      mapId: '153063bbe11287f1',
      gestureHandling: 'greedy',
      zoomControl: true,
      zoomControlOptions: { position: 3 },
      scaleControl: false,
      rotateControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      clickableIcons: false,
      draggable: panel !== QR_SPOT_PANEL.SHOW_DETAILS
    }"
    :class="
      panel == QR_SPOT_PANEL.SHOW_DETAILS ? 'collapsed-map' : 'expanded-map'
    "
    @click="deselect"
    @dragend="handleDrag"
    @zoom_changed="handleZoom"
    @heading_changed="heading => (mapHeading = heading)"
    @tilt_changed="tilt => (mapTilt = tilt)"
  >
    <GmapInfoWindow
      :options="infoWindow.options"
      :position="infoWindow.coords"
      :opened="infoWindow.open"
      @closeclick="infoWindow.open = false"
    />

    <GmapMarker
      v-if="userCoords"
      :position="userCoords"
      :z-index="100"
      :icon="{
        url: require('@/assets/position-marker.svg'),
        anchor: { x: 12, y: 12 }
      }"
      @click="centerMapToUser"
    />
    <GmapMarker
      v-else
      :position="{ lat: 0, lng: 0 }"
      :z-index="100"
      :icon="{
        url: require('@/assets/spinner.svg'),
        anchor: { x: 50, y: 50 },
        scaledSize: { width: 100, height: 100 }
      }"
      :label="{
        text: 'Please enable location access',
        fontSize: '1rem',
        color: '#242424'
      }"
      @click="centerMapToUser"
    />

    <GmapCircle
      v-if="userCoords"
      :center="userCoords"
      :radius="20"
      :options="{
        clickable: false,
        fillColor: '#0042FF',
        fillOpacity: '0.15',
        strokeColor: '#FFFFFF',
        strokeOpacity: '0.5',
        strokeWeight: '2'
      }"
    />

    <GmapMarker
      v-for="(marker, index) in markers"
      :key="index"
      :position="{ lat: Number(marker.lat), lng: Number(marker.lng) }"
      :clickable="panel !== QR_SPOT_PANEL.SHOW_DETAILS"
      :icon="getIcon(marker)"
      @click="() => select(marker)"
    />

    <GmapCircle
      v-for="(marker, index) in markers"
      :key="`${index}-c`"
      :center="{ lat: Number(marker.lat), lng: Number(marker.lng) }"
      :radius="15"
      :options="{
        clickable: false,
        fillColor: '#54341f',
        fillOpacity: '0.2',
        strokeColor: '#54341f',
        strokeOpacity: '0.5',
        strokeWeight: '2'
      }"
    />

    <GmapMarker
      v-for="(marker, index) in recent(markers)"
      :key="`${index}-o`"
      :position="{ lat: Number(marker.lat), lng: Number(marker.lng) }"
      :clickable="false"
      :icon="{
        url: require('@/assets/puff.svg'),
        anchor: { x: 32, y: 32 },
        scaledSize: { width: 64, height: 64 }
      }"
    />

    <div id="streak-button" class="control-button" @click="centerMapToUser">
      <div class="control-button__streak" :class="{ 'no-streak': !showStreak }">
        <i class="fas fa-egg fa-2x"></i>
        <i class="fas fa-flame fa-3x"></i>
        <p v-if="showStreak" class="control-button__streak__count">
          {{ user.streak }}
        </p>
      </div>
    </div>

    <div id="position-button" class="control-button" @click="centerMapToUser">
      <img
        alt="My Location"
        class="control-button__icon"
        :src="require('@/assets/position-button.svg')"
      />
    </div>

    <div id="compass-button" class="control-button" @click="resetHeading">
      <div
        class="control-button__inner"
        :style="`transform: rotateX(-${mapTilt}deg)`"
      >
        <img
          :style="`transform: rotate(-${mapHeading}deg)`"
          alt="Compass"
          class="control-button__icon"
          :src="require('@/assets/compass.svg')"
        />
      </div>
    </div>
  </GmapMap>
</template>

<script>
import Vue from "vue";
import { mapState, mapMutations, mapActions } from "vuex";
import { EVENT_TYPE, QR_SPOT_MODE, QR_SPOT_PANEL } from "@/constants";
import { api } from "@/utils";
import EventBus from "@/plugins/event-bus";
import dayjs from "@/plugins/dayjs";

export default Vue.extend({
  data() {
    const { mapCoords, mapZoom } = localStorage;
    return {
      infoWindow: {
        coords: null,
        open: false,
        options: {
          content: "",
          pixelOffset: {
            width: 0,
            height: -35
          }
        }
      },
      mapCoords: mapCoords ? JSON.parse(mapCoords) : { lat: 0, lng: 0 },
      mapZoom: mapZoom ? Number(mapZoom) : 14,
      mapHeading: 0,
      mapTilt: 0,
      QR_SPOT_MODE,
      QR_SPOT_PANEL,
      markers: [],
      zoomChange: -1
    };
  },
  computed: {
    ...mapState("qrSpot", ["map", "qrSpot", "mode", "panel"]),
    ...mapState("user", ["user"]),
    ...mapState({ userCoords: state => state.user.coords }),
    showStreak() {
      return this.user.streak > 2;
    }
  },
  watch: {
    mapCoords(newCoords) {
      localStorage.setItem("mapCoords", JSON.stringify(newCoords));
    },
    mapZoom(newZoom) {
      localStorage.setItem("mapZoom", newZoom);
    },
    panel() {
      if (this.panel === QR_SPOT_PANEL.SHOW_DETAILS) {
        const position =
          this.mode === this.QR_SPOT_MODE.CREATE
            ? this.userCoords
            : this.qrSpot;
        setTimeout(
          () =>
            this.map.panTo(new google.maps.LatLng(position.lat, position.lng)),
          200
        );
      }
    }
  },
  created() {
    this.fetchQRSpots();
    EventBus.$on(EVENT_TYPE.QR_SPOTS_UPDATE, this.fetchQRSpots);
  },
  beforeDestroy() {
    EventBus.$off(EVENT_TYPE.QR_SPOTS_UPDATE, this.fetchQRSpots);
  },
  async mounted() {
    const map = await this.$refs.mapRef.$mapPromise;
    this.setMap(map);
    this.watchCurrentPosition();
    this.createMapElements();
  },
  methods: {
    ...mapMutations("qrSpot", ["setMap"]),
    ...mapMutations("user", ["setCoords"]),
    ...mapActions("qrSpot", ["select", "deselect"]),
    async fetchQRSpots() {
      const qrspots = await api.get("/api/qrspots");
      if (!qrspots.err) this.markers = qrspots.data;
    },
    createMapElements() {
      /** Create button for centering position at user */
      const {
        TOP_LEFT,
        RIGHT_BOTTOM,
        LEFT_BOTTOM
      } = google.maps.ControlPosition;
      const myStreak = document.getElementById("streak-button");
      const positionControl = document.getElementById("position-button");
      const compassControl = document.getElementById("compass-button");

      this.map.controls[LEFT_BOTTOM].push(myStreak);
      this.map.controls[RIGHT_BOTTOM].push(positionControl);
      this.map.controls[TOP_LEFT].push(compassControl);
    },
    handleDrag() {
      if (!this.map) return;
      const center = this.map.getCenter();
      this.mapCoords = { lat: center.lat(), lng: center.lng() };
    },
    handleZoom(zoom) {
      clearTimeout(this.zoomChange);
      this.zoomChange = setTimeout(() => {
        this.mapZoom = zoom;
      }, 1000);
    },
    watchCurrentPosition() {
      const watchOptions = {
        timeout: 60 * 60 * 1000,
        maxAge: 0,
        enableHighAccuracy: true
      };

      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.setCoords(coords);
          this.centerMapToUser({ zoom: false });
        },
        // eslint-disable-next-line no-console
        console.error,
        watchOptions
      );
      navigator.geolocation.watchPosition(
        ({ coords }) => this.setCoords(coords),
        // eslint-disable-next-line no-console
        console.error,
        watchOptions
      );
    },
    getIcon({ collectedAt }) {
      if (!collectedAt) {
        return require("@/assets/qr-spot-marker--new.svg");
      }
      if (dayjs().isSame(collectedAt, "day")) {
        return require("@/assets/qr-spot-marker--used.svg");
      }
      return require("@/assets/qr-spot-marker--free.svg");
    },
    centerMapToUser({ zoom = true }) {
      if (!this.userCoords) return;
      this.map.panTo(new google.maps.LatLng(this.userCoords));
      localStorage.setItem("mapCoords", JSON.stringify(this.userCoords));
      if (zoom && this.map.zoom < 15) this.map.setZoom(15);
    },
    resetHeading() {
      if (this.mapHeading === 0 && this.mapTilt === 0) {
        this.map.setTilt(45);
      } else {
        this.map.setHeading(0);
        this.map.setTilt(0);
      }
    },
    recent(markers) {
      return markers.filter(m =>
        dayjs()
          .subtract(1, "day")
          .isBefore(m.lastVisitedAt)
      );
    }
  }
});
</script>

<style lang="scss">
.control-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin: 10px 10px 0 10px;
  cursor: pointer;
  background-color: $white;
  border-radius: 2px;
  box-shadow: $shadow-color;
}

.control-button__inner {
  transition: transform 500ms;
}

.control-button__icon {
  width: 70%;
}

.control-button__streak {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  &.no-streak {
    filter: opacity(0.1);
  }
}

.control-button__streak__count {
  position: absolute;
  bottom: 0.25em;
  font-family: "Syne", sans-serif;
  font-size: 200%;
  line-height: 1;
  color: $primary-color;
  text-shadow: -1px -1px 1px #24242485;
}

.test {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.fa-flame {
  position: absolute;
  color: #df5632;
}

.fa-egg {
  position: absolute;
  top: 12px;
  color: #f6c243;
}

.vue-map-container {
  &.collapsed-map {
    height: 25%;
    transition: all 300ms 200ms;

    .gmnoprint,
    #streak-button,
    #position-button {
      display: flex !important;
      opacity: 0;
    }
  }

  &.expanded-map {
    height: 100%;
    transition: all 300ms 0ms;

    .gmnoprint,
    #streak-button,
    #position-button {
      display: flex !important;
      opacity: 1;
      transition: opacity 200ms 500ms;
    }
  }
}
</style>
