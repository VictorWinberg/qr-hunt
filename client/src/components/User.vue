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
                <i :class="(icon || 'fas fa-star') + ' fa-2x'"></i>
                <div class="banner">
                  <div class="banner__text">{{ title || name }}</div>
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
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      user: {},
      achievements: []
    };
  },
  async created() {
    const user = await this.$fetch("/auth/user");
    if (!user.err) this.user = user.data;
    const achievements = await this.$fetch("/api/achievements");
    if (!achievements.err) this.achievements = achievements.data;
  },
  methods: {
    hashColor(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) - ((hash << 5) + hash);
      }
      let colour = "#";
      for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
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
  flex: 1;
  width: 100%;
  max-width: 800px;
  margin: 2rem auto;
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
  margin-bottom: 3rem;
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
