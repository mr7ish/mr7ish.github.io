<template>
  <Layout>
    <template #doc-before>
      <DocBefore />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import DocBefore from "../components/DocBefore.vue";
import { onMounted, ref } from "vue";

const { Layout } = DefaultTheme;

const content = ref("");

const getArticles = async () => {
  const modules = import.meta.glob("../../../site/articles/*.md", {
    // load modules immediately
    eager: true,
  });
  console.log("modules =>", modules);

  const articles = Object.values(modules);
  console.log("articles =>", articles);
};

onMounted(() => {
  getArticles();
});
</script>

<style scoped></style>
