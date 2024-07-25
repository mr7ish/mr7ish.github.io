<template>
  <div
    :class="[
      'music-player-container',
      {
        hidden,
      },
    ]"
    ref="musicpPlayerRef"
    :style="style"
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

    <div class="player-wrapper">
      <div
        class="track-cover"
        @click="openPerfect"
      >
        <MusicCover
          size="100%"
          :path="cover"
          :isLoading="!canPlay"
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
        @click.stop="openMusicList"
      />
    </div>

    <MusicList
      ref="musicListRef"
      :musicList="musicList"
      :uuid="currentTrack.uuid"
      :status="isPlaying"
      :isTop="_y > musicListHeight"
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
    @mode-change="modeChange"
    @change-music-by-mode="changeMusicByMode"
  />
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import getMusics, { MusicTrack } from "../../utils/getMusics";
import { useDraggable, useEventListener } from "@vueuse/core";
import MusicCover from "./components/MusicCover.vue";
import ListSvg from "./components/ListSvg.vue";
import PauseSvg from "./components/PauseSvg.vue";
import { getRangeRandom } from "../../utils/math";
import PlayIcon from "./components/PlayIcon.vue";
import MusicList from "./components/MusicList.vue";
import PerfectPlayer, {
  ChangeMethod,
  Mode,
} from "./components/PerfectPlayer.vue";
import getPictures from "../../utils/getPictures";
import { shuffleArray } from "../../utils/shuffleArray";
import { deepClone } from "../../utils/deepClone";
import { notice } from "../../utils/notice";
import { getClientInfo } from "../../utils/picCalc";

const musicpPlayerRef = ref<HTMLDivElement>();

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
const mode = ref<Mode>("loop");

console.log("music =>", musics);
const musicList = ref<MusicTrack[]>(musics);

const lover = musicList.value.findIndex((i) => i.name === "Lover");

const currentTrack = ref<MusicTrack>(
  musicList.value[lover ?? getRangeRandom(0, musics.length - 1)]
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

watch(
  () => mode.value,
  (_mode) => {
    if (_mode === "random") {
      musicList.value = shuffleArray(deepClone(musics));
      return;
    }

    if (_mode === "loop") {
      musicList.value = musics;
    }
  }
);

function changeMusicByMode(method: ChangeMethod, auto: boolean) {
  stop();

  let index = musicList.value.findIndex(
    (i) => i.uuid === currentTrack.value.uuid
  );

  let oldIndex = index;

  if (method === "pre") {
    if (index <= 0) {
      index = musicList.value.length - 1;
    } else {
      index--;
    }
  } else {
    if (index === musicList.value.length - 1) {
      index = 0;
    } else {
      index++;
    }
  }

  currentTrack.value =
    musicList.value[mode.value === "singleLoop" && auto ? oldIndex : index];
  load();
}

function modeChange(_mode: Mode) {
  mode.value = _mode;
}

function progressChange(_currentTime: number) {
  currentTime.value = +_currentTime.toFixed(6);
  if (!audioRef.value) return;
  audioRef.value.currentTime = currentTime.value;
}

function generateCover() {
  return pictures[getRangeRandom(0, pictures.length)].path;
}

const cover = computed(() => currentTrack.value.cover ?? generateCover());

function openPerfect() {
  perfectPlayerRef.value?.open();
  hidden.value = true;
}

function openMusicList() {
  musicListRef.value?.toggle();
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
  volume.value = _volume;
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
    notice("sorry, it's not ready yet", "info");
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
  duration.value = 0;
  changeMusicByMode("next", true);
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

const { clientH } = getClientInfo();
const musicListHeight = clientH * 0.4;
const x = 20;
const y = clientH - 100;

const {
  style,
  x: _x,
  y: _y,
} = useDraggable(musicpPlayerRef, {
  initialValue: { x, y },
});
</script>

<style scoped lang="less">
.music-player-container {
  min-width: 25vw;
  height: 50px;
  position: fixed;
  z-index: var(--z-i-top);
  transition: transform 0.35s ease;

  &.hidden {
    transform: translateY(150vh);
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
      cursor: pointer;
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
        pointer-events: none;
      }
    }
  }

  audio {
    display: none;
  }
}

@media (max-width: 480px) {
  .music-player-container {
    max-width: 70vw;
  }
}
</style>
