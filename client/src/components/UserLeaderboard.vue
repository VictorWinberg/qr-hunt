<template>
  <div>
    <h2 class="leaderboard__title">Leaderboard</h2>
    <table class="leaderboard__table">
      <tr>
        <th>Rank</th>
        <th style="width: 0;"></th>
        <th>User</th>
        <th align="right">Lvl</th>
      </tr>
      <tr v-for="user in leaderboard" :key="user.id">
        <td>{{ user.rank }}</td>
        <td style="width: 0;">
          <div
            class="friend__photo"
            :style="{
              backgroundImage: `url(${user.photo})`,
              marginBottom: '-.5em' // Todo: remove this line!
            }"
          ></div>
        </td>
        <td>{{ user.name || user.username }}</td>
        <td align="right">{{ user.lvl }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { EVENT_TYPE } from "@/constants";
import { api } from "@/utils";
import EventBus from "@/plugins/event-bus";

export default {
  computed: {
    ...mapState("user", ["leaderboard"])
  },
  created() {
    this.fetchLeaderboard();
    EventBus.$on(EVENT_TYPE.API_REQUEST_UPDATE, this.fetchLeaderboard);
  },
  beforeDestroy() {
    EventBus.$off(EVENT_TYPE.API_REQUEST_UPDATE, this.fetchLeaderboard);
  },
  methods: {
    ...mapMutations("user", ["setLeaderboard"]),
    async fetchLeaderboard() {
      const leaderboard = await api.get("/api/leaderboard");
      if (!leaderboard.err) this.setLeaderboard(leaderboard.data);
    }
  }
};
</script>

<style lang="scss">
.leaderboard__table {
  min-width: 100%;
  max-width: 800px;
  margin: auto;

  tr {
    text-align: left;
  }
}
</style>
