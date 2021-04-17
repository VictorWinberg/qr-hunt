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
      draggable: showQrSpot !== modalStateQRspot.SHOW_DETAILS,
      styles: [
        { featureType: 'poi.business', stylers: [{ visibility: 'off' }] }
      ]
    }"
    :class="
      showQrSpot == modalStateQRspot.SHOW_DETAILS
        ? 'collapsed-map'
        : 'expanded-map'
    "
    @click="deselectQRspot"
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
      clickable
      :icon="{
        url: require('@/assets/position-marker.svg'),
        anchor: { x: 12, y: 12 }
      }"
    />

    <GmapCircle
      :center="userCoords"
      :radius="20"
      :options="{
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
      :clickable="showQrSpot !== modalStateQRspot.SHOW_DETAILS"
      :icon="require('@/assets/qr-spot-marker.svg')"
      @click="() => selectQRspot(marker, index)"
    />
    <div id="my-location-button" @click="centerMapToUser()">
      <img
        alt="My Location"
        class="my-location-icon"
        :src="require('@/assets/my-location.svg')"
      />
    </div>
  </GmapMap>
</template>

<script>
import Vue from "vue";
import { mapState, mapMutations } from "vuex";
import { modalStateQRspot } from "@/constans";
import { api } from "@/utils";

export default Vue.extend({
  data() {
    const { mapCoords, mapZoom, userCoords } = localStorage;
    return {
      map: null,
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
      modalStateQRspot,
      markers: []
    };
  },
  computed: {
    ...mapState("qrSpot", ["qrSpot", "showQrSpot"])
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
    showQrSpot() {
      if (this.showQrSpot === modalStateQRspot.SHOW_DETAILS) {
        setTimeout(
          () =>
            this.map.panTo(
              new google.maps.LatLng(this.qrSpot.lat, this.qrSpot.lng)
            ),
          200
        );
      }
    }
  },
  created() {
    this.fetchQRSpots();
  },
  async mounted() {
    this.map = await this.$refs.mapRef.$mapPromise;
    this.watchCurrentPosition();
    this.createMapElements();
  },
  methods: {
    ...mapMutations("qrSpot", ["setQrSpot", "setShowQrSpot"]),
    async fetchQRSpots() {
      const { err, data } = await api.get("/api/qrspots");
      if (!err) this.markers = data;
    },
    createMapElements() {
      /** Create button for centering position at user */
      const centerControlDiv = document.getElementById("my-location-button");
      const { RIGHT_BOTTOM } = google.maps.ControlPosition;
      this.map.controls[RIGHT_BOTTOM].push(centerControlDiv);
    },
    selectQRspot(marker) {
      this.map.panTo(new google.maps.LatLng(marker.lat, marker.lng));
      this.setQrSpot(marker);
      this.setShowQrSpot(this.modalStateQRspot.SHOW_INFO);
    },
    deselectQRspot() {
      this.setQrSpot({});
      this.setShowQrSpot(this.modalStateQRspot.HIDE);
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
#my-location-button {
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

  .my-location-icon {
    width: 70%;
  }
}

.vue-map-container {
  &.collapsed-map {
    height: 30%;
    transition: all 300ms 200ms;

    .gmnoprint,
    #my-location-button {
      display: flex !important;
      opacity: 0;
    }
  }

  &.expanded-map {
    height: 100%;
    transition: all 300ms 0ms;

    .gmnoprint,
    #my-location-button {
      display: flex !important;
      opacity: 1;
      transition: opacity 200ms 500ms;
    }
  }
}
</style>
