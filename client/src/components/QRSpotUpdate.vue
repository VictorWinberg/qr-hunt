<template>
  <div>
    <div class="update-title">
      <div v-if="mode === QR_SPOT_MODE.CREATE">
        Make your spot
      </div>
      <div v-else>
        Change your spot
      </div>
    </div>
    <form class="form">
      <label for="title">
        Select an awesome title for your spot
      </label>
      <input
        id="title"
        type="text"
        autocomplete="off"
        :value="qrSpot.title"
        @input="e => setQRSpot({ ...qrSpot, title: e.target.value })"
      />

      <label for="note">
        Tell us something about this spot
      </label>
      <textarea
        id="note"
        type="text"
        autocomplete="off"
        :value="qrSpot.note"
        @input="e => setQRSpot({ ...qrSpot, note: e.target.value })"
      />
      <label for="hint">
        Do you want to give a hint of where the spot can be found?
      </label>
      <input
        id="hint"
        type="text"
        autocomplete="off"
        :value="qrSpot.hint"
        @input="e => setQRSpot({ ...qrSpot, hint: e.target.value })"
      />
      <div v-if="qrSpot.lat && qrSpot.lng">
        Coordinates:
        <br />
        <b>Lat:</b> {{ Math.round(qrSpot.lat * 1000) / 1000 }}, <b>Lng:</b>
        {{ Math.round(qrSpot.lng * 1000) / 1000 }}
      </div>
      <div v-else>
        Loading amazing coordinates...
        <br />
        <img
          alt="Loading..."
          class="spinner-icon"
          :src="require('@/assets/spinner.svg')"
        />
      </div>
      <br />
      <button
        type="button"
        class="saveBtn"
        :class="{ disabled: !valid }"
        @click="save"
      >
        Save Spot
      </button>
      <button type="button" class="deleteBtn" @click="destroy">
        Delete Spot
      </button>
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
    return {
      QR_SPOT_MODE
    };
  },
  computed: {
    ...mapState("qrSpot", ["qrSpot", "mode"]),
    valid: function() {
      const { title, lat, lng } = this.qrSpot;
      return title && lat && lng;
    }
  },
  methods: {
    ...mapMutations("qrSpot", ["setQRSpot", "setModalState"]),
    ...mapActions("qrSpot", ["create", "edit"]),
    save() {
      if (this.mode === QR_SPOT_MODE.CREATE) {
        this.create();
      } else if (this.mode === QR_SPOT_MODE.EDIT) {
        this.edit();
      }
    },
    destroy() {
      this.$store.commit("popup/setPopup", {
        title: "Delete qrspot",
        subtitle: "Are you sure you want to delete your qrspot?",
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

              this.setModalState(QR_SPOT_PANEL.HIDE);
              EventBus.$emit(EVENT_TYPE.QR_SPOTS_UPDATE);
            }
          }
        ]
      });
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

.deleteBtn {
  color: white;
  background-color: $danger;
}

.spinner-icon {
  width: 50px;
  animation: spin 1500ms linear infinite;
}
</style>
