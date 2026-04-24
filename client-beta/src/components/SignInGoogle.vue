<template>
  <a href="/auth/google" class="g-btn">
    <span class="g-btn__icon">
      <img alt="" :src="googleLogo" width="18" height="18" />
    </span>
    <span class="g-btn__label">{{ t('google.sign-in') }}</span>
  </a>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import googleLogo from '@/assets/google.svg';

const { t } = useI18n();
</script>

<style scoped>
.g-btn,
.g-btn:visited {
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
  width: 240px;
  max-width: 100%;
  min-height: 50px;
  margin-inline: auto;
  padding: 0;
  overflow: hidden;
  color: #fff;
  font: inherit;
  text-decoration: none;
  text-transform: none;
  white-space: nowrap;
  cursor: pointer;
  background-color: #4285f4;
  border-radius: 1px;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 25%);
  transition:
    background-color 0.218s,
    box-shadow 0.218s;
}

.g-btn:hover {
  box-shadow: 0 0 3px 3px rgb(66 133 244 / 30%);
}

.g-btn:active {
  background-color: #3367d6;
}

.g-btn:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.g-btn__icon,
.g-btn__label {
  display: flex;
  align-items: center;
  justify-content: center;
}

.g-btn__icon {
  flex-shrink: 0;
  width: 48px;
  background-color: #fff;
  border-radius: 1px;
}

.g-btn__label {
  flex: 1;
  font-family: Roboto, arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.21px;
}
</style>
