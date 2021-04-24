export default {
  namespaced: true,
  state: () => ({
    modal: false
  }),
  mutations: {
    setModal(state, value) {
      state.modal = value;
    }
  }
};
