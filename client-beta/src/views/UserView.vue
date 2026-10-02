<template>
  <v-container class="user-wrapper">
    <v-card class="user-header pa-4" outlined>
      <v-avatar size="96" :image="user.photo"></v-avatar>
      <v-card-title>{{ user.name }}</v-card-title>
      <v-card-subtitle>{{ user.email }}</v-card-subtitle>
    </v-card>

    <v-progress-linear
      :value="(user.lvlXp / user.reqLvlXp) * 100"
      color="primary"
      class="my-4"
      :height="32"
    >
      <template #default>{{ user.lvlXp }} / {{ user.reqLvlXp }} XP</template>
    </v-progress-linear>

    <v-tabs v-model="activeTab">
      <v-tab v-for="tab in tabs" :key="tab.id">
        <v-icon>{{ tab.icon }}</v-icon>
        {{ tab.label }}
      </v-tab>
    </v-tabs>

    <v-tabs-window v-model="activeTab">
      <v-tabs-window-item v-for="tab in tabs" :key="tab.id" :value="tab.id">
        <v-container fluid>
          <component :is="tab.component"></component>
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import UserAchievements from '@/components/UserAchievements.vue';
import UserLeaderboard from '@/components/UserLeaderboard.vue';
import UserSettings from '@/components/UserSettings.vue';

const user = ref({
  name: 'John Doe',
  email: 'john.doe@example.com',
  photo: 'https://randomuser.me/api/portraits/men/5.jpg',
  lvlXp: 450,
  reqLvlXp: 1000
});

const activeTab = ref(0);

const tabs = ref([
  { id: 0, icon: 'mdi-medal', label: 'Achievements', component: UserAchievements },
  { id: 1, icon: 'mdi-trophy', label: 'Leaderboard', component: UserLeaderboard },
  { id: 2, icon: 'mdi-cog', label: 'Settings', component: UserSettings }
]);
</script>

<style scoped>
.user-wrapper {
  padding: 16px;
}
</style>
