<template>
  <div>
    <h2 class="leaderboard__title">Leaderboard</h2>
    <h3 class="leaderboard__subtitle">{{ month }}</h3>
    <table class="leaderboard__table">
      <tr>
        <th>Rank</th>
        <th></th>
        <th>User</th>
        <th align="right">Score</th>
      </tr>
      <router-link
        v-for="user in leaderboard"
        v-slot="{ navigate }"
        :key="user.id"
        :to="`/users/${user.id}`"
        custom
      >
        <tr role="link" @click="navigate">
          <td>{{ user.rank }}</td>
          <td :style="{ width: 0, padding: 0 }">
            <div
              class="user__photo"
              :style="{ backgroundImage: `url(${user.photo})` }"
            ></div>
          </td>
          <td>{{ user.name || user.username }}</td>
          <td align="right">{{ user.score }}</td>
        </tr>
      </router-link>
    </table>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { EVENT_TYPE } from "@/constants";
import { api } from "@/utils";
import EventBus from "@/plugins/event-bus";
import dayjs from "dayjs";

export default {
  computed: {
    ...mapState("user", ["leaderboard"]),
    month() {
      return dayjs().format("MMMM");
    }
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
      const leaderboard = await api.get(
        "/api/leaderboard/2021-09-01/2021-10-01"
      );
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
  border-collapse: collapse;

  tr {
    text-align: left;
  }

  tr:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.2);
  }

  th,
  td {
    padding: 0.5rem;
  }
}

.user__photo {
  width: 32px;
  height: 32px;
  background-color: $grey-200;
  background-position: center;
  background-size: cover;
  border-radius: 50%;
}
</style>
