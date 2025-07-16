<template>
  <div class="todo-wrapper">
    <div class="canvas">
      <ShimmerWrapper> qqqqqqqq </ShimmerWrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
import ShimmerWrapper from "../../components/ShimmerWrapper.vue";
</script>

<style scoped lang="less">
.todo-wrapper {
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  .canvas {
    width: 300px;
    height: 200px;

    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
