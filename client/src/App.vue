<template>
  <div id="app">
    <SignIn />
    <Header />
    <keep-alive>
      <router-view :key="$route.name" />
    </keep-alive>
    <QRScanner v-if="scanning" />
    <transition name="fade">
      <Popup v-if="popup" />
    </transition>
    <Footer />
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import SignIn from "@/components/SignIn.vue";
import QRScanner from "@/components/QRScanner.vue";
import Popup from "@/components/Popup.vue";

export default Vue.extend({
  name: "App",
  components: { Header, Footer, SignIn, QRScanner, Popup },
  computed: {
    ...mapState("scan", ["scanning"]),
    ...mapState("popup", ["popup"])
  }
});
</script>

<style lang="scss">
#app {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  color: $text-color;
  text-align: center;
  background-color: $primary-color;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: transparent;
}

@font-face {
  font-family: "Syne";
  src: local("Syne"),
    url(./assets/fonts/Syne/Syne-Regular.ttf) format("truetype");
}
</style>
