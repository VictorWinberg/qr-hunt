<template>
  <footer>
    <div class="footer-content">
      <span class="app__name">QR Hunt</span>
      <span class="app__version" @click="viewRelease">
        {{ APP_VERSION }}
        <i
          v-if="localAppVersion !== APP_VERSION"
          class="far fa-exclamation-circle app__notification"
        ></i>
      </span>
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
      APP_VERSION,
      get localAppVersion() {
        return localStorage.getItem("appVersion");
      },
      set localAppVersion(value) {
        localStorage.setItem("appVersion", value);
      }
    };
  },
  created() {
    setTimeout(() => {
      this.localAppVersion = APP_VERSION;
    }, 60 * 1000);
  },
  methods: {
    ...mapMutations("scan", ["toggleScan"]),
    qrscan() {
      this.toggleScan();
    },
    async viewRelease() {
      this.localAppVersion = APP_VERSION;
      const url =
        "//api.github.com/repos/VictorWinberg/qr-hunt/releases/latest";
      const res = await fetch(url);
      const json = await res.json();
      this.$store.commit("popup/setPopup", {
        title: "Release " + APP_VERSION,
        subtitle: json.body
          .replace(/##([^\r\n]+)/g, "<h3>$1</h3>")
          .replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g, "<b>$2</b>")
          .replace(/\r\n\r\n/g, "<br/>")
          .replace(/\r\n/g, "<br/>")
          .replace(/<\/h3><br\/>/g, "</h3>"),
        options: [
          {
            name: "Close",
            type: "disabled",
            action: async () => {
              store.commit("popup/setPopup", false);
            }
          },
          {
            name: "Read More",
            type: "success",
            action: async () => {
              store.commit("popup/setPopup", false);
              location.href = "//github.com/VictorWinberg/qr-hunt/releases";
            }
          }
        ]
      });
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

.app__notification {
  position: absolute;
  top: 0.3rem;
  right: 0.2rem;
}

#qrcode {
  position: absolute;
  bottom: 1em;
  width: 5.5em;
  cursor: pointer;
  filter: drop-shadow(0 -4px 4px rgba($black, 0.75));
}
</style>
