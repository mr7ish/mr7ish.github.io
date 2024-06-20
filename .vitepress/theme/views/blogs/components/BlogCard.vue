<template>
  <div class="blog-card-wrapper">
    <div
      class="time-wrapper slide-enter"
      :style="{
        '--enter-stage': $attrs.timeStageSum as number,
      }"
    >
      <span class="time-label">{{ title }}</span>
    </div>
    <div
      v-for="(article, index) in articles"
      :key="article.fileName! + index"
      class="slide-enter"
      :style="{
          '--enter-stage': index + ($attrs.articleStageSum as number),
        }"
    >
      <a
        class="article-item-anchor"
        :href="article.relativePath"
      >
        <BlogItem
          v-bind="{
            createTime: article.createTime,
            min: article.min,
            articleTitle: article.title ?? article.fileName,
          }"
        />
      </a>
    </div>
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
    font-size: 1rem;
    line-height: 1.75;
    user-select: none;
    pointer-events: none;

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

  .article-item-anchor {
    display: inline-flex;
    opacity: 0.6;
    transition: all 0.2s ease-out;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
