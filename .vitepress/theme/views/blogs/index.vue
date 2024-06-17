<template>
  <main class="blogs-container"></main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import getArticles from "../../utils/getArticles";
import { useData } from "vitepress";

const article = getArticles();
onMounted(() => {
  // getArticles();
});
</script>

<style scoped lang="less">
.blogs-container {
}
</style>
