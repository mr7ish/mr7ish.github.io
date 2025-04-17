<template>
  <div class="link-preview-wrapper">
    <LinkTo
      :href="url"
      :isAnchor="false"
      @mouseenter="showPreview"
      @mouseleave="hidePreview"
    />

    <div
      v-if="isVisible"
      class="preview-wrapper"
      :class="[popClass, 'transform-gpu']"
      :style="{
        top: `${-(height + 10)}px`,
      }"
    >
      <div
        class="img-wrapper"
        :style="{
          width: `${width}px`,
          height: `${height}px`,
        }"
      >
        <img
          class="preview-img"
          :src="previewSrc"
          alt="preview"
          @load="handleImageLoad"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import LinkTo from "./LinkTo.vue";

interface Props {
  isStatic?: boolean;
  imageSrc?: string;
  url?: string;
  width?: number;
  height?: number;
  captureWidth?: number;
  captureHeight?: number;
}

const props = withDefaults(defineProps<Props>(), {
  isStatic: false,
  imageSrc: "",
  url: "https://mr7ish.github.io",
  width: 200,
  height: 100,
  captureWidth: 1536,
  captureHeight: 900,
});

const isLoading = ref(true);
const isVisible = ref(false);
const hasPopped = ref(false);

const previewSrc = computed(() => {
  if (props.isStatic) return props.imageSrc;

  const params = new URLSearchParams({
    url: props.url,
    screenshot: "true",
    meta: "false",
    embed: "screenshot.url",
    colorScheme: "light",
    "viewport.isMobile": "true",
    "viewport.deviceScaleFactor": "1",
    "viewport.width": String(props.captureWidth),
    "viewport.height": String(props.captureHeight),
  });

  return `https://api.microlink.io/?${params.toString()}`;
});

const popClass = computed(() => {
  if (!hasPopped.value) return "";
  return "animate-pop";
});

function showPreview() {
  isVisible.value = true;
  setTimeout(() => {
    hasPopped.value = true;
  }, 200);
}

function hidePreview() {
  isVisible.value = false;
  hasPopped.value = false;
  isLoading.value = true;
}

function handleImageLoad() {
  isLoading.value = false;
}
</script>

<style scoped lang="less">
.link-preview-wrapper {
  position: relative;
  display: inline-block;

  .preview-wrapper {
    position: absolute;
    z-index: var(--z-i-top);
    left: 0px;
    pointer-events: none;
  }

  .img-wrapper {
    border-radius: 0.625rem;
    overflow: hidden;
    box-shadow: 0 0 10px var(--link-preview-boxshadow);

    .preview-img {
      width: 100%;
      object-fit: cover;
    }
  }
}

.transform-gpu {
  transform: scale3d(0, 0, 1);
  transform-origin: center bottom;
  will-change: transform;
  backface-visibility: hidden;
}

.animate-pop {
  animation: pop 1s ease forwards;
  will-change: transform;
}

@keyframes pop {
  0% {
    transform: scale3d(0.26, 0.26, 1);
  }
  25% {
    transform: scale3d(1.1, 1.1, 1);
  }
  65% {
    transform: scale3d(0.98, 0.98, 1);
  }
  100% {
    transform: scale3d(1, 1, 1);
  }
}
</style>
