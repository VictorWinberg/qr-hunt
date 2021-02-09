<template>
  <div id="app">
    <Login />
    <Header />
    <router-view />
    <QrScanner />
  </div>
</template>

<script>
import Vue from "vue";
import Login from "@/components/Login.vue";
import Header from "@/components/Header.vue";
import QrScanner from "@/components/QRScanner.vue";

export default Vue.extend({
  name: "App",
  components: { Login, Header, QrScanner }
});
</script>

<style lang="scss">
#app {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
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
