import Vue from "vue";
import Vuex from "vuex";

import moduleAuth from "./store-auth";
import moduleScan from "./store-scan";
import moduleModal from "./store-modal";
import moduleQRSpot from "./store-qr-spot";
import moduleAchievements from "./store-achievements";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth: moduleAuth,
    scan: moduleScan,
    modal: moduleModal,
    qrSpot: moduleQRSpot,
    achievements: moduleAchievements
  },
  state: {},
  getters: {},
  mutations: {},
  actions: {}
});
