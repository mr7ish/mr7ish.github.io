<template>
  <div
    :class="[
      'music-list-container',
      {
        top: open && isTop,
        bottom: open && !isTop,
      },
    ]"
    @click.stop
    :style="
      isTop
        ? {
            bottom: '-150vh',
          }
        : { top: '-250vh' }
    "
  >
    <div
      class="music-item"
      v-for="(m, i) in musicList"
      :key="i"
      ref="musicItemRef"
    >
      <div
        class="basic-info"
        :class="{
          playing: uuid === m.uuid,
        }"
        :title="`${m.name} - ${m.singer}`"
        @click="emit('change', m)"
      >
        <span>{{ m.name }}</span>
        <span style="margin: 0 0.2rem">-</span>
        <span class="o-p-8">{{ m.singer }}</span>
      </div>

      <div
        class="icon-box"
        v-if="uuid === m.uuid"
      >
        <PlayIcon
          class="icon-play-custom"
          :count="4"
          :play="status"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { MusicTrack } from "../../../utils/getMusics";
import PlayIcon from "./PlayIcon.vue";
import { Fn, useEventListener } from "@vueuse/core";

type Props = {
  musicList?: MusicTrack[];
  uuid?: MusicTrack["uuid"];
  status?: boolean;
  isTop?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  musicList: () => [],
  uuid: undefined,
  status: false,
  isTop: true,
});

const emit = defineEmits<{
  change: [music: MusicTrack];
}>();

const open = ref(false);

let cleanup: Fn | null = null;

watchEffect(() => {
  if (open.value) {
    cleanup = useEventListener(document, "click", () => {
      open.value = false;
    });
  } else {
    cleanup?.();
  }
});

defineExpose({
  toggle() {
    open.value = !open.value;
  },
});

const musicItemRef = ref<HTMLDivElement[]>();

watchEffect(() => {
  if (!open.value) return;
  if (!musicItemRef.value || musicItemRef.value.length === 0) return;

  const index = props.musicList.findIndex((i) => i.uuid === props.uuid);

  // 滚动元素的父容器, 使调用该方法的元素对用户可见
  musicItemRef.value[index]?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
});
</script>

<style scoped lang="less">
.music-list-container {
  width: 100%;
  max-height: 40vh;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.8);
  background-color: rgba(0, 0, 0, 0.5);
  padding: 0.75rem;
  border-radius: 0.75rem 0.75rem 0 0;
  border-radius: 0.75rem;
  position: absolute;
  z-index: calc(var(--z-i-top) + 1);
  transition: all 0.35s ease;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.75rem;

  &.top {
    bottom: 50px !important;
  }

  &.bottom {
    top: 50px !important;
  }

  .music-item {
    display: flex;
    justify-content: space-between;

    .basic-info {
      max-width: calc(100% - 1.5rem);
      overflow-x: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      color: var(--player-default-color);
    }

    .icon-box {
      width: 1.25rem;
      height: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;

      .icon-pause {
        width: 100%;
        height: 100%;
        margin: 0;
      }

      .icon-play-custom {
        transform: scale(0.2);
        transform-origin: center center;

        :deep(.item) {
          background-color: #31c37c;
        }
      }
    }
  }

  .o-p-8 {
    color: rgba(255, 255, 255, 0.5);
  }

  .playing {
    span {
      color: #31c37c;
      // color: var(--vp-c-brand-1);
    }
  }
}
</style>
