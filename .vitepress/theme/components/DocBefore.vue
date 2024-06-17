<template>
  <div class="doc-before-wrapper">
    <h1 class="">{{ frontmatter.title ?? frontmatter.fileName }}</h1>
    <p style="margin: -1.5rem 0 0.8rem">
      <MetaTime />
    </p>
    <MetaTags style="margin: 0 0 1.5rem -0.2rem" />
    <div
      class="cover-wrapper"
      v-if="frontmatter.cover"
    >
      <img
        :src="withBase(frontmatter.cover)"
        alt="a cover for this article"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useData, withBase } from "vitepress";
import MetaTime from "./MetaTime.vue";
import MetaTags from "./MetaTags.vue";
import { Ref } from "vue";
import { SpecifiedFrontmatter } from "../../../env";

const { frontmatter }: { frontmatter: Ref<SpecifiedFrontmatter> } = useData();
console.log("frontmatter =>", frontmatter.value);
</script>

<style scoped lang="less">
.doc-before-wrapper {
  h1 {
    font-size: 2.25em;
    font-weight: 800;
    margin-bottom: 0.8888889em;
    line-height: 1.1111111;
    color: var(--default-color);
  }

  .cover-wrapper {
    height: auto;
    max-height: 425px;
    margin-bottom: 25px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.625rem;

    img {
      width: 100%;
    }
  }
}
</style>
