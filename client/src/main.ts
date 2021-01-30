import Vue, { VNode } from "vue";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/google-maps";
import "./plugins/custom-fetch";
import "./registerServiceWorker";

import "@/assets/scss/app.scss";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h): VNode => h(App)
}).$mount("#app");
