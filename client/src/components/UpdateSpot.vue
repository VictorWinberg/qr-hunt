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
    <form lass="form">
      <label for="title">
        Select an awesome title for your spot
      </label>
      <input
        id="title"
        type="text"
        autocomplete="off"
        :value="qrSpot.title"
        @input="e => setQrSpot({ ...qrSpot, title: e.target.value })"
      />

      <label for="note">
        Tell us something about this spot
      </label>
      <input
        id="note"
        type="text"
        autocomplete="off"
        :value="qrSpot.note"
        @input="e => setQrSpot({ ...qrSpot, note: e.target.value })"
      />
      <label for="hint">
        Do you want to give a hint of where the spot can be found?
      </label>
      <input
        id="hint"
        type="text"
        autocomplete="off"
        :value="qrSpot.hint"
        @input="e => setQrSpot({ ...qrSpot, hint: e.target.value })"
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

      <button
        type="button"
        class="saveBtn"
        :class="{ disabled: !valid }"
        @click="save"
      >
        Save Spot
      </button>
    </form>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapMutations } from "vuex";
import { QR_SPOT_MODE } from "@/constans";

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
    ...mapMutations("qrSpot", ["setQrSpot"]),
    save() {
      if (this.mode === this.QR_SPOT_MODE.CREATE) {
        this.$store.dispatch("qrSpot/create");
      } else if (this.mode === this.QR_SPOT_MODE.EDIT) {
        this.$store.dispatch("qrSpot/edit");
      }
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
input[type="text"] {
  box-sizing: border-box;
  width: 100%;
  height: 3em;
  padding: 0.5em;
  margin-bottom: 1em;
  border: solid #bbb 1px;
}

.saveBtn {
  color: white;
  background-color: green;

  &.disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}

.spinner-icon {
  width: 50px;
  animation: spin 1500ms linear infinite;
}
</style>
