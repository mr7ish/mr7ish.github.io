<template>
  <div
    ref="outerRef"
    class="outer"
    :style="{
      '--border-radius': `${borderRadius}px`,
      '--mask-size': `${maskSize}px`,
      '--mask-color': maskColor,
      '--border-color': borderColor,
      '--blur': `${blur}px`,
      '--bgcolor': backgroundColor,
      '--thickness': `${thickness}px`,
    }"
  >
    <div class="mask"></div>
    <div class="inner">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, shallowRef, useTemplateRef } from "vue";

type Props = {
  borderRadius?: number;
  maskSize?: number;
  duration?: number;
  maskColor?: string;
  borderColor?: string;
  blur?: number;
  backgroundColor?: string;
  thickness?: number;
};

const props = withDefaults(defineProps<Props>(), {
  borderRadius: 5,
  maskSize: 40,
  duration: undefined,
  // maskColor: "#cbacf9",
  maskColor: "var(--vp-c-brand-1)",
  borderColor: "rgb(30, 41, 59)",
  blur: 24,
  backgroundColor: "rgba(27, 27, 31, 0.38)",
  thickness: 2,
});

const outerRef = useTemplateRef("outerRef");
const computedDuration = shallowRef(0);

onMounted(() => {
  console.log(outerRef.value?.clientWidth);
  console.log(outerRef.value?.clientHeight);

  if (!outerRef.value) return;

  const width = outerRef.value.clientWidth;
  const height = outerRef.value.clientHeight;

  // 1s = 460 / 4 = 115px
  computedDuration.value = Math.round(((width + height) * 2) / 115);
});

const duration = computed(() => {
  if (props.duration) return props.duration + "s";
  return computedDuration.value + "s";
});
</script>

<style scoped lang="less">
.todo-wrapper {
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  .canvas {
    width: 500px;
    height: 500px;
    width: 144px;
    height: 86px;
    width: 300px;
    height: 200px;

    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.outer {
  width: 100%;
  height: 100%;
  border-radius: var(--border-radius);
  padding: var(--thickness);
  position: relative;
  overflow: hidden;

  .inner {
    width: 100%;
    height: 100%;
    background-color: var(--bgcolor);
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    backdrop-filter: blur(var(--blur));
  }

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: var(--mask-size);
    height: var(--mask-size);
    animation: moveAround v-bind(duration) linear infinite;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    background-image: radial-gradient(var(--mask-color) 80%, transparent 80%);
  }
}

@keyframes moveAround {
  0% {
    left: calc(var(--mask-size) / 2);
    top: 0px;
  }
  28.93% {
    left: calc(100% - var(--mask-size) / 2);
    top: 0px;
  }
  33.99% {
    left: 100%;
    top: calc(var(--mask-size) / 2);
  }
  44.82% {
    left: 100%;
    top: calc(100% - var(--mask-size) / 2);
  }
  49.88% {
    left: calc(100% - var(--mask-size) / 2);
    top: 100%;
  }
  78.81% {
    left: calc(var(--mask-size) / 2);
    top: 100%;
  }
  83.87% {
    left: 0px;
    top: calc(100% - var(--mask-size) / 2);
  }
  94.70% {
    left: 0px;
    top: calc(var(--mask-size) / 2);
  }
  100% {
    left: calc(var(--mask-size) / 2);
    top: 0px;
  }
}
</style>
