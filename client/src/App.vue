<template>
  <div id="app">
    <Login />
    <Header />
    <router-view />
    <QRScanner v-if="scanning" />
    <Footer />
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Login from "@/components/Login.vue";
import QRScanner from "@/components/QRScanner.vue";

export default Vue.extend({
  name: "App",
  components: { Header, Footer, Login, QRScanner },
  computed: mapState("scan", ["scanning"])
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
</style>
