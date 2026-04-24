<template>
  <div class="view-wrapper">
    <div class="view-note text-body-1">{{ qrSpot.note }}</div>
    <div v-if="qrSpot.hint" class="hint-scene">
      <div
        class="hint-card"
        :class="{ 'hint-card--show-hint': showHint }"
        role="button"
        tabindex="0"
        @click="flipHint"
        @keydown.enter.prevent="flipHint"
        @keydown.space.prevent="flipHint"
      >
        <div class="hint-card__question">
          {{ t('qr-spot.view-hint-question') }}
        </div>
        <div class="hint-card__answer">
          <transition name="fade-slow">
            <div v-if="showHint" class="hint-card__answer-text">
              {{ qrSpot.hint }}
            </div>
          </transition>
        </div>
      </div>
    </div>
    <div v-if="qrSpot.lastVisitedAt" class="last-visited text-medium-emphasis text-body-2">
      {{ t('qr-spot.last-visited') }} {{ formatRelativeTime(qrSpot.lastVisitedAt) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import dayjs from '@/plugins/dayjs';
import useQrSpot from '@/store/QrSpotStore';

const { t } = useI18n();
const { qrSpot } = storeToRefs(useQrSpot());
const showHint = ref(false);

function flipHint(): void {
  showHint.value = !showHint.value;
}

function formatRelativeTime(iso: string): string {
  return dayjs(iso).fromNow();
}
</script>

<style scoped lang="scss">
// Match legacy client `client/src/assets/scss/_variables.scss` hint card palette
$hint-question-text: #eff0eb;
$hint-question-bg: #966840;
$hint-answer-text: #966840;
$hint-answer-bg: #242424;

.view-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.view-note {
  max-width: 100%;
  margin-top: 1em;
  overflow-wrap: anywhere;
  white-space: pre-line;
}

.hint-scene {
  margin-top: 1em;
  perspective: 900px;
}

.hint-card {
  position: relative;
  width: 300px;
  height: 3em;
  cursor: pointer;
  box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%);
  transition: transform 1s;
  transform-style: preserve-3d;
}

.hint-card--show-hint {
  transform: rotateY(180deg);
}

.hint-card__question,
.hint-card__answer {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.hint-card__question {
  color: $hint-question-text;
  background-color: $hint-question-bg;
}

.hint-card__answer {
  color: $hint-answer-text;
  background-color: $hint-answer-bg;
  transform: rotateY(180deg);
}

.hint-card__answer-text {
  max-height: 100%;
  padding: 0 0.5rem;
  overflow: auto;
  text-align: center;
}

.last-visited {
  margin-top: 1rem;
}

.fade-slow-enter-active,
.fade-slow-leave-active {
  transition: opacity;
  transition-delay: 1s;
  transition-duration: 2s;
}

.fade-slow-enter-from,
.fade-slow-leave-to {
  opacity: 0;
}
</style>
