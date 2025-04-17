<template>
  <a
    :class="isAnchor ? 'anchor-link' : 'vitepress-link'"
    :href="isAnchor ? '#' + href : href"
    :target="isAnchor ? undefined : '_blank'"
    :rel="isAnchor ? undefined : 'noreferrer'"
    :title="href"
  >
    <slot>{{ href }}</slot>
  </a>
</template>

<script setup lang="ts">
type Props = {
  href?: string;
  isAnchor?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  href: "",
  isAnchor: true,
});
</script>

<style scoped lang="less">
.vitepress-link {
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.25s, opacity 0.25s;
}

.anchor-link {
  color: #bd34fe;
}
</style>
