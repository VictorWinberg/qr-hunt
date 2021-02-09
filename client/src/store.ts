import Vue from "vue";
import Vuex from "vuex";
import Snackbar from "@/plugins/snackbar";
import { customFetch } from "@/plugins/custom-fetch";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentSpot: {},
    showSpotInfo: false,
    showSpotDetails: false,
    scanning: false
  },
  getters: {
    getCurrentSpot(state) {
      return state.currentSpot;
    },
    getShowSpotInfo(state) {
      return state.showSpotInfo;
    },
    getShowSpotDetails(state) {
      return state.showSpotDetails;
    }
  },
  mutations: {
    setCurrentSpot(state, value) {
      state.currentSpot = value;
    },
    setShowSpotInfo(state, value) {
      state.showSpotInfo = value;
    },
    setShowSpotDetails(state, value) {
      state.showSpotDetails = value;
    },
    toggleScan(state) {
      state.scanning = !state.scanning;
    },
    stopScan(state) {
      state.scanning = false;
    }
  },
  actions: {
    async handleQR(state, qrcode): Promise<void> {
      if (!qrcode) return Snackbar.err("QR Code not found");

      const { data, err } = await customFetch("/api/scan/" + qrcode);
      if (err) return Snackbar.err(err);
      if (!data.qrcode)
        return Snackbar.err("Error: 404 - QR Code not available");
      if (!data.qrspot) {
        if (confirm("Do you want to create a QR Spot?")) {
          const title = prompt("Enter a title", "Placeholder");
          navigator.geolocation.getCurrentPosition(
            async ({ coords }): Promise<void> => {
              const { latitude: lat, longitude: lng } = coords;
              const { data: qrspot, err } = await customFetch("/api/qrspots", {
                method: "POST",
                body: JSON.stringify({ title, lat, lng, qrcode })
              });
              alert(qrspot);
            }
          );
        }
        return;
      }
      // TODO: Do you want to deactivate QR Spot?
      if (!data.qrshard) {
        if (confirm("Collect QR?")) {
          const comment = prompt("Enter a comment", "Placeholder");
          const { data: qrshard, err } = await customFetch("/api/qrshards", {
            method: "POST",
            body: JSON.stringify({ comment, rating: 5, qrcode })
          });
          alert(qrshard);
        }
        return;
      }
      alert("QR Code is already collected");
    }
  }
});
