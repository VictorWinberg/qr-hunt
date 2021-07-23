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
import { EVENT_TYPE } from "@/constants";
import { api } from "@/utils";
import EventBus from "@/plugins/event-bus";
import SignInGoogle from "@/components/SignInGoogle.vue";

export default Vue.extend({
  components: { SignInGoogle },
  computed: mapState("user", ["status", "isAuthenticated"]),
  async created() {
    this.fetchUser();
    EventBus.$on(EVENT_TYPE.API_REQUEST_UPDATE, this.fetchUser);
  },
  beforeDestroy() {
    EventBus.$off(EVENT_TYPE.API_REQUEST_UPDATE, this.fetchUser);
  },
  methods: {
    ...mapMutations("user", ["setAuth"]),
    async fetchUser() {
      const user = await api.get("/api/user");
      if (!user.err) this.setAuth(user.data);
    }
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
  color: $seconday-color;
  background: rgba($seconday-color, 0.8);
}

.sign-in__inner {
  margin-bottom: 40vh;
}
</style>
