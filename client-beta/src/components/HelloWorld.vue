<script setup lang="ts">
import Meta from '@/Meta';

/** Props */
defineProps({
  title: {
    type: String,
    default: 'QR-Hunt'
  }
});
</script>

<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-img src="@/assets/logo.svg" alt="vuetify" :width="256" class="logo mx-auto" />
      <h1 class="text-h2 font-weight-bold mb-3">{{ title }}</h1>
      <p>Beta</p>
      <p class="text-medium-emphasis">
        Build:
        <time :datetime="Meta.date" v-text="new Date(Meta.date).toISOString()" />
      </p>
      <div class="py-10" />
      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <v-btn
            href="https://vuetifyjs.com/en/components/all/#containment"
            min-width="164"
            rel="noopener noreferrer"
            target="_blank"
            variant="text"
            prepend-icon="mdi-view-dashboard"
          >
            Components
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn
            color="primary"
            href="https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides"
            min-width="228"
            rel="noopener noreferrer"
            size="x-large"
            target="_blank"
            variant="flat"
            prepend-icon="mdi-speedometer"
          >
            Get Started
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn
            href="https://community.vuetifyjs.com/"
            min-width="164"
            rel="noopener noreferrer"
            target="_blank"
            variant="text"
            prepend-icon="mdi-account-group"
          >
            Community
          </v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<style scoped>
.logo:hover {
  will-change: filter;
  filter: drop-shadow(0 0 1em #2196f3aa);
}
</style>
