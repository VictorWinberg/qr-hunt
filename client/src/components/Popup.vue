<template>
  <div class="popup-overlay">
    <div class="popup-wrapper">
      <div class="popup__close" @click="setPopup(false)">
        <i class="fas fa-times fa-2x"></i>
      </div>
      <div class="popup">
        <div class="popup__title">
          {{ popup.title }}
        </div>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="popup__subtitle" v-html="popup.subtitle"></div>
        <div class="popup__options">
          <div
            v-for="(option, index) in popup.options"
            :key="index"
            class="popup__options__button ripple"
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
    ...mapState("popup", ["popup"])
  },
  methods: {
    ...mapMutations("popup", ["setPopup"])
  }
};
</script>

<style lang="scss">
.popup-overlay {
  position: absolute;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba($primary-color, 0.5);
}

.popup-wrapper {
  position: relative;
  width: 100%;
  max-width: 500px;
  max-height: 100%;
  overflow-y: scroll;
  margin: 20px;
  color: $text-color;
  background-color: $primary-color;
  box-shadow: 0 2px 6px 0 rgba(#000, 0.2);
}

.popup__close {
  position: absolute;
  top: 0;
  right: 0;
  padding: 20px;
  cursor: pointer;
}

.popup {
  padding: 20px;
}

.popup__title {
  margin-top: 20px;
  font-size: 32px;
}

.popup__subtitle {
  margin-top: 10px;
  font-size: 20px;
}

.popup__options {
  display: flex;
  margin-top: 40px;
}

.popup__options__button {
  flex: 1;
  padding: 14px;
  font-size: 18px;
  cursor: pointer;

  &:not(:first-child) {
    margin-left: 20px;
  }

  &.success {
    color: $white;
    background-color: $success;
  }

  &.warning {
    color: $black;
    background-color: $warning;
  }

  &.danger {
    color: $white;
    background-color: $danger;
  }

  &.disabled {
    color: $white;
    background-color: $disabled;
  }
}
</style>
