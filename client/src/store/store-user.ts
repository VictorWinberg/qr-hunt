import { EVENT_TYPE } from "@/constants";
import EventBus from "@/plugins/event-bus";

const { userCoords } = localStorage;

export default {
  namespaced: true,
  state: () => ({
    user: {},
    coords: userCoords ? JSON.parse(userCoords) : { lat: 0, lng: 0 },
    isAuthenticated: false,
    status: "pending",
    friends: [],
    leaderboard: []
  }),
  mutations: {
    setAuth(state, payload) {
      const { isAuthenticated = false, ...user } = payload;
      if (user.lvl > state.user.lvl)
        EventBus.$emit(EVENT_TYPE.LEVEL_UP, user.lvl);

      if (isAuthenticated) {
        state.isAuthenticated = true;
        state.status = "success";
        state.user = user;
      } else {
        state.isAuthenticated = false;
        state.status = "unauthenticated";
        state.user = {};
      }
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
