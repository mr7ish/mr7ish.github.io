<template>
  <motion.div
    class="todo-create-wrapper"
    :animate="{ y: `${y}vh` }"
    :transition="{ type: 'spring' }"
  >
    <div class="header">
      <span
        class="operation-label"
        @click="cancel"
      >
        cancel
      </span>
      <span class="title">{{ title }}</span>
      <span
        class="operation-label"
        :class="!inputValue ? 'disabled' : ''"
        @click="confirm"
      >
        confirm
      </span>
    </div>
    <div class="main">
      <VanishingInput
        ref="inputRef"
        style="transform: scale(0.8)"
        :placeholders="['Create Todo List', 'Input The List Name', '✨✨✨']"
        :showSubmitButton="false"
        v-model="inputValue"
        @submit="onSubmit"
      />
    </div>
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import { computed, shallowRef } from "vue";
import VanishingInput from "../VanishingInput.vue";
import useTodoStorage from "./hooks/useTodoStorage";

type Props = {
  type?: "list" | "item";
};

const props = withDefaults(defineProps<Props>(), {
  type: "list",
});

const { createTodoList, createTodoItem, removeTodoList } = useTodoStorage();

const title = computed(() =>
  props.type === "list" ? "Create List" : "Create Todo"
);
const open = defineModel("open", { default: false });
const y = computed(() => (open.value ? 0 : 100));
const inputRef = shallowRef<InstanceType<typeof VanishingInput>>();
const inputValue = shallowRef("");

function onSubmit(value: string) {
  console.log("onSubmit", value);

  if (props.type === "list") {
    createTodoList(value);
  }
}

function confirm() {
  if (!inputValue.value) return;
  inputRef.value?.handleSubmit();
}

function cancel() {
  open.value = false;
}
</script>

<style scoped lang="less">
.todo-create-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: hsl(var(--todo-island-bg) / 1);
  padding: 1rem;
  font-size: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;

    .title {
      font-size: 0.875rem;
    }

    .operation-label {
      color: #007aff;
      cursor: pointer;
    }

    .disabled {
      color: #8e8e93;
      cursor: not-allowed;
    }
  }

  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    // align-items: center;
  }
}
</style>
