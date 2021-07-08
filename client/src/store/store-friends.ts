export default {
  namespaced: true,
  state: () => ({
    friends: []
  }),
  mutations: {
    setFriends(state, friends) {
      state.friends = friends;
    }
  }
};
