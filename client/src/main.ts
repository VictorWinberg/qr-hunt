import Vue, { VNode } from "vue";

import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import i18n from "./plugins/i18n";
import "./plugins/achievements";
import "./plugins/google-maps";
import "./plugins/intro";
import "./plugins/sentry";
import "./plugins/welcome";
import "./registerServiceWorker";

import "./assets/scss/app.scss";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: (h): VNode => h(App)
}).$mount("#app");
