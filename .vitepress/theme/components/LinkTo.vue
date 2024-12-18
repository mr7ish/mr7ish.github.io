<template>
  <a
    class="link-to"
    :href="'#' + text"
    :title="text"
  >
    {{ text }}
  </a>
</template>

<script setup lang="ts">
type Props = {
  text?: string;
};

const props = withDefaults(defineProps<Props>(), {
  text: "",
});
</script>

<style scoped lang="less">
.link-to {
  color: #bd34fe;
}
</style>
