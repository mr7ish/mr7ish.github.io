<template>
  <div
    :class="[
      'perfect-player-container',
      {
        open: isOpen,
      },
    ]"
  >
    <div
      class="bg-mask"
      :style="{
        backgroundImage: `url(${cover})`,
      }"
    ></div>
    <div class="player-panel">
      <div
        class="close-btn"
        @click="close"
      >
        <ShrinkSvg class="shrink-icon" />
      </div>
      <div
        :class="[
          'music-cover',
          {
            rotate: isOpen && !resetRotate,
            running: status,
            paused: !status,
          },
        ]"
      >
        <MusicCover
          size="100%"
          radius="50%"
          :path="cover"
          :isLoading="duration <= 0"
        />
      </div>

      <div class="music-info">
        <span>{{ currentTrack.name }}</span>
        <span class="info-singer">{{ currentTrack.singer }}</span>
      </div>

      <div class="tool-bar">
        <div class="todo-bar"></div>
        <div class="progress-bar">
          <ProgressBar
            :total="duration"
            :current="currentTime"
            @progress-change="timeProgressChange"
          />
          <div class="time-line">
            <span>{{ startTime }}</span>
            <span> {{ endTime }}</span>
          </div>
        </div>
        <div class="setting-bar">
          <div class="left-setting flex-box">
            <div class="icon-box cursor-pointer">
              <LoopSvg
                class-name="icon-loop"
                v-if="mode === 'loop'"
                @click="mode = 'singleLoop'"
              />
              <SingleLoopSvg
                class-name="icon-single-loop"
                v-else-if="mode === 'singleLoop'"
                @click="mode = 'random'"
              />
              <RandomSvg
                class-name="icon-random"
                v-else
                @click="mode = 'loop'"
              />
            </div>
          </div>
          <div class="main-setting">
            <div class="icon-box">
              <NextSvg
                class-name="icon-pre"
                @click="changeMusic('pre')"
              />
            </div>
            <div
              class="icon-box"
              v-if="!status"
            >
              <PauseSvg
                class-name="icon-pause"
                @click="emit('handleStatus', true)"
              />
            </div>
            <div
              class="icon-box"
              v-else
            >
              <PlayIcon
                class="icon-play-custom"
                @click="emit('handleStatus', false)"
              />
            </div>
            <div class="icon-box">
              <NextSvg
                class-name="icon-next"
                @click="changeMusic('next')"
              />
            </div>
          </div>
          <div class="right-setting flex-box">
            <div class="icon-box">
              <DownloadSvg
                class-name="icon-download"
                @click="
                  download(
                    currentTrack.path,
                    `${currentTrack.name} - ${currentTrack.singer}`
                  )
                "
              />
            </div>
            <template v-if="!isMobile()">
              <div class="icon-box">
                <VolumeEnable
                  v-if="volume > 0"
                  class-name="icon-volume"
                  @click="toggleVolumeEnable(true)"
                />
                <VolumeDisable
                  v-else
                  class-name="icon-volume"
                  @click="toggleVolumeEnable(false)"
                />
              </div>
              <div class="volume-progress">
                <ProgressBar
                  :current="volume"
                  :total="volumeDuration"
                  @progress-change="volumeProgressChange"
                  :title="volume"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect } from "vue";
import { MusicTrack } from "../../../utils/getMusics";
import MusicCover from "./MusicCover.vue";
import ShrinkSvg from "./ShrinkSvg.vue";
import { transTime } from "../../../utils/transTime";
import { transNumber } from "../../../utils/transNumber";
import ProgressBar from "./ProgressBar.vue";
import PauseSvg from "./PauseSvg.vue";
import PlayIcon from "./PlayIcon.vue";
import NextSvg from "./NextSvg.vue";
import RandomSvg from "./RandomSvg.vue";
import LoopSvg from "./LoopSvg.vue";
import SingleLoopSvg from "./SingleLoopSvg.vue";
import VolumeEnable from "./VolumeEnable.vue";
import VolumeDisable from "./VolumeDisable.vue";
import { isMobile } from "../../../utils/isMobile";
import { download } from "../../../utils/download";
import DownloadSvg from "./DownloadSvg.vue";

type Props = {
  currentTrack: MusicTrack;
  cover: string;
  status?: boolean;
  duration?: number;
  currentTime?: number;
  initVolume?: number;
};

export type Mode = "random" | "loop" | "singleLoop";
export type ChangeMethod = "pre" | "next";

const props = withDefaults(defineProps<Props>(), {
  status: false,
  duration: 0,
  currentTime: 0,
  initVolume: 0,
});

const emit = defineEmits<{
  afterClose: [];
  progressChange: [curTime: number];
  handleStatus: [status: boolean];
  volumeChange: [volume: number];
  modeChange: [mode: Mode];
  changeMusicByMode: [method: ChangeMethod, auto: boolean];
}>();

const volumeDuration = 100;
const volume = ref(props.initVolume * volumeDuration);
const lastVolume = ref(volume.value);

const mode = ref<Mode>("loop");

const resetRotate = ref(false);

function changeMusic(method: ChangeMethod) {
  emit("changeMusicByMode", method, false);
  resetRotate.value = true;

  setTimeout(() => {
    resetRotate.value = false;
  }, 200);
}

watchEffect(() => {
  emit("modeChange", mode.value);
});

const startTime = computed(
  () =>
    `${transNumber(transTime(props.currentTime).minutes())}:${transNumber(
      transTime(Math.round(props.currentTime)).seconds()
    )}`
);

const endTime = computed(
  () =>
    `${transNumber(transTime(props.duration).minutes())}:${transNumber(
      transTime(props.duration).seconds()
    )}`
);

const isOpen = ref(false);

function toggleVolumeEnable(enable: boolean) {
  if (!enable) {
    volume.value = lastVolume.value;
  } else {
    volume.value = 0;
  }
  emit("volumeChange", volume.value / volumeDuration);
}

function volumeProgressChange(ratio: number) {
  volume.value = Math.floor(ratio * volumeDuration);
  lastVolume.value = volume.value;

  emit("volumeChange", volume.value / volumeDuration);
}

function timeProgressChange(ratio: number) {
  emit("progressChange", ratio * props.duration);
}

function open() {
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
  emit("afterClose");
}

defineExpose({
  open,
});
</script>

<style scoped lang="less">
.perfect-player-container {
  --m-t: 8rem;
  --p-l-h: 4px;
  --p-s: 3;
  --i-size: 3.5rem;
  --i-scale: 0.5;
  --i-bg-c: hsla(0, 0%, 100%, 0.9);

  width: 100vw;
  height: 100vh;
  padding: 0.75rem;
  border-radius: 0.75rem;
  position: fixed;
  z-index: var(--z-i-top);
  left: 0;
  bottom: -150vh;
  transition: all 0.35s ease;
  font-size: 1.15rem;

  &.open {
    bottom: 0;
  }

  .bg-mask {
    width: 100%;
    height: 100%;
    background-color: var(--default-color);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50%;
    filter: blur(50px);
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    user-select: none;
  }

  .player-panel {
    height: calc(100% - var(--m-t));
    padding-top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    top: var(--m-t);
    // background-color: lightcoral;

    .close-btn {
      position: absolute;
      top: -3.7rem;
      left: 1rem;
      width: 20px;
      height: 20px;
      cursor: pointer;
      user-select: none;

      .shrink-icon {
        width: 100%;
        height: 100%;
        transform: scale(-0.9);
        opacity: 0.8;

        :deep(path) {
          fill: var(--default-color);
        }
      }
    }

    .music-cover {
      width: 15vw;
      height: 15vw;
      border-radius: 50%;
      overflow: hidden;

      &.rotate {
        animation: rotate 30s linear infinite;
      }

      &.running {
        animation-play-state: running;
      }

      &.paused {
        animation-play-state: paused;
      }
    }

    .music-info {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: var(--default-color);

      .info-singer {
        font-size: 0.75rem;
        opacity: 0.5;
        letter-spacing: 0.1rem;
      }
    }

    .tool-bar {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;

      .todo-bar {
        flex: 5;
        // background-color: lightgoldenrodyellow;
      }

      .progress-bar {
        flex: 1;
        width: 90%;
        margin: auto;

        .time-line {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          opacity: 0.6;
        }
      }

      .setting-bar {
        flex: 2;
        width: 90%;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;

        .left-setting {
          justify-content: flex-end;
        }

        .right-setting {
          justify-content: flex-start;
          display: flex;

          .volume-progress {
            flex: 1;
          }
        }

        .flex-box {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .main-setting {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
        }

        .cursor-pointer {
          cursor: pointer;
        }

        .icon-box {
          width: var(--i-size);
          height: var(--i-size);
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
          // background-color: lightcoral;

          .icon-download {
            transform: scale(0.5);
          }

          .icon-volume {
            transform: scale(0.5);
          }

          .icon-single-loop {
            transform: scale(0.4);
          }

          .icon-loop {
            transform: scale(0.5);
          }

          .icon-random {
            transform: scale(0.4);
          }

          .icon-pre {
            transform: scale(-0.8);
          }

          .icon-next {
            transform: scale(0.8);
          }

          .icon-pause {
            width: 100%;
            height: 100%;
            margin: 0;
          }

          :deep(.icon) {
            width: 100%;
            height: 100%;

            path {
              fill: var(--i-bg-c);
              cursor: pointer;
            }
          }

          .icon-play-custom {
            transform: scale(var(--i-scale));
            transform-origin: center center;
            cursor: pointer;

            :deep(.item) {
              background-color: var(--i-bg-c);
            }
          }
        }
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// <=480
@media (max-width: 480px) {
  .perfect-player-container {
    --p-l-h: 2px;
    --p-s: 3;
    --i-size: 1.5rem;
    --i-scale: 0.2;
  }

  .player-panel {
    padding-top: 4rem !important;
  }

  .close-btn {
    top: 2rem !important;
  }

  .music-cover {
    width: 40vw !important;
    height: 40vw !important;
  }
}

// >=480 and <=992
@media (min-width: 480px) and (max-width: 992px) {
  .perfect-player-container {
    --p-l-h: 3px;
    --p-s: 3;
    --i-size: 2rem;
    --i-scale: 0.3;
  }

  .music-cover {
    width: 30vw !important;
    height: 30vw !important;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .perfect-player-container {
    --i-size: 3rem;
    --i-scale: 0.45;
  }

  .music-cover {
    width: 20vw !important;
    height: 20vw !important;
  }
}
</style>
