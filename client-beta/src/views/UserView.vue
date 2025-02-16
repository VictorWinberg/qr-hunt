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

      <div class="user-xp">
        <div :key="user.lvl" class="user-xp-wrapper">
          <i class="user-xp__level fas fa-star" :style="{ color: hashColor(user.lvl) }">
            <span class="user-xp__text">
              {{ user.lvl != null ? user.lvl : '?' }}
            </span>
          </i>
          <div class="user-xp__bar">
            <span class="user-xp__text" :style="xpTextStyle(user.lvl)">
              {{ user.lvlXp != null ? user.lvlXp : '-' }} /
              {{ user.reqLvlXp != null ? user.reqLvlXp : '-' }}
              {{ $t('user.experience-points') }}
            </span>
            <div
              class="user-xp__bar--fill"
              :style="{
                background: hashColor(user.lvl),
                maxWidth: `${(user.lvlXp / user.reqLvlXp) * 100}%`
              }"
            />
          </div>
          <div class="user-xp__level">
            <span class="user-xp__text">
              {{ user.maxStreak }}
            </span>
            <v-img src="@/assets/fire.svg" alt="fire" height="100%" />
          </div>
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
          role="button"
          :tabindex="0"
          @click="showTab(tab.id)"
          @keydown="showTab(tab.id)"
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

<script lang="ts" setup>
import { ref } from 'vue';

import { hashColor } from '@/utils/hash';

const $t = (key: string) => key;

// Mock data
const user = ref({
  name: 'John Doe',
  email: 'john.doe@gmail.com',
  lvl: 1,
  lvlXp: 0,
  reqLvlXp: 100,
  maxStreak: 5,
  photo: 'https://www.codies.se/img/victor.jpg'
});

const tabs = ref<{ id: number; icon: string; component: string }[]>([]);

const tabContentHeight = 200;

const isActiveTab = (id: number) => id === -1;

const showTab = (id: number) => id;

const xpTextStyle = (lvl: number) => ({
  color: hashColor(lvl + 1)
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
  background-color: #575759; //TODO: $secondary-color;
}

.user-xp-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-xp__level {
  position: relative;
  z-index: 1;
  height: 4rem;
  font-size: 4rem;
  -webkit-text-stroke: 1px black;
}

.user-xp__bar {
  position: relative;
  display: inline-block;
  width: 300px;
  max-width: 66%;
  height: 2.5rem;
  margin-right: -1rem;
  margin-left: -2.25rem;
  font-size: 3rem;
  border: 1px solid black;
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
  top: 0.2em;
  right: 0.2em;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Roboto', arial, sans-serif;
  font-size: 0.4em;
  font-style: italic;
  font-weight: bold;
  color: black;
  -webkit-text-fill-color: white;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
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
  background-color: #575759; //TODO: $secondary-color;
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
  color: gray; //TODO: $grey-400;

  &.active {
    color: #eff0eb; //TODO: $text-color;
  }
}

.active-tab-marker {
  height: 3px;
  background-color: #eff0eb; //TODO: $text-color;
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
      'left top'
      'left bottom';
    text-align: left;
  }

  .user-header__photo {
    margin: 0 1rem 0 auto;
  }
}
</style>
