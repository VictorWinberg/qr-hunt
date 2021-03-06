import { EVENT_TYPE, QR_SPOT_PANEL, QR_SPOT_MODE } from "@/constants";
import Snackbar from "@/plugins/snackbar";
import EventBus from "@/plugins/event-bus";
import { api } from "@/utils";

const qrSpotGeolocation = ({ state, commit }) => {
  navigator.geolocation.getCurrentPosition(
    async ({ coords }): Promise<void> => {
      const { qrSpot } = state;
      const { latitude: lat, longitude: lng } = coords;
      commit("setQRSpot", { ...qrSpot, lat, lng });
    },
    err => {
      Snackbar.err("GeolocationError: " + err.message + " - retrying ...");
      qrSpotGeolocation({ state, commit });
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
    map: null,
    qrSpot: {},
    mode: QR_SPOT_MODE.VIEW,
    panel: QR_SPOT_PANEL.HIDE
  }),
  mutations: {
    setMap(state, value) {
      state.map = value;
    },
    setQRSpot(state, value) {
      state.qrSpot = value;
    },
    setMode(state, value) {
      state.mode = value;
    },
    setModalState(state, value) {
      state.panel = value;
    }
  },
  actions: {
    async init({ state, commit }, { qrcode }) {
      commit("setQRSpot", { qrcode });
      commit(
        "popup/setPopup",
        {
          title: "New QR Spot",
          subtitle: "Do you want to create a QR Spot?",
          options: [
            {
              name: "Create",
              type: "success",
              action: async () => {
                commit("popup/setPopup", false, { root: true });
                commit("setMode", QR_SPOT_MODE.CREATE);
                commit("setModalState", QR_SPOT_PANEL.SHOW_DETAILS);
                qrSpotGeolocation({ state, commit });
              }
            }
          ]
        },
        { root: true }
      );
    },
    select({ state, commit }, qrspot) {
      commit("setQRSpot", qrspot);
      commit("setModalState", QR_SPOT_PANEL.SHOW_INFO);
      state.map.panTo(new google.maps.LatLng(qrspot.lat, qrspot.lng));
    },
    deselect({ commit }) {
      commit("setModalState", QR_SPOT_PANEL.HIDE);
      commit("setMode", QR_SPOT_MODE.VIEW);
    },
    async create({ state, commit }) {
      const { data: qrspot, err } = await api.post("/api/qrspots", {
        body: JSON.stringify(state.qrSpot)
      });
      if (err) return Snackbar.err(err);
      EventBus.$emit(EVENT_TYPE.QR_SPOTS_UPDATE);
      commit("setQRSpot", qrspot);
      commit("setMode", QR_SPOT_MODE.VIEW);
    },
    async edit({ state, commit }) {
      const { data: qrspot, err } = await api.put(
        "/api/qrspots/" + state.qrSpot.id,
        {
          body: JSON.stringify(state.qrSpot)
        }
      );
      if (err) return Snackbar.err(err);
      EventBus.$emit(EVENT_TYPE.QR_SPOTS_UPDATE);
      commit("setQRSpot", qrspot);
      commit("setMode", QR_SPOT_MODE.VIEW);
    }
  }
};
