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
            rotate: isOpen,
            running: status,
            paused: !status,
          },
        ]"
      >
        <MusicCover
          size="100%"
          radius="50%"
          :path="cover"
        />
      </div>

      <div class="music-info">
        <span>{{ currentTrack.name }}</span>
        <span class="info-singer">{{ currentTrack.singer }}</span>
      </div>

      <div class="tool-bar">
        <div class="todo-bar"></div>
        <div class="progress-bar">
          <!-- <div
            class="progress-bg"
            @click.self="clickProgress"
            ref="progressBgRef"
          >
            <div
              :class="[
                'progress-line',
                {
                  disabled: disabledPointer,
                },
              ]"
              :style="{
                width: progressLineWidth,
              }"
              @mousedown.self="updatePointEvents"
            >
              <div
                class="point"
                ref="pointRef"
                @mousedown.self="onMousedown"
              ></div>
            </div>
          </div> -->
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
            <div
              class="icon-box cursor-pointer"
              @click="modeIdx++"
            >
              <RandomSvg
                class-name="icon-random"
                v-if="modeList[modeIdx % modeList.length] === 'random'"
              />
              <LoopSvg
                class-name="icon-loop"
                v-else-if="modeList[modeIdx % modeList.length] === 'loop'"
              />
              <SingleLoopSvg
                class-name="icon-single-loop"
                v-else
              />
            </div>
          </div>
          <div class="main-setting">
            <div class="icon-box">
              <NextSvg class-name="icon-pre" />
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
              <NextSvg class-name="icon-next" />
            </div>
          </div>
          <div class="right-setting flex-box">
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
import { computed, ref, watch } from "vue";
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

type Props = {
  currentTrack: MusicTrack;
  cover: string;
  status?: boolean;
  duration?: number;
  currentTime?: number;
  initVolume?: number;
};

type Mode = "random" | "loop" | "singleLoop";

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
}>();

const volumeDuration = 100;
const volume = ref(props.initVolume * volumeDuration);
const lastVolume = ref(volume.value);

const modeIdx = ref(0);
const modeList: Mode[] = ["random", "loop", "singleLoop"];

const pointRef = ref<HTMLDivElement>();
const disabledPointer = ref(false);

// drag vars
const isDragging = ref(false);
const startX = ref(0);
const progressBgRef = ref<HTMLDivElement>();

const progressLineWidth = computed(() => {
  if (props.duration === 0) return "0%";
  const w = `${((props.currentTime / props.duration) * 100).toFixed(2)}%`;
  return w;
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
  // console.log("ratio =>", ratio);
  volume.value = Math.floor(ratio * volumeDuration);
  lastVolume.value = volume.value;

  emit("volumeChange", volume.value / volumeDuration);
}

function timeProgressChange(ratio: number) {
  emit("progressChange", ratio * props.duration);
}

function onMousedown(e: Event) {
  isDragging.value = true;
  const { clientX } = e as MouseEvent;
  const { offsetLeft } = e.target as HTMLDivElement;
  startX.value = clientX - offsetLeft;
  document.addEventListener("mousemove", moveProgress);
  document.addEventListener("mouseup", onMouseup);
}

function onMouseup() {
  isDragging.value = false;
  document.removeEventListener("mousemove", moveProgress);
  document.removeEventListener("mouseup", onMouseup);
}

function moveProgress(e: Event) {
  if (!isDragging.value) return;

  const { clientX } = e as MouseEvent;
  let x = clientX - startX.value;

  if (progressBgRef.value) {
    const progressBgWidth = progressBgRef.value.getBoundingClientRect().width;

    if (x < 0) {
      x = 0;
    } else if (x > progressBgWidth) {
      x = progressBgWidth;
    }

    const _currentTime = (x / progressBgWidth) * props.duration;
    emit("progressChange", _currentTime);
  }
}

function updatePointEvents() {
  disabledPointer.value = true;
}

function clickProgress(e: Event) {
  const { offsetX } = e as PointerEvent;
  const { offsetWidth } = e.target as HTMLDivElement;
  const _currentTime = (offsetX / offsetWidth) * props.duration;
  emit("progressChange", _currentTime);

  if (disabledPointer.value) {
    disabledPointer.value = false;
  }
}

watch(
  () => isOpen.value,
  (val) => {
    document.documentElement.style.overflowY = val ? "hidden" : "auto";
  }
);

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
          fill: #fff;
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
      // background-color: lightblue;
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
        // background-color: lightcoral;

        .progress-bg {
          width: 100%;
          height: var(--p-l-h);
          border-radius: calc(var(--p-l-h) / 2);
          background-color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          user-select: none;

          .progress-line {
            width: 0;
            height: 100%;
            border-radius: calc(var(--p-l-h) / 2);
            // background-color: rgba(0, 0, 0, 0.3);
            background-color: lightcoral;
            background-color: hsla(0, 0%, 100%, 0.7);
            position: relative;
            // pointer-events: none;
            &.disabled {
              pointer-events: none;
            }

            .point {
              width: calc(var(--p-l-h) * var(--p-s));
              height: calc(var(--p-l-h) * var(--p-s));
              background-color: #fff;
              opacity: 0.9;
              position: absolute;
              border-radius: 50%;
              top: 50%;
              right: 0;
              transform: translate(50%, -50%);
            }
          }
        }

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
        // background-color: lightsalmon;
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
            // width: 50%;
            flex: 1;
          }
        }

        .flex-box {
          display: flex;
          align-items: center;
          flex: 1;
          // background-color: lightblue;
        }

        .main-setting {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          // background-color: lightblue;
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
    left: 2rem !important;
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
