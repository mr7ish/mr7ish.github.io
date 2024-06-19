<template>
  <div class="blogs-container">
    <article>
      <div class="blogs-wrapper">
        <template
          v-for="sorted in [...articles, undefinedAticles]"
          :key="sorted.year"
        >
          <BlogCard
            :title="sorted.year"
            :articles="sorted.articles"
          />
        </template>
      </div>
    </article>
    <RouterTo style="max-width: 65ch">
      <template #icon> 🏡 </template>
    </RouterTo>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import getArticles from "../../utils/getArticles";
import { useData } from "vitepress";
import BlogCard from "./components/BlogCard.vue";
import { deepClone } from "../../utils/deepClone";
import RouterTo from "../../components/RouterTo.vue";

const { sortedArticles, undefinedAticles } = getArticles();

const isAscending = ref(false);

const articles = computed(() => {
  if (isAscending.value) return sortedArticles;
  return deepClone(sortedArticles).reverse();
});

onMounted(() => {});
</script>

<style scoped lang="less">
.blogs-container {
  padding: 2.5rem 1.75rem;
  overflow-x: hidden;

  .blogs-wrapper {
    max-width: 65ch;
    margin: auto;
  }
}
</style>
