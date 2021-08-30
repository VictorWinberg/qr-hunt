import Vue from "vue";
import Vuex from "vuex";

import moduleUser from "./store-user";
import moduleScan from "./store-scan";
import modulePopup from "./store-popup";
import moduleQRSpot from "./store-qr-spot";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user: moduleUser,
    scan: moduleScan,
    popup: modulePopup,
    qrSpot: moduleQRSpot
  },
  state: {},
  getters: {},
  mutations: {},
  actions: {}
});
