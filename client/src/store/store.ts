import Vue from "vue";
import Vuex from "vuex";

import moduleAuth from "./store-auth";
import moduleScan from "./store-scan";
import modulePopup from "./store-popup";
import moduleQRSpot from "./store-qr-spot";
import moduleAchievements from "./store-achievements";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth: moduleAuth,
    scan: moduleScan,
    popup: modulePopup,
    qrSpot: moduleQRSpot,
    achievements: moduleAchievements
  },
  state: {},
  getters: {},
  mutations: {},
  actions: {}
});
