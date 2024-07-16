<template>
  <div
    :class="[
      'music-list-container',
      {
        open,
      },
    ]"
  >
    <div
      class="music-item"
      v-for="(m, i) in musicList"
      :key="i"
    >
      <div
        class="basic-info"
        :class="{
          playing: playingKey === m.name,
        }"
      >
        <span>{{ m.name }}</span>
        <span>-</span>
        <span class="o-p-8">{{ m.singer }}</span>
      </div>

      <div
        class="icon-box"
        v-if="playingKey === m.name"
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
import { ref } from "vue";
import { MusicTrack } from "../../../utils/getMusics";
import PlayIcon from "./PlayIcon.vue";

type Props = {
  musicList?: MusicTrack[];
  playingKey?: MusicTrack["name"];
  status?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  musicList: () => [],
  playingKey: undefined,
  status: false,
});

const open = ref(false);

defineExpose({
  toggle() {
    open.value = !open.value;
  },
});
</script>

<style scoped lang="less">
.music-list-container {
  width: 100%;
  position: relative;
  z-index: var(--z-i-top);
  background-color: rgba(0, 0, 0, 0.8);
  background-color: rgba(0, 0, 0, 0.58);
  // background-color: lightblue;
  padding: 0.75rem;
  border-radius: 0.75rem 0.75rem 0 0;
  border-radius: 0.75rem;
  position: absolute;
  bottom: -100vh;
  transition: all 0.35s ease;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.75rem;

  &.open {
    bottom: 50px;
  }

  .music-item {
    display: flex;
    justify-content: space-between;

    .basic-info {
      display: flex;
      gap: 0.2rem;
    }

    .icon-box {
      width: 1.25rem;
      height: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
      // background-color: lightcoral;

      .icon-pause {
        width: 100%;
        height: 100%;
        margin: 0;
      }

      .icon-play-custom {
        transform: scale(0.2);
        transform-origin: center center;
        cursor: pointer;
      }
    }
  }

  .o-p-8 {
    color: rgba(255, 255, 255, 0.5);
  }

  .playing {
    span {
      color: #31c37c;
      color: var(--vp-c-brand-1);
    }
  }
}
</style>
