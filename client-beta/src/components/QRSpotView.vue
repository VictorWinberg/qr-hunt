<template>
  <div class="d-flex flex-column align-center">
    <div class="view-note text-body-1">{{ qrSpot.note }}</div>
    <v-card
      v-if="qrSpot.hint"
      class="hint-card mt-4"
      :class="{ 'hint-card--flipped': showHint }"
      max-width="320"
      min-height="120"
      @click="showHint = !showHint"
    >
      <v-card-text class="text-center">
        <div v-if="!showHint">{{ t('qr-spot.view-hint-question') }}</div>
        <v-fade-transition>
          <div v-if="showHint" class="text-body-2">{{ qrSpot.hint }}</div>
        </v-fade-transition>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import useQrSpot from '@/store/QrSpotStore';

const { t } = useI18n();
const { qrSpot } = storeToRefs(useQrSpot());
const showHint = ref(false);
</script>

<style scoped lang="scss">
.view-note {
  max-width: 100%;
  margin-top: 1em;
  overflow-wrap: anywhere;
  white-space: pre-line;
}

.hint-card {
  cursor: pointer;
  transition: transform 1s;
  transform-style: preserve-3d;
}

.hint-card--flipped {
  transform: rotateY(180deg);
}
</style>
