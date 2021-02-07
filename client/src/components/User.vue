<template>
  <div class="user-wrapper">
    <div class="user">
      <img class="user__photo" :src="user.photo" />
      <h1 class="user__title">{{ user.name }}</h1>
      <p class="user__email">{{ user.email }}</p>
    </div>
    <div class="achievements">
      <h3>Achievements</h3>
      <ul>
        <li v-for="achievement in achievements" :key="achievement.name">
          {{ achievement.name }}
        </li>
      </ul>
    </div>
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

<style lang="scss">
.user-wrapper {
  flex: 1;
}

.user__title {
  grid-area: top;
  align-self: end;
}

.user__email {
  grid-area: bottom;
}

.user__photo {
  grid-area: left;
  width: 96px;
  height: 96px;
  margin: 0 1rem;
  background: linear-gradient(to right, #bdc3c7, #2c3e50);
  border-radius: 50%;
}

@media screen and (min-width: 500px) {
  .user {
    display: grid;
    grid-template:
      "left top"
      "left bottom";
    text-align: left;
  }
}
</style>
