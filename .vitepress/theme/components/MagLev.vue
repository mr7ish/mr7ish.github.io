<template>
  <div
    class="mag-lev-wrapper"
    @mousemove="onMousemove"
    @mouseover="onMouseover"
    @mouseout="onMouseout"
    :style="{
      transform: `translate(${transX}px, ${transY}px)`,
      top: `${clientH - 200}px`,
      left: '20px',
    }"
  >
    <IconTodo
      svg-title="Todo"
      color="var(--default-color)"
      style="cursor: pointer"
    />
  </div>
  <MouseTracker
    :size="isMouseover ? 80 : 0"
    :borderWidth="isMouseover ? 2 : 0"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import MouseTracker from "./MouseTracker.vue";
import IconTodo from "./svgs/IconTodo.vue";
import { getClientInfo } from "../utils/element";

const { clientH } = getClientInfo();

const isMouseover = ref(false);
const transX = ref(0);
const transY = ref(0);

function onMousemove(e: MouseEvent) {
  const { offsetX, offsetY } = e;
  const { clientWidth, clientHeight } = e.target as HTMLElement;

  transX.value = offsetX - clientWidth;
  transY.value = offsetY - clientHeight;

  console.log("offsetX =>", offsetX);
  console.log("offsetY =>", offsetY);
  console.log("clientWidth =>", clientWidth);
  console.log("clientHeight =>", clientHeight);
  console.log("transX =>", transX.value);
  console.log("transY =>", transY.value);
}

function onMouseout() {
  transX.value = 0;
  transY.value = 0;
  isMouseover.value = false;
}

function onMouseover() {
  isMouseover.value = true;
}
</script>

<style scoped lang="less">
.mag-lev-wrapper {
  position: fixed;
  z-index: var(--z-i-top);
  width: 50px;
  height: 50px;
  // background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s;
  filter: drop-shadow(0 0 10px var(--vp-c-brand-1))
    drop-shadow(0 0 50px var(--vp-c-brand-1));
}
</style>
