<template>
  <svg
    class="icon"
    :class="className"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="10946"
    width="200"
    height="200"
  >
    <path
      d="M732.502883 465.602819c-107.883492-82.3454-215.772403-164.681769-323.652282-247.014525-38.414608-29.327534-93.780555-1.929039-93.780555 46.396277v494.029051c0 48.325316 55.365948 75.725617 93.780555 46.398084 107.87988-82.332757 215.76879-164.669126 323.652282-247.014525 30.61356-23.357989 30.61356-69.436372 0-92.794362z"
      fill="#000"
      p-id="10947"
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
