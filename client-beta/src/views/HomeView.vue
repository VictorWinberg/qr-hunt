<script lang="ts" setup>
import HelloWorld from '@/components/HelloWorld.vue';
</script>

<template>
  <div class="home">
    <div class="map-wrapper">
      TODO: GoogleMaps Component
      <br />
      TODO: QRSpot Component
    </div>
    <hello-world />
  </div>
  <teleport to="head">
    <meta name="keyword" content="qr-hunt,qr-game,qr-code,competition" />
    <meta
      name="description"
      content="An app that let's you hunt down QR codes, collect points and compete against your friends!"
    />
  </teleport>
</template>

<style lang="scss">
.home {
  flex: 1;
  overflow: hidden;
}

.map-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
