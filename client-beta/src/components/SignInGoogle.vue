<template>
  <v-btn class="g-btn" height="50" variant="flat" @click="handleClick">
    <span class="g-btn__row">
      <span class="g-btn__icon">
        <img alt="" :src="googleLogo" width="18" height="18" />
      </span>
      <span class="g-btn__label">{{ t('google.sign-in') }}</span>
    </span>
  </v-btn>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import googleLogo from '@/assets/google.svg';

const { t } = useI18n();

function handleClick(): void {
  window.location.href = '/auth/google';
}
</script>

<style scoped lang="scss">
.g-btn {
  box-sizing: border-box;
  width: 240px;
  max-width: 100%;
  margin: auto;
  padding: 0 !important;
  grid-template-columns: max-content 1fr max-content !important;
  justify-content: start;
  align-items: stretch;
  overflow: hidden;
  color: #fff !important;
  text-align: center;
  text-indent: 0;
  text-transform: none;
  letter-spacing: normal;
  white-space: nowrap;
  background-color: #4285f4 !important;
  border-radius: 1px;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 25%);
  transition:
    background-color 0.218s,
    border-color 0.218s,
    box-shadow 0.218s;

  /* Vuetify defaults center slot content and add text-indent — both shift the row inward. */
  :deep(.v-btn__content) {
    justify-content: flex-start !important;
    align-items: stretch !important;
    justify-self: stretch !important;
    width: 100% !important;
    min-width: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  :deep(.v-btn__overlay) {
    border-radius: 1px;
  }
}

.g-btn:hover {
  box-shadow: 0 0 3px 3px rgb(66 133 244 / 30%);
}

.g-btn:active {
  background-color: #3367d6 !important;
}

.g-btn__row {
  display: flex;
  align-items: stretch;
  width: 100%;
  min-height: 50px;
  margin: 0;
  padding: 0;
}

.g-btn__icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 48px;
  margin: 0;
  padding: 0;
  background-color: #fff;
  border-radius: 1px;
}

.g-btn__label {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  font-family: Roboto, arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.21px;
  text-align: center;
}
</style>
