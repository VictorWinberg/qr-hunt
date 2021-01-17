<template>
  <div>
    Google Maps
    <br />
    <b>Map {{ mapCoords }}</b>
    <br />
    <b>User {{ user.coords }}</b>
    <gmap-map
      ref="mapRef"
      :center="mapCoords"
      :zoom="mapZoom"
      @dragend="handleDrag"
      @zoom_changed="handleZoom"
    >
      <gmap-info-window
        :options="infoWindow.options"
        :position="infoWindow.coords"
        :opened="infoWindow.open"
        @closeclick="infoWindow.open = false"
      />

      <gmap-marker
        label="Me"
        :position="user.coords"
        clickable
        @click="() => handleMarkerClick(user, -1)"
      />

      <gmap-marker
        v-for="(marker, index) in markers"
        :key="index"
        :position="{ lat: parseInt(marker.lat), lng: parseInt(marker.lng) }"
        clickable
        @click="() => handleMarkerClick(marker, index)"
      />
    </gmap-map>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  data() {
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
      mapCoords: { lat: 0, lng: 0 },
      mapZoom: 15,
      user: {
        text: "<strong>Hello I'm a info box</strong>",
        coords: { lat: 0, lng: 0 }
      },
      markerSelected: -1,
      markers: []
    };
  },
  watch: {
    mapCoords(newCoords) {
      localStorage.mapCoords = JSON.stringify(newCoords);
    },
    mapZoom(newZoom) {
      localStorage.mapZoom = newZoom;
    }
  },
  created() {
    if (localStorage.mapCoords) {
      this.mapCoords = JSON.parse(localStorage.mapCoords);
    }
    if (localStorage.mapZoom) {
      this.mapZoom = Number(localStorage.mapZoom);
    }
    this.fetchGeocaches();
  },
  async mounted() {
    this.map = await this.$refs.mapRef.$mapPromise;
    this.watchCurrentPosition();
  },
  methods: {
    handleMarkerClick({ coords, text }, index) {
      this.map.panTo(new google.maps.LatLng(coords.lat, coords.lng));
      this.infoWindow.coords = coords;
      this.infoWindow.options.content = text;

      if (this.markerSelected === index) {
        this.infoWindow.open = !this.infoWindow.open;
      } else {
        this.infoWindow.open = true;
        this.markerSelected = index;
      }
    },
    handleDrag() {
      if (!this.map) return;
      const center = this.map.getCenter();
      this.mapCoords = { lat: center.lat(), lng: center.lng() };
    },
    handleZoom(zoom) {
      this.mapZoom = zoom;
    },
    async fetchGeocaches() {
      const response = await fetch("/api/geocaches");
      this.markers = await response.json();
    },
    watchCurrentPosition() {
      const watchOptions = {
        timeout: 60 * 60 * 1000,
        maxAge: 0,
        enableHighAccuracy: true
      };

      navigator.geolocation.getCurrentPosition(({ coords }) => {
        this.map.panTo(
          new google.maps.LatLng(coords.latitude, coords.longitude)
        );
        this.setCurrentPosition({ coords });
      });
      navigator.geolocation.watchPosition(
        this.setCurrentPosition,
        // eslint-disable-next-line no-console
        console.error,
        watchOptions
      );
    },
    setCurrentPosition({ coords }) {
      this.user.coords = { lat: coords.latitude, lng: coords.longitude };
    }
  }
});
</script>

<style lang="scss">
.vue-map-container {
  width: 100vw;
  height: 50vh;
}
</style>
