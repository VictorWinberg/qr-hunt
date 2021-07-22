<template>
  <div>
    <h2 class="settings__title">Settings</h2>
    <div class="bottom-buttons">
      <a href="/?intro=start" class="help-me">
        <i class="fas fa-question-circle fa-2x"></i> HELP
      </a>
      <a href="/auth/logout" class="log-out">
        <i class="far fa-hand-point-right fa-2x"></i> LOG OUT
      </a>
      <a class="user-remove" @click="deleteMe">
        <i class="fas fa-trash-alt fa-2x"></i> DELETE ACCOUNT
      </a>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
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

              const { err } = await api.delete("/api/user");
              if (err) return;

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

  i.fas {
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
