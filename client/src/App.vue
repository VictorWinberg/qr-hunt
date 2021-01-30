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
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $text-color;
  display: flex;
  text-align: center;
  justify-content: center;
}
</style>
