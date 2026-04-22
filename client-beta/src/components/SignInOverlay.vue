<template>
  <v-fade-transition>
    <v-overlay
      v-if="visible"
      class="align-center justify-center"
      persistent
      scrim="rgba(87, 87, 89, 0.8)"
      :model-value="true"
    >
      <div class="sign-in__inner text-center">
        <h1 class="text-h4 mb-6">{{ t('common.title') }}</h1>
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
  margin-bottom: 40vh;
}
</style>
