import { EVENT_TYPE, QR_SPOT_PANEL } from "@/constants";
import { api } from "@/utils";
import Snackbar from "@/plugins/snackbar";
import EventBus from "@/plugins/event-bus";

export default {
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
  },
  actions: {
    async handleQR({ commit, dispatch }, qrcode): Promise<void> {
      if (!qrcode) return Snackbar.warn("Warn: QR Code not caught on camera");

      const scanUrl = "/api/scan/" + encodeURIComponent(qrcode);
      const { data, err } = await api.get(scanUrl);
      if (err) return;
      if (!data.qrcode) return Snackbar.err("Error: 404 - Not found (QR Code)");

      // Create QR Spot
      if (!data.qrspot) {
        return dispatch("qrSpot/prompt", { qrcode }, { root: true });
      }

      // QR Spot exists
      dispatch("qrSpot/select", data.qrspot, { root: true });

      // Do you want to collect QR Code?
      if (data.collectable) {
        return commit(
          "popup/setPopup",
          {
            title: "Collect QR",
            subtitle: "Do you want to collect this QR Shard?",
            options: [
              {
                name: "Collect",
                type: "success",
                action: async () => {
                  const { err } = await api.post("/api/qrshards", {
                    body: JSON.stringify({
                      qrspotId: data.qrspot.id,
                      userCoords: JSON.parse(localStorage.userCoords || null)
                    })
                  });

                  if (err) return;
                  EventBus.$emit(EVENT_TYPE.QR_SPOTS_UPDATE);
                  commit("popup/setPopup", false, { root: true });
                  commit("qrSpot/setModalState", QR_SPOT_PANEL.SHOW_DETAILS, {
                    root: true
                  });
                }
              }
            ]
          },
          { root: true }
        );
      }

      // QR Code already collected
      commit(
        "popup/setPopup",
        {
          title: "Collect QR",
          subtitle: "QR Code is already collected for today",
          options: [{ name: "Collect", type: "disabled" }]
        },
        { root: true }
      );
    }
  }
};
