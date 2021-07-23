<template>
  <div class="user-wrapper">
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
        ></div>
      </div>
    </div>

    <div class="tabs">
      <div
        class="tabs__tab-option"
        :class="{ active: isActiveTab(0) }"
        @click="showTab(0)"
      >
        <i class="fa fa-award"></i>
      </div>
      <div
        class="tabs__tab-option"
        :class="{ active: isActiveTab(1) }"
        @click="showTab(1)"
      >
        <i class="fa fa-users"></i>
      </div>
      <div
        class="tabs__tab-option"
        :class="{ active: isActiveTab(2) }"
        @click="showTab(2)"
      >
        <i class="fa fa-trophy"></i>
      </div>
      <div
        class="tabs__tab-option"
        :class="{ active: isActiveTab(3) }"
        @click="showTab(3)"
      >
        <i class="fa fa-cog"></i>
      </div>
    </div>
    <div ref="activeTabMarker" class="active-tab-marker"></div>

    <div ref="tabContent" class="tab-content wrapper">
      <div class="tab-content content-1">
        <UserAchievements />
      </div>
      <div class="tab-content content-2">
        <UserFriends />
      </div>
      <div class="tab-content content-3">
        <UserLeaderboard />
      </div>
      <div class="tab-content content-4">
        <UserSettings />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
import { md5 } from "@/utils";
import UserAchievements from "../components/UserAchievements";
import UserFriends from "../components/UserFriends";
import UserLeaderboard from "../components/UserLeaderboard";
import UserSettings from "../components/UserSettings";

export default Vue.extend({
  components: {
    UserAchievements,
    UserFriends,
    UserLeaderboard,
    UserSettings
  },
  data() {
    return {
      activeTab: 0
    };
  },
  computed: {
    ...mapState("user", ["user"])
  },
  methods: {
    isActiveTab(nbr) {
      return nbr === this.activeTab;
    },
    showTab(nbr) {
      this.activeTab = nbr;
      this.$refs.tabContent.style.transform = "translateX(" + -100 * nbr + "%)";
      this.$refs.activeTabMarker.style.transform =
        "translateX(" + 100 * nbr + "%)";
    },
    xpTextStyle(level) {
      return {
        color: this.hashColor(level + 1)
      };
    },
    hashColor(str) {
      if (!str) return "#dfdfdf";
      const h = md5(String(str));
      let colour = "#";
      for (let i = 0; i < 3; i++) {
        const value = (h >> (i * 8)) & 0xff;
        colour += ("00" + value.toString(16)).substr(-2);
      }
      return colour;
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
  padding: 2rem 0;
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
  font-weight: bold;
  color: $black;
  -webkit-text-fill-color: $white;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: $black;
}

.user-header {
  margin-bottom: 1rem;
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
  display: flex;
}

.tabs__tab-option {
  flex: 1;
  padding: 1em 0;
  color: $grey-400;

  &.active {
    color: $text-color;
  }
}

.active-tab-marker {
  width: calc(100% / 4);
  height: 3px;
  background-color: white;
}

.tab-content.wrapper {
  display: flex;
  transition-duration: 200ms;
  transform: translateX(0%);
}

.tab-content {
  width: 100%;
  padding-top: 0.5em;
}

.tab-content .content-1 {
  position: absolute;
  transform: translateX(0%);
}

.tab-content .content-2 {
  position: absolute;
  transform: translateX(100%);
}

.tab-content .content-3 {
  position: absolute;
  transform: translateX(200%);
}

.tab-content .content-4 {
  position: absolute;
  transform: translateX(300%);
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
