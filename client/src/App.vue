<template>
  <div id="app">
    <transition name="fade">
      <router-view />
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { doFetch } from "./utils";

export default Vue.extend({
  name: "App",
  async created() {
    const { res, err } = await doFetch("/auth/user");
    if (!res.isAuthenticated || err) {
      this.$router.push("login");
    }
  }
});
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $text-color;
  display: flex;
  text-align: center;
  justify-content: center;
}
</style>
