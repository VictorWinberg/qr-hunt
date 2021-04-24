export default {
  namespaced: true,
  state: () => ({
    achievements: [{}, {}]
  }),
  mutations: {
    setAchievements(state, achievements) {
      state.achievements = achievements;
    }
  }
};
