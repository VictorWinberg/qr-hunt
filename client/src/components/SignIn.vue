<template>
  <transition name="fade">
    <div v-if="status !== 'pending' && !isAuthenticated" class="sign-in">
      <div class="sign-in__inner">
        <h1>QR-Hunt</h1>
        <SignInGoogle />
      </div>
    </div>
  </transition>
</template>

<script>
import Vue from "vue";
import { mapState, mapMutations } from "vuex";
import SignInGoogle from "@/components/SignInGoogle.vue";
import { api } from "@/utils";

export default Vue.extend({
  components: { SignInGoogle },
  computed: mapState("user", ["status", "isAuthenticated"]),
  async created() {
    const { data, err } = await api.get("/api/user");
    if (!err) this.setAuth(data);
  },
  methods: {
    ...mapMutations("user", ["setAuth"])
  }
});
</script>

<style lang="scss">
.sign-in {
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

.sign-in__inner {
  margin-bottom: 40vh;
}
</style>
