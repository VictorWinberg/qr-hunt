import Vue from "vue";
import Vuex from "vuex";

import moduleUser from "./store-user";
import moduleScan from "./store-scan";
import modulePopup from "./store-popup";
import moduleQRSpot from "./store-qr-spot";
import moduleAchievements from "./store-achievements";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user: moduleUser,
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
