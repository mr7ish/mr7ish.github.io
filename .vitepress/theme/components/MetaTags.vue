<template>
  <div
    v-if="tags.length > 0"
    class="tags-wrapper"
  >
    <div
      :class="['tag-item', { 'larger-pd': tag.length < 5 }]"
      v-for="(tag, index) in tags"
      :key="index"
    >
      {{ tag }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useData } from "vitepress";
import { Ref, computed } from "vue";
import { SpecifiedFrontmatter } from "../../../env";

const { frontmatter }: { frontmatter: Ref<SpecifiedFrontmatter> } = useData();

const tags = computed(() => frontmatter.value.tags ?? []);
</script>

<style scoped lang="less">
.tags-wrapper {
  display: flex;
  gap: 0.5rem;

  .tag-item {
    padding: 0.15rem 0.575rem;
    background-color: var(--meta-tag-bg);
    border-radius: 1rem;
    font-size: 0.6875rem;
    color: var(--vp-c-brand-1);
  }

  .larger-pd {
    padding: 0.25rem 1rem;
  }
}
</style>
