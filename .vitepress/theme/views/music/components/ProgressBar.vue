<template>
  <div
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

type Props = {
  total?: number;
  current?: number;
};

const props = withDefaults(defineProps<Props>(), {
  total: 0,
  current: 0,
});

const emit = defineEmits<{
  progressChange: [ratio: number];
}>();

const progressLineWidth = computed(() => {
  if (props.total === 0) return "0%";
  const w = `${((props.current / props.total) * 100).toFixed(2)}%`;
  return w;
});

const pointRef = ref<HTMLDivElement>();
const disabledPointer = ref(false);

// drag vars
const isDragging = ref(false);
const startX = ref(0);
const progressBgRef = ref<HTMLDivElement>();

function clickProgress(e: Event) {
  const { offsetX } = e as PointerEvent;
  const { offsetWidth } = e.target as HTMLDivElement;

  const ratio = offsetX / offsetWidth;
  emit("progressChange", ratio);

  if (disabledPointer.value) {
    disabledPointer.value = false;
  }

  // console.log("ratio =>", ratio);
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

    const ratio = x / progressBgWidth;
    emit("progressChange", ratio);
    // console.log("ratio =>", ratio);
  }
}

function updatePointEvents() {
  disabledPointer.value = true;
}
</script>

<style scoped lang="less">
.progress-bg {
  --p-l-h: 4px;
  --p-s: 3;

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
    background-color: hsla(0, 0%, 100%, 0.7);
    position: relative;

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

// <=480
@media (max-width: 480px) {
  .progress-bg {
    --p-l-h: 2px;
    --p-s: 3;
  }
}

// >=480 and <=992
@media (min-width: 480px) and (max-width: 992px) {
  .progress-bg {
    --p-l-h: 3px;
    --p-s: 3;
  }
}
</style>
