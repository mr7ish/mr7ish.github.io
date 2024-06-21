<template>
  <div class="inspired-by-wrapper">
    <span class="prefix">
      {{ prefix }}
    </span>
    <a
      class="author"
      :href="link"
    >
      {{ author }}
    </a>
  </div>
</template>

<script setup lang="ts">
type Props = {
  prefix?: string;
  author?: string;
  link?: string;
};

withDefaults(defineProps<Props>(), {
  prefix: "",
  author: "",
  link: "",
});
</script>

<style scoped lang="less">
.inspired-by-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.875rem;
  opacity: 0.3;
  gap: 0.25rem;

  .author {
    position: relative;
    padding: 0.25rem;

    &::after {
      content: "";
      display: block;
      width: 0%;
      height: 1px;
      background-color: #fff;
      transition: all 0.5s ease;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }

    &:hover::after {
      width: 100%;
    }
  }

  &:hover {
    opacity: 1;

    .prefix {
      opacity: 0.7;
    }
  }
}
</style>
