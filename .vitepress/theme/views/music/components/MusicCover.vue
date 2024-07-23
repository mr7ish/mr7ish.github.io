<template>
  <div class="cover-wrapper">
    <div
      v-if="isLoading"
      class="loading-mask"
    >
      <LoadingSvg />
    </div>
    <img :src="path" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import LoadingSvg from "./LoadingSvg.vue";

type Props = {
  size?: number | string;
  radius?: number | string;
  path?: string;
  isLoading?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  size: 50,
  radius: 6,
  isLoading: false,
});

const size = computed(() =>
  typeof props.size === "number" ? `${props.size}px` : props.size
);
const radius = computed(() =>
  typeof props.radius === "number" ? `${props.radius}px` : props.radius
);
</script>

<style scoped lang="less">
.cover-wrapper {
  width: v-bind(size);
  height: v-bind(size);
  overflow: hidden;
  border-radius: v-bind(radius);
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .loading-mask {
    width: 100%;
    height: 100%;
    position: absolute;
    // background-color: rgba(255, 255, 255, 0.6);
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    :deep(.icon-loading) {
      width: 50%;
      height: 50%;
      animation: loading 1.5s linear infinite;

      path {
        // fill: #1668dc;
        fill: rgba(255, 255, 255, 0.9);
      }
    }
  }
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
