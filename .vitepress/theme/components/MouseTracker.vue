<template>
  <!-- <teleport to="body"> -->
  <div
    class="follower"
    :style="{
      left: `${x}px`,
      top: `${y}px`,
    }"
  ></div>
  <!-- </teleport> -->
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMouseTracker } from "../hooks/useMouseTracker";

type Props = {
  color?: string;
  size?: number;
  borderWidth?: number;
};

const props = withDefaults(defineProps<Props>(), {
  color: "var(--vp-c-brand-1)",
  // color: "#86BC25",
  size: 20,
  borderWidth: 10,
});

const { x, y } = useMouseTracker();

const lightingColor = computed(() => props.color);
const size = computed(() => `${props.size}px`);
const borderWidth = computed(() => `${props.borderWidth}px`);
</script>

<style scoped lang="less">
.follower {
  width: v-bind(size);
  height: v-bind(size);
  position: fixed;
  z-index: var(--z-i-top);
  top: -100px;
  left: -100px;
  border-radius: 50%;
  border: v-bind(borderWidth) solid v-bind(lightingColor);
  filter: drop-shadow(0 0 v-bind(borderWidth) v-bind(lightingColor))
    drop-shadow(0 0 v-bind(size) v-bind(lightingColor));
  transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), top 0s, left 0s;
  transform: translate(-50%, -50%);
  pointer-events: none;
  will-change: left, top; /* 提示浏览器优化 */
}
</style>
