<template>
  <svg
    class="icon"
    :class="className"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="6778"
    width="200"
    height="200"
  >
    <path
      d="M784.7936 618.7008c6.7584 6.7584 9.6256 16.5888 7.168 25.8048-2.4576 9.216-9.6256 16.384-18.8416 18.8416-9.216 2.4576-19.0464-0.2048-25.8048-6.9632l-235.52-235.52-235.52 235.52c-5.12 5.12-11.8784 7.9872-19.0464 7.9872-2.2528 0-4.5056-0.2048-6.7584-0.8192-9.216-2.4576-16.384-9.6256-18.8416-18.8416-2.4576-9.216 0.2048-19.0464 6.9632-25.8048L492.9536 364.544c10.4448-10.4448 27.2384-10.4448 37.6832 0l254.1568 254.1568z"
      p-id="6779"
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
