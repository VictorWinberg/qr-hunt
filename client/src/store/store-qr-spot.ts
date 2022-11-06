import { EVENT_TYPE, QR_SPOT_PANEL, QR_SPOT_MODE } from "@/constants";
import { api } from "@/utils";
import Snackbar from "@/plugins/snackbar";
import EventBus from "@/plugins/event-bus";

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
    async prompt({ commit, dispatch }, { qrcode }) {
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
                dispatch("updateQrSpotLocation");
              }
            }
          ]
        },
        { root: true }
      );
    },
    select({ state, commit }, qrspot) {
      state.map?.panTo(new google.maps.LatLng(qrspot.lat, qrspot.lng));
      if (state.panel !== QR_SPOT_PANEL.SHOW_INFO) {
        state.map?.setZoom(state.map.getZoom() + 2);
        state.map?.setTilt(45);
      }
      commit("setQRSpot", qrspot);
      commit("setModalState", QR_SPOT_PANEL.SHOW_INFO);
    },
    deselect({ state, commit }) {
      if (state.panel !== QR_SPOT_PANEL.HIDE) {
        state.map?.setZoom(state.map.getZoom() - 2);
        state.map?.setTilt(0);
      }
      commit("setModalState", QR_SPOT_PANEL.HIDE);
      commit("setMode", QR_SPOT_MODE.VIEW);
    },
    async create({ state, commit }, payload) {
      const { data: qrspot, err } = await api.post("/api/qrspots", {
        body: JSON.stringify({ ...state.qrSpot, ...payload })
      });
      if (err) return;
      EventBus.$emit(EVENT_TYPE.QR_SPOTS_UPDATE);
      commit("setQRSpot", qrspot);
      commit("setMode", QR_SPOT_MODE.VIEW);
    },
    async edit({ state, commit }, payload) {
      const { data: qrspot, err } = await api.put(
        "/api/qrspots/" + state.qrSpot.id,
        {
          body: JSON.stringify({ ...state.qrSpot, ...payload })
        }
      );
      if (err) return;
      EventBus.$emit(EVENT_TYPE.QR_SPOTS_UPDATE);
      commit("setQRSpot", qrspot);
      commit("setMode", QR_SPOT_MODE.VIEW);
    },
    updateQrSpotLocation({ state, commit, dispatch }) {
      commit("setQRSpot", { ...state.qrSpot, lat: undefined, lng: undefined });

      navigator.geolocation.getCurrentPosition(
        async ({ coords }): Promise<void> => {
          const { qrSpot } = state;
          const { latitude: lat, longitude: lng } = coords;
          commit("setQRSpot", { ...qrSpot, lat, lng });
        },
        err => {
          Snackbar.err("GeolocationError: " + err.message + " - retrying ...");
          dispatch("updateQrSpotLocation");
        },
        {
          timeout: 10 * 1000,
          maximumAge: 10 * 1000
        }
      );
    }
  }
};
