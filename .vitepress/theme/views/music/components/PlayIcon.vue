<template>
  <div class="play-icon-wrapper">
    <div
      :class="[
        'item',
        {
          pause: !play,
        },
      ]"
      v-for="i of count"
      :key="i"
      :style="{
        '--delay': `${(i * 0.2).toFixed(1)}s`,
        height:
          i <= defaultCount ? `calc(100% / ${count} * ${count - i + 1})` : '',
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  count?: number;
  play?: boolean;
};

const defaultCount = 3;

const props = withDefaults(defineProps<Props>(), {
  count: defaultCount,
  play: true,
});
</script>

<style scoped lang="less">
.play-icon-wrapper {
  --delay: 0.2s;

  display: flex;
  gap: 0.5rem;
  align-items: center;
  height: 60px;

  .item {
    width: 10px;
    height: 100%;
    background-color: var(--vp-c-brand-1);
    border-radius: 5px;
    animation: play 0.8s var(--delay) infinite ease;

    &.pause {
      animation: none;
    }
  }
}

@keyframes play {
  0% {
    height: 0;
  }
}
</style>
