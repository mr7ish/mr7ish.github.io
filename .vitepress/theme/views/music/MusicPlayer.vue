<template>
  <div class="music-player-container">
    <audio
      ref="audioRef"
      autoplay
      muted
      controls
    >
      <source
        :src="currentTrack.path"
        :type="`audio/${currentTrack.type}`"
      />
    </audio>

    <div class="player-wrapper">
      <div class="track-cover">
        <MusicCover size="100%" />
      </div>
      <div class="track-info">
        <span class="song-name">{{ currentTrack.name }}</span>
        <span>-</span>
        <span class="singer-name">{{ currentTrack.singer }}</span>
      </div>
      <PlaySvg class-name="icon-play" />
      <ListSvg />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from "vue";
import getMusics, { MusicTrack } from "../../utils/getMusics";
import { useEventListener } from "@vueuse/core";
import MusicCover from "./components/MusicCover.vue";
import ListSvg from "./components/ListSvg.vue";
import PlaySvg from "./components/PlaySvg.vue";

const musics = getMusics();
const audioRef = ref<HTMLAudioElement>();
const duration = ref(0); // unit: s

console.log("music =>", musics);

const currentTrack = ref<MusicTrack>(musics[0]);

const cleanup = useEventListener(audioRef, "loadedmetadata", () => {
  if (!audioRef.value) return;
  duration.value = +audioRef.value.duration.toFixed(0);
  console.log("audio =>", duration.value);
});

onUnmounted(() => {
  cleanup();
});
</script>

<style scoped lang="less">
.music-player-container {
  --default-color: rgba(255, 255, 255, 0.8);

  transform: scale(0.5);
  min-width: 25vw;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 0 1rem 1rem 0;
  // border-radius: 1rem;
  overflow: hidden;

  .player-wrapper {
    height: 100%;
    display: flex;
    align-items: center;

    .track-cover {
      width: 50px;
      height: 100%;
    }

    .track-info {
      flex: 1;
      flex-shrink: 0;
      margin-left: 1rem;
      font-size: 0.8rem;
      display: flex;
      gap: 0.3rem;
      color: var(--default-color);
      // background-color: lightblue;

      overflow: hidden;
      white-space: nowrap;
    }

    :deep(.icon) {
      width: 1.25rem;
      height: 1.25rem;
      margin: 0 1rem;
      cursor: pointer;

      path {
        fill: var(--default-color);
      }
    }

    .icon-play {
      margin: 0;
      margin-left: 1rem;
    }
  }

  audio {
    display: none;
  }
}
</style>
