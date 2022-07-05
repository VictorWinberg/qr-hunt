<template>
  <div>
    <h2 class="user-progress__title">Progress</h2>
    <div class="user-progress">
      <div class="pies">
        <div class="pie pie__goal"></div>
        <div class="pie pie__prediction"></div>
        <div class="pie pie__current"></div>
        <div class="pie pie__cover"></div>
      </div>
      <!-- <div class="gauge">
        <div class="gauge__body">
          <div class="gauge__fill" :style="{ transform: `rotate(${gaugeValue}turn)` }"></div>
          <div class="gauge__cover">{{ gaugeValue }} %</div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    gaugeValue() {
      return 0.6 / 2;
    }
  }
};
</script>

<style lang="scss">
.user-progress {
  display: flex;
  justify-content: center;
}

.pies {
  position: relative;
  width: 300px;
  height: 300px;
}

.pie {
  position: absolute;
  border-radius: 50%;
  transform: rotate(225deg);
}

.pie__goal {
  width: 100%;
  height: 100%;
  background-image: conic-gradient(#f012be 75%, #575759 25%);
}

.pie__prediction {
  width: 100%;
  height: 100%;
  background-image: conic-gradient(#01ff70 50%, transparent 0%);
}

.pie__current {
  width: 100%;
  height: 100%;
  background-image: conic-gradient(#2ecc40 45%, transparent 0%);
}

.pie__cover {
  top: 18%;
  left: 18%;
  width: 64%;
  height: 64%;
  background-color: #575759;
}

.gauge {
  display: none;
  width: 100%;
  max-width: 250px;
}

.gauge__body {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 50%;
  overflow: hidden;
  background-color: darkgray;
  border-top-left-radius: 100% 200%;
  border-top-right-radius: 100% 200%;
}

.gauge__fill {
  position: absolute;
  top: 100%;
  left: 0;
  width: inherit;
  height: 100%;
  background-color: #00bcd4;
  transition: transform 0.2s ease-out;
  transform: rotate(0.25turn);
  transform-origin: center top;
}

.gauge__cover {
  position: absolute;
  top: 25%;
  left: 50%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 75%;
  height: 150%;
  padding-bottom: 25%;
  font-size: 32px;
  background: $secondary-color;
  border-radius: 50%;
  transform: translateX(-50%);
}
</style>
