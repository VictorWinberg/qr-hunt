<script setup lang="ts">
import { useGlobal, useConfig, useScan } from '@/store';
import { storeToRefs } from 'pinia';
import {
  computed,
  nextTick,
  onMounted,
  ref,
  watch,
  type ComputedRef,
  type Ref,
  type WritableComputedRef
} from 'vue';

import { useTheme } from 'vuetify';

// Components
import logo from '@/assets/logo.svg';
import qrScanBtn from '@/assets/qr-scanner-button.svg?url';
import DrawerComponent from '@/components/DrawerComponent.vue';
import GlobalDialog from '@/components/GlobalDialog.vue';
import QRScanner from '@/components/QRScanner.vue';
import SignInOverlay from '@/components/SignInOverlay.vue';
import useDialog from '@/store/DialogStore';

/** Vuetify Theme */
const theme = useTheme();

/** Global Store */
const globalStore = useGlobal();

/** Config Store */
const configStore = useConfig();

const scanStore = useScan();
const { scanning } = storeToRefs(scanStore);
const dialog = useDialog();

const appVersion = __APP_VERSION__;

/** Title */
const title = 'QR-Hunt';

/** drawer visibility */
const drawer: Ref<boolean> = ref(false);

/** loading overlay visibility */
const loading: WritableComputedRef<boolean> = computed({
  get: () => globalStore.loading,
  set: v => globalStore.setLoading(v)
});

/** Appbar progressbar value */
const progress: ComputedRef<number | null> = computed(() => globalStore.progress);

/** Snackbar visibility */
const snackbarVisibility: Ref<boolean> = ref(false);

/** Snackbar text */
const snackbarText: ComputedRef<string> = computed(() => globalStore.message);

/** Toggle Dark mode */
const isDark: ComputedRef<string> = computed(() => (configStore.theme ? 'dark' : 'light'));

// When snackbar text has been set, show snackbar.
watch(
  () => globalStore.message,
  message => (snackbarVisibility.value = message !== '')
);

/** Clear store when snackbar hide */
const onSnackbarChanged = async () => {
  globalStore.setMessage();
  await nextTick();
};

onMounted(() => {
  document.title = title;
  setTimeout(() => {
    localStorage.setItem('appVersion', appVersion);
  }, 60 * 1000);
});

function toggleScan(): void {
  scanStore.toggleScan();
}

const localAppVersion = ref(localStorage.getItem('appVersion'));

async function viewRelease(): Promise<void> {
  localAppVersion.value = appVersion;
  const res = await fetch('https://api.github.com/repos/VictorWinberg/qr-hunt/releases/latest');
  const json = (await res.json()) as { name?: string; body?: string };
  dialog.setDialog({
    title: 'Release ' + (json.name ?? ''),
    subtitle: (json.body ?? '')
      .replace(/##([^\r\n]+)/g, '<h3>$1</h3>')
      .replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g, '<b>$2</b>')
      .replace(/\r\n\r\n/g, '<br/>')
      .replace(/\r\n/g, '<br/>')
      .replace(/<\/h3><br\/>/g, '</h3>'),
    options: [
      {
        name: 'Close',
        type: 'disabled',
        action: async () => dialog.close()
      },
      {
        name: 'Read More',
        type: 'success',
        action: async () => {
          dialog.close();
          window.location.href = 'https://github.com/VictorWinberg/qr-hunt/releases';
        }
      }
    ]
  });
}
</script>

<template>
  <v-app :theme="isDark">
    <sign-in-overlay />
    <global-dialog />

    <v-navigation-drawer v-model="drawer" temporary>
      <drawer-component />
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title tag="h1">
        <router-link class="text-decoration-none text-inherit" :to="{ name: 'Home' }">
          {{ title }}
        </router-link>
      </v-app-bar-title>
      <v-spacer />
      <v-progress-linear
        v-show="loading"
        :active="loading"
        :indeterminate="progress === null"
        :model-value="progress !== null ? progress : 0"
        color="blue-accent-3"
      />
    </v-app-bar>

    <v-main class="d-flex flex-column flex-fill overflow-hidden">
      <router-view v-slot="{ Component, route }">
        <template v-if="route.meta.keepAlive">
          <keep-alive>
            <component :is="Component" :key="route.name ?? route.path" />
          </keep-alive>
        </template>
        <component :is="Component" v-else :key="route.path" />
      </router-view>
    </v-main>

    <QRScanner v-if="scanning" />

    <v-overlay v-model="loading" app class="justify-center align-center" persistent>
      <v-progress-circular indeterminate size="64" />
    </v-overlay>

    <v-snackbar v-model="snackbarVisibility" @update:model-value="onSnackbarChanged">
      {{ snackbarText }}
      <template #actions>
        <v-btn icon="mdi-close" @click="onSnackbarChanged" />
      </template>
    </v-snackbar>

    <v-footer app elevation="3" class="d-flex flex-column align-center pa-0">
      <div class="d-flex align-center justify-space-between w-100 px-4 py-2">
        <span>{{ title }}</span>
        <v-btn class="text-none font-weight-regular" variant="text" @click="viewRelease">
          {{ appVersion }}
          <v-icon
            v-if="localAppVersion !== appVersion"
            color="warning"
            icon="mdi-alert-circle-outline"
            size="small"
          />
        </v-btn>
      </div>
      <v-btn class="scan-fab mb-2" icon size="x-large" variant="flat" @click="toggleScan">
        <v-img :src="qrScanBtn" width="56" height="56" contain />
      </v-btn>
    </v-footer>
  </v-app>
  <teleport to="head">
    <meta name="theme-color" :content="theme.computedThemes.value[isDark].colors.primary" />
    <link rel="icon" :href="logo" type="image/svg+xml" />
  </teleport>
</template>

<style lang="scss">
/* stylelint-disable-next-line scss/load-no-partial-leading-underscore */
@use 'vuetify/_settings';
@use 'sass:map';

html {
  // Fix always scrollbar shown.
  overflow-y: auto;
  // Modern scrollbar style
  scrollbar-width: thin;
  scrollbar-color: map.get(settings.$grey, 'lighten-2') map.get(settings.$grey, 'base');
}

::-webkit-scrollbar {
  width: 0.5rem;
  height: 0.5rem;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 0.5rem rgba(0, 0, 0, 0.1);
  background-color: map.get(settings.$grey, 'lighten-2');
}

::-webkit-scrollbar-thumb {
  border-radius: 0.5rem;
  background-color: map.get(settings.$grey, 'base');
  box-shadow: inset 0 0 0.5rem rgba(0, 0, 0, 0.1);
}

// Fixed a bug that the theme color is interrupted when scrolling
.v-application {
  overflow-y: auto;
}

// Fix app-bar's progress-bar
.v-app-bar .v-progress-linear {
  position: absolute;
  bottom: 0;
}

.cursor-pointer {
  cursor: pointer;
}

.scan-fab {
  position: relative;
  margin-top: -2.5rem;
  filter: drop-shadow(0 -4px 4px rgb(0 0 0 / 75%));
}
</style>
