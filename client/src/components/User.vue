<template>
  <div class="user-wrapper">
    <div class="user-header">
      <div
        class="user-header__photo async async--img"
        :style="{ background: `url(${user.photo})` }"
      ></div>
      <h1 class="user-header__title async async--text">{{ user.name }}</h1>
      <p class="user-header__email async async--text">{{ user.email }}</p>
    </div>

    <div class="user-xp">
      <i
        class="user-xp__level fas fa-star"
        :style="{ color: hashColor(user.lvl) }"
      >
        <span class="user-xp__text" :style="xpTextStyle(user.lvl)">
          {{ user.lvl || "?" }}
        </span>
      </i>
      <div class="user-xp__bar">
        <span class="user-xp__text" :style="xpTextStyle(user.lvl)">
          {{ user.lvlXp || "X" }} / {{ user.reqLvlXp || "Y" }}
        </span>
        <div
          class="user-xp__bar--fill"
          :style="{
            background: hashColor(user.lvl),
            'max-width': `${(user.lvlXp / user.reqLvlXp) * 100}%`
          }"
        ></div>
      </div>
    </div>

    <h2>Achievements</h2>
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

    <button class="user-remove" @click="deleteMe">DELETE MY ACCOUNT</button>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapMutations } from "vuex";
import { md5 } from "../utils";

export default Vue.extend({
  data() {
    return {
      achievements: [{}, {}]
    };
  },
  computed: {
    ...mapState("auth", ["isAuthenticated", "user"])
  },
  async created() {
    const achievements = await this.$fetch("/api/achievements");
    if (!achievements.err) this.achievements = achievements.data;
  },
  methods: {
    ...mapMutations("auth", ["setAuth"]),
    xpTextStyle(level) {
      return {
        color: this.hashColor(level + 1),
        "text-shadow": `2px 2px ${this.hashColor(level)}`
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
    },
    async deleteMe() {
      const { err } = await this.$fetch("/api/user", { method: "DELETE" });
      if (err) return;

      this.setAuth({ isAuthenticated: false });
      this.$router.push("/");
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
  max-width: 800px;
  margin: 2rem auto;
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
  border: 1px solid $black;
  border-radius: 3px;
}

.user-xp__bar--fill {
  height: 100%;
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
  font-size: 2rem;
  font-style: italic;
  font-weight: bold;
  color: $black;
  -webkit-text-fill-color: $white;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: $black;
}

.user-achievements {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, max-content));
  grid-gap: 0.5rem;
  justify-content: center;
}

.user-achievements__card {
  display: flex;
  justify-content: center;
  width: 160px;
}

.hex {
  position: relative;
  display: flex;
  width: 104px;
  height: 60px;
  margin: 30px 10px;
  font-size: 1.2rem;
  font-weight: bold;
  color: $white;
  background-color: currentColor;

  &::before,
  &::after {
    position: absolute;
    content: "";
    border-right: 52px solid transparent;
    border-left: 52px solid transparent;
  }

  &::before {
    top: -29px;
    border-bottom: 30px solid currentColor;
  }

  &::after {
    bottom: -29px;
    border-top: 30px solid currentColor;
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
  color: $white;
}

.banner {
  position: absolute;
  top: 75%;
  left: 50%;
  display: block;
  width: 150px;
  margin-left: -75px;
  line-height: 2;
  text-align: center;
  background: #9b2;
  border: 1px solid #8a1;
  border-radius: 4px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.15) inset, 0 6px 10px rgba(0, 0, 0, 0.15);

  &::before,
  &::after {
    position: absolute;
    top: 14px;
    left: -36px;
    z-index: -1;
    display: block;
    width: 20px;
    height: 0;
    content: "";
    border: 18px solid #9b2;
    border-right: 12px solid #791;
    border-bottom-color: #94b81e;
    border-left-color: transparent;
    transform: rotate(-5deg);
  }

  &::after {
    right: -36px;
    left: auto;
    border-right: 18px solid transparent;
    border-left: 12px solid #791;
    transform: rotate(5deg);
  }
}

.banner__text {
  padding-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
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
  border-radius: 50%;
}

.user-remove {
  padding: 1rem 2rem;
  margin: auto;
  margin-bottom: 20px;
  color: white;
  cursor: pointer;
  background: $danger;
  border: none;
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
