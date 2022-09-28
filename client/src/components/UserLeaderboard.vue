<template>
  <div>
    <h2 class="leaderboard__title">
      {{ $t("leaderboard.title") }}
    </h2>
    <div class="leaderboard__nav">
      <h3 class="leaderboard__period" @click="togglePeriod">
        {{ week }} {{ $t("common.month-names")[month - 1] }} {{ year }}
      </h3>
      <a class="nav--left" @click="nav(-1)">
        <i class="fas fa-caret-left"></i>
      </a>
      <a :class="['nav--right', last ? 'disabled' : '']" @click="nav(1)">
        <i class="fas fa-caret-right"></i>
      </a>
    </div>
    <table v-if="leaderboard && leaderboard.length" class="leaderboard__table">
      <tr>
        <th>{{ $t("leaderboard.table-rank") }}</th>
        <th></th>
        <th>{{ $t("leaderboard.table-user") }}</th>
        <th align="right">{{ $t("leaderboard.table-distance") }}</th>
        <th align="right">{{ $t("leaderboard.table-score") }}</th>
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
          <td align="right">{{ (user.dist / 1000).toFixed(1) }}</td>
          <td align="right">{{ user.score }}</td>
        </tr>
      </router-link>
    </table>

    <h4 v-else-if="leaderboard">
      {{ emptyLeaderboard($t("leaderboard.empty-alternative-texts")) }}
    </h4>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapMutations } from "vuex";
import { EVENT_TYPE } from "@/constants";
import { api } from "@/utils";
import EventBus from "@/plugins/event-bus";
import dayjs from "@/plugins/dayjs";

export default Vue.extend({
  data() {
    return {
      date: dayjs().startOf("month"),
      period: "month"
    };
  },
  computed: {
    ...mapState("user", ["leaderboard"]),
    week() {
      if (this.period !== "week") return;
      return "w. " + this.date.isoWeek();
    },
    month() {
      if (this.period !== "month") return;
      return this.date.format("M");
    },
    year() {
      if (this.period !== "year" && dayjs().isSame(this.date, "year")) return;
      return this.date.format("YYYY");
    },
    last() {
      return this.date.add(1, this.period).isAfter(dayjs());
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
      const from = this.date.format("YYYY-MM-DD");
      const to = this.date.add(1, this.period).format("YYYY-MM-DD");

      const leaderboard = await api.get(`/api/leaderboard/${from}/${to}`);
      if (!leaderboard.err) this.setLeaderboard(leaderboard.data);
    },
    nav(dir) {
      this.setLeaderboard(null);
      this.date = this.date.add(dir, this.period);
      this.fetchLeaderboard();
    },
    togglePeriod() {
      this.setLeaderboard(null);
      this.period = { week: "month", month: "year", year: "week" }[this.period];
      this.date = dayjs().startOf(this.period);
      this.fetchLeaderboard();
    },
    emptyLeaderboard(texts) {
      return texts[Math.floor(Math.random() * texts.length)];
    }
  }
});
</script>

<style lang="scss">
.leaderboard__nav {
  position: relative;

  a {
    position: absolute;
    top: 0;
    padding: 0.2rem 1rem;
    background: $dark-brand-color;
    border-radius: 0.2rem;

    &.nav--left {
      left: 0;
    }

    &.nav--right {
      right: 0;
    }

    &.disabled {
      color: $grey-400;
      background: $grey-800;
    }
  }
}

.leaderboard__period {
  display: inline-block;
  text-decoration: underline;
}

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
