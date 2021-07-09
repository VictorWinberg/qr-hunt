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

    <h2>Friends</h2>
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

    <button class="user-remove" @click="deleteMe">DELETE MY ACCOUNT</button>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapMutations } from "vuex";
import { api, md5 } from "@/utils";

export default Vue.extend({
  computed: {
    ...mapState("user", ["isAuthenticated", "user"]),
    ...mapState("friends", ["friends"]),
    ...mapState("achievements", ["achievements"])
  },
  async created() {
    const achievements = await api.get("/api/achievements");
    if (!achievements.err) this.setAchievements(achievements.data);

    const friends = await api.get("/api/users");
    if (!friends.err) this.setFriends(friends.data);
  },
  methods: {
    ...mapMutations("user", ["setAuth"]),
    ...mapMutations("friends", ["setFriends"]),
    ...mapMutations("achievements", ["setAchievements"]),
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
    },
    async deleteMe() {
      this.$store.commit("popup/setPopup", {
        title: "Delete account",
        subtitle: "Are you sure you want to delete your account?",
        options: [
          {
            name: "Cancel",
            type: "disabled",
            action: async () => {
              this.$store.commit("popup/setPopup", false);
            }
          },
          {
            name: "Delete",
            type: "danger",
            action: async () => {
              this.$store.commit("popup/setPopup", false);
              const { err } = await api.delete("/api/user");
              if (err) return;
              this.setAuth({ isAuthenticated: false });
              this.$router.push("/");
            }
          }
        ]
      });
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
  padding: 2rem 0;
  margin: auto;
  overflow-y: scroll;
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
  color: $white;
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

.friend__photo {
  display: inline-block;
  width: 32px;
  height: 32px;
  margin-right: 0.5em;
  background-position: center;
  background-size: cover;
  border-radius: 50%;
}

.user-remove {
  padding: 1rem 2rem;
  margin: 2rem auto;
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
