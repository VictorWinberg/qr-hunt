<template>
  <v-container fluid class="home">
    <v-row>
      <v-col>
        TODO: Google Maps Component
        <br />
        TODO: QRSpot Component
      </v-col>
    </v-row>
    <hello-world />
  </v-container>
  <teleport to="head">
    <meta name="keyword" content="qr-hunt,qr-game,qr-code,competition" />
    <meta
      name="description"
      content="An app that let's you hunt down QR codes, collect points and compete against your friends!"
    />
  </teleport>
</template>

<script lang="ts" setup>
import HelloWorld from '@/components/HelloWorld.vue';
</script>

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
