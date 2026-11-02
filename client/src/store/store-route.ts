import {
  QR_SPOT_PANEL,
  ROUTE_PLAN_COUNT,
  ROUTE_PLAN_MODE,
  ROUTE_PLAN_TIME
} from "@/constants";
import { clamp, range } from "@/utils/number";
import { coordsEqual, Coords } from "@/utils/geo";
import i18n from "@/plugins/i18n";
import Snackbar from "@/plugins/snackbar";
import {
  planRouteAlternativesByCount,
  planRouteAlternativesByTime,
  RoutePlan,
  RouteSpot
} from "@/routePlanner";

type RouteMode = "count" | "time";

function userCoordsToPoint(
  userCoords: { lat: number; lng: number } | null
): Coords | null {
  if (!userCoords) return null;
  return { lat: userCoords.lat, lng: userCoords.lng };
}

function resolvePlanningEndpoints(
  state: {
    start: Coords | null;
    end: Coords | null;
  },
  userCoords: Coords | null
): { start: Coords | null; end: Coords | null } {
  const start = state.start || userCoords;
  const end = state.end || userCoords;
  return { start, end };
}

export default {
  namespaced: true,
  state: () => ({
    open: false,
    mode: ROUTE_PLAN_MODE.COUNT,
    countValue: ROUTE_PLAN_COUNT.default,
    timeValue: ROUTE_PLAN_TIME.default,
    plan: null,
    alternatives: [],
    planIndex: 0,
    warning: null,
    start: null,
    end: null
  }),
  mutations: {
    setOpen(state, value: boolean) {
      state.open = value;
    },
    toggleOpen(state) {
      state.open = !state.open;
    },
    setMode(state, mode: RouteMode) {
      state.mode = mode;
    },
    setInputValue(state, value: number) {
      switch (state.mode) {
        case ROUTE_PLAN_MODE.TIME:
          state.timeValue = clamp(value, ROUTE_PLAN_TIME);
          break;
        case ROUTE_PLAN_MODE.COUNT:
          state.countValue = clamp(value, ROUTE_PLAN_COUNT);
          break;
      }
    },
    setAlternatives(state, alternatives: RoutePlan[]) {
      state.alternatives = alternatives;
      state.planIndex = 0;
      state.plan = alternatives[0] || null;
    },
    setPlanIndex(state, index: number) {
      if (!state.alternatives.length) return;
      const next =
        ((index % state.alternatives.length) + state.alternatives.length) %
        state.alternatives.length;
      state.planIndex = next;
      state.plan = state.alternatives[next];
    },
    setWarning(state, warning: string | null) {
      state.warning = warning;
    },
    setStart(state, coords: Coords) {
      state.start = { ...coords };
    },
    setEnd(state, coords: Coords) {
      state.end = { ...coords };
    },
    clear(state) {
      state.plan = null;
      state.alternatives = [];
      state.planIndex = 0;
      state.warning = null;
    }
  },
  actions: {
    toggleOpen({ commit }) {
      commit("toggleOpen");
    },
    close({ commit }) {
      commit("setOpen", false);
    },
    setMode({ commit }, mode: RouteMode) {
      commit("setMode", mode);
    },
    setInputValue({ commit }, value: number) {
      commit("setInputValue", value);
    },
    clear({ commit }) {
      commit("clear");
    },
    seedEndpoints(
      { state, commit },
      { userCoords }: { userCoords: Coords | null }
    ) {
      const coords = userCoordsToPoint(userCoords);
      if (!coords) return;
      if (!state.start) {
        commit("setStart", coords);
      }
      if (!state.end) {
        commit("setEnd", coords);
      }
    },
    setEndpoint(
      { commit },
      {
        point,
        coords
      }: {
        point: "start" | "end";
        coords: Coords;
      }
    ) {
      commit("clear");
      if (point === "start") commit("setStart", coords);
      else commit("setEnd", coords);
    },
    prevAlternative({ state, commit }) {
      commit("setPlanIndex", state.planIndex - 1);
    },
    nextAlternative({ state, commit }) {
      commit("setPlanIndex", state.planIndex + 1);
    },
    plan(
      { state, commit },
      {
        markers,
        userCoords
      }: { markers: RouteSpot[]; userCoords: Coords | null }
    ) {
      const gps = userCoordsToPoint(userCoords);
      const { start, end } = resolvePlanningEndpoints(state, gps);

      if (!start || !end) {
        return;
      }

      if (!state.start) {
        commit("setStart", start);
      }
      if (!state.end) {
        commit("setEnd", end);
      }

      const raw =
        state.mode === ROUTE_PLAN_MODE.TIME
          ? state.timeValue
          : state.countValue;
      const value = Math.max(1, Math.floor(raw) || 1);

      let alternatives: RoutePlan[] = [];
      let warning: string | null = null;

      if (state.mode === ROUTE_PLAN_MODE.COUNT) {
        alternatives = planRouteAlternativesByCount(markers, start, value, end);
        if (!alternatives.length) {
          Snackbar.warn(i18n.t("route-planner.empty-pool") as string);
          commit("clear");
          return;
        }
        if (alternatives[0].stopCount < value) {
          warning = i18n.t("route-planner.partial-k", {
            actual: alternatives[0].stopCount,
            requested: value
          }) as string;
        }
      } else {
        alternatives = planRouteAlternativesByTime(markers, start, value, end);
        if (!alternatives.length) {
          Snackbar.warn(i18n.t("route-planner.time-too-short") as string);
          commit("clear");
          return;
        }
      }

      commit("setAlternatives", alternatives);
      commit("setWarning", warning);
    }
  },
  getters: {
    inputValue: state =>
      state.mode === ROUTE_PLAN_MODE.TIME ? state.timeValue : state.countValue,
    countSelectOptions: () =>
      range(ROUTE_PLAN_COUNT.min, ROUTE_PLAN_COUNT.max, ROUTE_PLAN_COUNT.step),
    timeSelectOptions: () =>
      range(ROUTE_PLAN_TIME.min, ROUTE_PLAN_TIME.max, ROUTE_PLAN_TIME.step),
    selectOptions: (state, getters) =>
      state.mode === ROUTE_PLAN_MODE.TIME
        ? getters.timeSelectOptions
        : getters.countSelectOptions,
    effectiveStart: (state, _getters, rootState) => {
      if (state.plan) return state.plan.start;
      if (!state.open) return null;
      if (state.start) return state.start;
      return userCoordsToPoint(rootState.user.coords);
    },
    effectiveEnd: (state, _getters, rootState) => {
      if (state.plan) return state.plan.end;
      if (!state.open) return null;
      if (state.end) return state.end;
      return userCoordsToPoint(rootState.user.coords);
    },
    routeEndpointsSame: (_state, getters) =>
      coordsEqual(getters.effectiveStart, getters.effectiveEnd),
    routeEndpointsDraggable: (state, _getters, rootState) =>
      state.open && rootState.qrSpot.panel !== QR_SPOT_PANEL.SHOW_DETAILS,
    routePath: state => {
      if (!state.plan || !state.plan.stops.length) return [];
      const { start, end, stops } = state.plan;
      return [
        start,
        ...stops.map(s => ({ lat: Number(s.lat), lng: Number(s.lng) })),
        end
      ];
    }
  }
};
