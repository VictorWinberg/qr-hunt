import { EVENT_TYPE, QR_SPOT_PANEL } from "@/constants";
import Snackbar from "@/plugins/snackbar";
import { api } from "@/utils";
import EventBus from "./event-bus";

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
      if (!qrcode) return Snackbar.err("QR Code not found");

      const scanUrl = "/api/scan/" + encodeURIComponent(qrcode);
      const { data, err } = await api.get(scanUrl);
      if (err) return Snackbar.err(err);
      if (!data.qrcode)
        return Snackbar.err("Error: 404 - QR Code not available");

      // Create QR Spot
      if (!data.qrspot) {
        return dispatch("qrSpot/init", { qrcode }, { root: true });
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
                    body: JSON.stringify({ qrspotId: data.qrspot.id })
                  });
                  if (err) return Snackbar.err(err);
                  EventBus.$emit(EVENT_TYPE.QR_SPOTS_UPDATE);
                  commit("popup/setPopup", false, { root: true });
                  commit("qrSpot/setModalState", QR_SPOT_PANEL.SHOW_DETAILS, {
                    root: true
                  });

                  const user = await api.get("/api/user");
                  if (!user.err) {
                    commit("user/setAuth", user.data, { root: true });
                  }
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
