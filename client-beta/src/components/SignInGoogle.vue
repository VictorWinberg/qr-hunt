<template>
  <v-btn class="g-btn px-0" height="50" variant="flat" @click="handleClick">
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
  overflow: hidden;
  color: #fff !important;
  text-align: center;
  white-space: nowrap;
  background-color: #4285f4 !important;
  border-radius: 1px;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 25%);
}

.g-btn:hover {
  box-shadow: 0 0 3px 3px rgb(66 133 244 / 30%);
}

.g-btn__row {
  display: flex;
  align-items: center;
  min-height: 50px;
}

.g-btn__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background-color: #fff;
  border-radius: 1px;
}

.g-btn__label {
  flex: 1;
  font-family: Roboto, arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 48px;
  letter-spacing: 0.21px;
}
</style>
