<template>
  <GmapMap
    ref="mapRef"
    :center="mapCoords"
    :zoom="mapZoom"
    :options="{
      gestureHandling: 'greedy',
      zoomControl: false,
      scaleControl: false,
      rotateControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      clickableIcons: false,
      draggable: panel !== QR_SPOT_PANEL.SHOW_DETAILS,
      styles: [
        { featureType: 'poi.business', stylers: [{ visibility: 'off' }] }
      ]
    }"
    :class="
      panel == QR_SPOT_PANEL.SHOW_DETAILS ? 'collapsed-map' : 'expanded-map'
    "
    @click="deselect"
    @dragend="handleDrag"
    @zoom_changed="handleZoom"
  >
    <GmapInfoWindow
      :options="infoWindow.options"
      :position="infoWindow.coords"
      :opened="infoWindow.open"
      @closeclick="infoWindow.open = false"
    />

    <GmapMarker
      :position="userCoords"
      :icon="{
        url: require('@/assets/position-marker.svg'),
        anchor: { x: 12, y: 12 }
      }"
      @click="centerMapToUser"
    />

    <GmapCircle
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

    <div id="position-button" @click="centerMapToUser">
      <img
        alt="My Location"
        class="position-icon"
        :src="require('@/assets/position-button.svg')"
      />
    </div>
  </GmapMap>
</template>

<script>
import Vue from "vue";
import { mapState, mapMutations, mapActions } from "vuex";
import { EVENT_TYPE, QR_SPOT_MODE, QR_SPOT_PANEL } from "@/constants";
import { api, isToday } from "@/utils";
import EventBus from "@/store/event-bus";

export default Vue.extend({
  data() {
    const { mapCoords, mapZoom, userCoords } = localStorage;
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
      mapZoom: mapZoom ? Number(mapZoom) : 15,
      userCoords: userCoords ? JSON.parse(userCoords) : { lat: 0, lng: 0 },
      QR_SPOT_MODE,
      QR_SPOT_PANEL,
      markers: []
    };
  },
  computed: {
    ...mapState("qrSpot", ["map", "qrSpot", "mode", "panel"])
  },
  watch: {
    mapCoords(newCoords) {
      localStorage.mapCoords = JSON.stringify(newCoords);
    },
    mapZoom(newZoom) {
      localStorage.mapZoom = newZoom;
    },
    userCoords(newCoords) {
      localStorage.userCoords = JSON.stringify(newCoords);
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
  async mounted() {
    const map = await this.$refs.mapRef.$mapPromise;
    this.setMap(map);
    this.watchCurrentPosition();
    this.createMapElements();
  },
  methods: {
    ...mapMutations("qrSpot", [
      "setMap",
      "setQRSpot",
      "setMode",
      "setModalState"
    ]),
    ...mapActions("qrSpot", ["select", "deselect"]),
    async fetchQRSpots() {
      const { err, data } = await api.get("/api/qrspots");
      if (!err) this.markers = data;
    },
    createMapElements() {
      /** Create button for centering position at user */
      const centerControlDiv = document.getElementById("position-button");
      const { RIGHT_BOTTOM } = google.maps.ControlPosition;
      this.map.controls[RIGHT_BOTTOM].push(centerControlDiv);
    },
    handleDrag() {
      if (!this.map) return;
      const center = this.map.getCenter();
      this.mapCoords = { lat: center.lat(), lng: center.lng() };
    },
    handleZoom(zoom) {
      this.mapZoom = zoom;
    },
    watchCurrentPosition() {
      const watchOptions = {
        timeout: 60 * 60 * 1000,
        maxAge: 0,
        enableHighAccuracy: true
      };

      navigator.geolocation.getCurrentPosition(({ coords }) => {
        this.setCurrentPosition({ coords });
        this.centerMapToUser();
      });
      navigator.geolocation.watchPosition(
        this.setCurrentPosition,
        // eslint-disable-next-line no-console
        console.error,
        watchOptions
      );
    },
    getIcon({ collectedAt }) {
      if (!collectedAt) {
        return require("@/assets/qr-spot-marker--new.svg");
      }
      if (isToday(collectedAt)) {
        return require("@/assets/qr-spot-marker--used.svg");
      }
      return require("@/assets/qr-spot-marker--free.svg");
    },
    setCurrentPosition({ coords }) {
      this.userCoords = { lat: coords.latitude, lng: coords.longitude };
    },
    centerMapToUser() {
      this.map.panTo(new google.maps.LatLng(this.userCoords));
      if (this.map.zoom < 15) this.map.setZoom(15);
    }
  }
});
</script>

<style lang="scss">
#position-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-right: 10px;
  cursor: pointer;
  background-color: $white;
  border-radius: 2px;
  box-shadow: $shadow-color;

  .position-icon {
    width: 70%;
  }
}

.vue-map-container {
  &.collapsed-map {
    height: 25%;
    transition: all 300ms 200ms;

    .gmnoprint,
    #position-button {
      display: flex !important;
      opacity: 0;
    }
  }

  &.expanded-map {
    height: 100%;
    transition: all 300ms 0ms;

    .gmnoprint,
    #position-button {
      display: flex !important;
      opacity: 1;
      transition: opacity 200ms 500ms;
    }
  }
}
</style>
