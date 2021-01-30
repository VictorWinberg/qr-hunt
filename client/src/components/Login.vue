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
import GoogleSignIn from "@/components/GoogleSignIn.vue";
import { doFetch } from "@/utils";

export default Vue.extend({
  components: { GoogleSignIn },
  data() {
    return {
      isAuthenticated: true
    };
  },
  async created() {
    const { res, err } = await doFetch("/auth/user");
    if (!res.isAuthenticated || err) {
      this.isAuthenticated = false;
    }
  }
});
</script>

<style>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: rgba(75, 0, 130, 0.8);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
}

.login__inner {
  margin-bottom: 40vh;
}
</style>
