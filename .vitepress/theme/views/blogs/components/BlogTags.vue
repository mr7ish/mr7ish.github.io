<template>
  <div class="tags-wrapper">
    <div
      v-for="tag in tags"
      :key="tag"
      :class="[
        'tag-item',
        { 'larger-pd': tag.length < 5, actived: clicked === tag },
      ]"
      @click="emit('get-clicked-tag', tag)"
    >
      {{ tag }}
    </div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  tags?: string[];
  clicked?: string;
};

const props = withDefaults(defineProps<Props>(), {
  tags: () => [],
  clicked: "",
});

const emit = defineEmits<{
  "get-clicked-tag": [value: string];
}>();
</script>

<style scoped lang="less">
.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  .tag-item.actived {
    opacity: 1;
  }

  .tag-item {
    padding: 0.15rem 0.575rem;
    background-color: var(--meta-tag-bg);
    border-radius: 1rem;
    font-size: 0.6875rem;
    // color: var(--vp-c-brand-1);
    color: var(--default-color);
    opacity: 0.5;
    cursor: pointer;
    transition: all 0.5s ease;

    &:hover {
      opacity: 1;
    }
  }

  .larger-pd {
    padding: 0.25rem 1rem;
  }
}
</style>
