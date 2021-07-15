<template>
  <div>
    <h2 class="friends__title">Friends</h2>
    <ul>
      <li v-for="user in friends" :key="user.id">
        <div
          class="friend__photo"
          :style="{
            backgroundImage: `url(${user.photo})`,
            marginBottom: '-.5em' // Todo: change this fixed margin!
          }"
        ></div>
        <span>{{ user.name || user.username }} - Lvl: {{ user.lvl }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { EVENT_TYPE } from "@/constants";
import { api } from "@/utils";
import EventBus from "@/plugins/event-bus";

export default {
  computed: {
    ...mapState("user", ["friends"])
  },
  created() {
    this.fetchFriends();
    EventBus.$on(EVENT_TYPE.API_REQUEST_UPDATE, this.fetchFriends);
  },
  beforeDestroy() {
    EventBus.$off(EVENT_TYPE.API_REQUEST_UPDATE, this.fetchFriends);
  },
  methods: {
    ...mapMutations("user", ["setFriends"]),
    async fetchFriends() {
      const friends = await api.get("/api/users");
      if (!friends.err) this.setFriends(friends.data);
    }
  }
};
</script>

<style lang="scss">
.friend__photo {
  display: inline-block;
  width: 32px;
  height: 32px;
  margin-right: 0.5em;
  background-position: center;
  background-size: cover;
  border-radius: 50%;
}
</style>
