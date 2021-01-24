<template>
  <div>
    Google Maps
    <br />
    <b>Map {{ mapCoords }}</b>
    <br />
    <b>User {{ userCoords }}</b>
    <GmapMap
      ref="mapRef"
      :center="mapCoords"
      :zoom="mapZoom"
      :options="{gestureHandling: 'greedy'}"
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
        label="Me"
        :position="userCoords"
        clickable
        @click="() => handleMarkerClick(userCoords, -1)"
      />

      <GmapMarker
        v-for="(marker, index) in markers"
        :key="index"
        :position="{ lat: Number(marker.lat), lng: Number(marker.lng) }"
        clickable
        @click="() => handleMarkerClick(marker, index)"
      />
      <div id="center-button" @click="centerMapToUser()">
        <img alt="My Location" class="my-location-icon" :src="myLocationIcon" />
      </div>
    </GmapMap>
  </div>
</template>

<script>
import Vue from "vue";
import myLocationIcon from "./../assets/my-location.png";

export default Vue.extend({
  data() {
    const { mapCoords, mapZoom, userCoords } = localStorage;
    return {
      myLocationIcon,
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
    },
    userCoords(newCoords) {
      localStorage.userCoords = JSON.stringify(newCoords);
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
    async fetchQRSpots() {
      const response = await fetch("/api/qrspots");
      this.markers = await response.json();
    },
    createMapElements() {
      /** Create button for centering position at user */
      const centerControlDiv = document.getElementById("center-button");
      const { RIGHT_BOTTOM } = google.maps.ControlPosition;
      this.map.controls[RIGHT_BOTTOM].push(centerControlDiv);
    },
    handleMarkerClick({ lat, lng, text }, index) {
      this.map.panTo(new google.maps.LatLng(lat, lng));
      this.infoWindow.coords = { lat: Number(lat), lng: Number(lng) };
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
      this.userCoords = { lat: coords.latitude, lng: coords.longitude };
    },
    centerMapToUser() {
      this.map.panTo(new google.maps.LatLng(this.userCoords));
    }
  }
});
</script>

<style lang="scss">
.vue-map-container {
  width: 100vw;
  height: 50vh;
}

#center-button {
  cursor: pointer;
  background-color: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  border-radius: 2px;
  width: 40px;
  height: 40px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  .my-location-icon {
    width: 70%;
  }
}
</style>
