<template>
  <svg
    class="icon"
    :class="className"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="24416"
    width="200"
    height="200"
  >
    <path
      d="M353.834667 371.498667a42.666667 42.666667 0 1 1 60.330666-60.330667L469.333333 366.336V170.666667a42.666667 42.666667 0 0 1 85.333334 0v195.669333l55.168-55.168a42.666667 42.666667 0 1 1 60.330666 60.330667l-128 128a42.666667 42.666667 0 0 1-60.330666 0zM725.333333 426.666667a42.666667 42.666667 0 0 0 0 85.333333 128 128 0 0 1 128 128v42.666667a128 128 0 0 1-128 128H298.666667a128 128 0 0 1-128-128v-42.666667a128 128 0 0 1 128-128 42.666667 42.666667 0 0 0 0-85.333333 213.589333 213.589333 0 0 0-213.333334 213.333333v42.666667a213.589333 213.589333 0 0 0 213.333334 213.333333h426.666666a213.589333 213.589333 0 0 0 213.333334-213.333333v-42.666667a213.589333 213.589333 0 0 0-213.333334-213.333333z m42.666667 213.333333a42.666667 42.666667 0 1 0-42.666667 42.666667 42.666667 42.666667 0 0 0 42.666667-42.666667z"
      fill="#41416E"
      p-id="24417"
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
