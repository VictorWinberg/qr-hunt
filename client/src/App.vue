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
import Snackbar from "node-snackbar";
import Login from "@/components/Login.vue";
import Header from "@/components/Header.vue";
import QrScanner from "@/components/QRScanner.vue";

export default Vue.extend({
  name: "App",
  components: { Login, Header, QrScanner },
  mounted() {
    Snackbar.show({
      text: "Welcome to QR-Hunt!",
      actionText: "Thanks!",
      actionTextColor: "#f66496",
      onActionClick: () => {
        Snackbar.show({
          text: "YEEEY!",
          textColor: "#f66496",
          showAction: false
        });
        this.$fetch("/api/thanks");
      }
    });
  }
});
</script>

<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
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
