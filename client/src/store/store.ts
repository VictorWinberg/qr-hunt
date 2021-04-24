import Vue from "vue";
import Vuex from "vuex";

import moduleAuth from "./store-auth";
import moduleScan from "./store-scan";
import moduleModal from "./store-modal";
import moduleQrSpot from "./store-qr-spot";
import moduleAchievements from "./store-achievements";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth: moduleAuth,
    scan: moduleScan,
    modal: moduleModal,
    qrSpot: moduleQrSpot,
    achievements: moduleAchievements
  },
  state: {} as any,
  getters: {},
  mutations: {},
  actions: {
    async collect(state, qrcode) {
      const comment = prompt("Enter a comment", "Placeholder");
      // const { data: qrshard, err } = await api.post("/api/qrshards", {
      //   body: JSON.stringify({ comment, rating: 5, qrcode })
      // });
      // alert(qrshard);
    }
  }
});
