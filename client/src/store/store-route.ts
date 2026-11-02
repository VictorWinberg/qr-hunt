import { ROUTE_PLAN_MODE } from "@/constants";
import i18n from "@/plugins/i18n";
import Snackbar from "@/plugins/snackbar";
import {
  planRouteAlternativesByCount,
  planRouteAlternativesByTime,
  RoutePlan,
  RouteSpot,
  Coords
} from "@/routePlanner";

type RouteMode = typeof ROUTE_PLAN_MODE[keyof typeof ROUTE_PLAN_MODE];
type PickingPoint = null | "start" | "end";

function sameCoords(a: Coords | null, b: Coords | null): boolean {
  if (!a || !b) return false;
  return a.lat === b.lat && a.lng === b.lng;
}

export default {
  namespaced: true,
  state: () => ({
    open: false,
    mode: ROUTE_PLAN_MODE.COUNT as RouteMode,
    countValue: 5,
    timeValue: 60,
    plan: null as RoutePlan | null,
    alternatives: [] as RoutePlan[],
    planIndex: 0,
    warning: null as string | null,
    /** null = use current GPS when planning */
    start: null as Coords | null,
    end: null as Coords | null,
    startIsGps: true,
    endIsGps: true,
    picking: null as PickingPoint
  }),
  mutations: {
    setOpen(state, value: boolean) {
      state.open = value;
      if (!value) state.picking = null;
    },
    toggleOpen(state) {
      state.open = !state.open;
      if (!state.open) state.picking = null;
    },
    setMode(state, mode: RouteMode) {
      state.mode = mode;
    },
    setInputValue(state, value: number) {
      const next = Math.max(1, Number(value) || 1);
      if (state.mode === ROUTE_PLAN_MODE.TIME) state.timeValue = next;
      else state.countValue = next;
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
    setStart(state, payload: { coords: Coords; isGps: boolean }) {
      state.start = { ...payload.coords };
      state.startIsGps = payload.isGps;
    },
    setEnd(state, payload: { coords: Coords; isGps: boolean }) {
      state.end = { ...payload.coords };
      state.endIsGps = payload.isGps;
    },
    setPicking(state, picking: PickingPoint) {
      state.picking = picking;
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
    setMode({ commit }, mode: RouteMode) {
      commit("setMode", mode);
    },
    setInputValue({ commit }, value: number) {
      commit("setInputValue", value);
    },
    clear({ commit }) {
      commit("clear");
    },
    beginPick({ commit }, point: "start" | "end") {
      commit("setPicking", point);
    },
    cancelPick({ commit }) {
      commit("setPicking", null);
    },
    useMyLocation(
      { commit },
      {
        point,
        userCoords
      }: { point: "start" | "end"; userCoords: Coords | null }
    ) {
      if (!userCoords) {
        Snackbar.warn(i18n.t("route-planner.no-location") as string);
        return;
      }
      const payload = { coords: userCoords, isGps: true };
      if (point === "start") commit("setStart", payload);
      else commit("setEnd", payload);
      commit("setPicking", null);
    },
    pickOnMap({ state, commit }, coords: Coords) {
      if (!state.picking) return;
      const payload = { coords, isGps: false };
      if (state.picking === "start") commit("setStart", payload);
      else commit("setEnd", payload);
      commit("setPicking", null);
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
      const start =
        state.start ||
        (userCoords ? { lat: userCoords.lat, lng: userCoords.lng } : null);
      const end =
        state.end ||
        (userCoords ? { lat: userCoords.lat, lng: userCoords.lng } : null);

      if (!start || !end) {
        Snackbar.warn(i18n.t("route-planner.no-location") as string);
        return;
      }

      if (!state.start) {
        commit("setStart", { coords: start, isGps: true });
      }
      if (!state.end) {
        commit("setEnd", { coords: end, isGps: true });
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
        if (alternatives[0].actualK < value) {
          warning = i18n.t("route-planner.partial-k", {
            actual: alternatives[0].actualK,
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
    isLoop: state =>
      sameCoords(state.start, state.end) || (!state.start && !state.end)
  }
};
