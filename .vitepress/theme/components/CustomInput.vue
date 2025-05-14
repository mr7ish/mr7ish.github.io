<template>
  <div class="input-wrapper">
    <slot></slot>
    <!-- <IconSearch
      class="icon-search animate__animated"
      :class="isFocus ? 'animate__jello' : ''"
      :size="20"
      :color="isFocus ? 'var(--vp-c-brand-1)' : undefined"
    /> -->
    <input
      class="input"
      type="text"
      :placeholder="placeholder"
      v-model="keywords"
      @focus="isFocus = true"
      @blur="isFocus = false"
    />
  </div>
</template>

<script setup lang="ts">
// import IconSearch from "./svgs/IconSearch.vue";

withDefaults(
  defineProps<{
    placeholder?: string;
  }>(),
  {
    placeholder: "Search...",
  }
);

const keywords = defineModel("keywords");
const isFocus = defineModel("isFocus", { default: false });
</script>

<style scoped lang="less">
.input-wrapper {
  position: relative;
  display: inline-flex;

  // .icon-search {
  //   position: absolute;
  //   top: 0.375rem;
  //   left: 0.375rem;
  //   font-size: 0.75rem;
  // }

  .input {
    border: 1px solid var(--search-filter-border);
    border-radius: 0.45rem;
    background-color: transparent;
    padding: 0.25rem;
    padding-left: 2rem;
    font-size: 0.875rem;

    &:focus {
      border: 1px solid var(--vp-c-brand-1);
    }
  }
}
</style>
