<template>
  <MotionConfig
    :transition="{
      duration: 0.7,
      type: 'spring',
      bounce: 0.5,
    }"
  >
    <div class="todo-island-wrapper">
      <div>
        <motion.div
          layout
          :initial="{
            height,
            width: 0,
          }"
          :animate="{
            width: animateWidth,
            height: open ? 'auto' : height,
          }"
          class="motion-wrapper"
        >
          <div
            class="header"
            :style="{
              height: `${height}px`,
            }"
            @click="open = !open"
          >
            <template v-if="!isMini">
              <CircularProgressBar
                :current="progressValue"
                :showText="false"
              />
              <span>Todo Island</span>
              <NumberFlow
                :value="percentValue"
                :format="{ style: 'percent' }"
                locales="zh-CN"
              />
            </template>
            <IconTodo
              v-else
              :color="color"
            />
          </div>
          <motion.div class="main">
            <TodoPanel :open="open" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  </MotionConfig>
</template>

<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";
import { motion, MotionConfig } from "motion-v";
import { computed, onBeforeMount, onUnmounted, ref } from "vue";
import IconTodo from "../svgs/IconTodo.vue";
import { useData } from "vitepress";
import NumberFlow from "@number-flow/vue";
import CircularProgressBar from "../CircularProgressBar.vue";
import TodoPanel from "./TodoPanel.vue";
import { connectDB, disconnectDB, todoList } from "./utils/useTodoStorage";

type Props = {
  initWidth?: number;
  expandedWidth?: number;
  height?: number;
};

const props = withDefaults(defineProps<Props>(), {
  initWidth: 260,
  expandedWidth: 320,
  height: 44,
});

const { isDark } = useData();
const { width: windowWidth } = useWindowSize();

const showSidebarWidth = 960;
const open = ref(true);

const animateWidth = computed(() => {
  if (open.value) return props.expandedWidth;
  // if (windowWidth.value < showSidebarWidth) return props.height;
  return props.initWidth;
});

const isMini = computed(
  () => windowWidth.value < showSidebarWidth && !open.value
);
const color = computed(() => (!isDark.value ? "#fff" : "#27272a"));
const borderRadius = computed(() => `${props.height / 2}px`);

const progressValue = computed(() => {
  const totalTodoItem = todoList.value
    .filter((list) => !list.deleted)
    .map((list) => list.list)
    .flat();

  if(totalTodoItem.length === 0) return 0;
  return (
    +(
      totalTodoItem.filter((i) => i.completed).length / totalTodoItem.length
    ).toFixed(2) * 100
  );
});

const percentValue = computed(() => {
  if (isNaN(progressValue.value)) return 0;
  return progressValue.value / 100;
});

onBeforeMount(async () => {
  await connectDB();
});

onUnmounted(() => {
  disconnectDB();
});
</script>

<style scoped lang="less">
.todo-island-wrapper {
  position: fixed;
  top: 100px;
  left: 30px;
  z-index: var(--z-i-top);
  color: v-bind(color);

  .motion-wrapper {
    overflow: hidden;
    border-radius: v-bind(borderRadius);
    background-color: hsl(var(--todo-island-bg) / 0.9);
    backdrop-filter: blur(16px);
    // box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%),
    //   0 1px 5px 0 rgb(0 0 0 / 12%);
    // box-shadow: 0 15px 30px rgb(255 255 255 / 80%);
    // box-shadow: 0 15px 30px rgb(0 0 0 / 80%);
  }

  .header {
    display: flex;
    justify-content: space-around;
    align-items: center;
    cursor: pointer;
  }

  .main {
    max-height: 50vh;
    overflow-y: auto;
  }
}
</style>
