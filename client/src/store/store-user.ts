const { userCoords } = localStorage;

export default {
  namespaced: true,
  state: () => ({
    user: {},
    coords: userCoords ? JSON.parse(userCoords) : { lat: 0, lng: 0 },
    isAuthenticated: false,
    status: "pending"
  }),
  mutations: {
    setAuth(state, payload) {
      const { isAuthenticated = false, ...user } = payload;
      state.isAuthenticated = isAuthenticated;
      state.status = isAuthenticated ? "success" : "unauthenticated";
      state.user = isAuthenticated ? user : state.user;
    },
    setCoords(state, { latitude, longitude }) {
      state.coords = { lat: latitude, lng: longitude };
      localStorage.userCoords = JSON.stringify(state.coords);
    }
  }
};
