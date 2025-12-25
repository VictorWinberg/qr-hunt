<template>
  <v-container>
    <v-row>
      <v-col v-for="achievement in achievements" :key="achievement.id" cols="12" md="6">
        <AchievementsCard :achievement="achievement" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import AchievementsCard from '@/components/AchievementsCard.vue';

const achievements = ref([
  { id: 1, title: 'Explorer', description: 'Visited 10 locations', icon: 'mdi-map-marker-check' },
  { id: 2, title: 'Collector', description: 'Scanned 50 QR codes', icon: 'mdi-qrcode-scan' },
  { id: 3, title: 'Champion', description: 'Ranked top 10 in leaderboard', icon: 'mdi-trophy' }
]);
</script>
