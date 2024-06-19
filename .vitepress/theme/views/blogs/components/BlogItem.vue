<template>
  <div class="blog-item-wrapper">
    <div class="title">
      <span>{{ $attrs.articleTitle }}</span>
    </div>
    <div class="time">
      <MetaTime
        :customTime="{
          createTime: $attrs.createTime as string,
          min: $attrs.min as number,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import MetaTime from "../../../components/MetaTime.vue";
</script>

<style scoped lang="less">
.blog-item-wrapper {
  margin: 0.5em 0;
  display: flex;
  gap: 0.5rem;
  flex-direction: column;

  .title {
    line-height: 1.2em;
    font-size: 1.125rem;
    color: var(--default-color);
  }

  .time {
    :deep(span) {
      font-size: 0.875rem;
    }
  }
}

@media (min-width: 768px) {
  .blog-item-wrapper {
    flex-direction: row;
  }
}
</style>
