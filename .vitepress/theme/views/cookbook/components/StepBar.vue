<template>
  <div class="step-bar-wrapper">
    <div
      class="step-item"
      :class="`step-item-${indicator}`"
      v-for="(step, i) in steps"
      :key="i"
      :style="{
        borderLeft:
          i === steps.length - 1
            ? 'none'
            : `${borderWidth}px solid ${primaryColor}`,
        paddingBottom: i === steps.length - 1 ? '0' : `${gap}px`,
        marginBottom: i === steps.length - 1 ? '0' : `20px`,
      }"
    >
      <div class="content">
        <div
          class="title"
          :style="{
            color: titleColor,
          }"
        >
          {{ step.title }}
        </div>
        <div
          v-if="step.desc"
          class="desc"
          :style="{
            color: descColor,
          }"
        >
          {{ step.desc }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type Props = {
  steps?: {
    title: string;
    desc?: string;
  }[];
  borderWidth?: number;
  primaryColor?: string;
  indicator?: "dot" | "number";
  titleColor?: string;
  descColor?: string;
  gap?: number;
};

const props = withDefaults(defineProps<Props>(), {
  borderWidth: 2,
  primaryColor: "#1668dc",
  gap: 20,
  indicator: "number",
  steps: () => [
    {
      title: "步骤1",
      desc: "步骤1的描述",
    },
    {
      title: "步骤2",
      desc: "步骤2的描述",
    },
    {
      title: "步骤3",
      desc: "步骤3的描述",
    },
    {
      title: "步骤4",
      desc: "步骤4的描述",
    },
    {
      title: "步骤5",
      desc: "步骤5的描述",
    },
  ],
  titleColor: "var(--default-color)",
  descColor: "var(--default-color)",
});

const bgColor = computed(() => props.primaryColor);
</script>

<style scoped lang="less">
.step-bar-wrapper {
  counter-reset: step-counter;
  padding: 20px;

  .step-item-dot {
    &::before {
      content: "";
      display: block;
      width: 10px;
      height: 10px;
      background-color: v-bind(bgColor);
      border-radius: 50%;
      position: absolute;
      left: 0;
      top: 0;
      transform: translate(-50%, -50%);
    }
  }

  .step-item-number {
    &::before {
      content: counter(step-counter);
      display: block;
      width: 32px;
      height: 32px;
      background-color: v-bind(bgColor);
      border-radius: 50%;
      position: absolute;
      left: 0;
      top: 0;
      transform: translate(-50%, -50%);
      text-align: center;
      line-height: 32px;
      color: #fff;
    }
  }

  .step-item {
    position: relative;
    color: #fff;
    padding-left: 16px;
    counter-increment: step-counter;

    .content {
      transform: translateY(-12px);
      padding-left: 10px;

      .title {
        font-size: 16px;
        font-weight: bold;
      }

      .desc {
        font-size: 12px;
        opacity: 0.7;
      }

      &:hover .title,
      &:hover .desc {
        color: v-bind(bgColor) !important;
      }
    }
  }
}
</style>
