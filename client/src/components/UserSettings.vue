<template>
  <div>
    <h2 class="settings__title">Settings</h2>
    <div class="bottom-buttons">
      <a href="/?intro=start" class="help-me">
        HELP
      </a>
      <a href="/auth/logout" class="log-out">
        LOG OUT
      </a>
      <a class="user-remove" @click="deleteMe">
        DELETE ACCOUNT
      </a>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { api } from "@/utils";

export default {
  methods: {
    ...mapMutations("user", ["setAuth"]),
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
.bottom-buttons {
  margin-top: auto;
  margin-bottom: 20px;
}

.user-remove,
.help-me,
.log-out {
  display: block;
  padding: 1rem 2rem;
  margin: 1rem;
  color: white;
  text-decoration: none;
  cursor: pointer;

  i {
    vertical-align: sub;
  }
}

.help-me,
.log-out {
  background: $grey-800;
}

.user-remove {
  background: $danger;
}
</style>
