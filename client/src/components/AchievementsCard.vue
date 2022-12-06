<template>
  <div @click="$emit('click')">
    <div v-if="overlay" class="overlay"></div>
    <div
      v-if="count > 1"
      class="count"
      :style="{ backgroundColor: hashColor(name) }"
    >
      <p class="count__title">
        {{ count }}
      </p>
    </div>
    <div class="hex" :style="{ color: hashColor(name) }">
      <div class="hex hex__inner">
        <div class="hex hex__inner" :style="{ color: hashColor(name) }">
          <div class="hex__icon">
            <i :class="(icon || 'fas fa-question') + ' fa-2x'"></i>
            <div class="banner">
              <div class="banner__text async async--text">
                {{ title || name || ". . ." }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { hashColor } from "@/utils";

export default {
  props: {
    name: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    },
    count: {
      type: Number,
      default: 0
    },
    overlay: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hashColor
  }
};
</script>

<style lang="scss">
.overlay {
  position: absolute;
  top: -50vh;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
}

.count {
  position: absolute;
  top: -4px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: solid white 2.5px;
  border-radius: 50%;
}

.count__title {
  font-size: 0.6em;
  font-weight: bold;
}

.hex {
  position: relative;
  display: flex;
  width: 70px;
  height: 40px;
  margin: 20px 10px;
  font-size: 0.8rem;
  font-weight: bold;
  color: $white;
  background-color: currentColor;

  &::before,
  &::after {
    position: absolute;
    content: "";
    border-right: 35px solid transparent;
    border-left: 35px solid transparent;
  }

  &::before {
    top: -20px;
    border-bottom: 20px solid currentColor;
    transform: translateY(0.1px);
  }

  &::after {
    bottom: -20px;
    border-top: 20px solid currentColor;
    transform: translateY(-0.1px);
  }
}

.hex__inner {
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0;
  transform: scale(0.85, 0.85);
}

.hex__icon {
  z-index: 1;
  margin-bottom: 1rem;
  color: $text-color;
}

.banner {
  position: absolute;
  top: 75%;
  left: 50%;
  display: block;
  width: 110px;
  margin-left: -55px;
  line-height: 2;
  text-align: center;
  background: #9b2;
  border: 1px solid #8a1;
  border-radius: 4px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.15) inset, 0 6px 10px rgba(0, 0, 0, 0.15);

  &::before,
  &::after {
    position: absolute;
    top: 16px;
    left: -15px;
    z-index: -1;
    display: block;
    width: 10px;
    height: 0;
    content: "";
    border: 8px solid #9b2;
    border-right: 6px solid #791;
    border-bottom-color: #94b81e;
    border-left-color: transparent;
    transform: rotate(-5deg);
  }

  &::after {
    right: -15px;
    left: auto;
    border-right: 8px solid transparent;
    border-left: 6px solid #791;
    transform: rotate(5deg);
  }
}

.banner__text {
  padding-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
