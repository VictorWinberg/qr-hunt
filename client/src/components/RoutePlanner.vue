<template>
  <div class="route-planner-wrapper" :class="{ open }">
    <div class="route-planner-container">
      <h2 class="route-planner__title">{{ $t("route-planner.title") }}</h2>

    <div class="route-planner__modes">
      <button
        type="button"
        class="route-planner__mode"
        :class="{ active: mode === ROUTE_PLAN_MODE.COUNT }"
        @click="setMode(ROUTE_PLAN_MODE.COUNT)"
      >
        {{ $t("route-planner.mode-count") }}
      </button>
      <button
        type="button"
        class="route-planner__mode"
        :class="{ active: mode === ROUTE_PLAN_MODE.TIME }"
        @click="setMode(ROUTE_PLAN_MODE.TIME)"
      >
        {{ $t("route-planner.mode-time") }}
      </button>
    </div>

    <div class="route-planner__input-row">
      <span class="route-planner__input-label">
        {{
          mode === ROUTE_PLAN_MODE.COUNT
            ? $t("route-planner.input-count")
            : $t("route-planner.input-time")
        }}
      </span>
      <select
        :key="mode"
        :value="selectedOptionValue"
        class="route-planner__input"
        @change="onSelectChange"
      >
        <option
          v-for="n in selectOptions"
          :key="n"
          :value="String(n)"
        >
          {{ n }}
        </option>
      </select>
    </div>

    <div class="route-planner__actions">
      <button type="button" class="route-planner__btn primary" @click="onPlan">
        {{ $t("route-planner.plan") }}
      </button>
      <button
        v-if="plan"
        type="button"
        class="route-planner__btn"
        @click="clear"
      >
        {{ $t("route-planner.clear") }}
      </button>
    </div>

    <div v-if="plan" class="route-planner__summary">
      <div v-if="alternatives.length > 1" class="route-planner__alts">
        <button
          type="button"
          class="route-planner__alt-btn"
          :aria-label="$t('route-planner.prev-route')"
          @click="prevAlternative"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <span>
          {{
            $t("route-planner.alternative", {
              current: planIndex + 1,
              total: alternatives.length
            })
          }}
        </span>
        <button
          type="button"
          class="route-planner__alt-btn"
          :aria-label="$t('route-planner.next-route')"
          @click="nextAlternative"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      <p>
        {{
          $t("route-planner.summary", {
            count: plan.actualK,
            distance: formatDistance(plan.totalMeters),
            minutes: plan.totalMinutes
          })
        }}
      </p>
      <p v-if="warning" class="route-planner__warning">{{ warning }}</p>
    </div>

    <ol v-if="plan" class="route-planner__stops">
      <li
        v-for="(stop, index) in plan.stops"
        :key="stop.id || index"
        class="route-planner__stop"
        @click="selectStop(stop)"
      >
        <span class="route-planner__stop-index">{{ index + 1 }}</span>
        <span class="route-planner__stop-title">
          {{ stop.title || $t("route-planner.untitled") }}
        </span>
        <span class="route-planner__stop-distance">
          {{ formatDistance(legDistance(index)) }}
        </span>
      </li>
    </ol>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapGetters, mapActions } from "vuex";
import { ROUTE_PLAN_MODE } from "@/constants";
import { distance } from "@/geo";

export default Vue.extend({
  name: "RoutePlanner",
  props: {
    markers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return { ROUTE_PLAN_MODE };
  },
  computed: {
    ...mapState("route", [
      "open",
      "mode",
      "plan",
      "alternatives",
      "planIndex",
      "warning"
    ]),
    ...mapGetters("route", ["inputValue"]),
    ...mapState({ userCoords: state => state.user.coords }),
    selectOptions() {
      if (this.mode === ROUTE_PLAN_MODE.COUNT) {
        return Array.from({ length: 20 }, (_, i) => i + 1);
      }
      const minutes = [];
      for (let m = 15; m <= 120; m += 15) minutes.push(m);
      return minutes;
    },
    selectedOptionValue() {
      const options = this.selectOptions;
      const current = Number(this.inputValue);
      if (options.includes(current)) return String(current);
      const fallback =
        this.mode === ROUTE_PLAN_MODE.TIME ? 45 : 5;
      return String(fallback);
    }
  },
  watch: {
    mode: {
      immediate: true,
      handler() {
        this.syncInputToOptions();
      }
    }
  },
  methods: {
    ...mapActions("route", {
      setMode: "setMode",
      setInputValue: "setInputValue",
      planRoute: "plan",
      clearRoute: "clear",
      prevAlternative: "prevAlternative",
      nextAlternative: "nextAlternative"
    }),
    ...mapActions("qrSpot", ["select"]),
    onSelectChange(event) {
      this.setInputValue(Number(event.target.value));
    },
    syncInputToOptions() {
      const options = this.selectOptions;
      const current = Number(this.inputValue);
      if (options.includes(current)) return;
      this.setInputValue(
        this.mode === ROUTE_PLAN_MODE.TIME ? 45 : 5
      );
    },
    onPlan() {
      this.planRoute({ markers: this.markers, userCoords: this.userCoords });
    },
    clear() {
      this.clearRoute();
    },
    selectStop(stop) {
      this.select(stop);
    },
    formatDistance(meters) {
      if (meters == null || Number.isNaN(meters)) return "N/A";
      return meters < 1000
        ? `${meters.toFixed(0)} m`
        : `${(meters / 1000).toFixed(1)} km`;
    },
    legDistance(index) {
      if (!this.plan) return 0;
      const prev = index === 0 ? this.plan.start : this.plan.stops[index - 1];
      const curr = this.plan.stops[index];
      return distance(
        { lat: Number(prev.lat), lng: Number(prev.lng) },
        { lat: Number(curr.lat), lng: Number(curr.lng) }
      );
    }
  }
});
</script>

<style lang="scss">
.route-planner-wrapper {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 5;
  height: 0;
  overflow: hidden;
  pointer-events: none;
  box-shadow: 0 -2px 6px 0 rgba($black, 0.2);
  transition: all 200ms 0ms, height 500ms;

  &.open {
    height: 50%;
    pointer-events: auto;
  }
}

.route-planner-container {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  padding: 1em 1em 3em;
  overflow: scroll;
  color: $text-color;
  background-color: $secondary-color;
  border-radius: 2px;
  box-shadow: $shadow-color;
}

.route-planner__title {
  margin: 0 0 0.75em;
  font-size: 1.25rem;
  font-weight: normal;
  transition: all 0.5s;
}

.route-planner__modes {
  display: flex;
  gap: 0.5em;
  max-width: 500px;
  margin: 0 auto 0.75em;
}

.route-planner__mode {
  flex: 1;
  padding: 0.5em;
  color: $text-color;
  cursor: pointer;
  background: $primary-color;
  border: solid #bbb 1px;
  border-radius: 2px;

  &.active {
    color: $primary-color;
    background: $light-brand-color;
    border-color: $light-brand-color;
  }
}

.route-planner__input-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
  max-width: 500px;
  margin: 0 auto 0.75em;
  font-size: 1rem;
}

.route-planner__input-label {
  flex: 1;
  min-width: 0;
  text-align: left;
}

.route-planner__input {
  box-sizing: border-box;
  flex-shrink: 0;
  width: 5.5em;
  padding: 0.4em 0.6em;
  color: $text-color;
  text-align: center;
  text-align-last: center;
  cursor: pointer;
  background: $primary-color;
  border: solid #bbb 1px;
  border-radius: 2px;
}

.route-planner__actions {
  display: flex;
  gap: 0.5em;
  max-width: 500px;
  margin: 0 auto 0.75em;
}

.route-planner__btn {
  flex: 1;
  height: 3em;
  padding: 0.6em;
  color: $text-color;
  cursor: pointer;
  background: $primary-color;
  border: solid #bbb 1px;
  border-radius: 2px;

  &.primary {
    color: $primary-color;
    background: $light-brand-color;
    border-color: $light-brand-color;
  }
}

.route-planner__summary {
  max-width: 500px;
  margin: 0 auto 0.75em;
  font-size: 1rem;

  p {
    margin: 0.25em 0;
  }
}

.route-planner__alts {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75em;
  margin-bottom: 0.5em;
  font-size: 1rem;
}

.route-planner__alt-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2em;
  height: 2em;
  color: $text-color;
  cursor: pointer;
  background: $primary-color;
  border: solid #bbb 1px;
  border-radius: 2px;
}

.route-planner__warning {
  color: $warning;
}

.route-planner__stops {
  max-width: 500px;
  padding: 0;
  margin: 0 auto;
  list-style: none;
}

.route-planner__stop {
  display: flex;
  align-items: center;
  gap: 0.75em;
  padding: 0.55em 0.25em;
  cursor: pointer;
  border-bottom: 1px solid rgba($white, 0.08);

  &:active {
    background: rgba($black, 0.15);
  }
}

.route-planner__stop-index {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 1.5em;
  height: 1.5em;
  font-size: 0.85rem;
  font-weight: 700;
  color: $primary-color;
  background: $light-brand-color;
  border-radius: 50%;
}

.route-planner__stop-title {
  flex: 1;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.route-planner__stop-distance {
  flex-shrink: 0;
  font-size: 1rem;
  color: $grey-200;
}
</style>
