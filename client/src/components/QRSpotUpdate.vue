<template>
  <div>
    <div class="fixed-button" @click="view()">
      <i class="fas fa-arrow-left fa-2x"></i>
    </div>
    <div class="update-title">
      <div v-if="mode === QR_SPOT_MODE.CREATE">
        {{ $t("qr-spot.create-title") }}
      </div>
      <div v-else>
        {{ qrSpot.title }}
      </div>
    </div>
    <form>
      <label for="title">
        {{
          mode === QR_SPOT_MODE.CREATE
            ? $t("qr-spot.create-name")
            : $t("qr-spot.update-name")
        }}
      </label>
      <input
        id="title"
        type="text"
        autocomplete="off"
        :value="inputQrSpot.title"
        @input="e => (inputQrSpot.title = e.target.value)"
      />

      <label for="note">
        {{ $t("qr-spot.create-description") }}
      </label>
      <textarea
        id="note"
        type="text"
        autocomplete="off"
        :value="inputQrSpot.note"
        @input="e => (inputQrSpot.note = e.target.value)"
      />
      <label for="hint">
        {{
          mode === QR_SPOT_MODE.CREATE
            ? $t("qr-spot.create-hint")
            : $t("qr-spot.update-hint")
        }}
      </label>
      <input
        id="hint"
        type="text"
        autocomplete="off"
        :value="inputQrSpot.hint"
        @input="e => (inputQrSpot.hint = e.target.value)"
      />
      <div v-if="qrSpot.lat && qrSpot.lng">
        {{ $t("qr-spot.coordinates") }}
        <br />
        <b> {{ $t("qr-spot.coordinates-lat") }} </b>
        {{ Math.round(qrSpot.lat * 1000) / 1000 }},
        <b> {{ $t("qr-spot.coordinates-lng") }} </b>
        {{ Math.round(qrSpot.lng * 1000) / 1000 }}
        <i class="fas fa-sync updateBtn" @click="updateQrSpotLocation()"></i>
      </div>
      <div v-else>
        {{ $t("qr-spot.loading-coordinates") }}
        <br />
        <img
          alt="Loading..."
          class="spinner-icon"
          :src="require('@/assets/spinner.svg')"
        />
      </div>
      <br />
      <a class="replaceQRCode" @click="replaceQRCode">
        {{ $t("qr-spot.replace-qrcode") }}
      </a>
      <br />
      <button
        type="button"
        class="saveBtn"
        :class="{ disabled: !valid }"
        @click="saveSpot()"
      >
        {{ $t("common.save") }}
      </button>
      <button type="button" class="deleteBtn" @click="deleteSpot">
        {{ $t("common.delete") }}
      </button>
      <br /><br />
    </form>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapMutations, mapActions } from "vuex";
import { QR_SPOT_MODE, QR_SPOT_PANEL, EVENT_TYPE } from "@/constants";
import { api } from "@/utils";
import EventBus from "@/plugins/event-bus";

export default Vue.extend({
  data() {
    const { title, note, hint } = this.$store.state.qrSpot.qrSpot;
    return {
      inputQrSpot: { title, note, hint },
      QR_SPOT_MODE
    };
  },
  computed: {
    ...mapState("qrSpot", ["qrSpot", "mode"]),
    valid() {
      const { title } = this.inputQrSpot;
      const { lat, lng } = this.qrSpot;
      return title && lat && lng;
    }
  },
  methods: {
    ...mapMutations("scan", ["toggleScan"]),
    ...mapMutations("qrSpot", ["setMode", "setModalState"]),
    ...mapActions("qrSpot", ["create", "edit", "updateQrSpotLocation"]),
    view() {
      this.$store.commit("popup/setPopup", {
        title: "Are you sure?",
        subtitle: "All unsaved changes will be lost.",
        options: [
          {
            name: "Cancel",
            type: "disabled",
            action: async () => {
              this.$store.commit("popup/setPopup", false);
            }
          },
          {
            name: "Yes",
            type: "success",
            action: async () => {
              this.$store.commit("popup/setPopup", false);

              this.setMode(QR_SPOT_MODE.VIEW);
            }
          }
        ]
      });
    },
    saveSpot() {
      if (this.mode === QR_SPOT_MODE.CREATE) {
        this.create(this.inputQrSpot);
      } else if (this.mode === QR_SPOT_MODE.EDIT) {
        this.edit(this.inputQrSpot);
      }
    },
    deleteSpot() {
      this.$store.commit("popup/setPopup", {
        title: "Delete QR Spot",
        subtitle: "Are you sure you want to delete your QR Spot?",
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

              const qrspot = await api.delete("/api/qrspots/" + this.qrSpot.id);
              if (qrspot.err) return;

              this.setMode(QR_SPOT_MODE.VIEW);
              this.setModalState(QR_SPOT_PANEL.HIDE);
              EventBus.$emit(EVENT_TYPE.QR_SPOTS_UPDATE);
            }
          }
        ]
      });
    },
    replaceQRCode() {
      this.setMode(QR_SPOT_MODE.REPLACE_CODE);
      this.toggleScan();
    }
  }
});
</script>

<style lang="scss">
.update-title {
  font-size: 32px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.saveBtn,
.deleteBtn,
input[type="text"],
textarea {
  box-sizing: border-box;
  width: 100%;
  height: 3em;
  padding: 0.8em 0.5em;
  margin-bottom: 1em;
  font-family: inherit;
  resize: none;
  border: solid #bbb 1px;
  transition: height 200ms;
}

input[type="text"],
textarea {
  color: $text-color;
  background-color: $primary-color;
}

textarea:focus {
  height: 8em;
}

.saveBtn {
  color: white;
  background-color: $dark-brand-color;

  &.disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}

.replaceQRCode {
  text-decoration: underline;
}

.deleteBtn {
  color: white;
  background-color: $danger;
}

.updateBtn {
  padding: 0.5rem;
  background-color: $dark-brand-color;
  border: solid #bbb 1px;
  border-radius: 100%;
}

.spinner-icon {
  width: 50px;
}
</style>
