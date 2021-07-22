<template>
  <div>
    <h2 class="">Leaderboard</h2>
    To be defined
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
