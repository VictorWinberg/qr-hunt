import { EVENT_TYPE, QR_SPOT_MODAL_STATE, QR_SPOT_MODE } from "@/constans";
import Snackbar from "@/plugins/snackbar";
import { api } from "@/utils";
import EventBus from "./event-bus";

const qrSpotGeolocation = store => {
  navigator.geolocation.getCurrentPosition(
    async ({ coords }): Promise<void> => {
      const { qrSpot } = store.state;
      const { latitude: lat, longitude: lng } = coords;
      store.commit("setQrSpot", {
        ...qrSpot,
        lat,
        lng
      });
    },
    err => {
      Snackbar.err("GeolocationError: " + err.message + " - retrying ...");
      qrSpotGeolocation(store);
    },
    {
      timeout: 10 * 1000,
      maximumAge: 10 * 1000
    }
  );
};

export default {
  namespaced: true,
  state: () => ({
    qrSpot: {},
    mode: QR_SPOT_MODE.VIEW,
    modalState: QR_SPOT_MODAL_STATE.HIDE
  }),
  mutations: {
    setQrSpot(state, value) {
      state.qrSpot = value;
    },
    setMode(state, value) {
      state.mode = value;
    },
    setModalState(state, value) {
      state.modalState = value;
    }
  },
  actions: {
    async init(store, { qrcode }) {
      store.commit("setQrSpot", { qrcode });
      store.commit(
        "modal/setModal",
        {
          title: "New QR Spot",
          subtitle: "Do you want to create a QR Spot?",
          options: [
            {
              name: "Create",
              type: "success",
              action: async () => {
                store.commit("modal/setModal", false, { root: true });
                store.commit("setMode", QR_SPOT_MODE.CREATE);
                store.commit("setModalState", QR_SPOT_MODAL_STATE.SHOW_DETAILS);
                qrSpotGeolocation(store);
              }
            }
          ]
        },
        { root: true }
      );
    },
    async create(store) {
      const { err } = await api.post("/api/qrspots", {
        body: JSON.stringify(store.state.qrSpot)
      });
      if (err) return Snackbar.err(err);
      EventBus.$emit(EVENT_TYPE.QR_SPOTS_UPDATE);
      store.commit("setMode", QR_SPOT_MODE.VIEW);
    },
    async edit(store) {
      const { err } = await api.put("/api/qrspots/" + store.state.qrSpot.id, {
        body: JSON.stringify(store.state.qrSpot)
      });
      if (err) return Snackbar.err(err);
      EventBus.$emit(EVENT_TYPE.QR_SPOTS_UPDATE);
      store.commit("setMode", QR_SPOT_MODE.VIEW);
    }
  }
};
