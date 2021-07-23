<template>
  <div>
    <h2 class="user-achievements__title">Achievements</h2>
    <div class="user-achievements">
      <div
        v-for="{ name, title, icon } in achievements"
        :key="name"
        class="user-achievements__card"
      >
        <div class="hex" :style="{ color: hashColor(name) }">
          <div class="hex hex__inner">
            <div class="hex hex__inner" :style="{ color: hashColor(name) }">
              <div class="hex__icon">
                <i :class="(icon || 'fas fa-question') + ' fa-2x'"></i>
                <div class="banner">
                  <div class="banner__text async async--text">
                    {{ title || name || ". . ." }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import EventBus from "@/plugins/event-bus";
import { EVENT_TYPE } from "@/constants";
import { api, md5 } from "@/utils";

export default {
  computed: {
    ...mapState("achievements", ["achievements"])
  },
  async created() {
    this.fetchAchievements();
    EventBus.$on(EVENT_TYPE.API_REQUEST_UPDATE, this.fetchAchievements);
  },
  beforeDestroy() {
    EventBus.$off(EVENT_TYPE.API_REQUEST_UPDATE, this.fetchAchievements);
  },
  methods: {
    ...mapMutations("achievements", ["setAchievements"]),
    async fetchAchievements() {
      const achievements = await api.get("/api/achievements");
      if (!achievements.err) this.setAchievements(achievements.data);
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
  display: flex;
  justify-content: center;
  width: 100px;
}

.hex {
  position: relative;
  display: flex;
  width: 70px;
  height: 40px;
  margin: 20px 10px;
  font-size: 0.8rem;
  font-weight: bold;
  color: $white;
  background-color: currentColor;

  &::before,
  &::after {
    position: absolute;
    content: "";
    border-right: 35px solid transparent;
    border-left: 35px solid transparent;
  }

  &::before {
    top: -20px;
    border-bottom: 20px solid currentColor;
  }

  &::after {
    bottom: -20px;
    border-top: 20px solid currentColor;
  }
}

.hex__inner {
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0;
  transform: scale(0.85, 0.85);
}

.hex__icon {
  z-index: 1;
  margin-bottom: 1rem;
  color: $text-color;
}

.banner {
  position: absolute;
  top: 75%;
  left: 50%;
  display: block;
  width: 110px;
  margin-left: -55px;
  line-height: 2;
  text-align: center;
  background: #9b2;
  border: 1px solid #8a1;
  border-radius: 4px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.15) inset, 0 6px 10px rgba(0, 0, 0, 0.15);

  &::before,
  &::after {
    position: absolute;
    top: 16px;
    left: -15px;
    z-index: -1;
    display: block;
    width: 10px;
    height: 0;
    content: "";
    border: 8px solid #9b2;
    border-right: 6px solid #791;
    border-bottom-color: #94b81e;
    border-left-color: transparent;
    transform: rotate(-5deg);
  }

  &::after {
    right: -15px;
    left: auto;
    border-right: 8px solid transparent;
    border-left: 6px solid #791;
    transform: rotate(5deg);
  }
}

.banner__text {
  padding-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
