<template>
  <div id="app">
    <Login />
    <router-view />
  </div>
</template>

<script>
import Vue from "vue";
import Login from "@/components/Login.vue";

export default Vue.extend({
  name: "App",
  components: { Login }
});
</script>

<style lang="scss">
#app {
  display: flex;
  justify-content: center;
  height: 100vh;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  color: $text-color;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body,
html {
  margin: 0;
  background-color: $white;
}
</style>
