<template>
  <div class="doc-before-wrapper">
    <h1 class="">Initiative on Sponsorship Forwarding Forwarding</h1>
    <MetaTime />
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

const { frontmatter } = useData();
console.log("frontmatter =>", frontmatter.value);
</script>

<style scoped lang="less">
.doc-before-wrapper {
  h1 {
    font-size: 2.25em;
    font-weight: 800;
    margin-bottom: 0.8888889em;
    line-height: 1.1111111;
    color: #fff;
  }

  .cover-wrapper {
    height: auto;
    max-height: 425px;
    margin-bottom: 25px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
    }
  }
}
</style>
