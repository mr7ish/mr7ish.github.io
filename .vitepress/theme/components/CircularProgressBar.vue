<template>
  <div
    class="circle-progress"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <svg
      class="svg-wrapper"
      viewbox="0 0 100 100"
    >
      <!-- 背景轨道 -->
      <circle
        class="track"
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke="trackColor"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />

      <!-- 进度条 -->
      <circle
        class="progress"
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke="progressColor"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset"
        :transform="`rotate(-90, ${center}, ${center})`"
      />

      <text
        v-if="showText"
        class="progress-text"
        :x="center"
        :y="center"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        {{ displayText }}
      </text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type Props = {
  current?: number; // 当前完成数
  total?: number; // 总数
  size?: number; // 尺寸（像素）
  strokeWidth?: number; // 线条宽度（像素）
  progressColor?: string; // 进度条颜色
  trackColor?: string; // 轨道颜色
  showText?: boolean; // 是否显示文字
  showPercentage?: boolean; // 是否显示百分比
};

const props = withDefaults(defineProps<Props>(), {
  current: 0,
  total: 100,
  size: 24,
  strokeWidth: 3,
  progressColor: "#42b883",
  trackColor: "#6b728099",
  showText: true,
  showPercentage: true,
});

// 计算中心点坐标
const center = computed(() => props.size / 2);

// 计算半径
const radius = computed(() => props.size / 2 - props.strokeWidth / 2);

// 计算周长（用于 stroke-dasharray）
const circumference = computed(() => 2 * Math.PI * radius.value);

// 计算进度百分比（0-1）
const progress = computed(() => {
  const p = props.current / props.total;
  return Math.min(Math.max(p, 0), 1); // 限制在 0-1 之间
});

// 计算虚线数组（进度）
const dashArray = computed(() => circumference.value);

// 计算虚线偏移量
const dashOffset = computed(() => circumference.value * (1 - progress.value));

// 显示文本
const displayText = computed(() => {
  if (!props.showText) return "";
  if (props.showPercentage) {
    return `${Math.round(progress.value * 100)}%`;
  }
  return `${props.current}/${props.total}`;
});
</script>

<style scoped lang="less">
.svg-wrapper {
  width: 100%;
  height: 100%;
}

.circle-progress {
  font-family: Arial, sans-serif;
}

.progress {
  transition: stroke-dashoffset 0.5s ease-out;
}

.progress-text {
  font-size: 10px;
  font-weight: bold;
  fill: #333;
}
</style>
