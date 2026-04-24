<script setup lang="ts">
import { useGlobal, useScan, useUser } from '@/store';
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
import qrScanBtn from '@/assets/qr-scanner-button.svg?url';
import userNavSvg from '@/assets/user.svg?raw';
import GlobalDialog from '@/components/GlobalDialog.vue';
import QRScanner from '@/components/QRScanner.vue';
import SignInOverlay from '@/components/SignInOverlay.vue';
import useDialog from '@/store/DialogStore';

/** Vuetify Theme */
const theme = useTheme();

/** Global Store */
const globalStore = useGlobal();

const scanStore = useScan();
const { scanning } = storeToRefs(scanStore);
const userStore = useUser();
const { status: userStatus, isAuthenticated } = storeToRefs(userStore);
const dialog = useDialog();

/** Hide app chrome on the dedicated sign-in screen (map stays underneath). */
const showAppChrome: ComputedRef<boolean> = computed(
  () => userStatus.value === 'pending' || isAuthenticated.value
);

const appVersion = __APP_VERSION__;

/** App / document title */
const title = 'QR-Hunt';

const logoUrl = `${import.meta.env.BASE_URL}logo.svg`;

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
  <v-app theme="dark">
    <sign-in-overlay />
    <global-dialog />

    <v-app-bar v-if="showAppChrome" color="background" :height="80">
      <v-app-bar-title tag="h1">
        <router-link
          class="app-bar-logo text-decoration-none d-inline-flex align-center"
          :to="{ name: 'Home' }"
          :aria-label="title"
        >
          <v-img class="app-bar-logo__img" :src="logoUrl" alt="" width="52" height="52" contain />
        </router-link>
      </v-app-bar-title>
      <v-spacer />
      <v-btn
        class="user-nav-btn"
        :to="{ name: 'User' }"
        icon
        variant="plain"
        :ripple="false"
        aria-label="User profile"
      >
        <span class="user-nav-img" role="img" aria-hidden="true" v-html="userNavSvg" />
      </v-btn>
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

    <v-footer
      v-if="showAppChrome"
      app
      class="app-footer app-footer--dark pa-0"
      color="background"
      elevation="0"
    >
      <div class="footer-bar">
        <span class="footer-bar__title text-body-1 font-weight-medium">{{ title }}</span>
        <v-btn
          class="scan-fab"
          icon
          size="x-large"
          variant="plain"
          :ripple="false"
          aria-label="Scan QR code"
          @click="toggleScan"
        >
          <v-img :src="qrScanBtn" width="72" height="72" contain />
        </v-btn>
        <v-btn
          class="footer-bar__version text-none font-weight-regular"
          variant="text"
          @click="viewRelease"
        >
          {{ appVersion }}
          <v-icon
            v-if="localAppVersion !== appVersion"
            color="warning"
            icon="mdi-alert-circle-outline"
            size="small"
          />
        </v-btn>
      </div>
    </v-footer>
  </v-app>
  <teleport to="head">
    <meta name="theme-color" :content="theme.computedThemes.value.dark.colors.primary" />
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

.app-bar-logo__img {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
}

// Footer + scan control mirror legacy client: bar with rounded top; QR art overlaps the map.
.app-footer.v-footer {
  overflow: visible;
  z-index: 6;
  border-top-left-radius: 1.25rem;
  border-top-right-radius: 1.25rem;
  box-shadow: 0 -4px 14px rgb(0 0 0 / 22%);
}

.app-footer--dark .footer-bar {
  color: rgb(var(--v-theme-on-background));
}

.footer-bar {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  width: 100%;
  min-height: 3.75rem;
  padding: 0.75rem 1rem;
}

.footer-bar__title {
  grid-column: 1;
  justify-self: start;
  z-index: 2;
}

.footer-bar__version {
  grid-column: 3;
  justify-self: end;
  z-index: 2;
}

.scan-fab {
  position: absolute;
  left: 50%;
  bottom: 100%;
  z-index: 3;
  min-width: 5.5rem;
  min-height: 5.5rem;
  margin-bottom: -0.25rem;
  /* Centered on full footer width; Y offset keeps parchment overlapping the map. */
  transform: translate(-50%, 38%);
  filter: drop-shadow(0 4px 10px rgb(0 0 0 / 40%));
}

.scan-fab.v-btn--variant-plain {
  opacity: 1;
  background: transparent;
}

/* 20px matches Vuetify `.v-toolbar__content > .v-toolbar-title { margin-inline-start: 20px }` */
.v-app-bar .user-nav-btn.v-btn--variant-plain {
  width: 46px;
  height: 46px;
  min-width: 46px;
  margin-inline-end: 20px;
  opacity: 1;
  background: transparent !important;
}

.user-nav-img {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  line-height: 0;
  color: rgb(var(--v-theme-primary));
}

.user-nav-img :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
