import Vue from "vue";
import Vuex from "vuex";
import { modeStateQRSpot, modalStateQRspot } from "@/constans";
import Snackbar from "@/plugins/snackbar";
import { api } from "@/utils";

Vue.use(Vuex);

const moduleAuth = {
  namespaced: true,
  state: () => ({
    user: {},
    isAuthenticated: false,
    status: "pending"
  }),
  mutations: {
    setAuth(state, payload) {
      const { isAuthenticated = false, ...user } = payload;
      state.isAuthenticated = isAuthenticated;
      state.status = isAuthenticated ? "success" : "unauthenticated";
      state.user = isAuthenticated ? user : state.user;
    }
  }
};

const moduleAchievements = {
  namespaced: true,
  state: () => ({
    achievements: [{}, {}]
  }),
  mutations: {
    setAchievements(state, achievements) {
      state.achievements = achievements;
    }
  }
};

const moduleScan = {
  namespaced: true,
  state: () => ({
    scanning: false
  }),
  mutations: {
    toggleScan(state) {
      state.scanning = !state.scanning;
    },
    stopScan(state) {
      state.scanning = false;
    }
  }
};

const moduleModal = {
  namespaced: true,
  state: () => ({
    modal: false
  }),
  mutations: {
    setModal(state, value) {
      state.modal = value;
    }
  }
};

const moduleQrSpot = {
  namespaced: true,
  state: () => ({
    qrSpot: {},
    modeQrSpot: modeStateQRSpot.VIEW,
    showQrSpot: modalStateQRspot.HIDE
  }),
  mutations: {
    setQrSpot(state, value) {
      state.qrSpot = value;
    },
    setQrSpotValue(state, object) {
      state.qrSpot[object.key] = object.value;
    },
    setModeQrSpot(state, value) {
      state.modeQrSpot = value;
    },
    setShowQrSpot(state, value) {
      state.showQrSpot = value;
    }
  }
};

export default new Vuex.Store({
  modules: {
    auth: moduleAuth,
    scan: moduleScan,
    modal: moduleModal,
    qrSpot: moduleQrSpot,
    achievements: moduleAchievements
  },
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async collect(state, qrcode) {
      const comment = prompt("Enter a comment", "Placeholder");
      // const { data: qrshard, err } = await api.post("/api/qrshards", {
      //   body: JSON.stringify({ comment, rating: 5, qrcode })
      // });
      // alert(qrshard);
    },
    async createQRSpot(store: any) {
      const { data: res, err } = await api.post("/api/qrspots", {
        body: JSON.stringify(store.state.qrSpot.qrSpot)
      });
      store.commit("qrSpot/setModeQrSpot", modeStateQRSpot.VIEW);
    },
    async handleQR(store, qrcode): Promise<void> {
      if (!qrcode) return Snackbar.err("QR Code not found");

      const { data, err } = await api.get("/api/scan/" + qrcode);
      if (err) return Snackbar.err(err);
      if (!data.qrcode)
        return Snackbar.err("Error: 404 - QR Code not available");

      // Create QR Spot
      if (!data.qrspot) {
        store.commit("modal/setModal", {
          title: "New QR Spot",
          subtitle: "Do you want to create a QR Spot?",
          options: [
            {
              name: "Create",
              type: "success",
              action: async () => {
                store.commit("modal/setModal", false);
                store.commit("qrSpot/setModeQrSpot", modeStateQRSpot.CREATE);
                store.commit(
                  "qrSpot/setShowQrSpot",
                  modalStateQRspot.SHOW_DETAILS
                );
                // store.commit("qrSpot/setShowQrSpot", modalStateQRspot.SHOW_DETAILS);
                // const title = prompt("Enter a title", "Placeholder");
                // navigator.geolocation.getCurrentPosition(
                //   async ({ coords }): Promise<void> => {
                //     const { latitude: lat, longitude: lng } = coords;
                //     const { data: qrspot, err } = await api.post(
                //       "/api/qrspots",
                //       {
                //         body: JSON.stringify({ title, lat, lng, qrcode })
                //       }
                //     );
                //   }
                // );
              }
            }
          ]
        });
        return;
      }
      // Do you want to collect QR Code?
      if (!data.qrshard) {
        store.commit("modal/setModal", {
          title: "Collect QR",
          subtitle: "Do you want to collect this QR shard?",
          options: [
            {
              name: "Collect",
              type: "success",
              action: async () => {
                const { data: qrshard, err } = await api.post("/api/qrshards", {
                  // eslint-disable-next-line @typescript-eslint/camelcase
                  body: JSON.stringify({ qrspot_id: data.qrspot })
                });
                store.commit("modal/setModal", false);
              }
            }
          ]
        });
        return;
      }
      // QR Code already collected
      store.commit("modal/setModal", {
        title: "Collect QR",
        subtitle: "QR Code is already collected",
        options: [{ name: "Collect", type: "disabled" }]
      });
    }
  }
});
