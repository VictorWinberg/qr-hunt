<template>
  <v-container class="user-wrapper pa-4">
    <v-card class="pa-4 mb-4" variant="tonal">
      <div class="d-flex flex-column flex-md-row align-center ga-4">
        <v-avatar size="96" :image="avatarUrl" />
        <div class="text-center text-md-start">
          <v-card-title class="pa-0 text-h5">{{ profile.name }}</v-card-title>
          <v-card-subtitle class="pa-0">{{ profile.email }}</v-card-subtitle>
        </div>
      </div>
      <div class="d-flex flex-wrap align-center justify-center ga-6 mt-4">
        <div class="text-center">
          <v-icon size="56" :color="hashColor(profile.lvl ?? 0)">mdi-star</v-icon>
          <div class="text-h6">{{ profile.lvl != null ? profile.lvl : '?' }}</div>
        </div>
        <v-progress-linear
          class="xp-bar flex-grow-1"
          height="28"
          rounded
          :model-value="xpPercent"
          :color="hashColor((profile.lvl ?? 0) + 1)"
        >
          <template #default>
            <strong class="text-white text-shadow">
              {{ profile.lvlXp != null ? profile.lvlXp : '-' }} /
              {{ profile.reqLvlXp != null ? profile.reqLvlXp : '-' }}
              {{ t('user.experience-points') }}
            </strong>
          </template>
        </v-progress-linear>
        <div class="d-flex flex-column align-center">
          <span class="text-h6">{{ profile.maxStreak ?? 0 }}</span>
          <v-img :src="fireSvg" width="40" height="40" contain />
        </div>
      </div>
    </v-card>

    <v-tabs v-model="activeTab" grow>
      <v-tab v-for="tab in tabs" :key="tab.id" :value="tab.id">
        <v-icon start>{{ tab.icon }}</v-icon>
        {{ tab.label }}
      </v-tab>
    </v-tabs>

    <v-tabs-window v-model="activeTab" class="mt-4">
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

import fireSvg from '@/assets/fire.svg?url';
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
  max-width: 900px;
  margin: 0 auto;
}

.xp-bar {
  min-width: 200px;
  max-width: 420px;
}

.text-shadow {
  text-shadow: 0 0 2px #000;
}
</style>
