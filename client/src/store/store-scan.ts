import { QR_SPOT_MODAL_STATE } from "@/constants";
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
    async handleQR({ commit, dispatch }, qrcode): Promise<void> {
      if (!qrcode) return Snackbar.err("QR Code not found");

      const { data, err } = await api.get("/api/scan/" + qrcode);
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
          "modal/setModal",
          {
            title: "Collect QR",
            subtitle: "Do you want to collect this QR Shard?",
            options: [
              {
                name: "Collect",
                type: "success",
                action: async () => {
                  const { err } = await api.post("/api/qrshards", {
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    body: JSON.stringify({ qrspot_id: data.qrspot.id })
                  });
                  if (err) return Snackbar.err(err);
                  commit("modal/setModal", false, { root: true });
                  commit(
                    "qrSpot/setModalState",
                    QR_SPOT_MODAL_STATE.SHOW_DETAILS,
                    { root: true }
                  );

                  const user = await api.get("/api/user");
                  if (!user.err) {
                    commit("auth/setAuth", user.data, { root: true });
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
        "modal/setModal",
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
