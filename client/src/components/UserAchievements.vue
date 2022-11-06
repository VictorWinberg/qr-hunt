<template>
  <div>
    <h2 class="user-achievements__title">
      {{ $t("achievements.title") }}
    </h2>
    <div class="user-achievements">
      <AchievementsCard
        v-for="achievement in achievements"
        :key="achievement.name"
        :name="achievement.name"
        :title="achievement.title"
        :icon="achievement.icon"
        :count="achievement.count"
        class="user-achievements__card"
        @click="selectAchievement(achievement)"
      />
    </div>
    <AchievementsCard
      v-if="selectedAchievement"
      ref="selectedAchievement"
      :name="selectedAchievement.name"
      :title="selectedAchievement.title"
      :icon="selectedAchievement.icon"
      :count="selectedAchievement.count"
      class="user-achievements__card selected"
      :overlay="true"
      @click="selectAchievement(null)"
    />
  </div>
</template>

<script>
import Vue from "vue";
import EventBus from "@/plugins/event-bus";
import AchievementsCard from "@/components/AchievementsCard.vue";
import { EVENT_TYPE } from "@/constants";
import { api, hashColor } from "@/utils";

export default {
  components: {
    AchievementsCard
  },
  data() {
    return {
      achievements: [{}, {}],
      selectedAchievement: null
    };
  },
  watch: {
    $route: ["fetchAchievements"]
  },
  created() {
    this.fetchAchievements();
    EventBus.$on(EVENT_TYPE.API_REQUEST_UPDATE, this.fetchAchievements);
  },
  beforeDestroy() {
    EventBus.$off(EVENT_TYPE.API_REQUEST_UPDATE, this.fetchAchievements);
  },
  methods: {
    hashColor,
    selectAchievement(achievement) {
      if (achievement === this.selectedAchievement) {
        this.selectedAchievement = null;
      } else {
        this.selectedAchievement = achievement;
      }
      Vue.nextTick(() => {
        const element = this.$refs?.selectedAchievement?.$el;
        if (element) {
          document.getElementById("app").appendChild(element);
        }
      });
    },
    async fetchAchievements() {
      const { params } = this.$route;
      const achievements = params.id
        ? await api.get("/api/user_achievements/" + params.id)
        : await api.get("/api/achievements");

      if (achievements.err) return;
      this.achievements = achievements.data;
    }
  }
};
</script>

<style lang="scss">
.user-achievements {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, max-content));
  grid-gap: 0.5rem;
  justify-content: center;
}

.user-achievements__card {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100px;

  &.selected {
    position: absolute;
    right: 0;
    left: 0;
    z-index: 1;
    margin-right: auto;
    margin-left: auto;
    transform: scale(3);
  }
}
</style>
