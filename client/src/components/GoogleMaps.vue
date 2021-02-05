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
    :class="showSpotDetails ? 'hide-controls' : 'show-controls'"
    @click="mapClick"
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
    <div id="geocache-info">
      <transition name="fade">
        <div
          v-if="isMarkerSelected"
          class="geocache-info-container"
          @click="selectSpot(currentMarker)"
        >
          <div class="geocacho-info-title">{{ currentMarkerTitle }}</div>
          <div class="geocache-info-details">
            <div class="geocache-info-details-distance">
              <img
                alt="My Location"
                class="distance-icon"
                :src="distanceIcon"
              />
              {{ distanceToMarker() }}
            </div>
            <div class="geocache-info-details-raiting">
              <img alt="Star" class="star-icon" :src="starIcon" />
              {{ currentMarkerRating }}
            </div>
          </div>
        </div>
      </transition>
    </div>
  </GmapMap>
</template>

<script>
import Vue from "vue";
import distanceIcon from "./../assets/distance.png";
import myLocationIcon from "./../assets/my-location.png";
import starIcon from "./../assets/star.png";

export default Vue.extend({
  data() {
    const { mapCoords, mapZoom, userCoords } = localStorage;
    return {
      distanceIcon,
      myLocationIcon,
      starIcon,
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
    mapClick() {
      this.markerSelected = -1;
      this.showSpotDetails = false;
    },
    createMapElements() {
      /** Create button for centering position at user */
      const centerControlDiv = document.getElementById("center-button");
      const { RIGHT_BOTTOM } = google.maps.ControlPosition;
      this.map.controls[RIGHT_BOTTOM].push(centerControlDiv);

      /** Create information box */
      const informationBoxDiv = document.getElementById("geocache-info");
      const { BOTTOM } = google.maps.ControlPosition;
      this.map.controls[BOTTOM].push(informationBoxDiv);
    },
    selectSpot(value) {
      this.flag = !this.flag;
      if (!this.showSpotDetails) {
        this.currentSpot = value;
        setTimeout(
          () => this.handleMarkerClick(value, this.markerSelected),
          200
        );
        this.markerSelected = -1;
        this.showSpotDetails = true;
      }
    },
    handleMarkerClick({ lat, lng }, index) {
      this.map.panTo(new google.maps.LatLng(lat, lng));
      this.markerSelected = index;
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
    },
    distanceToMarker() {
      const d = this.calculateDistance(this.userCoords, this.currentMarker);
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

.vue-map-container {
  flex: 1;
  width: 100vw;
  height: 100%;

  &.hide-controls {
    .gmnoprint,
    #center-button {
      display: flex !important;
      opacity: 0;
    }
  }

  &.show-controls {
    .gmnoprint,
    #center-button {
      display: flex !important;
      opacity: 1;
      transition: opacity 200ms 1s;
    }
  }
}

#geocache-info {
  width: 100%;

  .geocache-info-container {
    height: 90px;
    margin: 0 60px 24px;
    cursor: pointer;
    background-color: $white;
    border-radius: 2px;
    box-shadow: $shadow-color;

    .geocacho-info-title {
      padding: 10px;
      font-size: 22px;
    }

    .geocache-info-details {
      display: flex;
      justify-content: center;
      max-width: 500px;
      margin: 0 auto;
      font-size: 14px;

      .geocache-info-details-distance {
        padding: 0 10px;

        .distance-icon {
          height: 14px;
        }
      }

      .geocache-info-details-raiting {
        padding: 0 10px;

        .star-icon {
          height: 14px;
        }
      }
    }
  }
}
</style>
