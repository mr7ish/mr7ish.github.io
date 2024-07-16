<template>
  <div class="music-player-container">
    <audio
      ref="audioRef"
      autoplay
      controls
    >
      <source
        :src="currentTrack.path"
        :type="`audio/${currentTrack.type}`"
      />
    </audio>

    <div class="player-wrapper">
      <div class="track-cover">
        <MusicCover
          size="100%"
          :path="currentTrack.cover"
        />
      </div>
      <div class="track-info">
        <span class="song-name">{{ currentTrack.name }}</span>
        <span>-</span>
        <span class="singer-name">{{ currentTrack.singer }}</span>
      </div>
      <PauseSvg
        v-if="!isPlay"
        class-name="icon-pause"
        @click="handleStatus(true)"
      />
      <PlaySvg
        v-else
        class-name="icon-play"
        @click="handleStatus(false)"
      />
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
import PauseSvg from "./components/PauseSvg.vue";
import PlaySvg from "./components/PlaySvg.vue";
import { getRangeRandom } from "../../utils/math";

const musics = getMusics();
const audioRef = ref<HTMLAudioElement>();
const duration = ref(0); // unit: s
const isPlay = ref(false);

console.log("music =>", musics);

const currentTrack = ref<MusicTrack>(
  musics[getRangeRandom(0, musics.length - 1)]
);

function handleStatus(status: boolean) {
  isPlay.value = status;

  if (status) {
    play();
  } else {
    pause();
  }
}

function controlVolume(ratio: number) {
  if (!audioRef.value) return;
  audioRef.value.volume = ratio;
}

function play() {
  audioRef.value?.play();
}

function pause() {
  audioRef.value?.pause();
}

const cleanup = useEventListener(audioRef, "loadedmetadata", () => {
  if (!audioRef.value) return;
  duration.value = +audioRef.value.duration.toFixed(0);
  console.log("audio =>", duration.value);
  controlVolume(0.2);
  audioRef.value;
});

onUnmounted(() => {
  cleanup();
});
</script>

<style scoped lang="less">
.music-player-container {
  --default-color: rgba(255, 255, 255, 0.8);

  min-width: 25vw;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 0 0.75rem 0.75rem 0;
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
      user-select: none;

      path {
        fill: var(--default-color);
      }
    }

    .icon-pause,
    .icon-play {
      margin: 0;
      margin-left: 1rem;
    }

    .icon-play {
      width: 1.2rem;
      height: 1.2rem;

      :deep(path) {
        fill: var(--vp-c-brand-1) !important;
      }
    }
  }

  audio {
    display: none;
  }
}

@media (max-width: 480px) {
  .music-player-container {
    transform: translateX(-50%) scale(0.8);
  }
}
</style>
