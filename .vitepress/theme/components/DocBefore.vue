<template>
  <div class="doc-before-wrapper">
    <h1>{{ frontmatter.title ?? frontmatter.fileName }}</h1>
    <div class="secondary-row">
      <MetaTime />
      <SpeechSensor style="margin: -0.4rem 1rem 0" />
    </div>
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
import SpeechSensor from "./SpeechSensor.vue";

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

  .secondary-row {
    margin: -1.5rem 0 0.8rem;
    display: flex;
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
