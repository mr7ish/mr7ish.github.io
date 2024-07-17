<template>
  <div class="cover-wrapper">
    <img :src="path" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type Props = {
  size?: number | string;
  radius?: number | string;
  path?: string;
};

const props = withDefaults(defineProps<Props>(), {
  size: 50,
  radius: 6,
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

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
