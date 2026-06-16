<template>
  <v-container>
    <v-card v-for="(user, index) in leaderboard" :key="user.id" class="mb-3 pa-3">
      <v-row align="center">
        <v-col cols="2">
          <v-avatar size="48" :image="user.photo"></v-avatar>
        </v-col>
        <v-col cols="6">
          <div class="font-weight-bold">{{ user.name }}</div>
          <div class="text-caption">{{ user.xp }} XP</div>
        </v-col>
        <v-col cols="4" class="text-right">
          <v-chip
            :color="
              index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : 'primary'
            "
          >
            #{{ index + 1 }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const leaderboard = ref([
  { id: 1, name: 'Alice', xp: 1200, photo: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { id: 2, name: 'Bob', xp: 1100, photo: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 3, name: 'Charlie', xp: 950, photo: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { id: 4, name: 'Dana', xp: 900, photo: 'https://randomuser.me/api/portraits/women/2.jpg' }
]);
</script>
