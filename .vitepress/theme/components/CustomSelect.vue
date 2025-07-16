<template>
  <div
    class="custom-select-wrapper"
    @click="onClick"
    :style="{
      ...selectStyle,
      ...outmostCustomStyle,
    }"
  >
    <div class="text">
      {{ !value ? placeholder : valueToLabel ? label : value }}
    </div>
    <IconArrowDown
      v-if="!value"
      style="pointer-events: none"
    />
    <IconClose
      v-else
      @click.stop="value = undefined"
    />
  </div>

  <teleport to="body">
    <AnimatePresence :initial="false">
      <motion.div
        v-if="isVisible"
        ref="optionsWrapperRef"
        class="options-wrapper"
        :style="{
          top: `${y}px`,
          left: `${x}px`,
          width: `${optionsWidth}px`,
          ...optionsCustomStyle,
        }"
        :initial="{ opacity: 0, scale: 0 }"
        :animate="{ opacity: 1, scale: 1 }"
        :exit="{ opacity: 0, scale: 0 }"
      >
        <template v-if="options && options.length > 0">
          <div
            v-for="(option, i) in options"
            :key="i"
            class="option-item enabled"
            @click="onSelect(option)"
          >
            <span>{{ option.label }}</span>
            <slot
              name="operates"
              :option="option"
            />
          </div>
        </template>
        <template v-else>
          <div class="option-item disabled">
            {{ noOptionsTip }}
          </div>
        </template>
      </motion.div>
    </AnimatePresence>
  </teleport>
</template>

<script setup lang="ts">
import {
  computed,
  CSSProperties,
  onUnmounted,
  shallowRef,
  useTemplateRef,
} from "vue";
import IconArrowDown from "./svgs/IconArrowDown.vue";
import { AnimatePresence, motion } from "motion-v";
import IconClose from "./svgs/IconClose.vue";
import { onClickOutside } from "@vueuse/core";
import { useData } from "vitepress";

export type Option = {
  value: string;
  label: string;
};

type Props = {
  noBorder?: boolean;
  ellipsis?: boolean;
  elipsisWidth?: number;
  options?: Option[];
  value?: Option["value"];
  placeholder?: string;
  noOptionsTip?: string;
  optionsWidth?: number;
  valueToLabel?: boolean;
  outmostCustomStyle?: CSSProperties;
  optionsCustomStyle?: CSSProperties;
};

const props = withDefaults(defineProps<Props>(), {
  noBorder: true,
  ellipsis: true,
  elipsisWidth: 90,
  options: () => [
    { label: "option 1", value: "option 1" },
    { label: "option 2", value: "option 2" },
    { label: "option 3", value: "option 3" },
  ],
  placeholder: "select...",
  noOptionsTip: "No options",
  optionsWidth: 200,
  valueToLabel: false,
  outmostCustomStyle: () => ({}),
  optionsCustomStyle: () => ({}),
});

const selectStyle = computed<CSSProperties>(() => {
  if (props.noBorder) {
    return {
      border: "none",
      padding: "0",
      height: "auto",
      borderRadius: "none",
      background: "none",
    };
  }
  return {};
});

const width = computed(() =>
  props.ellipsis ? `${props.elipsisWidth}px` : "auto"
);

const { isDark } = useData();

const bgColor = computed(() =>
  isDark.value ? "#0e1616" : "rgb(255 255 255 / var(--tw-bg-opacity, 1))"
);

const x = shallowRef(0);
const y = shallowRef(0);
const isVisible = shallowRef(false);
const value = defineModel<Option["value"]>();
const label = shallowRef("");
const optionsWrapperRef = useTemplateRef("optionsWrapperRef");

onClickOutside(optionsWrapperRef, () => close());

function onClick(e: Event) {
  const el = e.target as HTMLElement;
  const { x: _x, y: _y, height } = el.getBoundingClientRect();

  x.value = Math.ceil(_x);
  y.value = Math.ceil(_y + height + 10);

  isVisible.value = !isVisible.value;
}

function onSelect(option: Option) {
  // if (props.valueToLabel) {
  //   value.value = option.label;
  // } else {
  //   value.value = option.value;
  // }
  value.value = option.value;
  label.value = option.label;
  isVisible.value = false;
}

function close() {
  if (isVisible.value) {
    isVisible.value = false;
  }
}

onUnmounted(() => {
  close();
});
</script>

<style scoped lang="less">
.custom-select-wrapper {
  width: v-bind(width);
  height: 35px;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  border-radius: 5px;
  border: 1px solid #1d2628;
  background-color: v-bind(bgColor);
  padding: 0 10px;
  cursor: pointer;

  .text {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}

.options-wrapper {
  max-height: 30vh;
  overflow-y: auto;
  position: fixed;
  z-index: var(--z-i-top);
  padding: 5px;
  border-radius: 8px;
  background-color: #0e1616;
  border: 1px solid #1d2628;
  cursor: pointer;
  color: #fff;

  .option-item {
    padding: 0 15px;
    border-radius: 3px;
    user-select: none;
    background-color: #0e1616;
    transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    justify-content: space-between;
    align-items: center;

    &.disabled {
      color: #999;
      cursor: not-allowed;
    }

    &.enabled:hover {
      // background-color: #9911ff;
      background-color: #007aff;
    }
  }
}
</style>
