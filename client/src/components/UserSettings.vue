<template>
  <div>
    <h2 class="settings__title">
      {{ $t("settings.title") }}
    </h2>
    <div class="settings__buttons">
      <a href="/?intro=start" class="help-me">
        {{ $t("settings.help-option") }}
      </a>

      <div class="select-language">
        {{ $t("settings.language-option") }}
        <select :value="user.locale" @change="setLocale">
          <option :value="null">
            {{ $t("settings.browser-language") }}
          </option>
          <option
            v-for="(locale, i) in locales"
            :key="`locale-${i}`"
            :value="locale"
          >
            {{ locale }}
          </option>
        </select>
      </div>

      <a href="/auth/logout" class="log-out">
        {{ $t("settings.logout-option") }}
      </a>
      <a class="user-remove" @click="deleteMe">
        {{ $t("settings.delete-account-option") }}
      </a>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { api } from "@/utils";
import i18n from "@/plugins/i18n";
import { languages } from "../locales";

export default {
  data() {
    return {
      locales: languages || []
    };
  },
  computed: {
    ...mapState("user", ["user"])
  },
  methods: {
    ...mapMutations("user", ["setAuth"]),
    async setLocale(event) {
      const locale = event.target.value || null;
      if (locale) {
        i18n.locale = locale;
      } else {
        i18n.locale = navigator.language.split("-")[0];
      }
      await api.put("/api/user", {
        body: JSON.stringify({ locale })
      });
    },
    async deleteMe() {
      this.$store.commit("popup/setPopup", {
        title: "Delete account",
        subtitle: "Are you sure you want to delete your account?",
        options: [
          {
            name: "Cancel",
            type: "disabled",
            action: async () => {
              this.$store.commit("popup/setPopup", false);
            }
          },
          {
            name: "Delete",
            type: "danger",
            action: async () => {
              this.$store.commit("popup/setPopup", false);

              const user = await api.delete("/api/user");
              if (user.err) return;

              this.setAuth({ isAuthenticated: false });
              this.$router.push("/");
            }
          }
        ]
      });
    }
  }
};
</script>

<style lang="scss">
.settings__buttons {
  display: flex;
  flex-direction: column;
  margin-top: auto;
  margin-bottom: 20px;
}

select {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 0;
  background-color: transparent;
  border: none;
  appearance: none;
}

.select-language,
.user-remove,
.help-me,
.log-out {
  position: relative;
  display: block;
  padding: 1rem 2rem;
  margin: 1rem;
  color: white;
  text-decoration: none;
  text-transform: uppercase;
  cursor: pointer;
}

.select-language,
.help-me,
.log-out {
  background: $grey-800;
}

.user-remove {
  background: $danger;
}
</style>
