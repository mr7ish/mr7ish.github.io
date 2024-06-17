<template>
  <span
    class="meta-time"
    v-if="frontmatter.createTime"
  >
    {{ getShorthandDate(frontmatter.createTime) }}
  </span>
  <span
    class="meta-time meta-time-read"
    v-if="frontmatter.min"
  >
    <span v-if="frontmatter.createTime"> · </span>
    <span v-else>around</span>
    {{ Math.ceil(frontmatter.min) }}min
  </span>
</template>

<script setup lang="ts">
import { useData } from "vitepress";
import { getShorthandDate } from "../utils/dateFormat";
import { Ref } from "vue";
import { SpecifiedFrontmatter } from "../../../env";

const { frontmatter }: { frontmatter: Ref<SpecifiedFrontmatter> } = useData();
console.log("frontmatter meta =>", frontmatter.value);
</script>

<style scoped lang="less">
.meta-time {
  font-size: 1rem;
  line-height: 1.25rem;
  opacity: 0.5;
  color: var(--meta-time-color);
}

.meta-time-read {
  opacity: 0.4;
}
</style>
