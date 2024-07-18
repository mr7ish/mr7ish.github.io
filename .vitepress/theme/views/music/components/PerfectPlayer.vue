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
          <div class="progress-bg">
            <div class="progress-line forward">
              <div class="point"></div>
            </div>
          </div>
          <div class="time-line">
            <span>00:00</span>
            <span> {{ endTime }}</span>
          </div>
        </div>
        <div class="setting-bar"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { MusicTrack } from "../../../utils/getMusics";
import MusicCover from "./MusicCover.vue";
import ShrinkSvg from "./ShrinkSvg.vue";
import { transTime } from "../../../utils/transTime";
import { transNumber } from "../../../utils/transNumber";

type Props = {
  currentTrack: MusicTrack;
  cover: string;
  status?: boolean;
  duration?: number;
};

const props = withDefaults(defineProps<Props>(), {
  uuid: undefined,
  status: false,
  duration: 0,
});

const endTime = computed(
  () =>
    `${transNumber(transTime(props.duration).minutes())}:${transNumber(
      transTime(props.duration).seconds()
    )}`
);

const emit = defineEmits<{
  afterClose: [];
}>();

const isOpen = ref(false);

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
  --p-l-h: 2px;
  --p-s: 5;

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
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    top: var(--m-t);
    // background-color: lightcoral;

    .close-btn {
      position: absolute;
      top: -3.7rem;
      left: 0;
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
          // overflow: hidden;

          .progress-line {
            width: 0;
            height: 100%;
            border-radius: calc(var(--p-l-h) / 2);
            // background-color: rgba(0, 0, 0, 0.3);
            background-color: lightcoral;
            position: relative;

            &.forward {
              animation: forward 20s linear both;
            }

            .point {
              width: calc(var(--p-l-h) * var(--p-s));
              height: calc(var(--p-l-h) * var(--p-s));
              background-color: #fff;
              opacity: 0.2;
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
        // background-color: lightsalmon;
      }
    }
  }
}

@keyframes forward {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
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
  .music-cover {
    width: 40vw !important;
    height: 40vw !important;
  }
}

// >=480 and <=992
@media (min-width: 480px) and (max-width: 992px) {
  .music-cover {
    width: 30vw !important;
    height: 30vw !important;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .music-cover {
    width: 20vw !important;
    height: 20vw !important;
  }
}
</style>
