<template>
  <div
    :class="[
      'music-player-container',
      {
        hidden,
      },
    ]"
  >
    <audio
      ref="audioRef"
      controls
    >
      <source
        :src="currentTrack.path"
        :type="`audio/${currentTrack.type}`"
      />
    </audio>

    <div
      class="player-wrapper"
      @click="openPerfect"
    >
      <div class="track-cover">
        <MusicCover
          size="100%"
          :path="cover"
        />
      </div>
      <div class="track-info">
        <span class="song-name">{{ currentTrack.name }}</span>
        <span>-</span>
        <span class="singer-name">{{ currentTrack.singer }}</span>
      </div>
      <div
        class="icon-box"
        v-if="!isPlay"
      >
        <PauseSvg
          class-name="icon-pause"
          @click.stop="handleStatus(true)"
        />
      </div>

      <div
        class="icon-box"
        v-else
      >
        <PlayIcon
          class="icon-play-custom"
          @click.stop="handleStatus(false)"
        />
      </div>

      <ListSvg
        style="margin-right: 0.75rem"
        @click.stop="() => musicListRef?.toggle()"
      />
    </div>

    <MusicList
      ref="musicListRef"
      :musicList="musics"
      :uuid="currentTrack.uuid"
      :status="isPlay"
      @change="changeMusic"
    />
  </div>
  <PerfectPlayer
    ref="perfectPlayerRef"
    :currentTrack="currentTrack"
    :cover="cover"
    :status="isPlay"
    @after-close="hidden = false"
  />
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";
import getMusics, { MusicTrack } from "../../utils/getMusics";
import { useEventListener } from "@vueuse/core";
import MusicCover from "./components/MusicCover.vue";
import ListSvg from "./components/ListSvg.vue";
import PauseSvg from "./components/PauseSvg.vue";
import { getRangeRandom } from "../../utils/math";
import PlayIcon from "./components/PlayIcon.vue";
import MusicList from "./components/MusicList.vue";
import PerfectPlayer from "./components/PerfectPlayer.vue";
import getPictures from "../../utils/getPictures";

const musics = getMusics();
const { pictures } = getPictures();
const audioRef = ref<HTMLAudioElement>();
const musicListRef = ref<InstanceType<typeof MusicList>>();
const perfectPlayerRef = ref<InstanceType<typeof PerfectPlayer>>();
const duration = ref(0); // unit: s
const isPlay = ref(false);
const hidden = ref(false);

console.log("music =>", musics);

const currentTrack = ref<MusicTrack>(
  musics[getRangeRandom(0, musics.length - 1)]
);

function generateCover() {
  return pictures[getRangeRandom(0, pictures.length)].path;
}

const cover = computed(() => currentTrack.value.cover ?? generateCover());

function openPerfect() {
  perfectPlayerRef.value?.open();
  hidden.value = true;
}

function changeMusic(nextMusic: MusicTrack) {
  if (nextMusic.uuid !== currentTrack.value.uuid) {
    currentTrack.value = nextMusic;
    load();
    play();
  }
}

function handleStatus(status: boolean) {
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

// reload source
function load() {
  audioRef.value?.load();
}

function play() {
  if (audioRef.value?.play) {
    audioRef.value.play();
    isPlay.value = true;
  }
}

function pause() {
  if (audioRef.value?.pause) {
    audioRef.value.pause();
    isPlay.value = false;
  }
}

const loadedMetaDataCleanup = useEventListener(
  audioRef,
  "loadedmetadata",
  () => {
    if (!audioRef.value) return;
    duration.value = +audioRef.value.duration.toFixed(0);
    console.log("audio =>", duration.value);
    // controlVolume(0.2);
    // controlVolume(1);
    console.log(audioRef.value.volume);
  }
);

onUnmounted(() => {
  loadedMetaDataCleanup();
});
</script>

<style scoped lang="less">
.music-player-container {
  --player-default-color: rgba(255, 255, 255, 0.8);

  min-width: 25vw;
  height: 50px;
  position: fixed;
  bottom: 50px;
  left: 50%;
  z-index: var(--z-i-top);
  transform: translateX(-50%);
  transition: all 0.35s ease;

  &.hidden {
    bottom: -150vh;
  }

  .player-wrapper {
    height: 100%;
    border-radius: 0 0.75rem 0.75rem 0;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
    z-index: calc(var(--z-i-top) + 1);

    .track-cover {
      width: 50px;
      height: 100%;
    }

    .track-info {
      flex: 1;
      flex-shrink: 0;
      font-size: 0.8rem;
      display: flex;
      gap: 0.3rem;
      color: var(--player-default-color);
      white-space: nowrap;
      overflow-x: auto;
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

    :deep(.icon) {
      width: 1rem;
      height: 1rem;
      cursor: pointer;

      path {
        fill: var(--player-default-color);
      }
    }
  }

  audio {
    display: none;
  }
}

@media (max-width: 480px) {
  .music-player-container {
    // transform: translateX(-50%) scale(0.8);
    max-width: 70vw;
  }
}
</style>
