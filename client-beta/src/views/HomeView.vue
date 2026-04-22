<template>
  <div class="home">
    <div class="map-wrapper">
      <google-maps />
      <QRSpot />
    </div>
    <teleport to="head">
      <meta name="keyword" content="qr-hunt,qr-game,qr-code,competition" />
      <meta
        name="description"
        content="An app that let's you hunt down QR codes, collect points and compete against your friends!"
      />
    </teleport>
  </div>
</template>

<script lang="ts">
export default { name: 'HomeView' };
</script>

<script lang="ts" setup>
import GoogleMaps from '@/components/GoogleMaps.vue';
import QRSpot from '@/components/QRSpot.vue';
</script>

<style scoped lang="scss">
.home {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.map-wrapper {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}
</style>
