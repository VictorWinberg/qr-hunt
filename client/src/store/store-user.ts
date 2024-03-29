import { EVENT_TYPE } from "@/constants";
import EventBus from "@/plugins/event-bus";

const { userCoords } = localStorage;

export default {
  namespaced: true,
  state: () => ({
    user: {},
    coords: userCoords ? JSON.parse(userCoords) : null,
    isAuthenticated: false,
    status: "pending",
    leaderboard: null
  }),
  mutations: {
    setAuth(state, payload) {
      const { isAuthenticated = false, ...user } = payload;
      if (isAuthenticated) {
        state.isAuthenticated = true;
        state.status = "success";
        state.user = user;
      } else {
        state.isAuthenticated = false;
        state.status = "unauthenticated";
        state.user = {};
      }
      EventBus.$emit(EVENT_TYPE.AUTH_CHANGE, payload);
    },
    setCoords(state, { latitude, longitude }) {
      state.coords = { lat: latitude, lng: longitude };
      localStorage.userCoords = JSON.stringify(state.coords);
    },
    setLeaderboard(state, leaderboard) {
      state.leaderboard = leaderboard;
    }
  }
};
