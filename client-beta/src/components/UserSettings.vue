<template>
  <div>
    <h2 class="text-h6 mb-4">{{ t('settings.title') }}</h2>
    <div class="d-flex flex-column ga-3">
      <v-btn block href="/?intro=start" prepend-icon="mdi-help-circle-outline" variant="tonal">
        {{ t('settings.help-option') }}
      </v-btn>
      <v-select
        :model-value="user.locale ?? null"
        hide-details
        item-title="title"
        item-value="value"
        :items="localeItems"
        :label="t('settings.language-option')"
        variant="outlined"
        @update:model-value="setLocale"
      />
      <v-btn block color="secondary" href="/auth/logout" prepend-icon="mdi-logout" variant="tonal">
        {{ t('settings.logout-option') }}
      </v-btn>
      <v-btn
        block
        color="error"
        prepend-icon="mdi-delete-forever"
        variant="tonal"
        @click="deleteMe"
      >
        {{ t('settings.delete-account-option') }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { languages } from '@/locales/languages';
import useDialog from '@/store/DialogStore';
import useUser from '@/store/UserStore';
import { api } from '@/utils/api';

const { t, locale } = useI18n();
const router = useRouter();
const userStore = useUser();
const dialog = useDialog();

const user = computed(() => userStore.user);

const localeItems = computed(() => [
  { title: t('settings.browser-language'), value: null },
  ...languages.map(l => ({ title: l, value: l }))
]);

async function setLocale(value: string | null): Promise<void> {
  if (value) {
    locale.value = value;
  } else {
    locale.value = navigator.language.split('-')[0] ?? 'en';
  }
  await api.put('/api/user', { body: JSON.stringify({ locale: value }) });
}

function deleteMe(): void {
  dialog.setDialog({
    title: 'Delete account',
    subtitle: 'Are you sure you want to delete your account?',
    options: [
      {
        name: 'Cancel',
        type: 'disabled',
        action: async () => dialog.close()
      },
      {
        name: 'Delete',
        type: 'danger',
        action: async () => {
          dialog.close();
          const res = await api.delete('/api/user');
          if (res.err) return;
          userStore.setAuth({ isAuthenticated: false });
          await router.push('/');
        }
      }
    ]
  });
}
</script>
