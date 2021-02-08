<template>
  <transition name="fade">
    <div v-if="!isAuthenticated" class="login">
      <div class="login__inner">
        <h1>QR-Hunt</h1>
        <GoogleSignIn />
      </div>
    </div>
  </transition>
</template>

<script>
import Vue from "vue";
import Snackbar from "node-snackbar";
import GoogleSignIn from "@/components/GoogleSignIn.vue";

export default Vue.extend({
  components: { GoogleSignIn },
  data() {
    return {
      isAuthenticated: true
    };
  },
  async created() {
    const { data, err } = await this.$fetch("/auth/user");
    if (!data.isAuthenticated || err) {
      this.isAuthenticated = false;
    }

    const achievement = await this.$fetch("/api/achievements/thankful");
    if (!achievement.err && !achievement.data) {
      Snackbar.show({
        text: "Welcome to QR-Hunt!",
        actionText: "Thanks!",
        actionTextColor: "#f66496",
        onActionClick: () => {
          Snackbar.show({
            text: "YEEEY! You are so kind!",
            textColor: "#f66496",
            showAction: false
          });
          this.$fetch("/api/thanks");
        }
      });
    }
  }
});
</script>

<style lang="scss">
.login {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: rgba($primary, 0.8);
}

.login__inner {
  margin-bottom: 40vh;
}
</style>
