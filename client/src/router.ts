import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import Home from "./components/Home.vue";
import Login from "./components/Login.vue";
import NotFound from "./components/NotFound.vue";

Vue.use(VueRouter);

const defaultRoutes: RouteConfig[] = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "*",
    component: NotFound
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: defaultRoutes
});

export default router;
