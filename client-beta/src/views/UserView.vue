<template>
  <v-container class="user-wrapper px-2 px-sm-4 pb-2">
    <v-card class="user-profile-card mb-3" variant="tonal">
      <div class="user-profile-avatar-wrap">
        <v-avatar class="user-profile-avatar" size="120" :image="avatarUrl" />
      </div>
      <div class="user-profile-card__content pa-2">
        <div class="user-profile-text text-center">
          <div class="text-subtitle-2 font-weight-bold text-truncate">{{ profile.name }}</div>
          <div class="text-caption text-medium-emphasis text-truncate">{{ profile.email }}</div>
        </div>

        <div class="user-profile-xp d-flex align-center">
          <div class="lvl-badge flex-shrink-0">
            <svg class="lvl-badge__star" viewBox="0 0 24 24" aria-hidden="true">
              <path class="lvl-badge__star-path" :fill="lvlStarFill" stroke="#000000" stroke-linejoin="round"
                stroke-width="1" paint-order="stroke fill"
                d="M16.926 20.2a1 1 0 0 1-.466-.115l-4.471-2.352-4.471 2.348a1 1 0 0 1-1.451-1.054l.854-4.98L3.3 10.521a1 1 0 0 1 .555-1.706l5-.727 2.237-4.531A1 1 0 0 1 11.989 3a1 1 0 0 1 .9.558l2.236 4.53 5 .727a1 1 0 0 1 .555 1.706l-3.618 3.527.854 4.98a1 1 0 0 1-.99 1.172z" />
            </svg>
            <span class="lvl-badge__num font-weight-bold">
              {{ profile.lvl != null ? profile.lvl : '?' }}
            </span>
          </div>
          <div class="xp-bar-wrap flex-grow-1">
            <v-progress-linear class="xp-bar" height="32" rounded rounded-bar :model-value="xpPercent"
              :color="hashColor(profile.lvl ?? 0)" bg-color="surface-variant">
              <template #default>
                <span class="xp-bar__label-row">
                  <span class="xp-bar__label text-body-2 font-weight-bold text-white text-shadow">
                    {{ profile.lvlXp != null ? profile.lvlXp : '-' }} /
                    {{ profile.reqLvlXp != null ? profile.reqLvlXp : '-' }}
                    {{ t('user.experience-points') }}
                  </span>
                </span>
              </template>
            </v-progress-linear>
          </div>
          <div class="streak-badge flex-shrink-0">
            <svg class="streak-badge__flame" viewBox="0 0 460 520" aria-hidden="true">
              <path class="streak-badge__flame-path" fill="#d43300" stroke="#000000" stroke-linejoin="round"
                stroke-width="2" paint-order="stroke fill"
                d="M 323.56 51.2 C 302.76 70.5 283.98 90.79 267.34 111.17 C 240.08 73.62 206.28 35.53 168 0 C 69.74 91.17 0 209.96 0 281.6 C 0 408.85 100.29 512 224 512 C 347.71 512 448 408.85 448 281.6 C 448 228.33 396.02 118.46 323.56 51.2 L 323.56 51.2 Z" />
            </svg>
            <span class="streak-badge__num font-weight-bold">
              {{ profile.maxStreak ?? 0 }}
            </span>
          </div>
        </div>
      </div>
    </v-card>

    <v-tabs v-model="activeTab" grow>
      <v-tab v-for="tab in tabs" :key="tab.id" :value="tab.id">
        <v-icon start>{{ tab.icon }}</v-icon>
      </v-tab>
    </v-tabs>

    <v-tabs-window v-model="activeTab" class="mt-2 mt-sm-4">
      <v-tabs-window-item v-for="tab in tabs" :key="tab.id" :value="tab.id">
        <v-container fluid class="pa-0 pb-8">
          <component :is="tab.component" />
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
</template>

<script lang="ts">
export default { name: 'UserView' };
</script>

<script lang="ts" setup>
import type { Component } from 'vue';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import type { UserProfile } from '@/interfaces/User';

import UserAchievements from '@/components/UserAchievements.vue';
import UserLeaderboard from '@/components/UserLeaderboard.vue';
import UserSettings from '@/components/UserSettings.vue';
import { api } from '@/utils/api';
import { hashColor } from '@/utils/geo';

const { t } = useI18n();
const route = useRoute();

const profile = ref<UserProfile>({});
const activeTab = ref(0);

const avatarUrl = computed(() =>
  typeof profile.value.photo === 'string' ? profile.value.photo : undefined
);

const tabs = ref<{ id: number; icon: string; label: string; component: Component }[]>([]);

const xpPercent = computed(() => {
  const xp = profile.value.lvlXp ?? 0;
  const req = profile.value.reqLvlXp ?? 1;
  return Math.min(100, (xp / req) * 100);
});

/** Same hue as XP bar (`v-progress-linear` `:color`). */
const lvlStarFill = computed(() => hashColor(profile.value.lvl ?? 0));

async function fetchProfile(): Promise<void> {
  const id = route.params.id;
  const res =
    typeof id === 'string' && id ? await api.get('/api/users/' + id) : await api.get('/api/user');
  profile.value = res.err ? {} : ((res.data as UserProfile) ?? {});
}

function setTabs(): void {
  const id = route.params.id;
  const base = [
    { id: 0, icon: 'mdi-medal', label: t('achievements.title'), component: UserAchievements },
    { id: 1, icon: 'mdi-trophy', label: t('leaderboard.title'), component: UserLeaderboard }
  ];
  if (id == null) {
    tabs.value = [
      ...base,
      { id: 2, icon: 'mdi-cog', label: t('settings.title'), component: UserSettings }
    ];
  } else {
    tabs.value = base;
  }
  activeTab.value = 0;
}

watch(
  () => route.fullPath,
  () => {
    setTabs();
    void fetchProfile();
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.user-wrapper {
  --user-avatar-size: 120px;
  max-width: 900px;
  margin: 0 auto;
  /*
   * Half the avatar sits above the card (translate -50%). v-main already offsets
   * content below the app bar; this extra top padding must be >= half the avatar
   * so the portrait never enters the app-bar band. Do not use `pa-*` here — Vuetify
   * sets `padding: … !important` and would override this padding-top.
   */
  padding-top: calc(var(--user-avatar-size) / 2 + 1rem);
}

.user-profile-card {
  position: relative;
  overflow: visible;
  padding-top: calc(var(--user-avatar-size) / 2 + 0.5rem);
}

.user-profile-avatar-wrap {
  position: absolute;
  left: 50%;
  top: 0;
  z-index: 10;
  line-height: 0;
  transform: translate(-50%, -50%);
}

.user-profile-avatar {
  position: relative;
  z-index: 1;
  border: 3px solid rgb(var(--v-theme-surface));
  box-shadow:
    0 6px 18px rgb(0 0 0 / 48%),
    0 2px 6px rgb(0 0 0 / 35%);
}

.user-profile-card__content {
  position: relative;
  z-index: 0;
}

.user-profile-text,
.xp-bar-wrap {
  min-width: 0;
}

.user-profile-text {
  width: 100%;
  line-height: 1.25;
  margin-bottom: 0.25rem;
}

.user-profile-xp {
  gap: 0;
  padding-inline: 2px;
}

.xp-bar-wrap {
  position: relative;
  z-index: 1;
  padding: 2px;
  border: 1px solid rgb(var(--v-theme-on-surface) / 28%);
  border-radius: 9999px;
  overflow: visible;
}

.xp-bar {
  border-radius: inherit;
  overflow: visible;
}

.xp-bar__label-row {
  display: flex;
  justify-content: center;
  width: 100%;
  min-width: 0;
  padding-inline: 0.5rem;
}

.xp-bar__label {
  text-align: center;
  font-style: italic;
}

.text-shadow {
  text-shadow:
    0 0 2px #000,
    0 1px 2px rgb(0 0 0 / 80%);
}

.lvl-badge,
.streak-badge {
  position: relative;
  /* Above XP bar (z-index 1); stacking is scoped inside card content below the avatar layer */
  z-index: 3;
}

.lvl-badge {
  width: 6rem;
  height: 6rem;
  margin-top: -0.6rem;
  margin-right: -3rem;
  margin-left: -1rem;
}

.streak-badge {
  width: 5rem;
  height: 5rem;
  margin-left: -2.5rem;
  margin-right: -0.85rem;
}

.lvl-badge__star {
  position: absolute;
  inset: 0;
  display: block;
  width: 92px;
  height: 92px;
  margin: auto;
  overflow: visible;
  pointer-events: none;
}

.lvl-badge__star-path,
.streak-badge__flame-path {
  vector-effect: non-scaling-stroke;
}

.lvl-badge__num,
.streak-badge__num {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  line-height: 1;
  color: #fff;
  text-shadow:
    0 0 2px #000,
    0 0 1px #000;
  pointer-events: none;
}

.lvl-badge__num {
  font-size: 1.5rem;
}

.streak-badge__num {
  font-size: 1.35rem;
}

.streak-badge__flame {
  position: absolute;
  inset: 0;
  display: block;
  width: 56px;
  height: 56px;
  margin: auto;
  overflow: visible;
  pointer-events: none;
}
</style>
