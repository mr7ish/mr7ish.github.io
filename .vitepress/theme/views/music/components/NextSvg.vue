<template>
  <svg
    class="icon"
    :class="className"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="6063"
    width="200"
    height="200"
  >
    <path
      d="M698.7 292c17.6 0 32 14.4 32 32v376c0 17.6-14.4 32-32 32s-32-14.4-32-32V324c0-17.6 14.4-32 32-32zM611.7 489.5L336.6 296.9c-8.4-5.9-19.4-6.6-28.5-1.9-9.1 4.8-14.8 14.1-14.8 24.4v385.3c0 10.3 5.7 19.7 14.8 24.4 9.1 4.6 20.1 4 28.5-1.9l275.2-192.6c7.3-5.2 11.7-13.6 11.7-22.6 0-9-4.4-17.4-11.8-22.5z"
      fill="#000"
      p-id="6064"
    ></path>
  </svg>
</template>

<script setup lang="ts">
type Props = {
  className?: string;
};

const props = withDefaults(defineProps<Props>(), {
  className: "",
});
</script>

<style scoped></style>
