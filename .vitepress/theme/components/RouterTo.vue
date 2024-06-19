<template>
  <div class="router-to-wrapper print-hidden">
    <a
      class="router-anchor"
      :href="href"
    >
      <slot name="icon"></slot>
      <span> {{ text }}</span>
    </a>
  </div>
</template>

<script setup lang="ts">
type Props = {
  href?: string;
  text?: string;
};

const props = withDefaults(defineProps<Props>(), {
  href: "/",
  text: "Go Home",
});
</script>

<style scoped lang="less">
.router-to-wrapper {
  margin: 2rem auto;
  font-size: 1rem;
  line-height: 1.75;

  .router-anchor {
    opacity: 0.5;
    color: var(--default-color);
    display: inline-flex;
    gap: 0.5rem;
    align-items: center;

    &:hover {
      opacity: 0.75;
    }
  }
}
</style>
