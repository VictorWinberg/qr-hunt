<template>
  <div class="view-wrapper">
    <div class="view-note">{{ qrSpot.note }}</div>
    <div
      v-if="qrSpot.hint"
      class="hint-card"
      :class="{ 'show-hint': showHint }"
      @click="flipHint()"
    >
      <div class="hint-card__question">
        {{ $t("qr-spot.view-hint-question") }}
      </div>
      <div class="hint-card__answer">
        <transition name="fade-slow">
          <div v-if="showHint" class="hint-card__answer-text">
            {{ qrSpot.hint }}
          </div>
        </transition>
      </div>
    </div>
    <div class="last-visited" v-if="qrSpot.lastVisitedAt">
      {{ $t("qr-spot.last-visited") }} {{ formatRelativeTime(qrSpot.lastVisitedAt) }}
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
import dayjs from "@/plugins/dayjs";

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
    },
    formatRelativeTime(date) {
      return dayjs(date).fromNow();
    }
  }
});
</script>

<style lang="scss">
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
  color: $text-color;
  background-color: $dark-brand-color;
}

.hint-card__answer {
  color: $dark-brand-color;
  background-color: $primary-color;
  transform: rotateY(180deg);
}

.hint-card__answer-text {
  max-height: 100%;
  overflow: scroll;
}

.last-visited {
  margin-top: 1em;
  font-size: 0.9em;
  color: gray;
}
</style>
