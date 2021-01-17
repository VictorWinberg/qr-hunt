<template>
  <div>
    Google Maps
    <br />
    <h3>{{ coords }}</h3>
    <gmap-map
      ref="mapRef"
      :center="coords"
      :zoom="10"
      :style="{ width: '500px', height: '500px', margin: 'auto' }"
      @dragend="handleDrag"
    >
      <gmap-info-window
        :options="infoWindow.options"
        :position="infoWindow.pos"
        :opened="infoWindow.open"
        @closeclick="infoWindow.open = false"
      />

      <gmap-marker
        label="User"
        :position="user.pos"
        clickable
        @click="() => handleMarkerClick(user, -1)"
      />

      <gmap-marker
        v-for="(marker, index) in markers"
        :key="index"
        :position="{lat: parseInt(marker.lat), lng: parseInt(marker.lng)}"
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
        pos: null,
        open: false,
        options: {
          content: "",
          pixelOffset: {
            width: 0,
            height: -35
          }
        }
      },
      coords: { lat: 0, lng: 0 },
      user: { text: "<strong>User</strong>", pos: { lat: 0, lng: 0 } },
      markerSelected: -1,
      markers: [],
    };
  },
  watch: {
    coords(newCoords) {
      localStorage.coords = JSON.stringify(newCoords);
    }
  },
  created() {
    if (localStorage.coords) {
      this.coords = JSON.parse(localStorage.coords);
    }
    this.fetchGeocaches();
  },
  mounted() {
    this.$refs.mapRef.$mapPromise.then(map => (this.map = map));

    navigator.geolocation.getCurrentPosition(({ coords }) => {
      this.user.pos = { lat: coords.latitude, lng: coords.longitude };
      this.coords = this.user.pos;
    });
  },
  methods: {
    handleMarkerClick({ pos, text }, index) {
      this.coords = pos;
      this.infoWindow.pos = pos;
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
      this.coords = { lat: center.lat(), lng: center.lng() };
    },
    async fetchGeocaches() {
      const response = await fetch("/api/geocaches");
      this.markers = await response.json();
    }
  }
});
</script>

<style></style>
