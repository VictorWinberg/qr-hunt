import Vue from "vue";
import Vuex from "vuex";

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
  actions: {}
});
