<template>
  <v-card class="pa-3">
    <v-icon size="48" class="mb-2">{{ achievement.icon }}</v-icon>
    <v-card-title>{{ achievement.title }}</v-card-title>
    <v-card-subtitle>{{ achievement.description }}</v-card-subtitle>
  </v-card>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps({
  achievement: {
    type: Object,
    required: true
  }
});
</script>
