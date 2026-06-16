<template>
  <v-container>
    <v-card class="pa-4">
      <v-text-field v-model="settings.username" label="Username"></v-text-field>
      <v-switch v-model="settings.notifications" label="Enable Notifications"></v-switch>
      <v-btn color="primary" @click="saveSettings">Save</v-btn>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const settings = ref({
  username: 'JohnDoe',
  notifications: true
});

const saveSettings = () => {
  console.log('Settings saved', settings.value);
};
</script>
