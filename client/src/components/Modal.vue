<template>
  <div class="modal-overlay">
    <div class="modal-wrapper">
      <div class="close-button" @click="setModal(false)">
        <i class="fas fa-times fa-2x"></i>
      </div>
      <div class="modal">
        <div class="modal__title">
          {{ modal.title }}
        </div>
        <div class="modal__subtitle">
          {{ modal.subtitle }}
        </div>
        <div class="modal__options">
          <div
            v-for="(option, index) in modal.options"
            :key="index"
            class="modal__options__button"
            :class="option.type"
            v-on="option.action ? { click: option.action } : {}"
          >
            {{ option.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  computed: {
    ...mapState("modal", ["modal"])
  },
  methods: {
    ...mapMutations("modal", ["setModal"])
  }
};
</script>

<style lang="scss">
.modal-overlay {
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(#000, 0.5);
}

.modal-wrapper {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 20px;
  background-color: white;
  box-shadow: 0 2px 6px 0 rgba(#000, 0.2);
}

.close-button {
  position: absolute;
  top: 0;
  right: 0;
  padding: 20px;
  cursor: pointer;
}

.modal {
  padding: 20px;
}

.modal__title {
  margin-top: 20px;
  font-size: 32px;
}

.modal__subtitle {
  margin-top: 10px;
  font-size: 20px;
}

.modal__options {
  display: flex;
  margin-top: 40px;
}

.modal__options__button {
  flex: 1;
  padding: 14px;
  font-size: 18px;
  cursor: pointer;

  &:not(:first-child) {
    margin-left: 20px;
  }

  &.success {
    color: white;
    background-color: green;
  }

  &.warning {
    color: black;
    background-color: orange;
  }

  &.danger {
    color: white;
    background-color: red;
  }

  &.disabled {
    color: white;
    background-color: gray;
  }
}
</style>
