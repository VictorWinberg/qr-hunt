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
      draggable: !showSpotDetails
    }"
    :class="showSpotDetails ? 'collapse-map' : 'expand-map'"
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
      label="Me"
      :position="userCoords"
      clickable
      @click="() => selectQRspot(userCoords, -1)"
    />

    <GmapMarker
      v-for="(marker, index) in markers"
      :key="index"
      :position="{ lat: Number(marker.lat), lng: Number(marker.lng) }"
      clickable
      @click="() => selectQRspot(marker, index)"
    />
    <div id="my-location-button" @click="centerMapToUser()">
      <img alt="My Location" class="my-location-icon" :src="myLocationIcon" />
    </div>
  </GmapMap>
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
  computed: {
    isMarkerSelected() {
      return this.markerSelected !== -1;
    },
    currentMarker() {
      return this.markers[this.markerSelected] || null;
    },
    currentMarkerTitle() {
      return this.currentMarker?.title || "";
    },
    currentMarkerRating() {
      return this.currentMarker?.rating || "N/A";
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
    showSpotDetails() {
      setTimeout(
        () =>
          this.map.panTo(
            new google.maps.LatLng(this.currentSpot.lat, this.currentSpot.lng)
          ),
        200
      );
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
      const centerControlDiv = document.getElementById("my-location-button");
      const { RIGHT_BOTTOM } = google.maps.ControlPosition;
      this.map.controls[RIGHT_BOTTOM].push(centerControlDiv);
    },
    selectQRspot({ lat, lng }, index) {
      this.map.panTo(new google.maps.LatLng(lat, lng));
      this.markerSelected = index;
      this.currentSpot = this.currentMarker;
      this.showSpotInfo = true;
    },
    deselectQRspot() {
      this.markerSelected = -1;
      this.showSpotInfo = false;
      this.showSpotDetails = false;
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
#center-button {
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
  width: 100vw;

  &.collapse-map {
    height: 30%;
    transition: all 300ms 200ms;

    .gmnoprint,
    #my-location-button {
      display: flex !important;
      opacity: 0;
    }
  }

  &.expand-map {
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
