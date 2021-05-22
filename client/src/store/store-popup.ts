export default {
  namespaced: true,
  state: () => ({
    popup: false
  }),
  mutations: {
    setPopup(state, value) {
      state.popup = value;
    }
  }
};
