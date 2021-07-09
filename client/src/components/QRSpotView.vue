<template>
  <div class="view-wrapper">
    <div class="view-note">{{ qrSpot.note }}</div>
    <div
      v-if="qrSpot.hint"
      class="hint-card"
      :class="{ 'show-hint': showHint }"
      @click="flipHint()"
    >
      <div class="hint-card__question">Do you need a hint?</div>
      <div class="hint-card__answer">
        <transition name="fade-slow">
          <div v-if="showHint" class="hint-card__answer-text">
            {{ qrSpot.hint }}
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";

export default Vue.extend({
  data() {
    return {
      showHint: false
    };
  },
  computed: {
    ...mapState("qrSpot", ["qrSpot"])
  },
  methods: {
    flipHint() {
      this.showHint = !this.showHint;
    }
  }
});
</script>

<style>
.view-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.view-note {
  max-width: 100%;
  margin-top: 1em;
  word-wrap: break-word;
  white-space: pre-line;
}

.hint-card {
  width: 300px;
  height: 3em;
  margin-top: 1em;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: transform 1s;
  transform-style: preserve-3d;
}

.hint-card.show-hint {
  transform: rotateY(180deg);
}

.hint-card__question,
.hint-card__answer {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.hint-card__question {
  color: black;
  background-color: white;
}

.hint-card__answer {
  color: white;
  background-color: #a9a9a9;
  transform: rotateY(180deg);
}

.hint-card__answer-text {
  max-height: 100%;
  overflow: scroll;
}
</style>
