<template>
  <footer>
    <div class="footer-content">
      <span class="app__name">QR Hunt</span>
      <span class="app__version">{{ APP_VERSION }}</span>
    </div>
    <img
      id="qrcode"
      :src="require('@/assets/qr-scanner-button.svg')"
      @click="qrscan()"
    />
  </footer>
</template>

<script>
import Vue from "vue";
import { mapMutations } from "vuex";

export default Vue.extend({
  name: "Footer",
  data() {
    return {
      APP_VERSION
    };
  },
  methods: {
    ...mapMutations("scan", ["toggleScan"]),
    qrscan() {
      this.toggleScan();
    }
  }
});
</script>

<style lang="scss">
footer {
  position: relative;
  z-index: 6;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 65px;
}

.footer-content {
  width: 100%;
  height: 100%;
  background: $primary-color;
  box-shadow: 0 -2px 6px 0 rgba($black, 0.2);
}

.app__name,
.app__version {
  position: absolute;
  bottom: 0;
  padding: 1rem;
}

.app__name {
  left: 0;
}

.app__version {
  right: 0;
}

#qrcode {
  position: absolute;
  bottom: 1rem;
  width: 100px;
  cursor: pointer;
  filter: drop-shadow(0 -4px 4px rgba($black, 0.75));
}
</style>
