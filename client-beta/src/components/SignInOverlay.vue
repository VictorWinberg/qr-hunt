<template>
  <v-fade-transition>
    <v-overlay
      v-if="visible"
      class="sign-in-overlay align-center justify-center"
      persistent
      scrim="#242424"
      :opacity="0.9"
      :z-index="1000"
      :model-value="true"
    >
      <div class="sign-in__inner">
        <h1>{{ t('common.title') }}</h1>
        <sign-in-google />
      </div>
    </v-overlay>
  </v-fade-transition>
</template>

<script setup lang="ts">
import { useUser } from '@/store';
import { storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

import SignInGoogle from '@/components/SignInGoogle.vue';
import { onApiMutation } from '@/utils/app-events';

const { t } = useI18n();
const userStore = useUser();
const { status, isAuthenticated } = storeToRefs(userStore);

const visible = computed(() => status.value !== 'pending' && !isAuthenticated.value);


let offApi: (() => void) | undefined;

onMounted(() => {
  void userStore.refreshSession();
  offApi = onApiMutation(() => {
    void userStore.refreshSession();
  });
});

onUnmounted(() => {
  offApi?.();
});
</script>

<style scoped lang="scss">
.sign-in__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40vh;
  text-align: center;
}
</style>
