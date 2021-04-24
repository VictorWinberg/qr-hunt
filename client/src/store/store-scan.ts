import { QR_SPOT_MODAL_STATE, QR_SPOT_MODE } from "@/constans";
import Snackbar from "@/plugins/snackbar";
import { api } from "@/utils";

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
    async handleQR(store, qrcode): Promise<void> {
      if (!qrcode) return Snackbar.err("QR Code not found");

      const { data, err } = await api.get("/api/scan/" + qrcode);
      if (err) return Snackbar.err(err);
      if (!data.qrcode)
        return Snackbar.err("Error: 404 - QR Code not available");

      // Create QR Spot
      if (!data.qrspot) {
        store.dispatch("qrSpot/init", { qrcode }, { root: true });
        return;
      }
      // Do you want to collect QR Code?
      if (!data.qrshard) {
        store.commit(
          "modal/setModal",
          {
            title: "Collect QR",
            subtitle: "Do you want to collect this QR shard?",
            options: [
              {
                name: "Collect",
                type: "success",
                action: async () => {
                  const { err } = await api.post("/api/qrshards", {
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    body: JSON.stringify({ qrspot_id: data.qrspot })
                  });
                  if (err) return Snackbar.err(err);
                  store.commit("modal/setModal", false);
                }
              }
            ]
          },
          { root: true }
        );
        return;
      }

      // QR Code already collected
      store.commit(
        "modal/setModal",
        {
          title: "Collect QR",
          subtitle: "QR Code is already collected",
          options: [{ name: "Collect", type: "disabled" }]
        },
        { root: true }
      );
    }
  }
};
