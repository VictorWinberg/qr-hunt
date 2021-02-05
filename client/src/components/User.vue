<template>
  <div>
    <h1>{{ user.name }}</h1>
    <p>{{ user.email }}</p>
    <img :src="user.photo" />
    <h3>Achievements</h3>
    <ul>
      <li v-for="achievement in achievements" :key="achievement.name">
        {{ achievement.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      user: {},
      achievements: []
    };
  },
  async created() {
    const user = await this.fetch("/auth/user");
    if (!user.err) this.user = user.data;
    const achievements = await this.fetch("/api/achievements");
    if (!achievements.err) this.achievements = achievements.data;
  }
});
</script>

<style>
.login {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: rgba(75, 0, 130, 0.8);
}

.login__inner {
  margin-bottom: 40vh;
}
</style>
