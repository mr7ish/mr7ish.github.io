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
        v-if="!isPlaying"
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
      :status="isPlaying"
      @change="changeMusic"
    />
  </div>

  <PerfectPlayer
    ref="perfectPlayerRef"
    :currentTrack="currentTrack"
    :cover="cover"
    :status="isPlaying"
    :duration="duration"
    :current-time="currentTime"
    :init-volume="volume"
    @after-close="hidden = false"
    @progress-change="progressChange"
    @handle-status="handleStatus"
    @volume-change="controlVolume"
  />
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
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
const currentTime = ref(0);
const isPlaying = ref(false);
const hidden = ref(false);
const canPlay = ref(false);
// played at least once
const isPlayedOnce = ref(false);
const volume = ref(0.1);

console.log("music =>", musics);

const currentTrack = ref<MusicTrack>(
  musics[getRangeRandom(0, musics.length - 1)]
);

watch(
  () => canPlay.value,
  (can) => {
    if (can) {
      if (isPlayedOnce.value) {
        play();
      }
    }
  }
);

function playNext() {
  currentTrack.value = chooseOne(currentTrack.value);
  load();
}

// promise not repeat
function chooseOne(current: MusicTrack) {
  const next = musics[getRangeRandom(0, musics.length - 1)];
  if (next.uuid === current.uuid) {
    return chooseOne(current);
  }
  return next;
}

function progressChange(_currentTime: number) {
  currentTime.value = _currentTime;
  if (!audioRef.value) return;
  audioRef.value.currentTime = _currentTime;
}

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
    stop();
    load();
  }
}

function handleStatus(status: boolean) {
  if (status) {
    play();
  } else {
    pause();
  }
}

function controlVolume(_volume: number) {
  if (!audioRef.value) return;
  audioRef.value.volume = _volume;
}

// reload source
function load() {
  audioRef.value?.load();
  canPlay.value = false;
}

function play() {
  if (!audioRef.value) return;
  if (!canPlay.value) {
    console.log("not loaded");
    return;
  }
  audioRef.value.play();
  isPlaying.value = true;
  if (!isPlayedOnce.value) {
    isPlayedOnce.value = true;
  }
}

function pause() {
  if (!audioRef.value) return;
  audioRef.value.pause();
  isPlaying.value = false;
}

function stop() {
  if (!audioRef.value) return;
  pause();
  audioRef.value.currentTime = 0;
  currentTime.value = 0;
}

const endedCleanup = useEventListener(audioRef, "ended", () => {
  console.log("music ended");
  if (!audioRef.value) return;
  stop();
  playNext();
});

const timeupdateCleanup = useEventListener(audioRef, "timeupdate", () => {
  if (!audioRef.value) return;
  currentTime.value = audioRef.value.currentTime;
});

const loadedMetaDataCleanup = useEventListener(
  audioRef,
  "loadedmetadata",
  () => {
    if (!audioRef.value) return;
    duration.value = +audioRef.value.duration.toFixed(0);
    canPlay.value = true;
    controlVolume(volume.value);
  }
);

onUnmounted(() => {
  loadedMetaDataCleanup();
  timeupdateCleanup();
  endedCleanup();
});
</script>

<style scoped lang="less">
.music-player-container {
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
