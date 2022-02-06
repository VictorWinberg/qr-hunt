<template>
  <div ref="userWrapper" class="user-wrapper">
    <div>
      <div class="user-header">
        <div
          class="user-header__photo async async--img"
          :style="{ backgroundImage: `url(${user.photo})` }"
        ></div>
        <h1 class="user-header__title async async--text">{{ user.name }}</h1>
        <p class="user-header__email async async--text">{{ user.email }}</p>
      </div>

      <div :key="user.lvl" class="user-xp">
        <i
          class="user-xp__level fas fa-star"
          :style="{ color: hashColor(user.lvl) }"
        >
          <span class="user-xp__text">
            {{ user.lvl != null ? user.lvl : "?" }}
          </span>
        </i>
        <div class="user-xp__bar">
          <span class="user-xp__text" :style="xpTextStyle(user.lvl)">
            {{ user.lvlXp != null ? user.lvlXp : "-" }} /
            {{ user.reqLvlXp != null ? user.reqLvlXp : "-" }} xp
          </span>
          <div
            class="user-xp__bar--fill"
            :style="{
              background: hashColor(user.lvl),
              maxWidth: `${(user.lvlXp / user.reqLvlXp) * 100}%`
            }"
          />
        </div>
      </div>
    </div>

    <div ref="tabs" class="tabs">
      <div class="tab-options">
        <div
          v-for="tab in tabs"
          :key="tab.id"
          class="tabs__tab-option"
          :class="{ active: isActiveTab(tab.id) }"
          @click="showTab(tab.id)"
        >
          <i :class="tab.icon"></i>
        </div>
      </div>
      <div
        ref="activeTabMarker"
        class="active-tab-marker"
        :style="{
          width: `calc(${100 / tabs.length}%`
        }"
      />
    </div>

    <div ref="tabContainer" class="tab-container">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-content"
        :class="{ active: isActiveTab(tab.id) }"
        :style="{
          transform: `translateX(${tab.id * 100}%`,
          minHeight: `${tabContentHeight}px`
        }"
      >
        <component :is="tab.component" class="tab-component"></component>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { api, hashColor } from "@/utils";
import UserAchievements from "@/components/UserAchievements";
import UserLeaderboard from "@/components/UserLeaderboard";
import UserSettings from "@/components/UserSettings";

export default Vue.extend({
  components: {
    UserAchievements,
    UserLeaderboard,
    UserSettings
  },
  data() {
    return {
      user: {},
      activeTab: 0,
      tabContentHeight: 0,
      tabs: []
    };
  },
  watch: {
    $route: ["setTabs", "fetchUser"]
  },
  created() {
    this.fetchUser();
  },
  mounted() {
    this.tabContentHeight =
      this.$refs.userWrapper?.clientHeight - this.$refs.tabs?.clientHeight;
    this.setTabs();
  },
  methods: {
    hashColor,
    isActiveTab(nbr) {
      return nbr === this.activeTab;
    },
    async fetchUser() {
      const { params } = this.$route;
      var reset = setTimeout(() => (this.user = {}), 200);

      const user = params.id
        ? await api.get("/api/users/" + params.id)
        : await api.get("/api/user");

      clearTimeout(reset);

      this.user = user.err ? {} : user.data;
    },
    setTabs() {
      const { params } = this.$route;
      this.tabs = [
        { id: 0, icon: "fa fa-award", component: "user-achievements" },
        { id: 1, icon: "fa fa-trophy", component: "user-leaderboard" }
      ];
      if (params.id == null) {
        this.tabs.push({
          id: 2,
          icon: "fa fa-cog",
          component: "user-settings"
        });
      }
      this.showTab(0);
    },
    showTab(nbr) {
      this.activeTab = nbr;
      this.$refs.tabContainer.style.transform =
        "translateX(" + -100 * nbr + "%)";
      this.$refs.activeTabMarker.style.transform =
        "translateX(" + 100 * nbr + "%)";
    },
    xpTextStyle(level) {
      return {
        color: this.hashColor(level + 1)
      };
    }
  }
});
</script>

<style lang="scss">
.user-wrapper {
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  margin: auto;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: $seconday-color;
}

.user-xp {
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-xp__level {
  position: relative;
  z-index: 1;
  font-size: 4rem;
  -webkit-text-stroke: 1px $black;
}

.user-xp__bar {
  position: relative;
  display: inline-block;
  width: 300px;
  max-width: 66%;
  height: 2.5rem;
  margin-left: -2.25rem;
  font-size: 2.5rem;
  border: 1px solid $black;
  border-radius: 3px;
}

.user-xp__bar--fill {
  height: 100%;
  transition: max-width 2s ease-in-out;
  animation: bar-fill 2s ease-in-out forwards;
}

@keyframes bar-fill {
  0% {
    width: 0;
  }

  100% {
    width: 100%;
  }
}

.user-xp__text {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5em;
  font-style: italic;
  font-family: Arial, sans-serif;
  font-weight: bold;
  color: $black;
  -webkit-text-fill-color: $white;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: $black;
}

.user-header {
  margin: 1rem 0;
}

.user-header__title {
  grid-area: top;
  align-self: end;
}

.user-header__email {
  grid-area: bottom;
}

.user-header__photo {
  grid-area: left;
  width: 96px;
  height: 96px;
  margin: auto;
  background-position: center;
  background-size: cover;
  border-radius: 50%;
}

.tabs {
  position: sticky;
  top: 0;
  z-index: 1;
  height: 3.5em;
  background-color: $seconday-color;
}

.tab-options {
  display: flex;
  height: inherit;
}

.tabs__tab-option {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  color: $grey-400;

  &.active {
    color: $text-color;
  }
}

.active-tab-marker {
  height: 3px;
  background-color: $text-color;
  transition-duration: 200ms;
}

.tab-container {
  transition-duration: 200ms;
  transform: translateX(0%);
}

.tab-content {
  position: absolute;
  display: flex;
  width: 100%;
  height: 0;
  overflow: hidden;

  &.active {
    height: auto;
    overflow: scroll;
  }
}

.tab-component {
  width: 100%;
  padding: 1em 1em 3em 1em;
}

@media screen and (min-width: 500px) {
  .user-header {
    display: grid;
    grid-template:
      "left top"
      "left bottom";
    text-align: left;
  }

  .user-header__photo {
    margin: 0 1rem 0 auto;
  }
}
</style>
