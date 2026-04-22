<template>
  <div
    class="ach-root"
    role="button"
    tabindex="0"
    @click="$emit('click')"
    @keydown.enter.prevent="$emit('click')"
    @keydown.space.prevent="$emit('click')"
  >
    <div v-if="overlay" class="ach-overlay" />
    <div v-if="count > 1" class="ach-count" :style="{ backgroundColor: hashColor(String(name)) }">
      <span class="ach-count__text">{{ count }}</span>
    </div>
    <div class="hex" :style="{ color: hashColor(String(name)) }">
      <div class="hex hex__inner">
        <div class="hex hex__inner" :style="{ color: hashColor(String(name)) }">
          <div class="hex__icon">
            <i v-if="isFa" :class="iconClass" />
            <v-icon v-else size="36" :icon="iconClass" />
            <div class="banner">
              <div class="banner__text">
                {{ title || name || '…' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { hashColor } from '@/utils/geo';

const props = withDefaults(
  defineProps<{
    name?: string;
    title?: string;
    icon?: string;
    count?: number;
    overlay?: boolean;
  }>(),
  {
    name: '',
    title: '',
    icon: '',
    count: 0,
    overlay: false
  }
);

defineEmits<{ click: [] }>();

const iconClass = computed(() => props.icon || 'fas fa-question');

const isFa = computed(() => {
  const i = iconClass.value;
  return i.includes('fa-') || i.includes('fas ') || i.includes('far ');
});
</script>

<style scoped lang="scss">
.ach-root {
  position: relative;
}

.ach-overlay {
  position: absolute;
  top: -50vh;
  left: 50%;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  margin-left: -50vw;
  background-color: rgb(0 0 0 / 75%);
}

.ach-count {
  position: absolute;
  top: -4px;
  right: 16px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: solid white 2.5px;
  border-radius: 50%;
}

.ach-count__text {
  font-size: 0.65rem;
  font-weight: 700;
}

.hex {
  position: relative;
  display: flex;
  width: 70px;
  height: 40px;
  margin: 20px 10px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
  background-color: currentcolor;

  &::before,
  &::after {
    position: absolute;
    content: '';
    border-right: 35px solid transparent;
    border-left: 35px solid transparent;
  }

  &::before {
    top: -20px;
    border-bottom: 20px solid currentcolor;
    transform: translateY(0.1px);
  }

  &::after {
    bottom: -20px;
    border-top: 20px solid currentcolor;
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
  transform: scale(0.85);
}

.hex__icon {
  z-index: 1;
  margin-bottom: 1rem;
  color: #eff0eb;
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
  box-shadow:
    0 0 30px rgb(0 0 0 / 15%) inset,
    0 6px 10px rgb(0 0 0 / 15%);

  &::before,
  &::after {
    position: absolute;
    top: 16px;
    left: -15px;
    z-index: -1;
    display: block;
    width: 10px;
    height: 0;
    content: '';
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
