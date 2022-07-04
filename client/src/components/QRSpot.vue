<template>
  <div class="qrspot-wrapper" :class="panel">
    <div
      class="qrspot-container"
      @click="setModalState(QR_SPOT_PANEL.SHOW_DETAILS)"
    >
      <transition name="fade" mode="out-in">
        <div v-if="mode === QR_SPOT_MODE.VIEW" key="view">
          <div class="qrspot-summary">
            <div class="qrspot-title">{{ qrSpot.title }}</div>
            <div class="qrspot-info">
              <div class="qrspot-info__distance">
                <i class="fas fa-route"></i>
                {{ distanceToMarker(userCoords, qrSpot) }}
              </div>
              <!-- <div class="qrspot-info__rating">
                <i class="far fa-star"></i>
                {{ qrSpot.rating || "N/A" }}
              </div> -->
            </div>
          </div>
          <div v-if="panel === QR_SPOT_PANEL.SHOW_DETAILS">
            <div
              v-if="qrSpot.isOwner || user.isAdmin"
              class="fixed-button"
              :class="{ danger: !qrSpot.isOwner && user.isAdmin }"
              @click="edit()"
            >
              <i class="fas fa-pencil-alt fa-2x"></i>
            </div>
            <QRSpotView />
          </div>
        </div>
        <div v-else key="update">
          <QRSpotUpdate />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapMutations } from "vuex";
import { QR_SPOT_MODE, QR_SPOT_PANEL } from "@/constants";
import QRSpotView from "./QRSpotView";
import QRSpotUpdate from "./QRSpotUpdate";
import { distance } from "@/utils";

export default Vue.extend({
  name: "QRSpot",
  components: {
    QRSpotView,
    QRSpotUpdate
  },
  data() {
    return {
      QR_SPOT_MODE,
      QR_SPOT_PANEL
    };
  },
  computed: {
    ...mapState("qrSpot", ["qrSpot", "mode", "panel"]),
    ...mapState("user", ["user"]),
    ...mapState({ userCoords: state => state.user.coords })
  },
  methods: {
    ...mapMutations("qrSpot", ["setMode", "setModalState"]),
    edit() {
      this.setMode(QR_SPOT_MODE.EDIT);
    },
    distanceToMarker(pos1, pos2) {
      if (!pos1 || !pos2) return "N/A";
      const d = distance(pos1, pos2);
      return d < 1000 ? d.toFixed(1) + " m" : (d / 1000).toFixed(1) + " km";
    }
  }
});
</script>

<style lang="scss">
.qrspot-wrapper {
  position: absolute;
  box-shadow: 0 -2px 6px 0 rgba($black, 0.2);

  .qrspot-title {
    transition: all 0.5s;
  }

  &.HIDE {
    right: 60px;
    bottom: -65px;
    left: 60px;
    height: 0;
    transition: bottom 500ms 0ms, left 0ms 500ms, right 0ms 500ms,
      height 500ms 0ms;
  }

  &.SHOW_INFO {
    right: 60px;
    bottom: 24px;
    left: 60px;
    height: 90px;
    transition: all 300ms 200ms, height 500ms 0ms;

    .qrspot-title {
      font-size: 24px;
    }
  }

  &.SHOW_DETAILS {
    right: 0;
    bottom: 0;
    left: 0;
    height: 75%;
    transition: all 200ms 0ms, height 500ms;

    .qrspot-title {
      font-size: 32px;
    }
  }
}

.qrspot-container {
  box-sizing: border-box;
  height: 100%;
  padding: 1em;
  overflow: scroll;
  color: $text-color;
  cursor: pointer;
  background-color: $secondary-color;
  border-radius: 2px;
  box-shadow: $shadow-color;
}

.qrspot-info {
  display: flex;
  justify-content: center;
  max-width: 500px;
  margin: 0 auto;
  font-size: 1rem;
}

.qrspot-info__distance {
  padding: 0 10px;
}

.qrspot-info__rating {
  padding: 0 10px;
}

.fixed-button {
  position: absolute;
  top: 1em;
  right: 1em;

  &.danger {
    color: $danger;
  }
}
</style>
