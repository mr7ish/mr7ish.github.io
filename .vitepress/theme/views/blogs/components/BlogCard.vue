<template>
  <div class="blog-card-wrapper">
    <div class="time-wrapper">
      <span class="time-label">{{ title }}</span>
    </div>
    <template v-for="article in articles">
      <!-- TODO adjust v-bind obj -->
      <BlogItem v-bind="article" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { SpecifiedFrontmatter } from "../../../../../env";
import BlogItem from "./BlogItem.vue";

type Props = {
  title: string;
  articles: (SpecifiedFrontmatter & { relativePath: string })[];
};

const props = defineProps<Props>();
</script>

<style scoped lang="less">
.blog-card-wrapper {
  .time-wrapper {
    position: relative;
    height: 5rem;
    user-select: none;
    font-size: 1rem;
    line-height: 1.75;

    .time-label {
      position: absolute;
      top: -2rem;
      left: -3rem;
      opacity: 0.1;
      color: transparent;
      font-size: 8em;
      font-weight: 700;
      -webkit-text-stroke-width: 2px;
      -webkit-text-stroke-color: rgb(170, 170, 170);
    }
  }
}
</style>
