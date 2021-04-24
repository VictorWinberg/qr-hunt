<template>
  <div>
    <div class="create-title">Create new Spot</div>
    <form lass="form">
      <label for="title">
        Create an awesome title for your new spot:
      </label>
      <input
        id="title"
        type="text"
        autocomplete="off"
        :value="qrSpot.title"
        @input="e => setQrSpot({ ...qrSpot, title: e.target.value })"
      />

      <label for="note">
        Tell your master plan behind this unique spot
      </label>
      <input
        id="note"
        type="text"
        autocomplete="off"
        :value="qrSpot.note"
        @input="e => setQrSpot({ ...qrSpot, note: e.target.value })"
      />
      <label for="hint">
        Do you want to give the searches a hint of where to find this treasure?
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

export default Vue.extend({
  computed: {
    ...mapState("qrSpot", ["qrSpot"]),
    valid: function() {
      const { title, lat, lng } = this.qrSpot;
      return title && lat && lng;
    }
  },
  methods: {
    ...mapMutations("qrSpot", ["setQrSpot"]),
    save() {
      this.$store.dispatch("qrSpot/create");
    }
  }
});
</script>

<style lang="scss">
.create-title {
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
