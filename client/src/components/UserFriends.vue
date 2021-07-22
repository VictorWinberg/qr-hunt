<template>
  <div>
    <h2 class="friends__title">Friends</h2>
    <ul>
      <li v-for="friend in friends" :key="friend.id">
        <div
          class="friend__photo"
          :style="{
            backgroundImage: `url(${friend.photo})`,
            marginBottom: '-.5em' // Todo: remove this line!
          }"
        ></div>
        <span>{{ friend.name }} - Lvl: {{ friend.lvl }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { api } from "@/utils";

export default {
  computed: {
    ...mapState("friends", ["friends"])
  },
  async created() {
    const friends = await api.get("/api/users");
    if (!friends.err) this.setFriends(friends.data);
  },
  methods: {
    ...mapMutations("friends", ["setFriends"])
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
