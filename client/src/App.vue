<template>
  <div id="app">
    <SignIn />
    <Header />
    <router-view />
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
