<template>
  <div class="three-container">
    <TresCanvas preset="realistic">
      <TresPerspectiveCamera
        :position="[0, 0, 3]"
        :look-at="[0, 0, 0]"
      />
      <TresMesh>
        <TresTorusGeometry :args="[0.5, 0.2, 8, 128]" />
        <TresMeshBasicMaterial color="orange" />
      </TresMesh>
      <TresAmbientLight :intensity="1" />
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
</script>

<style scoped lang="less">
.three-container {
  width: 100vw;
  height: calc(100vh - 64px);
}
</style>
