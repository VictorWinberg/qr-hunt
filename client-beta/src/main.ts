/**
 * Vue3 Main script
 */

import '@/plugins/achievements';

import store from '@/store';
import { createApp } from 'vue';

import App from '@/App.vue';
import { i18n } from '@/plugins/i18n';
import { initSentry } from '@/plugins/sentry';
import vuetify from '@/plugins/vuetify';
import router from '@/router';

/** Register Vue */
const vue = createApp(App);
initSentry(vue);
vue.use(router);
vue.use(store);
vue.use(i18n);
vue.use(vuetify);

// Run!
router
  .isReady()
  .then(() => vue.mount('#app'))
  .catch((e: unknown) => console.error(e));
