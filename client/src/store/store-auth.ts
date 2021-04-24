export default {
  namespaced: true,
  state: () => ({
    user: {},
    isAuthenticated: false,
    status: "pending"
  }),
  mutations: {
    setAuth(state, payload) {
      const { isAuthenticated = false, ...user } = payload;
      state.isAuthenticated = isAuthenticated;
      state.status = isAuthenticated ? "success" : "unauthenticated";
      state.user = isAuthenticated ? user : state.user;
    }
  }
};
