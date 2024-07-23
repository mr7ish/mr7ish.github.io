<template>
  <div class="message-notice-wrapper">
    <MessageSvg />
    <span>
      <slot></slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MessageSvg from "./MessageSvg.vue";
import { NoticeType } from "../utils/notice";

const props = withDefaults(
  defineProps<{
    type: NoticeType;
  }>(),
  {
    type: "success",
  }
);

const fillColor = computed(() => {
  if (props.type === "success") return "#49AA19";
  if (props.type === "error") return "#DC4446";
  if (props.type === "warning") return "#D89614";
  if (props.type === "info") return "#1668DC";
});
</script>

<style scoped lang="less">
.message-notice-wrapper {
  --font-size: 0.875rem;

  padding: 0.5rem 0.875rem;
  font-size: var(--font-size);
  color: var(--message-text-color);
  line-height: 1.5714285714285714;

  border-radius: 0.75rem;
  background-color: var(--message-bg-color);

  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);

  display: flex;
  align-items: center;
  gap: 0.5rem;

  :deep(.icon) {
    width: 1rem;
    height: 1rem;

    .path-body {
      fill: v-bind(fillColor);
    }

    .path-circle {
      fill: var(--message-bg-color);
    }
  }
}

@media (max-width: 480px) {
  .message-notice-wrapper {
    --font-size: 0.7rem;
  }
}
</style>
